import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';

async function testDb() {
  console.log(`Testing MongoDB connection to: ${uri}`);
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log('✓ MongoDB is CONNECTED and RUNNING!');
    console.log('Database Name:', conn.connection.name);
    console.log('Collections:', (await conn.connection.db.listCollections().toArray()).map(c => c.name));
    await mongoose.disconnect();
  } catch (err) {
    console.log('❌ MongoDB Connection FAILED:');
    console.log(err.message);
  }
}

testDb();
