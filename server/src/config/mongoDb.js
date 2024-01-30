import mongoose from "mongoose";
import env from "../utils/validateEnv.js";

const connection = {};

export const connectDB = async () => {
  if (connection.isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(env.MONGO_URI, {
      dbName: "Pinshot",
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
