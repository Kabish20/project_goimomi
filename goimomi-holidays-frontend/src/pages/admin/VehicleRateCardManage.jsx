import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Map, Calendar, Globe } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const VehicleRateCardManage = () => {
    const [rateCards, setRateCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchRateCards();
    }, []);

    const fetchRateCards = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/vehicle-rate-cards/`);
            setRateCards(response.data);
            setFilteredCards(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching rate cards:", err);
            setError(`Failed to load rate cards: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = rateCards.filter(c => {
            const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.country?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
        setFilteredCards(filtered);
    }, [searchTerm, rateCards]);

    const handleEdit = (id) => {
        navigate(`/admin/vehicle-rate-cards/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this rate card?")) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/vehicle-rate-cards/${id}/`);
                setMessage("Rate card deleted successfully!");
                fetchRateCards();
            } catch (err) {
                console.error("Error deleting rate card:", err);
                setError("Failed to delete rate card. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex bg-gray-100 h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase text-[#14532d]">Vehicle Rate Cards</h1>
                            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Route-based pricing inventory</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={fetchRateCards}
                                className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-700 transition active:scale-95 shadow-lg shadow-gray-900/10"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => navigate("/admin/vehicle-rate-cards/add")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0f4a24] transition active:scale-95 shadow-lg shadow-green-900/10"
                            >
                                <Plus size={16} />
                                Add Rate Card
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or country..."
                                className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center w-16">#</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Rate Card Info</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Validity Period</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Routes</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading && rateCards.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Fetching Rates...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredCards.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic text-sm font-medium">
                                                {searchTerm ? `No rate cards matching "${searchTerm}"` : "No rate cards found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCards.map((c, idx) => (
                                            <tr key={c.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-[10px] font-black text-gray-300 group-hover:text-[#14532d] transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 tracking-tight uppercase leading-tight">{c.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-1 text-[8px] font-black text-[#14532d] uppercase tracking-wider bg-green-50 px-1.5 py-0.5 rounded border border-green-100/50">
                                                                <Globe size={10} />
                                                                {c.country}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                                                            <Calendar size={12} className="text-gray-300" />
                                                            <span>{c.validity_start} — {c.validity_end}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100/50 uppercase tracking-widest whitespace-nowrap">
                                                            <Map size={12} />
                                                            {c.routes?.length || 0} Routes Configured
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(c.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(c.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
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

export default VehicleRateCardManage;
