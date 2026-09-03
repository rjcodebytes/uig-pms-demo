import dbConnect from '../src/lib/mongodb.js';
import ProcurementRequest from '../src/models/ProcurementRequest.js';

async function testFind() {
  await dbConnect();
  const id = "PR-2026-88101";
  const doc = await ProcurementRequest.findOne({ ticketId: id });
  console.log("Found by ticketId:", doc ? doc.ticketId : "NULL");

  const doc2 = await ProcurementRequest.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }] });
  console.log("Found by query:", doc2 ? doc2.ticketId : "NULL");
}

testFind().then(() => process.exit(0));
