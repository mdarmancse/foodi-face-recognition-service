import express from "express";
import { connectMongoDB } from "storage";
import { initRest } from "./rest";
import http from "http";
import { log } from "./rest/helpers/log";
import { InfoLog } from "rest/helpers";
import { initGrpcServer } from "grpc/initGrpcServer";
import { checkAndSetDefaultSettings } from "rest/helpers/checkAndSetDefaultSettings";

export async function runServer() {
  // let user know of runtime mode
  console.log(`Running application in ${process.env.NODE_ENV} mode`);
  // connect to mongo db
  await connectMongoDB();

  // Check and set default faceAreaPercentage
  await checkAndSetDefaultSettings();
  // prepare express instance
  const app = express();

  // initialize rest controllers
  initRest(app);

  const server = http.createServer(app);
  // run server
  const port = process.env.PORT || 3355;
  server.listen(port, () => {
    log({
      level: InfoLog,
      message: `Running server at ${port} port`,
    });
  });

  initGrpcServer();
}
