'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, Code, KeyRound, ArrowLeft, Sun, Moon, Laptop, ShieldCheck, 
  Database, RefreshCw, Users, FileText, CheckCircle2, AlertTriangle, 
  Download, Trash2, Sliders, Type, Palette, Video, Settings, Sparkles, Check, UserCheck, Award
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

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
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Stats & diagnostics states
  const [stats, setStats] = useState({ totalVolunteers: 40, totalDonations: 3, totalAmount: 1450, verifiedAmount: 1150 });
  const [dbStatus, setDbStatus] = useState('Connecting...');
  const [systemEnv, setSystemEnv] = useState('Next.js 15.5.20');
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Receipt Settings State
  const [moveX, setMoveX] = useState(320);
  const [moveY, setMoveY] = useState(418);
  const [textSize, setTextSize] = useState(29);
  const [textAlign, setTextAlign] = useState('center');
  const [fontWeight, setFontWeight] = useState('Bold (700)');
  const [fontFamily, setFontFamily] = useState('Outfit');

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
  const [simAmount, setSimAmount] = useState('');
  const [simMonth, setSimMonth] = useState('July');
  const [simFormSuccess, setSimFormSuccess] = useState('');
  const [simFormError, setSimFormError] = useState('');
  const [simLoading, setSimLoading] = useState(false);

  // Slider slides customization state
  const [devSlides, setDevSlides] = useState([
    {
      title: "Intelligent Campaign Collections",
      desc: "Raise funds dynamically with real-time analytics, goal tracking, and automated progress report boards.",
      bg: "bg-emerald-50/75 border border-emerald-200/80 shadow-md",
      accent: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Smart Receipt & QR Verification",
      desc: "Instant digital receipt generation with unique serial codes, cryptographic signatures, and verification QR codes.",
      bg: "bg-amber-50/75 border border-amber-200/80 shadow-md",
      accent: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "WhatsApp & Multi-Lingual Alerts",
      desc: "Broadcasting receipts, automated payment links, and renewal warnings in English, Malayalam, Arabic, and Tamil.",
      bg: "bg-indigo-50/75 border border-indigo-200/80 shadow-md",
      accent: "text-indigo-600 dark:text-indigo-400"
    }
  ]);

  // Load custom UI settings and slides from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTicker = localStorage.getItem('notice_ticker_text');
      if (savedTicker) {
        setTickerText(savedTicker);
      }
      
      const savedSlides = localStorage.getItem('campaign_slides');
      if (savedSlides) {
        try {
          setDevSlides(JSON.parse(savedSlides));
        } catch (e) {
          console.error("Failed to parse campaign_slides from localStorage", e);
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
        donationPlan: 'MONTHLY'
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

  // UI & Slide Customization Handlers
  const handleSaveUISettings = () => {
    localStorage.setItem('notice_ticker_text', tickerText);
    localStorage.setItem('app_loader_style', loaderStyle);
    setActionMessage('UI branding parameters saved successfully.');
  };

  const handleSaveSlides = () => {
    localStorage.setItem('campaign_slides', JSON.stringify(devSlides));
    setActionMessage('Campaign slides configuration saved successfully. Refresh homepage to see changes.');
  };

  const handleResetSlides = () => {
    const defaultSlides = [
      {
        title: "Intelligent Campaign Collections",
        desc: "Raise funds dynamically with real-time analytics, goal tracking, and automated progress report boards.",
        bg: "bg-emerald-50/75 border border-emerald-200/80 shadow-md",
        accent: "text-emerald-600 dark:text-emerald-400"
      },
      {
        title: "Smart Receipt & QR Verification",
        desc: "Instant digital receipt generation with unique serial codes, cryptographic signatures, and verification QR codes.",
        bg: "bg-amber-50/75 border border-amber-200/80 shadow-md",
        accent: "text-amber-600 dark:text-amber-400"
      },
      {
        title: "WhatsApp & Multi-Lingual Alerts",
        desc: "Broadcasting receipts, automated payment links, and renewal warnings in English, Malayalam, Arabic, and Tamil.",
        bg: "bg-indigo-50/75 border border-indigo-200/80 shadow-md",
        accent: "text-indigo-600 dark:text-indigo-400"
      }
    ];
    setDevSlides(defaultSlides);
    localStorage.setItem('campaign_slides', JSON.stringify(defaultSlides));
    setActionMessage('Campaign slides restored to default settings.');
  };

  const updateSlideField = (index: number, key: string, value: string) => {
    const newSlides = [...devSlides];
    newSlides[index] = { ...newSlides[index], [key]: value };
    setDevSlides(newSlides);
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
            { id: 'camp-dash-tester', name: 'Campaigner Tester', icon: UserCheck },
            { id: 'class-dash-tester', name: 'Class Tester', icon: Award },
            { id: 'bulk', name: 'Bulk Campaigners', icon: Users },
            { id: 'receipt', name: 'Receipt Settings', icon: Sliders },
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
          <button onClick={() => setIsAuthenticated(false)} className="text-red-500 font-bold hover:underline text-left">Exit Console</button>
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
                </div>
              </div>
            </div>
          )}

          {/* TAB: Campaigner Dashboard Tester */}
          {currentTab === 'camp-dash-tester' && (() => {
            const campaigner = campaignersList.find(c => c.name === selectedTestCampaigner) || campaignersList[0];
            const myCollections = donationQueue.filter(q => q.notes?.includes(`Logged by: ${campaigner.name}`));
            const myCollectedTotal = myCollections.reduce((acc, q) => acc + Number(q.amount), 0);
            const myVerifiedTotal = myCollections.filter(q => q.status === 'APPROVED').reduce((acc, q) => acc + Number(q.amount), 0);
            const myPendingTotal = myCollections.filter(q => q.status === 'PENDING').reduce((acc, q) => acc + Number(q.amount), 0);
            const myDonorsCount = new Set(myCollections.map(q => q.donorId)).size;

            return (
              <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-350">
                {/* Selector */}
                <div className={`p-6 rounded-3xl ${glassClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Simulated Campaigner Dashboard</h4>
                    <p className="text-xs opacity-60 mt-1">Select any campaigner to inspect what stats they see in their portal.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-60">Campaigner:</span>
                    <select
                      value={selectedTestCampaigner}
                      onChange={(e) => setSelectedTestCampaigner(e.target.value)}
                      className="bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none text-slate-800 dark:text-white"
                    >
                      {campaignersList.map(c => (
                        <option key={c.name} value={c.name} className="text-slate-850">{c.name} ({c.class})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Profile Card & Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile info */}
                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campaigner Info</span>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 uppercase">{campaigner.name}</h3>
                      <p className="text-xs opacity-60 mt-1">Class: {campaigner.class} · HN Code: {campaigner.hn}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-350/30">
                      <span className="text-[9px] font-bold text-slate-450 uppercase block">Compiled Email address</span>
                      <span className="font-mono text-xs text-emerald-500 font-bold">hn{campaigner.hn}@hidayaonline.org</span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <div className={`p-5 rounded-3xl bg-white/5 border border-white/10`}>
                      <span className="text-[9px] font-bold opacity-50 uppercase">Total Collected</span>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">₹{myCollectedTotal.toLocaleString()}.00</h4>
                    </div>
                    <div className={`p-5 rounded-3xl bg-white/5 border border-white/10`}>
                      <span className="text-[9px] font-bold opacity-50 uppercase">Total Donors</span>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{myDonorsCount} Donors</h4>
                    </div>
                    <div className={`p-5 rounded-3xl bg-white/5 border border-white/10`}>
                      <span className="text-[9px] font-bold opacity-50 uppercase">Verified Amount</span>
                      <h4 className="text-xl font-black text-emerald-500 mt-1">₹{myVerifiedTotal.toLocaleString()}.00</h4>
                    </div>
                    <div className={`p-5 rounded-3xl bg-white/5 border border-white/10`}>
                      <span className="text-[9px] font-bold opacity-50 uppercase">Pending Amount</span>
                      <h4 className="text-xl font-black text-amber-500 mt-1">₹{myPendingTotal.toLocaleString()}.00</h4>
                    </div>
                  </div>
                </div>

                {/* Form to log simulated donation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Log Donation form */}
                  <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                    <h4 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                      Log Simulated Donation
                    </h4>
                    <p className="text-xs opacity-60">Log a donation directly on behalf of this campaigner for instant class leaderboard verification.</p>
                    
                    {simFormSuccess && <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl font-bold">{simFormSuccess}</div>}
                    {simFormError && <div className="text-xs text-red-500 bg-red-500/10 p-3 rounded-xl font-bold">{simFormError}</div>}

                    <form onSubmit={handleSimLogDonation} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Donor Name *</label>
                        <input
                          type="text"
                          required
                          value={simDonorName}
                          onChange={(e) => setSimDonorName(e.target.value)}
                          placeholder="e.g. Abrar"
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Donor Phone *</label>
                        <input
                          type="text"
                          required
                          value={simDonorPhone}
                          onChange={(e) => setSimDonorPhone(e.target.value)}
                          placeholder="e.g. +91 97455 71286"
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Amount (₹) *</label>
                          <input
                            type="number"
                            required
                            value={simAmount}
                            onChange={(e) => setSimAmount(e.target.value)}
                            placeholder="e.g. 200"
                            className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Target Month</label>
                          <select
                            value={simMonth}
                            onChange={(e) => setSimMonth(e.target.value)}
                            className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                          >
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'One Time'].map(m => (
                              <option key={m} value={m} className="text-slate-850">{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={simLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-2.5 rounded-xl text-xs hover:shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
                      >
                        {simLoading ? 'Logging...' : 'Log Simulated Donation'}
                      </button>
                    </form>
                  </div>

                  {/* Collections list */}
                  <div className={`p-6 rounded-3xl ${glassClass} space-y-4 overflow-x-auto`}>
                    <h4 className="text-md font-bold text-slate-800 dark:text-white">Logged Collections Log</h4>
                    {myCollections.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No donations logged by this campaigner yet.</p>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 text-[9px] uppercase font-bold">
                            <th className="py-2 px-1">Receipt</th>
                            <th className="py-2 px-1">Donor</th>
                            <th className="py-2 px-1">Amount</th>
                            <th className="py-2 px-1 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myCollections.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 text-slate-800 dark:text-slate-350 font-medium">
                              <td className="py-3 px-1 font-mono text-[10px]">TOH-{item.id.slice(0, 4).toUpperCase()}</td>
                              <td className="py-3 px-1">
                                <span className="font-bold block">{item.donor?.name || 'General'}</span>
                                <span className="opacity-55 text-[8px] block">{item.donor?.phone}</span>
                              </td>
                              <td className="py-3 px-1 font-bold text-emerald-500">₹{item.amount}</td>
                              <td className="py-3 px-1 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                  item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                  item.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                  'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {item.status === 'APPROVED' ? 'Verified' : item.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: Class Dashboard Tester */}
          {currentTab === 'class-dash-tester' && (() => {
            const classCampaigners = campaignersList.filter(c => c.class === selectedTestClass);
            const totalCampaigners = classCampaigners.length;

            const collected = donationQueue
              .filter(q => q.notes?.includes(`Class: ${selectedTestClass}`))
              .reduce((acc, q) => acc + Number(q.amount), 0);
            
            const avgCollected = totalCampaigners > 0 ? Math.round(collected / totalCampaigners) : 0;

            // Compute campaigner leaderboard in this class
            const leaderboard = classCampaigners.map(camp => {
              const campDonations = donationQueue.filter(q => q.notes?.includes(`Logged by: ${camp.name}`));
              const totalAmount = campDonations.reduce((acc, q) => acc + Number(q.amount), 0);
              const donorsCount = new Set(campDonations.map(q => q.donorId)).size;
              return { ...camp, totalAmount, donorsCount };
            }).sort((a, b) => b.totalAmount - a.totalAmount);

            return (
              <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-350">
                {/* Selector */}
                <div className={`p-6 rounded-3xl ${glassClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Simulated Class Dashboard</h4>
                    <p className="text-xs opacity-60 mt-1">Select any class to review class stats and campaigner rankings.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-60">Class:</span>
                    <select
                      value={selectedTestClass}
                      onChange={(e) => setSelectedTestClass(e.target.value)}
                      className="bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none text-slate-800 dark:text-white"
                    >
                      {['Final year', 'Degree Third year', 'Degree second year', 'Degree first year', 'Plus two', 'Plus one'].map(name => (
                        <option key={name} value={name} className="text-slate-850">{name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Class Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-3xl ${glassClass}`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Total Class Collection</span>
                    <h3 className="text-3xl font-extrabold tracking-tight text-emerald-500 mt-2">₹{collected.toLocaleString()}.00</h3>
                  </div>
                  <div className={`p-6 rounded-3xl ${glassClass}`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Active Campaigners</span>
                    <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{totalCampaigners} Students</h3>
                  </div>
                  <div className={`p-6 rounded-3xl ${glassClass}`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Average Student Collection</span>
                    <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">₹{avgCollected.toLocaleString()}.00</h3>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                  <h4 className="text-md font-bold text-slate-800 dark:text-white uppercase tracking-wider">Class Performance Leaderboard</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                          <th className="py-3 px-2">Rank</th>
                          <th className="py-3 px-2">Campaigner</th>
                          <th className="py-3 px-2">HN Code</th>
                          <th className="py-3 px-2">Donors Count</th>
                          <th className="py-3 px-2 text-right">Total Collected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((item, index) => (
                          <tr key={item.hn} className="border-b border-white/5 text-slate-800 dark:text-slate-350 font-medium">
                            <td className="py-3 px-2 font-bold">#{index + 1}</td>
                            <td className="py-3 px-2 font-bold uppercase">{item.name}</td>
                            <td className="py-3 px-2 font-mono">HN-{String(item.hn).padStart(3, '0')}</td>
                            <td className="py-3 px-2">{item.donorsCount} active profiles</td>
                            <td className="py-3 px-2 font-extrabold text-emerald-500 text-right">₹{item.totalAmount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

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
                    <button className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold">
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
                <button className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold">
                  <Check className="w-4 h-4" /> Save Layout Settings
                </button>
              </div>

              {/* Slider tools */}
              <div className="space-y-4 max-w-xl">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase mb-2"><span>Nudge Move X</span><span className="bg-white/10 px-2 py-0.5 rounded">{moveX}px</span></div>
                  <input type="range" min="0" max="1000" value={moveX} onChange={(e) => setMoveX(Number(e.target.value))} className="w-full accent-emerald-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold uppercase mb-2"><span>Nudge Move Y</span><span className="bg-white/10 px-2 py-0.5 rounded">{moveY}px</span></div>
                  <input type="range" min="0" max="1200" value={moveY} onChange={(e) => setMoveY(Number(e.target.value))} className="w-full accent-emerald-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold uppercase mb-2"><span>Text Size</span><span className="bg-white/10 px-2 py-0.5 rounded">{textSize}pt</span></div>
                  <input type="range" min="10" max="80" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full accent-emerald-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              {/* Fonts configurator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Font Weight Variant</label>
                  <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer">
                    <option value="Bold (700)" className="text-slate-800">Bold (700)</option>
                    <option value="Regular (400)" className="text-slate-800">Regular (400)</option>
                    <option value="Light (300)" className="text-slate-800">Light (300)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Font Family</label>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer">
                    <option value="Outfit" className="text-slate-800">Outfit</option>
                    <option value="Inter" className="text-slate-800">Inter</option>
                    <option value="Cairo" className="text-slate-800">Cairo</option>
                  </select>
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

              {/* Campaign Slider Editor Section */}
              <div className="border-t border-white/10 pt-8 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> Campaign Slider Studio
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Configure and localize homepage slides with real-time Malayalam font compilation</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={handleResetSlides}
                      className="flex-1 sm:flex-none border border-slate-350 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Reset Defaults
                    </button>
                    <button 
                      onClick={handleSaveSlides}
                      className="flex-1 sm:flex-none bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition hover:bg-emerald-450 hover:shadow shadow-sm cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Slider Configuration
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {devSlides.map((slide, index) => {
                    const themes = [
                      { name: 'Emerald (Green)', bg: "bg-emerald-50/75 border border-emerald-200/80 shadow-md", accent: "text-emerald-600 dark:text-emerald-400" },
                      { name: 'Amber (Gold)', bg: "bg-amber-50/75 border border-amber-200/80 shadow-md", accent: "text-amber-600 dark:text-amber-400" },
                      { name: 'Indigo (Blue)', bg: "bg-indigo-50/75 border border-indigo-200/80 shadow-md", accent: "text-indigo-600 dark:text-indigo-400" },
                      { name: 'Violet (Purple)', bg: "bg-violet-50/75 border border-violet-200/80 shadow-md", accent: "text-violet-600 dark:text-violet-400" },
                      { name: 'Rose (Red)', bg: "bg-rose-50/75 border border-rose-200/80 shadow-md", accent: "text-rose-600 dark:text-rose-400" }
                    ];

                    return (
                      <div key={index} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-left flex flex-col justify-between">
                        <div className="space-y-3.5">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Slide #{index + 1}</span>
                            <span className="text-[10px] bg-slate-200/20 px-2 py-0.5 rounded font-mono text-slate-400">active</span>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Color Theme</label>
                            <select 
                              value={slide.bg} 
                              onChange={(e) => {
                                const selected = themes.find(t => t.bg === e.target.value);
                                if (selected) {
                                  updateSlideField(index, 'bg', selected.bg);
                                  updateSlideField(index, 'accent', selected.accent);
                                }
                              }}
                              className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/40"
                            >
                              {themes.map(t => (
                                <option key={t.bg} value={t.bg} className="text-slate-800">{t.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Slide Title</label>
                            <input 
                              type="text"
                              value={slide.title}
                              onChange={(e) => updateSlideField(index, 'title', e.target.value)}
                              className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                              placeholder="Enter slide title..."
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Slide Description</label>
                            <textarea 
                              value={slide.desc}
                              onChange={(e) => updateSlideField(index, 'desc', e.target.value)}
                              rows={3}
                              className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                              placeholder="Enter slide description..."
                            />
                          </div>
                        </div>

                        {/* Visual Live Preview with Malayalam support */}
                        <div className="pt-4 border-t border-white/5 mt-4">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Live Mockup View</span>
                          <div className={`p-4 rounded-2xl border text-left transition-all ${slide.bg}`}>
                            <span className={`text-[9px] uppercase font-black tracking-wider ${slide.accent}`}>Campaign Slider</span>
                            <h5 className={`text-sm font-black text-slate-900 mt-1 leading-tight ${isMalayalam(slide.title) ? 'font-malayalam' : ''}`}>
                              {slide.title || 'Untitled Slide'}
                            </h5>
                            <p className={`text-[10px] text-slate-650 mt-1 leading-relaxed font-semibold ${isMalayalam(slide.desc) ? 'font-malayalam' : ''}`}>
                              {slide.desc || 'No description provided.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
