'use client';
import React from 'react';
import { Check, Clock, DollarSign, ShieldCheck, FileText, Award, Zap } from 'lucide-react';

export default function QuotationComparison({ quotations, onSelectVendor, selectedVendor, isActionable = true }) {
  if (!quotations || quotations.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
        Pending vendor quotations upload for market comparison.
      </div>
    );
  }

  const minPrice = Math.min(...quotations.map((q) => q.totalPrice));
  const minLeadTime = Math.min(...quotations.map((q) => q.leadTimeDays));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700 mr-2"></span>
            3-Bid Vendor Tender Comparison Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare bids across total price, delivery SLA, warranty, and technical compliance.
          </p>
        </div>
        <span className="badge-primary">
          {quotations.length} Verified Quotations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quotations.map((quote, idx) => {
          const isLowestPrice = quote.totalPrice === minPrice;
          const isFastest = quote.leadTimeDays === minLeadTime;
          const isWinner = selectedVendor ? selectedVendor === quote.vendorName : quote.isChosen;

          return (
            <div
              key={idx}
              className={`relative rounded-xl border p-5 flex flex-col transition-all duration-200 ${
                isWinner
                  ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Vendor Option #{idx + 1}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight mt-0.5">
                    {quote.vendorName}
                  </h4>
                </div>
                {isWinner && (
                  <span className="badge-success flex items-center space-x-1 shrink-0">
                    <Check className="w-3 h-3" />
                    <span>Selected</span>
                  </span>
                )}
              </div>

              {/* Price Row */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 my-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Bid Price:</span>
                  <div className="text-right">
                    <span className={`text-lg font-black ${isLowestPrice ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {quote.totalPrice?.toLocaleString()} <span className="text-xs font-bold text-slate-500">SAR</span>
                    </span>
                  </div>
                </div>

                {isLowestPrice && (
                  <div className="mt-1.5 inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    <Award className="w-3 h-3" />
                    <span>Best Price Advantage</span>
                  </div>
                )}
              </div>

              {/* Lead Time & Specs */}
              <div className="space-y-2.5 my-2 flex-grow text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Delivery Lead Time:
                  </span>
                  <span className="font-bold text-slate-800 flex items-center">
                    {quote.leadTimeDays} Business Days
                    {isFastest && (
                      <span className="ml-1.5 inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        <Zap className="w-2.5 h-2.5 mr-0.5" /> Fastest
                      </span>
                    )}
                  </span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <div className="text-slate-500 font-medium mb-1">Specifications & Scope:</div>
                  <p className="text-slate-700 font-medium line-clamp-3 bg-slate-50/50 p-2 rounded border border-slate-100">
                    {quote.specificationsText}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    Warranty:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {quote.warrantyTerms || '12 Months Standard'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={quote.quotationDocUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Quotation PDF</span>
                </a>

                {isActionable && onSelectVendor && (
                  <button
                    onClick={() => onSelectVendor(quote.vendorName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isWinner
                        ? 'bg-blue-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isWinner ? 'Selected Winner' : 'Select Winning Bid'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
