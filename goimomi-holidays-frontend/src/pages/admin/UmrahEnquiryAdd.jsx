import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";

const UmrahEnquiryAdd = () => {
    useEffect(() => {
        console.log("UmrahEnquiryAdd Mounted");
    }, []);

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    const [form, setForm] = useState({
        cities: [{ name: "Makkah", nights: "2 nights" }, { name: "Madinah", nights: "2 nights" }],
        startCity: "",
        nationality: "Indian",
        travelDate: "",
        rooms: [{ adults: 2, children: 0 }],
        hotelRating: "Select",
        budget: "",
        fullName: "",
        email: "",
        phone: "",
    });

    const [startingCities, setStartingCities] = useState([]);
    const [nationalities, setNationalities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [travelerDropdownOpen, setTravelerDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scRes, natRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/starting-cities/`),
                    axios.get(`${API_BASE_URL}/nationalities/`)
                ]);
                setStartingCities(scRes.data);
                setNationalities(natRes.data);
            } catch (err) {
                console.error("Error fetching form data:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addCity = () => {
        setForm({
            ...form,
            cities: [...form.cities, { name: "", nights: "1 night" }]
        });
    };

    const removeCity = (index) => {
        if (form.cities.length > 1) {
            const newCities = form.cities.filter((_, i) => i !== index);
            setForm({ ...form, cities: newCities });
        }
    };

    const handleCityChange = (index, field, value) => {
        const newCities = [...form.cities];
        newCities[index][field] = value;
        setForm({ ...form, cities: newCities });
    };

    const handleRoomChange = (index, field, value) => {
        const newRooms = [...form.rooms];
        newRooms[index][field] = Math.max(0, value);
        setForm({ ...form, rooms: newRooms });
    };

    const addRoom = () => {
        setForm({ ...form, rooms: [...form.rooms, { adults: 2, children: 0 }] });
    };

    const removeRoom = (index) => {
        if (form.rooms.length > 1) {
            setForm({ ...form, rooms: form.rooms.filter((_, i) => i !== index) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                full_name: form.fullName,
                email: form.email,
                phone: form.phone,
                package_type: "Customized Umrah",
                travel_date: form.travelDate,
                budget: form.budget,
                adults: form.rooms.reduce((acc, r) => acc + r.adults, 0),
                children: form.rooms.reduce((acc, r) => acc + r.children, 0),
                infants: 0,
                message: `Cities: ${form.cities.map(c => `${c.name} (${c.nights})`).join(', ')}, Starting City: ${form.startCity}, Nationality: ${form.nationality}, Hotel: ${form.hotelRating}`,
                star_rating: form.hotelRating,
                start_city: form.startCity,
                nationality: form.nationality,
                rooms: form.rooms.length,
                room_details: form.rooms
            };

            await axios.post(`${API_BASE_URL}/umrah-form/`, payload);
            alert("Umrah enquiry added successfully!");
            navigate("/admin/umrah-enquiries");
        } catch (err) {
            console.error(err);
            setError("Failed to add umrah enquiry. Please check the details.");
        } finally {
            setLoading(false);
        }
    };

    const travelerSummary = () => {
        const rooms = form.rooms.length;
        const adults = form.rooms.reduce((acc, r) => acc + r.adults, 0);
        const children = form.rooms.reduce((acc, r) => acc + r.children, 0);
        return `${rooms} room${rooms > 1 ? 's' : ''}, ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`;
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 bg-[#14532d] text-white">
                            <h1 className="text-xl font-bold uppercase tracking-wider">Add Customized Umrah Enquiry</h1>
                            <p className="text-sm opacity-80 mt-1">Fill in the details for the new umrah enquiry.</p>
                        </div>

                        {error && (
                            <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 text-[#333]">
                            {/* Cities Selection */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cities *</label>
                                {form.cities.map((city, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <div className="relative flex-1">
                                            <select
                                                value={city.name}
                                                onChange={(e) => handleCityChange(idx, "name", e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none appearance-none"
                                                required
                                            >
                                                <option value="">Select City</option>
                                                <option value="Makkah">Makkah</option>
                                                <option value="Madinah">Madinah</option>
                                                <option value="Jeddah">Jeddah</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                        <div className="relative w-32">
                                            <select
                                                value={city.nights}
                                                onChange={(e) => handleCityChange(idx, "nights", e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none appearance-none"
                                            >
                                                {[...Array(30)].map((_, i) => (
                                                    <option key={i} value={`${i + 1} night${i > 0 ? 's' : ''}`}>{i + 1} night{i > 0 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                        {idx > 0 && (
                                            <button type="button" onClick={() => removeCity(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCity}
                                    className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline pt-2"
                                >
                                    + Add Another City
                                </button>
                            </div>

                            {/* Row 1: Start City & Nationality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Starting City *</label>
                                    <div className="relative">
                                        <select
                                            name="startCity"
                                            value={form.startCity}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none appearance-none"
                                            required
                                        >
                                            <option value="">Select Starting City</option>
                                            {startingCities.map(sc => (
                                                <option key={sc.id} value={sc.name}>{sc.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nationality *</label>
                                    <div className="relative">
                                        <select
                                            name="nationality"
                                            value={form.nationality}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none appearance-none"
                                            required
                                        >
                                            {nationalities.map(n => (
                                                <option key={n.id} value={n.nationality}>{n.nationality}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Travel Date & Travelers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Travel Date *</label>
                                    <input
                                        type="date"
                                        name="travelDate"
                                        value={form.travelDate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Number of Travelers *</label>
                                    <div
                                        onClick={() => setTravelerDropdownOpen(!travelerDropdownOpen)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm cursor-pointer flex justify-between items-center bg-white"
                                    >
                                        <span>{travelerSummary()}</span>
                                        {travelerDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>

                                    {travelerDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg p-4 z-20 space-y-4">
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="font-bold text-sm">Rooms</span>
                                                <div className="flex items-center gap-3">
                                                    <button type="button" onClick={() => removeRoom(form.rooms.length - 1)} className="w-8 h-8 rounded border flex items-center justify-center">-</button>
                                                    <span className="text-sm font-bold">{form.rooms.length}</span>
                                                    <button type="button" onClick={addRoom} className="w-8 h-8 rounded border flex items-center justify-center">+</button>
                                                </div>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto space-y-3">
                                                {form.rooms.map((room, idx) => (
                                                    <div key={idx} className="p-3 bg-gray-50 rounded">
                                                        <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Room {idx + 1}</div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs block mb-1">Adults (12+)</label>
                                                                <div className="flex items-center gap-2">
                                                                    <button type="button" onClick={() => handleRoomChange(idx, 'adults', room.adults - 1)} className="w-6 h-6 rounded border">-</button>
                                                                    <span className="text-sm font-bold">{room.adults}</span>
                                                                    <button type="button" onClick={() => handleRoomChange(idx, 'adults', room.adults + 1)} className="w-6 h-6 rounded border">+</button>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs block mb-1">Children</label>
                                                                <div className="flex items-center gap-2">
                                                                    <button type="button" onClick={() => handleRoomChange(idx, 'children', room.children - 1)} className="w-6 h-6 rounded border">-</button>
                                                                    <span className="text-sm font-bold">{room.children}</span>
                                                                    <button type="button" onClick={() => handleRoomChange(idx, 'children', room.children + 1)} className="w-6 h-6 rounded border">+</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setTravelerDropdownOpen(false)}
                                                className="w-full bg-[#14532d] text-white py-2 rounded text-sm font-bold mt-2"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hotel Rating Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hotel Star Rating</label>
                                    <div className="relative">
                                        <select
                                            name="hotelRating"
                                            value={form.hotelRating}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none appearance-none"
                                        >
                                            <option value="Select">Select</option>
                                            <option value="Economy">Economy</option>
                                            <option value="3 Star">3 Star</option>
                                            <option value="4 Star">4 Star</option>
                                            <option value="5 Star">5 Star</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Budget Per Person Without Flight</label>
                                    <input
                                        type="text"
                                        name="budget"
                                        placeholder="Ex: ₹50,000 – ₹1,00,000"
                                        value={form.budget}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Contact Details Section */}
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Your Contact Details</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                        <input
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="xxxxxx@xxxx.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                                            <input
                                                name="phone"
                                                placeholder="91-xxxxxxxxxx"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#14532d] outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Footer */}
                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/umrah-enquiries")}
                                    className="px-6 py-2 border border-gray-300 text-gray-600 rounded text-sm font-bold uppercase transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#14532d] text-white px-8 py-2 rounded text-sm font-bold uppercase shadow-sm transition-all hover:bg-[#0f4a24] disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit Enquiry"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UmrahEnquiryAdd;
