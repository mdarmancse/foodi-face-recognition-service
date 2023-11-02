import { Schema, SchemaTypes, model } from "mongoose";
import { v4 } from "uuid";

const schema = new Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    faceAreaPercentage: {
      type: Number,
      default: 10,
    },
    similarityPercentage: {
      type: Number,
      default: 70,
    },
  },
  {
    collection: "face-recognation-settings",
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
);

export const FaceRecognitionSettings = model("FaceRecognitionSettings", schema);
