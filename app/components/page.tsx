"use client";

import { useState } from 'react';
import MoodBackground from '@/app/components/moodbackground';

interface SpotifyTrack {
  uri: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string; width: number; height: number }[];
  };
  preview_url: string | null;
  external_urls: { spotify: string };
}

interface MoodCompleto {
  cores: string[];
  texto: string;
  tracks: SpotifyTrack[];
}

const MOODS_POPULARES = [
  'Chuva à noite, nostálgico',
  'Domingo preguiçoso',
  'Treino pesado, energia máxima',
  'Foco total, estudando',
  'Saudade de casa',
  'Festa animada com amigos',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<MoodCompleto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [videoAberto, setVideoAberto] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [carregandoVideo, setCarregandoVideo] = useState<string | null>(null);

  async function gerarMood(textoQuery: string) {
    if (!textoQuery.trim()) return;

    setLoading(true);
    setOutput(null);
    setErrorMsg(null);
    setVideoAberto(null);
    setVideoId(null);

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textoQuery }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ${response.status}: ${text}`);
      }

      const data = await response.json();
      setOutput(data.output ?? null);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    gerarMood(query);
  }

  function handleMoodRapido(mood: string) {
    setQuery(mood);
    gerarMood(mood);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleClick();
    }
  }

  function handleLogoClick() {
    setQuery('');
    setOutput(null);
    setErrorMsg(null);
    setVideoAberto(null);
    setVideoId(null);
  }

  async function tocarNoYoutube(track: SpotifyTrack) {
    const trackKey = track.external_urls.spotify;

    if (videoAberto === trackKey) {
      setVideoAberto(null);
      setVideoId(null);
      return;
    }

    setCarregandoVideo(trackKey);
    setVideoAberto(trackKey);
    setVideoId(null);

    try {
      const artistas = track.artists.map((a) => a.name).join(' ');
      const buscaTexto = `${track.name} ${artistas}`;

      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(buscaTexto)}`);

      if (!response.ok) {
        throw new Error('Não foi possível encontrar essa música no YouTube.');
      }

      const data = await response.json();
      setVideoId(data.videoId);
    } catch (error) {
      console.error(error);
      setVideoAberto(null);
    } finally {
      setCarregandoVideo(null);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5 sm:gap-6 px-4 py-8 sm:p-6 text-slate-100 relative overflow-x-hidden">
      {output && <MoodBackground cores={output.cores} />}

      <button
        onClick={handleLogoClick}
        className="mb-1 sm:mb-2 opacity-90 hover:opacity-100 transition"
        aria-label="Voltar para o início"
      >
        <img src="/Union.png" alt="Moodify" className="h-9 sm:h-12 w-auto" />
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva seu mood..."
          className="w-full rounded-full bg-white/10 px-4 sm:px-5 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-slate-400 transition"
        />

        <button
          onClick={handleClick}
          disabled={loading || !query.trim()}
          className="rounded-full px-7 py-3 text-sm sm:text-base font-medium text-slate-900
            bg-white
            shadow-[0_4px_20px_rgba(255,255,255,0.15)]
            hover:shadow-[0_6px_28px_rgba(255,255,255,0.25)] hover:scale-[1.03]
            active:scale-95
            transition-all duration-300
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
        >
          {loading ? 'Carregando...' : 'Gerar mood'}
        </button>

        {!output && (
          <div className="flex flex-wrap gap-2 justify-center mt-1 px-2">
            {MOODS_POPULARES.map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodRapido(mood)}
                disabled={loading}
                className="text-xs px-4 py-2 rounded-full
                  bg-transparent text-slate-300 border border-white/20
                  hover:bg-white hover:text-slate-900 hover:border-white
                  transition-all duration-200
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-300"
              >
                {mood}
              </button>
            ))}
          </div>
        )}
      </div>

      {output && (
        <div className="w-full max-w-lg flex flex-col items-center gap-5 sm:gap-6">
          <div className="text-center px-2">
            <p className="text-sm sm:text-base mb-3">{output.texto}</p>
            <div className="flex gap-2 justify-center">
              {output.cores.map((cor) => (
                <span
                  key={cor}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20"
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            {output.tracks.map((track) => {
              const trackKey = track.external_urls.spotify;
              const capa = track.album.images[0]?.url;
              const estaAberto = videoAberto === trackKey;

              return (
                <div key={trackKey} className="bg-white/5 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3">
                    {capa && (
                      <img
                        src={capa}
                        alt={track.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{track.name}</p>
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                    </div>

                    <button
                      onClick={() => tocarNoYoutube(track)}
                      className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full bg-slate-200 text-slate-950 hover:bg-slate-300 transition flex-shrink-0"
                    >
                      {carregandoVideo === trackKey
                        ? '...'
                        : estaAberto
                          ? 'Fechar'
                          : 'Ouvir'}
                    </button>
                  </div>

                  {estaAberto && videoId && (
                    <div className="aspect-video w-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={track.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {errorMsg && <p className="text-red-400 text-sm text-center px-4">{errorMsg}</p>}
    </div>
  );
}