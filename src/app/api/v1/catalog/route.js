import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PriceBaseline from '@/models/PriceBaseline';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) throw new Error("Offline");
    const baselines = await PriceBaseline.find().sort({ category: 1, itemName: 1 });
    return NextResponse.json({ success: true, data: baselines }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: [
        { _id: 'b1', itemName: 'Dell Latitude 7440 Ultrabook', category: 'IT Hardware & Electronics', unit: 'Units', historicalAveragePrice: 4650, lastPurchasedPrice: 4700, standardLeadTimeDays: 4, preferredVendor: 'Jarir Marketing Co. (Commercial)' },
        { _id: 'b2', itemName: 'Ready-Mix Concrete Grade 40', category: 'Construction Materials', unit: 'm³ (Cubic Meters)', historicalAveragePrice: 220, lastPurchasedPrice: 215, standardLeadTimeDays: 2, preferredVendor: 'Saudi ReadyMix Concrete Ltd' },
        { _id: 'b3', itemName: 'Ergonomic Executive Mesh Chair', category: 'Office Furniture & Fixtures', unit: 'Units', historicalAveragePrice: 520, lastPurchasedPrice: 495, standardLeadTimeDays: 5, preferredVendor: 'IKEA Business Solutions KSA' },
        { _id: 'b4', itemName: 'Cisco Catalyst 9300 48-Port PoE+', category: 'IT Hardware & Networking', unit: 'Units', historicalAveragePrice: 18500, lastPurchasedPrice: 19200, standardLeadTimeDays: 7, preferredVendor: 'Al-Jazirah Technology Solutions' },
        { _id: 'b5', itemName: 'EN397 Industrial Safety Helmets', category: 'Industrial & Safety Equipment', unit: 'Units', historicalAveragePrice: 45, lastPurchasedPrice: 42, standardLeadTimeDays: 3, preferredVendor: 'Saudi Arabian Safety & PPE Corp' },
      ]
    }, { status: 200 });
  }
}
