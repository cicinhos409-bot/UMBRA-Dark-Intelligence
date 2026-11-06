# UMBRA Dark Intelligence · MVP

App Next.js para pesquisa de micropúblicos, descoberta de vídeos no YouTube e geração de conceitos editoriais.

## Stack
- Next.js 14 / React 18 / JavaScript
- CSS customizado (amber + dark UI)
- YouTube Data API v3 via route server-side
- 322 micropúblicos de pesquisa (52 no Brasil e 30 em cada um dos outros nove países); os perfis são hipóteses editoriais, não segmentos validados.
- Geração local de 50 títulos + resumos (templates; sem IA externa nesta versão)
- Salvos em localStorage

## Idiomas da interface
A interface e a apresentação dos micropúblicos estão disponíveis em português, inglês, espanhol, francês, alemão, japonês, russo e coreano. Use o seletor no topo do aplicativo; a escolha fica salva neste navegador. As mensagens ficam em `i18n/messages.js`, os textos dos micropúblicos em `i18n/audiences.js` e os estilos em `i18n/locale.css`.

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

## API da plataforma e MCP
A página **API** do app mostra o status e as instruções de conexão. A API REST e o servidor MCP oferecem:
- `GET /api/v1/audiences` — listar e filtrar os micropúblicos (`q`, `country`, `language`, `locale`, `limit`).
- `GET /api/v1/youtube` — pesquisar vídeos; aceita os parâmetros usados pela pesquisa do app.
- `POST /api/v1/titles` — gerar conceitos. Corpo JSON: `{"audienceId":"mp-03-31","format":"Documentário narrado","topic":"forró","count":10,"locale":"pt-BR"}`.

Todas as rotas `/api/v1/*`, exceto `/api/v1/status`, exigem `Authorization: Bearer <UMBRA_API_KEY>`. Gere uma chave aleatória com:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```
Configure `UMBRA_API_KEY` no `.env.local` e nas variáveis do projeto Vercel. Para revogar a chave, substitua a variável e faça redeploy. Nunca use `NEXT_PUBLIC_UMBRA_API_KEY` nem envie a chave ao repositório.

O MCP em `mcp/server.js` fornece as ferramentas `list_micro_audiences`, `search_youtube` e `generate_titles`. Instale/clone o repositório no computador do cliente e configure o MCP com `command: node`, `args: ["<caminho-do-projeto>/mcp/server.js"]`, `UMBRA_API_URL` apontando para a implantação e `UMBRA_API_KEY` na configuração privada do cliente. Claude Code e Codex aceitam servidores MCP; outras conversas precisam oferecer suporte a MCP ou fazer chamadas REST. Mantenha os arquivos de configuração com a chave fora do Git.

O API status apenas informa se a chave está configurada; a chave não pode ser lida de volta pela interface. O catálogo e as buscas são compartilhados, mas oportunidades salvas continuam no `localStorage` de cada navegador e não ficam disponíveis aos agentes via API.

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
- A pesquisa permite filtrar Shorts (até 3 minutos) ou vídeos acima de 3 minutos; como a API não marca Shorts oficiais, a classificação é estimada pela duração.
- “Micropúblicos” do JSON são hipóteses de audiência, não segmentos estatisticamente comprovados.
- Os 50 títulos são protótipos baseados em templates; revisar idioma, factualidade, originalidade e contexto cultural. Para títulos nativos melhores, integrar modelo de IA com API server-side.
- Não existe promessa de viralização/monetização. Testar CTR, retenção, satisfação, recorrência e elegibilidade YPP.
- Respeitar políticas do YouTube, direitos autorais e conteúdo original/autêntico.

## Próximos incrementos
- Integração LLM server-side para títulos nativos por idioma e análise de perspectiva.
- Persistência em Supabase (auth + workspace + oportunidades).
- Exportação CSV/JSON, score de oportunidade explicável e comparação de canais.
- Paginação (nextPageToken) e filtros avançados de canais.
