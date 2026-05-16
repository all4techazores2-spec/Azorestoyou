export interface PontoRota {
  lat: number;
  lng: number;
  altitude: number;
  indicacao?: string;
}

export const trilhosAcoresDados: Record<string, PontoRota[]> = {
  // === TRILHOS DA ZONA OESTE (SETE CIDADES / PONTA DELGADA) ===
  "PR01SMI_vigia_sao_pedro": [
    { lat: 37.8485, lng: -25.6310, altitude: 40, indicacao: "Início do trilho da Vigia de São Pedro, junto à costa." },
    { lat: 37.8502, lng: -25.6335, altitude: 65, indicacao: "Siga pelo caminho de terra batida com vista para o mar do Norte." },
    { lat: 37.8515, lng: -25.6370, altitude: 80, indicacao: "Aproximação ao antigo posto de vigia da baleação." },
    { lat: 37.8490, lng: -25.6315, altitude: 45, indicacao: "Trilho concluído perto das zonas de pastagem." }
  ],
  "PR03SMI_vista_rei_sete_cidades": [
    { lat: 37.8392, lng: -25.7941, altitude: 540, indicacao: "Comece no Miradouro da Vista do Rei. Vista icónica sobre as lagoas." },
    { lat: 37.8410, lng: -25.7915, altitude: 535, indicacao: "Siga pelo caminho pedestre ao longo da cumeeira da cratera." },
    { lat: 37.8480, lng: -25.7810, altitude: 480, indicacao: "Mantenha-se à direita com vista para o interior da caldeira." },
    { lat: 37.8565, lng: -25.7672, altitude: 260, indicacao: "Trilho Concluído no centro da Vila das Sete Cidades!" }
  ],
  "PR04SMI_mata_canario_sete_cidades": [
    { lat: 37.8385, lng: -25.7550, altitude: 680, indicacao: "Início junto à Mata do Canário. Siga o caminho florestal." },
    { lat: 37.8420, lng: -25.7620, altitude: 720, indicacao: "Subida em direção ao muro das nove janelas." },
    { lat: 37.8465, lng: -25.7710, altitude: 650, indicacao: "Descida gradual apreciando a lagoa azul ao fundo." },
    { lat: 37.8560, lng: -25.7680, altitude: 260, indicacao: "Chegada ao final do trilho na praça central da Vila." }
  ],
  "PRC05SMI_serra_devassa": [
    { lat: 37.8425, lng: -25.7580, altitude: 770, indicacao: "Início no parque de estacionamento da Lagoa do Canário." },
    { lat: 37.8440, lng: -25.7595, altitude: 810, indicacao: "Subida íngreme pelo cume. Prepare-se para o ganho de altitude." },
    { lat: 37.8455, lng: -25.7610, altitude: 845, indicacao: "Ponto mais alto. À direita consegue avistar a Lagoa das Éguas." },
    { lat: 37.8425, lng: -25.7580, altitude: 770, indicacao: "Percurso terminado. Regressou ao ponto inicial da Serra Devassa." }
  ],
  "PR33SMI_remédios_anecan": [
    { lat: 37.8410, lng: -25.6950, altitude: 310, indicacao: "Início na freguesia dos Remédios." },
    { lat: 37.8450, lng: -25.7010, altitude: 380, indicacao: "Siga os caminhos agrícolas interiores." },
    { lat: 37.8410, lng: -25.6950, altitude: 310, indicacao: "Fim do circuito dos Remédios." }
  ],
  "PR36SMI_rocha_relva": [
    { lat: 37.7612, lng: -25.7420, altitude: 120, indicacao: "Comece a descida da falésia em direção à Rocha da Relva." },
    { lat: 37.7580, lng: -25.7450, altitude: 35, indicacao: "Chegou à zona das vinhas e adegas tradicionais junto ao oceano." },
    { lat: 37.7582, lng: -25.7445, altitude: 60, indicacao: "Prepare-se: Vamos iniciar a subida de regresso pela encosta." },
    { lat: 37.7612, lng: -25.7420, altitude: 120, indicacao: "Subida concluída! Chegou ao fim do trilho da Rocha da Relva." }
  ],
  "PR38SMI_canario_lagoa_azul": [
    { lat: 37.8430, lng: -25.7560, altitude: 750, indicacao: "Início na Lagoa do Canário." },
    { lat: 37.8490, lng: -25.7690, altitude: 510, indicacao: "Passagem pelo Miradouro da Grota do Inferno." },
    { lat: 37.8570, lng: -25.7720, altitude: 262, indicacao: "Fim da rota na margem da Lagoa Azul." }
  ],

  // === TRILHOS DA ZONA CENTRO (LAGOA / RIBEIRA GRANDE / VILA FRANCA) ===
  "PR02SMI_praia_lagoa_fogo": [
    { lat: 37.7395, lng: -25.4850, altitude: 110, indicacao: "Início no concelho da Lagoa, subindo em direção ao Fogo." },
    { lat: 37.7480, lng: -25.4890, altitude: 320, indicacao: "Siga ao lado da levada de água pela densa vegetação." },
    { lat: 37.7590, lng: -25.4910, altitude: 540, indicacao: "Zona alpina aberta. Já consegue avistar a caldeira." },
    { lat: 37.7650, lng: -25.4930, altitude: 575, indicacao: "Chegada à margem sul da fantástica Lagoa do Fogo." }
  ],
  "PR29SMI_caldeiras_ribeira_grande": [
    { lat: 37.8155, lng: -25.4830, altitude: 190, indicacao: "Início junto às Caldeiras da Ribeira Grande." },
    { lat: 37.8100, lng: -25.4850, altitude: 240, indicacao: "Caminhe pelas florestas de eucaliptos." },
    { lat: 37.8155, lng: -25.4830, altitude: 190, indicacao: "Retorno à estância termal das Caldeiras." }
  ],
  "PR31SMI_quatro_fabricas_feteiras": [
    { lat: 37.7850, lng: -25.4510, altitude: 220, indicacao: "Início do trilho histórico das Quatro Fábricas da Luz." },
    { lat: 37.7890, lng: -25.4540, altitude: 180, indicacao: "Passagem pelas ruínas da antiga fábrica hidroelétrica." },
    { lat: 37.7920, lng: -25.4580, altitude: 140, indicacao: "Trilho finalizado junto à Cascata do Segredo." }
  ],
  "PR37SMI_rota_agua_janela_inferno": [
    { lat: 37.7550, lng: -25.5210, altitude: 240, indicacao: "Início no Remédios da Lagoa. Siga a Rota da Água." },
    { lat: 37.7590, lng: -25.5250, altitude: 290, indicacao: "Atravesse os antigos túneis dos aquedutos com cuidado." },
    { lat: 37.7620, lng: -25.5290, altitude: 310, indicacao: "Chegou à Janela do Inferno. Aprecie a parede de água e musgo." },
    { lat: 37.7550, lng: -25.5210, altitude: 240, indicacao: "Circuito concluído no ponto inicial." }
  ],
  "PR39SMI_salto_cabrito": [
    { lat: 37.7945, lng: -25.4980, altitude: 210, indicacao: "Inicie o percurso nas Caldeiras da Ribeira Grande." },
    { lat: 37.7975, lng: -25.5015, altitude: 170, indicacao: "Suba os degraus e caminhe pelas passagens metálicas sobre a conduta." },
    { lat: 37.8005, lng: -25.5042, altitude: 140, indicacao: "Chegou à imponente Cascata do Salto do Cabrito!" },
    { lat: 37.7945, lng: -25.4980, altitude: 210, indicacao: "Trilho completado com sucesso de volta ao ponto inicial." }
  ],
  "PR42SMI_lagoa_fogo_praia": [
    { lat: 37.7656, lng: -25.4951, altitude: 575, indicacao: "Inicie a descida do miradouro da Lagoa do Fogo." },
    { lat: 37.7662, lng: -25.4942, altitude: 540, indicacao: "Atenção aos degraus de terra. Use os apoios de madeira." },
    { lat: 37.7692, lng: -25.4912, altitude: 335, indicacao: "Chegou à praia protegida no fundo da Lagoa do Fogo." }
  ],
  "PRC44SMI_lombadas": [
    { lat: 37.7980, lng: -25.4650, altitude: 290, indicacao: "Início no vale profundo das Lombadas." },
    { lat: 37.7920, lng: -25.4680, altitude: 350, indicacao: "Atenção ao piso instável junto às nascentes de água mineral." },
    { lat: 37.7980, lng: -25.4650, altitude: 290, indicacao: "Fim do percurso no vale." }
  ],

  // === TRILHOS DA ZONA LESTE (FURNAS / POVOAÇÃO / NORDESTE) ===
  "PR06SMI_lagoa_furnas": [
    { lat: 37.7712, lng: -25.3284, altitude: 280, indicacao: "Inicie o percurso junto às caldeiras da Lagoa das Furnas." },
    { lat: 37.7728, lng: -25.3308, altitude: 298, indicacao: "Curva à esquerda. Início de subida ligeira pela mata." },
    { lat: 37.7750, lng: -25.3345, altitude: 350, indicacao: "Ponto mais alto atingido! Excelente vista sobre o vale das Furnas." },
    { lat: 37.7732, lng: -25.3362, altitude: 282, indicacao: "Parabéns! Completou o trilho circular da Lagoa." }
  ],
  "PR07SMI_pico_ferro_furnas": [
    { lat: 37.7725, lng: -25.3300, altitude: 285, indicacao: "Início junto à lagoa. Vamos subir a encosta escarpada." },
    { lat: 37.7760, lng: -25.3250, altitude: 410, indicacao: "Subida muito acentuada por ziguezagues florestais. Ritmo calmo." },
    { lat: 37.7810, lng: -25.3190, altitude: 545, indicacao: "Chegada ao Miradouro do Pico do Ferro. Vista panorâmica espetacular." }
  ],
  "PR11SMI_ribeira_faial_terra": [
    { lat: 37.7420, lng: -25.1980, altitude: 150, indicacao: "Início na zona alta da Ribeira do Faial da Terra." },
    { lat: 37.7350, lng: -25.2050, altitude: 80, indicacao: "Siga as margens da linha de água." },
    { lat: 37.7310, lng: -25.2130, altitude: 40, indicacao: "Fim da rota junto à foz no Faial da Terra." }
  ],
  "PR12SMI_agriao_povoacao": [
    { lat: 37.7485, lng: -25.2410, altitude: 180, indicacao: "Início na Vila da Povoação em direção ao Agrião." },
    { lat: 37.7420, lng: -25.2520, altitude: 210, indicacao: "Falésias costeiras altas. Atenção ao vento." },
    { lat: 37.7390, lng: -25.2610, altitude: 5, indicacao: "Descida até à baía isolada do Agrião." }
  ],
  "PR18SMI_pico_vara": [
    { lat: 37.7850, lng: -25.1750, altitude: 650, indicacao: "Início da subida ao ponto mais alto da ilha, a partir da Casa do Guarda." },
    { lat: 37.7920, lng: -25.1620, altitude: 890, indicacao: "Caminho de cumeada através do habitat do Priolo. Mantenha-se no trilho." },
    { lat: 37.8015, lng: -25.1580, altitude: 1103, indicacao: "Chegou ao topo do Pico da Vara! Consegue ver toda a ilha de São Miguel." }
  ],
  "PR21SMI_padrao_povoacao": [
    { lat: 37.7610, lng: -25.2310, altitude: 250, indicacao: "Início no Padrão, concelho da Povoação." },
    { lat: 37.7680, lng: -25.2250, altitude: 380, indicacao: "Subida por antigos caminhos de ligação rural." },
    { lat: 37.7610, lng: -25.2310, altitude: 250, indicacao: "Retorno ao Padrão." }
  ],
  "PR22SMI_mouro_povoacao": [
    { lat: 37.7550, lng: -25.2200, altitude: 210, indicacao: "Início na Lomba do Mouro." },
    { lat: 37.7590, lng: -25.2110, altitude: 340, indicacao: "Caminho florestal rico em flora endémica." },
    { lat: 37.7550, lng: -25.2200, altitude: 210, indicacao: "Fim do circuito do Mouro." }
  ],
  "PR28SMI_cha_gorreana": [
    { lat: 37.8172, lng: -25.4205, altitude: 110, indicacao: "Início junto à Fábrica de Chá Gorreana." },
    { lat: 37.8202, lng: -25.4230, altitude: 150, indicacao: "Vire à direita junto ao bosque de criptomérias." },
    { lat: 37.8175, lng: -25.4202, altitude: 112, indicacao: "Terminou o trilho nas Plantações de Chá." }
  ],
  "PR32SMI_feno_ajuda": [
    { lat: 37.8320, lng: -25.3150, altitude: 90, indicacao: "Início costeiro no Fenais da Ajuda." },
    { lat: 37.8360, lng: -25.3250, altitude: 110, indicacao: "Aprecie as ruínas dos antigos moinhos de água." },
    { lat: 37.8320, lng: -25.3150, altitude: 90, indicacao: "Fim do circuito." }
  ],
  "PR35SMI_muda_nordeste": [
    { lat: 37.8210, lng: -25.1420, altitude: 320, indicacao: "Início na Vila do Nordeste." },
    { lat: 37.8150, lng: -25.1510, altitude: 410, indicacao: "Caminho interior pelas matas da Tronqueira." },
    { lat: 37.8210, lng: -25.1420, altitude: 320, indicacao: "Fim da rota da Muda." }
  ],
  "PR40SMI_lomba_gordas": [
    { lat: 37.7750, lng: -25.1910, altitude: 450, indicacao: "Início na Lomba das Gordas." },
    { lat: 37.7820, lng: -25.1850, altitude: 580, indicacao: "Zonas altas de pastagens da Povoação." },
    { lat: 37.7750, lng: -25.1910, altitude: 450, indicacao: "Fim do percurso." }
  ],
  "PRC41SMI_caldeiras_vulcanias_furnas": [
    { lat: 37.7760, lng: -25.3120, altitude: 305, indicacao: "Início no centro da Vila das Furnas, junto às caldeiras urbanas." },
    { lat: 37.7790, lng: -25.3050, altitude: 360, indicacao: "Caminhe pelo Parque Terra Nostra e zonas circundantes." },
    { lat: 37.7760, lng: -25.3120, altitude: 305, indicacao: "Regresso ao ponto termal central." }
  ],
  "PRC43SMI_salto_prego_sanguinho": [
    { lat: 37.7315, lng: -25.2140, altitude: 40, indicacao: "Início do trilho no Faial da Terra." },
    { lat: 37.7375, lng: -25.2190, altitude: 210, indicacao: "Chegou à maravilhosa Cascata do Salto do Prego. Aproveite a paragem!" },
    { lat: 37.7390, lng: -25.2215, altitude: 180, indicacao: "De regresso, passe pelas casas de pedra da Aldeia do Sanguinho." },
    { lat: 37.7315, lng: -25.2140, altitude: 40, indicacao: "Trilho espetacular concluído!" }
  ],
  "PRC45SMI_lomba_cavaleiro": [
    { lat: 37.7510, lng: -25.2390, altitude: 220, indicacao: "Início na Lomba do Cavaleiro." },
    { lat: 37.7590, lng: -25.2480, altitude: 310, indicacao: "Vista privilegiada sobre os sete vales da Povoação." },
    { lat: 37.7510, lng: -25.2390, altitude: 220, indicacao: "Fim do circuito panorâmico." }
  ]
};
