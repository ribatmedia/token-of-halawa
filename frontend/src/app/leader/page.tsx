'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, Users, User, RefreshCw, IndianRupee, ChevronDown, ChevronUp, Search, Download, Share2, X, CheckCircle, Wallet } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const CLASSES = ['Plus one', 'Plus two', 'Degree first year', 'Degree second year', 'Degree Third year', 'Final year'];

export default function LeaderDashboardPage() {
  const { token, user, organization, clearAuth } = useAuthStore();
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState('Plus one');
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDonor, setExpandedDonor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptModal, setReceiptModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [handoverModal, setHandoverModal] = useState(false);
  const [handover, setHandover] = useState({ className: 'Plus one', handoverMonth: 'July', amount: '', leaderName: '', leaderPhone: '', adminName: '' });
  const [handoverLoading, setHandoverLoading] = useState(false);
  const [handoverSuccess, setHandoverSuccess] = useState('');
  const [handoverError, setHandoverError] = useState('');

  useEffect(() => {
    if (!token) { router.push('/admin'); return; }
    loadDonors();
  }, [token, selectedClass]);

  const loadDonors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/mahabba/donations/class?class=${encodeURIComponent(selectedClass)}`, {
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

  const handleHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    setHandoverLoading(true);
    setHandoverError('');
    setHandoverSuccess('');
    try {
      const res = await fetch(`${API_URL}/mahabba/class-handovers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...handover, amount: Number(handover.amount) })
      });
      const data = await res.json();
      if (data.success) {
        setHandoverSuccess(`Handover completed! Receipt: ${data.handover.receiptNo}`);
        setHandover({ className: selectedClass, handoverMonth: 'July', amount: '', leaderName: '', leaderPhone: '', adminName: '' });
      } else {
        setHandoverError(data.error || 'Handover failed');
      }
    } catch (err) {
      setHandoverError('Network error');
    } finally {
      setHandoverLoading(false);
    }
  };

  const handleLogout = () => { clearAuth(); router.push('/admin'); };

  const filteredDonors = donors.filter((d: any) =>
    !searchQuery || d.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || d.donor?.phone?.includes(searchQuery)
  );

  const totalClassCollection = donors.reduce((sum, d) => sum + d.totalCollected, 0);
  const totalDonors = donors.length;

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
              <h1 className="text-lg font-bold">Class Leader Dashboard</h1>
              <p className="text-xs text-slate-400">Mahabba Pravarthana Fund</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadDonors} className="p-2 hover:bg-white/5 rounded-lg transition"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setHandoverModal(true)} className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition text-sm">
              <Wallet className="w-4 h-4" /> Handover
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="apple-glass rounded-xl p-4">
            <p className="text-xs text-slate-400">Class</p>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
              className="bg-transparent text-lg font-bold mt-1 focus:outline-none">
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="apple-glass rounded-xl p-4">
            <p className="text-xs text-slate-400">Total Donors</p>
            <p className="text-2xl font-bold mt-1">{totalDonors}</p>
          </div>
          <div className="apple-glass rounded-xl p-4">
            <p className="text-xs text-slate-400">Total Collection</p>
            <p className="text-2xl font-bold mt-1 text-emerald-400">₹{totalClassCollection}</p>
          </div>
          <div className="apple-glass rounded-xl p-4">
            <p className="text-xs text-slate-400">Campaigners</p>
            <p className="text-2xl font-bold mt-1">{new Set(donors.map((d: any) => d.campaignerName)).size}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search donors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50" />
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No donors found for this class.</div>
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
                        <p className="text-xs text-slate-400">{d.donor?.phone || ''} · Campaigner: {d.campaignerName || 'N/A'}</p>
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
                            <button key={m} disabled={!md?.isPaid}
                              onClick={() => md?.isPaid && setReceiptModal({ open: true, data: { receiptNo: md.receiptNo, date: md.donationDate, name: d.donor?.name, place: d.donor?.location || '', amount: md.amount, month: m, plan: d.monthPlan } })}
                              className={`w-10 h-10 rounded-lg text-xs font-medium transition ${monthColor(md)}`}>
                              {m}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        {d.transactions?.map((tx: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5">
                            <span>Receipt: {tx.receiptNo || 'N/A'} · {tx.campaignerName || ''}</span>
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

      {handoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="apple-glass rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold"><Wallet className="w-5 h-5 inline mr-2 text-amber-400" />Class Handover</h2>
              <button onClick={() => setHandoverModal(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {handoverSuccess && <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg text-sm mb-4">{handoverSuccess}</div>}
            <form onSubmit={handleHandover} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Class</label>
                  <select value={handover.className} onChange={e => setHandover(h => ({ ...h, className: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none">
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Month</label>
                  <input type="text" value={handover.handoverMonth} onChange={e => setHandover(h => ({ ...h, handoverMonth: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Amount (₹)</label>
                <input type="number" required value={handover.amount} onChange={e => setHandover(h => ({ ...h, amount: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Leader Name</label>
                  <input type="text" required value={handover.leaderName} onChange={e => setHandover(h => ({ ...h, leaderName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Leader Phone</label>
                  <input type="text" value={handover.leaderPhone} onChange={e => setHandover(h => ({ ...h, leaderPhone: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Admin Name</label>
                <input type="text" value={handover.adminName} onChange={e => setHandover(h => ({ ...h, adminName: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none" />
              </div>
              {handoverError && <p className="text-red-400 text-sm">{handoverError}</p>}
              <button type="submit" disabled={handoverLoading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition disabled:opacity-50">
                {handoverLoading ? 'Processing...' : 'Submit Handover'}
              </button>
            </form>
          </div>
        </div>
      )}

      {receiptModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="apple-glass rounded-2xl max-w-md w-full p-6 relative animate-in fade-in">
            <button onClick={() => setReceiptModal({ open: false, data: null })} className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <div className="text-emerald-400 text-2xl font-bold" style={{ fontFamily: "'Satisfy', cursive" }}>Token of</div>
              <h2 className="text-3xl font-black text-emerald-400">Halawa</h2>
              <p className="text-lg font-bold text-slate-200">മഹബ്ബ പ്രവർത്തന ഫണ്ട്</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Receipt No</span><span className="font-medium">{receiptModal.data?.receiptNo || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-medium">{receiptModal.data?.date ? new Date(receiptModal.data.date).toLocaleDateString() : new Date().toLocaleDateString()}</span></div>
              <div className="border-t border-white/10 my-2" />
              <p className="text-center text-lg" style={{ fontFamily: "'Satisfy', cursive" }}>Thank you</p>
              <p className="text-center text-xl font-bold">{receiptModal.data?.name || ''}</p>
              <p className="text-center text-slate-400">{receiptModal.data?.place || ''}</p>
              <p className="text-center">for your kind contribution</p>
              <div className="bg-emerald-600 text-white text-3xl font-black text-center py-3 rounded-xl mx-auto max-w-[200px]">₹ {receiptModal.data?.amount || '0'}</div>
              <div className="flex justify-center gap-1.5 mt-3">
                {MONTHS.map(m => (
                  <span key={m} className={`px-2 py-1 rounded text-xs font-medium ${m === receiptModal.data?.month?.substring(0, 3) ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>{m}</span>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400">Plan: {receiptModal.data?.plan || 'N/A'}/month</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { const w = window.open(); if (w) { w.document.write('<pre>' + JSON.stringify(receiptModal.data, null, 2) + '</pre>'); w.print(); } }}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={() => { const text = `Receipt: ${receiptModal.data?.receiptNo}\nAmount: ₹${receiptModal.data?.amount}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
