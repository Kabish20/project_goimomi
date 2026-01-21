import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminVisaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        country: "",
        title: "",
        entry_type: "Single",
        validity: "30 days",
        duration: "30 days",
        processing_time: "3-5 Business Days",
        price: "",
        documents_required: "Passport Front, Photo",
        visa_type: "Paper Visa",
        is_active: true,
        header_image: null,
        card_image: null,
    });
    const [headerPreview, setHeaderPreview] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountries] = useState([]);

    // Helper to fix image URLs
    const getImageUrl = (url) => {
        if (!url) return "";
        if (typeof url !== "string") return url;
        if (url.startsWith("http")) {
            return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
        }
        return url;
    };

    useEffect(() => {
        fetchCountries();
        fetchVisa();
    }, [id]);

    const fetchCountries = async () => {
        try {
            const response = await axios.get("/api/countries/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchVisa = async () => {
        try {
            const response = await axios.get(`/api/visas/${id}/`);
            const data = response.data;
            setFormData({
                ...data,
                header_image: null,
                card_image: null
            });
            setHeaderPreview(getImageUrl(data.header_image));
            setCardPreview(getImageUrl(data.card_image));
        } catch (error) {
            console.error("Error fetching visa:", error);
            setStatusMessage({ text: "Failed to fetch visa details", type: "error" });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleSubmit = async (e, action = "save") => {
        if (e) e.preventDefault();

        if (!formData.country || !formData.title || !formData.price) {
            setStatusMessage({ text: "Please fill in all required fields.", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ text: "", type: "" });

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] instanceof File) {
                    data.append(key, formData[key]);
                } else if (key !== 'header_image' && key !== 'card_image') {
                    data.append(key, formData[key]);
                }
            });

            const response = await axios.put(`/api/visas/${id}/`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (action === "continue") {
                setStatusMessage({ text: "Visa updated successfully!", type: "success" });
                fetchVisa();
                setIsSubmitting(false);
            } else if (action === "another") {
                navigate("/admin/visas/add");
            } else {
                navigate("/admin/visas");
            }
        } catch (error) {
            console.error("Error updating visa:", error);
            setStatusMessage({ text: "Failed to update visa. Please try again.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => navigate("/admin/visas")}
                                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs font-semibold flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">Edit Visa</h1>
                        </div>

                        {statusMessage.text && (
                            <div className={`p-3 rounded mb-4 text-sm font-medium ${statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={(e) => handleSubmit(e)} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((c) => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Vietnam E-Visa"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Visa Type
                                        </label>
                                        <select
                                            name="visa_type"
                                            value={formData.visa_type}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="Paper Visa">Paper Visa</option>
                                            <option value="Sticker Visa">Sticker Visa</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Entry Type
                                        </label>
                                        <select
                                            name="entry_type"
                                            value={formData.entry_type}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Multiple">Multiple</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Validity
                                        </label>
                                        <input
                                            type="text"
                                            name="validity"
                                            value={formData.validity}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Processing Time
                                        </label>
                                        <input
                                            type="text"
                                            name="processing_time"
                                            value={formData.processing_time}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Price (₹) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 flex items-center pt-6">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-[#14532d] focus:ring-[#14532d] border-gray-300 rounded"
                                            xmlSpace="preserve"
                                        />
                                        <label className="ml-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Is Active?
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Header Image
                                        </label>
                                        {headerPreview && (
                                            <div className="mb-2">
                                                <img src={headerPreview} alt="Header Preview" className="h-20 w-full object-cover rounded border" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="header_image"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        />
                                        <p className="text-[10px] text-gray-500 italic">Leave empty to keep current</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Card Image
                                        </label>
                                        {cardPreview && (
                                            <div className="mb-2">
                                                <img src={cardPreview} alt="Card Preview" className="h-20 w-full object-cover rounded border" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="card_image"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                        />
                                        <p className="text-[10px] text-gray-500 italic">Leave empty to keep current</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Documents Required (Comma separated)
                                    </label>
                                    <textarea
                                        name="documents_required"
                                        value={formData.documents_required}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t flex flex-wrap justify-end gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-[#14532d] text-white rounded hover:bg-[#0f4a24] transition-colors disabled:opacity-50 text-sm font-semibold"
                                >
                                    <Save size={14} /> SAVE
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "another")}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-[#1f7a45] text-white rounded hover:bg-[#1a6338] transition-colors disabled:opacity-50 text-sm font-semibold"
                                >
                                    <Plus size={14} /> ADD NEW
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "continue")}
                                    disabled={isSubmitting}
                                    className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-semibold"
                                >
                                    UPDATE + STAY
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVisaEdit;
