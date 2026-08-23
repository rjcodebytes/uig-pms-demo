// src/lib/mockDb.js
// Persistent in-memory store for Next.js development server
// This simulates a live database for the local demo.

if (!global._mockDb) {
  global._mockDb = {
    requests: [
      {
        _id: '1',
        ticketId: 'REQ-2024-001',
        requester: 'Mohammed Al-Saud',
        department: 'Operations',
        location: 'Riyadh',
        project: { projectId: 'PRJ-RYD-01', projectName: 'Riyadh Metro Expansion' },
        itemDetails: { name: 'Industrial Safety Helmets', category: 'Safety', quantity: 500 },
        status: 'Quotation_Collection',
        priority: 'High',
        timeline: [{ status: 'Incoming', date: new Date().toISOString(), notes: 'Created via WhatsApp' }],
        vendorQuotations: []
      },
      {
        _id: '2',
        ticketId: 'REQ-2024-002',
        requester: 'Fatima Al-Hassan',
        department: 'IT',
        location: 'Jeddah',
        project: { projectId: 'PRJ-JED-05', projectName: 'HQ Network Upgrade' },
        itemDetails: { name: 'Cisco Core Switches', category: 'IT', quantity: 4 },
        status: 'Technical_Approval',
        priority: 'Critical',
        timeline: [
          { status: 'Incoming', date: new Date().toISOString() },
          { status: 'Quotation_Collection', date: new Date().toISOString() }
        ],
        vendorQuotations: [
          { vendorName: 'Al-Jazirah Tech', totalPrice: 45000, leadTimeDays: 14, specificationsText: 'Enterprise grade Cisco switches.', quotationDocUrl: '#', isChosen: false },
          { vendorName: 'Saudi IT Solutions', totalPrice: 42000, leadTimeDays: 21, specificationsText: 'Refurbished Cisco switches.', quotationDocUrl: '#', isChosen: false },
          { vendorName: 'Global Net KSA', totalPrice: 46000, leadTimeDays: 7, specificationsText: 'Latest gen Cisco switches.', quotationDocUrl: '#', isChosen: false }
        ]
      }
    ]
  };
}

export const mockDb = global._mockDb;
