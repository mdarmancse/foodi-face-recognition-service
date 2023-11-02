import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function sendData(res: Response, data: unknown) {
  res.status(StatusCodes.OK).json({
    status: true,
    message: "Success",
    data,
  });
}
