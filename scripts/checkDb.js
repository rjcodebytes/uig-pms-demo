import dbConnect from '../src/lib/mongodb.js';
import ProcurementRequest from '../src/models/ProcurementRequest.js';

async function check() {
  await dbConnect();
  const all = await ProcurementRequest.find({}, { ticketId: 1, _id: 1, status: 1 });
  console.log("Found requests in DB:", all);
}

check().then(() => process.exit(0));
