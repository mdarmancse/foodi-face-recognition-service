import { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initSwagger } from "./initSwagger";
import { logMiddleware } from "./logMiddleware";

export function initGlobalMiddlewares(app: Express) {
  app.use(logMiddleware);
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  initSwagger(app);
}
