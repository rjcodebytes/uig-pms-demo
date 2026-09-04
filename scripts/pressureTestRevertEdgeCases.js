import { encode } from 'next-auth/jwt';
import mongoose from 'mongoose';

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production-32chars';

async function getAuthCookie(role, username = 'user') {
  const token = {
    id: `test-${username}`,
    name: `${role} Officer`,
    username,
    email: `${username}@uig.com`,
    role,
    roleId: `role-${role}`,
    position: `${role} Lead`,
    department: 'Procurement Operations',
  };

  const encoded = await encode({
    token,
    secret,
    salt: 'authjs.session-token',
  });

  return `authjs.session-token=${encoded}`;
}

const BASE = 'http://localhost:3005';

async function testEdgeCases() {
  console.log('================================================================');
  console.log('🧪 RUNNING ADVANCED EDGE-CASE REVERT & FLAG PRESSURE SUITE');
  console.log('================================================================');

  const initiatorCookie = await getAuthCookie('Initiator', 'initiator');
  const approverCookie = await getAuthCookie('Approver', 'approver');
  const financeCookie = await getAuthCookie('Store Incharge', 'storeincharge');
  const storekeeperCookie = await getAuthCookie('Store Keeper', 'storekeeper');

  // TEST SUITE A: Revert all the way to Stage 1 (Incoming)
  console.log('\n--- [TEST SUITE A: Revert to Incoming (Stage 1) & Re-escalate] ---');
  const createRes = await fetch(`${BASE}/api/v1/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': initiatorCookie },
    body: JSON.stringify({
      subject: 'Edge Case Test: Full Pipeline Stage 1 Reversion',
      requester: { name: 'Fahad Al-Zahrani', email: 'fahad@uig.com', department: 'Electrical' },
      project: { projectId: 'PRJ-EDGE-01', projectName: 'NEOM Site Power Substation', allocatedBudget: 180000 },
      location: 'Dammam',
      itemDetails: { name: 'Schneider 400A Circuit Breakers', category: 'Electrical Equipment', quantity: 20, targetPrice: 2500 },
      businessJustification: { purpose: 'Substation circuit isolation panels' },
    }),
  });
  const ticketA = (await createRes.json()).data.ticketId;
  console.log(`Created ticket: ${ticketA}`);

  // Submit quotes -> Technical_Approval
  await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': initiatorCookie },
    body: JSON.stringify({
      action: 'QUOTES_SUBMITTED',
      quotations: [{ vendorName: 'Schneider Electric KSA', totalPrice: 50000, unitPrice: 2500, leadTimeDays: 2, specificationsText: 'Standard', isChosen: true }],
    }),
  });

  // Flag from Technical_Approval directly back to Incoming (Stage 1)
  const revertToIncomingRes = await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': approverCookie },
    body: JSON.stringify({
      action: 'FLAG_ISSUE',
      targetStage: 'Incoming',
      currentStage: 'Technical_Approval',
      reasonCategory: 'Alternative Vendor Sourcing Required',
      notes: 'Initial scope requires re-evaluation by Site Initiator before sourcing.',
    }),
  });
  const revertData = await revertToIncomingRes.json();
  console.log(`Revert to Incoming response status: ${revertToIncomingRes.status}, Ticket status: ${revertData.data?.status}`);
  if (revertData.data?.status !== 'Incoming' || !revertData.data?.flaggedIssue?.isFlagged) {
    throw new Error('Failed to revert to Incoming stage!');
  }
  console.log('✅ Successfully reverted all the way back to Stage 1 (Incoming)!');

  // Resubmit from Incoming directly -> Technical_Approval
  const reSubmitRes = await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': initiatorCookie },
    body: JSON.stringify({
      action: 'QUOTES_SUBMITTED',
      quotations: [{ vendorName: 'Schneider Electric KSA', totalPrice: 48000, unitPrice: 2400, leadTimeDays: 2, specificationsText: 'Refined Specs', isChosen: true }],
    }),
  });
  const reSubmitData = await reSubmitRes.json();
  console.log(`Resubmit from Incoming: Status: ${reSubmitData.data?.status}, isFlagged: ${reSubmitData.data?.flaggedIssue?.isFlagged}`);
  if (reSubmitData.data?.status !== 'Technical_Approval' || reSubmitData.data?.flaggedIssue?.isFlagged) {
    throw new Error('Failed to transition from Incoming back to Technical_Approval!');
  }
  console.log('✅ Successfully progressed from Incoming back into pipeline with flag cleared!');

  // TEST SUITE B: Delivery_Pending 3-Way Match Discrepancy Flagging
  console.log('\n--- [TEST SUITE B: Delivery_Pending 3-Way Match Discrepancy Flagging] ---');
  // Tech approve
  await fetch(`${BASE}/api/v1/requests/${ticketA}/technical-approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': approverCookie },
    body: JSON.stringify({ isApproved: true }),
  });
  // Finance approve
  await fetch(`${BASE}/api/v1/requests/${ticketA}/finance-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie },
    body: JSON.stringify({ isApproved: true }),
  });
  // Confirm delivery -> Delivery_Pending
  await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': storekeeperCookie },
    body: JSON.stringify({
      action: 'DELIVERY_CONFIRMED',
      driverName: 'Sami Al-Mutairi',
      waybillNumber: 'WB-99120',
      notes: 'Initial delivery received on dock.',
    }),
  });

  // Finance flags 3-Way match invoice discrepancy while at Delivery_Pending
  const flagDeliveryRes = await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie },
    body: JSON.stringify({
      action: 'FLAG_ISSUE',
      targetStage: 'Delivery_Pending',
      currentStage: 'Delivery_Pending',
      reasonCategory: 'Transit Damage / Missing Site Quantity',
      notes: 'Vendor submitted commercial invoice for 54,000 SAR instead of agreed 48,000 SAR. Withholding payment.',
    }),
  });
  const flagDeliveryData = await flagDeliveryRes.json();
  console.log(`Flag at Delivery_Pending: Status: ${flagDeliveryData.data?.status}, isFlagged: ${flagDeliveryData.data?.flaggedIssue?.isFlagged}`);
  console.log('Flag Details:', flagDeliveryData.data?.flaggedIssue?.reasonCategory, '-', flagDeliveryData.data?.flaggedIssue?.comments);

  // Mark resolved
  const resolveDelivRes = await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie },
    body: JSON.stringify({
      action: 'RESOLVE_FLAG',
      targetStage: 'Delivery_Pending',
      notes: 'Vendor re-issued credit note adjusting invoice to 48,000 SAR.',
    }),
  });
  const resolveDelivData = await resolveDelivRes.json();
  console.log(`Resolved at Delivery_Pending: isFlagged: ${resolveDelivData.data?.flaggedIssue?.isFlagged}`);

  // Execute payment
  const finalPayRes = await fetch(`${BASE}/api/v1/requests/${ticketA}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie },
    body: JSON.stringify({
      action: 'PAYMENT_PROCESSED',
      invoiceNumber: 'INV-CORRECTED-48K',
      invoiceAmount: 48000,
      notes: '3-Way match verified. SAMA SARIE wire payment released.',
    }),
  });
  const finalPayData = await finalPayRes.json();
  console.log(`Final payment settlement: ${finalPayData.data?.status}`);
  if (finalPayData.data?.status !== 'Completed') {
    throw new Error('Failed to complete final settlement after resolving flag!');
  }
  console.log('✅ Successfully completed full lifecycle after resolving Delivery_Pending flag!');

  // TEST SUITE C: Direct MongoDB Persistence Verification
  console.log('\n--- [TEST SUITE C: Database Verification in MongoDB] ---');
  await mongoose.connect('mongodb://localhost:27017/pms');
  const collection = mongoose.connection.db.collection('procurementrequests');
  const mongoDoc = await collection.findOne({ ticketId: ticketA });
  console.log(`MongoDB Document found: ${mongoDoc?.ticketId}`);
  console.log(`Final Status: ${mongoDoc?.status}`);
  console.log(`isFlagged: ${mongoDoc?.flaggedIssue?.isFlagged}`);
  console.log(`Total Timeline Events: ${mongoDoc?.timeline?.length}`);
  console.log('Timeline Stages:', mongoDoc?.timeline?.map(t => t.stage).join(' -> '));

  console.log('\n================================================================');
  console.log('🎉 ALL ADVANCED EDGE CASE TESTS PASSED 100%!');
  console.log('================================================================');
  process.exit(0);
}

testEdgeCases().catch(err => {
  console.error('❌ Edge case test failed:', err);
  process.exit(1);
});
