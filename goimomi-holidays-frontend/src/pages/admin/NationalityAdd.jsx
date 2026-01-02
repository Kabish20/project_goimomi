import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const NationalityAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        country: "",
        nationality: "",
        continent: "Asia",
    });
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Other"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e, action = "save") => {
        if (e) e.preventDefault();

        if (!formData.country || !formData.nationality) {
            setStatusMessage({ text: "Please fill in all required fields.", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ text: "", type: "" });

        try {
            const response = await axios.post("/api/nationalities/", formData);

            if (action === "continue") {
                navigate(`/admin/nationalities/edit/${response.data.id}`);
            } else if (action === "another") {
                setFormData({ country: "", nationality: "", continent: "Asia" });
                setStatusMessage({ text: "Nationality added successfully! Add another one.", type: "success" });
                setIsSubmitting(false);
            } else {
                navigate("/admin/nationalities");
            }
        } catch (error) {
            console.error("Error adding nationality:", error);
            setStatusMessage({ text: "Failed to add nationality. Please try again.", type: "error" });
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
                                onClick={() => navigate("/admin/nationalities")}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={24} className="text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Add nationality</h1>
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
                                            Country Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="e.g., Algeria"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Nationality <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            placeholder="e.g., Algerian"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Continent <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="continent"
                                        value={formData.continent}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    >
                                        {continents.map((continent) => (
                                            <option key={continent} value={continent}>
                                                {continent}
                                            </option>
                                        ))}
                                    </select>
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

export default NationalityAdd;
