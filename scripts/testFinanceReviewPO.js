import { generatePurchaseOrderData } from '../src/lib/generatePurchaseOrder.js';
import { mockDb } from '../src/lib/mockDb.js';

async function testMockFinanceReview() {
  console.log("=== TESTING FINANCE REVIEW PO GENERATION ON MOCK STORE ===");
  
  const index = mockDb.requests.findIndex(r => r.ticketId === 'PR-2026-88102');
  if (index === -1) {
    console.error("Ticket PR-2026-88102 not found in mockDb");
    return;
  }

  console.log("Before review, status:", mockDb.requests[index].status);
  console.log("Before review, PO:", mockDb.requests[index].purchaseOrder);

  // Simulate finance approval on fallback path
  const isApproved = true;
  if (isApproved && !mockDb.requests[index].purchaseOrder?.poNumber) {
    mockDb.requests[index].purchaseOrder = generatePurchaseOrderData(mockDb.requests[index].purchaseOrder);
  }
  mockDb.requests[index].status = 'PO_Generated';

  console.log("After review, status:", mockDb.requests[index].status);
  console.log("After review, PO:", mockDb.requests[index].purchaseOrder);
  console.log("poNumber exists:", Boolean(mockDb.requests[index].purchaseOrder?.poNumber));

  if (mockDb.requests[index].purchaseOrder?.poNumber?.startsWith('PO-')) {
    console.log("✓ SUCCESS: PO Number properly generated on fallback path:", mockDb.requests[index].purchaseOrder.poNumber);
  } else {
    console.error("✗ FAILURE: PO Number missing or malformed");
  }
}

testMockFinanceReview();
