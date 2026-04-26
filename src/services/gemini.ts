import { GoogleGenAI } from "@google/genai";
import { PredictionResponse } from "../types";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ai = GEMINI_KEY ? new GoogleGenAI({ apiKey: GEMINI_KEY }) : null;

export async function getFuturePrediction(answers: string[]): Promise<PredictionResponse> {
  if (!ai) {
    console.error("Gemini API Key is missing. Please set it in the Secrets panel.");
    return {
      scenario: "Wait! The temporal sensors detect a missing authentication key. Please add your GEMINI_API_KEY to the Secrets panel to unlock this vision.",
      impactScore: 0,
      tags: ["Auth Required", "Secret Missing", "Incomplete"]
    };
  }

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

    const text = response.response.text();
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("AI Prediction failed:", error);
    return {
      scenario: "In 2050, you live in a world where AI and nature have found a delicate balance. Your personalized bio-node manages your daily oxygen and information intake.",
      impactScore: 75,
      tags: ["Digital Nomad", "Eco-City", "AI-Integrated"]
    };
  }
}
