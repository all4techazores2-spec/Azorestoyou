# Azores4you - Arquitetura & Guia Técnico (serverapp)

Este documento serve como referência para a configuração de produção da plataforma Azores4you.

## 1. Arquitetura de Produção
A aplicação está dividida em duas partes para máxima performance:
- **Frontend:** Alojado no **Netlify** (`azorestoyou.pt`).
- **Backend (API):** Alojado no **Render** (`https://azorestoyou-1.onrender.com`).

## 2. Configurações Críticas de Conectividade
O ficheiro `App.tsx` (e os dashboards) usa uma lógica dinâmica para detetar onde está a correr:
- **Local:** Liga-se a `http://localhost:3001`.
- **Produção (Netlify):** Liga-se automaticamente ao link do **Render**.

### Normalização de Imagens
Como o backend está no Render, as imagens carregadas são guardadas lá. O sistema foi programado para:
1. Ler o caminho relativo do banco de dados (ex: `/imagens/restaurante1.jpg`).
2. Adicionar automaticamente o prefixo do Render para que a imagem apareça no site.

## 3. Manutenção da Base de Dados (db.json)
**Cuidado com o BOM:** Ficheiros JSON não podem ter caracteres invisíveis no início (UTF-8 BOM). 
- Se o banco de dados falhar a carregar (exibindo "0 restaurantes"), verifique a sintaxe do `db.json`.

## 4. Comandos de Atualização (PowerShell)
Sempre que fizer alterações no código local, use estes comandos para atualizar o site online:

```powershell
git add .
git commit -m "Descrição da atualização"
git push origin main
```

## 5. Como Monitorizar
- **Netlify Dashboard:** Para ver erros no site (Frontend).
- **Render Dashboard -> Logs:** Para ver se a base de dados e as reservas estão a ser processadas corretamente.
