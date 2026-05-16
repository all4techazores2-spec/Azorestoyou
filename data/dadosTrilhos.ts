export interface PontoInteresse {
  lat: number;
  lng: number;
  nome: string;
  tipo: 'miradouro' | 'cascata' | 'monumento' | 'perigo';
  foto: string;
  descricao: string;
}

export interface PontoRota {
  lat: number;
  lng: number;
  altitude: number;
  indicacao?: string;
}

export interface DetalheTrilhoAvancado {
  climaSimulado: { condicao: string; temperatura: number; alerta?: string };
  rota: PontoRota[];
  pontosInteresse: PontoInteresse[];
}

export interface TrailInfo {
  id: string;
  codigo: string;
  nome: string;
  zona: 'Oeste' | 'Centro' | 'Leste';
  distancia: string;
  duracao: string;
  dificuldade: 'Fácil' | 'Moderado' | 'Difícil';
  altitudeMaxima: string;
  descricao: string;
}

export const trilhosInfo: Record<string, TrailInfo> = {
  "PR01SMI_vigia_sao_pedro": {
    id: "PR01SMI_vigia_sao_pedro",
    codigo: "PR01SMI",
    nome: "Vigia de São Pedro",
    zona: "Oeste",
    distancia: "6.5 Km",
    duracao: "2h00",
    dificuldade: "Fácil",
    altitudeMaxima: "90m",
    descricao: "Percurso costeiro que acompanha as antigas zonas de vigia da baleação, oferecendo vistas deslumbrantes sobre o mar do Norte."
  },
  "PR03SMI_vista_rei_sete_cidades": {
    id: "PR03SMI_vista_rei_sete_cidades",
    codigo: "PR03SMI",
    nome: "Vista do Rei - Sete Cidades",
    zona: "Oeste",
    distancia: "7.7 Km",
    duracao: "2h00",
    dificuldade: "Fácil",
    altitudeMaxima: "550m",
    descricao: "Começa no icónico Miradouro da Vista do Rei e percorre a cumeeira da cratera com vistas fantásticas para as lagoas Azul e Verde."
  },
  "PR04SMI_mata_canario_sete_cidades": {
    id: "PR04SMI_mata_canario_sete_cidades",
    codigo: "PR04SMI",
    nome: "Mata do Canário - Sete Cidades",
    zona: "Oeste",
    distancia: "11.8 Km",
    duracao: "3h00",
    dificuldade: "Moderado",
    altitudeMaxima: "730m",
    descricao: "Passa pela densa Mata do Canário e pelo Aqueduto das Nove Janelas, descendo gradualmente até ao interior da Vila das Sete Cidades."
  },
  "PRC05SMI_serra_devassa": {
    id: "PRC05SMI_serra_devassa",
    codigo: "PRC05SMI",
    nome: "Serra Devassa",
    zona: "Oeste",
    distancia: "4.9 Km",
    duracao: "2h15",
    dificuldade: "Moderado",
    altitudeMaxima: "845m",
    descricao: "Um trilho de cortar a respiração que cruza a zona mais alta da serra, passando pelas escondidas Lagoa das Éguas e Lagoa Rasa."
  },
  "PR33SMI_remédios_anecan": {
    id: "PR33SMI_remédios_anecan",
    codigo: "PR33SMI",
    nome: "Remédios - Anecan",
    zona: "Oeste",
    distancia: "5.2 Km",
    duracao: "1h45",
    dificuldade: "Fácil",
    altitudeMaxima: "380m",
    descricao: "Percurso circular pelos caminhos rurais e agrícolas da freguesia dos Remédios, ideal para uma caminhada relaxante em família."
  },
  "PR36SMI_rocha_relva": {
    id: "PR36SMI_rocha_relva",
    codigo: "PR36SMI",
    nome: "Rocha da Relva",
    zona: "Oeste",
    distancia: "5.5 Km",
    duracao: "3h00",
    dificuldade: "Difícil",
    altitudeMaxima: "120m",
    descricao: "Desce uma imponente falésia até um detrito de lava junto ao mar, onde se encontram vinhas tradicionais, adegas e burros de carga."
  },
  "PR38SMI_canario_lagoa_azul": {
    id: "PR38SMI_canario_lagoa_azul",
    codigo: "PR38SMI",
    nome: "Canário - Lagoa Azul",
    zona: "Oeste",
    distancia: "12.0 Km",
    duracao: "3h30",
    dificuldade: "Moderado",
    altitudeMaxima: "760m",
    descricao: "Liga a zona florestal do Canário à margem da Lagoa Azul, passando por miradouros incríveis como a Grota do Inferno."
  },
  "PR02SMI_praia_lagoa_fogo": {
    id: "PR02SMI_praia_lagoa_fogo",
    codigo: "PR02SMI",
    nome: "Praia - Lagoa do Fogo",
    zona: "Centro",
    distancia: "11.0 Km",
    duracao: "4h00",
    dificuldade: "Difícil",
    altitudeMaxima: "575m",
    descricao: "Trilho longo e exigente que sobe desde a costa sul, acompanhando uma levada de água até às margens intocadas da Lagoa do Fogo."
  },
  "PR29SMI_caldeiras_ribeira_grande": {
    id: "PR29SMI_caldeiras_ribeira_grande",
    codigo: "PR29SMI",
    nome: "Caldeiras da Ribeira Grande",
    zona: "Centro",
    distancia: "5.5 Km",
    duracao: "2h30",
    dificuldade: "Fácil",
    altitudeMaxima: "240m",
    descricao: "Percurso circular pelas florestas de criptomérias e eucaliptos que rodeiam a zona termal e as fumarolas das Caldeiras."
  },
  "PR31SMI_quatro_fabricas_feteiras": {
    id: "PR31SMI_quatro_fabricas_feteiras",
    codigo: "PR31SMI",
    nome: "Quatro Fábricas da Luz",
    zona: "Centro",
    distancia: "2.1 Km",
    duracao: "1h30",
    dificuldade: "Fácil",
    altitudeMaxima: "220m",
    descricao: "Um trilho histórico que passa pelas ruínas das primeiras fábricas de produção de energia elétrica dos Açores e termina na Cascata do Segredo."
  },
  "PR37SMI_rota_agua_janela_inferno": {
    id: "PR37SMI_rota_agua_janela_inferno",
    codigo: "PR37SMI",
    nome: "Rota da Água - Janela do Inferno",
    zona: "Centro",
    distancia: "7.6 Km",
    duracao: "2h30",
    dificuldade: "Fácil",
    altitudeMaxima: "310m",
    descricao: "Passa por uma série de aquedutos e túneis antigos que transportavam água, culminando na fantástica parede natural da Janela do Inferno."
  },
  "PR39SMI_salto_cabrito": {
    id: "PR39SMI_salto_cabrito",
    codigo: "PR39SMI",
    nome: "Salto do Cabrito",
    zona: "Centro",
    distancia: "7.5 Km",
    duracao: "2h30",
    dificuldade: "Moderado",
    altitudeMaxima: "210m",
    descricao: "Percurso muito popular que leva os caminhantes pelas passagens metálicas da central hidroelétrica até à base da imponente Cascata do Salto do Cabrito."
  },
  "PR42SMI_lagoa_fogo_praia": {
    id: "PR42SMI_lagoa_fogo_praia",
    codigo: "PR42SMI",
    nome: "Lagoa do Fogo (Praia)",
    zona: "Centro",
    distancia: "4.4 Km",
    duracao: "2h00",
    dificuldade: "Moderado",
    altitudeMaxima: "575m",
    descricao: "A famosa e íngreme descida a partir do miradouro principal até à praia de areia branca no fundo da caldeira vulcânica do Fogo."
  },
  "PRC44SMI_lombadas": {
    id: "PRC44SMI_lombadas",
    codigo: "PRC44SMI",
    nome: "Lombadas",
    zona: "Centro",
    distancia: "4.8 Km",
    duracao: "2h00",
    dificuldade: "Moderado",
    altitudeMaxima: "350m",
    descricao: "Explora o vale profundo e selvagem das Lombadas, conhecido pelas suas nascentes de águas minerais e gasocarbónicas e paisagem intocada."
  },
  "PR06SMI_lagoa_furnas": {
    id: "PR06SMI_lagoa_furnas",
    codigo: "PR06SMI",
    nome: "Lagoa das Furnas",
    zona: "Leste",
    distancia: "9.5 Km",
    duracao: "3h00",
    dificuldade: "Fácil",
    altitudeMaxima: "350m",
    descricao: "Caminhada plana em redor da margem da lagoa, passando pela icónica Capela neoclássica da lona e pela zona de confeção dos cozidos nas caldeiras."
  },
  "PR07SMI_pico_ferro_furnas": {
    id: "PR07SMI_pico_ferro_furnas",
    codigo: "PR07SMI",
    nome: "Pico do Ferro - Furnas",
    zona: "Leste",
    distancia: "3.2 Km",
    duracao: "2h00",
    dificuldade: "Difícil",
    altitudeMaxima: "545m",
    descricao: "Ligação direta e desafiante entre a margem da lagoa e o Miradouro do Pico do Ferro, subindo por trilhos íngremes no meio da floresta."
  },
  "PR11SMI_ribeira_faial_terra": {
    id: "PR11SMI_ribeira_faial_terra",
    codigo: "PR11SMI",
    nome: "Ribeira do Faial da Terra",
    zona: "Leste",
    distancia: "4.2 Km",
    duracao: "1h30",
    dificuldade: "Fácil",
    altitudeMaxima: "150m",
    descricao: "Acompanha as margens arborizadas e frescas da ribeira que desce das montanhas até à pacata freguesia do Faial da Terra."
  },
  "PR12SMI_agriao_povoacao": {
    id: "PR12SMI_agriao_povoacao",
    codigo: "PR12SMI",
    nome: "Agrião - Povoação",
    zona: "Leste",
    distancia: "6.0 Km",
    duracao: "2h30",
    dificuldade: "Moderado",
    altitudeMaxima: "210m",
    descricao: "Percurso costeiro linear que liga a Povoação à baía isolada do Agrião, atravessando arribas altas e antigas pastagens."
  },
  "PR18SMI_pico_vara": {
    id: "PR18SMI_pico_vara",
    codigo: "PR18SMI",
    nome: "Pico da Vara",
    zona: "Leste",
    distancia: "7.0 Km",
    duracao: "3h00",
    dificuldade: "Difícil",
    altitudeMaxima: "1103m",
    descricao: "Subida ao ponto mais alto da ilha de São Miguel (1103 metros), cruzando a Reserva Natural da Tronqueira, o lar do pássaro endémico Priolo."
  },
  "PR21SMI_padrao_povoacao": {
    id: "PR21SMI_padrao_povoacao",
    codigo: "PR21SMI",
    nome: "Padrão - Povoação",
    zona: "Leste",
    distancia: "4.5 Km",
    duracao: "2h00",
    dificuldade: "Moderado",
    altitudeMaxima: "380m",
    descricao: "Percurso circular que percorre antigos caminhos pedestres utilizados pelos primeiros povoadores da ilha para ligar as fajãs agrícolas."
  },
  "PR22SMI_mouro_povoacao": {
    id: "PR22SMI_mouro_povoacao",
    codigo: "PR22SMI",
    nome: "Mouro - Povoação",
    zona: "Leste",
    distancia: "6.5 Km",
    duracao: "2h30",
    dificuldade: "Moderado",
    altitudeMaxima: "340m",
    descricao: "Explora as encostas da Lomba do Mouro, rodeadas por matas densas de criptomérias e ricas em exemplares de flora endémica dos Açores."
  },
  "PR28SMI_cha_gorreana": {
    id: "PR28SMI_cha_gorreana",
    codigo: "PR28SMI",
    nome: "Chá Gorreana",
    zona: "Leste",
    distancia: "3.4 Km",
    duracao: "1h30",
    dificuldade: "Fácil",
    altitudeMaxima: "150m",
    descricao: "Percurso encantador que contorna as famosas e lineares plantações da Fábrica de Chá Gorreana, as únicas da Europa com fins industriais."
  },
  "PR32SMI_feno_ajuda": {
    id: "PR32SMI_feno_ajuda",
    codigo: "PR32SMI",
    nome: "Feno da Ajuda",
    zona: "Leste",
    distancia: "5.8 Km",
    duracao: "2h00",
    dificuldade: "Fácil",
    altitudeMaxima: "110m",
    descricao: "Percurso circular ao longo da costa da Ribeira Grande, com passagem pelas ruínas românticas de antigos moinhos que aproveitavam a água das ribeiras."
  },
  "PR35SMI_muda_nordeste": {
    id: "PR35SMI_muda_nordeste",
    codigo: "PR35SMI",
    nome: "Muda - Nordeste",
    zona: "Leste",
    distancia: "6.8 Km",
    duracao: "2h30",
    dificuldade: "Moderado",
    altitudeMaxima: "410m",
    descricao: "Trilho florestal na zona mais selvagem e isolada do Nordeste, que se embrenha pelas encostas verdejantes da Serra da Tronqueira."
  },
  "PR40SMI_lomba_gordas": {
    id: "PR40SMI_lomba_gordas",
    codigo: "PR40SMI",
    nome: "Lomba das Gordas",
    zona: "Leste",
    distancia: "5.0 Km",
    duracao: "2h00",
    dificuldade: "Fácil",
    altitudeMaxima: "580m",
    descricao: "Percurso pedestre circular que atravessa as zonas altas de pastagens da Povoação, oferecendo vistas largas e desafogadas sobre o vale."
  },
  "PRC41SMI_caldeiras_vulcanias_furnas": {
    id: "PRC41SMI_caldeiras_vulcanias_furnas",
    codigo: "PRC41SMI",
    nome: "Caldeiras e Vulcanismo das Furnas",
    zona: "Leste",
    distancia: "4.0 Km",
    duracao: "1h30",
    dificuldade: "Fácil",
    altitudeMaxima: "360m",
    descricao: "Passeio urbano-florestal no centro do Vale das Furnas, focado nos fenómenos de vulcanismo ativo, nascentes de águas termais e caldeiras fervilhantes."
  },
  "PRC43SMI_salto_prego_sanguinho": {
    id: "PRC43SMI_salto_prego_sanguinho",
    codigo: "PRC43SMI",
    nome: "Salto do Prego / Sanguinho",
    zona: "Leste",
    distancia: "4.5 Km",
    duracao: "2h00",
    dificuldade: "Moderado",
    altitudeMaxima: "210m",
    descricao: "Leva à deslumbrante queda de água do Salto do Prego escondida no bosque e regressa pelas rústicas casas de pedra da Aldeia recuperada do Sanguinho."
  },
  "PRC45SMI_lomba_cavaleiro": {
    id: "PRC45SMI_lomba_cavaleiro",
    codigo: "PRC45SMI",
    nome: "Lomba do Cavaleiro",
    zona: "Leste",
    distancia: "6.0 Km",
    duracao: "2h30",
    dificuldade: "Moderado",
    altitudeMaxima: "310m",
    descricao: "Um trilho panorâmico fabuloso que oferece vistas incríveis sobre as famosas \"Sete Lombas\" e o vale que compõe a bacia da Povoação."
  }
};

export const trilhosAcoresDados: Record<string, DetalheTrilhoAvancado> = {
  "PR01SMI_vigia_sao_pedro": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 19 },
    rota: [
      { lat: 37.8485, lng: -25.6310, altitude: 40, indicacao: "Início do trilho da Vigia de São Pedro, junto à costa." },
      { lat: 37.8502, lng: -25.6335, altitude: 65, indicacao: "Siga pelo caminho de terra batida com vista para o mar do Norte." },
      { lat: 37.8515, lng: -25.6370, altitude: 80, indicacao: "Aproximação ao antigo posto de vigia da baleação. Oferece vistas deslumbrantes sobre o mar." },
      { lat: 37.8490, lng: -25.6315, altitude: 45, indicacao: "Trilho concluído perto das zonas de pastagem." }
    ],
    pontosInteresse: []
  },
  "PR03SMI_vista_rei_sete_cidades": {
    climaSimulado: { condicao: "Nevoeiro Cerrado", temperatura: 14, alerta: "Visibilidade inferior a 20 metros na cumeeira. Recomenda-se precaução extrema." },
    rota: [
      { lat: 37.8392, lng: -25.7941, altitude: 540, indicacao: "Comece no Miradouro da Vista do Rei." },
      { lat: 37.8410, lng: -25.7915, altitude: 535 },
      { lat: 37.8480, lng: -25.7810, altitude: 480 },
      { lat: 37.8565, lng: -25.7672, altitude: 260, indicacao: "Trilho Concluído na Vila!" }
    ],
    pontosInteresse: [
      { lat: 37.8392, lng: -25.7941, nome: "Miradouro da Vista do Rei", tipo: "miradouro", foto: "/imagens/pois/vista_rei.jpg", descricao: "A vista mais famosa dos Açores sobre as duas lagoas coloridas." }
    ]
  },
  "PR04SMI_mata_canario_sete_cidades": {
    climaSimulado: { condicao: "Nublado", temperatura: 17 },
    rota: [
      { lat: 37.8385, lng: -25.7550, altitude: 680, indicacao: "Início junto à Mata do Canário. Siga o caminho florestal." },
      { lat: 37.8420, lng: -25.7620, altitude: 720, indicacao: "Aproximação ao histórico Aqueduto das Nove Janelas. Siga em frente." },
      { lat: 37.8465, lng: -25.7710, altitude: 650, indicacao: "Descida gradual em direção ao interior da Vila das Sete Cidades." },
      { lat: 37.8560, lng: -25.7680, altitude: 260, indicacao: "Chegada ao final do trilho na praça central da Vila." }
    ],
    pontosInteresse: []
  },
  "PRC05SMI_serra_devassa": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.8425, lng: -25.7580, altitude: 770, indicacao: "Início no parque de estacionamento da Lagoa do Canário." },
      { lat: 37.8440, lng: -25.7595, altitude: 810, indicacao: "Subida íngreme pelo cume." },
      { lat: 37.8455, lng: -25.7610, altitude: 845, indicacao: "Ponto mais alto da serra. À sua direita, aviste a Lagoa das Éguas." },
      { lat: 37.8425, lng: -25.7580, altitude: 770, indicacao: "Percurso terminado. Regressou ao ponto inicial da Serra Devassa." }
    ],
    pontosInteresse: []
  },
  "PR33SMI_remédios_anecan": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 20 },
    rota: [
      { lat: 37.8410, lng: -25.6950, altitude: 310, indicacao: "Início na freguesia dos Remédios." },
      { lat: 37.8450, lng: -25.7010, altitude: 380, indicacao: "Vire à esquerda seguindo o caminho agrícola interior." },
      { lat: 37.8410, lng: -25.6950, altitude: 310, indicacao: "Circuito concluído. Caminhada relaxante em família finalizada." }
    ],
    pontosInteresse: []
  },
  "PR36SMI_rocha_relva": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 22 },
    rota: [
      { lat: 37.7612, lng: -25.7420, altitude: 120, indicacao: "Comece a descida da falésia. Atenção à descida técnica em calçada de pedra. Piso irregular." },
      { lat: 37.7580, lng: -25.7450, altitude: 35, indicacao: "Chegou à Rocha da Relva. Admire as vinhas e adegas tradicionais." },
      { lat: 37.7582, lng: -25.7445, altitude: 60, indicacao: "Inicie a subida de regresso. Prepare-se para o esforço final." },
      { lat: 37.7612, lng: -25.7420, altitude: 120, indicacao: "Subida concluído! Chegou ao fim da Rocha da Relva." }
    ],
    pontosInteresse: []
  },
  "PR38SMI_canario_lagoa_azul": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.8430, lng: -25.7560, altitude: 750, indicacao: "Início na Lagoa do Canário." },
      { lat: 37.8490, lng: -25.7690, altitude: 510, indicacao: "Aproveite a paragem no Miradouro da Grota do Inferno." },
      { lat: 37.8570, lng: -25.7720, altitude: 262, indicacao: "Fim da rota na margem da Lagoa Azul." }
    ],
    pontosInteresse: []
  },
  "PR02SMI_praia_lagoa_fogo": {
    climaSimulado: { condicao: "Nublado", temperatura: 16 },
    rota: [
      { lat: 37.7395, lng: -25.4850, altitude: 110, indicacao: "Início da subida exigente em direção ao Fogo." },
      { lat: 37.7480, lng: -25.4890, altitude: 320, indicacao: "Siga com atenção ao lado da levada. Zona de vegetação densa." },
      { lat: 37.7590, lng: -25.4910, altitude: 540, indicacao: "Zona aberta. Mantenha o rumo em direção à caldeira." },
      { lat: 37.7650, lng: -25.4930, altitude: 575, indicacao: "Chegada às margens intocadas da Lagoa do Fogo." }
    ],
    pontosInteresse: []
  },
  "PR29SMI_caldeiras_ribeira_grande": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 19 },
    rota: [
      { lat: 37.8155, lng: -25.4830, altitude: 190, indicacao: "Início junto às Caldeiras da Ribeira Grande." },
      { lat: 37.8100, lng: -25.4850, altitude: 240, indicacao: "Aproxime-se da zona florestal e respire o ar puro dos eucaliptos." },
      { lat: 37.8155, lng: -25.4830, altitude: 190, indicacao: "Retorno à zona das fumarolas e estância termal." }
    ],
    pontosInteresse: []
  },
  "PR31SMI_quatro_fabricas_feteiras": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.7850, lng: -25.4510, altitude: 220, indicacao: "Início do trilho das Quatro Fábricas da Luz." },
      { lat: 37.7890, lng: -25.4540, altitude: 180, indicacao: "Passagem pelas ruínas históricas da antiga central elétrica." },
      { lat: 37.7920, lng: -25.4580, altitude: 140, indicacao: "Fim do percurso na Cascata do Segredo." }
    ],
    pontosInteresse: []
  },
  "PR37SMI_rota_agua_janela_inferno": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 17 },
    rota: [
      { lat: 37.7550, lng: -25.5210, altitude: 240, indicacao: "Inicie a Rota da Água nos Remédios." },
      { lat: 37.7590, lng: -25.5250, altitude: 290, indicacao: "Ligue a lanterna. Vamos atravessar o túnel do antigo aqueduto." },
      { lat: 37.7620, lng: -25.5290, altitude: 310, indicacao: "Chegou à Janela do Inferno. Aprecie a parede natural." },
      { lat: 37.7550, lng: -25.5210, altitude: 240, indicacao: "Percurso circular terminado." }
    ],
    pontosInteresse: []
  },
  "PR39SMI_salto_cabrito": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.7945, lng: -25.4980, altitude: 210, indicacao: "Início nas Caldeiras em direção ao Salto do Cabrito." },
      { lat: 37.7975, lng: -25.5015, altitude: 170, indicacao: "Caminhe com cuidado pelas passagens de ferro sobre a conduta de água." },
      { lat: 37.8005, lng: -25.5042, altitude: 140, indicacao: "Chegou à base da imponente Cascata do Salto do Cabrito." },
      { lat: 37.7945, lng: -25.4980, altitude: 210, indicacao: "Trilho concluído!" }
    ],
    pontosInteresse: []
  },
  "PR42SMI_lagoa_fogo_praia": {
    climaSimulado: { condicao: "Nublado", temperatura: 16 },
    rota: [
      { lat: 37.7656, lng: -25.4951, altitude: 575, indicacao: "Inicie a descida. Atenção aos degraus de madeira escavados na terra. Segure o corrimão." },
      { lat: 37.7662, lng: -25.4942, altitude: 540, indicacao: "Mantenha a atenção ao piso inclinado." },
      { lat: 37.7692, lng: -25.4912, altitude: 335, indicacao: "Chegou à praia de areia branca no fundo da caldeira vulcânica." }
    ],
    pontosInteresse: []
  },
  "PRC44SMI_lombadas": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 17 },
    rota: [
      { lat: 37.7980, lng: -25.4650, altitude: 290, indicacao: "Início da exploração do vale das Lombadas." },
      { lat: 37.7920, lng: -25.4680, altitude: 350, indicacao: "Piso instável junto à ribeira. Certifique-se onde apoia os pés." },
      { lat: 37.7980, lng: -25.4650, altitude: 290, indicacao: "Fim do percurso no vale selvagem." }
    ],
    pontosInteresse: []
  },
  "PR06SMI_lagoa_furnas": {
    climaSimulado: { condicao: "Chuva Ligeira", temperatura: 16, alerta: "Piso escorregadio na zona florestal devido à humidade." },
    rota: [
      { lat: 37.7712, lng: -25.3284, altitude: 280, indicacao: "Inicie o percurso junto às caldeiras da Lagoa das Furnas." },
      { lat: 37.7719, lng: -25.3295, altitude: 281 },
      { lat: 37.7728, lng: -25.3308, altitude: 298, indicacao: "Curva à esquerda. Vamos entrar na zona de mata." },
      { lat: 37.7750, lng: -25.3345, altitude: 350 },
      { lat: 37.7732, lng: -25.3362, altitude: 282, indicacao: "Parabéns! Completou o trilho circular das Furnas." }
    ],
    pontosInteresse: [
      { lat: 37.7712, lng: -25.3284, nome: "Caldeiras das Furnas", tipo: "monumento", foto: "/imagens/pois/caldeiras.jpg", descricao: "Zonas de vulcanismo ativo onde é confecionado o famoso cozido das Furnas." },
      { lat: 37.7728, lng: -25.3308, nome: "Ermida da Nossa Senhora da Vitória", tipo: "monumento", foto: "/imagens/pois/ermida.jpg", descricao: "Templo neoclássico construído no século XIX junto à margem da lagoa." }
    ]
  },
  "PR07SMI_pico_ferro_furnas": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.7725, lng: -25.3300, altitude: 285, indicacao: "Inicie a subida íngreme a partir da margem da lagoa." },
      { lat: 37.7760, lng: -25.3250, altitude: 410, indicacao: "Subida muito acentuada por ziguezagues florestais. Suba ao seu ritmo." },
      { lat: 37.7810, lng: -25.3190, altitude: 545, indicacao: "Chegada ao Pico do Ferro. Desfrute da vista sobre o Vale das Furnas." }
    ],
    pontosInteresse: []
  },
  "PR11SMI_ribeira_faial_terra": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 19 },
    rota: [
      { lat: 37.7420, lng: -25.1980, altitude: 150, indicacao: "Início na Ribeira do Faial da Terra." },
      { lat: 37.7350, lng: -25.2050, altitude: 80, indicacao: "Siga ao longo da margem da ribeira escutando a corrente da água." },
      { lat: 37.7310, lng: -25.2130, altitude: 40, indicacao: "Fim da rota arborizada e fresca." }
    ],
    pontosInteresse: []
  },
  "PR12SMI_agriao_povoacao": {
    climaSimulado: { condicao: "Nublado", temperatura: 17 },
    rota: [
      { lat: 37.7485, lng: -25.2410, altitude: 180, indicacao: "Saída da Povoação em direção ao Agrião." },
      { lat: 37.7420, lng: -25.2520, altitude: 210, indicacao: "Aproximação às arribas costeiras. Cuidado com as rajadas de vento." },
      { lat: 37.7390, lng: -25.2610, altitude: 5, indicacao: "Chegou à baía isolada do Agrião." }
    ],
    pontosInteresse: []
  },
  "PR18SMI_pico_vara": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 15 },
    rota: [
      { lat: 37.7850, lng: -25.1750, altitude: 650, indicacao: "Início da subida ao ponto mais alto de São Miguel." },
      { lat: 37.7920, lng: -25.1620, altitude: 890, indicacao: "Mantenha-se estritamente no trilho para proteger o habitat do Priolo." },
      { lat: 37.8015, lng: -25.1580, altitude: 1103, indicacao: "Chegou ao topo do Pico da Vara! Vista panorâmica de 360 graus." }
    ],
    pontosInteresse: []
  },
  "PR21SMI_padrao_povoacao": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 19 },
    rota: [
      { lat: 37.7610, lng: -25.2310, altitude: 250, indicacao: "Início do trilho circular no Padrão." },
      { lat: 37.7680, lng: -25.2250, altitude: 380, indicacao: "Vire à direita no trilho empedrado dos antigos povoadores." },
      { lat: 37.7610, lng: -25.2310, altitude: 250, indicacao: "Circuito concluído." }
    ],
    pontosInteresse: []
  },
  "PR22SMI_mouro_povoacao": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.7550, lng: -25.2200, altitude: 210, indicacao: "Início na encosta da Lomba do Mouro." },
      { lat: 37.7590, lng: -25.2110, altitude: 340, indicacao: "Aprecie os exemplares de urze e uva-da-serra à sua esquerda." },
      { lat: 37.7550, lng: -25.2200, altitude: 210, indicacao: "Fim do percurso botânico." }
    ],
    pontosInteresse: []
  },
  "PR28SMI_cha_gorreana": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 19 },
    rota: [
      { lat: 37.8172, lng: -25.4205, altitude: 110, indicacao: "Início junto à Fábrica de Chá Gorreana." },
      { lat: 37.8202, lng: -25.4230, altitude: 150, indicacao: "Suba contornando as linhas verdes das plantações de chá." },
      { lat: 37.8175, lng: -25.4202, altitude: 112, indicacao: "Trilho pelas únicas plantações industriais de chá da Europa concluído." }
    ],
    pontosInteresse: []
  },
  "PR32SMI_feno_ajuda": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 20 },
    rota: [
      { lat: 37.8320, lng: -25.3150, altitude: 90, indicacao: "Início costeiro no Feno da Ajuda." },
      { lat: 37.8360, lng: -25.3250, altitude: 110, indicacao: "Passagem pelas ruínas de pedra do antigo moinho de água." },
      { lat: 37.8320, lng: -25.3150, altitude: 90, indicacao: "Circuito costeiro finalizado." }
    ],
    pontosInteresse: []
  },
  "PR35SMI_muda_nordeste": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 17 },
    rota: [
      { lat: 37.8210, lng: -25.1420, altitude: 320, indicacao: "Início no Nordeste selvagem." },
      { lat: 37.8150, lng: -25.1510, altitude: 410, indicacao: "Entre na zona de mata densa. Siga as marcas no tronco." },
      { lat: 37.8210, lng: -25.1420, altitude: 320, indicacao: "Fim do trilho da Muda." }
    ],
    pontosInteresse: []
  },
  "PR40SMI_lomba_gordas": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.7750, lng: -25.1910, altitude: 450, indicacao: "Início na Lomba das Gordas." },
      { lat: 37.7820, lng: -25.1850, altitude: 580, indicacao: "Mantenha o portão fechado ao atravessar a zona de pastagens." },
      { lat: 37.7750, lng: -25.1910, altitude: 450, indicacao: "Fim do circuito." }
    ],
    pontosInteresse: []
  },
  "PRC41SMI_caldeiras_vulcanias_furnas": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 19 },
    rota: [
      { lat: 37.7760, lng: -25.3120, altitude: 305, indicacao: "Início no centro da Vila das Furnas." },
      { lat: 37.7790, lng: -25.3050, altitude: 360, indicacao: "Aproximação à zona das nascentes termais e águas férreas." },
      { lat: 37.7760, lng: -25.3120, altitude: 305, indicacao: "Fim do passeio vulcânico urbano." }
    ],
    pontosInteresse: []
  },
  "PRC43SMI_salto_prego_sanguinho": {
    climaSimulado: { condicao: "Céu Limpo", temperatura: 18 },
    rota: [
      { lat: 37.7315, lng: -25.2140, altitude: 40, indicacao: "Início no Faial da Terra. Subida em direção à cascata." },
      { lat: 37.7375, lng: -25.2190, altitude: 210, indicacao: "Chegou à Cascata do Salto do Prego. Excelente local para descansar." },
      { lat: 37.7390, lng: -25.2215, altitude: 180, indicacao: "Regresse pelas rústicas casas de pedra da Aldeia recuperada do Sanguinho." },
      { lat: 37.7315, lng: -25.2140, altitude: 40, indicacao: "Trilho espetacular concluído!" }
    ],
    pontosInteresse: []
  },
  "PRC45SMI_lomba_cavaleiro": {
    climaSimulado: { condicao: "Nublado", temperatura: 17 },
    rota: [
      { lat: 37.7510, lng: -25.2390, altitude: 220, indicacao: "Início na Lomba do Cavaleiro." },
      { lat: 37.7590, lng: -25.2480, altitude: 310, indicacao: "Contemple a vista panorâmica sobre os vales da Povoação à sua direita." },
      { lat: 37.7510, lng: -25.2390, altitude: 220, indicacao: "Fim do percurso panorâmico sobre as Sete Lombas." }
    ],
    pontosInteresse: []
  }
};
