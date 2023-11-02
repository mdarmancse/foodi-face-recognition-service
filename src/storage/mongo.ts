import { log } from "../rest/helpers/log";
import { connect } from "mongoose";
import { InfoLog } from "rest/helpers";

export async function connectMongoDB() {
  const dbUrl = process.env.MONGO_URI || "";
  const con = await connect(dbUrl);

  log({
    level: InfoLog,
    message: `Connected to MongoDB at ${con.connection.host}:${con.connection.port}`,
  });
}
