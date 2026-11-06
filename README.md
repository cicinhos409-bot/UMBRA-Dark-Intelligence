# UMBRA Dark Intelligence · MVP

App Next.js para pesquisa de micropúblicos, descoberta de vídeos no YouTube e geração de conceitos editoriais.

## Stack
- Next.js 14 / React 18 / JavaScript
- CSS customizado (amber + dark UI)
- YouTube Data API v3 via route server-side
- 100 micropúblicos seed (10 países)
- Geração local de 50 títulos + resumos (templates; sem IA externa nesta versão)
- Salvos em localStorage

## Rodar localmente
```bash
npm install
cp .env.example .env.local
# preencha YOUTUBE_API_KEY
npm run dev
```
Acesse http://localhost:3000

Para usar localmente a chave que está configurada na Vercel, deixe `YOUTUBE_API_KEY` vazio em `.env.local` e configure:
```env
YOUTUBE_API_PROXY_URL=https://umbra-dark-intelligence.vercel.app/api/youtube
```
O servidor local encaminha as buscas à rota da Vercel; a chave continua apenas no servidor remoto. Não configure `YOUTUBE_API_PROXY_URL` na Vercel, pois isso faria a rota chamar a si mesma. Reinicie `npm run dev` após alterar `.env.local`.

## API oficial YouTube
1. Google Cloud Console: https://console.cloud.google.com/apis/library/youtube.googleapis.com
2. Ative YouTube Data API v3 e crie API key.
3. Restrinja a chave à API YouTube Data API v3.
4. Configure `YOUTUBE_API_KEY` em `.env.local` e em Vercel → Project Settings → Environment Variables.
5. Redeploy.

A chave é usada exclusivamente em `app/api/youtube/route.js`, no servidor. Não coloque chave em `NEXT_PUBLIC_*`. `YOUTUBE_API_PROXY_URL` é opcional e deve ser usado apenas no desenvolvimento local quando quiser encaminhar chamadas para uma implantação remota.

## Deploy Vercel
- Importe o repositório GitHub em https://vercel.com/new
- Framework preset: Next.js
- Adicione `YOUTUBE_API_KEY` nas variáveis de ambiente (Production, Preview e Development conforme necessário).
- Deploy.

## GitHub
Crie um repositório (recomendado privado), envie estes arquivos e conecte à Vercel. Não inclua `.env.local`.

## Como ler os dados
- Views e likes são números observados no momento da consulta, não prova de sucesso futuro.
- API Search + Videos consome quota do YouTube; `search.list` custa quota relevante. Use filtros e pesquise com intenção.
- “Micropúblicos” do JSON são hipóteses de audiência, não segmentos estatisticamente comprovados.
- Os 50 títulos são protótipos baseados em templates; revisar idioma, factualidade, originalidade e contexto cultural. Para títulos nativos melhores, integrar modelo de IA com API server-side.
- Não existe promessa de viralização/monetização. Testar CTR, retenção, satisfação, recorrência e elegibilidade YPP.
- Respeitar políticas do YouTube, direitos autorais e conteúdo original/autêntico.

## Próximos incrementos
- Integração LLM server-side para títulos nativos por idioma e análise de perspectiva.
- Persistência em Supabase (auth + workspace + oportunidades).
- Exportação CSV/JSON, score de oportunidade explicável e comparação de canais.
- Paginação (nextPageToken) e filtros avançados de canais.
