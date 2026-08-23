import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    const regionFlag = url.searchParams.get('region') || 'Riyadh';

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
      
      let query = {};
      if (role === 'Regional_Procurement') {
        query.location = regionFlag;
      }
      const requests = await ProcurementRequest.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: requests }, { status: 200 });

    } catch (dbErr) {
      console.warn("MongoDB unavailable, serving from persistent mockDb.");
      
      let mockData = [...mockDb.requests];
      if (role === 'Regional_Procurement') {
        mockData = mockData.filter(r => r.location === regionFlag);
      }
      
      return NextResponse.json({ success: true, data: mockData }, { status: 200 });
    }
  } catch (error) {
    console.error('Fetch requests error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Simulate Location Routing based on rules if not provided
    let location = body.location || 'Riyadh';
    if (!body.location && body.project?.projectName?.toLowerCase().includes('jeddah')) {
      location = 'Jeddah';
    }

    const newRequest = {
      ticketId: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      requester: body.requester || 'System',
      department: body.department || 'Operations',
      location: location,
      project: body.project || { projectId: 'UNK', projectName: 'General' },
      itemDetails: body.itemDetails,
      status: 'Incoming',
      priority: body.priority || 'Medium',
      timeline: [{ status: 'Incoming', date: new Date().toISOString(), notes: body.notes || 'Created via Webhook/Portal' }],
      vendorQuotations: []
    };

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
      const dbReq = await ProcurementRequest.create(newRequest);
      return NextResponse.json({ success: true, data: dbReq }, { status: 201 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable, saving to persistent mockDb.");
      newRequest._id = Math.random().toString(36).substr(2, 9);
      mockDb.requests.unshift(newRequest); // add to top
      return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
    }
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
