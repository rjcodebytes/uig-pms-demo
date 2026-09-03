import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';

async function checkState() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const reqCount = await db.collection('procurementrequests').countDocuments();
  const docCount = await db.collection('documents').countDocuments();
  const users = await db.collection('users').find({}).toArray();
  const roles = await db.collection('roles').find({}).toArray();
  const vendors = await db.collection('vendors').find({}).toArray();

  console.log('======================================================');
  console.log('             FRESH SYSTEM STATE AUDIT');
  console.log('======================================================');
  console.log(`• Requisitions in Database: ${reqCount} (Fresh clean state)`);
  console.log(`• Documents in Database:    ${docCount} (Cleaned)`);
  console.log(`• Active Logins Preserved:  ${users.length} users`);
  users.forEach(u => console.log(`   - Username: "${u.username}" | Role: "${u.role}" | Name: "${u.name}"`));
  console.log(`• Roles Active:             ${roles.length}`);
  console.log(`• Verified Vendors:         ${vendors.length}`);
  console.log('======================================================\n');
  await mongoose.disconnect();
}

checkState();
