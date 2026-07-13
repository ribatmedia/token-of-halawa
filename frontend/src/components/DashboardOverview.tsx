'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Heart, Users, CheckCircle, TrendingUp, Calendar, AlertCircle, 
  MapPin, ShieldCheck, Sun, Moon, Globe, MessageSquare, PlusCircle, 
  Download, RefreshCw, BarChart2, Activity, UserPlus, FileText, Check, 
  UserCheck, Trophy, Flame, Award, Star, Laptop, DollarSign, IndianRupee, Search, 
  Filter, Share2, CheckSquare, XCircle, Clock, KeyRound, Sparkles, Bell, Menu
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
    topVolunteers: 'Top Campaigners Leaderboard',
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
    topVolunteers: 'മികച്ച ക്യാമ്പയിനർമാർ',
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
    topVolunteers: 'قائمة المتصدرين من المنظمين',
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
    topVolunteers: 'முன்னணி பிரச்சாரகர்கள்',
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
  const todayCollectionTotal = verificationQueue.reduce((acc, item) => acc + (item.status === 'APPROVED' || item.status === 'PENDING' ? Number(item.amount) : 0), 0);
  const monthlyCollectionTotal = todayCollectionTotal;

  // Input states for Log Donation form
  const [donorIdInput, setDonorIdInput] = useState('');
  const [campaignIdInput, setCampaignIdInput] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('GENERAL');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Extended form fields from legacy screen
  const [donationTab, setDonationTab] = useState<'new' | 'renew'>('new');
  const [donorNameInput, setDonorNameInput] = useState('');
  const [donorPhoneInput, setDonorPhoneInput] = useState('');
  const [donorWhatsAppInput, setDonorWhatsAppInput] = useState('');
  const [donorAddressInput, setDonorAddressInput] = useState('');
  const [donationMonthInput, setDonationMonthInput] = useState('July');
  const [donationDateInput, setDonationDateInput] = useState('2026-07-13');
  const [amountStatusInput, setAmountStatusInput] = useState<'RECEIVED' | 'PENDING'>('RECEIVED');
  const [monthPlanInput, setMonthPlanInput] = useState('100/month');

  // Input states for Register Donor form
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorEmail, setNewDonorEmail] = useState('');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonorCategory, setNewDonorCategory] = useState('GENERAL');
  const [donorFormSuccess, setDonorFormSuccess] = useState(false);
  const [donorFormError, setDonorFormError] = useState('');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassDashboard, setSelectedClassDashboard] = useState<string>('Plus one');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('register') === 'true') {
        setAuthMode('register');
      }
    }
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
        setDonors(Array.isArray(donorsData) ? donorsData : donorsData.donors || []);
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
        let finalEmail = authEmail.trim();
        if (!finalEmail.includes('@')) {
          const slug = finalEmail.toLowerCase().replace(/\s+/g, '');
          if (/^\d+$/.test(slug)) {
            finalEmail = `hn${slug}@hidayaonline.org`;
          } else {
            finalEmail = `${slug}@hidayaonline.org`;
          }
        }
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: finalEmail, password: authPassword })
        });
        const data = await res.json();
        if (res.ok) {
          setAuth(data.accessToken, data.refreshToken, data.user, data.organization);
        } else {
          setAuthError(data.error || data.message || 'Login failed');
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
          setAuthError(data.error || data.message || 'Registration failed');
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

    if (!donorIdInput && donationTab === 'renew') {
      setFormError('Please select an existing donor');
      return;
    }
    if (!donorNameInput && donationTab === 'new') {
      setFormError('Please enter a donor name');
      return;
    }
    if (!donationAmount) {
      setFormError('Please enter an amount');
      return;
    }

    try {
      let donorId = donorIdInput;

      // Auto-create donor if new tab selected
      if (donationTab === 'new') {
        const cleanNameSlug = donorNameInput.toLowerCase().replace(/\s+/g, '');
        const generatedEmail = donorPhoneInput ? `${donorPhoneInput}@hidayaonline.org` : `${cleanNameSlug}-${Date.now()}@hidayaonline.org`;
        
        const donorRes = await fetch(`${API_URL}/donors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: donorNameInput,
            email: generatedEmail,
            phone: donorPhoneInput || undefined,
            category: donationType
          })
        });
        
        const donorData = await donorRes.json();
        if (!donorRes.ok) {
          setFormError(donorData.error || donorData.message || 'Failed to create new donor profile first.');
          return;
        }
        donorId = donorData.donor?.id || donorData.id;
      }

      // Submit the donation entry
      const res = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          donorId,
          campaignId: campaignIdInput || undefined,
          donationType,
          amount: Number(donationAmount),
          notes: notes || `Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Month: ${donationMonthInput}. Status: ${amountStatusInput}. Plan: ${monthPlanInput}`,
          paymentMethod
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        setDonorIdInput('');
        setDonorNameInput('');
        setDonorPhoneInput('');
        setDonorWhatsAppInput('');
        setDonorAddressInput('');
        setDonationAmount('');
        setNotes('');
        fetchDatabaseData(); // refresh list
      } else {
        setFormError(data.error || data.message || 'Failed to log donation entry');
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
        setDonorFormError(data.error || data.message || 'Failed to create donor');
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

    // Aggregate monthly data (last 6 months: Feb to Jul)
    const monthlyLabels = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const monthlyData = [0, 0, 0, 0, 0, 0];
    verificationQueue.forEach(item => {
      const date = new Date(item.createdAt);
      const m = date.getMonth(); // Feb=1, Mar=2, Apr=3, May=4, Jun=5, Jul=6
      if (m >= 1 && m <= 6) {
        monthlyData[m - 1] += Number(item.amount);
      }
    });

    // Aggregate weekly progress (for current month)
    const weeklyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const weeklyData = [0, 0, 0, 0];
    verificationQueue.forEach(item => {
      const date = new Date(item.createdAt);
      const day = date.getDate();
      const weekIdx = Math.min(3, Math.floor((day - 1) / 7));
      weeklyData[weekIdx] += Number(item.amount);
    });

    if (barChartRef.current) {
      if (barChartInst.current) barChartInst.current.destroy();
      barChartInst.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: monthlyLabels,
          datasets: [{
            label: 'Collected (₹)',
            data: monthlyData,
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
          labels: weeklyLabels,
          datasets: [{
            label: 'Campaign Target Goal Progress',
            data: weeklyData,
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
            <p className="text-xs opacity-60 mt-1.5">{authMode === 'register' ? 'Initialize Hub' : 'Campaigner Portal'}</p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {authMode === 'register' ? 'Email Address' : 'Campaigner ID / Email Address'}
              </label>
              <input 
                type="text" 
                required 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder={authMode === 'register' ? "e.g. info@hidayaonline.org" : "e.g. HN Code, Username or Email"}
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
      { id: 'donations', name: 'Donation Entries', icon: IndianRupee },
      { id: 'verify', name: 'Verify Physical', icon: ShieldCheck },
      { id: 'campaigners', name: 'Manage Campaigners', icon: Users },
      { id: 'campaigners-stats', name: 'Campaigners Stats', icon: FileText },
      { id: 'donors', name: 'Donors Directory', icon: UserCheck },
      { id: 'rankings', name: 'Class Rankings', icon: Trophy },
      { id: 'class-collections', name: 'Class Collections', icon: IndianRupee },
      { id: 'class-dashboard', name: 'Class Dashboard', icon: Laptop },
      { id: 'developer', name: 'Developer Tools', icon: KeyRound }
    ],
    leader: [
      { id: 'progress', name: 'Analytics', icon: BarChart2 },
      { id: 'campaigners', name: 'Campaigners', icon: Users },
      { id: 'rankings', name: 'Class Rankings', icon: Trophy },
      { id: 'verify', name: 'Verify Physical', icon: ShieldCheck },
      { id: 'donors', name: 'Donors Directory', icon: UserCheck },
      { id: 'v-history', name: 'My Receipts', icon: FileText }
    ],
    volunteer: [
      { id: 'v-overview', name: 'Dashboard', icon: Laptop },
      { id: 'v-add', name: 'Add Donation', icon: PlusCircle },
      { id: 'v-history', name: 'My Collections', icon: Clock },
      { id: 'v-leaderboard', name: 'Leaderboard', icon: Trophy },
      { id: 'v-messages', name: 'Messages', icon: MessageSquare }
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
        <div className="flex items-center justify-between lg:justify-start gap-3 mb-6 lg:mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
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
          
          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-350 dark:border-white/10 text-slate-800 dark:text-white"
          >
            {mobileMenuOpen ? <XCircle className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Collapsible Mobile Menu Wrapper */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block space-y-6 lg:space-y-8 flex-1 flex flex-col`}>
          {/* Unified Role Switcher Dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Switch Dashboard view</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-200/50 dark:bg-black/35 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="admin" className="text-slate-800">Super Administrator</option>
              <option value="leader" className="text-slate-800">Class Leader / Manager</option>
              <option value="volunteer" className="text-slate-800">Campaigner</option>
            </select>
          </div>

          {/* Dynamic Sidebar Links */}
          {selectedRole === 'volunteer' && (
            <div className="p-4 rounded-3xl bg-slate-200/50 dark:bg-black/20 border border-slate-300/80 dark:border-white/5 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-lg mb-3">
                {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'VO'}
              </div>
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase">{user?.fullName || 'Campaigner'}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Class: {(user as any)?.class || 'Final Year'} · ID: {(user as any)?.hn || '001'}</p>
              <span className="mt-2.5 inline-block bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Approved Active
              </span>
            </div>
          )}

          <nav className="flex-1 space-y-1.5">
            {sidebars[selectedRole].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { 
                    if (item.id === 'developer') {
                      window.location.href = '/developer';
                    } else {
                      setActiveTab(item.id); 
                      setMobileMenuOpen(false); 
                    }
                  }}
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
          <div className="pt-6 border-t border-white/10 text-xs opacity-60 flex flex-col gap-2">
            <p className="font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>User: {user?.fullName || 'Admin User'}</span>
            </p>
            <button onClick={clearAuth} className="text-red-500 font-bold hover:underline text-left">Logout Console</button>
          </div>
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
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">₹{todayCollectionTotal}</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">{t.monthlyCollection}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">₹{monthlyCollectionTotal}</h3>
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
                    <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-30" />
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
                          <td className="py-4 px-4 text-right text-emerald-550 dark:text-emerald-450 font-bold">₹{item.amount}</td>
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
                          <td className="py-4 px-4 text-emerald-500 font-bold">₹{item.amount}</td>
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
              
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-6 border-b border-slate-300/40 dark:border-white/5 pb-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-md">
                  <FileText className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Upload Donation Data</h3>
                  <p className="text-xs opacity-60 mt-0.5">Generate an instant premium receipt for the donor.</p>
                </div>
              </div>

              {/* Collections target grid counters at the top */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-200/50 dark:bg-black/10 border border-slate-300 dark:border-white/5 text-center">
                  <span className="text-[9px] uppercase font-bold opacity-60 block">New Collection</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">₹{todayCollectionTotal || 0}.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/5 dark:bg-emerald-500/5 border border-emerald-500/15 text-center">
                  <span className="text-[9px] uppercase font-bold opacity-60 block">Renew Collection</span>
                  <span className="text-base font-extrabold text-teal-600 dark:text-teal-400 mt-1 block">₹0.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-200/50 dark:bg-black/10 border border-slate-300 dark:border-white/5 text-center">
                  <span className="text-[9px] uppercase font-bold opacity-60 block">Total Collection</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">₹{todayCollectionTotal || 0}.00</span>
                </div>
              </div>

              {/* Donation Toggle Buttons (New Donor vs Renew) */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-200/50 dark:bg-black/20 rounded-2xl border border-slate-350 dark:border-white/5">
                <button 
                  type="button" 
                  onClick={() => setDonationTab('new')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    donationTab === 'new' 
                      ? 'bg-emerald-500 text-slate-950 shadow' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" /> New Donor
                </button>
                <button 
                  type="button" 
                  onClick={() => setDonationTab('renew')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    donationTab === 'renew' 
                      ? 'bg-emerald-500 text-slate-950 shadow' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Renew (Existing)
                </button>
              </div>

              {formSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Donation entry logged successfully! Pending leader verification.</span>
                </div>
              )}

              {formError && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-500 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddDonation} className="space-y-5">
                {/* Received Amount Input field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Received Amount (₹) *</label>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">ലഭിച്ച തുക നൽകുക</span>
                  </div>
                  
                  {/* Amount presets */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[100, 200, 313].map((val) => (
                      <button 
                        key={val} 
                        type="button" 
                        onClick={() => setDonationAmount(val.toString())} 
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                          donationAmount === val.toString() 
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                            : 'bg-white/5 border-slate-350 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setDonationAmount('')} 
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                        !['100', '200', '313'].includes(donationAmount) && donationAmount !== '' 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                          : 'bg-white/5 border-slate-350 dark:border-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 font-bold">₹</span>
                    <input 
                      type="number" 
                      required 
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-8 pr-4 py-3 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                    />
                  </div>
                </div>

                {/* NEW DONOR FIELDS */}
                {donationTab === 'new' && (
                  <div className="space-y-4 pt-2 border-t border-slate-300/40 dark:border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Name *</label>
                          <span className="text-[9px] text-slate-400 block">വരിക്കാരന്റെ പേര്</span>
                        </div>
                        <input 
                          type="text" 
                          required={donationTab === 'new'} 
                          value={donorNameInput}
                          onChange={(e) => setDonorNameInput(e.target.value)}
                          placeholder="Full name of donor"
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Phone Number *</label>
                          <span className="text-[9px] text-slate-400 block">ഫോൺ നമ്പർ</span>
                        </div>
                        <input 
                          type="text" 
                          required={donationTab === 'new'} 
                          value={donorPhoneInput}
                          onChange={(e) => setDonorPhoneInput(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">WhatsApp Number *</label>
                          <span className="text-[9px] text-slate-400 block">രസീത് അയക്കാനുള്ള നമ്പർ</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            required={donationTab === 'new'} 
                            value={donorWhatsAppInput}
                            onChange={(e) => setDonorWhatsAppInput(e.target.value)}
                            placeholder="For sending receipt"
                            className="flex-1 bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                          />
                          <button 
                            type="button" 
                            onClick={() => setDonorWhatsAppInput(donorPhoneInput)}
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-3 py-2.5 rounded-2xl font-bold hover:bg-emerald-500/20 transition whitespace-nowrap"
                          >
                            Same as phone
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Address / Place *</label>
                          <span className="text-[9px] text-slate-400 block">വരിക്കാരന്റെ സ്ഥലം</span>
                        </div>
                        <input 
                          type="text" 
                          required={donationTab === 'new'} 
                          value={donorAddressInput}
                          onChange={(e) => setDonorAddressInput(e.target.value)}
                          placeholder="City or Town"
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* RENEW DONOR FIELDS */}
                {donationTab === 'renew' && (
                  <div className="space-y-4 pt-2 border-t border-slate-300/40 dark:border-white/5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Profile (Select Profile) *</label>
                        <span className="text-[9px] text-slate-400 block">വരിക്കാരനെ തിരഞ്ഞെടുക്കുക</span>
                      </div>
                      <select 
                        required={donationTab === 'renew'} 
                        value={donorIdInput}
                        onChange={(e) => setDonorIdInput(e.target.value)}
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-805 dark:text-slate-200 outline-none cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-800">Select a Donor profile</option>
                        {donors.map(d => (
                          <option key={d.id} value={d.id} className="text-slate-850">{d.name} ({d.phone || 'No phone'})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Month & Date selector row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">For Month *</label>
                      <span className="text-[9px] text-slate-400 block">ഏത് മാസത്തെ വരിസംഖ്യ</span>
                    </div>
                    <select 
                      value={donationMonthInput}
                      onChange={(e) => setDonationMonthInput(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-805 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="One Time">One Time Payment</option>
                    </select>
                    <span className="text-[9px] text-slate-400 mt-1 block">പ്രതിമാസ വരിസംഖ്യയായി നൽകാൻ താല്പര്യമില്ലാത്തവർക്ക് One Time Payment തിരഞ്ഞെടുക്കാം.</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={donationDateInput}
                      onChange={(e) => setDonationDateInput(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                {/* Amount Status Toggle (Received vs Pending) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Amount Status *</label>
                    <span className="text-[9px] text-slate-400 block">തുക കൈപ്പറ്റിയോ എന്ന് രേഖപ്പെടുത്തുക</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setAmountStatusInput('RECEIVED')}
                      className={`flex items-center justify-center gap-2 p-3.5 border rounded-2xl text-xs font-bold transition-all ${
                        amountStatusInput === 'RECEIVED' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-white/5 border-slate-350 dark:border-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input type="radio" checked={amountStatusInput === 'RECEIVED'} readOnly className="accent-emerald-500" />
                      Received (In Hand)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAmountStatusInput('PENDING')}
                      className={`flex items-center justify-center gap-2 p-3.5 border rounded-2xl text-xs font-bold transition-all ${
                        amountStatusInput === 'PENDING' 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' 
                          : 'bg-white/5 border-slate-350 dark:border-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input type="radio" checked={amountStatusInput === 'PENDING'} readOnly className="accent-amber-500" />
                      Amount Pending (Not Given)
                    </button>
                  </div>
                </div>

                {/* Donor Month Plan Dropdown */}
                {donationTab === 'new' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Donor Month Plan *</label>
                    <select 
                      value={monthPlanInput}
                      onChange={(e) => setMonthPlanInput(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-805 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="100/month">100/month</option>
                      <option value="200/month">200/month</option>
                      <option value="313/month">313/month</option>
                      <option value="500/month">500/month</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-300/40 dark:border-white/5 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] hover:scale-[1.02] transition text-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Receipt
                  </button>
                </div>
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
                      Campaigners Directory
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Full list of registered campaigners, classes, and Hall Numbers (HN).</p>
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
                          <td className="py-4 px-4 text-xs font-bold text-slate-500 uppercase">Campaigner</td>
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

          {/* VIEW: Campaigners Stats */}
          {activeTab === 'campaigners-stats' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Campaigners Stats
                  </h3>
                  <p className="text-xs opacity-60 mt-1">Detailed breakdown of all active campaigners, targets, and collections.</p>
                </div>
              </div>

              <div className="overflow-x-auto flex-1 max-h-[500px]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-black">
                      <th className="py-3 px-4">HN</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Collected</th>
                      <th className="py-3 px-4">Receipts</th>
                      <th className="py-3 px-4">Target Progress</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignersList.map((item) => {
                      const collected = verificationQueue
                        .filter(q => q.notes?.includes(`Logged by: ${item.name}`))
                        .reduce((acc, q) => acc + Number(q.amount), 0);
                      const target = 10000;
                      const percent = Math.min(100, Math.round((collected / target) * 100));
                      const receiptsCount = verificationQueue.filter(q => q.notes?.includes(`Logged by: ${item.name}`)).length;
                      return (
                        <tr key={item.hn} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                          <td className="py-4 px-4 font-mono font-bold text-emerald-500">#{item.hn}</td>
                          <td className="py-4 px-4 font-bold uppercase">{item.name}</td>
                          <td className="py-4 px-4">{item.class}</td>
                          <td className="py-4 px-4 font-bold text-emerald-500">₹{collected.toLocaleString()}</td>
                          <td className="py-4 px-4 font-bold">{receiptsCount}</td>
                          <td className="py-4 px-4 min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200/50 dark:bg-black/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                              </div>
                              <span className="text-[10px] font-bold">{percent}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Active</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: Class Collections Directory */}
          {activeTab === 'class-collections' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <IndianRupee className="w-5 h-5 text-emerald-400" />
                    Class Collections Directory
                  </h3>
                  <p className="text-xs opacity-60 mt-1">Consolidated collections, targets, and progress analysis grouped by classes.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Final year', 'Degree Third year', 'Degree second year', 'Degree first year', 'Plus two', 'Plus one'].map((className) => {
                  const classCampaigners = campaignersList.filter(c => c.class === className);
                  const totalCampaigners = classCampaigners.length;
                  const collected = verificationQueue
                    .filter(q => q.notes?.includes(`Class: ${className}`))
                    .reduce((acc, q) => acc + Number(q.amount), 0);
                  const target = totalCampaigners * 10000;
                  const percent = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;
                  return (
                    <div key={className} className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-800 dark:text-white">{className}</h4>
                          <p className="text-[10px] opacity-60 mt-0.5">{totalCampaigners} Active Campaigners</p>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Live</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="opacity-50 text-[10px] uppercase font-bold">Collected</span>
                          <p className="font-extrabold text-emerald-500 mt-0.5">₹{collected.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="opacity-50 text-[10px] uppercase font-bold">Target</span>
                          <p className="font-bold text-slate-500 dark:text-slate-400 mt-0.5">₹{target.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Target Completion</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200/50 dark:bg-black/35 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: Class Dashboard */}
          {activeTab === 'class-dashboard' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Laptop className="w-5 h-5 text-emerald-400" />
                    Class Dashboard
                  </h3>
                  <p className="text-xs opacity-60 mt-1">Specific metrics, performance leaderboards, and progress statistics by class.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold opacity-60">Select Class:</span>
                  <select 
                    value={selectedClassDashboard}
                    onChange={(e) => setSelectedClassDashboard(e.target.value)}
                    className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-800 dark:text-white"
                  >
                    {['Final year', 'Degree Third year', 'Degree second year', 'Degree first year', 'Plus two', 'Plus one'].map(name => (
                      <option key={name} value={name} className="text-slate-800">{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const classCampaigners = campaignersList.filter(c => c.class === selectedClassDashboard);
                const totalCampaigners = classCampaigners.length;
                const collected = verificationQueue
                  .filter(q => q.notes?.includes(`Class: ${selectedClassDashboard}`))
                  .reduce((acc, q) => acc + Number(q.amount), 0);
                const avgCollected = totalCampaigners > 0 ? Math.round(collected / totalCampaigners) : 0;
                
                return (
                  <div className="space-y-6">
                    {/* Class mini-stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold opacity-50 uppercase">Total Class Collection</span>
                        <h4 className="text-2xl font-black text-emerald-500 mt-1">₹{collected.toLocaleString()}</h4>
                      </div>
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold opacity-50 uppercase">Active Campaigners</span>
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{totalCampaigners} Students</h4>
                      </div>
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold opacity-50 uppercase">Average Student Collection</span>
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">₹{avgCollected.toLocaleString()}</h4>
                      </div>
                    </div>

                    {/* Class leaderboard table */}
                    <div>
                      <h4 className="font-extrabold text-sm uppercase tracking-wider mb-3">Class Performance Leaderboard</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-black">
                              <th className="py-2.5 px-4">Class Rank</th>
                              <th className="py-2.5 px-4">HN</th>
                              <th className="py-2.5 px-4">Name</th>
                              <th className="py-2.5 px-4">Collected</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...classCampaigners]
                              .map(item => {
                                const amount = verificationQueue
                                  .filter(q => q.notes?.includes(`Logged by: ${item.name}`))
                                  .reduce((acc, q) => acc + Number(q.amount), 0);
                                return { ...item, amount };
                              })
                              .sort((a, b) => b.amount - a.amount)
                              .map((item, index) => {
                                const amount = item.amount;
                                return (
                                  <tr key={item.hn} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                                    <td className="py-3.5 px-4 font-extrabold text-slate-500">#{index + 1}</td>
                                    <td className="py-3.5 px-4 font-bold text-emerald-500">#{item.hn}</td>
                                    <td className="py-3.5 px-4 font-bold uppercase">{item.name}</td>
                                    <td className="py-3.5 px-4 font-extrabold text-emerald-500">₹{amount.toLocaleString()}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

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
                Live Class Leaderboard Rankings
              </h3>

              <div className="space-y-4 max-w-xl">
                {(() => {
                  const rankedClasses = ['Final year', 'Degree Third year', 'Degree second year', 'Degree first year', 'Plus two', 'Plus one']
                    .map((className) => {
                      const collected = verificationQueue
                        .filter(q => q.notes?.includes(`Class: ${className}`))
                        .reduce((acc, q) => acc + Number(q.amount), 0);
                      return { className, collected };
                    })
                    .sort((a, b) => b.collected - a.collected);

                  return rankedClasses.map((item, index) => (
                    <div key={item.className} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          index === 0 ? 'bg-amber-500 text-slate-950' : 
                          index === 1 ? 'bg-slate-300 text-slate-950' : 
                          index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          #{index + 1}
                        </span>
                        <h5 className="font-bold text-slate-800 dark:text-white uppercase">{item.className}</h5>
                      </div>
                      <span className="font-extrabold text-emerald-500">₹{item.collected.toLocaleString()}</span>
                    </div>
                  ));
                })()}
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
                  <p className="text-xs opacity-60">{"Dear {{donor_name}}, thank you for your contribution of ₹{{amount}} to Token of Halawa. Receipt: {{receipt_url}}."}</p>
                  <button className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold">
                    <Share2 className="w-3.5 h-3.5" /> Push Broadcast
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-white">Renewal Reminder Template</h4>
                  <p className="text-xs opacity-60">{"Assalamu Alaikum {{donor_name}}, your monthly contribution renewal of ₹{{amount}} is due. Click here to pay: {{pay_url}}."}</p>
                  <button className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold">
                    <Share2 className="w-3.5 h-3.5" /> Push Broadcast
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Viewport for Volunteer Overview dashboard */}
          {activeTab === 'v-overview' && (() => {
            // 1. Calculate stats for logged-in campaigner
            const myCollections = verificationQueue.filter(q => q.notes?.includes(`Logged by: ${user?.fullName || 'Campaigner'}`));
            const myCollectedTotal = myCollections.reduce((acc, q) => acc + Number(q.amount), 0);
            
            // Expected collections of donors registered by this campaigner (defaults to a sensible base target like ₹5,000)
            const myExpectedTotal = 5000; 
            const myNotReceivedTotal = Math.max(0, myExpectedTotal - myCollectedTotal);
            const myDonorsCount = new Set(myCollections.map(q => q.donorId)).size;

            // 2. Calculate ranks dynamically
            // Rank list of all campaigners sorted by their total collection
            const allCampaignerStats = campaignersList.map(c => {
              const total = verificationQueue
                .filter(q => q.notes?.includes(`Logged by: ${c.name}`))
                .reduce((acc, q) => acc + Number(q.amount), 0);
              return { name: c.name, class: c.class, total };
            }).sort((a, b) => b.total - a.total);

            // Find index of current campaigner in overall list
            const overallRankIndex = allCampaignerStats.findIndex(c => c.name.toLowerCase() === (user?.fullName || '').toLowerCase());
            const overallRank = overallRankIndex !== -1 ? overallRankIndex + 1 : 1;

            // Filter for current campaigner's class
            const myClass = (user as any)?.class || 'Plus one';
            const classCampaignerStats = allCampaignerStats.filter(c => c.class === myClass);
            const classRankIndex = classCampaignerStats.findIndex(c => c.name.toLowerCase() === (user?.fullName || '').toLowerCase());
            const classRank = classRankIndex !== -1 ? classRankIndex + 1 : 1;

            // 3. Leading Collectors (Top 3 Campaigners overall)
            const leadingCollectors = allCampaignerStats.slice(0, 3).map((item, i) => {
              const count = verificationQueue.filter(q => q.notes?.includes(`Logged by: ${item.name}`)).length;
              return { ...item, donorsCount: count };
            });

            // 4. Top Batches (Top 3 Classes)
            const topBatches = ['Final year', 'Degree Third year', 'Degree second year', 'Degree first year', 'Plus two', 'Plus one']
              .map(className => {
                const total = verificationQueue
                  .filter(q => q.notes?.includes(`Class: ${className}`))
                  .reduce((acc, q) => acc + Number(q.amount), 0);
                const donorsCount = campaignersList.filter(c => c.class === className).length;
                return { className, total, donorsCount };
              })
              .sort((a, b) => b.total - a.total)
              .slice(0, 3);

            return (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Message from Admin banner */}
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-800 dark:text-slate-200 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0"><Bell className="w-4 h-4" /></div>
                    <div>
                      <span className="font-bold block">Message from Admin <span className="opacity-50 text-[10px] font-normal ml-2">13 Jul 2026, 04:30 PM</span></span>
                      <span className="opacity-80">Campaign tracking active. Ensure all physical receipt uploads are verified.</span>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0">Mark as Read</button>
                </div>

                {/* Expected collection banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-650 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider opacity-75">Total Expected Collection</span>
                      <h2 className="text-4xl font-black mt-2">₹{myExpectedTotal.toLocaleString()}.00</h2>
                    </div>
                    <div className="flex gap-8 text-right">
                      <div>
                        <span className="text-[10px] uppercase font-bold opacity-75 block">Collected</span>
                        <span className="text-xl font-black text-emerald-300">₹{myCollectedTotal.toLocaleString()}.00</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold opacity-75 block">Not Received</span>
                        <span className="text-xl font-black text-amber-300">₹{myNotReceivedTotal.toLocaleString()}.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* personal stats metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Total Collected</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">₹{myCollectedTotal.toLocaleString()}.00</h3>
                  </div>
                  
                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold opacity-60 uppercase">Total Donors</span>
                      <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full">Active</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">
                      {myDonorsCount} <span className="text-xs font-medium opacity-50">profiles</span>
                    </h3>
                  </div>

                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Overall Rank</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">#{overallRank}</h3>
                  </div>

                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Class Rank</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">#{classRank}</h3>
                  </div>
                </div>

                {/* Bottom ranking boards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Leading Collectors (Top Students)
                    </h4>
                    <div className="space-y-3">
                      {leadingCollectors.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold uppercase text-slate-850 dark:text-white">{item.name}</p>
                            <p className="opacity-60 text-[10px] mt-0.5">{item.class} · {item.donorsCount} collections</p>
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Star className="w-4 h-4 text-indigo-500" />
                      Live Activity (Top Batches)
                    </h4>
                    <div className="space-y-3">
                      {topBatches.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold uppercase text-slate-850 dark:text-white">{item.className}</p>
                            <p className="opacity-60 text-[10px] mt-0.5">{item.donorsCount} active campaigners</p>
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

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
