import { searchTracks } from '@/app/api/spotify/lib/spotify';

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

    const data = await searchTracks(query);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('Erro na busca do Spotify:', message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}