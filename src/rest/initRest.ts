import { Express, Router } from "express";
import {
  authenticate,
  initErrorHandler,
  initGlobalMiddlewares,
  singleUpload,
  singleUploadLocal,
} from "./middlewares";
import { readSettings, updateSettings, uploadRiderImage } from "./controllers";
import { verifyImage } from "./controllers";

export function initRest(app: Express) {
  // global middleware
  initGlobalMiddlewares(app);

  // initialize routes
  const router = Router();

  router.post(
    "/upload-rider-image/:riderId",
    authenticate,
    singleUpload("file"),
    uploadRiderImage,
  );

  router.post(
    "/verify-image/:riderId",
    authenticate,
    singleUploadLocal("file"),
    verifyImage,
  );

  router.get("/face-recognition/settings", authenticate, readSettings);
  router.patch("/face-recognition/settings", authenticate, updateSettings);
  // attach routes
  app.use(router);

  // global error handler
  initErrorHandler(app);
}
