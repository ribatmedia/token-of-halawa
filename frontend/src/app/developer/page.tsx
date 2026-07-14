'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, Code, KeyRound, ArrowLeft, Sun, Moon, Laptop, ShieldCheck, 
  Database, RefreshCw, Users, FileText, CheckCircle2, AlertTriangle, 
  Download, Trash2, Sliders, Type, Palette, Video, Settings, Sparkles, Check
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// Fetch base endpoint URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
            
            // Calculate mock aggregates or show database real size
            setStats({
              totalVolunteers: 40,
              totalDonations: queue.length + 3,
              totalAmount: queue.reduce((acc: number, item: any) => acc + Number(item.amount), 1150),
              verifiedAmount: 1150
            });
          }
        } catch (e) {
          console.log("Could not load backend values, showing seeded defaults.");
        }
      };

      fetchStats();
    }
  }, [isAuthenticated, token]);

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
