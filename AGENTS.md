# UIG Procurement Management System (PMS) — Agent Guide

## Architecture Overview
- **Framework**: Next.js 16 App Router with React 19 and Tailwind CSS.
- **Database**: MongoDB via Mongoose (`src/lib/mongodb.js`), with automatic graceful fallback to persistent in-memory mock store (`src/lib/mockDb.js`) when MongoDB is offline.
- **Authentication**: NextAuth.js v5 (`src/lib/auth.js`, `src/auth.config.js`) with JWT session strategy and role-based access control.
- **Roles in System**:
  - `Admin`: Full system-wide access across all workflows.
  - `Initiator`: Site Engineer / Requester (creates requisitions via WhatsApp/Form, signs site deliveries).
  - `Approver`: Technical Specialist / HOD (verifies technical OEM compliance and specs).
  - `Store Incharge`: Finance Controller (budget validation, price baseline overcharge check, PO issuance, 3-way match payment).
  - `Store Keeper`: Warehouse Receiver (physical goods inspection and GRN sign-off).
- **Core Models**:
  - `ProcurementRequest`: Requisition lifecycle from Incoming -> Quotation_Collection -> Technical_Approval -> Finance_Review -> PO_Generated -> Delivery_Pending -> Completed.
  - `PriceBaseline`: Historical commodity unit benchmarks for overcharge protection.
  - `Vendor`: Verified KSA suppliers with 10-digit CR and 15-digit ZATCA VAT numbers.
