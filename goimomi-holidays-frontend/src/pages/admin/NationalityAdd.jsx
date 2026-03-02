import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Save, Plus, Globe, Flag, Map } from "lucide-react";
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
        setStatusMessage({ text: "", type: "" });
    };

    const handleSubmit = async (e, action = "save") => {
        if (e) e.preventDefault();

        if (!formData.country || !formData.nationality) {
            setStatusMessage({ text: "Please provide both country and nationality tag.", type: "error" });
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
                setStatusMessage({ text: "Nationality catalogued! Processing next...", type: "success" });
                setIsSubmitting(false);
            } else {
                navigate("/admin/nationalities");
            }
        } catch (error) {
            console.error("Error adding nationality:", error);
            setStatusMessage({ text: "Transmission failed. Please check registry headers.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
            </style>
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Add Nationality</h1>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                            <span className="text-green-500">Geography</span> / <span>Inventory</span> / <span className="text-gray-900">New Heritage Entry</span>
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#fcfdfc]">
                    <div className="max-w-xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/nationalities")}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#14532d] mb-8 transition-all font-black text-[10px] uppercase tracking-widest group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Matrix
                        </button>

                        <div className="bg-white rounded-[2rem] shadow-xl shadow-green-900/[0.03] border border-gray-100 overflow-hidden">
                            <div className="p-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#14532d]">
                                        <Map size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">Heritage Profile</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Cultural Identification</p>
                                    </div>
                                </div>

                                {statusMessage.text && (
                                    <div className={`mb-8 p-4 border-2 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-xl shadow-green-900/5 ${statusMessage.type === "success" ? "bg-green-50 border-green-100 text-[#14532d]" : "bg-red-50 border-red-100 text-red-700"
                                        }`}>
                                        <div className={`p-1.5 rounded-full text-xs font-black ${statusMessage.type === "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
                                            }`}>
                                            {statusMessage.type === "success" ? "✨" : "!"}
                                        </div>
                                        <p className="font-bold text-[10px] uppercase tracking-wider">{statusMessage.text}</p>
                                    </div>
                                )}

                                <form className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Official Country *</label>
                                        <div className="relative group">
                                            <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#14532d] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                placeholder="e.g. Switzerland"
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-[#14532d] focus:outline-none transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nationality Tag *</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#14532d] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="nationality"
                                                value={formData.nationality}
                                                onChange={handleChange}
                                                placeholder="e.g. Swiss"
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-[#14532d] focus:outline-none transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Continent Association</label>
                                        <select
                                            name="continent"
                                            value={formData.continent}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-[#14532d] focus:outline-none transition-all font-black text-[10px] text-gray-900 tracking-widest uppercase shadow-inner cursor-pointer"
                                        >
                                            {continents.map((continent) => (
                                                <option key={continent} value={continent}>
                                                    {continent.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="pt-8 flex flex-col gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => handleSubmit(e, "save")}
                                            disabled={isSubmitting}
                                            className="w-full flex items-center justify-center gap-3 bg-[#14532d] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#0f3d21] transition-all shadow-xl shadow-green-900/20 active:scale-95 disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {isSubmitting ? "SYNCING..." : "COMMIT ENTRY"}
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={(e) => handleSubmit(e, "another")}
                                                disabled={isSubmitting}
                                                className="flex items-center justify-center gap-2 bg-[#14532d]/5 text-[#14532d] px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#14532d]/10 transition-all border border-[#14532d]/10"
                                            >
                                                <Plus size={14} />
                                                SUBMIT & NEW
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleSubmit(e, "continue")}
                                                disabled={isSubmitting}
                                                className="flex items-center justify-center gap-2 bg-gray-50 text-gray-400 px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                                            >
                                                SUBMIT & EDIT
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NationalityAdd;
