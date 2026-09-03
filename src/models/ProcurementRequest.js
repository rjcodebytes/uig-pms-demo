import mongoose from 'mongoose';
import { getAssignedProcurementDesk } from '@/lib/assignProcurementDesk';

const ProcurementRequestSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      default: 'Material Requisition for Project Operations',
    },
    businessJustification: {
      purpose: {
        type: String,
        required: true,
        default: 'Mandatory site requirement for ongoing engineering milestone execution.',
      },
      urgencyReason: {
        type: String,
        default: 'Critical path site deployment; work cannot proceed without certified material.',
      },
      impactIfNotApproved: {
        type: String,
        default: 'Site operation stoppage, worker safety compliance risk, and potential client penalty fines.',
      },
      attachments: [
        {
          name: { type: String },
          url: { type: String },
        },
      ],
    },
    requester: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      department: { type: String, required: true },
      mobile: { type: String },
    },
    project: {
      projectId: { type: String, required: true },
      projectName: { type: String, required: true },
      allocatedBudget: { type: Number, required: true },
      client: { type: String, default: 'UIG Enterprise' },
    },
    location: {
      type: String,
      required: true,
      enum: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Other'],
      default: 'Riyadh',
    },
    itemDetails: {
      name: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      unit: { type: String, default: 'Units' },
      targetPrice: { type: Number },
    },
    status: {
      type: String,
      required: true,
      enum: [
        'Incoming',
        'Quotation_Collection',
        'Technical_Approval',
        'Finance_Review',
        'PO_Generated',
        'Delivery_Pending',
        'Completed',
        'Rejected_Job',
      ],
      default: 'Incoming',
    },
    priority: {
      type: String,
      enum: ['Normal', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    assignedTo: {
      name: { type: String },
      desk: { type: String },
      officer: { type: String },
    },
    quotations: [
      {
        vendorName: { type: String, required: true },
        totalPrice: { type: Number, required: true },
        unitPrice: { type: Number },
        leadTimeDays: { type: Number, required: true },
        specificationsText: { type: String, required: true },
        warrantyTerms: { type: String, default: '12 Months Standard Warranty' },
        isChosen: { type: Boolean, default: false },
        quotationDocUrl: { type: String, default: '/docs/quote-sample.pdf' },
      },
    ],
    technicalApproval: {
      isApproved: { type: Boolean, default: false },
      reviewedBy: { type: String },
      reviewerRole: { type: String, default: 'Technical Specialist / HOD' },
      comments: { type: String },
      reviewedAt: { type: Date },
    },
    financeReview: {
      isApproved: { type: Boolean, default: false },
      reviewedBy: { type: String },
      comments: { type: String },
      allocatedBudget: { type: Number },
      baselinePrice: { type: Number },
      variancePercentage: { type: Number },
      isWithinBudget: { type: Boolean, default: true },
      reviewedAt: { type: Date },
    },
    purchaseOrder: {
      poNumber: { type: String },
      generatedAt: { type: Date },
      vendorSentConfirmation: { type: Boolean, default: false },
      paymentTerms: { type: String, default: 'Net 30 Days after GRN' },
      deliveryDeadline: { type: Date },
      poDocumentUrl: { type: String, default: '/docs/po-sample.pdf' },
    },
    deliveryConfirmation: {
      signedNoteUrl: { type: String },
      receivedAt: { type: Date },
      recipientSignatureName: { type: String },
      recipientDepartment: { type: String },
      inspectionNotes: { type: String, default: 'All physical goods inspected with zero defect or transit damage.' },
      fullDeliveryReceived: { type: Boolean, default: true },
    },
    invoice: {
      vendorInvoiceNumber: { type: String },
      invoiceAmount: { type: Number },
      invoiceDocUrl: { type: String, default: '/docs/invoice-sample.pdf' },
      receivedAt: { type: Date },
      recordedBy: { type: String },
    },
    paymentRecord: {
      transactionRef: { type: String },
      amountPaid: { type: Number },
      paymentMethod: { type: String, default: 'Corporate Wire (SAMA SARIE)' },
      paidAt: { type: Date },
      bankReference: { type: String },
      accountsAuditor: { type: String, default: 'Finance Accounts Desk' },
      threeWayMatchStatus: { type: String, default: 'Pending' },
    },
    flaggedIssue: {
      isFlagged: { type: Boolean, default: false },
      reasonCategory: { type: String },
      comments: { type: String },
      flaggedBy: { type: String },
      flaggedRole: { type: String },
      flaggedAt: { type: Date },
      revertedFromStage: { type: String },
    },
    timeline: [
      {
        stage: { type: String },
        status: { type: String },
        date: { type: Date, default: Date.now },
        timestamp: { type: Date, default: Date.now },
        actor: { type: String, default: 'System' },
        role: { type: String },
        notes: { type: String },
        documentUrl: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save routing automation
ProcurementRequestSchema.pre('save', async function () {
  if (this.isNew) {
    if (!this.ticketId) {
      const year = new Date().getFullYear();
      const randomId = Math.floor(10000 + Math.random() * 90000);
      this.ticketId = `PR-${year}-${randomId}`;
    }

    if (!this.assignedTo || !this.assignedTo.name) {
      this.assignedTo = getAssignedProcurementDesk(this.location);
    }
  }
});

export default mongoose.models.ProcurementRequest ||
  mongoose.model('ProcurementRequest', ProcurementRequestSchema);
