import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';
import PriceBaseline from '@/models/PriceBaseline';

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const payload = await req.json(); // { isApproved, reviewedBy, comments }

    const request = await ProcurementRequest.findOne({ ticketId: id });
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'Technical_Approval') {
      return NextResponse.json({ error: 'Invalid state transition. Must be in Technical_Approval.' }, { status: 400 });
    }

    // Process Finance Reject
    if (!payload.isApproved) {
      if (!payload.comments) {
        return NextResponse.json({ error: 'Comments are mandatory for rejection.' }, { status: 400 });
      }

      request.financeReview = {
        isApproved: false,
        reviewedBy: payload.reviewedBy || 'Finance Officer',
        comments: payload.comments,
        reviewedAt: new Date(),
      };
      
      // Rollback loop: reset status, leave technicalApproval intact for edit
      request.status = 'Quotation_Collection';
      await request.save();
      
      return NextResponse.json({ success: true, data: request, message: 'Request rolled back for alternative quotations.' }, { status: 200 });
    }

    // Process Finance Approval (Analytics)
    const chosenQuote = request.quotations.find(q => q.isChosen);
    if (!chosenQuote) {
      return NextResponse.json({ error: 'No quotation was chosen during technical approval.' }, { status: 400 });
    }

    const unitPrice = chosenQuote.totalPrice / request.itemDetails.quantity;
    
    // Check Baseline
    const baseline = await PriceBaseline.findOne({ 
      itemName: new RegExp(request.itemDetails.name, 'i') 
    }) || await PriceBaseline.findOne({ 
      category: request.itemDetails.category 
    });

    let varianceDetected = false;
    if (baseline) {
      const threshold = baseline.historicalAveragePrice * 1.1; // 10% threshold
      if (unitPrice > threshold) {
        varianceDetected = true;
      }
    }

    request.financeReview = {
      isApproved: true,
      reviewedBy: payload.reviewedBy || 'Finance Officer',
      varianceDetected,
      reviewedAt: new Date(),
    };

    // Transition to PO generation logic
    request.status = 'PO_Generated';
    request.purchaseOrder = {
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      generatedAt: new Date(),
      vendorSentConfirmation: true, // Simulating external dispatch
    };

    await request.save();

    return NextResponse.json({ 
      success: true, 
      data: request, 
      budgetMargin: request.project.allocatedBudget - chosenQuote.totalPrice 
    }, { status: 200 });

  } catch (error) {
    console.error('Finance review error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
