// src/lib/validateRequest.js

export const ALLOWED_LOCATIONS = ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Other'];

export function validateProcurementRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return 'Request body is required';
  }

  // Location validation
  const location = body.location;
  if (!location || !ALLOWED_LOCATIONS.includes(location)) {
    return `Invalid location: '${location}'. Must be one of: ${ALLOWED_LOCATIONS.join(', ')}`;
  }

  // Requester validation
  const requester = body.requester;
  if (!requester || typeof requester !== 'object') {
    return 'Requester object is required with name, email, and department';
  }
  if (!requester.name || typeof requester.name !== 'string' || !requester.name.trim()) {
    return 'Requester name is required';
  }
  if (!requester.email || typeof requester.email !== 'string' || !requester.email.trim()) {
    return 'Requester email is required';
  }
  if (!requester.department || typeof requester.department !== 'string' || !requester.department.trim()) {
    return 'Requester department is required';
  }

  // Project validation
  const project = body.project;
  if (!project || typeof project !== 'object') {
    return 'Project object is required with projectId, projectName, and allocatedBudget';
  }
  if (!project.projectId || typeof project.projectId !== 'string' || !project.projectId.trim()) {
    return 'Project ID is required';
  }
  if (!project.projectName || typeof project.projectName !== 'string' || !project.projectName.trim()) {
    return 'Project Name is required';
  }
  if (project.allocatedBudget === undefined || typeof project.allocatedBudget !== 'number' || isNaN(project.allocatedBudget)) {
    return 'Project allocated budget is required and must be a valid number';
  }

  // Item Details validation
  const itemDetails = body.itemDetails;
  if (!itemDetails || typeof itemDetails !== 'object') {
    return 'Item details object is required with name, category, and quantity';
  }
  if (!itemDetails.name || typeof itemDetails.name !== 'string' || !itemDetails.name.trim()) {
    return 'Item name is required';
  }
  if (!itemDetails.category || typeof itemDetails.category !== 'string' || !itemDetails.category.trim()) {
    return 'Item category is required';
  }
  if (itemDetails.quantity === undefined || typeof itemDetails.quantity !== 'number' || itemDetails.quantity < 1 || isNaN(itemDetails.quantity)) {
    return 'Item quantity is required and must be a number greater than or equal to 1';
  }

  return null;
}
