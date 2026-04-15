import React, { useState, useEffect, useMemo } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
    Plus, Search, MapPin, Trash2, Edit3, MoreVertical,
    Filter, Download, ChevronRight, Loader, AlertCircle, X, Check, Save, RefreshCcw
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const PickupPointManage = () => {
    const navigate = useNavigate();
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCity, setFilterCity] = useState("All");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingPoint, setEditingPoint] = useState(null);
    const [formData, setFormData] = useState({ name: "", city: "" });
    const [allCities, setAllCities] = useState([]);
    const [allRegions, setAllRegions] = useState([]);
    const [citySearch, setCitySearch] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchPoints();
        fetchCities();
    }, []);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/pickup-point-masters/");
            setPoints(res.data);
        } catch (err) {
            console.error("Error fetching points:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const [citiesRes, regionsRes] = await Promise.all([
                api.get('/api/cities/'),
                api.get('/api/regions/')
            ]);
            const citiesData = Array.isArray(citiesRes.data) ? citiesRes.data : (citiesRes.data?.results || []);
            const regionsData = Array.isArray(regionsRes.data) ? regionsRes.data : (regionsRes.data?.results || []);
            setAllCities(citiesData);
            setAllRegions(regionsData);
        } catch (err) {
            console.error("Error fetching cities/regions:", err);
        }
    };

    // Build combined city+region options grouped by country (same pattern as HolidayPackageAdd)
    const combinedCityOptions = useMemo(() => {
        const groups = {};
        const addToGroups = (item, type) => {
            if (!item || !item.name) return;
            const country = (item.country_name || item.country || "Other").toString().toUpperCase();
            if (!groups[country]) groups[country] = [];
            const exists = groups[country].find(opt => opt.value === item.id && opt.type === type);
            if (!exists) {
                groups[country].push({
                    value: item.id,
                    id: item.id,
                    name: item.name,
                    type,
                    label: item.name,
                    subtitle: type === 'city'
                        ? (item.region_name || item.region || 'City')
                        : 'Region'
                });
            }
        };
        allCities.forEach(c => addToGroups(c, 'city'));
        allRegions.forEach(r => addToGroups(r, 'region'));
        return Object.entries(groups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([country, options]) => ({
                label: country,
                options: options.sort((a, b) => a.label.localeCompare(b.label))
            }));
    }, [allCities, allRegions]);

    // Filtered suggestions based on city search input
    const citySuggestions = useMemo(() => {
        if (!citySearch.trim()) return [];
        const q = citySearch.toLowerCase();
        const results = [];
        combinedCityOptions.forEach(group => {
            group.options.forEach(opt => {
                if (opt.label.toLowerCase().includes(q)) {
                    results.push({ ...opt, country: group.label });
                }
            });
        });
        return results;
    }, [citySearch, combinedCityOptions]);

    const handleOpenModal = (point = null) => {
        if (point) {
            setEditingPoint(point);
            setFormData({ name: point.name, city: point.city });
            setCitySearch(point.city_name || "");
        } else {
            setEditingPoint(null);
            setFormData({ name: "", city: "" });
            setCitySearch("");
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.city) {
            showToast("Point name and city are required.", "error");
            return;
        }

        try {
            setIsSaving(true);
            if (editingPoint) {
                await api.put(`/api/pickup-point-masters/${editingPoint.id}/`, formData);
                showToast("Point updated successfully!");
            } else {
                await api.post("/api/pickup-point-masters/", formData);
                showToast("New pickup point added!");
            }
            setShowModal(false);
            fetchPoints();
        } catch (err) {
            console.error("Error saving point:", err);
            showToast("Error saving pickup point.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pickup point?")) return;
        try {
            await api.delete(`/api/pickup-point-masters/${id}/`);
            showToast("Point deleted.");
            setPoints(points.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting point:", err);
            showToast("Failed to delete point.", "error");
        }
    };

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const uniqueCities = ["All", ...new Set(points.map(p => p.city_name))];

    const filteredPoints = points.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.city_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = filterCity === "All" || p.city_name === filterCity;
        return matchesSearch && matchesCity;
    });

    return (
        <div className="flex bg-gray-50 h-screen overflow-hidden font-outfit">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                {/* Toast */}
                {toast && (
                    <div className={`fixed top-20 right-8 px-6 py-3 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-wider shadow-2xl z-[100] border border-white/20 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}>
                        {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
                        {toast.msg}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#fcfdfc]">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">Pickup Point Master</h1>
                                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Global inventory of standardized pickup locations</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={fetchPoints} className="p-2.5 bg-white text-gray-400 rounded-xl border border-gray-100 hover:text-[#14532d] transition-all shadow-sm">
                                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                                </button>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="bg-[#14532d] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-green-800"
                                >
                                    <Plus size={14} /> Add New Point
                                </button>
                            </div>
                        </div>

                        {/* Filters & Search */}
                        <div className="bg-white p-4 rounded-[1.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full group">
                                <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by point name or city..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 border-0 pl-14 pr-6 py-3 rounded-2xl text-[10px] font-bold text-gray-900 focus:ring-4 focus:ring-[#14532d]/5 transition-all placeholder:text-gray-300 uppercase tracking-widest"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="w-10 h-10 flex items-center justify-center bg-[#14532d] text-white rounded-xl shadow-lg shadow-green-900/10">
                                    <Filter size={16} />
                                </div>
                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className="bg-gray-50 border-0 px-6 py-3 rounded-xl text-[10px] font-bold text-gray-900 focus:ring-4 focus:ring-[#14532d]/5 transition-all min-w-[200px] uppercase tracking-widest appearance-none cursor-pointer"
                                >
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Content Section */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-4">
                                <Loader className="animate-spin text-[#14532d]" size={40} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Syncing Master Inventory...</p>
                            </div>
                        ) : filteredPoints.length > 0 ? (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-12">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[200px]">Discovery & Info</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[180px]">City / Location</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[180px]">Admin Region</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredPoints.map((point) => (
                                                <tr key={point.id} className="group hover:bg-[#f8faf8] transition-all last:border-0">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#14532d] group-hover:bg-[#14532d] group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 group-hover:scale-105 group-hover:rotate-3">
                                                                <MapPin size={16} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <span className="text-[13px] font-black text-gray-900 group-hover:text-[#14532d] transition-colors leading-none mb-1.5 block truncate uppercase">{point.name}</span>
                                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded w-fit border border-gray-100 group-hover:bg-white transition-colors">ID: #{point.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                                                                <span className="text-[12px] font-bold text-gray-700 uppercase tracking-tight">{point.city_name}</span>
                                                            </div>
                                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-3">Standardized Hub</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5 whitespace-nowrap">Assigned Region</span>
                                                            <span className="text-[12px] font-bold text-gray-700 uppercase truncate">{point.region_name || "Primary Region"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleOpenModal(point)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-400 hover:text-[#14532d] hover:bg-green-50 transition-all shadow-sm border border-gray-50 hover:border-green-100 active:scale-90"
                                                                title="Edit Point"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(point.id)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-gray-50 hover:border-red-100 active:scale-90"
                                                                title="Remove Point"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[4rem] p-32 border border-dashed border-gray-200 text-center shadow-xl shadow-gray-100/50">
                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-200">
                                    <AlertCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase mb-3 tracking-tighter">No Pickup Points Found</h3>
                                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">
                                    The global inventory doesn't contain any records based on your current search criteria. Try broadening your scope.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(""); setFilterCity("All"); }}
                                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#14532d] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/20"
                                >
                                    Reset Selection
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl" onClick={() => setShowModal(false)} />
                        <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-white/20 animate-in zoom-in-95 duration-500">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-[#14532d] to-green-900 px-8 py-6 text-white relative rounded-t-[2rem] overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 overflow-hidden opacity-10 pointer-events-none">
                                    <MapPin size={120} className="-rotate-12 translate-x-12 translate-y-12" />
                                </div>
                                <div className="flex justify-between items-center mb-1 relative z-10">
                                    <h3 className="text-xl font-black uppercase tracking-tighter">{editingPoint ? "Update Point" : "New Pickup Point"}</h3>
                                    <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-[11px] text-white/60 font-black uppercase tracking-[0.25em] relative z-10">{editingPoint ? `Updating Global ID: #${editingPoint.id}` : "Configure a new standard location"}</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSave} className="p-8 space-y-6 bg-[#fcfdfc] rounded-b-[2rem]">
                                <div className="space-y-5">
                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Pickup Point Name</label>
                                        <div className="relative">
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Terminal 1 Gate 4"
                                                className="w-full bg-white border-2 border-gray-100 px-5 py-3 rounded-2xl text-[12px] font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:ring-8 focus:ring-[#14532d]/5 transition-all shadow-sm"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-[#14532d]/10 transition-colors pointer-events-none">
                                                <MapPin size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                                            City / Region
                                            <span className="text-[8px] text-[#14532d] bg-green-50 px-1.5 py-0.5 rounded ml-2 border border-green-100">Cities &amp; Regions</span>
                                        </label>
                                        <div className="relative">
                                            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" />
                                            <input
                                                required
                                                value={citySearch}
                                                onChange={e => {
                                                    setCitySearch(e.target.value);
                                                    if (!e.target.value) setFormData(prev => ({ ...prev, city: "" }));
                                                }}
                                                placeholder="Search city or region..."
                                                className="w-full bg-white border-2 border-gray-100 pl-16 pr-6 py-3 rounded-2xl text-[12px] font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:ring-8 focus:ring-[#14532d]/5 transition-all shadow-sm"
                                            />
                                            {citySearch && citySuggestions.length > 0 && !formData.city && (
                                                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-h-64 overflow-y-auto z-[310] p-3 space-y-1 custom-scrollbar animate-in fade-in slide-in-from-top-4">
                                                    {citySuggestions.map(opt => (
                                                        <button
                                                            key={`${opt.type}-${opt.id}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, city: opt.id }));
                                                                setCitySearch(opt.label);
                                                            }}
                                                            className="w-full text-left px-5 py-3 hover:bg-[#f8faf8] rounded-xl transition-all flex justify-between items-center group/item"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-[12px] font-bold text-gray-800 group-hover/item:text-[#14532d]">{opt.label}</span>
                                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{opt.subtitle}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                                                    opt.type === 'region'
                                                                        ? 'bg-blue-50 text-blue-500'
                                                                        : 'bg-green-50 text-[#14532d]'
                                                                }`}>
                                                                    {opt.type}
                                                                </span>
                                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{opt.country}</span>
                                                                <ChevronRight size={10} className="text-gray-200 group-hover/item:text-[#14532d] transition-colors" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {formData.city && (
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-[#14532d] text-white rounded-full p-1 shadow-lg shadow-green-900/20">
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-50 text-gray-400 border border-gray-100 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-[2] bg-[#14532d] text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-green-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={18} />}
                                        {editingPoint ? "Update Inventory" : "Secure Inventory"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PickupPointManage;
