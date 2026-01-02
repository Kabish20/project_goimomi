import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const StartingCityAdd = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        region: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

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
            const response = await axios.post(`${API_BASE_URL}/starting-cities/`, form);

            if (response.status === 201) {
                setMessage("Starting city added successfully!");

                if (continueEditing) {
                    const newId = response.data.id;
                    setTimeout(() => navigate(`/admin/starting-cities/edit/${newId}`), 1000);
                } else {
                    setForm({
                        name: "",
                        region: "",
                    });
                }
            }
        } catch (err) {
            console.error("Error adding starting city:", err);
            if (err.response?.data) {
                const errorMessages = Object.values(err.response.data).flat();
                setError(errorMessages.join(", "));
            } else {
                setError("Failed to add starting city. Please try again.");
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
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Starting City</h1>
                                <p className="text-gray-600">Register new departure cities for your holiday packages</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/starting-cities')}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    City Name: <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                    placeholder="e.g., Mumbai"
                                    required
                                    disabled={loading}
                                />
                                <p className="text-sm text-gray-500 mt-1">The name of the departure city</p>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Region:</label>
                                <input
                                    name="region"
                                    value={form.region}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                                    placeholder="e.g., West India"
                                    disabled={loading}
                                />
                                <p className="text-sm text-gray-500 mt-1">The geographical region of the city</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-100 p-6 flex gap-3">
                            <button
                                type="submit"
                                className="bg-[#14532d] text-white px-6 py-2 rounded hover:bg-[#0f4a24] transition font-semibold disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "SAVE"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAndAddAnother}
                                className="bg-[#1f7a45] text-white px-6 py-2 rounded hover:bg-[#1a6338] transition font-semibold disabled:opacity-50"
                                disabled={loading}
                            >
                                Save and add another
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAndContinue}
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

export default StartingCityAdd;
