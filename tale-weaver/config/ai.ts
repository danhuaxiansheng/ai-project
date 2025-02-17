export const AI_CONFIG = {
  model: "deepseek-chat",
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 0.95,
  frequency_penalty: 0.5,
  presence_penalty: 0.5,
};

export const API_ENDPOINTS = {
  deepseek: "https://api.deepseek.com/v1/chat/completions",
};

// 验证环境变量
if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY is not set in environment variables");
}
