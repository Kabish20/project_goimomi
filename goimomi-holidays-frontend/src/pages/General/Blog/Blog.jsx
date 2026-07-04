import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, Clock, Calendar, ArrowRight, User, Globe, MapPin,
  ChevronRight, Sparkles, X, Send, ShieldAlert, BadgeCheck, FileText, CheckCircle, Info, HelpCircle
} from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import { blogCategories, blogPosts } from "./blogData";
import blogHeroBanner from "../../../assets/images/blog_hero_banner.png";

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  usePageSEO(
    "Goimomi Holidays Blog - Travel Guides, Visa Information & Pilgrimage Tips",
    "Discover expert travel guides for India and international destinations, visa eligibility & checklist guides, Hajj & Umrah tips, cheap flight hacks, and outstation taxi routes."
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeVisaTab, setActiveVisaTab] = useState("eligibility");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPost]);

  // Handle closing modal and cleaning searchParams
  const handleClosePost = () => {
    setSelectedPost(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("post");
    setSearchParams(newParams);
  };

  // Auto-open post if "post" query param is present
  useEffect(() => {
    const postSlug = searchParams.get("post");
    if (postSlug) {
      const post = blogPosts.find((p) => p.slug === postSlug);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [searchParams]);

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = categoryParam === "all" || post.category === categoryParam;
    const matchesSearch =
      (post.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  const handleCategorySelect = (categoryId) => {
    setSearchParams(categoryId === "all" ? {} : { category: categoryId });
  };

  // Render markdown-like sections in blog content
  const renderFormattedContent = (content) => {
    if (!content) return null;
    return content.split("\n\n").map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#14532d] rounded-full inline-block"></span>
            {trimmed.replace("###", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        return (
          <ul key={index} className="list-disc pl-6 space-y-2 text-slate-600 my-3">
            {trimmed.split("\n").map((item, idx) => (
              <li key={idx}>{item.replace(/^[*-\s]+/, "").trim()}</li>
            ))}
          </ul>
        );
      }
      if (trimmed.startsWith(">")) {
        return (
          <blockquote key={index} className="border-l-4 border-[#e9b343] bg-amber-50/50 p-4 rounded-r-xl italic text-slate-700 font-medium my-4">
            {trimmed.replace(">", "").trim()}
          </blockquote>
        );
      }
      return (
        <p key={index} className="text-slate-600 leading-relaxed text-base my-3">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* ─── HERO SECTION WITH CUSTOM HERO BANNER ────────────────────────── */}
      <section 
        className="relative overflow-hidden text-white py-24 px-6 bg-slate-900"
        style={{
          backgroundImage: `url(${blogHeroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Visual Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14532d]/95 via-[#165c32]/90 to-[#0f3d21]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Sparkles size={14} className="text-[#e9b343]" />
            Goimomi Knowledge Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Explore the World, <span className="text-[#e9b343]">One Blog</span> at a Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/85 max-w-2xl mx-auto mt-4 text-base md:text-lg font-medium shadow-sm"
          >
            Get verified guides, visa processes, flight deals, and Hajj & Umrah updates curated by our global travel experts.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mx-auto mt-8 relative"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14532d]" size={20} />
              <input
                type="text"
                placeholder="Search topics, destinations, visa guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 border border-transparent pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#e9b343]/30 focus:border-[#e9b343] shadow-2xl text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY FILTERS ───────────────────────────────────────────── */}
      <section className="py-8 px-6 bg-white border-b border-slate-100 shadow-sm sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto overflow-x-auto custom-scrollbar flex gap-3 pb-2 scroll-smooth">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              categoryParam === "all"
                ? "bg-[#14532d] text-white shadow-md shadow-green-950/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🌟 All Guides
          </button>
          {blogCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 ${
                categoryParam === cat.id
                  ? "bg-[#14532d] text-white shadow-md shadow-green-950/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>
      </section>

      {/* ─── MAIN CONTENT LAYOUT ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        
        {/* Left/Middle Column (Posts list) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Featured Post (Only show on 'all' and if no query) */}
          {categoryParam === "all" && !searchQuery && featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="md:flex h-full">
                <div className="md:w-1/2 relative min-h-[250px] md:min-h-full overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#e9b343] text-[#14532d] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                    Featured
                  </div>
                </div>
                <div className="p-8 md:w-1/2 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#14532d] bg-green-50 px-2.5 py-1 rounded-md">
                      {blogCategories.find((c) => c.id === featuredPost.category)?.title}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-[#14532d] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-500 text-sm line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-xs font-bold text-[#14532d]">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{featuredPost.author}</p>
                        <p className="text-[10px] text-slate-400">{featuredPost.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPost(featuredPost)}
                      className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#14532d] hover:text-[#e9b343] transition-colors"
                    >
                      Read Post <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts Grid */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen size={18} className="text-[#14532d]" />
              {categoryParam === "all" ? "Latest Articles" : `${blogCategories.find((c) => c.id === categoryParam)?.title}`}
              <span className="text-xs font-bold text-[#14532d] bg-green-50 px-2 py-0.5 rounded-full ml-1">
                {filteredPosts.length}
              </span>
            </h3>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-inner">
                <Info size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No articles found matching your query.</p>
                <button
                  onClick={() => { setSearchQuery(""); handleCategorySelect("all"); }}
                  className="mt-4 bg-[#14532d] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:scale-102 transition-transform"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map((post, index) => {
                  const cat = blogCategories.find((c) => c.id === post.category);
                  return (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div>
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className={`absolute bottom-3 left-3 bg-gradient-to-r ${cat?.gradient} text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md`}>
                            {cat?.title}
                          </span>
                        </div>
                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-[#14532d] transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                      <div className="px-6 pb-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                          <User size={12} className="text-[#14532d]" /> By {post.author}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#14532d] group-hover:text-[#e9b343] flex items-center gap-0.5 transition-colors">
                          Read <ChevronRight size={14} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Categories list, popular post, quick enquiry) */}
        <div className="space-y-8">
          
          {/* Guides Categories List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 pb-2 border-b">
              Guides Categories
            </h4>
            <div className="space-y-2">
              {blogCategories.map((c) => {
                const count = blogPosts.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      categoryParam === c.id
                        ? "bg-green-50 text-[#14532d] border border-green-100"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{c.icon}</span>
                      {c.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Call to Action */}
          <div className="bg-gradient-to-br from-[#14532d] to-green-900 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8"></div>
            <h4 className="text-lg font-black uppercase tracking-tight mb-2">Tailored Trip Planning</h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Our travel specialists will build the perfect custom itinerary based on your preferences.
            </p>
            <Link
              to="/customizedHolidays"
              className="inline-block w-full bg-[#e9b343] text-[#14532d] text-[10px] font-black uppercase tracking-wider py-3 rounded-full hover:bg-yellow-400 transition-colors shadow-md"
            >
              Request Custom Itinerary
            </Link>
          </div>

          {/* Popular Reads Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 pb-2 border-b">
              Trending Articles
            </h4>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <div 
                  key={post.slug}
                  onClick={() => setSelectedPost(post)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-14 h-14 object-cover rounded-xl shrink-0 group-hover:opacity-85 transition-opacity"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#14532d] transition-colors leading-tight">
                      {post.title}
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-1 font-semibold uppercase">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── FULL-SCREEN ARTICLE READER VIEW (MODAL OVERLAY) ─────────────── */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] px-4 py-8 flex justify-center items-center"
            onClick={handleClosePost}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden text-slate-800 relative cursor-default flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Back/Close Button (Always visible on top of modal contents) */}
              <button
                onClick={handleClosePost}
                className="absolute top-6 right-6 z-50 bg-black/45 hover:bg-black/65 text-white p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-md"
              >
                <X size={20} />
              </button>

              {/* Scrollable Modal Content Wrapper */}
              <div 
                id="modal-scroll-container" 
                className="overflow-y-auto flex-1 custom-scrollbar"
              >
                {/* Cover Image & Header Banner */}
                <div className="relative h-[250px] md:h-[380px] bg-slate-800">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Cover Text */}
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#e9b343] bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-full backdrop-blur-md">
                    {blogCategories.find((c) => c.id === selectedPost.category)?.title}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight leading-tight max-w-3xl">
                    {selectedPost.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs text-white/80 font-semibold uppercase tracking-wider pt-2">
                    <span className="flex items-center gap-1"><User size={14} className="text-[#e9b343]" /> By {selectedPost.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {selectedPost.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {selectedPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Main Body */}
              <div className="p-8 md:p-12">
                {selectedPost.isVisaGuide && selectedPost.visaDetails ? (
                  // ─── VISA CENTRE DETAIL INTERACTIVE VIEWER ────────────────────
                  <div className="space-y-8">
                    {/* Visa Quick Info */}
                    <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <Globe size={24} className="text-[#059669] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#059669]">Destination Country</p>
                          <p className="text-base font-bold text-slate-800">{selectedPost.title.replace("Tourist Visa Guide: How to Apply from India", "").replace("Tourist Visa from India: Eligibility, Documents & Fees", "").trim()}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Clock size={24} className="text-[#059669] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#059669]">Processing Time</p>
                          <p className="text-sm font-bold text-slate-800">{selectedPost.visaDetails.processingTime.split("(")[0].trim()}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <ShieldAlert size={24} className="text-[#059669] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#059669]">Application Mode</p>
                          <p className="text-sm font-bold text-slate-800">E-Visa / Online Submission</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-base italic border-l-4 border-emerald-500 pl-4">
                      {selectedPost.excerpt}
                    </p>

                    {/* Visa Tabs */}
                    <div className="border-b border-slate-100 flex overflow-x-auto custom-scrollbar gap-2 pb-1">
                      {[
                        { id: "eligibility", label: "Eligibility", icon: <User size={14} /> },
                        { id: "documents", label: "Documents", icon: <FileText size={14} /> },
                        { id: "fees", label: "Visa Fees", icon: <BadgeCheck size={14} /> },
                        { id: "process", label: "Process Steps", icon: <CheckCircle size={14} /> },
                        { id: "rejections", label: "Rejections", icon: <ShieldAlert size={14} /> },
                        { id: "faqs", label: "FAQs", icon: <HelpCircle size={14} /> },
                        { id: "tips", label: "Expert Tips", icon: <Sparkles size={14} /> }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveVisaTab(tab.id)}
                          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
                            activeVisaTab === tab.id
                              ? "border-b-2 border-[#14532d] text-[#14532d] bg-green-50/50 font-black"
                              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Visa Tab Content */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-h-[200px]">
                      {activeVisaTab === "eligibility" && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Who Can Apply?</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{selectedPost.visaDetails.eligibility}</p>
                        </div>
                      )}

                      {activeVisaTab === "documents" && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Required Documents Checklist</h4>
                          <ul className="space-y-2.5">
                            {selectedPost.visaDetails.documents.map((doc, idx) => (
                              <li key={idx} className="text-slate-600 text-sm flex items-start gap-2.5">
                                <span className="text-[#059669] shrink-0 mt-0.5">✔</span>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeVisaTab === "fees" && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Visa Fees & Service Charges</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{selectedPost.visaDetails.fees}</p>
                          <div className="p-3.5 bg-amber-50 text-amber-800 text-[11px] font-semibold rounded-xl border border-amber-100 leading-relaxed">
                            💡 Note: Visa fees are non-refundable and subject to exchange rate variations. High Commissions might update official fees without notice.
                          </div>
                        </div>
                      )}

                      {activeVisaTab === "process" && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Step-by-Step Application Process</h4>
                          <div className="space-y-4">
                            {selectedPost.visaDetails.process.map((step, idx) => (
                              <div key={idx} className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#14532d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                  {idx + 1}
                                </span>
                                <p className="text-slate-600 text-sm pt-0.5 leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeVisaTab === "rejections" && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-red-600">Common Reasons for Rejection</h4>
                          <ul className="space-y-2.5">
                            {selectedPost.visaDetails.rejections.map((rej, idx) => (
                              <li key={idx} className="text-slate-600 text-sm flex items-start gap-2.5">
                                <span className="text-red-500 shrink-0 mt-0.5">✖</span>
                                <span>{rej}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeVisaTab === "faqs" && (
                        <div className="space-y-5">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Frequently Asked Questions</h4>
                          {selectedPost.visaDetails.faqs.map((faq, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="font-bold text-slate-800 text-sm">Q: {faq.q}</p>
                              <p className="text-slate-600 text-sm pl-4 border-l-2 border-slate-200">{faq.a}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeVisaTab === "tips" && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-[#14532d] flex items-center gap-1">
                            <Sparkles size={14} className="text-[#e9b343]" />
                            Expert Recommendations
                          </h4>
                          <ul className="space-y-2.5">
                            {selectedPost.visaDetails.tips.map((tip, idx) => (
                              <li key={idx} className="text-slate-600 text-sm flex items-start gap-2.5">
                                <span className="text-[#e9b343] shrink-0 mt-0.5">★</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // ─── STANDARD POST VIEWER ────────────────────────────────────
                  <article className="prose max-w-none text-slate-700">
                    {renderFormattedContent(selectedPost.content)}
                  </article>
                )}

                {/* ─── CALL TO ACTION BOX (ENQUIRY) ───────────────────────────── */}
                <div className="mt-12 p-8 bg-gradient-to-r from-green-50 via-emerald-50/40 to-amber-50/20 rounded-3xl border border-green-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="space-y-1 text-center md:text-left">
                    <h4 className="text-lg font-bold text-slate-800">Ready to travel to your destination?</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Let Goimomi Holidays design, book, and secure your flights, cabs, stays, and visas.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleClosePost();
                      navigate(`/enquiry?subject=${encodeURIComponent(selectedPost.title)}`);
                    }}
                    className="bg-[#14532d] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg shadow-green-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0"
                  >
                    <Send size={14} />
                    Get Free Travel Consultation
                  </button>
                </div>

                {/* ─── RELATED POSTS ────────────────────────────────────────── */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6">Related Articles</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {blogPosts
                      .filter((p) => p.category === selectedPost.category && p.slug !== selectedPost.slug)
                      .slice(0, 2)
                      .map((relPost) => (
                        <div
                          key={relPost.slug}
                          className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-all duration-300 flex items-start gap-4 cursor-pointer"
                          onClick={() => {
                            setSelectedPost(relPost);
                            setActiveVisaTab("eligibility");
                            // Scroll content to top
                            document.getElementById("modal-scroll-container")?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <img
                            src={relPost.image}
                            alt={relPost.title}
                            className="w-20 h-20 object-cover rounded-xl shrink-0"
                          />
                          <div className="space-y-1">
                            <h5 className="font-bold text-sm text-slate-800 hover:text-[#14532d] transition-colors line-clamp-2">
                              {relPost.title}
                            </h5>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <Clock size={10} /> {relPost.readTime}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
