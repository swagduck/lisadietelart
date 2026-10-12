import mongoose from 'mongoose';

/**
 * MongoDB connection helper optimized for Next.js App Router and Vercel Serverless.
 * Caches the connection across serverless invocations and hot-reloads to prevent
 * exhausting MongoDB Atlas Free Tier (M0) connection pools (limit: 500 connections).
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '⚠️ MONGODB_URI is not defined in environment variables. Falling back to in-memory static store.'
      );
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10, // Optimized for Vercel serverless free tier limits
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB Atlas:', e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
