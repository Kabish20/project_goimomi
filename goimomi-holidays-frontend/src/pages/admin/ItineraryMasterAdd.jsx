import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const ItineraryMasterAdd = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

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
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminTopbar />

                <div className="p-6">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Itinerary Master Template</h1>
                                <p className="text-gray-600">Create reusable itinerary day templates for holiday packages</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/itinerary-masters')}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Name Field */}
                        <div className="border-b border-gray-200 p-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Name (Internal ID): <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full max-w-2xl border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
                                placeholder="e.g., goa_arrival"
                                required
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                A unique identifier for this template (use lowercase, underscores allowed)
                            </p>
                        </div>

                        {/* Title Field */}
                        <div className="border-b border-gray-200 p-6 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Title (Display Name): <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full max-w-2xl border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
                                placeholder="e.g., Arrival and Check-in"
                                required
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                The title that will appear in holiday packages
                            </p>
                        </div>

                        {/* Description Field */}
                        <div className="border-b border-gray-200 p-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Description: <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="6"
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
                                placeholder="Enter detailed description of this itinerary day..."
                                required
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Detailed description of activities for this day
                            </p>
                        </div>

                        {/* Image Field */}
                        <div className="border-b border-gray-200 p-6 bg-gray-50">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Image (Optional):
                            </label>
                            <input
                                id="imageInput"
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full max-w-2xl text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#14532d] file:text-white hover:file:bg-[#0f4a24] file:cursor-pointer"
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Upload a representative image for this itinerary day (JPG, PNG, WebP)
                            </p>
                            {form.image && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                                    ✓ File selected: <strong>{form.image.name}</strong>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-100 p-6">
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-[#14532d] text-white px-6 py-2 rounded hover:bg-[#0f4a24] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "SAVE"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveAndAddAnother}
                                    className="bg-[#1f7a45] text-white px-6 py-2 rounded hover:bg-[#1a6338] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save and add another"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveAndContinue}
                                    className="bg-[#1f7a45] text-white px-6 py-2 rounded hover:bg-[#1a6338] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save and continue editing"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMasterAdd;
