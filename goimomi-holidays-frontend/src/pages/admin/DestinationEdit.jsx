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
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminTopbar />

                <div className="p-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Destination</h1>
                            <p className="text-gray-600">Update destination details and images</p>
                        </div>
                        <button
                            onClick={() => navigate("/admin/destinations")}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Back to List
                        </button>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                            <span className="font-bold">✓</span> {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <span className="font-bold">⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="grid grid-cols-1 gap-6 p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Name:</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Region:</label>
                                    <input
                                        name="region"
                                        value={form.region}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">City:</label>
                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Country:</label>
                                    <input
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 flex gap-3">
                            <button
                                type="submit"
                                className="bg-[#14532d] text-white px-6 py-2 rounded hover:bg-[#0f4a24] transition font-semibold disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "UPDATE"}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                className="bg-[#1f7a45] text-white px-6 py-2 rounded hover:bg-[#1a6338] transition font-semibold disabled:opacity-50"
                                disabled={loading}
                            >
                                Save and continue editing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DestinationEdit;
