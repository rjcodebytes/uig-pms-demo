import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';

async function resetDatabase() {
  console.log('Connecting to MongoDB at:', uri);
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Clear procurement requests
  const deleteReqs = await db.collection('procurementrequests').deleteMany({});
  console.log(`✓ Cleared procurementrequests collection: deleted ${deleteReqs.deletedCount} requests.`);

  // 2. Clear generated documents
  try {
    const deleteDocs = await db.collection('documents').deleteMany({});
    console.log(`✓ Cleared documents collection: deleted ${deleteDocs.deletedCount} documents.`);
  } catch (e) {
    console.log('No documents collection found or already empty.');
  }

  // 3. Verify users and roles are preserved
  const userCount = await db.collection('users').countDocuments();
  const roleCount = await db.collection('roles').countDocuments();
  console.log(`✓ Users in DB: ${userCount}, Roles in DB: ${roleCount}`);

  // 4. Verify vendors & pricebaselines
  const vendorCount = await db.collection('vendors').countDocuments();
  const baselineCount = await db.collection('pricebaselines').countDocuments();
  console.log(`✓ Vendors preserved: ${vendorCount}, Price Baselines preserved: ${baselineCount}`);

  console.log('\n🎉 DATABASE RESET COMPLETE: Fresh state ready for new requisitions while logins remain 100% active!');
  await mongoose.disconnect();
}

resetDatabase();
