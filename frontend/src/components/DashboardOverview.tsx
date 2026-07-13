'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Heart, Users, CheckCircle, TrendingUp, Calendar, AlertCircle, 
  MapPin, ShieldCheck, Sun, Moon, Globe, MessageSquare, PlusCircle, 
  Download, RefreshCw, BarChart2, Activity, UserPlus, FileText, Check, 
  UserCheck, Trophy, Flame, Award, Star, Laptop, DollarSign, Search, 
  Filter, Share2, CheckSquare, XCircle, Clock, KeyRound, Sparkles
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';

if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

// Fetch base endpoint URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
    syncStatus: 'PWA Offline Queue Synced',
    targetDonors: 'Target Donors',
    totalDonors: 'Total Donors',
    achievedPercent: 'Achieved %',
    totalCollected: 'Total Collected',
    targetProgress: 'Target Completion Progress',
    liveRankings: 'Live Rankings',
    expectedTotal: 'Expected Total'
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
    verifyDonations: 'ഡൊണേഷൻ വെриഫൈ ചെയ്യുക',
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
    syncStatus: 'ഓഫ്‌ലൈൻ ക്യൂ സമന്വയിപ്പിച്ചു',
    targetDonors: 'ലക്ഷ്യമിട്ട ദാതാക്കൾ',
    totalDonors: 'ആകെ ദാതാക്കൾ',
    achievedPercent: 'ലഭിച്ച ശതമാനം',
    totalCollected: 'ആകെ ശേഖരിച്ചത്',
    targetProgress: 'ലക്ഷ്യ പൂർത്തീകരണ പുരോഗതി',
    liveRankings: 'തത്സമയ റാങ്കിംഗ്',
    expectedTotal: 'പ്രതീക്ഷിക്കുന്ന തുക'
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
    syncStatus: 'تم مزامنة البيانات بدون إنترنت',
    targetDonors: 'المتبرعين المستهدفين',
    totalDonors: 'إجمالي المتبرعين',
    achievedPercent: 'نسبة الإنجاز',
    totalCollected: 'إجمالي المجموع',
    targetProgress: 'التقدم نحو الهدف',
    liveRankings: 'الترتيب المباشر',
    expectedTotal: 'المجموع المتوقع'
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
    syncStatus: 'ஆஃப்லைன் தரவு ஒத்திசைக்கப்பட்டது',
    targetDonors: 'இலக்கு நன்கொடையாளர்கள்',
    totalDonors: 'மொத்த நன்கொடையாளர்கள்',
    achievedPercent: 'அடைந்த சதவீதம்',
    totalCollected: 'மொத்தம் வசூலிக்கப்பட்டது',
    targetProgress: 'இலக்கு நிறைவு முன்னேற்றம்',
    liveRankings: 'நேரடி தரவரிசை',
    expectedTotal: 'எதிர்பார்க்கப்படும் மொத்தம்'
  }
};

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

export default function DashboardOverview() {
  const { theme, toggleTheme, token, user, organization, setAuth, clearAuth } = useAuthStore();
  const [lang, setLang] = useState<'en' | 'ml' | 'ar' | 'ta'>('en');
  const [isClient, setIsClient] = useState(false);
  const [showSyncAlert, setShowSyncAlert] = useState(false);
  const t = translations[lang];

  // Active Role and Menu Tab States
  const [selectedRole, setSelectedRole] = useState<'admin' | 'leader' | 'volunteer'>('admin');
  const [activeTab, setActiveTab] = useState<string>('analytics');

  // Input states for Auth forms
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authOrgName, setAuthOrgName] = useState('');
  const [authOrgSlug, setAuthOrgSlug] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Campaigner filter states
  const [campaignerSearch, setCampaignerSearch] = useState('');
  const [campaignerClassFilter, setCampaignerClassFilter] = useState('ALL');

  // Dynamic Live Database States
  const [donors, setDonors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [verificationQueue, setVerificationQueue] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [todayCollectionTotal, setTodayCollectionTotal] = useState<number>(0);
  const [monthlyCollectionTotal, setMonthlyCollectionTotal] = useState<number>(0);

  // Input states for Log Donation form
  const [donorIdInput, setDonorIdInput] = useState('');
  const [campaignIdInput, setCampaignIdInput] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('GENERAL');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Input states for Register Donor form
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorEmail, setNewDonorEmail] = useState('');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonorCategory, setNewDonorCategory] = useState('GENERAL');
  const [donorFormSuccess, setDonorFormSuccess] = useState(false);
  const [donorFormError, setDonorFormError] = useState('');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartInst = useRef<Chart | null>(null);
  const lineChartInst = useRef<Chart | null>(null);

  // Sync theme selection to document HTML node
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

  // Set default tabs when changing roles
  useEffect(() => {
    if (selectedRole === 'admin') setActiveTab('analytics');
    if (selectedRole === 'leader') setActiveTab('progress');
    if (selectedRole === 'volunteer') setActiveTab('v-overview');
  }, [selectedRole]);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setShowSyncAlert(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Live Database Data when authenticated
  const fetchDatabaseData = async () => {
    if (!token) return;
    try {
      // 1. Fetch Donors
      const donorsRes = await fetch(`${API_URL}/donors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (donorsRes.ok) {
        const donorsData = await donorsRes.json();
        setDonors(donorsData);
      }

      // 2. Fetch Campaigns
      const campaignsRes = await fetch(`${API_URL}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData);
      }

      // 3. Fetch Verification Queue
      const queueRes = await fetch(`${API_URL}/donations/queue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setVerificationQueue(queueData);
      }

    } catch (err) {
      console.error('Failed to load database values:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDatabaseData();
    }
  }, [token]);

  // Handle Login & Registration
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail, password: authPassword })
        });
        const data = await res.json();
        if (res.ok) {
          setAuth(data.accessToken, data.refreshToken, data.user, data.organization);
        } else {
          setAuthError(data.message || 'Login failed');
        }
      } else {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationName: authOrgName,
            slug: authOrgSlug,
            fullName: authFullName,
            email: authEmail,
            password: authPassword
          })
        });
        const data = await res.json();
        if (res.ok) {
          setAuth(data.accessToken, data.refreshToken, data.user, data.organization);
        } else {
          setAuthError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      setAuthError('Could not connect to API server. Please verify backend is running on port 5000.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Add Donation Entry API call
  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!donorIdInput || !donationAmount) {
      setFormError('Please fill out donor and amount');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          donorId: donorIdInput,
          campaignId: campaignIdInput || undefined,
          donationType,
          amount: Number(donationAmount),
          notes,
          paymentMethod
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        setDonorIdInput('');
        setCampaignIdInput('');
        setDonationAmount('');
        setNotes('');
        fetchDatabaseData(); // refresh list
      } else {
        setFormError(data.message || 'Failed to log donation entry');
      }
    } catch (err) {
      setFormError('Error logging donation. Verify backend connections.');
    }
  };

  // Register new Donor profile API call
  const handleRegisterDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonorFormError('');
    setDonorFormSuccess(false);

    if (!newDonorName || !newDonorEmail) {
      setDonorFormError('Please specify donor name and email');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newDonorName,
          email: newDonorEmail,
          phone: newDonorPhone || undefined,
          category: newDonorCategory
        })
      });
      const data = await res.json();
      if (res.ok) {
        setDonorFormSuccess(true);
        setNewDonorName('');
        setNewDonorEmail('');
        setNewDonorPhone('');
        fetchDatabaseData(); // refresh list
      } else {
        setDonorFormError(data.message || 'Failed to create donor');
      }
    } catch (err) {
      setDonorFormError('Error saving donor profile.');
    }
  };

  // Approve / Verify a pending receipt entry
  const handleApproveDonation = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`${API_URL}/donations/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchDatabaseData();
      }
    } catch (err) {
      console.error('Error verifying donation:', err);
    }
  };

  // Build Charts
  useEffect(() => {
    if (!isClient || !token) return;
    if (activeTab !== 'analytics' && activeTab !== 'progress') return;

    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = theme === 'dark' ? '#94a3b8' : '#334155';

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
            y: { grid: { color: gridColor }, ticks: { color: textColor } },
            x: { grid: { display: false }, ticks: { color: textColor } }
          }
        }
      });
    }

    if (lineChartRef.current) {
      if (lineChartInst.current) lineChartInst.current.destroy();
      lineChartInst.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [{
            label: 'Campaign Target Goal Progress',
            data: [5000, 12000, 19000, 34000, 48500],
            borderColor: '#d97706',
            backgroundColor: 'rgba(217, 119, 6, 0.15)',
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
            y: { grid: { color: gridColor }, ticks: { color: textColor } },
            x: { grid: { display: false }, ticks: { color: textColor } }
          }
        }
      });
    }
  }, [isClient, theme, lang, activeTab, token]);

  if (!isClient) return null;

  const glassClass = theme === 'dark' ? 'apple-glass text-slate-100' : 'apple-glass-light text-slate-800';

  // Auth Overlay Modal (rendered if token is absent)
  if (!token) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-6 transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'bg-[#030712]' : 'bg-slate-100'}`}>
        
        {/* Background Ambient Color Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 pointer-events-none" />
        
        <div className={`w-full max-w-md p-8 rounded-3xl border border-white/10 relative z-10 ${glassClass}`}>
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/25 mb-4">
              <Heart className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Token of Halawa</h2>
            <p className="text-xs opacity-60 mt-1.5">Enterprise Donation Management Portal</p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login/Register switch tabs */}
          <div className="flex bg-slate-200/50 dark:bg-black/25 p-1 rounded-2xl mb-6">
            <button 
              type="button" 
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${authMode === 'login' ? 'bg-white dark:bg-white/10 text-[#0f4c81] dark:text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${authMode === 'register' ? 'bg-white dark:bg-white/10 text-[#0f4c81] dark:text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Register Admin
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Organization Name</label>
                  <input 
                    type="text" 
                    required 
                    value={authOrgName}
                    onChange={(e) => setAuthOrgName(e.target.value)}
                    placeholder="e.g. Markaz Union"
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Organization Slug (Unique Identifier)</label>
                  <input 
                    type="text" 
                    required 
                    value={authOrgSlug}
                    onChange={(e) => setAuthOrgSlug(e.target.value)}
                    placeholder="e.g. markaz-union"
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="e.g. Admin Manager"
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="e.g. info@ihyaussunna.in"
                className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition text-sm flex justify-center items-center gap-2 mt-6"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : authMode === 'login' ? 'Access Console' : 'Initialize Hub'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Role sidebar items configuration
  const sidebars = {
    admin: [
      { id: 'analytics', name: 'Analytics', icon: BarChart2 },
      { id: 'donations', name: 'Donation Entries', icon: DollarSign },
      { id: 'verify', name: 'Verify Physical', icon: ShieldCheck },
      { id: 'campaigners', name: 'Manage Campaigners', icon: Users },
      { id: 'donors', name: 'Donors Directory', icon: UserCheck },
      { id: 'add-donor', name: 'Add Donor Profile', icon: UserPlus },
      { id: 'rankings', name: 'Class Rankings', icon: Trophy }
    ],
    leader: [
      { id: 'progress', name: 'Class Progress', icon: TrendingUp },
      { id: 'campaigners', name: 'Campaigners Stats', icon: Users },
      { id: 'verify', name: 'Verify Payments', icon: ShieldCheck },
      { id: 'donors', name: 'Class Donors', icon: UserCheck }
    ],
    volunteer: [
      { id: 'v-overview', name: 'Dashboard', icon: Laptop },
      { id: 'v-add', name: 'Add Donation', icon: PlusCircle },
      { id: 'v-history', name: 'My Collections', icon: Clock },
      { id: 'v-leaderboard', name: 'Leaderboard', icon: Trophy },
      { id: 'v-messages', name: 'Broadcast Messages', icon: MessageSquare }
    ]
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 overflow-x-hidden flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-[#030712]' : 'bg-slate-100'}`}>
      
      {/* Background Ambient Color Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full ambient-glow-3 pointer-events-none" />

      {/* 1. Left Sidebar Navigation Container */}
      <aside className={`relative z-10 w-full lg:w-72 p-6 flex flex-col border-r border-white/5 shrink-0 ${glassClass} rounded-r-none lg:rounded-r-3xl`}>
        
        {/* Brand Banner */}
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg">
            <Heart className="w-6 h-6 text-emerald-500 dark:text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-400 dark:to-amber-400 bg-clip-text text-transparent leading-none">
              Token of Halawa
            </h1>
            <p className="text-[8px] font-extrabold text-slate-500 tracking-widest mt-1.5 uppercase">{organization?.name || 'Donation Portal'}</p>
          </div>
        </div>

        {/* Unified Role Switcher Dropdown */}
        <div className="mb-8">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Switch Dashboard view</label>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-200/50 dark:bg-black/35 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="admin" className="text-slate-800">Super Administrator</option>
            <option value="leader" className="text-slate-800">Class Leader / Manager</option>
            <option value="volunteer" className="text-slate-800">Volunteer / Campaigner</option>
          </select>
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-1 space-y-1.5">
          {sidebars[selectedRole].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl cursor-pointer text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer details */}
        <div className="mt-8 pt-6 border-t border-white/10 text-xs opacity-60 flex flex-col gap-2">
          <p className="font-bold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>User: {user?.fullName || 'Admin User'}</span>
          </p>
          <button onClick={clearAuth} className="text-red-500 font-bold hover:underline text-left">Logout Console</button>
        </div>
      </aside>

      {/* 2. Main Dashboard Panel Viewport */}
      <main className="flex-1 p-6 lg:p-8 relative z-10 flex flex-col min-h-screen">
        
        {/* Main Content Dashboard Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/5 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest opacity-60">
              {selectedRole.toUpperCase()} PORTAL
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
              {sidebars[selectedRole].find(item => item.id === activeTab)?.name || 'Portal Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync Status bar */}
            {showSyncAlert && (
              <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs px-3.5 py-2 rounded-full font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>{t.syncStatus}</span>
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center bg-slate-200/50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-2xl px-3 py-2 text-xs">
              <Globe className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold text-slate-700 dark:text-slate-300 pr-1"
              >
                <option value="en" className="text-slate-850">English</option>
                <option value="ml" className="text-slate-850">മലയാളം</option>
                <option value="ar" className="text-slate-850">العربية</option>
                <option value="ta" className="text-slate-850">தமிழ்</option>
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 bg-slate-200/50 dark:bg-black/20 hover:bg-slate-300/50 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT ROUTER PANELS */}
        <div className="flex-1 flex flex-col gap-6">

          {/* VIEW: Analytics (Admin & Leader Dashboard graphs) */}
          {(activeTab === 'analytics' || activeTab === 'progress') && (
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">{t.todayCollection}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">${todayCollectionTotal}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">{t.monthlyCollection}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">${monthlyCollectionTotal}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">{t.pendingVerification}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{verificationQueue.length} Entries</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">{t.activeDonors}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{donors.length} Profiles</h3>
                </div>
              </div>

              {/* Progress meters for Leader Overview */}
              {activeTab === 'progress' && (
                <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white">{t.targetProgress}</h4>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs opacity-60">
                    <span>{donors.length} Donors Logged</span>
                    <span>Min Target: 1,500 Donors (82%)</span>
                  </div>
                </div>
              )}

              {/* Chart panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    {t.chartGrowth}
                  </h3>
                  <div className="h-64 relative">
                    <canvas ref={barChartRef}></canvas>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    {t.chartTrend}
                  </h3>
                  <div className="h-64 relative">
                    <canvas ref={lineChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Donation Entries / My Collections History Table */}
          {(activeTab === 'donations' || activeTab === 'v-history') && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transaction reference, donor name or ID..."
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="overflow-x-auto flex-1">
                {verificationQueue.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">No active collections logged in verification queue.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                        <th className="py-3 px-4">Receipt ID</th>
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationQueue.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 text-slate-800 dark:text-slate-300 font-medium">
                          <td className="py-4 px-4 font-mono text-xs truncate max-w-[150px]">{item.id}</td>
                          <td className="py-4 px-4">{item.donor?.name || 'General Donor'}</td>
                          <td className="py-4 px-4">{item.donationType}</td>
                          <td className="py-4 px-4 text-right text-emerald-550 dark:text-emerald-450 font-bold">${item.amount}</td>
                          <td className="py-4 px-4">
                            <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* VIEW: Verify Physical (Pending verification queue) */}
          {activeTab === 'verify' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-500" />
                Pending Verification Approval Queue
              </h3>
              <p className="text-xs opacity-60 mb-6">Verify and approve physical donation entries logged by campaigners.</p>

              <div className="overflow-x-auto">
                {verificationQueue.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">All collections verified. Queue is empty.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Logged Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationQueue.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                          <td className="py-4 px-4 font-mono text-xs truncate max-w-[120px]">{item.id}</td>
                          <td className="py-4 px-4 font-bold">{item.donor?.name || 'General Donor'}</td>
                          <td className="py-4 px-4 text-emerald-500 font-bold">${item.amount}</td>
                          <td className="py-4 px-4 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-4 text-right flex justify-end gap-2">
                            <button 
                              onClick={() => handleApproveDonation(item.id, 'APPROVED')}
                              className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-bold"
                            >
                              <CheckSquare className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button 
                              onClick={() => handleApproveDonation(item.id, 'REJECTED')}
                              className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-600 dark:text-red-400 text-xs px-3 py-1.5 rounded-xl font-bold"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* VIEW: Add Donation Form */}
          {activeTab === 'v-add' && (
            <div className={`p-6 md:p-8 rounded-3xl max-w-2xl mx-auto flex-1 flex flex-col ${glassClass}`}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Log Donation Entry</h3>
                <p className="text-xs opacity-60 mt-1">Log a new contribution. The workflow will verify this transaction dynamically.</p>
              </div>

              {formSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Donation entry logged successfully! Pending leader verification.</span>
                </div>
              )}

              {formError && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddDonation} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Donor Name (Select Profile)</label>
                  <select 
                    required 
                    value={donorIdInput}
                    onChange={(e) => setDonorIdInput(e.target.value)}
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-800">Select a Donor profile</option>
                    {donors.map(d => (
                      <option key={d.id} value={d.id} className="text-slate-800">{d.name} ({d.email})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Amount ($)</label>
                    <input 
                      type="number" 
                      required 
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Donation Category</label>
                    <select 
                      value={donationType}
                      onChange={(e) => setDonationType(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="GENERAL">General</option>
                      <option value="MONTHLY">Monthly Contribution</option>
                      <option value="ZAKAT">Zakat</option>
                      <option value="SADAQAH">Sadaqah</option>
                      <option value="EMERGENCY">Emergency Fund</option>
                      <option value="EDUCATION">Education Fund</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Campaign Target</label>
                    <select 
                      value={campaignIdInput}
                      onChange={(e) => setCampaignIdInput(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="" className="text-slate-800">None / General Pool</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id} className="text-slate-800">{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Payment Method</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI Payment</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CARD">Credit/Debit Card</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="WALLET">Wallet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Notes / Reminders</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional details or physical receipt reference number..."
                    rows={3}
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3.5 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition text-sm"
                >
                  Log Collection Entry
                </button>
              </form>
            </div>
          )}

          {/* VIEW: Add Donor Profile */}
          {activeTab === 'add-donor' && (
            <div className={`p-6 md:p-8 rounded-3xl max-w-2xl mx-auto flex-1 flex flex-col ${glassClass}`}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Create Donor Profile</h3>
                <p className="text-xs opacity-60 mt-1">Register a new donor profile in the database directory.</p>
              </div>

              {donorFormSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Donor profile registered successfully!</span>
                </div>
              )}

              {donorFormError && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{donorFormError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterDonor} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Donor Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newDonorName}
                    onChange={(e) => setNewDonorName(e.target.value)}
                    placeholder="e.g. Yusuf Khan"
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={newDonorEmail}
                    onChange={(e) => setNewDonorEmail(e.target.value)}
                    placeholder="e.g. yusuf@gmail.com"
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
                  <input 
                    type="text" 
                    value={newDonorPhone}
                    onChange={(e) => setNewDonorPhone(e.target.value)}
                    placeholder="e.g. +91 90746 80630"
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Donor Category</label>
                  <select 
                    value={newDonorCategory}
                    onChange={(e) => setNewDonorCategory(e.target.value)}
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="GENERAL">General</option>
                    <option value="MONTHLY">Monthly Plan</option>
                    <option value="ZAKAT">Zakat Only</option>
                    <option value="SADAQAH">Sadaqah Sponsor</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3.5 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition text-sm"
                >
                  Create Donor Profile
                </button>
              </form>
            </div>
          )}

          {/* VIEW: Manage Campaigners & Campaigner Stats */}
          {activeTab === 'campaigners' && (() => {
            const filteredCampaigners = campaignersList.filter(item => {
              const matchesSearch = item.name.toLowerCase().includes(campaignerSearch.toLowerCase()) || item.hn.toString() === campaignerSearch;
              const matchesClass = campaignerClassFilter === 'ALL' || item.class === campaignerClassFilter;
              return matchesSearch && matchesClass;
            });

            return (
              <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Campaigner Volunteers Directory
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Full list of registered volunteers, classes, and Hall Numbers (HN).</p>
                  </div>
                </div>

                {/* Filter controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      value={campaignerSearch}
                      onChange={(e) => setCampaignerSearch(e.target.value)}
                      placeholder="Search campaigner by name or HN..."
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                  <div>
                    <select 
                      value={campaignerClassFilter}
                      onChange={(e) => setCampaignerClassFilter(e.target.value)}
                      className="bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL" className="text-slate-800">All Classes</option>
                      <option value="Final year" className="text-slate-800">Final year</option>
                      <option value="Degree Third year" className="text-slate-800">Degree Third year</option>
                      <option value="Degree second year" className="text-slate-800">Degree second year</option>
                      <option value="Degree first year" className="text-slate-800">Degree first year</option>
                      <option value="Plus two" className="text-slate-800">Plus two</option>
                      <option value="Plus one" className="text-slate-800">Plus one</option>
                    </select>
                  </div>
                </div>

                {/* Volunteers Table */}
                <div className="overflow-x-auto flex-1 max-h-[500px]">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                        <th className="py-3 px-4">HN</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Class / Batch</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCampaigners.map((item) => (
                        <tr key={item.hn} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                          <td className="py-4 px-4 font-mono font-bold text-emerald-500">#{item.hn}</td>
                          <td className="py-4 px-4 font-bold uppercase">{item.name}</td>
                          <td className="py-4 px-4">{item.class}</td>
                          <td className="py-4 px-4 text-xs font-bold text-slate-500 uppercase">Volunteer</td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* VIEW: Donors Directory */}
          {activeTab === 'donors' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  Donors Registry Directory
                </h3>
                <button 
                  onClick={() => setActiveTab('add-donor')}
                  className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-2xl text-xs font-bold"
                >
                  <UserPlus className="w-4 h-4" /> Add Donor Profile
                </button>
              </div>

              <div className="overflow-x-auto">
                {donors.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">No donor profiles registered in the database yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                        <th className="py-3 px-4">Unique ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.map((d) => (
                        <tr key={d.id} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                          <td className="py-4 px-4 font-mono text-xs text-amber-500 truncate max-w-[120px]">{d.id}</td>
                          <td className="py-4 px-4 font-bold">{d.name}</td>
                          <td className="py-4 px-4">{d.email}</td>
                          <td className="py-4 px-4">{d.phone || 'N/A'}</td>
                          <td className="py-4 px-4">
                            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">{d.category || 'GENERAL'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* VIEW: Class Rankings / Leaderboard */}
          {(activeTab === 'rankings' || activeTab === 'v-leaderboard') && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Live Campaign Leaderboard Rankings
              </h3>

              <div className="space-y-4 max-w-xl">
                {donors.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">No ranking statistics available.</p>
                  </div>
                ) : (
                  donors.slice(0, 5).map((d, index) => (
                    <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-amber-400">#{index + 1}</span>
                        <h5 className="font-bold text-slate-800 dark:text-white">{d.name}</h5>
                      </div>
                      <span className="font-black text-emerald-500">{d.category}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: Broadcast Messages (Volunteer notifications) */}
          {activeTab === 'v-messages' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                WhatsApp Alert Broadcast Console
              </h3>
              <p className="text-xs opacity-60 mb-6">Select template below to push manual or automated broadcast messages.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-white">Receipt Notification Template</h4>
                  <p className="text-xs opacity-60">{"Dear {{donor_name}}, thank you for your contribution of ${{amount}} to Token of Halawa. Receipt: {{receipt_url}}."}</p>
                  <button className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold">
                    <Share2 className="w-3.5 h-3.5" /> Push Broadcast
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-white">Renewal Reminder Template</h4>
                  <p className="text-xs opacity-60">{"Assalamu Alaikum {{donor_name}}, your monthly contribution renewal of ${{amount}} is due. Click here to pay: {{pay_url}}."}</p>
                  <button className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold">
                    <Share2 className="w-3.5 h-3.5" /> Push Broadcast
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Viewport for Volunteer Overview dashboard */}
          {activeTab === 'v-overview' && (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Volunteer personal statistics metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">My Today's Log</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">${todayCollectionTotal}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">My Active Donors</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{donors.length} Profiles</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">Target Completion</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">82%</h3>
                </div>
              </div>

              {/* Leaderboard and Collections side layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-3xl lg:col-span-2 ${glassClass}`}>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">My Today's Collections Log</h3>
                  <div className="space-y-3">
                    {verificationQueue.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-white">{item.donor?.name || 'General Donor'}</span>
                        <span className="font-bold text-emerald-500">${item.amount} ({item.status})</span>
                      </div>
                    ))}
                    {verificationQueue.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No collections logged today yet.</p>
                    )}
                  </div>
                </div>

                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">Target Completion Progress</h3>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <span className="text-[10px] text-slate-500">Collected ${todayCollectionTotal} today</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Global System Log footer */}
        <footer className="mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
          <p>&copy; 2026 Token of Halawa. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span>Connected to Neon PostgreSQL Cloud Database</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
