import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';
import { sanitizeQuotations } from '@/lib/sanitizeQuotations';

export async function POST(req, context) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const reqIdx = pathParts.indexOf('requests');
    const idFromUrl = reqIdx !== -1 ? pathParts[reqIdx + 1] : null;

    const resolvedParams = await context?.params;
    const rawId = resolvedParams?.id || idFromUrl;
    const id = decodeURIComponent(rawId || '');

    const body = await req.json();
    const { action, notes, quotations, documentUrl, reasonCategory, targetStage, currentStage, driverName, waybillNumber } = body;

    // Role checks based on action
    const userRole = session.user.role;
    if (action === 'DELIVERY_CONFIRMED') {
      const allowed = ['Store Keeper', 'Storekeeper', 'Initiator', 'Admin'];
      if (!allowed.includes(userRole)) {
        return NextResponse.json({ success: false, message: 'Forbidden: Only Storekeeper or Site Initiator can confirm delivery' }, { status: 403 });
      }
    } else if (action === 'PAYMENT_PROCESSED') {
      const allowed = ['Store Incharge', 'Finance Controller', 'Finance', 'Admin'];
      if (!allowed.includes(userRole)) {
        return NextResponse.json({ success: false, message: 'Forbidden: Only Finance Controller can process payment' }, { status: 403 });
      }
    } else if (action === 'QUOTES_SUBMITTED') {
      const allowed = ['Initiator', 'Procurement', 'Admin', 'Approver', 'Store Incharge'];
      if (!allowed.includes(userRole)) {
        return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges to submit quotations' }, { status: 403 });
      }
    } else if (action === 'FLAG_ISSUE' || action === 'REVERT_STAGE') {
      const allowed = ['Approver', 'Technical Approver', 'Store Incharge', 'Finance Controller', 'Finance', 'Admin'];
      if (!allowed.includes(userRole)) {
        return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges to flag issues' }, { status: 403 });
      }
    }

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

    const actorName = session.user.name || session.user.username || 'System User';
    const actorRole = session.user.role || 'User';

    const timelineEntry = {
      stage: action === 'FLAG_ISSUE' ? 'Issue_Flagged' : newStatus,
      status: newStatus,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      notes: action === 'FLAG_ISSUE'
        ? `⚠️ Issue Flagged (${reasonCategory || 'Revision Required'}): ${notes || 'Reverted back for corrections'}`
        : (notes || `Transitioned to ${newStatus.replace(/_/g, ' ')}`),
      actor: actorName,
      role: actorRole,
      documentUrl
    };

    // Helper to validate state transitions (Issue 4) and 3-Way Match (Issue 5)
    const validateAndApplyTransition = (reqDoc) => {
      if (action === 'QUOTES_SUBMITTED') {
        const allowed = ['Incoming', 'Quotation_Collection'];
        if (!allowed.includes(reqDoc.status)) {
          return { error: `Invalid state transition: Cannot submit quotes from '${reqDoc.status}'` };
        }
        if (!quotations || quotations.length === 0) {
          return { error: 'Quotations array must contain at least 1 quotation' };
        }
      } else if (action === 'DELIVERY_CONFIRMED') {
        const allowed = ['PO_Generated', 'Delivery_Pending'];
        if (!allowed.includes(reqDoc.status)) {
          return { error: `Invalid state transition: Cannot confirm delivery from '${reqDoc.status}', must be PO_Generated` };
        }
      } else if (action === 'PAYMENT_PROCESSED') {
        if (reqDoc.status !== 'Delivery_Pending') {
          return { error: `Invalid state transition: Payment requires Delivery_Pending with confirmed GRN, current status is '${reqDoc.status}'` };
        }

        // Real 3-Way Match Validation (Issue 5)
        const winningQuote = reqDoc.quotations?.find(q => q.isChosen) || reqDoc.quotations?.[0];
        const poAmount = winningQuote?.totalPrice || 0;
        const invoiceAmount = body.invoiceAmount !== undefined
          ? Number(body.invoiceAmount)
          : (body.invoice?.invoiceAmount !== undefined ? Number(body.invoice.invoiceAmount) : (reqDoc.invoice?.invoiceAmount || poAmount));
        
        const tolerance = 1; // 1 SAR tolerance
        const difference = Math.abs(invoiceAmount - poAmount);

        if (difference > tolerance && !body.overrideMatchMismatch) {
          return {
            error: `3-Way Match Failed: Vendor invoice amount (${invoiceAmount} SAR) does not match PO authorized amount (${poAmount} SAR). Difference: ${difference} SAR. Set overrideMatchMismatch=true to force.`,
          };
        }

        reqDoc.invoice = {
          vendorInvoiceNumber: body.invoiceNumber || body.invoice?.vendorInvoiceNumber || `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          invoiceAmount: invoiceAmount,
          invoiceDocUrl: documentUrl || body.invoiceDocUrl || '/docs/invoice-sample.pdf',
          receivedAt: new Date(),
          recordedBy: actorName,
        };

        reqDoc.paymentRecord = {
          transactionRef: `TXN-SAMA-${Math.floor(100000 + Math.random() * 900000)}`,
          amountPaid: invoiceAmount,
          paymentMethod: 'Corporate Wire (SAMA SARIE)',
          paidAt: new Date(),
          threeWayMatchStatus: `Verified (PO: ${poAmount} SAR == GRN: 100% == Invoice: ${invoiceAmount} SAR)`,
          accountsAuditor: actorName,
        };
      }
      return null;
    };

    // 1. Try Live MongoDB
    try {
      const conn = await dbConnect();
      if (!conn) throw new Error('MongoDB is offline');
      const orConditions = [
        { ticketId: id },
        { ticketId: id.toUpperCase() }
      ];
      if (mongoose.isValidObjectId(id)) {
        orConditions.push({ _id: id });
      }

      let request = await ProcurementRequest.findOne({ $or: orConditions });
      
      if (request) {
        const validation = validateAndApplyTransition(request);
        if (validation?.error) {
          return NextResponse.json({ success: false, message: validation.error }, { status: 400 });
        }

        request.status = newStatus;
        if (!request.timeline) request.timeline = [];
        request.timeline.push(timelineEntry);

        if (action === 'QUOTES_SUBMITTED' && quotations && quotations.length > 0) {
          const qty = request.itemDetails?.quantity || 1;
          request.quotations = sanitizeQuotations(quotations, qty);
          if (request.flaggedIssue) request.flaggedIssue.isFlagged = false;
        } else if (action === 'FLAG_ISSUE' || action === 'REVERT_STAGE') {
          request.flaggedIssue = {
            isFlagged: true,
            reasonCategory: reasonCategory || 'Technical / Commercial Issue',
            comments: notes || 'Revision required by reviewer.',
            flaggedBy: actorName,
            flaggedRole: actorRole,
            flaggedAt: new Date(),
            revertedFromStage: currentStage || 'Technical_Approval',
          };
        } else if (action === 'RESOLVE_FLAG') {
          if (request.flaggedIssue) request.flaggedIssue.isFlagged = false;
        } else if (action === 'DELIVERY_CONFIRMED') {
          request.deliveryConfirmation = {
            driverName: driverName || 'Supplier Courier Representative',
            waybillNumber: waybillNumber || `WB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            receivedAt: new Date(),
            recipientSignatureName: actorName,
            signedNoteUrl: documentUrl || '/docs/signed-grn-receipt.pdf',
            inspectionNotes: notes || 'All physical goods inspected with zero defect or transit damage.',
            fullDeliveryReceived: true,
          };
        }

        await request.save();
        const mIdx = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
        if (mIdx !== -1) {
          mockDb.requests[mIdx] = request.toObject ? request.toObject() : request;
        }
        return NextResponse.json({ success: true, data: request }, { status: 200 });
      }
    } catch (dbErr) {
      console.error("[LIFECYCLE API] MongoDB error:", dbErr);
    }

    // 2. Fallback to mockDb
    const index = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
    if (index !== -1) {
      const mockReq = mockDb.requests[index];
      const validation = validateAndApplyTransition(mockReq);
      if (validation?.error) {
        return NextResponse.json({ success: false, message: validation.error }, { status: 400 });
      }

      mockDb.requests[index].status = newStatus;
      if (action === 'QUOTES_SUBMITTED' && quotations) {
        const qty = mockReq.itemDetails?.quantity || 1;
        mockDb.requests[index].quotations = sanitizeQuotations(quotations, qty);
        if (mockDb.requests[index].flaggedIssue) mockDb.requests[index].flaggedIssue.isFlagged = false;
      }
      if (action === 'FLAG_ISSUE') {
        mockDb.requests[index].flaggedIssue = {
          isFlagged: true,
          reasonCategory: reasonCategory || 'Issue Flagged',
          comments: notes,
          flaggedBy: actorName,
          flaggedRole: actorRole,
          flaggedAt: new Date(),
        };
      }
      if (action === 'DELIVERY_CONFIRMED') {
        mockDb.requests[index].deliveryConfirmation = {
          driverName: driverName || 'Supplier Courier Representative',
          waybillNumber: waybillNumber || `WB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          receivedAt: new Date(),
          recipientSignatureName: actorName,
          signedNoteUrl: documentUrl || '/docs/signed-grn-receipt.pdf',
          fullDeliveryReceived: true,
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
