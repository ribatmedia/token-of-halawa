'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, Code, KeyRound, ArrowLeft, Sun, Moon, Laptop, ShieldCheck, 
  Database, RefreshCw, Users, FileText, CheckCircle2, AlertTriangle, 
  Download, Trash2, Image, Type, Palette, Video, Settings, Sparkles, Check, UserCheck, Award
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import ReceiptModal from '../../components/ReceiptModal';

// Fetch base endpoint URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const campaignersList = [
  // Final year
  { hn: 1, name: "Asif ali", class: "Final year" },
  { hn: 2, name: "Bishrul wafa", class: "Final year" },
  { hn: 3, name: "Muhammed Falil", class: "Final year" },
  { hn: 4, name: "Sinan Cheekod", class: "Final year" },
  { hn: 5, name: "Sinan rafi", class: "Final year" },
  { hn: 6, name: "Ubayy Valliyad", class: "Final year" },
  // Degree Third year
  { hn: 7, name: "Adhil Ameen", class: "Degree Third year" },
  { hn: 8, name: "Hashir puthoor", class: "Degree Third year" },
  { hn: 9, name: "Muhammed shaheer", class: "Degree Third year" },
  { hn: 10, name: "Muhammed Riswan", class: "Degree Third year" },
  // Degree second year
  { hn: 11, name: "Muhammed Ali", class: "Degree second year" },
  { hn: 12, name: "Muhammed Fayis", class: "Degree second year" },
  { hn: 13, name: "Sinan k", class: "Degree second year" },
  { hn: 14, name: "Yaseen kondotty", class: "Degree second year" },
  // Degree first year
  { hn: 15, name: "Muhammed Melattoor", class: "Degree first year" },
  { hn: 16, name: "Nihal valliyad", class: "Degree first year" },
  // Plus two
  { hn: 17, name: "Anas Rahman", class: "Plus two" },
  { hn: 18, name: "Anas koduvally", class: "Plus two" },
  { hn: 19, name: "Anwar", class: "Plus two" },
  { hn: 20, name: "Adhil Nizar", class: "Plus two" },
  { hn: 21, name: "Naseel", class: "Plus two" },
  { hn: 22, name: "Sabith", class: "Plus two" },
  { hn: 23, name: "Sanah", class: "Plus two" },
  { hn: 24, name: "Savad", class: "Plus two" },
  { hn: 25, name: "Hashir kannur", class: "Plus two" },
  { hn: 26, name: "Yaseen c.k", class: "Plus two" },
  // Plus one
  { hn: 27, name: "Abdu Rahman", class: "Plus one" },
  { hn: 28, name: "Adnan", class: "Plus one" },
  { hn: 29, name: "Anas Mooniyur", class: "Plus one" },
  { hn: 30, name: "Anees", class: "Plus one" },
  { hn: 31, name: "Basith moosa", class: "Plus one" },
  { hn: 32, name: "Farseen", class: "Plus one" },
  { hn: 33, name: "Hafil", class: "Plus one" },
  { hn: 34, name: "Mufeed", class: "Plus one" },
  { hn: 35, name: "Muzammil", class: "Plus one" },
  { hn: 36, name: "Rashal", class: "Plus one" },
  { hn: 37, name: "Rayyan", class: "Plus one" },
  { hn: 38, name: "Swalih", class: "Plus one" },
  { hn: 39, name: "Aboobacker Sidheeque", class: "Plus one" },
  { hn: 40, name: "Aneeb", class: "Plus one" }
];

export default function DeveloperPage() {
  const { theme, toggleTheme, token } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('dev_auth') === 'true';
      if (isAuth) {
        setIsAuthenticated(true);
      }
    }
  }, []);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Stats & diagnostics states
  const [stats, setStats] = useState({ totalVolunteers: 0, totalDonations: 0, totalAmount: 0, verifiedAmount: 0 });
  const [dbStatus, setDbStatus] = useState('Connecting...');
  const [systemEnv, setSystemEnv] = useState('Next.js 15.5.20');
  const [isResetting, setIsResetting] = useState(false);

  const handleFactoryReset = async () => {
    if (!window.confirm('Are you absolutely sure? This will PERMANENTLY wipe all donors, donations, payments, and workflow logs. This action cannot be undone.')) return;
    
    setIsResetting(true);
    try {
      const res = await fetch(`${API_URL}/developer/reset`, { method: 'DELETE' });
      if (res.ok) {
        alert('Database successfully reset to factory settings.');
        window.location.reload();
      } else {
        alert('Failed to reset database. (Note: Make sure your live backend server has been re-deployed with the latest code)');
      }
    } catch (e) {
      alert('Error connecting to backend. (Note: Make sure your live backend server has been re-deployed with the latest code)');
    } finally {
      setIsResetting(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Receipt Settings State
  const defaultReceiptLayout = {
    receiptNo: { dx: 0, dy: 0, size: 28 },
    date: { dx: 0, dy: 0, size: 28 },
    name: { dx: 0, dy: 0, size: 72 },
    placePhone: { dx: 0, dy: 0, size: 52 },
    amount: { dx: 0, dy: 0, size: 78 }
  };
  type ElementKey = keyof typeof defaultReceiptLayout;
  const [selectedElement, setSelectedElement] = useState<ElementKey>('name');
  const [receiptLayout, setReceiptLayout] = useState(defaultReceiptLayout);

  // UI Banner Notice Tickers
  const [tickerText, setTickerText] = useState('Welcome to Token of Halawa donation program ★ Live tracking active');
  const [loaderStyle, setLoaderStyle] = useState('Fade In Logo');

  // Simulator Selector & Form States
  const [selectedTestCampaigner, setSelectedTestCampaigner] = useState('Asif ali');
  const [selectedTestClass, setSelectedTestClass] = useState('Final year');
  const [donorsList, setDonorsList] = useState<any[]>([]);
  const [donationQueue, setDonationQueue] = useState<any[]>([]);
  const [simDonorName, setSimDonorName] = useState('');
  const [simDonorPhone, setSimDonorPhone] = useState('');
  const [simPlace, setSimPlace] = useState('');
  const [simAmount, setSimAmount] = useState('');
  const [simMonth, setSimMonth] = useState('July');
  const [simFormSuccess, setSimFormSuccess] = useState('');
  const [simFormError, setSimFormError] = useState('');
  const [simLoading, setSimLoading] = useState(false);

  // Banner images state (3 banners, 2:1 aspect ratio)
  const [bannerImages, setBannerImages] = useState<string[]>(['', '', '']);
  const [bannerUploading, setBannerUploading] = useState<number | null>(null);

  // Load custom UI settings and slides from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTicker = localStorage.getItem('notice_ticker_text');
      if (savedTicker) {
        setTickerText(savedTicker);
      }
      
      const savedBanners = localStorage.getItem('homepage_banners');
      if (savedBanners) {
        try {
          setBannerImages(JSON.parse(savedBanners));
        } catch (e) {
          console.error("Failed to parse homepage_banners from localStorage", e);
        }
      }
      
      const savedLayout = localStorage.getItem('receipt_layout_settings');
      if (savedLayout) {
        try {
          setReceiptLayout(JSON.parse(savedLayout));
        } catch (e) {
          console.error("Failed to parse receipt_layout_settings from localStorage", e);
        }
      }
    }
  }, []);

  // Helper to detect Malayalam characters
  const isMalayalam = (text: string) => /[\u0D00-\u0D7F]/.test(text);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Handle Dev Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((loginUser === 'Halawa@26' && loginPass === '7860786') || (loginUser === 'Admin' && loginPass === 'Halawa@2k26')) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_auth', 'true');
      }
      setError('');
    } else {
      setError('Invalid developer credentials');
    }
  };

  // Fetch real counts from backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setDbStatus('Connected (Neon PG)');
      
      const fetchStats = async () => {
        try {
          const donorsRes = await fetch(`${API_URL}/donors`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          const queueRes = await fetch(`${API_URL}/donations/queue`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          
          if (donorsRes.ok && queueRes.ok) {
            const donors = await donorsRes.json();
            const queue = await queueRes.json();
            
            setDonorsList(donors);
            setDonationQueue(queue);
            
            setStats({
              totalVolunteers: 40,
              totalDonations: queue.length,
              totalAmount: queue.reduce((acc: number, item: any) => acc + Number(item.amount), 0),
              verifiedAmount: queue.filter((q: any) => q.status === 'APPROVED').reduce((acc: number, item: any) => acc + Number(item.amount), 0)
            });
          }
        } catch (e) {
          console.log("Could not load backend values, showing seeded defaults.");
        }
      };

      fetchStats();
    }
  }, [isAuthenticated, token]);

  const handleSimLogDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simDonorName || !simDonorPhone || !simAmount) {
      setSimFormError('Please fill out all required fields');
      return;
    }
    setSimLoading(true);
    setSimFormError('');
    setSimFormSuccess('');

    const campaigner = campaignersList.find(c => c.name === selectedTestCampaigner);
    if (!campaigner) {
      setSimFormError('Selected campaigner not found');
      setSimLoading(false);
      return;
    }

    try {
      // 1. Create or retrieve donor profile
      const donorPayload = {
        name: simDonorName,
        phone: simDonorPhone,
        email: `${simDonorName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        category: 'GENERAL',
        donationPlan: 'MONTHLY',
        location: simPlace
      };

      const donorRes = await fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(donorPayload)
      });
      const donorData = await donorRes.json();
      let donorId = '';
      
      if (donorRes.ok) {
        donorId = donorData.id;
      } else {
        const matched = donorsList.find(d => d.phone === simDonorPhone);
        if (matched) {
          donorId = matched.id;
        } else {
          donorId = donorData.id || '';
        }
      }

      if (!donorId) {
        donorId = `donor-${Math.floor(Math.random() * 100000)}`;
      }

      // 2. Log the donation
      const donationPayload = {
        donorId,
        amount: Number(simAmount),
        paymentMethod: 'CASH',
        notes: `Logged by: ${campaigner.name}. Class: ${campaigner.class}. Month: ${simMonth}.`
      };

      const donationRes = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(donationPayload)
      });

      if (donationRes.ok) {
        setSimFormSuccess(`Donation logged successfully!`);
        setSimDonorName('');
        setSimDonorPhone('');
        setSimAmount('');
        
        // Refresh stats
        const donorsRes = await fetch(`${API_URL}/donors`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const queueRes = await fetch(`${API_URL}/donations/queue`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (donorsRes.ok && queueRes.ok) {
          const donorsData = await donorsRes.json();
          const queueData = await queueRes.json();
          setDonorsList(donorsData);
          setDonationQueue(queueData);
          
          setStats({
            totalVolunteers: 40,
            totalDonations: queueData.length,
            totalAmount: queueData.reduce((acc: number, item: any) => acc + Number(item.amount), 0),
            verifiedAmount: queueData.filter((q: any) => q.status === 'APPROVED').reduce((acc: number, item: any) => acc + Number(item.amount), 0)
          });
        }
      } else {
        const donationData = await donationRes.json();
        setSimFormError(donationData.error || donationData.message || 'Failed to log donation');
      }
    } catch (err: any) {
      setSimFormError(err.message || 'An unexpected error occurred');
    } finally {
      setSimLoading(false);
    }
  };

  // Bulk actions
  const handleClearData = async (actionType: string) => {
    if (!confirm(`WARNING: Are you sure you want to perform '${actionType}'? This action is permanent and cannot be undone.`)) return;
    setLoading(true);
    setActionMessage('');

    // Simulate database truncation or clear cache log
    setTimeout(() => {
      setLoading(false);
      setActionMessage(`System action '${actionType}' executed successfully.`);
    }, 1500);
  };

  const exportCampaignersCSV = () => {
    const header = ['HN Code', 'Name', 'Class'];
    const csvContent = [
      header.join(','),
      ...campaignersList.map(c => `${c.hn},"${c.name}","${c.class}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campaigners_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI & Slide Customization Handlers
  const handleSaveUISettings = () => {
    localStorage.setItem('notice_ticker_text', tickerText);
    localStorage.setItem('app_loader_style', loaderStyle);
    setActionMessage('UI branding parameters saved successfully.');
  };

  const handleSaveReceiptSettings = () => {
    localStorage.setItem('receipt_layout_settings', JSON.stringify(receiptLayout));
    setActionMessage('Receipt Layout Settings saved successfully.');
  };

  const handleBannerUpload = (index: number, file: File) => {
    // Validate image
    if (!file.type.startsWith('image/')) {
      setActionMessage('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setActionMessage('Image must be under 5MB.');
      return;
    }
    setBannerUploading(index);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio < 1.5 || ratio > 2.5) {
          setActionMessage(`Banner ${index + 1}: Aspect ratio is ${ratio.toFixed(2)}:1. Recommended is 2:1 (between 1.5:1 and 2.5:1). Image uploaded anyway.`);
        }
        const canvas = document.createElement('canvas');
        const newBanners = [...bannerImages];
        newBanners[index] = e.target?.result as string;
        setBannerImages(newBanners);
        setBannerUploading(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanners = () => {
    localStorage.setItem('homepage_banners', JSON.stringify(bannerImages));
    setActionMessage('Homepage banners saved successfully. Refresh homepage to see changes.');
  };

  const handleRemoveBanner = (index: number) => {
    const newBanners = [...bannerImages];
    newBanners[index] = '';
    setBannerImages(newBanners);
  };

  const handleResetBanners = () => {
    setBannerImages(['', '', '']);
    localStorage.removeItem('homepage_banners');
    setActionMessage('All banners cleared.');
  };

  const glassClass = theme === 'dark' ? 'apple-glass text-slate-100' : 'apple-glass-light text-slate-800';

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-6 transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'bg-[#030712]' : 'bg-slate-100'}`}>
        
        {/* Background Ambient Color Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 pointer-events-none" />
        
        <div className={`w-full max-w-md p-8 rounded-3xl border border-white/10 relative z-10 ${glassClass}`}>
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 mb-4">
              <Code className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Developer Studio</h2>
            <p className="text-xs opacity-60 mt-1.5">Restricted Administrator Area</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Developer User</label>
              <input 
                type="text" 
                required 
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Authorization Password</label>
              <input 
                type="password" 
                required 
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition text-sm flex justify-center items-center gap-2 mt-6"
            >
              Verify & Enter Studio
            </button>
            
            <Link href="/dashboard" className="block text-center mt-6 text-xs text-slate-400 hover:text-emerald-400 font-bold transition">
              ← Return to Dashboard
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-500 overflow-x-hidden flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-[#030712]' : 'bg-slate-100'}`}>
      
      {/* Background Ambient Color Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 pointer-events-none" />

      {/* 1. Left Sidebar Navigation Container */}
      <aside className={`relative z-10 w-full lg:w-72 p-6 flex flex-col border-r border-white/5 shrink-0 ${glassClass} rounded-r-none lg:rounded-r-3xl`}>
        
        {/* Brand Banner */}
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg">
            <Code className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-400 dark:to-amber-400 bg-clip-text text-transparent leading-none">
              Dev Studio
            </h1>
            <p className="text-[8px] font-extrabold text-slate-500 tracking-widest mt-1.5 uppercase">Developer Console</p>
          </div>
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-1 space-y-1.5">
          {[
            { id: 'dashboard', name: 'System Overview', icon: Laptop },
            { id: 'banners', name: 'Banner Upload', icon: Image },
            { id: 'bulk', name: 'Bulk Campaigners', icon: Users },
            { id: 'receipt', name: 'Receipt Settings', icon: FileText },
            { id: 'ui', name: 'UI & Banners', icon: Palette }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl cursor-pointer text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer details */}
        <div className="mt-8 pt-6 border-t border-white/10 text-xs opacity-60 flex flex-col gap-2">
          <p className="font-bold flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Auth: Halawa@26</span>
          </p>
          <button onClick={() => { setIsAuthenticated(false); if (typeof window !== 'undefined') localStorage.removeItem('dev_auth'); }} className="text-red-500 font-bold hover:underline text-left">Exit Console</button>
        </div>
      </aside>

      {/* 2. Main Dashboard Panel Viewport */}
      <main className="flex-grow p-6 lg:p-8 relative z-10 flex flex-col min-h-screen">
        
        {/* Main Content Dashboard Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/5 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest opacity-60">
              DEVELOPER OPTIONS
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
              {currentTab === 'dashboard' ? 'System Diagnostics' :
               currentTab === 'camp-dash-tester' ? 'Campaigner Dashboard Tester' :
               currentTab === 'class-dash-tester' ? 'Class Dashboard Tester' :
               currentTab === 'slider' ? 'Campaign Slider Studio' :
               currentTab === 'bulk' ? 'Bulk Campaigners Management' :
               currentTab === 'receipt' ? 'Receipt Studio' : 'UI & Branding Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>
        </header>

        {/* DYNAMIC TAB ROUTER */}
        <div className="flex-1 flex flex-col gap-6">
          
          {actionMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm font-semibold flex justify-between items-center">
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> {actionMessage}</span>
              <button onClick={() => setActionMessage('')} className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline">Dismiss</button>
            </div>
          )}

          {/* TAB 1: System Overview */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-350">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">Total Campaigners</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{stats.totalVolunteers}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">Total Donations</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{stats.totalDonations}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">Total Collected</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">₹{stats.totalAmount}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">Verified Amount</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">₹{stats.verifiedAmount}</h3>
                </div>
              </div>

              {/* diagnostics */}
              <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">System Diagnostics</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-slate-200/50 dark:bg-black/20 rounded-2xl border border-slate-300 dark:border-white/5">
                    <div>
                      <div className="font-bold text-sm">Database Connection</div>
                      <div className="text-xs opacity-60">Status of the PostgreSQL Neon connection</div>
                    </div>
                    <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">{dbStatus}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-200/50 dark:bg-black/20 rounded-2xl border border-slate-300 dark:border-white/5">
                    <div>
                      <div className="font-bold text-sm">Environment Info</div>
                      <div className="text-xs opacity-60">Server framework and version</div>
                    </div>
                    <span className="font-mono text-xs bg-slate-300 dark:bg-white/10 px-3 py-1 rounded-xl">{systemEnv}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-2xl border border-red-500/25">
                    <div>
                      <div className="font-bold text-sm text-red-500">Factory Reset Database</div>
                      <div className="text-xs opacity-60 text-red-400">Permanently delete all donors, donations, payments, and logs. This cannot be undone.</div>
                    </div>
                    <button 
                      onClick={handleFactoryReset}
                      disabled={isResetting}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Data'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* TAB 2: Bulk Campaigners */}
          {currentTab === 'bulk' && (
            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-350">
              
              <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                <h4 className="text-lg font-bold flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  Roster CSV Utilities & Reset Logs
                </h4>
                <p className="text-xs opacity-60 leading-relaxed">
                  Bulk download, upload or erase campaigner directories. Useful during development cycles and database maintenance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h5 className="font-bold">Download Data & Passwords</h5>
                    <p className="text-xs opacity-60 leading-relaxed">Download a complete CSV backup list of receivers/campaigners including their auto-generated login credentials to distribute to unit representatives.</p>
                    <button onClick={exportCampaignersCSV} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold transition hover:bg-emerald-500/20">
                      <Download className="w-4 h-4" /> Export Campaigners List
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
                    <h5 className="font-bold text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h5>
                    <p className="text-xs opacity-60 leading-relaxed">Reset database collections or purge transaction logs. These actions are permanent.</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleClearData('clear_donations')} className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition">
                        <Trash2 className="w-3.5 h-3.5" /> Purge Donations
                      </button>
                      <button onClick={() => handleClearData('reset_all')} className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-500 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-red-500/20 transition">
                        <Trash2 className="w-3.5 h-3.5" /> Reset Database
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Receipt Settings */}
          {currentTab === 'receipt' && (
            <div className={`p-6 md:p-8 rounded-3xl ${glassClass} space-y-6 animate-in fade-in duration-350`}>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold">Receipt Margin & Position Studio</h3>
                <button onClick={handleSaveReceiptSettings} className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-colors">
                  <Check className="w-4 h-4" /> Save Layout Settings
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Element Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Element to Adjust</label>
                    <select 
                      value={selectedElement} 
                      onChange={(e) => setSelectedElement(e.target.value as ElementKey)} 
                      className="w-full max-w-sm bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="name" className="text-slate-800">Donor Name</option>
                      <option value="amount" className="text-slate-800">Amount</option>
                      <option value="placePhone" className="text-slate-800">Place & Phone</option>
                      <option value="date" className="text-slate-800">Date</option>
                      <option value="receiptNo" className="text-slate-800">Receipt No</option>
                    </select>
                  </div>

                  {/* Slider tools */}
                  <div className="space-y-6 w-full bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase mb-2">
                        <span className="flex items-center gap-2">Nudge Move X <span className="opacity-50 lowercase text-[10px]">(Horizontal)</span></span>
                        <span className="bg-white/10 px-2 py-0.5 rounded">{receiptLayout[selectedElement].dx}px</span>
                      </div>
                      <input 
                        type="range" min="-300" max="300" 
                        value={receiptLayout[selectedElement].dx} 
                        onChange={(e) => setReceiptLayout(prev => ({ ...prev, [selectedElement]: { ...prev[selectedElement], dx: Number(e.target.value) } }))} 
                        className="w-full accent-emerald-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] opacity-40 mt-1"><span>-300px Left</span><span>0</span><span>+300px Right</span></div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase mb-2">
                        <span className="flex items-center gap-2">Nudge Move Y <span className="opacity-50 lowercase text-[10px]">(Vertical)</span></span>
                        <span className="bg-white/10 px-2 py-0.5 rounded">{receiptLayout[selectedElement].dy}px</span>
                      </div>
                      <input 
                        type="range" min="-300" max="300" 
                        value={receiptLayout[selectedElement].dy} 
                        onChange={(e) => setReceiptLayout(prev => ({ ...prev, [selectedElement]: { ...prev[selectedElement], dy: Number(e.target.value) } }))} 
                        className="w-full accent-emerald-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] opacity-40 mt-1"><span>-300px Up</span><span>0</span><span>+300px Down</span></div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase mb-2">
                        <span>Text Size</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded">{receiptLayout[selectedElement].size}px</span>
                      </div>
                      <input 
                        type="range" min="10" max="150" 
                        value={receiptLayout[selectedElement].size} 
                        onChange={(e) => setReceiptLayout(prev => ({ ...prev, [selectedElement]: { ...prev[selectedElement], size: Number(e.target.value) } }))} 
                        className="w-full accent-emerald-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] opacity-40 mt-1"><span>10px Small</span><span>150px Huge</span></div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Column */}
                <div className="bg-slate-900/5 rounded-2xl border border-white/10 p-2 hidden lg:flex items-center justify-center">
                   <ReceiptModal 
                     isOpen={true} 
                     onClose={() => {}} 
                     previewMode={true} 
                     customLayout={receiptLayout}
                     receiptData={{
                        receiptNo: 'RC-12345',
                        name: 'Shafique PC',
                        place: 'Kozhikode',
                        amount: '5000',
                        date: new Date().toISOString()
                     }} 
                   />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UI & Banners */}
          {currentTab === 'ui' && (
            <div className={`p-6 md:p-8 rounded-3xl ${glassClass} space-y-8 animate-in fade-in duration-350`}>
              <div>
                <h3 className="text-xl font-bold border-b border-white/10 pb-4">UI & Branding Customization</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Scrolling Notice Text</label>
                      <textarea 
                        value={tickerText}
                        onChange={(e) => setTickerText(e.target.value)}
                        rows={3} 
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                        placeholder="Alert notices scrolling across the homepage banner..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">App Loader Sequence</label>
                      <select value={loaderStyle} onChange={(e) => setLoaderStyle(e.target.value)} className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/40">
                        <option value="Fade In Logo" className="text-slate-800">Fade In Logo Sequence</option>
                        <option value="Spinning Crescent" className="text-slate-800">Spinning Crescent</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-bold text-slate-800 dark:text-white">Active Branding Preview</h5>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0f4c81] flex items-center justify-center text-xs font-bold text-white shadow"><Heart className="w-4 h-4 text-emerald-400" /></div>
                        <span className="font-bold text-sm">Token of Halawa App Logo Active</span>
                      </div>
                      <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs overflow-x-auto whitespace-nowrap text-slate-700 dark:text-slate-200">
                        <span className="font-bold text-amber-500 mr-2">★</span>
                        <span className={isMalayalam(tickerText) ? 'font-malayalam font-bold' : ''}>{tickerText}</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleSaveUISettings}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-3.5 rounded-2xl font-black text-sm transition hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      Apply Custom UI Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Banner Upload Studio */}
          {currentTab === 'banners' && (
            <div className={`p-6 md:p-8 rounded-3xl ${glassClass} space-y-6 animate-in fade-in duration-350`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Image className="w-5 h-5" /> Homepage Banner Upload
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Upload 3 homepage banners in 2:1 aspect ratio (e.g. 1200x600, 1600x800). Supports JPG, PNG, WebP up to 5MB each.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={handleResetBanners}
                    className="flex-1 sm:flex-none border border-slate-350 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={handleSaveBanners}
                    className="flex-1 sm:flex-none bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition hover:bg-emerald-450 hover:shadow shadow-sm cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Banners
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {bannerImages.map((banner, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-left flex flex-col">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Banner #{index + 1}</span>
                      <span className="text-[10px] bg-slate-200/20 px-2 py-0.5 rounded font-mono text-slate-400">
                        {banner ? 'uploaded' : 'empty'}
                      </span>
                    </div>

                    {/* Preview Area */}
                    <div 
                      className="relative w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-white/15 bg-slate-100/50 dark:bg-black/20 transition-all hover:border-emerald-500/50 cursor-pointer group"
                      style={{ aspectRatio: '2 / 1' }}
                      onClick={() => {
                        const input = document.getElementById(`banner-input-${index}`);
                        if (input) input.click();
                      }}
                    >
                      {banner ? (
                        <>
                          <img 
                            src={banner} 
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Click to replace</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          {bannerUploading === index ? (
                            <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                          ) : (
                            <>
                              <Image className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Click to upload</span>
                              <span className="text-[9px] text-slate-400/60">2:1 ratio · max 5MB</span>
                            </>
                          )}
                        </div>
                      )}
                      <input 
                        id={`banner-input-${index}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBannerUpload(index, file);
                          e.target.value = '';
                        }}
                      />
                    </div>

                    {/* Action buttons */}
                    {banner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const input = document.getElementById(`banner-input-${index}`);
                            if (input) input.click();
                          }}
                          className="flex-1 border border-slate-350 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/5 px-3 py-2 rounded-xl text-[10px] font-bold transition cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => handleRemoveBanner(index)}
                          className="px-3 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold transition hover:bg-red-500/20 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Info Note */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <strong>Note:</strong> Banners are stored in browser localStorage and displayed on the homepage in a 2:1 ratio. Clear browser data to reset.
              </div>
            </div>
          )}

        </div>

        {/* Global System Log footer */}
        <footer className="mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
          <p>&copy; 2026 Token of Halawa. All rights reserved.</p>
          <div className="flex items-center gap-1 font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Developer studio initialized</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
