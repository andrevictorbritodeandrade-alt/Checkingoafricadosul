
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API
// Using the modern SDK @google/genai for better performance and Gemini 3 support.
// process.env.API_KEY is mapped to REACT_APP_GEMINI_API_KEY in vite.config.ts

export async function generateText(prompt: string) {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return "Serviço de IA indisponível no momento (Chave de API ausente).";
  }

  try {
    // Create instance right before use to ensure up-to-date key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using 'gemini-3-flash-preview' for fast and accurate text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    // Use .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error('Erro ao gerar texto com Gemini:', error);
    return "Desculpe, tive um problema ao conectar com a inteligência artificial.";
  }
}
