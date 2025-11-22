import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client
// We will initialize this lazily when the user provides the key
let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
};

export interface GenerateContentParams {
    prompt: string;
    platform?: string;
    type?: 'text' | 'image';
}

export const generateText = async (prompt: string, modelName: string = "gemini-2.5-flash") => {
    if (!genAI) throw new Error("API Key not set");

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating text:", error);
        throw error;
    }
};

// Placeholder for Image Generation - will need specific implementation for Imagen
export const generateImage = async (prompt: string) => {
    if (!genAI) throw new Error("API Key not set");
    // Note: The @google/genai SDK usage for Imagen might differ slightly depending on version.
    // This is a placeholder structure.
    console.log("Generating image for:", prompt);
    // TODO: Implement actual Imagen call
    return ["https://via.placeholder.com/1024x1024?text=Generated+Image+1", "https://via.placeholder.com/1024x1024?text=Generated+Image+2"];
}
