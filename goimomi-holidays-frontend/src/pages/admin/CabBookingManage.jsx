import React, { useState, useEffect } from "react";
import api from "../../api";
import { Search, Eye, Trash2, Phone, MapPin, Calendar, Clock, Plane, Luggage, MessageSquare, X, Mail, Plus, FileText } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const CabBookingManage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingBooking, setEditingBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [newAdditionalDocs, setNewAdditionalDocs] = useState([]);
    const [docsToRemove, setDocsToRemove] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
    const [statusFilter, setStatusFilter] = useState("All");
    const [editSections, setEditSections] = useState({});
    const [invoiceSearch, setInvoiceSearch] = useState("");

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchBookings();
        fetchDrivers();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/cab-bookings/`);
            setBookings(response.data);
            setFilteredBookings(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError(`Failed to load bookings: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/driver-masters/`);
            const driverOptions = response.data.map(d => ({
                value: d.name,
                label: d.name
            }));
            setDrivers(driverOptions);
        } catch (err) {
            console.error("Error fetching drivers:", err);
        }
    };

    useEffect(() => {
        let filtered = bookings.filter(booking => {
            const matchesSearch =
                booking.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.from_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.to_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.vehicle_name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
            const matchesInvoice = !invoiceSearch || booking.invoice_number?.toLowerCase().includes(invoiceSearch.toLowerCase());

            return matchesSearch && matchesStatus && matchesInvoice;
        });

        // Sort by pickup_date
        filtered.sort((a, b) => {
            const dateA = new Date(a.pickup_date);
            const dateB = new Date(b.pickup_date);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        setFilteredBookings(filtered);
    }, [searchTerm, bookings, sortOrder, statusFilter, invoiceSearch]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                setLoading(true);
                await api.delete(`${API_BASE_URL}/cab-bookings/${id}/`);
                fetchBookings();
            } catch (err) {
                console.error("Error deleting booking:", err);
                setError("Failed to delete booking. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const handleEditSave = async (e, section = null) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            setIsSaving(true);
            const formData = new FormData();

            // Append all fields from editingBooking
            Object.keys(editingBooking).forEach(key => {
                if (key === 'additional_documents') return;
                if (editingBooking[key] !== null && editingBooking[key] !== undefined) {
                    formData.append(key, editingBooking[key]);
                }
            });

            // Append new additional documents
            formData.append('additional_docs_count', newAdditionalDocs.length);
            newAdditionalDocs.forEach((doc, index) => {
                if (doc.file) {
                    formData.append(`additional_doc_${index}`, doc.file);
                    formData.append(`additional_doc_name_${index}`, doc.name || `Document ${index + 1}`);
                }
            });

            // Append removal IDs
            if (docsToRemove.length > 0) {
                formData.append('remove_doc_ids', JSON.stringify(docsToRemove));
            }

            await api.put(`${API_BASE_URL}/cab-bookings/${editingBooking.id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (!section) {
                setEditingBooking(null);
                setNewAdditionalDocs([]);
                setDocsToRemove([]);
                alert("Booking updated successfully!");
            } else {
                toggleSection(section);
            }
            fetchBookings();
        } catch (err) {
            console.error("Error updating booking:", err);
            setError("Failed to update booking. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const addAdditionalDoc = () => {
        setNewAdditionalDocs([...newAdditionalDocs, { name: "", file: null }]);
    };

    const removeNewDoc = (index) => {
        setNewAdditionalDocs(newAdditionalDocs.filter((_, i) => i !== index));
    };

    const updateNewDoc = (index, field, value) => {
        const updated = [...newAdditionalDocs];
        updated[index][field] = value;
        setNewAdditionalDocs(updated);
    };

    const markForRemoval = (docId) => {
        setDocsToRemove([...docsToRemove, docId]);
    };

    const toggleSection = (section) => {
        setEditSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingBooking(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const formData = new FormData();
            formData.append('status', newStatus);

            const response = await api.put(`${API_BASE_URL}/cab-bookings/${bookingId}/`, formData);

            // Update local state to reflect change immediately
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            setFilteredBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) {
            console.error("Error updating status:", err);
            setError("Failed to update status. Please try again.");
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#14532d] p-2 rounded-lg text-white">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Cab Bookings</h1>
                                <p className="text-sm text-gray-500">Manage all vehicle bookings and transfer requests</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchBookings}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm"
                        >
                            Refresh List
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, phone, or route..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d] bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div className="md:w-64 flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d] bg-white transition-all shadow-sm text-sm font-semibold text-gray-700"
                            >
                                <option value="All">All Status</option>
                                <option value="Booking requested">Booking requested</option>
                                <option value="Tentative Confirmation">Tentative Confirmation</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <div className="relative flex-1">
                                <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    value={invoiceSearch}
                                    onChange={(e) => setInvoiceSearch(e.target.value)}
                                    placeholder="Invoice No..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d] bg-white transition-all shadow-sm text-sm"
                                />
                            </div>
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
                            <p className="mt-2 text-gray-600">Loading bookings...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#14532d] text-white">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">Guest</th>
                                            <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">Route & Vehicle</th>
                                            <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">Type & Time</th>
                                            <th
                                                className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider cursor-pointer hover:bg-[#0d2f1f] transition-colors"
                                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Pickup Date
                                                    <span className="text-[8px] opacity-70">
                                                        {sortOrder === "asc" ? "▲" : "▼"}
                                                    </span>
                                                </div>
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">Status</th>
                                            <th className="text-center py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredBookings.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-16 text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <MapPin size={48} className="text-gray-200" />
                                                        {searchTerm ? `No bookings match "${searchTerm}"` : "No cab bookings found."}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredBookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-2.5 px-4">
                                                        <div className="font-semibold text-gray-900">{booking.title} {booking.first_name} {booking.last_name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
                                                            <span className="flex items-center gap-1 whitespace-nowrap"><Phone size={10} /> {booking.phone}</span>
                                                            {booking.email && (
                                                                <span className="flex items-center gap-1 whitespace-nowrap"><Mail size={10} /> {booking.email}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {booking.from_city} → {booking.to_city}
                                                        </div>
                                                        <div className="text-[10px] text-[#14532d] font-black uppercase tracking-widest mt-0.5">
                                                            {booking.vehicle_name}
                                                        </div>
                                                        {booking.driver && (
                                                            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-gray-500 italic">
                                                                Driver: {booking.driver}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <div className={`text-[10px] font-black uppercase tracking-widest inline-block px-2 py-0.5 rounded-full ${booking.transfer_type === 'airport' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {booking.transfer_type}
                                                        </div>
                                                        {booking.transfer_type === 'airport' ? (
                                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                <Plane size={10} /> {booking.flight_number || "N/A"}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                <Clock size={10} /> {booking.pickup_time || "N/A"}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {formatDate(booking.pickup_date)}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <div className="flex items-center gap-2 justify-center whitespace-nowrap">
                                                            <select
                                                                value={booking.status || 'Booking requested'}
                                                                onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                                                className={`text-[10px] font-black uppercase tracking-widest inline-block px-2 py-1 rounded-full cursor-pointer border-none outline-none appearance-none text-center ${booking.status === 'Tentative Confirmation' ? 'bg-green-100 text-green-700' :
                                                                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                        booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                                            'bg-blue-100 text-blue-700'
                                                                    }`}
                                                                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                                            >
                                                                <option value="Booking requested" className="bg-white text-gray-900">Booking requested</option>
                                                                <option value="Tentative Confirmation" className="bg-white text-gray-900">Tentative Confirmation</option>
                                                                <option value="Completed" className="bg-white text-gray-900">Completed</option>
                                                                <option value="Cancelled" className="bg-white text-gray-900">Cancelled</option>
                                                            </select>
                                                            {booking.invoice_number && (
                                                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-normal rounded border border-emerald-100">
                                                                    <FileText size={7} /> Invoice No: {booking.invoice_number}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <div className="flex justify-center gap-2">

                                                            <button
                                                                onClick={() => {
                                                                    setEditingBooking({ ...booking });
                                                                    setEditSections({});
                                                                    setNewAdditionalDocs([]);
                                                                    setDocsToRemove([]);
                                                                }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View/Edit Booking"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(booking.id)}
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



            {/* Edit Booking Modal */}
            {
                editingBooking && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-[#14532d] text-white">
                                <h2 className="text-sm font-black uppercase tracking-tight">View / Edit Cab Booking</h2>
                                <button
                                    onClick={() => setEditingBooking(null)}
                                    className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={(e) => handleEditSave(e)} className="overflow-y-auto max-h-[70vh] p-3 space-y-4">
                                {/* Guest Info */}
                                <div className="space-y-2 group">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Guest Information</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.guest ? handleEditSave(null, 'guest') : toggleSection('guest')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.guest ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.guest ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>
                                    
                                    {editSections.guest ? (
                                        <div className="animate-in fade-in duration-200">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Title</label>
                                                    <select
                                                        name="title"
                                                        value={editingBooking.title || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    >
                                                        <option value="Mr.">Mr.</option>
                                                        <option value="Ms.">Ms.</option>
                                                        <option value="Mrs.">Mrs.</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-3 grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">First Name</label>
                                                        <input
                                                            type="text"
                                                            name="first_name"
                                                            value={editingBooking.first_name || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Last Name</label>
                                                        <input
                                                            type="text"
                                                            name="last_name"
                                                            value={editingBooking.last_name || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={editingBooking.phone || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editingBooking.email || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-1">
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Guest Name</p>
                                                <p className="text-xs font-bold text-gray-700">{editingBooking.title} {editingBooking.first_name} {editingBooking.last_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Contact</p>
                                                <p className="text-xs font-bold text-gray-700">{editingBooking.phone}</p>
                                            </div>
                                            {editingBooking.email && (
                                                <div className="col-span-2">
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase">Email</p>
                                                    <p className="text-xs font-bold text-gray-700">{editingBooking.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Trip Info */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Trip Details</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.trip ? handleEditSave(null, 'trip') : toggleSection('trip')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.trip ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.trip ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>

                                    {editSections.trip ? (
                                        <div className="animate-in fade-in duration-200">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">From City</label>
                                                    <input
                                                        type="text"
                                                        name="from_city"
                                                        value={editingBooking.from_city || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">To City</label>
                                                    <input
                                                        type="text"
                                                        name="to_city"
                                                        value={editingBooking.to_city || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 mt-3">
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Pickup Date</label>
                                                    <input
                                                        type="date"
                                                        name="pickup_date"
                                                        value={editingBooking.pickup_date || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Guests</label>
                                                    <input
                                                        type="number"
                                                        name="guest_count"
                                                        value={editingBooking.guest_count || 1}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Luggage</label>
                                                    <input
                                                        type="text"
                                                        name="luggage_count"
                                                        value={editingBooking.luggage_count || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        placeholder="e.g., 2 Bags"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-1">
                                            <div className="col-span-2">
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Route</p>
                                                <p className="text-xs font-bold text-gray-700 italic">{editingBooking.from_city} → {editingBooking.to_city}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Pickup Date</p>
                                                <p className="text-xs font-bold text-gray-700">{formatDate(editingBooking.pickup_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Pax / Bags</p>
                                                <p className="text-xs font-bold text-gray-700">{editingBooking.guest_count} Pax / {editingBooking.luggage_count || 0} Bags</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Vehicle info */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Vehicle Information</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.vehicle ? handleEditSave(null, 'vehicle') : toggleSection('vehicle')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.vehicle ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.vehicle ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>

                                    {editSections.vehicle ? (
                                        <div className="animate-in fade-in duration-200 grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Vehicle Name</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_name"
                                                    value={editingBooking.vehicle_name || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none font-bold text-green-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Vehicle Category</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_category"
                                                    value={editingBooking.vehicle_category || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-x-4 p-1">
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Vehicle Name</p>
                                                <p className="text-xs font-bold text-green-700">{editingBooking.vehicle_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Category</p>
                                                <p className="text-xs font-bold text-gray-700">{editingBooking.vehicle_category}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Transfer info */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Transfer Information</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.transfer ? handleEditSave(null, 'transfer') : toggleSection('transfer')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.transfer ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.transfer ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>

                                    {editSections.transfer ? (
                                        <div className="animate-in fade-in duration-200 space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Transfer Type</label>
                                                    <select
                                                        name="transfer_type"
                                                        value={editingBooking.transfer_type || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    >
                                                        <option value="airport">Airport Transfer</option>
                                                        <option value="point-to-point">Point to Point</option>
                                                    </select>
                                                </div>
                                                {editingBooking.transfer_type === 'airport' ? (
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Flight Number</label>
                                                        <input
                                                            type="text"
                                                            name="flight_number"
                                                            value={editingBooking.flight_number || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Pickup Time</label>
                                                        <input
                                                            type="time"
                                                            name="pickup_time"
                                                            value={editingBooking.pickup_time || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {editingBooking.transfer_type === 'airport' && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Terminal</label>
                                                        <input
                                                            type="text"
                                                            name="terminal"
                                                            value={editingBooking.terminal || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Arrival Time</label>
                                                        <input
                                                            type="time"
                                                            name="arrival_time"
                                                            value={editingBooking.arrival_time || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Departure Time</label>
                                                        <input
                                                            type="time"
                                                            name="departure_time"
                                                            value={editingBooking.departure_time || ""}
                                                            onChange={handleEditChange}
                                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Pickup Details / Address</label>
                                                <textarea
                                                    name="pickup_location_details"
                                                    value={editingBooking.pickup_location_details || ""}
                                                    onChange={handleEditChange}
                                                    rows="1"
                                                    className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none resize-none"
                                                    placeholder="Detailed address..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 p-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase">Transfer Type</p>
                                                    <p className="text-xs font-bold text-gray-700 capitalize">{editingBooking.transfer_type}</p>
                                                </div>
                                                {editingBooking.transfer_type === 'airport' ? (
                                                    <div>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase">Flight / Terminal</p>
                                                        <p className="text-xs font-bold text-gray-700">{editingBooking.flight_number || "N/A"} (T-{editingBooking.terminal || "?"})</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase">Pickup Time</p>
                                                        <p className="text-xs font-bold text-gray-700">{editingBooking.pickup_time || "N/A"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {editingBooking.transfer_type === 'airport' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase">Arrival</p>
                                                        <p className="text-xs font-bold text-gray-700">{editingBooking.arrival_time || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase">Departure</p>
                                                        <p className="text-xs font-bold text-gray-700">{editingBooking.departure_time || "N/A"}</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Pickup Details</p>
                                                <p className="text-[11px] text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    {editingBooking.pickup_location_details || "No details provided."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Assignment & Status */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Assignment & Status</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.assignment ? handleEditSave(null, 'assignment') : toggleSection('assignment')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.assignment ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.assignment ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>

                                    {editSections.assignment ? (
                                        <div className="animate-in fade-in duration-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Booking Status</label>
                                                <select
                                                    name="status"
                                                    value={editingBooking.status || "Booking requested"}
                                                    onChange={handleEditChange}
                                                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none font-bold text-gray-700"
                                                >
                                                    <option value="Booking requested">Booking requested</option>
                                                    <option value="Tentative Confirmation">Tentative Confirmation</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Assigned Driver</label>
                                                <SearchableSelect
                                                    options={drivers}
                                                    value={editingBooking.driver || ""}
                                                    onChange={(val) => setEditingBooking(prev => ({ ...prev, driver: val }))}
                                                    placeholder="Select Driver..."
                                                    className="!bg-gray-50 !border-gray-200 !rounded-lg !text-xs !py-1.5 focus:!ring-[#14532d]/20"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-x-4 p-1">
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Status</p>
                                                <p className={`text-xs font-black uppercase tracking-widest ${editingBooking.status === 'Cancelled' ? 'text-red-600' : 'text-[#14532d]'}`}>{editingBooking.status || "Requested"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Assigned Driver</p>
                                                <p className="text-xs font-bold text-gray-700">{editingBooking.driver || "No Driver Assigned"}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Document Upload */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Documents</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.docs ? handleEditSave(null, 'docs') : toggleSection('docs')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.docs ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.docs ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>

                                    {editSections.docs ? (
                                        <div className="animate-in fade-in duration-200 space-y-3">
                                            {/* Invoice Information */}
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-1 block tracking-tight">Invoice Number</label>
                                                    <input
                                                        type="text"
                                                        name="invoice_number"
                                                        value={editingBooking.invoice_number || ""}
                                                        onChange={handleEditChange}
                                                        placeholder="Enter Invoice No."
                                                        className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Existing Additional Documents */}
                                            {editingBooking.additional_documents?.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Existing Additional Documents</label>
                                                    <div className="grid grid-cols-1 gap-1.5">
                                                        {editingBooking.additional_documents.map((doc) => (
                                                            !docsToRemove.includes(doc.id) && (
                                                                <div key={doc.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                                                    <div className="flex items-center gap-2">
                                                                        <Luggage size={12} className="text-gray-400" />
                                                                        <span className="text-[10px] font-medium text-gray-700">{doc.document_name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-600 font-black uppercase tracking-widest hover:underline">View</a>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => markForRemoval(doc.id)}
                                                                            className="text-red-500 hover:text-red-700 p-1"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* New Additional Documents */}
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Upload Additional Documents</label>
                                                <div className="space-y-2">
                                                    {newAdditionalDocs.map((doc, index) => (
                                                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                            <input
                                                                type="text"
                                                                placeholder="Document Name"
                                                                value={doc.name}
                                                                onChange={(e) => updateNewDoc(index, 'name', e.target.value)}
                                                                className="flex-1 px-2 py-1 text-[10px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532d]/30"
                                                            />
                                                            <input
                                                                type="file"
                                                                onChange={(e) => updateNewDoc(index, 'file', e.target.files[0])}
                                                                className="text-[10px] w-32"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewDoc(index)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addAdditionalDoc}
                                                        className="text-[9px] font-black text-[#14532d] uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-dashed border-green-200"
                                                    >
                                                        <Plus size={12} /> Add New Document
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 p-1">
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase">Invoice Number</p>
                                                <p className="text-xs font-bold text-gray-700">{editingBooking.invoice_number || "Not Invoiced"}</p>
                                            </div>
                                            {editingBooking.additional_documents?.length > 0 && (
                                                <div className="grid grid-cols-1 gap-1.5 mt-2">
                                                    {editingBooking.additional_documents.map((doc) => (
                                                        <div key={doc.id} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                            <div className="flex items-center gap-2">
                                                                <FileText size={12} className="text-green-600" />
                                                                <span className="text-[10px] font-medium text-gray-700">{doc.document_name}</span>
                                                            </div>
                                                            <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-[9px] text-[#14532d] font-black uppercase tracking-widest hover:underline">Download</a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Special Requirements */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-green-100 pb-0.5">
                                        <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Special Requirements</p>
                                        <button 
                                            type="button" 
                                            onClick={() => editSections.requirements ? handleEditSave(null, 'requirements') : toggleSection('requirements')}
                                            className={`text-[8px] font-bold px-2 py-0.5 rounded transition-colors ${editSections.requirements ? 'bg-[#14532d] text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {editSections.requirements ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                                        </button>
                                    </div>
                                    
                                    {editSections.requirements ? (
                                        <textarea
                                            name="special_requirements"
                                            value={editingBooking.special_requirements || ""}
                                            onChange={handleEditChange}
                                            rows="2"
                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none resize-none animate-in fade-in duration-200"
                                            placeholder="Any special requests or notes..."
                                        ></textarea>
                                    ) : (
                                        <p className="text-[11px] text-gray-600 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            {editingBooking.special_requirements || "No special requirements."}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBooking(null)}
                                        className="flex-1 px-4 py-1.5 border border-gray-200 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-1.5 bg-[#14532d] text-white rounded-xl font-bold text-xs hover:bg-[#0d2f1f] transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default CabBookingManage;
