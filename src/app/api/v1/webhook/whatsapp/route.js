import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';

export async function POST(req) {
  try {
    await dbConnect();
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
    // Assume message format like "Need 5 Laptops in Riyadh"
    const locationMatch = messageText.match(/in (Riyadh|Jeddah|Dammam|Khobar)/i);
    const qtyMatch = messageText.match(/(\d+)/);
    
    // Simplistic keyword removal for the item name
    let itemExtract = messageText
      .replace(/need|want|require/i, '')
      .replace(/in (Riyadh|Jeddah|Dammam|Khobar)/i, '')
      .replace(/\d+/, '')
      .trim();

    const isJobSeeker = noiseKeywords.test(messageText);

    // Mock project assignment
    const mockProject = {
      projectId: 'PRJ-WHATSAPP-01',
      projectName: 'Urgent Ops Replenishment',
      allocatedBudget: 50000,
    };

    const newRequest = new ProcurementRequest({
      requester: {
        name: senderName || 'WhatsApp User',
        email: `${senderPhone || 'unknown'}@whatsapp.local`,
        department: 'Operations',
      },
      project: mockProject,
      location: locationMatch ? locationMatch[1] : 'Other',
      itemDetails: {
        name: itemExtract || 'Unspecified Item',
        category: 'General',
        quantity: qtyMatch ? parseInt(qtyMatch[1], 10) : 1,
      },
      status: isJobSeeker ? 'Rejected_Job' : 'Incoming',
    });

    await newRequest.save();

    if (isJobSeeker) {
      return NextResponse.json(
        {
          success: true,
          message: 'Application acknowledged and rejected. Not a procurement request.',
          ticketId: newRequest.ticketId,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Procurement request successfully parsed and created.',
        ticketId: newRequest.ticketId,
        assignedTo: newRequest.assignedTo,
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
