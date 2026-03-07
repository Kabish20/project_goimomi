import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, MapPin, Star, Phone, Mail, Globe, Image as ImageIcon, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AccommodationManage = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [filteredAccommodations, setFilteredAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const fetchAccommodations = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/accommodations/`);
            const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
            setAccommodations(data);
            setFilteredAccommodations(data);
            setError("");
        } catch (err) {
            console.error("Error fetching accommodations:", err);
            setError(`Failed to load accommodations: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = accommodations.filter(a => {
            return (
                a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredAccommodations(filtered);
    }, [searchTerm, accommodations]);

    const handleEdit = (id) => {
        navigate(`/admin/accommodations/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this accommodation?")) {
            try {
                setLoading(true);
                await api.delete(`${API_BASE_URL}/accommodations/${id}/`);
                setMessage("Accommodation deleted successfully!");
                fetchAccommodations();
            } catch (err) {
                console.error("Error deleting accommodation:", err);
                setError("Failed to delete accommodation. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden font-sans text-gray-900">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none mb-1">Accommodations</h1>
                            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.15em]">Manage stay properties</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="pl-8 pr-3 py-1.5 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-bold w-40 focus:outline-none focus:border-[#14532d] focus:ring-4 focus:ring-[#14532d]/5 transition-all shadow-sm"
                                />
                            </div>
                            <button
                                onClick={() => navigate("/admin/accommodations/add")}
                                className="flex items-center gap-1.5 bg-[#14532d] text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Plus size={12} strokeWidth={3} />
                                Add New
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                            <div className="p-3 bg-green-50 border-2 border-green-100/50 text-[#14532d] rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    {message}
                                </div>
                                <button onClick={() => setMessage("")} className="hover:rotate-90 transition-transform p-0.5"><X size={12} /></button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/30">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100/50">Property Information</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100/50">Location</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100/50">Contact info</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Fetching Real-time Data...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredAccommodations.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-32 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-30">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                                        <Search size={32} />
                                                    </div>
                                                    <p className="font-black text-[12px] uppercase tracking-widest text-gray-500">No properties found</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Try a different search term or add a new stay</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAccommodations.map((a) => (
                                            <tr key={a.id} className="group hover:bg-[#fcfdfc] transition-all duration-300 border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-10 rounded-xl bg-gray-50 overflow-hidden shrink-0 border-2 border-white shadow-sm transition-all group-hover:scale-110 flex items-center justify-center text-gray-300 relative">
                                                            {a.images && a.images.length > 0 ? (
                                                                <img src={a.images[0].image} alt={a.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ImageIcon size={16} />
                                                            )}
                                                            <div className="absolute bottom-0.5 right-0.5 bg-[#14532d] text-white text-[7px] font-black px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {a.star_category?.split(' ')[0]}★
                                                            </div>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h3 className="text-[12px] font-black text-gray-900 tracking-tight truncate uppercase leading-none mb-1">{a.name}</h3>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="flex text-amber-400">
                                                                    {Array.from({ length: parseInt(a.star_category) || 0 }).map((_, i) => (
                                                                        <Star key={i} size={7} fill="currentColor" strokeWidth={0} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[8px] font-black text-gray-400 uppercase bg-gray-100 px-1 py-0.5 rounded">{a.star_category || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-gray-600">
                                                            <MapPin size={9} className="text-[#14532d]" />
                                                            <span className="text-[10px] font-black uppercase">{a.city}</span>
                                                        </div>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]" title={a.address}>
                                                            {a.address || 'No address'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {a.phone && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Phone size={9} className="text-blue-500" />
                                                                <span className="text-[9px] font-bold text-gray-600">{a.phone}</span>
                                                            </div>
                                                        )}
                                                        {a.email && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Mail size={9} className="text-purple-500" />
                                                                <span className="text-[9px] font-bold text-gray-500 truncate max-w-[120px]">{a.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <button
                                                            onClick={() => handleEdit(a.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all"
                                                        >
                                                            <Edit2 size={12} strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(a.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={12} strokeWidth={2.5} />
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

export default AccommodationManage;
