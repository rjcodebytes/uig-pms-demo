import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProcurementRequest from '@/models/ProcurementRequest';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'all';

    let data = {};

    try {
      const conn = await dbConnect();
      if (!conn) throw new Error("Offline");
    } catch (dbErr) {
      console.warn("MongoDB unavailable, serving mock static analytics.");
      return NextResponse.json({ success: true, data: {
        spendByVendor: [
          { _id: 'Jarir Business', totalSpend: 150000, requestCount: 3 },
          { _id: 'Saudi ReadyMix', totalSpend: 210000, requestCount: 1 },
          { _id: 'IKEA Business', totalSpend: 9500, requestCount: 2 }
        ],
        categoryVolume: [
          { _id: 'IT Hardware', totalSpend: 150000, volume: 30 },
          { _id: 'Construction Materials', totalSpend: 210000, volume: 1000 },
          { _id: 'Furniture', totalSpend: 9500, volume: 20 }
        ],
        operationalDelays: [
          { _id: 'Jarir Business', avgVarianceDays: 1.5, deliveries: 2 },
          { _id: 'Saudi ReadyMix', avgVarianceDays: 0, deliveries: 1 },
          { _id: 'IKEA Business', avgVarianceDays: 3.2, deliveries: 2 }
        ]
      } }, { status: 200 });
    }

    // 1. Spend by Vendor Pipeline
    if (type === 'spend-by-vendor' || type === 'all') {
      data.spendByVendor = await ProcurementRequest.aggregate([
        { $match: { status: { $in: ['PO_Generated', 'Delivery_Pending', 'Completed'] } } },
        { $unwind: "$quotations" },
        { $match: { "quotations.isChosen": true } },
        { 
          $group: { 
            _id: "$quotations.vendorName", 
            totalSpend: { $sum: "$quotations.totalPrice" },
            requestCount: { $sum: 1 }
          } 
        },
        { $sort: { totalSpend: -1 } }
      ]);
    }

    // 2. Category Volume Pipeline
    if (type === 'category-volume' || type === 'all') {
      data.categoryVolume = await ProcurementRequest.aggregate([
        { $match: { status: { $in: ['PO_Generated', 'Delivery_Pending', 'Completed'] } } },
        { $unwind: "$quotations" },
        { $match: { "quotations.isChosen": true } },
        { 
          $group: { 
            _id: "$itemDetails.category", 
            totalSpend: { $sum: "$quotations.totalPrice" },
            volume: { $sum: "$itemDetails.quantity" }
          } 
        },
        { $sort: { totalSpend: -1 } }
      ]);
    }

    // 3. Operational Delay Diagnostics
    if (type === 'operational-delays' || type === 'all') {
      data.operationalDelays = await ProcurementRequest.aggregate([
        { $match: { status: 'Completed', "deliveryConfirmation.receivedAt": { $exists: true } } },
        { $unwind: "$quotations" },
        { $match: { "quotations.isChosen": true } },
        {
          $project: {
            vendorName: "$quotations.vendorName",
            leadTimeDays: "$quotations.leadTimeDays",
            poGeneratedAt: "$purchaseOrder.generatedAt",
            receivedAt: "$deliveryConfirmation.receivedAt",
            // Calculate difference in milliseconds, convert to days
            actualDaysTaken: {
              $divide: [
                { $subtract: ["$deliveryConfirmation.receivedAt", "$purchaseOrder.generatedAt"] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $project: {
            vendorName: 1,
            leadTimeDays: 1,
            actualDaysTaken: 1,
            varianceDays: { $subtract: ["$actualDaysTaken", "$leadTimeDays"] }
          }
        },
        {
          $group: {
            _id: "$vendorName",
            avgVarianceDays: { $avg: "$varianceDays" },
            deliveries: { $sum: 1 }
          }
        },
        { $sort: { avgVarianceDays: -1 } }
      ]);
    }
    
    // 4. Global Lifecycle Tracker lookup (if ticketId is passed)
    const ticketId = url.searchParams.get('ticketId');
    if (ticketId) {
      data.lifecycle = await ProcurementRequest.findOne({ ticketId });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
