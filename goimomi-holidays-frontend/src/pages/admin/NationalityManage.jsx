import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2, Edit2, Plus, Globe, Flag, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const NationalityManage = () => {
    const [nationalities, setNationalities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchNationalities();
    }, []);

    const fetchNationalities = async () => {
        try {
            const response = await axios.get("/api/nationalities/");
            setNationalities(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching nationalities:", error);
            setStatusMessage({ text: "Failed to fetch nationalities", type: "error" });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this nationality?")) {
            try {
                await axios.delete(`/api/nationalities/${id}/`);
                setNationalities(nationalities.filter((n) => n.id !== id));
                setStatusMessage({ text: "Nationality deleted successfully", type: "success" });
            } catch (error) {
                console.error("Error deleting nationality:", error);
                setStatusMessage({ text: "Failed to delete nationality", type: "error" });
            }
        }
    };

    const filteredNationalities = nationalities.filter(
        (n) =>
            (n.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (n.nationality || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
            </style>
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                {/* Action Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Nationalities</h1>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                            <span className="text-green-500">Inventory</span> / <span>Geography</span> / <span className="text-gray-900">Nationality Matrix</span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/nationalities/add")}
                        className="px-6 py-2.5 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={14} />
                        ADD ENTRY
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#fcfdfc]">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Filters & Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3 relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by country, nationality or continent..."
                                    className="w-full bg-white border-2 border-gray-100 pl-14 pr-6 py-3.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="bg-white border-2 border-green-100 rounded-full py-3 px-6 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-[9px] text-[#14532d] font-black uppercase tracking-widest opacity-60">Total Records</p>
                                    <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{nationalities.length}</p>
                                </div>
                                <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-[#14532d]">
                                    <Map size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {statusMessage.text && (
                            <div className={`p-4 rounded-2xl border-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-xl shadow-green-900/5 ${statusMessage.type === "success" ? "bg-green-50 border-green-100 text-[#14532d]" : "bg-red-50 border-red-100 text-red-700"
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl text-lg ${statusMessage.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                                        {statusMessage.type === "success" ? "✨" : "⚠"}
                                    </div>
                                    <p className="font-black text-xs uppercase tracking-wider">{statusMessage.text}</p>
                                </div>
                                <button onClick={() => setStatusMessage({ text: "", type: "" })} className="font-bold px-2 opacity-50 hover:opacity-100">✕</button>
                            </div>
                        )}

                        {/* Table Content */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Geography Details</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Nationality Tag</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Continent</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Scanning Borders...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredNationalities.length > 0 ? (
                                            filteredNationalities.map((n) => (
                                                <tr key={n.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0 font-outfit">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform group-hover:text-[#14532d] group-hover:bg-green-50 border border-gray-100">
                                                                <Flag size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-gray-900 tracking-tight uppercase group-hover:text-[#14532d] transition-colors">{n.country}</p>
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">International Territory</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[11px] font-bold text-gray-700 tracking-tight group-hover:text-[#14532d] transition-colors">
                                                            {n.nationality}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-wider border border-gray-100 group-hover:bg-green-50 group-hover:text-[#14532d] group-hover:border-green-100 transition-colors">
                                                            {n.continent || "Global"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => navigate(`/admin/nationalities/edit/${n.id}`)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm group/btn"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(n.id)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm group/btn"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-32 text-center text-gray-300">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                            <Globe size={32} />
                                                        </div>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No entries discovered</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em] py-8">
                            Geography Matrix Core End
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NationalityManage;
