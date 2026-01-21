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
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminTopbar />

                <div className="p-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 mb-1">Add Itinerary Master</h1>
                                <p className="text-xs text-gray-600">Create reusable itinerary day templates</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/itinerary-masters')}
                                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm flex items-center gap-2">
                            <i className="fas fa-check-circle"></i>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm flex items-center gap-2">
                            <i className="fas fa-times-circle"></i>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden max-w-4xl">
                        {/* Destination Field */}
                        <div className="border-b border-gray-100 p-4 bg-gray-50">
                            <label className="block text-gray-700 font-bold text-xs uppercase mb-1">
                                Destination: <span className="text-gray-400 normal-case">(Optional)</span>
                            </label>
                            <SearchableSelect
                                options={destinations.map(d => ({ value: d.id, label: d.name }))}
                                value={form.destination}
                                onChange={(val) => setForm({ ...form, destination: val })}
                                placeholder="Select Destination (Global)"
                                disabled={loading}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">
                                Categorize templates under a city for easier filtering in packages
                            </p>
                        </div>
                        {/* Name Field */}
                        <div className="border-b border-gray-100 p-4">
                            <label className="block text-gray-700 font-bold text-xs uppercase mb-1">
                                Name (Internal ID): <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full max-w-xl border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                placeholder="e.g. thailand_bangkok_day1"
                                required
                                disabled={loading}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Unique identifier (lowercase, underscores only)</p>
                        </div>

                        {/* Title Field */}
                        <div className="border-b border-gray-100 p-4 bg-gray-50">
                            <label className="block text-gray-700 font-bold text-xs uppercase mb-1">
                                Title (Display Name): <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full max-w-xl border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                placeholder="e.g. Arrival and Leisure"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Description Field */}
                        <div className="border-b border-gray-100 p-4">
                            <label className="block text-gray-700 font-bold text-xs uppercase mb-1">
                                Description:*
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                placeholder="Description of activities..."
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Image Field */}
                        <div className="border-b border-gray-100 p-4 bg-gray-50">
                            <label className="block text-gray-700 font-bold text-xs uppercase mb-1">
                                Image (Optional):
                            </label>
                            <input
                                id="imageInput"
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full max-w-xl text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#14532d] file:text-white"
                                disabled={loading}
                            />
                            {form.image && (
                                <div className="mt-1 text-[10px] text-green-600 font-bold">
                                    ✓ {form.image.name}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white p-4 flex gap-2 border-t border-gray-100">
                            <button
                                type="submit"
                                className="bg-[#14532d] text-white px-4 py-1.5 rounded hover:bg-[#0f4a24] transition text-sm font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "SAVE"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAndAddAnother}
                                className="bg-[#1f7a45] text-white px-4 py-1.5 rounded hover:bg-[#1a6338] transition text-sm font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save + New"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAndContinue}
                                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-300 transition text-sm font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save + Continue"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItineraryMasterAdd;
