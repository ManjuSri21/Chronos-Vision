import { GoogleGenAI } from "@google/genai";
import { PredictionResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getFuturePrediction(answers: string[]): Promise<PredictionResponse> {
  const prompt = `Based on these user preferences about the future:
1. Economic outlook: ${answers[0]}
2. Technology trust: ${answers[1]}
3. Climate priority: ${answers[2]}

Generate a short, immersive sci-fi scenario (max 100 words) of how their life looks in 2050.
Also provide an "impact score" (0-100) and 3 short tags.
Return ONLY a JSON object with: { "scenario": "...", "impactScore": 85, "tags": ["tech-heavy", "green", "urban"] }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Prediction failed:", error);
    return {
      scenario: "In 2050, you live in a world where AI and nature have found a delicate balance. Your personalized bio-node manages your daily oxygen and information intake.",
      impactScore: 75,
      tags: ["Digital Nomad", "Eco-City", "AI-Integrated"]
    };
  }
}
