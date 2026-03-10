import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Trash2, Info, Minus, Car, MapPin, ArrowRight } from "lucide-react";
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

const MAX_VEHICLES = 10;

// Helper: detect how many vehicle columns exist in the routes (v1, v2, v3...)
const detectVehicleCount = (routes) => {
    if (!routes || routes.length === 0) return 4;
    const route = routes[0];
    let count = 0;
    for (let i = 1; i <= MAX_VEHICLES; i++) {
        if (`v${i}` in route) count = i;
        else break;
    }
    return Math.max(1, count || 4); // minimum 1, default 4
};

// Helper: convert route with v1, v2 to array of vehicle rates
const routeToVehiclesArray = (route, count) => {
    const vehicles = [];
    for (let i = 1; i <= count; i++) {
        vehicles.push(route[`v${i}`] ?? ""); // handle 0 properly
    }
    return vehicles;
};

const VehicleRateCardEdit = () => {
    const { id } = useParams();
    const routeMatrixRef = React.useRef(null);
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [countries, setCountries] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [startingCities, setStartingCities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [vehicleCount, setVehicleCount] = useState(4);
    const [vehicleMasters, setVehicleMasters] = useState([]);
    const [columnVehicles, setColumnVehicles] = useState(Array(4).fill(""));
    const [rateCard, setRateCard] = useState({
        country: "",
        supplier: "",
        name: "",
        validity_start: "",
        validity_end: "",
        routes: [{ start_city: "", start_from: "", drop_city: "", drop_to: "", vehicles: Array(4).fill("") }]
    });

    useEffect(() => {
        fetchCountries();
        fetchSuppliers();
        fetchPickupPoints();
        fetchStartingCities();
        fetchDestinations();
        fetchRateCard();
        fetchVehicleMasters();
    }, [id]);

    const fetchVehicleMasters = async () => {
        try {
            const res = await api.get("/api/vehicle-masters/");
            setVehicleMasters(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            console.error("Error fetching vehicles:", err);
        }
    };

    const fetchCountries = async () => {
        try {
            const res = await api.get("/api/countries/");
            setCountries(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            console.error("Error fetching countries:", err);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await api.get("/api/suppliers/");
            const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
            const cabSuppliers = data.filter(s =>
                Array.isArray(s.services) && s.services.includes("Cab")
            );
            setSuppliers(cabSuppliers);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
        }
    };

    const fetchPickupPoints = async () => {
        try {
            const res = await api.get("/api/pickup-point-masters/");
            setPickupPoints(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            console.error("Error fetching pickup points:", err);
        }
    };

    const fetchStartingCities = async () => {
        try {
            const res = await api.get("/api/starting-cities/");
            setStartingCities(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            console.error("Error fetching starting cities:", err);
        }
    };

    const fetchDestinations = async () => {
        try {
            const res = await api.get("/api/destinations/");
            setDestinations(Array.isArray(res.data) ? res.data : (res.data?.results || []));
        } catch (err) {
            console.error("Error fetching destinations:", err);
        }
    };

    const fetchRateCard = async () => {
        try {
            setFetching(true);
            const res = await api.get(`/api/vehicle-rate-cards/${id}/`);
            const data = res.data;
            // Detect vehicle count from existing data
            const count = detectVehicleCount(data.routes);
            setVehicleCount(count);
            // Normalize routes — convert v1..vN to vehicles array
            const normalizedRoutes = (data.routes || []).map(r => ({
                start_city: r.start_city || "",
                start_from: r.start_from || "",
                drop_city: r.drop_city || "",
                drop_to: r.drop_to || "",
                vehicles: routeToVehiclesArray(r, count)
            }));
            setRateCard({ ...data, routes: normalizedRoutes });
            setColumnVehicles(data.column_vehicles || Array(count).fill(""));
        } catch (err) {
            console.error("Error fetching rate card:", err);
            alert("Failed to load rate card details.");
        } finally {
            setFetching(false);
        }
    };

    const addVehicle = () => {
        if (vehicleCount >= MAX_VEHICLES) return;
        const newCount = vehicleCount + 1;
        setVehicleCount(newCount);
        setColumnVehicles(prev => [...prev, ""]);
        setRateCard(prev => ({
            ...prev,
            routes: prev.routes.map(r => ({ ...r, vehicles: [...r.vehicles, ""] }))
        }));
    };

    const removeVehicle = (index) => {
        if (vehicleCount <= 1) return;
        const newCount = vehicleCount - 1;
        setVehicleCount(newCount);
        setColumnVehicles(prev => prev.filter((_, i) => i !== index));
        setRateCard(prev => ({
            ...prev,
            routes: prev.routes.map(r => ({ ...r, vehicles: r.vehicles.filter((_, i) => i !== index) }))
        }));
    };

    const addRouteRow = () => {
        setRateCard(prev => ({
            ...prev,
            routes: [...prev.routes, { start_city: "", start_from: "", drop_city: "", drop_to: "", vehicles: Array(vehicleCount).fill("") }]
        }));
    };

    const removeRouteRow = (index) => {
        if (rateCard.routes.length <= 1) return;
        setRateCard(prev => ({
            ...prev,
            routes: prev.routes.filter((_, i) => i !== index)
        }));
    };

    const handleRouteFieldChange = (rowIdx, field, value) => {
        const newRoutes = [...rateCard.routes];
        newRoutes[rowIdx] = { ...newRoutes[rowIdx], [field]: value };
        setRateCard(prev => ({ ...prev, routes: newRoutes }));
    };

    const handleVehicleRateChange = (rowIdx, vIdx, value) => {
        const newRoutes = [...rateCard.routes];
        const newVehicles = [...newRoutes[rowIdx].vehicles];
        newVehicles[vIdx] = value;
        newRoutes[rowIdx] = { ...newRoutes[rowIdx], vehicles: newVehicles };
        setRateCard(prev => ({ ...prev, routes: newRoutes }));
    };

    const filteredPickupPoints = (city) => city ? pickupPoints.filter(p => p.city_name === city) : pickupPoints;

    const cityList = destinations.length > 0
        ? destinations
            .filter(d => !rateCard.country || d.country === rateCard.country)
            .map(d => d.name)
            .sort()
        : startingCities.length > 0
            ? startingCities.map(c => c.name).sort()
            : [...new Set(pickupPoints.map(p => p.city_name))].filter(Boolean).sort();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (!rateCard.name || !rateCard.country || !rateCard.validity_start || !rateCard.validity_end) {
                alert("Please provide Rate Card Name, Country, and Validity dates.");
                return;
            }
            setCurrentStep(2);
            return;
        }

        setLoading(true);
        try {
            // Construct a clean payload
            const payload = {
                name: rateCard.name,
                country: rateCard.country,
                supplier: typeof rateCard.supplier === 'object' ? rateCard.supplier?.id : rateCard.supplier,
                vehicle: typeof rateCard.vehicle === 'object' ? rateCard.vehicle?.id : rateCard.vehicle,
                validity_start: rateCard.validity_start,
                validity_end: rateCard.validity_end,
                column_vehicles: columnVehicles,
                routes: rateCard.routes.map(r => {
                    const route = {
                        start_city: r.start_city,
                        start_from: r.start_from,
                        drop_city: r.drop_city,
                        drop_to: r.drop_to
                    };
                    r.vehicles.forEach((v, i) => { route[`v${i + 1}`] = v; });
                    return route;
                })
            };
            await api.put(`/api/vehicle-rate-cards/${id}/`, payload);
            alert("Rate Card updated successfully!");
            navigate("/admin/vehicle-rate-cards");
        } catch (err) {
            console.error("Error updating rate card:", err);
            alert("Failed to update rate card.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex bg-gray-50 h-screen overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <AdminTopbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => currentStep === 1 ? navigate("/admin/vehicle-rate-cards") : setCurrentStep(1)}
                                className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all group"
                            >
                                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> {currentStep === 1 ? "Back to Rate Cards" : "Back to Config"}
                            </button>

                            <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                <div className={`flex items-center gap-2 ${currentStep === 1 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 1 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>1</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Configuration</span>
                                </div>
                                <div className="w-8 h-[2px] bg-gray-50"></div>
                                <div className={`flex items-center gap-2 ${currentStep === 2 ? "text-[#14532d]" : "text-gray-300"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${currentStep === 2 ? "bg-[#14532d] text-white" : "bg-gray-100"}`}>2</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Pricing Matrix</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">{currentStep === 1 ? "Edit Configuration" : "Edit Pricing Matrix"}</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{currentStep === 1 ? "Update basic details and validity" : "Update route-based pricing for vehicles"}</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Updating..." : currentStep === 1 ? "Update" : "Update Rate Card"}
                            </button>
                        </div>

                        {currentStep === 1 ? (
                            <div className="space-y-6">
                                {/* General Config */}
                                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">General Configuration</h2>
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
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <section ref={routeMatrixRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                                            <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Route Matrix (Pricing)</h2>
                                        </div>
                                        <button onClick={addRouteRow} className="flex items-center gap-1.5 bg-[#14532d]/5 text-[#14532d] px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all">
                                            <Plus size={12} /> Add New Route
                                        </button>
                                    </div>

                                    <div className="p-2 md:p-3 overflow-x-auto">
                                        <table className="w-full border-collapse min-w-[700px]" style={{ minWidth: `${420 + vehicleCount * 130}px` }}>
                                            <thead>
                                                <tr>
                                                    <th className="text-left p-2 border-b border-gray-50 align-top min-w-[280px]">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Starting From</span>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th className="text-left p-2 border-b border-gray-50 align-top min-w-[280px]">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Dropping To</span>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    {Array.from({ length: vehicleCount }).map((_, i) => (
                                                        <th key={i} className="text-center p-2 border-b border-gray-50 bg-green-50/30 align-top">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center justify-center gap-1 pt-0.5">
                                                                    <Car size={8} className="text-[#14532d]" />
                                                                    <span className="text-[8px] font-black text-[#14532d] uppercase tracking-[0.15em]">
                                                                        {columnVehicles[i] ? `V${i + 1} - ${columnVehicles[i]}` : `V ${i + 1}`}
                                                                    </span>
                                                                    <div className="flex items-center gap-1 ml-1 scale-75">
                                                                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeVehicle(i); }} disabled={vehicleCount <= 1} className="w-4 h-4 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-white shadow-sm border border-gray-100"><Minus size={10} strokeWidth={3} /></button>
                                                                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addVehicle(); }} disabled={vehicleCount >= MAX_VEHICLES} className="w-4 h-4 rounded hover:bg-green-100 text-gray-500 hover:text-[#14532d] flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed bg-white shadow-sm border border-gray-100"><Plus size={10} strokeWidth={3} /></button>
                                                                    </div>
                                                                </div>
                                                                <SearchableSelect
                                                                    options={vehicleMasters.map(v => ({ value: v.name, label: v.name }))}
                                                                    value={columnVehicles[i]}
                                                                    onChange={(val) => {
                                                                        const newLabels = [...columnVehicles];
                                                                        newLabels[i] = val;
                                                                        setColumnVehicles(newLabels);
                                                                    }}
                                                                    placeholder="Vehicle..."
                                                                    size="compact"
                                                                />
                                                            </div>
                                                        </th>
                                                    ))}
                                                    <th className="p-2 border-b border-gray-50 w-12"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rateCard.routes.map((route, idx) => (
                                                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="p-1.5">
                                                            <div className="flex gap-1.5 min-w-[260px]">
                                                                <div className="w-1/2">
                                                                    <SearchableSelect
                                                                        options={cityList.map(city => ({ value: city, label: city }))}
                                                                        value={route.start_city}
                                                                        onChange={val => handleRouteFieldChange(idx, 'start_city', val)}
                                                                        placeholder="Destination"
                                                                        size="compact"
                                                                    />
                                                                </div>
                                                                <div className="w-1/2">
                                                                    <SearchableSelect
                                                                        options={filteredPickupPoints(route.start_city).map(p => ({ value: p.name, label: p.name, subtitle: p.city_name }))}
                                                                        value={route.start_from}
                                                                        onChange={val => handleRouteFieldChange(idx, 'start_from', val)}
                                                                        placeholder="Pickup Point"
                                                                        size="compact"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-1.5">
                                                            <div className="flex gap-1.5 min-w-[260px]">
                                                                <div className="w-1/2">
                                                                    <SearchableSelect
                                                                        options={cityList.map(city => ({ value: city, label: city }))}
                                                                        value={route.drop_city}
                                                                        onChange={val => handleRouteFieldChange(idx, 'drop_city', val)}
                                                                        placeholder="Destination"
                                                                        size="compact"
                                                                    />
                                                                </div>
                                                                <div className="w-1/2">
                                                                    <SearchableSelect
                                                                        options={filteredPickupPoints(route.drop_city).map(p => ({ value: p.name, label: p.name, subtitle: p.city_name }))}
                                                                        value={route.drop_to}
                                                                        onChange={val => handleRouteFieldChange(idx, 'drop_to', val)}
                                                                        placeholder="Dropping Point"
                                                                        size="compact"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {(route.vehicles || []).map((rate, vIdx) => (
                                                            <td key={vIdx} className="p-1.5 bg-gray-50/20">
                                                                <input
                                                                    type="text"
                                                                    className="w-full bg-white border border-gray-100 px-2 py-1.5 rounded-lg text-[10px] font-bold text-center focus:outline-none focus:border-[#14532d] min-w-[70px] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                                    placeholder="Rate"
                                                                    value={rate ? Number(rate.toString().replace(/,/g, '')).toLocaleString('en-IN') : ""}
                                                                    onChange={(e) => {
                                                                        const rawValue = e.target.value.replace(/,/g, '');
                                                                        if (rawValue === "" || !isNaN(rawValue)) {
                                                                            handleVehicleRateChange(idx, vIdx, rawValue);
                                                                        }
                                                                    }}
                                                                    disabled={!columnVehicles[vIdx]}
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
                                    <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                                        <div className="flex gap-4">
                                            <Info className="text-[#14532d]/40 shrink-0" size={16} />
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
                                                Use <strong>+</strong> / <strong>−</strong> to add or remove vehicle columns (up to {MAX_VEHICLES}). Filter by destination to narrow down pickup point options.
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

export default VehicleRateCardEdit;
