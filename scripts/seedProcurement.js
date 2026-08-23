const mongoose = require('mongoose');

// Temporary Mongoose definitions for seeding without importing the whole app
const PriceBaselineSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  historicalAveragePrice: Number,
  lastPurchasedPrice: Number,
}, { timestamps: true });
const PriceBaseline = mongoose.models.PriceBaseline || mongoose.model('PriceBaseline', PriceBaselineSchema);

const ProcurementRequestSchema = new mongoose.Schema({
  ticketId: String,
  requester: Object,
  project: Object,
  location: String,
  itemDetails: Object,
  status: String,
  assignedTo: Object,
  quotations: Array,
  technicalApproval: Object,
  financeReview: Object,
  purchaseOrder: Object,
  deliveryConfirmation: Object,
  paymentRecord: Object,
}, { timestamps: true });
const ProcurementRequest = mongoose.models.ProcurementRequest || mongoose.model('ProcurementRequest', ProcurementRequestSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await PriceBaseline.deleteMany({});
  await ProcurementRequest.deleteMany({});
  console.log('Cleared existing procurement data');

  // Seed Price Baselines
  const baselines = [
    { itemName: 'Dell Latitude 7420', category: 'IT Hardware', historicalAveragePrice: 4500, lastPurchasedPrice: 4600 },
    { itemName: 'Concrete Grade 30', category: 'Construction Materials', historicalAveragePrice: 200, lastPurchasedPrice: 210 },
    { itemName: 'Office Chairs', category: 'Furniture', historicalAveragePrice: 500, lastPurchasedPrice: 490 },
  ];
  await PriceBaseline.insertMany(baselines);
  console.log('Seeded Price Baselines');

  // Seed Procurement Requests
  const requests = [
    {
      ticketId: 'PR-2026-00001',
      requester: { name: 'Ahmad Al-Fahad', email: 'ahmad@uig.com', department: 'IT' },
      project: { projectId: 'PRJ-IT-01', projectName: 'HQ Upgrade', allocatedBudget: 150000 },
      location: 'Riyadh',
      itemDetails: { name: 'Dell Latitude 7420', category: 'IT Hardware', quantity: 10 },
      status: 'Completed',
      assignedTo: { name: 'Riyadh Procurement Desk' },
      quotations: [
        { vendorName: 'Jarir Business', totalPrice: 47000, leadTimeDays: 3, specificationsText: 'Core i7, 16GB RAM', isChosen: true }
      ],
      purchaseOrder: { poNumber: 'PO-2026-10001', generatedAt: new Date(Date.now() - 10*24*60*60*1000) },
      deliveryConfirmation: { receivedAt: new Date(Date.now() - 5*24*60*60*1000) }, // 5 days delay (2 days avg variance)
    },
    {
      ticketId: 'PR-2026-00002',
      requester: { name: 'Sara Al-Otaibi', email: 'sara@uig.com', department: 'Engineering' },
      project: { projectId: 'PRJ-ENG-05', projectName: 'Jeddah Corniche Works', allocatedBudget: 300000 },
      location: 'Jeddah',
      itemDetails: { name: 'Concrete Grade 30', category: 'Construction Materials', quantity: 1000 },
      status: 'Quotation_Collection',
      assignedTo: { name: 'Jeddah Procurement Desk' },
      quotations: [
        { vendorName: 'Saudi ReadyMix', totalPrice: 210000, leadTimeDays: 1, specificationsText: 'Standard Grade 30', isChosen: false },
        { vendorName: 'Binaa Co', totalPrice: 225000, leadTimeDays: 2, specificationsText: 'Grade 30 High early strength', isChosen: false },
        { vendorName: 'Al-Kifah', totalPrice: 205000, leadTimeDays: 3, specificationsText: 'Grade 30 regular', isChosen: false },
      ],
    },
    {
      ticketId: 'PR-2026-00003',
      requester: { name: 'Khalid Admin', email: 'khalid@uig.com', department: 'HR' },
      project: { projectId: 'PRJ-HR-02', projectName: 'Dammam Branch Setup', allocatedBudget: 50000 },
      location: 'Dammam',
      itemDetails: { name: 'Office Chairs', category: 'Furniture', quantity: 20 },
      status: 'Completed',
      assignedTo: { name: 'Eastern Province Desk' },
      quotations: [
        { vendorName: 'IKEA Business', totalPrice: 9500, leadTimeDays: 7, specificationsText: 'Ergonomic mesh chairs', isChosen: true }
      ],
      purchaseOrder: { poNumber: 'PO-2026-10003', generatedAt: new Date(Date.now() - 15*24*60*60*1000) },
      deliveryConfirmation: { receivedAt: new Date(Date.now() - 7*24*60*60*1000) }, // 8 days delay (1 day variance)
    }
  ];
  
  await ProcurementRequest.insertMany(requests);
  console.log('Seeded Procurement Requests');

  process.exit(0);
}

seed().catch(console.error);
