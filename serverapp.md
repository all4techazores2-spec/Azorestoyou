# Azores4you - Arquitetura & Guia Técnico (serverapp)

Este documento serve como referência para a configuração de produção da plataforma Azores4you.

## 1. Arquitetura de Produção
A aplicação está dividida em duas partes para máxima performance:
- **Frontend:** Ficheiros estáticos publicados manualmente no **Cloudflare Workers**, no Worker `azorestoyou`, ligado a `azorestoyou.pt` e `www.azorestoyou.pt`.
- **Backend (API):** Alojado no **Render** (`https://azorestoyou-1-5a87.onrender.com`).
- **Media:** Fotografias e vídeos no **Cloudinary**, apresentados por links HTTPS.
- **Dados:** Base de dados **MongoDB**, com a ligação definida no ambiente do servidor.

## 2. Configurações Críticas de Conectividade
O ficheiro `App.tsx` (e os dashboards) usa uma lógica dinâmica para detetar onde está a correr:
- **Local:** Liga-se a `http://localhost:3001`.
- **Produção (Cloudflare):** Liga-se ao endereço do **Render** definido em `config.ts`. Os componentes partilham essa configuração.

### Normalização de Imagens
Novas fotografias e vídeos da comunidade são enviados diretamente para o Cloudinary, com autorização assinada pelo servidor. A app guarda e apresenta os links devolvidos. Caminhos relativos antigos, como `/imagens/restaurante1.jpg`, continuam a ser resolvidos através do endereço do Render.

## 3. Manutenção da Base de Dados (db.json)
**Cuidado com o BOM:** Ficheiros JSON não podem ter caracteres invisíveis no início (UTF-8 BOM). 
- Se o banco de dados falhar a carregar (exibindo "0 restaurantes"), verifique a sintaxe do `db.json`.

## 4. Comandos de Atualização (PowerShell)
Para gerar os ficheiros do site localmente, sem publicar:

```powershell
npm run build:local
```

## 5. Como Monitorizar
- **Cloudflare Workers → azorestoyou → Deployments:** Publicação manual da pasta `dist` do site. Manter os domínios atuais; esta migração não exige alterar os registos DNS.
- **Render Dashboard -> Logs:** Para ver se a base de dados e as reservas estão a ser processadas corretamente.
