import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Trash2, Mail, Phone, MapPin } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CabEnquiryManage = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/enquiry-form/`);
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
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#14532d] p-2 rounded-lg text-white">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Cab Booking Enquiries</h1>
                                <p className="text-sm text-gray-500">Manage all taxi and transport requests</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchEnquiries}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm"
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
                                placeholder="Search by name, phone, or destination..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d] bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
                            <p className="mt-2 text-gray-600">Loading cab enquiries...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#14532d] text-white">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Name</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Contact</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Destination</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Date</th>
                                            <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredEnquiries.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-16 text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <MapPin size={48} className="text-gray-200" />
                                                        {searchTerm ? `No enquiries match "${searchTerm}"` : "No cab enquiries found."}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredEnquiries.map((enquiry) => (
                                                <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="font-semibold text-gray-900">{enquiry.name}</div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <Phone size={14} className="text-[#14532d]" />
                                                                {enquiry.phone}
                                                            </div>
                                                            {enquiry.email && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <Mail size={14} className="text-gray-400" />
                                                                    {enquiry.email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                                            <MapPin size={14} className="text-red-500" />
                                                            {enquiry.destination}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                                        {formatDate(enquiry.created_at)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => setSelectedEnquiry(enquiry)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(enquiry.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
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

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex flex-col">
                                <h2 className="text-lg font-black text-gray-900 leading-tight">{selectedEnquiry.name}</h2>
                                <div className="flex items-center gap-1.5 text-[#14532d] font-bold text-[10px] mt-0.5">
                                    <MapPin size={12} />
                                    <span>{selectedEnquiry.destination}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full"
                            >
                                <span className="text-xl">×</span>
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="p-5 space-y-4">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Details</p>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 group hover:border-[#14532d]/30 transition-colors text-sm">
                                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                <Phone size={14} className="text-[#14532d]" />
                                            </div>
                                            <span className="font-bold text-gray-700">{selectedEnquiry.phone}</span>
                                        </div>
                                        {selectedEnquiry.email && (
                                            <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 group hover:border-[#14532d]/30 transition-colors text-sm">
                                                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                    <Mail size={14} className="text-[#14532d]" />
                                                </div>
                                                <span className="font-bold text-gray-700 truncate">{selectedEnquiry.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requirement Description</p>
                                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-gray-600 text-[13px] leading-relaxed min-h-[60px]">
                                        {selectedEnquiry.purpose || "No specific requirements mentioned."}
                                    </div>
                                </div>

                                <div className="pt-1 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Received on {formatDate(selectedEnquiry.created_at)}</p>
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
                                    window.open(`tel:${selectedEnquiry.phone}`);
                                }}
                                className="flex-1 bg-[#14532d] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#0d2f1f] transition-colors shadow-lg shadow-[#14532d]/20"
                            >
                                Call Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CabEnquiryManage;
