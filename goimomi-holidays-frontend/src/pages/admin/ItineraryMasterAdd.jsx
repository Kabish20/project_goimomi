import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const ItineraryMasterAdd = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        image: null,
        destination: "",
    });
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

    React.useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/destinations/`);
            setDestinations(response.data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setForm({ ...form, image: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        setMessage("");
        setError("");
    };

    const handleSubmit = async (e, continueEditing = false) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("title", form.title);
        formData.append("description", form.description);
        if (form.destination) {
            formData.append("destination", form.destination);
        }
        if (form.image) {
            formData.append("image", form.image);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/itinerary-masters/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                setMessage("Itinerary Master added successfully!");

                if (!continueEditing) {
                    // Reset form
                    setForm({
                        name: "",
                        title: "",
                        description: "",
                        image: null,
                        destination: "",
                    });
                    // Reset file input
                    const fileInput = document.getElementById("imageInput");
                    if (fileInput) fileInput.value = "";
                }
            }
        } catch (err) {
            console.error("Error adding itinerary master:", err);
            if (err.response?.data) {
                const errorMessages = Object.values(err.response.data).flat();
                setError(errorMessages.join(", "));
            } else {
                setError("Failed to add itinerary master. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndAddAnother = async () => {
        await handleSubmit(null, false);
    };

    const handleSaveAndContinue = async () => {
        await handleSubmit(null, true);
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-3">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => navigate('/admin/itinerary-masters')}
                                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight"
                            >
                                Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Add Itinerary Master</h1>
                        </div>

                        {/* Messages */}
                        {message && (
                            <div className="mb-3 p-2 bg-green-50 ring-1 ring-green-200 text-green-700 rounded text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-3 p-2 bg-red-50 ring-1 ring-red-200 text-red-700 rounded text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Destination Category
                                        </label>
                                        <SearchableSelect
                                            options={destinations.map(d => ({ value: d.id, label: d.name }))}
                                            value={form.destination}
                                            onChange={(val) => setForm({ ...form, destination: val })}
                                            placeholder="Global/Generic"
                                            disabled={loading}
                                        />
                                        <p className="text-[9px] text-gray-400 italic">For easier template filtering in packages.</p>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Internal ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                            placeholder="e.g. thailand_day1"
                                            required
                                            disabled={loading}
                                        />
                                        <p className="text-[9px] text-gray-400 italic">Lowercase, underscores only.</p>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Display Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                            placeholder="e.g. Arrival & Leisure"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs lg:col-span-2">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Activities Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all resize-none font-medium"
                                            placeholder="Detail the day's itinerary..."
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Cover Image
                                        </label>
                                        <div className="flex flex-col gap-1">
                                            <input
                                                id="imageInput"
                                                type="file"
                                                name="image"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-green-50 file:text-[#14532d] cursor-pointer"
                                                disabled={loading}
                                            />
                                            {form.image && <span className="text-[9px] text-[#14532d] font-bold">✓ {form.image.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2 bg-[#14532d] text-white rounded-xl hover:bg-[#0f4a24] transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-900/20"
                                >
                                    {loading ? "Saving..." : "Save Master"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveAndAddAnother}
                                    disabled={loading}
                                    className="px-6 py-2 bg-white text-[#14532d] border border-gray-200 rounded-xl hover:bg-gray-50 transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest"
                                >
                                    Save + New
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveAndContinue}
                                    disabled={loading}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest"
                                >
                                    Save + Stay
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMasterAdd;
