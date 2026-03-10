import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Plus, Minus, Info, Loader, Save, Search } from "lucide-react";
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

const PickupPointAdd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [selectedCity, setSelectedCity] = useState("");
    const [points, setPoints] = useState([""]); // Array of point names

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const res = await api.get("/api/destinations/");
            setCities(res.data);
            setFetching(false);
        } catch (err) {
            console.error("Error fetching cities:", err);
            setFetching(false);
        }
    };

    const addRow = () => setPoints([...points, ""]);

    const removeRow = (index) => {
        if (points.length <= 1) return;
        setPoints(points.filter((_, i) => i !== index));
    };

    const handlePointChange = (index, value) => {
        const newPoints = [...points];
        newPoints[index] = value;
        setPoints(newPoints);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCity) {
            alert("Please select a City first.");
            return;
        }

        const validPoints = points.filter(p => p.trim() !== "");
        if (validPoints.length === 0) {
            alert("Please add at least one Pickup Point.");
            return;
        }

        setLoading(true);
        try {
            // Send each point as a separate request
            const promises = validPoints.map(p =>
                api.post("/api/pickup-point-masters/", {
                    city: selectedCity,
                    name: p
                })
            );

            await Promise.all(promises);
            alert("Pickup Points added successfully!");
            navigate("/admin/pickup-point-masters");
        } catch (err) {
            console.error("Error creating points:", err);
            alert("Failed to save some pickup points.");
        } finally {
            setLoading(true);
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-[#14532d]" size={40} />
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Initializing Master...</p>
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
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">Create Pickup Points</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Register multiple pickup points for a specific city</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                                {loading ? "Saving Points..." : "Save Pickup Points"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">City Selection</h2>

                                    <div className="mb-10">
                                        <FormLabel label="Select Lookup City" required />
                                        <SearchableSelect
                                            options={cities.map(c => ({ value: c.id, label: c.name, subtitle: c.country }))}
                                            value={selectedCity}
                                            onChange={setSelectedCity}
                                            placeholder="Choose a city to assign points..."
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Define Locations</h2>
                                        </div>
                                        <button
                                            onClick={addRow}
                                            className="flex items-center gap-2 text-[10px] font-black text-[#14532d] uppercase tracking-widest hover:bg-green-50 px-4 py-2 rounded-full transition-all border border-green-100"
                                        >
                                            <Plus size={12} /> Add Point
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {points.map((pt, idx) => (
                                            <div key={idx} className="flex gap-4 group animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                                <div className="flex-1 relative">
                                                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#14532d] transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={pt}
                                                        onChange={(e) => handlePointChange(idx, e.target.value)}
                                                        placeholder="e.g. Airport Terminal 1, Central Railway Station..."
                                                        className="bg-white border-2 border-gray-100 pl-11 pr-4 py-3 rounded-2xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeRow(idx)}
                                                    className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${points.length > 1 ? 'text-red-400 hover:bg-red-50' : 'text-gray-200 cursor-not-allowed'}`}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <section className="bg-[#14532d] rounded-3xl p-6 shadow-xl border border-[#14532d]/20 text-white">
                                    <h3 className="text-[14px] font-black uppercase tracking-widest mb-4">Quick Guide</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-black">1</div>
                                            <p className="text-[10px] text-green-50 leading-relaxed font-medium">Select the city where these pickup points are located.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-black">2</div>
                                            <p className="text-[10px] text-green-50 leading-relaxed font-medium">Use the <Plus size={8} className="inline mx-0.5" /> button to add as many locations as needed for that city.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-black">3</div>
                                            <p className="text-[10px] text-green-50 leading-relaxed font-medium">Points can be Landmarks, Airports, Hotels, or Railway Stations.</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                                    <div className="flex gap-3">
                                        <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Impact</p>
                                            <p className="text-[9px] text-blue-700/70 leading-relaxed font-bold">These points will be available as standardized options when creating itinerary plans for the selected city.</p>
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

export default PickupPointAdd;
