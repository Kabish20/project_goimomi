import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, Save, Plus, ChevronDown, Search } from "lucide-react";
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
        visa_type: "E-Visa",
        is_active: true,
        header_image: null,
        card_image: null,
    });
    const [headerPreview, setHeaderPreview] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountries] = useState([]);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearchTerm, setCountrySearchTerm] = useState("");

    const fetchCountries = useCallback(async () => {
        try {
            const response = await axios.get("/api/countries/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }, []);

    const fetchVisa = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        fetchCountries();
        fetchVisa();
    }, [fetchCountries, fetchVisa]);

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

            await axios.put(`/api/visas/${id}/`, data, {
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
                                        <div className="relative">
                                            <div
                                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all cursor-pointer flex items-center justify-between bg-white"
                                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            >
                                                <span className={formData.country ? "text-gray-900" : "text-gray-500"}>
                                                    {formData.country || "Select Country"}
                                                </span>
                                                <ChevronDown size={16} className="text-gray-500" />
                                            </div>

                                            {isCountryDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                                                    <div className="p-2 border-b border-gray-100">
                                                        <div className="relative">
                                                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                value={countrySearchTerm}
                                                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                                                placeholder="Search country..."
                                                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded bg-gray-50 focus:outline-none focus:border-[#14532d]"
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="overflow-y-auto flex-1">
                                                        {countries.filter(c => c.name.toLowerCase().includes(countrySearchTerm.toLowerCase())).length > 0 ? (
                                                            countries
                                                                .filter(c => c.name.toLowerCase().includes(countrySearchTerm.toLowerCase()))
                                                                .map((c) => (
                                                                    <div
                                                                        key={c.id}
                                                                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${formData.country === c.name ? "bg-[#14532d]/10 text-[#14532d] font-medium" : "text-gray-700"}`}
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, country: c.name });
                                                                            setIsCountryDropdownOpen(false);
                                                                            setCountrySearchTerm("");
                                                                        }}
                                                                    >
                                                                        {c.name}
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <div className="px-3 py-2 text-sm text-gray-500 text-center">No countries found</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Visa Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Tourist Visa"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Entry Type
                                        </label>
                                        <select
                                            name="entry_type"
                                            value={formData.entry_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Multiple">Multiple</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Validity
                                        </label>
                                        <input
                                            type="text"
                                            name="validity"
                                            value={formData.validity}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. 30 days"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. 30 days"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Processing Time
                                        </label>
                                        <input
                                            type="text"
                                            name="processing_time"
                                            value={formData.processing_time}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. 3-5 Business Days"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Price <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. 150"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Visa Type
                                        </label>
                                        <select
                                            name="visa_type"
                                            value={formData.visa_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="E-Visa">E-Visa</option>
                                            <option value="Sticker Visa">Sticker Visa</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Documents Required
                                        </label>
                                        <input
                                            type="text"
                                            name="documents_required"
                                            value={formData.documents_required}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Passport Front, Photo"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Header Image
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                name="header_image"
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all bg-white"
                                            />
                                            {headerPreview && (
                                                <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                                                    <img src={headerPreview} alt="Header Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-700 uppercase">
                                            Card Image
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                name="card_image"
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all bg-white"
                                            />
                                            {cardPreview && (
                                                <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                                                    <img src={cardPreview} alt="Card Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 md:col-span-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-[#14532d] focus:ring-[#14532d] border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                                            Active Status
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex gap-2 justify-end border-t border-gray-200">
                                <button
                                    type="submit"
                                    onClick={() => handleSubmit(null, "save")}
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#14532d] hover:bg-[#0f4a24] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14532d] disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? "Saving..." : <><Save size={16} className="mr-2" /> Save Changes</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(null, "continue")}
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14532d] disabled:opacity-50 transition-colors"
                                >
                                    Save & Continue Editing
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