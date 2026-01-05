import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const UmrahDestinationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        country: "",
    });
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDestination = useCallback(async () => {
        try {
            const response = await axios.get(`/api/umrah-destinations/${id}/`);
            setFormData({
                name: response.data.name,
                country: response.data.country,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching Umrah destination:", error);
            setStatusMessage({ text: "Failed to fetch destination details", type: "error" });
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDestination();
    }, [fetchDestination]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e, action = "save") => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.country) {
            setStatusMessage({ text: "Please fill in all required fields.", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ text: "", type: "" });

        try {
            await axios.put(`/api/umrah-destinations/${id}/`, formData);

            if (action === "continue") {
                setStatusMessage({ text: "Changes saved successfully!", type: "success" });
                setIsSubmitting(false);
            } else {
                navigate("/admin/umrah-destinations");
            }
        } catch (error) {
            console.error("Error updating Umrah destination:", error);
            setStatusMessage({ text: "Failed to update destination. Please try again.", type: "error" });
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this Umrah destination?")) {
            try {
                await axios.delete(`/api/umrah-destinations/${id}/`);
                navigate("/admin/umrah-destinations");
            } catch (error) {
                console.error("Error deleting destination:", error);
                setStatusMessage({ text: "Failed to delete destination.", type: "error" });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex bg-gray-100 min-h-screen">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate("/admin/umrah-destinations")}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft size={24} className="text-gray-600" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-800">Edit Umrah Destination</h1>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium flex items-center gap-2 transition-all border border-red-200"
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>

                        {statusMessage.text && (
                            <div
                                className={`mb-6 p-4 rounded-lg flex justify-between items-center ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                <span>{statusMessage.text}</span>
                                <button onClick={() => setStatusMessage({ text: "", type: "" })}>✕</button>
                            </div>
                        )}

                        <form className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            City Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "save")}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-[#14532d] hover:bg-[#1f7a45] text-white rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    SAVE
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "continue")}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 border border-[#14532d] text-[#14532d] hover:bg-green-50 rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                    SAVE AND CONTINUE EDITING
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UmrahDestinationEdit;
