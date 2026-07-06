import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MapPin, ChevronDown, ChevronUp, CheckCircle, Clock,
  Users, ShieldCheck, Globe, Phone, Mail, Instagram, Facebook,
  Check, X, ArrowRight, Shield, Plane, Cpu, Settings, Shirt, Layers,
  Lightbulb, Stethoscope, Building, Utensils, Wrench, Hammer, Car, Tv,
  ShoppingBag, Gamepad, Factory, Sparkles, Handshake, Languages,
  UserCheck, Hotel, FileText, TrendingUp, Layout, Building2, Star
} from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import api from "../../../api";

import cantonHero from "@/assets/images/canton-hero.png";
import cantonExpo from "@/assets/images/canton-expo.png";
import sourcingImg from "@/assets/images/sourcing.png";
import cantonNetworking from "@/assets/images/canton-networking.png";
import cantonFactory from "@/assets/images/canton-factory.png";
import guangzhouAttractions from "@/assets/images/guangzhou-attractions.png";
import foshanAttractions from "@/assets/images/foshan-attractions.png";

/* ─────────────────────────────── Countdown ─────────────────────────────── */
const CountdownTimer = ({ targetDate }) => {
  const calc = () => {
    const diff = +new Date(targetDate) - +new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);

  if (t.expired) return <p className="font-bold text-red-600 text-center">Early Bird Offer Expired</p>;

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {[["Days", t.days], ["Hours", t.hours], ["Mins", t.minutes], ["Secs", t.seconds]].map(([l, v]) => (
        <div key={l} className="bg-white border-2 border-amber-400 rounded-2xl px-5 py-3 text-center min-w-[72px] shadow-lg">
          <div className="text-3xl font-black text-amber-600 font-mono leading-none">{String(v).padStart(2,"0")}</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{l}</div>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────── Main Page ─────────────────────────────── */
const Canton = () => {
  usePageSEO(
    "140th China Canton Fair 2026 Business Delegation | Goimomi Holidays",
    "Join Goimomi Holidays for the 140th China Canton Fair 2026 Business Delegation. Hotel, Visa, Transfers, Networking, Factory Visits & More.",
    cantonHero,
    "Canton Fair 2026, Canton Fair Business Delegation, Guangzhou Business Tour, China Trade Fair, Canton Fair Package, China Business Visa, Factory Visit China, Business Delegation, Goimomi Holidays"
  );

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [hotelTab, setHotelTab] = useState("4star");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formState, setFormState] = useState({
    fullName: "", companyName: "", mobileNumber: "", emailAddress: "",
    city: "", travellers: "1", hotelOption: "4★ Hotel (Foshan Dongjiang Hotel or Similar)",
    duration: "5 Nights / 6 Days", productCategory: "Electronics", message: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const faq = document.createElement("script");
    faq.type = "application/ld+json"; faq.id = "faq-ld";
    faq.text = JSON.stringify({ "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {q:"Do I need a China Visa?",a:"Yes. We assist with the visa process and documentation."},
      {q:"Can I visit factories?",a:"Yes. Private factory visits can be arranged on request."}
    ].map(({q,a})=>({
      "@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}
    }))});
    document.head.appendChild(faq);
    return () => { const el = document.getElementById("faq-ld"); if(el) el.remove(); };
  }, []);

  const handleInput = (e) => {
    const {name,value} = e.target;
    setFormState(p => ({...p,[name]:value}));
    if(formErrors[name]) setFormErrors(p => ({...p,[name]:""}));
  };

  const validate = () => {
    const err = {};
    if (!formState.fullName.trim()) err.fullName = "Full Name is required";
    if (!formState.companyName.trim()) err.companyName = "Company is required";
    if (!formState.mobileNumber.trim()) err.mobileNumber = "Mobile is required";
    else if (!/^\+?[0-9\s-]{10,15}$/.test(formState.mobileNumber.trim())) err.mobileNumber = "Enter a valid number";
    if (!formState.emailAddress.trim()) err.emailAddress = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formState.emailAddress)) err.emailAddress = "Enter a valid email";
    if (!formState.city.trim()) err.city = "City is required";
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormLoading(true);
    try {
      const raw = `Dur:${formState.duration}|Htl:${formState.hotelOption}|Cat:${formState.productCategory}|Pax:${formState.travellers}|City:${formState.city}|Email:${formState.emailAddress}`;
      const payload = {
        full_name: formState.fullName,
        whatsapp_number: formState.mobileNumber,
        business_name: formState.companyName,
        selected_phase: raw.length > 150 ? raw.substring(0,147)+"..." : raw,
        payment_status: "Pending",
        transaction_id: ""
      };
      await api.post("/api/canton-enquiries/", payload);
      setFormSuccess(true);
      setFormState({ fullName:"",companyName:"",mobileNumber:"",emailAddress:"",city:"",travellers:"1",hotelOption:"4★ Hotel (Foshan Dongjiang Hotel or Similar)",duration:"5 Nights / 6 Days",productCategory:"Electronics",message:"" });
      setTimeout(() => setFormSuccess(false), 8000);
    } catch(err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally { setFormLoading(false); }
  };

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const categories = [
    {name:"Electronics",icon:<Cpu className="w-5 h-5"/>},{name:"Furniture",icon:<Layout className="w-5 h-5"/>},
    {name:"Machinery",icon:<Settings className="w-5 h-5"/>},{name:"Garments",icon:<Shirt className="w-5 h-5"/>},
    {name:"Textiles",icon:<Layers className="w-5 h-5"/>},{name:"Lighting",icon:<Lightbulb className="w-5 h-5"/>},
    {name:"Medical",icon:<Stethoscope className="w-5 h-5"/>},{name:"Building Materials",icon:<Building className="w-5 h-5"/>},
    {name:"Kitchen",icon:<Utensils className="w-5 h-5"/>},{name:"Tools",icon:<Wrench className="w-5 h-5"/>},
    {name:"Hardware",icon:<Hammer className="w-5 h-5"/>},{name:"Automobile Parts",icon:<Car className="w-5 h-5"/>},
    {name:"Home Appliances",icon:<Tv className="w-5 h-5"/>},{name:"Fashion",icon:<ShoppingBag className="w-5 h-5"/>},
    {name:"Toys",icon:<Gamepad className="w-5 h-5"/>},{name:"Industrial Equipment",icon:<Factory className="w-5 h-5"/>}
  ];

  const whyAttend = [
    {title:"Airport Assistance",icon:<Plane className="w-6 h-6"/>,desc:"VIP airport meet & greet and seamless transport on arrival."},
    {title:"Visa Experts",icon:<FileText className="w-6 h-6"/>,desc:"End-to-end guidance for faster China Business Visa approval."},
    {title:"Hotel Accommodation",icon:<Hotel className="w-6 h-6"/>,desc:"4-star and 5-star hotel options near key commercial centers."},
    {title:"Meet & Greet",icon:<Handshake className="w-6 h-6"/>,desc:"Dedicated reception team to welcome and assist you at every step."},
    {title:"Chinese Interpreter",icon:<Languages className="w-6 h-6"/>,desc:"Professional translators to support manufacturer negotiations."},
    {title:"Networking Dinner",icon:<Utensils className="w-6 h-6"/>,desc:"Exchange sourcing insights with 50+ elite Indian delegates."},
    {title:"Business Matching",icon:<TrendingUp className="w-6 h-6"/>,desc:"Strategic matchmaking to connect you with top-tier suppliers."},
    {title:"Travel Insurance",icon:<Shield className="w-6 h-6"/>,desc:"Comprehensive overseas medical & travel coverage included."},
    {title:"Factory Visits",icon:<Factory className="w-6 h-6"/>,desc:"Curated trips to manufacturing hubs in Foshan & Guangzhou."},
    {title:"Dedicated Tour Manager",icon:<UserCheck className="w-6 h-6"/>,desc:"On-ground coordinators ensuring all schedules run smoothly."},
    {title:"24/7 Support",icon:<Clock className="w-6 h-6"/>,desc:"Round-the-clock emergency support for visa, health, or travel."},
    {title:"Private Transfers",icon:<Car className="w-6 h-6"/>,desc:"Daily luxury shuttle to and from the Canton Fair Pazhou Complex."}
  ];

  const itinerary = [
    {day:"Day 1",title:"Arrival & Welcome Dinner",details:"Arrival in Guangzhou/Foshan. Airport meet & greet, hotel transfer, check-in, rest, and an elegant Welcome Dinner with fellow delegates."},
    {day:"Day 2",title:"City Tour & Briefing",details:"Morning business briefing on sourcing strategies. Afternoon Foshan city tour showcasing the local industrial landscape and cultural sites."},
    {day:"Day 3",title:"Canton Fair – Day 1",details:"Full-day entry to Canton Fair. Product exploration, B2B supplier interactions, and initial manufacturer networking."},
    {day:"Day 4",title:"Canton Fair – Day 2",details:"Deep sourcing session with factory representatives. Negotiation sessions and strategic matchmaking with global suppliers."},
    {day:"Day 5",title:"Factory Visits & Networking Dinner",details:"Guided private factory inspections in Guangzhou or Foshan, followed by a corporate Networking Dinner with fellow delegates."},
    {day:"Day 6",title:"Canton Fair Half-Day + Sightseeing",details:"Final sourcing wrap-up, then Guangzhou sightseeing: Canton Tower, Shamian Island, and Beijing Road shopping street."},
    {day:"Day 7",title:"Departure",details:"Breakfast, checkout, private transfer to Guangzhou Baiyun Airport, flight home with memories and business contacts."}
  ];

  const faqs = [
    {q:"Do I need a China Visa?",a:"Yes. We assist with full visa documentation, processing, and submission to ensure a high approval rate for business visas."},
    {q:"Can I visit factories?",a:"Yes. Private factory visits in Guangzhou and Foshan can be arranged upon request at no extra cost."},
    {q:"Can I extend my stay?",a:"Yes. Pre or post tour hotel and visa extension is available. Let us know when enquiring."},
    {q:"Will I get an interpreter?",a:"Yes. Professional English-to-Chinese translators are available to support all business meetings and negotiations."},
    {q:"Is travel insurance included?",a:"Yes, comprehensive overseas travel and medical insurance is fully included in all selected packages."},
    {q:"Can I carry product samples?",a:"Yes. You can carry product samples back within airline baggage allowances. We can guide customs documentation too."}
  ];

  return (
    <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-track { animation: marquee 30s linear infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ── URGENT TICKER ── */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex marquee-track gap-0">
          {[1,2].map(i=>(
            <span key={i} className="inline-block px-8 text-xs font-bold tracking-wide uppercase">
              🔥 Early Bird Offer Ends 15 August 2026 &nbsp;•&nbsp; 140th Canton Fair 2026 Registration Open &nbsp;•&nbsp; Limited Business Delegation Seats &nbsp;•&nbsp; 4★ &amp; 5★ Hotel Packages Available &nbsp;•&nbsp; Visa Support Included &nbsp;•&nbsp; Register Now &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={cantonHero} alt="Canton Fair 2026" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 w-full">
          <div className="max-w-3xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg float">
              <Sparkles className="w-3.5 h-3.5" /> Guangzhou, China • October 2026
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                140<sup className="text-3xl">th</sup> China<br />
                <span className="text-amber-400">Canton Fair</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-white/90">Business Delegation 2026</p>
            </div>

            <p className="text-lg text-white/80 font-medium leading-relaxed max-w-xl">
              The World's Largest Trade Fair. Source directly from manufacturers, build global partnerships, and grow your business.
            </p>

            {/* Quick bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["4★ & 5★ Hotels","Visa Assistance","Airport Transfers","Canton Fair Entry","Networking Dinner","Factory Visits"].map((item,i)=>(
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-xl">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-white text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => scroll("enquiry-form")}
                className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl text-sm uppercase tracking-wide shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Book Your Seat <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+918110082222"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-xl text-sm uppercase tracking-wide border border-white/30 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" /> Call an Expert
              </a>
            </div>

            {/* Trusted by */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
              <span className="text-white/50 text-xs font-semibold mr-2 mt-1">Trusted by:</span>
              {["Importers","Exporters","Manufacturers","Retailers","Wholesalers","Entrepreneurs"].map((t,i)=>(
                <span key={i} className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full border border-white/20">✔ {t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <span className="text-[10px] uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-amber-400 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["50,000+","Global Exhibitors"],["200+","Countries Represented"],["7 Days","Delegation Programme"],["10,000+","Indian Buyers Visit Annually"]].map(([v,l],i)=>(
            <div key={i}>
              <div className="text-3xl font-black text-black">{v}</div>
              <div className="text-xs font-bold text-black/70 uppercase tracking-wide mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT CANTON FAIR ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              World's Largest Trade Exhibition
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">What is<br /><span className="text-amber-500">Canton Fair?</span></h2>
            <p className="text-gray-600 text-base leading-relaxed">
              The Canton Fair (China Import & Export Fair) is the <strong>largest international trade exhibition in the world</strong>, held twice annually in Guangzhou. It brings together over 50,000 exhibitors from every industry imaginable.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              For Indian businesses, this is the ultimate opportunity to <strong>source directly from Chinese manufacturers</strong>, cutting out middlemen and negotiating factory-direct pricing.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {["Find Verified Suppliers","Meet Factory Owners Directly","Build Long-Term Partnerships","Import at Factory Prices","Expand International Business"].map((item,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full bg-amber-200 rounded-3xl rotate-2" />
            <img src={cantonExpo} alt="Canton Fair Exhibition" className="relative rounded-3xl w-full object-cover shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">140th China Canton Fair 2026</p>
                  <p className="text-xs text-gray-500">Pazhou Complex, Guangzhou • October 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY GOIMOMI ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Your Trusted Delegation Partner
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Why Attend Through<br /><span className="text-amber-500">Goimomi Holidays?</span></h2>
            <p className="text-gray-500 text-sm leading-relaxed">We handle all logistics — visa, hotel, transfers, translation — so you can focus 100% on sourcing and negotiations.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAttend.map((item,i) => (
              <div key={i} className="group bg-white border-2 border-gray-100 hover:border-amber-300 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-amber-50 group-hover:bg-amber-400 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <span className="text-amber-500 group-hover:text-black transition-colors">{item.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE SECTION (Image + Text) ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">The <span className="text-amber-500">Delegation Experience</span></h2>
            <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">A curated, fully-managed business travel experience from India to Guangzhou and back.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {img: sourcingImg, title:"Live Sourcing at the Fair", desc:"Walk the world's largest exhibition floor and connect directly with 50,000+ manufacturers across 200+ countries."},
              {img: cantonNetworking, title:"Elite Networking Dinner", desc:"Share insights, build connections, and forge partnerships with fellow delegates at our exclusive evening dinners."},
              {img: cantonFactory, title:"Private Factory Visits", desc:"Step behind closed doors and inspect manufacturing units firsthand. Negotiate pricing and quality at the source."}
            ].map((card,i)=>(
              <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGE DETAILS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Package <span className="text-amber-500">Details</span></h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Two carefully designed packages for every budget — premium 4-star or ultra-luxury 5-star.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {icon:<Users className="w-6 h-6 text-amber-500"/>,label:"Tour Type",val:"Business Delegation"},
              {icon:<MapPin className="w-6 h-6 text-amber-500"/>,label:"Destination",val:"Guangzhou, China"},
              {icon:<Calendar className="w-6 h-6 text-amber-500"/>,label:"Duration",val:"5N6D / 6N7D"},
              {icon:<Plane className="w-6 h-6 text-amber-500"/>,label:"Travel Month",val:"October 2026"}
            ].map((c,i)=>(
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center space-y-3">
                <div className="flex justify-center">{c.icon}</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
                <p className="text-sm font-bold text-gray-900">{c.val}</p>
              </div>
            ))}
          </div>

          {/* Hotel Tabs */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
                {["4star","5star"].map(tab=>(
                  <button key={tab} onClick={()=>setHotelTab(tab)}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${hotelTab===tab?"bg-amber-400 text-black shadow-md":"text-gray-500 hover:text-gray-800"}`}>
                    {tab==="4star" ? "⭐⭐⭐⭐ 4 Star" : "⭐⭐⭐⭐⭐ 5 Star"}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              {hotelTab==="4star" ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 space-y-6 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">Foshan Dongjiang Hotel</h3>
                      <p className="text-gray-500 text-sm mt-1">or Similar • 4 Star Accommodation</p>
                    </div>
                    <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">Popular</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[["5 Nights / 6 Days","₹69,499"],["6 Nights / 7 Days","₹74,499"]].map(([dur,price],i)=>(
                      <div key={i} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{dur}</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">{price}</p>
                        <p className="text-[10px] text-gray-400">per person (twin sharing)</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>scroll("enquiry-form")} className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-all hover:scale-[1.01] text-sm uppercase tracking-wide">
                    Enquire for 4 Star Package →
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-amber-400 rounded-3xl p-8 space-y-6 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">Intercontinental Foshan</h3>
                      <p className="text-gray-400 text-sm mt-1">or Similar • Luxury 5 Star</p>
                    </div>
                    <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">Premium</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[["5 Nights / 6 Days","₹74,499"],["6 Nights / 7 Days","₹84,499"]].map(([dur,price],i)=>(
                      <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{dur}</p>
                        <p className="text-2xl font-black text-amber-400 mt-1">{price}</p>
                        <p className="text-[10px] text-gray-500">per person (twin sharing)</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>scroll("enquiry-form")} className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-all hover:scale-[1.01] text-sm uppercase tracking-wide">
                    Enquire for 5 Star Package →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">What's <span className="text-amber-500">Included?</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border-2 border-green-100 shadow-sm space-y-6">
              <h3 className="flex items-center gap-3 text-lg font-black text-green-700">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600"/></span>
                What's Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {["Hotel Accommodation","Daily Breakfast","Welcome Dinner","Airport Transfers","Fair Transfers","Visa Assistance","Chinese Group Visa","Travel Insurance","Meet & Greet","Interpreter Services","Tea & Coffee","Water Bottle Daily","Wi-Fi","Driver Allowance","Parking","Mobile App Support"].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0"/>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border-2 border-red-50 shadow-sm space-y-6">
              <h3 className="flex items-center gap-3 text-lg font-black text-red-600">
                <span className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-red-500"/></span>
                Not Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {["International Flights","GST (18%)","TCS","Sticker Visa Charges","Hotel Deposit","Laundry","Mini Bar","Gratuities / Tips","Personal Shopping","Anything Not Mentioned"].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0"/>
                    <span className="text-sm text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EARLY BIRD ALERT BANNER ── */}
      <div className="alert-slide bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-4 py-5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="ring-pulse flex-shrink-0 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/40">
            <span className="text-2xl select-none">⏰</span>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="badge-bounce inline-block bg-white text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                🔥 Early Bird Offer
              </span>
              <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider">Limited Seats Available</span>
            </div>
            <p className="text-white font-black text-base sm:text-lg leading-tight">
              Offer Valid Until{" "}
              <span className="text-flicker underline decoration-wavy decoration-yellow-300">15 August 2026</span>
            </p>
            <p className="text-white/80 text-xs font-medium flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse flex-shrink-0"/>
              ⚠️ Price Subject to Revision After Deadline — Register Now to Lock Your Rate
            </p>
          </div>
          <a
            href="#enquiry-form"
            onClick={e => { e.preventDefault(); document.getElementById("enquiry-form")?.scrollIntoView({ behavior:"smooth" }); }}
            className="flex-shrink-0 bg-white text-red-600 font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all whitespace-nowrap border-2 border-white/80"
          >
            Claim My Seat →
          </a>
        </div>
      </div>

      {/* ── ENQUIRY FORM ── */}
      <section id="enquiry-form" className="py-12 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3"/> Free Consultation
            </div>
            <h2 className="text-2xl font-black text-white">Reserve Your <span className="text-amber-400">Delegation Seat</span></h2>
            <p className="text-gray-400 text-xs">Our Canton expert will call you within 24 hours.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-amber-100">
            {formSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-green-500"/>
                </div>
                <h3 className="text-lg font-black text-gray-900">Thank You!</h3>
                <p className="text-gray-500 text-xs max-w-xs mx-auto">Enquiry received. Our Canton delegation expert will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submitEnquiry} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Full Name *</label>
                    <input type="text" name="fullName" value={formState.fullName} onChange={handleInput} placeholder="Your full name"
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"/>
                    {formErrors.fullName && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Company *</label>
                    <input type="text" name="companyName" value={formState.companyName} onChange={handleInput} placeholder="Your company"
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"/>
                    {formErrors.companyName && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.companyName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Mobile *</label>
                    <input type="text" name="mobileNumber" value={formState.mobileNumber} onChange={handleInput} placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"/>
                    {formErrors.mobileNumber && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.mobileNumber}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Email *</label>
                    <input type="email" name="emailAddress" value={formState.emailAddress} onChange={handleInput} placeholder="you@company.com"
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"/>
                    {formErrors.emailAddress && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.emailAddress}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">City *</label>
                    <input type="text" name="city" value={formState.city} onChange={handleInput} placeholder="Your city"
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"/>
                    {formErrors.city && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.city}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Travellers</label>
                    <select name="travellers" value={formState.travellers} onChange={handleInput}
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none bg-white">
                      {["1","2","3","4","5+"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Hotel</label>
                    <select name="hotelOption" value={formState.hotelOption} onChange={handleInput}
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none bg-white">
                      <option>4★ Foshan Dongjiang</option>
                      <option>5★ Intercontinental</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Duration</label>
                    <select name="duration" value={formState.duration} onChange={handleInput}
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none bg-white">
                      <option>5N / 6D</option>
                      <option>6N / 7D</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Product Category</label>
                    <select name="productCategory" value={formState.productCategory} onChange={handleInput}
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none bg-white">
                      {categories.map((c,i)=><option key={i}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Message (Optional)</label>
                    <textarea name="message" value={formState.message} onChange={handleInput} rows={2} placeholder="Any specific requirements..."
                      className="w-full border border-gray-200 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none resize-none transition-colors"/>
                  </div>
                </div>
                <button type="submit" disabled={formLoading}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2">
                  {formLoading ? "Sending..." : "Get My Free Consultation →"}
                </button>
                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-gray-400"/> 100% Secure & Private • No Spam
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── EARLY BIRD COUNTDOWN ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-400 to-orange-400">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            <Clock className="w-4 h-4"/> Limited Early Bird Offer
          </div>
          <h2 className="text-4xl font-black text-black">Register Before <span className="underline decoration-wavy">15 August 2026</span></h2>
          <p className="text-black/70 text-sm font-semibold">Lock in special hotel rates and priority visa processing. Don't miss out!</p>
          <CountdownTimer targetDate="2026-08-15T00:00:00+05:30" />
          <button onClick={()=>scroll("enquiry-form")} className="px-10 py-4 bg-black text-amber-400 font-bold rounded-xl text-sm uppercase tracking-wide hover:bg-gray-900 transition-all shadow-xl hover:scale-105">
            Claim Early Bird Rate →
          </button>
        </div>
      </section>

      {/* ── ITINERARY ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5"/> Day-Wise Itinerary
            </div>
            <h2 className="text-4xl font-black text-gray-900">Your <span className="text-amber-500">7-Day Journey</span></h2>
            <p className="text-gray-500 text-sm">Click a day to view the full schedule and planned activities.</p>
          </div>

          <div className="space-y-3">
            {itinerary.map((item,idx)=>{
              const open = activeAccordion === idx;
              return (
                <div key={idx} className={`rounded-2xl border-2 overflow-hidden transition-all ${open?"border-amber-300 shadow-lg":"border-gray-100 shadow-sm"}`}>
                  <button onClick={()=>setActiveAccordion(open?null:idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-amber-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${open?"bg-amber-400 text-black":"bg-amber-50 text-amber-600"}`}>{item.day}</span>
                      <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                    </div>
                    {open ? <ChevronUp className="w-5 h-5 text-amber-500"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} transition={{duration:0.3}} className="overflow-hidden">
                        <div className="px-6 py-4 bg-amber-50 border-t-2 border-amber-100 text-sm text-gray-600 leading-relaxed">{item.details}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Explore <span className="text-amber-500">Product Categories</span></h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">The Canton Fair covers 16+ industries. Select your category and we'll tailor your sourcing schedule.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat,i)=>(
              <button key={i} onClick={()=>scroll("enquiry-form")}
                className="group bg-white border-2 border-gray-100 hover:border-amber-300 hover:shadow-lg p-5 rounded-2xl flex items-center gap-3 transition-all text-left">
                <span className="text-amber-500 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCAL ATTRACTIONS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Explore <span className="text-amber-500">the Region</span></h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Beyond business, discover the beauty of Guangzhou and Foshan — two of China's most culturally rich cities.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {img:guangzhouAttractions, city:"Guangzhou Attractions", spots:["Canton Tower","Pearl River","Beijing Road","Shamian Island","Temple of Six Banyan Trees"]},
              {img:foshanAttractions, city:"Foshan Attractions", spots:["Foshan Ancestral Temple","Nanfeng Kiln","Ceramic City","Lingnan Architecture","Cultural Heritage Village"]}
            ].map((c,i)=>(
              <div key={i} className="group relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-80">
                <img src={c.img} alt={c.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <h3 className="font-black text-white text-lg">{c.city}</h3>
                  <div className="flex flex-wrap gap-2">
                    {c.spots.map((s,j)=>(
                      <span key={j} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900">Frequently Asked <span className="text-amber-500">Questions</span></h2>
            <p className="text-gray-500 text-sm">Quick answers about visas, packages, and the delegation experience.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq,i)=>{
              const open = activeFaq === i;
              return (
                <div key={i} className={`rounded-2xl border-2 overflow-hidden transition-all ${open?"border-amber-300":"border-gray-100"}`}>
                  <button onClick={()=>setActiveFaq(open?null:i)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left bg-white hover:bg-amber-50 transition-colors">
                    <span className="font-bold text-gray-900 text-sm pr-4">{faq.q}</span>
                    {open ? <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0"/> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0"/>}
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} transition={{duration:0.25}} className="overflow-hidden">
                        <div className="px-6 py-4 bg-amber-50 border-t-2 border-amber-100 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Canton;
