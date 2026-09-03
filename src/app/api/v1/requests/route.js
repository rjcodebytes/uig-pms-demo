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
      await dbConnect();
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
    
    let location = body.location || 'Riyadh';
    if (!body.location && body.project?.projectName?.toLowerCase().includes('jeddah')) {
      location = 'Jeddah';
    } else if (!body.location && body.project?.projectName?.toLowerCase().includes('dammam')) {
      location = 'Dammam';
    }

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
      requester: typeof body.requester === 'object' ? body.requester : {
        name: body.requester || 'Eng. Mohammed Al-Saud (Site Lead)',
        email: 'm.alsaud@uig.com',
        department: body.department || 'Site Operations & Civil',
        mobile: '+966 50 112 3344',
      },
      project: body.project || {
        projectId: 'PRJ-RYD-METRO',
        projectName: 'Riyadh Metro Extension Phase 2',
        allocatedBudget: 350000,
        client: 'Royal Commission for Riyadh City',
      },
      location,
      itemDetails: body.itemDetails,
      status: 'Incoming',
      priority: body.priority || 'High',
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
      await dbConnect();
      const dbReq = await ProcurementRequest.create(newRequest);
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
