import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
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
            await axios.post("/api/countries/", form);
            navigate("/admin/countries");
        } catch (err) {
            console.error("Error adding country:", err);
            setError("Failed to add country. Perhaps the name already exists?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/countries")}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors font-bold text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} /> Back to Countries
                        </button>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h1 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest">Add New Country</h1>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Country Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="e.g. United Arab Emirates"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Country Code (Optional)</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={form.code}
                                            onChange={handleChange}
                                            placeholder="e.g. UAE"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all font-mono uppercase"
                                            maxLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#14532d] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0f3d21] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? "Saving..." : "Create Country"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountryAdd;
