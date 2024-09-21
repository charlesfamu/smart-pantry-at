import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export let openai: OpenAI | null = null;
export const initializeOpenAI = () => {
  if (openai === null) {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }
};