import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import PriceBaseline from '@/models/PriceBaseline';
import { mockDb } from '@/lib/mockDb';
import { generatePurchaseOrderData } from '@/lib/generatePurchaseOrder';

export async function POST(req, context) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const allowedRoles = ['Store Incharge', 'Finance Controller', 'Finance', 'Admin'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges for finance review' }, { status: 403 });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const reqIdx = pathParts.indexOf('requests');
    const idFromUrl = reqIdx !== -1 ? pathParts[reqIdx + 1] : null;

    const resolvedParams = await context?.params;
    const rawId = resolvedParams?.id || idFromUrl;
    const id = decodeURIComponent(rawId || '');

    const body = await req.json();
    const { isApproved, notes, overrideBudgetCap } = body;

    const newStatus = isApproved ? 'PO_Generated' : 'Rejected_Job';
    const timelineEntry = {
      stage: newStatus,
      status: newStatus,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      notes: notes || (isApproved ? 'Finance approved, PO generated' : 'Finance rejected'),
      actor: session.user.name || session.user.username || 'Finance Controller',
      role: session.user.role || 'Store Incharge',
    };

    try {
      const conn = await dbConnect();
      if (conn) {
        const findQuery = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { ticketId: id }, { ticketId: id.toUpperCase() }] } : { $or: [{ ticketId: id }, { ticketId: id.toUpperCase() }] };
        const request = await ProcurementRequest.findOne(findQuery);
        
        if (request) {
          // State transition check (Issue 4)
          const allowedPredecessors = ['Technical_Approval', 'Finance_Review'];
          if (!allowedPredecessors.includes(request.status)) {
            return NextResponse.json({
              success: false,
              message: `Invalid state transition: Finance review requires prior Technical_Approval, current status is '${request.status}'`,
            }, { status: 400 });
          }

          // Overcharge protection & baseline variance check (Issue 8)
          const chosenQuote = request.quotations?.find(q => q.isChosen) || request.quotations?.[0];
          const quotedTotal = chosenQuote?.totalPrice || 0;
          const quantity = request.itemDetails?.quantity || 1;

          let baselineUnitPrice = request.itemDetails?.targetPrice || 200;
          try {
            const baselineDoc = await PriceBaseline.findOne({
              $or: [
                { itemName: new RegExp(request.itemDetails?.name, 'i') },
                { category: request.itemDetails?.category }
              ]
            });
            if (baselineDoc?.historicalAveragePrice) {
              baselineUnitPrice = baselineDoc.historicalAveragePrice;
            }
          } catch (err) {
            console.warn('Could not query PriceBaseline:', err);
          }

          const totalBaseline = baselineUnitPrice * quantity;
          const varianceAmount = quotedTotal - totalBaseline;
          const variancePercentage = totalBaseline > 0 ? Number(((varianceAmount / totalBaseline) * 100).toFixed(1)) : 0;
          const isWithinBudget = quotedTotal <= (request.project?.allocatedBudget || totalBaseline);

          if (isApproved && variancePercentage > 15 && !overrideBudgetCap) {
            return NextResponse.json({
              success: false,
              message: `Overcharge Alert: Quoted price exceeds historical baseline by +${variancePercentage}% (threshold: 15%). Set overrideBudgetCap=true to bypass.`,
              variancePercentage,
              totalBaseline,
              quotedTotal,
            }, { status: 400 });
          }

          request.financeReview = {
            isApproved,
            reviewedBy: session.user.name || 'Finance Controller',
            comments: notes || '',
            allocatedBudget: request.project?.allocatedBudget || 350000,
            baselinePrice: totalBaseline,
            variancePercentage,
            isWithinBudget,
            reviewedAt: new Date(),
          };
          
          request.status = newStatus;
          if (isApproved) {
            if (request.flaggedIssue) {
              request.flaggedIssue.isFlagged = false;
            } else {
              request.flaggedIssue = { isFlagged: false };
            }
          }
          if (!request.timeline) request.timeline = [];
          request.timeline.push(timelineEntry);
          
          if (isApproved && !request.purchaseOrder?.poNumber) {
            request.purchaseOrder = generatePurchaseOrderData(request.purchaseOrder);
          }
          await request.save();
          const mIdx = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
          if (mIdx !== -1) {
            mockDb.requests[mIdx] = request.toObject ? request.toObject() : request;
          }
          return NextResponse.json({ success: true, data: request }, { status: 200 });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB unavailable in finance-review, falling back to mockDb:", dbErr);
    }

    // Fallback to mockDb
    const index = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
    if (index === -1) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      
    const reqDoc = mockDb.requests[index];
    const allowedPredecessors = ['Technical_Approval', 'Finance_Review'];
    if (!allowedPredecessors.includes(reqDoc.status)) {
      return NextResponse.json({
        success: false,
        message: `Invalid state transition: Finance review requires prior Technical_Approval, current status is '${reqDoc.status}'`,
      }, { status: 400 });
    }

    const chosenQuote = reqDoc.quotations?.find(q => q.isChosen) || reqDoc.quotations?.[0];
    const quotedTotal = chosenQuote?.totalPrice || 0;
    const quantity = reqDoc.itemDetails?.quantity || 1;
    const baselineUnitPrice = reqDoc.itemDetails?.targetPrice || 200;
    const totalBaseline = baselineUnitPrice * quantity;
    const varianceAmount = quotedTotal - totalBaseline;
    const variancePercentage = totalBaseline > 0 ? Number(((varianceAmount / totalBaseline) * 100).toFixed(1)) : 0;
    const isWithinBudget = quotedTotal <= (reqDoc.project?.allocatedBudget || totalBaseline);

    if (isApproved && variancePercentage > 15 && !overrideBudgetCap) {
      return NextResponse.json({
        success: false,
        message: `Overcharge Alert: Quoted price exceeds historical baseline by +${variancePercentage}% (threshold: 15%). Set overrideBudgetCap=true to bypass.`,
        variancePercentage,
        totalBaseline,
        quotedTotal,
      }, { status: 400 });
    }

    mockDb.requests[index].financeReview = {
      isApproved,
      reviewedBy: session.user.name || 'Finance Controller',
      comments: notes || '',
      allocatedBudget: reqDoc.project?.allocatedBudget || 350000,
      baselinePrice: totalBaseline,
      variancePercentage,
      isWithinBudget,
      reviewedAt: new Date(),
    };

    if (isApproved && !mockDb.requests[index].purchaseOrder?.poNumber) {
      mockDb.requests[index].purchaseOrder = generatePurchaseOrderData(mockDb.requests[index].purchaseOrder);
    }

    mockDb.requests[index].status = newStatus;
    if (isApproved) {
      if (mockDb.requests[index].flaggedIssue) {
        mockDb.requests[index].flaggedIssue.isFlagged = false;
      } else {
        mockDb.requests[index].flaggedIssue = { isFlagged: false };
      }
    }
    mockDb.requests[index].timeline.push(timelineEntry);
    return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
  } catch (error) {
    console.error('Finance review error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
