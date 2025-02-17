import { AI_CONFIG, API_ENDPOINTS } from "@/config/ai";
import { errorHandler } from "./error-handler";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function createChatCompletion(messages: Message[]) {
  return errorHandler.withRetry(async () => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
    }
    debugger;
    const response = await fetch(API_ENDPOINTS.deepseek, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.max_tokens,
        top_p: AI_CONFIG.top_p,
        frequency_penalty: AI_CONFIG.frequency_penalty,
        presence_penalty: AI_CONFIG.presence_penalty,
      }),
    });
    debugger;
    if (!response.ok) {
      const error = await response.json();
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data.choices[0].message;
  });
}
