import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Globe2,
  HelpCircle,
  Info,
  Lightbulb,
  MapPin,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  User,
  X
} from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import { blogCategories, blogPosts } from "./blogData";
import blogHeroBanner from "../../../assets/images/blog_hero_banner_v3.png";

const MotionDiv = motion.div;

const categoryFor = (categoryId) =>
  blogCategories.find((category) => category.id === categoryId) || blogCategories[0];

const formatInlineText = (text) => {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index} className="font-bold text-slate-800">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
};

const renderRichContent = (content) => {
  if (!content) return null;

  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const firstLine = lines[0] || "";

      if (firstLine.startsWith("###")) {
        return (
          <h3 key={index} className="mt-8 flex items-start gap-3 text-xl font-black tracking-tight text-slate-900">
            <span className="mt-1 h-6 w-1.5 shrink-0 rounded-full bg-[#e9b343]" />
            <span>{formatInlineText(firstLine.replace(/^###\s*/, ""))}</span>
          </h3>
        );
      }

      const isUnorderedList = lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line));
      const isOrderedList = lines.length > 0 && lines.every((line) => /^\d+[.)]\s+/.test(line));

      if (isUnorderedList || isOrderedList) {
        const ListTag = isOrderedList ? "ol" : "ul";
        return (
          <ListTag key={index} className={`${isOrderedList ? "list-decimal" : "list-disc"} space-y-2 pl-6 text-[15px] leading-7 text-slate-600 marker:text-[#14532d]`}>
            {lines.map((line, itemIndex) => (
              <li key={itemIndex}>{formatInlineText(line.replace(isOrderedList ? /^\d+[.)]\s+/ : /^[-*]\s+/, ""))}</li>
            ))}
          </ListTag>
        );
      }

      if (firstLine.startsWith(">")) {
        return (
          <blockquote key={index} className="rounded-r-2xl border-l-4 border-[#e9b343] bg-amber-50/70 px-5 py-4 text-[15px] font-medium italic leading-7 text-slate-700">
            {formatInlineText(lines.map((line) => line.replace(/^>\s*/, "")).join(" "))}
          </blockquote>
        );
      }

      return (
        <p key={index} className="text-[15px] leading-8 text-slate-600">
          {formatInlineText(lines.join(" "))}
        </p>
      );
    });
};

const Metadata = ({ post, light = false }) => (
  <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.12em] ${light ? "text-white/70" : "text-slate-400"}`}>
    <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
    <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
  </div>
);

const VisaGuideContent = ({ post, activeTab, setActiveTab }) => {
  const details = post.visaDetails;
  const tabs = [
    { id: "eligibility", label: "Eligibility", icon: <User size={14} /> },
    { id: "documents", label: "Documents", icon: <FileText size={14} /> },
    { id: "fees", label: "Fees & time", icon: <BadgeCheck size={14} /> },
    { id: "process", label: "Process", icon: <Check size={14} /> },
    { id: "rejections", label: "Avoid rejection", icon: <ShieldAlert size={14} /> },
    { id: "faqs", label: "FAQs", icon: <HelpCircle size={14} /> },
    { id: "tips", label: "Expert tips", icon: <Lightbulb size={14} /> }
  ];

  return (
    <div className="space-y-7">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <Globe2 size={20} className="mb-3 text-emerald-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Guide type</p>
          <p className="mt-1 text-sm font-bold text-slate-800">Tourist visa knowledge</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <Clock size={20} className="mb-3 text-amber-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Typical timeline</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{details.processingTime?.split("(")[0]?.trim()}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
          <ShieldAlert size={20} className="mb-3 text-sky-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-700">Before you apply</p>
          <p className="mt-1 text-sm font-bold text-slate-800">Check current official rules</p>
        </div>
      </div>

      <p className="rounded-2xl border-l-4 border-[#14532d] bg-green-50/70 px-5 py-4 text-[15px] font-medium italic leading-7 text-slate-700">
        {post.excerpt}
      </p>

      <div className="overflow-x-auto border-b border-slate-200 pb-1 custom-scrollbar">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${activeTab === tab.id ? "border-[#14532d] bg-green-50 text-[#14532d]" : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 md:p-7">
        {activeTab === "eligibility" && (
          <div className="space-y-3">
            <h3 className="text-lg font-black text-slate-900">Who can apply?</h3>
            <p className="text-[15px] leading-8 text-slate-600">{details.eligibility}</p>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Document checklist</h3>
            <ul className="space-y-3">
              {(details.documents || []).map((document, index) => (
                <li key={index} className="flex items-start gap-3 text-[15px] leading-7 text-slate-600">
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={12} /></span>
                  {document}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Fees and processing time</h3>
            <p className="text-[15px] leading-8 text-slate-600"><strong className="text-slate-800">Processing:</strong> {details.processingTime}</p>
            <p className="text-[15px] leading-8 text-slate-600"><strong className="text-slate-800">Fees:</strong> {details.fees}</p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              Official fees, exchange rates, and processing times can change. Confirm the current requirement before making payment or travel arrangements.
            </div>
          </div>
        )}

        {activeTab === "process" && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Application process</h3>
            <div className="space-y-4">
              {(details.process || []).map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14532d] text-xs font-black text-white">{index + 1}</span>
                  <p className="pt-0.5 text-[15px] leading-7 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "rejections" && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Common rejection risks</h3>
            <ul className="space-y-3">
              {(details.rejections || []).map((reason, index) => (
                <li key={index} className="flex items-start gap-3 text-[15px] leading-7 text-slate-600">
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">×</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="space-y-5">
            <h3 className="text-lg font-black text-slate-900">Frequently asked questions</h3>
            {(details.faqs || []).map((faq, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-bold leading-6 text-slate-800">{faq.q}</p>
                <p className="mt-2 border-l-2 border-[#e9b343] pl-3 text-sm leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tips" && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900"><Lightbulb size={19} className="text-[#e9b343]" /> Expert recommendations</h3>
            <ul className="space-y-3">
              {(details.tips || []).map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-[15px] leading-7 text-slate-600">
                  <Sparkles size={16} className="mt-1.5 shrink-0 text-[#e9b343]" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeVisaTab, setActiveVisaTab] = useState("eligibility");

  const pageTitle = selectedPost
    ? `${selectedPost.title} | Goimomi Holidays`
    : "Goimomi Holidays Travel Journal | Guides, Visa Tips & Inspiration";
  const pageDescription = selectedPost?.excerpt || "Explore practical travel guides, visa knowledge, pilgrimage planning tips, destination inspiration, and holiday advice from Goimomi Holidays.";

  usePageSEO(
    pageTitle,
    pageDescription,
    selectedPost?.image || blogHeroBanner,
    "travel blog, India travel guide, visa guide, Umrah guide, holiday planning, travel tips",
    selectedPost ? "article" : "website"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const postSlug = searchParams.get("post");
    const post = postSlug ? blogPosts.find((item) => item.slug === postSlug) : null;
    setSelectedPost(post || null);
  }, [searchParams]);

  useEffect(() => {
    const schemaId = "goimomi-blog-schema";
    const schema = document.createElement("script");
    schema.id = schemaId;
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(selectedPost ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: selectedPost.title,
      description: selectedPost.excerpt,
      image: selectedPost.image,
      author: { "@type": "Person", name: selectedPost.author },
      publisher: { "@type": "Organization", name: "Goimomi Holidays" },
      mainEntityOfPage: `${window.location.origin}/blog?post=${selectedPost.slug}`
    } : {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Goimomi Holidays Travel Journal",
      description: pageDescription,
      url: `${window.location.origin}/blog`,
      publisher: { "@type": "Organization", name: "Goimomi Holidays" },
      blogPost: blogPosts.slice(0, 12).map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        author: { "@type": "Person", name: post.author },
        image: post.image
      }))
    });

    document.head.querySelector(`#${schemaId}`)?.remove();
    document.head.appendChild(schema);
    return () => document.head.querySelector(`#${schemaId}`)?.remove();
  }, [pageDescription, selectedPost]);

  useEffect(() => {
    if (!selectedPost) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedPost(null);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("post");
        setSearchParams(nextParams);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchParams, selectedPost, setSearchParams]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory = categoryParam === "all" || post.category === categoryParam;
      if (!query) return matchesCategory;
      const searchableText = [post.title, post.excerpt, post.content, post.author].filter(Boolean).join(" ").toLowerCase();
      return matchesCategory && searchableText.includes(query);
    });
  }, [categoryParam, searchQuery]);

  const featuredPost = blogPosts[0];
  const isDefaultView = categoryParam === "all" && !searchQuery.trim();
  const listingPosts = filteredPosts.filter((post) => !(isDefaultView && post.slug === featuredPost?.slug));
  const activeCategory = categoryParam === "all" ? null : categoryFor(categoryParam);

  const handleCategorySelect = (categoryId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryId === "all") nextParams.delete("category");
    else nextParams.set("category", categoryId);
    nextParams.delete("post");
    setSelectedPost(null);
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    handleCategorySelect("all");
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setActiveVisaTab("eligibility");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("post", post.slug);
    setSearchParams(nextParams);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("post");
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f4] font-sans text-slate-800">
      <section
        aria-labelledby="blog-page-title"
        className="relative isolate overflow-hidden bg-[#0a2116] px-6 py-20 text-white md:py-28"
        style={{ backgroundImage: `url(${blogHeroBanner})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06150d] via-[#0b2418]/95 to-[#0b2418]/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06150d]/75 via-transparent to-[#06150d]/15" />
        <div className="absolute -right-28 top-16 -z-10 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute right-8 top-32 -z-10 h-52 w-52 rounded-full border border-[#e9b343]/20" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link to="/" className="mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/65 transition-colors hover:text-[#e9b343]">
            Goimomi Holidays <ChevronRight size={14} /> Travel Journal
          </Link>

          <div className="max-w-3xl">
            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
              <Sparkles size={14} className="text-[#e9b343]" />
              The Goimomi Travel Journal
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
              <h1 id="blog-page-title" className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Your next journey starts with <span className="text-[#e9b343]">better advice.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
                Curated destination stories, practical visa guidance, pilgrimage planning, and honest travel tips to help you move through the world with confidence.
              </p>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }} className="mt-9 max-w-2xl">
              <form role="search" onSubmit={(event) => event.preventDefault()} className="relative">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  aria-label="Search the Goimomi travel journal"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search destinations, visa guides, travel tips..."
                  className="w-full rounded-2xl border border-white/20 bg-white py-4 pl-14 pr-14 text-sm text-slate-900 shadow-2xl outline-none transition-all placeholder:text-slate-400 focus:border-[#e9b343] focus:ring-4 focus:ring-[#e9b343]/25"
                />
                {searchQuery && (
                  <button type="button" aria-label="Clear search" onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={17} /></button>
                )}
              </form>
            </MotionDiv>

            <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { icon: <BookOpen size={17} />, value: `${blogPosts.length}+`, label: "guides & stories" },
                { icon: <MapPin size={17} />, value: `${blogCategories.length}`, label: "travel themes" },
                { icon: <BadgeCheck size={17} />, value: "Expert-led", label: "planning insights" }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <span className="text-[#e9b343]">{stat.icon}</span>
                  <span><strong className="block text-sm font-black text-white">{stat.value}</strong><span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">{stat.label}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Browse travel journal categories" className="sticky top-[80px] z-40 border-b border-slate-200/80 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="hidden shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 lg:flex"><Globe2 size={15} className="text-[#14532d]" /> Browse by interest</div>
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <button type="button" onClick={() => handleCategorySelect("all")} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${categoryParam === "all" ? "bg-[#14532d] text-white shadow-md shadow-green-950/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>All stories</button>
            {blogCategories.map((category) => (
              <button type="button" key={category.id} onClick={() => handleCategorySelect(category.id)} className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${categoryParam === category.id ? "bg-[#14532d] text-white shadow-md shadow-green-950/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                <span>{category.icon}</span>{category.title.replace(" Knowledge Centre", "").replace(" Guide", "")}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {isDefaultView && featuredPost && (
          <section aria-labelledby="featured-story-heading" className="mb-16 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(20,83,45,0.09)]">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[320px] overflow-hidden bg-slate-900 lg:min-h-[430px]">
                <img src={featuredPost.image} alt={featuredPost.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <span className="absolute left-6 top-6 rounded-full bg-[#e9b343] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#14532d]">Editor&apos;s pick</span>
                <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/80"><MapPin size={13} className="text-[#e9b343]" /> {categoryFor(featuredPost.category).title}</span>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#14532d]">Featured story</p>
                <h2 id="featured-story-heading" className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">{featuredPost.title}</h2>
                <p className="mt-5 text-[15px] leading-8 text-slate-500">{featuredPost.excerpt}</p>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-sm font-black text-[#14532d]">{featuredPost.author.charAt(0)}</span><div><p className="text-xs font-bold text-slate-700">{featuredPost.author}</p><Metadata post={featuredPost} /></div></div>
                  <button type="button" onClick={() => openPost(featuredPost)} className="inline-flex items-center gap-2 rounded-full bg-[#14532d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-lg shadow-green-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#0f4325]">Read story <ArrowUpRight size={15} /></button>
                </div>
              </div>
            </div>
          </section>
        )}

        {isDefaultView && (
          <section aria-labelledby="interests-heading" className="mb-16">
            <div className="mb-6 flex items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#14532d]">Find your way in</p><h2 id="interests-heading" className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Explore by interest</h2></div><span className="hidden text-xs font-bold uppercase tracking-widest text-slate-400 sm:block">Plan with clarity</span></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {blogCategories.slice(0, 4).map((category) => {
                const count = blogPosts.filter((post) => post.category === category.id).length;
                return (
                  <button type="button" key={category.id} onClick={() => handleCategorySelect(category.id)} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${category.gradient}`} />
                    <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-xl">{category.icon}</span><ArrowUpRight size={18} className="text-slate-300 transition-colors group-hover:text-[#14532d]" /></div>
                    <h3 className="mt-5 text-sm font-black leading-5 text-slate-900">{category.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">{category.description}</p>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#14532d]">{count} {count === 1 ? "story" : "stories"}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
          <section aria-labelledby="latest-stories-heading">
            <div className="mb-7 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#14532d]">The latest from our desk</p><h2 id="latest-stories-heading" className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{activeCategory?.title || "Latest stories"}</h2></div><span className="text-xs font-bold uppercase tracking-widest text-slate-400">{filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"}</span></div>
            {listingPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Info size={38} className="mx-auto mb-4 text-slate-300" /><h3 className="text-lg font-black text-slate-800">No stories match that search</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Try a broader destination, category, or travel topic to find the right guide.</p><button type="button" onClick={handleClearFilters} className="mt-6 rounded-full bg-[#14532d] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#0f4325]">Clear filters</button></div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {listingPosts.map((post, index) => {
                  const category = categoryFor(post.category);
                  return (
                    <MotionDiv key={post.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }} className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <button type="button" onClick={() => openPost(post)} className="block w-full text-left">
                        <div className="relative aspect-[1.35/1] overflow-hidden bg-slate-100"><img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-80" /><span className={`absolute bottom-4 left-4 rounded-full bg-gradient-to-r ${category.gradient} px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-lg`}>{category.title.replace(" Knowledge Centre", "").replace(" Guide", "")}</span></div>
                        <div className="p-6"><Metadata post={post} /><h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-[#14532d]">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">{post.excerpt}</p><div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"><User size={13} className="text-[#14532d]" /> {post.author}</span><span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#14532d] transition-colors group-hover:text-[#e9b343]">Read <ArrowRight size={14} /></span></div></div>
                      </button>
                    </MotionDiv>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6 lg:sticky lg:top-[148px]">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"><p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#14532d]">Need a starting point?</p><h2 className="text-xl font-black leading-tight text-slate-900">Plan a trip that feels like you.</h2><p className="mt-3 text-sm leading-7 text-slate-500">Tell our travel specialists what matters to you and we&apos;ll shape the details around it.</p><Link to="/customizedHolidays" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#14532d] px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-green-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#0f4325]">Start planning <ArrowUpRight size={15} /></Link></div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">Popular reads</h2><Sparkles size={17} className="text-[#e9b343]" /></div><div className="space-y-5">{blogPosts.slice(0, 4).map((post, index) => (<button type="button" key={post.slug} onClick={() => openPost(post)} className="group flex w-full items-start gap-3 text-left"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-black text-[#14532d]">0{index + 1}</span><span><strong className="line-clamp-2 text-sm leading-5 text-slate-800 transition-colors group-hover:text-[#14532d]">{post.title}</strong><span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Clock size={11} /> {post.readTime}</span></span></button>))}</div></div>

            <div className="rounded-3xl bg-[#0c2b1c] p-6 text-white shadow-lg"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#e9b343]"><BookOpen size={19} /></div><h2 className="text-lg font-black leading-tight">Travel well-informed.</h2><p className="mt-2 text-sm leading-6 text-white/65">Save the guides you need, share them with your companions, and return when it&apos;s time to make the booking.</p></div>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {selectedPost && (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={selectedPost.title} onClick={handleClosePost} className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 px-4 py-5 backdrop-blur-sm md:py-8">
            <MotionDiv initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.25 }} onClick={(event) => event.stopPropagation()} className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <button type="button" aria-label="Close article" onClick={handleClosePost} className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/55 text-white backdrop-blur-md transition-colors hover:bg-slate-950/80"><X size={19} /></button>
              <div id="blog-modal-scroll" className="overflow-y-auto custom-scrollbar">
                <div className="relative h-[280px] bg-slate-900 md:h-[390px]"><img src={selectedPost.image} alt={selectedPost.title} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" /><div className="absolute bottom-7 left-6 right-6 text-white md:bottom-9 md:left-10 md:right-10"><span className="mb-4 inline-flex rounded-full bg-[#e9b343] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#14532d]">{categoryFor(selectedPost.category).title}</span><h2 className="max-w-4xl text-2xl font-black leading-tight tracking-tight md:text-4xl">{selectedPost.title}</h2><div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/75"><span className="inline-flex items-center gap-1.5"><User size={13} className="text-[#e9b343]" /> {selectedPost.author}</span><Metadata post={selectedPost} light /></div></div></div>

                <div className="mx-auto max-w-4xl px-6 py-8 md:px-12 md:py-12">
                  {selectedPost.isVisaGuide && selectedPost.visaDetails ? <VisaGuideContent post={selectedPost} activeTab={activeVisaTab} setActiveTab={setActiveVisaTab} /> : <article className="space-y-6"><p className="border-l-4 border-[#e9b343] pl-5 text-lg font-medium leading-8 text-slate-700">{selectedPost.excerpt}</p><div className="space-y-5">{renderRichContent(selectedPost.content)}</div></article>}

                  <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-amber-50/60 p-6 md:flex-row md:items-center md:p-8"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#14532d]">Make the next step easy</p><h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">Want help turning this guide into a real itinerary?</h3><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Our team can help with stays, transfers, visas, and a trip plan built around your dates.</p></div><button type="button" onClick={() => { handleClosePost(); navigate(`/enquiry?subject=${encodeURIComponent(selectedPost.title)}`); }} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#14532d] px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-green-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#0f4325]"><Send size={14} /> Talk to our team</button></div>

                  <div className="mt-12 border-t border-slate-100 pt-8"><div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">Keep exploring</h3><Link to="/blog" onClick={handleClosePost} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#14532d]">All stories <ArrowRight size={13} /></Link></div><div className="grid gap-4 md:grid-cols-2">{blogPosts.filter((post) => post.category === selectedPost.category && post.slug !== selectedPost.slug).slice(0, 2).map((relatedPost) => (<button type="button" key={relatedPost.slug} onClick={() => { openPost(relatedPost); document.getElementById("blog-modal-scroll")?.scrollTo({ top: 0, behavior: "smooth" }); }} className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:bg-white hover:shadow-md"><img src={relatedPost.image} alt={relatedPost.title} className="h-16 w-20 shrink-0 rounded-xl object-cover" /><span><strong className="line-clamp-2 text-sm leading-5 text-slate-800 group-hover:text-[#14532d]">{relatedPost.title}</strong><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Clock size={11} /> {relatedPost.readTime}</span></span></button>))}</div></div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
