import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const request = await ProcurementRequest.findOne({ ticketId: id });
    
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: request }, { status: 200 });
  } catch (error) {
    console.error('Fetch request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updates = await req.json();

    const request = await ProcurementRequest.findOneAndUpdate(
      { ticketId: id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: request }, { status: 200 });
  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
