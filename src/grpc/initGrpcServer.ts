import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import { ProtoGrpcType } from "grpc/faceRecognitionProto/faceRecognition";
import { ErrorLog, InfoLog, log } from "rest/helpers";
import { verify } from "./handler/faceRecognitionService";

export async function initGrpcServer() {
  /**
   * Declaration
   */
  const PROTO_PATH = path.join(
    __dirname,
    "faceRecognitionProto",
    "faceRecognition.proto",
  );
  const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
  const proto = grpc.loadPackageDefinition(
    packageDef,
  ) as unknown as ProtoGrpcType;

  const server = new grpc.Server();
  server.addService(proto.faceRecognitionPackage.FaceRecognition.service, {
    verify,
  });

  /**
   * Server Call
   */
  server.bindAsync(
    `0.0.0.0:${process.env.GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (!error) {
        server.start();
        log({
          level: InfoLog,
          message: `gRPC listening on port ${port}`,
          caller: "server.bindAsync",
        });
      } else {
        log({
          level: ErrorLog,
          message: error.message,
          caller: "server.bindAsync",
        });
      }
    },
  );
}
