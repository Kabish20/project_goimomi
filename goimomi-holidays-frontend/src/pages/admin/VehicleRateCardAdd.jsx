import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, MapPin, Trash2, Globe, Info } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const FormLabel = ({ label, required, optional }) => (
    <div className="flex items-center gap-2 mb-1.5">
        <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.15em]">{label} {required && <span className="text-red-500">*</span>}</span>
        {optional && <span className="text-[#14532d] text-[8px] font-black bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
    </div>
);

const Input = (props) => (
    <input
        {...props}
        className="bg-white border-2 border-gray-100 px-3 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200"
    />
);

const VehicleRateCardAdd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [rateCard, setRateCard] = useState({
        country: "",
        name: "",
        validity_start: "",
        validity_end: "",
        routes: [{ start_from: "", drop_to: "", v1: "", v2: "", v3: "", v4: "" }]
    });

    useEffect(() => {
        fetchCountries();
        fetchPickupPoints();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await axios.get("/api/countries/");
            setCountries(res.data || []);
        } catch (err) {
            console.error("Error fetching countries:", err);
        }
    };

    const fetchPickupPoints = async () => {
        try {
            const res = await axios.get("/api/pickup-point-masters/");
            setPickupPoints(res.data || []);
        } catch (err) {
            console.error("Error fetching pickup points:", err);
        }
    };

    const addRouteRow = () => {
        setRateCard(prev => ({
            ...prev,
            routes: [...prev.routes, { start_from: "", drop_to: "", v1: "", v2: "", v3: "", v4: "" }]
        }));
    };

    const removeRouteRow = (index) => {
        if (rateCard.routes.length <= 1) return;
        setRateCard(prev => ({
            ...prev,
            routes: prev.routes.filter((_, i) => i !== index)
        }));
    };

    const handleRouteParamChange = (index, field, value) => {
        const newRoutes = [...rateCard.routes];
        newRoutes[index][field] = value;
        setRateCard(prev => ({ ...prev, routes: newRoutes }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rateCard.name || !rateCard.country) {
            alert("Please provide at least a Name and Country.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/vehicle-rate-cards/", rateCard);
            alert("Rate Card created successfully!");
            navigate("/admin/vehicle-rate-cards");
        } catch (err) {
            console.error("Error creating rate card:", err);
            alert("Failed to create rate card.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-50 h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/vehicle-rate-cards")}
                            className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-8 group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Rate Cards
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">Create Rate Card</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Define new route pricing matrix</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Rate Card"}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                    <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">General Configuration</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <FormLabel label="Target Country" required />
                                        <SearchableSelect
                                            options={countries.map(c => ({ value: c.name, label: c.name }))}
                                            value={rateCard.country}
                                            onChange={(val) => setRateCard(prev => ({ ...prev, country: val }))}
                                            placeholder="Select Country..."
                                        />
                                    </div>

                                    <div>
                                        <FormLabel label="Rate Card Name" required />
                                        <Input
                                            placeholder="e.g. Dubai Standard Rates 2024"
                                            value={rateCard.name}
                                            onChange={(e) => setRateCard(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <FormLabel label="Validity Start" required />
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="date"
                                                value={rateCard.validity_start}
                                                onChange={(e) => setRateCard(prev => ({ ...prev, validity_start: e.target.value }))}
                                                className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <FormLabel label="Validity End" required />
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="date"
                                                value={rateCard.validity_end}
                                                onChange={(e) => setRateCard(prev => ({ ...prev, validity_end: e.target.value }))}
                                                className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 pb-0 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Route Matrix (Pricing)</h2>
                                    </div>
                                    <button
                                        onClick={addRouteRow}
                                        className="flex items-center gap-2 bg-[#14532d]/5 text-[#14532d] px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all"
                                    >
                                        <Plus size={14} /> Add New Route
                                    </button>
                                </div>

                                <div className="p-4 md:p-6 overflow-x-auto">
                                    <table className="w-full border-collapse min-w-[800px]">
                                        <thead>
                                            <tr>
                                                <th className="text-left p-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Starting From</th>
                                                <th className="text-left p-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Dropping To</th>
                                                <th className="text-center p-4 text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/50">Vehicle 1</th>
                                                <th className="text-center p-4 text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/50">Vehicle 2</th>
                                                <th className="text-center p-4 text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/50">Vehicle 3</th>
                                                <th className="text-center p-4 text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/50">Vehicle 4</th>
                                                <th className="p-4 border-b border-gray-50"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rateCard.routes.map((route, idx) => (
                                                <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-2">
                                                        <div className="relative">
                                                            <SearchableSelect
                                                                options={pickupPoints.map(p => ({
                                                                    value: p.name,
                                                                    label: p.name,
                                                                    subtitle: p.city_name
                                                                }))}
                                                                value={route.start_from}
                                                                onChange={val => handleRouteParamChange(idx, 'start_from', val)}
                                                                placeholder="Pickup Point"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="relative">
                                                            <SearchableSelect
                                                                options={pickupPoints.map(p => ({
                                                                    value: p.name,
                                                                    label: p.name,
                                                                    subtitle: p.city_name
                                                                }))}
                                                                value={route.drop_to}
                                                                onChange={val => handleRouteParamChange(idx, 'drop_to', val)}
                                                                placeholder="Drop Destination"
                                                            />
                                                        </div>
                                                    </td>
                                                    {[1, 2, 3, 4].map(vNum => (
                                                        <td key={vNum} className="p-2 bg-gray-50/20">
                                                            <input
                                                                type="number"
                                                                className="w-full bg-white border border-gray-100 px-3 py-2 rounded-lg text-[11px] font-bold text-center focus:outline-none focus:border-[#14532d]"
                                                                placeholder="Rate"
                                                                value={route[`v${vNum}`]}
                                                                onChange={(e) => handleRouteParamChange(idx, `v${vNum}`, e.target.value)}
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="p-2 text-center">
                                                        <button
                                                            onClick={() => removeRouteRow(idx)}
                                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                                    <div className="flex gap-4">
                                        <Info className="text-[#14532d]/40 shrink-0" size={16} />
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
                                            Rates should be numeric values only. Vehicle columns represent different pricing tiers or vehicle categories (e.g. Sedan, SUV, etc).
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleRateCardAdd;
