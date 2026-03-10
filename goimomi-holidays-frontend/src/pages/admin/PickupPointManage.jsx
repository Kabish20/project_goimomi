import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
    Plus, Search, MapPin, Trash2, Edit3, MoreVertical,
    Filter, Download, ChevronRight, Loader, AlertCircle
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const PickupPointManage = () => {
    const navigate = useNavigate();
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCity, setFilterCity] = useState("All");

    useEffect(() => {
        fetchPoints();
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pickup point?")) return;
        try {
            await api.delete(`/api/pickup-point-masters/${id}/`);
            setPoints(points.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting point:", err);
            alert("Failed to delete point.");
        }
    };

    const uniqueCities = ["All", ...new Set(points.map(p => p.city_name))];

    const filteredPoints = points.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.city_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = filterCity === "All" || p.city_name === filterCity;
        return matchesSearch && matchesCity;
    });

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">Pickup Point Master</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Manage standardized pickup locations across cities</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-white text-gray-400 rounded-xl border border-gray-100 hover:text-gray-600 transition-all shadow-sm">
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => navigate("/admin/pickup-point-masters/add")}
                                    className="bg-[#14532d] text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} /> Add New Points
                                </button>
                            </div>
                        </div>

                        {/* Filters & Search */}
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Search by point name or city..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 border-0 pl-11 pr-4 py-3 rounded-2xl text-[11px] font-bold text-gray-900 focus:ring-2 focus:ring-[#14532d]/10 transition-all placeholder:text-gray-400 uppercase tracking-widest"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="p-3 bg-gray-50 rounded-2xl text-[#14532d]">
                                    <Filter size={16} />
                                </div>
                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className="bg-gray-50 border-0 px-4 py-3 rounded-2xl text-[11px] font-bold text-gray-900 focus:ring-2 focus:ring-[#14532d]/10 transition-all min-w-[150px] uppercase tracking-widest"
                                >
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Content Section */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Loader className="animate-spin text-[#14532d]" size={40} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Master Inventory...</p>
                            </div>
                        ) : filteredPoints.length > 0 ? (
                            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Point Info</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Location</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Status</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredPoints.map((point) => (
                                            <tr key={point.id} className="group hover:bg-green-50/30 transition-all border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-[#14532d] group-hover:bg-[#14532d] group-hover:text-white transition-all duration-300 shadow-sm">
                                                            <MapPin size={18} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-gray-900 group-hover:text-[#14532d] transition-colors uppercase tracking-tight">{point.name}</span>
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">#{point.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="px-2.5 py-1 bg-green-50 text-[#14532d] text-[9px] font-black rounded-lg border border-green-100 uppercase tracking-wider">
                                                            {point.city_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                        Inventory Managed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/pickup-point-masters/edit/${point.id}`)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm active:scale-95"
                                                            title="Edit"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(point.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] p-20 border border-dashed border-gray-200 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <AlertCircle size={40} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase mb-2">No Pickup Points Found</h3>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest max-w-xs mx-auto mb-8">
                                    We couldn't find any pickup points matching your current filters or search terms.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(""); setFilterCity("All"); }}
                                    className="text-[10px] font-black text-[#14532d] uppercase tracking-[0.2em] underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickupPointManage;
