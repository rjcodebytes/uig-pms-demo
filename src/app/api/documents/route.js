import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProcDocument from '@/models/Document';
import Workflow from '@/models/Workflow';
import User from '@/models/User';

export async function GET(req) {
  await dbConnect();
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const forInitiator = searchParams.get('initiator');

  if (forInitiator) {
    // Initiator: show only their own documents with latest workflow
    const docs = await ProcDocument.find({ initiator_id: session.user.id })
      .populate('purchase_type', 'name estimated_cost')
      .populate('initiator_id', 'name')
      .sort({ createdAt: -1 });

    const docsWithWorkflow = await Promise.all(docs.map(async (doc) => {
      const latestWf = await Workflow.findOne({ document_id: doc._id })
        .sort({ createdAt: -1 })
        .populate('reviewer_id', 'name position');
      return { ...doc.toObject(), latestWorkflow: latestWf };
    }));
    return NextResponse.json(docsWithWorkflow);
  }

  // Admin: all documents
  const docs = await ProcDocument.find()
    .populate('purchase_type', 'name estimated_cost')
    .populate('initiator_id', 'name department')
    .sort({ status: 1, createdAt: 1 });
  return NextResponse.json(docs);
}

export async function POST(req) {
  await dbConnect();
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const doc_title = formData.get('doc_title');
  const doc_desc = formData.get('doc_desc');
  const purchase_type = formData.get('purchase_type');
  const file = formData.get('document');

  if (!doc_title || !doc_desc || !purchase_type || !file) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Find HOD for initiator's department
  const initiator = await User.findById(session.user.id).populate('role');
  const hod = await User.findOne({ position: 'Head Of Department', department: initiator.department });
  if (!hod) return NextResponse.json({ error: 'No HOD found for your department' }, { status: 400 });

  const document = await ProcDocument.create({
    doc_title,
    doc_desc,
    purchase_type,
    initiator_id: session.user.id,
    documents: buffer,
    status: 'Pending',
  });

  await Workflow.create({
    document_id: document._id,
    reviewer_id: hod._id,
    status: 'Pending',
    remark: 'Sent to HOD',
  });

  return NextResponse.json({ success: true, id: document._id }, { status: 201 });
}
