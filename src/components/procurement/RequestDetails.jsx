'use client';
import React, { useState } from 'react';
import QuotationComparison from './QuotationComparison';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle } from 'lucide-react';

export default function RequestDetails({ request, onStatusChange }) {
  const [technicalLoading, setTechnicalLoading] = useState(false);
  const [financeLoading, setFinanceLoading] = useState(false);
  const [financeNotes, setFinanceNotes] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  const handleTechnicalApprove = async () => {
    if (!selectedVendor) return alert("Please select a vendor quotation first.");
    
    setTechnicalLoading(true);
    try {
      const res = await fetch(`/api/v1/requests/${request.ticketId}/technical-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chosenVendorName: selectedVendor,
          email: request.requester.email, // Simulating the logged-in user is the requester
          forceApprove: true // Mock bypass for prototype
        })
      });
      const data = await res.json();
      if (data.success) {
        onStatusChange(data.data);
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
    setTechnicalLoading(false);
  };

  const handleFinanceReview = async (isApproved) => {
    if (!isApproved && !financeNotes) return alert("Comments are mandatory for rejection.");
    
    setFinanceLoading(true);
    try {
      const res = await fetch(`/api/v1/requests/${request.ticketId}/finance-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isApproved,
          comments: financeNotes,
          reviewedBy: 'Finance Ops (OneWebbers)'
        })
      });
      const data = await res.json();
      if (data.success) {
        onStatusChange(data.data);
        if (data.budgetMargin !== undefined) {
           alert(`Finance Approved! Budget Margin Remaining: ${data.budgetMargin} SAR`);
        }
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
    setFinanceLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">
      
      {/* Header Info */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{request.ticketId} - {request.itemDetails.name}</h2>
        <p className="text-gray-500 mt-1">Project: {request.project.projectName} | Budget: {request.project.allocatedBudget.toLocaleString()} SAR</p>
      </div>

      {/* Feature 3: Side-by-Side Quotation Comparison */}
      {(request.status === 'Quotation_Collection' || request.status === 'Technical_Approval' || request.status === 'Finance_Review' || request.status === 'PO_Generated') && (
        <div className="mb-8">
          <QuotationComparison 
            quotations={request.quotations} 
            onSelectVendor={request.status === 'Quotation_Collection' ? setSelectedVendor : null} 
          />
        </div>
      )}

      {/* Action Panels */}
      <div className="space-y-4">
        
        {/* Gate 1: Technical Validation */}
        {request.status === 'Quotation_Collection' && (
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg">
            <h3 className="flex items-center font-bold text-orange-900 mb-2">
              <ShieldCheck className="w-5 h-5 mr-2" /> Gate 1: Technical Approval
            </h3>
            <p className="text-sm text-orange-800 mb-4">Requester validation required to proceed to Finance.</p>
            <button 
              onClick={handleTechnicalApprove}
              disabled={technicalLoading || !selectedVendor}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition"
            >
              {technicalLoading ? 'Approving...' : 'Approve Technical & Proceed'}
            </button>
          </div>
        )}

        {/* Gate 2: Finance Compliance Analytics */}
        {request.status === 'Technical_Approval' && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg">
            <h3 className="flex items-center font-bold text-amber-900 mb-2">
              <AlertOctagon className="w-5 h-5 mr-2" /> Gate 2: Finance Compliance Review
            </h3>
            
            {request.financeReview?.varianceDetected && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded text-sm font-semibold">
                WARNING: Chosen vendor price exceeds historical average baseline by \u003E 10%.
              </div>
            )}

            <textarea
              className="w-full border-gray-300 rounded-md shadow-sm mb-4 p-3 text-sm focus:ring-amber-500 focus:border-amber-500"
              placeholder="Finance notes (Mandatory if rejecting)..."
              value={financeNotes}
              onChange={(e) => setFinanceNotes(e.target.value)}
              rows={3}
            />
            
            <div className="flex space-x-3">
              <button 
                onClick={() => handleFinanceReview(true)}
                disabled={financeLoading}
                className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Generate PO
              </button>
              <button 
                onClick={() => handleFinanceReview(false)}
                disabled={financeLoading}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition"
              >
                <XCircle className="w-4 h-4 mr-2" /> Reject & Rollback
              </button>
            </div>
          </div>
        )}

        {/* PO Generation Success State */}
        {request.status === 'PO_Generated' && (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg">
            <h3 className="font-bold text-emerald-900 mb-1">Purchase Order Generated Successfully</h3>
            <p className="text-emerald-800 mb-3">PO Number: <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">{request.purchaseOrder.poNumber}</span></p>
            <p className="text-sm text-emerald-700">Vendor confirmation has been dispatched automatically via UIG Procurement Engine.</p>
          </div>
        )}

      </div>
    </div>
  );
}
