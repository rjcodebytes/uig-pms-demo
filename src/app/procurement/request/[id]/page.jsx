'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  MapPin,
  FileText,
  UploadCloud,
  Check,
  Truck,
  DollarSign,
  AlertTriangle,
  Receipt,
  FileCheck2,
  Printer,
  ShieldCheck,
  UserCheck,
  TrendingDown,
  TrendingUp,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Lock,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  AlertOctagon,
  RotateCcw,
  X
} from 'lucide-react';
import QuotationComparison from '@/components/procurement/QuotationComparison';

export default function RequestDetailsPage({ params }) {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'Admin';

  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow' | 'po_preview' | 'audit_trail'
  const [statusMessage, setStatusMessage] = useState('');

  // Flag Issue Modal State
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagTargetStage, setFlagTargetStage] = useState('Quotation_Collection');
  const [flagReasonCategory, setFlagReasonCategory] = useState('Technical Specification Issue');
  const [flagNotes, setFlagNotes] = useState('');

  // Editable 3-Bid Quotations List
  const [quotes, setQuotes] = useState([
    {
      vendorName: 'Jarir Marketing Co. (Commercial)',
      totalPrice: 47000,
      unitPrice: 4700,
      leadTimeDays: 3,
      specificationsText: 'Official Dell KSA Authorized Stock, 3-Yr ProSupport Plus Onsite Next Business Day.',
      warrantyTerms: '36 Months ProSupport',
      isChosen: true,
      quotationDocUrl: '/docs/quote-jarir.pdf'
    },
    {
      vendorName: 'Al-Jazirah Technology Solutions',
      totalPrice: 48500,
      unitPrice: 4850,
      leadTimeDays: 5,
      specificationsText: 'Dell OEM specification with standard local distributor warranty.',
      warrantyTerms: '36 Months Standard',
      isChosen: false,
      quotationDocUrl: '/docs/quote-aljazirah.pdf'
    },
    {
      vendorName: 'Saudi Modern Electronics',
      totalPrice: 49800,
      unitPrice: 4980,
      leadTimeDays: 4,
      specificationsText: 'Commercial business equipment with 2-year standard parts replacement.',
      warrantyTerms: '24 Months Standard',
      isChosen: false,
      quotationDocUrl: '/docs/quote-sme.pdf'
    }
  ]);

  const approvedVendorsList = [
    'Jarir Marketing Co. (Commercial)',
    'Saudi ReadyMix Concrete Co.',
    'Al-Jazirah Technology Solutions',
    'IKEA Business KSA',
    'Saudi Safety Corp Industrial',
    'Middle East Engineering Supplies',
    'Gulf Building Materials'
  ];

  const [receiverName, setReceiverName] = useState('Eng. Mohammed Al-Saud (Site Lead)');

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/requests/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setRequest(data.data);
        if (data.data.quotations && data.data.quotations.length > 0) {
          setQuotes(data.data.quotations);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRequestDetails();
  }, [id]);

  // Handle generic lifecycle transitions
  const handleAction = async (actionPath, payload = {}) => {
    try {
      setActionLoading(true);
      setStatusMessage('');
      const targetId = request?._id || id;
      const res = await fetch(`/api/v1/requests/${targetId}/${actionPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRequest(data.data);
        setStatusMessage('✓ Action completed successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit collected 3 quotations to start technical review
  const submitQuotations = async () => {
    try {
      setActionLoading(true);
      setStatusMessage('');
      const targetId = request?._id || id;
      const res = await fetch(`/api/v1/requests/${targetId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'QUOTES_SUBMITTED',
          quotations: quotes,
          notes: `Submitted ${quotes.length} verified competitive market quotations for engineering review.`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRequest(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Flag Issue Modal
  const openFlagModal = (targetStage, defaultCategory) => {
    setFlagTargetStage(targetStage);
    setFlagReasonCategory(defaultCategory);
    setFlagNotes('');
    setFlagModalOpen(true);
  };

  // Execute Flag Issue / Revert
  const handleExecuteFlagIssue = async () => {
    if (!flagNotes.trim()) {
      alert('Please enter feedback notes describing the defect or revision required.');
      return;
    }

    setActionLoading(true);
    try {
      const targetId = request?._id || id;
      const res = await fetch(`/api/v1/requests/${targetId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'FLAG_ISSUE',
          targetStage: flagTargetStage,
          currentStage: request.status,
          reasonCategory: flagReasonCategory,
          notes: flagNotes,
          flaggedBy: session?.user?.name || `${userRole} Officer`,
          flaggedRole: userRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRequest(data.data);
      }
      setFlagModalOpen(false);
      setStatusMessage(`⚠️ Issue flagged: Requisition reverted to ${flagTargetStage.replace(/_/g, ' ')}`);
      setTimeout(() => setStatusMessage(''), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Update specific bid field
  const handleUpdateBid = (index, field, value) => {
    const updated = [...quotes];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'totalPrice') {
      const qty = request?.itemDetails?.quantity || 1;
      updated[index].unitPrice = Number(value) / qty;
    }
    setQuotes(updated);
  };

  // Add new bid
  const handleAddBid = () => {
    setQuotes([
      ...quotes,
      {
        vendorName: 'Middle East Engineering Supplies',
        totalPrice: 51000,
        unitPrice: 5100,
        leadTimeDays: 7,
        specificationsText: 'Alternative compliant supplier quotation with 24-month warranty.',
        warrantyTerms: '24 Months Standard',
        isChosen: false,
        quotationDocUrl: '/docs/quote-new.pdf'
      }
    ]);
  };

  // Switch chosen vendor
  const handleSelectVendor = (vendorName) => {
    if (request?.quotations) {
      const updated = request.quotations.map((q) => ({
        ...q,
        isChosen: q.vendorName === vendorName,
      }));
      setRequest({ ...request, quotations: updated });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading procurement ticket lifecycle...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="corp-card max-w-md mx-auto p-8">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Procurement Ticket Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">The requested ticket ID does not exist or was deleted.</p>
          <Link
            href="/procurement/dashboard"
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Pipeline Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  // 8-Stage Progress Definitions
  const stages = [
    { key: 'Incoming', label: '1. Requisition', sub: 'Site Ingested' },
    { key: 'Quotation_Collection', label: '2. 3-Bid Quotes', sub: 'Tender Sourcing' },
    { key: 'Technical_Approval', label: '3. Tech Sign-off', sub: 'HOD Verification' },
    { key: 'Finance_Review', label: '4. Finance Review', sub: 'Budget & Baseline' },
    { key: 'PO_Generated', label: '5. PO Dispatched', sub: 'Vendor Fulfillment' },
    { key: 'Delivery_Pending', label: '6. Site GRN', sub: 'Goods Inspected' },
    { key: 'Completed', label: '7. 3-Way Settled', sub: 'Payment Closed' },
  ];

  const currentStageIdx = stages.findIndex((s) => s.key === request.status);
  const currentQuotations = request.quotations?.length > 0 ? request.quotations : quotes;
  const chosenQuote = currentQuotations.find((q) => q.isChosen) || currentQuotations[0];

  // Price baseline calculations
  const baselinePrice = (request.itemDetails?.quantity || 1) * (request.itemDetails?.targetPrice || 200);
  const allocatedBudget = request.project?.allocatedBudget || 350000;
  const varianceAmount = chosenQuote ? chosenQuote.totalPrice - baselinePrice : 0;
  const variancePct = baselinePrice ? ((varianceAmount / baselinePrice) * 100).toFixed(1) : 0;
  const isSavings = varianceAmount <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/procurement/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-blue-700 flex items-center transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-blue-700">{request.ticketId}</span>
            <span className="text-slate-300">/</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              request.flaggedIssue?.isFlagged ? 'bg-rose-100 text-rose-800 border-rose-300' :
              request.status === 'Completed' ? 'badge-success' :
              request.status.includes('Approval') || request.status.includes('Review') ? 'badge-warning' :
              'badge-primary'
            }`}>
              ● {request.flaggedIssue?.isFlagged ? 'Issue Flagged / Revision' : request.status.replace(/_/g, ' ')}
            </span>
            <span className="badge-slate">
              Priority: <span className="font-bold ml-1">{request.priority || 'Medium'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
            <span className="font-semibold text-slate-700">{request.project?.projectName}</span>
            <span>•</span>
            <span className="flex items-center text-slate-600">
              <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" /> {request.location}
            </span>
            <span>•</span>
            <span className="text-blue-700 font-medium">Assigned to: {request.assignedTo?.name || 'Central Desk'}</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'workflow' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Workflow
          </button>
          <button
            onClick={() => setActiveTab('po_preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'po_preview' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Official PO Document
          </button>
          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'audit_trail' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail ({request.timeline?.length || 0})
          </button>
        </div>
      </div>

      {/* Prominent Flagged Issue Banner (If Issue Was Flagged) */}
      {request.flaggedIssue?.isFlagged && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-5 shadow-sm space-y-2 animate-in fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="badge-danger font-extrabold text-[10px]">⚠️ ACTION REQUIRED: ISSUE FLAGGED</span>
                  <span className="text-xs text-rose-700 font-semibold">
                    Flagged by: <strong>{request.flaggedIssue.flaggedBy}</strong> ({request.flaggedIssue.flaggedRole})
                  </span>
                </div>
                <h3 className="font-black text-rose-950 text-base mt-1">
                  Reason: {request.flaggedIssue.reasonCategory}
                </h3>
                <p className="text-xs text-rose-900/90 mt-1 bg-white/70 p-2.5 rounded-xl border border-rose-200 font-medium leading-relaxed">
                  "{request.flaggedIssue.comments}"
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center space-x-2">
              <span className="text-[11px] font-bold text-rose-700">Reverted to Sourcing</span>
            </div>
          </div>
        </div>
      )}

      {/* 8-Stage Visual Progress Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] relative">
          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0"></div>
          <div
            className="absolute top-4 left-6 h-1 bg-blue-600 transition-all duration-500 -z-0"
            style={{ width: `${(currentStageIdx / (stages.length - 1)) * 95}%` }}
          ></div>

          {stages.map((st, i) => {
            const isDone = currentStageIdx > i || request.status === 'Completed';
            const isCurrent = currentStageIdx === i && request.status !== 'Completed';

            return (
              <div key={st.key} className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-blue-700 text-white ring-4 ring-blue-100 animate-pulse'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <div className="mt-2">
                  <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-blue-700' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                    {st.label}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block">{st.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          
          {/* Top Specifications Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="corp-card p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Site Requester</div>
              <div className="font-extrabold text-slate-900 text-sm">{request.requester?.name || 'Requester'}</div>
              <div className="text-xs text-slate-600">{request.requester?.department || 'Operations'}</div>
              <div className="text-xs text-blue-700 mt-2 font-semibold flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1" /> {request.location} Regional Desk
              </div>
            </div>

            <div className="corp-card p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item & Quantity</div>
              <div className="font-extrabold text-slate-900 text-sm truncate">{request.itemDetails?.name}</div>
              <div className="text-xs text-slate-600">Category: {request.itemDetails?.category}</div>
              <div className="text-xs text-emerald-700 mt-2 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block">
                Quantity: {request.itemDetails?.quantity} {request.itemDetails?.unit || 'Units'}
              </div>
            </div>

            <div className="corp-card p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project & Budget</div>
              <div className="font-extrabold text-slate-900 text-sm truncate">{request.project?.projectName}</div>
              <div className="text-xs text-slate-600">Allocated Budget:</div>
              <div className="text-xs text-slate-900 font-extrabold mt-1">
                {allocatedBudget.toLocaleString()} SAR
              </div>
            </div>

            <div className="corp-card p-4 bg-slate-50/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Commercial Price</div>
              <div className="font-extrabold text-blue-700 text-base">
                {chosenQuote?.totalPrice ? `${chosenQuote.totalPrice.toLocaleString()} SAR` : 'Pending Quotation'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Historical Benchmark: <span className="font-semibold text-slate-700">{baselinePrice.toLocaleString()} SAR</span>
              </div>
              <div className={`text-[11px] font-bold mt-1.5 flex items-center ${isSavings ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isSavings ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                {isSavings ? `${Math.abs(variancePct)}% Cost Savings` : `+${variancePct}% vs Historical Avg`}
              </div>
            </div>
          </div>

          {/* Requisition Purpose & Business Justification Document */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Requisition Purpose & Business Justification (Initiator Requirement Doc)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ Mandatory Requirement Attached
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-extrabold text-slate-900 text-sm">
                Subject: {request.subject || `Material Requisition for ${request.itemDetails?.name} (${request.itemDetails?.quantity} ${request.itemDetails?.unit || 'Units'})`}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-700">
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Business Need & Why This Quantity is Required on Site:</strong>
                  <p className="leading-relaxed">
                    {request.businessJustification?.purpose ||
                      `${request.itemDetails?.quantity} units of ${request.itemDetails?.name} are required for on-site engineering operations for ${request.project?.projectName}. Mandatory compliance with Saudi safety regulations and project critical path timeline.`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                  <div>
                    <strong className="text-slate-900 font-bold block mb-0.5">Urgency & Milestone Dependency:</strong>
                    <span className="text-slate-600">
                      {request.businessJustification?.urgencyReason || 'Required for immediate deployment by upcoming site milestone.'}
                    </span>
                  </div>
                  <div>
                    <strong className="text-slate-900 font-bold block mb-0.5">Impact If Not Approved:</strong>
                    <span className="text-rose-700 font-medium">
                      {request.businessJustification?.impactIfNotApproved || 'Site work stoppage and potential contractor delay penalties.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 1 & 2: Interactive 3-Bid Quotation Collector & Editor */}
          {(request.status === 'Incoming' || request.status === 'Quotation_Collection') && (
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="badge-primary mb-1">Stage 2: Tender Sourcing</div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center">
                    <UploadCloud className="w-5 h-5 mr-2 text-blue-700" />
                    Market Quotations Collection & 3-Bid Tender Entry
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {request.flaggedIssue?.isFlagged
                      ? '⚠️ Please review the flagged feedback above, update vendor bids or specifications, and resubmit for Technical Sign-off.'
                      : 'Collect and enter at least 3 competitive quotations from approved KSA vendors.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBid}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Vendor Bid</span>
                </button>
              </div>

              {/* Editable Bids Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                {quotes.map((q, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-blue-700">Bid #{idx + 1}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Tender Offer</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Vendor / Supplier</label>
                          <select
                            value={q.vendorName}
                            onChange={(e) => handleUpdateBid(idx, 'vendorName', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 mt-0.5"
                          >
                            {approvedVendorsList.map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Total Bid (SAR)</label>
                            <input
                              type="number"
                              value={q.totalPrice}
                              onChange={(e) => handleUpdateBid(idx, 'totalPrice', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-blue-800 focus:outline-none focus:border-blue-600 mt-0.5"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Lead Time (Days)</label>
                            <input
                              type="number"
                              value={q.leadTimeDays}
                              onChange={(e) => handleUpdateBid(idx, 'leadTimeDays', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 mt-0.5"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Warranty / SLA</label>
                          <input
                            type="text"
                            value={q.warrantyTerms}
                            onChange={(e) => handleUpdateBid(idx, 'warrantyTerms', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 mt-0.5"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Spec Details & Terms</label>
                          <textarea
                            rows={2}
                            value={q.specificationsText}
                            onChange={(e) => handleUpdateBid(idx, 'specificationsText', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-700 focus:outline-none focus:border-blue-600 mt-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Attached: <strong className="text-blue-700">quote-slip.pdf</strong></span>
                      <span className="text-emerald-700 font-bold">✓ Verified</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button: Submit Bids to Technical HOD */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 font-medium">
                  Gathered <span className="font-bold text-slate-900">{quotes.length} competitive supplier bids</span> for engineering review.
                </div>

                <button
                  onClick={submitQuotations}
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{actionLoading ? 'Submitting Tenders...' : request.flaggedIssue?.isFlagged ? '✓ Resubmit Revised Bids to Technical HOD' : 'Submit 3 Verified Bids to Technical HOD'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3-Bid Quotation Matrix Display */}
          {currentQuotations.length > 0 && request.status !== 'Incoming' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <QuotationComparison
                quotations={currentQuotations}
                onSelectVendor={handleSelectVendor}
                selectedVendor={chosenQuote?.vendorName}
                isActionable={request.status === 'Quotation_Collection' || (request.status === 'Technical_Approval' && (userRole === 'Approver' || userRole === 'Admin'))}
              />
            </div>
          )}

          {/* STAGE 3: Technical / Requester Approval */}
          {request.status === 'Technical_Approval' && (
            <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-warning mb-1">Technical Review Desk</span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-amber-600" />
                    Technical HOD Specification Verification
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Confirm that the selected quotation (<span className="font-bold text-slate-800">{chosenQuote?.vendorName}</span>) strictly complies with engineering project specifications.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs space-y-2 mb-4">
                <div className="font-bold text-amber-900">Technical Verification Checklist:</div>
                <div className="flex items-center text-slate-700">
                  <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> OEM Specifications & Standards confirmed
                </div>
                <div className="flex items-center text-slate-700">
                  <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Delivery lead time within project deadline
                </div>
                <div className="flex items-center text-slate-700">
                  <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Warranty & After-Sales SLA certified
                </div>
              </div>

              {/* Strict Role-Based Action Gate */}
              {userRole === 'Approver' || userRole === 'Admin' ? (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openFlagModal('Quotation_Collection', 'Substandard OEM Specifications')}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>⚠️ Flag Technical Issue / Revert to Sourcing</span>
                  </button>

                  <button
                    onClick={() => handleAction('technical-approve', { isApproved: true, notes: `Technically approved winning bid from ${chosenQuote?.vendorName}. Specifications compliant.` })}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Specifications & Send to Finance</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-amber-800 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    <span>Awaiting technical review by Technical Approver / HOD.</span>
                  </div>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                    Read-Only for {userRole}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STAGE 4: Finance Compliance & Budget Review */}
          {request.status === 'Finance_Review' && (
            <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-primary mb-1">Finance & Commercial Control</span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-700" />
                    Finance Review, Price Variance & Budget Validation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Finance controller validates commercial viability against historical baseline prices and project funds.
                  </p>
                </div>
              </div>

              {/* Price Variance Diagnostics Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] font-semibold text-slate-500">Allocated Project Budget:</div>
                  <div className="text-base font-black text-slate-900">{allocatedBudget.toLocaleString()} SAR</div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">✓ Sufficient Funds Available</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] font-semibold text-slate-500">Quoted Commercial Amount:</div>
                  <div className="text-base font-black text-blue-700">{chosenQuote?.totalPrice?.toLocaleString()} SAR</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">Vendor: {chosenQuote?.vendorName}</div>
                </div>

                <div className={`rounded-xl p-3 border ${isSavings ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="text-[11px] font-semibold text-slate-600">Historical Price Baseline Variance:</div>
                  <div className={`text-base font-black ${isSavings ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {isSavings ? `-${Math.abs(variancePct)}% (Cost Savings)` : `+${variancePct}% (Within Tolerance)`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                    Baseline: {baselinePrice.toLocaleString()} SAR
                  </div>
                </div>
              </div>

              {/* Strict Role-Based Action Gate */}
              {userRole === 'Store Incharge' || userRole === 'Admin' ? (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openFlagModal('Quotation_Collection', 'Price Variance Exceeds Baseline (>15%)')}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>⚠️ Flag Commercial Issue / Return to Tender</span>
                  </button>

                  <button
                    onClick={() => handleAction('finance-review', { isApproved: true, notes: `Finance approved ${chosenQuote?.totalPrice?.toLocaleString()} SAR. Authorized PO generation.` })}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Authorize Budget & Generate Official Purchase Order (PO)</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-blue-800 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    <span>Awaiting budget authorization by Finance Controller.</span>
                  </div>
                  <span className="text-[11px] font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full">
                    Read-Only for {userRole}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STAGE 5: Purchase Order Generated & Dispatched */}
          {request.status === 'PO_Generated' && (
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-success mb-1">Official PO Dispatched</span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <FileCheck2 className="w-5 h-5 mr-2 text-emerald-700" />
                    Purchase Order Issued: {request.purchaseOrder?.poNumber || 'PO-2026-ACTIVE'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    The PO has been transmitted to <span className="font-bold text-slate-800">{chosenQuote?.vendorName}</span>. Awaiting physical shipment to site.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('po_preview')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable PO Document</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div>
                  <span className="text-slate-500">PO Reference Number:</span>
                  <div className="font-extrabold text-slate-900">{request.purchaseOrder?.poNumber || 'PO-2026-ACTIVE'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Contract Payment Terms:</span>
                  <div className="font-bold text-slate-800">{request.purchaseOrder?.paymentTerms || 'Net 30 Days after GRN'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <div className="font-bold text-slate-800">{chosenQuote?.leadTimeDays || 3} Business Days</div>
                </div>
              </div>

              {/* Action Button: Site Receiver / Storekeeper */}
              {userRole === 'Initiator' || userRole === 'Store Keeper' || userRole === 'Admin' ? (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openFlagModal('PO_Generated', 'Supplier Delivery Delayed / SLA Breach')}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>⚠️ Flag Vendor Delay SLA Issue</span>
                  </button>

                  <button
                    onClick={() => handleAction('lifecycle', { action: 'DELIVERY_CONFIRMED', notes: 'Vendor delivery arrived at site warehouse. Delivery note verified.' })}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Receive Delivery & Upload Signed Goods Receipt Note (GRN)</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 flex items-center">
                    <Truck className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>Awaiting physical receiving & GRN sign-off by Site Receiver / Storekeeper.</span>
                  </div>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    Read-Only for {userRole}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STAGE 6: Goods Receipt Note (GRN) & Delivery Confirmation */}
          {request.status === 'Delivery_Pending' && (
            <div className="bg-white border-2 border-teal-500 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-primary mb-1">Site Receiving Desk</span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-teal-700" />
                    Physical Delivery Received & Signed Note Uploaded
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Storekeeper / Site Engineer has inspected goods and confirmed 100% quantity delivery. Ready for finance payment matching.
                  </p>
                </div>
              </div>

              {/* GRN Summary Slip */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 text-xs space-y-2 mb-4">
                <div className="flex items-center justify-between font-bold text-teal-950">
                  <span>Goods Receipt Note (GRN) Confirmation:</span>
                  <span className="bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded text-[11px]">Verified On-Site</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>• Received By: <span className="font-bold">{request.deliveryConfirmation?.recipientSignatureName || receiverName}</span></div>
                  <div>• Inspection Status: <span className="font-bold text-emerald-700">100% Passed (Zero Damage)</span></div>
                  <div>• Delivery Note Document: <span className="text-blue-700 underline font-semibold">signed-grn-receipt.pdf</span></div>
                  <div>• Quantity Checked: <span className="font-bold">{request.itemDetails?.quantity} {request.itemDetails?.unit || 'Units'}</span></div>
                </div>
              </div>

              {/* Strict Role-Based Action Gate for Finance Settlement */}
              {userRole === 'Store Incharge' || userRole === 'Admin' ? (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openFlagModal('Delivery_Pending', 'Invoice Mismatch (Discrepancy with PO/GRN)')}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>⚠️ Flag 3-Way Match Discrepancy</span>
                  </button>

                  <button
                    onClick={() => handleAction('lifecycle', { action: 'PAYMENT_PROCESSED', notes: '3-Way Matching verified (PO = GRN = Vendor Invoice). Wire transfer released via SAMA SARIE.' })}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Execute 3-Way Match & Release Payment (Close Ticket)</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-teal-800 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                    <span>GRN received on site. Awaiting Finance controller to verify 3-way match & release payment.</span>
                  </div>
                  <span className="text-[11px] font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
                    Read-Only for {userRole}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STAGE 7: Completed 3-Way Matched & Settled */}
          {request.status === 'Completed' && (
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-sm">
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Procurement Lifecycle 100% Completed & Settled</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                  All procurement obligations, site delivery inspections, and commercial 3-way matching payments have been reconciled and closed.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-xl mx-auto my-4 text-xs text-left grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500">Settlement Transaction Ref:</span>
                    <div className="font-extrabold text-blue-700">{request.paymentRecord?.transactionRef || 'TXN-SAMA-908214'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount Paid (SAR):</span>
                    <div className="font-extrabold text-emerald-700">{chosenQuote?.totalPrice?.toLocaleString()} SAR</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Channel:</span>
                    <div className="font-semibold text-slate-800">SAMA SARIE Instant Corporate Wire</div>
                  </div>
                  <div>
                    <span className="text-slate-500">3-Way Match Status:</span>
                    <div className="font-bold text-emerald-700">✓ PO + GRN + Invoice Matched</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Flag Issue & Revert Modal */}
      {flagModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-300 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Flag Issue & Revert Stage</h3>
                  <p className="text-[11px] text-slate-500">Ticket: <strong>{request.ticketId}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setFlagModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Defect / Issue Category:</label>
                <select
                  value={flagReasonCategory}
                  onChange={(e) => setFlagReasonCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                >
                  <option value="Substandard OEM Specifications / Wrong Model">Substandard OEM Specifications / Wrong Model</option>
                  <option value="Delivery Lead Time Too Slow (Exceeds Project Deadline)">Delivery Lead Time Too Slow (Exceeds Project Deadline)</option>
                  <option value="Price Variance Exceeds Baseline (Over 15% Baseline)">Price Variance Exceeds Baseline (Over 15% Baseline)</option>
                  <option value="Exceeds Project Allocated Budget Cap">Exceeds Project Allocated Budget Cap</option>
                  <option value="Inadequate Warranty / Missing 24-Month SLA">Inadequate Warranty / Missing 24-Month SLA</option>
                  <option value="Unacceptable Payment Terms (100% advance rejected)">Unacceptable Payment Terms (100% advance rejected)</option>
                  <option value="Transit Damage / Missing Site Quantity">Transit Damage / Missing Site Quantity</option>
                  <option value="Alternative Vendor Sourcing Required">Alternative Vendor Sourcing Required</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Revert Pipeline Destination:</label>
                <select
                  value={flagTargetStage}
                  onChange={(e) => setFlagTargetStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-600 focus:bg-white"
                >
                  <option value="Quotation_Collection">Revert to Stage 2: 3-Bid Quotes Collection (Procurement Desk)</option>
                  <option value="Incoming">Revert to Stage 1: Requisition Definition (Site Initiator)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Revision Instructions & Feedback for Team:</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this bid is non-compliant and what changes/alternatives are required..."
                  value={flagNotes}
                  onChange={(e) => setFlagNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFlagModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteFlagIssue}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{actionLoading ? 'Reverting...' : 'Submit Flag & Revert Stage'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Official PO Document Preview */}
      {activeTab === 'po_preview' && (
        <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm max-w-4xl mx-auto text-slate-900">
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-black flex items-center justify-center text-base">U</div>
                <span className="font-black text-xl tracking-tight text-slate-900">UIG CORPORATE HOLDING</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">King Fahd Road, Al Olaya District, Riyadh, Saudi Arabia</p>
              <p className="text-xs text-slate-500">VAT Registration No: 300098765400003</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-blue-800 tracking-tight">PURCHASE ORDER</h2>
              <div className="text-xs font-bold text-slate-700 mt-1">PO #: {request.purchaseOrder?.poNumber || 'PO-2026-10042'}</div>
              <div className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">VENDOR (ISSUED TO):</span>
              <div className="font-bold text-slate-900 text-sm mt-1">{chosenQuote?.vendorName || 'Jarir Marketing Co.'}</div>
              <p className="text-slate-600 mt-0.5">Corporate Commercial Division</p>
              <p className="text-slate-600">Riyadh, Kingdom of Saudi Arabia</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">SHIP TO / SITE LOCATION:</span>
              <div className="font-bold text-slate-900 text-sm mt-1">{request.project?.projectName}</div>
              <p className="text-slate-600 mt-0.5">{request.location} Regional Site Depot</p>
              <p className="text-slate-600">Attn: {request.requester?.name || 'Site Lead'}</p>
            </div>
          </div>

          <div className="py-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-bold">
                  <th className="pb-2">ITEM DESCRIPTION</th>
                  <th className="pb-2 text-center">QTY</th>
                  <th className="pb-2 text-right">UNIT PRICE</th>
                  <th className="pb-2 text-right">TOTAL (SAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-3">
                    <div className="font-bold text-slate-900">{request.itemDetails?.name}</div>
                    <div className="text-slate-500 text-[11px]">{chosenQuote?.specificationsText}</div>
                  </td>
                  <td className="py-3 text-center font-bold">{request.itemDetails?.quantity} {request.itemDetails?.unit || 'Units'}</td>
                  <td className="py-3 text-right">{((chosenQuote?.totalPrice || 45000) / (request.itemDetails?.quantity || 1)).toLocaleString()} SAR</td>
                  <td className="py-3 text-right font-bold text-slate-900">{(chosenQuote?.totalPrice || 45000).toLocaleString()} SAR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t-2 border-slate-900 text-xs">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{((chosenQuote?.totalPrice || 45000) * 0.8695).toFixed(0).toLocaleString()} SAR</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ZATCA VAT (15%):</span>
                <span className="font-semibold">{((chosenQuote?.totalPrice || 45000) * 0.1305).toFixed(0).toLocaleString()} SAR</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Total PO Value:</span>
                <span className="text-blue-700">{(chosenQuote?.totalPrice || 45000).toLocaleString()} SAR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Trail */}
      {activeTab === 'audit_trail' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Tamper-Proof Audit Trail</h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {request.timeline?.map((event, idx) => (
              <div key={idx} className="relative flex items-start space-x-3 pl-8">
                <div className={`absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ${
                  event.stage === 'Issue_Flagged' ? 'bg-rose-600 ring-rose-200' : 'bg-blue-600 ring-blue-100'
                }`}></div>
                <div className={`rounded-xl p-3 flex-1 text-xs border ${
                  event.stage === 'Issue_Flagged' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${event.stage === 'Issue_Flagged' ? 'text-rose-900' : 'text-slate-900'}`}>
                      {event.stage?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 text-[10px]">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-700 mt-1 font-medium">{event.notes}</div>
                  <div className="text-blue-700 font-semibold text-[11px] mt-1">Actor: {event.actor || 'System'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
