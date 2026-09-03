import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';

async function checkRequests() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const requests = await db.collection('procurementrequests').find({}).toArray();
  console.log('Total Procurement Requests in MongoDB:', requests.length);
  requests.forEach((r, idx) => {
    console.log(`[${idx + 1}] Ticket: ${r.ticketId} | Status: ${r.status} | Item: ${r.itemDetails?.name} | Quotes: ${r.quotations?.length || 0}`);
  });
  await mongoose.disconnect();
}

checkRequests();
