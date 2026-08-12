import React, { useState, useEffect } from "react";
import {
  ExternalLink, RefreshCw, Settings,
  MapPin, Package, Calendar, Users,
  Phone, Ship, Building2, Globe,
  Flag, CreditCard, ClipboardList,
  Map, PlaneTakeoff, HelpCircle, Car, Plus, ArrowRight,
  PieChart as PieChartIcon, TrendingUp, ShoppingCart, Search, Eye, Filter
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

// Interactive SVG Pie / Donut Chart Component
const EnquiryPieChart = ({ data, onNavigate }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const size = 220;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-xs text-gray-400 font-bold uppercase tracking-wider">
        <PieChartIcon size={36} className="text-gray-300 mb-2" />
        No enquiry data available yet
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 p-2">
      {/* SVG Donut Chart */}
      <div className="relative w-52 h-52 flex-shrink-0">
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
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                onClick={() => item.link && onNavigate(item.link)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="transition-all duration-300 cursor-pointer"
                title={`Click to view ${item.label}`}
                style={{
                  transformOrigin: 'center',
                  filter: isHovered ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))' : 'none'
                }}
              />
            );
          })}
        </svg>

        {/* Center Total Summary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 leading-none">
            {hoveredIndex !== null ? data[hoveredIndex].value : total}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            {hoveredIndex !== null ? data[hoveredIndex].label : "Total Enquiries"}
          </span>
        </div>
      </div>

      {/* Legend Buttons Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs w-full">
        {data.map((item, index) => {
          const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
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
                  ? "bg-emerald-50/90 border-emerald-400 shadow-md translate-x-0.5 scale-[1.01]"
                  : "bg-slate-50/80 border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-300 hover:shadow-sm"
              }`}
              title={`Click to view ${item.label}`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-800 group-hover:text-emerald-900 truncate">{item.label}</span>
              </div>
              <div className="text-right ml-2 flex-shrink-0 flex items-center gap-1.5">
                <span className="font-black text-slate-900 group-hover:text-emerald-900">{item.value}</span>
                <span className="text-[10px] text-slate-400 font-semibold">({percent}%)</span>
                <ArrowRight size={13} className="text-gray-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
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
    visas: 0,
    visaApplications: 0,
    cantonEnquiries: 0,
    cabBookings: 0,
    productOrders: 0,
    goimomiProducts: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
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
          visas: fetchedStats.visas || 0,
          visaApplications: fetchedStats.visaApplications || 0,
          cantonEnquiries: fetchedStats.cantonEnquiries || 0,
          cabBookings: fetchedStats.cabBookings || 0,
          productOrders: fetchedStats.productOrders || 0,
          goimomiProducts: fetchedStats.goimomiProducts || 0,
        });
        const enquiries = response.data.recentEnquiries || [];
        setRecentEnquiries(enquiries);
        setFilteredEnquiries(enquiries);
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

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEnquiries(recentEnquiries);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredEnquiries(
        recentEnquiries.filter(
          e =>
            (e.name && e.name.toLowerCase().includes(term)) ||
            (e.email && e.email.toLowerCase().includes(term)) ||
            (e.phone && e.phone.toLowerCase().includes(term)) ||
            (e.type && e.type.toLowerCase().includes(term)) ||
            (e.purpose && e.purpose.toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, recentEnquiries]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getEnquiryName = (enquiry) => {
    if (enquiry.name) return enquiry.name;
    if (enquiry.full_name) return enquiry.full_name;
    if (enquiry.first_name) return `${enquiry.first_name} ${enquiry.last_name || ""}`.trim();
    if (enquiry.applicants && enquiry.applicants.length > 0) {
      return `${enquiry.applicants[0].first_name} ${enquiry.applicants[0].last_name || ""}`.trim();
    }
    return "Unknown Customer";
  };

  const getEnquiryPurpose = (enquiry) => {
    if (enquiry.type === 'Visa') {
      return `Visa for ${enquiry.visa_country || 'N/A'} - ${enquiry.visa_title || 'Application'}`;
    }
    if (enquiry.type === 'Canton') {
      return `Phase: ${enquiry.selected_phase || 'N/A'} (${enquiry.business_name || 'N/A'})`;
    }
    if (enquiry.type === 'Cab' || enquiry.type === 'Cab Booking') {
      const vehicle = enquiry.vehicle_name || enquiry.vehicle || 'Cab Transfer';
      const from = enquiry.from_city || 'N/A';
      const to = enquiry.to_city || 'N/A';
      return `${vehicle}: ${from} to ${to}`;
    }
    return enquiry.purpose || enquiry.message || enquiry.destination || enquiry.description || "General Enquiry";
  };

  const getEnquiryContact = (enquiry) => {
    let email = enquiry.email;
    let phone = enquiry.phone;

    if (!email && enquiry.applicants && enquiry.applicants.length > 0) {
      email = enquiry.applicants[0].email;
      phone = enquiry.applicants[0].phone;
    }

    if (enquiry.type === 'Canton') {
      phone = enquiry.whatsapp_number;
    }

    return {
      email: email || "N/A",
      phone: phone || "N/A"
    };
  };

  // Pie Chart Data Setup with direct page links
  const pieChartData = [
    { label: "General Enquiries", value: stats.enquiries, color: "#3b82f6", link: "/admin/general-enquiries" },
    { label: "Cab Enquiries", value: stats.cabEnquiries + stats.cabBookings, color: "#f59e0b", link: "/admin/cab-enquiries" },
    { label: "Cruise Enquiries", value: stats.cruiseEnquiries, color: "#0284c7", link: "/admin/cruise-enquiries" },
    { label: "Hotel Enquiries", value: stats.hotelEnquiries, color: "#10b981", link: "/admin/hotel-enquiries" },
    { label: "Holiday Enquiries", value: stats.holidayEnquiries, color: "#16a34a", link: "/admin/holiday-enquiries" },
    { label: "Umrah Enquiries", value: stats.umrahEnquiries, color: "#8b5cf6", link: "/admin/umrah-enquiries" },
    { label: "Visa Applications", value: stats.visaApplications, color: "#e11d48", link: "/admin/visa-applications" },
    { label: "Canton Enquiries", value: stats.cantonEnquiries, color: "#ea580c", link: "/admin/canton-enquiries" },
    { label: "Product Orders", value: stats.productOrders, color: "#059669", link: "/admin/products" },
  ];

  const totalAllEnquiries = pieChartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="flex bg-gray-100 h-full overflow-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* Top Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp size={22} className="text-emerald-700" />
                Goimomi Analytics & Dashboard Hub
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Live metrics, enquiry distribution, catalog overview, and recent bookings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="bg-[#14532d] hover:bg-[#0f3d21] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh Data
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
              <p className="mt-3 text-sm text-gray-600 font-semibold">Loading dashboard metrics…</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-3 bg-red-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Top 4 Key Performance Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div 
                  onClick={() => navigate("/admin/general-enquiries")}
                  className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-md border border-emerald-700/40 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                  title="Click to view General Enquiries"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Total Enquiries</p>
                      <h2 className="text-3xl font-black mt-1.5">{totalAllEnquiries}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 backdrop-blur-xs group-hover:bg-white/20 transition-all">
                      <HelpCircle size={20} />
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 mt-3 font-medium flex items-center justify-between">
                    <span>Across 9 category streams</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>

                <div 
                  onClick={() => navigate("/admin/packages")}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative cursor-pointer hover:border-green-400 hover:shadow-md transition-all group"
                  title="Click to view Holiday Packages"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Holiday Packages</p>
                      <h2 className="text-3xl font-black text-slate-900 mt-1.5">{stats.packages}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                      <Package size={20} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-3 font-semibold flex items-center justify-between">
                    <span>{stats.itineraryMasters} Itineraries Configured</span>
                    <ArrowRight size={13} className="text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all" />
                  </p>
                </div>

                <div 
                  onClick={() => navigate("/admin/visa-applications")}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative cursor-pointer hover:border-rose-400 hover:shadow-md transition-all group"
                  title="Click to view Visa Applications"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Visa Applications</p>
                      <h2 className="text-3xl font-black text-slate-900 mt-1.5">{stats.visaApplications}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <CreditCard size={20} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-3 font-semibold flex items-center justify-between">
                    <span>{stats.visas} Active Visa Types</span>
                    <ArrowRight size={13} className="text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </p>
                </div>

                <div 
                  onClick={() => navigate("/admin/products")}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group"
                  title="Click to view Product Orders"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Orders</p>
                      <h2 className="text-3xl font-black text-slate-900 mt-1.5">{stats.productOrders}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-3 font-semibold flex items-center justify-between">
                    <span>{stats.goimomiProducts} Products in Catalog</span>
                    <ArrowRight size={13} className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </p>
                </div>

              </div>

              {/* Main Analytics Grid: Donut Pie Chart + Catalog Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left 2 Columns: Donut Pie Chart for Enquiry Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <PieChartIcon size={20} className="text-[#14532d]" />
                      <h2 className="text-base font-bold text-slate-900">Enquiry Distribution Breakdown</h2>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Click any category button to view enquiries
                    </span>
                  </div>

                  <EnquiryPieChart data={pieChartData} onNavigate={(path) => navigate(path)} />
                </div>

                {/* Right 1 Column: Inventory & Quick Actions */}
                <div className="space-y-6">
                  
                  {/* Catalog Inventory Progress Breakdown */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <ClipboardList size={16} className="text-emerald-700" />
                      Inventory & Catalog Breakdown
                    </h3>

                    <div className="space-y-3 text-xs">
                      <button
                        onClick={() => navigate("/admin/packages")}
                        className="w-full text-left p-2 rounded-xl hover:bg-emerald-50/60 transition group cursor-pointer"
                        title="View Holiday Packages"
                      >
                        <div className="flex justify-between font-bold text-slate-700 group-hover:text-emerald-900 mb-1">
                          <span className="flex items-center gap-1.5">Holiday Packages <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                          <span>{stats.packages}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, stats.packages * 2)}%` }}></div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigate("/admin/itinerary-masters")}
                        className="w-full text-left p-2 rounded-xl hover:bg-blue-50/60 transition group cursor-pointer"
                        title="View Itinerary Masters"
                      >
                        <div className="flex justify-between font-bold text-slate-700 group-hover:text-blue-900 mb-1">
                          <span className="flex items-center gap-1.5">Itinerary Masters <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                          <span>{stats.itineraryMasters}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (stats.itineraryMasters / 250) * 100)}%` }}></div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigate("/admin/visas")}
                        className="w-full text-left p-2 rounded-xl hover:bg-purple-50/60 transition group cursor-pointer"
                        title="View Visa Types"
                      >
                        <div className="flex justify-between font-bold text-slate-700 group-hover:text-purple-900 mb-1">
                          <span className="flex items-center gap-1.5">Visa Types <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                          <span>{stats.visas}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min(100, (stats.visas / 100) * 100)}%` }}></div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigate("/admin/products")}
                        className="w-full text-left p-2 rounded-xl hover:bg-teal-50/60 transition group cursor-pointer"
                        title="View Goimomi Products"
                      >
                        <div className="flex justify-between font-bold text-slate-700 group-hover:text-teal-900 mb-1">
                          <span className="flex items-center gap-1.5">Goimomi Products <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                          <span>{stats.goimomiProducts}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-teal-600 h-full rounded-full" style={{ width: `${Math.min(100, (stats.goimomiProducts / 20) * 100)}%` }}></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Plus size={16} className="text-emerald-700" /> Quick Management Shortcuts
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <button
                        onClick={() => navigate("/admin/visa-applications")}
                        className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 flex justify-between items-center transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">🌐 Manage Visa Applications</span>
                        <ArrowRight size={14} className="text-gray-400" />
                      </button>

                      <button
                        onClick={() => navigate("/admin/cab-bookings")}
                        className="w-full p-2.5 bg-amber-50/50 hover:bg-amber-50 border border-amber-200/60 rounded-xl text-left font-bold text-amber-900 flex justify-between items-center transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">🚗 Manage Cab Bookings</span>
                        <ArrowRight size={14} className="text-amber-500" />
                      </button>

                      <button
                        onClick={() => navigate("/admin/products")}
                        className="w-full p-2.5 bg-teal-50/50 hover:bg-teal-50 border border-teal-200/60 rounded-xl text-left font-bold text-teal-900 flex justify-between items-center transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">🛍️ Product Orders & Catalog</span>
                        <ArrowRight size={14} className="text-teal-600" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Recent Enquiries Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users size={18} className="text-[#14532d]" />
                      Recent Customer Enquiries & Activity
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Latest 10 submissions across all enquiry categories</p>
                  </div>

                  {/* Search Filter */}
                  <div className="relative min-w-[240px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search recent enquiries…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                    />
                  </div>
                </div>

                {filteredEnquiries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-[#14532d] text-white">
                        <tr>
                          <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Customer Name</th>
                          <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Category</th>
                          <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Email</th>
                          <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Phone</th>
                          <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Date</th>
                          <th className="text-left py-3 px-4 font-bold uppercase tracking-wider">Purpose / Details</th>
                          <th className="text-center py-3 px-4 font-bold uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredEnquiries.map((enquiry) => (
                          <tr key={`${enquiry.type}-${enquiry.id}`} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                              {getEnquiryName(enquiry)}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                                enquiry.type === 'Holiday' ? 'bg-green-50 text-green-700 border-green-200' :
                                enquiry.type === 'Umrah' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                enquiry.type === 'Cab' || enquiry.type === 'Cab Booking' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                enquiry.type === 'Cruise' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                                enquiry.type === 'Hotel' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                enquiry.type === 'Visa' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                enquiry.type === 'Canton' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                enquiry.type === 'Product Order' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {enquiry.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">
                              {getEnquiryContact(enquiry).email}
                            </td>
                            <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">
                              {getEnquiryContact(enquiry).phone}
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                              {formatDate(enquiry.created_at)}
                            </td>
                            <td className="py-3 px-4 text-gray-700 max-w-[220px] truncate font-medium" title={getEnquiryPurpose(enquiry)}>
                              {getEnquiryPurpose(enquiry)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition shadow-xs flex items-center gap-1 mx-auto cursor-pointer"
                              >
                                <Eye size={12} /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="font-semibold text-xs uppercase tracking-wider">No recent enquiries match your search</p>
                  </div>
                )}
              </div>

            </>
          )}

        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            <div className="bg-gradient-to-r from-[#14532d] to-[#1a6b3d] p-4 text-white flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold">Enquiry Details</h2>
                <p className="text-emerald-200 text-[10px] uppercase font-bold tracking-widest">{selectedEnquiry.type} Enquiry</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Customer Name</p>
                  <p className="font-bold text-gray-900 text-sm">{getEnquiryName(selectedEnquiry)}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Date Submitted</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedEnquiry.created_at || selectedEnquiry.submitted_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Email Address</p>
                  <p className="font-semibold text-blue-600 break-all">{getEnquiryContact(selectedEnquiry).email}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Phone Number</p>
                  <p className="font-semibold text-gray-900">{getEnquiryContact(selectedEnquiry).phone}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] mb-1.5">Purpose / Description</p>
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-800 font-medium leading-relaxed border border-gray-200 max-h-[180px] overflow-y-auto">
                  {getEnquiryPurpose(selectedEnquiry)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
