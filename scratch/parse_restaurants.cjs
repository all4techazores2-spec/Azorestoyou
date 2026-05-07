const fs = require('fs');

const rawText = `A Coruja
Restauração Restaurante Snack-Bar
Ribeira Grande, Lomba de São Pedro (+351)296473176 (+351)925980519 claudiacamaracamara88@gmail.com A Coruja
A Furna
Restauração Restaurante Snack-Bar
Lagoa , Nossa Senhora do Rosário (+351)967995641 A Furna
A Grega.Café
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)936766033 agrega.cafe@gmail.com A Grega.Café
A Merenda
Restauração Restaurante Pastelaria Padaria Hamburgaria Pizzaria
Ribeira Grande, Conceição (+351)296472604 (+351)910400708 edmundo.pereira@hotmail.com A Merenda
A Merenda – Jardim
Restauração Restaurante Pastelaria Padaria Hamburgaria Pizzaria
Ribeira Grande, Ribeira Grande (+351)296710416 (+351)910400708 edmundo.pereira@hotmail.com A Merenda – Jardim
A Quinta
Restauração Restaurante
Povoação, Furnas (+351)918704860 A Quinta
A Tasca
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296288880 A Tasca
A Tasca Típica
Restauração Restaurante Snack-Bar
Ribeira Grande, Ribeira Grande (+351)296473176 (+351)918836646 barjovemrg@outlook.pt A Tasca Típica
À Terra (Hotel Octant Furnas)
Restauração Restaurante
Povoação, Furnas (+351)296249200 À Terra (Hotel Octant Furnas)
À Terra (Hotel Octant Ponta Delgada)
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296249900 info-pontadelgada@octanthotels.com À Terra (Hotel Octant Ponta Delgada)
Açores Grill
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296288237 
Adega Caloura Restaurant
Restauração Restaurante
Lagoa , Água de Pau (+351)935614425 Adega Caloura Restaurant
Adega Do Mestre André
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296284444 Adega Do Mestre André
Adega Regional
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296284740 adega_regional@sapo.pt Adega Regional
Aji by Otaka
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)910604185 Aji by Otaka
Alabote
Restauração Restaurante Bar
Ribeira Grande, Matriz (+351)296473516 alabote@alabote.net Alabote
Alcides
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296282677 geral@alcides.pt Alcides
Alfredo
Restauração Restaurante Bar Café
Ribeira Grande, São Brás (+351)296446096 Alfredo
Aliança
Restauração Restaurante Bar
Ponta Delgada, São Sebastião (+351)296284095 nunoalianca@gmail.com Aliança
Alma Latina
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296102066 (+351)939605490 Alma Latina
Âncora (Hotel Vale Do Navio)
Restauração Restaurante
Ponta Delgada, Capelas (+351)296980090 geral@hotelvaledonavio.com Âncora (Hotel Vale Do Navio)
Anfiteatro Lounge
Restauração Restaurante
Ponta Delgada, São José (+351)296206154 (+351)965197287 Anfiteatro Lounge
Arco Da Velha
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296704408 cris_per@live.com.pt
Aroma Das Ilhas
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296916419 (+351)967616884 Aroma Das Ilhas
Arriba
Restauração Restaurante Bar
Ponta Delgada, São Sebastião (+351)966773237 arribatexmex@outlook.pt Arriba
Associação Agrícola
Restauração Restaurante
Ribeira Grande, Rabo de Peixe (+351)296490001 (+351)926385995 Associação Agrícola
Atlântida
Restauração Snack-Bar Café
Povoação, Furnas (+351)296584521
Atlântida (S.Miguel Park Hotel)
Restauração Restaurante
Ponta Delgada, São José (+351)296306000 restaurant.smph@bhc.pt Atlântida (S.Miguel Park Hotel)
Azorean Poke
Restauração Restaurante
Ponta Delgada, São José (+351)296085651 azoreanpoke@gmail.com Azorean Poke
Balcony (Grand Hotel Açores Atlântico)
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296302200 balcony.ghaa@bhc.pt Balcony (Grand Hotel Açores Atlântico)
Banhos Férreos
Restauração Restaurante
Povoação, Furnas (+351)296584504 Banhos Férreos
Bar D’Quina
Restauração Restaurante
Ribeira Grande, Matriz (+351)910658567 Bar D’Quina
Bar da Praia de Água D’Alto
Restauração Restaurante Bar
Vila Franca do Campo, Água d'Alto (+351)296581062 Bar da Praia de Água D’Alto
Bar Vinha D’Areia
Restauração Restaurante Bar
Vila Franca do Campo, São Miguel (+351)296582242
Barrocas Do Mar (Hotel Caloura)
Restauração Restaurante
Lagoa , Água de Pau (+351)296960900 Barrocas Do Mar (Hotel Caloura)
Batatinha’s – Snack & Pizza
Restauração Restaurante Snack-Bar Pizzaria
Ponta Delgada, São José (+351)296287202 (+351)962928496 geral@batatinhas.pt Batatinha’s – Snack & Pizza
Beach Bar & Grill
Restauração Restaurante
Ponta Delgada, Livramento (+351)296381783 vicjsousa7@hotmail.com Beach Bar & Grill
Bella Firenze
Restauração Restaurante Pizzaria
Ponta Delgada, São Pedro (+351)296704295 Bella Firenze
Bella Italia
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)969620881 Bella Italia
Black Whale
Restauração Restaurante
Vila Franca do Campo, São Miguel (+351)296582232 Black Whale
BocAberta
Restauração Cervejaria Marisqueira
Lagoa , Nossa Senhora do Rosário (+351)296242250 (+351)912258952 BocAberta
Bom Pesqueiro
Restauração Restaurante
Ponta Delgada (+351)968808557 bompesqueiro.pdl@gmail.com Bom Pesqueiro
Bombeiros Voluntários de Vila Franca do Campo
Restauração Restaurante Snack-Bar
Vila Franca do Campo, São Pedro (+351)296581397 Bombeiros Voluntários de Vila Franca do Campo
Borda D’Água
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296912114 Borda D’Água
Boteco do Miguel
Restauração Restaurante Pizzaria
Ribeira Grande, Matriz (+351)910079854 Boteco do Miguel
Botequim Açoriano
Restauração Restaurante
Ribeira Grande, Rabo de Peixe (+351)296708401 Botequim Açoriano
Brisa Do Mar
Restauração Restaurante
Ponta Delgada, Mosteiros
Brisa Do Mar
Restauração Restaurante Snack-Bar
Povoação, Povoação (+351)296585289 Brisa Do Mar
Burger King (Fajã De Baixo)
Restauração Restaurante
Ponta Delgada, Fajã de Baixo (+351)932222180 Burger King (Fajã De Baixo)
Burger King (Parque Atlântico)
Restauração Restaurante
Ponta Delgada, São José (+351)296307560 Burger King (Parque Atlântico)
Burger King (Portas Do Mar)
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)937712442 loja863@ibersol.pt 
Café Adelino – Dinis
Restauração Restaurante Café
Povoação, Ribeira Quente (+351)296584204 Café Adelino – Dinis
Café Central
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296282882 Café Central
Cais 20
Restauração Restaurante
Ponta Delgada, São Roque (+351)296384811 cais_20@hotmail.com Cais 20
Cais Da Sardinha
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296288068 reservascaisdasardinha@gmail.com Cais Da Sardinha
Caldeiras
Restauração Restaurante Bar
Ribeira Grande, Ribeira Grande (+351)296474307 (+351)918685836 Caldeiras
Caldeiras & Vulcões
Restauração Restaurante
Povoação, Furnas (+351)296584312 Caldeiras & Vulcões
Caloura
Restauração Restaurante Bar
Lagoa , Santa Cruz (+351)296913283 Caloura
Cantão
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296282590 Cantão
Cantinho da Mãe
Restauração Restaurante Take Away
Ponta Delgada, São Sebastião (+351)296242430 geral@cantinhodamae.pt Cantinho da Mãe
Cantinho Da Vila
Restauração Restaurante
Vila Franca do Campo, São Miguel (+351)296581353 Cantinho Da Vila
Cantinho Do Cais
Restauração Restaurante
Ribeira Grande, São Brás (+351)296442631 Cantinho Do Cais
Cantinho Do Porto
Restauração Restaurante
Povoação, Ribeira Quente (+351)296588314 Cantinho Do Porto
Canto da Fonte
Restauração Restaurante Snack-Bar Café
Ribeira Grande, Pico da Pedra (+351)935468889 Canto da Fonte
Canto Da Pia
Restauração Restaurante
Ponta Delgada, Relva (+351)296702768 Canto Da Pia
Canto Do Cais
Restauração Restaurante Café
Ponta Delgada, Capelas (+351)914785292 
Cardume (White Exclusive Suites & Villas)
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296249153 Cardume (White Exclusive Suites & Villas)
Casa De Pasto Flôr
Restauração Restaurante
Ribeira Grande, Ribeira Grande (+351)296472564 (+351)917539527 Casa De Pasto Flôr
Casa de Pasto José Do Rego
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296916755 Casa de Pasto José Do Rego
Casa de Pasto O Amaral
Restauração Restaurante
Ribeira Grande, Porto Formoso (+351)296442258 Casa de Pasto O Amaral
Casa de Pasto O Cardoso
Restauração Restaurante
Nordeste, Lomba da Fazenda (+351)296486138 Casa de Pasto O Cardoso
Casa de Pasto O Durval
Restauração Restaurante
Lagoa , Água de Pau (+351)936498115 Casa de Pasto O Durval
Casa De Pasto O Rabaça
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296707124 Casa De Pasto O Rabaça
Casa De Pasto Tavares
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296287078
Casa De Praia
Restauração Restaurante
Vila Franca do Campo (+351)910579126 Casa De Praia
Casa Do Bacalhau
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)915390518 (+351)913122462 Casa Do Bacalhau
Casa Marisca
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296382780 Casa Marisca
Casa Nostra Açores
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)925798367 Casa Nostra Açores
Cervejaria Esquina
Restauração Restaurante Cervejaria
Ponta Delgada, São José (+351)296628253 reservas@esquinasteakhouse.pt Cervejaria Esquina
Cervejaria Moby Dick
Restauração Restaurante Cervejaria
Ponta Delgada, Capelas (+351)296989698 Cervejaria Moby Dick
Cervejaria Portas Da Cidade
Restauração Restaurante Cervejaria
Ponta Delgada, São Sebastião (+351)296283873
Chalet da Tia Mercês
Restauração Restaurante
Povoação, Furnas (+351)914295470 Chalet da Tia Mercês
Charlena’s
Restauração Snack-Bar Pizzaria
Lagoa , Nossa Senhora do Rosário (+351)296916277 Charlena’s
Conteira
Restauração Restaurante
Ponta Delgada, São Pedro (+351)960212221 geral@conteira.pt Conteira
Costa Sul
Restauração Restaurante Bar
Povoação, Ribeira Quente (+351)296588360 Costa Sul
Costaneira
Restauração Restaurante
Povoação, Ribeira Quente (+351)296584123 Costaneira
Cozinha D’Arlete
Restauração Restaurante Take Away
Ponta Delgada, São Sebastião (+351)296654474
Cozinha Kairos (Arrifes)
Restauração Restaurante Take Away
Ponta Delgada, Arrifes (+351)296682467 (+351)969332689 restaurante.arrifes@kairos-acores.pt Cozinha Kairos (Arrifes)
Cozinha Kairos (Paím)
Restauração Restaurante Take Away
Ponta Delgada, São José (+351)296628114 (+351)964237492 prontoacomer@kairos-acores.pt Cozinha Kairos (Paím)
Dar K Falar
Restauração Restaurante Take Away
Ribeira Grande, Conceição (+351)913683682 Dar K Falar
Dona Mariana
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)926876309 restaurante.donamariana2022@gmail.com Dona Mariana
Donatello
Restauração Restaurante Cervejaria
Ponta Delgada, Fajã de Cima (+351)296285111 Donatello
Donatello (Parque Atlântico)
Restauração Restaurante Cervejaria
Ponta Delgada, São José (+351)296288250 Donatello (Parque Atlântico)
Dondué
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296629277 dondue.azores@gmail.com Dondué
Dragoeiro (ANC Resort)
Restauração Restaurante
Lagoa , Água de Pau (+351)296247640 Dragoeiro (ANC Resort)
Eatthis! Healthy Foods
Restauração Restaurante Take Away
Ponta Delgada, Fajã de Baixo (+351)911999649 eatthispt@gmail.com Eatthis! Healthy Foods
Eh Pá Food
Restauração Restaurante Pizzaria Pastelaria
Ponta Delgada, Ajuda da Bretanha (+351)296917191 (+351)968734085 Eh Pá Food
Elias
Restauração Snack-Bar Café
Nordeste, Nordeste (+351)296488403 Elias
Escuna (Hotel Marina Atlântico)
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296307900 Escuna (Hotel Marina Atlântico)
Espinha.Come
Restauração Restaurante
Povoação, Furnas (+351)296588204 Espinha.Come
Estrela Da Noite
Restauração Restaurante Pizzaria
Ribeira Grande, Rabo de Peixe (+351)296491025 (+351)917403185 Estrela Da Noite
Estrela Do Mar
Restauração Restaurante
Vila Franca do Campo, São Miguel (+351)296583060 (+351)912667534 Estrela Do Mar
ETC. Osteria Bar (Nine Dots Hotel)
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296242570 etc@ninedotsazores.com ETC. Osteria Bar (Nine Dots Hotel)
Faialense
Restauração Snack-Bar
Povoação, Faial da Terra (+351)296586050 Faialense
Família
Restauração Restaurante
Ribeira Grande, Ribeira Seca (+351)296712597 Família
Farol
Restauração Restaurante
Ponta Delgada, São José (+351)296283698 restaurantefarol2016@gmail.com Farol
Fim De Século
Restauração Restaurante Bar
Ribeira Grande, Maia (+351)296442787 Fim De Século
Fish 22
Restauração Restaurante Snack-Bar Take Away
Ponta Delgada, São Sebastião (+351)967346666 ana.maria.simas@sapo.pt 
Floresta Lisbonense
Restauração Restaurante
Ponta Delgada, São José (+351)296283407
Focaccia
Restauração Restaurante Bar
Ponta Delgada, São Sebastião (+351)296282196 (+351)961132446 geral@focacciaazores.pt 
Fontenário
Restauração Restaurante
Ponta Delgada, Fajã de Cima (+351)296638400 (+351)965831121 luis-miguel-raposo@hotmail.com Fontenário
Forneria São Dinis
Restauração Restaurante Pizzaria Take Away
Ponta Delgada, São José (+351)296286238 (+351)968844995 Forneria São Dinis
Forno d’Aldeia
Restauração Restaurante
Ribeira Grande, Maia (+351)296446566
Forte Terrace – Food & Drinks
Restauração Restaurante
Ponta Delgada, São Roque (+351)918257272 saoroque@gmail.com Forte Terrace – Food & Drinks
Fresco & Pronto
Restauração Restaurante Churrasqueira Take Away
Ponta Delgada, São José (+351)926439248 Fresco & Pronto
Fresh N Hot Pizza Spot 2
Restauração Restaurante Pizzaria
Ponta Delgada, São Sebastião (+351)914745771 Fresh N Hot Pizza Spot 2
Fuji – Sushi Experience
Restauração Restaurante
Ponta Delgada, São Pedro (+351)961133002 geral@fuji-sushiexperience.pt Fuji – Sushi Experience
Furnas Lake
Restauração Restaurante
Povoação, Furnas (+351)296584107 Furnas Lake
Galeria33
Restauração Restaurante Bar
Ribeira Grande, Matriz (+351)296472152 galeria33azoreanbar@gmail.com Galeria33
Garden Side
Restauração Restaurante Pizzaria
Lagoa , Nossa Senhora do Rosário (+351)296916746 Garden Side
Gastrónomo
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296381095 Gastrónomo
Gazcidla
Restauração Restaurante
Ponta Delgada, Mosteiros (+351)296915469 Gazcidla
Green Love Azores
Restauração Restaurante
Ponta Delgada, Sete Cidades (+351)296915214 (+351)914229699 Green Love Azores
Grená
Restauração Snack-Bar
Povoação, Furnas Grená
H3
Restauração Restaurante Hamburgaria
Ponta Delgada, São José (+351)296287088 H3
Haibu
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296306610 Haibu
Hot-Dog Silva
Restauração Restaurante Snack-Bar
Ribeira Grande, Matriz (+351)915413317
Hotel VIP Executive
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296000100 Hotel VIP Executive
III Arcos
Restauração Restaurante
Ponta Delgada, Ginetes (+351)296295402 III Arcos
Ilhéu
Restauração Restaurante
Ponta Delgada, Mosteiros (+351)296915269
Indian Kebab House
Restauração Restaurante Take Away
Ponta Delgada, São José (+351)920343768
Já Se Sabe
Restauração Restaurante
Povoação, Furnas (+351)296588442 Já Se Sabe
Jáagora
Restauração Restaurante Take Away
Ribeira Grande, Conceição (+351)296477765 
Jardim
Restauração Restaurante
Povoação, Povoação (+351)296585413 Jardim
Jewel Of India
Restauração Restaurante
Ponta Delgada, São José (+351)296284374
Jonny’s SmokeHouse
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296629404
KFC (Parque Atlântico)
Restauração Fast Food
Ponta Delgada, São José (+351)934899198 KFC (Parque Atlântico)
KFC (São Gonçalo)
Restauração Fast Food
Ponta Delgada, São Sebastião (+351)933019825 KFC (São Gonçalo)
Koi (Hotel Azoris Royal Garden)
Restauração Restaurante
Ponta Delgada, São José (+351)296307300 Koi (Hotel Azoris Royal Garden)
Lagoa Azul
Restauração Restaurante
Ponta Delgada, Sete Cidades (+351)296915678 (+351)916405896
Lan’s Pizzaria, Exotic Food & Vegetariana
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296284150 Lan’s Pizzaria, Exotic Food & Vegetariana
Lanchonete Da Cidade
Restauração Restaurante Hamburgaria
Ponta Delgada, Fajã de Baixo (+351)296654104 Lanchonete Da Cidade
Lapsa Garden
Restauração Restaurante
Ponta Delgada, Relva (+351)911829528 Lapsa Garden
Lava (Hotel The Lince)
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296630000 Lava (Hotel The Lince)
Lectus
Restauração Restaurante Café
Ribeira Grande, Conceição (+351)296702767 (+351)919130977 c.lectus@gmail.com Lectus
Let’s Go Mexican Food
Restauração Restaurante
Ponta Delgada, Fajã de Baixo (+351)296381639 (+351)965884909 Let’s Go Mexican Food
Louvre Michaelense Bistro
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)938346886 Louvre Michaelense Bistro
Lua Do Sul
Restauração Pizzaria
Vila Franca do Campo, São Pedro (+351)296581156 luadosul@sapo.pt Lua Do Sul
Lugar Da Praia (Hotel Pestana Bahia Praia)
Restauração Restaurante
Vila Franca do Campo (+351)296539130 Lugar Da Praia (Hotel Pestana Bahia Praia)
Magma
Restauração Restaurante
Ponta Delgada, Fajã de Baixo (+351)296100900 Magma
Mané Cigano
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296285765
Maré Cheia
Restauração Restaurante
Ribeira Grande, Porto Formoso (+351)296446625 
Mare Nostrum
Restauração Restaurante Bar
Ribeira Grande, Matriz (+351)296470310 marenostrum.pt Mare Nostrum
Mariserra
Restauração Restaurante
Ponta Delgada, Fajã de Baixo (+351)296636495 (+351)961935705 Mariserra
Mascote
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296284399 Mascote
McDonald’s
Restauração Fast Food
Ponta Delgada, São Pedro (+351)296385396 McDonald’s
McDonald’s
Restauração Fast Food
Ribeira Grande, Ribeira Seca (+351)296922072 McDonald’s
McDonald’s (Parque Atlântico)
Restauração Fast Food
Ponta Delgada, São José (+351)296249714 McDonald’s (Parque Atlântico)
Meia Nau (Hotel Pedras Do Mar)
Restauração Restaurante
Ponta Delgada, Fenais da Luz (+351)296249300 Meia Nau (Hotel Pedras Do Mar)
Menu
Restauração Restaurante
Ponta Delgada, São Pedro (+351)925722280 Menu
Mercado Da Vila
Restauração Restaurante
Vila Franca do Campo, São Miguel (+351)296102057 Mercado Da Vila
Mercado Do Peixe
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296708839
Mercearia São Pedro Wine & Tapas
Restauração Restaurante Tapas Bar
Ponta Delgada, São Pedro (+351)296711418 (+351)910738880 Mercearia São Pedro Wine & Tapas
Michel Restaurant
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296700385 Michel Restaurant
Miroma
Restauração Restaurante
Povoação, Furnas (+351)296584422 Miroma
Moagem
Restauração Restaurante Café
Nordeste, Salga (+351)296462192 Moagem
Momentos Cozinha D’Autor
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296628412 (+351)917592513 Momentos Cozinha D’Autor
Mômô (Sensi Azores Nature & Spa)
Restauração Restaurante
Ponta Delgada, Ginetes (+351)296248260 Mômô (Sensi Azores Nature & Spa)
Monte Verde
Restauração Restaurante
Ribeira Grande, Matriz (+351)296472975 Monte Verde
Mr. Pizza
Restauração Pizzaria
Lagoa , Nossa Senhora do Rosário (+351)296912291 Mr. Pizza
Musa
Restauração Restaurante
 (+351)967199213 reservations@thefarmazores.com Musa
Musaxi
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296288652 Musaxi
N9ve – Segredos Dos Açores
Restauração Restaurante
Ponta Delgada, Relva (+351)939665959 N9ve – Segredos Dos Açores
Nacional
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)913403080 Nacional
Nako
Restauração Restaurante Take Away
Ponta Delgada, São Sebastião (+351)296650270 Nako
Namaste India
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)920343768 Namaste India
Nana Coffee
Restauração Snack-Bar
Ribeira Grande, Matriz (+351)965895579 Nana Coffee
Ned Kelly’s Irish Pub & Grill
Restauração Restaurante
Ponta Delgada, São Sebastião Ned Kelly’s Irish Pub & Grill
No Carvão
Restauração Restaurante Churrasqueira
Ponta Delgada, São Sebastião (+351)296384083 (+351)919323701 No Carvão
Nonnas Teeth & Tomatoes
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)967575701 Nonnas Teeth & Tomatoes
North Sushi
Restauração Restaurante
Ribeira Grande, Ribeira Grande (+351)924364676
O Alambique
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296706270 (+351)913316743 restauranteoalambique@sapo.pt O Alambique
O Américo De Barbosa
Restauração Restaurante
Ponta Delgada, Mosteiros (+351)296915353 (+351)919802242 
O Avião
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296285740 O Avião
O Baco (Hotel Ponta Delgada)
Restauração Restaurante
Ponta Delgada, São José (+351)296209480 (+351)960494372 O Baco (Hotel Ponta Delgada)
O Calço
Restauração Restaurante
Ponta Delgada, São José (+351)296285850 
O Canadiano
Restauração Restaurante Pizzaria
Ponta Delgada, São José (+351)296286433 O Canadiano
O Canadiano
Restauração Restaurante Pizzaria
Ribeira Grande, Matriz (+351)296473621 (+351)918620841 pizariaocanadiano@gmail.com O Canadiano
O Canadiano (Mercado)
Restauração Restaurante Pizzaria
Ribeira Grande, Matriz (+351)296085698 pizariaocanadiano@gmail.com O Canadiano (Mercado)
O Carlos
Restauração Restaurante Cervejaria
Lagoa , Nossa Senhora do Rosário (+351)296912345 O Carlos
O Chico
Restauração Restaurante Snack-Bar
Ponta Delgada, Mosteiros (+351)962614521
O Churrasco
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296710656 (+351)913578236 O Churrasco
O Cordeirinho
Restauração Restaurante
Ribeira Grande, Lomba da Maia (+351)296446573 (+351)918842021 O Cordeirinho
O Correia
Restauração Restaurante
Ribeira Grande, Matriz (+351)296472731 (+351)933461609 O Correia
O Emigrante
Restauração Restaurante
Ponta Delgada, Capelas (+351)296298847 O Emigrante
O Emigrante
Restauração Restaurante
Ponta Delgada, Capelas (+351)964345147
O Esgalha
Restauração Restaurante
Ribeira Grande, Matriz (+351)296473147 (+351)919402443 O Esgalha
O Estradinho
Restauração Restaurante
Ponta Delgada, São José (+351)296287052
O Estrela
Restauração Restaurante Bar
Ribeira Grande, Maia (+351)296442407
O Farias
Restauração Restaurante
Ribeira Grande, Matriz (+351)296472188 (+351)917725881 O Farias
O Ferreirinha
Restauração Restaurante Café
Nordeste, Nordeste (+351)296488286 
O Galego
Restauração Restaurante
Ponta Delgada, São Roque (+351)296700857 O Galego
O Garoto
Restauração Snack-bar
Povoação, Povoação (+351)296559157 (+351)915356546
O Giro
Restauração Restaurante
Ponta Delgada, São José (+351)296287062 O Giro
O Grelhador
Restauração Restaurante
Ribeira Grande, Rabo de Peixe (+351)296492134 O Grelhador
O Ildeberto (Hotel Ribeira Grande)
Restauração Restaurante
Ribeira Grande, Matriz (+351)296473488 O Ildeberto (Hotel Ribeira Grande)
O Mariñeiro
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296702482 O Mariñeiro
O Micaelense
Restauração Restaurante
Ponta Delgada, Ginetes (+351)296295957 O Micaelense
O Moinho Terrace Café
Restauração Restaurante Snack-Bar
Ribeira Grande, Porto Formoso (+351)296442110 O Moinho Terrace Café
O Museu
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296285499 O Museu
O Patanisca
Restauração Restaurante
Ponta Delgada, São José (+351)296718224 O Patanisca
O Pescador
Restauração Restaurante
Ribeira Grande, Rabo de Peixe (+351)925105405 O Pescador
O Raião
Restauração Restaurante
Ponta Delgada, Candelária (+351)912099860 O Raião
O Riquim
Restauração Restaurante
Povoação, Povoação (+351)296585552 (+351)925340594 O Riquim
O Silva
Restauração Restaurante
Ribeira Grande, Ribeira Seca (+351)296472641 O Silva
O Sole Mio (Ginetes)
Restauração Restaurante
Ponta Delgada, Ginetes (+351)296915589 O Sole Mio (Ginetes)
O Sole Mio (S. Vicente Ferreira)
Restauração Restaurante
Ponta Delgada, São Vicente Ferreira (+351)296911453 O Sole Mio (S. Vicente Ferreira)
Oceanside By Gelataria Tomé
Restauração Restaurante
Ponta Delgada, São Roque (+351)296636622 Oceanside By Gelataria Tomé
Ohyo Sushi Lounge
Restauração Restaurante
Ribeira Grande, Matriz (+351)296473023
Oi Cara
Restauração Restaurante
Ribeira Grande, Matriz (+351)919836349 Oi Cara
Oishi
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296281395 (+351)968607657 Oishi
Oishi
Restauração Restaurante
Ponta Delgada, São José (+351)296281395 (+351)968607658 Oishi
Ondas Do Mar
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296916514 Ondas Do Mar
Os Caldeirões
Restauração Snack-Bar Café
Nordeste, Achada (+351)917373241 snackbarcaldeiroes@hotmail.com
Os Frades
Restauração Restaurante
Ribeira Grande, Conceição (+351)919111930 Os Frades
Os Melos
Restauração Restaurante
Nordeste, Achadinha (+351)296452477 (+351)964814721 Os Melos
Õtaka
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)919312080 Õtaka
P’alma Sushi
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)962365485 P’alma Sushi
Pacheco Snacks & Drinks
Restauração Snack-Bar
Ribeira Grande, Matriz (+351)917908678 Pacheco.snacks@gmail.com Pacheco Snacks & Drinks
Paladares Da Quinta
Restauração Restaurante
Lagoa , Nossa Senhora do Rosário (+351)296965306 Paladares Da Quinta
Palm Terrace Café (Hotel Talisman)
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296308500 Palm Terrace Café (Hotel Talisman)
Pans & Company
Restauração Fast Food
Ponta Delgada, São José (+351)932222150 Pans & Company
Paparoca
Restauração Restaurante
Vila Franca do Campo, São Pedro (+351)296583106 Paparoca
Paparoca (Parque Atlântico)
Restauração Restaurante
Ponta Delgada, São José (+351)296284529 Paparoca (Parque Atlântico)
Paparoca (Solmar S. Gonçalo)
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296285777 Paparoca (Solmar S. Gonçalo)
Paraíso
Restauração Restaurante Snack-Bar
Ponta Delgada, São José (+351)925677007 
Paraíso Das Delícias
Restauração Restaurante
Ponta Delgada, São José (+351)912203382
Paraíso Do Milénio
Restauração Restaurante
Lagoa , Água de Pau (+351)296702366 (+351)915072946 Paraíso Do Milénio
Patricio
Restauração Pizzaria
Vila Franca do Campo, São Pedro (+351)296583287 Patricio
Pecado Açoriano
Restauração Restaurante
Ribeira Grande, Matriz (+351)961558009 Pecado Açoriano
Pedro Homem Bistro Cocktail & Wine
Restauração Restaurante Bar
Ponta Delgada, São Sebastião (+351)926311144 Pedro Homem Bistro Cocktail & Wine
Pérola do Oceano
Restauração Restaurante
Lagoa , Água de Pau (+351)296913161
Pic Nic
Restauração Snack-Bar Pub
Povoação, Povoação (+351)296585586
Pizza Al Taglio by Arte Gourmet
Restauração Pizzaria
Lagoa, Nossa Senhora do Rosário (+351)916470572
Pizza Hut
Restauração Fast Food
Ponta Delgada, São José (+351)932222173 Pizza Hut
Pizza Time and Chicken
Restauração Restaurante Take Away
Ponta Delgada, São Pedro (+351)296654812 Pizza Time and Chicken
Pizzaria Estrela Da Noite (Arrifes)
Restauração Restaurante Café Cervejaria
Ponta Delgada, Arrifes (+351)296683367 Pizzaria Estrela Da Noite (Arrifes)
Pizzaria Estrela Da Noite (PDL)
Restauração Restaurante Café Cervejaria
Ponta Delgada, São Sebastião (+351)918052195 Pizzaria Estrela Da Noite (PDL)
Pizzaria Time & Chicken
Restauração Restaurante Take Away
Ponta Delgada, São Sebastião (+351)296654040 Pizzaria Time & Chicken
Poço Azul
Restauração Restaurante
Nordeste, Achadinha (+351)296452151 Poço Azul
Ponta Do Garajau
Restauração Restaurante
Povoação, Ribeira Quente (+351)296584678 (+351)961491268 Ponta Do Garajau
Porto Da Espada
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296708417
Porto Das Baleias
Restauração Restaurante
Ponta Delgada, São Vicente Ferreira (+351)296703224 Porto Das Baleias
Primavera
Restauração Restaurante
Ribeira Grande, Conceição (+351)296472208 Primavera
Provisório
Restauração Restaurante Bar
Ponta Delgada, São Pedro (+351)296702976 Provisório
Pupu Bowls (Poke & Açaí Bowls)
Restauração Restaurante
Ponta Delgada, São Pedro
Queijaria Furnense
Restauração Restaurante
Povoação, Furnas (+351)296588134 Queijaria Furnense
Quinta Dos Açores
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296653412 Quinta Dos Açores
Quinta Dos Sabores
Restauração Restaurante
Ribeira Grande, Rabo de Peixe (+351)917003020 Quinta Dos Sabores
Ramen Bambu Açores
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)968127732 Ramen Bambu Açores
Ramires
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296629223 Ramires
Reserva Bar
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)910543159 Reserva Bar
Rodízio Grill
Restauração Restaurante
Ponta Delgada, São José (+351)296477467 Rodízio Grill
Rosárium Pizza Italiana
Restauração Pizzaria
Lagoa , Nossa Senhora do Rosário (+351)296916251 Rosárium Pizza Italiana
Rotas Da Ilha Verde
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296628560 Rotas Da Ilha Verde
Rúben Bifana
Restauração Restaurante
Ribeira Grande, Matriz Rúben Bifana
Rústico
Restauração Restaurante
Ponta Delgada, Fajã de Baixo (+351)919294000 Rústico
Sabor De Vida
Restauração Restaurante Gelataria
Ribeira Grande, Matriz (+351)296713204 Sabor De Vida
Sabores Da Terra
Restauração Restaurante
Povoação, Povoação (+351)296585286
Sabores Da Vizinha
Restauração Restaurante
Vila Franca do Campo, São Miguel (+351)296713524 Sabores Da Vizinha
Sabores Do Velho
Restauração Restaurante
Ponta Delgada, Capelas (+351)296989340 (+351)914229699 Sabores Do Velho
Saca Rolhas Taberna
Restauração Restaurante
Ponta Delgada, Relva (+351)296716747 Saca Rolhas Taberna
Sal Grosso
Restauração Restaurante
Ponta Delgada, Arrifes (+351)913956386 Sal Grosso
Santa Bárbara Eco Beach Resort
Restauração Restaurante Gelataria
Ribeira Grande, Ribeira Grande (+351)296470360 Santa Bárbara Eco Beach Resort
Santo Seitan
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)925348233 Santo Seitan
São Nicolau
Restauração Restaurante
Ponta Delgada, Sete Cidades (+351)916138002 
São Pedro
Restauração Restaurante
Ponta Delgada, São José (+351)296285276 São Pedro
Scorpion Café
Restauração Restaurante Café
Vila Franca do Campo, Ponta Garça (+351)296587220 (+351)914757119 
Silêncio das Palavras
Restauração Restaurante Gelataria
Ribeira Grande, Porto Formoso (+351)916593158 
Snack Bar Carlos Freire
Restauração Restaurante Gelataria
Ribeira Grande, Ribeira Grande (+351)296703009 Snack Bar Carlos Freire
Só Grelhados
Restauração Restaurante Take Away
Lagoa , Nossa Senhora do Rosário (+351)296916647 Só Grelhados
SóGrelhados
Restauração Restaurante Grelhados Pizzaria Take Away
Ribeira Grande, Ribeira Grande (+351)296716302 sogrelhados.rg2@hotmail.com SóGrelhados
Solar Do Conde
Restauração Restaurante
Ponta Delgada, Capelas (+351)296298887 Solar Do Conde
Solar Rei Dos Frangos
Restauração Restaurante
Ponta Delgada, São Vicente Ferreira (+351)296911074 Solar Rei Dos Frangos
Stage Restaurant
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296284231 Stage Restaurant
Subway
Restauração Fast Food
Ponta Delgada, São Sebastião (+351)296281144 Subway
Subway
Restauração Fast Food
Ponta Delgada, São José (+351)296281144 Subway
Summer Breeze
Restauração Restaurante
Povoação, Furnas (+351)296588363 Summer Breeze
Sunset Beach Rest. & Bar
Restauração Restaurante Bar
Ponta Delgada, Livramento (+351)296642164 Sunset Beach Rest. & Bar
Super Prato
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)963413501 Super Prato
Supléxio – Handmade Burgers
Restauração Restaurante Hamburgaria
Ponta Delgada, São Sebastião Supléxio – Handmade Burgers
Sushiki
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296282288 Sushiki
Tã Gente
Restauração Restaurante Bar
Ponta Delgada, São Sebastião (+351)919277076 Tã Gente
Taberna Açor
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296629084 Taberna Açor
Taberna na Boavista
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)965227878 Taberna na Boavista
Taco Bell
Restauração Fast Food
Ponta Delgada, São José (+351)932022075 Taco Bell
Take Off
Restauração Restaurante
Ponta Delgada, Relva (+351)963866990
Tápront
Restauração Restaurante Take Away
Ribeira Grande, Rabo de Peixe (+351)296010250 Tápront
Tasquinha Vieira
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)969861130 Tasquinha Vieira
Terra Nostra – The Gardener Bar & Terrace
Restauração Restaurante
Povoação, Furnas (+351)296549090 tngh@bhc.pt Terra Nostra – The Gardener Bar & Terrace
Terra Nostra – TN Sushi Bar
Restauração Restaurante
Povoação, Furnas (+351)296549091 tngh@bhc.pt Terra Nostra – TN Sushi Bar
Terracota (Hotel Verde Mar)
Restauração Restaurante
Ribeira Grande, Matriz (+351)296247710 (+351)296247719 Terracota (Hotel Verde Mar)
Terras Restaurant & Brunch
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)934358575 Terras Restaurant & Brunch
The Lince Nordeste Country & Nature
Restauração Restaurante
Nordeste, Nordeste (+351)296101390 The Lince Nordeste Country & Nature
Time & Chicken
Restauração Restaurante Pizzaria
Ribeira Grande, Matriz (+351)296474300 (+351)918705049 Time & Chicken
Time & Chicken
Restauração Restaurante Pizzaria
Lagoa , Nossa Senhora do Rosário (+351)296916700 Time & Chicken
Tio Lanches
Restauração Restaurante Hamburgaria Snack-bar Take Away
Ribeira Grande, Ribeira Grande (+351)937802949 Tio Lanches
TiXico
Restauração Restaurante
Ponta Delgada, São Pedro (+351)296704340 TiXico
Tomatino
Restauração Restaurante
Ponta Delgada, São José (+351)296249135 Tomatino
Tony’s
Restauração Restaurante
Povoação, Furnas (+351)296584290 (+351)296584632 tonys@sapo.pt Tony’s
Tony’s
Restauração Snack-Bar
Povoação, Furnas (+351)296584290 tonys@sapo.pt Tony’s
Tonys
Restauração Restaurante
Povoação, Furnas (+351)296584290 (+351)296584632 tonys@sapo.pt Tonys
Trianon
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296283734 Trianon
Trincadela
Restauração Restaurante Snack-bar
Ribeira Grande, Rabo de Peixe (+351)296492057 Trincadela
Tronqueira
Restauração Restaurante
Nordeste, Nordeste (+351)296488292 (+351)961770896 Tronqueira
Tuká Tulá
Restauração Restaurante Gelataria
Ribeira Grande, Ribeira Seca (+351)296477647 (+351)926532079 Tuká Tulá
Universo
Restauração Restaurante Snack-Bar
Vila Franca do Campo, São Miguel (+351)296583233 (+351)966499824 Universo
Valados
Restauração Restaurante
Ponta Delgada, Relva (+351)296715140 Valados
Vale Das Furnas
Restauração Restaurante
Povoação, Furnas (+351)296584307 Vale Das Furnas
Vapore Bar & Lounge (Grand Hotel)
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296302200 Vapore Bar & Lounge (Grand Hotel)
Versátil (Hotel Vila Galé)
Restauração Restaurante
Ponta Delgada, São José (+351)296240430
Vila
Restauração Snack-Bar
Nordeste, Nordeste (+351)296488325 (+351)913985966 paullo.medeiros@hotmail.com Vila
Villa Paim
Restauração Restaurante
Ponta Delgada, São José (+351)296285700 Villa Paim
Vitaminas
Restauração Restaurante
Ponta Delgada, São José (+351)932650002
Wok To Walk
Restauração Restaurante
Ponta Delgada, São José (+351)935271125 Wok To Walk
Xitaka
Restauração Restaurante
Ponta Delgada, São José (+351)296284072 Xitaka
Xurrex
Restauração Restaurante Take Away
Ponta Delgada, São Sebastião (+351)296653449 Xurrex
Yarsagumba
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296713313 Yarsagumba
Yummy
Restauração Restaurante
Ponta Delgada, São Sebastião (+351)296285197 (+351)927373386 Yummy
Yuzu Ramen
Restauração Restaurante
Ponta Delgada (+351)937886800`;

const lines = rawText.split('\n').filter(l => l.trim() !== '');
const restaurants = [];

for (let i = 0; i < lines.length; i += 3) {
    const name = lines[i]?.trim();
    let cuisine = lines[i + 1]?.trim() || '';
    cuisine = cuisine.replace(/^Restauração\s+/, ''); // Remove prefix
    
    const contactLine = lines[i + 2]?.trim() || '';
    
    // Extract Island (Simplified: mapping common parishes to PDL/SMG)
    // Actually, I'll just look for the first part before the comma
    const locationParts = contactLine.split(',');
    const town = locationParts[0]?.trim();
    
    // Extract phones: look for (+351) followed by numbers
    const phones = contactLine.match(/\(\+351\)\d+/g) || [];
    const phone = phones.join(' ');
    
    // Extract emails: look for @
    const emails = contactLine.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const email = emails[0] || '';
    
    // Extract Address: part before phones/emails
    let address = contactLine;
    if (phones.length > 0) address = address.split(phones[0])[0].trim();
    else if (email) address = address.split(email)[0].trim();
    
    // Clean address from repeated name at the end if exists
    // The pattern seems to be: Name \n Category \n Location Phone Email Name
    // So the address is everything before the first phone/email
    
    restaurants.push({
        id: `R${Date.now()}_${i}`,
        name: name,
        island: 'PDL', // Default to PDL for these Michaelense restaurants
        cuisine: cuisine,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
        description: `${cuisine} localizado em ${address}.`,
        phone: phone,
        address: address,
        publicEmail: email,
        adminEmail: `${name.toLowerCase().replace(/\s+/g, '')}@azores4you.com`,
        adminPassword: 'admin',
        dishes: []
    });
}

fs.writeFileSync('new_restaurants.json', JSON.stringify(restaurants, null, 2));
console.log(`Parsed ${restaurants.length} restaurants.`);
