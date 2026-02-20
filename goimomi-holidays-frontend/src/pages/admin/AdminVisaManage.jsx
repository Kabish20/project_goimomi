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
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">Select visa to change</h1>
                        <button
                            onClick={() => navigate("/admin/visas/add")}
                            className="bg-[#14532d] hover:bg-[#1f7a45] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            ADD VISA
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-sm" ref={dropdownRef}>
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                placeholder="Search visas by country..."
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d] bg-white shadow-sm transition-all text-sm"
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

                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#14532d] text-white">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Country</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Title</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Entry Type</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Validity</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Selling Price</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Active</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
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
                                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-gray-900 border-r">{v.country}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{v.title}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{v.entry_type}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{v.validity}</td>
                                                <td className="py-4 px-6 border-r text-sm font-bold text-gray-900">
                                                    ₹{v.selling_price}
                                                </td>
                                                <td className="py-4 px-6 text-center border-r">
                                                    <button
                                                        onClick={() => handleStatusToggle(v)}
                                                        title={v.is_active ? "Click to deactivate" : "Click to activate"}
                                                        className="hover:scale-110 transition-transform active:scale-95"
                                                    >
                                                        {v.is_active ? (
                                                            <CheckCircle size={24} className="text-green-500 mx-auto" />
                                                        ) : (
                                                            <XCircle size={24} className="text-gray-300 mx-auto" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => navigate(`/admin/visas/edit/${v.id}`)}
                                                            className="flex items-center gap-1.5 bg-[#1f7a45] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(v.id)}
                                                            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700 transition shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
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
