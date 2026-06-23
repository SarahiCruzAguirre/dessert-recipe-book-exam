/**
 * SIDE: Server-side
 * Description: MongoDB database connection manager using Mongoose.
 * Implements a connection caching mechanism to prevent multiple active connections during Next.js hot-reload.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Por favor define MONGODB_URI en .env.local");
}

/**
 * Cache interface for mongoose connection.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

// Reuse the global connection cache if it exists, otherwise initialize a new cache object.
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

/**
 * Establishes a cached connection to MongoDB using Mongoose.
 * Prevents re-connecting if a connection or connection promise already exists.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        console.log("MongoDB connected successfully!");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

