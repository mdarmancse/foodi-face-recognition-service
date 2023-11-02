import qs from "querystring";
import { Request, Response, NextFunction } from "express";
import { log } from "../helpers/log";

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = new Date().getTime();

  res.on("finish", () => {
    const end = new Date().getTime();

    log({
      path: req.path,
      query: qs.encode(req.query as qs.ParsedUrlQueryInput),
      method: req.method,
      status: res.statusCode,
      useragent: req.headers["user-agent"],
      ip: req.ip,
      latency: (end - start) / 1000,
    });
  });

  next();
}
