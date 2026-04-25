import React, { useState } from "react";
import {
  FaCalendarAlt, FaHotel, FaUsers, FaPlane,
  FaShieldAlt, FaStar, FaUtensils, FaCheckCircle, FaPhoneAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Award, BadgeCheck, Headphones, Sparkles, Globe, ShieldCheck,
  ArrowRight, CheckCircle2, PhoneCall, ChevronDown, TrendingUp,
  MapPin, Heart, Briefcase,
} from "lucide-react";
import ZohoCustomizedForm from "../../../components/ZohoCustomizedForm.jsx";
import { useNavigate } from "react-router-dom";
import usePageSEO from "../../../hooks/usePageSEO";

// Images
import heroImg from "../../../assets/cusholidays.png";
import beachImg from "../../../assets/beach & island.png";
import mountainImg from "../../../assets/mountain.png";
import cultureImg from "../../../assets/temples.png";
import cardImg from "../../../assets/TravelGallery/download.jpeg";

const CustomizedHolidays = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("Customized Holiday");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  usePageSEO(
    "Goimomi Holidays – Customized Holiday Packages & Travel Planning",
    "Design your dream vacation with Goimomi Holidays' fully customized holiday packages. From luxury beach escapes and mountain adventures to cultural heritage tours, we tailor every detail—flights, hotels, and itineraries—to your unique preferences and budget.",
    heroImg,
    "Customized holiday packages, tailor-made travel, personalized vacation planning, Goimomi Holidays, luxury travel packages India, family holiday deals, honeymoon trip planning, adventure tour customization"
  );

  const openForm = (type = "Customized Holiday") => {
    setSelectedPackage(type);
    setIsFormOpen(true);
  };

  // ─── Data ──────────────────────────────────────────────────────────────
  const stats = [
    { value: "15K+", label: "Holidays Designed" },
    { value: "80+", label: "Destinations" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "10+", label: "Years of Expertise" },
  ];

  const agentAdvantages = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "Truly Personalised — Not Templates",
      desc: "Every itinerary we create starts from a blank page. We ask the right questions, listen carefully, and design a holiday that reflects exactly who you are and how you travel.",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Best Price — Guaranteed",
      desc: "We hold long-term partnerships with hotels, airlines, and ground operators — giving you access to exclusive contracted rates, early-bird fares, and negotiated extras that online portals can't match.",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "One Expert, End to End",
      desc: "You get a single named travel consultant throughout — not a chatbot or rotating helpline. They know your holiday inside-out and are reachable before, during, and after your trip.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Visa, Insurance & Documentation",
      desc: "Planning a multi-country itinerary? Our in-house visa desk handles all entry requirements, travel insurance, and documentation coordination — one team for everything.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Expert Curation, Not Guesswork",
      desc: "Our specialists have personally visited or deeply researched every destination we recommend. You get insider knowledge on the best hotels, off-the-beaten-path experiences, and what to avoid.",
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      title: "Flexible & Fully Changeable",
      desc: "Plans change. We build flexibility into every customized package — mix and match accommodation, add excursions, extend stays, or reroute mid-trip with our support.",
    },
  ];

  const travelStyles = [
    { emoji: "🏖️", title: "Beach & Island", desc: "Sun-soaked shores, water sports, snorkelling, and barefoot luxury — we design island escapes from the Maldives to Andaman.", color: "from-blue-50 to-cyan-50 border-blue-100" },
    { emoji: "🏔️", title: "Mountain Adventure", desc: "Trek iconic peaks, stay in mountain lodges, and experience the raw silence of high-altitude destinations — Himachal, Uttarakhand, Nepal, and beyond.", color: "from-emerald-50 to-teal-50 border-emerald-100" },
    { emoji: "🏛️", title: "Cultural Heritage", desc: "Walk through centuries of history — ancient temples, UNESCO sites, palace hotels, and authentic culinary trails curated by our cultural travel experts.", color: "from-amber-50 to-orange-50 border-amber-100" },
    { emoji: "💑", title: "Honeymoon Escapes", desc: "Private villas, candlelit dinners, sunset cruises, and exclusive spa retreats — every detail of your first journey together is arranged with love.", color: "from-rose-50 to-pink-50 border-rose-100" },
    { emoji: "👨‍👩‍👧‍👦", title: "Family Holidays", desc: "Kid-friendly resorts, activity planning for all ages, safe transfers, and flexible schedules — family travel done right, stress-free from start to finish.", color: "from-violet-50 to-purple-50 border-violet-100" },
    { emoji: "🌍", title: "International Touring", desc: "Multi-country European tours, Southeast Asia circuits, and Middle East itineraries — fully planned with visa coordination and inter-country logistics.", color: "from-indigo-50 to-blue-50 border-indigo-100" },
  ];

  const processSteps = [
    { step: "01", icon: <PhoneCall className="w-5 h-5" />, title: "Tell Us Your Dream", desc: "Share your destination wishes, travel dates, group size, and budget — over a call, WhatsApp, or enquiry form. No commitment required." },
    { step: "02", icon: <Sparkles className="w-5 h-5" />, title: "We Design Your Itinerary", desc: "Your dedicated holiday consultant builds a day-by-day custom itinerary with hotel options, activities, and all logistics mapped out." },
    { step: "03", icon: <ShieldCheck className="w-5 h-5" />, title: "Review & Refine", desc: "You review the proposal and suggest changes — we refine until it's exactly right. Includes visa advice, insurance options, and documentation checklist." },
    { step: "04", icon: <Globe className="w-5 h-5" />, title: "Travel & We Stay With You", desc: "Once you depart, our team remains available 24/7. Any issue on the ground — we resolve it. You focus entirely on enjoying your holiday." },
  ];

  const testimonials = [
    {
      name: "Anjali & Karthik Subramaniam",
      holiday: "Customized Honeymoon — Maldives & Sri Lanka",
      quote: "We'd tried to plan ourselves for months and got overwhelmed. Goimomi's consultant designed our entire honeymoon in 2 days — overwater villa, private beach dinners, cultural tours in Colombo. It was beyond perfect.",
      rating: 5,
      emoji: "💑",
    },
    {
      name: "The Sharma Family (8 Members)",
      holiday: "Family Holiday — Rajasthan Heritage Circuit",
      quote: "We had grandparents, kids, and teenagers — and the team designed daily activities that worked for everyone. Heritage hotel stays, camel safaris, and city tours — every day was memorable for all of us.",
      rating: 5,
      emoji: "👨‍👩‍👧‍👦",
    },
    {
      name: "Prakash Nair",
      holiday: "Adventure Tour — Himachal Pradesh & Spiti Valley",
      quote: "I wanted an off-beaten-path mountain experience with trekking, camping, and local homestays. The Goimomi team knew exactly which routes to take, which guesthouses were genuine, and which to avoid. Flawless.",
      rating: 5,
      emoji: "🏔️",
    },
  ];

  const faqs = [
    {
      q: "How long does it take to plan a customized holiday?",
      a: "After your initial consultation (15–30 minutes), we typically deliver a first itinerary proposal within 24–48 hours. Revisions are incorporated quickly, and most packages are finalized within 3–5 days — leaving plenty of time for bookings, visa applications, and document preparation.",
    },
    {
      q: "Can I mix destinations — e.g., beach and mountains in one trip?",
      a: "Absolutely — in fact, combination itineraries are one of our specialities. We design multi-destination journeys that flow logically, minimizing transit time and maximizing experience. A Kerala backwaters + hill station + beach circuit is a popular example.",
    },
    {
      q: "What if my plans change after I've booked?",
      a: "We build flexibility clauses into every booking where possible. Our consultant will advise on hotel and airline change policies upfront, and we carry travel insurance options that cover itinerary changes. When things change, we handle the re-planning — not you.",
    },
    {
      q: "Do you handle multi-country international holidays?",
      a: "Yes. International multi-country holidays are a core Goimomi speciality — covering Europe, Southeast Asia, the Middle East, and beyond. We manage all visa applications simultaneously, coordinate inter-country transport, and ensure seamless transitions between every destination.",
    },
    {
      q: "Is a fully customized holiday more expensive than a pre-packaged tour?",
      a: "Not necessarily. Our preferred partner network often gives us access to rates that match or beat packaged tours — while giving you far more flexibility. A customized holiday is tailored to your actual needs, so you never pay for things you don't want.",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-slate-50 text-gray-800">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[88vh] bg-cover bg-center flex flex-col items-center justify-center text-white overflow-hidden"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/65 to-slate-900/90" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "50px 50px" }}
        />

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <div className="flex items-center justify-center gap-3 text-emerald-400 mb-5">
            <div className="w-12 h-[2px] bg-emerald-400" />
            <span className="text-[11px] uppercase tracking-[0.5em] font-black">Tailor-Made Travel Since 2010</span>
            <div className="w-12 h-[2px] bg-emerald-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] mb-5">
            YOUR HOLIDAY
            <br />
            <span className="text-white/25">YOUR WAY</span>
          </h1>

          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            No templates. No compromises. Every detail of your holiday — flights, hotels, activities, and transfers —
            designed from scratch around your preferences, budget, and dream.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
            {["Fully Personalised", "Best Price Promise", "One Dedicated Agent", "Free Itinerary Planning"].map(badge => (
              <div key={badge} className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{badge}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="custom-hero-cta"
              onClick={() => openForm()}
              className="px-10 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-sm shadow-2xl transition-all flex items-center gap-3"
            >
              PLAN MY HOLIDAY
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contactus')}
              className="px-10 py-4 bg-transparent border-2 border-white/20 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-sm hover:bg-white/10 transition-all"
            >
              SPEAK TO AN EXPERT
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── STATS STRIP ─────────────────────────────────────────────────── */}
      <div className="bg-emerald-800 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-4xl font-black italic tracking-tighter text-white">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WHY CHOOSE GOIMOMI (DARK) ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">The Agent Advantage</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mt-2 mb-4">
              Why Let Goimomi <br /><span className="text-emerald-400">Design Your Holiday?</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
              Online booking tools give you choice. A Goimomi travel expert gives you the right choice — with
              personal curation, inside knowledge, and someone responsible for making it perfect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentAdvantages.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-700/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-[13px] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CUSTOMIZATION OPTIONS (Preserved + Upgraded styling) ────────── */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Total Flexibility</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Customize Every <span className="text-emerald-700">Aspect of Your Holiday</span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              Build your perfect holiday package — every element is adjustable based on your preferences and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <FaCalendarAlt size={28} />, title: "Flexible Dates", items: ["Weekend Getaway (2–3 Days)", "Short Break (4–7 Days)", "Extended Holiday (8–14 Days)", "Long Vacation (15+ Days)", "Custom Duration"] },
              { icon: <FaHotel size={28} />, title: "Accommodation Choice", items: ["Budget Hotels", "Mid-Range Hotels", "Luxury Hotels", "Resorts & Villas", "Boutique Properties"] },
              { icon: <FaUsers size={28} />, title: "Group Size", items: ["Solo Travel", "Couple Package", "Family Package", "Friends Group (5–10)", "Large Group (10+)"] },
              { icon: <FaPlane size={28} />, title: "Travel Preferences", items: ["Flight + Hotel", "Train + Hotel", "Road Trip", "Cruise Package", "Adventure Travel"] },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
              >
                <div className="text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{card.icon}</div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-5">{card.title}</h3>
                <ul className="space-y-2.5">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-slate-600 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRAVEL STYLES ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Our Specialities</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Holiday Styles We <span className="text-emerald-700">Excel At</span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              From sun-soaked beaches to Himalayan adventures — tell us your travel style and we'll design the perfect trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {travelStyles.map((style, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`p-7 rounded-2xl border bg-gradient-to-br ${style.color} hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => openForm(style.title)}
              >
                <div className="text-3xl mb-4">{style.emoji}</div>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">{style.title}</h3>
                <p className="text-slate-600 text-[13px] leading-relaxed mb-4">{style.desc}</p>
                <div className="flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                  <span>PLAN THIS TRIP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INCLUDED ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">All-Inclusive Planning</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              What's Included in Every <span className="text-emerald-700">Custom Holiday</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              { icon: <FaStar size={28} className="text-emerald-700" />, title: "Personalized Itinerary", text: "A day-by-day travel plan designed around your interests, pace, and preferences — not a copy-paste template." },
              { icon: <FaUsers size={28} className="text-emerald-700" />, title: "Expert Local Guides", text: "Vetted local guides at each destination who enhance your experience with insider knowledge and cultural depth." },
              { icon: <FaPlane size={28} className="text-emerald-700" />, title: "Premium Transportation", text: "Comfortable AC vehicles for all airport transfers, inter-city travel, and guided sightseeing trips." },
              { icon: <FaUtensils size={28} className="text-emerald-700" />, title: "Curated Dining", text: "Restaurant recommendations and pre-booked dining experiences — from authentic street food to fine dining." },
              { icon: <FaShieldAlt size={28} className="text-emerald-700" />, title: "24/7 Support Desk", text: "Your consultant is reachable throughout the trip — for help, changes, emergencies, or just reassurance." },
              { icon: <FaCheckCircle size={28} className="text-emerald-700" />, title: "Travel Insurance", text: "Comprehensive travel insurance options covering delays, cancellations, medical emergencies, and lost baggage." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group text-center"
              >
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-[13px] leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOLIDAY TYPE CARDS (Preserved) ──────────────────────────────── */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Starting Points</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Choose Your Holiday <span className="text-emerald-700">Base Package</span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              Pick a theme as your starting point — we'll customize every detail around your preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { img: beachImg, title: "Beach & Island Getaway", price: "₹25,000", type: "Beach & Island Getaway", features: ["Beachfront accommodation", "Water sports activities", "Sunset cruises", "Local island tours"] },
              { img: mountainImg, title: "Mountain Adventure", price: "₹35,000", type: "Mountain Adventure", features: ["Trekking & hiking", "Mountain lodges", "Adventure activities", "Scenic viewpoints"] },
              { img: cultureImg, title: "Cultural Heritage Tour", price: "₹30,000", type: "Cultural Heritage Tour", features: ["Historical sites", "Cultural experiences", "Local cuisine tours", "Heritage accommodations"] },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all group border border-slate-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Customizable
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">{card.title}</h3>
                  <p className="text-sm font-black text-emerald-700 mb-4">Starting from {card.price} per person</p>
                  <div className="space-y-2 mb-5">
                    {card.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-slate-600 text-[13px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openForm(card.type)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                  >
                    CUSTOMIZE THIS HOLIDAY
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              How We Build Your <span className="text-emerald-700">Dream Holiday</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-start p-7 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-black italic text-slate-100 group-hover:text-emerald-100 transition-colors">{s.step}</span>
                  <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight mb-2">{s.title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Real Stories</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Custom Holidays. <span className="text-emerald-700">Life-Long Memories.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">{t.holiday}</span>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{t.holiday}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Common Questions</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Customized Holiday <span className="text-emerald-700">FAQs</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-7 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-bold text-slate-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-700 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-6 text-slate-600 text-[13px] leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA / CONTACT ───────────────────────────────────────────────── */}
      <section
        className="py-28 bg-gray-50 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${cardImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">Let's Get Started</span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mt-2 mb-4">
            Plan Your Dream <span className="text-emerald-400">Holiday Today</span>
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Talk to a Goimomi holiday expert — free itinerary planning, best price promise, and one dedicated
            consultant who handles every detail from start to finish.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
            {["Free Planning Consultation", "Best Price Guaranteed", "No Commitment Required"].map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">{b}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
            {[
              { icon: <FaPhoneAlt size={28} className="text-emerald-400" />, title: "Phone Support", subtitle: "24/7 Customer Service", info: "+91 8110082222" },
              { icon: <FaStar size={28} className="text-emerald-400" />, title: "Email Support", subtitle: "Quick Response Guaranteed", info: "hello@goimomi.com" },
              { icon: <FaUsers size={28} className="text-emerald-400" />, title: "WhatsApp Chat", subtitle: "Instant Messaging", info: "Chat with Us" },
            ].map((card, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-7 rounded-2xl text-center border border-white/15 hover:bg-white/20 transition-all">
                <div className="mb-3 flex justify-center">{card.icon}</div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">{card.title}</h3>
                <p className="text-slate-300 text-[11px] mt-1 font-medium uppercase tracking-wider">{card.subtitle}</p>
                <p className="text-emerald-400 mt-3 text-sm font-black">{card.info}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="custom-cta-plan"
              onClick={() => openForm()}
              className="w-full sm:w-64 px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl rounded-sm"
            >
              START PLANNING NOW
            </button>
            <button
              onClick={() => navigate('/contactus')}
              className="w-full sm:w-64 px-8 py-4 bg-transparent border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm"
            >
              📞 CALL US NOW
            </button>
          </div>
        </div>
      </section>

      <ZohoCustomizedForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={{ packageType: selectedPackage }}
      />
    </div>
  );
};

export default CustomizedHolidays;



