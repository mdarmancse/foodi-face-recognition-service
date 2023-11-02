import {
  DefaultFaceAreaSetting,
  DefaultSimilarityPercentage,
} from "config/defaultSetting";
import { log } from "helpers";
import { ErrorLog } from "./log";
import { FaceRecognitionSettings } from "../../models";

export async function getFaceAreaSetting() {
  try {
    const settings = await FaceRecognitionSettings.findOne();
    return settings?.faceAreaPercentage || DefaultFaceAreaSetting; // Default value if admin not configured
  } catch (error) {
    log({
      level: ErrorLog,
      message: `Error getting face area percentage: ${error.message}`,
      caller: "getFaceAreaPercentage",
    });

    return DefaultFaceAreaSetting; // Default value if an error occurs
  }
}
export async function getSimilarityPercentage() {
  try {
    const settings = await FaceRecognitionSettings.findOne();
    return settings?.similarityPercentage || DefaultSimilarityPercentage; // Default value if admin not configured
  } catch (error) {
    log({
      level: ErrorLog,
      message: `Error getting similarity percentage: ${error.message}`,
      caller: "getSimilarityPercentage",
    });

    return DefaultSimilarityPercentage; // Default value if an error occurs
  }
}
