import { RiderImage } from "models";
import { ErrorLog, log } from "rest/helpers";

/**
 * verify rider image
 */
export const verify = async (call: any, callback: any) => {
  try {
    let { verificationId, riderId } = call.request;

    if (!verificationId || !riderId) {
      callback(null, {
        status: false,
        message: "VerficationId, riderId is requried",
      });
      return;
    }

    const found = await RiderImage.findOne({
      _id: verificationId,
      riderId,
      isActive: true,
    });

    callback(null, {
      status: !!found,
      message: found ? "Success" : "Data not found!",
    });
  } catch (error) {
    log({
      level: ErrorLog,
      message: `Error handling rider image: ${error.message}`,
      caller: "verify",
    });

    callback(null, {
      status: false,
      message: "Something went wrong!",
    });
  }
};
