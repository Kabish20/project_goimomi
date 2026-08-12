import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Award, BadgeCheck, Headphones, ShieldCheck,
  Globe, Star, ArrowRight, TrendingUp, Users, MapPin,
  Heart, Briefcase, Plane, Clock, Sparkles,
} from 'lucide-react';
import aboutHero from '../../../assets/aboutus.png';
import officeImg from '../../../assets/office.png';
import usePageSEO from '../../../hooks/usePageSEO';

const About = () => {
  usePageSEO(
    "About Goimomi Holidays | Our Journey & Commitment",
    "Discover Goimomi Holidays—your trusted travel partner in India since 2014. With over a decade of excellence and 50,000+ happy travelers, we are committed to creating extraordinary experiences through personalized holiday planning, expert guidance, and 24/7 support.",
    aboutHero,
    "About Goimomi Holidays, travel agency India, trusted travel partner, corporate travel services, family holiday planning, Goimomi mission and vision, 10 years of travel excellence"
  );

  const stats = [
    { value: "10+", label: "Years of Excellence" },
    { value: "50K+", label: "Happy Travellers" },
    { value: "100+", label: "Destinations" },
    { value: "24/7", label: "Support Desk" },
  ];

  const milestones = [
    { year: "2014", title: "Founded in Chennai", desc: "Goimomi Holidays was established by a team of passionate travel professionals with a mission to redefine travel planning in India." },
    { year: "2016", title: "Umrah & Hajj Division", desc: "Launched a dedicated spiritual travel desk, becoming a trusted Umrah package provider serving thousands of pilgrims from TN & KL." },
    { year: "2018", title: "Corporate Travel Division", desc: "Expanded into corporate travel management — airline ticketing, hotel contracting, and MICE services for businesses across Southeast India." },
    { year: "2020", title: "Digital Platform Launch", desc: "Launched goimomi.com — a full-stack travel booking and enquiry platform bringing our services online to a national audience." },
    { year: "2022", title: "Saudi Arabia Operations", desc: "Established ground operations in Saudi Arabia, enabling premium cab transfers, Ziyarat tours, and on-ground pilgrimage support." },
    { year: "2024", title: "10 Years of Excellence", desc: "Celebrated a decade of service — 50,000+ travellers served, 100+ destinations covered, and a growing team of certified travel specialists." },
  ];

  const whyUs = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "IATA Accredited Agency",
      desc: "As an IATA-accredited travel agency, we hold the credentials to issue international airline tickets, hold negotiated corporate fares, and apply industry-leading booking systems that guarantee the best available prices.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Specialist Knowledge Across 100+ Destinations",
      desc: "Our consultants have first-hand travel experience or deep operational knowledge of every destination we recommend — from the Maldivian atolls to the mountains of Kashmir, from Saudi Arabia to Southeast Asia.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Dedicated Human Expertise",
      desc: "Every Goimomi client gets a named travel consultant — not a chatbot, not a callback queue. A real expert who listens, plans, and stays accountable for your holiday from enquiry to return.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Visa & Documentation Support",
      desc: "Our in-house visa team manages all entry documentation — single and multi-country visas, Umrah visas, travel insurance, and port entry permits. One agency, all your paperwork handled.",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "24/7 On-Trip Support",
      desc: "Travel emergencies don't follow business hours. Our support desk is staffed 24/7 — ready to handle flight delays, hotel issues, itinerary changes, or any on-ground situation from anywhere in the world.",
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      title: "Transparent Pricing — Always",
      desc: "We believe pricing should be honest. Every quotation we provide is itemized — no hidden charges, no last-minute additions. What we quote is what you pay, guaranteed in writing.",
    },
  ];

  const services = [
    { emoji: "🏖️", title: "Leisure Holidays", desc: "Custom and pre-packaged holiday itineraries across India and internationally — beaches, mountains, culture, and wellness." },
    { emoji: "🕌", title: "Umrah & Ziyarat", desc: "End-to-end Umrah packages with visa processing, Haram-side hotels, scholar guides, and on-ground Saudi Arabia support." },
    { emoji: "🚢", title: "Cruise Packages", desc: "Domestic Cordelia cruises and international sailings — curated with cabin upgrades, shore excursions, and pre/post stays." },
    { emoji: "✈️", title: "Flight Ticketing", desc: "International and domestic air ticketing across all major carriers with preferred corporate fares and group booking discounts." },
    { emoji: "🚗", title: "Transfers & Cab Services", desc: "Premium intercity and airport transfers in India and Saudi Arabia — verified drivers, transparent pricing, 24/7 coordination." },
    { emoji: "🌍", title: "Visa Services", desc: "Single and multi-country visa processing for 80+ countries — document coordination, application tracking, and expert guidance." },
    { emoji: "🏢", title: "Corporate Travel", desc: "Comprehensive corporate travel management — airline contracts, hotel negotiations, ground logistics, and MICE packages." },
    { emoji: "🎯", title: "Group & MICE Travel", desc: "Large group travel, incentive trips, conference logistics, and destination management for corporate and leisure groups." },
  ];

  const values = [
    { icon: <Heart className="w-5 h-5" />, title: "Client-First Always", desc: "Every decision we make is filtered through one question: is this best for our client? Your satisfaction isn't a metric — it's our purpose." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Absolute Integrity", desc: "We price transparently, advise honestly, and never recommend a product we wouldn't choose ourselves. Your trust is our most valuable asset." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Excellence in Execution", desc: "Good enough isn't good enough. We sweat the details — hotel positioning, transfer timing, arrival protocols — so your experience is seamless." },
    { icon: <Globe className="w-5 h-5" />, title: "Enriching Cultures", desc: "We believe travel should connect people. Every itinerary we design includes authentic local experiences that go beyond the tourist trail." },
  ];

  return (
    <div className="w-full overflow-hidden bg-slate-50">

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img src={aboutHero} className="w-full h-full object-cover" alt="About Goimomi Holidays" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/15" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/35 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-white text-center"
        >
          <div className="flex items-center justify-center gap-3 text-emerald-400 mb-4">
            <div className="w-12 h-[2px] bg-emerald-400" />
            <span className="text-[11px] uppercase tracking-[0.5em] font-black">Trusted Travel Experts Since 2014</span>
            <div className="w-12 h-[2px] bg-emerald-400" />
          </div>
          <h1
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] drop-shadow-2xl mb-4"
            style={{ textShadow: '0 2px 30px rgba(0,0,0,0.9), 0 4px 60px rgba(0,0,0,0.7)' }}
          >
            ABOUT
            <br />
            <span className="text-white/50">GOIMOMI</span>
          </h1>
          <p
            className="text-slate-200 max-w-xl text-sm md:text-base leading-relaxed mb-6"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.9)' }}
          >
            A decade of designing extraordinary journeys — from personal holidays to pilgrimage packages,
            corporate travel to cruise voyages — for over 50,000 happy travellers across India and beyond.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {["IATA Accredited", "10+ Years Experience", "50,000+ Travellers", "100+ Destinations"].map(b => (
              <div key={b} className="flex items-center gap-1.5" style={{ textShadow: '0 1px 8px rgba(0,0,0,1)' }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white">{b}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── STATS STRIP ───────────────────────────────────────────────────── */}
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

      {/* ─── OUR STORY ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Our Foundation</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
                  Our Story — <span className="text-emerald-700">A Decade of Journeys</span>
                </h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Founded in 2014 in Chennai by a team of passionate travel professionals, Goimomi Holidays was built on a single conviction:
                that great travel doesn't happen by chance — it happens through expertise, care, and relentless attention to detail.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                What began as a boutique travel agency serving Tamil Nadu has grown into a nationally-recognised travel management company
                — offering everything from tailor-made leisure holidays and Umrah pilgrimage packages to corporate travel accounts and
                premium cab transfers across Saudi Arabia.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Over a decade, we've helped more than 50,000 travellers explore the world — from the golden mosques of Makkah to the
                pristine beaches of the Maldives, from the snow peaks of Kashmir to the canals of Venice. Each journey planned is a
                testament to our commitment to excellence and to the trust our clients place in us.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {["Founded 2014", "Chennai HQ", "National Reach", "Saudi Operations"].map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img src={officeImg} className="w-full h-80 object-cover" alt="Goimomi office" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-emerald-700 text-white p-6 rounded-2xl text-center shadow-2xl">
                <p className="text-4xl font-black italic tracking-tighter leading-none">10+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mt-1">Years of<br />Excellence</p>
              </div>
              <div className="absolute -top-5 -left-5 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl text-center">
                <p className="text-2xl font-black text-emerald-700 tracking-tighter">50K+</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Happy Travellers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE GOIMOMI (DARK) ─────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">The Agent Advantage</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mt-2 mb-4">
              Why Thousands Choose <br /><span className="text-emerald-400">Goimomi — Every Year</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
              In a world of booking apps and self-service portals, Goimomi remains a trusted human partner — with the expertise,
              accountability, and personal care that no algorithm can replicate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((item, i) => (
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

      {/* ─── MISSION & VISION ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Our Purpose</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Mission & <span className="text-emerald-700">Vision</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-2xl bg-emerald-50 border-2 border-emerald-200 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-700 flex items-center justify-center text-white mb-6">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight mb-3">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To provide exceptional, personalised travel experiences that consistently exceed client expectations — ensuring every journey
                is safe, seamless, and deeply memorable. We exist to take the complexity out of travel and replace it with confidence, joy,
                and the freedom to simply experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-700 flex items-center justify-center text-white mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">Our Vision</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                To be India's most trusted and admired travel management company — recognised for our expertise, integrity, and human approach
                in an increasingly automated world. We envision a Goimomi where every client feels truly cared for, every journey tells a story,
                and every destination leaves a lasting impact.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES WE OFFER ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Full-Spectrum Services</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Everything Travel — <span className="text-emerald-700">Under One Roof</span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              From a single visa to a full corporate travel account — Goimomi is your single point of contact for every travel need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-3">{svc.emoji}</div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-2">{svc.title}</h3>
                <p className="text-slate-500 text-[12px] leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE / MILESTONES ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              A Decade of <span className="text-emerald-700">Milestones</span>
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-emerald-100 -translate-x-1/2" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex gap-8 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-700 border-4 border-white shadow-md mt-1.5 z-10 shrink-0" />

                  {/* Spacer for desktop alternating layout */}
                  <div className="hidden md:block flex-1" />

                  {/* Card */}
                  <div className="flex-1 ml-12 md:ml-0 bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block mb-3">{m.year}</span>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">{m.title}</h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUR VALUES ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2">
              Our Core <span className="text-emerald-700">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mx-auto mb-5 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                  {v.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACHIEVEMENTS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">10 Years of Impact</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mt-2 mb-3">
              Numbers That <span className="text-emerald-400">Speak for Us</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">Every figure here represents a real traveller, a real journey, and a real moment of trust placed in our hands.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Years of Experience", sub: "In business since 2014" },
              { value: "50,000+", label: "Happy Travellers", sub: "Across 100+ destinations" },
              { value: "100+", label: "Destinations", sub: "Domestic & international" },
              { value: "24/7", label: "Support Desk", sub: "Always reachable" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all"
              >
                <p className="text-5xl font-black italic tracking-tighter text-emerald-400 leading-none">{s.value}</p>
                <p className="text-white font-bold text-sm uppercase tracking-wider mt-3">{s.label}</p>
                <p className="text-slate-500 text-[11px] mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Let's Start Planning</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-2 mb-4">
            Ready to Travel <span className="text-emerald-700">with Confidence?</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Whether it's a dream holiday, a spiritual pilgrimage, a corporate event, or a simple flight booking —
            Goimomi is here to make it exceptional. Talk to an expert today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+918110082222"
              className="w-full sm:w-auto px-10 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl rounded-sm flex items-center justify-center gap-2"
            >
              📞 CALL US NOW
            </a>
            <a
              href="https://wa.me/918110082222"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all rounded-sm flex items-center justify-center gap-2"
            >
              💬 WHATSAPP US
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default About;


