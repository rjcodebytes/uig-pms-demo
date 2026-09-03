async function runTests() {
  console.log("=== RUNNING API SECURITY & FUNCTIONALITY TESTS ===");

  // Test 1: Unauthenticated technical-approve
  const res1 = await fetch("http://localhost:3005/api/v1/requests/PR-2026-88101/technical-approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isApproved: true }),
  });
  console.log(`[TEST 1] Unauthenticated technical-approve status: ${res1.status} (Expected: 401)`);
  const data1 = await res1.json();
  console.log(`         Response:`, data1);

  // Test 2: Invalid location POST to requests
  const res2 = await fetch("http://localhost:3005/api/v1/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location: "Nowhere Land" }),
  });
  console.log(`[TEST 2] Invalid location POST status: ${res2.status} (Expected: 400)`);
  const data2 = await res2.json();
  console.log(`         Response:`, data2);

  // Test 3: Unauthenticated vendor POST
  const res3 = await fetch("http://localhost:3005/api/v1/vendors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorName: "Test Vendor", crNumber: "123", vatNumber: "456" }),
  });
  console.log(`[TEST 3] Unauthenticated Vendor POST status: ${res3.status} (Expected: 401)`);
  const data3 = await res3.json();
  console.log(`         Response:`, data3);

  // Test 4: WhatsApp Webhook ingestion (Fallback resilience)
  const res4 = await fetch("http://localhost:3005/api/v1/webhook/whatsapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderPhone: "+966501123344",
      senderName: "Eng. Mohammed Al-Saud",
      messageText: "Need 20 Safety Helmets in Riyadh urgently",
    }),
  });
  console.log(`[TEST 4] WhatsApp Webhook status: ${res4.status} (Expected: 201)`);
  const data4 = await res4.json();
  console.log(`         Response ticketId:`, data4.ticketId, `assignedTo:`, data4.assignedTo?.name);

  // Test 5: Document PDF route
  const res5 = await fetch("http://localhost:3005/api/documents/sample-doc-id/pdf");
  console.log(`[TEST 5] PDF Route status: ${res5.status} (Expected: 200), Content-Type: ${res5.headers.get("content-type")}`);

  console.log("=== ALL TESTS COMPLETE ===");
}

runTests();
