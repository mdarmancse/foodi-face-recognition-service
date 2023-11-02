// Import necessary dependencies and models
import { Request, Response } from "express";
import { sendData, sendError } from "rest/helpers";
import { FaceRecognitionSettings } from "models/FaceRecognitionSettings";

export async function readSettings(req: Request, res: Response) {
  const settings = await FaceRecognitionSettings.findOne();
  sendData(res, settings);
}

export async function updateSettings(req: Request, res: Response) {
  const { faceAreaPercentage, similarityPercentage } = req.body;

  let settings = await FaceRecognitionSettings.findOne();

  if (!settings) {
    settings = new FaceRecognitionSettings({
      faceAreaPercentage,
      similarityPercentage,
    });
  } else {
    settings.faceAreaPercentage = faceAreaPercentage;
    settings.similarityPercentage = similarityPercentage;
  }

  await settings.save();
  sendData(res, settings);
}
