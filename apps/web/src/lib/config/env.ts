export const env = {
  // AI API Keys
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    apiUrl: process.env.DEEPSEEK_API_URL,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    apiUrl: process.env.OPENAI_API_URL,
  },

  // API Configuration
  api: {
    maxTokens: parseInt(process.env.API_MAX_TOKENS || '4096'),
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
    rateLimit: parseInt(process.env.API_RATE_LIMIT || '10'),
  },

  // Role Configuration
  temperature: {
    management: parseFloat(process.env.DEFAULT_TEMPERATURE_MANAGEMENT || '0.7'),
    creation: parseFloat(process.env.DEFAULT_TEMPERATURE_CREATION || '0.9'),
    quality: parseFloat(process.env.DEFAULT_TEMPERATURE_QUALITY || '0.3'),
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // API Base URL
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
} as const;

// 环境变量验证
function validateEnv() {
  const requiredEnvVars = [
    'DEEPSEEK_API_KEY',
    'DEEPSEEK_API_URL',
    'OPENAI_API_KEY',
    'OPENAI_API_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

// 在非测试环境下验证环境变量
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
} 