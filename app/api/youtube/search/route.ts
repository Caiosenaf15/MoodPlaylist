import { buscarVideoYoutube } from '@/app/lib/youtube';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new Response(JSON.stringify({ error: 'parâmetro "q" ausente' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const videoId = await buscarVideoYoutube(`${query} official audio`);

    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Nenhum vídeo encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ videoId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('Erro na busca do YouTube:', message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}