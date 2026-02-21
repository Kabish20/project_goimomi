import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Trash2, Mail, Phone, ArrowLeft, MapPin } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useNavigate } from "react-router-dom";

const GeneralEnquiryManage = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/enquiry-form/`);
            // Filter for only General/None enquiries (not Cab, Cruise, or Hotel)
            const generalData = response.data.filter(e => !e.enquiry_type || e.enquiry_type === 'General');
            setEnquiries(generalData);
            setFilteredEnquiries(generalData);
            setError("");
        } catch (err) {
            console.error("Error fetching general enquiries:", err);
            setError(`Failed to load general enquiries: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = enquiries.filter(enquiry =>
            enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEnquiries(filtered);
    }, [searchTerm, enquiries]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/enquiry-form/${id}/`);
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

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin/enquiries")}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">General Website Enquiries</h1>
                        </div>
                        <button
                            onClick={fetchEnquiries}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            Refresh List
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search enquiries by name, phone, or purpose..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d]"
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
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Name</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Contact</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Purpose</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Date</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredEnquiries.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-10 text-gray-500">
                                                {searchTerm ? `No enquiries match "${searchTerm}"` : "No general enquiries found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEnquiries.map((enquiry) => (
                                            <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-gray-900 border-r">{enquiry.name}</td>
                                                <td className="py-4 px-6 border-r">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone size={14} className="text-gray-400" />
                                                            {enquiry.phone}
                                                        </div>
                                                        {enquiry.email && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail size={14} className="text-gray-400" />
                                                                {enquiry.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {enquiry.purpose}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm whitespace-nowrap">
                                                    {formatDate(enquiry.created_at)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => setSelectedEnquiry(enquiry)}
                                                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            <Eye size={12} />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(enquiry.id)}
                                                            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            <Trash2 size={12} />
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-black text-gray-900 leading-tight">{selectedEnquiry.name}</h2>
                                <div className="flex items-center gap-1.5 text-[#14532d] font-bold text-[10px] mt-0.5">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wider text-gray-500">General Enquiry</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full"
                            >
                                <Eye size={18} className="rotate-45" /> {/* Close icon fix or simple X */}
                                <span className="text-xl">×</span>
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="p-5 space-y-4">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 transition-colors">
                                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                <Phone size={14} className="text-[#14532d]" />
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm">{selectedEnquiry.phone}</span>
                                        </div>
                                        {selectedEnquiry.email && (
                                            <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 transition-colors">
                                                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                    <Mail size={14} className="text-[#14532d]" />
                                                </div>
                                                <span className="font-bold text-gray-700 truncate text-sm">{selectedEnquiry.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message / Purpose</p>
                                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-gray-600 text-[13px] leading-relaxed min-h-[60px]">
                                        {selectedEnquiry.purpose || "No details provided"}
                                    </div>
                                </div>

                                <div className="pt-1 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Submitted on {formatDate(selectedEnquiry.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedEnquiry.id);
                                    setSelectedEnquiry(null);
                                }}
                                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Delete Enquiry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralEnquiryManage;
