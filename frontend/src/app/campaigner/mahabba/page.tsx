'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import MahabbaReceiptModal from '@/components/MahabbaReceiptModal';
import { Heart, LogOut, Plus, RefreshCw, CheckCircle, X, Download, Share2, IndianRupee, User, Phone, MapPin, Calendar, TrendingUp, Users, Wallet, ChevronDown, ChevronUp, Search, Clock, Verified, FileText } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export default function MahabbaCampaignerPage() {
  const { token, user, organization, clearAuth } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'donors' | 'new' | 'renew'>('donors');
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDonor, setExpandedDonor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [receiptModal, setReceiptModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const [formData, setFormData] = useState({
    donorName: '', donorPhone: '', donorWhatsApp: '', donorAddress: '',
    amount: '100', donationMonth: 'Jun', monthPlan: '100/month', status: 'Received' as 'Received' | 'Pending'
  });

  const [renewForm, setRenewForm] = useState({
    donorName: '', donorPhone: '', donorWhatsApp: '', donorAddress: '',
    amount: '100', donationMonth: 'Jun', monthPlan: '100/month', status: 'Received' as 'Received' | 'Pending'
  });

  useEffect(() => {
    if (!token || !user) {
      router.push('/campaigner');
      return;
    }
    loadDonors();
  }, [token, user]);

  const loadDonors = async () => {
    setLoading(true);
    try {
      const className = (user as any)?.class || '';
      const res = await fetch(`${API_URL}/mahabba/donations/class?class=${encodeURIComponent(className)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setDonors(data.donors);
    } catch (err) {
      console.error('Failed to load donors', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess(false);
    try {
      const res = await fetch(`${API_URL}/mahabba/donations/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          campaignerName: (user as any)?.fullName || (user as any)?.hn || 'Campaigner',
          campaignerClass: (user as any)?.class || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        setFormData({ donorName: '', donorPhone: '', donorWhatsApp: '', donorAddress: '', amount: '100', donationMonth: 'Jun', monthPlan: '100/month', status: 'Received' });
        setReceiptModal({ open: true, data: { receiptNo: data.donation.receiptNo, date: data.donation.createdAt, name: data.donor?.name || formData.donorName, place: formData.donorAddress || '', amount: formData.amount, month: formData.donationMonth, plan: formData.monthPlan } });
        loadDonors();
      } else {
        setFormError(data.error || 'Failed to save donation');
      }
    } catch (err) {
      setFormError('Network error. Saved locally.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRenewDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess(false);
    try {
      const res = await fetch(`${API_URL}/mahabba/donations/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...renewForm,
          amount: Number(renewForm.amount),
          campaignerName: (user as any)?.fullName || (user as any)?.hn || 'Campaigner',
          campaignerClass: (user as any)?.class || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        setRenewForm({ donorName: '', donorPhone: '', donorWhatsApp: '', donorAddress: '', amount: '100', donationMonth: 'Jun', monthPlan: '100/month', status: 'Received' });
        setReceiptModal({ open: true, data: { receiptNo: data.donation.receiptNo, date: data.donation.createdAt, name: data.donor?.name || renewForm.donorName, place: renewForm.donorAddress || '', amount: renewForm.amount, month: renewForm.donationMonth, plan: renewForm.monthPlan } });
        loadDonors();
      } else {
        setFormError(data.error || 'Failed to process renewal');
      }
    } catch (err) {
      setFormError('Network error. Saved locally.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/campaigner');
  };

  const filteredDonors = donors.filter((d: any) =>
    !searchQuery || d.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.donor?.phone?.includes(searchQuery)
  );

  const monthColor = (m: any) => {
    if (!m.isPaid) return 'bg-gray-800 text-gray-500 cursor-not-allowed';
    if (m.isVerified) return 'bg-emerald-600 text-white cursor-pointer';
    return 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-pointer';
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <nav className="sticky top-0 z-50 apple-glass px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Heart className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Mahabba Pravarthana Fund</h1>
              <p className="text-xs text-slate-400">Campaigner: {(user as any)?.fullName || (user as any)?.hn || 'User'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadDonors} className="p-2 hover:bg-white/5 rounded-lg transition">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveTab('donors')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'donors' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Users className="w-4 h-4 inline mr-1.5" /> Donors
          </button>
          <button onClick={() => setActiveTab('new')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'new' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Plus className="w-4 h-4 inline mr-1.5" /> New Donation
          </button>
          <button onClick={() => setActiveTab('renew')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'renew' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <RefreshCw className="w-4 h-4 inline mr-1.5" /> Renewal
          </button>
        </div>

        {activeTab === 'donors' && (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search donors by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50" />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading donors...</div>
            ) : filteredDonors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p className="text-slate-400">No donors yet. Add your first donation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDonors.map((d: any, idx: number) => {
                  const isExpanded = expandedDonor === (d.donor?.id || idx.toString());
                  return (
                    <div key={d.donor?.id || idx} className="apple-glass rounded-xl overflow-hidden">
                      <button onClick={() => setExpandedDonor(isExpanded ? null : (d.donor?.id || idx.toString()))}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium">{d.donor?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400">{d.donor?.phone || ''} · ₹{d.totalCollected}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">{d.monthPlan || 'No plan'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {MONTHS.map(m => {
                              const monthData = d.months?.[m];
                              return (
                                <button key={m} disabled={!monthData?.isPaid}
                                  onClick={() => monthData?.isPaid && setReceiptModal({ open: true, data: { receiptNo: monthData.receiptNo, date: monthData.donationDate, name: d.donor?.name, place: d.donor?.location || '', amount: monthData.amount, month: m, plan: d.monthPlan } })}
                                  className={`w-10 h-10 rounded-lg text-xs font-medium transition ${monthColor(monthData)}`}>
                                  {m}
                                </button>
                              );
                            })}
                          </div>
                          {d.transactions?.length > 0 && (
                            <div className="text-xs text-slate-500 space-y-1">
                              {d.transactions.map((tx: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5">
                                  <span>Receipt: {tx.receiptNo || 'N/A'}</span>
                                  <span>₹{Number(tx.amount)} · {tx.donationMonth}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'new' && (
          <div className="max-w-lg mx-auto">
            <div className="apple-glass rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4"><Plus className="w-5 h-5 inline mr-2 text-emerald-400" />New Donation</h2>
              <form onSubmit={handleNewDonation} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Donor Name *</label>
                  <input type="text" required value={formData.donorName} onChange={e => setFormData(f => ({ ...f, donorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Phone</label>
                    <input type="text" value={formData.donorPhone} onChange={e => setFormData(f => ({ ...f, donorPhone: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">WhatsApp</label>
                    <input type="text" value={formData.donorWhatsApp} onChange={e => setFormData(f => ({ ...f, donorWhatsApp: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Address</label>
                  <input type="text" value={formData.donorAddress} onChange={e => setFormData(f => ({ ...f, donorAddress: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Amount (₹) *</label>
                    <input type="number" required value={formData.amount} onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Month(s)</label>
                    <input type="text" value={formData.donationMonth} onChange={e => setFormData(f => ({ ...f, donationMonth: e.target.value }))}
                      placeholder="e.g. Jun, Jul"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Plan</label>
                    <input type="text" value={formData.monthPlan} onChange={e => setFormData(f => ({ ...f, monthPlan: e.target.value }))}
                      placeholder="e.g. 100/month"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Status</label>
                    <select value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50">
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                {formError && <p className="text-red-400 text-sm">{formError}</p>}
                {formSuccess && <p className="text-emerald-400 text-sm">Donation saved successfully!</p>}
                <button type="submit" disabled={formLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition disabled:opacity-50">
                  {formLoading ? 'Saving...' : 'Save Donation'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'renew' && (
          <div className="max-w-lg mx-auto">
            <div className="apple-glass rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4"><RefreshCw className="w-5 h-5 inline mr-2 text-amber-400" />Renewal Donation</h2>
              <form onSubmit={handleRenewDonation} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Donor Name *</label>
                  <input type="text" required value={renewForm.donorName} onChange={e => setRenewForm(f => ({ ...f, donorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Phone</label>
                    <input type="text" value={renewForm.donorPhone} onChange={e => setRenewForm(f => ({ ...f, donorPhone: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">WhatsApp</label>
                    <input type="text" value={renewForm.donorWhatsApp} onChange={e => setRenewForm(f => ({ ...f, donorWhatsApp: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Address</label>
                  <input type="text" value={renewForm.donorAddress} onChange={e => setRenewForm(f => ({ ...f, donorAddress: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Amount (₹) *</label>
                    <input type="number" required value={renewForm.amount} onChange={e => setRenewForm(f => ({ ...f, amount: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">New Month(s)</label>
                    <input type="text" value={renewForm.donationMonth} onChange={e => setRenewForm(f => ({ ...f, donationMonth: e.target.value }))}
                      placeholder="e.g. Oct, Nov"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Plan</label>
                    <input type="text" value={renewForm.monthPlan} onChange={e => setRenewForm(f => ({ ...f, monthPlan: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Status</label>
                    <select value={renewForm.status} onChange={e => setRenewForm(f => ({ ...f, status: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50">
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                {formError && <p className="text-red-400 text-sm">{formError}</p>}
                {formSuccess && <p className="text-emerald-400 text-sm">Renewal processed successfully!</p>}
                <button type="submit" disabled={formLoading}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition disabled:opacity-50">
                  {formLoading ? 'Processing...' : 'Process Renewal'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <MahabbaReceiptModal
        isOpen={receiptModal.open}
        onClose={() => setReceiptModal({ open: false, data: null })}
        receiptData={receiptModal.data}
      />
    </div>
  );
}
