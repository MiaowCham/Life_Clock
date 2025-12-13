import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBirthdayInsights = async (birthDate: Date, ageYears: number): Promise<AIInsightData[]> => {
  try {
    const ai = getClient();
    const formattedDate = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const prompt = `
      The user was born on ${formattedDate} and is currently ${ageYears} years old.
      Generate 3 distinct, interesting, and short insights about this specific birth date and age.
      
      1. A historical event that happened on this exact date (Month Day Year) or close to it.
      2. A celestial/cosmic fact related to this time or age (e.g. "You have orbited the sun X times").
      3. A motivational or philosophical milestone for this age group.

      Output strictly in JSON format matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['historical', 'celestial', 'milestone', 'fun-fact'] }
            },
            required: ["title", "content", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as AIInsightData[];
  } catch (error) {
    console.error("Error generating insights:", error);
    // Return a fallback so the app doesn't crash
    return [
      {
        title: "Journey Through Time",
        content: "You are traveling through space and time on planet Earth at approximately 67,000 miles per hour.",
        category: "celestial"
      }
    ];
  }
};