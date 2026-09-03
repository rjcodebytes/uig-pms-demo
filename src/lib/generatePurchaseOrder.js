// src/lib/generatePurchaseOrder.js

export function generatePurchaseOrderData(existingPO = {}) {
  if (existingPO?.poNumber) {
    return existingPO;
  }

  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);

  return {
    poNumber: `PO-${year}-${randomSuffix}`,
    generatedAt: new Date(),
    vendorSentConfirmation: true,
    paymentTerms: existingPO.paymentTerms || 'Net 30 Days after GRN',
    poDocumentUrl: existingPO.poDocumentUrl || '/docs/po-sample.pdf',
  };
}
