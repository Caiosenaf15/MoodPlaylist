import { moodGemini } from '@/app/lib/gemini';
import { searchTracks, createPlaylist, addTracksToPlaylist, SpotifyTrack } from '@/app/lib/spotify';

export interface MoodCompleto {
  cores: string[];
  texto: string;
  tracks: SpotifyTrack[];
  playlistUrl: string | null;
}

export async function gerarMoodCompleto(query: string): Promise<MoodCompleto> {
  const mood = await moodGemini(query);

  const termoBusca = mood.generosMusicais.join(' ');
  const resultadoSpotify = await searchTracks(termoBusca);
  const tracks = resultadoSpotify.tracks.items;

  let playlistUrl: string | null = null;

  // Só tenta criar playlist se houver faixas encontradas
  if (tracks.length > 0) {
    try {
      const playlist = await createPlaylist(
        `Moodify: ${query}`,
        `Playlist gerada automaticamente pelo Moodify a partir do mood: "${query}"`
      );

      const uris = tracks.map((track) => track.uri);
      await addTracksToPlaylist(playlist.id, uris);

      playlistUrl = playlist.external_urls.spotify;
    } catch (error) {
      // Se a criação da playlist falhar, não quebra a experiência inteira —
      // o usuário ainda vê as músicas individualmente
      console.error('Erro ao criar playlist:', error);
    }
  }

  return {
    cores: mood.cores,
    texto: mood.texto,
    tracks,
    playlistUrl,
  };
}