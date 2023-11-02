import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { formatZodError } from "./formatZodError";
import { StatusCodes } from "http-status-codes";
import { sendError } from "rest/helpers";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      sendError(res, { data: errors });
      return;
    }
    req.body = parsed.data;
    next();
  };
}
