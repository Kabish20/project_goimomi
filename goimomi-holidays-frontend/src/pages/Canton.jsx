import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Search, ChevronRight, CheckCircle, Clock, Users, ShieldCheck, Zap, Star, Layout, Ticket, Building2, Globe, Send, Phone, Mail, Instagram, Facebook, Share2, Check, X, ArrowRight, Info, Award, TrendingUp, Newspaper, Shield, Plane } from "lucide-react";
import usePageSEO from "../hooks/usePageSEO";
import api from '../api';

import cantonHero from "../assets/images/canton-hero.png";
import sourcingImg from "../assets/images/sourcing.png";

const Canton = () => {
  usePageSEO(
    "Canton Fair 2026 | Register Now with Goimomi Holidays",
    "Join the Canton Fair 2026 with Goimomi Holidays. Complete travel solutions including registration, hotel bookings, and guided tours for the world's largest trade fair.",
    cantonHero
  );
  const [activeAccordion, setActiveAccordion] = useState(null);
  // const navigate = useNavigate(); // Assuming useNavigate is needed later, but not provided in the full context to import.

  // useEffect(() => {
  //   document.title = "Canton Fair 2026 | Goimomi Holidays";
  // }, []);


  const handlePhaseSelection = (phaseTitle) => {
    const registerSection = document.getElementById("register");
    if (registerSection) {
      registerSection.scrollIntoView({ behavior: "smooth" });
    }
  };


  const phases = [
    {
      id: 1,
      title: "Phase 1",
      focus: "Electronics, Machinery, Energy",
      date: "April 15 – 19, 2026",
      deadline: "April 5, 2026",
      color: "bg-blue-600"
    },
    {
      id: 2,
      title: "Phase 2",
      focus: "Consumer Goods, Home Decor, Gifts",
      date: "April 23 – 27, 2026",
      deadline: "April 10, 2026",
      color: "bg-purple-600"
    },
    {
      id: 3,
      title: "Phase 3",
      focus: "Textiles, Fashion, Medical, Food",
      date: "May 1 – 5, 2026",
      deadline: "April 15, 2026",
      color: "bg-orange-600"
    }
  ];

  const hotNews = [
    {
      title: "Advanced Manufacturing Zone Expanded",
      content: "Canton Fair 2026 will feature a 25% larger area dedicated to AI-driven robotics and sustainable manufacturing solutions.",
      date: "March 15, 2026"
    },
    {
      title: "Seamless Entry for Indian Entrepreneurs",
      content: "New business visa protocols announced to expedite entries for trade fair attendees from the Indian subcontinent.",
      date: "March 12, 2026"
    },
    {
      title: "Global Buyer Registration Hits Record High",
      content: "Over 180,000 buyers from 210 countries have already pre-registered, signaling a massive return to in-person sourcing.",
      date: "March 10, 2026"
    }
  ];

  return (
    <div className="bg-slate-50 overflow-x-hidden font-sans">
      {/* --- HOT NEWS TICKER --- */}
      <div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap relative border-b border-red-700">
        <div className="inline-block animate-marquee uppercase font-bold text-xs tracking-widest px-4">
          🔥 HOT NEWS: Canton Fair 2026 Registration is now LIVE! • Limited 999/- Deposit Offer • Airfares rising 15% weekly • New AI-Matching tools launched for Phase 1 • Secure your 4-Star stay now •
        </div>
        <div className="absolute top-0 inline-block animate-marquee2 uppercase font-bold text-xs tracking-widest px-4">
          🔥 HOT NEWS: Canton Fair 2026 Registration is now LIVE! • Limited 999/- Deposit Offer • Airfares rising 15% weekly • New AI-Matching tools launched for Phase 1 • Secure your 4-Star stay now •
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 30s linear infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .hero-gradient {
          background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4), rgba(0,0,0,0.8));
        }
        .gold-border {
          border: 2px solid #D4AF37;
        }
        @keyframes flash-sticker-blink {
          0% { background-color: #dc2626; box-shadow: 0 0 15px #dc2626; }
          50% { background-color: #facc15; box-shadow: 0 0 30px #facc15; color: #000; }
          100% { background-color: #dc2626; box-shadow: 0 0 15px #dc2626; }
        }
        .flash-sticker {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 2000;
          animation: flash-sticker-blink 0.6s infinite;
          padding: 1.25rem 2.5rem;
          border-radius: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          text-decoration: none;
          color: white;
          border: 4px solid white;
          transform: rotate(-5deg);
          font-size: 1.5rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .flash-sticker:hover {
          transform: rotate(0deg) scale(1.1);
          animation-play-state: paused;
          background-color: #dc2626 !important;
          color: white !important;
        }
        @media (max-width: 768px) {
          .flash-sticker {
            bottom: 1.5rem;
            right: 50%;
            transform: translateX(50%) rotate(0deg);
            width: 90%;
            justify-content: center;
            font-size: 1.25rem;
          }
          .flash-sticker:hover {
            transform: translateX(50%) scale(1.05);
          }
        }
      `}} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Placeholder Background (using image) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-black transition-transform duration-[10000ms] hover:scale-110"
          style={{ backgroundImage: `url(${cantonHero})` }}
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">


          <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#D4AF37] tracking-widest uppercase fade-up" style={{ animationDelay: '0.1s' }}>
            APRIL 15 – MAY 5, 2026
          </h2>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight fade-up" style={{ animationDelay: '0.2s' }}>
            Canton Fair 2026:<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D4AF37] to-white italic">The Secret to 10X - 100X Growth</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-light fade-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Stop buying from middlemen. Source directly from the world’s top manufacturers. Our premium travel package handles the logistics so you can focus on the deals.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl gold-border shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-x-20 top-0 h-full w-10 bg-white/20 skew-x-[-25deg] transition-all duration-1000 group-hover:left-[120%]" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Exclusive Value Proposition</p>
              <h3 className="text-3xl md:text-4xl font-black mb-2">SECURE YOUR SEAT FOR ONLY ₹999/-</h3>
              <p className="text-gray-300">Lock in the special rate of <span className="text-white font-bold">₹76,000</span> before airfares explode!</p>
            </div>

            <a
              href="#register"
              className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 group"
            >
              BOOK MY SEAT FOR ₹999 NOW
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Zap className="w-4 h-4 text-yellow-400 fill-current" />
              Limited slots per phase.
            </p>
          </div>
        </div>
      </section>

      {/* --- PROBLEM & SOLUTION --- */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 fade-up text-left">
              <div className="text-[#14532d] font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <div className="h-[2px] w-8 bg-[#14532d]" />
                The Entrepreneur's Dilemma
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Why the World's Most Successful Entrepreneurs are in Guangzhou This April.
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-2xl">
                  <div className="bg-red-500 text-white p-2 h-fit rounded-lg shadow-lg">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The Business Reality</h3>
                    <p className="text-gray-600 leading-relaxed">
                      The market is crowded. Sourcing locally or blindly through online portals has limits. To truly scale 10X or 100X, you need direct, face-to-face access to the world's most innovative factories.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-green-50 border-l-4 border-green-500 rounded-r-2xl">
                  <div className="bg-green-600 text-white p-2 h-fit rounded-lg shadow-lg">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The Canton Fair Solution</h3>
                    <p className="text-gray-600 leading-relaxed">
                      This isn’t just a trade show; it’s a global launchpad. Negotiate pricing at the source, discover trend-setting products months before they hit the Indian market, and build a rock-solid supply chain that your competitors can't touch.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-4 gold-border rounded-3xl opacity-20 -rotate-2" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-auto">
                <img
                  src={sourcingImg}
                  alt="Sourcing Excellence"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <Award className="w-10 h-10 text-[#D4AF37]" />
                    <div>
                      <h4 className="font-bold text-xl uppercase tracking-tighter">Gold Standard Sourcing</h4>
                      <p className="text-gray-300 text-sm">Direct Manufacturer Networking</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Potential ROI</p>
                    <p className="text-3xl font-black text-slate-900">100X+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SCARCITY ENGINE (DEADLINES) --- */}
      <section className="py-24 px-6 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-8 ring-1 ring-red-500/20">
            <Clock className="w-4 h-4" />
            Time is Running Out
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">⚠️ WARNING: Application Deadlines Are Approaching!</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
            Missing these dates means missing the Fair entirely. We need time for your Visa and Registration processing.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="group relative bg-[#1e293b] rounded-3xl border border-white/5 overflow-hidden transition-all hover:scale-105 hover:bg-[#334155] p-8 text-left"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full ${phase.color}`} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`${phase.color} px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                      {phase.title}
                    </div>
                    <Calendar className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{phase.focus}</h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{phase.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-red-400 font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                      <Clock className="w-4 h-4" />
                      <span>Deadline: {phase.deadline}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePhaseSelection(phase.title)}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2 group-hover:bg-red-600 group-hover:border-red-600"
                  >
                    Secure {phase.title}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#register"
            className="inline-flex px-12 py-5 bg-white text-[#0f172a] hover:bg-red-600 hover:text-white text-xl font-black rounded-xl transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105"
          >
            Don’t Miss the Deadline – Pay ₹999 Now
          </a>
        </div>
      </section>

      {/* --- HOT NEWS SECTION AS ADDED DETAILS --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Newspaper className="w-10 h-10 text-red-600" />
              Latest Canton Fair Intelligence
            </h2>
            <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hotNews.map((news, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform">
                <div className="text-red-600 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  Live Update • {news.date}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{news.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{news.content}</p>
                <div className="pt-4 border-t border-slate-50">
                  <a href="#" className="text-red-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    READ FULL BRIEF
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRAVEL PACKAGE INCLUSIONS --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Your All-Access Ticket to Seamless Sourcing</h2>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
                  <p className="text-gray-400 uppercase tracking-widest text-xs font-black mb-2">Investment</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-6xl font-black text-white">₹76,000</span>
                    <span className="text-gray-400">/ person (Twin Sharing)</span>
                  </div>
                  <p className="text-red-400 text-sm mt-4 italic">*Exclusive rate for early registrants</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#D4AF37]">
                    <Shield className="w-6 h-6" />
                    Premium Inclusions
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      "4-Star Luxury Accommodation",
                      "5 to 6 Nights Premium Stay",
                      "Daily Breakfasts & Dinners",
                      "Exclusive Networking Dinner",
                      "Full Business Visa Processing",
                      "Professional Airport Transfers",
                      "Daily Fairground Transport",
                      "Comprehensive Travel Insurance",
                      "High-Speed eSIM Connectivity",
                      "Dedicated Indian Tour Guide"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="p-8 bg-red-600/5 border border-red-600/20 rounded-3xl space-y-4 mb-8">
                  <h3 className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Exclusions
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Airfare (International/Domestic)",
                      "Lunch at the Fairgrounds",
                      "GST & TCS as applicable",
                      "Personal expenses not mentioned"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-400">
                        <X className="w-5 h-5 text-red-900" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div className="bg-blue-600/20 p-4 rounded-xl">
                      <Users className="w-10 h-10 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Indian Entrepreneur Network</h4>
                      <p className="text-gray-400 text-sm">Join a community of 50+ successful business owners from India.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div className="bg-orange-600/20 p-4 rounded-xl">
                      <MapPin className="w-10 h-10 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Strategic Localization</h4>
                      <p className="text-gray-400 text-sm">Hotels strategically located for minimal commute to Pazhou Complex.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REGISTRATION & CONVERSION --- */}
      <section id="register" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Lock Your Price.<br />Beat the Airfare Hike.</h2>

              <div className="space-y-8 mb-10">
                <div className="flex gap-6">
                  <div className="bg-white w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 text-red-600">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Secure the Rate</h3>
                    <p className="text-gray-600 leading-relaxed">The package is fixed at ₹76,000, but service costs in China rise as the fair dates approach. Your ₹999 guarantees this price.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-white w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Plane className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Save on Flights</h3>
                    <p className="text-gray-600 leading-relaxed">Airfares are rising daily. Once you pay the ₹999, we prioritize your registration so you can book your flights now before prices double.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-white w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 text-green-600">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Risk-Free Commitment</h3>
                    <p className="text-gray-600 leading-relaxed">This is a commitment to secure your seat. It is fully refundable if we are unable to initiate your visa process.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-500 rounded-full w-3 h-3 animate-pulse" />
                  <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Live Status: 8 Seats Left in Phase 1</span>
                </div>
                <p className="text-white text-sm">Don't let your competitors get ahead. The bridge to China's manufacturing power starts here.</p>
              </div>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-yellow-400 text-black px-6 py-2 font-black text-sm uppercase tracking-widest animate-pulse rounded-br-3xl z-30 shadow-lg">
                🔥 Limited Flash Offer
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 flex items-center justify-center rotate-45 translate-x-12 -translate-y-12">
                <span className="text-white font-black text-xs -rotate-45 mt-8 mr-8">₹999</span>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-6">Secure Your Canton 2026 Seat Today</h3>


              <div className="space-y-4">
                <iframe
                  aria-label='Canton Registration Form '
                  frameBorder="0"
                  style={{ height: '500px', width: '99%', border: 'none' }}
                  src='https://forms.zohopublic.in/GoimomiHolidays/form/EventRegistrationForm/formperma/1wgT6SGrRTJktf1BoOPcSx8XzW-50CjHFIQ9jaLJsjQ'
                ></iframe>

                <p className="text-center text-xs text-gray-500 font-medium">
                  <Shield className="w-4 h-4 inline mr-1 text-green-500" />
                  Secure Payment • 100% Refundable Deposit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-16">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "What does the ₹999/- actually cover?",
                a: "The ₹999 is a commitment fee that secures your enrollment in the ₹76,000 package. It guarantees your price and initiates the registration process early so you can book flights at lower rates."
              },
              {
                q: "What if my Visa is rejected?",
                a: "If we are unable to initiate your visa process or if there are issues from the official facilitation side, the ₹999 deposit is fully refundable."
              },
              {
                q: "Is airfare included in the ₹76,000 package?",
                a: "No, airfare is excluded to allow you the flexibility to book according to your preferred airline, points, or city of departure. However, our team will assist you in finding the best flight options."
              },
              {
                q: "Can I switch phases after paying the deposit?",
                a: "Phase changes are allowed subject to availability of seats in the target phase and accommodation slots in Guangzhou."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-black text-slate-900 text-lg mb-4 flex items-start gap-3">
                  <span className="bg-red-600 text-white text-[10px] w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-1">Q</span>
                  {faq.q}
                </h3>
                <div className="flex items-start gap-3">
                  <span className="bg-green-600 text-white text-[10px] w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-1">A</span>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="bg-white py-24 px-6 text-center border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <Award className="w-16 h-16 mx-auto mb-6 text-red-600/20" />
          <h2 className="text-4xl font-black mb-6 italic text-slate-900">Build a Supply Chain Your Competitors Can't Touch.</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            The world's largest trade fair only happens twice a year. Don't let 2026 pass you by.
          </p>
          <a
            href="#register"
            className="inline-block bg-red-600 text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-slate-900 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            START MY 100X JOURNEY
          </a>
        </div>
      </section>

      {/* --- FLOATING ADVERTISEMENT STICKER --- */}
      <a href="#register" className="flash-sticker">
        <Zap className="w-8 h-8 fill-current" />
        Register Now!
      </a>
    </div>
  );
};

export default Canton;
