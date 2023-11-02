import type * as grpc from "@grpc/grpc-js";
import type { MessageTypeDefinition } from "@grpc/proto-loader";

import type {
  FaceRecognitionClient as _faceRecognitionPackage_FaceRecognitionClient,
  FaceRecognitionDefinition as _faceRecognitionPackage_FaceRecognitionDefinition,
} from "./faceRecognitionPackage/FaceRecognition";

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype,
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  faceRecognitionPackage: {
    Empty: MessageTypeDefinition;
    FaceRecognition: SubtypeConstructor<
      typeof grpc.Client,
      _faceRecognitionPackage_FaceRecognitionClient
    > & { service: _faceRecognitionPackage_FaceRecognitionDefinition };
    StatusResponse: MessageTypeDefinition;
    verifyRequest: MessageTypeDefinition;
  };
}
