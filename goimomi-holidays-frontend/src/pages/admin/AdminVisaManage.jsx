import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Trash2, Edit2, CheckCircle, XCircle, ChevronDown, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminVisaManage = () => {
    const [visas, setVisas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [countries, setCountries] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchVisas();
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get("/api/countries/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchVisas = async () => {
        try {
            const response = await axios.get("/api/visas/?all=true");
            setVisas(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching visas:", error);
            setStatusMessage({ text: "Failed to fetch visas", type: "error" });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this visa?")) {
            try {
                await axios.delete(`/api/visas/${id}/`);
                setVisas(visas.filter((v) => v.id !== id));
                setStatusMessage({ text: "Visa deleted successfully", type: "success" });
            } catch (error) {
                console.error("Error deleting visa:", error);
                setStatusMessage({ text: "Failed to delete visa", type: "error" });
            }
        }
    };

    const handleStatusToggle = async (visa) => {
        try {
            await axios.patch(`/api/visas/${visa.id}/`, { is_active: !visa.is_active });
            setVisas(visas.map((v) => (v.id === visa.id ? { ...v, is_active: !v.is_active } : v)));
            setStatusMessage({
                text: `Visa ${!visa.is_active ? "activated" : "deactivated"} successfully`,
                type: "success",
            });
        } catch (error) {
            console.error("Error toggling visa status:", error);
            setStatusMessage({ text: "Failed to toggle visa status", type: "error" });
        }
    };

    const filteredVisas = visas.filter(
        (v) =>
            v.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-4 bg-[#fcfdfc]">
                    <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90 rounded-2xl mb-4">
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Visa Inventory</h1>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                                <span className="text-green-500">Inventory</span> / <span>Visas</span> / <span className="text-gray-900">Live Management</span>
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/admin/visas/add")}
                            className="px-6 py-2 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            ADD VISA
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative max-w-sm group" ref={dropdownRef}>
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                placeholder="Search visas by country..."
                                className="w-full bg-white border-2 border-gray-100 pl-11 pr-10 py-2.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                            />
                            <button
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                    <div
                                        className="px-4 py-2.5 hover:bg-green-50 cursor-pointer text-gray-700 font-bold text-xs uppercase tracking-wider border-b border-gray-50 flex items-center justify-between"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <span>Show All Visas</span>
                                        {searchTerm === "" && <div className="w-1.5 h-1.5 rounded-full bg-[#14532d]" />}
                                    </div>
                                    {countries
                                        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((country) => (
                                            <div
                                                key={country.id}
                                                className={`px-4 py-2.5 hover:bg-green-50 cursor-pointer text-sm flex items-center justify-between transition-colors ${searchTerm.toLowerCase() === country.name.toLowerCase() ? 'bg-green-50 text-[#14532d] font-bold' : 'text-gray-600'}`}
                                                onClick={() => {
                                                    setSearchTerm(country.name);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={14} className={searchTerm.toLowerCase() === country.name.toLowerCase() ? 'text-[#14532d]' : 'text-gray-400'} />
                                                    <span>{country.name}</span>
                                                </div>
                                                {searchTerm.toLowerCase() === country.name.toLowerCase() && <div className="w-1.5 h-1.5 rounded-full bg-[#14532d]" />}
                                            </div>
                                        ))}
                                    {countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && searchTerm && (
                                        <div className="px-4 py-3 text-gray-400 italic text-[11px] text-center bg-gray-50 font-medium">
                                            No country matches "{searchTerm}"<br />
                                            <span className="text-[10px] mt-1 block not-italic">Filtering by title instead...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex justify-between items-center ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            <span>{statusMessage.text}</span>
                            <button onClick={() => setStatusMessage({ text: "", type: "" })}>✕</button>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Country</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Title</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Entry Type</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Validity</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Pricing</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Active</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-10">
                                                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredVisas.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-10 text-gray-500">
                                                No visas found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVisas.map((v) => (
                                            <tr key={v.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0 hover:shadow-inner">
                                                <td className="px-6 py-3 font-black text-gray-900 text-xs">{v.country}</td>
                                                <td className="px-6 py-3 text-xs font-bold text-gray-500">{v.title}</td>
                                                <td className="px-6 py-3 text-xs font-bold text-gray-400">{v.entry_type}</td>
                                                <td className="px-6 py-3 text-[10px] font-bold text-gray-400">{v.validity}</td>
                                                <td className="px-6 py-3 text-xs font-black text-gray-900">
                                                    ₹{Number(v.selling_price || 0).toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <button
                                                        onClick={() => handleStatusToggle(v)}
                                                        className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] transition-all border ${v.is_active
                                                            ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                                            : "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                                                            }`}
                                                    >
                                                        {v.is_active ? "LIVE" : "DRAFT"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => navigate(`/admin/visas/edit/${v.id}`)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(v.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
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
                        <div className="p-4 bg-gray-50 border-t text-sm text-gray-500 font-medium">
                            {filteredVisas.length} visas
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVisaManage;
