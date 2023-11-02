import {
  DefaultFaceAreaSetting,
  DefaultSimilarityPercentage,
} from "config/defaultSetting";
import { log } from "helpers";
import { ErrorLog } from "./log";
import { FaceRecognitionSettings } from "../../models";

export async function checkAndSetDefaultSettings() {
  try {
    const settings = await FaceRecognitionSettings.findOne();
    if (!settings) {
      const defaultSettings = new FaceRecognitionSettings({
        faceAreaPercentage: DefaultFaceAreaSetting,
        similarityPercentage: DefaultSimilarityPercentage,
      });
      await defaultSettings.save();
    }
  } catch (error) {
    log({
      level: ErrorLog,
      message: `Error checking and setting default FaceAreaSettings: ${error.message}`,
      caller: "checkAndSetDefaultSettings",
    });
  }
}
