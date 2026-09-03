import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function GET(req, context) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const reqIdx = pathParts.indexOf('requests');
    const idFromUrl = reqIdx !== -1 ? pathParts[reqIdx + 1] : null;

    const resolvedParams = await context?.params;
    const rawId = resolvedParams?.id || idFromUrl;
    const id = decodeURIComponent(rawId || '');

    try {
      await dbConnect();
      const orConditions = [
        { ticketId: id },
        { ticketId: id.toUpperCase() }
      ];
      if (mongoose.isValidObjectId(id)) {
        orConditions.push({ _id: id });
      }

      const request = await ProcurementRequest.findOne({ $or: orConditions });
      if (request) {
        return NextResponse.json({ success: true, data: request }, { status: 200 });
      }
    } catch (dbErr) {
      console.warn("[REQUEST GET] MongoDB error, checking mockDb:", dbErr);
    }

    // Fallback to mockDb
    const mockReq = mockDb.requests.find(
      (r) => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase()
    );
    if (mockReq) {
      return NextResponse.json({ success: true, data: mockReq }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: `Requisition ticket not found: ${id}` }, { status: 404 });
  } catch (error) {
    console.error('Request fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const reqIdx = pathParts.indexOf('requests');
    const idFromUrl = reqIdx !== -1 ? pathParts[reqIdx + 1] : null;

    const resolvedParams = await context?.params;
    const rawId = resolvedParams?.id || idFromUrl;
    const id = decodeURIComponent(rawId || '');

    const body = await req.json();

    if (body.vendorQuotations && !body.quotations) {
      body.quotations = body.vendorQuotations;
    }

    try {
      await dbConnect();
      const orConditions = [
        { ticketId: id },
        { ticketId: id.toUpperCase() }
      ];
      if (mongoose.isValidObjectId(id)) {
        orConditions.push({ _id: id });
      }

      const request = await ProcurementRequest.findOneAndUpdate(
        { $or: orConditions },
        body,
        { new: true }
      );
      if (request) {
        return NextResponse.json({ success: true, data: request }, { status: 200 });
      }
    } catch (dbErr) {
      console.warn("[REQUEST PUT] MongoDB error, updating mockDb:", dbErr);
    }

    const index = mockDb.requests.findIndex(
      (r) => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase()
    );
    if (index !== -1) {
      mockDb.requests[index] = { ...mockDb.requests[index], ...body };
      return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Request update error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
