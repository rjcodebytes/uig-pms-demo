import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function POST(req, context) {
  try {
    const params = await context?.params;
    const id = params?.id;
    const { isApproved, notes } = await req.json();

    const newStatus = isApproved ? 'PO_Generated' : 'Rejected_Job';
    const timelineEntry = {
      stage: newStatus,
      status: newStatus,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      notes: notes || (isApproved ? 'Finance approved, PO generated' : 'Finance rejected'),
      actor: 'Finance Controller',
    };

    try {
      await dbConnect();
      const findQuery = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { ticketId: id }] } : { ticketId: id };
      const request = await ProcurementRequest.findOne(findQuery);
      if (!request) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      
      request.status = newStatus;
      if (!request.timeline) request.timeline = [];
      request.timeline.push(timelineEntry);
      
      if (isApproved && !request.purchaseOrder?.poNumber) {
        request.purchaseOrder = {
          poNumber: `PO-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          generatedAt: new Date(),
          vendorSentConfirmation: true,
          paymentTerms: 'Net 30 Days after GRN',
        };
      }
      await request.save();
      return NextResponse.json({ success: true, data: request }, { status: 200 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable, updating mockDb");
      const index = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id);
      if (index === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      
      mockDb.requests[index].status = newStatus;
      mockDb.requests[index].timeline.push(timelineEntry);
      return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
    }
  } catch (error) {
    console.error('Finance review error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
