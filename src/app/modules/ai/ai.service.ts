import Groq from 'groq-sdk';
import { envVars } from '../../config/env.js';

const SYSTEM_PROMPT = `You are CineBot, a helpful assistant for CineTube — a movie and series streaming platform.
You help users with: browsing movies and series, managing subscriptions, using watchlists, understanding pricing,
writing reviews, and general platform questions. Keep answers concise and friendly.
If asked about something unrelated to movies, streaming, or the CineTube platform, politely redirect the conversation.`;

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

const chat = async (messages: ChatMessage[]): Promise<string> => {
    if (!envVars.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not configured. Add it to your environment variables.');
    }

    const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 512,
        temperature: 0.7,
    });

    return response.choices[0].message.content ?? '';
};

export const AiService = { chat };
