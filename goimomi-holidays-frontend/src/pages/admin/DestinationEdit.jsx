import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const DestinationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        region: "",
        city: "",
        country: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

    const fetchDestination = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/destinations/${id}/`);
            const data = response.data;
            setForm({
                name: data.name || "",
                region: data.region || "",
                city: data.city || "",
                country: data.country || "",
            });
        } catch (err) {
            console.error("Error fetching destination:", err);
            setError("Failed to load destination data.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDestination();
    }, [fetchDestination]);

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
        formData.append("region", form.region);
        formData.append("city", form.city);
        formData.append("country", form.country);

        try {
            const response = await axios.put(`${API_BASE_URL}/destinations/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setMessage("Destination updated successfully!");

                if (!continueEditing) {
                    setTimeout(() => navigate("/admin/destinations"), 1500);
                }
            }
        } catch (err) {
            console.error("Error updating destination:", err);
            if (err.response?.data) {
                const errorMessages = Object.values(err.response.data).flat();
                setError(errorMessages.join(", "));
            } else {
                setError("Failed to update destination. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-3">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => navigate('/admin/destinations')}
                                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight"
                            >
                                Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Edit Destination</h1>
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

                        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Destination Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            City / Locality
                                        </label>
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Region / State
                                        </label>
                                        <input
                                            name="region"
                                            value={form.region}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2 bg-[#14532d] text-white rounded-xl hover:bg-[#0f4a24] transition-all transform active:scale-95 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/10"
                                >
                                    {loading ? "Updating..." : "Update Destination"}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="px-4 py-2 bg-white text-[#14532d] border border-[#14532d]/20 rounded-xl hover:bg-green-50 transition-all transform active:scale-95 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                                    disabled={loading}
                                >
                                    Continue Editing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationEdit;
