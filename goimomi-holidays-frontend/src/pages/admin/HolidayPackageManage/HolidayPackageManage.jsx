import React, { useState, useEffect, useMemo } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Package, Image as ImageIcon, Filter, Eye, X } from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import SearchableSelect from "../../../components/admin/SearchableSelect/SearchableSelect";

const HolidayPackageManage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startingCities, setStartingCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/packages/?all=true`);
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      setPackages(data);
      setFilteredPackages(data);
      setError("");
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError(`Failed to load packages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitiesAndRegions = async () => {
    try {
      const [citiesRes, regionsRes] = await Promise.all([
        api.get('/api/cities/'),
        api.get('/api/regions/')
      ]);
      setStartingCities(citiesRes.data || []);
      setRegions(regionsRes.data || []);
    } catch (err) {
      console.error("Error fetching cities/regions:", err);
    }
  };

  useEffect(() => {
    fetchCitiesAndRegions();
  }, []);

  const combinedCityOptions = React.useMemo(() => {
    const groups = {};
    const addToGroups = (item, type) => {
      if (!item || !item.name) return;
      const country = (item.country_name || item.country || "Other").toString().toUpperCase();
      if (!groups[country]) groups[country] = [];
      const exists = groups[country].find(opt => opt.value === item.name);
      if (!exists) {
        groups[country].push({
          value: item.name,
          label: item.name,
          subtitle: type === 'city' ? (item.region_name || item.region || 'City') : 'Region'
        });
      }
    };
    startingCities.forEach(c => addToGroups(c, 'city'));
    regions.forEach(r => addToGroups(r, 'region'));
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, options]) => ({
        label: country,
        options: options.sort((a, b) => a.label.localeCompare(b.label))
      }));
  }, [startingCities, regions]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(packages.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [packages]);

  useEffect(() => {
    const filtered = packages.filter(pkg => {
      const matchesSearch = !searchTerm || 
        pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.starting_city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !selectedCity || pkg.starting_city === selectedCity;
      const matchesCategory = !selectedCategory || pkg.category === selectedCategory;
      
      return matchesSearch && matchesCity && matchesCategory;
    });
    setFilteredPackages(filtered);
  }, [searchTerm, packages, selectedCity, selectedCategory]);

  const handleEdit = (pkg) => {
    navigate(`/admin/packages/edit/${pkg.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        setLoading(true);
        await api.delete(`${API_BASE_URL}/packages/${id}/`);
        setMessage("Package deleted successfully!");
        fetchPackages();
      } catch (err) {
        console.error("Error deleting package:", err);
        setError("Failed to delete package. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusToggle = async (pkg) => {
    try {
      setLoading(true);
      // Use PATCH to only update is_active without needing full package data
      await api.patch(`${API_BASE_URL}/packages/${pkg.id}/`, { is_active: !pkg.is_active });
      setMessage(`Package ${!pkg.is_active ? "activated" : "deactivated"} successfully!`);
      fetchPackages();
    } catch (err) {
      console.error("Error toggling status:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
      </style>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        {/* Action Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Holiday Package</h1>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
              <span className="text-green-500">Inventory</span> / <span>Packages</span> / <span className="text-gray-900">Live Management</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/admin/packages/add")}
              className="px-6 py-2.5 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              NEW PACKAGE
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats & Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
              {/* Search */}
              <div className="md:col-span-3 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search by package name, destination or details..."
                  className="w-full bg-white border-2 border-gray-100 pl-14 pr-6 py-3.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* City / Region Filter */}
              <div className="md:col-span-2 relative group flex items-center gap-2">
                <div className="flex-1">
                  <SearchableSelect
                    options={[
                      { value: "", label: "All Cities / Regions" },
                      ...combinedCityOptions
                    ]}
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="Filter by Starting City..."
                    className="!rounded-full !py-2.5 !border-gray-100"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-2 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 px-5 py-3.5 rounded-full text-[10px] font-black text-gray-700 uppercase tracking-widest focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Filter size={13} />
                </div>
              </div>

              {/* Count Badge */}
              <div className="bg-white border-2 border-green-100 rounded-full py-3 px-6 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[9px] text-[#14532d] font-black uppercase tracking-widest opacity-60">Packages</p>
                  <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{filteredPackages.length}</p>
                </div>
                <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-[#14532d]">
                  <Package size={16} />
                </div>
              </div>
            </div>

            {/* Notification Messages */}
            {message && (
              <div className="p-5 bg-green-50 border-2 border-green-100 text-[#14532d] rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl text-lg">✨</div>
                  <p className="font-black text-xs uppercase tracking-wider">{message}</p>
                </div>
                <button onClick={() => setMessage("")} className="text-green-800/50 hover:text-green-800 font-bold px-2">✕</button>
              </div>
            )}
            {error && (
              <div className="p-5 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl text-lg">⚠</div>
                  <p className="font-black text-xs uppercase tracking-wider">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-red-800/50 hover:text-red-800 font-bold px-2">✕</button>
              </div>
            )}

            {/* Packages Table UI */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 min-w-[200px]">Package Info</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 min-w-[150px]">Details</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right min-w-[100px]">Pricing</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center min-w-[100px]">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading && packages.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform flex items-center justify-center text-gray-400">
                                <Package size={20} />
                              </div>
                              <div className="min-w-0 overflow-hidden">
                                <p className="text-[13px] font-black text-gray-900 tracking-tight truncate uppercase" title={pkg.title || pkg.name}>{pkg.title || pkg.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: GO-PA-{String(pkg.h_id || pkg.id).padStart(4, '0')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-green-50 text-[#14532d] text-[9px] font-black uppercase tracking-wider border border-green-100/50">
                                  {pkg.category || 'Global'}
                                </span>
                                <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
                                  {pkg.days} Days / {pkg.starting_city}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-[14px] font-black text-gray-900 leading-none">₹{Number(pkg.Offer_price || pkg.offer_price || pkg.price || 0).toLocaleString('en-IN')}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleStatusToggle(pkg)}
                              disabled={loading}
                              className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] transition-all border ${pkg.is_active
                                ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                : "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                                }`}
                            >
                              {pkg.is_active ? "LIVE" : "DRAFT"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedPackage(pkg)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm group/btn"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleEdit(pkg)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm group/btn"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(pkg.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm group/btn"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && filteredPackages.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-32 text-center text-gray-300">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                              <Search size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matching packages found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em] py-8">
              End of Inventory Feed
            </p>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 bg-[#14532d] text-white flex justify-between items-center shrink-0">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-green-300 text-[9px] font-black uppercase tracking-widest border border-white/10">
                  {selectedPackage.category || "Global"}
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight mt-2">{selectedPackage.title || selectedPackage.name}</h2>
                <p className="text-[10px] font-bold text-green-200/80 uppercase tracking-widest mt-1">ID: GO-PA-{String(selectedPackage.h_id || selectedPackage.id).padStart(4, '0')}</p>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all active:scale-95 border border-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[#fcfdfc]">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                  <p className="text-base font-black text-gray-900 mt-1">{selectedPackage.days} Days</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Starting City</p>
                  <p className="text-base font-black text-[#14532d] mt-1">{selectedPackage.starting_city || "Any City"}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ending City</p>
                  <p className="text-base font-black text-gray-900 mt-1">{selectedPackage.ending_city || "N/A"}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                  <p className="text-base font-black text-gray-900 mt-1">₹{Number(selectedPackage.Offer_price || selectedPackage.offer_price || selectedPackage.price || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Description */}
              {selectedPackage.description && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</h4>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed whitespace-pre-line">{selectedPackage.description}</p>
                </div>
              )}

              {/* Highlights, Inclusions, Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Highlights */}
                {((selectedPackage.highlights_raw && selectedPackage.highlights_raw.length > 0 && selectedPackage.highlights_raw[0]) || (selectedPackage.highlights && selectedPackage.highlights.length > 0)) && (
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-black text-[#14532d] uppercase tracking-widest">Highlights</h4>
                    <ul className="space-y-2">
                      {(selectedPackage.highlights_raw || selectedPackage.highlights || []).map((h, i) => {
                        const txt = typeof h === 'string' ? h : h.text;
                        return txt && <li key={i} className="text-[11px] font-bold text-gray-600 flex gap-2"><span className="text-green-500">✦</span> {txt}</li>;
                      })}
                    </ul>
                  </div>
                )}

                {/* Inclusions */}
                {((selectedPackage.inclusions_raw && selectedPackage.inclusions_raw.length > 0 && selectedPackage.inclusions_raw[0]) || (selectedPackage.inclusions && selectedPackage.inclusions.length > 0)) && (
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Inclusions</h4>
                    <ul className="space-y-2">
                      {(selectedPackage.inclusions_raw || selectedPackage.inclusions || []).map((inc, i) => {
                        const txt = typeof inc === 'string' ? inc : inc.text;
                        return txt && <li key={i} className="text-[11px] font-bold text-gray-600 flex gap-2"><span className="text-blue-500">✓</span> {txt}</li>;
                      })}
                    </ul>
                  </div>
                )}

                {/* Exclusions */}
                {((selectedPackage.exclusions_raw && selectedPackage.exclusions_raw.length > 0 && selectedPackage.exclusions_raw[0]) || (selectedPackage.exclusions && selectedPackage.exclusions.length > 0)) && (
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Exclusions</h4>
                    <ul className="space-y-2">
                      {(selectedPackage.exclusions_raw || selectedPackage.exclusions || []).map((exc, i) => {
                        const txt = typeof exc === 'string' ? exc : exc.text;
                        return txt && <li key={i} className="text-[11px] font-bold text-gray-600 flex gap-2"><span className="text-red-500">✕</span> {txt}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Day Wise Itinerary */}
              {selectedPackage.itinerary && selectedPackage.itinerary.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-[#14532d] uppercase tracking-[0.2em]">Day Wise Itinerary</h4>
                  <div className="space-y-4">
                    {selectedPackage.itinerary.map((day, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4 hover:border-green-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-green-50 text-[#14532d] flex items-center justify-center font-black text-xs shrink-0 border border-green-100">
                          {idx + 1}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h5 className="text-xs font-black text-gray-900 uppercase tracking-wide">{day.title || `Day ${idx + 1}`}</h5>
                          <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-line">{day.description || "No description provided."}</p>
                          {/* Daily details (sightseeing, meals, transfers) if they exist */}
                          {day.details_json && (day.details_json.sightseeing?.length > 0 || day.details_json.meals?.length > 0 || day.details_json.transfers?.length > 0) && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
                              {day.details_json.meals && day.details_json.meals.filter(m => m && m !== 'No Meals').map((m, mi) => (
                                <span key={`meal-${mi}`} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[8px] font-black uppercase tracking-wider border border-amber-100">🍽 {m}</span>
                              ))}
                              {day.details_json.sightseeing && day.details_json.sightseeing.filter(Boolean).map((s, si) => (
                                <span key={`sight-${si}`} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase tracking-wider border border-indigo-100">👁 {s}</span>
                              ))}
                              {day.details_json.transfers && day.details_json.transfers.filter(Boolean).map((t, ti) => (
                                <span key={`trans-${ti}`} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[8px] font-black uppercase tracking-wider border border-blue-100">🚗 {t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayPackageManage;



