import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

let cached = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

async function dbConnect() {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB, falling back to offline mode:', error.message);
    cached.promise = null; // Reset promise so it can retry later if needed
    return null; // Return null instead of throwing to prevent app crash
  }
}

export default dbConnect;
