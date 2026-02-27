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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredSightseeings.length === 0 && !loading ? (
                            <div className="col-span-full text-center py-12 text-gray-400 italic text-sm bg-white rounded-xl border-2 border-dashed border-gray-100">
                                {searchTerm || selectedDestination ? `No sightseeing matching your filters...` : "No sightseeing masters created yet."}
                            </div>
                        ) : (
                            filteredSightseeings.map((s) => (
                                <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-xl hover:shadow-[#14532d]/10 transition-all duration-300 flex flex-col">
                                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
                                        {s.image ? (
                                            <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                <MapPin size={32} strokeWidth={1.5} />
                                                <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-white/90 backdrop-blur-sm text-[#14532d] px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm">
                                                {destinations.find(d => d.id === s.destination)?.name || "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3 className="text-[12px] font-black text-gray-900 line-clamp-1 leading-tight">{s.name}</h3>
                                            <div className="flex items-center gap-0.5 text-[#14532d]">
                                                <IndianRupee size={9} strokeWidth={3} />
                                                <span className="text-[11px] font-black tracking-tighter">{s.price || '0'}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1 mb-3">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <MapPin size={9} className="shrink-0" />
                                                <span className="text-[9px] font-bold line-clamp-1 uppercase tracking-tighter">{s.city || 'Location N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Clock size={9} className="shrink-0" />
                                                <span className="text-[9px] font-bold uppercase tracking-tighter">{s.duration || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-gray-50 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(s.id)}
                                                className="flex-1 py-1.5 rounded-lg bg-green-50 text-[#14532d] text-[10px] font-black uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Edit2 size={10} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="w-10 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SightseeingMasterManage;
