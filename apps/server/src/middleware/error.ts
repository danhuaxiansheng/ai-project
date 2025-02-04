import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  res.status(500).json({
    error: "服务器内部错误",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
