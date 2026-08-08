import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import https from 'https';
import selfsigned from 'selfsigned';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const LOCAL_IP = '192.168.1.194';

// Caminhos de Dados
const imagesPath = path.join(__dirname, '../imagens');
const dataPath = path.join(__dirname, 'data/restaurants.json');
const usersPath = path.join(__dirname, 'data/users.json');

app.use(cors());
app.use(express.json());
app.use('/imagens', express.static(imagesPath));

// Funções Auxiliares para Dados
const readData = () => {
  try {
    return fs.readJsonSync(dataPath);
  } catch (error) {
    console.error('Erro ao ler restaurantes:', error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeJsonSync(dataPath, data, { spaces: 2 });
  } catch (error) {
    console.error('Erro ao gravar restaurantes:', error);
  }
};

const readUsers = () => {
  try {
    if (!fs.existsSync(usersPath)) {
      fs.writeJsonSync(usersPath, [], { spaces: 2 });
      return [];
    }
    return fs.readJsonSync(usersPath);
  } catch (error) {
    console.error('Erro ao ler utilizadores:', error);
    return [];
  }
};

const writeUsers = (data) => {
  try {
    fs.writeJsonSync(usersPath, data, { spaces: 2 });
  } catch (error) {
    console.error('Erro ao gravar utilizadores:', error);
  }
};

// Configuração do Multer para armazenamento de ficheiros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Multer pode não ter o body povoado aqui se os campos vierem depois do ficheiro
    // Por isso usamos a pasta raiz de restaurantes por defeito
    const uploadPath = path.join(imagesPath, 'restaurantes');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ---------------------------------------------------------
// ROTAS DA API
// ---------------------------------------------------------

// 1. Obter todos os restaurantes (Usado pelo Cliente e Admin)
app.get('/api/restaurants', (req, res) => {
  const restaurants = readData();
  res.json(restaurants);
});

// 2. Upload de Imagem (com lógica de movimento para subpasta)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum ficheiro enviado.' });

  const { restaurantId } = req.body;
  const actualFilename = req.file.filename;
  const currentPath = req.file.path;
  
  let relativePath = `/imagens/restaurantes/${actualFilename}`;
  
  if (restaurantId) {
    const targetFolder = path.join(imagesPath, 'restaurantes', restaurantId);
    fs.ensureDirSync(targetFolder);
    const targetPath = path.join(targetFolder, actualFilename);
    
    if (currentPath !== targetPath) {
      fs.moveSync(currentPath, targetPath, { overwrite: true });
    }
    relativePath = `/imagens/restaurantes/${restaurantId}/${actualFilename}`;
  }
    
  const fullUrl = `http://${LOCAL_IP}:${PORT}${relativePath}`;
  console.log(`Upload concluído: ${fullUrl}`);
  
  res.json({ url: fullUrl, filename: actualFilename, path: relativePath });
});

// 3. Atualizar Restaurante (Ementa, Definições, Galeria, etc.)
app.put('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const updatedBusiness = req.body;
  const restaurants = readData();
  
  const index = restaurants.findIndex(r => r.id === id);
  if (index !== -1) {
    restaurants[index] = { ...restaurants[index], ...updatedBusiness };
    writeData(restaurants);
    res.json(restaurants[index]);
  } else {
    res.status(404).json({ error: 'Restaurante não encontrado' });
  }
});

// 4. Criar Reserva
app.post('/api/restaurants/:id/reservations', (req, res) => {
  const { id } = req.params;
  const reservation = req.body;
  console.log(`--- TENTATIVA DE RESERVA RECEBIDA ---`);
  console.log(`Restaurante ID: ${id}`);
  console.log(`Cliente: ${reservation.customerName}`);

  const restaurants = readData();
  const index = restaurants.findIndex(r => r.id === id);
  
  if (index !== -1) {
    if (!restaurants[index].reservations) restaurants[index].reservations = [];
    
    const newRes = {
      ...reservation,
      id: 'RES_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    restaurants[index].reservations.push(newRes);
    writeData(restaurants);
    console.log(`✅ RESERVA GRAVADA COM SUCESSO NO FICHEIRO!`);
    res.status(201).json(newRes);
  } else {
    console.error(`❌ ERRO: Restaurante ${id} não encontrado!`);
    res.status(404).json({ error: 'Restaurante não encontrado' });
  }
});

// 5. Criar Pedido / Ordem (Cozinha)
app.post('/api/restaurants/:id/orders', (req, res) => {
  const { id } = req.params;
  const order = req.body;
  const restaurants = readData();
  
  const index = restaurants.findIndex(r => r.id === id);
  if (index !== -1) {
    if (!restaurants[index].orders) restaurants[index].orders = [];
    
    const newOrder = {
      ...order,
      id: 'ORD_' + Date.now(),
      status: 'preparing',
      createdAt: new Date().toISOString()
    };
    
    restaurants[index].orders.push(newOrder);
    writeData(restaurants);
    res.status(201).json(newOrder);
  } else {
    res.status(404).json({ error: 'Restaurante não encontrado' });
  }
});

// 6. Atualização em Massa (Usado pelo Super Admin)
app.post('/api/restaurants/bulk', (req, res) => {
  console.log('--- RECEBIDA ATUALIZAÇÃO EM MASSA DO SUPER ADMIN ---');
  const updatedList = req.body;
  
  if (!Array.isArray(updatedList)) {
    console.error('ERRO: Dados recebidos não são uma lista!');
    return res.status(400).json({ error: 'Lista inválida' });
  }
  
  console.log(`Sucesso: Recebidos ${updatedList.length} restaurantes para gravar.`);
  writeData(updatedList);
  res.json({ success: true });
});

// 7. Obter/Criar Utilizador (Persistência do Cliente)
app.get('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const users = readUsers();
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Criar novo utilizador se não existir
    user = {
      email,
      credits: 0,
      role: 'cliente',
      profile: {
        phone: '',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      },
      reservations: [],
      notifications: []
    };
    users.push(user);
    writeUsers(users);
  }
  
  res.json(user);
});

// 8. Atualizar Dados do Utilizador (Reservas, Créditos, Perfil)
app.put('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const updatedData = req.body;
  const users = readUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    writeUsers(users);
    res.json({ success: true, user: users[index] });
  } else {
    res.status(404).json({ error: 'Utilizador não encontrado' });
  }
});

// 9. Enviar Notificação Push (Append)
app.post('/api/users/:email/notifications', (req, res) => {
  const { email } = req.params;
  const notification = req.body;
  const users = readUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (index !== -1) {
    if (!users[index].notifications) users[index].notifications = [];
    users[index].notifications.unshift(notification); // Adicionar no topo
    writeUsers(users);
    console.log(`🔔 Notificação enviada para ${email}: ${notification.text}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Utilizador não encontrado' });
  }
});

// ---------------------------------------------------------
// INTEGRAÇÃO WHATSAPP (Meta Cloud API)
// ---------------------------------------------------------

// 10. Verificação do Webhook (handshake exigido pela Meta ao configurar o endpoint)
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const restaurants = readData();
  const isKnownVerifyToken = restaurants.some(r => r.integrations?.whatsapp?.verifyToken === token);

  if (mode === 'subscribe' && isKnownVerifyToken) {
    console.log('✅ Webhook WhatsApp verificado com sucesso.');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// 11. Receção de Mensagens WhatsApp
app.post('/webhook/whatsapp', (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const phoneNumberId = change?.metadata?.phone_number_id;
    const incoming = change?.messages?.[0];

    if (phoneNumberId && incoming) {
      const restaurants = readData();
      const index = restaurants.findIndex(r => r.integrations?.whatsapp?.phoneNumberId === phoneNumberId);

      if (index !== -1) {
        const contact = change.contacts?.[0];
        if (!restaurants[index].inboxMessages) restaurants[index].inboxMessages = [];

        restaurants[index].inboxMessages.unshift({
          id: incoming.id || ('wa_' + Date.now()),
          source: 'WhatsApp',
          direction: 'in',
          sender: contact?.profile?.name || incoming.from,
          senderPhone: incoming.from,
          text: incoming.text?.body || '[Mensagem não suportada]',
          time: new Date().toISOString()
        });

        writeData(restaurants);
        console.log(`📩 Mensagem WhatsApp recebida para ${restaurants[index].name}: ${incoming.text?.body}`);
      } else {
        console.warn(`⚠️ Mensagem WhatsApp recebida para phoneNumberId desconhecido: ${phoneNumberId}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao processar webhook WhatsApp:', error);
    res.sendStatus(200); // Responder sempre 200 para a Meta não repetir o envio
  }
});

// 12. Envio de Resposta via WhatsApp
app.post('/api/restaurants/:id/inbox/send', async (req, res) => {
  const { id } = req.params;
  const { to, text } = req.body;
  const restaurants = readData();
  const index = restaurants.findIndex(r => r.id === id);

  if (index === -1) return res.status(404).json({ error: 'Restaurante não encontrado' });

  const whatsapp = restaurants[index].integrations?.whatsapp;
  if (!whatsapp?.phoneNumberId || !whatsapp?.accessToken) {
    return res.status(400).json({ error: 'Integração WhatsApp não configurada para este negócio.' });
  }

  try {
    const metaRes = await fetch(`https://graph.facebook.com/v20.0/${whatsapp.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsapp.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        text: { body: text }
      })
    });

    const metaData = await metaRes.json();
    if (!metaRes.ok) {
      console.error('Erro da API do WhatsApp:', metaData);
      return res.status(502).json({ error: 'Falha ao enviar mensagem via WhatsApp', details: metaData });
    }

    if (!restaurants[index].inboxMessages) restaurants[index].inboxMessages = [];
    restaurants[index].inboxMessages.unshift({
      id: 'out_' + Date.now(),
      source: 'WhatsApp',
      direction: 'out',
      sender: restaurants[index].name,
      senderPhone: to,
      text,
      time: new Date().toISOString()
    });
    writeData(restaurants);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    res.status(500).json({ error: 'Erro interno ao enviar mensagem.' });
  }
});

// Teste de conexão
app.get('/', (req, res) => res.send('Servidor Azores4you Ativo e Sincronizado!'));

app.listen(PORT, () => {
  console.log(`
=========================================
🚀 BACKEND RESTAURADO (HTTP)
🔗 Endereço: http://localhost:${PORT}
=========================================
  `);
});
