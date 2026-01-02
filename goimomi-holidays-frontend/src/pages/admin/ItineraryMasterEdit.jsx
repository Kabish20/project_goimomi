import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const ItineraryMasterEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        image: null,
    });
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchItinerary();
    }, [id]);

    const fetchItinerary = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/itinerary-masters/${id}/`);
            const data = response.data;
            setForm({
                name: data.name,
                title: data.title,
                description: data.description,
                image: null, // Don't pre-fill file input
            });
            setExistingImage(data.image); // URL of existing image
            setError("");
        } catch (err) {
            console.error("Error fetching itinerary:", err);
            setError("Failed to load itinerary details.");
        } finally {
            setLoading(false);
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

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("title", form.title);
        formData.append("description", form.description);
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

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">Edit Itinerary Master</h1>
                        <button
                            onClick={() => navigate('/admin/itinerary-masters')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
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
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="max-w-xl bg-white rounded-lg shadow-md p-6 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Name (Internal ID):</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Title (Display Name):</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Description:</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Image (Optional):</label>
                            {existingImage && (
                                <div className="mb-2">
                                    <img src={existingImage} alt="Current" className="h-24 object-cover rounded border" />
                                    <p className="text-xs text-gray-500">Current Image</p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                                disabled={saving}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? "Updating..." : "UPDATE"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMasterEdit;
