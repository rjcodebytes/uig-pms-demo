import mongoose from 'mongoose';

const ProcurementRequestSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    requester: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      department: { type: String, required: true },
    },
    project: {
      projectId: { type: String, required: true },
      projectName: { type: String, required: true },
      allocatedBudget: { type: Number, required: true },
    },
    location: {
      type: String,
      required: true,
      enum: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Other'],
    },
    itemDetails: {
      name: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String },
      quantity: { type: Number, required: true, min: 1 },
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
    assignedTo: {
      userId: { type: String },
      name: { type: String },
    },
    quotations: {
      type: [
        {
          vendorName: { type: String, required: true },
          totalPrice: { type: Number, required: true },
          leadTimeDays: { type: Number, required: true },
          specificationsText: { type: String, required: true },
          isChosen: { type: Boolean, default: false },
          quotationDocUrl: { type: String, default: '/mock/doc.pdf' },
        },
      ],
      validate: [
        function (val) {
          return val.length === 0 || val.length === 3;
        },
        'Quotations array must contain exactly 0 or 3 vendor objects.',
      ],
    },
    technicalApproval: {
      isApproved: { type: Boolean, default: false },
      reviewedBy: { type: String },
      reviewedAt: { type: Date },
    },
    financeReview: {
      isApproved: { type: Boolean, default: false },
      reviewedBy: { type: String },
      comments: { type: String },
      varianceDetected: { type: Boolean, default: false },
      reviewedAt: { type: Date },
    },
    purchaseOrder: {
      poNumber: { type: String },
      generatedAt: { type: Date },
      vendorSentConfirmation: { type: Boolean, default: false },
    },
    deliveryConfirmation: {
      signedNoteUrl: { type: String },
      receivedAt: { type: Date },
      recipientSignatureName: { type: String },
    },
    paymentRecord: {
      transactionRef: { type: String },
      amountPaid: { type: Number },
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Pre-save hook for auto-generating ticketId and assigning regional desk
ProcurementRequestSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate unique PR ticket ID if not provided
    if (!this.ticketId) {
      const year = new Date().getFullYear();
      // Simple random 5-digit generator for prototype simplicity
      const randomId = Math.floor(10000 + Math.random() * 90000);
      this.ticketId = `PR-${year}-${randomId}`;
    }

    // Regional Location Routing Engine
    if (!this.assignedTo || !this.assignedTo.name) {
      this.assignedTo = this.assignedTo || {};
      switch (this.location) {
        case 'Riyadh':
          this.assignedTo.name = 'Riyadh Procurement Desk';
          break;
        case 'Jeddah':
          this.assignedTo.name = 'Jeddah Procurement Desk';
          break;
        case 'Dammam':
          this.assignedTo.name = 'Eastern Province Desk';
          break;
        case 'Khobar':
          this.assignedTo.name = 'Eastern Province Desk';
          break;
        default:
          this.assignedTo.name = 'HQ Global Procurement';
      }
    }
  }

  next();
});

export default mongoose.models.ProcurementRequest ||
  mongoose.model('ProcurementRequest', ProcurementRequestSchema);
