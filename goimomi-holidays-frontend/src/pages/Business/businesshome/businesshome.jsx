import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Globe,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Rocket,
  CheckCircle2,
  Star,
  Clock,
  Headphones,
  CreditCard,
  Map,
  Award,
  BarChart3,
  Plane,
  Hotel,
  FileText,
  ChevronRight,
  Phone,
} from "lucide-react";
import usePageSEO from "../../../../hooks/usePageSEO";

// Assets
import bizHero from "../../../../assets/Business/biz1.jpeg";
import bizCardImg from "../../../../assets/Business/biz3.jpeg";
import cantonCardImg from "../../../../assets/images/canton-hero.png";

// ─── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(target);
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const BusinessHome = () => {
  const navigate = useNavigate();
  usePageSEO(
    "Elevate Your Business Travel – Goimomi Business",
    "Empower your enterprise with Goimomi Business Solutions. From tailored corporate travel and logistics to global sourcing trips and Canton Fair registration, we provide strategic mobility solutions for the modern Indian business.",
    bizHero,
    "Corporate travel solutions India, business travel management, Goimomi Business, Canton Fair registration, sourcing trips China, strategic business mobility, corporate logistics Goimomi"
  );

  const scrollToCategories = () => {
    document.getElementById("business-segments")?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  const stats = [
    { value: "500", suffix: "+", label: "Corporates Served" },
    { value: "40", suffix: "+", label: "Destination Countries" },
    { value: "98", suffix: "%", label: "Client Satisfaction" },
    { value: "12", suffix: "K+", label: "Trips Managed" },
  ];

  const businessCategories = [
    {
      id: "corporate-travel",
      title: "Business Travel",
      subtitle: "Corporate Excellence",
      description:
        "Seamless end-to-end travel solutions crafted for modern enterprises. From priority flights and premium hotel bookings to visa facilitation and on-ground logistics — we manage every touchpoint so your team can focus on closing deals.",
      image: bizCardImg,
      path: "/holidays?category=Business Travel",
      icon: <Briefcase className="w-6 h-6" />,
      tag: "Enterprise",
      highlights: ["Priority Airline Bookings", "Corporate Hotel Rates", "24/7 Travel Desk", "Group Coordination"],
    },
    {
      id: "canton-fair",
      title: "Canton Fair",
      subtitle: "Global Sourcing",
      description:
        "Unlock direct access to the world's largest trade fair in Guangzhou, China. We handle registration, group travel, accommodation in Guangzhou, interpreter services, and factory visit coordination — everything you need to source smarter.",
      image: cantonCardImg,
      path: "/canton",
      icon: <Building2 className="w-6 h-6" />,
      tag: "Most Popular",
      highlights: ["Fair Registration", "Factory Visit Tours", "Interpreter Services", "Group Hotel Deals"],
    },
  ];

  const whyUs = [
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Dedicated Account Manager",
      desc: "A single point of contact who knows your company's travel preferences, budget, and compliance requirements.",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Flexible Corporate Billing",
      desc: "Consolidated monthly invoicing, GST-compliant receipts, and flexible payment terms tailored for enterprises.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Corporate-Grade Insurance",
      desc: "Comprehensive travel insurance covering medical emergencies, trip cancellations, and baggage loss — globally.",
    },
    {
      icon: <Map className="w-5 h-5" />,
      title: "Real-Time Trip Tracking",
      desc: "Live dashboards to monitor traveler locations, itinerary status, and expense analytics in one place.",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Visa & Compliance Support",
      desc: "Expert visa processing, documentation assistance, and travel policy compliance checks across all destinations.",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Negotiated Business Rates",
      desc: "Access exclusive corporate fares on flights, hotel chains, and car rentals — unavailable to individual travellers.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      icon: <Phone className="w-5 h-5" />,
      title: "Initial Consultation",
      desc: "Our corporate travel specialist understands your business objectives, travel frequency, team size, and budget parameters.",
    },
    {
      step: "02",
      icon: <FileText className="w-5 h-5" />,
      title: "Custom Travel Policy",
      desc: "We draft a bespoke travel policy aligned with your corporate standards — covering booking windows, cabin classes, and preferred vendors.",
    },
    {
      step: "03",
      icon: <Plane className="w-5 h-5" />,
      title: "Seamless Booking",
      desc: "Your dedicated desk handles all reservations — flights, hotels, ground transport — with real-time confirmation and digital itineraries.",
    },
    {
      step: "04",
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Report & Optimize",
      desc: "Monthly spend reports, savings analytics, and trend insights help you continuously optimize your corporate travel budget.",
    },
  ];

  const features = [
    { icon: <TrendingUp />, label: "Strategic Growth", desc: "ROI-driven travel planning from day one" },
    { icon: <Globe />, label: "Global Reach", desc: "Access to 40+ countries & 150+ carriers" },
    { icon: <ShieldCheck />, label: "Total Security", desc: "Corporate-grade insurance & safety protocols" },
    { icon: <Rocket />, label: "Fast Processing", desc: "Rapid visa processing & same-day confirmations" },
    { icon: <Clock />, label: "24 / 7 Support", desc: "Round-the-clock travel desk at your service" },
    { icon: <Users />, label: "Group Specialists", desc: "Expert handling for MICE & delegation travel" },
  ];

  const testimonials = [
    {
      name: "Rajesh Mehta",
      role: "Head of Procurement, Apex Industries",
      quote:
        "Goimomi's Canton Fair package saved us 30% on sourcing costs. Their interpreter and factory visit arrangements were flawless — we came back with 5 confirmed vendor contracts.",
      rating: 5,
    },
    {
      name: "Priya Shenoy",
      role: "VP Operations, TechVista Pvt. Ltd.",
      quote:
        "We manage travel for 200+ employees monthly. Goimomi's dedicated account manager and consolidated billing have cut our admin overhead by half. Truly enterprise-grade.",
      rating: 5,
    },
    {
      name: "Arun Kapoor",
      role: "CEO, GlobalTrade Solutions",
      quote:
        "From visa processing to airport transfers and hotel bookings, everything was handled with precision. The 24/7 support desk resolved a last-minute flight change within 20 minutes.",
      rating: 5,
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen bg-slate-50 selection:bg-emerald-200">

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-slate-900 group">
        <div className="absolute inset-0">
          <img
            src={bizHero}
            alt="Corporate Travel Hero"
            className="w-full h-full object-cover transition-transform duration-[8000ms] scale-110 group-hover:scale-100 opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 flex items-center px-6 md:px-20 z-10">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left max-w-3xl"
          >
            <div className="flex items-center gap-3 text-emerald-400 mb-5">
              <div className="w-10 h-[2px] bg-emerald-400" />
              <span className="text-[11px] md:text-xs uppercase tracking-[0.5em] font-black">
                Strategic Business Solutions
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-5">
              PRECISION
              <br />
              <span className="text-white/20 group-hover:text-emerald-400 transition-colors duration-700">
                BUSINESS
              </span>
              <br />
              <span className="text-2xl md:text-4xl font-black text-white/80 not-italic tracking-tight">
                TRAVEL REIMAGINED
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl font-medium leading-relaxed">
              Empowering Indian enterprises with world-class corporate travel management, direct sourcing access to
              global manufacturers, and seamless end-to-end business mobility solutions.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                id="biz-hero-discover"
                onClick={scrollToCategories}
                className="px-8 py-4 bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-emerald-800 transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_20px_50px_rgba(20,83,45,0.4)] flex items-center gap-2 rounded-sm"
              >
                DISCOVER SOLUTIONS <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="biz-hero-contact"
                onClick={() => navigate("/contactus")}
                className="px-8 py-4 bg-transparent border border-white/30 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm"
              >
                TALK TO EXPERTS
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5">
              {["IATA Certified", "GST Compliant", "ISO 9001:2015"].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute bottom-10 right-10 hidden lg:flex gap-8 z-20">
          {[
            { value: "500+", label: "Corporates Served" },
            { value: "40+", label: "Countries" },
            { value: "98%", label: "Satisfaction" },
          ].map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <div className="w-[1px] h-12 bg-white/10" />}
              <div className="text-white text-right">
                <p className="text-3xl font-black italic tracking-tighter text-emerald-400">{m.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{m.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ─── ANIMATED STATS BAR ──────────────────────────────────────────── */}
      <section className="bg-emerald-800 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="text-white">
              <p className="text-4xl font-black italic tracking-tighter text-white">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SEGMENTS SECTION ────────────────────────────────────────────── */}
      <section id="business-segments" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black mb-3">
              Strategic Portfolios
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">
              Global{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-500">
                Mobility
              </span>{" "}
              &amp; Sourcing
            </h2>
            <p className="max-w-xl text-slate-500 text-sm font-medium leading-relaxed">
              Whether you're sending executives to a global summit or scouting suppliers in China, Goimomi delivers
              tailored solutions that keep your business moving—efficiently and profitably.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {businessCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100"
              onClick={() => navigate(cat.path)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />

                {/* Tag */}
                <div className="absolute top-5 left-5 z-20">
                  <div className="bg-white px-4 py-1.5 rounded-full shadow-lg">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{cat.tag}</span>
                  </div>
                </div>

                {/* Icon badge */}
                <div className="absolute bottom-5 left-5 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  {cat.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none my-2 group-hover:text-emerald-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{cat.description}</p>

                {/* Highlights */}
                <ul className="grid grid-cols-2 gap-2 mb-7">
                  {cat.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* CTA row */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                    Explore &amp; Apply
                  </span>
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-emerald-700 group-hover:border-emerald-700 group-hover:text-white transition-all transform group-hover:translate-x-1 text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── WHY CHOOSE US ───────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* decorative blurs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-700/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-900/40 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">
                Our Edge
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mt-2">
                Why Leading Enterprises <br />
                <span className="text-emerald-400">Choose Goimomi</span>
              </h2>
            </div>
            <p className="max-w-sm text-slate-400 text-sm leading-relaxed">
              We don't just book tickets — we build end-to-end corporate travel ecosystems that save costs and boost
              productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-700/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold uppercase tracking-tight mb-2">{item.title}</h3>
                <p className="text-slate-400 text-[13px] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">
              Our Process
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2 mb-4">
              How We Work <span className="text-emerald-700">With You</span>
            </h2>
            <p className="max-w-lg mx-auto text-slate-500 text-sm leading-relaxed">
              A streamlined, transparent process from onboarding to post-trip reporting — designed for enterprise-scale
              efficiency.
            </p>
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
                {/* connector */}
                {i < processSteps.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-200 hidden lg:block z-10" />
                )}

                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-black italic text-slate-100 group-hover:text-emerald-100 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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

      {/* ─── FEATURES STRIP ──────────────────────────────────────────────── */}
      <section className="py-16 bg-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-white">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-3 text-emerald-200 transform group-hover:scale-110 group-hover:text-white transition-all">
                  {React.cloneElement(f.icon, { size: 26 })}
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight italic mb-1">{f.label}</h4>
                <p className="text-emerald-200/70 text-[11px] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">
              Client Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Trusted by <span className="text-emerald-700">Industry Leaders</span>
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
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>

                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-black text-base">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES QUICK LIST ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">
                Full-Spectrum Services
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2 mb-6">
                Everything Your <br />
                <span className="text-emerald-700">Corporate Team Needs</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                From first-class flights to factory floors in Guangzhou — Goimomi is the single partner that covers the
                complete spectrum of business travel and global sourcing requirements for Indian enterprises.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Domestic & International Flights",
                  "Business Hotel Reservations",
                  "Visa Processing & Documentation",
                  "Airport Transfers & Car Hire",
                  "MICE & Conference Travel",
                  "Canton Fair Registration",
                  "Factory Visit Coordination",
                  "Travel Insurance",
                  "Group Travel Management",
                  "Expense Reporting & Analytics",
                ].map((svc) => (
                  <div key={svc} className="flex items-center gap-2.5 text-[12px] font-bold text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    {svc}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={bizCardImg} alt="Business Travel" className="w-full h-80 object-cover" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-5 shadow-2xl border border-slate-100">
                <p className="text-3xl font-black italic text-emerald-700">₹2.4Cr+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Saved for Clients This Year
                </p>
              </div>
              <div className="absolute -top-8 -right-8 bg-emerald-700 rounded-2xl p-5 shadow-2xl">
                <Hotel className="w-6 h-6 text-white mb-2" />
                <p className="text-2xl font-black italic text-white">300+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Hotel Partners</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-gradient-to-br from-emerald-800 to-emerald-950 p-10 md:p-16 relative overflow-hidden text-center shadow-[0_50px_120px_rgba(20,83,45,0.25)]">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-200 text-[9px] font-black uppercase tracking-widest mb-6 border border-white/10">
              Partners in Your Success
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-[0.9]">
              Ready to Transform Your <br />
              <span className="text-emerald-400">Corporate Travel Strategy?</span>
            </h2>

            <p className="text-emerald-100/70 max-w-xl mx-auto mb-4 text-sm font-medium leading-relaxed">
              Join 500+ Indian enterprises that have cut travel costs, eliminated booking friction, and empowered their
              teams to travel smarter with Goimomi Business Solutions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-emerald-200/80 text-[11px] font-bold uppercase tracking-widest">
              {["No Setup Fee", "Dedicated Account Manager", "Cancel Anytime"].map((b) => (
                <div key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {b}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="biz-cta-consult"
                onClick={() => navigate("/contactus")}
                className="w-full sm:w-60 px-8 py-4 bg-white text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-2xl rounded-sm"
              >
                CONSULT AN EXPERT
              </button>
              <button
                id="biz-cta-packages"
                onClick={() => navigate("/holidays?category=Business Travel")}
                className="w-full sm:w-60 px-8 py-4 bg-transparent border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm"
              >
                VIEW PACKAGES
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BusinessHome;


