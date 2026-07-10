import { gerarMoodCompleto } from '@/app/lib/mood';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.query || typeof body.query !== 'string') {
      return new Response(JSON.stringify({ error: 'query ausente ou inválida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const output = await gerarMoodCompleto(body.query);

    return new Response(JSON.stringify({ output }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('Erro na rota /api/mood:', message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
