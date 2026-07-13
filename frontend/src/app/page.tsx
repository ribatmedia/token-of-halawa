'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Heart, Users, Trophy, Flame, ShieldAlert, Award, Star, 
  MapPin, Phone, Mail, ArrowRight, UserCheck, Sparkles, LayoutDashboard 
} from 'lucide-react';

interface VolunteerData {
  name: string;
  unit: string;
  total: number;
  donors: number;
}

interface ClassData {
  className: string;
  total: number;
  donors: number;
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [studentView, setStudentView] = useState<'overall' | 'today'>('overall');
  const [classView, setClassView] = useState<'classes' | 'today'>('classes');

  // Slider slides
  const slides = [
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

  // Rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Leaderboard rotation
  useEffect(() => {
    const studentTimer = setInterval(() => {
      setStudentView(prev => prev === 'overall' ? 'today' : 'overall');
    }, 5000);

    const classTimer = setInterval(() => {
      setClassView(prev => prev === 'classes' ? 'today' : 'classes');
    }, 5000);

    return () => {
      clearInterval(studentTimer);
      clearInterval(classTimer);
    };
  }, []);

  // Static mockup data mirroring the Mahabba structure with actual campaigners
  const topVolunteers = [
    { name: "Asif ali", unit: "Final year", total: 12400, donors: 42 },
    { name: "Bishrul wafa", unit: "Final year", total: 9850, donors: 31 },
    { name: "Muhammed Falil", unit: "Final year", total: 8900, donors: 28 },
    { name: "Adhil Ameen", unit: "Degree Third year", total: 7200, donors: 22 },
    { name: "Muhammed Ali", unit: "Degree second year", total: 6150, donors: 19 }
  ];

  const todayVolunteers = [
    { name: "Sinan Cheekod", unit: "Final year", total: 1550, donors: 6 },
    { name: "Muhammed Melattoor", unit: "Degree first year", total: 1200, donors: 4 }
  ];



  const topClasses = [
    { className: "Final year", total: 34200, donors: 104 },
    { className: "Degree Third year", total: 28900, donors: 88 },
    { className: "Degree second year", total: 22100, donors: 71 },
    { className: "Plus two", total: 19500, donors: 60 }
  ];

  const todayClasses = [
    { className: "Final year", total: 2400, donors: 9 },
    { className: "Degree Third year", total: 1850, donors: 6 }
  ];



  const renderLeaderboardItem = (item: VolunteerData, index: number, rankColor: string) => (
    <div key={index} className="flex items-center gap-3 md:gap-4 rounded-2xl bg-white/70 border border-slate-200/60 px-4 md:px-5 py-4 backdrop-blur hover:bg-slate-100/50 transition-all duration-300 shadow-sm">
      <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full bg-slate-200/50 ${rankColor} flex items-center justify-center font-extrabold shadow-sm shrink-0 text-sm md:text-base`}>
        #{index + 1}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-extrabold text-slate-800 text-sm md:text-base uppercase truncate leading-tight">{item.name}</p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{item.unit} · {item.donors} donors</p>
      </div>
      <div className="font-black text-emerald-600 text-base md:text-lg shrink-0 ml-1">
        ₹{item.total}
      </div>
    </div>
  );

  const renderClassItem = (cls: ClassData, index: number, isLive = false) => {
    const medalColors = [
      'from-amber-400 to-yellow-500 shadow-yellow-500/20',
      'from-slate-400 to-slate-500 shadow-slate-500/20',
      'from-amber-700 to-amber-900 shadow-amber-900/20'
    ];

    return (
      <div key={index} className="flex items-center gap-4 rounded-2xl bg-white/70 border border-slate-200/60 px-5 py-4 hover:bg-slate-100/50 transition-all duration-300 shadow-sm">
        {index < 3 ? (
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${medalColors[index]} text-white flex items-center justify-center font-extrabold shadow-lg shrink-0`}>
            <Trophy className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-slate-200/50 text-slate-750 flex items-center justify-center font-extrabold shadow-sm shrink-0">
            #{index + 1}
          </div>
        )}
        
        <div className="flex-1 min-w-0 text-left">
          <p className="font-extrabold text-slate-800 text-base md:text-lg uppercase truncate">{cls.className}</p>
          <p className="text-xs text-slate-500 truncate">{cls.donors} donors {isLive ? 'today' : ''}</p>
        </div>
        <div className="font-black text-emerald-600 text-base md:text-lg shrink-0 ml-2">
          ₹{cls.total}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden">
      
      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-1 pointer-events-none opacity-40" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-2 pointer-events-none opacity-40" />
      <div className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full ambient-glow-3 pointer-events-none opacity-40" />

      {/* Navbar */}
      <nav className="fixed w-full z-50 backdrop-blur-xl bg-white/75 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-650 bg-clip-text text-transparent leading-none">
                  Token of Halawa
                </h1>
                <p className="text-[8px] font-extrabold text-slate-500 tracking-widest mt-1 uppercase">Connecting Hearts Spreading Smiles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-bold text-sm transition">
                Live Stats
              </Link>
              <Link href="/dashboard" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2 text-sm">
                <LayoutDashboard className="w-4 h-4" /> Portal Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Web Banner Slider Card (CSS Styled slides) */}
      <section className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-8 md:p-12 transition-all duration-700 ${slides[activeSlide].bg}`}>
            <div className="relative z-10 max-w-2xl text-left">
              <span className={`text-xs uppercase font-extrabold tracking-wider ${slides[activeSlide].accent}`}>Campaign Slider</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 transition-all duration-500">
                {slides[activeSlide].title}
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                {slides[activeSlide].desc}
              </p>
            </div>
            {/* Dots */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveSlide(index)} 
                  className={`w-2.5 h-2.5 rounded-full border border-slate-400/50 transition-all ${activeSlide === index ? 'bg-slate-900 scale-125' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pt-20 pb-24 text-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 font-extrabold text-xs uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> Managed by RIBAT Students Union
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Connecting Hearts<br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">Spreading Smiles</span>
          </h1>
          <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto font-semibold leading-relaxed mb-10">
            Welcome to the Token of Halawa donation intelligence engine. Track live collections, verify receipts, and empower campaigns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-base px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#leaderboard" className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-base transition flex items-center justify-center gap-2 shadow-sm">
              <Trophy className="w-5 h-5 text-amber-500" /> View Leaderboard
            </a>
          </div>
        </div>
      </section>

      {/* Scrolling Announcement Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 overflow-hidden border-y border-emerald-400/30 shadow-lg">
        <div className="whitespace-nowrap overflow-hidden">
          <div className="inline-block animate-[scroll_25s_linear_infinite] text-xs font-black tracking-widest uppercase">
            <span className="mx-6"><span className="text-amber-300">★</span> Welcome to Token of Halawa donation program</span>
            <span className="mx-6"><span className="text-amber-300">★</span> Live tracking of monthly targets and campaign approvals active</span>
            <span className="mx-6"><span className="text-amber-300">★</span> Direct WhatsApp verification now enabled for all campaigners</span>
            {/* Repeat for looping effect */}
            <span className="mx-6"><span className="text-amber-300">★</span> Welcome to Token of Halawa donation program</span>
            <span className="mx-6"><span className="text-amber-300">★</span> Live tracking of monthly targets and campaign approvals active</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Live Leaderboard</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">Real-time campaigner and class donation collections index</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Campaigners Leaderboard Card */}
            <div className="rounded-3xl bg-white/75 border border-slate-200/85 p-6 md:p-8 flex flex-col min-h-[500px] relative overflow-hidden shadow-xl backdrop-blur-xl">
              
              {/* Overall Top Campaigners */}
              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col transition-all duration-700 ${studentView === 'overall' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-800">Top Campaigners</h3>
                  <Trophy className="w-7 h-7 text-amber-500 animate-pulse" />
                </div>
                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {topVolunteers.map((item, i) => renderLeaderboardItem(item, i, 'text-amber-500'))}
                </div>
              </div>

              {/* Today's Top Campaigners */}
              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col transition-all duration-700 ${studentView === 'today' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-800">Today's Top</h3>
                  <Flame className="w-7 h-7 text-orange-500 animate-bounce" />
                </div>
                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {todayVolunteers.map((item, i) => renderLeaderboardItem(item, i, 'text-orange-500'))}
                </div>
              </div>



            </div>

            {/* Classes Leaderboard Card */}
            <div className="rounded-3xl bg-white/75 border border-slate-200/85 p-6 md:p-8 flex flex-col min-h-[500px] relative overflow-hidden shadow-xl backdrop-blur-xl">
              
              {/* Top Classes View */}
              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col transition-all duration-700 ${classView === 'classes' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-6 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Ranking</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">Top Classes</h3>
                  </div>
                  <Star className="w-7 h-7 text-indigo-500" />
                </div>
                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {topClasses.map((cls, i) => renderClassItem(cls, i))}
                </div>
              </div>

              {/* Today's Top Classes View */}
              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col transition-all duration-700 ${classView === 'today' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-6 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Live Activity</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">Today's Top Classes</h3>
                  </div>
                  <Flame className="w-7 h-7 text-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {todayClasses.map((cls, i) => renderClassItem(cls, i, true))}
                </div>
              </div>



            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#060a14]/90 border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="col-span-2 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <Heart className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">Token of Halawa</h2>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
                Managed by RIBAT Students Union. Bringing modern tools to community donation drives, tracking budgets, and ensuring transparency.
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-6">Quick Links</h3>
              <ul className="space-y-3.5 text-sm text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition">Admin Portal</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Campaigner Portal</Link></li>
                <li><a href="#leaderboard" className="hover:text-white transition">Leaderboard</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Live Stats</Link></li>
              </ul>
            </div>
            
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-6">Contact Support</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Green Valley, Pantheerankavu,<br />Kozhikode-19</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+91 90746 80630</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>info@hidayaonline.org</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p className="text-center md:text-left mb-4 md:mb-0">
              &copy; 2026 RIBAT Students Union. All rights reserved.
            </p>
            <p>
              Designed & Developed by <a href="#" className="hover:text-emerald-400 transition font-bold">ahrazdesign.com</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
