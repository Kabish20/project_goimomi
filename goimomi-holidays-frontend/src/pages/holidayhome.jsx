import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, MapPin, Compass, Globe, Star, Users, Briefcase } from "lucide-react";
import usePageSEO from "../hooks/usePageSEO";

// Assets
import leisure1 from "../assets/Hero/leisure1.jpeg";
import leisure2 from "../assets/Hero/leisure2.jpeg";
import leisure3 from "../assets/Hero/leisure3.jpeg";
import leisure4 from "../assets/Hero/leisure4.jpeg";
import leisure5 from "../assets/Hero/leisure5.jpeg";
import holidayHero from "../assets/Hero/holiday_home_hero.jpeg";
import umrahImg from "../assets/umrah.png";
import umrahImg2 from "../assets/umrah2.png";
import cusHolidays from "../assets/cusholidays.png";

const HolidayHome = () => {
  const navigate = useNavigate();
  usePageSEO(
    "Plan Your Perfect Holiday – Goimomi Holidays",
    "Discover amazing domestic and international holiday packages, customized tours, European adventures, and specialized Umrah packages with Goimomi Holidays."
  );

  const categories = [
    {
      id: "domestic",
      title: "Domestic",
      subtitle: "Explore India's Beauty",
      image: leisure1,
      path: "/holidays?category=Domestic",
      color: "from-orange-500/20 to-orange-600/20",
      icon: <MapPin className="w-5 h-5" />,
      tag: "Best Value"
    },
    {
      id: "international",
      title: "International",
      subtitle: "Global Destinations",
      image: leisure3,
      path: "/holidays?category=International",
      color: "from-blue-500/20 to-blue-600/20",
      icon: <Globe className="w-5 h-5" />,
      tag: "Popular"
    },
    {
      id: "customized",
      title: "Customized Holidays",
      subtitle: "Tailored Experiences",
      image: cusHolidays,
      path: "/customizedHolidays",
      color: "from-purple-500/20 to-purple-600/20",
      icon: <Compass className="w-5 h-5" />,
      tag: "Signature"
    },
    {
      id: "european",
      title: "European Tour",
      subtitle: "The Heart of Europe",
      image: leisure4,
      path: "/Europeantours",
      color: "from-emerald-500/20 to-emerald-600/20",
      icon: <Star className="w-5 h-5" />,
      tag: "Premium"
    },
    {
      id: "umrah",
      title: "Umrah",
      subtitle: "Sacred Pilgrimage",
      image: umrahImg,
      path: "/umrah-package",
      color: "from-amber-500/20 to-amber-600/20",
      icon: <Users className="w-5 h-5" />,
      tag: "Devotional"
    },
    {
      id: "customized-umrah",
      title: "Customized Umrah",
      subtitle: "Personalized Spiritual Journey",
      image: umrahImg2,
      path: "/customizedumrah",
      color: "from-yellow-500/20 to-yellow-600/20",
      icon: <Briefcase className="w-5 h-5" />,
      tag: "Bespoke"
    }
  ];

  const scrollToCategories = () => {
    const element = document.getElementById('holiday-categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 selection:bg-[#14532d]/30">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative w-full h-[400px] md:h-[450px] overflow-hidden bg-black group">
        <div className="absolute inset-0">
          <img 
            src={holidayHero} 
            alt="Hero Background" 
            className="w-full h-full object-cover transition-transform duration-[4000ms] scale-110 group-hover:scale-100 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        {/* Brand/Nav Placeholder Logic from Image */}
        <div className="absolute top-10 left-10 z-20 md:block hidden">
            <button 
                onClick={scrollToCategories}
                className="px-10 py-5 bg-white text-[#14532d] text-xs font-black uppercase tracking-[0.3em] hover:bg-[#14532d] hover:text-white transition-all shadow-2xl"
            >
                PLAN A HOLIDAY
            </button>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-end px-6 md:px-20 z-10">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-right max-w-2xl"
          >
            <div className="flex items-center justify-end gap-3 text-white/90 mb-4">
              <span className="text-[12px] md:text-sm uppercase tracking-[0.5em] font-bold text-white">Curated Global Holidays</span>
              <div className="w-12 h-[1px] bg-white/60" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-6">
              LEISURE<br />
              <span className="text-white/40 group-hover:text-[#22c55e] transition-colors duration-700">TRAVEL</span>
            </h1>

            <div className="flex justify-end gap-3">
              <button 
                onClick={scrollToCategories}
                className="px-6 py-3.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#14532d] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2"
              >
                PLAN A HOLIDAY
                <ArrowRight className="w-3 h-3" />
              </button>



            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/10 via-white to-transparent" />
        </div>
      </section>

      {/* ---------------- CATEGORIES SECTION ---------------- */}
      <section id="holiday-categories" className="py-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h2 className="text-[9px] uppercase tracking-[0.4em] text-[#14532d] font-black mb-1.5">Our Collections</h2>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532d] to-emerald-500">Adventure</span>
              </h3>
            </div>
            <p className="max-w-md text-slate-500 text-sm font-medium leading-relaxed">
              From the serene backwaters of Kerala to the bustling streets of Paris, we curate experiences that linger in your memory forever.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative aspect-[4/4] rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-xl bg-slate-900"
              onClick={() => navigate(cat.path)}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
              </div>

              {/* Tag */}
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{cat.tag}</span>
                </div>
              </div>

              {/* Icon Overlay (Subtle) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 z-20">
                <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-white/90">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{cat.subtitle}</span>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                  {cat.title}
                </h4>

                <div className="h-[2px] w-12 bg-white/30 group-hover:w-full transition-all duration-700 ease-out" />
                
                <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Explore Journey</span>
                  <div className="w-10 h-10 rounded-full bg-white text-[#14532d] flex items-center justify-center shadow-lg transition-transform group-hover:rotate-[-45deg]">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Border Accent */}
              <div className="absolute inset-4 border border-white/5 rounded-[2rem] pointer-events-none group-hover:border-white/20 transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA SECTION ---------------- */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-[#14532d] p-8 md:p-12 relative overflow-hidden text-center">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/20 rounded-full blur-3xl -ml-16 -mb-16" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight">
                    Every Journey Tells A <br />
                    <span className="text-emerald-400">Different Story.</span>
                </h2>
                <p className="text-white/70 max-w-lg mx-auto mb-6 text-[10px] md:text-xs font-medium leading-relaxed">
                    Ready to start yours? Let our travel experts craft the perfect itinerary for your next getaway.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button 
                        onClick={() => navigate('/contactus')}
                        className="w-full sm:w-48 px-6 py-3.5 bg-white text-[#14532d] text-[10px] font-black uppercase tracking-[0.1em] hover:bg-emerald-50 transition-all shadow-xl rounded-lg"
                    >
                        TALK TO EXPERTS
                    </button>
                    <button 
                        onClick={() => navigate('/customizedHolidays')}
                        className="w-full sm:w-48 px-6 py-3.5 bg-transparent border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.1em] hover:bg-white/10 transition-all rounded-lg"
                    >
                        CUSTOMIZE TRIP
                    </button>



                </div>
            </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HolidayHome;
