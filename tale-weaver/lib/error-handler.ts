export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = {
  async withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.withRetry(fn, retries - 1, delay * 2);
    }
  },

  isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  },

  handleError(error: unknown): AppError {
    if (this.isAppError(error)) return error;
    
    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN_ERROR');
    }
    
    return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
  },

  async withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw this.handleError(error);
    }
  }
};

export const ERROR_CODES = {
  STORY_NOT_FOUND: 'STORY_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
} as const;
