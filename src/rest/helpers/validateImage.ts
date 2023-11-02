import { RekognitionClient, S3Bucket, S3Client } from "../middlewares";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import stream from "stream";
import { DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { getFaceAreaSetting } from "./getSetting";

export async function validateImage(
  imageData: any,
  isFileBuffer: boolean = false,
) {
  try {
    let imageBuffer;
    if (isFileBuffer) {
      imageBuffer = imageData;
    } else {
      const response = await S3Client.send(
        new GetObjectCommand({
          Bucket: S3Bucket,
          Key: imageData.key,
        }),
      );

      // Ensure that response.Body is defined and contains data
      if (!response.Body || !(response.Body instanceof stream.Readable)) {
        return { status: false, message: "Image data not available" };
      }

      const chunks: Buffer[] = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      imageBuffer = Buffer.concat(chunks);
    }

    // Detect faces in the image
    const detectFacesParams = {
      Image: {
        Bytes: imageBuffer,
      },
      Attributes: ["FACE_OCCLUDED"],
    };
    const detectFacesResponse = await RekognitionClient.send(
      new DetectFacesCommand(detectFacesParams),
    );
    const faces = detectFacesResponse.FaceDetails;

    if (faces) {
      if (faces.length !== 1) {
        return { status: false, message: "Invalid number of faces detected" };
      }

      const face = faces[0];
      if (
        face.BoundingBox &&
        face.BoundingBox.Width &&
        face.BoundingBox.Height
      ) {
        const faceAreaPercent = await getFaceAreaSetting();

        const faceAreaPercentage =
          face.BoundingBox.Width * face.BoundingBox.Height * 100;
        if (faceAreaPercentage < faceAreaPercent) {
          return { status: false, message: "Face area percentage too small" };
        }
      }
    }

    return { status: true, message: "Valid Image" };
  } catch (error) {
    return { status: false, message: error.toString() };
  }
}
