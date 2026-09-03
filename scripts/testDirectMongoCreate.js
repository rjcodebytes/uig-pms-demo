import dbConnect from '../src/lib/mongodb.js';
import ProcurementRequest from '../src/models/ProcurementRequest.js';

async function testMongoCreate() {
  const conn = await dbConnect();
  console.log('dbConnect result:', !!conn, 'readyState:', conn?.readyState);

  const testReq = await ProcurementRequest.create({
    ticketId: 'PR-2026-TEST-MONGO',
    subject: 'Direct MongoDB Connection Verification Test',
    requester: {
      name: 'Eng. Test User',
      email: 'test@uig.com',
      department: 'Testing Dept',
    },
    project: {
      projectId: 'PRJ-TEST',
      projectName: 'Test Project',
      allocatedBudget: 100000,
    },
    location: 'Riyadh',
    itemDetails: {
      name: 'Test Machinery',
      category: 'Heavy Equipment & Machinery',
      quantity: 1,
      targetPrice: 50000,
    },
    status: 'Incoming',
  });

  console.log('✓ Successfully created Mongoose document in MongoDB:');
  console.log('  ID:', testReq._id);
  console.log('  TicketId:', testReq.ticketId);
  console.log('  Status:', testReq.status);

  // Now query it back
  const found = await ProcurementRequest.findOne({ ticketId: 'PR-2026-TEST-MONGO' });
  console.log('✓ Queried back from MongoDB:', !!found, found?.subject);

  // Clean up test record
  await ProcurementRequest.deleteOne({ ticketId: 'PR-2026-TEST-MONGO' });
  console.log('✓ Cleaned up test record from MongoDB.');
}

testMongoCreate();
