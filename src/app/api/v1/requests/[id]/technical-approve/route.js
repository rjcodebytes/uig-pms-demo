import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { auth } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const session = await auth();
    const payload = await req.json();

    const request = await ProcurementRequest.findOne({ ticketId: id });
    
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Gate 1: Enforce that only entity matching requester.email can technically approve (or a mocked bypass for demo)
    const userEmail = session?.user?.email || payload.email; // fallback to payload for demo purposes
    if (request.requester.email !== userEmail && !payload.forceApprove) {
      return NextResponse.json({ error: 'Unauthorized: Only the requester can technically approve.' }, { status: 403 });
    }

    if (request.status !== 'Quotation_Collection') {
      return NextResponse.json({ error: 'Invalid state transition. Must be in Quotation_Collection.' }, { status: 400 });
    }

    request.technicalApproval = {
      isApproved: true,
      reviewedBy: userEmail,
      reviewedAt: new Date(),
    };
    request.status = 'Technical_Approval';
    
    // Choose the selected vendor from payload
    if (payload.chosenVendorName) {
      request.quotations.forEach(q => {
        if (q.vendorName === payload.chosenVendorName) q.isChosen = true;
        else q.isChosen = false;
      });
    }

    await request.save();

    return NextResponse.json({ success: true, data: request }, { status: 200 });
  } catch (error) {
    console.error('Technical approval error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
