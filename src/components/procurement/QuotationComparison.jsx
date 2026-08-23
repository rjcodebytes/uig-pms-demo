'use client';
import React from 'react';
import { Check, Clock, DollarSign } from 'lucide-react';

export default function QuotationComparison({ quotations, onSelectVendor }) {
  if (!quotations || quotations.length !== 3) {
    return <div className="text-zinc-500 italic">Pending 3 vendor quotations for comparison.</div>;
  }

  // Find lowest price and fastest lead time
  const minPrice = Math.min(...quotations.map(q => q.totalPrice));
  const minLeadTime = Math.min(...quotations.map(q => q.leadTimeDays));

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold text-white flex items-center mb-6">
        <span className="w-2 h-6 bg-purple-500 rounded-full mr-3 glow-border"></span>
        Vendor Quotation Comparison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quotations.map((quote, idx) => {
          const isLowestPrice = quote.totalPrice === minPrice;
          const isFastest = quote.leadTimeDays === minLeadTime;
          
          return (
            <div 
              key={idx} 
              className={`relative glass-card rounded-2xl p-6 flex flex-col transition-all duration-300
                ${quote.isChosen ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-500/10' : 'border-white/5'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-white text-lg">{quote.vendorName}</h4>
                {quote.isChosen && (
                  <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Selected
                  </span>
                )}
              </div>

              <div className="space-y-4 flex-grow">
                {/* Price Row */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-zinc-500" /> Total Price
                  </span>
                  <span className={`font-semibold ${isLowestPrice ? 'text-emerald-400 text-xl' : 'text-zinc-300 text-lg'}`}>
                    {quote.totalPrice.toLocaleString()} SAR
                  </span>
                </div>
                {isLowestPrice && (
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    🏆 Best Price
                  </div>
                )}

                {/* Lead Time Row */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-zinc-400 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-zinc-500" /> Lead Time
                  </span>
                  <span className={`font-semibold ${isFastest ? 'text-amber-400 text-xl' : 'text-zinc-300 text-lg'}`}>
                    {quote.leadTimeDays} Days
                  </span>
                </div>
                {isFastest && (
                  <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 inline-flex items-center px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    ⚡ Fastest Delivery
                  </div>
                )}

                {/* Specifications */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-xs text-zinc-500 mb-1 font-medium">Specifications & Terms:</p>
                  <p className="text-sm text-zinc-300 line-clamp-3">{quote.specificationsText}</p>
                </div>
                
                <a href={quote.quotationDocUrl} target="_blank" rel="noreferrer" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors mt-3 inline-block">
                  View Source Document &rarr;
                </a>
              </div>

              {onSelectVendor && !quote.isChosen && (
                <button
                  onClick={() => onSelectVendor(quote.vendorName)}
                  className="mt-6 w-full bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700 hover:border-white/20 font-medium py-2.5 rounded-xl transition-all"
                >
                  Select Vendor
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
