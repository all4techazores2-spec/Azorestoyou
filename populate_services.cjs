const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
}

function writeDB(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

const servicesData = [
  // Eletricistas
  { id: 'S101', name: 'EletroAçores', island: 'PDL', subcategory: 'electrician', rating: 4.9, reviews: 45, image: 'https://picsum.photos/400/300?random=101', description: 'Instalações elétricas residenciais e comerciais.', phone: '+351 961 234 567', publicEmail: 'geral@eletroazores.pt', businessType: 'service' },
  { id: 'S102', name: 'Volt Azor', island: 'TER', subcategory: 'electrician', rating: 4.7, reviews: 28, image: 'https://picsum.photos/400/300?random=102', description: 'Manutenção elétrica 24h e reparação de quadros.', phone: '+351 962 345 678', publicEmail: 'info@voltazor.pt', businessType: 'service' },
  // Pedreiros
  { id: 'S103', name: 'Pedreiros da Ilha', island: 'PDL', subcategory: 'bricklayer', rating: 4.8, reviews: 34, image: 'https://picsum.photos/400/300?random=103', description: 'Construção civil, muros de pedra e remodelações.', phone: '+351 963 456 789', publicEmail: 'contacto@pedreirosdailha.pt', businessType: 'service' },
  { id: 'S104', name: 'Azor Brick', island: 'PDL', subcategory: 'bricklayer', rating: 4.6, reviews: 15, image: 'https://picsum.photos/400/300?random=104', description: 'Especialistas em fachadas e obras estruturais.', phone: '+351 964 567 890', publicEmail: 'obras@azorbrick.pt', businessType: 'service' },
  // Carpinteiros
  { id: 'S105', name: 'Madeira Viva', island: 'PDL', subcategory: 'carpenter', rating: 5.0, reviews: 52, image: 'https://picsum.photos/400/300?random=105', description: 'Carpintaria artesanal, móveis por medida e restauro.', phone: '+351 965 678 901', publicEmail: 'arte@madeiraviva.pt', businessType: 'service' },
  { id: 'S106', name: 'Carpintaria Central', island: 'TER', subcategory: 'carpenter', rating: 4.8, reviews: 31, image: 'https://picsum.photos/400/300?random=106', description: 'Especialistas em portas, janelas e estruturas em madeira.', phone: '+351 966 789 012', publicEmail: 'geral@carpintariacentral.pt', businessType: 'service' },
  // Canalizadores
  { id: 'S107', name: 'Hidro Açores', island: 'PDL', subcategory: 'plumber', rating: 4.7, reviews: 63, image: 'https://picsum.photos/400/300?random=107', description: 'Reparação de fugas, instalação de canalização e esgotos.', phone: '+351 967 890 123', publicEmail: 'emergencias@hidroazores.pt', businessType: 'service' },
  { id: 'S108', name: 'Canalizador 24h', island: 'PDL', subcategory: 'plumber', rating: 4.9, reviews: 41, image: 'https://picsum.photos/400/300?random=108', description: 'Serviço rápido de desentupimentos e fugas de água.', phone: '+351 968 901 234', publicEmail: 'info@canalizador24h.pt', businessType: 'service' },
  // Pintores
  { id: 'S109', name: 'Cores do Atlântico', island: 'PDL', subcategory: 'painter', rating: 4.8, reviews: 27, image: 'https://picsum.photos/400/300?random=109', description: 'Pintura de interiores, exteriores e tratamentos de humidade.', phone: '+351 969 012 345', publicEmail: 'pintura@coresatlantico.pt', businessType: 'service' },
  { id: 'S110', name: 'Azor Paint', island: 'TER', subcategory: 'painter', rating: 4.7, reviews: 19, image: 'https://picsum.photos/400/300?random=110', description: 'Pinturas decorativas e revestimentos industriais.', phone: '+351 960 123 456', publicEmail: 'geral@azorpaint.pt', businessType: 'service' },
  
  // Jardinagem
  { id: 'S111', name: 'Jardins da Lagoa', island: 'PDL', subcategory: 'gardening', rating: 4.9, reviews: 38, image: 'https://picsum.photos/400/300?random=111', description: 'Manutenção de jardins, poda de árvores e sistemas de rega.', phone: '+351 961 000 111', publicEmail: 'geral@jardinslagoa.pt', businessType: 'service' },
  { id: 'S112', name: 'Azores Green', island: 'TER', subcategory: 'gardening', rating: 4.8, reviews: 22, image: 'https://picsum.photos/400/300?random=112', description: 'Paisagismo e design de espaços exteriores.', phone: '+351 962 000 222', publicEmail: 'info@azoresgreen.pt', businessType: 'service' },
  // Arquitetos
  { id: 'S113', name: 'Atelier Azor', island: 'PDL', subcategory: 'architect', rating: 5.0, reviews: 15, image: 'https://picsum.photos/400/300?random=113', description: 'Projetos de arquitetura moderna e reabilitação urbana.', phone: '+351 963 000 333', publicEmail: 'projeto@atelierazor.pt', businessType: 'service' },
  { id: 'S114', name: 'Archi Ilha', island: 'TER', subcategory: 'architect', rating: 4.9, reviews: 12, image: 'https://picsum.photos/400/300?random=114', description: 'Arquitetura sustentável integrada na paisagem açoriana.', phone: '+351 964 000 444', publicEmail: 'geral@archiilha.pt', businessType: 'service' },
  // Engenheiros
  { id: 'S115', name: 'Engenharia do Atlântico', island: 'PDL', subcategory: 'engineer', rating: 4.8, reviews: 25, image: 'https://picsum.photos/400/300?random=115', description: 'Cálculo estrutural, fiscalização de obras e consultoria.', phone: '+351 965 000 555', publicEmail: 'apoio@engatlantico.pt', businessType: 'service' },
  { id: 'S116', name: 'ProjeAzor', island: 'PDL', subcategory: 'engineer', rating: 4.7, reviews: 18, image: 'https://picsum.photos/400/300?random=116', description: 'Projetos de especialidades e certificação energética.', phone: '+351 966 000 666', publicEmail: 'geral@projeazor.pt', businessType: 'service' },
  // Climatização
  { id: 'S117', name: 'Frio Açores', island: 'PDL', subcategory: 'hvac', rating: 4.9, reviews: 54, image: 'https://picsum.photos/400/300?random=117', description: 'Instalação e manutenção de ar condicionado e sistemas térmicos.', phone: '+351 967 000 777', publicEmail: 'tecnico@frioazores.pt', businessType: 'service' },
  { id: 'S118', name: 'Clima Azor', island: 'TER', subcategory: 'hvac', rating: 4.6, reviews: 31, image: 'https://picsum.photos/400/300?random=118', description: 'Soluções de aquecimento, ventilação e climatização.', phone: '+351 968 000 888', publicEmail: 'info@climaazor.pt', businessType: 'service' },
];

const db = readDB();
db.services = servicesData;
writeDB(db);
console.log('✅ Base de dados populada com IDs de ilhas corretos (PDL, TER)!');
