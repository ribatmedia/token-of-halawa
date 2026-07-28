'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import MahabbaReceiptModal from '@/components/MahabbaReceiptModal';
import { Heart, LogOut, Users, User, RefreshCw, IndianRupee, ChevronDown, ChevronUp, Search, Download, Share2, X, CheckCircle, XCircle, Wallet, FileText, Shield, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export default function AdminMahabbaPage() {
  const { token, user, organization, clearAuth } = useAuthStore();
  const router = useRouter();

  const [activeView, setActiveView] = useState<'donors' | 'handovers'>('donors');
  const [donors, setDonors] = useState<any[]>([]);
  const [handovers, setHandovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDonor, setExpandedDonor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [receiptModal, setReceiptModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { router.push('/admin'); return; }
    loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [donorsRes, handoversRes] = await Promise.all([
        fetch(`${API_URL}/mahabba/donations/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/mahabba/class-handovers`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const donorsData = await donorsRes.json();
      const handoversData = await handoversRes.json();
      if (donorsData.success) setDonors(donorsData.donors);
      if (handoversData.success) setHandovers(handoversData.handovers);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (donationId: string, month: string, isVerified: boolean) => {
    setVerifying(`${donationId}-${month}`);
    try {
      const endpoint = isVerified ? 'unverify' : 'verify';
      const res = await fetch(`${API_URL}/mahabba/donations/${donationId}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ month })
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Verification failed', err);
    } finally {
      setVerifying(null);
    }
  };

  const handleLogout = () => { clearAuth(); router.push('/admin'); };

  const allClasses = Array.from(new Set(donors.map((d: any) => d.campaignerClass).filter(Boolean)));

  const filteredDonors = donors.filter((d: any) => {
    if (classFilter !== 'ALL' && d.campaignerClass !== classFilter) return false;
    if (searchQuery && !d.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !d.donor?.phone?.includes(searchQuery)) return false;
    return true;
  });

  const totals = filteredDonors.reduce((acc, d) => ({ count: acc.count + 1, amount: acc.amount + d.totalCollected }), { count: 0, amount: 0 });

  const monthColor = (m: any) => {
    if (!m.isPaid) return 'bg-gray-800 text-gray-500';
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
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Mahabba Pravarthana Fund · {organization?.name || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2 hover:bg-white/5 rounded-lg transition"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveView('donors')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeView === 'donors' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Users className="w-4 h-4 inline mr-1.5" /> All Donors
          </button>
          <button onClick={() => setActiveView('handovers')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeView === 'handovers' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Wallet className="w-4 h-4 inline mr-1.5" /> Handovers
          </button>
        </div>

        {activeView === 'donors' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="apple-glass rounded-xl p-4">
                <p className="text-xs text-slate-400">Total Donors</p>
                <p className="text-2xl font-bold mt-1">{totals.count}</p>
              </div>
              <div className="apple-glass rounded-xl p-4">
                <p className="text-xs text-slate-400">Total Collection</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">₹{totals.amount}</p>
              </div>
              <div className="apple-glass rounded-xl p-4">
                <p className="text-xs text-slate-400">Classes</p>
                <p className="text-2xl font-bold mt-1">{allClasses.length}</p>
              </div>
              <div className="apple-glass rounded-xl p-4">
                <p className="text-xs text-slate-400">Campaigners</p>
                <p className="text-2xl font-bold mt-1">{new Set(donors.map((d: any) => d.campaignerName).filter(Boolean)).size}</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search donors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50" />
              </div>
              <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none">
                <option value="ALL">All Classes</option>
                {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading...</div>
            ) : filteredDonors.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No donors found.</div>
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
                            <p className="text-xs text-slate-400">{d.donor?.phone || ''} · {d.campaignerClass || ''} · {d.campaignerName || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">₹{d.totalCollected}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {MONTHS.map(m => {
                              const md = d.months?.[m];
                              return (
                                <button key={m} disabled={!md?.isPaid || verifying === `${md?.donationId}-${m}`}
                                  onClick={() => {
                                    if (md?.isPaid) {
                                      if (md.isVerified) {
                                        handleVerify(md.donationId, m, true);
                                      } else {
                                        handleVerify(md.donationId, m, false);
                                      }
                                    }
                                  }}
                                  className={`w-10 h-10 rounded-lg text-xs font-medium transition ${monthColor(md)}`}
                                  title={md?.isPaid ? (md.isVerified ? 'Click to unverify' : 'Click to verify') : 'Not paid'}>
                                  {m}
                                </button>
                              );
                            })}
                          </div>
                          <div className="text-xs text-slate-500 space-y-1">
                            <p className="text-xs text-slate-400 mb-1">Legend: <span className="inline-block w-3 h-3 rounded bg-emerald-600 align-middle mr-1"></span> Verified <span className="inline-block w-3 h-3 rounded bg-amber-500/40 border border-amber-500/30 align-middle mx-1"></span> Unverified <span className="inline-block w-3 h-3 rounded bg-gray-800 align-middle mx-1"></span> Not Paid</p>
                            {d.transactions?.map((tx: any, i: number) => (
                              <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5">
                                <span>Receipt: {tx.receiptNo || 'N/A'} · {tx.campaignerName || ''} ({tx.campaignerClass || ''})</span>
                                <span>₹{Number(tx.amount)} · {tx.donationMonth}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeView === 'handovers' && (
          <div>
            <div className="apple-glass rounded-xl p-4 mb-4">
              <h2 className="text-lg font-bold mb-1"><Wallet className="w-5 h-5 inline mr-2 text-amber-400" />Class Handovers</h2>
              <p className="text-xs text-slate-400">Total handovers: {handovers.length} · Total amount: ₹{handovers.reduce((s, h) => s + Number(h.amount), 0)}</p>
            </div>
            {handovers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No handovers recorded yet.</div>
            ) : (
              <div className="space-y-2">
                {handovers.map((h: any, i: number) => (
                  <div key={h.id || i} className="apple-glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{h.className} · {h.handoverMonth}</p>
                      <p className="text-xs text-slate-400">{h.leaderName} → {h.adminName || 'Admin'} · {h.receiptNo}</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">₹{Number(h.amount)}</p>
                  </div>
                ))}
              </div>
            )}
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
