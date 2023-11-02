import { Request, Response, NextFunction } from "express";
import { ErrorLog, sendError } from "rest/helpers";
import { StatusCodes } from "http-status-codes";
import { log } from "../helpers/log";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  log({
    level: ErrorLog,
    message: `Error handling order payment: ${err.message}`,
    caller: "errorHandler",
  });
  sendError(res, {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Sorry, Something went wrong!",
  });
}
