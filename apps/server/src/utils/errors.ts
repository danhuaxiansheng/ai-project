export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string) {
    super(`${resource} 不存在`, 404);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}
