import { moodGemini } from '@/app/lib/gemini';
import { searchTracks, replacePlaylistTracks, SpotifyTrack } from '@/app/lib/spotify';

export interface MoodCompleto {
  cores: string[];
  texto: string;
  tracks: SpotifyTrack[];
  playlistUrl: string | null;
}

export async function gerarMoodCompleto(query: string): Promise<MoodCompleto> {
  const mood = await moodGemini(query);

  // Busca faixas de cada artista sugerido em paralelo
  const buscas = await Promise.allSettled(
    mood.artistasSugeridos.map((artista) => searchTracks(`artist:"${artista}"`))
  );

  let tracks: SpotifyTrack[] = [];

  for (const resultado of buscas) {
    if (resultado.status === 'fulfilled') {
      // Pega até 2 faixas de cada artista, pra ter variedade sem repetir demais um único artista
      tracks.push(...resultado.value.tracks.items.slice(0, 2));
    }
  }

  // Fallback: se por algum motivo a busca por artista não trouxe nada,
  // tenta pelos gêneros genéricos como plano B
  if (tracks.length === 0) {
    const termoGenerico = mood.generosMusicais.join(' ');
    const resultadoGenerico = await searchTracks(termoGenerico);
    tracks = resultadoGenerico.tracks.items;
  }

  let playlistUrl: string | null = null;

  if (tracks.length > 0) {
    try {
      const uris = tracks.map((track) => track.uri);
      playlistUrl = await replacePlaylistTracks(uris);
    } catch (error) {
      console.error('Erro ao atualizar playlist:', error);
    }
  }

  return {
    cores: mood.cores,
    texto: mood.texto,
    tracks,
    playlistUrl,
  };
}