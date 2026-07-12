'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Heart, Users, CheckCircle, TrendingUp, Calendar, AlertCircle, 
  MapPin, ShieldCheck, Sun, Moon, Globe, MessageSquare, PlusCircle, 
  Download, RefreshCw, BarChart2, Activity, UserPlus, FileText, Check 
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

// Translations structure
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
    searchPlaceholder: 'Global command bar (Ctrl+K)...',
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
    // Simulate PWA offline sync alert
    const timer = setTimeout(() => {
      setShowSyncAlert(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
            backgroundColor: theme === 'dark' ? '#34a862' : '#25884b',
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
            y: { grid: { color: theme === 'dark' ? '#1e293b' : '#e2e8f0' } },
            x: { grid: { display: false } }
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
            borderColor: '#dca413',
            backgroundColor: 'rgba(220, 164, 19, 0.1)',
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
            y: { grid: { color: theme === 'dark' ? '#1e293b' : '#e2e8f0' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }, [isClient, theme, lang]);

  if (!isClient) return null;

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary-500 animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              Token of Halawa
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">{t.subtitle}</p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Offline Sync Status (PWA Support) */}
          {showSyncAlert && (
            <div className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs px-3 py-1.5 rounded-full animate-bounce">
              <Check className="w-3.5 h-3.5" />
              <span>{t.syncStatus}</span>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <Globe className="w-4 h-4 mr-2 text-slate-400" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1"
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
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            title={t.themeToggle}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-accent-400" /> : <Moon className="w-4 h-4 text-primary-600" />}
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Statistics Panels */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Today's Collection */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f1524] border-white/5 hover:border-primary-500/30' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">{t.todayCollection}</span>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight">$4,850.00</h3>
              <p className="text-xs text-primary-500 mt-1 font-semibold">+18.5% from yesterday</p>
            </div>
          </div>

          {/* Card 2: Monthly Collection */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f1524] border-white/5 hover:border-primary-500/30' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">{t.monthlyCollection}</span>
              <Calendar className="w-5 h-5 text-accent-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight">$42,390.00</h3>
              <p className="text-xs text-accent-500 mt-1 font-semibold">92% of target goal met</p>
            </div>
          </div>

          {/* Card 3: Pending Verification */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f1524] border-white/5 hover:border-primary-500/30' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">{t.pendingVerification}</span>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight">14 Receipts</h3>
              <p className="text-xs text-yellow-500 mt-1 font-semibold">Workflow queue: Active</p>
            </div>
          </div>

          {/* Card 4: Active Donors */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f1524] border-white/5 hover:border-primary-500/30' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">{t.activeDonors}</span>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight">1,240 Profiles</h3>
              <p className="text-xs text-indigo-500 mt-1 font-semibold">0 duplicate registrations</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Side Panel */}
        <div className="xl:col-span-1 row-span-3">
          <div className={`p-6 rounded-2xl border sticky top-6 ${theme === 'dark' ? 'bg-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              {t.quickActions}
            </h2>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 font-semibold text-sm transition-all border border-primary-500/20 text-left">
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  {t.logDonation}
                </span>
                <span className="text-xs font-normal opacity-60">Ctrl+N</span>
              </button>

              <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-semibold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {t.registerDonor}
                </span>
              </button>

              <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-semibold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {t.verifyDonations}
                </span>
                <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded-full font-bold">14</span>
              </button>

              <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-semibold text-sm transition-all text-left">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  {t.whatsappReceipt}
                </span>
              </button>
            </div>

            {/* Outstanding Balance Banner */}
            <div className="mt-6 p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
              <span className="text-xs uppercase font-bold tracking-wider">{t.outstandingAmount}</span>
              <h4 className="text-xl font-bold mt-1">$12,450.00</h4>
              <p className="text-[10px] mt-1 opacity-80">Auto renewal engine calculated outstanding balances</p>
            </div>
          </div>
        </div>

        {/* Dynamic Charts Modules */}
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary-500" />
              {t.chartGrowth}
            </h3>
            <div className="h-64 relative">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-500" />
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
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4">{t.heatmap}</h3>
            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const opacities = ['bg-primary-500/10', 'bg-primary-500/30', 'bg-primary-500/60', 'bg-primary-500/90'];
                const color = opacities[i % 4];
                return (
                  <div key={i} className={`h-8 rounded-md ${color} transition-all duration-300 hover:scale-110 cursor-pointer`} title={`Velocity Index: ${(i + 1) * 3}`} />
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4 text-[10px] text-slate-500">
              <span>Monday</span>
              <span>Sunday</span>
              <span className="flex items-center gap-1 font-bold">
                <span className="w-2.5 h-2.5 bg-primary-500 rounded" />
                Velocity Peak
              </span>
            </div>
          </div>

          {/* Leaders Board Summary */}
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4">{t.topVolunteers}</h3>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent-500 text-sm">#1</span>
                  <div>
                    <h5 className="font-semibold">Ahmad Sulaiman</h5>
                    <span className="text-[10px] text-slate-500">Sector Alpha</span>
                  </div>
                </div>
                <span className="font-bold text-primary-500">$12,400</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 text-sm">#2</span>
                  <div>
                    <h5 className="font-semibold">Fathima R.</h5>
                    <span className="text-[10px] text-slate-500">Unit Gamma</span>
                  </div>
                </div>
                <span className="font-bold text-primary-500">$9,850</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-700 text-sm">#3</span>
                  <div>
                    <h5 className="font-semibold">Zayn Khalid</h5>
                    <span className="text-[10px] text-slate-500">Class 10B</span>
                  </div>
                </div>
                <span className="font-bold text-primary-500">$8,900</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Activities Footer Pane */}
        <div className="xl:col-span-3">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="text-sm font-bold text-slate-400 mb-4">{t.recentActivity}</h3>
            <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[2026-07-12 23:14:11] AUDIT_LOG: Donor merge executed on target TOH-D-000104. Source ID soft-deleted.</span>
                <span className="text-slate-500">IP: 192.168.1.144</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[2026-07-12 23:09:45] WORKFLOW: Donation verification stage advanced to LEVEL 3 (Area Manager Approved).</span>
                <span className="text-slate-500">IP: 192.168.1.185</span>
              </div>
              <div className="flex justify-between">
                <span>[2026-07-12 23:01:05] SEC_WATCH: Session refresh tokens issued for user uid_admin_09.</span>
                <span className="text-slate-500">IP: 192.168.1.102</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
