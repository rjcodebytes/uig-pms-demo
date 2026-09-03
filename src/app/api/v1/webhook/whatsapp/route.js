import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';
import { getAssignedProcurementDesk } from '@/lib/assignProcurementDesk';

export async function POST(req) {
  try {
    const payload = await req.json();
    const { senderPhone, senderName, messageText } = payload;

    if (!messageText) {
      return NextResponse.json(
        { error: 'Missing messageText in payload.' },
        { status: 400 }
      );
    }

    // AI Noise Filter (Regex)
    const noiseKeywords = /cv|resume|hiring|apply for job|vacancy/i;
    
    // Parse utility to extract item, quantity, location (simplified for prototype)
    const locationMatch = messageText.match(/in (Riyadh|Jeddah|Dammam|Khobar)/i);
    const qtyMatch = messageText.match(/(\d+)/);
    
    let itemExtract = messageText
      .replace(/need|want|require/i, '')
      .replace(/in (Riyadh|Jeddah|Dammam|Khobar)/i, '')
      .replace(/\d+/, '')
      .trim();

    const isJobSeeker = noiseKeywords.test(messageText);
    const location = locationMatch ? locationMatch[1] : 'Riyadh';
    const assignedTo = getAssignedProcurementDesk(location);

    const mockProject = {
      projectId: 'PRJ-WHATSAPP-01',
      projectName: 'Urgent Ops Replenishment',
      allocatedBudget: 50000,
      client: 'UIG Enterprise',
    };

    const newRequestData = {
      ticketId: `PR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: `WhatsApp Requisition: ${itemExtract || 'Site Materials'}`,
      businessJustification: {
        purpose: messageText,
        urgencyReason: 'Ingested via WhatsApp Bot from field operations.',
        impactIfNotApproved: 'Site work stoppage or operational delay.',
      },
      requester: {
        name: senderName || 'WhatsApp User',
        email: `${senderPhone || 'unknown'}@whatsapp.local`,
        department: 'Operations',
        mobile: senderPhone || '+966 50 000 0000',
      },
      project: mockProject,
      location,
      assignedTo,
      itemDetails: {
        name: itemExtract || 'Unspecified Item',
        category: 'General Supplies',
        quantity: qtyMatch ? parseInt(qtyMatch[1], 10) : 1,
        unit: 'Units',
        targetPrice: 100,
      },
      status: isJobSeeker ? 'Rejected_Job' : 'Incoming',
      priority: 'High',
      timeline: [
        {
          stage: isJobSeeker ? 'Rejected_Job' : 'Incoming',
          status: isJobSeeker ? 'Rejected_Job' : 'Incoming',
          date: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          notes: isJobSeeker ? 'Application rejected by AI noise filter' : `Ingested from WhatsApp: "${messageText}"`,
          actor: senderName || 'WhatsApp User',
        },
      ],
      quotations: [],
    };

    let createdRequest;
    try {
      await dbConnect();
      createdRequest = await ProcurementRequest.create(newRequestData);
    } catch (dbErr) {
      console.warn("MongoDB unavailable in WhatsApp webhook, falling back to mockDb:", dbErr);
      createdRequest = {
        ...newRequestData,
        _id: `mock_${Math.random().toString(36).substr(2, 9)}`,
      };
      mockDb.requests.unshift(createdRequest);
    }

    if (isJobSeeker) {
      return NextResponse.json(
        {
          success: true,
          message: 'Application acknowledged and rejected. Not a procurement request.',
          ticketId: createdRequest.ticketId,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Procurement request successfully parsed and created.',
        ticketId: createdRequest.ticketId,
        assignedTo: createdRequest.assignedTo,
        data: createdRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
