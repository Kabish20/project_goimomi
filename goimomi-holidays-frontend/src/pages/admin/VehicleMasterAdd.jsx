import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Camera, Users, Briefcase, Settings, Info, Plus, Calendar, MapPin, Trash2, Minus, ArrowRight } from "lucide-react";
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
    const routeMatrixRef = React.useRef(null);
    const [brands, setBrands] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [startingCities, setStartingCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const MAX_VEHICLES = 10;
    const [vehicleCount, setVehicleCount] = useState(4);
    const [selectedCity, setSelectedCity] = useState("");

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
        supplier: "",
        name: "",
        validity_start: "",
        validity_end: "",
        routes: [{ start_from: "", drop_to: "", vehicles: Array(4).fill("") }]
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchBrands();
        fetchDrivers();
        fetchCountries();
        fetchSuppliers();
        fetchPickupPoints();
        fetchStartingCities();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await axios.get("/api/countries/");
            setCountries(res.data || []);
        } catch (err) {
            console.error("Error fetching countries:", err);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("/api/suppliers/");
            const allSuppliers = res.data || [];
            const cabSuppliers = allSuppliers.filter(s =>
                Array.isArray(s.services) && s.services.includes("Cab")
            );
            setSuppliers(cabSuppliers);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
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

    const fetchPickupPoints = async () => {
        try {
            const res = await axios.get("/api/pickup-point-masters/");
            setPickupPoints(res.data || []);
        } catch (err) {
            console.error("Error fetching pickup points:", err);
        }
    };

    const fetchStartingCities = async () => {
        try {
            const res = await axios.get("/api/starting-cities/");
            setStartingCities(res.data || []);
        } catch (err) {
            console.error("Error fetching starting cities:", err);
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
            if (!formData.name || !formData.brand || !formData.seating_capacity || !formData.luggage_capacity) {
                alert("Please fill in all required vehicle specifications.");
                return;
            }
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            if (!rateCard.name || !rateCard.country || !rateCard.validity_start || !rateCard.validity_end) {
                alert("Please provide Rate Card Name, Country, and Validity dates.");
                return;
            }
            setCurrentStep(3);
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
            const payload = { ...rateCard };
            delete payload.routes;

            payload.routes = rateCard.routes.map(route => {
                const formattedRoute = {
                    start_from: route.start_from,
                    drop_to: route.drop_to
                };
                for (let i = 0; i < vehicleCount; i++) {
                    formattedRoute[`v${i + 1}`] = route.vehicles[i] || "";
                }
                return formattedRoute;
            });

            await axios.post("/api/vehicle-rate-cards/", payload);

            alert("Vehicle Master and Rate Card created successfully!");
            navigate("/admin/vehicle-masters");
        } catch (err) {
            console.error("Error creating record:", err);
            alert("Failed to complete registration.");
        } finally {
            setLoading(false);
        }
    };

    // Add a vehicle column
    const addVehicle = () => {
        if (vehicleCount >= MAX_VEHICLES) return;
        const newCount = vehicleCount + 1;
        setVehicleCount(newCount);
        setRateCard(prev => ({
            ...prev,
            routes: prev.routes.map(r => ({
                ...r,
                vehicles: [...r.vehicles, ""]
            }))
        }));
    };

    // Remove a vehicle column
    const removeVehicle = () => {
        if (vehicleCount <= 1) return;
        const newCount = vehicleCount - 1;
        setVehicleCount(newCount);
        setRateCard(prev => ({
            ...prev,
            routes: prev.routes.map(r => ({
                ...r,
                vehicles: r.vehicles.slice(0, newCount)
            }))
        }));
    };

    const addRouteRow = () => {
        setRateCard(prev => ({
            ...prev,
            routes: [...prev.routes, { start_from: "", drop_to: "", vehicles: Array(vehicleCount).fill("") }]
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

    const handleVehicleRateChange = (rowIndex, vIndex, value) => {
        const newRoutes = [...rateCard.routes];
        const newVehicles = [...newRoutes[rowIndex].vehicles];
        newVehicles[vIndex] = value;
        newRoutes[rowIndex].vehicles = newVehicles;
        setRateCard(prev => ({ ...prev, routes: newRoutes }));
    };

    // Filter pickup points by selectedCity
    const filteredPickupPoints = selectedCity
        ? pickupPoints.filter(p => p.city_name === selectedCity)
        : pickupPoints;

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                                className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> {currentStep === 1 ? "Back to Vehicles" : currentStep === 2 ? "Back to Basic Specs" : "Back to Config"}
                            </button>

                            <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                <div className={`flex items-center gap-2 ${currentStep === 1 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 1 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>1</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Specifications</span>
                                </div>
                                <div className="w-8 h-[2px] bg-gray-50"></div>
                                <div className={`flex items-center gap-2 ${currentStep === 2 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 2 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>2</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Configuration</span>
                                </div>
                                <div className="w-8 h-[2px] bg-gray-50"></div>
                                <div className={`flex items-center gap-2 ${currentStep === 3 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 3 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>3</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Pricing</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
                                    {currentStep === 1 ? "Create New Vehicle" : currentStep === 2 ? "Rate Card Configuration" : "Vehicle Route Pricing"}
                                </h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                    {currentStep === 1 ? "Register a new vehicle in your fleet master" : currentStep === 2 ? "Set validity and supplier details" : "Define route-based pricing matrix"}
                                </p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Saving..." : (currentStep < 3 ? "Create" : "Create Vehicle & Rate Card")}
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
                                                <FormLabel label="Vehicle Name / Model" required />
                                                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Toyota Innova Crysta" />
                                            </div>

                                            <div className="md:col-span-2">
                                                <FormLabel label="Vehicle Brand" required />
                                                <SearchableSelect
                                                    options={brands.map(b => ({ value: b.id, label: b.name }))}
                                                    value={formData.brand}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}
                                                    placeholder="Select Brand..."
                                                />
                                            </div>

                                            <div>
                                                <FormLabel label="Seating Capacity" required />
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
                                                <FormLabel label="Luggage Capacity (Bags)" required />
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
                                                <FormLabel label="Transmission / Drive" required />
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
                                                <FormLabel label="Driver Name" optional />
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
                        ) : currentStep === 2 ? (
                            <div className="space-y-6 max-w-5xl mx-auto pb-12">
                                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Rate Card Configuration</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                                            <FormLabel label="Supplier" optional />
                                            <SearchableSelect
                                                options={suppliers.map(s => ({ value: s.id, label: s.company_name, subtitle: s.city || "" }))}
                                                value={rateCard.supplier}
                                                onChange={(val) => setRateCard(prev => ({ ...prev, supplier: val }))}
                                                placeholder="Select Supplier..."
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
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-5xl mx-auto pb-12">
                                <section ref={routeMatrixRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-8 pb-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                                            <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Route Matrix (Pricing)</h2>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={addRouteRow}
                                                className="flex items-center gap-2 bg-[#14532d]/5 text-[#14532d] px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all"
                                            >
                                                <Plus size={14} /> Add New Route
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-6 overflow-x-auto">
                                        <table className="w-full border-collapse min-w-[800px]">
                                            <thead>
                                                <tr>
                                                    <th className="text-left p-4 border-b border-gray-50 w-64 align-top">
                                                        <div className="flex flex-col gap-3">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Starting From</span>
                                                            <SearchableSelect
                                                                options={[
                                                                    { value: "", label: "All Cities" },
                                                                    ...(startingCities.length > 0
                                                                        ? startingCities.map(c => ({ value: c.name, label: c.name }))
                                                                        : [...new Set(pickupPoints.map(p => p.city_name))].filter(Boolean).sort().map(city => ({ value: city, label: city }))
                                                                    )
                                                                ]}
                                                                value={selectedCity}
                                                                onChange={(val) => setSelectedCity(val)}
                                                                placeholder="Search City..."
                                                                className="text-[10px]"
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="text-left p-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[200px] align-bottom">Dropping To</th>
                                                    {Array.from({ length: vehicleCount }).map((_, i) => (
                                                        <th key={i} className="text-center p-4 text-[9px] font-black text-[#14532d] uppercase tracking-[0.2em] border-b border-gray-50 bg-green-50/30">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <span>Vehicle {i + 1}</span>
                                                                {i === vehicleCount - 1 && (
                                                                    <div className="flex items-center gap-1 ml-1">
                                                                        <button
                                                                            onClick={removeVehicle}
                                                                            disabled={vehicleCount <= 1}
                                                                            className="w-5 h-5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            title="Remove Vehicle"
                                                                        >
                                                                            <Minus size={12} strokeWidth={3} />
                                                                        </button>
                                                                        <button
                                                                            onClick={addVehicle}
                                                                            disabled={vehicleCount >= MAX_VEHICLES}
                                                                            className="w-5 h-5 rounded hover:bg-green-100 text-gray-400 hover:text-[#14532d] flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            title="Add Vehicle"
                                                                        >
                                                                            <Plus size={12} strokeWidth={3} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </th>
                                                    ))}
                                                    <th className="p-4 border-b border-gray-50 w-16"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rateCard.routes.map((route, idx) => (
                                                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="p-2">
                                                            <div className="relative">
                                                                <SearchableSelect
                                                                    options={filteredPickupPoints.map(p => ({
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
                                                                    options={filteredPickupPoints.map(p => ({
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
                                                        {Array.from({ length: vehicleCount }).map((_, vIndex) => (
                                                            <td key={vIndex} className="p-2 bg-gray-50/20">
                                                                <input
                                                                    type="number"
                                                                    className="w-full bg-white border border-gray-100 px-3 py-2 rounded-lg text-[11px] font-bold text-center focus:outline-none focus:border-[#14532d] shadow-sm"
                                                                    placeholder="Rate"
                                                                    value={route.vehicles[vIndex] ?? ""}
                                                                    onChange={(e) => handleVehicleRateChange(idx, vIndex, e.target.value)}
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
