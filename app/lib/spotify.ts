import { Buffer } from 'node:buffer';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTrack {
  uri: string;
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

// Adicione essas novas interfaces junto com as existentes

export interface SpotifyUserTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface SpotifyPlaylist {
  id: string;
  external_urls: { spotify: string };
}

// Pega um access_token "de usuário" usando o refresh_token salvo no .env.local
export async function getUserAccessToken(): Promise<string> {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Spotify user credentials are not configured.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh Spotify user token: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as SpotifyUserTokenResponse;
  return data.access_token;
}

// Cria uma playlist nova na sua conta (a conta dona do refresh_token)
export async function createPlaylist(nome: string, descricao: string): Promise<SpotifyPlaylist> {
  const accessToken = await getUserAccessToken();

  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: nome,
      description: descricao,
      public: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create playlist: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<SpotifyPlaylist>;
}

// Adiciona faixas a uma playlist já criada (endpoint atualizado: /items no lugar de /tracks)
export async function addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void> {
  const accessToken = await getUserAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: trackUris }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add tracks to playlist: ${response.status} ${errorText}`);
  }
}