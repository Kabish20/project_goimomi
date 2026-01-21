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
            <div className="flex bg-gray-100 min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-10 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminTopbar />

                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-gray-800">Edit Itinerary Master</h1>
                        <button
                            onClick={() => navigate('/admin/itinerary-masters')}
                            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition"
                        >
                            Back to List
                        </button>
                    </div>

                    {message && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="max-w-xl bg-white rounded-lg shadow-sm p-4 space-y-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-bold text-xs uppercase">Destination:</label>
                            <SearchableSelect
                                options={destinations.map(d => ({ value: d.id, label: d.name }))}
                                value={form.destination}
                                onChange={(val) => setForm({ ...form, destination: val })}
                                placeholder="Select Destination (Global)"
                                disabled={saving}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-bold text-xs uppercase">Name (Internal ID):</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-bold text-xs uppercase">Title (Display Name):</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-bold text-xs uppercase">Description:</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-bold text-xs uppercase">Image:</label>
                            {existingImage && (
                                <div className="mb-2">
                                    <img src={existingImage} alt="Preview" className="h-20 w-32 object-cover rounded shadow-sm" />
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#14532d] file:text-white"
                                disabled={saving}
                            />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button
                                type="submit"
                                className="bg-[#14532d] text-white px-4 py-1.5 rounded hover:bg-[#0f4a24] transition text-sm font-semibold"
                                disabled={saving}
                            >
                                {saving ? "UPDATING..." : "UPDATE"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/itinerary-masters')}
                                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-[#0f4a24] transition text-sm font-semibold"
                                disabled={saving}
                            >
                                CANCEL
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMasterEdit;
