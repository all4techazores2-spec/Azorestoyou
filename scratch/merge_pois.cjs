const fs = require('fs');

const dadosPoi = {
  "PR03SMI_vista_rei_sete_cidades": {
    "pontosInteresse": [
      {
        "id": "poi_vista_rei",
        "nome": "Miradouro da Vista do Rei",
        "tipo": "miradouro",
        "descricao": "O miradouro mais icónico dos Açores, oferecendo a famosa vista panorâmica sobre as lagoas Azul e Verde.",
        "lat": 37.8392,
        "lng": -25.7941,
        "foto": ""
      },
      {
        "id": "poi_lagoa_santiago",
        "nome": "Miradouro da Lagoa do Santiago",
        "tipo": "miradouro",
        "descricao": "Uma fantástica lagoa verde-escura escondida numa cratera profunda e rodeada de vegetação densa.",
        "lat": 37.8445,
        "lng": -25.7862,
        "foto": ""
      }
    ]
  },
  "PR06SMI_lagoa_furnas": {
    "pontosInteresse": [
      {
        "id": "poi_caldeiras_furnas",
        "nome": "Caldeiras da Lagoa das Furnas",
        "tipo": "monumento",
        "descricao": "Zona de vulcanismo ativo com fumarolas onde os restaurantes locais confecionam o tradicional Cozido das Furnas.",
        "lat": 37.7712,
        "lng": -25.3284,
        "foto": ""
      },
      {
        "id": "poi_ermida_vitoria",
        "nome": "Ermida de Nossa Senhora da Vitória",
        "tipo": "monumento",
        "descricao": "Um impressionante templo em estilo neo-gótico construído no século XIX, situado mesmo na margem da lagoa.",
        "lat": 37.7728,
        "lng": -25.3308,
        "foto": ""
      }
    ]
  },
  "PR42SMI_lagoa_fogo_praia": {
    "pontosInteresse": [
      {
        "id": "poi_escadaria_fogo",
        "nome": "Escadaria da Encosta",
        "tipo": "perigo",
        "descricao": "Atenção redobrada aos degraus de madeira escavados na terra. A descida é íngreme e escorregadia.",
        "lat": 37.7662,
        "lng": -25.4942,
        "foto": ""
      },
      {
        "id": "poi_praia_fogo",
        "nome": "Praia da Lagoa do Fogo",
        "tipo": "miradouro",
        "descricao": "Uma praia selvagem de areia branca natural no fundo da caldeira, considerada uma das 7 Maravilhas de Portugal.",
        "lat": 37.7692,
        "lng": -25.4912,
        "foto": ""
      }
    ]
  },
  "PR28SMI_cha_gorreana": {
    "pontosInteresse": [
      {
        "id": "poi_campos_cha",
        "nome": "Campos de Chá Gorreana",
        "tipo": "miradouro",
        "descricao": "As linhas onduladas das plantações de chá que se estendem até encontrar a linha azul do mar do Norte.",
        "lat": 37.8185,
        "lng": -25.4215,
        "foto": ""
      },
      {
        "id": "poi_fabrica_gorreana",
        "nome": "Fábrica de Chá Gorreana",
        "tipo": "monumento",
        "descricao": "A plantação e fábrica de chá mais antiga da Europa, a funcionar de forma tradicional desde 1883.",
        "lat": 37.8172,
        "lng": -25.4205,
        "foto": ""
      }
    ]
  },
  "PRC05SMI_serra_devassa": {
    "pontosInteresse": [
      {
        "id": "poi_lagoa_eguas",
        "nome": "Lagoa das Éguas",
        "tipo": "miradouro",
        "descricao": "Uma das lagoas mais elevadas e isoladas de São Miguel, rodeada por cones vulcânicos totalmente verdes.",
        "lat": 37.8455,
        "lng": -25.7610,
        "foto": ""
      },
      {
        "id": "poi_nove_janelas",
        "nome": "Muro das Nove Janelas",
        "tipo": "monumento",
        "descricao": "O histórico aqueduto de pedra antiga que trazia água para Ponta Delgada, mesmo à entrada da serra.",
        "lat": 37.8410,
        "lng": -25.7595,
        "foto": ""
      }
    ]
  },
  "PR39SMI_salto_cabrito": {
    "pontosInteresse": [
      {
        "id": "poi_passadicos_cabrito",
        "nome": "Passadiços Metálicos",
        "tipo": "perigo",
        "descricao": "Caminhe com atenção sobre as grelhas de ferro suspensas e as condutas de água da central hidroelétrica.",
        "lat": 37.7975,
        "lng": -25.5015,
        "foto": ""
      },
      {
        "id": "poi_cascata_cabrito",
        "nome": "Cascata do Salto do Cabrito",
        "tipo": "cascata",
        "descricao": "Uma espetacular queda de água com cerca de 40 metros de altura que deságua numa refrescante piscina natural.",
        "lat": 37.8005,
        "lng": -25.5042,
        "foto": ""
      }
    ]
  }
};

const mapping = {
    "PR03SMI_vista_rei_sete_cidades": "trail_vista_rei",
    "PR06SMI_lagoa_furnas": "trail_lagoa_furnas",
    "PR42SMI_lagoa_fogo_praia": "trail_lagoa_fogo_praia",
    "PR28SMI_cha_gorreana": "trail_cha_gorreana",
    "PRC05SMI_serra_devassa": "trail_serra_devassa",
    "PR39SMI_salto_cabrito": "trail_salto_cabrito"
};

try {
    const dbData = fs.readFileSync('db.json', 'utf8');
    const db = JSON.parse(dbData);
    
    let activities = db.activities || [];
    
    Object.keys(dadosPoi).forEach(code => {
        const data = dadosPoi[code];
        const targetId = mapping[code];
        
        let found = false;
        activities.forEach(act => {
            // Verificar por ID mapeado, código contido no ID ou título contendo o código
            if (act.id === targetId || act.id.includes(code) || act.title.includes(code.split('_')[0])) {
                act.pontosInteresse = data.pontosInteresse;
                act.id = code; // Atualizar para o código oficial
                found = true;
            }
        });
        
        if (!found) {
            activities.push({
                id: code,
                title: code.replace(/_/g, ' ').toUpperCase(),
                type: 'trail',
                island: 'São Miguel',
                image: '',
                description: '',
                distance: '0 Km',
                duration: '0h00',
                difficulty: 'Moderado',
                gallery: [],
                pontosInteresse: data.pontosInteresse
            });
        }
    });
    
    db.activities = activities;
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
    console.log("✅ db.json atualizado com sucesso via Node.js!");
} catch (err) {
    console.error("❌ Erro:", err.message);
}
