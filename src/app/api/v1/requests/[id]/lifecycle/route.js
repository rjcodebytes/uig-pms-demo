import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const payload = await req.json(); // { action: 'delivery' | 'payment', data: {} }

    const request = await ProcurementRequest.findOne({ ticketId: id });
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (payload.action === 'delivery') {
      if (request.status !== 'PO_Generated') {
        return NextResponse.json({ error: 'Must be in PO_Generated status.' }, { status: 400 });
      }
      request.deliveryConfirmation = {
        signedNoteUrl: payload.data.signedNoteUrl || '/mock/signed-note.png',
        recipientSignatureName: payload.data.recipientSignatureName || 'Warehouse Staff',
        receivedAt: new Date(),
      };
      request.status = 'Delivery_Pending'; // Or could go straight to Payment required
    } else if (payload.action === 'payment') {
      if (request.status !== 'Delivery_Pending' && request.status !== 'PO_Generated') {
         return NextResponse.json({ error: 'Must be delivered or PO generated to pay.' }, { status: 400 });
      }
      request.paymentRecord = {
        transactionRef: payload.data.transactionRef || `TXN-${Math.floor(Math.random() * 999999)}`,
        amountPaid: payload.data.amountPaid,
        paidAt: new Date(),
      };
      request.status = 'Completed';
    } else {
      return NextResponse.json({ error: 'Invalid action type.' }, { status: 400 });
    }

    await request.save();

    return NextResponse.json({ success: true, data: request }, { status: 200 });
  } catch (error) {
    console.error('Lifecycle error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
