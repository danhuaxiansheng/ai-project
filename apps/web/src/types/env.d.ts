declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // AI API Keys
      DEEPSEEK_API_KEY: string;
      DEEPSEEK_API_URL: string;
      OPENAI_API_KEY: string;
      OPENAI_API_URL: string;

      // API Configuration
      API_MAX_TOKENS: string;
      API_TIMEOUT: string;
      API_RETRY_ATTEMPTS: string;
      API_RATE_LIMIT: string;

      // Role Configuration
      DEFAULT_TEMPERATURE_MANAGEMENT: string;
      DEFAULT_TEMPERATURE_CREATION: string;
      DEFAULT_TEMPERATURE_QUALITY: string;

      // Environment
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_API_BASE_URL: string;
    }
  }
}

export {} 