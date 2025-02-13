import { AI_CONFIG, API_ENDPOINTS } from "@/config/ai";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function createChatCompletion(messages: Message[]) {
  try {
    const response = await fetch(API_ENDPOINTS.deepseek, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "AI request failed");
    }

    const data = await response.json();
    return data.choices[0].message;
  } catch (error) {
    console.error("AI client error:", error);
    throw error;
  }
}
