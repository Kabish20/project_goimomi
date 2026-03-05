import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, User, Phone, MessageSquare, CreditCard, FileText } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const DriverMasterManage = () => {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/driver-masters/`);
            setDrivers(response.data);
            setFilteredDrivers(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching drivers:", err);
            setError(`Failed to load drivers: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = drivers.filter(d => {
            const matchesSearch = d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.id_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
        setFilteredDrivers(filtered);
    }, [searchTerm, drivers]);

    const handleEdit = (id) => {
        navigate(`/admin/driver-masters/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/driver-masters/${id}/`);
                setMessage("Driver deleted successfully!");
                fetchDrivers();
            } catch (err) {
                console.error("Error deleting driver:", err);
                setError("Failed to delete driver. Please try again.");
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

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">Driver Masters</h1>
                            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Manage your driver database</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={fetchDrivers}
                                className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-700 transition active:scale-95 shadow-lg shadow-gray-900/10"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => navigate("/admin/driver-masters/add")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0f4a24] transition active:scale-95 shadow-lg shadow-green-900/10"
                            >
                                <Plus size={16} />
                                Add New Driver
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
                                placeholder="Search by name, ID or mobile number..."
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
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Driver Info</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Contact Details</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">ID Documentation</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading && drivers.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredDrivers.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic text-sm font-medium">
                                                {searchTerm ? `No drivers matching "${searchTerm}"` : "No drivers in database."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDrivers.map((d) => (
                                            <tr key={d.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform flex items-center justify-center text-gray-300">
                                                            {d.photo ? (
                                                                <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User size={20} />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-xs font-black text-gray-900 tracking-tight truncate uppercase leading-tight">{d.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase">Registered on {new Date(d.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700">
                                                            <Phone size={12} className="text-green-600" />
                                                            <span>{d.mobile_number}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700">
                                                            <MessageSquare size={12} className="text-blue-500" />
                                                            <span>{d.whatsapp_number}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700 uppercase">
                                                            <CreditCard size={12} className="text-gray-400" />
                                                            <span>{d.id_no}</span>
                                                        </div>
                                                        {d.id_copy && (
                                                            <a
                                                                href={d.id_copy}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[9px] font-black text-[#14532d] uppercase tracking-widest hover:underline"
                                                            >
                                                                <FileText size={10} />
                                                                View ID Copy
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(d.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(d.id)}
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

export default DriverMasterManage;
