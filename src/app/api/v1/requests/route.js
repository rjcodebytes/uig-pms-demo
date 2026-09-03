import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';
import { validateProcurementRequestBody } from '@/lib/validateRequest';
import { getAssignedProcurementDesk } from '@/lib/assignProcurementDesk';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    const regionFlag = url.searchParams.get('region') || 'Riyadh';

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error('MongoDB is offline');
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
    
    // Explicit validation matching Mongoose schema
    const validationError = validateProcurementRequestBody(body);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const location = body.location;
    const assignedTo = getAssignedProcurementDesk(location);

    const newRequest = {
      ticketId: `PR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: body.subject || `Material Requisition: ${body.itemDetails?.name || 'Site Materials'}`,
      businessJustification: {
        purpose: body.businessJustification?.purpose || body.notes || 'Mandatory site requirement for ongoing engineering milestone execution.',
        urgencyReason: body.businessJustification?.urgencyReason || 'Required for critical path on-site operations and schedule adherence.',
        impactIfNotApproved: body.businessJustification?.impactIfNotApproved || 'Risk of site stoppage fines, contractor delays, and milestone penalties.',
        attachments: body.businessJustification?.attachments || [
          { name: 'technical-specs-sheet.pdf', url: '/docs/spec-sheet.pdf' }
        ],
      },
      requester: {
        name: body.requester.name,
        email: body.requester.email,
        department: body.requester.department,
        mobile: body.requester.mobile || '+966 50 112 3344',
      },
      project: {
        projectId: body.project.projectId,
        projectName: body.project.projectName,
        allocatedBudget: Number(body.project.allocatedBudget),
        client: body.project.client || 'UIG Enterprise',
      },
      location,
      assignedTo,
      itemDetails: {
        name: body.itemDetails.name,
        category: body.itemDetails.category,
        description: body.itemDetails.description || '',
        quantity: Number(body.itemDetails.quantity),
        unit: body.itemDetails.unit || 'Units',
        targetPrice: body.itemDetails.targetPrice !== undefined ? Number(body.itemDetails.targetPrice) : undefined,
      },
      status: 'Incoming',
      priority: body.priority || 'Medium',
      timeline: [
        {
          stage: 'Incoming',
          status: 'Incoming',
          date: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          notes: body.notes || 'Requisition submitted with business justification doc.',
          actor: body.requester?.name || 'Eng. Mohammed Al-Saud (Site Lead)',
        },
      ],
      quotations: [],
    };

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error('MongoDB is offline');
      const dbReq = await ProcurementRequest.create(newRequest);
      const jsonReq = dbReq.toObject ? dbReq.toObject() : dbReq;
      jsonReq._id = String(jsonReq._id);
      mockDb.requests.unshift(jsonReq);
      return NextResponse.json({ success: true, data: dbReq }, { status: 201 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable, saving to persistent mockDb:", dbErr);
      newRequest._id = `mock_${Math.random().toString(36).substr(2, 9)}`;
      mockDb.requests.unshift(newRequest);
      return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
    }
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
