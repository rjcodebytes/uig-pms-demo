import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { auth } from '@/lib/auth';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const session = await auth();
    const roleFlag = url.searchParams.get('role') || (session?.user?.role === 'Management' ? 'Management' : 'Officer');
    const regionFlag = url.searchParams.get('region') || 'Riyadh';

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
    } catch (dbErr) {
      console.warn("MongoDB unavailable, serving mock static requests.");
      return NextResponse.json({ success: true, data: [
        {
          _id: 'mock1',
          ticketId: 'PR-2026-00001',
          requester: { name: 'Ahmad', email: 'ahmad@uig.com' },
          project: { projectName: 'HQ Upgrade', allocatedBudget: 150000 },
          location: 'Riyadh',
          itemDetails: { name: 'Dell Latitude 7420', quantity: 10 },
          status: 'Quotation_Collection',
          quotations: [
             { vendorName: 'Jarir', totalPrice: 47000, leadTimeDays: 3, specificationsText: 'Core i7', isChosen: false },
             { vendorName: 'Extra', totalPrice: 48000, leadTimeDays: 2, specificationsText: 'Core i7', isChosen: false },
             { vendorName: 'Amazon', totalPrice: 46000, leadTimeDays: 5, specificationsText: 'Core i7', isChosen: false }
          ]
        },
        {
          _id: 'mock2',
          ticketId: 'PR-2026-00002',
          requester: { name: 'Sara', email: 'sara@uig.com' },
          project: { projectName: 'Jeddah Works', allocatedBudget: 300000 },
          location: 'Jeddah',
          itemDetails: { name: 'Concrete Grade 30', quantity: 1000 },
          status: 'Completed',
          quotations: [{ vendorName: 'Saudi ReadyMix', totalPrice: 210000, leadTimeDays: 1, specificationsText: 'G30', isChosen: true }]
        }
      ] }, { status: 200 });
    }

    let query = {};
    if (roleFlag !== 'Management') {
      query = { 'assignedTo.name': new RegExp(regionFlag, 'i') };
    }

    const requests = await ProcurementRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests }, { status: 200 });
  } catch (error) {
    console.error('Fetch requests error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const payload = await req.json();
    
    const newRequest = new ProcurementRequest(payload);
    await newRequest.save();

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
