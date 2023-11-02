import { Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { pick } from "lodash";
import { sendError } from "rest/helpers";

interface User {
  id: number;
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
function unauthorizedResponse(res: Response) {
  sendError(res, { status: StatusCodes.UNAUTHORIZED, message: "Unauthorized" });
}

export const authenticate = asyncHandler((req, res, next) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    unauthorizedResponse(res);
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "") as User;
    req.user = pick(payload, ["id"]);
    next();
  } catch (_) {
    unauthorizedResponse(res);
    return;
  }
});
