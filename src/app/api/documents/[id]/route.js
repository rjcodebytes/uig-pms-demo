import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProcDocument from '@/models/Document';
import Workflow from '@/models/Workflow';
import User from '@/models/User';

export async function GET(req, { params }) {
  await dbConnect();
  const doc = await ProcDocument.findById(params.id)
    .populate('purchase_type', 'name description estimated_cost')
    .populate('initiator_id', 'name email department position');
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const workflows = await Workflow.find({ document_id: params.id })
    .populate('reviewer_id', 'name position')
    .sort({ createdAt: 1 });

  return NextResponse.json({ document: doc, workflows });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const doc_title = formData.get('doc_title');
  const doc_desc = formData.get('doc_desc');
  const purchase_type = formData.get('purchase_type');
  const file = formData.get('document');

  const update = { doc_title, doc_desc, purchase_type, status: 'Pending' };
  if (file && file.size > 0) {
    const ab = await file.arrayBuffer();
    update.documents = Buffer.from(ab);
  }

  const document = await ProcDocument.findByIdAndUpdate(params.id, update, { new: true });
  if (!document) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Reset workflow — delete old, create new for HOD
  const initiator = await User.findById(session.user.id);
  const hod = await User.findOne({ position: 'Head Of Department', department: initiator.department });
  if (!hod) return NextResponse.json({ error: 'No HOD found' }, { status: 400 });

  await Workflow.deleteMany({ document_id: params.id });
  await Workflow.create({ document_id: params.id, reviewer_id: hod._id, status: 'Pending', remark: 'Re-sent to HOD' });

  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await ProcDocument.findByIdAndDelete(params.id);
  await Workflow.deleteMany({ document_id: params.id });
  return NextResponse.json({ success: true });
}
