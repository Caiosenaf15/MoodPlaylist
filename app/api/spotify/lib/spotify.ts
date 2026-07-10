import { Buffer } from 'node:buffer';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string; width: number; height: number }[];
  };
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export async function getSpotifyToken(): Promise<SpotifyTokenResponse> {
  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials are not configured.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Spotify token: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<SpotifyTokenResponse>;
}

export async function searchTracks(
  query: string,
  types: string[] = ['track']
): Promise<SpotifySearchResponse> {
  const token = await getSpotifyToken();

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${types.join(',')}&market=BR&limit=8`;

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  // Se o token expirou no meio do caminho, pega um novo e tenta de novo, uma vez
  if (response.status === 401) {
    const newToken = await getSpotifyToken();
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${newToken.access_token}` },
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to search Spotify: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<SpotifySearchResponse>;
}