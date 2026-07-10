const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

interface YoutubeSearchResponse {
  items: {
    id: { videoId: string };
  }[];
}

interface CacheEntry {
  videoId: string | null;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas (vídeo raramente muda)

export async function buscarVideoYoutube(query: string): Promise<string | null> {
  const chave = query.trim().toLowerCase();
  const agora = Date.now();

  const cacheado = cache.get(chave);
  if (cacheado && cacheado.expiresAt > agora) {
    return cacheado.videoId;
  }

  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY não configurada.');
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to search YouTube: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as YoutubeSearchResponse;
  const videoId = data.items.length > 0 ? data.items[0].id.videoId : null;

  cache.set(chave, { videoId, expiresAt: agora + CACHE_TTL_MS });

  return videoId;
}