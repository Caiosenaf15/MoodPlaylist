import { moodGemini } from '@/app/lib/gemini';
import { searchTracks, SpotifyTrack } from '@/app/lib/spotify';

export interface MoodCompleto {
  cores: string[];
  texto: string;
  tracks: SpotifyTrack[];
}

interface CacheEntry {
  data: MoodCompleto;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

function normalizarQuery(query: string): string {
  return query.trim().toLowerCase();
}

export async function gerarMoodCompleto(query: string): Promise<MoodCompleto> {
  const chave = normalizarQuery(query);
  const agora = Date.now();

  const cacheado = cache.get(chave);
  if (cacheado && cacheado.expiresAt > agora) {
    return cacheado.data;
  }

  const mood = await moodGemini(query);

  const buscas = await Promise.allSettled(
    mood.artistasSugeridos.map((artista) => searchTracks(`artist:"${artista}"`))
  );

  let tracks: SpotifyTrack[] = [];

  for (const resultado of buscas) {
    if (resultado.status === 'fulfilled') {
      tracks.push(...resultado.value.tracks.items.slice(0, 2));
    }
  }

  if (tracks.length === 0) {
    const termoGenerico = mood.generosMusicais.join(' ');
    const resultadoGenerico = await searchTracks(termoGenerico);
    tracks = resultadoGenerico.tracks.items;
  }

  const resultado: MoodCompleto = {
    cores: mood.cores,
    texto: mood.texto,
    tracks,
  };

  cache.set(chave, { data: resultado, expiresAt: agora + CACHE_TTL_MS });

  return resultado;
}