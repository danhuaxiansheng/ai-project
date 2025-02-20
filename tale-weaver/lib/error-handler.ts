export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  async withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.withRetry(fn, retries - 1, delay * 2);
    }
  }

  isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  handleError(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message);
    }

    return new AppError("An unknown error occurred");
  }

  handle(error: unknown, context: string): never {
    const appError = this.handleError(error);
    console.error(`Error in ${context}:`, appError);
    throw appError;
  }

  async withErrorHandling<T>(
    fn: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this.handle(error, context);
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();

export const ERROR_CODES = {
  STORY_NOT_FOUND: "STORY_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
} as const;
