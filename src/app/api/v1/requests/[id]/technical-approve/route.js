import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import { mockDb } from '@/lib/mockDb';

export async function POST(req, context) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const allowedRoles = ['Approver', 'Technical Approver', 'Admin'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges for technical approval' }, { status: 403 });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const reqIdx = pathParts.indexOf('requests');
    const idFromUrl = reqIdx !== -1 ? pathParts[reqIdx + 1] : null;

    const resolvedParams = await context?.params;
    const rawId = resolvedParams?.id || idFromUrl;
    const id = decodeURIComponent(rawId || '');

    const { isApproved, notes } = await req.json();

    const newStatus = isApproved ? 'Finance_Review' : 'Rejected_Job';
    const timelineEntry = {
      stage: newStatus,
      status: newStatus,
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      notes: notes || (isApproved ? 'Technically approved specifications' : 'Technically rejected specifications'),
      actor: session.user.name || session.user.username || 'Technical Approver',
      role: session.user.role || 'Approver',
    };

    try {
      const conn = await dbConnect();
      if (conn) {
        const findQuery = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { ticketId: id }, { ticketId: id.toUpperCase() }] } : { $or: [{ ticketId: id }, { ticketId: id.toUpperCase() }] };
        const request = await ProcurementRequest.findOne(findQuery);
        
        if (request) {
          // Validate predecessor state
          const allowedPredecessors = ['Incoming', 'Quotation_Collection', 'Technical_Approval'];
          if (!allowedPredecessors.includes(request.status)) {
            return NextResponse.json({
              success: false,
              message: `Invalid state transition: Cannot technically approve from '${request.status}'`,
            }, { status: 400 });
          }

          if (!request.quotations || request.quotations.length === 0) {
            return NextResponse.json({
              success: false,
              message: 'Cannot perform technical approval: Quotations must be submitted first',
            }, { status: 400 });
          }
          
          request.technicalApproval = {
            isApproved,
            reviewedBy: session.user.name || session.user.username || 'Technical Approver',
            reviewerRole: session.user.role || 'Approver',
            comments: notes || (isApproved ? 'Technically approved specifications' : 'Technically rejected specifications'),
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
          await request.save();
          const mIdx = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
          if (mIdx !== -1) {
            mockDb.requests[mIdx] = request.toObject ? request.toObject() : request;
          }
          return NextResponse.json({ success: true, data: request }, { status: 200 });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB unavailable in technical-approve, falling back to mockDb:", dbErr);
    }

    // Fallback to mockDb
    const index = mockDb.requests.findIndex(r => r._id === id || r.ticketId === id || r.ticketId === id.toUpperCase());
    if (index !== -1) {
      const reqDoc = mockDb.requests[index];
      const allowedPredecessors = ['Incoming', 'Quotation_Collection', 'Technical_Approval'];
      if (!allowedPredecessors.includes(reqDoc.status)) {
        return NextResponse.json({
          success: false,
          message: `Invalid state transition: Cannot technically approve from '${reqDoc.status}'`,
        }, { status: 400 });
      }

      if (!reqDoc.quotations || reqDoc.quotations.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Cannot perform technical approval: Quotations must be submitted first',
        }, { status: 400 });
      }

      mockDb.requests[index].technicalApproval = {
        isApproved,
        reviewedBy: session.user.name || session.user.username || 'Technical Approver',
        reviewerRole: session.user.role || 'Approver',
        comments: notes || (isApproved ? 'Technically approved specifications' : 'Technically rejected specifications'),
        reviewedAt: new Date(),
      };

      mockDb.requests[index].status = newStatus;
      if (isApproved) {
        if (mockDb.requests[index].flaggedIssue) {
          mockDb.requests[index].flaggedIssue.isFlagged = false;
        } else {
          mockDb.requests[index].flaggedIssue = { isFlagged: false };
        }
      }
      if (!mockDb.requests[index].timeline) mockDb.requests[index].timeline = [];
      mockDb.requests[index].timeline.push(timelineEntry);
      return NextResponse.json({ success: true, data: mockDb.requests[index] }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: `Ticket not found for ID: ${id}` }, { status: 404 });
  } catch (error) {
    console.error('Technical approve error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
