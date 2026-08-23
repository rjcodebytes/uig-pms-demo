import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    doc_title:     { type: String, required: true },
    doc_desc:      { type: String, required: true },
    purchase_type: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseType', required: true },
    initiator_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documents:     { type: Buffer, required: true },   // PDF stored as binary
    status:        { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

const ProcDocument = mongoose.models.ProcDocument || mongoose.model('ProcDocument', DocumentSchema, 'documents');
export default ProcDocument;
