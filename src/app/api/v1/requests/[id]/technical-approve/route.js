import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { isApproved, notes } = await req.json();

    const newStatus = isApproved ? 'Finance_Review' : 'Rejected_Job';
    const timelineEntry = {
      status: newStatus,
      date: new Date().toISOString(),
      notes: notes || (isApproved ? 'Technically approved' : 'Technically rejected')
    };

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
      const request = await ProcurementRequest.findById(id);
      if (!request) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      
      request.status = newStatus;
      request.timeline.push(timelineEntry);
      await request.save();
      return NextResponse.json({ success: true, data: request }, { status: 200 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable, updating mockDb");
      const index = mockDb.requests.findIndex(r => r._id === id);
      if (index === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      
      mockDb.requests[index].status = newStatus;
      mockDb.requests[index].timeline.push(timelineEntry);
      return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
