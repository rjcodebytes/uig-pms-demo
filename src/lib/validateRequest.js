// src/lib/validateRequest.js

export const ALLOWED_LOCATIONS = ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Other'];

export function normalizeLocation(loc) {
  if (!loc || typeof loc !== 'string') return 'Riyadh';
  const clean = loc.trim();
  const match = ALLOWED_LOCATIONS.find(l => l.toLowerCase() === clean.toLowerCase());
  return match || 'Riyadh';
}

export function validateProcurementRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return 'Request body is required';
  }

  // Location validation & normalization
  if (body.location) {
    body.location = normalizeLocation(body.location);
  } else {
    body.location = 'Riyadh';
  }

  // Requester validation
  if (!body.requester || typeof body.requester !== 'object') {
    body.requester = {
      name: 'Eng. Mohammed Al-Saud (Site Lead)',
      email: 'm.alsaud@uig.com',
      department: 'Site Engineering Division',
    };
  } else {
    if (!body.requester.name || typeof body.requester.name !== 'string' || !body.requester.name.trim()) {
      body.requester.name = 'Eng. Mohammed Al-Saud (Site Lead)';
    }
    if (!body.requester.email || typeof body.requester.email !== 'string' || !body.requester.email.trim()) {
      body.requester.email = 'm.alsaud@uig.com';
    }
    if (!body.requester.department || typeof body.requester.department !== 'string' || !body.requester.department.trim()) {
      body.requester.department = 'Site Civil Engineering';
    }
  }

  // Project validation
  if (!body.project || typeof body.project !== 'object') {
    body.project = {
      projectId: 'PRJ-RYD-METRO',
      projectName: 'Riyadh Metro Extension Phase 2',
      allocatedBudget: 350000,
    };
  } else {
    if (!body.project.projectId || typeof body.project.projectId !== 'string' || !body.project.projectId.trim()) {
      body.project.projectId = 'PRJ-GEN-OPS';
    }
    if (!body.project.projectName || typeof body.project.projectName !== 'string' || !body.project.projectName.trim()) {
      body.project.projectName = 'General Infrastructure Project';
    }
    const budgetNum = Number(body.project.allocatedBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      body.project.allocatedBudget = 350000;
    } else {
      body.project.allocatedBudget = budgetNum;
    }
  }

  // Item Details validation
  if (!body.itemDetails || typeof body.itemDetails !== 'object') {
    return 'Item details object is required with name, category, and quantity';
  }
  if (!body.itemDetails.name || typeof body.itemDetails.name !== 'string' || !body.itemDetails.name.trim()) {
    return 'Item name is required';
  }
  if (!body.itemDetails.category || typeof body.itemDetails.category !== 'string' || !body.itemDetails.category.trim()) {
    body.itemDetails.category = 'General Site Supplies';
  }
  const qtyNum = Number(body.itemDetails.quantity);
  if (isNaN(qtyNum) || qtyNum < 1) {
    return 'Item quantity is required and must be a number greater than or equal to 1';
  }
  body.itemDetails.quantity = qtyNum;

  if (body.itemDetails.targetPrice !== undefined) {
    const targetNum = Number(body.itemDetails.targetPrice);
    body.itemDetails.targetPrice = isNaN(targetNum) ? undefined : targetNum;
  }

  return null;
}
