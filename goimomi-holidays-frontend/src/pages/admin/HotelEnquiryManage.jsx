import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Trash2, Mail, Phone, Hotel } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const HotelEnquiryManage = () => {
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
            // Filter for Hotel enquiries
            const hotelEnquiries = response.data.filter(e => e.enquiry_type === "Hotel");
            setEnquiries(hotelEnquiries);
            setFilteredEnquiries(hotelEnquiries);
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
                                <Hotel size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Hotel Booking Enquiries</h1>
                                <p className="text-sm text-gray-500">Manage all premium accommodation requests</p>
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
                                placeholder="Search by name, phone, or hotel location..."
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
                            <p className="mt-2 text-gray-600">Loading hotel enquiries...</p>
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
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Location</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Date</th>
                                            <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredEnquiries.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-16 text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Hotel size={48} className="text-gray-200" />
                                                        {searchTerm ? `No enquiries match "${searchTerm}"` : "No hotel enquiries found."}
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
                                                            <span className="w-2 h-2 rounded-full bg-[#14532d]"></span>
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

                    {/* Enquiry Detail Modal */}
                    {selectedEnquiry && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="bg-[#14532d] p-6 text-white flex justify-between items-center">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Hotel size={20} /> Hotel Enquiry Details
                                    </h2>
                                    <button
                                        onClick={() => setSelectedEnquiry(null)}
                                        className="text-white/80 hover:text-white transition-colors text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase">Customer Name</p>
                                            <p className="font-semibold text-gray-900">{selectedEnquiry.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase">Location/Hotel</p>
                                            <p className="font-semibold text-[#14532d]">
                                                {selectedEnquiry.destination}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Contact Details</p>
                                        <div className="space-y-2 mt-2">
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <Phone size={18} className="text-[#14532d]" />
                                                <span className="font-medium">{selectedEnquiry.phone}</span>
                                            </div>
                                            {selectedEnquiry.email && (
                                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <Mail size={18} className="text-[#14532d]" />
                                                    <span className="font-medium">{selectedEnquiry.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Stay Requirements</p>
                                        <div className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-700 min-h-[100px]">
                                            {selectedEnquiry.purpose || "No specific details mentioned."}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 text-center">
                                        <p className="text-xs text-gray-400">Enquiry received on {formatDate(selectedEnquiry.created_at)}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 flex gap-3">
                                    <button
                                        onClick={() => setSelectedEnquiry(null)}
                                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.open(`mailto:${selectedEnquiry.email}`);
                                        }}
                                        className="flex-1 bg-[#14532d] text-white py-3 rounded-xl font-bold hover:bg-[#0f3d21] transition-colors shadow-lg shadow-[#14532d]/20"
                                    >
                                        Email Customer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelEnquiryManage;
