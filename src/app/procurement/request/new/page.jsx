'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  FilePlus2,
  Building2,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function NewRequestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'manual'
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);

  // WhatsApp Simulator State
  const [whatsappMessage, setWhatsappMessage] = useState(
    'Salam Tariq, we urgently need 500 Heavy Duty Safety Helmets (EN397 certified) for Riyadh Metro Extension Phase 2 by next Tuesday. 500 new shift workers are mobilizing underground and OSHA regulations prohibit site access without certified PPE.'
  );

  // Manual Form State
  const [formData, setFormData] = useState({
    subject: 'Mobilization of 500 Heavy-Duty EN397 Certified Helmets for Tunneling Crew',
    businessPurpose: '500 new technical technicians are mobilizing for underground tunnel boring operations on Riyadh Metro Phase 2. Under Saudi Civil Defense & OSHA regulations, workers without certified EN397 helmets are prohibited from entering subterranean shafts.',
    urgencyReason: 'Critical path milestone; tunnel boring commences next Tuesday. Crew cannot work without PPE.',
    impactIfNotApproved: 'Site work stoppage incurring delay penalties of 25,000 SAR/day from the Royal Commission for Riyadh City.',
    requesterName: 'Eng. Mohammed Al-Saud (Site Lead)',
    requesterEmail: 'm.alsaud@uig.com',
    department: 'Site Operations & Civil',
    location: 'Riyadh',
    projectName: 'Riyadh Metro Extension Phase 2',
    projectId: 'PRJ-RYD-METRO',
    allocatedBudget: 350000,
    itemName: 'EN397 Industrial Safety Helmets',
    category: 'Industrial & Safety Equipment',
    quantity: 500,
    unit: 'Units',
    targetPrice: 45,
    description: 'ANSI/ISEA Z89.1 certified heavy-duty site helmets with 4-point chin straps and reflective night strips.',
    priority: 'High',
  });

  const handleWhatsappSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isJeddah = whatsappMessage.toLowerCase().includes('jeddah');
      const isDammam = whatsappMessage.toLowerCase().includes('dammam');
      const location = isJeddah ? 'Jeddah' : isDammam ? 'Dammam' : 'Riyadh';

      const payload = {
        subject: 'WhatsApp Requisition: 500 Heavy-Duty EN397 Safety Helmets',
        businessJustification: {
          purpose: whatsappMessage,
          urgencyReason: 'Required for immediate underground mobilization by Tuesday.',
          impactIfNotApproved: 'Subterranean work stoppage and OSHA compliance violation.',
        },
        requester: {
          name: 'Eng. Mohammed Al-Saud (Site Lead)',
          email: 'm.alsaud@uig.com',
          department: 'Site Civil Engineering',
          mobile: '+966 50 112 3344',
        },
        project: {
          projectId: 'PRJ-RYD-METRO',
          projectName: 'Riyadh Metro Extension Phase 2',
          allocatedBudget: 350000,
          client: 'Royal Commission for Riyadh City',
        },
        location,
        itemDetails: {
          name: 'EN397 Industrial Safety Helmets',
          category: 'Industrial & Safety Equipment',
          description: 'Heavy duty ANSI/ISEA certified site helmets.',
          quantity: 500,
          unit: 'Units',
          targetPrice: 45,
        },
        priority: 'High',
        notes: `AI Ingested from Field WhatsApp Note: "${whatsappMessage}"`,
      };

      const res = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessTicket(data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        subject: formData.subject,
        businessJustification: {
          purpose: formData.businessPurpose,
          urgencyReason: formData.urgencyReason,
          impactIfNotApproved: formData.impactIfNotApproved,
        },
        requester: {
          name: formData.requesterName,
          email: formData.requesterEmail,
          department: formData.department,
        },
        project: {
          projectId: formData.projectId,
          projectName: formData.projectName,
          allocatedBudget: Number(formData.allocatedBudget),
        },
        location: formData.location,
        itemDetails: {
          name: formData.itemName,
          category: formData.category,
          quantity: Number(formData.quantity),
          unit: formData.unit,
          targetPrice: Number(formData.targetPrice),
          description: formData.description,
        },
        priority: formData.priority,
        notes: 'Submitted via Standard Enterprise Requisition Form with full business justification.',
      };

      const res = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessTicket(data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <FilePlus2 className="w-6 h-6 mr-2 text-blue-700" />
          Create Material Requisition (PR)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Initiate a compliant procurement request with mandatory business justification, required quantities, and automated regional desk routing.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => { setActiveTab('whatsapp'); setSuccessTicket(null); }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'whatsapp' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp / Site Voice Ingestion Simulator</span>
        </button>

        <button
          onClick={() => { setActiveTab('manual'); setSuccessTicket(null); }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
            activeTab === 'manual' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Standard Enterprise Requisition Form</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successTicket && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-sm animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Requisition Created: {successTicket.ticketId}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Subject: <strong className="text-slate-900">{successTicket.subject || successTicket.itemDetails?.name}</strong>
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Assigned Desk: <span className="font-bold text-blue-700">{successTicket.assignedTo?.name || 'Riyadh Central Desk'}</span> ({successTicket.location})
                </p>
              </div>
            </div>

            <Link
              href={`/procurement/request/${successTicket.ticketId || successTicket._id}`}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1"
            >
              <span>Track Ticket Lifecycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 1: WhatsApp Ingestion Simulator */}
      {activeTab === 'whatsapp' && (
        <div className="corp-card p-6 border-2 border-emerald-500/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="badge-primary mb-1 bg-emerald-100 text-emerald-800 border-emerald-300">
                AI Ingestion Channel
              </div>
              <h2 className="text-base font-black text-slate-900 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-emerald-600" />
                WhatsApp Voice / Chat NLP Parser Simulator
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Site Engineer Voice Mock</span>
          </div>

          <form onSubmit={handleWhatsappSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Chat Message / Audio Transcript from Field:
              </label>
              <textarea
                rows={4}
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                NLP Engine automatically extracts: <strong className="text-slate-700">Item (Helmets), Qty (500), Urgency (Next Tuesday), City (Riyadh), and Project Justification.</strong>
              </p>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-700" />
                Automated Requirement & Business Justification Extraction:
              </div>
              <div className="text-[11px] text-slate-700">
                • <strong>Subject:</strong> 500 Heavy-Duty EN397 Safety Helmets<br />
                • <strong>Why Required:</strong> Mandatory OSHA PPE compliance for 500 new subterranean tunneling workers.<br />
                • <strong>Auto-Routing:</strong> Ingested into <strong>Riyadh Central Procurement Desk</strong> under Eng. Mohammed Al-Saud.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Parsing Message with AI...' : 'Simulate Incoming WhatsApp PR Ticket'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Standard Enterprise Requisition Form */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-6">
          
          {/* SECTION 1: Mandatory Subject & Business Justification */}
          <div className="corp-card p-6 border-2 border-blue-500 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="badge-primary mb-1">Mandatory Governance Section</span>
                <h3 className="text-base font-black text-slate-900 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-blue-700" />
                  Requisition Purpose & Business Justification Document
                </h3>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                * Required for Technical/Finance Sign-off
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Requisition Subject / Scope of Requirement: <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Mobilization of 500 Heavy-Duty EN397 Helmets for Underground Shaft Crew"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Statement of Need & Why this Quantity is Required: <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.businessPurpose}
                  onChange={(e) => setFormData({ ...formData, businessPurpose: e.target.value })}
                  placeholder="Explain why these items and specific quantities are needed on site..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urgency & Project Milestone Dependency:
                  </label>
                  <input
                    type="text"
                    value={formData.urgencyReason}
                    onChange={(e) => setFormData({ ...formData, urgencyReason: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Impact If Not Approved on Schedule:
                  </label>
                  <input
                    type="text"
                    value={formData.impactIfNotApproved}
                    onChange={(e) => setFormData({ ...formData, impactIfNotApproved: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Material & Technical Specifications */}
          <div className="corp-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              2. Material Item Details & Quantity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Item Title / Name:</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                >
                  <option value="Industrial & Safety Equipment">Industrial & Safety Equipment</option>
                  <option value="IT Hardware & Networking">IT Hardware & Networking</option>
                  <option value="Heavy Building Materials">Heavy Building Materials</option>
                  <option value="Office Fitouts & Furniture">Office Fitouts & Furniture</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority:</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                >
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Urgent Site Need)</option>
                  <option value="Critical">Critical (Immediate Line Stoppage)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity Required:</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black text-blue-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit:</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Unit Target Price (SAR):</label>
                <input
                  type="number"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Technical Specifications & Standards:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Project Location & Budget Allocation */}
          <div className="corp-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              3. Project & Regional Routing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name:</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Location (Auto-routes to regional desk):</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-blue-700"
                >
                  <option value="Riyadh">Riyadh (Central Hub Desk)</option>
                  <option value="Jeddah">Jeddah (Western Province Desk)</option>
                  <option value="Dammam">Dammam (Eastern Province Desk)</option>
                  <option value="Khobar">Khobar (Eastern Province Desk)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Allocated Project Budget (SAR):</label>
                <input
                  type="number"
                  value={formData.allocatedBudget}
                  onChange={(e) => setFormData({ ...formData, allocatedBudget: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Requester Name:</label>
                <input
                  type="text"
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Creating Requisition...' : 'Submit Requisition & Route to Regional Desk'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
