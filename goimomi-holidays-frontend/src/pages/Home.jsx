import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { MapPin, Zap, ShieldCheck, Headphones } from "lucide-react";
import usePageSEO from "../hooks/usePageSEO";
import { getImageUrl } from "../utils/imageUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";

import biz1 from "../assets/Business/biz1.jpeg";
import biz2 from "../assets/Business/biz2.jpeg";
import biz3 from "../assets/Business/biz3.jpeg";
import biz4 from "../assets/Business/biz4.jpeg";
import biz5 from "../assets/Business/biz5.jpeg";

const businessImages = [biz1, biz2, biz3, biz4, biz5];

import leisure1 from "../assets/Hero/leisure1.jpeg";
import leisure2 from "../assets/Hero/leisure2.jpeg";
import leisure3 from "../assets/Hero/leisure3.jpeg";
import leisure4 from "../assets/Hero/leisure4.jpeg";
import leisure5 from "../assets/Hero/leisure5.jpeg";

// POPULAR DESTINATIONS
import maldives from "../assets/PopularDestinations/maldives.png";
import dubai from "../assets/PopularDestinations/dubaiSafari.png";
import singapore from "../assets/PopularDestinations/singapore.png";
import paris from "../assets/PopularDestinations/paris.png";
import santorini from "../assets/PopularDestinations/santorini.png";
import bali from "../assets/PopularDestinations/bali.png";

// SPECIAL OFFERS
import dubaiOffer from "../assets/Specialoffers/dubai.png";
import keralaOffer from "../assets/Specialoffers/keralaBackwaters.png";
import europeOffer from "../assets/Specialoffers/venice.png";
import thailandOffer from "../assets/Specialoffers/thailand.png";
import switzerlandOffer from "../assets/Specialoffers/switzerland.png";
import maldivesOffer from "../assets/Specialoffers/maldivesOffer.png";

// GALLERY
import gallery1 from "../assets/TravelGallery/client1.jpeg";
import gallery2 from "../assets/TravelGallery/client2.jpeg";
import gallery3 from "../assets/TravelGallery/client3.jpeg";
import gallery4 from "../assets/TravelGallery/client4.jpeg";
import gallery5 from "../assets/TravelGallery/client5.jpeg";
import gallery6 from "../assets/TravelGallery/client6.jpeg";
import gallery7 from "../assets/TravelGallery/client7.jpeg";
import gallery8 from "../assets/TravelGallery/client8.jpeg";
import gallery9 from "../assets/TravelGallery/client9.jpeg";
import gallery10 from "../assets/TravelGallery/client10.webp";
import gallery11 from "../assets/TravelGallery/client11.webp";
import gallery12 from "../assets/TravelGallery/client12.webp";
import gallery13 from "../assets/TravelGallery/client13.jpeg";
import gallery14 from "../assets/TravelGallery/client14.jpeg";

// VISAS
import dubaiVisa from "../assets/Visa/dubai.png";
import singaporeVisa from "../assets/Visa/singapore.png";
import saudiVisa from "../assets/Visa/saudi.png";
import azerbaijanVisa from "../assets/Visa/azerbaijan.png";
import vietnamVisa from "../assets/Visa/vietnam.png";

// VISA DEALS 
import uzbekistanVisa from "../assets/Visa Deals/Uzbekistan.png";
import turkey from "../assets/Visa Deals/Turkey.png";
import oman from "../assets/Visa Deals/Oman.png";
import moroccoVisa from "../assets/Visa Deals/Morocco.png";
import Laos from "../assets/Visa Deals/Laos.png";
import Kyrgystan from "../assets/Visa Deals/Kyrgystan.png";
import Kenya from "../assets/Visa Deals/Kenya.png";
import Jordan from "../assets/Visa Deals/Jordan.png";
import Indonesia from "../assets/Visa Deals/Indonesia.png";
import Ethiopia from "../assets/Visa Deals/Ethiopia.png";
import Dubai from "../assets/Visa Deals/Dubai.png";
import cambodia from "../assets/Visa Deals/cambodia.png";
import Bhutan from "../assets/Visa Deals/Bhutan.png";
import Bahrain from "../assets/Visa Deals/Bahrain.png";
import Azerbaijan from "../assets/Visa Deals/Azerbaijan.png";
import Antigua from "../assets/Visa Deals/Antigua & Barbuda.png";

// WhatsApp Chat Widget Component
const WhatsAppWidget = ({ isOpen, onClose }) => {
  const widgetRef = useRef(null);
  const phoneNumber = '916382220393';
  const defaultMessage = 'Hello! I have a question about your services.';

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        // Check if the click is not on the WhatsApp button
        const whatsappButton = document.querySelector('.whatsapp-button');
        if (whatsappButton && !whatsappButton.contains(event.target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-24 right-8 w-80 bg-white rounded-t-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
    >
      {/* Header */}
      <div className="bg-green-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.92-3.558 7.94-7.93A7.898 7.898 0 0 0 13.6 2.326z" />
          </svg>
          <span className="font-semibold">WhatsApp Chat</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>

      {/* Chat Content */}
      <div className="p-4 bg-gray-50 h-64 overflow-y-auto">
        <div className="mb-4">
          <div className="bg-green-100 rounded-lg p-3 inline-block max-w-xs">
            <p className="text-sm">Hello! How can we help you today?</p>
            <p className="text-xs text-gray-500 mt-1">Goimomi Holidays Support</p>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 my-2">--- Start of conversation ---</p>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Type a message..."
            value={defaultMessage}
            readOnly
          />
          <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r-lg"
            aria-label="Send message on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l5-14zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Click the send button to open WhatsApp</p>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  usePageSEO(
    "Goimomi Holidays – Customized Holiday Packages & Travel Experiences",
    "Goimomi Holidays offers customized vacation packages, family trips, honeymoon tours, adventure travel, and premium holiday planning tailored to your preferences."
  );
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [popularVisas, setPopularVisas] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
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
        const destRes = await api.get("/api/destinations/?is_popular=true");
        setPopularDestinations(destRes.data);
        setLoadingDestinations(false);

        const visaRes = await api.get("/api/visas/?is_popular=true");
        setPopularVisas(visaRes.data);
        setLoadingVisas(false);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setLoadingDestinations(false);
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
      <section className="relative py-16 px-6 overflow-hidden bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#14532d] font-black mb-1">Dual Expertise</h2>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Choose Your Journey</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto overflow-hidden">

            {/* Business Block */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 md:p-8 group hover:bg-[#14532d] transition-all duration-500 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden cursor-pointer"
              onClick={() => navigate('/businesshome')}
            >
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest z-20">
                Trending
              </div>
              <div className="mb-4 p-3.5 bg-slate-50 rounded-xl w-fit group-hover:bg-white/10 transition-colors">
                <span className="text-3xl">💼</span>
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-white">Business Travel</h4>
              <p className="text-slate-500 mb-4 text-[13px] leading-snug group-hover:text-white/80 line-clamp-2">
                Optimized itineraries for corporate efficiency and seamless professional logistics.
              </p>
              <div className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest text-[9px] group-hover:text-white cursor-pointer">
                <span>[ Explore Business ]</span>
                <div className="w-8 h-[1.5px] bg-slate-900 group-hover:bg-white transition-all group-hover:w-12" />
              </div>
            </motion.div>

            {/* Leisure Block */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 md:p-8 group hover:bg-[#14532d] transition-all duration-500 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden"
              onClick={() => navigate('/holidayhome')}

            >
              <div className="absolute top-4 right-4 bg-green-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest z-20">
                Popular
              </div>
              <div className="mb-4 p-3.5 bg-slate-50 rounded-xl w-fit group-hover:bg-white/10 transition-colors">
                <span className="text-3xl">🌴</span>
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-white">Leisure Travel</h4>
              <p className="text-slate-500 mb-4 text-[13px] leading-snug group-hover:text-white/80 line-clamp-2">
                Curated global holidays that rejuvenate the soul with luxury retreats and hidden gems.
              </p>
              <div className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest text-[9px] group-hover:text-white cursor-pointer">
                <span>[ Explore Holidays ]</span>
                <div className="w-8 h-[1.5px] bg-slate-900 group-hover:bg-white transition-all group-hover:w-12" />
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
        ) : Array.isArray(popularVisas) && popularVisas.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {popularVisas.map((item, i) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border fade-up zoom-hover group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={getImageUrl(item.card_image) || singaporeVisa}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={item.title}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[#14532d]">{item.country}</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-black text-gray-800 tracking-tight">{item.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-green-50 text-[#14532d] rounded-full font-bold uppercase tracking-tighter ring-1 ring-[#14532d]/20">
                      {item.visa_type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold uppercase tracking-tighter ring-1 ring-blue-700/20">
                      {item.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starting from</p>
                      <p className="text-2xl font-black text-[#14532d]">₹{Number(item.selling_price || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <Link
                      to={`/visa/apply/${item.id}`}
                      className="bg-[#14532d] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#0f4a24] transition-all transform active:scale-95 shadow-lg shadow-green-900/20"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[
              { img: dubaiVisa, title: "Dubai Visa", price: "₹8,500", country: "United Arab Emirates", category: "PRIORITY" },
              { img: saudiVisa, title: "Saudi Arabia Visa", price: "₹6,500", country: "Saudi Arabia", category: "FAST-TRACK" },
              { img: azerbaijanVisa, title: "Azerbaijan Visa", price: "₹4,500", country: "Azerbaijan", category: "E-VISA" },
              { img: thailandOffer, title: "Thailand Visa", price: "₹3,200", country: "Thailand", category: "E-VISA" },
              { img: singaporeVisa, title: "Singapore Visa", price: "₹2,800", country: "Singapore", category: "E-VISA" },
              { img: vietnamVisa, title: "Vietnam Visa", price: "₹3,500", country: "Vietnam", category: "E-VISA" }
            ].map((item, i) => (
              <div
                key={i}
                className="relative h-[320px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl fade-up cursor-pointer bg-slate-900"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => navigate('/visa')}
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

                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500">
                      <div className="overflow-hidden">
                        <p className="text-white font-bold text-lg mb-4">
                          Starting at <span className="text-[#14532d] bg-white px-2 py-0.5 rounded-lg">{item.price}</span>
                        </p>
                        <button
                          className="w-full py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-[#14532d] hover:text-white transition-all shadow-xl"
                        >
                          Apply Now
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


      {/* ---------------- WHY CHOOSE US SECTION ---------------- */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Why Goimomi Holidays */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Why Goimomi Holidays?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Established in 2010, Goimomi Holidays has since positioned itself as one of the leading companies,
              providing great offers, competitive airfares, exclusive discounts, and a seamless online booking
              experience to many of its customers. The experience of booking your flight tickets, hotel stay, and
              holiday package with complete ease and no hassles at all. We also deliver amazing offers, such as
              Instant Discounts, Fare Calendar, MyRewardsProgram, MyWallet, and many more while booking your
              flight tickets online to make the experience better and better for our customers.
            </p>
          </div>

          {/* Booking Flights with Goimomi Holidays */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Booking Flights with Goimomi Holidays</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              At Goimomi Holidays, you can find the best of deals and cheap air tickets to any place you want by
              booking in just a few simple clicks. Just use our deals and you will surely find great discounts
              on your flight tickets. Goimomi Holidays helps you book flight tickets that are affordable and customized
              to your convenience. With customer satisfaction being our ultimate goal, we also have a 24/7
              dedicated helpline to cater to our customer's queries and concerns. Serving over 5 million happy
              customers and counting, we also have a 24/7 dedicated helpline who need a quick and easy means
              to find air tickets. You can get a hold of the cheapest flight of your choice today while also
              enjoying the other available options for your travel needs with us.
            </p>
          </div>

          {/* Domestic Flights with Goimomi Holidays */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Domestic Flights with Goimomi Holidays</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Goimomi Holidays is India's leading player for flight bookings. With the cheapest fare guarantee,
              experience great value at the lowest price. Instant notifications ensure current flight status,
              instant fare drops, amazing discounts, instant refunds and rebook options, price comparisons and
              many more interesting features.
            </p>
          </div>

        </div>
      </section>


      {/* WhatsApp Widget */}
      <WhatsAppWidget
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
        className="whatsapp-button fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        aria-label="Open WhatsApp chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.92-3.558 7.94-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.608-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.944-.044-.079-.163-.124-.344-.223z" />
        </svg>
      </button>
    </div >
  );
};

export default Home;