const mongoose = require('mongoose');

// Schemas for seeding
const PriceBaselineSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  unit: String,
  historicalAveragePrice: Number,
  lastPurchasedPrice: Number,
  standardLeadTimeDays: Number,
  preferredVendor: String,
}, { timestamps: true });
const PriceBaseline = mongoose.models.PriceBaseline || mongoose.model('PriceBaseline', PriceBaselineSchema);

const VendorSchema = new mongoose.Schema({
  vendorName: String,
  category: String,
  crNumber: String,
  vatNumber: String,
  rating: Number,
  status: String,
  contactPerson: String,
  email: String,
  phone: String,
  city: String,
  paymentTerms: String,
  totalSpendSAR: Number,
  completedOrders: Number,
  avgDeliveryDays: Number,
}, { timestamps: true });
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

const ProcurementRequestSchema = new mongoose.Schema({
  ticketId: String,
  requester: Object,
  project: Object,
  location: String,
  itemDetails: Object,
  status: String,
  priority: String,
  assignedTo: Object,
  quotations: Array,
  technicalApproval: Object,
  financeReview: Object,
  purchaseOrder: Object,
  deliveryConfirmation: Object,
  paymentRecord: Object,
  timeline: Array,
}, { timestamps: true });
const ProcurementRequest = mongoose.models.ProcurementRequest || mongoose.model('ProcurementRequest', ProcurementRequestSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for Seeding...');

  await PriceBaseline.deleteMany({});
  await Vendor.deleteMany({});
  await ProcurementRequest.deleteMany({});
  console.log('Cleared existing procurement, vendor, and baseline data.');

  // 1. Seed Approved Vendors
  const vendors = [
    {
      vendorName: 'Jarir Marketing Co. (Commercial)',
      category: 'IT Hardware & Electronics',
      crNumber: '1010012214',
      vatNumber: '300000584700003',
      rating: 4.9,
      status: 'Approved',
      contactPerson: 'Ziyad Al-Qahtani',
      email: 'corporate@jarir.com',
      phone: '+966 11 462 6000',
      city: 'Riyadh',
      paymentTerms: 'Net 30 Days',
      totalSpendSAR: 285000,
      completedOrders: 14,
      avgDeliveryDays: 3,
    },
    {
      vendorName: 'Saudi ReadyMix Concrete Ltd',
      category: 'Construction Materials',
      crNumber: '2050019842',
      vatNumber: '310123456700003',
      rating: 4.8,
      status: 'Approved',
      contactPerson: 'Nasser Al-Subaie',
      email: 'commercial@saudireadymix.com',
      phone: '+966 13 882 1100',
      city: 'Dammam',
      paymentTerms: 'Net 45 Days',
      totalSpendSAR: 420000,
      completedOrders: 6,
      avgDeliveryDays: 2,
    },
    {
      vendorName: 'Al-Jazirah Technology Solutions',
      category: 'IT Hardware & Networking',
      crNumber: '1010482910',
      vatNumber: '300987654300003',
      rating: 4.6,
      status: 'Approved',
      contactPerson: 'Hussam Al-Ghamdi',
      email: 'enterprise@aljazirah-tech.sa',
      phone: '+966 11 210 4455',
      city: 'Riyadh',
      paymentTerms: 'Net 30 Days',
      totalSpendSAR: 195000,
      completedOrders: 8,
      avgDeliveryDays: 6,
    },
    {
      vendorName: 'IKEA Business Solutions KSA',
      category: 'Office Furniture & Fixtures',
      crNumber: '4030099411',
      vatNumber: '300112233400003',
      rating: 4.7,
      status: 'Approved',
      contactPerson: 'Layla Al-Amoudi',
      email: 'business@ikea.com.sa',
      phone: '+966 12 654 3210',
      city: 'Jeddah',
      paymentTerms: 'Net 30 Days',
      totalSpendSAR: 145000,
      completedOrders: 9,
      avgDeliveryDays: 5,
    },
    {
      vendorName: 'Saudi Arabian Safety & PPE Corp',
      category: 'Industrial & Safety Equipment',
      crNumber: '1010334455',
      vatNumber: '300554433200003',
      rating: 4.9,
      status: 'Approved',
      contactPerson: 'Fahad Al-Husseini',
      email: 'sales@saudisafety.sa',
      phone: '+966 11 889 9000',
      city: 'Riyadh',
      paymentTerms: 'Net 30 Days',
      totalSpendSAR: 95000,
      completedOrders: 5,
      avgDeliveryDays: 4,
    }
  ];
  await Vendor.insertMany(vendors);
  console.log(`Seeded ${vendors.length} Approved Suppliers.`);

  // 2. Seed Price Baselines
  const baselines = [
    { itemName: 'Dell Latitude 7440 Ultrabook', category: 'IT Hardware & Electronics', unit: 'Units', historicalAveragePrice: 4650, lastPurchasedPrice: 4700, standardLeadTimeDays: 4, preferredVendor: 'Jarir Marketing Co. (Commercial)' },
    { itemName: 'Ready-Mix Concrete Grade 40', category: 'Construction Materials', unit: 'm³ (Cubic Meters)', historicalAveragePrice: 220, lastPurchasedPrice: 215, standardLeadTimeDays: 2, preferredVendor: 'Saudi ReadyMix Concrete Ltd' },
    { itemName: 'Ergonomic Executive Mesh Chair', category: 'Office Furniture & Fixtures', unit: 'Units', historicalAveragePrice: 520, lastPurchasedPrice: 495, standardLeadTimeDays: 5, preferredVendor: 'IKEA Business Solutions KSA' },
    { itemName: 'Cisco Catalyst 9300 48-Port PoE+', category: 'IT Hardware & Networking', unit: 'Units', historicalAveragePrice: 18500, lastPurchasedPrice: 19200, standardLeadTimeDays: 7, preferredVendor: 'Al-Jazirah Technology Solutions' },
    { itemName: 'EN397 Industrial Safety Helmets', category: 'Industrial & Safety Equipment', unit: 'Units', historicalAveragePrice: 45, lastPurchasedPrice: 42, standardLeadTimeDays: 3, preferredVendor: 'Saudi Arabian Safety & PPE Corp' },
  ];
  await PriceBaseline.insertMany(baselines);
  console.log(`Seeded ${baselines.length} Historical Price Baselines.`);

  // 3. Seed Procurement Requests (Covering all 8 stages)
  const sampleRequests = [
    // Stage 1: Incoming / WhatsApp Ingested (Riyadh)
    {
      ticketId: 'PR-2026-88101',
      requester: { name: 'Eng. Mohammed Al-Saud', email: 'm.alsaud@uig.com', department: 'Site Operations & Civil', mobile: '+966 50 112 3344' },
      project: { projectId: 'PRJ-RYD-METRO', projectName: 'Riyadh Metro Extension Phase 2', allocatedBudget: 350000, client: 'Royal Commission for Riyadh City' },
      location: 'Riyadh',
      itemDetails: { name: 'EN397 Industrial Safety Helmets', category: 'Industrial & Safety Equipment', description: 'ANSI/ISEA Z89.1 certified heavy-duty site helmets with 4-point chin straps.', quantity: 500, unit: 'Units', targetPrice: 45 },
      status: 'Incoming',
      priority: 'High',
      assignedTo: { name: 'Riyadh Central Procurement Desk', desk: 'Central Desk', officer: 'Tariq Al-Mansoor' },
      quotations: [],
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 2 * 60 * 60 * 1000), actor: 'WhatsApp NLP Ingestion Gateway', role: 'System', notes: 'Parsed WhatsApp voice/text memo from Site Lead Eng. Mohammed Al-Saud (+966501123344).' }
      ]
    },

    // Stage 2 & 3: Quotation Collection / 3-Bid Comparison (Jeddah)
    {
      ticketId: 'PR-2026-88102',
      requester: { name: 'Eng. Fatima Al-Hassan', email: 'f.hassan@uig.com', department: 'IT Infrastructure & Cloud', mobile: '+966 55 443 2211' },
      project: { projectId: 'PRJ-JED-TOWER', projectName: 'Jeddah Coastal Tower Network Expansion', allocatedBudget: 120000, client: 'Jeddah Municipality' },
      location: 'Jeddah',
      itemDetails: { name: 'Cisco Catalyst 9300 48-Port PoE+', category: 'IT Hardware & Networking', description: 'Layer 3 Enterprise Core Switch with 48x 1G PoE+ ports and dual modular power supplies.', quantity: 4, unit: 'Units', targetPrice: 18500 },
      status: 'Quotation_Collection',
      priority: 'Critical',
      assignedTo: { name: 'Western Province Procurement Desk', desk: 'Western Desk', officer: 'Sultan Al-Harbi' },
      quotations: [
        { vendorName: 'Al-Jazirah Technology Solutions', totalPrice: 74000, unitPrice: 18500, leadTimeDays: 7, specificationsText: 'Original Cisco KSA Authorized Unit with 3-Yr Cisco SmartNet 24x7 support.', warrantyTerms: '36 Months Cisco TAC', isChosen: true, quotationDocUrl: '/docs/quote-cisco-aljazirah.pdf' },
        { vendorName: 'Saudi IT Solutions Hub', totalPrice: 71200, unitPrice: 17800, leadTimeDays: 14, specificationsText: 'Direct parallel import, standard 1-Yr local vendor warranty.', warrantyTerms: '12 Months Local', isChosen: false, quotationDocUrl: '/docs/quote-cisco-saudiit.pdf' },
        { vendorName: 'Global Net KSA', totalPrice: 76500, unitPrice: 19125, leadTimeDays: 3, specificationsText: 'In-stock stock delivery within 72 hours, 3-Yr Gold SLA.', warrantyTerms: '36 Months Gold SLA', isChosen: false, quotationDocUrl: '/docs/quote-cisco-global.pdf' },
      ],
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 24 * 60 * 60 * 1000), actor: 'Eng. Fatima Al-Hassan', role: 'Site Initiator', notes: 'Requisition submitted for IT network switches.' },
        { status: 'Quotation_Collection', date: new Date(Date.now() - 18 * 60 * 60 * 1000), actor: 'Sultan Al-Harbi', role: 'Procurement Officer', notes: 'Collected 3 competitive vendor bids from authorized KSA distributors.' }
      ]
    },

    // Stage 4: Technical Approval Pending (Dammam)
    {
      ticketId: 'PR-2026-88103',
      requester: { name: 'Eng. Tariq Al-Ghamdi', email: 't.ghamdi@uig.com', department: 'Structural Engineering', mobile: '+966 54 998 8776' },
      project: { projectId: 'PRJ-DMM-PORT', projectName: 'King Abdulaziz Port Logistics Depot', allocatedBudget: 250000, client: 'Saudi Ports Authority (Mawani)' },
      location: 'Dammam',
      itemDetails: { name: 'Ready-Mix Concrete Grade 40', category: 'Construction Materials', description: 'Grade 40 Sulphate Resistant Cement (SRC) for marine foundation structural pouring.', quantity: 1000, unit: 'm³', targetPrice: 220 },
      status: 'Technical_Approval',
      priority: 'High',
      assignedTo: { name: 'Eastern Province Procurement Desk', desk: 'Eastern Desk', officer: 'Faisal Al-Otaibi' },
      quotations: [
        { vendorName: 'Saudi ReadyMix Concrete Ltd', totalPrice: 215000, unitPrice: 215, leadTimeDays: 2, specificationsText: 'SRC Grade 40 with ASTM C150 compliance and batch-testing certificates.', warrantyTerms: 'Lab Batch Certified', isChosen: true, quotationDocUrl: '/docs/quote-concrete-srm.pdf' },
        { vendorName: 'Eastern Building Materials Co.', totalPrice: 224000, unitPrice: 224, leadTimeDays: 3, specificationsText: 'Standard Grade 40 OPC mixture with micro-silica additives.', warrantyTerms: 'Standard Certified', isChosen: false, quotationDocUrl: '/docs/quote-concrete-ebm.pdf' },
        { vendorName: 'Al-Kifah ReadyMix', totalPrice: 218000, unitPrice: 218, leadTimeDays: 2, specificationsText: 'SRC Grade 40 certified for high-salinity coastal foundations.', warrantyTerms: 'Mawani Approved', isChosen: false, quotationDocUrl: '/docs/quote-concrete-kifah.pdf' },
      ],
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 48 * 60 * 60 * 1000), actor: 'Eng. Tariq Al-Ghamdi', role: 'Initiator', notes: 'Requisition entered for 1000 m3 SRC concrete.' },
        { status: 'Quotation_Collection', date: new Date(Date.now() - 36 * 60 * 60 * 1000), actor: 'Faisal Al-Otaibi', role: 'Procurement Officer', notes: 'Uploaded 3 verified ready-mix supplier quotes.' },
        { status: 'Technical_Approval', date: new Date(Date.now() - 12 * 60 * 60 * 1000), actor: 'System Gateway', role: 'System', notes: 'Routed to Lead Structural Engineer for technical compliance verification.' }
      ]
    },

    // Stage 5: Finance Review & Variance Analysis (Riyadh)
    {
      ticketId: 'PR-2026-88104',
      requester: { name: 'Sarah Al-Otaibi', email: 's.otaibi@uig.com', department: 'Corporate Operations', mobile: '+966 50 778 8990' },
      project: { projectId: 'PRJ-RYD-HQ', projectName: 'UIG Corporate HQ Riyadh Refurbishment', allocatedBudget: 60000, client: 'UIG Holding' },
      location: 'Riyadh',
      itemDetails: { name: 'Ergonomic Executive Mesh Chair', category: 'Office Furniture & Fixtures', description: 'High-back breathable mesh with adjustable 4D armrests, lumbar support, and BIFMA certification.', quantity: 100, unit: 'Units', targetPrice: 520 },
      status: 'Finance_Review',
      priority: 'Normal',
      assignedTo: { name: 'Riyadh Central Procurement Desk', desk: 'Central Desk', officer: 'Tariq Al-Mansoor' },
      quotations: [
        { vendorName: 'IKEA Business Solutions KSA', totalPrice: 49500, unitPrice: 495, leadTimeDays: 5, specificationsText: 'Markus Pro Enterprise edition with 10-year commercial warranty.', warrantyTerms: '10 Years Manufacturer Warranty', isChosen: true, quotationDocUrl: '/docs/quote-ikea-chairs.pdf' },
        { vendorName: 'Al-Jedaie Office Furniture', totalPrice: 54000, unitPrice: 540, leadTimeDays: 7, specificationsText: 'Korean mesh ergonomic chair with heavy-duty chrome base.', warrantyTerms: '5 Years Warranty', isChosen: false, quotationDocUrl: '/docs/quote-jedaie.pdf' },
        { vendorName: 'Al-Rugaib Commercial Interiors', totalPrice: 51000, unitPrice: 510, leadTimeDays: 6, specificationsText: 'German engineered executive task chair, BIFMA compliant.', warrantyTerms: '7 Years Warranty', isChosen: false, quotationDocUrl: '/docs/quote-rugaib.pdf' },
      ],
      technicalApproval: {
        isApproved: true,
        reviewedBy: 'Sarah Al-Otaibi',
        reviewerRole: 'Operations Manager',
        comments: 'Technical specifications approved. IKEA Markus Pro complies with ergonomic standards.',
        reviewedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 72 * 60 * 60 * 1000), actor: 'Sarah Al-Otaibi', role: 'Initiator', notes: 'Requisition submitted for 100 executive chairs.' },
        { status: 'Quotation_Collection', date: new Date(Date.now() - 50 * 60 * 60 * 1000), actor: 'Tariq Al-Mansoor', role: 'Procurement Officer', notes: 'Completed 3-vendor market tender.' },
        { status: 'Technical_Approval', date: new Date(Date.now() - 6 * 60 * 60 * 1000), actor: 'Sarah Al-Otaibi', role: 'HOD Approver', notes: 'Technically approved winning bid: IKEA Business.' },
        { status: 'Finance_Review', date: new Date(Date.now() - 2 * 60 * 60 * 1000), actor: 'System Routing', role: 'System', notes: 'Forwarded to Finance Controller for baseline price and budget validation.' }
      ]
    },

    // Stage 6: PO Generated & Dispatched (Riyadh)
    {
      ticketId: 'PR-2026-88105',
      requester: { name: 'Ahmad Al-Fahad', email: 'ahmad@uig.com', department: 'Enterprise Systems', mobile: '+966 50 334 4556' },
      project: { projectId: 'PRJ-IT-UPGRADE', projectName: 'Digital Transformation & Laptop Fleet Renewal', allocatedBudget: 150000, client: 'UIG Enterprise' },
      location: 'Riyadh',
      itemDetails: { name: 'Dell Latitude 7440 Ultrabook', category: 'IT Hardware & Electronics', description: 'Intel Core i7 13th Gen, 32GB LPDDR5, 1TB NVMe SSD, 14-inch FHD+ anti-glare display.', quantity: 10, unit: 'Units', targetPrice: 4700 },
      status: 'PO_Generated',
      priority: 'High',
      assignedTo: { name: 'Riyadh Central Procurement Desk', desk: 'Central Desk', officer: 'Tariq Al-Mansoor' },
      quotations: [
        { vendorName: 'Jarir Marketing Co. (Commercial)', totalPrice: 47000, unitPrice: 4700, leadTimeDays: 3, specificationsText: 'Official Dell KSA Stock, 3-Yr ProSupport Plus Onsite Next Business Day.', warrantyTerms: '36 Months Dell ProSupport', isChosen: true, quotationDocUrl: '/docs/quote-jarir-dell.pdf' },
        { vendorName: 'Al-Jazirah Technology Solutions', totalPrice: 48500, unitPrice: 4850, leadTimeDays: 5, specificationsText: 'Dell Latitude 7440, standard Dell ProSupport warranty.', warrantyTerms: '36 Months ProSupport', isChosen: false, quotationDocUrl: '/docs/quote-aljazirah-dell.pdf' },
        { vendorName: 'Extra Commercial Fleet', totalPrice: 49200, unitPrice: 4920, leadTimeDays: 4, specificationsText: 'Dell Latitude 7440 with bundle carry sleeve and docking station.', warrantyTerms: '36 Months Warranty', isChosen: false, quotationDocUrl: '/docs/quote-extra.pdf' },
      ],
      technicalApproval: {
        isApproved: true,
        reviewedBy: 'Ahmad Al-Fahad',
        reviewerRole: 'IT Director',
        comments: 'Technical specs matched 100% with IT hardware policy.',
        reviewedAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
      },
      financeReview: {
        isApproved: true,
        reviewedBy: 'Mansoor Al-Husseini',
        comments: 'Total 47,000 SAR is within allocated 150,000 SAR budget. Price is +1.0% vs historical baseline (Acceptable).',
        allocatedBudget: 150000,
        baselinePrice: 46500,
        variancePercentage: 1.07,
        isWithinBudget: true,
        reviewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      purchaseOrder: {
        poNumber: 'PO-2026-10042',
        generatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
        vendorSentConfirmation: true,
        paymentTerms: 'Net 30 Days after GRN Acceptance',
        deliveryDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        poDocumentUrl: '/docs/PO-2026-10042.pdf'
      },
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 96 * 60 * 60 * 1000), actor: 'Ahmad Al-Fahad', role: 'Initiator', notes: 'Created laptop requisition.' },
        { status: 'Quotation_Collection', date: new Date(Date.now() - 72 * 60 * 60 * 1000), actor: 'Tariq Al-Mansoor', role: 'Procurement Officer', notes: 'Obtained 3 authorized Dell quotes.' },
        { status: 'Technical_Approval', date: new Date(Date.now() - 36 * 60 * 60 * 1000), actor: 'Ahmad Al-Fahad', role: 'IT Approver', notes: 'Approved Jarir Commercial quote.' },
        { status: 'Finance_Review', date: new Date(Date.now() - 24 * 60 * 60 * 1000), actor: 'Mansoor Al-Husseini', role: 'Finance Controller', notes: 'Approved budget. Baseline variance +1.0% validated.' },
        { status: 'PO_Generated', date: new Date(Date.now() - 20 * 60 * 60 * 1000), actor: 'Automated PO Dispatcher', role: 'System', notes: 'Official PO-2026-10042 generated and electronically transmitted to Jarir Marketing Co.' }
      ]
    },

    // Stage 7: Goods Delivered / Awaiting Payment Release (Jeddah)
    {
      ticketId: 'PR-2026-88106',
      requester: { name: 'Waleed Al-Ghamdi', email: 'w.ghamdi@uig.com', department: 'Facilities & Logistics', mobile: '+966 53 119 9001' },
      project: { projectId: 'PRJ-JED-FACILITY', projectName: 'Jeddah Regional Logistics Center', allocatedBudget: 80000, client: 'UIG Logistics' },
      location: 'Jeddah',
      itemDetails: { name: 'Industrial Heavy Duty Pallet Jack (3-Ton)', category: 'Industrial & Safety Equipment', description: 'Hydraulic hand pallet truck 3000kg capacity with polyurethane wheels.', quantity: 15, unit: 'Units', targetPrice: 2800 },
      status: 'Delivery_Pending',
      priority: 'Medium',
      assignedTo: { name: 'Western Province Procurement Desk', desk: 'Western Desk', officer: 'Sultan Al-Harbi' },
      quotations: [
        { vendorName: 'Saudi Arabian Safety & PPE Corp', totalPrice: 41250, unitPrice: 2750, leadTimeDays: 4, specificationsText: 'Heavy-duty 3-ton hydraulic pump with reinforced steel forks.', warrantyTerms: '24 Months Warranty', isChosen: true, quotationDocUrl: '/docs/quote-pallet-saudisafety.pdf' },
        { vendorName: 'Al-Bawardi Building Supplies', totalPrice: 43500, unitPrice: 2900, leadTimeDays: 6, specificationsText: 'Standard 3-ton pallet truck with rubber wheels.', warrantyTerms: '12 Months Warranty', isChosen: false, quotationDocUrl: '/docs/quote-bawardi.pdf' },
        { vendorName: 'Al-Muhaidib Industrial Equipment', totalPrice: 42000, unitPrice: 2800, leadTimeDays: 5, specificationsText: 'German engineered hydraulic unit with dual front rollers.', warrantyTerms: '18 Months Warranty', isChosen: false, quotationDocUrl: '/docs/quote-muhaidib.pdf' },
      ],
      technicalApproval: {
        isApproved: true,
        reviewedBy: 'Waleed Al-Ghamdi',
        reviewerRole: 'Facilities Head',
        comments: 'Approved. Specifications meet heavy warehouse operational load.',
        reviewedAt: new Date(Date.now() - 120 * 60 * 60 * 1000)
      },
      financeReview: {
        isApproved: true,
        reviewedBy: 'Mansoor Al-Husseini',
        comments: 'Within allocated budget of 80,000 SAR.',
        allocatedBudget: 80000,
        baselinePrice: 42000,
        variancePercentage: -1.78,
        isWithinBudget: true,
        reviewedAt: new Date(Date.now() - 96 * 60 * 60 * 1000)
      },
      purchaseOrder: {
        poNumber: 'PO-2026-10039',
        generatedAt: new Date(Date.now() - 90 * 60 * 60 * 1000),
        vendorSentConfirmation: true,
        paymentTerms: 'Net 30 Days after GRN Acceptance',
        deliveryDeadline: new Date(Date.now() - 20 * 60 * 60 * 1000),
        poDocumentUrl: '/docs/PO-2026-10039.pdf'
      },
      deliveryConfirmation: {
        signedNoteUrl: '/docs/signed-grn-10039.pdf',
        receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        recipientSignatureName: 'Waleed Al-Ghamdi (Site Lead)',
        recipientDepartment: 'Facilities & Logistics',
        inspectionNotes: '15/15 Pallet Jacks received in perfect condition. Tested hydraulic lifting under 2.5 ton test load.',
        fullDeliveryReceived: true
      },
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 150 * 60 * 60 * 1000), actor: 'Waleed Al-Ghamdi', role: 'Initiator', notes: 'Submitted requisition.' },
        { status: 'Quotation_Collection', date: new Date(Date.now() - 130 * 60 * 60 * 1000), actor: 'Sultan Al-Harbi', role: 'Procurement Officer', notes: 'Uploaded 3 supplier quotes.' },
        { status: 'Technical_Approval', date: new Date(Date.now() - 120 * 60 * 60 * 1000), actor: 'Waleed Al-Ghamdi', role: 'Approver', notes: 'Technically approved Saudi Safety Corp.' },
        { status: 'Finance_Review', date: new Date(Date.now() - 96 * 60 * 60 * 1000), actor: 'Mansoor Al-Husseini', role: 'Finance Controller', notes: 'Approved budget with 1.8% cost savings against baseline.' },
        { status: 'PO_Generated', date: new Date(Date.now() - 90 * 60 * 60 * 1000), actor: 'System', role: 'System', notes: 'PO-2026-10039 dispatched to vendor.' },
        { status: 'Delivery_Pending', date: new Date(Date.now() - 4 * 60 * 60 * 1000), actor: 'Waleed Al-Ghamdi', role: 'Site Receiver', notes: 'Goods received on-site. Signed GRN Delivery Note uploaded. Awaiting accounts payment release.' }
      ]
    },

    // Stage 8: Completed & Paid (Settled 3-Way Match) (Riyadh)
    {
      ticketId: 'PR-2026-88107',
      requester: { name: 'Eng. Khalid Al-Mutairi', email: 'k.mutairi@uig.com', department: 'Enterprise IT', mobile: '+966 50 882 1133' },
      project: { projectId: 'PRJ-RYD-SERVERS', projectName: 'HQ Datacenter Server Infrastructure', allocatedBudget: 200000, client: 'UIG Enterprise' },
      location: 'Riyadh',
      itemDetails: { name: 'Dell PowerEdge R760 Rack Server', category: 'IT Hardware & Electronics', description: 'Dual Intel Xeon Gold 6430, 256GB ECC DDR5, 8x 3.84TB SAS SSD, Dual 1400W Redundant PSU.', quantity: 1, unit: 'Units', targetPrice: 95000 },
      status: 'Completed',
      priority: 'Critical',
      assignedTo: { name: 'Riyadh Central Procurement Desk', desk: 'Central Desk', officer: 'Tariq Al-Mansoor' },
      quotations: [
        { vendorName: 'Jarir Marketing Co. (Commercial)', totalPrice: 92500, unitPrice: 92500, leadTimeDays: 4, specificationsText: 'Enterprise Dell PowerEdge R760 with 5-Year 24x7 Mission Critical Onsite SLA.', warrantyTerms: '60 Months Mission Critical 4Hr SLA', isChosen: true, quotationDocUrl: '/docs/quote-jarir-server.pdf' },
        { vendorName: 'Al-Jazirah Technology Solutions', totalPrice: 96000, unitPrice: 96000, leadTimeDays: 7, specificationsText: 'Dell R760 Server with 3-Year ProSupport Plus.', warrantyTerms: '36 Months ProSupport', isChosen: false, quotationDocUrl: '/docs/quote-aljazirah-server.pdf' },
        { vendorName: 'Saudi IT Solutions Hub', totalPrice: 94000, unitPrice: 94000, leadTimeDays: 5, specificationsText: 'Dell R760 Server standard configuration.', warrantyTerms: '36 Months Warranty', isChosen: false, quotationDocUrl: '/docs/quote-saudiit-server.pdf' },
      ],
      technicalApproval: {
        isApproved: true,
        reviewedBy: 'Eng. Khalid Al-Mutairi',
        reviewerRole: 'IT Infrastructure Head',
        comments: 'Technical specs verified. Dell R760 meets Datacenter redundancy requirements.',
        reviewedAt: new Date(Date.now() - 200 * 60 * 60 * 1000)
      },
      financeReview: {
        isApproved: true,
        reviewedBy: 'Mansoor Al-Husseini',
        comments: 'Budget approved. 92,500 SAR is 2.6% below maximum benchmark price.',
        allocatedBudget: 200000,
        baselinePrice: 95000,
        variancePercentage: -2.63,
        isWithinBudget: true,
        reviewedAt: new Date(Date.now() - 180 * 60 * 60 * 1000)
      },
      purchaseOrder: {
        poNumber: 'PO-2026-10025',
        generatedAt: new Date(Date.now() - 170 * 60 * 60 * 1000),
        vendorSentConfirmation: true,
        paymentTerms: 'Immediate upon GRN Acceptance',
        deliveryDeadline: new Date(Date.now() - 100 * 60 * 60 * 1000),
        poDocumentUrl: '/docs/PO-2026-10025.pdf'
      },
      deliveryConfirmation: {
        signedNoteUrl: '/docs/signed-grn-10025.pdf',
        receivedAt: new Date(Date.now() - 80 * 60 * 60 * 1000),
        recipientSignatureName: 'Eng. Khalid Al-Mutairi',
        recipientDepartment: 'Enterprise IT',
        inspectionNotes: 'Datacenter Server unboxed, rack-mounted in Rack 4B, and diagnostics executed with 100% pass rate.',
        fullDeliveryReceived: true
      },
      paymentRecord: {
        transactionRef: 'TXN-SAMA-908214',
        amountPaid: 92500,
        paymentMethod: 'Corporate Wire Transfer (SAMA SARIE)',
        paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        bankReference: 'Riyad Bank Ref: RYD-992014-SAR',
        accountsAuditor: 'Mansoor Al-Husseini (Finance Controller)'
      },
      timeline: [
        { status: 'Incoming', date: new Date(Date.now() - 240 * 60 * 60 * 1000), actor: 'Eng. Khalid Al-Mutairi', role: 'Initiator', notes: 'Datacenter server requisition.' },
        { status: 'Quotation_Collection', date: new Date(Date.now() - 210 * 60 * 60 * 1000), actor: 'Tariq Al-Mansoor', role: 'Procurement Officer', notes: 'Obtained 3 Dell enterprise quotes.' },
        { status: 'Technical_Approval', date: new Date(Date.now() - 200 * 60 * 60 * 1000), actor: 'Eng. Khalid Al-Mutairi', role: 'IT Approver', notes: 'Approved Jarir Commercial.' },
        { status: 'Finance_Review', date: new Date(Date.now() - 180 * 60 * 60 * 1000), actor: 'Mansoor Al-Husseini', role: 'Finance Controller', notes: 'Budget approved.' },
        { status: 'PO_Generated', date: new Date(Date.now() - 170 * 60 * 60 * 1000), actor: 'System', role: 'System', notes: 'PO-2026-10025 dispatched to Jarir.' },
        { status: 'Delivery_Pending', date: new Date(Date.now() - 80 * 60 * 60 * 1000), actor: 'Eng. Khalid Al-Mutairi', role: 'Site Receiver', notes: 'Server received, tested, and signed GRN note attached.' },
        { status: 'Completed', date: new Date(Date.now() - 24 * 60 * 60 * 1000), actor: 'Mansoor Al-Husseini', role: 'Finance Controller', notes: '3-Way Match verified (PO = GRN = Invoice). Released 92,500 SAR via SAMA SARIE (TXN-SAMA-908214). Ticket successfully closed.' }
      ]
    }
  ];

  await ProcurementRequest.insertMany(sampleRequests);
  console.log(`Seeded ${sampleRequests.length} Comprehensive Procurement Lifecycle Tickets across Riyadh, Jeddah, Dammam.`);

  await mongoose.disconnect();
  console.log('Seed completed successfully!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
