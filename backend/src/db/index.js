import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";
const connectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI.split("?")[0];
    const queryParams = process.env.MONGODB_URI.split("?")[1] || "";
    const connectionUri = `${baseUri}/${DB_NAME}?${queryParams}`;
    const connectionInstance = await mongoose.connect(connectionUri);
    console.log(
      `\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host} | DB: ${DB_NAME}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED ", error);
    process.exit(1);
  }
};


export default connectDB