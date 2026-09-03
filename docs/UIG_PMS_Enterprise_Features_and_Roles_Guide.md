# UIG Enterprise Procurement & Supply Chain Management System (PMS)
## Complete Features, User Roles, and Operational Governance Guide

---

## 1. Executive Summary & Core Value Proposition

The **UIG Procurement Management System (PMS)** is an enterprise-grade procurement lifecycle automation platform designed specifically for major construction, infrastructure, and technology projects across the Kingdom of Saudi Arabia. 

It unifies **Field Operations, Regional Procurement Desks, Technical Engineering HODs, Finance Controllers, and Warehouse Storekeepers** into a single, compliant, and auditable pipeline.

### Key Business Metrics Delivered:
* **100% WhatsApp-to-PR Ingestion:** Field engineers can create requisitions directly from project sites via WhatsApp voice memos or text.
* **Mandatory 3-Bid Tender Compliance:** Enforces fair market sourcing and prevents single-source favoritism.
* **Overcharge Protection via Price Baselines:** Compares bids in real-time against historical commodity price databases.
* **Strict Segregation of Duties:** Role-tailored action gates ensure no single person can request, approve, and pay for goods.
* **Instant 3-Way Matching:** Matches Purchase Order, Goods Receipt Note (GRN), and Vendor Invoice before releasing corporate wire payments via SAMA SARIE.

---

## 2. User Roles & Segregation of Duties Matrix

```
┌─────────────────────────┬──────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Role                    │ Key Persona in Demo                      │ Primary Responsibilities                               │
├─────────────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Site Initiator       │ Eng. Mohammed Al-Saud (Site Lead)        │ • Ingests PR via WhatsApp or Form with Justification   │
│                         │                                          │ • Selects preferred supplier quote                     │
│                         │                                          │ • Signs off on initial site need & delivery            │
├─────────────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. Regional Procurement │ Tariq Al-Mansoor (Central Hub Desk)      │ • Validates Approved Suppliers (CR / ZATCA VAT)        │
│    Officer              │                                          │ • Collects 3 competitive market quotations             │
│                         │                                          │ • Packages tender and routes to Technical HOD          │
├─────────────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Technical Approver   │ Lead Engineering Specialist / HOD        │ • Inspects OEM specifications, models & drawings       │
│    / HOD                │                                          │ • Verifies delivery lead time against site milestones   │
│                         │                                          │ • Signs off technical gate or flags non-compliance    │
├─────────────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. Finance Controller   │ Store Incharge / Finance Director        │ • Validates budget cap & historical price baseline     │
│                         │                                          │ • Authorizes budget & issues official Purchase Order   │
│                         │                                          │ • Executes 3-Way Match & releases SAMA SARIE payment   │
├─────────────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 5. Warehouse            │ Storekeeper / Site Inspector             │ • Unboxes freight & conducts physical count            │
│    Storekeeper          │                                          │ • Inspects for transit defects / zero-damage check     │
│                         │                                          │ • Signs and archives Goods Receipt Note (GRN)          │
├─────────────────────────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 6. Executive / Admin    │ Executive Management & PMO               │ • High-level 7-column Kanban view across KSA           │
│                         │                                          │ • Cross-regional spend analytics & vendor scorecards   │
└─────────────────────────┴──────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. The 8-Stage Procurement Workflow

```
   [1. Site Ingestion]
   WhatsApp / Web Form + Mandatory Business Need Document
           │
           ▼
   [2. 3-Bid Tender Sourcing]
   Procurement collects 3 quotes from Approved KSA Suppliers
           │
           ▼
   [3. Technical HOD Gate]
   Engineering certifies OEM specs & warranty SLA (or Flags Issue)
           │
           ▼
   [4. Finance & Baseline Gate]
   Validates budget cap & historical variance % (or Returns to Tender)
           │
           ▼
   [5. Purchase Order (PO) Dispatch]
   Formal PO issued to vendor with 15% ZATCA VAT terms
           │
           ▼
   [6. Freight Transit & Site Delivery]
   Supplier ships materials to regional project depot
           │
           ▼
   [7. Physical Inspection & Signed GRN]
   Storekeeper verifies 100% quantity & uploads signed receipt
           │
           ▼
   [8. 3-Way Match & SAMA SARIE Settlement]
   Finance reconciles PO + GRN + Invoice; releases instant wire
```

---

## 4. Comprehensive Feature Catalog

### 1. Dual Ingestion Channel (WhatsApp AI + Enterprise Form)
* **WhatsApp NLP Simulator:** Simulates a site engineer sending voice or text memos from site. Automatically extracts:
  * Item Name & Technical Category
  * Required Quantity & Unit
  * Target Project City (Riyadh, Jeddah, Dammam)
  * Urgency & Deadline
* **Mandatory Business Justification Document:** Enforces formal compliance requirements:
  * **Requisition Subject / Scope**
  * **Statement of Need & Quantity Justification** (*e.g., "500 helmets required for newly onboarded underground tunneling crew"*).
  * **Milestone Dependency** (*e.g., "Critical path for Tuesday tunnel boring inspection"*).
  * **Impact If Not Approved** (*e.g., "Site work stoppage and 25,000 SAR/day client delay fines"*).

### 2. Multi-Vendor 3-Bid Tender Collector & Matrix
* **Dynamic Tender Editor:** Allows procurement officers to add, edit, and compare vendor quotations (Supplier Name, Total Price, Lead Time Days, Warranty SLA, Spec Text).
* **Automated Badging:**
  * 🏷️ **Best Price:** Highlights the lowest competitive bid.
  * ⚡ **Fastest Delivery:** Highlights the fastest fulfillment lead time.
* **Approved Supplier Directory:** Integrated vendor database with **10-digit Commercial Registration (CR)** and **15-digit ZATCA VAT** validation.

### 3. "Flag Issue & Revert Stage" Governance Mechanism
Approvers have the authority to halt non-compliant requisitions and revert them back with structured feedback:
* **Technical Rejection Reasons:**
  * *Substandard OEM Specifications / Wrong Model*
  * *Delivery Lead Time Too Slow (Exceeds Project Deadline)*
  * *Inadequate Warranty / Missing 24-Month SLA*
  * *Alternative Certified Brand Required*
* **Finance Rejection Reasons:**
  * *Price Variance Exceeds Baseline (Over 15% Baseline)*
  * *Exceeds Project Allocated Budget Cap*
  * *Unacceptable Payment Terms (100% advance rejected)*
* **Site Delivery Defect Reasons:**
  * *Transit Damage / Missing Site Quantity*
  * *Delivered Model Discrepancy*
* **Visual Reversion Alert:** Injects a prominent **Red Attention Banner** on the ticket, notifying the procurement officer of the exact defect and required revisions.

### 4. Historical Price Baseline & Variance Diagnostics
* Automatically calculates historical average price baselines for commodities (e.g., helmets, concrete, switches).
* Computes real-time **Variance %**:
  * 🟢 **Cost Savings Badge:** Displays when a tender bid is below historical benchmark (*e.g., -6.0% Cost Savings*).
  * 🟡 **Within Tolerance Badge:** Displays when tender is slightly above baseline but within budget.
  * 🔴 **Overcharge Flag:** Warns Finance if variance exceeds 15%.

### 5. Official Purchase Order (PO) Generator
* Produces standard printable purchase orders with:
  * Corporate header & ZATCA Tax ID
  * Vendor details & Site delivery address
  * Line-item quantities & unit rates
  * 15% ZATCA VAT calculation
  * Contractual Net-30 payment terms

### 6. Goods Receipt Note (GRN) & 3-Way Match Settlement
* **Physical Receiving:** Storekeeper checks physical quantities and passes inspection.
* **3-Way Match Verification:** Automated reconciliation ensuring:
  $$\text{Purchase Order (PO)} == \text{Goods Receipt Note (GRN)} == \text{Vendor Invoice}$$
* **SAMA SARIE Wire Settlement:** Generates official Saudi Central Bank wire transfer reference numbers (`TXN-SAMA-XXXXXX`) and closes the requisition.

### 7. Executive Spend Analytics & PMO Dashboards
* Real-time breakdown by **Purchase Category** (*Industrial, IT Hardware, Building Materials, Furniture*).
* Real-time tracking of **Regional Sourcing Distribution** across Riyadh, Jeddah, and Eastern Province.
* **Supplier Performance Scorecards** tracking delivery on-time rate and defect ratios.
* **Tamper-Proof Audit Trail:** Timestamped chronological history recording every actor, role, status transition, and notes.

---

## 5. Saudi Compliance Architecture

* **ZATCA Phase 2 E-Invoicing Ready:** Computes statutory 15% Value Added Tax with compliant line-item structures.
* **Ministry of Commerce (MoC) Verification:** Requires 10-digit Commercial Registration numbers on all onboarded suppliers.
* **SAMA SARIE Integration:** Standardized for Saudi Central Bank instant corporate wire payment execution.
* **Local Content & Monsha'at Sourcing:** Designed to track and prioritize local Saudi vendor quotas.

---

*Document Version: 1.0 (Enterprise Demo Ready)*  
*Prepared for: UIG Corporate Procurement & Executive Leadership*
