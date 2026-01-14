import { GoogleGenAI } from "@google/genai";

export async function generateEmbedding(text: string): Promise<number[]> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error('No embeddings returned from API');
  }

  const values = response.embeddings[0].values;
  if (!values) {
    throw new Error('Embedding values are undefined');
  }

  return values;
}
