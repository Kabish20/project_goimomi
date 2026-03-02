import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, MapPin, Clock, IndianRupee } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const SightseeingMasterManage = () => {
    const [sightseeings, setSightseeings] = useState([]);
    const [filteredSightseeings, setFilteredSightseeings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [destinations, setDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchSightseeings();
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/destinations/`);
            setDestinations(response.data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
        }
    };

    const fetchSightseeings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/sightseeing-masters/`);
            setSightseeings(response.data);
            setFilteredSightseeings(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching sightseeings:", err);
            setError(`Failed to load sightseeings: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = sightseeings.filter(s => {
            const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDestination = !selectedDestination ||
                s.destination?.toString() === selectedDestination.toString();

            return matchesSearch && matchesDestination;
        });
        setFilteredSightseeings(filtered);
    }, [searchTerm, sightseeings, selectedDestination]);

    const handleEdit = (id) => {
        navigate(`/admin/sightseeing-masters/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this sightseeing?")) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/sightseeing-masters/${id}/`);
                setMessage("Sightseeing deleted successfully!");
                fetchSightseeings();
            } catch (err) {
                console.error("Error deleting sightseeing:", err);
                setError("Failed to delete sightseeing. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-base font-black text-gray-900 uppercase tracking-tighter">Sightseeing Masters</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchSightseeings}
                                className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-700 transition"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => navigate("/admin/sightseeing-masters/add")}
                                className="flex items-center gap-1.5 bg-[#14532d] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#0f4a24] transition"
                            >
                                <Plus size={14} />
                                Add New
                            </button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                        <div className="relative flex-1 max-w-xs">
                            <Search size={14} className="absolute left-3 top-2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search sightseeing..."
                                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 shadow-sm"
                            />
                        </div>

                        <div className="w-48">
                            <SearchableSelect
                                options={destinations.map(d => ({ value: d.id, label: d.name }))}
                                value={selectedDestination}
                                onChange={(val) => setSelectedDestination(val)}
                                placeholder="All Destinations"
                            />
                        </div>

                        {(searchTerm || selectedDestination) && (
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedDestination(""); }}
                                className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
                            <p className="mt-2 text-gray-600">Loading sightseeings...</p>
                        </div>
                    )}

                    {/* Sightseeing Table UI */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Sightseeing Info</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Location & Duration</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Pricing</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading && filteredSightseeings.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredSightseeings.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic text-sm">
                                                {searchTerm || selectedDestination ? `No sightseeing matching your filters...` : "No sightseeing masters created yet."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSightseeings.map((s) => (
                                            <tr key={s.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-10 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform flex items-center justify-center text-gray-300">
                                                            {s.image ? (
                                                                <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <MapPin size={16} />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-xs font-black text-gray-900 tracking-tight truncate uppercase">{s.name}</p>
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                                {destinations.find(d => d.id === s.destination)?.name || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-gray-500">
                                                            <MapPin size={10} />
                                                            <span className="text-[10px] font-bold uppercase tracking-tighter">{s.city || 'Location N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-400">
                                                            <Clock size={10} />
                                                            <span className="text-[9px] font-medium uppercase tracking-widest">{s.duration || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">
                                                    <div className="flex items-center justify-end gap-1 text-[#14532d]">
                                                        <IndianRupee size={11} strokeWidth={3} />
                                                        <span>{Number(s.price || 0).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(s.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm group/btn"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(s.id)}
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SightseeingMasterManage;
