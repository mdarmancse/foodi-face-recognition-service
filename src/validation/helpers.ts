import { ZodError } from "zod";
import { formatZodError } from "./formatZodError";

export function errorResponse(error: ZodError | string) {
  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return {
    message: "Invalid data",
    data: formatZodError(error),
  };
}
