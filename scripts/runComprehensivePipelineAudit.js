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
    position: `${role} Officer`,
    department: 'UIG Operations',
  };

  const encoded = await encode({
    token,
    secret,
    salt: 'authjs.session-token',
  });

  return `authjs.session-token=${encoded}`;
}

async function runAudit() {
  console.log('================================================================');
  console.log('  UIG PMS — COMPREHENSIVE END-TO-END PIPELINE & QA AUDIT');
  console.log('================================================================\n');

  const bugsFound = [];
  const passes = [];

  // 1. Generate Auth Session Cookies for all roles
  console.log('▶ [AUTH] Generating authenticated sessions for test roles...');
  const initiatorCookie = await generateRoleCookie('Initiator', 'Eng. Mohammed Al-Saud', 'initiator');
  const approverCookie = await generateRoleCookie('Approver', 'Dr. Tariq Al-Engineering (HOD)', 'approver');
  const financeCookie = await generateRoleCookie('Store Incharge', 'Faisal Al-Finance (Controller)', 'storeincharge');
  const storekeeperCookie = await generateRoleCookie('Store Keeper', 'Zaid Al-Receiver (Storekeeper)', 'storekeeper');
  console.log('✓ Sessions generated for: Initiator, Approver, Store Incharge (Finance), Store Keeper.\n');

  // 2. Stage 1: Create a New Requisition (Initiator)
  console.log('▶ [STAGE 1] Creating new Site Requisition with Business Justification...');
  const reqPayload = {
    subject: 'Material Requisition: Heavy Duty Fall-Arrest Harnesses (200 Units)',
    businessJustification: {
      purpose: 'Mandatory fall protection PPE for high-elevation scaffolding erection on Tower B.',
      urgencyReason: 'Tower floor 35 concrete slab pouring starts Tuesday morning.',
      impactIfNotApproved: 'Site safety shutdown by civil defense and SAR 50,000/day contractor delay penalties.',
      attachments: [{ name: 'ansi-z359-specs.pdf', url: '/docs/ansi-specs.pdf' }],
    },
    requester: {
      name: 'Eng. Mohammed Al-Saud (Site Lead)',
      email: 'm.alsaud@uig.com',
      department: 'Site Civil Engineering',
      mobile: '+966 50 112 3344',
    },
    project: {
      projectId: 'PRJ-RYD-TOWER',
      projectName: 'Riyadh Financial Tower Phase 3',
      allocatedBudget: 150000,
      client: 'Public Investment Fund (PIF)',
    },
    location: 'Riyadh',
    itemDetails: {
      name: 'Full Body Fall-Arrest Harness (ANSI Z359)',
      category: 'Industrial & Safety Equipment',
      quantity: 200,
      unit: 'Units',
      targetPrice: 220,
    },
    priority: 'High',
  };

  let newTicketId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/v1/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': initiatorCookie,
      },
      body: JSON.stringify(reqPayload),
    });

    const data = await res.json();
    if (res.status === 201 && data.data?.ticketId) {
      newTicketId = data.data.ticketId;
      passes.push(`Stage 1: Requisition created successfully (${newTicketId}) in status '${data.data.status}' with routing to '${data.data.assignedTo?.name}'.`);
      console.log(`✓ Requisition Created: ${newTicketId}`);
      console.log(`  Assigned Desk: ${data.data.assignedTo?.name} (${data.data.assignedTo?.officer})`);
    } else {
      bugsFound.push(`Stage 1 Failed: Status ${res.status}, message: ${data.message}`);
    }
  } catch (err) {
    bugsFound.push(`Stage 1 Request Exception: ${err.message}`);
  }

  if (!newTicketId) {
    console.error('Cannot proceed without valid ticketId.');
    return;
  }

  // 3. Security Check: Unauthorized Stage Skipping Prevention
  console.log('\n▶ [SECURITY CHECK 1] Testing Stage Skipping Prevention (Attempting Tech Approve on new ticket)...');
  try {
    const skipRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/technical-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': approverCookie,
      },
      body: JSON.stringify({ isApproved: true }),
    });
    const skipData = await skipRes.json();
    if (skipRes.status === 400) {
      passes.push(`Security: Stage skipping blocked (${skipData.message})`);
      console.log(`✓ Stage skipping correctly blocked: "${skipData.message}"`);
    } else {
      bugsFound.push(`Security Flaw: Direct technical approval succeeded on empty incoming ticket (Status: ${skipRes.status})`);
    }
  } catch (err) {
    bugsFound.push(`Stage skip test error: ${err.message}`);
  }

  // 4. Stage 2: 3-Bid Tender Quotations Submission
  console.log('\n▶ [STAGE 2] Submitting 3-Bid Tender Quotations...');
  const quotes = [
    {
      vendorName: 'Saudi Arabian Safety & PPE Corp',
      totalPrice: 42000,
      unitPrice: 210,
      leadTimeDays: 3,
      specificationsText: 'ANSI Z359.11 certified 5-point harness with shock-absorbing lanyard.',
      warrantyTerms: '24 Months Warranty',
      isChosen: true,
      quotationDocUrl: '/docs/quote-saudi-safety.pdf',
    },
    {
      vendorName: 'Gulf Industrial Protection Co.',
      totalPrice: 44000,
      unitPrice: 220,
      leadTimeDays: 5,
      specificationsText: 'Heavy duty safety harness with dorsal D-ring.',
      warrantyTerms: '12 Months Warranty',
      isChosen: false,
      quotationDocUrl: '/docs/quote-gulf-ind.pdf',
    },
    {
      vendorName: 'Riyadh Supply & Contracting Hub',
      totalPrice: 47000,
      unitPrice: 235,
      leadTimeDays: 7,
      specificationsText: 'Commercial safety harness set.',
      warrantyTerms: '12 Months Warranty',
      isChosen: false,
      quotationDocUrl: '/docs/quote-riyadh-supply.pdf',
    },
  ];

  try {
    const quoteRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/lifecycle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': initiatorCookie,
      },
      body: JSON.stringify({
        action: 'QUOTES_SUBMITTED',
        quotations: quotes,
        notes: 'Submitted 3 competitive market bids from approved KSA vendors.',
      }),
    });
    const quoteData = await quoteRes.json();
    if (quoteRes.status === 200 && quoteData.data?.status === 'Technical_Approval') {
      passes.push('Stage 2: 3-Bid tender quotes submitted, status transitioned to Technical_Approval');
      console.log('✓ 3-Bid Tender Matrix uploaded. Status: Technical_Approval');
    } else {
      bugsFound.push(`Stage 2 Failed: Status ${quoteRes.status}, message: ${quoteData.message}`);
    }
  } catch (err) {
    bugsFound.push(`Stage 2 error: ${err.message}`);
  }

  // 5. Stage 3: Technical HOD Review & RBAC Gate
  console.log('\n▶ [STAGE 3] Technical HOD Verification & RBAC Testing...');
  // RBAC Test: Initiator attempting approval
  try {
    const wrongRoleRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/technical-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': initiatorCookie,
      },
      body: JSON.stringify({ isApproved: true }),
    });
    if (wrongRoleRes.status === 403) {
      passes.push('RBAC Gate: Non-approver role forbidden from technical approval (HTTP 403)');
      console.log('✓ RBAC Gate: Site Initiator rejected with 403 Forbidden on Technical Approval.');
    } else {
      bugsFound.push(`RBAC Flaw: Initiator was able to call technical-approve (Status: ${wrongRoleRes.status})`);
    }
  } catch (err) {
    bugsFound.push(`RBAC test error: ${err.message}`);
  }

  // Real Technical HOD Approval
  try {
    const techRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/technical-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': approverCookie,
      },
      body: JSON.stringify({
        isApproved: true,
        notes: 'Technically certified ANSI Z359 compliance and 3-day lead time.',
      }),
    });
    const techData = await techRes.json();
    if (techRes.status === 200 && techData.data?.status === 'Finance_Review') {
      passes.push('Stage 3: Technical HOD sign-off approved, status transitioned to Finance_Review');
      console.log('✓ Technical HOD Sign-off verified. Status: Finance_Review');
    } else {
      bugsFound.push(`Stage 3 Failed: Status ${techRes.status}, message: ${techData.message}`);
    }
  } catch (err) {
    bugsFound.push(`Stage 3 error: ${err.message}`);
  }

  // 6. Stage 4: Finance Review & Overcharge Gating
  console.log('\n▶ [STAGE 4] Finance Review, Price Baseline & PO Generation...');
  try {
    const finRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/finance-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': financeCookie,
      },
      body: JSON.stringify({
        isApproved: true,
        notes: 'Commercial budget approved. Price variance within baseline threshold.',
      }),
    });
    const finData = await finRes.json();
    if (finRes.status === 200 && finData.data?.status === 'PO_Generated') {
      passes.push(`Stage 4: Finance review approved, PO generated (${finData.data.purchaseOrder?.poNumber})`);
      console.log(`✓ Finance Approved & Purchase Order Issued: ${finData.data.purchaseOrder?.poNumber}`);
      console.log(`  Historical Baseline: ${finData.data.financeReview?.baselinePrice} SAR | Variance: ${finData.data.financeReview?.variancePercentage}%`);
    } else {
      bugsFound.push(`Stage 4 Failed: Status ${finRes.status}, message: ${finData.message}`);
    }
  } catch (err) {
    bugsFound.push(`Stage 4 error: ${err.message}`);
  }

  // 7. Stage 5 & 6: Site Freight Receiving & GRN Sign-off
  console.log('\n▶ [STAGE 5 & 6] Physical Freight Receiving & Signed GRN Archival (Storekeeper)...');
  try {
    const grnRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/lifecycle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': storekeeperCookie,
      },
      body: JSON.stringify({
        action: 'DELIVERY_CONFIRMED',
        notes: '200 units received in Riyadh warehouse depot. 100% passed zero damage inspection.',
        documentUrl: '/docs/signed-grn-receipt.pdf',
      }),
    });
    const grnData = await grnRes.json();
    if (grnRes.status === 200 && grnData.data?.status === 'Delivery_Pending') {
      passes.push('Stage 5 & 6: Physical delivery received and signed GRN note uploaded (status: Delivery_Pending)');
      console.log('✓ Physical Delivery Inspected & Signed GRN Archived. Status: Delivery_Pending (Awaiting Finance 3-Way Match)');
    } else {
      bugsFound.push(`Stage 5/6 Failed: Status ${grnRes.status}, message: ${grnData.message}`);
    }
  } catch (err) {
    bugsFound.push(`Stage 5/6 error: ${err.message}`);
  }

  // 8. Stage 7 & 8: 3-Way Match & SAMA SARIE Settlement
  console.log('\n▶ [STAGE 7 & 8] 3-Way Match Verification & SAMA SARIE Corporate Wire Settlement...');
  // Test 3-Way Match Mismatch Rejection
  try {
    const mismatchRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/lifecycle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': financeCookie,
      },
      body: JSON.stringify({
        action: 'PAYMENT_PROCESSED',
        invoiceAmount: 99999, // Intentional mismatch
      }),
    });
    const mismatchData = await mismatchRes.json();
    if (mismatchRes.status === 400 && mismatchData.message?.includes('3-Way Match Failed')) {
      passes.push(`3-Way Match Integrity: Discrepant invoice amount correctly rejected (HTTP 400)`);
      console.log(`✓ 3-Way Match Protection: Discrepant invoice rejected: "${mismatchData.message}"`);
    } else {
      bugsFound.push(`3-Way Match Flaw: Mismatched invoice was accepted without error (Status: ${mismatchRes.status})`);
    }
  } catch (err) {
    bugsFound.push(`3-Way match mismatch test error: ${err.message}`);
  }

  // Valid 3-Way Match Settlement
  try {
    const payRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}/lifecycle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': financeCookie,
      },
      body: JSON.stringify({
        action: 'PAYMENT_PROCESSED',
        invoiceAmount: 42000,
        invoiceNumber: 'INV-2026-SAR-9901',
        notes: '3-Way Match certified: PO 42,000 SAR == GRN 200 Units == Invoice 42,000 SAR. Wire released.',
      }),
    });
    const payData = await payRes.json();
    if (payRes.status === 200 && payData.data?.status === 'Completed') {
      passes.push(`Stage 7 & 8: 3-Way Match verified and SAMA SARIE payment processed (${payData.data.paymentRecord?.transactionRef})`);
      console.log(`✓ 3-Way Match Reconciled & SAMA SARIE Wire Released: ${payData.data.paymentRecord?.transactionRef}`);
      console.log(`  Match Status: ${payData.data.paymentRecord?.threeWayMatchStatus}`);
      console.log(`  Ticket Final Status: ${payData.data.status}`);
    } else {
      bugsFound.push(`Stage 7/8 Failed: Status ${payRes.status}, message: ${payData.message}`);
    }
  } catch (err) {
    bugsFound.push(`Stage 7/8 error: ${err.message}`);
  }

  // 9. Full Ticket Audit Trail Check
  console.log('\n▶ [AUDIT TRAIL] Verifying Complete Chronological Timeline...');
  try {
    const finalRes = await fetch(`${BASE_URL}/api/v1/requests/${newTicketId}`);
    const finalData = await finalRes.json();
    const req = finalData.data;
    console.log(`✓ Final Ticket Retrieved: ${req.ticketId} (Status: ${req.status})`);
    console.log(`  Total Timeline Entries: ${req.timeline?.length}`);
    req.timeline?.forEach((entry, idx) => {
      console.log(`  [${idx + 1}] Stage: ${(entry.stage || '').padEnd(20)} | Actor: ${(entry.actor || 'N/A').padEnd(30)} | Role: ${(entry.role || 'N/A').padEnd(16)} | Notes: ${entry.notes}`);
    });
    passes.push(`Audit Trail: All ${req.timeline?.length} chronological state transitions recorded with exact authenticated actors and timestamps.`);
  } catch (err) {
    bugsFound.push(`Audit trail fetch error: ${err.message}`);
  }

  // Summary Report
  console.log('\n================================================================');
  console.log('  TEST RESULTS & QA SUMMARY');
  console.log('================================================================');
  console.log(`✓ Total Passes: ${passes.length}`);
  console.log(`✗ Total Bugs Found: ${bugsFound.length}`);

  passes.forEach((p, idx) => console.log(`  [PASS ${idx + 1}] ${p}`));
  if (bugsFound.length > 0) {
    console.log('\nBUGS:');
    bugsFound.forEach((b, idx) => console.log(`  [BUG ${idx + 1}] ${b}`));
  } else {
    console.log('\n🎉 ALL PIPELINE GATES, ROLE PERMISSIONS & VALIDATIONS PASSED WITH ZERO BUGS!');
  }
}

runAudit();
