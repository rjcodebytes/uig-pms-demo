// src/lib/sanitizeQuotations.js

export function sanitizeQuotations(rawQuotations = [], itemQuantity = 1) {
  if (!Array.isArray(rawQuotations) || rawQuotations.length === 0) {
    return [];
  }

  const qty = typeof itemQuantity === 'number' && itemQuantity > 0 ? itemQuantity : 1;

  const sanitized = rawQuotations.map((q, idx) => {
    const vendorName = (q.vendorName || q.supplierName || `Approved Supplier #${idx + 1}`).trim();
    const totalPrice = Number(q.totalPrice) > 0 ? Number(q.totalPrice) : (Number(q.unitPrice) > 0 ? Number(q.unitPrice) * qty : 1000);
    const unitPrice = Number(q.unitPrice) > 0 ? Number(q.unitPrice) : Number((totalPrice / qty).toFixed(2));
    const leadTimeDays = Number(q.leadTimeDays) > 0 ? Math.round(Number(q.leadTimeDays)) : 3;
    const specificationsText = (q.specificationsText || q.specifications || 'Standard OEM certified specifications meeting project requirements.').trim();
    const warrantyTerms = (q.warrantyTerms || '12 Months Standard Warranty').trim();
    const isChosen = Boolean(q.isChosen);
    const quotationDocUrl = (q.quotationDocUrl || `/docs/quote-${idx + 1}.pdf`).trim();

    return {
      vendorName,
      totalPrice,
      unitPrice,
      leadTimeDays,
      specificationsText,
      warrantyTerms,
      isChosen,
      quotationDocUrl,
    };
  });

  // Ensure at least one quotation is marked as chosen
  const hasChosen = sanitized.some(q => q.isChosen);
  if (!hasChosen && sanitized.length > 0) {
    sanitized[0].isChosen = true;
  }

  return sanitized;
}
