import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    console.error("MongoDB URL not found");
    throw new Error("MongoDB URL not found in environment variables");
  }

  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    
    await mongoose.connect(process.env.MONGODB_URL, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: "majority",
    });

    isConnected = true;
    console.log("MongoDB connected successfully");
    return;
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    isConnected = false;
    throw error;
  }
};
