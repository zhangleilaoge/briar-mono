import { GoogleGenAI } from '@google/genai';

// Simple in-memory cache to avoid repeated API calls for the same planet
const infoCache = new Map<string, string>();

export const getPlanetDetails = async (planetName: string): Promise<string> => {
	// Check cache first
	if (infoCache.has(planetName)) {
		return infoCache.get(planetName)!;
	}

	// Ensure API Key exists
	if (!process.env.API_KEY) {
		return `Note: API_KEY is missing. I cannot generate AI details for ${planetName}.`;
	}

	try {
		const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

		const prompt = `Tell me 3 fascinating scientific facts about the planet ${planetName}. 
    Format the output as a concise markdown list. 
    Keep the tone educational and engaging for a general audience.
    Do not include a preamble or postscript.`;

		const response = await ai.models.generateContent({
			model: 'gemini-3-flash-preview',
			contents: prompt,
			config: {
				systemInstruction:
					'You are an expert astronomer guiding a user through a 3D tour of the solar system.',
				temperature: 0.7
			}
		});

		const text = response.text || `Could not retrieve information for ${planetName}.`;

		// Cache the result
		infoCache.set(planetName, text);

		return text;
	} catch (error) {
		console.error('Gemini API Error:', error);
		return `Error connecting to the cosmos (AI Service unavailable).`;
	}
};
