import asyncHandler from "express-async-handler";
import { RiderImage } from "models";
import {
  sendData,
  sendError,
  validateImage,
} from "rest/helpers";
import { StatusCodes } from "http-status-codes";
import { S3Bucket, S3Client, RekognitionClient } from "../middlewares";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  SearchFacesByImageCommand,
  IndexFacesCommand,
} from "@aws-sdk/client-rekognition";

interface CustomMulterFile extends Express.Multer.File {
  key: string;
}

const collectionId = process.env.COLLECTION_ID;
export const uploadRiderImage = asyncHandler(async (req, res) => {
  const riderId = req.params.riderId;
  const file = req.file as CustomMulterFile;

  if (!file) {
    sendError(res, {
      status: StatusCodes.BAD_REQUEST,
      message: "No file uploaded",
    });
    return;
  }

  // Check if the file format is either JPG or PNG
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    sendError(res, {
      status: StatusCodes.BAD_REQUEST,
      message: "Only JPG and PNG files are allowed",
    });
    return;
  }

  try {
    const validImage = await validateImage(req.file);

    if (!validImage.status) {
      sendError(res, {
        status: StatusCodes.BAD_REQUEST,
        message: validImage.message,
      });
    }

    const existingFileUrl = await RiderImage.findOne(
      { riderId: riderId },
      { fileUrl: 1, riderId: 1 },
    );

    if (existingFileUrl) {
      await S3Client.send(
        new DeleteObjectCommand({
          Bucket: S3Bucket,
          Key: existingFileUrl?.fileUrl,
        }),
      );
    }

    await createOrUpdateAwsUser(collectionId, riderId.toString(), req.file);


    let resp = await RiderImage.findOneAndUpdate(
      { riderId: riderId },
      {
        fileUrl: file.key
      },
      {
        new: true,
        upsert: true,
      },
    );
    sendData(res, resp);
  } catch (error) {
    await S3Client.send(
      new DeleteObjectCommand({
        Bucket: S3Bucket,
        Key: file.key,
      }),
    );
    sendError(res, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
});

async function createOrUpdateAwsUser(
  collectionId: string | undefined,
  riderId: string,
  imageData: any,
) {
  const image = {
    S3Object: {
      Bucket: imageData.bucket,
      Name: imageData.key,
    },
  };

  // Check if the user already exists
  const searchFacesResponse = await RekognitionClient.send(
    new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: image,
    }),
  );
  const faceMatches = searchFacesResponse.FaceMatches;

  if (faceMatches && faceMatches.length > 0) {
    // User already exists, update image
    const externalImageId = faceMatches[0].Face?.ExternalImageId;

    if (externalImageId === riderId) {
      // User with the same riderId found, update image
      const userData = await RekognitionClient.send(
        new IndexFacesCommand({
          CollectionId: collectionId,
          Image: image,
          ExternalImageId: riderId,
        }),
      );

      return userData.FaceRecords || [];
    }
  }

  // User does not exist, create a new user
  const userData = await RekognitionClient.send(
    new IndexFacesCommand({
      CollectionId: collectionId,
      Image: image,
      ExternalImageId: riderId.toString(),
    }),
  );

  return userData.FaceRecords || [];
}
