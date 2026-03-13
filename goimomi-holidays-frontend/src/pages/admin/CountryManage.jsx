import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Globe, Flag } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CountryManage = () => {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/countries/`);
            setCountries(response.data);
            setFilteredCountries(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching countries:", err);
            setError(`Failed to load countries: ${err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = countries.filter(country =>
            (country.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (country.code || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCountries(filtered);
    }, [searchTerm, countries]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this country?")) {
            try {
                setLoading(true);
                await api.delete(`${API_BASE_URL}/countries/${id}/`);
                setMessage("Country deleted successfully!");
                fetchCountries();
            } catch (err) {
                console.error("Error deleting country:", err);
                setError("Failed to delete country.");
            } finally {
                setLoading(false);
            }
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
                <div className="bg-white border-b border-gray-100 px-4 py-2 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
                    <div>
                        <h1 className="text-base font-black text-gray-900 tracking-tighter uppercase">Countries</h1>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none mt-0.5">
                            Geography / Country List
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/countries/add")}
                        className="px-4 py-1.5 rounded-lg bg-[#14532d] text-white text-[9px] font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                        <Plus size={12} />
                        ADD COUNTRY
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar bg-[#fcfdfc]">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {/* Filters & Stats */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search by country name or ISO code..."
                                    className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2 rounded-lg text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="bg-white border border-green-100 rounded-lg py-1.5 px-4 flex items-center gap-4 shadow-sm shrink-0">
                                <div>
                                    <p className="text-[8px] text-[#14532d] font-black uppercase tracking-widest opacity-60">Total Global</p>
                                    <p className="text-lg font-black text-gray-900 leading-none">{countries.length}</p>
                                </div>
                                <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-[#14532d]">
                                    <Globe size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        {message && (
                            <div className="p-2 px-4 bg-green-50 border border-green-100 text-[#14532d] rounded-lg flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px]">✨</span>
                                    <p className="font-bold text-[10px] uppercase tracking-wider">{message}</p>
                                </div>
                                <button onClick={() => setMessage("")} className="text-green-800/50 hover:text-green-800 font-bold px-1 text-xs">✕</button>
                            </div>
                        )}
                        {error && (
                            <div className="p-2 px-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px]">⚠</span>
                                    <p className="font-bold text-[10px] uppercase tracking-wider">{error}</p>
                                </div>
                                <button onClick={() => setError("")} className="text-red-800/50 hover:text-red-800 font-bold px-1 text-xs">✕</button>
                            </div>
                        )}

                        {/* Table */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Country Details</th>
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Country Code</th>
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                        <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em]">Mapping World...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredCountries.length > 0 ? (
                                            filteredCountries.map((country) => (
                                                <tr key={country.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                                                    <td className="px-4 py-1.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#14532d] group-hover:bg-green-50 border border-gray-100 transition-colors">
                                                                <Flag size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black text-gray-900 tracking-tight uppercase group-hover:text-[#14532d] transition-colors">{country.name}</p>
                                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">Global Territory</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-1.5 text-center">
                                                        <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-wider border border-gray-100 group-hover:bg-green-50 group-hover:text-[#14532d] group-hover:border-green-100 transition-colors font-mono">
                                                            {country.code || "---"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-1.5 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <button
                                                                onClick={() => navigate(`/admin/countries/edit/${country.id}`)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(country.id)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-20 text-center text-gray-300">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Globe size={24} />
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">No territories found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em] py-4">
                            Geography Database End
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountryManage;

