import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Globe, TrendingUp, ShieldCheck, Building2, Users, Rocket } from "lucide-react";
import usePageSEO from "../hooks/usePageSEO";

// Assets
import bizHero from "../assets/Business/biz1.jpeg";
import bizCardImg from "../assets/Business/biz3.jpeg";
import cantonCardImg from "../assets/images/canton-hero.png";

const BusinessHome = () => {
  const navigate = useNavigate();
  usePageSEO(
    "Elevate Your Business Travel – Goimomi Business",
    "Tailored corporate travel solutions, Canton Fair registration, and international business sourcing trips with Goimomi Holidays."
  );

  const businessCategories = [
    {
      id: "corporate-travel",
      title: "Business Travel",
      subtitle: "Corporate Excellence",
      description: "Seamless travel solutions for modern enterprises. From flights to logistics, we manage it all.",
      image: bizCardImg,
      path: "/holidays?category=Business Travel",
      color: "from-[#14532d]/20 to-emerald-600/20",
      icon: <Briefcase className="w-6 h-6" />,
      tag: "Enterprise"
    },
    {
      id: "canton-fair",
      title: "Canton Fair",
      subtitle: "Global Sourcing",
      description: "Direct manufacturer networking in Guangzhou. The world's largest trade fair, simplified for you.",
      image: cantonCardImg,
      path: "/canton",
      color: "from-red-600/20 to-orange-600/20",
      icon: <Building2 className="w-6 h-6" />,
      tag: "Most Popular"
    }
  ];

  const scrollToCategories = () => {
    const element = document.getElementById('business-segments');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 selection:bg-[#14532d]/30">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-slate-900 group">
        <div className="absolute inset-0">
          <img 
            src={bizHero} 
            alt="Corporate Travel Hero" 
            className="w-full h-full object-cover transition-transform duration-[6000ms] scale-110 group-hover:scale-100 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center px-6 md:px-20 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left max-w-2xl"
          >
            <div className="flex items-center gap-3 text-emerald-400 mb-6">
              <div className="w-12 h-[2px] bg-[#14532d]" />
              <span className="text-[12px] md:text-sm uppercase tracking-[0.5em] font-black">Strategic Business Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-6">
              PRECISION<br />
              <span className="text-white/30 group-hover:text-emerald-500 transition-colors duration-700">BUSINESS</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-lg mb-10 max-w-lg font-medium leading-relaxed">
              Empowering Indian enterprises with world-class logistics, direct sourcing access, and seamless corporate mobility.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToCategories}
                className="px-8 py-4 bg-[#14532d] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#14532d] transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_20px_50px_rgba(20,83,45,0.3)] flex items-center gap-2 rounded-sm"
              >
                DISCOVER SOLUTIONS
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/contactus')}
                className="px-8 py-4 bg-transparent border border-white/30 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm"
              >
                TALK TO EXPERTS
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute bottom-12 right-20 hidden lg:flex gap-8 z-20">
          <div className="text-white">
            <p className="text-3xl font-black italic tracking-tighter">500+</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Corporates Served</p>
          </div>
          <div className="w-[1px] h-12 bg-white/10" />
          <div className="text-white">
            <p className="text-3xl font-black italic tracking-tighter">100X</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">ROI Focused</p>
          </div>
        </div>
      </section>

      {/* ---------------- SEGMENTS SECTION ---------------- */}
      <section id="business-segments" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#14532d] font-black mb-3">Strategic Portfolios</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532d] to-emerald-500">Mobility</span> & Sourcing
            </h3>
            <p className="max-w-xl text-slate-500 text-sm font-medium leading-relaxed">
              We specialize in bridging the gap between Indian ambition and global manufacturing powerhouses, providing end-to-end support for your business growth.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {businessCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-100"
              onClick={() => navigate(cat.path)}
            >
              <div className="grid md:grid-cols-2 h-full">
                {/* Image Side */}
                <div className="relative h-64 md:h-full overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
                  
                  {/* Tag */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#14532d]">{cat.tag}</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-10 flex flex-col justify-center bg-white relative">
                  <div className={`p-4 rounded-2xl bg-slate-50 w-fit mb-6 text-[#14532d] group-hover:bg-[#14532d] group-hover:text-white transition-colors duration-500`}>
                    {cat.icon}
                  </div>
                  
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{cat.subtitle}</h4>
                  <h5 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4 group-hover:text-[#14532d] transition-colors">
                    {cat.title}
                  </h5>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-4 group/btn">
                    <span className="text-slate-900 text-[10px] font-black uppercase tracking-[0.2em]">Check & Apply</span>
                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-[#14532d] group-hover:border-[#14532d] group-hover:text-white transition-all transform group-hover:translate-x-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#14532d]/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <TrendingUp />, label: "Strategic Growth", desc: "ROI driven travel planning" },
              { icon: <Globe />, label: "Global Reach", desc: "Access to 150+ countries" },
              { icon: <ShieldCheck />, label: "Total Security", desc: "Corporate grade insurance" },
              { icon: <Rocket />, label: "Fast Processing", desc: "Rapid visa & logistics" }
            ].map((feature, i) => (
              <div key={i} className="space-y-3 group">
                <div className="text-[#14532d] mb-4 transform group-hover:scale-110 group-hover:text-white transition-all duration-300">
                  {React.cloneElement(feature.icon, { size: 28 })}
                </div>
                <h6 className="text-base font-bold uppercase tracking-tighter italic">{feature.label}</h6>
                <p className="text-slate-400 text-[10px] font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA SECTION ---------------- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-gradient-to-br from-[#14532d] to-[#0f3b20] p-10 md:p-14 relative overflow-hidden text-center shadow-[0_50px_100px_rgba(20,83,45,0.2)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10"
            >
                <div className="inline-block px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-emerald-200 text-[9px] font-black uppercase tracking-widest mb-6">
                    Partners in Your Success
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 leading-[0.9]">
                    Ready to Scale Your <br />
                    <span className="text-emerald-400">Business Nationally?</span>
                </h2>
                <p className="text-emerald-100/70 max-w-lg mx-auto mb-10 text-xs md:text-sm font-medium leading-relaxed">
                    Join hundreds of Indian entrepreneurs who have optimized their sourcing and travel costs with Goimomi.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate('/contactus')}
                        className="w-full sm:w-56 px-8 py-4 bg-white text-[#14532d] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-2xl rounded-sm"
                    >
                        CONSULT AN EXPERT
                    </button>
                    <button 
                        onClick={() => navigate('/holidays?category=Business Travel')}
                        className="w-full sm:w-56 px-8 py-4 bg-transparent border-2 border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-sm"
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
