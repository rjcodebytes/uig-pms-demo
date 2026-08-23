'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, CheckCircle, Smartphone } from 'lucide-react';

export default function NewRequestPage() {
  const router = useRouter();
  const [waText, setWaText] = useState('Need 500 Industrial Safety Helmets for Riyadh Metro Project by next week.');
  const [waLoading, setWaLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    setWaLoading(true);

    // Simulate sending payload to our generic POST route
    const payload = {
      requester: 'WhatsApp User',
      location: waText.toLowerCase().includes('jeddah') ? 'Jeddah' : 'Riyadh',
      project: { projectId: 'WA-01', projectName: 'Site Request' },
      itemDetails: { name: waText, category: 'General', quantity: 1 },
      notes: `Ingested from WhatsApp: "${waText}"`
    };

    try {
      const res = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Ticket ${data.data.ticketId} Created!`);
        setTimeout(() => {
          router.push('/procurement/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
    setWaLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white">Create New Request</h1>
          <p className="text-zinc-400 mt-2">Demonstrate manual entry or seamless WhatsApp ingestion.</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl flex items-center text-emerald-400 font-bold justify-center">
            <CheckCircle className="w-5 h-5 mr-2" /> {successMsg}
          </div>
        )}

        <div className="glass-panel p-8 rounded-2xl border border-emerald-500/20 relative">
          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg shadow-emerald-500/50 animate-bounce">
            <MessageCircle className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl font-bold text-white flex items-center mb-6">
            <Smartphone className="w-6 h-6 mr-3 text-emerald-400" />
            WhatsApp Simulator
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            Simulate a site engineer sending a text message. The system NLP (mocked here) will parse the location and item.
          </p>

          <form onSubmit={handleWhatsAppSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">Message Body</label>
              <textarea 
                rows="3"
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl p-4 text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-zinc-600"
                placeholder="Type a request message..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={waLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50 glow-border shadow-lg shadow-emerald-500/20"
            >
              {waLoading ? 'Processing NLP & Creating Ticket...' : 'Send to UIG Procurement Bot'}
              <Send className="w-5 h-5 ml-2" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
