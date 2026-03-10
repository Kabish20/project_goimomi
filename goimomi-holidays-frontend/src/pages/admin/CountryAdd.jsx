import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Globe, Flag } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CountryAdd = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        code: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!form.name.trim()) {
            setError("Country name is required");
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/countries/", form);
            navigate("/admin/countries");
        } catch (err) {
            console.error("Error adding country:", err);
            setError("Failed to add country. Perhaps the name already exists?");
        } finally {
            setLoading(false);
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
                        <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Add New Country</h1>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                            <span className="text-green-500">Geography</span> / <span>Nationalities</span> / <span className="text-gray-900">New Entry</span>
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#fcfdfc]">
                    <div className="max-w-xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/countries")}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#14532d] mb-8 transition-all font-black text-[10px] uppercase tracking-widest group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </button>

                        <div className="bg-white rounded-[2rem] shadow-xl shadow-green-900/[0.03] border border-gray-100 overflow-hidden">
                            <div className="p-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#14532d]">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">Country Profile</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Territorial Identification</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-red-100 p-1.5 rounded-full text-xs font-black">!</div>
                                        <p className="font-bold text-[10px] uppercase tracking-wider">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Official Name *</label>
                                        <div className="relative group">
                                            <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#14532d] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="e.g. United Arab Emirates"
                                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-[#14532d] focus:outline-none transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">ISO / Short Code</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={form.code}
                                            onChange={handleChange}
                                            placeholder="e.g. UAE"
                                            maxLength={3}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-[#14532d] focus:outline-none transition-all font-mono font-black text-sm text-gray-900 placeholder:text-gray-300 uppercase tracking-widest shadow-inner"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-3 bg-[#14532d] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#0f3d21] transition-all shadow-xl shadow-green-900/20 active:scale-95 disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {loading ? "INITIALIZING..." : "PUBLISH COUNTRY"}
                                        </button>
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

export default CountryAdd;

