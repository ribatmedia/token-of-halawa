'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Heart, Users, CheckCircle, TrendingUp, Calendar, AlertCircle, 
  MapPin, ShieldCheck, Sun, Moon, Globe, MessageSquare, PlusCircle, 
  Download, RefreshCw, BarChart2, Activity, UserPlus, FileText, Check, ChevronRight 
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

const translations = {
  en: {
    title: 'Intelligent Donation Hub',
    subtitle: 'Token of Halawa donation intelligence engine',
    todayCollection: "Today's Collection",
    monthlyCollection: 'Monthly Collection',
    pendingVerification: 'Pending Verification',
    activeDonors: 'Active Donors',
    quickActions: 'Quick Actions',
    logDonation: 'Log Donation',
    registerDonor: 'Register Donor',
    verifyDonations: 'Verify Collections',
    whatsappReceipt: 'WhatsApp Broadcast',
    topVolunteers: 'Top Volunteers Leaderboard',
    topClasses: 'Top Classes',
    recentActivity: 'Recent Security & System Logs',
    heatmap: 'Weekly Donation Velocity Heatmap',
    chartGrowth: 'Monthly Donation Growth Trajectory',
    chartTrend: 'Campaign Collection Progression',
    searchPlaceholder: 'Search collections, donors, or areas...',
    outstandingAmount: 'Outstanding Renewal Balance',
    themeToggle: 'Toggle Theme Mode',
    languageToggle: 'Change Language',
    syncStatus: 'PWA Offline Queue Synced'
  },
  ml: {
    title: 'ഇന്റലിജന്റ് ഡൊണേഷൻ ഹബ്',
    subtitle: 'ടോക്കൺ ഓഫ് ഹലാവ ഡൊണേഷൻ സിസ്റ്റം',
    todayCollection: 'ഇന്നത്തെ സംഭാവന',
    monthlyCollection: 'പ്രതിമാസ സംഭാവന',
    pendingVerification: 'പരിശോധനയിലുള്ളവ',
    activeDonors: 'സജീവ ദാതാക്കൾ',
    quickActions: 'ദ്രുത പ്രക്രിയകൾ',
    logDonation: 'ഡൊണേഷൻ രേഖപ്പെടുത്തുക',
    registerDonor: 'ദാതാവിനെ ചേർക്കുക',
    verifyDonations: 'ഡൊണേഷൻ വെരിഫൈ ചെയ്യുക',
    whatsappReceipt: 'വാട്സാപ്പ് ബ്രോഡ്കാസ്റ്റ്',
    topVolunteers: 'മികച്ച വളണ്ടിയർമാർ',
    topClasses: 'മികച്ച ക്ലാസുകൾ',
    recentActivity: 'സമീപകാല പ്രവർത്തനങ്ങൾ',
    heatmap: 'ഡൊണേഷൻ വെലോസിറ്റി ഹീറ്റ്മാപ്പ്',
    chartGrowth: 'പ്രതിമാസ വളർച്ചാ നിരക്ക്',
    chartTrend: 'ക്യാമ്പയിൻ പുരോഗതി',
    searchPlaceholder: 'തിരയുക...',
    outstandingAmount: 'ബാക്കിയുള്ള കുടിശ്ശിക',
    themeToggle: 'തീം മാറ്റുക',
    languageToggle: 'ഭാഷ മാറ്റുക',
    syncStatus: 'ഓഫ്‌ലൈൻ ക്യൂ സമന്വയിപ്പിച്ചു'
  },
  ar: {
    title: 'مركز التبرعات الذكي',
    subtitle: 'نظام إدارة التبرعات توكن الحلاوة',
    todayCollection: 'تبرعات اليوم',
    monthlyCollection: 'التبرعات الشهرية',
    pendingVerification: 'في انتظار التحقق',
    activeDonors: 'المتبرعين النشطين',
    quickActions: 'إجراءات سريعة',
    logDonation: 'تسجيل تبرع',
    registerDonor: 'تسجيل متبرع',
    verifyDonations: 'التحقق من التبرعات',
    whatsappReceipt: 'بث واتساب',
    topVolunteers: 'لوحة متطوعي الصدارة',
    topClasses: 'أفضل الفصول الدراسية',
    recentActivity: 'سجلات النشاط الحديثة',
    heatmap: 'خريطة سرعة التبرع الأسبوعية',
    chartGrowth: 'مسار النمو الشهري',
    chartTrend: 'تقدم جمع الحملة',
    searchPlaceholder: 'بحث...',
    outstandingAmount: 'الرصيد المستحق للتجديد',
    themeToggle: 'تغيير المظهر',
    languageToggle: 'تغيير اللغة',
    syncStatus: 'تم مزامنة البيانات بدون إنترنت'
  },
  ta: {
    title: 'புத்திசாலித்தனமான நன்கொடை மையம்',
    subtitle: 'டோக்கன் ஆஃப் ஹலாவா நன்கொடை இயந்திரம்',
    todayCollection: 'இன்றைய நன்கொடை',
    monthlyCollection: 'மாதாந்திர நன்கொடை',
    pendingVerification: 'சரிபார்ப்பு நிலுவையில் உள்ளது',
    activeDonors: 'செயலில் உள்ள நன்கொடையாளர்கள்',
    quickActions: 'விரைவான செயல்கள்',
    logDonation: 'நன்கொடை பதிவுசெய்',
    registerDonor: 'நன்கொடையாளர் பதிவு',
    verifyDonations: 'நன்கொடைகளை சரிபார்',
    whatsappReceipt: 'வாட்ஸ்அப் ஒளிபரப்பு',
    topVolunteers: 'முன்னணி தன்னார்வலர்கள்',
    topClasses: 'முன்னணி வகுப்புகள்',
    recentActivity: 'சமீபத்திய நடவடிக்கைகள்',
    heatmap: 'வாராந்திர நன்கொடை வெப்ப வரைபடம்',
    chartGrowth: 'மாதாந்திர நன்கொடை வளர்ச்சி',
    chartTrend: 'அரசு நிதிப் போக்கு',
    searchPlaceholder: 'தேடுக...',
    outstandingAmount: 'நிலுவையில் உள்ள தொகை',
    themeToggle: 'வண்ண தீம் மாற்றம்',
    languageToggle: 'மொழியை மாற்றுக',
    syncStatus: 'ஆஃப்லைன் தரவு ஒத்திசைக்கப்பட்டது'
  }
};

export default function DashboardOverview() {
  const { theme, toggleTheme } = useAuthStore();
  const [lang, setLang] = useState<'en' | 'ml' | 'ar' | 'ta'>('en');
  const [isClient, setIsClient] = useState(false);
  const [showSyncAlert, setShowSyncAlert] = useState(false);
  const t = translations[lang];

  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInst = useRef<Chart | null>(null);
  const lineChartInst = useRef<Chart | null>(null);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setShowSyncAlert(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Define styling properties depending on light/dark mode
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

    // Build Bar Chart (Donation Growth)
    if (barChartRef.current) {
      if (barChartInst.current) barChartInst.current.destroy();
      barChartInst.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Collected ($)',
            data: [14200, 18500, 24000, 31000, 29000, 42000],
            backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.85)' : 'rgba(37, 136, 75, 0.85)',
            borderColor: theme === 'dark' ? 'rgba(16, 185, 129, 1)' : 'rgba(37, 136, 75, 1)',
            borderWidth: 1,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { 
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            x: { 
              grid: { display: false },
              ticks: { color: textColor }
            }
          }
        }
      });
    }

    // Build Line Chart (Campaign Trend)
    if (lineChartRef.current) {
      if (lineChartInst.current) lineChartInst.current.destroy();
      lineChartInst.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [{
            label: 'Target Goal Progress',
            data: [5000, 12000, 19000, 34000, 48500],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { 
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            x: { 
              grid: { display: false },
              ticks: { color: textColor }
            }
          }
        }
      });
    }
  }, [isClient, theme, lang]);

  if (!isClient) return null;

  const glassClass = theme === 'dark' ? 'apple-glass' : 'apple-glass-light';

  return (
    <div className={`min-h-screen relative p-6 md:p-8 transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Ambient Color Blobs (Apple Design Aesthetic) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full ambient-glow-3 pointer-events-none" />

      {/* Header Bar */}
      <header className={`relative z-10 flex flex-col md:flex-row md:items-center justify-between p-6 mb-8 rounded-3xl ${glassClass}`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <Heart className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
              Token of Halawa
            </h1>
            <p className="text-sm opacity-60 mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          {showSyncAlert && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3.5 py-2 rounded-full animate-bounce">
              <Check className="w-3.5 h-3.5" />
              <span>{t.syncStatus}</span>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center bg-white/5 dark:bg-black/20 border border-white/10 rounded-2xl px-3 py-2 text-xs">
            <Globe className="w-4 h-4 mr-2 text-slate-400" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent outline-none cursor-pointer font-semibold text-slate-300 pr-1"
            >
              <option value="en" className="text-slate-800">English</option>
              <option value="ml" className="text-slate-800">മലയാളം</option>
              <option value="ar" className="text-slate-800">العربية (RTL)</option>
              <option value="ta" className="text-slate-800">தமிழ்</option>
            </select>
          </div>

          {/* Theme Selector */}
          <button 
            onClick={toggleTheme} 
            className="p-2.5 bg-white/5 dark:bg-black/20 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-slate-200 transition-colors"
            title={t.themeToggle}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-10 grid grid-cols-1 xl:grid-cols-4 gap-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Statistics Panels */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Today's Collection */}
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60">{t.todayCollection}</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">$4,850.00</h3>
              <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1">
                <span>+18.5%</span>
                <span className="opacity-60 font-medium">from yesterday</span>
              </p>
            </div>
          </div>

          {/* Card 2: Monthly Collection */}
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60">{t.monthlyCollection}</span>
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">$42,390.00</h3>
              <p className="text-xs text-amber-400 mt-2 font-bold flex items-center gap-1">
                <span>92%</span>
                <span className="opacity-60 font-medium">of target goal met</span>
              </p>
            </div>
          </div>

          {/* Card 3: Pending Verification */}
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60">{t.pendingVerification}</span>
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">14 Receipts</h3>
              <p className="text-xs text-yellow-400 mt-2 font-bold flex items-center gap-1">
                <span>Active</span>
                <span className="opacity-60 font-medium">workflow queue</span>
              </p>
            </div>
          </div>

          {/* Card 4: Active Donors */}
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-60">{t.activeDonors}</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">1,240 Profiles</h3>
              <p className="text-xs text-indigo-400 mt-2 font-bold flex items-center gap-1">
                <span>Verified</span>
                <span className="opacity-60 font-medium">no duplicates</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Side Panel */}
        <div className="xl:col-span-1 row-span-3">
          <div className={`p-6 rounded-3xl sticky top-6 flex flex-col gap-6 ${glassClass}`}>
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                {t.quickActions}
              </h2>
              <p className="text-xs opacity-50 mt-1">Direct operations shortcuts</p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  {t.logDonation}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-normal">Ctrl+N</span>
              </button>

              <button className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {t.registerDonor}
                </span>
              </button>

              <button className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {t.verifyDonations}
                </span>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2.5 py-0.5 rounded-full font-bold">14</span>
              </button>

              <button className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-400" />
                  {t.whatsappReceipt}
                </span>
              </button>
            </div>

            {/* Outstanding Balance Banner */}
            <div className="mt-2 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 text-amber-400">
              <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-60">{t.outstandingAmount}</span>
              <h4 className="text-2xl font-extrabold mt-1">$12,450.00</h4>
              <p className="text-[10px] mt-1.5 opacity-60">System calculated pending monthly collections balance.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Charts Modules */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              {t.chartGrowth}
            </h3>
            <div className="h-64 relative">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>

          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              {t.chartTrend}
            </h3>
            <div className="h-64 relative">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Heatmap & Grid Activities */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Donation velocity heatmap */}
          <div className={`lg:col-span-2 p-6 rounded-3xl ${glassClass}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4">{t.heatmap}</h3>
            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-2.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const opacities = ['bg-emerald-500/10', 'bg-emerald-500/30', 'bg-emerald-500/60', 'bg-emerald-500/90'];
                const color = opacities[i % 4];
                return (
                  <div key={i} className={`h-8 rounded-lg ${color} transition-all duration-300 hover:scale-110 cursor-pointer border border-white/5`} title={`Velocity Index: ${(i + 1) * 3}`} />
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4 text-[10px] text-slate-400">
              <span>Monday</span>
              <span>Sunday</span>
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-md" />
                Velocity Peak
              </span>
            </div>
          </div>

          {/* Leaders Board Summary */}
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4">{t.topVolunteers}</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 text-xs">
                <div className="flex items-center gap-3.5">
                  <span className="font-extrabold text-amber-400 text-sm">#1</span>
                  <div>
                    <h5 className="font-bold text-slate-200">Ahmad Sulaiman</h5>
                    <span className="text-[10px] opacity-50">Sector Alpha</span>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">$12,400</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 text-xs">
                <div className="flex items-center gap-3.5">
                  <span className="font-extrabold text-slate-400 text-sm">#2</span>
                  <div>
                    <h5 className="font-bold text-slate-200">Fathima R.</h5>
                    <span className="text-[10px] opacity-50">Unit Gamma</span>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">$9,850</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3.5">
                  <span className="font-extrabold text-amber-700 text-sm">#3</span>
                  <div>
                    <h5 className="font-bold text-slate-200">Zayn Khalid</h5>
                    <span className="text-[10px] opacity-50">Class 10B</span>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">$8,900</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Activities Footer Pane */}
        <div className="xl:col-span-3">
          <div className={`p-6 rounded-3xl ${glassClass}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4">{t.recentActivity}</h3>
            <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[2026-07-12 23:14:11] AUDIT_LOG: Donor merge executed on target TOH-D-000104. Source ID soft-deleted.</span>
                <span className="opacity-50">IP: 192.168.1.144</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[2026-07-12 23:09:45] WORKFLOW: Donation verification stage advanced to LEVEL 3 (Area Manager Approved).</span>
                <span className="opacity-50">IP: 192.168.1.185</span>
              </div>
              <div className="flex justify-between">
                <span>[2026-07-12 23:01:05] SEC_WATCH: Session refresh tokens issued for user uid_admin_09.</span>
                <span className="opacity-50">IP: 192.168.1.102</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
