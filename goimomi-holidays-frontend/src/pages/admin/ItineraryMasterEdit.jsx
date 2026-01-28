import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const ItineraryMasterEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        image: null,
        destination: "",
    });
    const [destinations, setDestinations] = useState([]);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

    // Helper to fix image URLs
    const getImageUrl = (url) => {
        if (!url) return "";
        if (typeof url !== "string") return url;
        if (url.startsWith("http")) {
            return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
        }
        return url;
    };

    const fetchItinerary = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/itinerary-masters/${id}/`);
            const data = response.data;
            setForm({
                name: data.name,
                title: data.title,
                description: data.description,
                image: null,
                destination: data.destination || "",
            });
            setExistingImage(getImageUrl(data.image)); // URL of existing image
            setError("");
        } catch (err) {
            console.error("Error fetching itinerary:", err);
            setError("Failed to load itinerary details.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchDestinations = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/destinations/`);
            setDestinations(response.data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
        }
    }, []);

    useEffect(() => {
        fetchItinerary();
        fetchDestinations();
    }, [fetchItinerary, fetchDestinations]);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setForm({ ...form, image: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
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
            const response = await axios.put(`${API_BASE_URL}/itinerary-masters/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setMessage("Itinerary Master updated successfully!");
                // Refresh data to show new image if any
                setForm(prev => ({ ...prev, image: null }));
                fetchItinerary();
            }
        } catch (err) {
            console.error("Error updating itinerary master:", err);
            if (err.response?.data) {
                const errorMessages = Object.values(err.response.data).flat();
                setError(errorMessages.join(", "));
            } else {
                setError("Failed to update itinerary master. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-gray-100 h-full overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 p-10 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-3">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => navigate('/admin/itinerary-masters')}
                                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight"
                            >
                                Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Edit Itinerary Master</h1>
                        </div>

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
                                            disabled={saving}
                                        />
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
                                            required
                                            disabled={saving}
                                        />
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
                                            required
                                            disabled={saving}
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
                                            required
                                            disabled={saving}
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Cover Image
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-green-50 file:text-[#14532d] cursor-pointer"
                                                disabled={saving}
                                            />
                                            {existingImage && (
                                                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-inner group w-32">
                                                    <img src={existingImage} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[8px] font-bold p-0.5 text-center backdrop-blur-sm">Current</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-2 bg-[#14532d] text-white rounded-xl hover:bg-[#0f4a24] transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-900/20"
                                >
                                    {saving ? "Updating..." : "Update Master"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/itinerary-masters')}
                                    className="px-6 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMasterEdit;
