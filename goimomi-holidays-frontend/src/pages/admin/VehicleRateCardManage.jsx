import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Map, Calendar, Globe, FileText, Download, Loader2, ChevronDown } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const VehicleRateCardManage = () => {
    const [rateCards, setRateCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [openDownloadId, setOpenDownloadId] = useState(null);

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchRateCards();
    }, []);

    const fetchRateCards = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/vehicle-rate-cards/`);
            const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
            setRateCards(data);
            setFilteredCards(data);
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
                await api.delete(`${API_BASE_URL}/vehicle-rate-cards/${id}/`);
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

    const downloadCSV = (card) => {
        try {
            const vehicles = card.column_vehicles || [];
            const headers = ["Start City", "Start Point", "Drop City", "Drop Point", ...vehicles];
            
            const rows = (card.routes || []).map(r => [
                `"${r.start_city || ""}"`,
                `"${r.start_from || ""}"`,
                `"${r.drop_city || ""}"`,
                `"${r.drop_to || ""}"`,
                ...vehicles.map((_, i) => r[`v${i+1}`] || "0")
            ]);

            const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${card.name.replace(/\s+/g, '_')}_rates.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("CSV Download Error:", err);
            setError("Failed to generate CSV");
        }
    };

    const downloadPDF = (card) => {
        try {
            const doc = new jsPDF();
            
            // Header
            doc.setFillColor(20, 83, 45); // #14532d
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text(card.name.toUpperCase(), 14, 25);
            
            doc.setFontSize(10);
            doc.text(`${card.country} | VALIDITY: ${card.validity_start} TO ${card.validity_end}`, 14, 34);
            
            const vehicles = card.column_vehicles || [];
            const headers = [["START CITY", "START POINT", "DROP CITY", "DROP POINT", ...vehicles.map(v => v.toUpperCase())]];
            
            const data = (card.routes || []).map(r => [
                r.start_city || "-",
                r.start_from || "-",
                r.drop_city || "-",
                r.drop_to || "-",
                ...vehicles.map((_, i) => r[`v${i+1}`] || "0")
            ]);

            autoTable(doc, {
                head: headers,
                body: data,
                startY: 50,
                styles: { fontSize: 8, cellPadding: 3 },
                headStyles: { fillStyle: 'F', fillColor: [20, 83, 45], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 247, 245] },
                margin: { top: 50 }
            });

            doc.save(`${card.name.replace(/\s+/g, '_')}_rates.pdf`);
        } catch (err) {
            console.error("PDF Download Error:", err);
            setError("Failed to generate PDF");
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
                            <h1 className="text-xl font-black tracking-tight leading-none mb-1 uppercase text-[#14532d]">Vehicle Rate Cards</h1>
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
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDownloadId(openDownloadId === c.id ? null : c.id);
                                                                }}
                                                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm active:scale-90 ${openDownloadId === c.id ? 'bg-[#14532d] text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                                                title="Download Options"
                                                            >
                                                                <Download size={16} />
                                                            </button>
                                                            
                                                            {openDownloadId === c.id && (
                                                                <>
                                                                    <div 
                                                                        className="fixed inset-0 z-[60]" 
                                                                        onClick={() => setOpenDownloadId(null)}
                                                                    ></div>
                                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-50 z-[70] overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                                                                        <div className="px-4 py-1 mb-1">
                                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Export As</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => { downloadPDF(c); setOpenDownloadId(null); }}
                                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                                                        >
                                                                            <Download size={14} className="text-purple-500" />
                                                                            PDF Document
                                                                        </button>
                                                                         <button
                                                                            onClick={() => { downloadCSV(c); setOpenDownloadId(null); }}
                                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                                        >
                                                                            <FileText size={14} className="text-blue-500" />
                                                                            CSV Spreadsheet
                                                                        </button>
                                                                        {c.rate_card_file && (
                                                                            <a
                                                                                href={c.rate_card_file}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold text-[#14532d] hover:bg-green-50 transition-colors border-t border-gray-50 mt-1"
                                                                                onClick={() => setOpenDownloadId(null)}
                                                                            >
                                                                                <Upload size={14} className="text-[#14532d]" />
                                                                                Uploaded File
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => handleEdit(c.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(c.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
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
