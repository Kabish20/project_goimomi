import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

// Helper to fix image URLs
const getImageUrl = (url) => {
    if (!url) return "";
    if (typeof url !== "string") return url;
    if (url.startsWith("http")) {
        return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
    }
    return url;
};

const AdminCountryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        header_image: null,
    });
    const [headerPreview, setHeaderPreview] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCountry = useCallback(async () => {
        try {
            const response = await axios.get(`/api/countries/${id}/`);
            const data = response.data;
            setFormData({
                ...data,
                header_image: null,
            });
            setHeaderPreview(getImageUrl(data.header_image));
        } catch (error) {
            console.error("Error fetching country:", error);
            setStatusMessage({ text: "Failed to fetch country details", type: "error" });
        }
    }, [id]);

    useEffect(() => {
        fetchCountry();
    }, [fetchCountry]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
            if (name === 'header_image') {
                setHeaderPreview(URL.createObjectURL(files[0]));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.name) {
            setStatusMessage({ text: "Country Name is required.", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ text: "", type: "" });

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] instanceof File) {
                    data.append(key, formData[key]);
                } else if (key !== 'header_image') {
                    data.append(key, formData[key]);
                }
            });

            await axios.put(`/api/countries/${id}/`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setStatusMessage({ text: "Country updated successfully!", type: "success" });
            fetchCountry();
            setIsSubmitting(false);

        } catch (error) {
            console.error("Error updating country:", error);
            setStatusMessage({ text: "Failed to update country.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-3">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => navigate("/admin/countries")}
                                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight"
                            >
                                <ArrowLeft size={12} /> Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Edit Country</h1>
                        </div>

                        {statusMessage.text && (
                            <div className={`p-2 rounded mb-3 text-xs font-bold ring-1 overflow-hidden animate-in fade-in slide-in-from-top-2 ${statusMessage.type === "success" ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-700 ring-red-200"
                                }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={(e) => handleSubmit(e)} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Country Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic placeholder:text-gray-300 font-medium"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            ISO Country Code
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Fallback Header
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                name="header_image"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-green-50 file:text-[#14532d] hover:file:bg-green-100 cursor-pointer"
                                            />
                                            {headerPreview && (
                                                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-inner group">
                                                    <img src={headerPreview} alt="Header Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[9px] font-bold p-1 text-center backdrop-blur-sm">Current Header</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                                <button
                                    type="submit"
                                    onClick={() => handleSubmit(null)}
                                    disabled={isSubmitting}
                                    className="px-8 py-2 bg-[#14532d] text-white rounded-xl hover:bg-[#0f4a24] transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-900/20"
                                >
                                    {isSubmitting ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCountryEdit;
