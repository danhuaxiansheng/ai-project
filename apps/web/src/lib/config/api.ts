import { env } from './env';

export const apiConfig = {
  deepseek: {
    headers: {
      'Authorization': `Bearer ${env.deepseek.apiKey}`,
      'Content-Type': 'application/json',
    },
    baseUrl: env.deepseek.apiUrl,
    timeout: env.api.timeout,
    maxTokens: env.api.maxTokens,
  },

  openai: {
    headers: {
      'Authorization': `Bearer ${env.openai.apiKey}`,
      'Content-Type': 'application/json',
    },
    baseUrl: env.openai.apiUrl,
    timeout: env.api.timeout,
    maxTokens: env.api.maxTokens,
  },

  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: env.api.rateLimit,
  },

  retry: {
    attempts: env.api.retryAttempts,
    delay: 1000,
    backoff: 2,
  },
} as const;

// API 错误类型
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 重试工具函数
export async function withRetry<T>(
  fn: () => Promise<T>,
  options = apiConfig.retry
): Promise<T> {
  let lastError: Error;
  let delay = options.delay;

  for (let i = 0; i < options.attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i === options.attempts - 1) break;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= options.backoff;
    }
  }

  throw lastError!;
} 