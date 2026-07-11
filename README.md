# MoodPlaylist

MoodPlaylist é um app feito com Next.js que gera uma playlist personalizada a partir de sua emoção.

O fluxo principal é:
- o usuário descreve seu mood em texto;
- a aplicação envia essa descrição a um endpoint `POST /api/mood`;
- o backend usa o modelo Gemini (via Google GenAI) para gerar:
  - 3 cores de mood,
  - uma frase poética em português,
  - gêneros musicais sugeridos,
  - artistas sugeridos;
- com os artistas sugeridos, o sistema busca faixas no Spotify;
- o usuário pode escutar as músicas via um player incorporado do YouTube.

## Recursos

- interface minimalista com animação de fundo por `framer-motion`
- geração de mood e paleta de cores por IA
- busca de faixas no Spotify usando `client_credentials`
- reprodução rápida no YouTube via busca de vídeo
- cache simples para reduzir chamadas repetidas

## Tecnologias

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Google GenAI (`@google/genai`)
- Spotify Web API
- YouTube Data API

## Arquitetura do projeto

- `app/page.tsx`: UI principal do aplicativo e lógica de estado do cliente
- `app/components/page.tsx`: componente de página com formulário, cards de música e player
- `app/components/moodbackground.tsx`: animação de fundo usando as cores de mood
- `app/api/mood/route.ts`: rota que monta o mood completo via IA e buscas no Spotify
- `app/api/spotify/search/route.ts`: rota de busca de faixas no Spotify
- `app/api/youtube/search/route.ts`: rota de busca de vídeo no YouTube
- `app/lib/gemini.ts`: integração com o modelo Gemini e parse do JSON de mood
- `app/lib/spotify.ts`: autenticação Spotify e consulta de tracks
- `app/lib/youtube.ts`: busca de vídeo no YouTube e cache local
- `app/lib/mood.ts`: orquestração do mood completo e caching do resultado

## Configuração

Crie um arquivo `.env.local` na raiz do projeto com as variáveis abaixo:

```env
GENAI_API_KEY=seu_api_key_do_google_genai
SPOTIFY_CLIENT_ID=seu_client_id_spotify
SPOTIFY_CLIENT_SECRET=seu_client_secret_spotify
YOUTUBE_API_KEY=seu_api_key_do_youtube
```

> O app usa o fluxo de credenciais de cliente do Spotify. As chaves do Spotify não devem ser embarcadas no frontend.

## Executando localmente

Instale as dependências e execute o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## Notas importantes

- o endpoint `POST /api/mood` depende do `GENAI_API_KEY` para gerar o mood;
- a busca de música no Spotify depende de `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET`;
- a busca de vídeos usa `YOUTUBE_API_KEY` e pode exigir habilitação do YouTube Data API no Google Cloud.
- o app já implementa cache simples para evitar requisições repetidas durante uma hora para moods e 24 horas para vídeos.

## Melhorias futuras

- tratar mais erros de API do YouTube e Spotify com mensagens mais detalhadas
- suportar playlists maiores ou favoritos do usuário
- adicionar autenticação de usuário para salvar moods preferidos
- melhorar a validação de saída da IA para evitar respostas mal formatadas
