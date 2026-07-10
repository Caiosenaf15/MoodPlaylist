"use client";
import MoodBackground from '@/app/components/moodbackground';
import { useState, useRef } from 'react';

interface SpotifyTrack {
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
  playlistUrl: string | null;
}

export default function Page() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<MoodCompleto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tocando, setTocando] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleClick() {
    if (!query.trim()) return;

    setLoading(true);
    setOutput(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleClick();
    }
  }

  function tocarPreview(previewUrl: string | null, trackKey: string) {
    if (!previewUrl) return;

    if (tocando === trackKey && audioRef.current) {
      audioRef.current.pause();
      setTocando(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const novoAudio = new Audio(previewUrl);
    audioRef.current = novoAudio;
    novoAudio.play();
    setTocando(trackKey);

    novoAudio.onended = () => setTocando(null);
  }

  return (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-slate-100 relative">
    {output && <MoodBackground cores={output.cores} />}
      <div className="w-full max-w-md flex flex-col items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva seu mood... ex: chuva à noite, nostálgico"
          className="w-full rounded-full bg-white/10 px-5 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-slate-400 transition"
        />

        <button
          onClick={handleClick}
          disabled={loading || !query.trim()}
          className="rounded-full bg-slate-200 px-6 py-3 text-slate-950 hover:bg-slate-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Carregando...' : 'Gerar mood'}
        </button>
      </div>

      {output && (
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-base mb-3">{output.texto}</p>
            <div className="flex gap-2 justify-center">
              {output.cores.map((cor) => (
                <span
                  key={cor}
                  className="w-8 h-8 rounded-full border border-white/20"
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>

          {output.playlistUrl && (
            <a
              href={output.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline text-slate-200 hover:text-white transition"
            >
              Abrir playlist completa no Spotify →
            </a>
          )}

          <div className="w-full flex flex-col gap-3">
            {output.tracks.map((track) => {
              const trackKey = track.external_urls.spotify;
              const capa = track.album.images[0]?.url;

              return (
                <div
                  key={trackKey}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                >
                  {capa && (
                    <img
                      src={capa}
                      alt={track.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {track.artists.map((a) => a.name).join(', ')}
                    </p>
                  </div>

                  <button
                    onClick={() => tocarPreview(track.preview_url, trackKey)}
                    disabled={!track.preview_url}
                    className="text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-950 hover:bg-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {tocando === trackKey ? 'Pausar' : 'Ouvir'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
    </div>
  );
}