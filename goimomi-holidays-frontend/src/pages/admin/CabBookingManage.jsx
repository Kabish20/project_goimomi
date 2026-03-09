import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Trash2, Phone, MapPin, Calendar, Clock, Plane, Luggage, MessageSquare, Pencil, X, Mail } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const CabBookingManage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [drivers, setDrivers] = useState([]);

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchBookings();
        fetchDrivers();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/cab-bookings/`);
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
            const response = await axios.get(`${API_BASE_URL}/driver-masters/`);
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
        const filtered = bookings.filter(booking =>
            booking.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.from_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.to_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.vehicle_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBookings(filtered);
    }, [searchTerm, bookings]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/cab-bookings/${id}/`);
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

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await axios.put(`${API_BASE_URL}/cab-bookings/${editingBooking.id}/`, editingBooking);
            setEditingBooking(null);
            fetchBookings();
            alert("Booking updated successfully!");
        } catch (err) {
            console.error("Error updating booking:", err);
            setError("Failed to update booking. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingBooking(prev => ({ ...prev, [name]: value }));
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
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, phone, or route..."
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
                            <p className="mt-2 text-gray-600">Loading bookings...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#14532d] text-white">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Guest</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Route & Vehicle</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Type & Time</th>
                                            <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Pickup Date</th>
                                            <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Status</th>
                                            <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Actions</th>
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
                                                    <td className="py-4 px-6">
                                                        <div className="font-semibold text-gray-900">{booking.title} {booking.first_name} {booking.last_name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
                                                            <span className="flex items-center gap-1 whitespace-nowrap"><Phone size={10} /> {booking.phone}</span>
                                                            {booking.email && (
                                                                <span className="flex items-center gap-1 whitespace-nowrap"><Mail size={10} /> {booking.email}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {booking.from_city} → {booking.to_city}
                                                        </div>
                                                        <div className="text-[10px] text-[#14532d] font-black uppercase tracking-widest mt-0.5">
                                                            {booking.vehicle_name}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
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
                                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                                        {formatDate(booking.pickup_date)}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <div className={`text-[10px] font-black uppercase tracking-widest inline-block px-2 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                            booking.status === 'Payment Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                booking.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {booking.status || 'Booking requested'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingBooking({ ...booking })}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Edit Booking"
                                                            >
                                                                <Pencil size={18} />
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

            {/* Booking Detail Modal */}
            {
                selectedBooking && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#14532d] text-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-lg font-black leading-tight">{selectedBooking.title} {selectedBooking.first_name} {selectedBooking.last_name}</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-0.5">Booking Ref: #{selectedBooking.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
                                >
                                    <span className="text-xl">×</span>
                                </button>
                            </div>

                            <div className="overflow-y-auto max-h-[80vh]">
                                <div className="p-6 space-y-6">
                                    {/* Route & Vehicle */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Route Information</p>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                                                <p className="text-sm font-bold text-gray-700">{selectedBooking.from_city} → {selectedBooking.to_city}</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatDate(selectedBooking.pickup_date)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle Details</p>
                                            <div className="bg-green-50/50 p-3 rounded-xl border border-green-100">
                                                <p className="text-sm font-bold text-[#14532d]">{selectedBooking.vehicle_name}</p>
                                                <p className="text-xs text-green-700/60 font-black tracking-widest uppercase mt-0.5">{selectedBooking.vehicle_category}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assignment & Status */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignment & Status</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Booking Status</p>
                                                <div className={`mt-1 text-[10px] font-black uppercase tracking-widest inline-block px-2 py-0.5 rounded-md ${selectedBooking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    selectedBooking.status === 'Payment Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        selectedBooking.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {selectedBooking.status || "Booking requested"}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Assigned Driver</p>
                                                <p className="text-sm font-bold text-gray-700 mt-1">{selectedBooking.driver || "Not Assigned"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guest Details */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guest & Contact</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <Phone size={14} className="text-[#14532d]" />
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Contact</p>
                                                    <p className="text-sm font-bold text-gray-700">{selectedBooking.phone}</p>
                                                    {selectedBooking.email && <p className="text-xs font-bold text-gray-500 truncate mt-0.5">{selectedBooking.email}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <Luggage size={14} className="text-[#14532d]" />
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Luggage</p>
                                                    <p className="text-sm font-bold text-gray-700">{selectedBooking.luggage_count || "0 Bags"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transfer Specific Info */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transfer Details ({selectedBooking.transfer_type})</p>
                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                            {selectedBooking.transfer_type === 'airport' ? (
                                                <div className="p-4 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Flight No.</p>
                                                        <p className="text-sm font-bold text-gray-700">{selectedBooking.flight_number || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Terminal</p>
                                                        <p className="text-sm font-bold text-gray-700">{selectedBooking.terminal || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Arrival Time</p>
                                                        <p className="text-sm font-bold text-gray-700">{selectedBooking.arrival_time || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Departure Time</p>
                                                        <p className="text-sm font-bold text-gray-700">{selectedBooking.departure_time || "N/A"}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 space-y-4">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Pickup Time</p>
                                                        <p className="text-sm font-bold text-gray-700">{selectedBooking.pickup_time || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">Pickup Address / Details</p>
                                                        <p className="text-sm font-bold text-gray-700 mt-1 bg-white p-3 rounded-xl border border-gray-100 italic">
                                                            {selectedBooking.pickup_location_details || "No details provided."}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Special Requirements */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Special Requirements</p>
                                        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 text-[13px] text-gray-700 italic flex gap-3">
                                            <MessageSquare size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                            {selectedBooking.special_requirements || "No specific requirements."}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-gray-50 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        window.open(`tel:${selectedBooking.phone}`);
                                    }}
                                    className="flex-1 bg-[#14532d] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0d2f1f] transition-all active:scale-95 shadow-lg shadow-[#14532d]/20"
                                >
                                    Contact Guest
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Booking Modal */}
            {
                editingBooking && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-[#14532d] text-white">
                                <h2 className="text-sm font-black uppercase tracking-tight">Edit Cab Booking</h2>
                                <button
                                    onClick={() => setEditingBooking(null)}
                                    className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSave} className="overflow-y-auto max-h-[85vh] p-4 space-y-4">
                                {/* Guest Info */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest border-b border-green-100 pb-0.5">Guest Information</p>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                                {/* Trip Info */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest border-b border-green-100 pb-0.5">Trip Details</p>
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
                                    <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
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

                                {/* Vehicle info */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest border-b border-green-100 pb-0.5">Vehicle Information</p>
                                    <div className="grid grid-cols-2 gap-3">
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
                                </div>

                                {/* Transfer info */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest border-b border-green-100 pb-0.5">Transfer Information</p>
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

                                {/* Assignment & Status */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest border-b border-green-100 pb-0.5">Assignment & Status</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Booking Status</label>
                                            <select
                                                name="status"
                                                value={editingBooking.status || "Booking requested"}
                                                onChange={handleEditChange}
                                                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none font-bold text-gray-700"
                                            >
                                                <option value="Booking requested">Booking requested</option>
                                                <option value="Payment Pending">Payment Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Canceled">Canceled</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 block tracking-tight">Driver Assigned</label>
                                            <SearchableSelect
                                                options={drivers}
                                                value={editingBooking.driver || ""}
                                                onChange={(val) => setEditingBooking(prev => ({ ...prev, driver: val }))}
                                                placeholder="Select Driver..."
                                                className="!bg-gray-50 !border-gray-200 !rounded-lg !text-xs !py-1.5 focus:!ring-[#14532d]/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Special Requirements */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest border-b border-green-100 pb-0.5">Special Requirements</p>
                                    <textarea
                                        name="special_requirements"
                                        value={editingBooking.special_requirements || ""}
                                        onChange={handleEditChange}
                                        rows="1"
                                        className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#14532d]/20 focus:outline-none resize-none"
                                        placeholder="Guest requests..."
                                    ></textarea>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBooking(null)}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-2 bg-[#14532d] text-white rounded-xl font-bold text-xs hover:bg-[#0d2f1f] transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
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
