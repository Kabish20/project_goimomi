import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Camera, Users, Briefcase, Settings, Info, Plus, Calendar, MapPin, Trash2 } from "lucide-react";
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

const VehicleMasterAdd = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        seating_capacity: "4",
        luggage_capacity: "2",
        drive: "Manual",
        driver: "",
        description: "",
        photo: null
    });

    const [rateCard, setRateCard] = useState({
        country: "",
        name: "",
        validity_start: "",
        validity_end: "",
        routes: [{ start_from: "", drop_to: "", v1: "", v2: "", v3: "", v4: "" }]
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchBrands();
        fetchDrivers();
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await axios.get("/api/countries/");
            setCountries(res.data || []);
        } catch (err) {
            console.error("Error fetching countries:", err);
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await axios.get("/api/driver-masters/");
            setDrivers(res.data || []);
        } catch (err) {
            console.error("Error fetching drivers:", err);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get("/api/vehicle-brands/");
            setBrands(res.data);
        } catch (err) {
            console.error("Error fetching brands:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (!formData.driver) {
                alert("Please select a Driver Name.");
                return;
            }
            setCurrentStep(2);
            return;
        }

        if (!rateCard.name || !rateCard.country) {
            alert("Please provide at least a Name and Country for the Rate Card.");
            return;
        }

        setLoading(true);
        try {
            // 1. Create Vehicle
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== "") {
                    fd.append(key, formData[key]);
                }
            });

            const vehicleRes = await axios.post("/api/vehicle-masters/", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // 2. Create Rate Card
            // Assuming we want to create it as a separate master based on the payload structure
            await axios.post("/api/vehicle-rate-cards/", {
                ...rateCard
            });

            alert("Vehicle Master and Rate Card created successfully!");
            navigate("/admin/vehicle-masters");
        } catch (err) {
            console.error("Error creating record:", err);
            alert("Failed to complete registration.");
        } finally {
            setLoading(false);
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

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => currentStep === 1 ? navigate("/admin/vehicle-masters") : setCurrentStep(1)}
                                className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> {currentStep === 1 ? "Back to Vehicles" : "Back to Basic Specs"}
                            </button>

                            <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                <div className={`flex items-center gap-2 ${currentStep === 1 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 1 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>1</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Specifications</span>
                                </div>
                                <div className="w-8 h-[2px] bg-gray-50"></div>
                                <div className={`flex items-center gap-2 ${currentStep === 2 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 2 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>2</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Rate Card</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
                                    {currentStep === 1 ? "Create New Vehicle" : "Vehicle Route Rate Card"}
                                </h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                    {currentStep === 1 ? "Register a new vehicle in your fleet master" : "Set route-based pricing for different vehicle categories"}
                                </p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Saving..." : (currentStep === 1 ? "Next page" : "Save Vehicle & Rate Card")}
                            </button>
                        </div>

                        {currentStep === 1 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Side: Forms */}
                                <div className="lg:col-span-2 space-y-6">
                                    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">General specifications</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <FormLabel label="Vehicle Name / Model" optional />
                                                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Toyota Innova Crysta" />
                                            </div>

                                            <div className="md:col-span-2">
                                                <FormLabel label="Vehicle Brand" optional />
                                                <SearchableSelect
                                                    options={brands.map(b => ({ value: b.id, label: b.name }))}
                                                    value={formData.brand}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}
                                                    placeholder="Select Brand..."
                                                />
                                            </div>

                                            <div>
                                                <FormLabel label="Seating Capacity" optional />
                                                <div className="relative">
                                                    <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                    <input
                                                        type="number"
                                                        name="seating_capacity"
                                                        value={formData.seating_capacity}
                                                        onChange={handleInputChange}
                                                        className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <FormLabel label="Luggage Capacity (Bags)" optional />
                                                <div className="relative">
                                                    <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                    <input
                                                        type="number"
                                                        name="luggage_capacity"
                                                        value={formData.luggage_capacity}
                                                        onChange={handleInputChange}
                                                        className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <FormLabel label="Transmission / Drive" optional />
                                                <div className="relative">
                                                    <Settings size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                    <select
                                                        name="drive"
                                                        value={formData.drive}
                                                        onChange={handleInputChange}
                                                        className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all appearance-none"
                                                    >
                                                        <option value="Manual">Manual</option>
                                                        <option value="Automatic">Automatic</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <FormLabel label="Driver Name" required />
                                                <SearchableSelect
                                                    options={drivers.map(d => ({ value: d.id, label: d.name, subtitle: d.mobile_number }))}
                                                    value={formData.driver}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, driver: val }))}
                                                    placeholder="Select Driver..."
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <FormLabel label="Vehicle Description" />
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                    placeholder="Tell something about this vehicle (features, comfort, etc.)"
                                                    className="bg-white border-2 border-gray-100 px-4 py-3 rounded-2xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Side: Media */}
                                <div className="space-y-6">
                                    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Vehicle Photo</h2>
                                        </div>

                                        <div className="aspect-[4/3] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d]/30 transition-colors">
                                            {preview ? (
                                                <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="Vehicle Preview" />
                                            ) : (
                                                <div className="text-center p-6">
                                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-[#14532d] group-hover:scale-110 transition-all">
                                                        <Camera size={24} />
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Upload Car Photo</p>
                                                    <p className="text-[8px] text-gray-400 mt-1 uppercase">JPG, PNG up to 5MB</p>
                                                </div>
                                            )}
                                            <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />

                                            {preview && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">Change Photo</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                            <div className="flex gap-3">
                                                <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
                                                <div>
                                                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider mb-1">Image Tips</p>
                                                    <p className="text-[9px] text-blue-700/70 leading-relaxed font-medium">Use a high-quality side-view or 3/4 view photo of the vehicle with a clean background.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-5xl mx-auto pb-12">
                                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Rate Card Configuration</h2>
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
                                                placeholder="e.g. Summer 2024 Transfer Rates"
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
                                                                <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                                                <input
                                                                    className="w-full bg-white border border-gray-100 pl-8 pr-3 py-2 rounded-lg text-[11px] font-bold focus:outline-none focus:border-[#14532d]"
                                                                    placeholder="Pickup Point"
                                                                    value={route.start_from}
                                                                    onChange={(e) => handleRouteParamChange(idx, 'start_from', e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="relative">
                                                                <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                                                <input
                                                                    className="w-full bg-white border border-gray-100 pl-8 pr-3 py-2 rounded-lg text-[11px] font-bold focus:outline-none focus:border-[#14532d]"
                                                                    placeholder="Drop Destination"
                                                                    value={route.drop_to}
                                                                    onChange={(e) => handleRouteParamChange(idx, 'drop_to', e.target.value)}
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleMasterAdd;
