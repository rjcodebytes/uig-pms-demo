// src/lib/mockDb.js
// Persistent in-memory store for Next.js development server

if (!global._mockDb) {
  global._mockDb = {
    requests: [
      {
        _id: '6a98f6587e392254cc94e794',
        ticketId: 'PR-2026-88101',
        requester: {
          name: 'Eng. Mohammed Al-Saud (Site Lead)',
          email: 'm.alsaud@uig.com',
          department: 'Site Civil Engineering',
          mobile: '+966 50 112 3344',
        },
        project: {
          projectId: 'PRJ-RYD-METRO',
          projectName: 'Riyadh Metro Extension Phase 2',
          allocatedBudget: 350000,
          client: 'Royal Commission for Riyadh City',
        },
        location: 'Riyadh',
        itemDetails: {
          name: 'EN397 Industrial Safety Helmets',
          category: 'Industrial & Safety Equipment',
          description: 'ANSI/ISEA Z89.1 certified heavy-duty site helmets with 4-point chin straps.',
          quantity: 500,
          unit: 'Units',
          targetPrice: 45,
        },
        status: 'Incoming',
        priority: 'High',
        assignedTo: {
          name: 'Riyadh Central Procurement Desk',
          desk: 'Riyadh Central Hub',
          officer: 'Tariq Al-Mansoor',
        },
        timeline: [
          {
            stage: 'Incoming',
            status: 'Incoming',
            date: new Date().toISOString(),
            notes: 'Requisition ingested via WhatsApp Bot from site engineer.',
            actor: 'WhatsApp Bot Ingestion',
          },
        ],
        quotations: [],
      },
      {
        _id: '6a98f6587e392254cc94e795',
        ticketId: 'PR-2026-88102',
        requester: {
          name: 'Fahad Al-Harbi (IT Systems Lead)',
          email: 'f.harbi@uig.com',
          department: 'IT Infrastructure & Telecom',
          mobile: '+966 55 998 8776',
        },
        project: {
          projectId: 'PRJ-JED-COAST',
          projectName: 'Jeddah Coastal Tower Network Expansion',
          allocatedBudget: 120000,
          client: 'Jeddah Waterfront Authority',
        },
        location: 'Jeddah',
        itemDetails: {
          name: 'Cisco Catalyst 9300 48-Port PoE+',
          category: 'IT Hardware & Networking',
          description: 'Network switches with redundant power supply and Cisco DNA Center license.',
          quantity: 4,
          unit: 'Units',
          targetPrice: 18500,
        },
        status: 'Technical_Approval',
        priority: 'Critical',
        assignedTo: {
          name: 'Western Province Procurement Desk',
          desk: 'Jeddah Regional Office',
          officer: 'Fahad Al-Harbi',
        },
        quotations: [
          {
            vendorName: 'Al-Jazirah Technology Solutions',
            totalPrice: 74000,
            unitPrice: 18500,
            leadTimeDays: 4,
            specificationsText: 'Official Cisco Tier-1 KSA Partner stock, 3-year DNA Premier, next business day replacement.',
            warrantyTerms: '36 Months ProSupport',
            isChosen: true,
            quotationDocUrl: '/docs/quote-aljazirah-switch.pdf',
          },
          {
            vendorName: 'Jarir Marketing Co. (Commercial)',
            totalPrice: 76000,
            unitPrice: 19000,
            leadTimeDays: 7,
            specificationsText: 'Cisco Catalyst 9300 enterprise switches with standard local warranty.',
            warrantyTerms: '24 Months Standard',
            isChosen: false,
            quotationDocUrl: '/docs/quote-jarir-switch.pdf',
          },
          {
            vendorName: 'Saudi Modern Electronics',
            totalPrice: 78500,
            unitPrice: 19625,
            leadTimeDays: 10,
            specificationsText: 'Compliant OEM network units with manufacturer warranty.',
            warrantyTerms: '12 Months Standard',
            isChosen: false,
            quotationDocUrl: '/docs/quote-sme-switch.pdf',
          },
        ],
        timeline: [
          {
            stage: 'Incoming',
            status: 'Incoming',
            date: new Date().toISOString(),
            notes: 'Requisition created by IT lead for network switches.',
            actor: 'Fahad Al-Harbi',
          },
          {
            stage: 'Quotation_Collection',
            status: 'Quotation_Collection',
            date: new Date().toISOString(),
            notes: 'Collected 3 verified commercial quotes from approved KSA vendors.',
            actor: 'Procurement Desk',
          },
        ],
      },
    ],
  };
}

export const mockDb = global._mockDb;
