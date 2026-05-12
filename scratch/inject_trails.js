import axios from 'axios';

const API_BASE_URL = 'https://azorestoyou-1.onrender.com';

const trails = [
  {
    id: "TRI_PR12SMI",
    title: "Agrião",
    type: "trail",
    island: "PDL",
    image: "https://images.unsplash.com/photo-1593035661744-827ecb0bd945?q=80&w=2000",
    description: "Trilho PR12SMI - Povoação, Ribeira Quente. Um percurso linear com vistas deslumbrantes sobre a costa sul.",
    distance: "7,1 Km",
    duration: "3h00",
    difficulty: "Médio",
    isPaid: false,
    gallery: []
  },
  {
    id: "TRI_PRC13SMI",
    title: "Água Retorta",
    type: "trail",
    island: "PDL",
    image: "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2000",
    description: "Trilho PRC13SMI - Água Retorta. Percurso circular que atravessa densa vegetação endémica e zonas agrícolas.",
    distance: "5,1 Km",
    duration: "2h00",
    difficulty: "Médio",
    isPaid: false,
    gallery: []
  },
  {
    id: "TRI_PRC33SMI",
    title: "Atalho dos Vermelhos",
    type: "trail",
    island: "PDL",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000",
    description: "Trilho PRC33SMI - Ponta Delgada, Pilar da Bretanha. Percurso circular pela costa norte com vistas para os Mosteiros.",
    distance: "5,4 Km",
    duration: "2h00",
    difficulty: "Médio",
    isPaid: false,
    gallery: []
  },
  {
    id: "TRI_PRC29SMI",
    title: "Caldeiras da Ribeira Grande – Salto do Cabrito",
    type: "trail",
    island: "PDL",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000",
    description: "Trilho PRC29SMI - Ribeira Grande, Matriz. Passagem pela cascata do Salto do Cabrito e centrais hidroelétricas.",
    distance: "8,6 Km",
    duration: "3h00",
    difficulty: "Médio",
    isPaid: false,
    gallery: []
  },
  {
    id: "TRI_PRC28SMI",
    title: "Chá Gorreana",
    type: "trail",
    island: "PDL",
    image: "https://images.unsplash.com/photo-1523906630133-f753f062744c?q=80&w=2000",
    description: "Trilho PRC28SMI - Ribeira Grande, Maia. Percurso circular pelas únicas plantações de chá da Europa.",
    distance: "3,3 Km",
    duration: "1h30",
    difficulty: "Fácil",
    isPaid: false,
    gallery: []
  },
  {
    id: "TRI_PRC46SMI",
    title: "Fajã do Mar",
    type: "trail",
    island: "PDL",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000",
    description: "Trilho PRC46SMI - Ponta Delgada, Feteiras. Percurso circular com descida à fajã e contacto direto com o mar.",
    distance: "5 Km",
    duration: "2h30",
    difficulty: "Médio",
    isPaid: false,
    gallery: []
  }
];

async function inject() {
  console.log("🚀 Injetando trilhos...");
  for (const trail of trails) {
    try {
      await axios.post(`${API_BASE_URL}/api/activities?mode=merge`, trail);
      console.log(`✅ Injetado: ${trail.title}`);
    } catch (err) {
      console.error(`❌ Erro em ${trail.title}:`, err.message);
    }
  }
  console.log("✨ Concluído!");
}

inject();
