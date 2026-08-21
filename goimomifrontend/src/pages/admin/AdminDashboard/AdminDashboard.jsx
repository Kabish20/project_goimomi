import React, { useState, useEffect, useMemo } from "react";
import {
  RefreshCw, Package, Users, Phone, Mail, Ship, Building2, Globe,
  CreditCard, ClipboardList, Map, HelpCircle, Car, Plus, ArrowRight,
  PieChart as PieChartIcon, TrendingUp, ShoppingCart, Search, Eye, Filter,
  Calendar, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Copy, Check,
  Sparkles, ShieldCheck, DollarSign, Layers, ChevronRight, UserCheck,
  Send, ExternalLink, Activity, Award
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

// Interactive SVG Donut / Segment Chart with Smooth Hover State
const EnquiryPieChart = ({ data, onNavigate, total }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const size = 240;
  const center = size / 2;
  const radius = 78;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-xs text-gray-400 font-bold uppercase tracking-wider">
        <PieChartIcon size={40} className="text-gray-300 mb-2" />
        No enquiry data available yet
      </div>
    );
  }

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 py-2">
      {/* SVG Donut */}
      <div className="relative w-60 h-60 flex-shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            if (item.value === 0) return null;
            const percent = item.value / total;
            const dashArray = `${percent * circumference} ${circumference}`;
            const dashOffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                onClick={() => item.link && onNavigate(item.link)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="transition-all duration-300 cursor-pointer"
                style={{
                  transformOrigin: 'center',
                  filter: isHovered ? 'drop-shadow(0px 6px 12px rgba(0,0,0,0.25))' : 'none'
                }}
              />
            );
          })}
        </svg>

        {/* Center Total Summary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-3xl font-black text-slate-900 leading-none tracking-tight">
            {activeItem ? activeItem.value : total}
          </span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 line-clamp-1 max-w-[130px]">
            {activeItem ? activeItem.label : "Total Inquiries"}
          </span>
          {activeItem && (
            <span className="text-[10px] font-extrabold text-emerald-700 mt-0.5">
              {((activeItem.value / total) * 100).toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Interactive Category Cards Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {data.map((item, index) => {
          const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
          const isHovered = hoveredIndex === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => item.link && onNavigate(item.link)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group text-left ${
                isHovered
                  ? "bg-emerald-50/90 border-emerald-400 shadow-md translate-x-1 scale-[1.01]"
                  : "bg-slate-50/70 border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-300 hover:shadow-xs"
              }`}
              title={`Click to view ${item.label}`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs ring-2 ring-white"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-800 text-xs group-hover:text-emerald-900 truncate">
                  {item.label}
                </span>
              </div>
              <div className="text-right ml-2 flex-shrink-0 flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-xs group-hover:text-emerald-900">
                  {item.value}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">({percent}%)</span>
                <ArrowRight size={12} className="text-gray-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    packages: 0,
    enquiries: 0,
    cabEnquiries: 0,
    cruiseEnquiries: 0,
    hotelEnquiries: 0,
    holidayEnquiries: 0,
    umrahEnquiries: 0,
    itineraryMasters: 0,
    sightseeingMasters: 0,
    accommodations: 0,
    visas: 0,
    visaApplications: 0,
    cantonEnquiries: 0,
    cabBookings: 0,
    packageBookings: 0,
    productOrders: 0,
    goimomiProducts: 0,
    vehicles: 0,
    drivers: 0,
    rateCards: 0,
    cities: 0,
    countries: 0,
    airports: 0,
    pickupPoints: 0,
    cruiseTerminals: 0,
    users: 0,
    suppliers: 0,
    cabRevenue: 0,
    productRevenue: 0,
    packageRevenue: 0,
    totalRevenue: 0,
    cabStatusCounts: { requested: 0, defined: 0, confirmed: 0, completed: 0, cancelled: 0 },
    packageStatusCounts: { pending: 0, confirmed: 0, cancelled: 0 },
    productStatusCounts: { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/dashboard-stats/`);
      if (response.data) {
        const fetchedStats = response.data.stats || {};
        setStats({
          packages: fetchedStats.packages || 0,
          enquiries: fetchedStats.enquiries || 0,
          cabEnquiries: fetchedStats.cabEnquiries || 0,
          cruiseEnquiries: fetchedStats.cruiseEnquiries || 0,
          hotelEnquiries: fetchedStats.hotelEnquiries || 0,
          holidayEnquiries: fetchedStats.holidayEnquiries || 0,
          umrahEnquiries: fetchedStats.umrahEnquiries || 0,
          itineraryMasters: fetchedStats.itineraryMasters || 0,
          sightseeingMasters: fetchedStats.sightseeingMasters || 0,
          accommodations: fetchedStats.accommodations || 0,
          visas: fetchedStats.visas || 0,
          visaApplications: fetchedStats.visaApplications || 0,
          cantonEnquiries: fetchedStats.cantonEnquiries || 0,
          cabBookings: fetchedStats.cabBookings || 0,
          packageBookings: fetchedStats.packageBookings || 0,
          productOrders: fetchedStats.productOrders || 0,
          goimomiProducts: fetchedStats.goimomiProducts || 0,
          vehicles: fetchedStats.vehicles || 0,
          drivers: fetchedStats.drivers || 0,
          rateCards: fetchedStats.rateCards || 0,
          cities: fetchedStats.cities || 0,
          countries: fetchedStats.countries || 0,
          airports: fetchedStats.airports || 0,
          pickupPoints: fetchedStats.pickupPoints || 0,
          cruiseTerminals: fetchedStats.cruiseTerminals || 0,
          users: fetchedStats.users || 0,
          suppliers: fetchedStats.suppliers || 0,
          cabRevenue: fetchedStats.cabRevenue || 0,
          productRevenue: fetchedStats.productRevenue || 0,
          packageRevenue: fetchedStats.packageRevenue || 0,
          totalRevenue: fetchedStats.totalRevenue || 0,
          cabStatusCounts: fetchedStats.cabStatusCounts || { requested: 0, defined: 0, confirmed: 0, completed: 0, cancelled: 0 },
          packageStatusCounts: fetchedStats.packageStatusCounts || { pending: 0, confirmed: 0, cancelled: 0 },
          productStatusCounts: fetchedStats.productStatusCounts || { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
        });

        const enquiries = response.data.recentEnquiries || [];
        setRecentEnquiries(enquiries);
        setLastRefreshed(new Date());
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError(`Failed to load dashboard data: ${err.message}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    if (!text || text === "—" || text === "N/A") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Category stream configuration for Donut Chart & Category Cards
  const categoryStreams = useMemo(() => [
    { label: "Cab Bookings", value: stats.cabBookings, color: "#f59e0b", link: "/admin/cab-bookings", key: "cab" },
    { label: "Cab Enquiries", value: stats.cabEnquiries, color: "#fbbf24", link: "/admin/cab-enquiries", key: "cab-enq" },
    { label: "Holiday Enquiries", value: stats.holidayEnquiries, color: "#16a34a", link: "/admin/holiday-enquiries", key: "holiday" },
    { label: "Umrah Pilgrimage", value: stats.umrahEnquiries, color: "#8b5cf6", link: "/admin/umrah-enquiries", key: "umrah" },
    { label: "Visa Applications", value: stats.visaApplications, color: "#e11d48", link: "/admin/visa-applications", key: "visa" },
    { label: "Product Orders", value: stats.productOrders, color: "#0d9488", link: "/admin/products", key: "product" },
    { label: "Cruise Inquiries", value: stats.cruiseEnquiries, color: "#0284c7", link: "/admin/cruise-enquiries", key: "cruise" },
    { label: "Hotel Bookings", value: stats.hotelEnquiries, color: "#10b981", link: "/admin/hotel-enquiries", key: "hotel" },
    { label: "Canton Fair", value: stats.cantonEnquiries, color: "#ea580c", link: "/admin/canton-enquiries", key: "canton" },
    { label: "General & Other", value: stats.enquiries, color: "#3b82f6", link: "/admin/general-enquiries", key: "general" },
  ], [stats]);

  const totalAllInquiries = useMemo(() => {
    return categoryStreams.reduce((acc, d) => acc + d.value, 0);
  }, [categoryStreams]);

  const totalActiveBookingsCount = stats.cabBookings + stats.packageBookings + stats.productOrders;

  // Filtered recent activity
  const filteredSubmissions = useMemo(() => {
    return recentEnquiries.filter((item) => {
      // Category Tab Filter
      if (activeCategoryTab !== "all") {
        if (activeCategoryTab === "cab" && item.category_key !== "cab") return false;
        if (activeCategoryTab === "package" && item.category_key !== "package") return false;
        if (activeCategoryTab === "product" && item.category_key !== "product") return false;
        if (activeCategoryTab === "visa" && item.category_key !== "visa") return false;
        if (activeCategoryTab === "holiday_umrah" && item.category_key !== "holiday" && item.category_key !== "umrah") return false;
        if (activeCategoryTab === "general" && item.category_key !== "general" && item.category_key !== "canton") return false;
      }

      // Text Search Filter
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.phone && item.phone.toLowerCase().includes(term)) ||
        (item.type && item.type.toLowerCase().includes(term)) ||
        (item.purpose && item.purpose.toLowerCase().includes(term)) ||
        (item.booking_id && item.booking_id.toLowerCase().includes(term)) ||
        (item.status && item.status.toLowerCase().includes(term))
      );
    });
  }, [recentEnquiries, activeCategoryTab, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("confirmed") || s === "approved" || s === "delivered") {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
    if (s.includes("requested") || s === "pending" || s === "processing") {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    if (s.includes("defined") || s.includes("shipped")) {
      return "bg-blue-50 text-blue-800 border-blue-200";
    }
    if (s.includes("completed")) {
      return "bg-green-50 text-green-800 border-green-200";
    }
    if (s.includes("cancelled") || s.includes("rejected")) {
      return "bg-red-50 text-red-800 border-red-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getCategoryBadge = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("cab")) return "bg-amber-50 text-amber-900 border-amber-200";
    if (t.includes("visa")) return "bg-rose-50 text-rose-900 border-rose-200";
    if (t.includes("product") || t.includes("order")) return "bg-teal-50 text-teal-900 border-teal-200";
    if (t.includes("holiday") || t.includes("package")) return "bg-green-50 text-green-900 border-green-200";
    if (t.includes("umrah")) return "bg-purple-50 text-purple-900 border-purple-200";
    if (t.includes("canton")) return "bg-orange-50 text-orange-900 border-orange-200";
    if (t.includes("cruise")) return "bg-sky-50 text-sky-900 border-sky-200";
    if (t.includes("hotel")) return "bg-emerald-50 text-emerald-900 border-emerald-200";
    return "bg-blue-50 text-blue-900 border-blue-200";
  };

  const getDestinationManageLink = (item) => {
    const type = (item?.type || "").toLowerCase();
    if (type.includes("cab booking")) return "/admin/cab-bookings";
    if (type.includes("cab")) return "/admin/cab-enquiries";
    if (type.includes("visa")) return "/admin/visa-applications";
    if (type.includes("product") || type.includes("order")) return "/admin/products";
    if (type.includes("holiday")) return "/admin/holiday-enquiries";
    if (type.includes("umrah")) return "/admin/umrah-enquiries";
    if (type.includes("canton")) return "/admin/canton-enquiries";
    if (type.includes("cruise")) return "/admin/cruise-enquiries";
    if (type.includes("hotel")) return "/admin/hotel-enquiries";
    return "/admin/general-enquiries";
  };

  return (
    <div className="flex bg-[#f8faf9] h-screen overflow-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 space-y-6">

          {/* ═══════════════════════════════════════════════════════════
              SECTION 1: EXECUTIVE COMMAND HEADER & REALTIME TOOLBAR
          ═══════════════════════════════════════════════════════════ */}
          <div className="bg-gradient-to-r from-[#0d2f1f] via-[#14532d] to-[#1b6b3c] rounded-3xl shadow-lg p-5 md:p-6 text-white relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none bg-radial from-white to-transparent" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/15 text-[10px] font-black uppercase tracking-widest text-emerald-300 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operational Hub • Enterprise Sync
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                  <Activity className="w-7 h-7 text-emerald-400" />
                  Goimomi Executive Dashboard
                </h1>
                <p className="text-xs md:text-sm text-emerald-100/80 font-medium max-w-2xl">
                  Unified command center for customer inquiries, cab bookings, visa processing, product sales, and holiday logistics.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right hidden xl:block pr-3 border-r border-white/20">
                  <p className="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider">Last Refreshed</p>
                  <p className="text-xs font-black text-white">{lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>

                <button
                  type="button"
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="bg-white/15 hover:bg-white/25 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm border border-white/20 flex items-center gap-2 backdrop-blur-xs cursor-pointer"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin text-emerald-300" : "text-emerald-300"} />
                  {loading ? "Refreshing…" : "Sync Live Data"}
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Live Site</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {loading && !stats.packages ? (
            <div className="text-center py-28 bg-white rounded-3xl border border-gray-200 shadow-xs">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-100 border-t-[#14532d]" />
              <p className="mt-4 text-sm text-gray-700 font-black uppercase tracking-wider">Loading Executive Data Streams…</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-3xl text-center space-y-3">
              <AlertCircle size={32} className="mx-auto text-red-500" />
              <p className="font-bold text-sm">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* ═══════════════════════════════════════════════════════════
                  SECTION 2: 4 TOP TIER HERO KPI METRIC CARDS
              ═══════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* KPI 1: Inbound Lead Volume */}
                <div
                  onClick={() => navigate("/admin/general-enquiries")}
                  className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-emerald-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Customer Inquiries</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{totalAllInquiries}</h2>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-[#14532d] group-hover:text-white transition-all shadow-xs">
                      <HelpCircle size={22} />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles size={12} /> 9 Category Streams
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* KPI 2: Confirmed Bookings & Orders */}
                <div
                  onClick={() => navigate("/admin/cab-bookings")}
                  className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-amber-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Bookings & Orders</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{totalActiveBookingsCount}</h2>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
                      <Car size={22} />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="text-[11px] text-amber-700 font-bold">
                      {stats.cabBookings} Cabs • {stats.productOrders} Orders
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* KPI 3: Financial Volume / Estimated GMV */}
                <div
                  onClick={() => navigate("/admin/cab-bookings")}
                  className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-teal-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Booked Volume</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{formatCurrency(stats.totalRevenue)}</h2>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                      <DollarSign size={22} />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="text-[11px] text-teal-700 font-bold truncate">
                      Cab: {formatCurrency(stats.cabRevenue)} • Products: {formatCurrency(stats.productRevenue)}
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* KPI 4: Holiday & Visa Infrastructure */}
                <div
                  onClick={() => navigate("/admin/packages")}
                  className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-rose-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Holiday Packages & Visas</span>
                      <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stats.packages}</h2>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                      <Package size={22} />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="text-[11px] text-rose-700 font-bold">
                      {stats.itineraryMasters} Itineraries • {stats.visas} Visa Types
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-rose-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

              </div>

              {/* ═══════════════════════════════════════════════════════════
                  SECTION 3: OPERATIONS & FULFILLMENT PIPELINES
              ═══════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Cab Transfers Pipeline */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-3.5">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                        <Car size={16} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Cab Transfer Pipeline</h3>
                    </div>
                    <button
                      onClick={() => navigate("/admin/cab-bookings")}
                      className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Manage <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      <p className="text-[9px] font-bold uppercase text-amber-700">Requested</p>
                      <p className="text-lg font-black text-amber-900 mt-0.5">{stats.cabStatusCounts.requested || 0}</p>
                    </div>
                    <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                      <p className="text-[9px] font-bold uppercase text-blue-700">Assigned</p>
                      <p className="text-lg font-black text-blue-900 mt-0.5">{stats.cabStatusCounts.defined || 0}</p>
                    </div>
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <p className="text-[9px] font-bold uppercase text-emerald-700">Confirmed</p>
                      <p className="text-lg font-black text-emerald-900 mt-0.5">{stats.cabStatusCounts.confirmed || 0}</p>
                    </div>
                    <div className="bg-green-50/60 p-2.5 rounded-xl border border-green-100">
                      <p className="text-[9px] font-bold uppercase text-green-700">Done</p>
                      <p className="text-lg font-black text-green-900 mt-0.5">{stats.cabStatusCounts.completed || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Visa & Pilgrimage Pipeline */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-3.5">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
                        <CreditCard size={16} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Visa & Applications</h3>
                    </div>
                    <button
                      onClick={() => navigate("/admin/visa-applications")}
                      className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Manage <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                      <p className="text-[9px] font-bold uppercase text-rose-700">Applications</p>
                      <p className="text-lg font-black text-rose-900 mt-0.5">{stats.visaApplications}</p>
                    </div>
                    <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                      <p className="text-[9px] font-bold uppercase text-purple-700">Umrah Pilgrims</p>
                      <p className="text-lg font-black text-purple-900 mt-0.5">{stats.umrahEnquiries}</p>
                    </div>
                    <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                      <p className="text-[9px] font-bold uppercase text-blue-700">Visa Catalog</p>
                      <p className="text-lg font-black text-blue-900 mt-0.5">{stats.visas}</p>
                    </div>
                  </div>
                </div>

                {/* E-Commerce Order Fulfillment */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-3.5">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
                        <ShoppingCart size={16} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Product Fulfillment</h3>
                    </div>
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Manage <ChevronRight size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-teal-50/60 p-2.5 rounded-xl border border-teal-100">
                      <p className="text-[9px] font-bold uppercase text-teal-700">Total Orders</p>
                      <p className="text-lg font-black text-teal-900 mt-0.5">{stats.productOrders}</p>
                    </div>
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <p className="text-[9px] font-bold uppercase text-emerald-700">Products</p>
                      <p className="text-lg font-black text-emerald-900 mt-0.5">{stats.goimomiProducts}</p>
                    </div>
                    <div className="bg-cyan-50/60 p-2.5 rounded-xl border border-cyan-100">
                      <p className="text-[9px] font-bold uppercase text-cyan-700">Volume</p>
                      <p className="text-sm font-black text-cyan-900 mt-1">{formatCurrency(stats.productRevenue)}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* ═══════════════════════════════════════════════════════════
                  SECTION 4: INTERACTIVE DISTRIBUTION & INVENTORY ASSETS
              ═══════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left 2 Cols: Donut Chart & Category Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-5 md:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        <PieChartIcon size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm md:text-base font-black text-slate-900 tracking-tight">
                          Customer Inquiry & Booking Distribution
                        </h2>
                        <p className="text-[11px] text-slate-500 font-medium">Real-time volume across all 9 commercial services</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
                      Hover on segment or click to view
                    </span>
                  </div>

                  <EnquiryPieChart
                    data={categoryStreams}
                    total={totalAllInquiries}
                    onNavigate={(path) => navigate(path)}
                  />
                </div>

                {/* Right 1 Col: Master Inventory & Asset Infrastructure */}
                <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-5 md:p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                          <Layers size={15} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Catalog & Assets Infrastructure
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {/* Packages & Itineraries */}
                      <button
                        onClick={() => navigate("/admin/packages")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/60 transition group cursor-pointer border border-transparent hover:border-emerald-200"
                      >
                        <div className="flex justify-between font-bold text-slate-800 group-hover:text-emerald-900 mb-1.5">
                          <span className="flex items-center gap-1.5">Holiday Packages & Tours</span>
                          <span className="font-black text-slate-900">{stats.packages} Active</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(15, stats.packages * 2.5))}%` }} />
                        </div>
                      </button>

                      {/* Fleet Vehicles & Drivers */}
                      <button
                        onClick={() => navigate("/admin/vehicles")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50/60 transition group cursor-pointer border border-transparent hover:border-amber-200"
                      >
                        <div className="flex justify-between font-bold text-slate-800 group-hover:text-amber-900 mb-1.5">
                          <span className="flex items-center gap-1.5">Fleet Vehicles & Drivers</span>
                          <span className="font-black text-slate-900">{stats.vehicles} Cars • {stats.drivers} Drivers</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(20, (stats.vehicles + stats.drivers) * 4))}%` }} />
                        </div>
                      </button>

                      {/* Global Destinations & Cities */}
                      <button
                        onClick={() => navigate("/admin/cities")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/60 transition group cursor-pointer border border-transparent hover:border-blue-200"
                      >
                        <div className="flex justify-between font-bold text-slate-800 group-hover:text-blue-900 mb-1.5">
                          <span className="flex items-center gap-1.5">Network Cities & Airports</span>
                          <span className="font-black text-slate-900">{stats.cities} Cities • {stats.airports} Airports</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(25, stats.cities * 5))}%` }} />
                        </div>
                      </button>

                      {/* Accommodations & Itinerary Masters */}
                      <button
                        onClick={() => navigate("/admin/itinerary-masters")}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50/60 transition group cursor-pointer border border-transparent hover:border-purple-200"
                      >
                        <div className="flex justify-between font-bold text-slate-800 group-hover:text-purple-900 mb-1.5">
                          <span className="flex items-center gap-1.5">Itinerary Templates & Stays</span>
                          <span className="font-black text-slate-900">{stats.itineraryMasters} Itineraries</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(15, (stats.itineraryMasters / 200) * 100))}%` }} />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* System Management Quick Links */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate("/admin/users")}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200/80 transition cursor-pointer"
                    >
                      <p className="text-[9px] font-bold text-slate-400 uppercase">System Users</p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">{stats.users} Admins</p>
                    </button>
                    <button
                      onClick={() => navigate("/admin/suppliers")}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200/80 transition cursor-pointer"
                    >
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Suppliers</p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">{stats.suppliers} Partners</p>
                    </button>
                  </div>
                </div>

              </div>

              {/* ═══════════════════════════════════════════════════════════
                  SECTION 5: LIVE ACTIVITY FEED WITH MULTI-CATEGORY TABS
              ═══════════════════════════════════════════════════════════ */}
              <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-5 md:p-6 space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        <ClipboardList size={18} />
                      </div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">
                        Real-Time Customer Submissions & Activity Log
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Showing latest requests across transfers, visas, product orders, and holiday itineraries.
                    </p>
                  </div>

                  {/* Search Filter Bar */}
                  <div className="relative min-w-[280px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, route, ID…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/70"
                    />
                  </div>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "All Submissions", count: recentEnquiries.length },
                    { id: "cab", label: "🚗 Cab Bookings", count: recentEnquiries.filter(e => e.category_key === "cab").length },
                    { id: "package", label: "📦 Package Bookings", count: recentEnquiries.filter(e => e.category_key === "package").length },
                    { id: "product", label: "🛍️ Product Orders", count: recentEnquiries.filter(e => e.category_key === "product").length },
                    { id: "visa", label: "🌐 Visa Applications", count: recentEnquiries.filter(e => e.category_key === "visa").length },
                    { id: "holiday_umrah", label: "🌴 Holidays & Umrah", count: recentEnquiries.filter(e => e.category_key === "holiday" || e.category_key === "umrah").length },
                    { id: "general", label: "📋 General & Other", count: recentEnquiries.filter(e => e.category_key === "general" || e.category_key === "canton").length },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategoryTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeCategoryTab === tab.id
                          ? "bg-[#14532d] text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        activeCategoryTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Submissions Table */}
                {filteredSubmissions.length > 0 ? (
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-xs">
                      <thead className="bg-[#14532d] text-white">
                        <tr>
                          <th className="text-left py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">ID / Reference</th>
                          <th className="text-left py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                          <th className="text-left py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Service Category</th>
                          <th className="text-left py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Contact Details</th>
                          <th className="text-left py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Purpose / Details</th>
                          <th className="text-left py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Date</th>
                          <th className="text-center py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Status</th>
                          <th className="text-center py-3.5 px-4 font-black uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredSubmissions.map((item, idx) => (
                          <tr key={`${item.type}-${item.id}-${idx}`} className="hover:bg-emerald-50/30 transition-colors">
                            {/* Booking / Reference ID */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-mono text-[11px] font-black text-slate-800 px-2 py-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                                {item.booking_id || `#${item.id}`}
                              </span>
                            </td>

                            {/* Customer Profile */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-black flex items-center justify-center text-[11px] flex-shrink-0">
                                  {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="font-bold text-slate-900">{item.name}</span>
                              </div>
                            </td>

                            {/* Service Category */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${getCategoryBadge(item.type)}`}>
                                {item.type}
                              </span>
                            </td>

                            {/* Contact Details */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="space-y-0.5 text-[11px]">
                                {item.phone && item.phone !== "—" && (
                                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                    <Phone size={10} className="text-slate-400" />
                                    <span>{item.phone}</span>
                                  </div>
                                )}
                                {item.email && item.email !== "—" && (
                                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                    <Mail size={10} className="text-slate-400" />
                                    <span className="max-w-[160px] truncate">{item.email}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Purpose / Details */}
                            <td className="py-3.5 px-4 max-w-[240px]">
                              <p className="text-slate-800 font-semibold truncate" title={item.purpose}>
                                {item.purpose}
                              </p>
                              {item.amount > 0 && (
                                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                  {formatCurrency(item.amount)}
                                </span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-slate-500 font-semibold whitespace-nowrap">
                              {formatDate(item.created_at)}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${getStatusBadge(item.status)}`}>
                                {item.status || "Enquiry"}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedItem(item)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                  title="Inspect full details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => navigate(getDestinationManageLink(item))}
                                  className="p-1.5 bg-[#14532d]/10 hover:bg-[#14532d] text-[#14532d] hover:text-white rounded-lg transition-all cursor-pointer"
                                  title="Jump to management module"
                                >
                                  <ArrowUpRight size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-14 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Search size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-xs uppercase tracking-wider">No customer submissions match your filter</p>
                  </div>
                )}
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  SECTION 6: QUICK ACTION OPERATIONAL LAUNCHPAD
              ═══════════════════════════════════════════════════════════ */}
              <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-5 md:p-6 space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-700" />
                  Quick Operational Launchpad
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <button
                    onClick={() => navigate("/admin/packages/add")}
                    className="p-3 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/70 rounded-2xl text-left font-bold text-emerald-950 flex flex-col justify-between gap-3 transition group cursor-pointer"
                  >
                    <Plus size={16} className="text-emerald-700 group-hover:scale-110 transition-transform" />
                    <span className="font-black">Create Package</span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/visas/add")}
                    className="p-3 bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200/70 rounded-2xl text-left font-bold text-rose-950 flex flex-col justify-between gap-3 transition group cursor-pointer"
                  >
                    <Plus size={16} className="text-rose-700 group-hover:scale-110 transition-transform" />
                    <span className="font-black">Add Visa Type</span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/itinerary-masters/add")}
                    className="p-3 bg-purple-50/50 hover:bg-purple-100/60 border border-purple-200/70 rounded-2xl text-left font-bold text-purple-950 flex flex-col justify-between gap-3 transition group cursor-pointer"
                  >
                    <Plus size={16} className="text-purple-700 group-hover:scale-110 transition-transform" />
                    <span className="font-black">Add Itinerary</span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/vehicle-rate-cards/add")}
                    className="p-3 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 rounded-2xl text-left font-bold text-amber-950 flex flex-col justify-between gap-3 transition group cursor-pointer"
                  >
                    <Plus size={16} className="text-amber-700 group-hover:scale-110 transition-transform" />
                    <span className="font-black">Add Rate Card</span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/products/add")}
                    className="p-3 bg-teal-50/50 hover:bg-teal-100/60 border border-teal-200/70 rounded-2xl text-left font-bold text-teal-950 flex flex-col justify-between gap-3 transition group cursor-pointer"
                  >
                    <Plus size={16} className="text-teal-700 group-hover:scale-110 transition-transform" />
                    <span className="font-black">Add Product</span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/users")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left font-bold text-slate-900 flex flex-col justify-between gap-3 transition group cursor-pointer"
                  >
                    <UserCheck size={16} className="text-slate-700 group-hover:scale-110 transition-transform" />
                    <span className="font-black">System Users</span>
                  </button>
                </div>
              </div>

            </>
          )}

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7: RICH DETAIL INSPECTION MODAL
      ═══════════════════════════════════════════════════════════ */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0d2f1f] via-[#14532d] to-[#1a6b3d] p-5 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-mono font-black uppercase tracking-wider">
                    {selectedItem.booking_id || `#${selectedItem.id}`}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${getStatusBadge(selectedItem.status)}`}>
                    {selectedItem.status || "Enquiry"}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-1">{selectedItem.type}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Customer Profile Grid */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer Profile</span>
                  <span className="text-[11px] font-bold text-slate-500">Submitted: {formatDate(selectedItem.created_at)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{selectedItem.name}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="font-black text-slate-900">{selectedItem.phone || "—"}</p>
                      {selectedItem.phone && selectedItem.phone !== "—" && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedItem.phone, 'phone')}
                          className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedField === 'phone' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="font-bold text-emerald-800 break-all">{selectedItem.email || "—"}</p>
                      {selectedItem.email && selectedItem.email !== "—" && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedItem.email, 'email')}
                          className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                          title="Copy email"
                        >
                          {copiedField === 'email' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service & Operational Specifics */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Service Specifics & Details</p>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Primary Requirement</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedItem.purpose}</p>
                    </div>
                    {selectedItem.amount > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</p>
                        <p className="text-sm font-black text-emerald-800 mt-0.5">{formatCurrency(selectedItem.amount)}</p>
                      </div>
                    )}
                  </div>

                  {selectedItem.details && (
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      {Object.entries(selectedItem.details).map(([key, val]) => {
                        if (val === undefined || val === null || val === "") return null;
                        const formattedKey = key.replace(/_/g, " ").toUpperCase();
                        return (
                          <div key={key} className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">{formattedKey}</span>
                            <span className="font-bold text-slate-800">{String(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetPath = getDestinationManageLink(selectedItem);
                  setSelectedItem(null);
                  navigate(targetPath);
                }}
                className="px-5 py-2 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in Management Portal</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
