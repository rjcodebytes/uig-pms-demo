import { encode } from 'next-auth/jwt';

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production-32chars';

async function getAuthCookie(role, username = 'user') {
  const token = {
    id: `test-${username}`,
    name: `${role} Test User`,
    username,
    email: `${username}@uig.com`,
    role,
    roleId: `role-${role}`,
    position: `${role} Lead`,
    department: 'Engineering & Procurement',
  };

  const encoded = await encode({
    token,
    secret,
    salt: 'authjs.session-token',
  });

  return `authjs.session-token=${encoded}`;
}

const BASE = 'http://localhost:3005';

async function runPressureTest() {
  console.log('================================================================');
  console.log('🚀 STARTING COMPREHENSIVE FLAG & REVERT PRESSURE TEST');
  console.log('================================================================');

  const initiatorCookie = await getAuthCookie('Initiator', 'initiator');
  const approverCookie = await getAuthCookie('Approver', 'approver');
  const financeCookie = await getAuthCookie('Store Incharge', 'storeincharge');
  const storekeeperCookie = await getAuthCookie('Store Keeper', 'storekeeper');
  const adminCookie = await getAuthCookie('Admin', 'admin');

  // STEP 1: Create a fresh test requisition
  console.log('\n[STEP 1] Creating fresh requisition as Initiator...');
  const createRes = await fetch(`${BASE}/api/v1/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': initiatorCookie,
    },
    body: JSON.stringify({
      subject: 'Pressure Test Heavy Duty CAT Excavator Filters',
      requester: {
        name: 'Saad Al-Qahtani',
        email: 'saad@uig.com',
        department: 'Heavy Machinery Maintenance',
        mobile: '+966 50 111 2233',
      },
      project: {
        projectId: 'PRJ-TEST-FLAG',
        projectName: 'Riyadh Metro Extension Phase 2',
        allocatedBudget: 250000,
        client: 'RCRC Riyadh',
      },
      location: 'Riyadh',
      itemDetails: {
        name: 'CAT Hydraulic High-Pressure Filter Cartridges',
        category: 'Heavy Machinery & Filters',
        description: 'OEM Certified 25-micron hydraulic filtration modules for CAT 336 Excavators',
        quantity: 50,
        unit: 'Cartridges',
        targetPrice: 300,
      },
      priority: 'High',
      businessJustification: {
        purpose: 'Mandatory preventive replacement before tunnel excavation phase.',
        urgencyReason: 'Critical maintenance cycle due in 4 days.',
        impactIfNotApproved: 'Hydraulic pump failure risking 40,000 SAR/day site stoppage.',
      },
    }),
  });

  const createData = await createRes.json();
  if (!createData.success || !createData.data) {
    console.error('❌ Failed to create requisition:', createData);
    process.exit(1);
  }

  const reqDoc = createData.data;
  const ticketId = reqDoc.ticketId;
  const mongoId = reqDoc._id;
  console.log(`✅ Created Requisition Ticket: ${ticketId} (ID: ${mongoId}), Initial Status: ${reqDoc.status}`);

  // STEP 2: Sourcing submit 3 bids -> Technical_Approval
  console.log('\n[STEP 2] Submitting 3 initial tender bids...');
  const initialQuotes = [
    {
      vendorName: 'Zahid Tractor & Heavy Machinery',
      totalPrice: 16000,
      unitPrice: 320,
      leadTimeDays: 2,
      specificationsText: 'CAT OEM Original Certified Part #1R-0716',
      warrantyTerms: '12 Months Caterpillar Warranty',
      quotationDocUrl: '/docs/zahid-quote.pdf',
      isChosen: true,
    },
    {
      vendorName: 'Al-Khorayef Commercial Sourcing',
      totalPrice: 17500,
      unitPrice: 350,
      leadTimeDays: 4,
      specificationsText: 'Donaldson Equivalent Industrial Grade',
      warrantyTerms: '6 Months Replacement',
      quotationDocUrl: '/docs/alkhorayef-quote.pdf',
      isChosen: false,
    },
    {
      vendorName: 'Rawabi Equipment Parts',
      totalPrice: 19000,
      unitPrice: 380,
      leadTimeDays: 7,
      specificationsText: 'Generic hydraulic filtration units',
      warrantyTerms: 'Standard DOA Warranty',
      quotationDocUrl: '/docs/rawabi-quote.pdf',
      isChosen: false,
    },
  ];

  const submitQuotesRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': initiatorCookie,
    },
    body: JSON.stringify({
      action: 'QUOTES_SUBMITTED',
      quotations: initialQuotes,
    }),
  });
  const submitQuotesData = await submitQuotesRes.json();
  console.log(`Submit quotes status: ${submitQuotesRes.status}, New Request Status: ${submitQuotesData.data?.status}`);
  if (submitQuotesData.data?.status !== 'Technical_Approval') {
    console.error('❌ Expected status Technical_Approval, got:', submitQuotesData.data?.status);
  } else {
    console.log('✅ Requisition successfully moved to Technical_Approval');
  }

  // STEP 3: Technical Approver flags an issue and reverts to Quotation_Collection
  console.log('\n[STEP 3] Approver flags technical spec non-compliance and reverts to Quotation_Collection...');
  const flag1Res = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': approverCookie,
    },
    body: JSON.stringify({
      action: 'FLAG_ISSUE',
      targetStage: 'Quotation_Collection',
      currentStage: 'Technical_Approval',
      reasonCategory: 'Substandard OEM Specifications / Wrong Model',
      notes: 'Part #1R-0716 is for older gen models. We require #1R-0770 high-efficiency synthetic media with 36-month warranty.',
      flaggedBy: 'Dr. Tariq Al-Mansoor',
      flaggedRole: 'Approver',
    }),
  });
  const flag1Data = await flag1Res.json();
  console.log(`Flag 1 response (${flag1Res.status}):`, flag1Data.success ? 'SUCCESS' : flag1Data.message);
  if (flag1Data.data?.status !== 'Quotation_Collection' || !flag1Data.data?.flaggedIssue?.isFlagged) {
    console.error('❌ Flag 1 verification failed! Status:', flag1Data.data?.status, 'Flagged:', flag1Data.data?.flaggedIssue);
  } else {
    console.log('✅ Successfully flagged & reverted to Quotation_Collection!');
    console.log('   Flag Reason:', flag1Data.data.flaggedIssue.reasonCategory);
    console.log('   Comments:', flag1Data.data.flaggedIssue.comments);
  }

  // STEP 4: Sourcing resubmits revised quotes
  console.log('\n[STEP 4] Resubmitting revised compliant bids...');
  const revisedQuotes = [
    {
      vendorName: 'Zahid Tractor & Heavy Machinery',
      totalPrice: 18000,
      unitPrice: 360,
      leadTimeDays: 2,
      specificationsText: 'CAT OEM Part #1R-0770 Ultra High Efficiency Synthetic Media',
      warrantyTerms: '36 Months Caterpillar ProCare Warranty',
      quotationDocUrl: '/docs/zahid-quote-revised.pdf',
      isChosen: true,
    },
    {
      vendorName: 'Al-Khorayef Commercial Sourcing',
      totalPrice: 19500,
      unitPrice: 390,
      leadTimeDays: 3,
      specificationsText: 'CAT OEM Part #1R-0770 Certified Stock',
      warrantyTerms: '24 Months Warranty',
      quotationDocUrl: '/docs/alkhorayef-quote.pdf',
      isChosen: false,
    },
  ];

  const resubmitRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': initiatorCookie,
    },
    body: JSON.stringify({
      action: 'QUOTES_SUBMITTED',
      quotations: revisedQuotes,
    }),
  });
  const resubmitData = await resubmitRes.json();
  console.log(`Resubmit quotes response (${resubmitRes.status}): New Status:`, resubmitData.data?.status);
  console.log(`isFlagged cleared after resubmit:`, resubmitData.data?.flaggedIssue?.isFlagged);

  // STEP 5: Technical Approver approves -> Finance_Review
  console.log('\n[STEP 5] Technical Approver approves revised specs...');
  const techApproveRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/technical-approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': approverCookie,
    },
    body: JSON.stringify({
      isApproved: true,
      notes: 'OEM #1R-0770 verified compliant with 36-month warranty.',
    }),
  });
  const techApproveData = await techApproveRes.json();
  console.log(`Tech approve response (${techApproveRes.status}): New Status:`, techApproveData.data?.status);

  // STEP 6: Finance Controller flags commercial discrepancy & reverts to Quotation_Collection
  console.log('\n[STEP 6] Finance Controller flags commercial issue and reverts...');
  const flag2Res = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': financeCookie,
    },
    body: JSON.stringify({
      action: 'FLAG_ISSUE',
      targetStage: 'Quotation_Collection',
      currentStage: 'Finance_Review',
      reasonCategory: 'Price Variance Exceeds Baseline (Over 15% Baseline)',
      notes: 'Target unit price is 300 SAR; quoted 360 SAR exceeds baseline tolerance. Please negotiate corporate discount.',
      flaggedBy: 'Mansour Al-Ghamdi',
      flaggedRole: 'Store Incharge',
    }),
  });
  const flag2Data = await flag2Res.json();
  console.log(`Flag 2 response (${flag2Res.status}):`, flag2Data.success ? 'SUCCESS' : flag2Data.message);
  console.log(`Status after finance flag:`, flag2Data.data?.status, `isFlagged:`, flag2Data.data?.flaggedIssue?.isFlagged);

  // STEP 7: Re-sourcing & approving again to PO_Generated
  console.log('\n[STEP 7] Sourcing discounted quotes and moving through Tech & Finance approval...');
  const discountedQuotes = [
    {
      vendorName: 'Zahid Tractor & Heavy Machinery',
      totalPrice: 15000,
      unitPrice: 300,
      leadTimeDays: 2,
      specificationsText: 'CAT OEM Part #1R-0770 (Corporate Fleet Rate Applied)',
      warrantyTerms: '36 Months Warranty',
      quotationDocUrl: '/docs/zahid-discounted.pdf',
      isChosen: true,
    },
  ];

  await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': initiatorCookie },
    body: JSON.stringify({ action: 'QUOTES_SUBMITTED', quotations: discountedQuotes }),
  });

  await fetch(`${BASE}/api/v1/requests/${ticketId}/technical-approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': approverCookie },
    body: JSON.stringify({ isApproved: true, notes: 'Technically approved discounted quote.' }),
  });

  const finApproveRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/finance-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie },
    body: JSON.stringify({ isApproved: true, notes: 'Finance approved: 15,000 SAR within budget baseline.' }),
  });
  const finApproveData = await finApproveRes.json();
  console.log(`Finance approve response (${finApproveRes.status}): New Status:`, finApproveData.data?.status, 'PO #:', finApproveData.data?.purchaseOrder?.poNumber);

  // STEP 8: Storekeeper flags delivery delay while at PO_Generated
  console.log('\n[STEP 8] Storekeeper flags vendor delivery delay at PO_Generated...');
  const flag3Res = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': storekeeperCookie,
    },
    body: JSON.stringify({
      action: 'FLAG_ISSUE',
      targetStage: 'PO_Generated',
      currentStage: 'PO_Generated',
      reasonCategory: 'Delivery Lead Time Too Slow (Exceeds Project Deadline)',
      notes: 'Zahid courier reported logistics customs delay, revised arrival in 48 hours.',
      flaggedBy: 'Hamad Al-Harbi',
      flaggedRole: 'Store Keeper',
    }),
  });
  const flag3Data = await flag3Res.json();
  console.log(`Flag 3 response (${flag3Res.status}):`, flag3Data.success ? 'SUCCESS' : flag3Data.message);
  if (!flag3Data.success) {
    console.error('❌ Storekeeper flag failed:', flag3Data.message);
  } else {
    console.log('✅ Storekeeper successfully flagged issue at PO_Generated!');
  }

  // STEP 9: Test RESOLVE_FLAG action
  console.log('\n[STEP 9] Resolving flagged issue...');
  const resolveRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': storekeeperCookie,
    },
    body: JSON.stringify({
      action: 'RESOLVE_FLAG',
      targetStage: 'PO_Generated',
      notes: 'Logistics delay resolved; shipment cleared customs and en route.',
    }),
  });
  const resolveData = await resolveRes.json();
  console.log(`Resolve flag response (${resolveRes.status}):`, resolveData.success ? 'SUCCESS' : resolveData.message);
  console.log(`isFlagged after resolve:`, resolveData.data?.flaggedIssue?.isFlagged);

  // STEP 10: Complete Delivery & 3-Way Payment
  console.log('\n[STEP 10] Signing 3-Party GRN Delivery & Final 3-Way Match Settlement...');
  const grnRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': storekeeperCookie },
    body: JSON.stringify({
      action: 'DELIVERY_CONFIRMED',
      driverName: 'Fahad Al-Otaibi (Zahid Express Delivery)',
      waybillNumber: 'WB-ZAHID-98214',
      documentUrl: '/docs/zahid-signed-grn.pdf',
      notes: 'All 50 cartridges received in sealed original Caterpillar packaging. 100% zero damage.',
    }),
  });
  const grnData = await grnRes.json();
  console.log(`GRN Confirmation (${grnRes.status}): New Status:`, grnData.data?.status);

  const payRes = await fetch(`${BASE}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie },
    body: JSON.stringify({
      action: 'PAYMENT_PROCESSED',
      invoiceNumber: 'INV-ZAHID-2026-88',
      invoiceAmount: 15000,
      notes: '3-Way Match verified (15,000 SAR PO == 50 Units GRN == 15,000 SAR Invoice). Payment executed.',
    }),
  });
  const payData = await payRes.json();
  console.log(`Payment Settlement (${payRes.status}): New Status:`, payData.data?.status, 'Txn Ref:', payData.data?.paymentRecord?.transactionRef);

  // STEP 11: Inspect Timeline Integrity
  console.log('\n[STEP 11] Checking audit trail & timeline entries...');
  const getReqRes = await fetch(`${BASE}/api/v1/requests/${ticketId}`, {
    headers: { 'Cookie': adminCookie },
  });
  const finalDoc = (await getReqRes.json()).data;
  console.log(`Total timeline entries recorded: ${finalDoc.timeline?.length}`);
  finalDoc.timeline?.forEach((t, idx) => {
    console.log(`  ${idx + 1}. [${t.stage || t.status}] by ${t.actor} (${t.role}): ${t.notes?.slice(0, 70)}...`);
  });

  console.log('\n================================================================');
  console.log('🎯 PRESSURE TEST COMPLETED');
  console.log('================================================================');
}

runPressureTest().catch(console.error);
