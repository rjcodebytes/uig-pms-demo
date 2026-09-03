import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';

let cached = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

async function dbConnect() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    if (!cached.promise || mongoose.connection.readyState !== 1) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
      }).then((m) => {
        return m.connection;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.warn('[DB] MongoDB connection unavailable:', error.message);
    cached.promise = null;
    cached.conn = null;
    return null;
  }
}

export default dbConnect;
