import { getSpotifyToken, SpotifyTokenResponse } from '@/app/api/spotify/token/route';

async function search(q: string, type: string[]){
  try{
    const token = await getSpotifyToken();

    const resp = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}&market=BR`,
      {
        headers: {'Authorization': `Bearer ${token.access_token}`}
      }
    )
    if(resp.status === 401){

    }
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to get Spotify ${type}: ${resp.status} ${errorText}`);
    }
    return resp.json();
  }catch(error){
    throw new Error(`Failed to get Spotify ${type}. Error: ${error}`);
  }
}