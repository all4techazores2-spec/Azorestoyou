import { updateCollection, readDB } from '../db.js';

const trilhosKeys = [
  "PR01SMI_vigia_sao_pedro", "PR03SMI_vista_rei_sete_cidades", "PR04SMI_mata_canario_sete_cidades", 
  "PRC05SMI_serra_devassa", "PR33SMI_remédios_anecan", "PR36SMI_rocha_relva", "PR38SMI_canario_lagoa_azul",
  "PR02SMI_praia_lagoa_fogo", "PR29SMI_caldeiras_ribeira_grande", "PR31SMI_quatro_fabricas_feteiras",
  "PR37SMI_rota_agua_janela_inferno", "PR39SMI_salto_cabrito", "PR42SMI_lagoa_fogo_praia", "PRC44SMI_lombadas",
  "PR06SMI_lagoa_furnas", "PR07SMI_pico_ferro_furnas", "PR11SMI_ribeira_faial_terra", "PR12SMI_agriao_povoacao",
  "PR18SMI_pico_vara", "PR21SMI_padrao_povoacao", "PR22SMI_mouro_povoacao", "PR28SMI_cha_gorreana",
  "PR32SMI_feno_ajuda", "PR35SMI_muda_nordeste", "PR40SMI_lomba_gordas", "PRC41SMI_caldeiras_vulcanias_furnas",
  "PRC43SMI_salto_prego_sanguinho", "PRC45SMI_lomba_cavaleiro"
];

async function injectAllTrails() {
  console.log("🚀 Starting Trail Injection...");
  
  try {
    const newTrails = trilhosKeys.map(key => {
      const parts = key.split('_');
      const code = parts[0];
      const nameRaw = parts.slice(1).join(' ');
      const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1).replace(/_/g, ' ');
      
      let distance = "5.0 km";
      let duration = "2h 00m";
      let difficulty = "Moderado";

      if (code.includes('C')) difficulty = "Moderado";
      if (key.includes('pico_vara')) { distance = "7.0 km"; duration = "3h 30m"; difficulty = "Difícil"; }
      if (key.includes('furnas')) { distance = "9.5 km"; duration = "3h 00m"; difficulty = "Fácil"; }
      if (key.includes('fogo')) { distance = "4.4 km"; duration = "2h 00m"; difficulty = "Moderado"; }
      if (key.includes('cha_gorreana')) { distance = "3.4 km"; duration = "1h 30m"; difficulty = "Fácil"; }

      return {
        id: key,
        title: name,
        type: 'trail',
        island: 'São Miguel',
        image: '', 
        description: `Trilho oficial homologado (${code}). Explore as paisagens deslumbrantes de São Miguel neste percurso pedestre.`,
        distance,
        duration,
        difficulty,
        isPaid: false,
        bookingPolicy: 'recommended',
        gallery: []
      };
    });

    const db = await readDB();
    const currentActivities = db.activities || [];
    const otherActivities = currentActivities.filter(a => a.type !== 'trail');
    const finalActivities = [...otherActivities, ...newTrails];

    const result = await updateCollection('activities', finalActivities, 'overwrite');
    
    if (result.success) {
      console.log(`✅ Successfully injected ${newTrails.length} trails into the database!`);
    }
  } catch (error) {
    console.error("❌ Error during injection:", error);
  } finally {
    process.exit();
  }
}

injectAllTrails();
