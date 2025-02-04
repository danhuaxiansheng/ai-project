import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";
import { z } from "zod";

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError("请求数据验证失败", error.errors));
      } else {
        next(error);
      }
    }
  };
