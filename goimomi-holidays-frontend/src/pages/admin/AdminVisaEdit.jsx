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
        is_active: true,
    });
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountries] = useState([]);

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
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching visa:", error);
            setStatusMessage({ text: "Failed to fetch visa details", type: "error" });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
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
            const response = await axios.put(`/api/visas/${id}/`, formData);

            if (action === "continue") {
                setStatusMessage({ text: "Visa updated successfully!", type: "success" });
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
                <div className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate("/admin/visas")}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={24} className="text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Edit Visa</h1>
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

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Vietnam E-Visa"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Entry Type
                                        </label>
                                        <select
                                            name="entry_type"
                                            value={formData.entry_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
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
                                    onClick={(e) => handleSubmit(e, "another")}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-[#1f7a45] hover:bg-[#2d915a] text-white rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <Plus size={18} />
                                    SAVE AND ADD ANOTHER
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

export default AdminVisaEdit;
