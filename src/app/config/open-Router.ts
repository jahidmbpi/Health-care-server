import { envVars } from ".";
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: envVars.OPENROUTER_API_KEY,
});
