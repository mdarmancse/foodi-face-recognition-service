import { Response } from "express";
import { StatusCodes } from "http-status-codes";

type ErrorResponse = {
  status?: number;
  message?: string;
  data?: unknown;
};

export function sendError(res: Response, options: ErrorResponse) {
  const { status, ...rest } = options;
  res.status(options.status || StatusCodes.BAD_REQUEST).json({
    status: false,
    message: "Invalid data",
    data: null,
    ...rest,
  });
}
