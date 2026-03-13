import React, { useState, useEffect } from "react";
import api from "../../api";
import { Search, Eye, Trash2, Mail, Phone, MapPin, Pencil, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CabEnquiryManage = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [editingEnquiry, setEditingEnquiry] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/enquiry-form/`);
            // Filter for Cab enquiries
            const cabEnquiries = response.data.filter(e => e.enquiry_type === "Cab");
            setEnquiries(cabEnquiries);
            setFilteredEnquiries(cabEnquiries);
            setError("");
        } catch (err) {
            console.error("Error fetching enquiries:", err);
            setError(`Failed to load enquiries: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = enquiries.filter(enquiry =>
            enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.destination?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEnquiries(filtered);
    }, [searchTerm, enquiries]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            try {
                setLoading(true);
                await api.delete(`${API_BASE_URL}/enquiry-form/${id}/`);
                fetchEnquiries();
            } catch (err) {
                console.error("Error deleting enquiry:", err);
                setError("Failed to delete enquiry. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await api.put(`${API_BASE_URL}/enquiry-form/${editingEnquiry.id}/`, editingEnquiry);
            setEditingEnquiry(null);
            fetchEnquiries();
            alert("Enquiry updated successfully!");
        } catch (err) {
            console.error("Error updating enquiry:", err);
            setError("Failed to update enquiry. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingEnquiry(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}</style>
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                {/* Compact Header */}
                <div className="bg-white border-b border-gray-100 px-4 py-2 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#14532d] p-1.5 rounded-lg text-white">
                            <MapPin size={14} />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-gray-900 tracking-tighter uppercase leading-none">Cab Enquiries</h1>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Manage all taxi and transport requests</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchEnquiries}
                        className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-[9px] font-black uppercase tracking-wider shadow-sm hover:bg-gray-800 transition-all"
                    >
                        Refresh List
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar bg-[#fcfdfc]">
                    <div className="max-w-7xl mx-auto space-y-3">

                        {/* Search Bar */}
                        <div className="relative group max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={14} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, phone, or destination..."
                                className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2 rounded-lg text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                            />
                        </div>

                        {error && (
                            <div className="p-2 px-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px]">⚠</span>
                                    <p className="font-bold text-[10px] uppercase tracking-wider">{error}</p>
                                </div>
                                <button onClick={() => setError("")} className="font-bold px-1 text-xs opacity-50 hover:opacity-100">✕</button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center gap-2 py-10">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#14532d]/10 border-t-[#14532d]"></div>
                                <p className="text-gray-400 font-bold text-[8px] uppercase tracking-[0.2em]">Loading cab enquiries...</p>
                            </div>
                        )}

                        {!loading && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#14532d] text-white">
                                                <th className="px-4 py-2 text-[8px] font-black uppercase tracking-widest">Name</th>
                                                <th className="px-4 py-2 text-[8px] font-black uppercase tracking-widest">Contact</th>
                                                <th className="px-4 py-2 text-[8px] font-black uppercase tracking-widest">Destination</th>
                                                <th className="px-4 py-2 text-[8px] font-black uppercase tracking-widest">Date</th>
                                                <th className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredEnquiries.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-16 text-center text-gray-300">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <MapPin size={24} />
                                                            <p className="text-[8px] font-black uppercase tracking-[0.2em]">
                                                                {searchTerm ? `No enquiries match "${searchTerm}"` : "No cab enquiries found."}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredEnquiries.map((enquiry) => (
                                                    <tr key={enquiry.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                                                        <td className="px-4 py-1.5">
                                                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight group-hover:text-[#14532d] transition-colors">{enquiry.name}</p>
                                                        </td>
                                                        <td className="px-4 py-1.5">
                                                            <div className="space-y-0.5">
                                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-bold">
                                                                    <Phone size={10} className="text-[#14532d]" />
                                                                    {enquiry.phone}
                                                                </div>
                                                                {enquiry.email && (
                                                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                                                                        <Mail size={10} className="text-gray-400" />
                                                                        {enquiry.email}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-1.5">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                                                                <MapPin size={10} className="text-red-400" />
                                                                {enquiry.destination}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-1.5 text-[9px] text-gray-400 whitespace-nowrap font-bold">
                                                            {formatDate(enquiry.created_at)}
                                                        </td>
                                                        <td className="px-4 py-1.5">
                                                            <div className="flex justify-center gap-1.5">
                                                                <button
                                                                    onClick={() => setSelectedEnquiry(enquiry)}
                                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={12} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingEnquiry({ ...enquiry })}
                                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-green-50 text-green-600 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                                                                    title="Edit Enquiry"
                                                                >
                                                                    <Pencil size={12} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(enquiry.id)}
                                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={12} />
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
                        )}
                    </div>
                </div>
            </div>

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">{selectedEnquiry.name}</h2>
                                <div className="flex items-center gap-1 text-[#14532d] font-bold text-[9px] mt-0.5">
                                    <MapPin size={10} />
                                    <span>{selectedEnquiry.destination}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-full"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="space-y-1.5">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Contact Details</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 text-[11px]">
                                        <Phone size={12} className="text-[#14532d]" />
                                        <span className="font-bold text-gray-700">{selectedEnquiry.phone}</span>
                                    </div>
                                    {selectedEnquiry.email && (
                                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 text-[11px]">
                                            <Mail size={12} className="text-[#14532d]" />
                                            <span className="font-bold text-gray-700 truncate">{selectedEnquiry.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Requirements</p>
                                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-gray-600 text-[11px] leading-relaxed min-h-[40px]">
                                    {selectedEnquiry.purpose || "No specific requirements mentioned."}
                                </div>
                            </div>

                            <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                                Received on {formatDate(selectedEnquiry.created_at)}
                            </p>
                        </div>

                        <div className="px-4 pb-4 flex gap-2">
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.open(`tel:${selectedEnquiry.phone}`)}
                                className="flex-1 bg-[#14532d] text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-[#0d2f1f] transition-colors shadow-md"
                            >
                                Call Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Enquiry Modal */}
            {editingEnquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-[#14532d] text-white">
                            <h2 className="text-sm font-black uppercase tracking-tight">Edit Cab Enquiry</h2>
                            <button
                                onClick={() => setEditingEnquiry(null)}
                                className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSave} className="p-4 space-y-3">
                            <div>
                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingEnquiry.name || ""}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editingEnquiry.phone || ""}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editingEnquiry.email || ""}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Destination</label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={editingEnquiry.destination || ""}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Purpose / Requirements</label>
                                <textarea
                                    name="purpose"
                                    value={editingEnquiry.purpose || ""}
                                    onChange={handleEditChange}
                                    rows="3"
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setEditingEnquiry(null)}
                                    className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2 bg-[#14532d] text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-[#0d2f1f] transition-all disabled:opacity-50 shadow-md"
                                >
                                    {isSaving ? "Saving..." : "Update Enquiry"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CabEnquiryManage;
