import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
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
            const response = await axios.get(`${API_BASE_URL}/countries/`);
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
                await axios.delete(`${API_BASE_URL}/countries/${id}/`);
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
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 tracking-tight uppercase">Manage Countries</h1>
                        <button
                            onClick={() => navigate("/admin/countries/add")}
                            className="flex items-center gap-2 bg-[#14532d] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0f3d21] transition-all shadow-md active:scale-95"
                        >
                            <Plus size={16} />
                            Add Country
                        </button>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search countries by name or code..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                            <span className="font-medium">{message}</span>
                            <button onClick={() => setMessage("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Code</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {loading ? (
                                        <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-medium">Loading countries...</td></tr>
                                    ) : filteredCountries.length > 0 ? (
                                        filteredCountries.map((country) => (
                                            <tr key={country.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">{country.name}</td>
                                                <td className="px-6 py-4 font-mono text-gray-500">{country.code || "---"}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/countries/edit/${country.id}`)}
                                                            className="p-2 text-[#14532d] hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(country.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-medium italic">No countries found matching your search.</td></tr>
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

export default CountryManage;
