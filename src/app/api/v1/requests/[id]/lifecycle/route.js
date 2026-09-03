import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function POST(req, context) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const reqIdx = pathParts.indexOf('requests');
    const idFromUrl = reqIdx !== -1 ? pathParts[reqIdx + 1] : null;

    const resolvedParams = await context?.params;
    const rawId = resolvedParams?.id || idFromUrl;
    const id = decodeURIComponent(rawId || '');

    const body = await req.json();
    const { action, notes, quotations, documentUrl, reasonCategory, targetStage, currentStage, flaggedBy, flaggedRole } = body;

    let newStatus;
    if (action === 'QUOTES_SUBMITTED') {
      newStatus = 'Technical_Approval';
    } else if (action === 'DELIVERY_CONFIRMED') {
      newStatus = 'Delivery_Pending';
    } else if (action === 'PAYMENT_PROCESSED') {
      newStatus = 'Completed';
    } else if (action === 'FLAG_ISSUE' || action === 'REVERT_STAGE') {
      newStatus = targetStage || 'Quotation_Collection';
    } else if (action === 'RESOLVE_FLAG') {
      newStatus = targetStage || 'Technical_Approval';
    } else {
      return NextResponse.json({ success: false, message: `Invalid action: ${action}` }, { status: 400 });
    }

    const timelineEntry = {
      stage: action === 'FLAG_ISSUE' ? 'Issue_Flagged' : newStatus,
      status: newStatus,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      notes: action === 'FLAG_ISSUE'
        ? `⚠️ Issue Flagged (${reasonCategory || 'Revision Required'}): ${notes || 'Reverted back for corrections'}`
        : (notes || `Transitioned to ${newStatus.replace(/_/g, ' ')}`),
      actor: flaggedBy || (action === 'QUOTES_SUBMITTED' ? 'Procurement Officer' : action === 'DELIVERY_CONFIRMED' ? 'Site Receiver' : 'Finance Controller'),
      documentUrl
    };

    // 1. Try Live MongoDB
    try {
      await dbConnect();
      const orConditions = [
        { ticketId: id },
        { ticketId: id.toUpperCase() }
      ];
      if (mongoose.isValidObjectId(id)) {
        orConditions.push({ _id: id });
      }

      let request = await ProcurementRequest.findOne({ $or: orConditions });
      
      if (request) {
        request.status = newStatus;
        if (!request.timeline) request.timeline = [];
        request.timeline.push(timelineEntry);

        if (action === 'QUOTES_SUBMITTED' && quotations && quotations.length > 0) {
          request.quotations = quotations;
          if (request.flaggedIssue) request.flaggedIssue.isFlagged = false;
        } else if (action === 'FLAG_ISSUE' || action === 'REVERT_STAGE') {
          request.flaggedIssue = {
            isFlagged: true,
            reasonCategory: reasonCategory || 'Technical / Commercial Issue',
            comments: notes || 'Revision required by reviewer.',
            flaggedBy: flaggedBy || 'Approver',
            flaggedRole: flaggedRole || 'Approver',
            flaggedAt: new Date(),
            revertedFromStage: currentStage || 'Technical_Approval',
          };
        } else if (action === 'RESOLVE_FLAG') {
          if (request.flaggedIssue) request.flaggedIssue.isFlagged = false;
        } else if (action === 'DELIVERY_CONFIRMED') {
          request.deliveryConfirmation = {
            receivedAt: new Date(),
            recipientSignatureName: body.receiverName || 'Eng. Mohammed Al-Saud (Site Lead)',
            signedNoteUrl: documentUrl || '/docs/signed-grn-receipt.pdf',
          };
        } else if (action === 'PAYMENT_PROCESSED') {
          const winningQuote = request.quotations?.find(q => q.isChosen) || request.quotations?.[0];
          request.paymentRecord = {
            transactionRef: `TXN-SAMA-${Math.floor(100000 + Math.random() * 900000)}`,
            amountPaid: winningQuote?.totalPrice || 45000,
            paidAt: new Date(),
          };
        }

        await request.save();
        return NextResponse.json({ success: true, data: request }, { status: 200 });
      }
    } catch (dbErr) {
      console.error("[LIFECYCLE API] MongoDB error:", dbErr);
    }

    // 2. Fallback to mockDb
    const index = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
    if (index !== -1) {
      mockDb.requests[index].status = newStatus;
      if (action === 'QUOTES_SUBMITTED' && quotations) {
        mockDb.requests[index].quotations = quotations;
      }
      if (action === 'FLAG_ISSUE') {
        mockDb.requests[index].flaggedIssue = {
          isFlagged: true,
          reasonCategory: reasonCategory || 'Issue Flagged',
          comments: notes,
          flaggedBy,
          flaggedRole,
          flaggedAt: new Date(),
        };
      }
      mockDb.requests[index].timeline.push(timelineEntry);
      return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: `Ticket not found for ID: ${id}` }, { status: 404 });
  } catch (error) {
    console.error('[LIFECYCLE API] Unexpected error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
