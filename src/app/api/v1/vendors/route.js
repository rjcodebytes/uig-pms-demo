import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { mockDb } from '@/lib/mockDb';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) throw new Error("Offline");
    const vendors = await Vendor.find().sort({ rating: -1, totalSpendSAR: -1 });
    return NextResponse.json({ success: true, data: vendors }, { status: 200 });
  } catch (error) {
    console.warn("MongoDB unavailable in GET vendors, serving mockDb");
    return NextResponse.json({
      success: true,
      data: mockDb.vendors || [],
    }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const allowedRoles = ['Admin', 'Procurement', 'Store Incharge'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges to onboard vendors' }, { status: 403 });
    }

    const body = await req.json();

    // Validation (Issue 9): Required fields and CR / VAT format checks
    if (!body?.vendorName || typeof body.vendorName !== 'string' || !body.vendorName.trim()) {
      return NextResponse.json({ success: false, message: 'Vendor name is required' }, { status: 400 });
    }

    const crRegex = /^\d{10}$/;
    if (!body.crNumber || !crRegex.test(String(body.crNumber).trim())) {
      return NextResponse.json({
        success: false,
        message: 'Invalid Commercial Registration (CR) number: Must be exactly 10 digits (e.g. 1010012214)',
      }, { status: 400 });
    }

    const vatRegex = /^\d{15}$/;
    if (!body.vatNumber || !vatRegex.test(String(body.vatNumber).trim())) {
      return NextResponse.json({
        success: false,
        message: 'Invalid ZATCA VAT number: Must be exactly 15 digits (e.g. 300000584700003)',
      }, { status: 400 });
    }

    const vendorPayload = {
      vendorName: body.vendorName.trim(),
      category: body.category || 'General Supplies',
      crNumber: String(body.crNumber).trim(),
      vatNumber: String(body.vatNumber).trim(),
      rating: body.rating !== undefined ? Number(body.rating) : 4.8,
      status: body.status || 'Approved',
      contactPerson: body.contactPerson || 'Commercial Desk',
      email: body.email || 'sales@vendor.sa',
      phone: body.phone || '+966 11 000 0000',
      city: body.city || 'Riyadh',
      totalSpendSAR: 0,
      completedOrders: 0,
      avgDeliveryDays: body.avgDeliveryDays !== undefined ? Number(body.avgDeliveryDays) : 3,
    };

    // Database path with fallback (Issue 6)
    try {
      const conn = await dbConnect();
      if (!conn) throw new Error('MongoDB is offline');
      const newVendor = await Vendor.create(vendorPayload);
      return NextResponse.json({ success: true, data: newVendor }, { status: 201 });
    } catch (dbErr) {
      console.warn("MongoDB unavailable in POST vendors, saving to mockDb:", dbErr);
      const mockVendor = {
        ...vendorPayload,
        _id: `v_${Math.random().toString(36).substr(2, 9)}`,
      };
      if (!mockDb.vendors) mockDb.vendors = [];
      mockDb.vendors.push(mockVendor);
      return NextResponse.json({ success: true, data: mockVendor }, { status: 201 });
    }
  } catch (error) {
    console.error('Vendor creation error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
