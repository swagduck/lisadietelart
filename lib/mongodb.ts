import 'server-only';
import mongoose from 'mongoose';

/**
 * MongoDB connection helper targeting MongoDB Atlas free tier (M0).
 * Caches the connection globally to prevent serverless function executions
 * from exhausting connection limits (max 500 on Atlas M0).
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
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ MONGODB_URI is not set. Data layer will operate in mock fallback mode.');
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10, // Conservative pool size for Atlas M0 free tier in serverless
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    // Log generic error message without leaking sensitive URI credentials
    console.error('Database connection error: Unable to connect to MongoDB instance.');
    throw new Error('Database connection failed');
  }

  return cached.conn;
}

export default connectToDatabase;
