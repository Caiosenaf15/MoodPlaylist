import { Buffer } from 'node:buffer';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export async function getSpotifyToken(): Promise<SpotifyTokenResponse> {
  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials are not configured.');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Spotify token: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<SpotifyTokenResponse>;
}