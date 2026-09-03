import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcDocument from '@/models/Document';

export async function GET(req, context) {
  await dbConnect();
  const params = await context?.params;
  const id = params?.id;
  const doc = await ProcDocument.findById(id);
  if (!doc || !doc.documents) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return new NextResponse(doc.documents, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"',
    },
  });
}
