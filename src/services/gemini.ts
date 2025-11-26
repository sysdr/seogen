import { GoogleGenerativeAI } from "@google/generative-ai";

// Store multiple API clients for key rotation
let genAIClients: GoogleGenerativeAI[] = [];
let currentKeyIndex = 0;

export const initializeGemini = (apiKeys: string | string[]) => {
    const keys = Array.isArray(apiKeys) ? apiKeys : [apiKeys];
    genAIClients = keys.map(key => new GoogleGenerativeAI(key));
    currentKeyIndex = 0;
};

// Check if error is a rate limit error
const isRateLimitError = (error: any): boolean => {
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code || '';
    
    // Common rate limit indicators
    return (
        errorCode === 429 ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('quota exceeded') ||
        errorMessage.includes('resource exhausted') ||
        errorMessage.includes('429') ||
        errorMessage.includes('too many requests')
    );
};

// Get the current API client without rotating
const getCurrentClient = (): GoogleGenerativeAI | null => {
    if (genAIClients.length === 0) return null;
    return genAIClients[currentKeyIndex];
};

// Rotate to the next key
const rotateToNextKey = (): void => {
    if (genAIClients.length > 0) {
        currentKeyIndex = (currentKeyIndex + 1) % genAIClients.length;
    }
};

// Try all keys until one succeeds or all fail
const tryWithAllKeys = async <T>(
    operation: (client: GoogleGenerativeAI) => Promise<T>
): Promise<T> => {
    if (genAIClients.length === 0) {
        throw new Error("API Key not set");
    }

    const errors: Error[] = [];
    let attempts = 0;

    // Try each key at most once
    while (attempts < genAIClients.length) {
        const client = getCurrentClient();
        if (!client) break;

        const keyIndexBeforeAttempt = currentKeyIndex;

        try {
            const result = await operation(client);
            // Success - rotate to next key for load balancing, but don't rotate on error
            rotateToNextKey();
            return result;
        } catch (error: any) {
            errors.push(error);
            
            // If it's a rate limit error, try the next key
            if (isRateLimitError(error)) {
                console.warn(`Rate limit hit on key ${keyIndexBeforeAttempt + 1}/${genAIClients.length}, trying next key...`);
                rotateToNextKey();
                attempts++;
                continue;
            }
            
            // For non-rate-limit errors, throw immediately
            throw error;
        }
    }

    // All keys exhausted due to rate limits
    const lastError = errors[errors.length - 1] || new Error("All API keys exhausted");
    throw new Error(`All ${genAIClients.length} API key(s) hit rate limits. Please try again later. Original error: ${lastError.message}`);
};

export interface GenerateContentParams {
    prompt: string;
    platform?: string;
    type?: 'text' | 'image';
}

export const generateText = async (prompt: string, modelName: string = "gemini-2.5-flash") => {
    return tryWithAllKeys(async (client) => {
        const model = client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    });
};

// Placeholder for Image Generation - will need specific implementation for Imagen
export const generateImage = async (prompt: string) => {
    if (genAIClients.length === 0) throw new Error("API Key not set");
    // Note: The @google/genai SDK usage for Imagen might differ slightly depending on version.
    // This is a placeholder structure.
    console.log("Generating image for:", prompt);
    // TODO: Implement actual Imagen call
    return ["https://via.placeholder.com/1024x1024?text=Generated+Image+1", "https://via.placeholder.com/1024x1024?text=Generated+Image+2"];
}
