import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

mongoose.set("bufferCommands", false);

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn("MONGODB_URI is not configured — operating in offline/mock mode");
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    }).catch((err) => {
      console.warn("MongoDB not connected — operating in offline/mock mode:", err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.warn("MongoDB connection error:", error);
    return null;
  }

  return cached.conn;
}
