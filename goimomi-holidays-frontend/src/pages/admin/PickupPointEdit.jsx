import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Info, Loader, Save, Search } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const FormLabel = ({ label, required, optional }) => (
    <div className="flex items-center gap-2 mb-1.5">
        <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.15em]">{label} {required && <span className="text-red-500">*</span>}</span>
        {optional && <span className="text-[#14532d] text-[8px] font-black bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
    </div>
);

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selectedOption = options.find(o => o.value === value);

    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border-2 border-gray-100 px-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold cursor-pointer flex justify-between items-center hover:border-gray-200 transition-all focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <Search size={14} className="text-gray-300" />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="relative">
                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search cities..."
                                className="w-full bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-lg text-xs font-bold focus:outline-none focus:border-[#14532d] transition-all"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
                                >
                                    <p className={`text-[11px] font-black uppercase tracking-wider ${value === opt.value ? 'text-[#14532d]' : 'text-gray-700'}`}>
                                        {opt.label}
                                    </p>
                                    {opt.subtitle && <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{opt.subtitle}</p>}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">No cities found matches your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};

const PickupPointEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        city: "",
        name: ""
    });

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const fetchInitialData = async () => {
        try {
            setFetching(true);
            const [pointRes, citiesRes] = await Promise.all([
                api.get(`/api/pickup-point-masters/${id}/`),
                api.get("/api/destinations/")
            ]);
            setFormData({
                city: pointRes.data.city,
                name: pointRes.data.name
            });
            setCities(citiesRes.data);
            setFetching(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            alert("Record not found.");
            navigate("/admin/pickup-point-masters");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.city || !formData.name) {
            alert("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/api/pickup-point-masters/${id}/`, formData);
            alert("Pickup Point updated successfully!");
            navigate("/admin/pickup-point-masters");
        } catch (err) {
            console.error("Error updating point:", err);
            alert("Failed to update pickup point.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-[#14532d]" size={40} />
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Fetching Point Details...</p>
            </div>
        </div>
    );

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/pickup-point-masters")}
                            className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-6 group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Master List
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">Edit Pickup Point</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Update location details for this pickup point</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Basic Information</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <FormLabel label="City Association" required />
                                            <SearchableSelect
                                                options={cities.map(c => ({ value: c.id, label: c.name, subtitle: c.country }))}
                                                value={formData.city}
                                                onChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
                                                placeholder="Choose a city..."
                                            />
                                        </div>

                                        <div>
                                            <FormLabel label="Pickup Point Name" required />
                                            <div className="relative">
                                                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g. Airport Terminal 1"
                                                    className="bg-white border-2 border-gray-100 pl-11 pr-4 py-3 rounded-2xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <section className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                                    <div className="flex gap-3">
                                        <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Update Note</p>
                                            <p className="text-[9px] text-blue-700/70 leading-relaxed font-bold">Changing the point name or city here will reflect across all holiday packages using this master template point.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickupPointEdit;
