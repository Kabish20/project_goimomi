import React, { useState, useEffect } from "react";
import api from "../../api";
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
            const response = await api.get("/api/nationalities/");
            setNationalities(Array.isArray(response.data) ? response.data : (response.data?.results || []));
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
                await api.delete(`/api/nationalities/${id}/`);
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
                <div className="bg-white border-b border-gray-100 px-4 py-2 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
                    <div>
                        <h1 className="text-base font-black text-gray-900 tracking-tighter uppercase">Nationalities</h1>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none mt-0.5">
                            Geography / Nationality Matrix
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/nationalities/add")}
                        className="px-4 py-1.5 rounded-lg bg-[#14532d] text-white text-[9px] font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                        <Plus size={12} />
                        ADD ENTRY
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
                                    placeholder="Search by country, nationality or continent..."
                                    className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2 rounded-lg text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="bg-white border border-green-100 rounded-lg py-1.5 px-4 flex items-center gap-4 shadow-sm shrink-0">
                                <div>
                                    <p className="text-[8px] text-[#14532d] font-black uppercase tracking-widest opacity-60">Total Records</p>
                                    <p className="text-lg font-black text-gray-900 leading-none">{nationalities.length}</p>
                                </div>
                                <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-[#14532d]">
                                    <Map size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {statusMessage.text && (
                            <div className={`p-2 px-4 rounded-lg border flex items-center justify-between shadow-sm ${statusMessage.type === "success" ? "bg-green-50 border-green-100 text-[#14532d]" : "bg-red-50 border-red-100 text-red-700"
                                }`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px]">{statusMessage.type === "success" ? "✨" : "⚠"}</span>
                                    <p className="font-bold text-[10px] uppercase tracking-wider">{statusMessage.text}</p>
                                </div>
                                <button onClick={() => setStatusMessage({ text: "", type: "" })} className="font-bold px-1 opacity-50 hover:opacity-100 text-xs">✕</button>
                            </div>
                        )}

                        {/* Table Content */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Geography Details</th>
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Nationality Tag</th>
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Continent</th>
                                            <th className="px-4 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                        <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em]">Loading...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredNationalities.length > 0 ? (
                                            filteredNationalities.map((n) => (
                                                <tr key={n.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0 font-outfit">
                                                    <td className="px-4 py-1.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#14532d] group-hover:bg-green-50 border border-gray-100 transition-colors">
                                                                <Flag size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black text-gray-900 tracking-tight uppercase group-hover:text-[#14532d] transition-colors">{n.country}</p>
                                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">INTL Territory</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-1.5">
                                                        <span className="text-[10px] font-bold text-gray-700 tracking-tight group-hover:text-[#14532d] transition-colors uppercase">
                                                            {n.nationality}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-1.5 text-center">
                                                        <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[8px] font-black uppercase tracking-wider border border-gray-100 group-hover:bg-green-50 group-hover:text-[#14532d] group-hover:border-green-100 transition-colors">
                                                            {n.continent || "Global"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-1.5 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <button
                                                                onClick={() => navigate(`/admin/nationalities/edit/${n.id}`)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(n.id)}
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
                                                <td colSpan="4" className="px-4 py-20 text-center text-gray-300">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Globe size={24} />
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">No entries discovered</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em] py-4">
                            Geography Matrix Core End
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NationalityManage;
