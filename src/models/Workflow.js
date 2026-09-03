import mongoose from 'mongoose';

const WorkflowSchema = new mongoose.Schema({
  document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remark: { type: String },
}, { timestamps: true });

export default mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);
