
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK using the mandatory environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a helpful description for a lost item using Gemini 3 Flash.
 * @param itemName The name of the item.
 * @param category The category of the item.
 * @returns A string containing the generated description.
 */
export const generateSmartDescription = async (itemName: string, category: string): Promise<string> => {
  try {
    // Calling generateContent directly with the model and string prompt as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a helpful, concise description (max 2 sentences) for a lost item named "${itemName}" in the category "${category}". Mention common features or identifying marks it might have to help finders identify it correctly.`,
    });
    
    // Accessing the .text property of GenerateContentResponse directly.
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `A ${category} item named ${itemName}. Please keep it safe!`;
  }
};
