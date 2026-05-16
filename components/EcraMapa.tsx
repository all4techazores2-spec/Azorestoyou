import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PontoRota, PontoInteresse, DetalheTrilhoAvancado } from '../data/dadosTrilhos';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let IconePadrao = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = IconePadrao;

// Ícones customizados para POIs com cores específicas
const createPoisIcon = (tipo: string) => {
  let color = '#3182ce'; // azul padrão
  if (tipo === 'miradouro') color = '#3182ce'; // Azul para miradouros
  if (tipo === 'monumento') color = '#48bb78'; // Verde para monumentos
  if (tipo === 'perigo') color = '#e53e3e';    // Vermelho para perigos
  if (tipo === 'cascata') color = '#00b5ad';   // Ciano para cascatas

  const emoji = tipo === 'miradouro' ? '🔭' : tipo === 'cascata' ? '💧' : tipo === 'monumento' ? '🏛️' : '⚠️';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; transition: all 0.3s transform: scale(1.1);">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

interface EcraMapaProps {
  dadosTrilho: DetalheTrilhoAvancado;
  aoVoltar: () => void;
}

const CentrarMapa: React.FC<{ posicao: [number, number] }> = ({ posicao }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(posicao, map.getZoom());
  }, [posicao, map]);
  return null;
};

export const EcraMapa: React.FC<EcraMapaProps> = ({ dadosTrilho, aoVoltar }) => {
  const { rota, pontosInteresse, climaSimulado } = dadosTrilho;
  const [pontosPercorridos, setPontosPercorridos] = useState<PontoRota[]>([]);
  const [indexAtual, setIndexAtual] = useState<number>(0);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState<boolean>(false);
  const [instrucao, setInstrucao] = useState<string>("Clica em START para iniciar o trilho");
  const [poiAtivo, setPoiAtivo] = useState<PontoInteresse | null>(null);
  const [notificacoesLidas, setNotificacoesLidas] = useState<Set<string>>(new Set());

  // Função para a App FALAR com o utilizador
  const falarInstrucao = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const mensagem = new SpeechSynthesisUtterance(texto);
      mensagem.lang = 'pt-PT';
      mensagem.rate = 1.0;
      window.speechSynthesis.speak(mensagem);
    }
  };

  // 1. Alerta de Clima Imediato ao Abrir
  useEffect(() => {
    if (climaSimulado.alerta) {
      setTimeout(() => {
        falarInstrucao(`Aviso Importante de Segurança: ${climaSimulado.alerta}. Condição atual: ${climaSimulado.condicao} com ${climaSimulado.temperatura} graus.`);
      }, 1000);
    }
  }, []);

  // Cálculo de distância entre dois pontos (Haversine)
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    if (!simulacaoAtiva || rota.length === 0) return;

    const temporizador = setInterval(() => {
      if (indexAtual < rota.length) {
        const proximoPonto = rota[indexAtual];
        setPontosPercorridos((prev) => [...prev, proximoPonto]);
        
        if (proximoPonto.indicacao) {
          setInstrucao(proximoPonto.indicacao);
          falarInstrucao(proximoPonto.indicacao);
        }

        // Verificar proximidade de POIs
        pontosInteresse.forEach(poi => {
          const dist = calcularDistancia(proximoPonto.lat, proximoPonto.lng, poi.lat, poi.lng);
          
          // Lógica de Proximidade (< 50m)
          if (dist < 50 && !notificacoesLidas.has(poi.id || poi.nome)) {
            setSimulacaoAtiva(false); // Pausa a simulação
            setPoiAtivo(poi);
            setNotificacoesLidas(prev => new Set(prev).add(poi.id || poi.nome));
            
            // Voz: Aproximação a [Nome]. [Descrição]
            falarInstrucao(`Aproximação a: ${poi.nome}. ${poi.descricao}`);

            // Fechar modal e retomar automaticamente após 4 segundos
            setTimeout(() => {
              setPoiAtivo(null);
              setSimulacaoAtiva(true);
            }, 4000);
          }
        });
        
        setIndexAtual((prev) => prev + 1);
      } else {
        clearInterval(temporizador);
        setSimulacaoAtiva(false);
        const fimFesta = "Trilho Concluído com sucesso! Parabéns pela caminhada!";
        setInstrucao(fimFesta);
        falarInstrucao(fimFesta);
      }
    }, 1200);

    return () => clearInterval(temporizador);
  }, [simulacaoAtiva, indexAtual, rota, pontosInteresse, notificacoesLidas]);

  const posicaoCaminhante = pontosPercorridos[pontosPercorridos.length - 1] || rota[0];

  const iniciarTrilho = () => {
    setPontosPercorridos([]);
    setIndexAtual(0);
    setNotificacoesLidas(new Set());
    const textoInicio = rota[0].indicacao || "Trilho Iniciado! Siga o caminho desenhado.";
    setInstrucao(textoInicio);
    falarInstrucao(textoInicio);
    
    // Alerta de clima ao iniciar
    if (climaSimulado.alerta) {
      setTimeout(() => falarInstrucao(`Aviso de Clima: ${climaSimulado.alerta}`), 3000);
    }
    
    setSimulacaoAtiva(true);
  };

  const maxAltitude = Math.max(...rota.map(p => p.altitude), 1);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', overflow: 'hidden' }}>
      
      {/* BOTÃO VOLTAR */}
      <button onClick={aoVoltar} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1100, background: '#fff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>
        ←
      </button>

      {/* ALERTA DE CLIMA SUPERIOR */}
      <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '85%', maxWidth: '400px', backgroundColor: climaSimulado.alerta ? '#fff5f5' : '#ebf8ff', border: `1px solid ${climaSimulado.alerta ? '#feb2b2' : '#bee3f8'}`, padding: '10px 15px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 1050, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{climaSimulado.condicao.includes('Chuva') ? '🌧️' : climaSimulado.condicao.includes('Nevoeiro') ? '🌫️' : '☀️'}</span>
        <div>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 'black', color: '#2d3748', textTransform: 'uppercase' }}>Clima: {climaSimulado.condicao} ({climaSimulado.temperatura}ºC)</p>
          {climaSimulado.alerta && <p style={{ margin: 0, fontSize: '10px', color: '#c53030', fontWeight: 'bold' }}>⚠️ {climaSimulado.alerta}</p>}
        </div>
      </div>

      {/* PAINEL GPS SUPERIOR */}
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '85%', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '15px', borderRadius: '16px', boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🔊</span>
          <span style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '15px' }}>{instrucao}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '5px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', color: '#4a5568' }}>
          <span>📈 Altitude: <strong>{posicaoCaminhante.altitude}m</strong></span>
          <span>Progresso: <strong>{((indexAtual / rota.length) * 100).toFixed(0)}%</strong></span>
        </div>
      </div>

      {/* POP-UP DE POI DINÂMICO */}
      {poiAtivo && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
           <div style={{ backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', width: '100%', maxWidth: '380px', margin: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              <div style={{ height: '240px', width: '100%', position: 'relative', backgroundColor: '#f8fafc' }}>
                {poiAtivo.foto ? (
                  <img 
                    src={poiAtivo.foto} 
                    alt={poiAtivo.nome} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; // Fallback nature photo
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    <ImageIcon size={64} />
                    <p style={{ margin: '10px 0 0 0', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sem foto disponível</p>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: '12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#1e293b', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Ponto de Interesse</div>
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{poiAtivo.nome}</h3>
                <p style={{ margin: '0 0 24px 0', fontSize: '15px', color: '#475569', lineHeight: '1.6', fontWeight: 500 }}>{poiAtivo.descricao}</p>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ height: '100%', backgroundColor: '#3b82f6', animation: 'timer 4s linear' }} />
                </div>
                <p style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', marginTop: '12px', fontWeight: 700, textTransform: 'uppercase' }}>A retomar simulação automaticamente...</p>
              </div>
           </div>
           <style>{`
             @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
             @keyframes timer { from { width: 100%; } to { width: 0%; } }
           `}</style>
        </div>
      )}

      {/* MAPA */}
      <MapContainer center={[rota[0].lat, rota[0].lng]} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        {simulacaoAtiva && <CentrarMapa posicao={[posicaoCaminhante.lat, posicaoCaminhante.lng]} />}
        
        {/* Rota Total */}
        <Polyline positions={rota.map(p => [p.lat, p.lng])} color="#718096" weight={4} opacity={0.4} />
        
        {/* Rota Percorrida */}
        {pontosPercorridos.length > 1 && <Polyline positions={pontosPercorridos.map(p => [p.lat, p.lng])} color="#48bb78" weight={6} />}
        
        {/* Marcadores de POIs */}
        {pontosInteresse.map((poi, idx) => (
          <Marker key={idx} position={[poi.lat, poi.lng]} icon={createPoisIcon(poi.tipo)}>
            <Popup>
              <div style={{ width: '150px' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold' }}>{poi.nome}</h4>
                <p style={{ margin: 0, fontSize: '10px' }}>{poi.descricao}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marcador do Caminhante */}
        <Marker position={[posicaoCaminhante.lat, posicaoCaminhante.lng]} />
      </MapContainer>

      {/* BOTÃO START */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        {!simulacaoAtiva && indexAtual === 0 ? (
          <button onClick={iniciarTrilho} style={{ padding: '16px 45px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', color: '#fff', backgroundColor: '#48bb78', border: 'none', borderRadius: '30px', boxShadow: '0 6px 20px rgba(72,187,120,0.4)', cursor: 'pointer' }}>
            🚀 START
          </button>
        ) : (
          <button onClick={() => setSimulacaoAtiva(!simulacaoAtiva)} style={{ padding: '14px 35px', fontSize: '16px', fontWeight: 'bold', color: '#fff', backgroundColor: simulacaoAtiva ? '#ecc94b' : '#48bb78', border: 'none', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
            {simulacaoAtiva ? '⏸ Pausar' : '▶ Continuar'}
          </button>
        )}
      </div>
    </div>
  );
};
