import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GENAI_API_KEY,
});

export interface MoodResult {
  cores: string[];
  texto: string;
  generosMusicais: string[];
}

export async function moodGemini(query: string): Promise<MoodResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: `You must generate a JSON with EXACTLY this format, with no text before or after it:
{
  "cores": ["#hexColor1", "#hexColor2", "#hexColor3"],
  "texto": "a short poetic sentence, written in Portuguese (Brazil), describing the mood below",
  "generosMusicais": ["genre1", "genre2"]
}

Rules:
- "cores" must be 3 hex color codes that visually match the emotional tone of the mood.
- "texto" must be written in Brazilian Portuguese, even though these instructions are in English.
- "generosMusicais" must be 2 music genres or keywords suitable for a Spotify search. Use universal English genre terms (e.g. "lo-fi", "acoustic", "melancholic") by default. However, if the mood strongly suggests Brazilian music, use Brazilian genre terms exactly as they are (e.g. "sertanejo", "mpb", "bossa nova", "forró", "pagode", "funk brasileiro") instead of translating them.

User's mood description (may be written in Portuguese): "${query}"`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error('A IA não retornou nenhum conteúdo.');
  }

  let parsed: MoodResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('A resposta da IA não veio em um JSON válido.');
  }

  const isValid =
    Array.isArray(parsed.cores) &&
    typeof parsed.texto === 'string' &&
    Array.isArray(parsed.generosMusicais);

  if (!isValid) {
    throw new Error('A resposta da IA não está no formato esperado.');
  }

  return parsed;
}