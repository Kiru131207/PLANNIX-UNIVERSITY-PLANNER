import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

// Initialize Gemini Client
// Note: In a real deployment, ensure process.env.API_KEY is set in your build environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchSubjectResources = async (subjectName: string): Promise<SearchResult[]> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // Using the 2.5 Flash model with Google Search tool as requested
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Find 3 high-quality, free online study resources, courses, or recent academic news articles specifically for the university subject: "${subjectName}". Return a summary list.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const results: SearchResult[] = [];
    
    // Extract grounding chunks which contain the actual search results/URLs
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          results.push({
            title: chunk.web.title || 'Resource Link',
            url: chunk.web.uri,
            snippet: 'Source found via Google Search'
          });
        }
      });
    }

    // Fallback: If no grounding chunks (rare with search tool), parse text or return empty
    // We only want verified links from the tool output
    return results;

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};