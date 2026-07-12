"use client";

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<MoodCompleto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [videoAberto, setVideoAberto] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [carregandoVideo, setCarregandoVideo] = useState<string | null>(null);
  const [videoErro, setVideoErro] = useState<string | null>(null);
  const [mostrarMais, setMostrarMais] = useState(false);

  const motionDuration = reducedMotion ? 0.01 : undefined;
  const statusMessage = loading
    ? 'Gerando playlist para o seu mood…'
    : output
      ? `${output.tracks.length} músicas encontradas`
      : '';

  async function gerarMood(textoQuery: string) {
    if (!textoQuery.trim()) return;

    setLoading(true);
    setOutput(null);
    setErrorMsg(null);
    setVideoAberto(null);
    setVideoId(null);
    setVideoErro(null);
    setMostrarMais(false);

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textoQuery }),
      });

      if (!response.ok) {
        throw new Error(`Não foi possível gerar o mood. Tente novamente. (${response.status})`);
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
    setVideoErro(null);
    setMostrarMais(false);
  }

  function renderTrack(track: SpotifyTrack, featured = false) {
    const trackKey = track.external_urls.spotify;
    const capa = track.album.images.at(-1)?.url ?? track.album.images[0]?.url;
    const estaAberto = videoAberto === trackKey;
    const videoPronto = estaAberto && !!videoId;
    const carregando = carregandoVideo === trackKey;

    return (
      <motion.div
        key={trackKey}
        className="ui-group-item"
        role="listitem"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: motionDuration ?? 0.22, ease: EASE_OUT },
          },
        }}
      >
        <div className={`flex items-center gap-3 px-3 ${featured ? 'py-3.5' : 'py-2.5'}`}>
          {capa ? (
            <img
              src={capa}
              alt=""
              width={featured ? 48 : 36}
              height={featured ? 48 : 36}
              className={featured ? 'album-art album-art-featured' : 'album-art'}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className={`album-art album-art-placeholder ${featured ? 'album-art-featured' : ''}`}
              aria-hidden="true"
            >
              ♪
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className={`truncate leading-snug ${featured ? 'text-body font-medium' : 'text-subhead'}`}>
              {track.name}
            </p>
            <p className="text-caption text-muted truncate">
              {track.artists.map((a) => a.name).join(', ')}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => tocarNoYoutube(track)}
            aria-label={
              carregando
                ? `Carregando ${track.name}`
                : estaAberto
                  ? `Fechar ${track.name}`
                  : `Ouvir ${track.name}`
            }
            aria-expanded={estaAberto}
            aria-busy={carregando}
            disabled={carregando}
            className={`ui-text-button flex-shrink-0
              ${featured ? 'text-accent font-medium' : ''}
              ${estaAberto ? 'is-active text-foreground' : featured ? '' : 'text-accent'}
              ${carregando ? 'is-loading animate-pulse-soft' : ''}`}
          >
            {carregando ? '…' : estaAberto ? 'Fechar' : 'Ouvir'}
          </motion.button>
        </div>

        <div
          className={`video-expand border-t border-separator ${videoPronto ? 'is-open' : ''}`}
          aria-hidden={!videoPronto}
        >
          <div className="video-expand-inner">
            <div className="video-expand-content aspect-video w-full bg-black">
              {videoId && estaAberto && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={`Vídeo de ${track.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  async function tocarNoYoutube(track: SpotifyTrack) {
    const trackKey = track.external_urls.spotify;

    if (videoAberto === trackKey) {
      setVideoAberto(null);
      setVideoId(null);
      setVideoErro(null);
      return;
    }

    setCarregandoVideo(trackKey);
    setVideoAberto(trackKey);
    setVideoId(null);
    setVideoErro(null);

    try {
      const artistas = track.artists.map((a) => a.name).join(' ');
      const buscaTexto = `${track.name} ${artistas}`;

      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(buscaTexto)}`);

      if (!response.ok) {
        throw new Error('Não encontramos essa música no YouTube.');
      }

      const data = await response.json();

      if (!data.videoId) {
        throw new Error('Não encontramos essa música no YouTube.');
      }

      setVideoId(data.videoId);
    } catch (error) {
      setVideoErro(error instanceof Error ? error.message : 'Erro ao carregar o vídeo.');
      setVideoAberto(null);
    } finally {
      setCarregandoVideo(null);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-5 py-8 sm:px-6 relative overflow-x-hidden">
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </p>

      <AnimatePresence>
        {output && (
          <motion.div
            key="mood-bg"
            className="fixed inset-0 -z-10"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: EASE_OUT }}
          >
            <MoodBackground cores={output.cores} />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="w-full flex flex-col items-center gap-3 mb-8 sm:mb-10 shrink-0 pt-2">
        {output ? (
          <motion.button
            type="button"
            onClick={handleLogoClick}
            aria-label="Voltar para o início"
            className="flex items-center justify-center rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            whileTap={!reducedMotion ? { scale: 0.96 } : undefined}
            transition={{ duration: 0.12, ease: EASE_OUT }}
          >
            <img
              src="/Union.png"
              alt="Moodfy"
              width={120}
              height={40}
              className="logo-mark h-9 sm:h-10 w-auto"
            />
          </motion.button>
        ) : (
          <img
            src="/Union.png"
            alt="Moodfy"
            width={120}
            height={40}
            className="logo-mark h-9 sm:h-10 w-auto"
          />
        )}

      </header>

      <div className="flex-1 flex flex-col items-center justify-center w-full gap-8 sm:gap-10 pb-8">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <label htmlFor="mood-input" className="sr-only">
          Descreva seu mood
        </label>

        <div className="flex items-center gap-2">
          <input
            id="mood-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva seu mood…"
            aria-busy={loading}
            autoComplete="off"
            enterKeyHint="go"
            className={`ui-search flex-1 min-w-0 px-4 text-body text-foreground placeholder:text-subtle outline-none ${loading ? 'is-loading' : ''}`}
          />

          <motion.button
            type="button"
            onClick={handleClick}
            disabled={loading || !query.trim()}
            aria-busy={loading}
            aria-label={loading ? 'Gerando mood' : 'Gerar mood'}
            className={`btn-primary relative disabled:cursor-not-allowed ${loading ? 'is-loading' : ''}`}
            whileTap={!loading && query.trim() && !reducedMotion ? { scale: 0.97 } : undefined}
            transition={{ duration: 0.12, ease: EASE_OUT }}
          >
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="animate-spin-slow inline-block w-3 h-3 border-2 border-transparent border-t-white rounded-full" />
              </span>
            )}
            <span className={loading ? 'invisible' : 'visible'}>
              {loading ? '…' : 'Gerar'}
            </span>
          </motion.button>
        </div>

        <AnimatePresence mode="popLayout">
          {!output && (
            <motion.div
              key="chips"
              className="flex flex-col gap-2 items-center"
              initial={{ opacity: 1, height: 'auto' }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  duration: reducedMotion ? 0.01 : 0.2,
                  ease: EASE_OUT,
                },
              }}
            >
              <p className="text-caption text-subtle">Ou experimente um mood</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {MOODS_POPULARES.map((mood, idx) => (
                  <motion.button
                    key={mood}
                    type="button"
                    onClick={() => handleMoodRapido(mood)}
                    disabled={loading}
                    className="ui-chip disabled:cursor-not-allowed"
                    initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: loading ? 0.4 : 1, y: 0 }}
                    transition={{
                      duration: reducedMotion ? 0.01 : 0.2,
                      delay: reducedMotion ? 0 : idx * 0.03,
                      ease: EASE_OUT,
                    }}
                  >
                    {mood}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {output && (
          <motion.div
            key="results"
            className="w-full max-w-md flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.28,
              ease: EASE_OUT,
            }}
          >
            <motion.div
              className="text-center px-1 max-w-[36ch] w-full"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reducedMotion ? 0 : 0.06,
                    delayChildren: reducedMotion ? 0 : 0.06,
                  },
                },
              }}
            >
              <motion.p
                className="text-display text-muted"
                style={{ textWrap: 'pretty' }}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: motionDuration ?? 0.24, ease: EASE_OUT },
                  },
                }}
              >
                {output.texto}
              </motion.p>
            </motion.div>

            {output.tracks.length === 0 ? (
              <p className="text-caption text-muted text-center">
                Tente descrever de outro jeito — ou toque no logo para recomeçar.
              </p>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <motion.div
                  className="ui-group w-full"
                  role="list"
                  aria-label="Música principal"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { delayChildren: reducedMotion ? 0 : 0.1 },
                    },
                  }}
                >
                  {renderTrack(output.tracks[0], true)}
                </motion.div>

                {output.tracks.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMostrarMais((v) => !v)}
                      aria-expanded={mostrarMais}
                      className="ui-text-button text-muted w-full text-center py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-md"
                    >
                      {mostrarMais
                        ? 'Ocultar sugestões'
                        : `Mais ${output.tracks.length - 1} ${output.tracks.length - 1 === 1 ? 'sugestão' : 'sugestões'}`}
                    </button>

                    <AnimatePresence>
                      {mostrarMais && (
                        <motion.div
                          className="ui-group w-full"
                          role="list"
                          aria-label="Outras sugestões"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={{
                            hidden: { opacity: 0, height: 0 },
                            visible: {
                              opacity: 1,
                              height: 'auto',
                              transition: {
                                duration: reducedMotion ? 0.01 : 0.24,
                                ease: EASE_OUT,
                                staggerChildren: reducedMotion ? 0 : 0.04,
                              },
                            },
                          }}
                        >
                          {output.tracks.slice(1).map((track) => renderTrack(track))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(errorMsg || videoErro) && (
          <motion.div
            key={errorMsg ?? videoErro}
            className="ui-error px-4 py-2.5 text-center max-w-sm"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
          >
            <p className="text-caption">{errorMsg ?? videoErro}</p>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
