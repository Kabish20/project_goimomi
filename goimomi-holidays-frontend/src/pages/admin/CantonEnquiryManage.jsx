import React, { useState, useEffect } from "react";
import api from "../../api";
import { Search, Eye, Trash2, Mail, Phone, ArrowLeft, Building2, Flag, Calendar, Edit, Save, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useNavigate } from "react-router-dom";

const CantonEnquiryManage = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/canton-enquiries/`);
            const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
            setEnquiries(data);
            setFilteredEnquiries(data);
            setError("");
        } catch (err) {
            console.error("Error fetching canton enquiries:", err);
            setError(`Failed to load canton enquiries: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = enquiries.filter(enquiry =>
            enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.whatsapp_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.selected_phase?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEnquiries(filtered);
    }, [searchTerm, enquiries]);

    const handleEditEnquiry = () => {
        setIsEditing(true);
        setEditForm({ ...selectedEnquiry });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);
            await api.patch(`${API_BASE_URL}/canton-enquiries/${selectedEnquiry.id}/`, editForm);
            const updated = { ...selectedEnquiry, ...editForm };
            setSelectedEnquiry(updated);
            setFilteredEnquiries(filteredEnquiries.map(e => e.id === updated.id ? updated : e));
            setEnquiries(enquiries.map(e => e.id === updated.id ? updated : e));
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update enquiry.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            try {
                setLoading(true);
                await api.delete(`${API_BASE_URL}/canton-enquiries/${id}/`);
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
        return new Date(dateString).toLocaleDateString();
    };

    const handleCloseModal = () => {
        setSelectedEnquiry(null);
        setIsEditing(false);
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">Canton Fair Enquiries</h1>
                        </div>
                        <button
                            onClick={fetchEnquiries}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            Refresh List
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
                            <p className="mt-2 text-gray-600">Loading enquiries...</p>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#14532d] text-white">
                                    <tr>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[10px] tracking-wider">Full Name</th>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[10px] tracking-wider">WhatsApp</th>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[10px] tracking-wider">Business</th>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[10px] tracking-wider">Phase</th>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[10px] tracking-wider">Date</th>
                                        <th className="text-center py-2 px-4 font-semibold uppercase text-[10px] tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredEnquiries.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-10 text-gray-500">
                                                {searchTerm ? `No enquiries match "${searchTerm}"` : "No canton enquiries found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEnquiries.map((enquiry) => (
                                            <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-2 px-4 font-bold text-xs text-gray-900 border-r">{enquiry.full_name}</td>
                                                <td className="py-2 px-4 border-r text-[11px]">
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={12} className="text-gray-400" />
                                                        {enquiry.whatsapp_number}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 border-r text-[11px]">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 size={12} className="text-gray-400" />
                                                        {enquiry.business_name}
                                                    </div>
                                                </td>
                                                <td className="py-1.5 px-4 border-r">
                                                    <span className="px-1.5 py-0.5 text-[8px] font-black rounded uppercase bg-amber-50 text-amber-700 border border-amber-100">
                                                        {enquiry.selected_phase?.split('(')[0].trim()}
                                                    </span>
                                                </td>
                                                <td className="py-1.5 px-4 text-[10px] whitespace-nowrap border-r">
                                                    {formatDate(enquiry.created_at)}
                                                </td>
                                                <td className="py-1.5 px-4">
                                                    <div className="flex gap-1.5 justify-center">
                                                        <button
                                                            onClick={() => setSelectedEnquiry(enquiry)}
                                                            className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase"
                                                        >
                                                            <Eye size={10} />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(enquiry.id)}
                                                            className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase"
                                                        >
                                                            <Trash2 size={10} />
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
                    </div>
                </div>
            </div>

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 font-sans">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
                            <div className="flex flex-col flex-1">
                                {isEditing ? (
                                    <input
                                        name="full_name"
                                        value={editForm.full_name || ""}
                                        onChange={handleEditChange}
                                        className="text-base font-black text-gray-900 border border-gray-300 rounded px-2 py-0.5 focus:ring-1 focus:ring-[#14532d] outline-none max-w-[180px]"
                                    />
                                ) : (
                                    <h2 className="text-base font-black text-gray-900 leading-tight truncate">{selectedEnquiry.full_name}</h2>
                                )}
                                <div className="flex items-center gap-1.5 text-[#14532d] font-bold text-[9px] mt-0.5">
                                    <span className="bg-gray-100 px-1 py-0.5 rounded uppercase tracking-wider text-gray-500">Canton Enq</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 mr-8">
                                {!isEditing ? (
                                    <button onClick={handleEditEnquiry} className="flex items-center gap-1 bg-green-50 text-[#14532d] px-2 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-green-100 transition-colors">
                                        <Edit size={12} /> Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-1">
                                        <button onClick={handleCancelEdit} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-gray-200">
                                            Cancel
                                        </button>
                                        <button onClick={handleUpdate} disabled={isUpdating} className="flex items-center gap-1 bg-[#14532d] text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-[#0f4a24]">
                                            <Save size={12} /> {isUpdating ? "..." : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleCloseModal}
                                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-full text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[80vh]">
                            <div className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                                    <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                                        <div className="bg-white p-1 rounded shadow-sm">
                                            <Phone size={12} className="text-[#14532d]" />
                                        </div>
                                        <span className="font-bold text-gray-700 text-[11px] flex-1">
                                            {isEditing ? <input name="whatsapp_number" value={editForm.whatsapp_number || ""} onChange={handleEditChange} className="w-full border border-gray-300 rounded px-1.5 py-0.5 font-normal text-[10px]" /> : selectedEnquiry.whatsapp_number}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Business Details</p>
                                    <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                                        <div className="bg-white p-1 rounded shadow-sm">
                                            <Building2 size={12} className="text-[#14532d]" />
                                        </div>
                                        <span className="font-bold text-gray-700 text-[11px] flex-1">
                                            {isEditing ? <input name="business_name" value={editForm.business_name || ""} onChange={handleEditChange} className="w-full border border-gray-300 rounded px-1.5 py-0.5 font-normal text-[10px]" /> : selectedEnquiry.business_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selected Phase</p>
                                    <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                                        <div className="bg-white p-1 rounded shadow-sm">
                                            <Flag size={12} className="text-[#14532d]" />
                                        </div>
                                        <span className="font-bold text-gray-700 text-[11px] flex-1">
                                            {isEditing ? (
                                                <select name="selected_phase" value={editForm.selected_phase || ""} onChange={handleEditChange} className="w-full border border-gray-300 rounded px-1.5 py-0.5 font-normal text-[10px]">
                                                    <option value="Phase 1 (Electronics & Machinery)">Phase 1</option>
                                                    <option value="Phase 2 (Consumers Goods & Gifts)">Phase 2</option>
                                                    <option value="Phase 3 (Fashion & Medical)">Phase 3</option>
                                                </select>
                                            ) : selectedEnquiry.selected_phase}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-1 text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Submitted on {formatDate(selectedEnquiry.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 flex gap-2 border-t border-gray-100">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 bg-white border border-gray-200 text-gray-700 py-1.5 rounded-lg font-black text-[10px] uppercase hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedEnquiry.id);
                                    handleCloseModal();
                                }}
                                className="flex-1 bg-red-600 text-white py-1.5 rounded-lg font-black text-[10px] uppercase hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CantonEnquiryManage;
