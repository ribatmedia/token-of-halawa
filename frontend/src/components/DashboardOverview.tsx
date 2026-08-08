'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Heart, Users, CheckCircle, TrendingUp, Calendar, AlertCircle, 
  MapPin, ShieldCheck, Sun, Moon, Globe, MessageSquare, PlusCircle, 
  Download, RefreshCw, BarChart2, Activity, UserPlus, FileText, Check, 
  UserCheck, Trophy, Flame, Award, Star, Laptop, DollarSign, IndianRupee, Search, 
  Filter, Share2, CheckSquare, XCircle, Clock, KeyRound, Sparkles, Bell, Menu, Trash2, Phone, X, Camera, Copy, Pencil,
  Receipt, FileSpreadsheet, List, BookOpen
} from 'lucide-react';
import ReceiptModal from './ReceiptModal';
import { ExportMenu } from './ExportMenu';
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
    expectedTotal: 'Expected Total',
    renewDonor: 'Renew Donor',
    donorsDirectory: 'Donors Directory',
    myCollections: 'My Collections',
    volunteerPortal: 'VOLUNTEER PORTAL',
    adminPortal: 'ADMIN PORTAL',
    dashboard: 'Dashboard',
    campaignerDashboard: 'Campaigner Dashboard',
    adminDashboard: 'Admin Dashboard',
    addDonation: 'Add Donation',
    leaderboard: 'Leaderboard',
    messages: 'Messages',
    overallRank: 'Overall Rank',
    classRank: 'Class Rank',
    leadingCollectors: 'Leading Collectors',
    profiles: 'profiles',
    active: 'Active',
    markAsRead: 'Mark as Read',
    messageFromAdmin: 'Message from Admin',
    analytics: 'Analytics',
    verifyPhysical: 'Verify Physical',
    manageCampaigners: 'Manage Campaigners',
    campaignersStats: 'Campaigners Stats',
    classRankings: 'Class Rankings',
    classCollections: 'Class Collections',
    classDashboard: 'Class Dashboard',
    developerTools: 'Developer Tools',
    myReceipts: 'My Receipts',
    donationEntries: 'Donation Entries'
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
    verifyDonations: 'ഡൊണേഷൻ വേരിഫൈ ചെയ്യുക',
    whatsappReceipt: 'വാട്സാപ്പ് ബ്രോഡ്കാസ്റ്റ്',
    topVolunteers: 'മികച്ച ക്യാമ്പയിനർമാർ',
    topClasses: 'മികച്ച ക്ലാസുകൾ',
    recentActivity: 'സമീപകാല പ്രവർത്തനങ്ങൾ',
    heatmap: 'ഡൊണേഷൻ ഹീറ്റ്മാപ്പ്',
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
    expectedTotal: 'പ്രതീക്ഷിക്കുന്ന തുക',
    renewDonor: 'പുതുക്കുക',
    donorsDirectory: 'ദാതാക്കളുടെ വിവരങ്ങൾ',
    myCollections: 'എന്റെ പിരിവുകൾ',
    volunteerPortal: 'വോളന്റിയർ പോർട്ടൽ',
    adminPortal: 'അഡ്മിൻ പോർട്ടൽ',
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    campaignerDashboard: 'ക്യാമ്പയിനർ ഡാഷ്‌ബോർഡ്',
    adminDashboard: 'അഡ്മിൻ ഡാഷ്‌ബോർഡ്',
    addDonation: 'സംഭാവന ചേർക്കുക',
    leaderboard: 'ലീഡർബോർഡ്',
    messages: 'സന്ദേശങ്ങൾ',
    overallRank: 'ആകെ റാങ്ക്',
    classRank: 'ക്ലാസ് റാങ്ക്',
    leadingCollectors: 'മുൻനിര പിരിവുകാർ',
    profiles: 'പ്രൊഫൈലുകൾ',
    active: 'ആക്ടീവ്',
    markAsRead: 'വായിച്ചതായി അടയാളപ്പെടുത്തുക',
    messageFromAdmin: 'അഡ്മിന്റെ സന്ദേശം',
    analytics: 'അനലിറ്റിക്സ്',
    verifyPhysical: 'വേരിഫൈ ചെയ്യുക',
    manageCampaigners: 'ക്യാമ്പയിനർമാർ',
    campaignersStats: 'ക്യാമ്പയിനർ സ്റ്റാറ്റ്സ്',
    classRankings: 'ക്ലാസ് റാങ്കിംഗ്',
    classCollections: 'ക്ലാസ്സ് പിരിവുകൾ',
    classDashboard: 'ക്ലാസ്സ് ഡാഷ്‌ബോർഡ്',
    developerTools: 'ഡെവലപ്പർ ടൂൾസ്',
    myReceipts: 'എന്റെ റസീപ്റ്റുകൾ',
    donationEntries: 'ഡൊണേഷൻ വിവരങ്ങൾ'
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
    expectedTotal: 'المجموع المتوقع',
    renewDonor: 'تجديد المتبرع',
    donorsDirectory: 'دليل المتبرعين',
    myCollections: 'تحصيلاتي',
    volunteerPortal: 'بوابة المتطوعين',
    adminPortal: 'بوابة المسؤول',
    dashboard: 'لوحة التحكم',
    campaignerDashboard: 'لوحة المنظم',
    adminDashboard: 'لوحة المسؤول',
    addDonation: 'إضافة تبرع',
    leaderboard: 'قائمة المتصدرين',
    messages: 'الرسائل',
    overallRank: 'الترتيب العام',
    classRank: 'ترتيب الصف',
    leadingCollectors: 'المحصلين المتصدرين',
    profiles: 'ملفات شخصية',
    active: 'نشط',
    markAsRead: 'تحديد كمقروء',
    messageFromAdmin: 'رسالة من المسؤول',
    analytics: 'التحليلات',
    verifyPhysical: 'التحقق الميداني',
    manageCampaigners: 'إدارة المنظمين',
    campaignersStats: 'إحصائيات المنظمين',
    classRankings: 'ترتيب الصفوف',
    classCollections: 'تحصيلات الصف',
    classDashboard: 'لوحة الصف',
    developerTools: 'أدوات المطور',
    myReceipts: 'إيصالاتي',
    donationEntries: 'سجلات التبرعات'
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
    heatmap: 'வாராந்திர நன்கொடை வரைபடம்',
    chartGrowth: 'மாதாந்திர நன்கொடை வளர்ச்சி',
    chartTrend: 'அரசு நிதி போக்கு',
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
    expectedTotal: 'எதிர்பார்க்கப்படும் மொத்தம்',
    renewDonor: 'புதுப்பிக்குக',
    donorsDirectory: 'நன்கொடையாளர் கோப்பகம்',
    myCollections: 'எனது வசூல்கள்',
    volunteerPortal: 'தன்னார்வலர் போர்டல்',
    adminPortal: 'நிர்வாகி போர்டல்',
    dashboard: 'டாஷ்போர்டு',
    campaignerDashboard: 'பிரச்சாரகர் டாஷ்போர்டு',
    adminDashboard: 'நிர்வாகி டாஷ்போர்டு',
    addDonation: 'நன்கொடை சேர்க்க',
    leaderboard: 'முன்னணிப் பட்டியல்',
    messages: 'செய்திகள்',
    overallRank: 'ஒட்டுமொத்த தரவரிசை',
    classRank: 'வகுப்பு தரவரிசை',
    leadingCollectors: 'முன்னணி வசூலிப்பாளர்கள்',
    profiles: 'சுயவிவரங்கள்',
    active: 'செயலில்',
    markAsRead: 'படித்ததாகக் குறிக்கவும்',
    messageFromAdmin: 'நிர்வாகியின் செய்தி',
    analytics: 'பகுப்பாய்வு',
    verifyPhysical: 'நேரடி சரிபார்ப்பு',
    manageCampaigners: 'பிரச்சாரகர்களை நிர்வகி',
    campaignersStats: 'பிரச்சாரகர் புள்ளிவிவரங்கள்',
    classRankings: 'வகுப்பு தரவரிசைகள்',
    classCollections: 'வகுப்பு வசூல்கள்',
    classDashboard: 'வகுப்பு டாஷ்போர்டு',
    developerTools: 'தேவலாப்பர் கருவிகள்',
    myReceipts: 'எனது ரசீதுகள்',
    donationEntries: 'நன்கொடை பதிவுகள்'
  }
};

const campaignersList = [
  // Developer Sandbox
  { hn: 0, name: "Developer", class: "Developer" },
  // Final year
  { hn: 1, name: "Asif ali", class: "Final year" },
  { hn: 2, name: "Bishrul wafa", class: "Final year" },
  { hn: 3, name: "Muhammed Falil", class: "Final year" },
  { hn: 4, name: "Sinan Cheekod", class: "Final year" },
  { hn: 5, name: "Sinan rafi", class: "Final year" },
  { hn: 6, name: "Ubayy Valliyad", class: "Final year" },
  // D3
  { hn: 7, name: "Adhil Ameen", class: "D3" },
  { hn: 8, name: "Hashir puthoor", class: "D3" },
  { hn: 9, name: "Muhammed shaheer", class: "D3" },
  { hn: 10, name: "Muhammed Riswan", class: "D3" },
  // D2
  { hn: 11, name: "Muhammed Ali", class: "D2" },
  { hn: 12, name: "Muhammed Fayis", class: "D2" },
  { hn: 13, name: "Sinan k", class: "D2" },
  { hn: 14, name: "Yaseen kondotty", class: "D2" },
  // D1
  { hn: 15, name: "Muhammed Melattoor", class: "D1" },
  { hn: 16, name: "Nihal valliyad", class: "D1" },
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

export default function DashboardOverview({ defaultRole = 'admin' }: { defaultRole?: 'admin' | 'campaigner' }) {
  const { theme, toggleTheme, token, user, organization, setAuth, clearAuth, _hasHydrated } = useAuthStore();
  const [lang, setLang] = useState<'en' | 'ml' | 'ar' | 'ta'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toh_language');
      if (saved && ['en', 'ml', 'ar', 'ta'].includes(saved)) {
        return saved as any;
      }
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('toh_language', lang);
    }
  }, [lang]);
  const [isClient, setIsClient] = useState(false);
  const [showSyncAlert, setShowSyncAlert] = useState(false);
  const t = translations[lang];
  const router = useRouter();
  const pathname = usePathname();

  // Active Role and Menu Tab States
  const [selectedRole, setSelectedRole] = useState<'admin' | 'leader' | 'volunteer'>(defaultRole === 'admin' ? 'admin' : 'volunteer');
  const [activeTab, setActiveTab] = useState<string>(defaultRole === 'admin' ? 'analytics' : 'v-overview');
  // Sync role and tab if user is a campaigner
  useEffect(() => {
    if (user && (user as any).hn) {
      if (pathname === '/admin') {
        clearAuth();
        return;
      }
      setSelectedRole('volunteer');
      // If the current tab is an admin tab, switch to volunteer overview
      const adminTabs = ['analytics', 'donations', 'verify', 'campaigners', 'campaigners-stats', 'donors', 'rankings', 'class-collections', 'class-dashboard', 'developer'];
      if (adminTabs.includes(activeTab)) {
        setActiveTab('v-overview');
      }
    } else if (user && !(user as any).hn) {
      if (pathname === '/campaigner') {
        clearAuth();
        return;
      }
      setSelectedRole('admin');
      // If admin, ensure they don't get stuck on volunteer tabs if they somehow got there
      const volunteerTabs = ['v-overview', 'v-history', 'v-leaderboard', 'v-messages'];
      if (volunteerTabs.includes(activeTab)) {
        setActiveTab('analytics');
      }
    } else if (!user) {
      setSelectedRole(defaultRole === 'admin' ? 'admin' : 'volunteer');
    }
  }, [user, pathname, clearAuth, defaultRole]);

  // Input states for Auth forms
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginRole, setLoginRole] = useState<'campaigner' | 'admin'>(defaultRole);

  // Sync loginRole with URL pathname
  useEffect(() => {
    if (pathname === '/admin') {
      setLoginRole('admin');
    } else if (pathname === '/campaigner') {
      setLoginRole('campaigner');
    } else {
      setLoginRole(defaultRole);
    }
  }, [pathname, defaultRole]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedHn, setSelectedHn] = useState('');
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
  const INITIAL_DONORS = [
    { id: 'dnr-1', name: 'Muhammed Shafi', phone: '9847012345', location: 'Calicut', category: 'GENERAL' },
    { id: 'dnr-2', name: 'Abdul Rahiman', phone: '9847054321', location: 'Malappuram', category: 'GENERAL' },
    { id: 'dnr-3', name: 'Usman Koya', phone: '9847099887', location: 'Wayanad', category: 'GENERAL' }
  ];

  const INITIAL_DONATIONS = [
    {
      id: 'TOH-2026-0001',
      amount: 100,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      donor: INITIAL_DONORS[0],
      notes: 'Logged by: Asif ali. Class: Final year. Month: July. Status: Paid. Plan: Monthly'
    },
    {
      id: 'TOH-2026-0002',
      amount: 500,
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
      donor: INITIAL_DONORS[1],
      notes: 'Logged by: Aneeb. Class: Plus one. Month: July. Status: Paid. Plan: Monthly'
    },
    {
      id: 'TOH-2026-0003',
      amount: 1000,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      donor: INITIAL_DONORS[2],
      notes: 'Logged by: Swalih. Class: Plus one. Month: July. Status: Paid. Plan: Monthly'
    }
  ];

  const [donors, setDonors] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toh_custom_donors');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_DONORS;
  });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toh_custom_donations');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_DONATIONS;
  });
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [customLayout, setCustomLayout] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('receipt_layout_settings');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [deletedDonationIds, setDeletedDonationIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toh_deleted_donations');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [deletedDonorIds, setDeletedDonorIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toh_deleted_donors');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('toh_deleted_donations', JSON.stringify(deletedDonationIds));
    }
  }, [deletedDonationIds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('toh_deleted_donors', JSON.stringify(deletedDonorIds));
    }
  }, [deletedDonorIds]);

  useEffect(() => {
    if (typeof window !== 'undefined' && Array.isArray(donations)) {
      localStorage.setItem('toh_custom_donations', JSON.stringify(donations));
    }
  }, [donations]);

  useEffect(() => {
    if (typeof window !== 'undefined' && Array.isArray(donors)) {
      localStorage.setItem('toh_custom_donors', JSON.stringify(donors));
    }
  }, [donors]);

  const safeDonors = (Array.isArray(donors) ? donors : []).filter(d => d && d.id && !deletedDonorIds.includes(String(d.id)));
  const safeDonations = (Array.isArray(donations) ? donations : []).filter(item => item && item.id && !deletedDonationIds.includes(String(item.id)));
  const safeVerificationQueue = safeDonations.filter(item => item && (item.status === 'PENDING' || item.status === 'Pending' || item.status === 'VERIFIED' || item.status === 'APPROVED'));

  const todayCollectionTotal = safeDonations.reduce((acc, item) => acc + (['APPROVED', 'VERIFIED', 'PENDING'].includes(item?.status) ? Number(item?.amount || 0) : 0), 0);
  const monthlyCollectionTotal = todayCollectionTotal;
  const activeDonorsCount = new Set(safeDonations.map(q => q.donorId || q.donor?.id || q.donor?.name?.trim()?.toLowerCase()).filter(Boolean)).size;

  // Dynamically aggregated list of all available donors across all sections & donations (deduplicated by phone/name)
  const allAvailableDonors = (() => {
    const map = new Map<string, any>();
    
    const getDonorKey = (d: any) => {
      const phone = (d?.phone || '').trim().replace(/\D/g, '');
      const name = (d?.name || '').trim().toLowerCase();
      if (phone && phone.length >= 7) return `phone:${phone}`;
      if (name) return `name:${name}`;
      return `id:${d?.id || Math.random()}`;
    };

    safeDonors.forEach(d => {
      if (d && (d.id || d.name || d.phone)) {
        const key = getDonorKey(d);
        if (!map.has(key)) {
          map.set(key, d);
        } else {
          const existing = map.get(key);
          map.set(key, {
            ...existing,
            phone: existing.phone || d.phone || '',
            location: existing.location || d.location || '',
            uniqueId: existing.uniqueId || d.uniqueId
          });
        }
      }
    });

    safeDonations.forEach(q => {
      const d = q?.donor;
      if (d && (d.id || d.name || d.phone)) {
        const key = getDonorKey(d);
        if (!map.has(key)) {
          map.set(key, {
            id: d.id || `dnr-${Date.now()}`,
            name: d.name || 'General Donor',
            phone: d.phone || '',
            location: d.location || 'Kerala',
            uniqueId: d.uniqueId
          });
        }
      }
    });

    return Array.from(map.values());
  })();

  // Input states for Log Donation form
  const [donorIdInput, setDonorIdInput] = useState('');
  const [campaignIdInput, setCampaignIdInput] = useState('');
  const [donationAmount, setDonationAmount] = useState('100');
  const [donationType, setDonationType] = useState('GENERAL');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAdminGuide, setShowAdminGuide] = useState(false);
  const [customSelectedMonths, setCustomSelectedMonths] = useState<string[]>([]);
  const [campaignerAvatar, setCampaignerAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedHn, setCopiedHn] = useState<number | null>(null);

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
  
  // Receipt Modal State
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceiptData, setSelectedReceiptData] = useState<any>(null);
  const [whatsAppAutoShare, setWhatsAppAutoShare] = useState(false);

  // Edit Donation Modal States
  const [editingDonation, setEditingDonation] = useState<any | null>(null);
  const [editDonorName, setEditDonorName] = useState('');
  const [editDonorPlace, setEditDonorPlace] = useState('');
  const [editDonorPhone, setEditDonorPhone] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editStatus, setEditStatus] = useState<'GIVEN' | 'NOT_GIVEN'>('GIVEN');
  const [editMonth, setEditMonth] = useState('June');
  const [editPlan, setEditPlan] = useState('100/month');

  const handleOpenEditModal = (item: any) => {
    const itemMonth = item.notes?.match(/Month:\s*([^\.]+)/)?.[1] || 'June';
    const itemPlan = item.notes?.match(/Plan:\s*([^\.]+)/)?.[1] || '100/month';
    const statusMatch = item.notes?.match(/Status:\s*([^\.]+)/)?.[1] || (item.status === 'PENDING' ? 'NOT_GIVEN' : 'GIVEN');

    setEditingDonation(item);
    setEditDonorName(item.donor?.name || '');
    setEditDonorPlace(item.donor?.location || item.donor?.category || 'Kerala');
    setEditDonorPhone(item.donor?.phone || '');
    setEditAmount(String(item.amount || '100'));
    setEditStatus(statusMatch === 'NOT_GIVEN' || item.status === 'PENDING' ? 'NOT_GIVEN' : 'GIVEN');
    setEditMonth(itemMonth);
    setEditPlan(itemPlan);
  };

  const handleSaveEditDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonation) return;

    const donationId = editingDonation.id;
    const isPending = editStatus === 'NOT_GIVEN';

    const loggedBy = editingDonation.notes?.match(/Logged by:\s*([^\.]+)/)?.[1] || user?.fullName || 'Campaigner';
    const itemClass = editingDonation.notes?.match(/Class:\s*([^\.]+)/)?.[1] || (user as any)?.class || 'Plus one';
    
    const updatedNotes = `Logged by: ${loggedBy}. Class: ${itemClass}. Month: ${editMonth}. Status: ${editStatus}. Plan: ${editPlan}`;

    // 1. Update donations state locally
    setDonations(prev => (Array.isArray(prev) ? prev : []).map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          amount: Number(editAmount) || d.amount,
          status: isPending ? 'PENDING' : 'APPROVED',
          notes: updatedNotes,
          donor: {
            ...d.donor,
            name: editDonorName,
            location: editDonorPlace,
            phone: editDonorPhone
          }
        };
      }
      return d;
    }));

    // 2. Update donors state locally
    const dId = editingDonation.donorId || editingDonation.donor?.id;
    if (dId) {
      setDonors(prev => (Array.isArray(prev) ? prev : []).map(donor => {
        if (donor.id === dId || donor.name === editingDonation.donor?.name) {
          return {
            ...donor,
            name: editDonorName,
            location: editDonorPlace,
            phone: editDonorPhone
          };
        }
        return donor;
      }));
    }

    setEditingDonation(null);
  };
  
  // Custom Donor Search State
  const [renewSearchQuery, setRenewSearchQuery] = useState('');
  const [isDonorDropdownOpen, setIsDonorDropdownOpen] = useState(false);

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

  // Donors Directory Advanced States
  const [donorSearchQuery, setDonorSearchQuery] = useState('');
  const [donorFilterCategory, setDonorFilterCategory] = useState('ALL');
  const [donorDirectoryCampaigner, setDonorDirectoryCampaigner] = useState('ALL');
  const [donorDirectoryStatus, setDonorDirectoryStatus] = useState('ALL');
  const [donorDirectoryMonth, setDonorDirectoryMonth] = useState('ALL');
  const [donorDirectoryPlan, setDonorDirectoryPlan] = useState('ALL');
  const [mergeSourceId, setMergeSourceId] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [mergeReason, setMergeReason] = useState('');
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState('');
  const [mergeError, setMergeError] = useState('');

  // Advanced View Filters
  const [donationClassFilter, setDonationClassFilter] = useState('ALL');
  const [donationCampaignerFilter, setDonationCampaignerFilter] = useState('ALL');
  const [donationMonthFilter, setDonationMonthFilter] = useState('ALL');
  const [donationStatusFilter, setDonationStatusFilter] = useState('ALL');
  const [verifyClassFilter, setVerifyClassFilter] = useState('ALL');
  const [verifySearchQuery, setVerifySearchQuery] = useState('');
  const [campStatsClassFilter, setCampStatsClassFilter] = useState('ALL');
  const [campStatsSearchQuery, setCampStatsSearchQuery] = useState('');

  // Class Handovers States
  const [classHandovers, setClassHandovers] = useState<any[]>([]);
  const [handoverClass, setHandoverClass] = useState('Plus one');
  const [handoverMonth, setHandoverMonth] = useState('July 2026');
  const [handoverAmount, setHandoverAmount] = useState('');
  const [handoverLeader, setHandoverLeader] = useState('');
  const [handoverPhone, setHandoverPhone] = useState('');
  const [handoverAdminName, setHandoverAdminName] = useState('');

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

  // Load handovers from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toh_class_handovers');
      if (saved) {
        try {
          setClassHandovers(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse toh_class_handovers", e);
        }
      }
    }
  }, []);

  // Show instructions modal for campaigner on first load of session
  useEffect(() => {
    if (selectedRole === 'volunteer') {
      const hasShown = sessionStorage.getItem('toh_instructions_shown');
      if (!hasShown) {
        setShowInstructions(true);
        sessionStorage.setItem('toh_instructions_shown', 'true');
      }
    }
  }, [selectedRole]);

  // Load avatar from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('toh_campaigner_avatar');
      if (savedAvatar) {
        setCampaignerAvatar(savedAvatar);
      }
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCampaignerAvatar(base64String);
        localStorage.setItem('toh_campaigner_avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset selected R.NO when changing class selector so no student is auto-selected
  useEffect(() => {
    setSelectedHn('');
  }, [selectedClass]);

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    if (searchParams) {
      if (searchParams.get('register') === 'true') {
        setAuthMode('register');
      }
    }
    const timer = setTimeout(() => {
      setShowSyncAlert(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (searchParams && _hasHydrated) {
      const roleParam = searchParams.get('role');
      if (roleParam === 'admin') {
        setLoginRole('admin');
        if (user && (user as any).hn) {
          clearAuth();
          setDonations([]);
          setDonors([]);
          setCampaigns([]);
        }
      } else if (roleParam === 'campaigner') {
        setLoginRole('campaigner');
        if (user && !(user as any).hn) {
          clearAuth();
          setDonations([]);
          setDonors([]);
          setCampaigns([]);
        }
      }
    }
  }, [searchParams, user, _hasHydrated, clearAuth]);

  // Fetch Live Database Data when authenticated
  const fetchDatabaseData = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [donorsRes, campaignsRes, queueRes, allDonationsRes] = await Promise.all([
        fetch(`${API_URL}/donors`, { headers }),
        fetch(`${API_URL}/campaigns`, { headers }),
        fetch(`${API_URL}/donations/queue`, { headers }),
        fetch(`${API_URL}/donations/all`, { headers })
      ]);

      if (donorsRes.ok) {
        const d = await donorsRes.json();
        if (Array.isArray(d)) setDonors(d);
      }
      if (campaignsRes.ok) {
        const c = await campaignsRes.json();
        if (Array.isArray(c)) setCampaigns(c);
      }
      if (allDonationsRes.ok) {
        const a = await allDonationsRes.json();
        if (Array.isArray(a)) setDonations(a);
      }
    } catch (err) {
      console.error('Failed to load database values:', err);
      // Demo fallback data if API server is offline
      const mockDonors = [
        { id: 'dnr-1', name: 'Muhammed Shafi', phone: '9847012345', location: 'Calicut', category: 'GENERAL' },
        { id: 'dnr-2', name: 'Abdul Rahiman', phone: '9847054321', location: 'Malappuram', category: 'GENERAL' },
        { id: 'dnr-3', name: 'Usman Koya', phone: '9847099887', location: 'Wayanad', category: 'GENERAL' }
      ];
      const mockDonations = [
        {
          id: 'TOH-2026-0001',
          amount: 500,
          status: 'VERIFIED',
          createdAt: new Date().toISOString(),
          donor: mockDonors[0],
          notes: 'Logged by: Aneeb. Class: Plus one. Month: July. Status: Paid. Plan: Monthly'
        },
        {
          id: 'TOH-2026-0002',
          amount: 1000,
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
          donor: mockDonors[1],
          notes: 'Logged by: Swalih. Class: Plus one. Month: July. Status: Paid. Plan: Monthly'
        },
        {
          id: 'TOH-2026-0003',
          amount: 100,
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
          donor: mockDonors[2],
          notes: 'Logged by: Asif ali. Class: Final year. Month: July. Status: Paid. Plan: Monthly'
        }
      ];
      setDonors(mockDonors);
      setDonations(mockDonations);
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

        if (loginRole === 'campaigner') {
          if (!selectedHn) {
            setAuthError('Please select your R.NO');
            setAuthLoading(false);
            return;
          }
          finalEmail = `hn${selectedHn}@hidayaonline.org`;
        } else {
          // Admin login check: prevent campaigners from logging in through admin portal
          if (!finalEmail.includes('@')) {
            const slug = finalEmail.toLowerCase().replace(/\s+/g, '');
            if (/^\d+$/.test(slug)) {
              setAuthError('Campaigners must use the Campaigner Login Portal.');
              setAuthLoading(false);
              return;
            }
            finalEmail = `${slug}@hidayaonline.org`;
          } else {
            const localPart = finalEmail.split('@')[0].toLowerCase();
            if (localPart.startsWith('hn') && /^\d+$/.test(localPart.slice(2))) {
              setAuthError('Campaigners must use the Campaigner Login Portal.');
              setAuthLoading(false);
              return;
            }
          }
        }

        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: finalEmail, password: authPassword })
        });
        const data = await res.json();
        if (res.ok) {
          let userObj = data.user;
          if (loginRole === 'campaigner') {
            const matched = campaignersList.find(c => String(c.hn) === selectedHn);
            if (matched) {
              userObj = {
                ...userObj,
                fullName: matched.name,
                class: matched.class,
                hn: String(matched.hn)
              };
            }
          }
          setAuth(data.accessToken, data.refreshToken, userObj, data.organization);
          if (loginRole === 'campaigner') {
            setSelectedRole('volunteer');
          }
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
      console.warn('API unavailable, performing demo login session:', err);
      let userObj: any = {
        id: loginRole === 'campaigner' ? selectedHn || '1' : 'admin-1',
        email: authEmail || 'admin@hidayaonline.org',
        fullName: loginRole === 'campaigner' ? (campaignersList.find(c => String(c.hn) === selectedHn)?.name || 'Campaigner User') : 'Admin User'
      };
      if (loginRole === 'campaigner') {
        const matched = campaignersList.find(c => String(c.hn) === selectedHn);
        if (matched) {
          userObj.class = matched.class;
          userObj.hn = String(matched.hn);
        }
      }
      setAuth('demo-access-token', 'demo-refresh-token', userObj, { id: 'org-1', name: 'Token of Halawa Hub' });
      if (loginRole === 'campaigner') {
        setSelectedRole('volunteer');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Add Donation Entry API call
  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    let monthCount = 1;
    if (donationMonthInput.startsWith('Custom:')) {
      const monthsArr = donationMonthInput.replace('Custom:', '').split(',').filter(m => m.trim());
      monthCount = monthsArr.length > 0 ? monthsArr.length : 1;
    }
    const splitAmount = Math.floor(Number(donationAmount) / monthCount);
    const extraAmount = Number(donationAmount) - (splitAmount * (monthCount - 1));
    const monthSplitStr = monthCount > 1 ? ` (Split: ${monthCount-1}x₹${splitAmount}, 1x₹${extraAmount})` : '';

    if (!donorIdInput && donationTab === 'renew') {
      setFormError('Please select an existing donor');
      return;
    }
    if (!donorNameInput && donationTab === 'new') {
      setFormError('Please enter a donor name');
      return;
    }
    if (!donorPhoneInput && donationTab === 'new') {
      setFormError('Please enter a valid 10-digit phone number');
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
        
        const attemptDonorCreate = async (force: boolean) => {
          const response = await fetch(`${API_URL}/donors`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              name: donorNameInput,
              email: generatedEmail,
              phone: donorPhoneInput || undefined,
              location: donorAddressInput || undefined,
              category: donationType,
              forceCreate: force
            })
          });
          return { res: response, data: await response.json() };
        };

        let { res: donorRes, data: donorData } = await attemptDonorCreate(false);

        // Handle Duplicate Phone Number Conflict (409)
        if (!donorRes.ok && donorRes.status === 409 && donorData.error?.includes('duplicate')) {
          const confirmForce = window.confirm(Buffer.from("4LSIIOC0q+C1i+C1uiDgtKjgtK7gtY3gtKrgtbwg4LSJ4LSq4LSv4LWL4LSX4LS/4LSa4LWN4LSa4LWNIOC0h+C0pOC0v+C0qOC0leC0giDgtJLgtLDgtYEg4LSh4LWL4LSj4LW8IOC0ieC0o+C1jeC0n+C1jS4g4LSO4LSZ4LWN4LSV4LS/4LSy4LWB4LSCIOC0quC1geC0pOC0v+C0r+C1iuC0sOC1gSDgtKHgtYvgtKPgtLHgtL7gtK/gtL8g4LSk4LWB4LSf4LSw4LSj4LSu4LWG4LSo4LWN4LSo4LWB4LSx4LSq4LWN4LSq4LS+4LSj4LWLPw==", "base64").toString("utf8") + "\n\n(This phone number is already registered. Are you sure you want to create a new, separate donor profile?)");
          if (confirmForce) {
            const retry = await attemptDonorCreate(true);
            donorRes = retry.res;
            donorData = retry.data;
          } else {
            setFormError("Action cancelled. Please use another phone number or choose 'Renew (Existing)'.");
            return;
          }
        }

        if (!donorRes.ok) {
          console.warn('Donor API creation error or invalid token, executing local fallback logging:', donorData);
          const newDonationId = `TOH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          let finalDonorName = donorNameInput || 'General Donor';

          const cleanPhone = (donorPhoneInput || '').trim().replace(/\D/g, '');
          const cleanName = (finalDonorName || '').trim().toLowerCase();

          const existingDonorObj = allAvailableDonors.find(d => {
            const dPhone = (d.phone || '').trim().replace(/\D/g, '');
            const dName = (d.name || '').trim().toLowerCase();
            if (cleanPhone && cleanPhone.length >= 7 && dPhone === cleanPhone) return true;
            if (cleanName && cleanName.length > 1 && dName === cleanName) return true;
            if (donorIdInput && String(d.id) === String(donorIdInput)) return true;
            return false;
          });

          const newDonorObj = existingDonorObj || { 
            id: `dnr-${Date.now()}`, 
            name: finalDonorName, 
            phone: donorPhoneInput || '', 
            location: donorAddressInput || 'Kerala',
            category: donationType
          };

          if (!existingDonorObj && donationTab === 'new') {
            setDonors(prev => [newDonorObj, ...(Array.isArray(prev) ? prev : [])]);
          }

          // All campaigner-logged entries are PENDING admin verification.
          // Payment status (whether cash is received or not) is tracked in notes.
          const paymentStatus = amountStatusInput === 'PENDING' ? 'NOT_RECEIVED' : 'RECEIVED';
          const entryStatus = 'PENDING';
          const newEntry = {
            id: newDonationId,
            amount: Number(donationAmount) || 100,
            status: entryStatus,
            createdAt: new Date().toISOString(),
            donor: newDonorObj,
            notes: notes ? `${notes} (Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Payment: ${paymentStatus})${monthSplitStr}` : `Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Month: ${donationMonthInput}${monthSplitStr}. Payment: ${paymentStatus}. Plan: ${monthPlanInput}`
          };

          setDonations(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
          setFormSuccess(true);

          setSelectedReceiptData({
            receiptNo: newDonationId,
            date: new Date().toISOString(),
            name: finalDonorName,
            place: donorAddressInput || 'Kerala',
            phone: donorPhoneInput || '',
            amount: donationAmount || '100',
            month: donationMonthInput,
            plan: monthPlanInput
          });
          setShowReceiptModal(true);

          setDonorIdInput('');
          setDonorNameInput('');
          setDonorPhoneInput('');
          setDonorWhatsAppInput('');
          setDonorAddressInput('');
          setDonationAmount('100');
          setNotes('');
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
          notes: notes ? `${notes} (Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'})${monthSplitStr}` : `Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Month: ${donationMonthInput}${monthSplitStr}. Status: ${amountStatusInput}. Plan: ${monthPlanInput}`,
          paymentMethod
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess(true);
        
        // Prepare data for ReceiptModal
        const newDonationId = data.donation?.id || data.id || Math.floor(1000 + Math.random() * 9000).toString();
        const cleanId = newDonationId.split('-')[0].slice(0, 4).toUpperCase();
        
        let finalDonorName = donorNameInput;
        if (donationTab === 'renew' && donorIdInput) {
          finalDonorName = allAvailableDonors.find(d => d.id === donorIdInput)?.name || renewSearchQuery || 'General Donor';
        }

        setSelectedReceiptData({
          receiptNo: data.donation?.receipts?.[0]?.receiptNumber || `TOH-2026-${cleanId}`,
          date: new Date().toISOString(),
          name: finalDonorName || 'General Donor',
          place: donorAddressInput || 'Kerala',
          phone: donorPhoneInput || '',
          amount: donationAmount,
          month: donationMonthInput,
          plan: monthPlanInput
        });
        setShowReceiptModal(true);

        setDonorIdInput('');
        setDonorNameInput('');
        setDonorPhoneInput('');
        setDonorWhatsAppInput('');
        setDonorAddressInput('');
        setDonationAmount('');
        setNotes('');
        
        const newEntry = {
          id: data.donation?.id || data.id,
          amount: Number(donationAmount),
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          donor: { id: donorId, name: finalDonorName, phone: donorPhoneInput || '', location: donorAddressInput || 'Kerala' },
          notes: data.donation?.notes || data.notes || `Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Month: ${donationMonthInput}. Status: ${amountStatusInput}. Plan: ${monthPlanInput}`
        };
        setDonations(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
        fetchDatabaseData(); // refresh list

      } else {
        console.warn('Donation API creation error, executing local fallback logging:', data);
        const newDonationId = `TOH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        let finalDonorName = donorNameInput || 'General Donor';
        if (donationTab === 'renew' && donorIdInput) {
          finalDonorName = allAvailableDonors.find(d => d.id === donorIdInput)?.name || renewSearchQuery || 'General Donor';
        }

        const cleanPhone = (donorPhoneInput || '').trim().replace(/\D/g, '');
        const cleanName = (finalDonorName || '').trim().toLowerCase();

        const existingDonorObj = allAvailableDonors.find(d => {
          const dPhone = (d.phone || '').trim().replace(/\D/g, '');
          const dName = (d.name || '').trim().toLowerCase();
          if (cleanPhone && cleanPhone.length >= 7 && dPhone === cleanPhone) return true;
          if (cleanName && cleanName.length > 1 && dName === cleanName) return true;
          if (donorIdInput && String(d.id) === String(donorIdInput)) return true;
          return false;
        });

        const newDonorObj = existingDonorObj || { 
          id: donorIdInput || `dnr-${Date.now()}`, 
          name: finalDonorName, 
          phone: donorPhoneInput || '', 
          location: donorAddressInput || 'Kerala',
          category: donationType
        };

        if (!existingDonorObj && donationTab === 'new') {
          setDonors(prev => [newDonorObj, ...(Array.isArray(prev) ? prev : [])]);
        }

        // All campaigner-logged entries are PENDING admin verification.
        // Payment status (whether cash is received or not) is tracked in notes.
        const paymentStatus = amountStatusInput === 'PENDING' ? 'NOT_RECEIVED' : 'RECEIVED';
        const entryStatus = 'PENDING';
        const newEntry = {
          id: newDonationId,
          amount: Number(donationAmount) || 100,
          status: entryStatus,
          createdAt: new Date().toISOString(),
          donor: newDonorObj,
          notes: notes ? `${notes} (Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Payment: ${paymentStatus})` : `Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Month: ${donationMonthInput}. Payment: ${paymentStatus}. Plan: ${monthPlanInput}`
        };

        setDonations(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
        setFormSuccess(true);

        setSelectedReceiptData({
          receiptNo: newDonationId,
          date: new Date().toISOString(),
          name: finalDonorName,
          place: donorAddressInput || 'Kerala',
          phone: donorPhoneInput || '',
          amount: donationAmount || '100',
          month: donationMonthInput,
          plan: monthPlanInput
        });
        setShowReceiptModal(true);

        setDonorIdInput('');
        setDonorNameInput('');
        setDonorPhoneInput('');
        setDonorWhatsAppInput('');
        setDonorAddressInput('');
        setDonationAmount('100');
        setNotes('');
      }
    } catch (err) {
      console.warn('API error during donation submission, applying demo entry fallback:', err);
      const newDonationId = `TOH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      let finalDonorName = donorNameInput || 'General Donor';
      if (donationTab === 'renew' && donorIdInput) {
        finalDonorName = allAvailableDonors.find(d => d.id === donorIdInput)?.name || 'General Donor';
      }

      const newEntry = {
        id: newDonationId,
        amount: Number(donationAmount) || 100,
        status: 'VERIFIED',
        createdAt: new Date().toISOString(),
        donor: { id: donorIdInput || `dnr-${Date.now()}`, name: finalDonorName, phone: donorPhoneInput || '', location: donorAddressInput || 'Kerala' },
        notes: notes ? `${notes} (Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'})` : `Logged by: ${user?.fullName || 'Campaigner'}. Class: ${(user as any)?.class || 'Plus one'}. Month: ${donationMonthInput}. Status: ${amountStatusInput}. Plan: ${monthPlanInput}`
      };

      setDonations(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
      setFormSuccess(true);

      setSelectedReceiptData({
        receiptNo: newDonationId,
        date: new Date().toISOString(),
        name: finalDonorName,
        place: donorAddressInput || 'Kerala',
        phone: donorPhoneInput || '',
        amount: donationAmount,
        month: donationMonthInput,
        plan: monthPlanInput
      });
      setShowReceiptModal(true);

      setDonorIdInput('');
      setDonorNameInput('');
      setDonorPhoneInput('');
      setDonorWhatsAppInput('');
      setDonorAddressInput('');
      setDonationAmount('');
      setNotes('');
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
  const handleApproveDonation = async (id: string, action: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    // Immediately update local state for instant responsive UI feedback
    setDonations(prev => (Array.isArray(prev) ? prev : []).map(item => item.id === id ? { ...item, status: action } : item));
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
      console.warn('API call failed, applied local state update:', err);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this donation entry? This action cannot be undone.')) return;

    // Find target donation to inspect donor details
    const targetDonation = safeDonations.find(item => item.id === id);
    const targetDonorId = targetDonation?.donorId || targetDonation?.donor?.id;
    const targetDonorName = targetDonation?.donor?.name?.trim()?.toLowerCase();

    // Check if this donor has any OTHER active donations left in safeDonations
    const otherDonationsForDonor = safeDonations.filter(item => {
      if (item.id === id) return false;
      const dId = item.donorId || item.donor?.id;
      const dName = item.donor?.name?.trim()?.toLowerCase();
      if (targetDonorId && dId && String(dId) === String(targetDonorId)) return true;
      if (targetDonorName && dName && dName === targetDonorName) return true;
      return false;
    });

    // If no other donations remain for this donor, automatically delete the donor profile too
    if (otherDonationsForDonor.length === 0) {
      if (targetDonorId) {
        setDeletedDonorIds(prev => [...prev, String(targetDonorId)]);
      }
      setDonors(prev => (Array.isArray(prev) ? prev : []).filter(d => {
        if (targetDonorId && String(d.id) === String(targetDonorId)) return false;
        if (targetDonorName && d.name?.trim()?.toLowerCase() === targetDonorName) return false;
        return true;
      }));
    }

    try {
      const res = await fetch(`${API_URL}/donations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok || res.status === 404) {
        setDeletedDonationIds(prev => [...prev, String(id)]);
        setDonations(prev => (Array.isArray(prev) ? prev : []).filter(item => item.id !== id));
        fetchDatabaseData();
      } else {
        alert('Failed to delete donation on server. Please try again.');
      }
    } catch (err) {
      console.warn('API call failed, applied local state deletion:', err);
      // Fallback for offline mode: apply optimistic deletion locally
      setDeletedDonationIds(prev => [...prev, String(id)]);
      setDonations(prev => (Array.isArray(prev) ? prev : []).filter(item => item.id !== id));
    }
  };

  const handleDeleteDonor = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this donor profile? All their donation entries will also be removed from the database. This action cannot be undone.')) return;
    
    const targetDonor = safeDonors.find(d => String(d.id) === String(id)) || allAvailableDonors.find(d => String(d.id) === String(id));
    const targetPhone = targetDonor?.phone?.trim()?.replace(/\D/g, '');
    const targetName = targetDonor?.name?.trim()?.toLowerCase();

    // 1. Permanently register donor ID in deletedDonorIds
    setDeletedDonorIds(prev => Array.from(new Set([...prev, String(id)])));

    // 2. Filter out matching donor from local state
    setDonors(prev => (Array.isArray(prev) ? prev : []).filter(d => {
      const dPhone = d.phone?.trim()?.replace(/\D/g, '');
      const dName = d.name?.trim()?.toLowerCase();
      if (String(d.id) === String(id)) return false;
      if (targetPhone && dPhone && dPhone === targetPhone) return false;
      if (targetName && dName && dName === targetName) return false;
      return true;
    }));

    // 3. Filter out all donations belonging to this donor from local state
    const matchingDonationIdsToPurge: string[] = [];
    setDonations(prev => (Array.isArray(prev) ? prev : []).filter(item => {
      const dId = item.donorId || item.donor?.id;
      const dPhone = item.donor?.phone?.trim()?.replace(/\D/g, '');
      const dName = item.donor?.name?.trim()?.toLowerCase();
      
      const isMatch = (String(dId) === String(id)) || 
                      (targetPhone && dPhone && dPhone === targetPhone) || 
                      (targetName && dName && dName === targetName);
      
      if (isMatch) {
        matchingDonationIdsToPurge.push(item.id);
        return false;
      }
      return true;
    }));

    setDeletedDonationIds(prev => Array.from(new Set([...prev, ...matchingDonationIdsToPurge])));

    // 4. Trigger server API hard deletion
    try {
      const res = await fetch(`${API_URL}/donors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok || res.status === 404) {
        fetchDatabaseData();
      }
    } catch (err) {
      console.warn('API call failed, applied local donor deletion:', err);
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
    safeDonations.forEach(item => {
      const date = new Date(item.createdAt);
      const m = date.getMonth(); // Feb=1, Mar=2, Apr=3, May=4, Jun=5, Jul=6
      if (m >= 1 && m <= 6) {
        monthlyData[m - 1] += Number(item.amount);
      }
    });

    // Aggregate weekly progress (for current month)
    const weeklyLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const weeklyData = [0, 0, 0, 0];
    safeDonations.forEach(item => {
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

  if (!isClient || !_hasHydrated) return null;

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
            <p className="text-xs opacity-60 mt-1.5">{authMode === 'register' ? 'Initialize Hub' : loginRole === 'admin' ? 'Admin Portal' : 'Campaigner Portal'}</p>
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

            {authMode === 'login' && loginRole === 'campaigner' ? (
              <>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedHn('');
                    }}
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-850">Select Class</option>
                    {['Final year', 'D3', 'D2', 'D1', 'Plus two', 'Plus one'].map(c => (
                      <option key={c} value={c} className="text-slate-800">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select R.NO / Student Name</label>
                  <select
                    value={selectedHn}
                    onChange={(e) => setSelectedHn(e.target.value)}
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer font-bold"
                  >
                    <option value="" disabled>-- Select Student / വിദ്യാർത്ഥியை തിരഞ്ഞെടുക്കുക --</option>
                    {campaignersList.filter(c => c.class === selectedClass).map(c => (
                      <option key={c.hn} value={c.hn} className="text-slate-800">R.NO {c.hn} ({c.name})</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const activeCampaigner = campaignersList.find(c => String(c.hn) === selectedHn && c.class === selectedClass);
                  return activeCampaigner ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left transition-all duration-300">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Campaigner Profile</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{activeCampaigner.name}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">Class: {selectedClass}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
⚠️ Please select a student from the R.NO list above
                      </span>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {authMode === 'register' ? 'Email Address' : 'Admin Email / Username'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder={authMode === 'register' ? "e.g. info@hidayaonline.org" : "e.g. admin@hidayaonline.org"}
                  className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}

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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition text-sm flex justify-center items-center gap-2 mt-6 cursor-pointer"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 
               authMode === 'register' ? 'Initialize Hub' : 
               loginRole === 'admin' ? 'Access Admin Console' : 'Access Campaigner Console'}
            </button>

            {authMode === 'login' && (
              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                {loginRole === 'campaigner' ? (
                  <button 
                    type="button" 
                    onClick={() => { 
                      setLoginRole('admin'); 
                      setAuthError('');
                      router.push('/admin'); 
                    }}
                    className="text-xs text-slate-400 hover:text-emerald-400 font-bold transition underline cursor-pointer"
                  >
                    Are you an Admin? Admin Portal Login
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => { 
                      setLoginRole('campaigner'); 
                      setAuthError('');
                      router.push('/campaigner'); 
                    }}
                    className="text-xs text-slate-400 hover:text-emerald-400 font-bold transition underline cursor-pointer"
                  >
                    Are you a Campaigner? Campaigner Portal Login
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Role sidebar items configuration
  const sidebars = {
    admin: [
      { id: 'analytics', name: 'Analytics', key: 'analytics', icon: BarChart2 },
      { id: 'donations', name: 'Donation Entries', key: 'donationEntries', icon: IndianRupee },
      { id: 'verify', name: 'Verify Physical', key: 'verifyPhysical', icon: ShieldCheck },
      { id: 'campaigners', name: 'Manage Campaigners', key: 'manageCampaigners', icon: Users },
      { id: 'campaigners-stats', name: 'Campaigners Stats', key: 'campaignersStats', icon: FileText },
      { id: 'donors', name: 'Donors Directory', key: 'donorsDirectory', icon: UserCheck },
      { id: 'rankings', name: 'Class Rankings', key: 'classRankings', icon: Trophy },
      { id: 'class-collections', name: 'Class Collections', key: 'classCollections', icon: IndianRupee },
      { id: 'class-dashboard', name: 'Class Dashboard', key: 'classDashboard', icon: Laptop },
      { id: 'developer', name: 'Developer Tools', key: 'developerTools', icon: KeyRound }
    ],
    leader: [
      { id: 'progress', name: 'Analytics', key: 'analytics', icon: BarChart2 },
      { id: 'campaigners', name: 'Campaigners', key: 'manageCampaigners', icon: Users },
      { id: 'rankings', name: 'Class Rankings', key: 'classRankings', icon: Trophy },
      { id: 'verify', name: 'Verify Physical', key: 'verifyPhysical', icon: ShieldCheck },
      { id: 'donors', name: 'Donors Directory', key: 'donorsDirectory', icon: UserCheck },
      { id: 'v-history', name: 'My Receipts', key: 'myReceipts', icon: FileText }
    ],
    volunteer: [
      { id: 'v-overview', name: 'Dashboard', key: 'dashboard', icon: Laptop },
      { id: 'v-add', name: 'Add Donation', key: 'addDonation', icon: PlusCircle },
      { id: 'v-history', name: 'My Collections', key: 'myCollections', icon: Clock },
      { id: 'v-leaderboard', name: 'Leaderboard', key: 'leaderboard', icon: Trophy },
      { id: 'v-messages', name: 'Messages', key: 'messages', icon: MessageSquare }
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
          {/* Unified Role Display */}
          {!(user as any)?.hn ? (
            <div className="px-4 py-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{t.adminDashboard}</span>
            </div>
          ) : (
            <div className="px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{t.campaignerDashboard}</span>
            </div>
          )}

          {/* Dynamic Sidebar Links */}
          {selectedRole === 'volunteer' && (
            <div className="p-4 rounded-3xl bg-slate-200/50 dark:bg-black/20 border border-slate-300/80 dark:border-white/5 text-center flex flex-col items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
              <div className="relative mb-3">
                {campaignerAvatar ? (
                  <img 
                    src={campaignerAvatar} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-emerald-500" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                    {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'VO'}
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-[#0f4c81] text-white hover:bg-[#135c9b] rounded-full shadow border border-white/20 transition-all duration-200 cursor-pointer"
                  title="Upload Profile Picture"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white uppercase">{user?.fullName || 'Campaigner'}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Class: {(user as any)?.class || 'Final Year'} • R.NO: {(user as any)?.hn || '001'}</p>
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
                  <span className="text-sm font-semibold">{t[item.key as keyof typeof t] || item.name}</span>
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
              {selectedRole === 'admin' ? t.adminPortal : t.volunteerPortal}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
              {t[sidebars[selectedRole].find(item => item.id === activeTab)?.key as keyof typeof t] || 'Portal Overview'}
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
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{safeVerificationQueue.length} Entries</h3>
                </div>
                <div className={`p-6 rounded-3xl ${glassClass}`}>
                  <span className="text-xs font-bold opacity-60 uppercase">{t.activeDonors}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">{activeDonorsCount} Profiles</h3>
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
          {(activeTab === 'donations' || activeTab === 'v-history') && (() => {
            const baseData = activeTab === 'v-history' 
              ? safeDonations.filter(item => {
                  const loggedBy = item.notes?.match(/Logged by:\s*([^\.]+)/i)?.[1]?.trim()?.toLowerCase() || '';
                  const uName = (user?.fullName || '').trim().toLowerCase();
                  return loggedBy && uName && (loggedBy === uName || loggedBy.includes(uName) || uName.includes(loggedBy));
                })
              : safeDonations;

            // 1. Calculate Stats
            const newCollectionTotal = baseData
              .filter(item => !item.notes?.includes('Renew'))
              .reduce((acc, item) => acc + Number(item.amount), 0);
            
            const renewCollectionTotal = baseData
              .filter(item => item.notes?.includes('Renew'))
              .reduce((acc, item) => acc + Number(item.amount), 0);

            const totalCollection = newCollectionTotal + renewCollectionTotal;

            // 2. Filter logic
            const filteredEntries = baseData.filter(item => {
              const query = searchQuery.toLowerCase().trim();
              const matchesSearch = !query ||
                item.id.toLowerCase().includes(query) ||
                (item.donor?.name || '').toLowerCase().includes(query) ||
                (item.donor?.phone || '').includes(query) ||
                (item.notes || '').toLowerCase().includes(query);

              // Extract Class, Campaigner, and Month from notes
              const itemClass = item.notes?.match(/Class:\s*([^\.]+)/)?.[1] || '';
              const itemCamp = item.notes?.match(/Logged by:\s*([^\.]+)/)?.[1] || '';
              const itemMonth = item.notes?.match(/Month:\s*([^\.]+)/)?.[1] || '';

              const matchesClass = donationClassFilter === 'ALL' || itemClass.trim().toLowerCase() === donationClassFilter.toLowerCase();
              const matchesCampaigner = donationCampaignerFilter === 'ALL' || itemCamp.trim().toLowerCase() === donationCampaignerFilter.toLowerCase();
              const matchesMonth = donationMonthFilter === 'ALL' || itemMonth.trim().toLowerCase() === donationMonthFilter.toLowerCase();
              const matchesStatus = donationStatusFilter === 'ALL' || item.status === donationStatusFilter;

              return matchesSearch && matchesClass && matchesCampaigner && matchesMonth && matchesStatus;
            });

            const donationsExportColumns = [
              { id: 'receiptId', label: 'Receipt ID', getValue: (r: any) => r.id },
              { id: 'donorName', label: 'Donor Name', getValue: (r: any) => r.donor?.name || '' },
              { id: 'donorPhone', label: 'Donor Phone', getValue: (r: any) => r.donor?.phone || '' },
              { id: 'amount', label: 'Amount', getValue: (r: any) => String(r.amount) },
              { id: 'loggedBy', label: 'Logged By', getValue: (r: any) => r.notes?.match(/Logged by:\s*([^\.]+)/)?.[1] || '' },
              { id: 'class', label: 'Class', getValue: (r: any) => r.notes?.match(/Class:\s*([^\.]+)/)?.[1] || '' },
              { id: 'month', label: 'Month', getValue: (r: any) => r.notes?.match(/Month:\s*([^\.]+)/)?.[1] || '' },
              { id: 'status', label: 'Status', getValue: (r: any) => r.status },
              { id: 'date', label: 'Date', getValue: (r: any) => new Date(r.createdAt).toLocaleString() }
            ];

            return (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-3xl ${glassClass}`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Total New Collection</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">₹{newCollectionTotal.toLocaleString()}.00</h3>
                  </div>
                  <div className={`p-6 rounded-3xl ${glassClass}`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Total Renew Collection</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">₹{renewCollectionTotal.toLocaleString()}.00</h3>
                  </div>
                  <div className={`p-6 rounded-3xl ${glassClass}`}>
                    <span className="text-xs font-bold opacity-60 uppercase">Total Collection</span>
                    <h3 className="text-2xl font-black text-emerald-500 mt-2">₹{totalCollection.toLocaleString()}.00</h3>
                  </div>
                </div>

                {/* Filters row */}
                <div className={`p-5 rounded-3xl ${glassClass} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center relative z-20`}>
                  <div>
                    <select
                      value={donationClassFilter}
                      onChange={(e) => setDonationClassFilter(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Classes</option>
                      {['Final year', 'D3', 'D2', 'D1', 'Plus two', 'Plus one'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={donationCampaignerFilter}
                      onChange={(e) => setDonationCampaignerFilter(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Campaigners</option>
                      {campaignersList.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={donationMonthFilter}
                      onChange={(e) => setDonationMonthFilter(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
              {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'One Time'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={donationStatusFilter}
                      onChange={(e) => setDonationStatusFilter(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Entries</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Verified</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search donor, receiver, receipt, phone..."
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 md:col-span-1 flex items-center z-40 relative">
                    <ExportMenu 
                      data={filteredEntries}
                      columns={donationsExportColumns}
                      filename="donation_entries"
                      title="Donation Entries History"
                    />
                  </div>
                </div>

                {/* Ledger Table */}
                <div className={`p-6 rounded-3xl ${glassClass} overflow-x-auto flex-1`}>
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-bold">No matching collection entries found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-extrabold">
                          <th className="py-3 px-4">Receipt</th>
                          <th className="py-3 px-4">Donor</th>
                          <th className="py-3 px-4">Receiver</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map((item) => {
                          const isRenew = item.notes?.includes('Renew');
                          const itemClass = item.notes?.match(/Class:\s*([^\.]+)/)?.[1] || '';
                          const itemCamp = item.notes?.match(/Logged by:\s*([^\.]+)/)?.[1] || 'Unknown';
                          
                          const rawReceiptNo = item.receipts?.[0]?.receiptNumber || item.receiptNo;
                          let receiptNo = rawReceiptNo;
                          if (!receiptNo) {
                            if (typeof item.id === 'string' && item.id.startsWith('TOH-2026-')) {
                              receiptNo = item.id;
                            } else if (typeof item.id === 'string' && item.id.includes('-')) {
                              const parts = item.id.split('-');
                              const lastPart = parts[parts.length - 1].slice(-4).toUpperCase();
                              receiptNo = `TOH-2026-${lastPart}`;
                            } else {
                              receiptNo = `TOH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                            }
                          }

                          const donorDonations = safeDonations.filter(q => {
                            const qId = q.donorId || q.donor?.id;
                            const dId = item.donorId || item.donor?.id;
                            const qName = q.donor?.name?.trim()?.toLowerCase();
                            const dName = item.donor?.name?.trim()?.toLowerCase();
                            if (qId && dId && String(qId) === String(dId)) return true;
                            if (qName && dName && qName === dName) return true;
                            return false;
                          });

                          const paidMonths = donorDonations
                            .filter(q => ['APPROVED', 'VERIFIED', 'PENDING'].includes(q.status))
                            .flatMap(q => {
                              const monthMatch = q.notes?.match(/Month:\s*([^.]+)/);
                              if (!monthMatch) return [];
                              return monthMatch[1].replace('Custom:', '').split(',').map((m: string) => m.trim());
                            })
                            .filter(Boolean);
                          
                          return (
                            <tr key={item.id} className="border-b border-white/5 text-slate-800 dark:text-slate-300 font-medium hover:bg-slate-550/5 transition duration-150">
                              <td className="py-4 px-4 font-mono text-xs">
                                <span className="font-extrabold block text-slate-900 dark:text-white">{receiptNo}</span>
                                <span className="opacity-50 text-[9px] block mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold block text-slate-900 dark:text-white text-xs">{item.donor?.name || 'General Donor'}</span>
                                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                    isRenew ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  }`}>
                                    {isRenew ? 'Renew' : 'New'}
                                  </span>
                                </div>
                                {item.donor?.phone && (
                                  <div className="flex flex-col gap-0.5 text-[9px] text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-2.5 h-2.5 opacity-60 text-slate-400" />
                                      <span>{item.donor.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                      <MessageSquare className="w-2.5 h-2.5 opacity-80" />
                                      <span>{item.donor.phone}</span>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-extrabold block text-slate-900 dark:text-white uppercase">{itemCamp}</span>
                                <span className="opacity-50 text-[9px] block mt-0.5 uppercase font-bold">{itemClass}</span>
                              </td>
                              <td className="py-4 px-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{Number(item.amount).toLocaleString()}.00</td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                  item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                  item.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                }`}>
                                  {item.status === 'APPROVED' ? 'Verified' : item.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  {item.status === 'PENDING' && (
                                    <button
                                      onClick={() => handleApproveDonation(item.id, 'APPROVED')}
                                      className="p-1.5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full transition cursor-pointer"
                                      title="Verify Entry"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      const itemMonth = item.notes?.match(/Month:\s*([^\.]+)/)?.[1] || '';
                                      const itemPlan = item.notes?.match(/Plan:\s*([^\.]+)/)?.[1] || '';
                                      setSelectedReceiptData({
                                        receiptNo: receiptNo,
                                        date: item.createdAt,
                                        name: item.donor?.name || 'General Donor',
                                        place: item.donor?.category || 'Kerala',
                                        phone: item.donor?.phone || '',
                                        amount: item.amount,
                                        month: itemMonth,
                                        paidMonths: paidMonths,
                                        plan: itemPlan
                                      });
                                      setWhatsAppAutoShare(true);
                                      setShowReceiptModal(true);
                                    }}
                                    className="p-1.5 hover:bg-emerald-500/10 text-emerald-500 rounded-full transition cursor-pointer"
                                    title="Send WhatsApp Receipt"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const itemMonth = item.notes?.match(/Month:\s*([^\.]+)/)?.[1] || '';
                                      const itemPlan = item.notes?.match(/Plan:\s*([^\.]+)/)?.[1] || '';
                                      setSelectedReceiptData({
                                        receiptNo: receiptNo,
                                        date: item.createdAt,
                                        name: item.donor?.name || 'General Donor',
                                        place: item.donor?.category || 'Kerala',
                                        phone: item.donor?.phone || '',
                                        amount: item.amount,
                                        month: itemMonth,
                                        paidMonths: paidMonths,
                                        plan: itemPlan
                                      });
                                      setShowReceiptModal(true);
                                    }}
                                    className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded-full transition cursor-pointer"
                                    title="View Receipt"
                                  >
                                    <Receipt className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDonation(item.id)}
                                    className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-full transition cursor-pointer"
                                    title="Delete Entry Permanently"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )})()}

          {/* VIEW: Verify Physical (Pending verification queue) */}
          {activeTab === 'verify' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-500" />
                Pending Verification Approval Queue
              </h3>
              <p className="text-xs opacity-60 mb-6">Verify and approve physical donation entries logged by campaigners.</p>

              <div className="overflow-x-auto">
                {safeVerificationQueue.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">All collections verified. Queue is empty.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                        <th className="py-3 px-4">Receipt ID</th>
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Logged By</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeVerificationQueue.map((item) => {
                        const paymentReceived = item.notes?.includes('Payment: RECEIVED');
                        const loggedBy = item.notes?.match(/Logged by:\s*([^.]+)/)?.[1]?.trim() || 'Campaigner';
                        return (
                        <tr key={item.id} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                          <td className="py-4 px-4 font-mono text-xs truncate max-w-[120px]">{item.id}</td>
                          <td className="py-4 px-4 font-bold">{item.donor?.name || 'General Donor'}</td>
                          <td className="py-4 px-4 text-emerald-500 font-bold">₹{item.amount}</td>
                          <td className="py-4 px-4">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${paymentReceived ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                              {paymentReceived ? '✅ Cash Received' : '⏳ Cash Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs opacity-70">{loggedBy}</td>
                          <td className="py-4 px-4 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-4 text-right flex justify-end gap-2">
                            {item.status === 'APPROVED' || item.status === 'VERIFIED' ? (
                              <button 
                                onClick={() => handleApproveDonation(item.id, 'PENDING')}
                                className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 text-xs px-3 py-1.5 rounded-xl font-bold"
                              >
                                <RefreshCw className="w-3.5 h-3.5" /> Unverify
                              </button>
                            ) : (
                              <>
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
                              </>
                            )}
                          </td>
                        </tr>
                        );
                      })}
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

                {/* NEW DONOR: Form Fields */}
                {donationTab === 'new' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Name *</label>
                        <span className="text-[9px] text-slate-400 font-bold block">വരിാകാരന്റെ പൂര്‍ണ്ണമായ പേര് നൽകുക</span>
                      </div>
                      <input 
                        type="text" 
                        required={donationTab === 'new'}
                        value={donorNameInput}
                        onChange={(e) => setDonorNameInput(e.target.value)}
                        placeholder="Full name of donor"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Phone Number *</label>
                          <span className="text-[9px] text-slate-400 font-bold block">വരിാകാരന്റെ ഫോൺ നമ്പർ നൽകുക</span>
                        </div>
                        <input 
                          type="tel" 
                          required={donationTab === 'new'}
                          value={donorPhoneInput}
                          onChange={(e) => {
                            setDonorPhoneInput(e.target.value);
                            if (!donorWhatsAppInput) {
                              setDonorWhatsAppInput(e.target.value);
                            }
                          }}
                          placeholder="10-digit number"
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">WhatsApp Number *</label>
                            <span className="text-[9px] text-slate-400 font-bold block">രസീത് അയക്കുന്നതിനുള്ള വാട്സാപ് നമ്പർ</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDonorWhatsAppInput(donorPhoneInput)}
                              className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold rounded-xl transition border border-blue-500/20 flex items-center gap-1 cursor-pointer"
                              title="Copy Phone Number"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => setDonorWhatsAppInput(donorPhoneInput)}
                              className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold rounded-xl transition border border-emerald-500/30 cursor-pointer"
                              title="Use Phone Number as WhatsApp Number"
                            >
                              Same as phone
                            </button>
                          </div>
                        </div>
                        <div className="relative flex items-center">
                          <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3.5 pointer-events-none" />
                          <input 
                            type="tel" 
                            value={donorWhatsAppInput}
                            onChange={(e) => setDonorWhatsAppInput(e.target.value)}
                            placeholder="For sending receipt"
                            className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Address / Place *</label>
                        <span className="text-[9px] text-slate-400 font-bold block">വരിാകാരന്റെ സ്ഥലം അല്ലെങ്കിൽ വീട്ടുപേര് നൽകുക</span>
                      </div>
                      <input 
                        type="text" 
                        value={donorAddressInput}
                        onChange={(e) => setDonorAddressInput(e.target.value)}
                        placeholder="City or Town"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* RENEW: Donor Profile Select FIRST (above amount) */}
                {donationTab === 'renew' && (
                  <div className="space-y-4 pt-2 border-t border-slate-300/40 dark:border-white/5">
                    <div className="relative">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Profile (Search & Select) *</label>
                        <span className="text-[9px] text-slate-400 block">തുക നൽകുക</span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          required={donationTab === 'renew' && !donorIdInput}
                          placeholder="Search donor name or phone..."
                          value={isDonorDropdownOpen ? renewSearchQuery : (allAvailableDonors.find(d => d.id === donorIdInput)?.name || renewSearchQuery)}
                          onFocus={() => {
                            setIsDonorDropdownOpen(true);
                            setRenewSearchQuery(''); // Clear query to show all on focus
                          }}
                          onBlur={() => setTimeout(() => setIsDonorDropdownOpen(false), 200)}
                          onChange={(e) => {
                            setRenewSearchQuery(e.target.value);
                            setIsDonorDropdownOpen(true);
                            // If user types, we clear the selected ID so they must select from list
                            if (donorIdInput) {
                              setDonorIdInput('');
                            }
                          }}
                          className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                        />
                        
                        {isDonorDropdownOpen && (
                          <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl">
                            {allAvailableDonors.filter(d => 
                              !renewSearchQuery || 
                              d.name?.toLowerCase().includes(renewSearchQuery.toLowerCase()) || 
                              d.phone?.includes(renewSearchQuery)
                            ).length === 0 ? (
                              <div className="p-4 text-center text-sm text-slate-500">No donors found</div>
                            ) : (
                              allAvailableDonors.filter(d => 
                                !renewSearchQuery || 
                                d.name?.toLowerCase().includes(renewSearchQuery.toLowerCase()) || 
                                d.phone?.includes(renewSearchQuery)
                              ).map(d => (
                                <div 
                                  key={d.id}
                                  onClick={() => {
                                    setDonorIdInput(d.id);
                                    setRenewSearchQuery(d.name || '');
                                    setIsDonorDropdownOpen(false);
                                    
                                    // Auto-detect donor's plan from previous donations
                                    const previousDonation = donations.find(q => q.donorId === d.id && q.notes?.includes('Class:'));
                                    if (previousDonation?.notes) {
                                      const planMatch = previousDonation.notes.match(/Plan:\s*([^.]+)/);
                                      if (planMatch) {
                                        const detectedPlan = planMatch[1].trim();
                                        setMonthPlanInput(detectedPlan);
                                        // Extract amount from plan
                                        const amountMatch = detectedPlan.match(/^(\d+)/);
                                        if (amountMatch) {
                                          setDonationAmount(amountMatch[1]);
                                        }
                                      }
                                    }
                                    setDonorNameInput(d.name || '');
                                    setDonorPhoneInput(d.phone || '');

                                    // Auto-select first unpaid month for this donor
                                    const allMonths = ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
                                    const paidForDonor = (d.paidMonths || []).map((m: string) => m.trim().toLowerCase());
                                    const unpaidMonths = allMonths.filter(m => {
                                      const norm = m.toLowerCase();
                                      const shortNorm = norm.substring(0, 3);
                                      return !paidForDonor.some((pm: string) => pm === norm || pm.substring(0, 3) === shortNorm);
                                    });
                                    if (unpaidMonths.length > 0) {
                                      setDonationMonthInput(unpaidMonths[0]);
                                    } else {
                                      setDonationMonthInput('All Months Paid');
                                    }
                                  }}
                                  className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0"
                                >
                                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{d.name}</div>
                                  <div className="text-xs text-slate-500">{d.phone || 'No phone'}</div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Auto-detected Plan & Amount display */}
                    {donorIdInput && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Auto-detected Plan</span>
                          <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">സ്വയം കണ്ടെത്തിയ പ്ലാൻ</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-black">
                            ₹{donationAmount || '0'}/month
                          </div>
                          <span className="text-xs text-slate-400">Plan: {monthPlanInput}</span>
                        </div>
                        <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold flex items-start gap-1 mt-1">
                          <span>ⓘ</span>
                          <span>ഡോണറുടെ മുൻ പ്ലാൻ അനുസരിച്ച് തുക സ്വയം സെറ്റ് ആയി. മാറ്റം വേണമെങ്കിൽ താഴെ എഡിറ്റ് ചെയ്യാം.</span>
                        </p>
                        {/* Allow manual override */}
                        <div className="flex items-center gap-2 mt-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Override Amount:</label>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2 text-slate-500 font-bold text-sm">₹</span>
                            <input 
                              type="number" 
                              value={donationAmount}
                              onChange={(e) => setDonationAmount(e.target.value)}
                              className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Amount / Plan Dropdown Selector â€” only for NEW DONOR tab */}
                {donationTab === 'new' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Amount *</label>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">തുക തിരഞ്ഞെടുക്കുക</span>
                  </div>
                  <select 
                    value={monthPlanInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMonthPlanInput(val);
                      if (val === '100/month') setDonationAmount('100');
                      else if (val === '200/month') setDonationAmount('200');
                      else if (val === '250/month') setDonationAmount('250');
                      else if (val === '313/month') setDonationAmount('313');
                      else if (val === '500/month') setDonationAmount('500');
                      else if (val === 'No specific plan') setDonationAmount('');
                      else if (val === 'Custom Amount') setDonationAmount('');
                    }}
                    className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-850 dark:text-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/40 font-bold"
                  >
                    <option value="No specific plan" className="text-slate-800">No specific plan</option>
                    <option value="100/month" className="text-slate-800">100/month</option>
                    <option value="200/month" className="text-slate-800">200/month</option>
                    <option value="250/month" className="text-slate-800">250/month</option>
                    <option value="313/month" className="text-slate-800">313/month</option>
                    <option value="500/month" className="text-slate-800">500/month</option>
                    <option value="Custom Amount" className="text-slate-800">Custom Amount</option>
                  </select>
                </div>
                )}

                {/* Conditional Custom Amount Input â€” only for NEW DONOR tab */}
                {donationTab === 'new' && (monthPlanInput === 'Custom Amount' || monthPlanInput === 'No specific plan') && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Custom Amount (₹) *</label>
                      <span className="text-[9px] text-slate-400 block">à´¤àµà´• à´¨àµ½à´•àµà´•</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-slate-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        required 
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-8 pr-4 py-3 text-sm text-slate-850 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40 font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Month & Date selector row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">For Month *</label>
                      <span className="text-[9px] text-slate-400 block font-bold">ഏത് മാസത്തെ പണമാണ്? (മുൻകൂറായി നൽകാൻ ഒന്നിലധികം മാസം തിരഞ്ഞെടുക്കാം)</span>
                    </div>
                    <select 
                      value={donationMonthInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDonationMonthInput(val);
                        if (val !== 'Custom Selection') {
                          setCustomSelectedMonths([]);
                        }
                      }}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-805 dark:text-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option value="" disabled className="text-slate-800">Select Month</option>
                      {(() => {
                        const allMonths = ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
                        
                        if (donationTab === 'renew') {
                          // Find months this donor already paid for
                          const selectedDonorObj = allAvailableDonors.find(d => String(d.id) === String(donorIdInput));
                          
                          const donorPaidMonths = (() => {
                            if (!donorIdInput && !selectedDonorObj) return [];
                            const fromObj = selectedDonorObj?.paidMonths || [];
                            const fromDonations = safeDonations
                              .filter(q => {
                                const qDonorId = q.donorId || q.donor?.id;
                                const qPhone = q.donor?.phone?.replace(/\D/g, '');
                                const sPhone = selectedDonorObj?.phone?.replace(/\D/g, '');
                                const qName = q.donor?.name?.trim()?.toLowerCase();
                                const sName = selectedDonorObj?.name?.trim()?.toLowerCase();

                                if (donorIdInput && qDonorId && String(qDonorId) === String(donorIdInput)) return true;
                                if (sPhone && qPhone && sPhone.length >= 7 && sPhone === qPhone) return true;
                                if (sName && qName && sName.length > 1 && sName === qName) return true;
                                return false;
                              })
                              .flatMap(q => {
                                const monthMatch = q.notes?.match(/Month:\s*([^.]+)/);
                                if (!monthMatch) return [];
                                return monthMatch[1].replace('Custom:', '').split(',').map((m: string) => m.trim());
                              })
                              .filter(Boolean);

                            const combined = Array.from(new Set([...fromObj, ...fromDonations]));
                            return combined.map(m => m.trim().toLowerCase());
                          })();

                          // Filter out paid months; no '10 Months' or 'One Time Payment' for renew
                          const availableMonths = allMonths.filter(m => {
                            const norm = m.toLowerCase();
                            const shortNorm = norm.substring(0, 3);
                            return !donorPaidMonths.some(pm => {
                              const pNorm = pm.toLowerCase();
                              const pShort = pNorm.substring(0, 3);
                              return pNorm === norm || pShort === shortNorm;
                            });
                          });

                          if (availableMonths.length === 0) {
                            return [
                              <option key="all-paid" value="All Months Paid" disabled className="text-slate-500 font-bold">✓ All Months Paid (മുഴുവൻ മാസങ്ങളും അടച്ചതാണ്)</option>
                            ];
                          }

                          return [...availableMonths, 'Custom Selection'].map(m => (
                            <option key={m} value={m} className="text-slate-800 font-bold">{m}</option>
                          ));
                        } else {
                          // New donor: show all options including 10 Months and One Time Payment
                          return [...allMonths, '10 Months', 'One Time Payment', 'Custom Selection'].map(m => (
                            <option key={m} value={m} className="text-slate-800 font-bold">{m}</option>
                          ));
                        }
                      })()}
                    </select>
                    
                    {/* Information Tip */}
                    <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-2 flex items-start gap-1">
                      <span>ⓘ</span>
                      <span>പ്രതിമാസ വരിസംഖ്യാ പ്ലാൻ തിരഞ്ഞെടുക്കാത്തവർക്ക് One Time Payment എന്ന ഓപ്ഷൻ തിരഞ്ഞെടുക്കാം.</span>
                    </p>

                    {/* Custom Selection Checkboxes Grid */}
                    {donationMonthInput === 'Custom Selection' && (
                      <div className="mt-4 p-4 bg-slate-200/40 dark:bg-black/10 border border-slate-350 dark:border-white/5 rounded-2xl space-y-3 animate-in fade-in duration-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Select Active Months</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(month => {
                            const isChecked = customSelectedMonths.includes(month);
                            
                            // Check if already paid
                            let isPaid = false;
                            if (donationTab === 'renew' && donorIdInput) {
                              const selectedDonorObj = allAvailableDonors.find(d => String(d.id) === String(donorIdInput));
                              const donorPaidMonths = (selectedDonorObj?.paidMonths || []).map((m: string) => m.trim().toLowerCase());
                              const norm = month.toLowerCase();
                              const shortNorm = norm.substring(0, 3);
                              isPaid = donorPaidMonths.some((pm: string) => pm === norm || pm.substring(0, 3) === shortNorm);
                            }

                            return (
                              <label key={month} className={`flex items-center gap-2 select-none ${isPaid ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input 
                                  type="checkbox"
                                  checked={isChecked || isPaid}
                                  disabled={isPaid}
                                  onChange={() => {
                                    if (isPaid) return;
                                    let updated;
                                    if (isChecked) {
                                      updated = customSelectedMonths.filter(m => m !== month);
                                    } else {
                                      updated = [...customSelectedMonths, month];
                                    }
                                    setCustomSelectedMonths(updated);
                                    setDonationMonthInput(updated.length > 0 ? `Custom: ${updated.join(', ')}` : 'Custom Selection');
                                  }}
                                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-white/10 border-white/10"
                                />
                                <span className={`text-xs font-semibold ${isPaid ? 'line-through text-slate-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {month} {isPaid ? '(Paid)' : ''}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={donationDateInput}
                      onChange={(e) => setDonationDateInput(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-805 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                {/* Amount Status Checkbox Toggle */}
                <div>
                  <div className="flex items-center gap-2.5 p-3.5 px-4 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-900/30 rounded-2xl text-amber-700 dark:text-amber-400">
                    <input 
                      type="checkbox" 
                      id="amountPendingCheckbox"
                      checked={amountStatusInput === 'PENDING'} 
                      onChange={(e) => setAmountStatusInput(e.target.checked ? 'PENDING' : 'RECEIVED')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-white/10 border-white/10 cursor-pointer"
                    />
                    <label htmlFor="amountPendingCheckbox" className="text-xs font-black cursor-pointer select-none">
                      Amount Pending (Not Given)
                    </label>
                  </div>
                </div>

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

            const campaignersExportColumns = [
              { id: 'hn', label: 'R.NO', getValue: (c: any) => String(c.hn) },
              { id: 'name', label: 'Name', getValue: (c: any) => c.name },
              { id: 'class', label: 'Class', getValue: (c: any) => c.class },
            ];

            return (
              <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-20">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Campaigners Directory
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Full list of registered campaigners, classes, and Roll Numbers.</p>
                  </div>
                </div>

                {/* Filter controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      value={campaignerSearch}
                      onChange={(e) => setCampaignerSearch(e.target.value)}
                      placeholder="Search campaigner by name or R.NO..."
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
                      <option value="D3" className="text-slate-800">D3</option>
                      <option value="D2" className="text-slate-800">D2</option>
                      <option value="D1" className="text-slate-800">D1</option>
                      <option value="Plus two" className="text-slate-800">Plus two</option>
                      <option value="Plus one" className="text-slate-800">Plus one</option>
                    </select>
                  </div>
                  <div className="flex items-center z-40 relative">
                    <ExportMenu 
                      data={filteredCampaigners}
                      columns={campaignersExportColumns}
                      filename="campaigners_directory"
                      title="Campaigners Directory"
                    />
                  </div>
                </div>

                {/* Volunteers Table */}
                <div className="overflow-x-auto flex-1 max-h-[500px]">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                        <th className="py-3 px-4">R.NO</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Class / Batch</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Login Password</th>
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
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-slate-200/60 dark:bg-white/5 border border-slate-350 dark:border-white/10 px-2 py-1 rounded-lg text-slate-800 dark:text-slate-200 select-all">
                                halawa{item.hn}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`halawa${item.hn}`);
                                  setCopiedHn(item.hn);
                                  setTimeout(() => setCopiedHn(null), 1500);
                                }}
                                className="p-1 bg-[#0f4c81]/10 hover:bg-[#0f4c81]/25 text-[#0f4c81] dark:text-[#9cd4ff] rounded transition duration-200 cursor-pointer"
                                title="Copy Password"
                              >
                                {copiedHn === item.hn ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
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
          {activeTab === 'campaigners-stats' && (() => {
            const campaignersStatsData = campaignersList.map((item) => {
              const itemCampLower = item.name.trim().toLowerCase();
              const matches = safeDonations.filter(q => {
                const logged = q.notes?.match(/Logged by:\s*([^\.]+)/i)?.[1]?.trim()?.toLowerCase() || '';
                return logged && (logged === itemCampLower || logged.includes(itemCampLower) || itemCampLower.includes(logged));
              });
              const collected = matches.reduce((acc, q) => acc + Number(q.amount || 0), 0);
              const target = 10000;
              const percent = Math.min(100, Math.round((collected / target) * 100));
              const receiptsCount = matches.length;
              return { ...item, collected, percent, receiptsCount };
            });

            const campaignersStatsExportColumns = [
              { id: 'hn', label: 'R.NO', getValue: (c: any) => String(c.hn) },
              { id: 'name', label: 'Name', getValue: (c: any) => c.name },
              { id: 'class', label: 'Class', getValue: (c: any) => c.class },
              { id: 'collected', label: 'Collected', getValue: (c: any) => String(c.collected) },
              { id: 'receipts', label: 'Receipts', getValue: (c: any) => String(c.receiptsCount) },
              { id: 'targetProgress', label: 'Target Progress', getValue: (c: any) => `${c.percent}%` },
              { id: 'status', label: 'Status', getValue: (c: any) => 'Active' }
            ];

            return (
              <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-20">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Campaigners Stats
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Detailed breakdown of all active campaigners, targets, and collections.</p>
                  </div>
                  <div className="flex items-center z-40 relative">
                    <ExportMenu 
                      data={campaignersStatsData}
                      columns={campaignersStatsExportColumns}
                      filename="campaigners_stats"
                      title="Campaigners Stats"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto flex-1 max-h-[500px]">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-black">
                        <th className="py-3 px-4">R.NO</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Collected</th>
                        <th className="py-3 px-4">Receipts</th>
                        <th className="py-3 px-4">Target Progress</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignersStatsData.map((item) => (
                        <tr key={item.hn} className="border-b border-white/5 text-slate-800 dark:text-slate-300">
                          <td className="py-4 px-4 font-mono font-bold text-emerald-500">#{item.hn}</td>
                          <td className="py-4 px-4 font-bold uppercase">{item.name}</td>
                          <td className="py-4 px-4">{item.class}</td>
                          <td className="py-4 px-4 font-bold text-emerald-500">₹{item.collected.toLocaleString()}</td>
                          <td className="py-4 px-4 font-bold">{item.receiptsCount}</td>
                          <td className="py-4 px-4 min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200/50 dark:bg-black/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${item.percent}%` }} />
                              </div>
                              <span className="text-[10px] font-bold">{item.percent}%</span>
                            </div>
                          </td>
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

          {/* VIEW: Class Collections (Handovers Form & Recent list) */}
          {activeTab === 'class-collections' && (() => {
            const handleAddHandover = (e: React.FormEvent) => {
              e.preventDefault();
              if (!handoverAmount || !handoverLeader) {
                alert('Please fill out the Amount and Leader Name.');
                return;
              }
              const newHO = {
                id: `TOH-HO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                className: handoverClass,
                leader: handoverLeader,
                phone: handoverPhone || 'N/A',
                amount: Number(handoverAmount),
                month: handoverMonth,
                admin: handoverAdminName || 'Admin',
                date: new Date().toLocaleString()
              };
              setClassHandovers([newHO, ...classHandovers]);
              setHandoverAmount('');
              setHandoverLeader('');
              setHandoverPhone('');
              setHandoverAdminName('');
              alert('Class handover logged successfully!');
            };

            const handlePrintHO = (ho: any) => {
              const printWin = window.open('', '_blank');
              if (!printWin) return;
              printWin.document.write(`
                <html>
                  <head>
                    <title>Class Handover Receipt - ${ho.id}</title>
                    <style>
                      body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                      .receipt-card { border: 2px dashed #10b981; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; }
                      h2 { text-align: center; color: #10b981; margin-top: 0; }
                      .item-row { display: flex; justify-content: space-between; border-b: 1px solid #eee; padding: 8px 0; font-size: 14px; }
                      .label { font-weight: bold; color: #666; }
                      .val { font-weight: bold; }
                      .total { font-size: 18px; color: #10b981; border-top: 2px solid #10b981; padding-top: 10px; margin-top: 10px; }
                      .footer-note { text-align: center; font-size: 11px; color: #999; margin-top: 20px; }
                    </style>
                  </head>
                  <body>
                    <div class="receipt-card">
                      <h2>CLASS HANDOVER RECEIPT</h2>
                      <div class="item-row"><span class="label">Receipt No:</span><span class="val">${ho.id}</span></div>
                      <div class="item-row"><span class="label">Class:</span><span class="val">${ho.className}</span></div>
                      <div class="item-row"><span class="label">Leader Name:</span><span class="val">${ho.leader}</span></div>
                      <div class="item-row"><span class="label">Leader Phone:</span><span class="val">${ho.phone}</span></div>
                      <div class="item-row"><span class="label">Month:</span><span class="val">${ho.month}</span></div>
                      <div class="item-row"><span class="label">Received By:</span><span class="val">${ho.admin || 'Admin'}</span></div>
                      <div class="item-row"><span class="label">Logged Date:</span><span class="val">${ho.date}</span></div>
                      <div class="item-row total"><span class="label">Amount Received:</span><span class="val">₹${ho.amount.toLocaleString()}.00</span></div>
                      <p class="footer-note">Generated by Token of Halawa Admin Portal</p>
                    </div>
                    <script>
                      window.onload = function() { window.print(); window.close(); }
                    </script>
                  </body>
                </html>
              `);
              printWin.document.close();
            };

            const classCollectionsExportColumns = [
              { id: 'receiptNo', label: 'Receipt No', getValue: (ho: any) => ho.id },
              { id: 'className', label: 'Class', getValue: (ho: any) => ho.className },
              { id: 'leader', label: 'Leader', getValue: (ho: any) => ho.leader },
              { id: 'phone', label: 'Phone', getValue: (ho: any) => ho.phone },
              { id: 'amount', label: 'Amount', getValue: (ho: any) => String(ho.amount) },
              { id: 'month', label: 'Month', getValue: (ho: any) => ho.month },
              { id: 'date', label: 'Date', getValue: (ho: any) => ho.date }
            ];

            return (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Form Card */}
                <div className={`p-6 md:p-8 rounded-3xl ${glassClass} space-y-4`}>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <IndianRupee className="w-5 h-5 text-emerald-400" />
                      Class Collections Handover
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Manage handovers and approve amounts received from Class Leaders.</p>
                  </div>

                  <form onSubmit={handleAddHandover} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Class Name</label>
                      <select 
                        value={handoverClass}
                        onChange={(e) => setHandoverClass(e.target.value)}
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                      >
                        {['Final year', 'D3', 'D2', 'D1', 'Plus two', 'Plus one'].map(c => (
                          <option key={c} value={c} className="text-slate-800">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Handover Month</label>
                      <input 
                        type="text"
                        value={handoverMonth}
                        onChange={(e) => setHandoverMonth(e.target.value)}
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amount Received (₹)</label>
                      <input 
                        type="number"
                        required
                        value={handoverAmount}
                        onChange={(e) => setHandoverAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Leader Name</label>
                      <input 
                        type="text"
                        required
                        value={handoverLeader}
                        onChange={(e) => setHandoverLeader(e.target.value)}
                        placeholder="Name of leader"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Leader Phone</label>
                      <input 
                        type="text"
                        value={handoverPhone}
                        onChange={(e) => setHandoverPhone(e.target.value)}
                        placeholder="WhatsApp number"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Admin Name</label>
                      <input 
                        type="text"
                        required
                        value={handoverAdminName}
                        onChange={(e) => setHandoverAdminName(e.target.value)}
                        placeholder="Admin Name"
                        className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>

                    <div className="md:col-span-3 pt-2">
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Save & Generate Receipt
                      </button>
                    </div>
                  </form>
                </div>

                {/* Recent Handovers List */}
                <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h4 className="font-bold text-slate-800 dark:text-white">Recent Class Handovers</h4>
                    <div className="flex items-center z-40 relative">
                      <ExportMenu 
                        data={classHandovers}
                        columns={classCollectionsExportColumns}
                        filename="class_handovers"
                        title="Recent Class Handovers"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-extrabold">
                          <th className="py-3 px-4">Receipt No</th>
                          <th className="py-3 px-4">Class Details</th>
                          <th className="py-3 px-4">Leader</th>
                          <th className="py-3 px-4">Amount & Month</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classHandovers.map(ho => (
                          <tr key={ho.id} className="border-b border-white/5 text-slate-800 dark:text-slate-300 font-medium">
                            <td className="py-4 px-4 font-mono text-xs">{ho.id}</td>
                            <td className="py-4 px-4"><span className="bg-indigo-500/10 text-indigo-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">{ho.className}</span></td>
                            <td className="py-4 px-4">
                              <span className="font-bold block text-slate-900 dark:text-white">{ho.leader}</span>
                              <span className="opacity-50 text-[9px] block mt-0.5">{ho.phone}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold block text-emerald-500">₹{ho.amount.toLocaleString()}.00</span>
                              <span className="opacity-50 text-[9px] block mt-0.5">For {ho.month}</span>
                            </td>
                            <td className="py-4 px-4 text-xs opacity-65">{ho.date}</td>
                            <td className="py-4 px-4 text-right">
                              <button 
                                onClick={() => handlePrintHO(ho)}
                                className="bg-slate-200/50 dark:bg-white/5 border border-slate-350 dark:border-white/10 hover:bg-slate-300/50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ml-auto"
                              >
                                Print
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* VIEW: Class Dashboard */}
          {activeTab === 'class-dashboard' && (
            <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-20">
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
                    {['Final year', 'D3', 'D2', 'D1', 'Plus two', 'Plus one'].map(name => (
                      <option key={name} value={name} className="text-slate-800">{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const targetClassLower = (selectedClassDashboard || '').trim().toLowerCase();
                const classCampaigners = campaignersList.filter(c => (c.class || '').trim().toLowerCase() === targetClassLower);
                const totalCampaigners = classCampaigners.length;
                const collected = safeDonations
                  .filter(q => (q.notes?.match(/Class:\s*([^\.]+)/i)?.[1]?.trim()?.toLowerCase() || '') === targetClassLower)
                  .reduce((acc, q) => acc + Number(q.amount || 0), 0);
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
                              <th className="py-2.5 px-4">R.NO</th>
                              <th className="py-2.5 px-4">Name</th>
                              <th className="py-2.5 px-4">Collected</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...classCampaigners]
                              .map(item => {
                                const itemCampLower = item.name.trim().toLowerCase();
                                const amount = safeDonations
                                  .filter(q => {
                                    const logged = q.notes?.match(/Logged by:\s*([^\.]+)/i)?.[1]?.trim()?.toLowerCase() || '';
                                    return logged && (logged === itemCampLower || logged.includes(itemCampLower) || itemCampLower.includes(logged));
                                  })
                                  .reduce((acc, q) => acc + Number(q.amount || 0), 0);
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
          {activeTab === 'donors' && (() => {
            
            const mappedDonors = allAvailableDonors
              .map(d => {
                const donorDonations = safeDonations.filter(q => {
                  const qId = q.donorId || q.donor?.id;
                  const qName = q.donor?.name?.trim()?.toLowerCase();
                  const dName = d.name?.trim()?.toLowerCase();
                  const dId = String(d.id);
                  if (qId && String(qId) === dId) return true;
                  if (d.uniqueId && qId && String(qId) === String(d.uniqueId)) return true;
                  if (qName && dName && qName === dName) return true;
                  return false;
                });

                const lastDonation = donorDonations[0];
                
                let detectedPlan = 'CUSTOM';
                if (lastDonation?.notes) {
                  const planMatch = lastDonation.notes.match(/Plan:\s*([^.]+)/);
                  if (planMatch) detectedPlan = planMatch[1].trim().toUpperCase();
                } else if (d.category) {
                  detectedPlan = d.category.toUpperCase();
                }

                let campaignerName = 'Admin';
                let campaignerClass = 'NF3';
                
                if (donorDonations.length > 0) {
                  const donationWithLogger = donorDonations.find(q => q.notes?.includes('Logged by:'));
                  if (donationWithLogger?.notes) {
                    const nameMatch = donationWithLogger.notes.match(/Logged by:\s*([^.]+)/i);
                    if (nameMatch) campaignerName = nameMatch[1].trim();
                    
                    const classMatch = donationWithLogger.notes.match(/Class:\s*([^.]+)/i);
                    if (classMatch) {
                      campaignerClass = classMatch[1].trim();
                    }
                  }
                }

                const campRecord = campaignersList.find(c => c.name?.toLowerCase() === campaignerName?.toLowerCase());
                if (campRecord) {
                  campaignerClass = campRecord.class;
                  campaignerName = campRecord.name;
                }

                const paidMonths = donorDonations
                  .filter(q => q.status === 'APPROVED' || q.status === 'PENDING' || q.status === 'VERIFIED')
                  .flatMap(q => {
                    const monthMatch = q.notes?.match(/Month:\s*([^.]+)/);
                    if (!monthMatch) return [];
                    return monthMatch[1].replace('Custom:', '').split(',').map((m: string) => m.trim());
                  })
                  .filter(Boolean);

                const totalCollected = donorDonations
                  .filter(q => q.status === 'APPROVED' || q.status === 'PENDING' || q.status === 'VERIFIED')
                  .reduce((acc, q) => acc + Number(q.amount || 0), 0);

                const hasPending = donorDonations.some(q => q.status === 'PENDING');
                const hasApproved = donorDonations.some(q => q.status === 'APPROVED' || q.status === 'VERIFIED');
                const overallStatus = hasPending ? 'PENDING' : (hasApproved ? 'RECEIVED' : 'UNPAID');

                return {
                  ...d,
                  donorDonations,
                  detectedPlan,
                  campaignerName,
                  campaignerClass,
                  paidMonths,
                  totalCollected,
                  overallStatus
                };
              })
              .filter(d => d.donorDonations.length > 0 || (d as any).isManual);

            const filteredDonors = mappedDonors.filter(d => {
              const query = donorSearchQuery.toLowerCase().trim();
              const matchesSearch = !query || 
                (d.name || '').toLowerCase().includes(query) ||
                (d.phone || '').includes(query) ||
                (d.id || '').toLowerCase().includes(query) ||
                (d.uniqueId && d.uniqueId.toLowerCase().includes(query));

              const matchesCampaigner = donorDirectoryCampaigner === 'ALL' || d.campaignerName === donorDirectoryCampaigner;
              const matchesStatus = donorDirectoryStatus === 'ALL' || d.overallStatus === donorDirectoryStatus;
              const matchesMonth = donorDirectoryMonth === 'ALL' || d.paidMonths.includes(donorDirectoryMonth);
              const matchesPlan = donorDirectoryPlan === 'ALL' || d.detectedPlan === donorDirectoryPlan;

              return matchesSearch && matchesCampaigner && matchesStatus && matchesMonth && matchesPlan;
            });

              const donorsExportColumns = [
                { id: 'receipt', label: 'Receipt / REG ID', getValue: (d: any) => d.uniqueId || d.id || '' },
                { id: 'donorDetails', label: 'Donor Name', getValue: (d: any) => d.name || '' },
                { id: 'phone', label: 'Phone', getValue: (d: any) => d.phone || '' },
                { id: 'email', label: 'Email', getValue: (d: any) => d.email || '' },
                { id: 'plan', label: 'Plan', getValue: (d: any) => d.detectedPlan || '' },
                { id: 'months', label: 'Months', getValue: (d: any) => d.paidMonths?.join(', ') || '' },
                { id: 'place', label: 'Place / Category', getValue: (d: any) => d.location || d.category || 'General' },
                { id: 'campaigner', label: 'Campaigner', getValue: (d: any) => d.campaignerName || '' },
                { id: 'class', label: 'Class', getValue: (d: any) => d.campaignerClass || '' },
                { id: 'amount', label: 'Amount', getValue: (d: any) => String(d.totalCollected) },
                { id: 'status', label: 'Status', getValue: (d: any) => d.overallStatus || '' }
              ];

              const handleMergeSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!mergeSourceId || !mergeTargetId) {
                setMergeError('Please select both source and target profiles.');
                return;
              }
              if (mergeSourceId === mergeTargetId) {
                setMergeError('Source and target profiles cannot be the same.');
                return;
              }
              setMergeLoading(true);
              setMergeError('');
              setMergeSuccess('');
              try {
                const res = await fetch(`${API_URL}/donors/merge`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    sourceId: mergeSourceId,
                    targetId: mergeTargetId,
                    reason: mergeReason || 'Consolidation'
                  })
                });
                const data = await res.json();
                if (res.ok) {
                  setMergeSuccess('Profiles merged successfully!');
                  setMergeSourceId('');
                  setMergeTargetId('');
                  setMergeReason('');
                  fetchDatabaseData();
                } else {
                  setMergeError(data.message || data.error || 'Merge failed');
                }
              } catch (err) {
                setMergeError('Failed to connect to API server.');
              } finally {
                setMergeLoading(false);
              }
            };

            return (
              <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-20">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      Donors Registry Directory
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Manage, search, export and merge donor profiles registered under your hub.</p>
                  </div>
                  <div className="relative">
                    <ExportMenu 
                      data={filteredDonors}
                      columns={donorsExportColumns}
                      filename="donors_registry"
                      title="Donors Registry Directory"
                    />
                  </div>
                </div>

                {/* Filters & Search Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  <div className="col-span-2 sm:col-span-1">
                    <select
                      value={donorDirectoryCampaigner}
                      onChange={(e) => setDonorDirectoryCampaigner(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Campaigners</option>
                      {Array.from(new Set(campaignersList.map(c => c.name))).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={donorDirectoryStatus}
                      onChange={(e) => setDonorDirectoryStatus(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="RECEIVED">Received</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNPAID">Unpaid</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={donorDirectoryMonth}
                      onChange={(e) => setDonorDirectoryMonth(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Months</option>
                      {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(m => (
                        <option key={m} value={m}>{m.substring(0,3)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={donorDirectoryPlan}
                      onChange={(e) => setDonorDirectoryPlan(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Plans</option>
                      <option value="100/MONTH">100/MONTH</option>
                      <option value="200/MONTH">200/MONTH</option>
                      <option value="500/MONTH">500/MONTH</option>
                      <option value="1000/MONTH">1000/MONTH</option>
                      <option value="CUSTOM">CUSTOM</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1 relative flex">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={donorSearchQuery}
                      onChange={(e) => setDonorSearchQuery(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                </div>



                {/* Table */}
                <div className="overflow-x-auto">
                  {filteredDonors.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-bold">No matching donor profiles found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">
                          <th className="py-4 px-4 text-center"># / Reg ID</th>
                          <th className="py-4 px-4">Donor Details</th>
                          <th className="py-4 px-4 text-center">Subscription & Months</th>
                          <th className="py-4 px-4">Location</th>
                          <th className="py-4 px-4">Managed By</th>
                          <th className="py-4 px-4 text-right">Collected</th>
                          <th className="py-4 px-4 text-center">Status & Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonors.map((d: any, index) => {
                          const regDate = new Date(d.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          });

                          return (
                            <tr key={d.id} className="border-b border-white/5 text-slate-800 dark:text-slate-350 hover:bg-slate-500/5 transition-colors font-medium">
                              {/* Index & Registration ID */}
                              <td className="py-4 px-4 text-center">
                                <div className="flex flex-col items-center gap-1.5">
                                  <span className="font-extrabold text-slate-400 dark:text-slate-600 text-xs">{index + 1}</span>
                                  <span className="font-mono text-[10px] text-slate-900 dark:text-slate-200 bg-slate-200/60 dark:bg-black/30 px-2 py-0.5 rounded border border-slate-300/40 dark:border-white/5 uppercase tracking-tighter">
                                    {d.uniqueId || `MHB-2026-${index + 1001}`}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold block">{regDate}</span>
                                </div>
                              </td>

                              {/* Donor Details */}
                              <td className="py-4 px-4">
                                <div className="flex flex-col gap-1 max-w-[200px]">
                                  <span className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{d.name}</span>
                                  <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                                    <a href={`tel:${d.phone}`} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition">
                                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      {d.phone}
                                    </a>
                                    <a 
                                      href={`https://wa.me/${d.whatsApp || d.phone}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center gap-1 text-emerald-500 hover:text-emerald-400 font-bold transition mt-0.5"
                                    >
                                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.392 9.807-9.809.002-2.624-1.01-5.092-2.859-6.944-1.848-1.85-4.316-2.868-6.945-2.87-5.407 0-9.81 4.403-9.814 9.818-.002 1.714.453 3.39 1.317 4.873L1.758 22.24l4.889-1.286zm11.393-7.61c-.244-.122-1.447-.714-1.67-.796-.223-.082-.387-.122-.55.122-.162.244-.63.796-.772.957-.143.163-.285.183-.528.061-.243-.122-1.026-.378-1.954-1.206-.723-.645-1.212-1.442-1.354-1.686-.143-.244-.015-.376.107-.497.11-.11.244-.285.366-.427.122-.143.163-.244.244-.407.082-.163.041-.306-.02-.427-.062-.122-.55-1.324-.753-1.812-.198-.48-.399-.415-.55-.422-.143-.008-.306-.01-.469-.01-.163 0-.427.061-.65.306-.223.244-.854.835-.854 2.037 0 1.201.874 2.362.996 2.525.122.163 1.721 2.628 4.17 3.687.582.252 1.036.402 1.39.515.585.186 1.117.16 1.538.098.469-.069 1.447-.591 1.65-.163.203-.57.203-1.06.143-1.14-.06-.083-.223-.123-.467-.245z" />
                                      </svg>
                                      {d.phone}
                                    </a>
                                  </div>
                                </div>
                              </td>

                              {/* Subscription Plan & Payment Month Buttons */}
                              <td className="py-4 px-4">
                                  <div className="flex flex-col items-center gap-1.5 min-w-[210px]">
                                    <div className="grid grid-cols-5 gap-1 text-[9px] font-bold">
                                    {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(month => {
                                      const isPaid = d.paidMonths.includes(month);
                                      const shortName = month.substring(0, 3);
                                      return (
                                        <span 
                                          key={month} 
                                          title={isPaid ? `Paid for ${month}` : `Unpaid for ${month}`}
                                          onClick={() => {
                                            if (isPaid) {
                                              const donation = d.donorDonations.find((q: any) => q.notes?.includes(month));
                                              if (donation) {
                                                const itemPlan = donation.notes?.match(/Plan:\s*([^\.]+)/)?.[1] || '';
                                                setSelectedReceiptData({
                                                  receiptNo: donation.receipts?.[0]?.receiptNumber || `TOH-2026-${donation.id.split('-')[0].slice(0, 4).toUpperCase()}`,
                                                  date: donation.createdAt || donation.date || new Date().toISOString(),
                                                  name: d.name,
                                                  phone: d.phone,
                                                  place: d.location || d.category || 'General',
                                                  amount: donation.amount,
                                                  month: month,
                                                  paidMonths: d.paidMonths || [],
                                                  plan: itemPlan
                                                });
                                                setShowReceiptModal(true);
                                              }
                                            }
                                          }}
                                          className={`px-1.5 py-0.5 rounded text-center transition-all min-w-[34px] uppercase select-none ${isPaid ? 'cursor-pointer hover:scale-105' : ''} ${
                                            isPaid 
                                              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm shadow-emerald-500/20' 
                                              : 'bg-slate-200/50 dark:bg-black/25 text-slate-400 dark:text-slate-500 border border-slate-350 dark:border-white/5'
                                          }`}
                                        >
                                          {shortName}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </td>

                              {/* Location */}
                              <td className="py-4 px-4">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {d.fatherName || 'General'}
                                </span>
                              </td>

                              {/* Managed by (Campaigner) */}
                              <td className="py-4 px-4">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                                    {d.campaignerName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                                    Class: {d.campaignerClass}
                                  </span>
                                </div>
                              </td>

                              {/* Total Collected Amount */}
                              <td className="py-4 px-4 text-right">
                                <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                  ₹{d.totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </td>

                              {/* Status & Actions */}
                              <td className="py-4 px-4">
                                <div className="flex flex-col items-center gap-1.5">
                                  <div className="flex items-center gap-1">
                                    <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black px-2 py-0.5 rounded border border-blue-500/25 uppercase shrink-0">
                                      Received
                                    </span>
                                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-500/25 flex items-center gap-0.5 uppercase shrink-0">
                                      <Check className="w-2.5 h-2.5" /> Verified
                                    </span>
                                  </div>
                                  <div className="flex gap-2 w-full mt-2">
                                    <button 
                                      onClick={() => {
                                        setDonorPhoneInput(d.phone);
                                        setDonorNameInput(d.name);
                                        setDonorIdInput(d.uniqueId || d.id);
                                        setRenewSearchQuery(d.name || '');
                                        setDonationTab('renew');
                                        setActiveTab('v-add');
                                      }}
                                      className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1 py-1 rounded text-[10px] font-black transition border border-emerald-500/20 uppercase text-center"
                                    >
                                      Renew
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDonor(d.id)}
                                      className="px-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded transition flex items-center justify-center"
                                      title="Delete Donor Permanently"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })()}

          {/* VIEW: Class Rankings / Leaderboard */}
          {(activeTab === 'rankings' || activeTab === 'v-leaderboard') && (() => {
            const rankedClasses = ['Final year', 'D3', 'D2', 'D1', 'Plus two', 'Plus one']
              .map((className) => {
                const targetClassLower = className.trim().toLowerCase();
                const campaignersCount = campaignersList.filter(c => (c.class || '').trim().toLowerCase() === targetClassLower).length;
                const matches = safeDonations.filter(q => (q.notes?.match(/Class:\s*([^\.]+)/i)?.[1]?.trim()?.toLowerCase() || '') === targetClassLower);
                const collected = matches.reduce((acc, q) => acc + Number(q.amount || 0), 0);
                const achieved = new Set(matches.map(q => q.donorId || q.donor?.id || q.donor?.name || q.id)).size;
                return { className, campaigners: campaignersCount, collected, achieved };
              })
              .sort((a, b) => b.collected - a.collected);

            const rankingsExportColumns = [
              { id: 'rank', label: 'Rank', getValue: (r: any) => `#${r.rank}` },
              { id: 'className', label: 'Class Name', getValue: (r: any) => r.className },
              { id: 'campaigners', label: 'Campaigners', getValue: (r: any) => r.campaigners },
              { id: 'targetDonors', label: 'Target Donors', getValue: (r: any) => r.campaigners * 5 },
              { id: 'achievedDonors', label: 'Achieved Donors', getValue: (r: any) => r.achieved },
              { id: 'collectedAmount', label: 'Collected Amount', getValue: (r: any) => String(r.collected) },
            ];
            const exportData = rankedClasses.map((c, i) => ({ ...c, rank: i + 1 }));



            return (
              <div className={`p-6 rounded-3xl flex-1 flex flex-col ${glassClass}`}>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-20">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Class Rankings & Progress
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Real-time target leaderboard sorted by class collections.</p>
                  </div>
                  <div className="relative z-40">
                    <ExportMenu 
                      data={exportData}
                      columns={rankingsExportColumns}
                      filename="class_rankings"
                      title="Class Rankings & Progress"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-extrabold">
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Class Name</th>
                        <th className="py-3 px-4">Campaigners</th>
                        <th className="py-3 px-4">Target Donors</th>
                        <th className="py-3 px-4">Achieved %</th>
                        <th className="py-3 px-4 text-right">Collected Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankedClasses.map((item, index) => {
                        const targetDonors = item.campaigners * 5;
                        const percent = targetDonors > 0 ? Math.min(100, Math.round((item.achieved / targetDonors) * 100)) : 0;
                        
                        return (
                          <tr key={item.className} className="border-b border-white/5 text-slate-800 dark:text-slate-300 font-medium">
                            <td className="py-4 px-4 font-mono font-bold text-amber-500">#{index + 1}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white uppercase">{item.className}</span>
                                <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase border border-yellow-500/20">Min Target</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-bold opacity-75">{item.campaigners}</td>
                            <td className="py-4 px-4 font-bold opacity-75">{targetDonors} (Max)</td>
                            <td className="py-4 px-4 min-w-[150px]">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-slate-200/50 dark:bg-black/30 h-2 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="text-[10px] font-bold shrink-0">{percent}% max</span>
                              </div>
                              <span className="text-[8px] opacity-50 block mt-0.5">{item.achieved} / {targetDonors} Donors</span>
                            </td>
                            <td className="py-4 px-4 text-right font-black text-emerald-500 text-sm">₹{item.collected.toLocaleString()}.00</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })()}

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
            const getLoggedBy = (note?: string) => note?.match(/Logged by:\s*([^.]+)/i)?.[1]?.trim()?.toLowerCase() || '';
            const getClass = (note?: string) => note?.match(/Class:\s*([^.]+)/i)?.[1]?.trim()?.toLowerCase() || '';
            const currentUserName = (user?.fullName || '').trim().toLowerCase();

            // 1. Calculate stats for logged-in campaigner
            const myCollections = safeDonations.filter(q => {
              const logged = getLoggedBy(q.notes);
              if (!logged) return true; // If logged empty, include in campaigner view
              if (!currentUserName) return true;
              return logged === currentUserName || logged.includes(currentUserName) || currentUserName.includes(logged) || logged.includes('asif') || currentUserName.includes('asif');
            });
            const myCollectedTotal = myCollections.reduce((acc, q) => acc + Number(q.amount || 0), 0);
            
            // Expected collections of donors registered by this campaigner
            const myExpectedTotal = 5000; 
            const myNotReceivedTotal = Math.max(0, myExpectedTotal - myCollectedTotal);
            const myDonorsCount = new Set(myCollections.map(q => q.donorId || q.donor?.id || q.id)).size;

            // 2. Calculate ranks dynamically from real data
            const calculatedCampaignerStats = campaignersList.map(c => {
              const cNameLower = c.name.trim().toLowerCase();
              const matches = safeDonations.filter(q => {
                const isValid = ['APPROVED', 'VERIFIED', 'PENDING'].includes(q.status);
                if (!isValid) return false;
                const logged = getLoggedBy(q.notes);
                return logged && (logged === cNameLower || logged.includes(cNameLower) || cNameLower.includes(logged));
              });
              const total = matches.reduce((acc, q) => acc + Number(q.amount), 0);
              return { name: c.name, class: c.class, donorsCount: matches.length, total };
            });

            const allCampaignerStats = [...calculatedCampaignerStats].sort((a, b) => b.total - a.total);

            // Find index of current campaigner in overall list
            const overallRankIndex = allCampaignerStats.findIndex(c => c.name?.toLowerCase() === currentUserName);
            const overallRank = overallRankIndex !== -1 ? overallRankIndex + 1 : allCampaignerStats.length + 1;

            // Filter for current campaigner's class
            const myClass = ((user as any)?.class || '').trim().toLowerCase();
            const classCampaignerStats = allCampaignerStats.filter(c => c.class?.trim()?.toLowerCase() === myClass);
            const classRankIndex = classCampaignerStats.findIndex(c => c.name?.toLowerCase() === currentUserName);
            const classRank = classRankIndex !== -1 ? classRankIndex + 1 : classCampaignerStats.length + 1;

            // 3. Leading Collectors (Top 5 Campaigners overall)
            const leadingCollectors = allCampaignerStats.slice(0, 5);

            // 4. Top Batches (Top 5 Classes)
            const classNames = Array.from(new Set(campaignersList.map(c => c.class)));
            const calculatedClassStats = classNames
              .map(className => {
                const targetClassLower = className.trim().toLowerCase();
                const matches = safeDonations.filter(q => {
                  const isValid = ['APPROVED', 'VERIFIED', 'PENDING'].includes(q.status);
                  if (!isValid) return false;
                  return getClass(q.notes) === targetClassLower;
                });
                const total = matches.reduce((acc, q) => acc + Number(q.amount), 0);
                const activeCamps = campaignersList.filter(c => c.class.trim().toLowerCase() === targetClassLower).length;
                const donorIds = new Set(matches.map(q => q.donorId || q.donor?.id || q.id));
                return { className, total, receivers: activeCamps, donorsCount: donorIds.size };
              })
              .sort((a, b) => b.total - a.total);
            const topBatches = calculatedClassStats.slice(0, 5);

            return (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Message from Admin banner */}
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-800 dark:text-slate-200 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0"><Bell className="w-4 h-4" /></div>
                    <div>
                      <span className="font-bold block">{t.messageFromAdmin} <span className="opacity-50 text-[10px] font-normal ml-2">13 Jul 2026, 04:30 PM</span></span>
                      <span className="opacity-80">Campaign tracking active. Ensure all physical receipt uploads are verified.</span>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0">{t.markAsRead}</button>
                </div>

                {/* personal stats metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <span className="text-xs font-bold opacity-60 uppercase">{t.totalCollected}</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">₹{myCollectedTotal.toLocaleString()}.00</h3>
                  </div>
                  
                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold opacity-60 uppercase">{t.totalDonors}</span>
                      <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full">{t.active}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">
                      {myDonorsCount} <span className="text-xs font-medium opacity-50">{t.profiles}</span>
                    </h3>
                  </div>

                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <span className="text-xs font-bold opacity-60 uppercase">{t.overallRank}</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">#{overallRank}</h3>
                  </div>

                  <div className={`p-6 rounded-3xl ${glassClass} flex flex-col justify-between`}>
                    <span className="text-xs font-bold opacity-60 uppercase">{t.classRank}</span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">#{classRank}</h3>
                  </div>
                </div>

                {/* Bottom ranking boards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Leading Collectors card */}
                  <div className="bg-gradient-to-br from-[#0c82f2] to-[#0762cf] text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                        {t.leadingCollectors}
                      </h4>
                      <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
                    </div>
                    <div className="space-y-3.5">
                      {leadingCollectors.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-xs text-white shrink-0">
                              #{i + 1}
                            </span>
                            <div>
                              <p className="font-extrabold uppercase text-slate-50 tracking-wide text-xs">{item.name}</p>
                              <p className="text-white/80 text-[10px] mt-0.5 font-medium">{item.class} • {item.donorsCount} donors</p>
                            </div>
                          </div>
                          <span className="font-black text-white text-sm">₹{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leaderboard card */}
                  <div className={`p-6 rounded-3xl ${glassClass} space-y-4`}>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                        {t.leaderboard}
                      </h4>
                      <Activity className="w-4 h-4 text-[#0c7ae6]" />
                    </div>
                    <div className="space-y-3.5">
                      {topBatches.map((item, i) => {
                        const rankColors = [
                          "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30",
                          "bg-slate-300/30 text-slate-600 dark:text-slate-400 border border-slate-350",
                          "bg-orange-400/20 text-orange-600 dark:text-orange-400 border border-orange-400/30"
                        ];
                        const isMedal = i < 3;
                        return (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                                isMedal 
                                  ? rankColors[i] 
                                  : "bg-[#e8f2fc] dark:bg-black/20 text-[#0c7ae6] dark:text-slate-400"
                              }`}>
                                #{i + 1}
                              </span>
                              <div>
                                <p className="font-extrabold uppercase text-[#0f4c81] dark:text-[#9cd4ff] tracking-wide text-xs">{item.className}</p>
                                <p className="opacity-60 text-[10px] mt-0.5">{item.receivers} receivers • {item.donorsCount} donors</p>
                              </div>
                            </div>
                            <span className="font-black text-[#0c7ae6] dark:text-[#38bdf8] text-sm">₹{item.total.toLocaleString()}</span>
                          </div>
                        );
                      })}
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
      {/* Important Instructions Modal popup */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#0b3c5d] text-slate-100 border border-[#1d5c88] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col transform animate-in zoom-in-95 duration-350">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#0d4771]">
              <h3 className="text-lg font-black tracking-wide text-slate-105">Important Instructions</h3>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-white/70 hover:text-white transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body content with Malayalam texts */}
            <div className="p-6 md:p-8 space-y-6 font-medium text-sm md:text-base leading-relaxed text-left text-slate-200 overflow-y-auto max-h-[70vh]">
              <div className="flex gap-3">
                <span className="font-extrabold text-[#9cd4ff] shrink-0">1.</span>
                <p className="font-malayalam text-slate-100 font-bold leading-relaxed">താല്പര്യമുള്ള വരിക്കാരിൽ നിന്നും ഒന്നിലധികം മാസങ്ങളിലെ വരിസംഖ്യ ഒന്നിച്ചു (മുൻകൂറായി) കൈപ്പറ്റാവുന്നതാണ്.</p>
              </div>

              <div className="flex gap-3">
                <span className="font-extrabold text-[#9cd4ff] shrink-0">2.</span>
                <div>
                  <p className="font-extrabold text-[#9cd4ff] mb-1">Advance Collection:</p>
                  <p className="font-malayalam text-slate-100 font-bold leading-relaxed">ഒന്നിലധികം മാസത്തെ തുക മുൻകൂറായി വാങ്ങുകയാണെങ്കിൽ, ഓരോ മാസത്തേക്കും വെവ്വേറെ (ഉദാഹരണത്തിന്: 500 രൂപയുടെ 3 റെസീപ്റ്റുകൾ) ആഡ് ചെയ്യേണ്ടതാണ്.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="font-extrabold text-[#9cd4ff] shrink-0">3.</span>
                <div>
                  <p className="font-extrabold text-[#9cd4ff] mb-1">ഈ ആപ്പ് ഉപയോഗിച്ച് പിരിക്കുന്ന തുക:</p>
                  <p className="font-malayalam text-slate-100 font-bold leading-relaxed">കാഷ് ആയി വാങ്ങിയ തുക കാമ്പയിനർമാർ ഈ ആപ്പിൽ ആഡ് ചെയ്ത ശേഷം അഡ്മിനെ നേരിട്ട് ഏൽപ്പിക്കുകയാണെങ്കിൽ അഡ്മിൻ 'Verify Physical' വഴി അത് അപ്രൂവ് ചെയ്യണം. ഓൺലൈനായി ബാങ്ക് അക്കൗണ്ടിലേക്ക് അയക്കുന്ന തുകയ്ക്ക് ഈ അപ്രൂവൽ ആവശ്യമില്ല.</p>
                </div>
              </div>
            </div>

            {/* Footer OK Button */}
            <div className="p-6 pt-0 flex justify-center border-t border-white/5 bg-[#0b3c5d]">
              <button
                onClick={() => setShowInstructions(false)}
                className="bg-[#0f4c81] hover:bg-[#135c9b] text-white border border-[#2370ae] px-12 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdminGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0b1120] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col transform animate-in zoom-in-95 duration-350">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <h3 className="text-lg font-black tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" /> അഡ്മിൻ ഗൈഡ് (Admin Guide)
              </h3>
              <button onClick={() => setShowAdminGuide(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6 font-malayalam text-sm md:text-base leading-relaxed overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">1. Analytics (അനലിറ്റിക്സ്)</h4>
                  <p>എത്ര രൂപ കളക്ട് ചെയ്തു, ടാർഗെറ്റ് എത്ര ബാക്കിയുണ്ട്, പുതിയ എൻട്രികൾ എന്നിവയുടെ പൂർണ്ണരൂപം ഇവിടെ കാണാം.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">2. Donation Entries (ഡൊണേഷൻ എൻട്രികൾ)</h4>
                  <p>എല്ലാ കുട്ടികളും (ക്യാമ്പയിനർമാർ) ആഡ് ചെയ്ത ഡൊണേഷൻ വിവരങ്ങളും ഇതിന്റെ സ്റ്റാറ്റസും ഇവിടെ പരിശോധിക്കാം. അവർ നേരിട്ട് പണം സ്വീകരിച്ചതാണോ അതോ അക്കൗണ്ടിലേക്ക് അയച്ചതാണോ എന്നും അറിയാൻ കഴിയും.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">3. Verify Physical (പണം വെരിഫൈ ചെയ്യാൻ)</h4>
                  <p>കുട്ടികൾ നേരിട്ട് പണം വാങ്ങിയാൽ (Physical Cash), അവർ ആ പണം അഡ്മിനെ ഏൽപ്പിക്കുമ്പോൾ ഇവിടെ നിന്ന് 'Verify' ചെയ്യാവുന്നതാണ്. ഇത് വഴി അക്കൗണ്ടിംഗ് കൃത്യമായി നിലനിർത്താം.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">4. Manage Campaigners (ക്യാമ്പയിനർമാരെ നിയന്ത്രിക്കാൻ)</h4>
                  <p>പുതിയ കുട്ടികളെ (ക്യാമ്പയിനർമാരെ) ആഡ് ചെയ്യാനും, എഡിറ്റ് ചെയ്യാനും, ഡിലീറ്റ് ചെയ്യാനും ഈ ഭാഗം ഉപയോഗിക്കാം. അവരുടെ പാസ്സ്‌വേർഡ് റീസെറ്റ് ചെയ്യാനും ഇവിടെ ഓപ്ഷൻ ഉണ്ട്.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">5. Donors Directory (ഡോണേഴ്സ് ഡയറക്ടറി)</h4>
                  <p>ഇതുവരെ സംഭാവന നൽകിയ എല്ലാവരുടെയും വിവരങ്ങൾ ഇവിടെ ലഭിക്കും. ഓരോരുത്തർക്കും പുതിയ റീസിപ്റ്റ് അയക്കാനും, പഴയ പ്ലാൻ പുതുക്കാനും (Renew) 'Add Receipt' അല്ലെങ്കിൽ 'Renew' ബട്ടൺ ഉപയോഗിക്കാം.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 flex justify-end border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 mt-4">
              <button
                onClick={() => setShowAdminGuide(false)}
                className="mt-4 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm cursor-pointer"
              >
                മനസ്സിലായി (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
      
      
      {/* EDIT / UPDATE DONOR & DONATION MODAL */}
      {editingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setEditingDonation(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-amber-500" /> Update Collection & Donor Info
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Modify donor name, location, phone, amount or payment status.</p>

            <form onSubmit={handleSaveEditDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Donor Name
                </label>
                <input
                  type="text"
                  required
                  value={editDonorName}
                  onChange={e => setEditDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Place / Location
                  </label>
                  <input
                    type="text"
                    value={editDonorPlace}
                    onChange={e => setEditDonorPlace(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    value={editDonorPhone}
                    onChange={e => setEditDonorPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5 flex items-center justify-between">
                    <span>Amount (₹)</span>
                    {selectedRole !== 'admin' && (
                      <span className="text-[10px] text-amber-500 font-normal lowercase">(Admin edit only)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    required
                    disabled={selectedRole !== 'admin'}
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-extrabold outline-none ${
                      selectedRole !== 'admin'
                        ? 'bg-slate-200/60 dark:bg-black/50 border-slate-300 dark:border-white/5 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        : 'bg-slate-100 dark:bg-black/30 border-slate-300 dark:border-white/10 text-slate-800 dark:text-white focus:border-amber-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-sm font-extrabold outline-none focus:border-amber-500"
                  >
                    <option value="GIVEN" className="text-slate-800">Amount Received</option>
                    <option value="NOT_GIVEN" className="text-slate-800">Amount Pending (Not Given)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Month
                  </label>
                  <select
                    value={editMonth}
                    onChange={e => setEditMonth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-amber-500"
                  >
                    {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(m => (
                      <option key={m} value={m} className="text-slate-800">{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Plan
                  </label>
                  <select
                    value={editPlan}
                    onChange={e => setEditPlan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-sm font-semibold outline-none focus:border-amber-500"
                  >
                    {['100/month', '200/month', '500/month', '1000/month'].map(p => (
                      <option key={p} value={p} className="text-slate-800">{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingDonation(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-lg transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ReceiptModal 
        isOpen={showReceiptModal} 
        onClose={() => { setShowReceiptModal(false); setWhatsAppAutoShare(false); }} 
        receiptData={selectedReceiptData}
        customLayout={customLayout}
        autoShareWhatsApp={whatsAppAutoShare}
      />
    </div>
  );
}
