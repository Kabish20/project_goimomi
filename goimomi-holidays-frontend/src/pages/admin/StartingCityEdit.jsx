import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const StartingCityEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        region: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchStartingCity();
    }, [id]);

    const fetchStartingCity = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/starting-cities/${id}/`);
            setForm({
                name: response.data.name || "",
                region: response.data.region || "",
            });
        } catch (err) {
            console.error("Error fetching starting city:", err);
            setError("Failed to load starting city data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage("");
        setError("");
    };

    const handleSubmit = async (e, continueEditing = false) => {
        if (e) e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.put(`${API_BASE_URL}/starting-cities/${id}/`, form);

            if (response.status === 200) {
                setMessage("Starting city updated successfully!");
                if (!continueEditing) {
                    setTimeout(() => navigate("/admin/starting-cities"), 1500);
                }
            }
        } catch (err) {
            console.error("Error updating starting city:", err);
            if (err.response?.data) {
                const errorMessages = Object.values(err.response.data).flat();
                setError(errorMessages.join(", "));
            } else {
                setError("Failed to update starting city. Please try again.");
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
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Starting City</h1>
                            <p className="text-gray-600">Update starting city name and region</p>
                        </div>
                        <button
                            onClick={() => navigate("/admin/starting-cities")}
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

                    <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-xl bg-white rounded-lg shadow-md p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-gray-700 font-medium">Name:</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                placeholder="Enter city name"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-32 text-gray-700 font-medium">Region:</label>
                            <input
                                name="region"
                                value={form.region}
                                onChange={handleChange}
                                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                placeholder="Enter region"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
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

export default StartingCityEdit;
