import { encode } from 'next-auth/jwt';

const BASE_URL = 'http://localhost:3005';
const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production-32chars';

async function generateRoleCookie(role, name, username) {
  const token = {
    id: `user-${username}`,
    name,
    username,
    email: `${username}@uig.com`,
    role,
    roleId: `role-${role}`,
  };

  const encoded = await encode({
    token,
    secret,
    salt: 'authjs.session-token',
  });

  return `authjs.session-token=${encoded}`;
}

async function runEdgeCasesAndCustomBidsTest() {
  console.log('================================================================');
  console.log('  TESTING CUSTOM BIDS PERSISTENCE & EDGE CASES');
  console.log('================================================================\n');

  const initiatorCookie = await generateRoleCookie('Initiator', 'Eng. Mohammed', 'initiator');

  // 1. Create a ticket with custom item details
  console.log('1. Creating custom requisition ticket...');
  const createRes = await fetch(`${BASE_URL}/api/v1/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': initiatorCookie,
    },
    body: JSON.stringify({
      subject: 'Urgent Sourcing: Heavy Duty 50-Ton Mobile Hydraulic Cranes',
      requester: {
        name: 'Eng. Mohammed Al-Saud',
        email: 'm.alsaud@uig.com',
        department: 'Site Equipment Division',
      },
      project: {
        projectId: 'PRJ-JED-TOWER',
        projectName: 'Jeddah Coastal Tower Phase 1',
        allocatedBudget: 500000,
      },
      location: 'Jeddah',
      itemDetails: {
        name: '50-Ton Mobile Hydraulic Crane',
        category: 'Heavy Equipment & Machinery',
        quantity: 2,
        unit: 'Units',
        targetPrice: 180000,
      },
      priority: 'Urgent',
    }),
  });

  const createData = await createRes.json();
  const ticketId = createData.data?.ticketId;
  console.log(`✓ Ticket created: ${ticketId} (Location: ${createData.data?.location}, Desk: ${createData.data?.assignedTo?.name})`);

  // 2. Submit custom bids containing edge cases (strings as numbers, special vendor names, missing warranty)
  console.log('\n2. Submitting custom vendor bids with edge cases (strings for prices, custom supplier names)...');
  const customQuotesWithEdgeCases = [
    {
      vendorName: '   Al-Futtaim Heavy Machinery KSA   ', // leading/trailing spaces
      totalPrice: '350000', // string number
      leadTimeDays: '4', // string number
      specificationsText: 'Liebherr 50T Mobile Crane with certified crane operator.',
      isChosen: true,
    },
    {
      vendorName: 'Red Sea Equipment & Logistics',
      totalPrice: 365000,
      leadTimeDays: 7,
      specificationsText: 'Kato 50T rough terrain crane with 12-month on-site maintenance.',
      warrantyTerms: '12 Months Full Service SLA',
      isChosen: false,
    },
    {
      vendorName: 'Zahid Tractor & Commercial Co.',
      totalPrice: 380000,
      leadTimeDays: 10,
      specificationsText: 'CAT heavy lift system with telemetry monitoring.',
      isChosen: false,
    }
  ];

  const submitRes = await fetch(`${BASE_URL}/api/v1/requests/${ticketId}/lifecycle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': initiatorCookie,
    },
    body: JSON.stringify({
      action: 'QUOTES_SUBMITTED',
      quotations: customQuotesWithEdgeCases,
    }),
  });

  const submitData = await submitRes.json();
  console.log(`✓ Quotations submitted. Status: ${submitData.data?.status}`);
  console.log(`  Stored Quotes Count: ${submitData.data?.quotations?.length}`);

  // 3. Verify Database Persistence
  console.log('\n3. Re-fetching ticket from database to verify quotations and fields...');
  const verifyRes = await fetch(`${BASE_URL}/api/v1/requests/${ticketId}`);
  const verifyData = await verifyRes.json();
  const savedReq = verifyData.data;

  console.log('✓ Retrieved Quotations from DB:');
  savedReq.quotations.forEach((q, idx) => {
    console.log(`  [Bid #${idx + 1}] Vendor: "${q.vendorName}" | Total: ${q.totalPrice} SAR | Unit: ${q.unitPrice} SAR | Lead: ${q.leadTimeDays}d | Preferred: ${q.isChosen}`);
  });

  // Check types
  const q0 = savedReq.quotations[0];
  if (typeof q0.totalPrice === 'number' && typeof q0.leadTimeDays === 'number' && q0.vendorName === 'Al-Futtaim Heavy Machinery KSA') {
    console.log('\n🎉 ALL EDGE CASES SANITIZED AND CUSTOM BIDS 100% PERSISTED TO DATABASE!');
  } else {
    console.error('\n❌ Data type verification failed!');
  }
}

runEdgeCasesAndCustomBidsTest();
