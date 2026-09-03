import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    crNumber: { type: String, required: true }, // Commercial Registration
    vatNumber: { type: String, required: true },
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    status: { type: String, enum: ['Approved', 'Under_Review', 'Suspended'], default: 'Approved' },
    contactPerson: { type: String },
    email: { type: String },
    phone: { type: String },
    city: { type: String, default: 'Riyadh' },
    paymentTerms: { type: String, default: 'Net 30 Days' },
    totalSpendSAR: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    avgDeliveryDays: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
