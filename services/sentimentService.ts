import axios from "axios";

export const analyzeSentiment = async (text: string): Promise<string> => {
    try {
        const API_KEY = process.env.GEMINI_API_KEY; // Ensure this is correctly set
        if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in environment variables.");

        const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

        const response = await axios.post(
            URL,
            {
                contents: [
                    { parts: [{ text: `Analyze the sentiment of this text: "${text}". Return only "positive", "negative", or "neutral".` }] }
                ]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        // Extract sentiment safely
        const sentiment = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

        // Ensure only valid responses are returned
        if (["positive", "negative", "neutral"].includes(sentiment)) {
            return sentiment;
        }

        console.warn("Unexpected sentiment response:", sentiment);
        return "neutral"; // Default fallback if response is unexpected
    } catch (error: any) {
        console.error("Error in sentiment analysis:", error?.response?.data || error?.message || "Unknown error");

        if (error?.response?.status === 429) {
            console.warn("Quota exceeded, defaulting to 'neutral'");
            return "neutral"; // Default when quota is exceeded
        }

        return "neutral"; // Default error handling
    }
};




