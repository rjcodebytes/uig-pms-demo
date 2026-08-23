import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
      const request = await ProcurementRequest.findById(id);
      if (!request) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: request }, { status: 200 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable, getting from mockDb");
      const mockReq = mockDb.requests.find(r => r._id === id);
      if (!mockReq) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: mockReq }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
      
      const request = await ProcurementRequest.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json({ success: true, data: request }, { status: 200 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable, updating mockDb");
      const index = mockDb.requests.findIndex(r => r._id === id);
      if (index === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      
      mockDb.requests[index] = { ...mockDb.requests[index], ...body };
      return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
