import asyncHandler from "express-async-handler";
import { RiderImage, VerificationHistory } from "models";
import {
  sendData,
  sendError,
  validateImage,
  getSimilarityPercentage,
} from "rest/helpers";
import { StatusCodes } from "http-status-codes";
import { S3Bucket, RekognitionClient } from "../middlewares";
import { CompareFacesCommand } from "@aws-sdk/client-rekognition";

interface CustomMulterFile extends Express.Multer.File {
  key: string;
}

export const verifyImage = asyncHandler(async (req, res) => {
  const riderId = req.params.riderId;
  const file = req.file as CustomMulterFile;

  if (!file) {
    sendError(res, {
      status: StatusCodes.BAD_REQUEST,
      message: "No file uploaded",
    });
    return;
  }

  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    sendError(res, {
      status: StatusCodes.BAD_REQUEST,
      message: "Only JPG and PNG files are allowed",
    });
    return;
  }

  try {
    const riderResp = await RiderImage.findOne(
      { riderId: riderId },
      { fileUrl: 1, riderId: 1 },
    );

    if (!riderResp) {
      sendError(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "No image found with this rider ID",
      });
      return;
    }

    const validImage = await validateImage(file.buffer, true);

    if (!validImage.status) {
      sendError(res, {
        status: StatusCodes.BAD_REQUEST,
        message: validImage.message,
      });
    }

    const similartyThreshold = await getSimilarityPercentage();
    const compareResponse = await RekognitionClient.send(
      new CompareFacesCommand({
        SourceImage: {
          S3Object: {
            Bucket: S3Bucket,
            Name: riderResp.fileUrl,
          },
        },
        TargetImage: {
          Bytes: file.buffer,
        },
        SimilarityThreshold: similartyThreshold,
      }),
    );

    if (compareResponse.FaceMatches && compareResponse.FaceMatches.length > 0) {
      await VerificationHistory.updateMany(
        { riderId: riderId },
        { $set: { isActive: false } },
      );

      const veriicationResponse = await VerificationHistory.create({
        riderId: riderId,
        isActive: true,
      });

      sendData(res, {
        verificationId: veriicationResponse._id,
        isVerified: true,
      });
    } else {
      sendError(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Faces do not match, please try again",
      });
    }
  } catch (error) {
    sendError(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
});
