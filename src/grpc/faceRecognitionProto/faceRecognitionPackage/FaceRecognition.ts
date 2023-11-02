// Original file: src/grpc/faceRecognitionProto/faceRecognition.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  StatusResponse as _faceRecognitionPackage_StatusResponse,
  StatusResponse__Output as _faceRecognitionPackage_StatusResponse__Output,
} from "../faceRecognitionPackage/StatusResponse";
import type {
  verifyRequest as _faceRecognitionPackage_verifyRequest,
  verifyRequest__Output as _faceRecognitionPackage_verifyRequest__Output,
} from "../faceRecognitionPackage/verifyRequest";

export interface FaceRecognitionClient extends grpc.Client {
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  verify(
    argument: _faceRecognitionPackage_verifyRequest,
    callback: grpc.requestCallback<_faceRecognitionPackage_StatusResponse__Output>,
  ): grpc.ClientUnaryCall;
}

export interface FaceRecognitionHandlers
  extends grpc.UntypedServiceImplementation {
  verify: grpc.handleUnaryCall<
    _faceRecognitionPackage_verifyRequest__Output,
    _faceRecognitionPackage_StatusResponse
  >;
}

export interface FaceRecognitionDefinition extends grpc.ServiceDefinition {
  verify: MethodDefinition<
    _faceRecognitionPackage_verifyRequest,
    _faceRecognitionPackage_StatusResponse,
    _faceRecognitionPackage_verifyRequest__Output,
    _faceRecognitionPackage_StatusResponse__Output
  >;
}
