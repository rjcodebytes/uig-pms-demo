'use client';
import React, { useEffect, useState } from 'react';
import {
  Building2,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  Clock,
  Plus,
  X
} from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: '',
    category: 'IT Hardware & Electronics',
    crNumber: '1010892341',
    vatNumber: '300892341200003',
    city: 'Riyadh',
    contactPerson: 'Saleh Al-Omari',
    email: 'corporate@vendor.sa',
    phone: '+966 11 445 6789',
    rating: 4.8,
    avgDeliveryDays: 3,
  });

  const fetchVendors = () => {
    setLoading(true);
    fetch('/api/v1/vendors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVendors(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchVendors();
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const filtered = vendors.filter((v) =>
    v.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-700" />
            Approved Suppliers & Vendors Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified Saudi commercial suppliers with active CR, ZATCA VAT compliance, and historical SLA records.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Onboard New Supplier</span>
          </button>
          <span className="badge-success text-xs font-bold px-3 py-1">
            ✓ {vendors.length} Verified KSA Suppliers
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Supplier Name, Category, City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((v) => (
          <div key={v._id || v.vendorName} className="corp-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="badge-primary text-[10px] uppercase font-bold">{v.category}</span>
                  <h3 className="font-black text-slate-900 text-base leading-tight mt-1.5">{v.vendorName}</h3>
                </div>
                <div className="flex items-center bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold px-2 py-0.5 rounded-md shrink-0">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                  {v.rating}
                </div>
              </div>

              {/* Compliance & Location */}
              <div className="space-y-1.5 text-xs text-slate-600 my-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CR Number:</span>
                  <span className="font-semibold text-slate-800">{v.crNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">VAT Reg:</span>
                  <span className="font-semibold text-slate-800">{v.vatNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hub City:</span>
                  <span className="font-semibold text-slate-800 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-blue-600" /> {v.city}
                  </span>
                </div>
              </div>

              {/* Spend & Delivery Stats */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs grid grid-cols-2 gap-2 my-2">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Lifetime Spend</div>
                  <div className="font-black text-blue-800 text-sm">{v.totalSpendSAR?.toLocaleString()} SAR</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Avg SLA Delivery</div>
                  <div className="font-bold text-slate-800 text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-emerald-600" /> {v.avgDeliveryDays || 3} Days
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600 mt-2">
              <div className="truncate">
                <span className="font-bold text-slate-800">{v.contactPerson}</span>
                <div className="text-[11px] text-slate-400 truncate">{v.email}</div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Approved
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Onboard New Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Onboard Verified Supplier (ASL)</h3>
                <p className="text-xs text-slate-500">Add to company approved supplier list with verified CR & VAT records</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Supplier Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Al-Fawzan Engineering Supplies Co."
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supply Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="IT Hardware & Electronics">IT Hardware & Electronics</option>
                    <option value="Construction Materials">Construction Materials</option>
                    <option value="Office Furniture & Fixtures">Office Furniture & Fixtures</option>
                    <option value="Industrial & Safety Equipment">Industrial & Safety Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hub City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Riyadh">Riyadh</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="Dammam">Dammam</option>
                    <option value="Khobar">Khobar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CR Number (10 Digits)</label>
                  <input
                    type="text"
                    value={formData.crNumber}
                    onChange={(e) => setFormData({ ...formData, crNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ZATCA VAT Tax ID (15 Digits)</label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{submitting ? 'Verifying...' : 'Save & Certify Approved Supplier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
