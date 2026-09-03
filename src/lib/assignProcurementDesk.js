// src/lib/assignProcurementDesk.js

export function getAssignedProcurementDesk(location) {
  switch (location) {
    case 'Riyadh':
      return {
        name: 'Riyadh Central Procurement Desk',
        desk: 'Central Hub Desk',
        officer: 'Tariq Al-Mansoor',
      };
    case 'Jeddah':
      return {
        name: 'Western Province Procurement Desk',
        desk: 'Western Desk',
        officer: 'Fahad Al-Harbi',
      };
    case 'Dammam':
    case 'Khobar':
      return {
        name: 'Eastern Province Procurement Desk',
        desk: 'Eastern Desk',
        officer: 'Sultan Al-Otaibi',
      };
    default:
      return {
        name: 'National Procurement Desk',
        desk: 'General Desk',
        officer: 'Operations Desk',
      };
  }
}
