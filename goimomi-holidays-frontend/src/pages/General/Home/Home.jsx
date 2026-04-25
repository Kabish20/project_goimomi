import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../../api";
import {
  MapPin, Zap, ShieldCheck, Headphones, Star, Award, Clock, Globe,
  Users, CheckCircle2, Briefcase, CreditCard, Plane, FileText,
  PhoneCall, BadgeCheck, TrendingUp, ArrowRight, Sparkles, CalendarDays
} from "lucide-react";
import usePageSEO from "../../../../hooks/usePageSEO";
import { getImageUrl } from "../../../../utils/imageUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";

import biz1 from "../../../../assets/Business/biz1.jpeg";
import biz2 from "../../../../assets/Business/biz2.jpeg";
import biz3 from "../../../../assets/Business/biz3.jpeg";
import biz4 from "../../../../assets/Business/biz4.jpeg";
import biz5 from "../../../../assets/Business/biz5.jpeg";

const businessImages = [biz1, biz2, biz3, biz4, biz5];

import leisure1 from "../../../../assets/Hero/leisure1.jpeg";
import leisure2 from "../../../../assets/Hero/leisure2.jpeg";
import leisure3 from "../../../../assets/Hero/leisure3.jpeg";
import leisure4 from "../../../../assets/Hero/leisure4.jpeg";
import leisure5 from "../../../../assets/Hero/leisure5.jpeg";

// POPULAR DESTINATIONS
import maldives from "../../../../assets/PopularDestinations/maldives.png";
import dubai from "../../../../assets/PopularDestinations/dubaiSafari.png";
import singapore from "../../../../assets/PopularDestinations/singapore.png";
import paris from "../../../../assets/PopularDestinations/paris.png";
import santorini from "../../../../assets/PopularDestinations/santorini.png";
import bali from "../../../../assets/PopularDestinations/bali.png";

// SPECIAL OFFERS
import dubaiOffer from "../../../../assets/Specialoffers/dubai.png";
import keralaOffer from "../../../../assets/Specialoffers/keralaBackwaters.png";
import europeOffer from "../../../../assets/Specialoffers/venice.png";
import thailandOffer from "../../../../assets/Specialoffers/thailand.png";
import switzerlandOffer from "../../../../assets/Specialoffers/switzerland.png";
import maldivesOffer from "../../../../assets/Specialoffers/maldivesOffer.png";

// GALLERY
import gallery1 from "../../../../assets/TravelGallery/client1.jpeg";
import gallery2 from "../../../../assets/TravelGallery/client2.jpeg";
import gallery3 from "../../../../assets/TravelGallery/client3.jpeg";
import gallery4 from "../../../../assets/TravelGallery/client4.jpeg";
import gallery5 from "../../../../assets/TravelGallery/client5.jpeg";
import gallery6 from "../../../../assets/TravelGallery/client6.jpeg";
import gallery7 from "../../../../assets/TravelGallery/client7.jpeg";
import gallery8 from "../../../../assets/TravelGallery/client8.jpeg";
import gallery9 from "../../../../assets/TravelGallery/client9.jpeg";
import gallery10 from "../../../../assets/TravelGallery/client10.webp";
import gallery11 from "../../../../assets/TravelGallery/client11.webp";
import gallery12 from "../../../../assets/TravelGallery/client12.webp";
import gallery13 from "../../../../assets/TravelGallery/client13.jpeg";
import gallery14 from "../../../../assets/TravelGallery/client14.jpeg";

// VISAS
import dubaiVisa from "../../../../assets/Visa/dubai.png";
import singaporeVisa from "../../../../assets/Visa/singapore.png";
import saudiVisa from "../../../../assets/Visa/saudi.png";
import azerbaijanVisa from "../../../../assets/Visa/azerbaijan.png";
import vietnamVisa from "../../../../assets/Visa/vietnam.png";

// VISA DEALS 
import uzbekistanVisa from "../../../../assets/Visa Deals/Uzbekistan.png";
import turkey from "../../../../assets/Visa Deals/Turkey.png";
import oman from "../../../../assets/Visa Deals/Oman.png";
import moroccoVisa from "../../../../assets/Visa Deals/Morocco.png";
import Laos from "../../../../assets/Visa Deals/Laos.png";
import Kyrgystan from "../../../../assets/Visa Deals/Kyrgystan.png";
import Kenya from "../../../../assets/Visa Deals/Kenya.png";
import Jordan from "../../../../assets/Visa Deals/Jordan.png";
import Indonesia from "../../../../assets/Visa Deals/Indonesia.png";
import Ethiopia from "../../../../assets/Visa Deals/Ethiopia.png";
import Dubai from "../../../../assets/Visa Deals/Dubai.png";
import cambodia from "../../../../assets/Visa Deals/cambodia.png";
import Bhutan from "../../../../assets/Visa Deals/Bhutan.png";
import Bahrain from "../../../../assets/Visa Deals/Bahrain.png";
import Azerbaijan from "../../../../assets/Visa Deals/Azerbaijan.png";
import Antigua from "../../../../assets/Visa Deals/Antigua & Barbuda.png";
import BahrainDeal from "../../../../assets/Visa Deals/Bahrain.png";
import KenyaDeal from "../../../../assets/Visa Deals/Kenya.png";
import JordanDeal from "../../../../assets/Visa Deals/Jordan.png";
import IndonesiaDeal from "../../../../assets/Visa Deals/Indonesia.png";
import TurkeyDeal from "../../../../assets/Visa Deals/Turkey.png";



const Home = () => {
  const navigate = useNavigate();
  usePageSEO(
    "Goimomi Holidays – Customized Holiday Packages & Travel Experiences",
    "Goimomi Holidays offers customized vacation packages, family trips, honeymoon tours, adventure travel, and premium holiday planning tailored to your preferences.",
    undefined,
    "goimomi holidays, travel agency, international tours, domestic holidays, visa services, holiday packages"
  );

  const [popularVisas, setPopularVisas] = useState([]);
  const [loadingVisas, setLoadingVisas] = useState(true);

  const heroContent = [
    { title: "Discover Ancient Streets", subtitle: "Historic tours and cultural experiences to bring the past alive." },
    { title: "Explore Blue Seas", subtitle: "Relax on pristine beaches with crystal-clear waters." },
    { title: "Journey Into Nature", subtitle: "Feel the beauty of untouched landscapes around the world." },
    { title: "Scale Majestic Peaks", subtitle: "Adventure awaits in the heart of the world's most stunning mountains." },
    { title: "Discover Turkey's Wonders", subtitle: "Where East meets West in a fusion of history and beauty." }
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const visaRes = await api.get("/api/visas/?is_popular=true");
        setPopularVisas(Array.isArray(visaRes.data) ? visaRes.data : (visaRes.data.results || []));
        setLoadingVisas(false);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setLoadingVisas(false);
      }
    };
    fetchHomeData();
  }, []);


  return (
    <div className="w-full overflow-hidden bg-white">
      {/* ---------------- SECTION 1: PREMIUM SPLIT HERO ---------------- */}
      <section className="relative w-full h-[650px] overflow-hidden bg-black group selection:bg-[#14532d]/30">
        <div className="absolute inset-0 flex flex-col md:flex-row">

          {/* Business Travel Side */}
          <motion.div
            initial={{ width: "100%" }}
            whileHover={typeof window !== "undefined" && window.innerWidth > 768 ? { width: "65%" } : { width: "100%" }}
            animate={typeof window !== "undefined" && window.innerWidth > 768 ? { width: "50%" } : { width: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="relative h-1/2 md:h-full overflow-hidden"
          >
            <div className="absolute inset-0 animate-slowZoom">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
              >
                {businessImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className="w-full h-full bg-cover bg-center shadow-inner transition-all duration-1000"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>


            <div className="absolute bottom-12 left-12 z-20 md:block hidden">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <span className="w-10 h-[1px] bg-white/50" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Elevate Your Strategy</span>
                </div>
                <h2 
                  className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4 cursor-pointer"
                  onClick={() => navigate('/businesshome')}
                >
                  Business<br />Travel
                </h2>
                <button
                  onClick={() => navigate('/businesshome')}
                  className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all transform active:scale-95 shadow-2xl"
                >
                  Explore Corporate
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Leisure Travel Side */}
          <motion.div
            initial={{ width: "100%" }}
            whileHover={typeof window !== "undefined" && window.innerWidth > 768 ? { width: "65%" } : { width: "100%" }}
            animate={typeof window !== "undefined" && window.innerWidth > 768 ? { width: "50%" } : { width: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-1/2 md:h-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#0f172a]/20 z-10" />
            <div className="absolute inset-0 animate-slowZoom">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
              >
                {[leisure1, leisure2, leisure3, leisure4, leisure5].map((img, i) => (
                  <SwiperSlide key={i}>
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-1000"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="absolute bottom-12 right-12 z-20 text-right md:block hidden">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="flex items-center justify-end gap-2 text-white/80 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Curated Global Holidays</span>
                  <span className="w-10 h-[1px] bg-white/50" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                  Leisure<br />Travel
                </h2>
                <button
                  onClick={() => navigate('/holidayhome')}
                  className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all transform active:scale-95 shadow-2xl"
                >
                  Plan A Holiday
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* smokey divider effect */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-48 z-20 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-black/40 to-transparent blur-3xl opacity-80" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent blur-sm" />
        </div>

        {/* Central Vertical Logo/Callout */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center px-4 md:px-0"
          >
            <div className="px-6 md:px-10 py-6 md:py-8">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="block text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white font-black mb-3"
              >
                The Future of Journeys
              </motion.span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter mb-4">
                Travel That<br />
                <span className="text-[#22c55e]">Grows You.</span>
              </h1>
              <p className="text-xs md:text-sm font-medium text-white/70 max-w-sm mx-auto leading-relaxed mb-6 md:block hidden">
                Strategic Business Travel & Curated Global Holidays.<br />
                Integrated for the modern high-performer.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 pointer-events-auto">
                <button
                  onClick={() => navigate('/businesshome')}
                  className="w-full md:w-56 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#14532d] transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl"
                >
                  Business Travel
                </button>
                <button
                  onClick={() => navigate('/holidayhome')}
                  className="w-full md:w-56 px-8 py-4 bg-white text-[#14532d] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-50 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl"
                >
                  Plan a Holiday
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- SECTION 2: CHOOSE YOUR JOURNEY ---------------- */}
      <section className="relative py-20 px-6 overflow-hidden bg-slate-50">
        {/* Subtle bg accent */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-700 font-black">Expert-Curated Experiences</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic mt-2">Choose Your Journey</h2>
            <p className="max-w-xl mx-auto text-slate-500 text-sm mt-4 leading-relaxed">
              As your dedicated travel partner, we handle every detail — from flights and hotels to visas and on-ground logistics —
              so you can focus entirely on the experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Business Block */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white p-7 group hover:bg-[#14532d] transition-all duration-500 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden cursor-pointer"
              onClick={() => navigate('/businesshome')}
            >
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest z-20">Trending</div>
              <div className="mb-5 w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Briefcase className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-white">Business Travel</h4>
              <p className="text-slate-500 mb-5 text-[13px] leading-relaxed group-hover:text-white/80">
                Precision-managed corporate travel — flights, hotels, visa processing, and ground logistics optimized for maximum efficiency and cost savings.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["Dedicated corporate desk","Consolidated billing & GST","24/7 travel support"].map(pt => (
                  <li key={pt} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 group-hover:text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-300 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[9px] group-hover:text-white">
                <span>EXPLORE BUSINESS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Leisure Block */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white p-7 group hover:bg-[#14532d] transition-all duration-500 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden cursor-pointer"
              onClick={() => navigate('/holidayhome')}
            >
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest z-20">Popular</div>
              <div className="mb-5 w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Globe className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-white">Leisure Travel</h4>
              <p className="text-slate-500 mb-5 text-[13px] leading-relaxed group-hover:text-white/80">
                Handpicked holiday packages to 80+ global destinations — beach escapes, cultural tours, pilgrimages, and European adventures.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["Personally vetted itineraries","Best price guarantee","Free customisation"].map(pt => (
                  <li key={pt} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 group-hover:text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-300 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[9px] group-hover:text-white">
                <span>EXPLORE HOLIDAYS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Visa & Documentation Block */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white p-7 group hover:bg-[#14532d] transition-all duration-500 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden cursor-pointer"
              onClick={() => navigate('/visa')}
            >
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest z-20">Fast-Track</div>
              <div className="mb-5 w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-white">Visa Services</h4>
              <p className="text-slate-500 mb-5 text-[13px] leading-relaxed group-hover:text-white/80">
                Expert visa assistance for 40+ countries — tourist, business, e-Visa, and Umrah visas processed accurately and on time.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["10+ years of expertise","Documentation guidance","Real-time status updates"].map(pt => (
                  <li key={pt} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 group-hover:text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-300 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-[9px] group-hover:text-white">
                <span>APPLY FOR VISA</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- POPULAR DESTINATIONS ---------------- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-center fade-up">
          Popular Destinations
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Discover amazing places around the world
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-7xl mx-auto px-4">
          {[
            { img: thailandOffer, title: "Bangkok", region: "SOUTH EAST ASIA", country: "Thailand", category: "International" },
            { img: keralaOffer, title: "Kerala", region: "SOUTH ASIA", country: "India", category: "Domestic" },
            { img: bali, title: "Bali", region: "SOUTH EAST ASIA", country: "Indonesia", category: "International" },
            { img: dubaiOffer, title: "UAE", region: "MIDDLE EAST", country: "UAE", category: "International" },
            { img: singapore, title: "Singapore", region: "SOUTH EAST ASIA", country: "Singapore", category: "International" },
            { img: paris, title: "Paris", region: "EUROPE", country: "France", category: "International" }
          ].map((item, i) => (
            <div
              key={i}
              className="relative h-[300px] rounded-2xl overflow-hidden group border border-white/5 shadow-2xl fade-up cursor-pointer bg-slate-900"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(`/holidays?category=${item.category}`, { state: { filter: item.title } })}
            >
              {/* Background Image with Neutral Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.img}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 group-hover:from-black transition-all duration-500" />
              </div>

              {/* Unique Vertical Accent */}
              <div className="absolute top-4 left-0 w-1.5 h-10 bg-[#14532d] z-10 transition-all duration-700 group-hover:h-full group-hover:top-0 shadow-[0_0_15px_rgba(20,83,45,0.5)]" />

              {/* Top Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-lg">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                    {item.country}
                  </span>
                </div>
              </div>

              {/* Floating Content Card */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="relative p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-500 group-hover:translate-y-[-5px] group-hover:bg-black/60 shadow-2xl">
                  {/* Glowing Accent */}
                  <div className="absolute -top-[1px] left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#14532d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-[7px] uppercase tracking-widest text-green-400 font-bold mb-0.5">{item.region}</p>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none italic">
                        {item.title}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#14532d] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(20,83,45,0.4)]">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500">
                    <div className="overflow-hidden">
                      <p className="text-white/50 text-[9px] mb-3 leading-tight line-clamp-1">
                        Experience the magic of {item.title}.
                      </p>
                      <button
                        className="w-full py-2 bg-white text-black font-black uppercase text-[9px] tracking-[0.1em] rounded-lg hover:bg-[#14532d] hover:text-white transition-all shadow-xl"
                      >
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SPECIAL OFFERS ---------------- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic fade-up">
              Special Offers
            </h2>
            <div className="w-20 h-1 bg-[#14532d] mx-auto mt-4 rounded-full fade-up" />
            <p className="text-gray-500 mt-4 font-medium fade-up">
              Exclusive limited-time deals curated for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[
              { img: dubaiOffer, discount: "15% OFF", title: "Dubai Dream Getaway", category: "LUXURY TOUR" },
              { img: keralaOffer, discount: "10% OFF", title: "Kerala Backwaters Bliss", category: "WELLNESS" },
              { img: europeOffer, discount: "20% OFF", title: "Europe Grand Tour", category: "SIGHTSEEING" },
              { img: thailandOffer, discount: "25% OFF", title: "Thailand Island Paradise", category: "ADVENTURE" },
              { img: switzerlandOffer, discount: "18% OFF", title: "Swiss Alps Wonderland", category: "NATURE" },
              { img: maldivesOffer, discount: "30% OFF", title: "Maldives Luxury Escape", category: "HONEYMOON" }
            ].map((offer, i) => (
              <div
                key={i}
                className="relative h-[320px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl fade-up cursor-pointer bg-slate-900"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Background Image with Neutral Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={offer.img}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    alt={offer.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 group-hover:from-black/90 transition-all duration-500" />
                </div>

                {/* Theme Accent Line */}
                <div className="absolute top-6 left-0 w-1.5 h-12 bg-[#14532d] z-10 transition-all duration-700 group-hover:h-full group-hover:top-0 shadow-[0_0_15px_rgba(20,83,45,0.6)]" />

                {/* Promo Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-red-600/90 backdrop-blur-md border border-red-500/30 px-3 py-1.5 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white italic">
                      {offer.discount}
                    </span>
                  </div>
                </div>

                {/* Floating Content Card */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="relative p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-500 group-hover:translate-y-[-8px] group-hover:bg-black/60 shadow-2xl">
                    <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#14532d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-green-400 font-bold mb-1">{offer.category}</p>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none italic">
                          {offer.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#14532d] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(20,83,45,0.5)]">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500">
                      <div className="overflow-hidden">
                        <p className="text-white/50 text-xs mb-4 leading-tight">
                          Limited availability for this {offer.title.toLowerCase()}.
                        </p>
                        <button
                          className="w-full py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-[#14532d] hover:text-white transition-all shadow-xl"
                        >
                          Unlock Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- POPULAR VISAS ---------------- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-center fade-up">
          Popular Visas
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Fast & Reliable Visa Processing for Your Next Trip
        </p>

        {loadingVisas ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14532d]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {(popularVisas.slice(0, 6).length > 0 
              ? popularVisas.slice(0, 6).map((v, idx) => {
                  const countryLower = (v.country || "").toLowerCase();
                  const genericFallbacks = [leisure1, leisure2, leisure3, leisure4, leisure5, bali, paris];
                  
                  let fallbackImg = genericFallbacks[idx % genericFallbacks.length];
                  if (countryLower.includes("dubai") || countryLower.includes("emirates") || countryLower.includes("uae")) fallbackImg = dubaiVisa;
                  else if (countryLower.includes("saudi")) fallbackImg = saudiVisa;
                  else if (countryLower.includes("azerbaijan")) fallbackImg = azerbaijanVisa;
                  else if (countryLower.includes("vietnam")) fallbackImg = vietnamVisa;
                  else if (countryLower.includes("singapore")) fallbackImg = singaporeVisa;
                  else if (countryLower.includes("bahrain")) fallbackImg = BahrainDeal;
                  else if (countryLower.includes("kenya")) fallbackImg = KenyaDeal;
                  else if (countryLower.includes("jordan")) fallbackImg = JordanDeal;
                  else if (countryLower.includes("indonesia") || countryLower.includes("bali")) fallbackImg = IndonesiaDeal;
                  else if (countryLower.includes("turkey")) fallbackImg = TurkeyDeal;

                  return {
                    id: v.id,
                    img: getImageUrl(v.card_image) || fallbackImg,
                    title: v.title,
                    price: `₹${Number(v.selling_price || 0).toLocaleString('en-IN')}`,
                    country: v.country,
                    category: v.visa_type || "E-VISA",
                    isLive: true,
                    fallbackImg
                  };
                })
              : [
                  { img: dubaiVisa, title: "Dubai Visa", price: "₹8,500", country: "United Arab Emirates", category: "PRIORITY" },
                  { img: saudiVisa, title: "Saudi Arabia Visa", price: "₹6,500", country: "Saudi Arabia", category: "FAST-TRACK" },
                  { img: azerbaijanVisa, title: "Azerbaijan Visa", price: "₹4,500", country: "Azerbaijan", category: "E-VISA" },
                  { img: thailandOffer, title: "Thailand Visa", price: "₹3,200", country: "Thailand", category: "E-VISA" },
                  { img: singaporeVisa, title: "Singapore Visa", price: "₹2,800", country: "Singapore", category: "E-VISA" },
                  { img: vietnamVisa, title: "Vietnam Visa", price: "₹3,500", country: "Vietnam", category: "E-VISA" }
                ]
            ).map((item, i) => (
              <div
                key={item.id || i}
                className="relative h-[320px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl fade-up cursor-pointer bg-slate-900"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => navigate(item.isLive ? `/visa/apply/${item.id}` : '/visa')}
              >
                {/* Background Image with Neutral Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={item.img}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    alt={item.title}
                    onError={(e) => { e.target.src = item.fallbackImg || singaporeVisa; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 group-hover:from-black transition-all duration-500" />
                </div>

                {/* Theme Accent Line */}
                <div className="absolute top-6 left-0 w-1.5 h-12 bg-[#14532d] z-10 transition-all duration-700 group-hover:h-full group-hover:top-0 shadow-[0_0_15px_rgba(20,83,45,0.6)]" />

                {/* Country Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white italic">
                      {item.country}
                    </span>
                  </div>
                </div>

                {/* Floating Content Card */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="relative p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-500 group-hover:translate-y-[-8px] group-hover:bg-black/60 shadow-2xl">
                    <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#14532d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-green-400 font-bold mb-1">{item.category}</p>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none italic">
                          {item.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#14532d] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(20,83,45,0.5)]">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-rows-[1fr] transition-all duration-500">
                      <div className="overflow-hidden">
                        <p className="text-white font-bold text-lg mb-4">
                          Starting at <span className="text-[#14532d] bg-white px-2 py-0.5 rounded-lg">{item.price}</span>
                        </p>
                        <button
                          className="w-full py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-[#14532d] hover:text-white transition-all shadow-xl"
                        >
                          {item.isLive ? "Apply Now" : "Explore Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- VISA DEALS (GALLERY STYLE) ---------------- */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-center fade-up">
          Visa Deals
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Exclusive processing offers for your next trip
        </p>

        <div className="mt-10 max-w-7xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="visa-deals-swiper !pb-12"
          >
            {[
              { img: uzbekistanVisa, country: "Uzbekistan" },
              { img: turkey, country: "Turkey" },
              { img: oman, country: "Oman" },
              { img: moroccoVisa, country: "Morocco" },
              { img: Laos, country: "Laos" },
              { img: Kyrgystan, country: "Kyrgyzstan" },
              { img: Kenya, country: "Kenya" },
              { img: Jordan, country: "Jordan" },
              { img: Indonesia, country: "Indonesia" },
              { img: Ethiopia, country: "Ethiopia" },
              { img: Dubai, country: "United Arab Emirates" },
              { img: cambodia, country: "Cambodia" },
              { img: Bhutan, country: "Bhutan" },
              { img: Bahrain, country: "Bahrain" },
              { img: Azerbaijan, country: "Azerbaijan" },
              { img: Antigua, country: "Antigua & Barbuda" }
            ].map((deal, i) => (
              <SwiperSlide key={i}>
                <div
                  className="relative group overflow-hidden rounded-2xl shadow-xl h-96"
                >
                  <img
                    src={deal.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={`${deal.country} Visa Deal`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-center fade-up">
          Travel Gallery
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Moments captured from our travelers
        </p>

        <div className="mt-10 max-w-7xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="travel-gallery-swiper !pb-12"
          >
            {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8, gallery9, gallery10, gallery11, gallery12, gallery13, gallery14].map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative group overflow-hidden rounded-2xl shadow-xl h-72">
                  <img
                    src={img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={`Travel moment ${i + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic fade-up">
              What Our Travelers Say
            </h2>
            <div className="w-24 h-1.5 bg-[#14532d] mx-auto mt-6 rounded-full fade-up" style={{ animationDelay: "0.1s" }}></div>
            <p className="text-gray-500 mt-6 text-lg font-medium max-w-2xl mx-auto fade-up" style={{ animationDelay: "0.2s" }}>
              Don't just take our word for it—hear from the explorers who've journeyed with us.
            </p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonial-swiper !pb-16"
          >
            {[
              {
                name: "Jeswant Fernandez",
                date: "2 years ago",
                rating: 5,
                text: "One stop place for all your travel/tour package needs. They offer the best price and service. Kudos keep it up Team Goimomi!!",
                initial: "JF",
                color: "bg-blue-600",
                service: "Holiday Packages"
              },
              {
                name: "Suba",
                date: "1 month ago",
                rating: 5,
                text: "We booked our room in Vagamon through Goimomi Holidays, and the service was excellent. The booking process was smooth, quick, and completely hassle-free. They provided clear information, helped us choose the right room, and made sure everything was arranged perfectly before our arrival.",
                initial: "S",
                color: "bg-emerald-600",
                service: "Hotel Booking"
              },
              {
                name: "Sai Varadharajan",
                date: "1 year ago",
                rating: 5,
                text: "We booked Bali Trip via Goimomi Travels and Mr. Ismail was the person whom we contacted. They created a group in Telegram and gave information continuously. The driver in Bali was so helpful and friendly. I strongly recommend them for any International trip.",
                initial: "SV",
                color: "bg-amber-600",
                service: "International Tour"
              },
              {
                name: "Ashwin Retnam",
                date: "3 months ago",
                rating: 5,
                text: "Excellent visa processing service! The Goimomi team helped me obtain my UAE visa in less than 24 hours. The team was extremely professional and communicated clearly on every requirement. Highly recommended for anyone looking to process their visa quickly!",
                initial: "AR",
                color: "bg-violet-600",
                service: "Visa Assistance"
              },
              {
                name: "Imthiyaz Immu",
                date: "9 months ago",
                rating: 5,
                text: "FINISHED 5 days ANDAMAN family trip with help of @goimomi holidays Travel partner. Totally satisfied from day 1 to 5 with best Eternity plans and fares. Sure next my international trip will be with Goimomi only.. Just happiest Experience 😍😍",
                initial: "II",
                color: "bg-rose-600",
                service: "Family Vacation"
              },
              {
                name: "Kalaivani Ganesan",
                date: "5 months ago",
                rating: 5,
                text: "Trip itinerary was well planned, visa clearing process they took good care of it. The hotels were good.. total satisfaction trip with goimomi holidays",
                initial: "KG",
                color: "bg-cyan-600",
                service: "Holiday Planning"
              },
              {
                name: "jinesh n janardhanan",
                date: "a year ago",
                rating: 5,
                text: "Dear Goimomi we would like to express our heartfelt gratitude for the exceptional Dubai tour package. Your expertise and attention to detail made our trip truly unforgettable. Every moment was pure magic from the desert safari to the Burj Khalifa tour.",
                initial: "JJ",
                color: "bg-indigo-600",
                service: "Dubai Tour Package"
              },
              {
                name: "Abdul Hafiz",
                date: "9 months ago",
                rating: 5,
                text: "Best price for visa processing. Beautifully organized and well equipped team. They were in touch till we returned to our home. All the best.",
                initial: "AH",
                color: "bg-teal-600",
                service: "Visa Processing"
              }
            ].map((testimonial, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 flex flex-col h-[310px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${testimonial.color} flex items-center justify-center text-white text-lg font-bold shadow-md transform group-hover:rotate-3 transition-transform`}>
                        {testimonial.initial}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{testimonial.name}</h3>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{testimonial.date}</p>
                      </div>
                    </div>
                    <div className="bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-50 uppercase text-[9px] font-black text-[#14532d] flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                      Review
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, starIdx) => (
                      <svg
                        key={starIdx}
                        className={`w-4 h-4 ${starIdx < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-4 group-hover:text-gray-700 italic">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#14532d]/40 mb-0.5">Service Experience</p>
                      <p className="text-xs font-bold text-[#14532d]">{testimonial.service}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#14532d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>


      {/* ---------------- WHY BOOK THROUGH A TRAVEL AGENT ---------------- */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        {/* Decorative accents */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "50px 50px" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Heading */}
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">Your Trusted Travel Partner Since 2010</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mt-2 mb-4">
              Why Book With A <span className="text-emerald-400">Professional Agent?</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
              In the age of online booking, a professional travel agent delivers something no algorithm can — personalised
              expertise, crisis management, unbeatable rates, and the peace of mind that comes from a human who genuinely
              cares about your journey.
            </p>
          </div>

          {/* Agent advantage grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: <Award className="w-5 h-5" />,
                title: "10+ Years of Expertise",
                desc: "Established in 2010, Goimomi has planned thousands of trips across 80+ destinations. Our deep destination knowledge means your itinerary is built on real experience — not guesswork."
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: "Unbeatable Negotiated Rates",
                desc: "We hold preferred partnerships with airlines, hotel chains, and tour operators — unlocking exclusive fares and room upgrades that are simply unavailable to individual travellers booking online."
              },
              {
                icon: <Headphones className="w-5 h-5" />,
                title: "24 / 7 Human Support",
                desc: "Travel disruptions don't keep office hours. When a flight is cancelled or a hotel overbooks, our dedicated travel desk responds instantly — rebooking and problem-solving in real time."
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: "Flawless Documentation",
                desc: "From visa applications and travel insurance to hotel confirmations and forex — we meticulously manage every document so there are zero surprises at the airport or border."
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "Personalised Itineraries",
                desc: "No two travellers are alike. We study your preferences, budget, travel style, and dietary needs, then craft an itinerary that feels tailor-made — because it is."
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Fully Insured & Compliant",
                desc: "All packages come with optional comprehensive travel insurance. Our operations are IATA-certified and GST-compliant — giving your booking the protection it deserves."
              }
            ].map((item, i) => (
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

          {/* How We Work — 4-step process */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 mb-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black">Our Process</span>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mt-2">
                From Enquiry to <span className="text-emerald-400">Safe Return</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", icon: <PhoneCall className="w-5 h-5" />, title: "Free Consultation", desc: "Tell us your destination, dates, and budget. Our agent crafts a bespoke plan within 24 hours — completely free of charge." },
                { step: "02", icon: <CalendarDays className="w-5 h-5" />, title: "Itinerary Design", desc: "We build a day-by-day itinerary with flights, accommodation, transfers, and activities tailored to your preferences." },
                { step: "03", icon: <CreditCard className="w-5 h-5" />, title: "Secure Booking", desc: "Confirm your package with a simple deposit. We handle all vendor payments, confirmations, and visa applications." },
                { step: "04", icon: <Plane className="w-5 h-5" />, title: "Travel & Beyond", desc: "Travel with confidence. Our 24/7 support desk stays with you from departure to return — handling any change effortlessly." }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-black italic text-white/10">{s.step}</span>
                    <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0">
                      {s.icon}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-white mb-2">{s.title}</h4>
                  <p className="text-slate-400 text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agent stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
            {[
              { value: "15,000+", label: "Happy Travellers" },
              { value: "80+", label: "Destinations Covered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "10+", label: "Years of Excellence" }
            ].map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-4xl font-black italic text-emerald-400 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* 3-column info cards — Goimomi story + flights + domestic */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              {
                title: "About Goimomi Holidays",
                icon: <BadgeCheck className="w-5 h-5" />,
                body: "Established in 2010, Goimomi Holidays has grown into one of India's most trusted travel agencies — renowned for delivering competitive airfares, exclusive holiday packages, and seamless visa processing. We've served thousands of happy travellers across domestic and international routes, backed by a team of passionate, certified travel professionals."
              },
              {
                title: "Flight Booking Expertise",
                icon: <Plane className="w-5 h-5" />,
                body: "Find the best airfares on domestic and international routes — priority class, economy, and everything in between. Our agents compare fares across carriers in real time, apply negotiated corporate rates, and handle group bookings with ease. With a 24/7 helpline and instant confirmations, booking your next flight has never been more reassuring."
              },
              {
                title: "Domestic Travel Specialists",
                icon: <MapPin className="w-5 h-5" />,
                body: "From Kashmir to Kanyakumari, we've curated the finest domestic holiday experiences for Indian travellers. Get the cheapest fare guarantee on domestic flights, instant hotel bookings in 500+ cities, and real-time updates on fare drops, discounts, and refunds. Your perfect India trip is just one call away."
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-700/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold uppercase tracking-tight text-white mb-3">{card.title}</h3>
                <p className="text-slate-400 text-[13px] leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-900 border border-emerald-700/50 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-300 font-black mb-2">Ready to travel?</p>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                Let's Plan Your Next <span className="text-emerald-300">Adventure</span>
              </h3>
              <p className="text-emerald-100/70 text-sm mt-2 max-w-lg">
                Speak to a Goimomi travel expert today — free itinerary planning, best price promise, and zero booking fee.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                id="home-agent-cta-contact"
                onClick={() => navigate('/contactus')}
                className="px-8 py-4 bg-white text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-xl rounded-sm whitespace-nowrap"
              >
                TALK TO AN AGENT
              </button>
              <button
                id="home-agent-cta-holidays"
                onClick={() => navigate('/holidayhome')}
                className="px-8 py-4 bg-transparent border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm whitespace-nowrap"
              >
                VIEW PACKAGES
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;

