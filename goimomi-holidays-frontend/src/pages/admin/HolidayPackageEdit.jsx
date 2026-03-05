import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";
import { X, MapPin, Calendar, Package, Image as ImageIcon, Plane, Hotel, Car, Info, IndianRupee, ClipboardList, Globe, Search, Plus, FileText, Star, Utensils, Camera, Bus, Bed, List, ListOrdered, PlayCircle } from "lucide-react";

/* ---------- UI helpers ---------- */
const Section = ({ title, children, active }) => (
    <div className={`transition-all duration-500 ease-out ${active ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98] hidden'}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#14532d] w-1.5 h-8 rounded-full shadow-lg shadow-green-900/10"></div>
            <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{title}</h2>
                <div className="flex gap-1 mt-1.5">
                    <div className="h-0.5 w-10 bg-green-100 rounded-full"></div>
                    <div className="h-0.5 w-2 bg-green-200 rounded-full"></div>
                </div>
            </div>
        </div>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">{children}</div>
    </div>
);

const FormLabel = ({ label, limit, current, required, optional }) => (
    <div className="flex justify-between items-end mb-1.5">
        <div className="flex items-center gap-2">
            <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.15em]">{label} {required && <span className="text-red-500">*</span>}</span>
            {optional && <span className="text-[#14532d] text-[8px] font-black bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
        </div>
        {limit && (
            <span className={`text-[9px] font-black tracking-widest ${(current || 0) > limit ? 'text-red-500' : 'text-gray-300'}`}>
                {current || 0} / {limit}
            </span>
        )}
    </div>
);

const Input = (props) => (
    <div>
        <input
            {...props}
            className={`bg-white border-2 ${props.error ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'} px-4 py-2.5 rounded-xl w-full text-gray-900 text-xs font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 hover:shadow-sm ${props.className || ''}`}
        />
        {props.error && <p className="text-red-500 text-[9px] font-black mt-1.5 flex items-center gap-2 ml-1 uppercase tracking-wider italic">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
            {props.error}
        </p>}
    </div>
);

const formatWithCommas = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const cleanValue = value.toString().replace(/\D/g, "");
    if (!cleanValue) return "";
    return new Intl.NumberFormat("en-IN").format(cleanValue);
};



const DynamicList = ({ label, items, setItems, placeholder, required }) => {
    const addItem = () => setItems([...items, ""]);
    const removeItem = (idx) => {
        const copy = [...items];
        copy.splice(idx, 1);
        setItems(copy.length > 0 ? copy : [""]);
    };
    const updateItem = (idx, val) => {
        const copy = [...items];
        copy[idx] = val;
        setItems(copy);
    };

    return (
        <div className="space-y-0 group/list animate-in fade-in duration-500">
            <div className="bg-[#14532d] text-white px-6 py-2.5 rounded-t-2xl flex items-center justify-between border-b border-white/10 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-1.5 h-4 bg-green-400 rounded-full"></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] drop-shadow-sm">{label}</span>
                    {required && <span className="text-[9px] font-black text-green-300/80 uppercase tracking-widest px-2 py-0.5 bg-white/10 rounded-full">Required</span>}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/5">
                    <ClipboardList size={14} className="text-green-100" />
                </div>
            </div>
            <div className="bg-white border-2 border-[#14532d]/10 border-t-0 p-8 rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(20,83,45,0.08)] space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 opacity-40"></div>

                {items.length === 0 || (items.length === 1 && !items[0]) ? (
                    <div className="py-8 text-center text-gray-300 border-2 border-dashed border-gray-100 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest">No {label.toLowerCase()} added yet</p>
                    </div>
                ) : (
                    <div className="space-y-3.5 relative z-10">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 group/row animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                <div className="hidden sm:flex w-6 h-6 shrink-0 bg-emerald-50 rounded-lg items-center justify-center text-[#14532d] text-[9px] font-black group-hover/row:bg-[#14532d] group-hover/row:text-white transition-all">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 relative group/input">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateItem(idx, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full bg-gray-50/50 border-2 border-gray-100 px-5 py-2.5 rounded-xl text-[11px] font-bold text-gray-700 outline-none focus:bg-white focus:border-[#14532d] focus:ring-4 focus:ring-green-50 transition-all hover:border-gray-200"
                                    />
                                    <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-[#14532d] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="px-4 py-2 flex items-center gap-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group/btn active:scale-95"
                                >
                                    <X size={14} className="text-indigo-400 group-hover/btn:text-red-500 transition-colors" />
                                    <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Remove</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-3 text-[#14b8a6] hover:text-[#0d9488] text-[10px] font-black uppercase tracking-[0.15em] pl-2 mt-6 group/add transition-all active:translate-x-1"
                >
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center group-hover/add:bg-[#14b8a6] group-hover/add:text-white transition-all shadow-sm">
                        <Plus size={16} />
                    </div>
                    <span>Add another {label.slice(0, -1)}</span>
                </button>
            </div>
        </div>
    );
};

const HolidayPackageEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [packageDestinations, setPackageDestinations] = useState([]);
    const [itineraryDays, setItineraryDays] = useState([]);
    const [inclusions, setInclusions] = useState([]);
    const [exclusions, setExclusions] = useState([]);
    const [cancellationPolicies, setCancellationPolicies] = useState([]);
    const [highlights, setHighlights] = useState([]);

    // Refs for Trip Information textareas
    const inclusionsRef = useRef(null);
    const exclusionsRef = useRef(null);
    const cancellationRef = useRef(null);
    const highlightsRef = useRef(null);
    const pricingSlotsRef = useRef(null);
    const [accommodations, setAccommodations] = useState([]);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelMasters, setHotelMasters] = useState([]);
    const [sightseeingMasters, setSightseeingMasters] = useState([]);
    const [mealMasters, setMealMasters] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [driverMasters, setDriverMasters] = useState([]);
    const [vehicleBrands, setVehicleBrands] = useState([]);
    const [newHotelForm, setNewHotelForm] = useState({
        name: "", stars: "3", address: "", city: "", phone: "", website: "", email: "", latitude: "", longitude: "", images: []
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [vehicleMasters, setVehicleMasters] = useState([]);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    // New Sightseeing panel state
    const [newSightseeingForm, setNewSightseeingForm] = useState({
        name: '', description: '', address: '', city: '', duration: '', price: '', map_link: '',
        latitude: '', longitude: '', images: []
    });
    const [sightseeingPanelDayIndex, setSightseeingPanelDayIndex] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        starting_city: "",
        ending_city: "",
        days: "",
        start_date: "",
        group_size: 0,
        offer_price: "",
        price: "",
        header_image: null,
        card_image: null,
        supplier: "",
        with_flight: false,
        fixed_departure: false,
        package_categories: [], // ['Budget', 'Standard', 'Deluxe', 'Luxury', 'Premium']
        is_active: true,
        with_arrival: true,
        arrival_city: "",
        arrival_date: "",
        arrival_time: "",
        arrival_airport: "",
        departure_city: "",
        with_departure: true,
        departure_date: "",
        departure_time: "",
        departure_airport: "",
        arrival_airline: "",
        arrival_flight_no: "",
        departure_airline: "",
        departure_flight_no: "",
        highlights: "",
        sharing: "SINGLE",
        arrival_no_of_nights: "",
    });
    const [fixedDepartureData, setFixedDepartureData] = useState([]);

    // Previews for existing images to show if no new file selected
    const [headerPreview, setHeaderPreview] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);

    const [startingCities, setStartingCities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [itineraryMasters, setItineraryMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isNightsDropdownOpen, setIsNightsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");

    // Default logistics block for a travel date slot
    const mkLogistics = () => ({
        with_arrival: true,
        arrival_city: "", arrival_date: "", arrival_time: "",
        arrival_airport: "", arrival_airline: "", arrival_flight_no: "",
        with_departure: true,
        departure_city: "", departure_date: "", departure_time: "",
        departure_airport: "", departure_airline: "", departure_flight_no: ""
    });

    // Default new pricing slot
    const mkSlot = () => ({
        travel_date: "",
        valid_from: "",
        valid_to: "",
        booking_valid_until: "",
        logistics: mkLogistics(),
        tiers: (formData.package_categories || []).reduce((acc, tier) => {
            acc[tier] = [{ offer_price: "", market_price: "", min_members: "1", sharing: "SINGLE" }];
            return acc;
        }, {})
    });


    const TITLE_LIMIT = 200;
    const DESC_LIMIT = 2000;
    const HIGHLIGHTS_LIMIT = 1000;

    const API_BASE_URL = "/api";

    // Compute grouped starting cities
    const groupedStartingCities = useMemo(() => {
        const groups = startingCities.reduce((acc, city) => {
            const region = (city.region || "Other").toString().trim() || "Other";
            const key = region.toUpperCase();
            if (!acc[key]) acc[key] = [];
            acc[key].push(city);
            return acc;
        }, {});

        Object.keys(groups).forEach((key) => {
            groups[key].sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
        });

        const ordered = {};
        Object.keys(groups)
            .sort((a, b) => a.localeCompare(b))
            .forEach((key) => {
                ordered[key] = groups[key];
            });

        return ordered;
    }, [startingCities]);

    const groupedItineraryMasters = useMemo(() => {
        return itineraryMasters.reduce((acc, master) => {
            let destName = "Global / General";
            if (master.destination) {
                const destObj = destinations.find(d => d.id === master.destination);
                if (destObj) destName = destObj.name;
            }

            if (!acc[destName]) acc[destName] = [];
            acc[destName].push(master);
            return acc;
        }, {});
    }, [itineraryMasters, destinations]);

    // Helper to fix image URLs
    const getImageUrl = (url) => {
        if (!url) return "";
        if (typeof url !== "string") return url;
        if (url.startsWith("http")) {
            return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
        }
        return url;
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch dependencies in parallel
                const [citiesRes, destRes, suppliersRes, mastersRes, hotelMastersRes, sightseeingMastersRes, mealMastersRes, airlinesRes, vehicleBrandsRes, vehicleMastersRes, driverMastersRes, roomTypesRes, pickupPointsRes, pkgRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/starting-cities/`),
                    axios.get(`${API_BASE_URL}/destinations/`),
                    axios.get(`${API_BASE_URL}/suppliers/`),
                    axios.get(`${API_BASE_URL}/itinerary-masters/`),
                    axios.get(`${API_BASE_URL}/accommodations/`),
                    axios.get(`${API_BASE_URL}/sightseeing-masters/`),
                    axios.get(`${API_BASE_URL}/meal-masters/`),
                    axios.get(`${API_BASE_URL}/airlines/`),
                    axios.get(`${API_BASE_URL}/vehicle-brands/`),
                    axios.get(`${API_BASE_URL}/vehicle-masters/`),
                    axios.get(`${API_BASE_URL}/driver-masters/`),
                    axios.get(`${API_BASE_URL}/room-types/`),
                    axios.get(`${API_BASE_URL}/pickup-point-masters/`),
                    axios.get(`${API_BASE_URL}/packages/${id}/?all=true`),
                ]);

                if (Array.isArray(citiesRes.data)) setStartingCities(citiesRes.data);
                if (Array.isArray(destRes.data)) setDestinations(destRes.data);
                if (Array.isArray(suppliersRes.data)) {
                    const filteredSuppliers = suppliersRes.data.filter(supplier =>
                        supplier.services && supplier.services.some(service => service.toLowerCase() === 'holidays')
                    );
                    setSuppliers(filteredSuppliers);
                }
                if (Array.isArray(mastersRes.data)) {
                    const destList = Array.isArray(destRes.data) ? destRes.data : [];
                    const enriched = mastersRes.data.map(m => ({
                        ...m,
                        destination_name: m.destination_name ||
                            destList.find(d => d.id === m.destination)?.name || ''
                    }));
                    setItineraryMasters(enriched);
                }
                if (Array.isArray(hotelMastersRes.data)) setHotelMasters(hotelMastersRes.data);
                if (Array.isArray(sightseeingMastersRes.data)) setSightseeingMasters(sightseeingMastersRes.data);
                if (Array.isArray(mealMastersRes.data)) setMealMasters(mealMastersRes.data);
                if (Array.isArray(airlinesRes.data)) setAirlines(airlinesRes.data);
                if (Array.isArray(vehicleBrandsRes.data)) setVehicleBrands(vehicleBrandsRes.data);
                if (Array.isArray(vehicleMastersRes.data)) setVehicleMasters(vehicleMastersRes.data);
                if (Array.isArray(driverMastersRes.data)) setDriverMasters(driverMastersRes.data);
                if (Array.isArray(roomTypesRes.data)) setRoomTypes(roomTypesRes.data);
                if (Array.isArray(pickupPointsRes.data)) setPickupPoints(pickupPointsRes.data);

                // Populate Form Data
                const pkg = pkgRes.data;
                setFormData({
                    title: pkg.title || "",
                    description: pkg.description || "",
                    category: pkg.category || "",
                    starting_city: pkg.starting_city || "",
                    ending_city: pkg.ending_city || "",
                    days: pkg.days?.toString() || "",
                    start_date: pkg.start_date || "",
                    group_size: pkg.group_size || 0,
                    offer_price: pkg.Offer_price?.toString() || "", // Note capitalization in model
                    price: pkg.price?.toString() || "",
                    header_image: null, // Keep null unless changing
                    card_image: null,
                    supplier: pkg.supplier || "",
                    with_flight: pkg.with_flight || false,
                    fixed_departure: pkg.fixed_departure || false,
                    package_categories: pkg.package_categories && Array.isArray(pkg.package_categories) ? pkg.package_categories : [],
                    is_active: pkg.is_active !== undefined ? pkg.is_active : true,
                    sharing: pkg.sharing || "SINGLE",
                    arrival_city: pkg.arrival_city || "",
                    with_arrival: pkg.with_arrival !== undefined ? pkg.with_arrival : true,
                    arrival_date: pkg.arrival_date || "",
                    arrival_time: pkg.arrival_time || "",
                    arrival_airport: pkg.arrival_airport || "",
                    arrival_airline: pkg.arrival_airline || "",
                    arrival_flight_no: pkg.arrival_flight_no || "",
                    departure_city: pkg.departure_city || "",
                    with_departure: pkg.with_departure !== undefined ? pkg.with_departure : true,
                    departure_date: pkg.departure_date || "",
                    departure_time: pkg.departure_time || "",
                    departure_airport: pkg.departure_airport || "",
                    departure_airline: pkg.departure_airline || "",
                    departure_flight_no: pkg.departure_flight_no || "",
                    highlights: pkg.highlights && Array.isArray(pkg.highlights) ? pkg.highlights.map(h => h.text).join("\n") : "",
                    arrival_no_of_nights: pkg.arrival_no_of_nights || "",
                });
                const normalizedFD = (pkg.fixed_departure_data && Array.isArray(pkg.fixed_departure_data))
                    ? pkg.fixed_departure_data.map(slot => {
                        const newTiers = { ...slot.tiers };
                        Object.keys(newTiers).forEach(tier => {
                            if (!Array.isArray(newTiers[tier])) {
                                newTiers[tier] = [newTiers[tier]];
                            }
                        });
                        return {
                            ...slot,
                            tiers: newTiers,
                            logistics: slot.logistics || mkLogistics()
                        };
                    })
                    : [];
                setFixedDepartureData(normalizedFD);

                // Set Previews
                setHeaderPreview(getImageUrl(pkg.header_image));
                setCardPreview(getImageUrl(pkg.card_image));

                // Populate Nested Data
                // Destinations
                if (pkg.destinations && Array.isArray(pkg.destinations)) {
                    setPackageDestinations(pkg.destinations.map(d => ({
                        destination: d.name, // Serializer returns name in 'name' field
                        nights: d.nights
                    })));
                }

                // Itinerary
                if (pkg.itinerary && Array.isArray(pkg.itinerary)) {
                    setItineraryDays(pkg.itinerary.map(day => ({
                        day: day.day_number,
                        title: day.title,
                        description: day.description,
                        master_template: day.master_template || "",
                        image: null, // We generally don't pre-fill file inputs. 
                        existing_image: getImageUrl(day.image), // Can show preview if needed
                        save_to_master: false,
                        details_json: day.details_json || { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] }
                    })));
                }

                // Inclusions
                if (pkg.inclusions && Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0) {
                    setInclusions(pkg.inclusions.map(i => i.text));
                } else {
                    setInclusions([""]);
                }

                // Exclusions
                if (pkg.exclusions && Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0) {
                    setExclusions(pkg.exclusions.map(e => e.text));
                } else {
                    setExclusions([""]);
                }

                // Highlights — strip any leading bullet characters stored in the DB
                if (pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.length > 0) {
                    setHighlights(pkg.highlights.map(h => h.text.replace(/^[\u2022\u2023\u25E6\u2043\u2219•]\s*/, '')));
                } else {
                    setHighlights([""]);
                }

                // Cancellation Policies
                if (pkg.cancellation_policies && Array.isArray(pkg.cancellation_policies) && pkg.cancellation_policies.length > 0) {
                    setCancellationPolicies(pkg.cancellation_policies.map(c => c.text));
                } else {
                    setCancellationPolicies([""]);
                }

                // Accommodations - NEW STRUCTURE
                const defaultRoom = { id: Date.now() + 1, type: "", meals: "", checkIn: "", checkOut: "", noOfRooms: "1" };
                let loadedAccommodations = [];

                if (pkg.accommodations && Array.isArray(pkg.accommodations)) {
                    loadedAccommodations = pkg.accommodations.map(a => {
                        const hotelMaster = hotelMastersRes.data.find(hm => hm.name === a.text); // Try to match with master
                        return {
                            id: Date.now() + Math.random(),
                            hotelId: hotelMaster?.id || null,
                            hotelName: a.text,
                            starRating: hotelMaster?.stars || "3",
                            address: hotelMaster?.address || "",
                            city: hotelMaster?.city || "",
                            image: hotelMaster?.image || "",
                            isSearching: false,
                            rooms: [defaultRoom] // Default room details for now
                        };
                    });
                } else if (pkg.accommodations_raw) {
                    try {
                        const raw = JSON.parse(pkg.accommodations_raw);
                        if (Array.isArray(raw)) {
                            loadedAccommodations = raw.map(item => {
                                if (typeof item === 'string') {
                                    const hotelMaster = hotelMastersRes.data.find(hm => hm.name === item);
                                    return {
                                        id: Date.now() + Math.random(),
                                        hotelId: hotelMaster?.id || null,
                                        hotelName: item,
                                        starRating: hotelMaster?.stars || "3",
                                        address: hotelMaster?.address || "",
                                        city: hotelMaster?.city || "",
                                        image: hotelMaster?.image || "",
                                        isSearching: false,
                                        rooms: [defaultRoom]
                                    };
                                }
                                // If it's already an object, assume it's in the new format or close to it
                                return {
                                    id: item.id || Date.now() + Math.random(),
                                    hotelId: item.hotelId || null,
                                    hotelName: item.hotelName || "",
                                    starRating: item.starRating || "3",
                                    address: item.address || "",
                                    city: item.city || "",
                                    image: item.image || "",
                                    isSearching: false,
                                    rooms: item.rooms && Array.isArray(item.rooms) && item.rooms.length > 0
                                        ? item.rooms.map(room => ({ ...defaultRoom, ...room }))
                                        : [defaultRoom]
                                };
                            });
                        }
                    } catch (e) {
                        console.error("Error parsing accommodations_raw:", e);
                    }
                }
                setAccommodations(loadedAccommodations.length > 0 ? loadedAccommodations : [{ id: Date.now(), hotelId: null, hotelName: "", rooms: [defaultRoom] }]);


                // Vehicles
                if (pkg.vehicles && Array.isArray(pkg.vehicles)) {
                    setVehicles(pkg.vehicles.map(v => v.text));
                } else if (pkg.vehicles_raw) {
                    try {
                        const raw = JSON.parse(pkg.vehicles_raw);
                        setVehicles(Array.isArray(raw) ? raw : []);
                    } catch (e) { setVehicles([]); }
                }

            } catch (err) {
                console.error("Error loading package data:", err);
                setError("Failed to load package details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const handleSaveHotel = async () => {
        if (!newHotelForm.name || !newHotelForm.city) {
            alert("Hotel Name and City are required");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", newHotelForm.name);
            formDataToSend.append("stars", newHotelForm.stars);
            formDataToSend.append("address", newHotelForm.address);
            formDataToSend.append("city", newHotelForm.city);
            formDataToSend.append("phone", newHotelForm.phone);
            formDataToSend.append("website", newHotelForm.website);
            formDataToSend.append("email", newHotelForm.email);
            formDataToSend.append("latitude", newHotelForm.latitude);
            formDataToSend.append("longitude", newHotelForm.longitude);

            if (newHotelForm.images && newHotelForm.images.length > 0) {
                formDataToSend.append("image", newHotelForm.images[0]);
            }

            const response = await axios.post(`${API_BASE_URL}/accommodations/`, formDataToSend);
            setHotelMasters(prev => [...prev, response.data]);
            setShowHotelModal(false);
            setNewHotelForm({
                name: "", stars: "3", address: "", city: "", phone: "", website: "", email: "", latitude: "", longitude: "", images: []
            });
            alert("Hotel added to masters successfully!");
        } catch (err) {
            console.error("Error saving hotel master:", err);
            alert("Failed to save hotel. Please check your inputs.");
        }
    };

    // Sync itinerary days with "Days" input
    useEffect(() => {
        if (loading) return;
        const dayCount = parseInt(formData.days, 10);
        if (!isNaN(dayCount) && dayCount >= 0) {
            setItineraryDays(prev => {
                if (prev.length === dayCount) return prev;
                if (dayCount > prev.length) {
                    const newDays = [];
                    for (let i = prev.length + 1; i <= dayCount; i++) {
                        newDays.push({
                            day: i.toString(),
                            title: "",
                            description: "",
                            master_template: "",
                            image: null,
                            save_to_master: false,
                            details_json: {
                                active_tab: 'day_itinerary',
                                sightseeing: [""],
                                transfers: [""],
                                accommodations: [],
                                meals: [""],
                                vehicles: [""],
                                vehicle_data: { mode: 'with_driver' }
                            }
                        });
                    }
                    return [...prev, ...newDays];
                } else {
                    return prev.slice(0, dayCount);
                }
            });
        }
    }, [formData.days, loading]);

    // Sync Duration based on Destination Nights (Days = Sum of Nights + 1)
    useEffect(() => {
        if (loading) return;
        const totalNights = packageDestinations.reduce((acc, d) => acc + parseInt(d.nights || 0, 10), 0);
        const calculatedDays = totalNights + 1;
        if (formData.days !== calculatedDays.toString()) {
            setFormData(prev => ({
                ...prev,
                days: calculatedDays.toString(),
                arrival_no_of_nights: totalNights.toString()
            }));
        }
    }, [packageDestinations, loading]);

    // Automatically sync Departure Date when Arrival Date or Days change
    useEffect(() => {
        if (loading || !formData.arrival_date || !formData.days) return;
        const arrival = new Date(formData.arrival_date);
        if (isNaN(arrival.getTime())) return;

        const totalNights = parseInt(formData.days, 10) - 1;
        if (totalNights < 0) return;

        const departure = new Date(arrival);
        departure.setDate(arrival.getDate() + totalNights);

        const yyyy = departure.getFullYear();
        const mm = String(departure.getMonth() + 1).padStart(2, '0');
        const dd = String(departure.getDate()).padStart(2, '0');
        const depStr = `${yyyy}-${mm}-${dd}`;

        if (formData.departure_date !== depStr) {
            setFormData(prev => ({ ...prev, departure_date: depStr }));
        }
    }, [formData.arrival_date, formData.days, loading]);

    // Auto-sync Accommodation "No. of Nights" per itinerary day from packageDestinations
    useEffect(() => {
        if (loading || !packageDestinations.length || !itineraryDays.length) return;
        setItineraryDays(prev => prev.map((day, dayIndex) => {
            // Find which destination this day belongs to based on cumulative nights
            let cumulative = 0;
            let destNights = null;
            for (const dest of packageDestinations) {
                const n = parseInt(dest.nights || 0, 10);
                if (dayIndex >= cumulative && dayIndex < cumulative + n) {
                    destNights = n;
                    break;
                }
                cumulative += n;
            }
            if (destNights === null) return day;
            const val = destNights.toString();
            const currentRD = day.details_json?._roomDetails || { noOfRooms: '', rooms: [] };
            // Only update if value actually changed to avoid infinite loop
            if (currentRD.noOfRooms === val) return day;
            const rooms = Array.from({ length: destNights }, (_, idx) => currentRD.rooms?.[idx] || { roomType: '', meals: '' });
            return {
                ...day,
                details_json: {
                    ...day.details_json,
                    _roomDetails: { ...currentRD, noOfRooms: val, rooms }
                }
            };
        }));
    }, [packageDestinations, loading, itineraryDays.length]);

    // Sync fixedDepartureData tiers with selected package categories
    useEffect(() => {
        setFixedDepartureData(prev => prev.map(slot => {
            const newTiers = { ...slot.tiers };
            // Add missing tiers
            formData.package_categories.forEach(tier => {
                if (!newTiers[tier]) {
                    newTiers[tier] = [{ offer_price: "", market_price: "", min_members: "1", sharing: "SINGLE" }];
                }
            });
            // Remove tiers no longer selected
            Object.keys(newTiers).forEach(tier => {
                if (!formData.package_categories.includes(tier)) {
                    delete newTiers[tier];
                }
            });
            return { ...slot, tiers: newTiers };
        }));
    }, [formData.package_categories, formData.fixed_departure]);

    // Synchronize Fixed Departure Travel Dates with Arrival/Departure Dates
    useEffect(() => {
        if (formData.fixed_departure && fixedDepartureData.length > 0) {
            const firstTravelDate = fixedDepartureData[0]?.travel_date;
            if (firstTravelDate) {
                setFormData(prev => ({
                    ...prev,
                    start_date: prev.start_date || firstTravelDate,
                    arrival_date: prev.arrival_date || firstTravelDate
                }));
            }
        }
    }, [formData.fixed_departure, fixedDepartureData]);


    /* ---------- handlers ---------- */
    const addRow = (setter, row) => setter((p) => [...p, row]);
    const removeRow = (setter, index) =>
        setter((p) => p.filter((_, i) => i !== index));

    // Inserts a bullet point at the cursor position in a textarea
    const insertBullet = (ref, lines, setter) => {
        const el = ref.current;
        if (!el) return;
        const start = el.selectionStart;
        const currentVal = lines.join('\n');
        // Find start of current line
        const lineStart = currentVal.lastIndexOf('\n', start - 1) + 1;
        const insertText = start === 0 || currentVal[start - 1] === '\n' ? 'â€¢ ' : '\nâ€¢ ';
        const newVal = currentVal.slice(0, start) + insertText + currentVal.slice(start);
        setter(newVal.split('\n'));
        setTimeout(() => {
            el.focus();
            const newCursor = start + insertText.length;
            el.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    // Inserts the next numbered item at the cursor position in a textarea
    const insertNumbered = (ref, lines, setter) => {
        const el = ref.current;
        if (!el) return;
        const start = el.selectionStart;
        const currentVal = lines.join('\n');
        // Count existing numbered lines to determine next number
        const existing = currentVal.split('\n').filter(l => /^\d+\./.test(l.trim()));
        const nextNum = existing.length + 1;
        const insertText = start === 0 || currentVal[start - 1] === '\n' ? `${nextNum}. ` : `\n${nextNum}. `;
        const newVal = currentVal.slice(0, start) + insertText + currentVal.slice(start);
        setter(newVal.split('\n'));
        setTimeout(() => {
            el.focus();
            const newCursor = start + insertText.length;
            el.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "offer_price" || name === "price") {
            const cleanValue = value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, [name]: cleanValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveNewHotel = async (dayIndex) => {
        if (!newHotelForm.name.trim()) { alert('Please enter the accommodation name.'); return; }
        try {
            const destObj = destinations.find(d => d.name === newHotelForm.city);
            if (!destObj) {
                alert('Please select a valid city from the list.');
                return;
            }

            const fd = new FormData();
            fd.append('destination', destObj.id);
            fd.append('name', newHotelForm.name);
            fd.append('stars', newHotelForm.stars || '3');
            fd.append('address', newHotelForm.address);
            fd.append('city', newHotelForm.city);
            fd.append('website', newHotelForm.website || '');
            fd.append('email', newHotelForm.email || '');
            fd.append('latitude', newHotelForm.latitude || '');
            fd.append('longitude', newHotelForm.longitude || '');

            if (newHotelForm.images && newHotelForm.images.length > 0) {
                fd.append('image', newHotelForm.images[0]);
                newHotelForm.images.forEach(img => {
                    fd.append('gallery_images', img);
                });
            }

            const res = await axios.post(`/api/accommodations/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const savedHotel = res.data;
            setHotelMasters(prev => [...prev, savedHotel]);

            const copy = [...itineraryDays];
            const dest = getDestinationForDay(dayIndex);
            // Apply stay to connected days
            const n_nights = parseInt(copy[dayIndex].details_json?.accommodation_stay_nights || 1);
            for (let j = dayIndex; j < dayIndex + n_nights && j < copy.length; j++) {
                if (getDestinationForDay(j) === dest) {
                    if (!copy[j].details_json) copy[j].details_json = { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] };
                    copy[j].details_json.accommodations = [{ hotelId: savedHotel.id, hotelName: savedHotel.name, is_inherited: j > dayIndex }];
                } else break;
            }
            copy[dayIndex].details_json._showNewAcc = false;
            setItineraryDays(copy);

            setNewHotelForm({ name: '', stars: '3', address: '', city: '', phone: '', website: '', email: '', latitude: '', longitude: '', images: [] });
        } catch (err) {
            console.error('Error saving hotel:', err.response?.data || err);
            const errorMsg = err.response?.data
                ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
                : err.message;
            alert(`Failed to save accommodation.\n${errorMsg}`);
        }
    };

    const getNightRange = (index) => {
        let start = 1;
        for (let i = 0; i < index; i++) {
            start += parseInt(packageDestinations[i].nights || 0, 10);
        }
        const nights = parseInt(packageDestinations[index].nights || 0, 10);
        if (nights <= 0) return "";
        if (nights === 1) return `Night ${start}`;
        return `Nights ${start}-${start + nights - 1}`;
    };

    const getDestinationForDay = (dayIndex) => {
        let currentDay = 0;
        for (let dest of packageDestinations) {
            const nights = parseInt(dest.nights || 0, 10);
            if (dayIndex >= currentDay && dayIndex < currentDay + nights) {
                return dest.destination || "---";
            }
            currentDay += nights;
        }
        // Handle the last day (Departure Day)
        const totalNights = packageDestinations.reduce((acc, d) => acc + parseInt(d.nights || 0, 10), 0);
        if (dayIndex === totalNights && packageDestinations.length > 0) {
            return packageDestinations[packageDestinations.length - 1].destination || "---";
        }
        return "---";
    };

    const getDestIndexForDay = (dayIndex) => {
        let currentDay = 0;
        for (let i = 0; i < packageDestinations.length; i++) {
            const nights = parseInt(packageDestinations[i].nights || 0, 10);
            if (dayIndex >= currentDay && dayIndex < currentDay + nights) {
                return i;
            }
            currentDay += nights;
        }
        return -1;
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title?.trim()) newErrors.title = "Package title is required";
        if (!formData.description?.trim()) newErrors.description = "Package description is required";
        if (!formData.category) newErrors.category = "Please select a category";
        if (!formData.starting_city) newErrors.starting_city = "Please select a starting city";
        if (!formData.days || parseInt(formData.days) <= 0) newErrors.days = "Duration (days) must be at least 1";

        if (formData.fixed_departure) {
            if (fixedDepartureData.length === 0) {
                newErrors.fixedDepartureData = "At least one travel date is required for fixed departure";
            } else {
                fixedDepartureData.forEach((slot, index) => {
                    if (!slot.travel_date) newErrors[`slot_date_${index}`] = "Travel date required";
                    if (!slot.booking_valid_until) newErrors[`slot_valid_${index}`] = "Validity date required";
                });
            }
        } else {
            if (fixedDepartureData.length === 0) {
                newErrors.fixedDepartureData = "At least one price tier/range is required";
            } else {
                let hasValidPrice = false;
                fixedDepartureData.forEach((slot, index) => {
                    if (!slot.valid_from) newErrors[`slot_valid_from_${index}`] = "Valid from date required";
                    if (!slot.valid_to) newErrors[`slot_valid_to_${index}`] = "Valid to date required";

                    Object.keys(slot.tiers || {}).forEach((tier) => {
                        slot.tiers[tier].forEach(tierData => {
                            const op = tierData.offer_price ? tierData.offer_price.toString().replace(/,/g, '') : "0";
                            if (parseFloat(op) > 0) hasValidPrice = true;
                        });
                    });
                });
                if (!hasValidPrice) newErrors.offer_price = "At least one offer price must be greater than 0";
            }
        }

        if (packageDestinations.length === 0 && parseInt(formData.days) > 1) {
            newErrors.packageDestinations = "At least one destination night is required";
        } else {
            packageDestinations.forEach((dest, index) => {
                if (!dest.destination) newErrors[`dest_${index}`] = "City required";
            });
        }

        // Itinerary validations
        itineraryDays.forEach((day, index) => {
            if (!day.title || !day.title.trim()) {
                newErrors[`itinerary_title_${index}`] = "Itinerary title required (e.g. Arrival)";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const formDataToSend = new FormData();

            // Add basic fields
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            if (formData.supplier) formDataToSend.append("supplier", formData.supplier);
            formDataToSend.append("starting_city", formData.starting_city);
            formDataToSend.append("ending_city", formData.ending_city);
            // Ensure 'days' matches the actual number of itinerary rows
            formDataToSend.append("days", itineraryDays.length);
            if (formData.start_date) formDataToSend.append("start_date", formData.start_date);
            formDataToSend.append("group_size", formData.group_size);

            // Calculate the lowest possible price across all slots/tiers
            let baseOfferPrice = formData.offer_price || 0;
            if (fixedDepartureData.length > 0) {
                let lowestPrice = Infinity;
                fixedDepartureData.forEach(slot => {
                    Object.values(slot.tiers || {}).forEach(tierList => {
                        tierList.forEach(tier => {
                            let op = parseFloat(tier.offer_price ? tier.offer_price.toString().replace(/,/g, '') : "0");
                            if (!isNaN(op) && op > 0 && op < lowestPrice) {
                                lowestPrice = op;
                            }
                        });
                    });
                });
                if (lowestPrice !== Infinity) {
                    baseOfferPrice = lowestPrice;
                }
            }

            formDataToSend.append("Offer_price", baseOfferPrice);
            if (formData.price) formDataToSend.append("price", formData.price);
            formDataToSend.append("with_flight", formData.with_flight);
            formDataToSend.append("fixed_departure", formData.fixed_departure);
            formDataToSend.append("fixed_departure_data", JSON.stringify(fixedDepartureData));
            formDataToSend.append("sharing", formData.sharing);
            formDataToSend.append("package_categories", JSON.stringify(formData.package_categories || []));
            formDataToSend.append("is_active", formData.is_active);
            formDataToSend.append("with_arrival", formData.with_arrival);
            formDataToSend.append("arrival_city", formData.arrival_city);
            formDataToSend.append("arrival_date", formData.arrival_date);
            formDataToSend.append("arrival_time", formData.arrival_time);
            formDataToSend.append("arrival_no_of_nights", formData.arrival_no_of_nights);
            formDataToSend.append("arrival_airport", formData.arrival_airport);
            formDataToSend.append("arrival_airline", formData.arrival_airline);
            formDataToSend.append("arrival_flight_no", formData.arrival_flight_no);
            formDataToSend.append("with_departure", formData.with_departure);
            formDataToSend.append("departure_city", formData.departure_city);
            formDataToSend.append("departure_date", formData.departure_date);
            formDataToSend.append("departure_time", formData.departure_time);
            formDataToSend.append("departure_airport", formData.departure_airport);
            formDataToSend.append("departure_airline", formData.departure_airline);
            formDataToSend.append("departure_flight_no", formData.departure_flight_no);

            // Add main images ONLY if new file selected or explicitly cleared
            if (formData.header_image instanceof File) {
                formDataToSend.append("header_image", formData.header_image);
            } else if (!headerPreview) {
                formDataToSend.append("header_image", "");
            }

            if (formData.card_image instanceof File) {
                formDataToSend.append("card_image", formData.card_image);
            } else if (!cardPreview) {
                formDataToSend.append("card_image", "");
            }

            // Add package destinations
            formDataToSend.append("package_destinations", JSON.stringify(packageDestinations));

            // Add itinerary days JSON
            const itineraryJson = itineraryDays.map(day => ({
                day: day.day,
                title: day.title,
                description: day.description,
                master_template: day.master_template,
                details_json: day.details_json
            }));
            formDataToSend.append("itinerary_days", JSON.stringify(itineraryJson));

            // Add itinerary images
            itineraryDays.forEach((day, index) => {
                if (day.image instanceof File) {
                    formDataToSend.append(`itinerary_image_${index}`, day.image);
                }
            });

            // Add inclusions, exclusions and highlights
            formDataToSend.append("inclusions_raw", JSON.stringify(inclusions.filter(i => i && i.trim() !== "")));
            formDataToSend.append("exclusions_raw", JSON.stringify(exclusions.filter(e => e && e.trim() !== "")));

            const highlightsArray = highlights.filter(h => h && h.trim() !== "");
            formDataToSend.append("highlights_raw", JSON.stringify(highlightsArray));

            formDataToSend.append("cancellation_policies_raw", JSON.stringify(cancellationPolicies.filter(c => c && c.trim() !== "")));

            // Sanitize accommodations for backend
            const sanitizedAccommodations = accommodations.map(acc => {
                if (acc && acc.hotelName) {
                    return acc.hotelName;
                }
                return "";
            }).filter(a => a !== "");

            formDataToSend.append("accommodations_raw", JSON.stringify(sanitizedAccommodations));
            formDataToSend.append("vehicles_raw", JSON.stringify(vehicles.filter(v => v && v.trim() !== "")));

            // Use PUT to update
            const response = await axios.put(`${API_BASE_URL}/packages/${id}/`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                // After package is successfully updated, save/update marked itineraries to master
                const updatedDays = [...itineraryDays];
                let mastersToSaveCount = itineraryDays.filter(d => d.save_to_master && d.title).length;

                if (mastersToSaveCount > 0) {
                    setMessage(`Saving package and creating ${mastersToSaveCount} new master template(s) in your library...`);

                    for (let i = 0; i < itineraryDays.length; i++) {
                        const day = itineraryDays[i];
                        if (day.save_to_master && day.title) {
                            try {
                                const masterData = new FormData();
                                const destName = getDestinationForDay(i);
                                // Generate Internal ID as "Destination Name [Day Number]"
                                masterData.append("name", `${destName} ${i + 1}`);
                                masterData.append("title", day.title);
                                masterData.append("description", day.description || "");

                                const destObj = destinations.find(d => d.name === destName);
                                if (destObj) {
                                    masterData.append("destination", destObj.id);
                                }

                                if (day.image instanceof File) {
                                    masterData.append("image", day.image);
                                }

                                if (day.details_json) {
                                    masterData.append("details_json", JSON.stringify(day.details_json));
                                }

                                // User wants "another" in the path (a new master entry)
                                // We always POST to create a fresh master from current edits
                                const masterRes = await axios.post(`${API_BASE_URL}/itinerary-masters/`, masterData, {
                                    headers: { "Content-Type": "multipart/form-data" }
                                });

                                const newMasterId = masterRes.data?.id;
                                if (newMasterId) {
                                    // Update local state: link to NEW master and uncheck the box
                                    updatedDays[i] = {
                                        ...updatedDays[i],
                                        master_template: String(newMasterId),
                                        save_to_master: false
                                    };

                                }
                            } catch (mErr) {
                                console.error(`Error storing another master for day ${i + 1}:`, mErr);
                            }
                        }
                    }
                    setItineraryDays(updatedDays);
                }

                setMessage("Holiday package saved and new Master Template(s) created successfully!");
                setErrors({});
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.error("Error updating package:", err);
            if (err.response?.data) {
                if (typeof err.response.data === 'object') {
                    const errorMessages = Object.entries(err.response.data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ");
                    setError(errorMessages);
                } else {
                    setError(`Server Error: ${err.response.status} ${err.response.statusText}`);
                }
            } else {
                setError("Failed to update package. Please check your connection and try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleMasterTemplateChange = (index, templateId) => {
        const copy = [...itineraryDays];
        copy[index].master_template = templateId;
        if (templateId) {
            const template = itineraryMasters.find(t => t.id === parseInt(templateId));
            if (template) {
                copy[index].title = template.title || template.name || "";
                copy[index].description = template.description || "";
                // Also load all the day's structured details if available
                if (template.details_json) {
                    copy[index].details_json = {
                        ...copy[index].details_json,
                        ...template.details_json,
                        active_tab: copy[index].details_json?.active_tab || 'day_itinerary'
                    };
                }
                if (template.image) {
                    copy[index].existing_image = template.image;
                }
            }
        }
        setItineraryDays(copy);
    };

    if (loading) {
        return (
            <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
                </style>
                <AdminSidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <AdminTopbar />
                    <div className="flex-1 flex justify-center items-center">
                        <div className="flex flex-col items-center gap-8 animate-in fade-in duration-1000">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Package size={24} className="text-[#14532d] animate-bounce" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-900 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Syncing Inventory</p>
                                <p className="text-gray-400 text-[10px] font-bold mt-2 italic uppercase">Preparing high-definition package data...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'overview', label: 'Trip Overview', icon: <Globe size={15} />, color: 'bg-emerald-500' },
        { id: 'location', label: 'Arrival & Departure', icon: <Plane size={15} />, color: 'bg-blue-500' },
        { id: 'itinerary', label: 'Day Wise Itinerary', icon: <ClipboardList size={15} />, color: 'bg-indigo-600' },
        { id: 'pricing', label: 'Pricing', icon: <IndianRupee size={15} />, color: 'bg-amber-500' },
        { id: 'policy', label: 'Trip Information', icon: <Info size={15} />, color: 'bg-sky-400' },
    ];

    return (
        <>
            <div className="flex bg-[#fcfdfc] h-screen overflow-hidden">
                <AdminSidebar />

                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <AdminTopbar />

                    {/* Action Header */}
                    <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90 gap-4 md:gap-0">
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tighter">Edit Holiday Package</h1>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex flex-wrap items-center gap-2">
                                <span className="text-green-500">Inventory</span> / <span>Holidays</span> / <span className="text-gray-900 whitespace-nowrap">{formData.title || "Package"}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/packages')}
                                className="px-6 py-2 rounded-xl border-2 border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 shadow-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-8 py-2 rounded-xl bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:scale-100"
                                disabled={saving}
                                form="package-form"
                            >
                                {saving ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Package size={14} />
                                )}
                                {saving ? "UPDATING..." : "UPDATE PACKAGE"}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex h-full overflow-hidden relative bg-[#fcfdfc] flex-col lg:flex-row">
                        {/* Internal Navigation Sidebar */}
                        <div className="hidden lg:flex w-48 bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar flex-col p-3 shrink-0">
                            <nav className="flex-1 space-y-0.5">
                                {navItems.map((item) => (
                                    <div key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group relative overflow-hidden ${activeSection === item.id ? 'bg-[#14532d] text-white shadow-lg shadow-green-900/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                        >
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${activeSection === item.id ? 'text-white ' + item.color : 'text-gray-300 group-hover:text-gray-700'}`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.08em] leading-tight">{item.label}</span>
                                        </button>
                                        {item.id === 'itinerary' && activeSection === 'itinerary' && (
                                            <div className="mt-1 ml-4 pl-3 border-l-2 border-green-50 space-y-0.5 py-1 animate-in slide-in-from-top-4">
                                                {itineraryDays.map((row, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-medium text-gray-400 hover:bg-gray-50 hover:text-[#14532d] transition-all group"
                                                        onClick={() => {
                                                            const el = document.getElementById(`itinerary-day-${idx}`);
                                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        }}
                                                    >
                                                        <div className={`w-1 h-1 rounded-full shrink-0 ${activeSection === 'itinerary' ? 'bg-green-500' : 'bg-gray-300'} group-hover:bg-[#14532d] transition-all`}></div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Day {idx + 1}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                            <div className="mt-4 p-3 bg-[#14532d]/5 rounded-2xl border border-[#14532d]/10">
                                <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest mb-1 opacity-60">Ref ID</p>
                                <p className="text-[10px] font-bold text-[#14532d] break-all">{id}</p>
                            </div>
                        </div>

                        {/* Form Content Area */}
                        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-10 custom-scrollbar bg-[#fcfdfc]">
                            <div className="max-w-4xl mx-auto pb-12">
                                {/* Success message */}
                                {message && (
                                    <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 text-[#14532d] rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-green-100 p-2 rounded-full">✓</div>
                                        <p className="font-bold text-xs uppercase tracking-wider">{message}</p>
                                    </div>
                                )}

                                {/* Validation errors summary */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="mb-6 bg-red-50 border-2 border-red-100 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center gap-3 px-5 py-3 bg-red-100/60 border-b border-red-100">
                                            <div className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">!</div>
                                            <p className="font-black text-sm text-red-700 uppercase tracking-wide">Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} before saving</p>
                                        </div>
                                        <ul className="px-5 py-3 space-y-1.5">
                                            {Object.entries(errors).map(([key, msg]) => (
                                                <li key={key} className="flex items-start gap-2 text-[11px] text-red-600">
                                                    <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
                                                    <span className="font-bold">{msg}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Server/API error */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-red-100 p-2 rounded-full">⚠</div>
                                        <p className="font-bold text-xs uppercase tracking-wider text-left">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} id="package-form">
                                    {/* PACKAGE INFORMATION */}
                                    <Section title="Trip Overview" active={activeSection === 'overview'}>
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                            <div className="space-y-4">
                                                {/* Top Options: Departure & Tiers */}
                                                <div className="bg-gray-100/50 px-5 py-4 rounded-xl border-2 border-white flex flex-col xl:flex-row xl:items-center gap-6">
                                                    {/* Fixed Departure */}
                                                    <div className="flex items-center gap-3 w-max">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Departure</span>
                                                        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#14532d]/30 transition-all shadow-sm group">
                                                            <input
                                                                type="checkbox"
                                                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d] transition-all cursor-pointer"
                                                                checked={formData.fixed_departure}
                                                                onChange={(e) => setFormData({ ...formData, fixed_departure: e.target.checked })}
                                                            />
                                                            <span className="text-[10px] font-bold text-gray-700 group-hover:text-[#14532d] transition-colors">Fixed Departure</span>
                                                        </label>
                                                    </div>

                                                    <div className="hidden xl:block w-px h-6 bg-gray-200"></div>

                                                    {/* Package Tiers */}
                                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                        <div className="min-w-fit">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Package Tiers</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['Budget', 'Standard', 'Deluxe', 'Luxury', 'Premium'].map((tier) => (
                                                                <label key={tier} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-100 hover:border-[#14532d]/30 transition-all shadow-sm group">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d] transition-all cursor-pointer"
                                                                        checked={formData.package_categories && formData.package_categories.includes(tier)}
                                                                        onChange={(e) => {
                                                                            const currentTiers = formData.package_categories || [];
                                                                            if (e.target.checked) setFormData({ ...formData, package_categories: [...currentTiers, tier] });
                                                                            else setFormData({ ...formData, package_categories: currentTiers.filter(t => t !== tier) });
                                                                        }}
                                                                    />
                                                                    <span className="text-[10px] font-bold text-gray-700 group-hover:text-[#14532d] transition-colors">{tier}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Starting & Ending City */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <FormLabel label="Starting City" required />
                                                        <SearchableSelect
                                                            options={[
                                                                { value: "Any City", label: "Any City" },
                                                                ...startingCities.map(city => ({ value: city.name, label: city.name }))
                                                            ]}
                                                            value={formData.starting_city}
                                                            onChange={(val) => setFormData(prev => ({ ...prev, starting_city: val }))}
                                                            placeholder="🔍 Where the trip starts..."
                                                            error={errors.starting_city}
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormLabel label="Ending City" />
                                                        <SearchableSelect
                                                            options={[
                                                                { value: "Any City", label: "Any City" },
                                                                ...startingCities.map(city => ({ value: city.name, label: city.name }))
                                                            ]}
                                                            value={formData.ending_city}
                                                            onChange={(val) => setFormData(prev => ({ ...prev, ending_city: val }))}
                                                            placeholder="🔍 Where the trip ends..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <FormLabel
                                                            label="Package Title"
                                                            required
                                                            limit={TITLE_LIMIT}
                                                            current={formData.title.length}
                                                        />
                                                        <Input
                                                            name="title"
                                                            value={formData.title}
                                                            onChange={handleInputChange}
                                                            error={errors.title}
                                                            maxLength={TITLE_LIMIT}
                                                            placeholder="e.g. Magical Mauritius - 5 Nights Luxury Escape"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className={`aspect-[21/9] w-full bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative group hover:border-[#14532d] transition-all cursor-pointer`}>
                                                            {(headerPreview) ? (
                                                                <>
                                                                    <img src={headerPreview} className="w-full h-full object-cover" alt="Header Preview" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setHeaderPreview(null);
                                                                                setFormData({ ...formData, header_image: null });
                                                                            }}
                                                                            className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-center">
                                                                    <ImageIcon size={18} className="text-gray-300 mx-auto" />
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Header</p>
                                                                </div>
                                                            )}
                                                            <input type="file" name="header_image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { handleFileChange(e); if (e.target.files[0]) { setHeaderPreview(URL.createObjectURL(e.target.files[0])); } }} />
                                                        </div>
                                                        <div className="aspect-[4/3] w-full bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative group hover:border-[#14532d] transition-all cursor-pointer">
                                                            {(cardPreview) ? (
                                                                <>
                                                                    <img src={cardPreview} className="w-full h-full object-cover" alt="Card Preview" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setCardPreview(null);
                                                                                setFormData({ ...formData, card_image: null });
                                                                            }}
                                                                            className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-center">
                                                                    <ImageIcon size={18} className="text-gray-300 mx-auto" />
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Card</p>
                                                                </div>
                                                            )}
                                                            <input type="file" name="card_image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { handleFileChange(e); if (e.target.files[0]) { setCardPreview(URL.createObjectURL(e.target.files[0])); } }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <FormLabel
                                                        label="Trip Description"
                                                        required
                                                        limit={DESC_LIMIT}
                                                        current={formData.description.length}
                                                    />
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        maxLength={DESC_LIMIT}
                                                        placeholder="Describe the magical experience..."
                                                        className={`bg-white border-2 ${errors.description ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'} p-3.5 rounded-xl w-full h-40 text-gray-800 text-xs transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] hover:border-gray-200 resize-none`}
                                                    />
                                                    {errors.description && <p className="text-red-500 text-[9px] font-black mt-1.5 flex items-center gap-2 ml-1 uppercase tracking-wider italic">
                                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                                                        {errors.description}
                                                    </p>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <FormLabel label="Package Category" required />
                                                            <select
                                                                name="category"
                                                                value={formData.category}
                                                                onChange={handleInputChange}
                                                                className={`bg-white border-2 ${errors.category ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'} p-3 rounded-xl w-full text-gray-800 text-[11px] focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all font-bold`}
                                                            >
                                                                <option value="">Select Category</option>
                                                                <option value="Domestic">Domestic</option>
                                                                <option value="International">International</option>
                                                                <option value="Umrah">Umrah</option>
                                                            </select>
                                                            {errors.category && <p className="text-red-500 text-[9px] font-black mt-1.5 flex items-center gap-2 ml-1 uppercase tracking-wider italic">
                                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                                                                {errors.category}
                                                            </p>}
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Supplier" optional />
                                                            <select
                                                                name="supplier"
                                                                value={formData.supplier}
                                                                onChange={handleInputChange}
                                                                className={`bg-white border-2 border-gray-100 p-3 rounded-xl w-full text-gray-800 text-[11px] focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all font-bold`}
                                                            >
                                                                <option value="">Select Supplier</option>
                                                                {suppliers.map(s => (
                                                                    <option key={s.id} value={s.id}>{s.company_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50/50 p-4 rounded-2xl border-2 border-gray-50 flex gap-4 mt-1.5 overflow-x-auto">
                                                        <div className="flex-1 min-w-[120px]">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Flight</span>
                                                            <div className="flex gap-1.5">
                                                                {[true, false].map((val) => (
                                                                    <button
                                                                        key={`flight-${val}`}
                                                                        type="button"
                                                                        onClick={() => setFormData({
                                                                            ...formData,
                                                                            with_flight: val,
                                                                            ...(val ? { with_arrival: true, with_departure: true } : {})
                                                                        })}
                                                                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all border-2 ${formData.with_flight === val ? 'bg-[#14532d] border-[#14532d] text-white shadow-md shadow-green-900/10' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'}`}
                                                                    >
                                                                        {val ? 'WITH' : 'NO'}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-[120px]">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Status</span>
                                                            <div className="flex gap-1.5">
                                                                {[true, false].map((val) => (
                                                                    <button
                                                                        key={`act-${val}`}
                                                                        type="button"
                                                                        onClick={() => setFormData({ ...formData, is_active: val })}
                                                                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all border-2 ${formData.is_active === val ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-900/10' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'}`}
                                                                    >
                                                                        {val ? 'ACTIVE' : 'DRAFT'}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Trip Highlights Integrated into Overview */}
                                                <div className="mt-8">
                                                    <DynamicList
                                                        label="Trip Highlights"
                                                        items={highlights}
                                                        setItems={setHighlights}
                                                        placeholder="e.g. Traditional Malay Dinner Experience"
                                                        required
                                                    />
                                                </div>


                                            </div>
                                        </div>


                                    </Section>



                                    {/* ARRIVAL & DEPARTURE */}
                                    <Section title="Arrival & Departure" active={activeSection === 'location'}>
                                        <div className="space-y-8">
                                            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-[0.2em]">Package Destinations</h3>
                                                        <p className="text-[8px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Map your journey stay by stay</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPackageDestinations(prev => [...prev, { destination: "", nights: 1 }])}
                                                        className="bg-white px-4 py-2 rounded-xl border-2 border-gray-100 text-[10px] font-black text-[#14532d] hover:bg-green-50 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                                                    >
                                                        + ADD DESTINATION
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    {packageDestinations.map((row, i) => (
                                                        <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 bg-white/50 p-2 rounded-2xl border border-gray-50" style={{ animationDelay: `${i * 100}ms` }}>
                                                            <div className="flex-1">
                                                                <SearchableSelect
                                                                    options={destinations.map(d => ({ value: d.name, label: d.name, subtitle: d.country }))}
                                                                    value={row.destination}
                                                                    onChange={(val) => {
                                                                        const copy = [...packageDestinations];
                                                                        copy[i].destination = val;
                                                                        setPackageDestinations(copy);
                                                                    }}
                                                                    placeholder="🔍 Select city..."
                                                                    error={errors[`dest_${i}`]}
                                                                />
                                                            </div>
                                                            <div className="w-32">
                                                                <SearchableSelect
                                                                    options={[...Array(30)].map((_, n) => ({
                                                                        value: String(n + 1),
                                                                        label: `${n + 1} ${n + 1 === 1 ? 'Night' : 'Nights'}`
                                                                    }))}
                                                                    value={String(row.nights)}
                                                                    onChange={(val) => {
                                                                        const copy = [...packageDestinations];
                                                                        copy[i].nights = parseInt(val);
                                                                        setPackageDestinations(copy);
                                                                    }}
                                                                    placeholder="Nights"
                                                                />

                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (packageDestinations.length > 1) {
                                                                        removeRow(setPackageDestinations, i);
                                                                    }
                                                                }}
                                                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${packageDestinations.length > 1 ? 'hover:bg-red-50 text-red-200 hover:text-red-500' : 'text-gray-100 cursor-not-allowed'}`}
                                                                disabled={packageDestinations.length <= 1}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <FormLabel label="Total Days (Auto)" required />
                                                    <Input type="number" name="days" value={formData.days} readOnly className="!bg-gray-50/50 cursor-not-allowed opacity-70" />
                                                </div>
                                                <div>
                                                    <FormLabel label="Group Size" optional />
                                                    <Input type="number" name="group_size" value={formData.group_size} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>


                                    </Section>

                                    {/* PRICING */}
                                    <Section title="Pricing & Availability" active={activeSection === 'pricing'}>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                                                        {formData.fixed_departure ? "Fixed Departure Pricing" : "Package Pricing & Tiers"}
                                                    </h3>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                        {formData.fixed_departure
                                                            ? "Configure pricing for specific travel dates"
                                                            : "Configure tiered pricing for specific validity ranges"}
                                                    </p>
                                                </div>
                                            </div>

                                            {fixedDepartureData.length === 0 ? (
                                                <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] p-12 text-center">
                                                    <Calendar className="mx-auto text-gray-200 mb-4" size={48} />
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No pricing data added yet</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFixedDepartureData([mkSlot()])}
                                                        className="text-[#14532d] text-[10px] font-black uppercase tracking-widest mt-4 hover:underline"
                                                    >
                                                        Click here to add your first {formData.fixed_departure ? 'travel date' : 'price range'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-6" ref={pricingSlotsRef}>
                                                    {fixedDepartureData.map((slot, sIdx) => {
                                                        const isExpired = (() => {
                                                            const validTo = slot.valid_to || slot.booking_valid_until;
                                                            if (!validTo) return false;
                                                            return new Date(validTo) < new Date(new Date().toDateString());
                                                        })();
                                                        return (
                                                            <div key={sIdx} className={`bg-white border-2 ${isExpired ? 'border-red-200 opacity-75' : 'border-gray-100'} rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all relative group`}>
                                                                {/* Expired Badge */}
                                                                {isExpired && (
                                                                    <div className="absolute top-4 right-6 z-20 flex items-center gap-1.5 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                                                                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                                                        EXPIRED — Hidden from Live
                                                                    </div>
                                                                )}
                                                                {/* Card Decoration */}
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-40"></div>

                                                                {/* Header Section */}
                                                                <div className="flex flex-wrap items-center gap-6 mb-8 relative z-10">
                                                                    {formData.fixed_departure ? (
                                                                        <div className="flex flex-col gap-1.5 flex-1 max-w-xs">
                                                                            <span className="text-[9px] font-black text-[#14532d] uppercase tracking-[0.15em] ml-1 flex items-center gap-1.5">
                                                                                <Calendar size={12} className="opacity-40" /> Enter Travel Date
                                                                            </span>
                                                                            <div className="relative group/input">
                                                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover/input:text-[#14532d] transition-colors" size={14} />
                                                                                <input
                                                                                    type="date"
                                                                                    value={slot.travel_date}
                                                                                    onChange={(e) => {
                                                                                        const copy = [...fixedDepartureData];
                                                                                        copy[sIdx].travel_date = e.target.value;
                                                                                        // Auto-sync arrival date in logistics
                                                                                        if (copy[sIdx].logistics) {
                                                                                            copy[sIdx].logistics = { ...copy[sIdx].logistics, arrival_date: e.target.value };
                                                                                        } else {
                                                                                            copy[sIdx].logistics = { ...mkLogistics(), arrival_date: e.target.value };
                                                                                        }
                                                                                        setFixedDepartureData(copy);
                                                                                    }}
                                                                                    className="w-full bg-gray-50 border-2 border-transparent pl-10 pr-4 py-2 rounded-xl text-gray-900 text-[11px] font-black focus:bg-white focus:border-[#14532d] outline-none transition-all shadow-inner"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                                                            <div className="flex flex-col gap-1.5">
                                                                                <span className="text-[9px] font-black text-[#14532d] uppercase tracking-[0.15em] ml-1">Price Valid From</span>
                                                                                <div className="relative group/input">
                                                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" size={14} />
                                                                                    <input
                                                                                        type="date"
                                                                                        value={slot.valid_from}
                                                                                        onChange={(e) => {
                                                                                            const copy = [...fixedDepartureData];
                                                                                            copy[sIdx].valid_from = e.target.value;
                                                                                            setFixedDepartureData(copy);
                                                                                        }}
                                                                                        className="w-full bg-gray-50 border-2 border-transparent pl-10 pr-4 py-2 rounded-xl text-gray-900 text-[11px] font-black focus:bg-white focus:border-[#14532d] outline-none transition-all shadow-inner"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1.5">
                                                                                <span className="text-[9px] font-black text-[#14532d] uppercase tracking-[0.15em] ml-1">Valid To</span>
                                                                                <div className="relative group/input">
                                                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors" size={14} />
                                                                                    <input
                                                                                        type="date"
                                                                                        value={slot.valid_to}
                                                                                        onChange={(e) => {
                                                                                            const copy = [...fixedDepartureData];
                                                                                            copy[sIdx].valid_to = e.target.value;
                                                                                            setFixedDepartureData(copy);
                                                                                        }}
                                                                                        className="w-full bg-gray-50 border-2 border-transparent pl-10 pr-4 py-2 rounded-xl text-gray-900 text-[11px] font-black focus:bg-white focus:border-[#14532d] outline-none transition-all shadow-inner"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setFixedDepartureData(prev => {
                                                                                    const next = [...prev];
                                                                                    next.splice(sIdx + 1, 0, mkSlot());
                                                                                    return next;
                                                                                });
                                                                                // Scroll back to top of pricing slots after adding
                                                                                setTimeout(() => {
                                                                                    if (pricingSlotsRef.current) {
                                                                                        pricingSlotsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                                    }
                                                                                }, 50);
                                                                            }}
                                                                            className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                                            title="Add new travel date"
                                                                        >
                                                                            <Plus size={16} />
                                                                        </button>
                                                                        {fixedDepartureData.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setFixedDepartureData(prev => prev.filter((_, i) => i !== sIdx))}
                                                                                className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                                title="Remove this travel date"
                                                                            >
                                                                                <X size={16} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Tiers Container */}
                                                                <div className="border border-gray-200 rounded-[2rem] p-8 bg-[#fdfdfd] shadow-inner mb-6 relative z-10">
                                                                    <div className="space-y-8">
                                                                        {formData.package_categories.length === 0 ? (
                                                                            <p className="text-[11px] font-bold text-red-400 italic text-center py-4">No package tiers selected. Please select them in Step 1.</p>
                                                                        ) : (
                                                                            formData.package_categories.map((tier) => (
                                                                                <div key={tier} className="space-y-3">
                                                                                    {slot.tiers[tier]?.map((row, rIdx) => (
                                                                                        <div key={rIdx} className="flex flex-wrap items-center gap-4 group/tier">
                                                                                            {rIdx === 0 && (
                                                                                                <div className="w-24 shrink-0">
                                                                                                    <span className="text-[11px] font-black text-[#14532d] uppercase tracking-wide group-hover/tier:tracking-widest transition-all">
                                                                                                        {tier} <span className="text-gray-300 ml-1">&#8594;</span>
                                                                                                    </span>
                                                                                                </div>
                                                                                            )}
                                                                                            {rIdx > 0 && <div className="w-24 shrink-0"></div>}

                                                                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                                                                                                <div>
                                                                                                    {rIdx === 0 && <FormLabel label="Sharing" />}
                                                                                                    <select
                                                                                                        value={row.sharing || 'SINGLE'}
                                                                                                        onChange={(e) => {
                                                                                                            const copy = [...fixedDepartureData];
                                                                                                            copy[sIdx].tiers[tier][rIdx].sharing = e.target.value;
                                                                                                            setFixedDepartureData(copy);
                                                                                                        }}
                                                                                                        className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl w-full text-[10px] font-black focus:border-[#14532d] focus:ring-4 focus:ring-green-50 outline-none transition-all"
                                                                                                    >
                                                                                                        <option value="SINGLE">SINGLE</option>
                                                                                                        <option value="TWIN">TWIN</option>
                                                                                                        <option value="TRIPLE">TRIPLE</option>
                                                                                                        <option value="QUAD">QUAD</option>
                                                                                                        <option value="QUINT">QUINT</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                                <div>
                                                                                                    {rIdx === 0 && <FormLabel label="Offer Price" />}
                                                                                                    <div className="relative">
                                                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] font-black">₹</span>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={formatWithCommas(row.offer_price || '')}
                                                                                                            onChange={(e) => {
                                                                                                                const copy = [...fixedDepartureData];
                                                                                                                const cleanVal = e.target.value.replace(/\D/g, "");
                                                                                                                copy[sIdx].tiers[tier][rIdx].offer_price = cleanVal;
                                                                                                                setFixedDepartureData(copy);
                                                                                                            }}
                                                                                                            placeholder="Offer Price"
                                                                                                            className="bg-white border border-gray-200 pl-6 pr-3 py-1.5 rounded-xl w-full text-[10px] font-black focus:border-[#14532d] outline-none transition-all"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    {rIdx === 0 && <FormLabel label="Market Price" />}
                                                                                                    <div className="relative">
                                                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] font-black">₹</span>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={formatWithCommas(row.market_price || '')}
                                                                                                            onChange={(e) => {
                                                                                                                const copy = [...fixedDepartureData];
                                                                                                                const cleanVal = e.target.value.replace(/\D/g, "");
                                                                                                                copy[sIdx].tiers[tier][rIdx].market_price = cleanVal;
                                                                                                                setFixedDepartureData(copy);
                                                                                                            }}
                                                                                                            placeholder="Market Price"
                                                                                                            className="bg-white border border-gray-200 pl-6 pr-3 py-1.5 rounded-xl w-full text-[10px] font-black focus:border-[#14532d] outline-none transition-all"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <div className="flex-1">
                                                                                                        {rIdx === 0 && <FormLabel label="Min Pax" />}
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={row.min_members || '1'}
                                                                                                            onChange={(e) => {
                                                                                                                const copy = [...fixedDepartureData];
                                                                                                                copy[sIdx].tiers[tier][rIdx].min_members = e.target.value;
                                                                                                                setFixedDepartureData(copy);
                                                                                                            }}
                                                                                                            className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl w-full text-[10px] font-black focus:border-[#14532d] outline-none transition-all"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className={`flex items-center gap-1.5 ${rIdx === 0 ? 'mt-3.5' : ''}`}>
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            onClick={() => {
                                                                                                                const copy = [...fixedDepartureData];
                                                                                                                copy[sIdx].tiers[tier].splice(rIdx + 1, 0, { offer_price: "", market_price: "", min_members: "1", sharing: "SINGLE" });
                                                                                                                setFixedDepartureData(copy);
                                                                                                            }}
                                                                                                            className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-600 transition-all font-bold text-xs"
                                                                                                        >
                                                                                                            +
                                                                                                        </button>
                                                                                                        {slot.tiers[tier].length > 1 && (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() => {
                                                                                                                    const copy = [...fixedDepartureData];
                                                                                                                    copy[sIdx].tiers[tier].splice(rIdx, 1);
                                                                                                                    setFixedDepartureData(copy);
                                                                                                                }}
                                                                                                                className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all font-bold text-xs"
                                                                                                            >
                                                                                                                -
                                                                                                            </button>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ))
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {formData.fixed_departure && (
                                                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                                                        <div className="flex items-center gap-3 justify-center">
                                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">BOOKING VALID UNTIL:</span>
                                                                            <div className="relative group/valid">
                                                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover/valid:text-amber-500 transition-colors" size={14} />
                                                                                <input
                                                                                    type="date"
                                                                                    value={slot.booking_valid_until}
                                                                                    onChange={(e) => {
                                                                                        const copy = [...fixedDepartureData];
                                                                                        copy[sIdx].booking_valid_until = e.target.value;
                                                                                        setFixedDepartureData(copy);
                                                                                    }}
                                                                                    className="w-44 bg-gray-50 border-2 border-transparent pl-10 pr-4 py-2 rounded-xl text-gray-900 text-[11px] font-black focus:bg-white focus:border-amber-500 outline-none transition-all shadow-inner"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest text-center px-8">Package will automatically de-activate on the live site after this date</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                </div>
                                            )}
                                            <p className="text-[10px] text-gray-400 font-medium italic mt-2">Note: Prices are formatted with commas automatically for Indian Rupees.</p>
                                        </div>
                                    </Section>




                                    {/* DAY WISE ITINERARY */}
                                    <Section title="Day Wise Itinerary" active={activeSection === 'itinerary'}>
                                        <div className="space-y-8">
                                            {itineraryDays.map((row, i) => (
                                                <div key={i} id={`itinerary-day-${i}`} className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 relative group/day hover:border-[#14532d]/40 transition-all shadow-sm hover:shadow-2xl hover:shadow-green-900/5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 150}ms` }}>
                                                    <div className="absolute -left-4 top-10 w-8 h-8 rounded-full bg-red-500 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-[10px] group-hover/day:scale-125 transition-transform z-10">
                                                        {i + 1}
                                                    </div>

                                                    <div className="flex justify-between items-start mb-6 pl-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#14532d] uppercase tracking-[0.2em] mb-1">Day {i + 1} Profile</p>
                                                            <h3 className="text-xl font-black text-gray-900">{getDestinationForDay(i)}</h3>
                                                        </div>
                                                        <div className="flex gap-4">


                                                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 scale-90">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const copy = [...itineraryDays];
                                                                        if (i > 0) {
                                                                            const temp = copy[i];
                                                                            copy[i] = copy[i - 1];
                                                                            copy[i - 1] = temp;
                                                                            setItineraryDays(copy);
                                                                        }
                                                                    }}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#14532d] hover:bg-white transition-all font-bold"
                                                                    title="Move Up"
                                                                >
                                                                    ↑
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const copy = [...itineraryDays];
                                                                        if (i < copy.length - 1) {
                                                                            const temp = copy[i];
                                                                            copy[i] = copy[i + 1];
                                                                            copy[i + 1] = temp;
                                                                            setItineraryDays(copy);
                                                                        }
                                                                    }}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#14532d] hover:bg-white transition-all font-bold"
                                                                    title="Move Down"
                                                                >
                                                                    ↓
                                                                </button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeRow(setItineraryDays, i)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* SUB-TABS NAVIGATION */}
                                                    <div className="flex items-center gap-3 mb-6 pl-4">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Add to this day:</span>
                                                        <div className="flex gap-1.5 bg-gray-50/50 p-1 rounded-2xl border border-gray-100/50 shrink-0">
                                                            {[
                                                                { id: 'day_itinerary', label: 'Day Itinerary', symbol: '' },
                                                                { id: 'sightseeing', label: 'Sightseeing', symbol: '+ ' },
                                                                { id: 'accommodation', label: 'Accommodation', symbol: '+ ' },
                                                                { id: 'vehicle', label: 'Vehicle', symbol: '+ ' }
                                                            ].map(tab => (
                                                                <button
                                                                    key={tab.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const copy = [...itineraryDays];
                                                                        if (!copy[i].details_json) copy[i].details_json = { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] };
                                                                        copy[i].details_json.active_tab = tab.id;
                                                                        setItineraryDays(copy);
                                                                    }}
                                                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${(row.details_json?.active_tab || 'day_itinerary') === tab.id
                                                                        ? 'bg-[#ffe4e1] text-[#b91c1c] shadow-md scale-105'
                                                                        : 'text-gray-500 hover:bg-white hover:text-[#14532d]'
                                                                        }`}
                                                                >
                                                                    {tab.symbol}{tab.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="pl-4">

                                                        {/* TAB CONTENT */}
                                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                            {/* 1. DAY ITINERARY */}
                                                            {(!row.details_json?.active_tab || row.details_json?.active_tab === 'day_itinerary') && (() => {
                                                                const dayMasterSearch = row.details_json?._dayMasterSearch || '';
                                                                const dayMeals = row.details_json?.meals_included || [];
                                                                const dayTransferType = row.details_json?.transfer_type || '';
                                                                const updateDay = (patch) => {
                                                                    const copy = [...itineraryDays];
                                                                    copy[i].details_json = { ...copy[i].details_json, ...patch };
                                                                    setItineraryDays(copy);
                                                                };
                                                                const currentDest = getDestinationForDay(i);
                                                                const availableMasters = [
                                                                    ...(currentDest && currentDest !== "---" && groupedItineraryMasters[currentDest] ? groupedItineraryMasters[currentDest] : []),
                                                                    ...(groupedItineraryMasters["Global / General"] || [])
                                                                ];
                                                                const filteredDayMasters = dayMasterSearch
                                                                    ? availableMasters.filter(m =>
                                                                        m.name?.toLowerCase().includes(dayMasterSearch.toLowerCase()) ||
                                                                        m.title?.toLowerCase().includes(dayMasterSearch.toLowerCase())
                                                                    ) : [];
                                                                const mealOptions = ['No Meals', 'Breakfast', 'Lunch', 'High-Tea', 'Dinner'];
                                                                return (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                        <div className="space-y-4">
                                                                            {/* Note */}
                                                                            <p className="text-[10px] text-red-600 font-medium">Note - You can save only one Day Wise Itinerary for each itinerary!</p>

                                                                            {/* Day title */}
                                                                            <div>
                                                                                <FormLabel label="Trip Title (e.g. Flight Arrival)" required />
                                                                                <Input
                                                                                    placeholder="Arrival in Singapore..."
                                                                                    value={row.title}
                                                                                    onChange={(e) => { const copy = [...itineraryDays]; copy[i].title = e.target.value; setItineraryDays(copy); }}
                                                                                    error={errors[`itinerary_title_${i}`]}
                                                                                />
                                                                            </div>

                                                                            {/* Search day itinerary from masters */}
                                                                            <div>
                                                                                <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search day itinerary from the database</p>
                                                                                <SearchableSelect
                                                                                    options={availableMasters.map(m => ({
                                                                                        value: m.id.toString(),
                                                                                        label: m.title || m.name,
                                                                                        subtitle: m.destination_name || (destinations.find(d => d.id === m.destination)?.name)
                                                                                    }))}
                                                                                    value={row.master_template?.toString()}
                                                                                    onChange={(val) => handleMasterTemplateChange(i, val)}
                                                                                    placeholder="🔍 Search for day itinerary in masters..."
                                                                                />
                                                                            </div>

                                                                            {/* Day description */}
                                                                            <div>
                                                                                <FormLabel label="Description" optional />
                                                                                <textarea
                                                                                    value={row.description}
                                                                                    onChange={(e) => { const copy = [...itineraryDays]; copy[i].description = e.target.value; setItineraryDays(copy); }}
                                                                                    className="bg-gray-50 border-2 border-transparent p-4 rounded-2xl w-full h-40 text-sm font-medium focus:border-[#14532d] focus:bg-white transition-all outline-none resize-none"
                                                                                    placeholder="Describe the day's journey..."
                                                                                />
                                                                            </div>

                                                                            {/* Meals included */}
                                                                            <div>
                                                                                <p className="text-[11px] font-bold text-gray-800 mb-2">Meals included for the day</p>
                                                                                <div className="flex flex-wrap gap-4">
                                                                                    {mealOptions.map(meal => (
                                                                                        <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={dayMeals.includes(meal)}
                                                                                                onChange={e => {
                                                                                                    const updated = e.target.checked
                                                                                                        ? [...dayMeals, meal]
                                                                                                        : dayMeals.filter(m => m !== meal);
                                                                                                    updateDay({ meals_included: updated });
                                                                                                }}
                                                                                                className="w-3.5 h-3.5 border border-gray-300 rounded-sm accent-[#14532d]"
                                                                                            />
                                                                                            <span className="text-[11px] text-gray-700">{meal}</span>
                                                                                        </label>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                            {/* Transfer Type */}
                                                                            <div>
                                                                                <p className="text-[11px] font-bold text-gray-800 mb-1.5">Transfer Type</p>
                                                                                <select
                                                                                    value={dayTransferType}
                                                                                    onChange={e => updateDay({ transfer_type: e.target.value })}
                                                                                    className="w-48 border border-gray-300 rounded-sm px-2 py-1.5 text-[11px] focus:outline-none focus:border-blue-400 bg-white"
                                                                                >
                                                                                    <option value="">Select Transfer Type</option>
                                                                                    <option value="Private">Private</option>
                                                                                    <option value="Shared">Shared</option>
                                                                                    <option value="Self Drive">Self Drive</option>
                                                                                    <option value="Vehicle with Driver/ Chaffeur">Vehicle with Driver/ Chaffeur</option>
                                                                                    <option value="No Transfer">No Transfer</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <FormLabel label="Day Visual (Image)" optional />
                                                                                <div className={`relative border-2 border-dashed rounded-3xl p-4 transition-all min-h-[140px] flex flex-col items-center justify-center ${(row.image || (row.existing_image && row.existing_image !== 'null')) ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#14532d]/40 shadow-inner'}`}>
                                                                                    {(row.image || (row.existing_image && typeof row.existing_image === 'string' && row.existing_image !== 'null')) ? (
                                                                                        <div className="relative group/dayimg w-full">
                                                                                            <img
                                                                                                src={row.image ? URL.createObjectURL(row.image) : (row.existing_image?.startsWith('http') ? row.existing_image.replace('http://localhost:8000', '').replace('http://127.0.0.1:8000', '') : row.existing_image)}
                                                                                                className="h-32 w-full object-cover rounded-2xl border-2 border-white shadow-xl transition-transform group-hover/dayimg:scale-[1.02]"
                                                                                                alt="Preview"
                                                                                            />
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    const copy = [...itineraryDays];
                                                                                                    copy[i].image = null;
                                                                                                    copy[i].existing_image = null;
                                                                                                    setItineraryDays(copy);
                                                                                                }}
                                                                                                className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl opacity-0 group-hover/dayimg:opacity-100"
                                                                                            >
                                                                                                <X size={20} />
                                                                                            </button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <>
                                                                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-3 font-black text-2xl shadow-sm">+</div>
                                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Preview Image</p>
                                                                                            <input
                                                                                                type="file"
                                                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                                accept="image/*"
                                                                                                onChange={(e) => {
                                                                                                    const file = e.target.files[0];
                                                                                                    if (file) {
                                                                                                        const copy = [...itineraryDays];
                                                                                                        copy[i].image = file;
                                                                                                        setItineraryDays(copy);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className={`p-3 rounded-2xl border-2 transition-all ${row.save_to_master ? 'bg-[#14532d] border-[#14532d] text-white shadow-lg shadow-green-900/20' : 'bg-gray-50 border-transparent text-gray-500 hover:border-gray-200 hover:bg-white'}`}>
                                                                                <label className="flex items-center gap-3 cursor-pointer">
                                                                                    <input type="checkbox" checked={row.save_to_master} onChange={(e) => { const copy = [...itineraryDays]; copy[i].save_to_master = e.target.checked; setItineraryDays(copy); }} className="w-4 h-4 rounded-lg border-gray-300 text-[#14532d] focus:ring-[#14532d]" />
                                                                                    <div className="flex flex-col leading-none">
                                                                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                                                                            EDIT & SAVE TO MASTER
                                                                                        </span>
                                                                                        <span className="text-[8px] opacity-70 font-medium">Changes will be saved to your reuseable library</span>
                                                                                    </div>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}

                                                            {/* 2. SIGHTSEEING */}
                                                            {row.details_json?.active_tab === 'sightseeing' && (() => {
                                                                const sightseeingSearch = row.details_json?._sightseeingSearch || '';
                                                                const addedSightseeings = (row.details_json?.sightseeing || []).filter(s => s && s.trim());
                                                                const updateDay = (patch) => {
                                                                    const copy = [...itineraryDays];
                                                                    copy[i].details_json = { ...copy[i].details_json, ...patch };
                                                                    setItineraryDays(copy);
                                                                };
                                                                const currentDest = getDestinationForDay(i);
                                                                const allowedSightseeings = currentDest && currentDest !== "---"
                                                                    ? sightseeingMasters.filter(sm =>
                                                                        (sm.city && sm.city.trim().toLowerCase() === currentDest.trim().toLowerCase()) ||
                                                                        (sm.destination_name && sm.destination_name.trim().toLowerCase() === currentDest.trim().toLowerCase())
                                                                    )
                                                                    : sightseeingMasters;

                                                                const filteredSightseeings = sightseeingSearch
                                                                    ? allowedSightseeings.filter(sm =>
                                                                        sm.name?.toLowerCase().includes(sightseeingSearch.trim().toLowerCase()) ||
                                                                        sm.city?.toLowerCase().includes(sightseeingSearch.trim().toLowerCase())
                                                                    ) : [];
                                                                return (
                                                                    <div className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                        {/* Main sightseeing panel */}
                                                                        <div className="flex-1 space-y-3">
                                                                            {/* Search */}
                                                                            <div>
                                                                                <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search sightseeing from the database</p>
                                                                                <SearchableSelect
                                                                                    options={allowedSightseeings.map(sm => ({
                                                                                        value: sm.name,
                                                                                        label: sm.name,
                                                                                        subtitle: sm.city
                                                                                    }))}
                                                                                    value=""
                                                                                    onChange={(val) => {
                                                                                        const copy = [...itineraryDays];
                                                                                        if (!copy[i].details_json.sightseeing) copy[i].details_json.sightseeing = [];
                                                                                        if (!copy[i].details_json.sightseeing.includes(val)) {
                                                                                            copy[i].details_json.sightseeing.push(val);
                                                                                        }
                                                                                        setItineraryDays(copy);
                                                                                    }}
                                                                                    placeholder="🔍 Search for sightseeing in masters..."
                                                                                />
                                                                            </div>

                                                                            {/* Added sightseeings or empty state */}
                                                                            {addedSightseeings.length === 0 ? (
                                                                                <div className="border-2 border-dashed border-gray-200 rounded-sm h-24 flex items-center justify-center">
                                                                                    <p className="text-[11px] text-gray-400">No Sightseeing added</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="space-y-2">
                                                                                    {addedSightseeings.map((s, sIdx) => {
                                                                                        const masterData = sightseeingMasters.find(sm => sm.name === s);
                                                                                        return (
                                                                                            <div key={sIdx} className="border border-gray-200 rounded-sm bg-white p-3 flex gap-3 group relative">
                                                                                                {masterData?.image && (
                                                                                                    <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 bg-gray-100">
                                                                                                        <img src={masterData.image.startsWith('http') ? masterData.image.replace('http://localhost:8000', '').replace('http://127.0.0.1:8000', '') : masterData.image} alt={s} className="w-full h-full object-cover" />
                                                                                                    </div>
                                                                                                )}
                                                                                                <div className="flex-1 min-w-0">
                                                                                                    {masterData?.city && <p className="text-[9px] text-gray-400">{masterData.city}</p>}
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <p className="text-[11px] font-bold text-gray-900">{s}</p>
                                                                                                        {masterData?.latitude && masterData?.longitude && (
                                                                                                            <a
                                                                                                                href={`https://maps.google.com/?q=${masterData.latitude},${masterData.longitude}`}
                                                                                                                target="_blank"
                                                                                                                rel="noopener noreferrer"
                                                                                                                className="text-[9px] text-blue-500 hover:underline"
                                                                                                            >View on Map</a>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    {masterData?.address && <p className="text-[9px] text-gray-500">{masterData.address}</p>}
                                                                                                    {masterData?.description && (
                                                                                                        <p className="text-[9px] text-gray-500 line-clamp-2 mt-0.5">{masterData.description}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        const copy = [...itineraryDays];
                                                                                                        copy[i].details_json.sightseeing = copy[i].details_json.sightseeing.filter((_, idx) => idx !== sIdx);
                                                                                                        setItineraryDays(copy);
                                                                                                    }}
                                                                                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                                                >
                                                                                                    <X size={12} />
                                                                                                </button>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Add New Sightseeing panel */}
                                                                        <div className="w-56 shrink-0">
                                                                            {sightseeingPanelDayIndex === i ? (
                                                                                <div className="border border-gray-200 rounded-sm p-3 bg-gray-50/50 space-y-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <h4 className="text-[11px] font-bold text-gray-800">Add New Sightseeing</h4>
                                                                                        <button type="button" onClick={() => setSightseeingPanelDayIndex(null)} className="text-gray-400 hover:text-gray-600"><X size={12} /></button>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Name of the Sightseeing</p>
                                                                                        <input type="text" value={newSightseeingForm.name} onChange={e => setNewSightseeingForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter name" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Sightseeing Description <span className="text-gray-400 font-normal">(maximum 3000 characters)</span></p>
                                                                                        <textarea value={newSightseeingForm.description} onChange={e => setNewSightseeingForm(p => ({ ...p, description: e.target.value }))} maxLength={3000} placeholder="Enter description" rows={3} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 resize-none" />
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 gap-1.5">
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Address <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                            <input type="text" value={newSightseeingForm.address} onChange={e => setNewSightseeingForm(p => ({ ...p, address: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">City (Country)</p>
                                                                                            <select value={newSightseeingForm.city} onChange={e => setNewSightseeingForm(p => ({ ...p, city: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                                                                                <option value="">Select a city...</option>
                                                                                                {/* Only show current destination or destinations in the package */}
                                                                                                {[...new Set([getDestinationForDay(i), ...packageDestinations.map(d => d.destination)])].filter(d => d && d !== "---").map(d => (
                                                                                                    <option key={d} value={d}>{d}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 gap-1.5">
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Duration</p>
                                                                                            <input type="text" value={newSightseeingForm.duration} onChange={e => setNewSightseeingForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 4 Hours" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Entry Price</p>
                                                                                            <input type="number" value={newSightseeingForm.price} onChange={e => setNewSightseeingForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Map Link</p>
                                                                                        <input type="text" value={newSightseeingForm.map_link} onChange={e => setNewSightseeingForm(p => ({ ...p, map_link: e.target.value }))} placeholder="https://maps.google.com/..." className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5 flex items-center gap-1">Latitude & Longitude <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                        <div className="flex gap-1">
                                                                                            <input type="text" value={newSightseeingForm.latitude} onChange={e => setNewSightseeingForm(p => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                            <input type="text" value={newSightseeingForm.longitude} onChange={e => setNewSightseeingForm(p => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Sightseeing Images <span className="text-gray-400 font-normal">(Add up to 5 images with max file size of 1 MB)</span></p>
                                                                                        <div className="border border-dashed border-gray-300 rounded-sm p-2 flex gap-1.5 flex-wrap min-h-[44px]">
                                                                                            <label className="w-[46px] h-[40px] border border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 text-[9px] text-center">
                                                                                                <span className="text-sm leading-none">+</span>
                                                                                                <span>Add{<br />}Images</span>
                                                                                                <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                                                                                    const files = Array.from(e.target.files).slice(0, 5);
                                                                                                    setNewSightseeingForm(p => ({ ...p, images: [...(p.images || []), ...files].slice(0, 5) }));
                                                                                                }} />
                                                                                            </label>
                                                                                            {(newSightseeingForm.images || []).map((img, imgIdx) => (
                                                                                                <div key={imgIdx} className="relative w-[46px] h-[40px]">
                                                                                                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded border border-gray-200" />
                                                                                                    <button type="button" onClick={() => setNewSightseeingForm(p => ({ ...p, images: p.images.filter((_, j) => j !== imgIdx) }))} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">×</button>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={async () => {
                                                                                            if (!newSightseeingForm.name.trim()) { alert('Please enter the sightseeing name.'); return; }
                                                                                            try {
                                                                                                // Find the destination object to get its ID
                                                                                                const destObj = destinations.find(d => d.name === newSightseeingForm.city);
                                                                                                if (!destObj) {
                                                                                                    alert('Please select a valid city from the list.');
                                                                                                    return;
                                                                                                }

                                                                                                const fd = new FormData();
                                                                                                fd.append('destination', destObj.id);
                                                                                                fd.append('name', newSightseeingForm.name);
                                                                                                fd.append('description', newSightseeingForm.description);
                                                                                                fd.append('address', newSightseeingForm.address);
                                                                                                fd.append('city', newSightseeingForm.city);
                                                                                                fd.append('duration', newSightseeingForm.duration);
                                                                                                fd.append('price', newSightseeingForm.price || 0);
                                                                                                fd.append('map_link', newSightseeingForm.map_link);

                                                                                                // Handle potentially large or invalid lat/long values
                                                                                                if (newSightseeingForm.latitude && !isNaN(newSightseeingForm.latitude)) {
                                                                                                    fd.append('latitude', newSightseeingForm.latitude);
                                                                                                }
                                                                                                if (newSightseeingForm.longitude && !isNaN(newSightseeingForm.longitude)) {
                                                                                                    fd.append('longitude', newSightseeingForm.longitude);
                                                                                                }

                                                                                                if (newSightseeingForm.images && newSightseeingForm.images.length > 0) {
                                                                                                    fd.append('image', newSightseeingForm.images[0]);
                                                                                                    newSightseeingForm.images.forEach(img => {
                                                                                                        fd.append('gallery_images', img);
                                                                                                    });
                                                                                                }
                                                                                                const res = await axios.post('/api/sightseeing-masters/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                                                                setSightseeingMasters(prev => [...prev, res.data]);
                                                                                                const copy = [...itineraryDays];
                                                                                                copy[i].details_json.sightseeing = [res.data.name];
                                                                                                setItineraryDays(copy);
                                                                                                setNewSightseeingForm({
                                                                                                    name: '', description: '', address: '', city: '', duration: '', price: '', map_link: '',
                                                                                                    latitude: '', longitude: '', images: []
                                                                                                });
                                                                                                setSightseeingPanelDayIndex(null);
                                                                                            } catch (err) {
                                                                                                console.error('Error saving sightseeing:', err.response?.data || err);
                                                                                                const errorMsg = err.response?.data
                                                                                                    ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
                                                                                                    : err.message;
                                                                                                alert(`Failed to save sightseeing.\n${errorMsg}`);
                                                                                            }
                                                                                        }}
                                                                                        className="w-full py-1.5 bg-[#14532d] text-white text-[10px] font-bold rounded-sm hover:bg-green-800 transition-colors"
                                                                                    >Add</button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => { setSightseeingPanelDayIndex(i); setNewSightseeingForm({ name: '', description: '', address: '', city: getDestinationForDay(i) !== '---' ? getDestinationForDay(i) : '', latitude: '', longitude: '', images: [] }); }}
                                                                                    className="w-full py-2 border border-dashed border-orange-300 text-orange-500 text-[10px] font-medium rounded-sm hover:bg-orange-50 transition-colors"
                                                                                >+ Add New Sightseeing</button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}


                                                            {/* 4. ACCOMMODATION */}
                                                            {row.details_json?.active_tab === 'accommodation' && (() => {
                                                                const accs = row.details_json?.accommodations || [];
                                                                const searchQ = row.details_json?._accSearch || '';
                                                                const showForm = row.details_json?._showNewAcc || false;
                                                                const updateDay = (patch) => {
                                                                    const copy = [...itineraryDays];
                                                                    copy[i].details_json = { ...copy[i].details_json, ...patch };
                                                                    setItineraryDays(copy);
                                                                };

                                                                const currentDest = getDestinationForDay(i);
                                                                const allowedHotels = currentDest && currentDest !== "---"
                                                                    ? hotelMasters.filter(h =>
                                                                        (h.city && h.city.trim().toLowerCase() === currentDest.trim().toLowerCase()) ||
                                                                        (h.destination_name && h.destination_name.trim().toLowerCase() === currentDest.trim().toLowerCase())
                                                                    )
                                                                    : hotelMasters;

                                                                const filteredHotels = searchQ
                                                                    ? allowedHotels.filter(h =>
                                                                        h.name?.toLowerCase().includes(searchQ.trim().toLowerCase()) ||
                                                                        h.city?.toLowerCase().includes(searchQ.trim().toLowerCase())
                                                                    ) : [];
                                                                return (
                                                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                        {(() => {
                                                                            // Check if this day is covered by a stay starting on a previous day
                                                                            const coveringStay = (() => {
                                                                                for (let j = i - 1; j >= 0; j--) {
                                                                                    const prevDay = itineraryDays[j];
                                                                                    if (getDestinationForDay(j) !== getDestinationForDay(i)) break;
                                                                                    const n = parseInt(prevDay.details_json?.accommodation_stay_nights || 1);
                                                                                    // If the previous day's stay spans across today
                                                                                    if (j + n > i) return { originDay: j + 1, hotel: prevDay.details_json?.accommodations?.[0] };
                                                                                }
                                                                                return null;
                                                                            })();

                                                                            if (coveringStay) {
                                                                                const h = hotelMasters.find(hm => hm.id === coveringStay.hotel?.hotelId);
                                                                                return (
                                                                                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex items-center justify-between mb-4 animate-in fade-in zoom-in duration-300">
                                                                                        <div className="flex items-center gap-4">
                                                                                            <div className="w-10 h-10 rounded-lg bg-white border border-amber-200 flex items-center justify-center shrink-0">
                                                                                                <Hotel size={18} className="text-amber-500" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                                                    <p className="text-[11px] font-black text-amber-900 leading-none">{h?.name || coveringStay.hotel?.hotelName || "Continued Stay"}</p>
                                                                                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-white px-1.5 py-0.5 rounded border border-amber-200">Part of Stay</span>
                                                                                                </div>
                                                                                                <p className="text-[9px] font-bold text-amber-600/70 uppercase tracking-wider">Stay continued from Day {coveringStay.originDay}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none mb-1">Accommodation</p>
                                                                                            <p className="text-[10px] font-black text-amber-900 uppercase">Controlled by Day {coveringStay.originDay}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }

                                                                            const destIdx = getDestIndexForDay(i);
                                                                            const destRow = destIdx !== -1 ? packageDestinations[destIdx] : null;
                                                                            if (!destRow) return null;

                                                                            // Calculate how many nights are left in this destination's stay
                                                                            let daysPassedInDest = 0;
                                                                            for (let k = 0; k < i; k++) {
                                                                                if (getDestIndexForDay(k) === destIdx) daysPassedInDest++;
                                                                            }
                                                                            const maxAllowed = Math.max(1, parseInt(destRow.nights || 0) - daysPassedInDest);

                                                                            return (
                                                                                <div className="flex flex-col items-end mb-2">
                                                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">{destRow.destination} Stay</p>
                                                                                    <div className="w-32">
                                                                                        <SearchableSelect
                                                                                            options={[...Array(maxAllowed)].map((_, n) => ({
                                                                                                value: String(n + 1),
                                                                                                label: `${n + 1} ${n + 1 === 1 ? 'Night' : 'Nights'}`
                                                                                            }))}
                                                                                            value={row.details_json?.accommodation_stay_nights || "1"}
                                                                                            onChange={(val) => {
                                                                                                const copy = [...itineraryDays];
                                                                                                copy[i].details_json.accommodation_stay_nights = val;
                                                                                                // Update propagation if hotel is already selected
                                                                                                const hotel = copy[i].details_json.accommodations?.[0];
                                                                                                if (hotel) {
                                                                                                    const n = parseInt(val);
                                                                                                    const dest = getDestinationForDay(i);
                                                                                                    for (let j = i + 1; j < copy.length; j++) {
                                                                                                        if (getDestinationForDay(j) === dest) {
                                                                                                            if (j < i + n) {
                                                                                                                copy[j].details_json.accommodations = [{ ...hotel, is_inherited: true }];
                                                                                                            } else if (copy[j].details_json.accommodations?.[0]?.is_inherited) {
                                                                                                                // Clear if it was inherited from this stay specifically
                                                                                                                copy[j].details_json.accommodations = [];
                                                                                                            }
                                                                                                        } else break;
                                                                                                    }
                                                                                                }
                                                                                                setItineraryDays(copy);
                                                                                            }}
                                                                                            placeholder="Nights"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })()}
                                                                        <div className="flex gap-4">
                                                                            {/* Main accommodation panel */}
                                                                            <div className="flex-1 space-y-3">
                                                                                {/* Search */}
                                                                                <div>
                                                                                    <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search accommodation from the database</p>
                                                                                    <SearchableSelect
                                                                                        options={allowedHotels.map(h => ({
                                                                                            value: h.id.toString(),
                                                                                            label: h.name,
                                                                                            subtitle: h.city
                                                                                        }))}
                                                                                        value={accs?.[0]?.hotelId?.toString() || ""}
                                                                                        onChange={(val) => {
                                                                                            const h = hotelMasters.find(hm => hm.id === parseInt(val));
                                                                                            if (!h) return;
                                                                                            const copy = [...itineraryDays];
                                                                                            const dest = getDestinationForDay(i);
                                                                                            const n_pick = parseInt(copy[i].details_json?.accommodation_stay_nights || 1);
                                                                                            for (let k = i; k < i + n_pick && k < copy.length; k++) {
                                                                                                if (getDestinationForDay(k) === dest) {
                                                                                                    if (!copy[k].details_json) copy[k].details_json = { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] };
                                                                                                    copy[k].details_json.accommodations = [{ hotelId: h.id, hotelName: h.name, is_inherited: k > i }];
                                                                                                } else break;
                                                                                            }
                                                                                            setItineraryDays(copy);
                                                                                        }}
                                                                                        placeholder="🔍 Search for accommodation in masters..."
                                                                                    />
                                                                                </div>

                                                                                {/* Added accommodations or empty state */}
                                                                                {accs.filter(acc => {
                                                                                    const h = hotelMasters.find(hm => hm.id === acc.hotelId);
                                                                                    if (!h) return true;
                                                                                    const currentDest = getDestinationForDay(i);
                                                                                    if (!currentDest || currentDest === "---") return true;
                                                                                    return (h.city && h.city.trim().toLowerCase() === currentDest.trim().toLowerCase()) ||
                                                                                        (h.destination_name && h.destination_name.trim().toLowerCase() === currentDest.trim().toLowerCase());
                                                                                }).length === 0 ? (
                                                                                    <div className="border-2 border-dashed border-gray-200 rounded-sm h-24 flex items-center justify-center">
                                                                                        <p className="text-[11px] text-gray-400">No Accommodation added</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="space-y-2">
                                                                                        {accs.filter(acc => {
                                                                                            const h = hotelMasters.find(hm => hm.id === acc.hotelId);
                                                                                            if (!h) return true;
                                                                                            const currentDest = getDestinationForDay(i);
                                                                                            if (!currentDest || currentDest === "---") return true;
                                                                                            return (h.city && h.city.trim().toLowerCase() === currentDest.trim().toLowerCase()) ||
                                                                                                (h.destination_name && h.destination_name.trim().toLowerCase() === currentDest.trim().toLowerCase());
                                                                                        }).map((acc, accIdx) => {
                                                                                            const h = hotelMasters.find(hm => hm.id === acc.hotelId);
                                                                                            return (
                                                                                                <div key={accIdx} className="border border-gray-200 rounded-sm bg-white p-3 flex gap-3 group relative">
                                                                                                    {(h?.image || (h?.images && h.images.length > 0)) && (
                                                                                                        <div className="w-16 h-16 shrink-0 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                                                                                                            <img src={h?.image ? getImageUrl(h.image) : (h?.images?.[0]?.image ? getImageUrl(h.images[0].image) : '/placeholder.png')} alt={h?.name} className="w-full h-full object-cover" />
                                                                                                        </div>
                                                                                                    )}
                                                                                                    <div className="flex-1 min-w-0">
                                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                                            {acc.is_inherited ? (
                                                                                                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Continuing Stay</span>
                                                                                                            ) : (
                                                                                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Stay Start / Check-in</span>
                                                                                                            )}
                                                                                                            {h?.city && <p className="text-[9px] text-gray-400 italic font-medium">{h.city}</p>}
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-2">
                                                                                                            <p className="text-[11px] font-bold text-gray-900 line-clamp-1">{acc.hotelName}</p>
                                                                                                            {h?.stars && (
                                                                                                                <div className="flex items-center">
                                                                                                                    {[...Array(Number(h.stars))].map((_, starI) => (
                                                                                                                        <Star key={starI} size={8} className="fill-yellow-400 text-yellow-400" />
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                        {h?.address && <p className="text-[9px] text-gray-400 line-clamp-1 truncate">{h.address}</p>}
                                                                                                    </div>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() => {
                                                                                                            const copy = [...itineraryDays];
                                                                                                            const dest = getDestinationForDay(i);
                                                                                                            const hotelIdToRemove = acc.hotelId;
                                                                                                            // Remove from connected days based on nights
                                                                                                            const n_rem = parseInt(copy[i].details_json?.accommodation_stay_nights || 1);
                                                                                                            for (let j_rem = i; j_rem < i + n_rem && j_rem < copy.length; j_rem++) {
                                                                                                                if (getDestinationForDay(j_rem) === dest && copy[j_rem].details_json?.accommodations) {
                                                                                                                    copy[j_rem].details_json.accommodations = copy[j_rem].details_json.accommodations.filter(a => a.hotelId !== hotelIdToRemove);
                                                                                                                } else break;
                                                                                                            }
                                                                                                            setItineraryDays(copy);
                                                                                                        }}
                                                                                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                                                    >
                                                                                                        <X size={12} />
                                                                                                    </button>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Add New Accommodation Form panel */}
                                                                            <div className="w-56 shrink-0">
                                                                                {showForm ? (
                                                                                    <div className="border border-gray-200 rounded-sm p-3 bg-gray-50/50 space-y-2">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <h4 className="text-[11px] font-bold text-gray-800">Add New Accommodation</h4>
                                                                                            <button type="button" onClick={() => updateDay({ _showNewAcc: false })} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={12} /></button>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Name of the Accommodation</p>
                                                                                            <input type="text" value={newHotelForm.name} onChange={e => setNewHotelForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter name" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Star Category</p>
                                                                                            <select value={newHotelForm.stars} onChange={e => setNewHotelForm(p => ({ ...p, stars: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                                                                                <option value="">Select</option>
                                                                                                {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star</option>)}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Address <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                            <input type="text" value={newHotelForm.address} onChange={e => setNewHotelForm(p => ({ ...p, address: e.target.value }))} placeholder="Enter address" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">City (Country)</p>
                                                                                            <select value={newHotelForm.city} onChange={e => setNewHotelForm(p => ({ ...p, city: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                                                                                <option value="">Select a city...</option>
                                                                                                {/* Only show current destination or destinations in the package */}
                                                                                                {[...new Set([getDestinationForDay(i), ...packageDestinations.map(d => d.destination)])].filter(d => d && d !== "---").map(d => (
                                                                                                    <option key={d} value={d}>{d}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5 flex items-center gap-1">Latitude & Longitude <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                            <div className="flex gap-1">
                                                                                                <input type="text" value={newHotelForm.latitude} onChange={e => setNewHotelForm(p => ({ ...p, latitude: e.target.value }))} placeholder="Lat" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                                <input type="text" value={newHotelForm.longitude} onChange={e => setNewHotelForm(p => ({ ...p, longitude: e.target.value }))} placeholder="Long" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Accommodation Images <span className="text-gray-400 font-normal">(Up to 5)</span></p>
                                                                                            <div className="border border-dashed border-gray-300 rounded-sm p-2 flex gap-1.5 flex-wrap min-h-[44px]">
                                                                                                <label className="w-[46px] h-[40px] border border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 text-[9px] text-center">
                                                                                                    <span className="text-sm leading-none">+</span>
                                                                                                    <span>Add</span>
                                                                                                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                                                                                        const files = Array.from(e.target.files).slice(0, 5);
                                                                                                        setNewHotelForm(p => ({ ...p, images: [...(p.images || []), ...files].slice(0, 5) }));
                                                                                                    }} />
                                                                                                </label>
                                                                                                {(newHotelForm.images || []).map((img, idx) => (
                                                                                                    <div key={idx} className="relative w-[46px] h-[40px]">
                                                                                                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded border border-gray-200" />
                                                                                                        <button type="button" onClick={() => setNewHotelForm(p => ({ ...p, images: p.images.filter((_, j) => j !== idx) }))} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">×</button>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleSaveNewHotel(i)}
                                                                                            className="w-full py-1.5 bg-[#14532d] text-white text-[10px] font-bold rounded-sm hover:bg-green-800 transition-colors"
                                                                                        >Save Accommodation</button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            updateDay({ _showNewAcc: true });
                                                                                            setNewHotelForm({ name: '', stars: '3', address: '', city: getDestinationForDay(i) !== '---' ? getDestinationForDay(i) : '', website: '', email: '', latitude: '', longitude: '', images: [] });
                                                                                        }}
                                                                                        className="w-full py-2 border border-dashed border-orange-300 text-orange-500 text-[10px] font-medium rounded-sm hover:bg-orange-50 transition-colors"
                                                                                    >+ Add New Accommodation</button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}

                                                            {/* 5. VEHICLE */}
                                                            {row.details_json?.active_tab === 'vehicle' && (() => {
                                                                const vd = row.details_json?.vehicle_data || {};
                                                                const vehicleMode = vd.mode || 'with_driver';
                                                                const updateVD = (patch) => {
                                                                    const copy = [...itineraryDays];
                                                                    copy[i].details_json.vehicle_data = { ...vd, ...patch };
                                                                    setItineraryDays(copy);
                                                                };
                                                                const isSelf = vehicleMode === 'self_drive';
                                                                return (
                                                                    <div className="bg-white p-0">
                                                                        {/* Header row */}
                                                                        <div className="mb-3">
                                                                            <h3 className="text-[13px] font-bold text-gray-900">Vehicle</h3>
                                                                        </div>
                                                                        {/* Radio buttons */}
                                                                        <div className="flex items-center gap-6 mb-3">
                                                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`vehicleMode_${i}`}
                                                                                    checked={!isSelf}
                                                                                    onChange={() => updateVD({ mode: 'with_driver' })}
                                                                                    className="w-3.5 h-3.5 accent-blue-500"
                                                                                />
                                                                                <span className="text-[11px] font-medium text-gray-700">Vehicle with Driver/ Chaffeur</span>
                                                                            </label>
                                                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`vehicleMode_${i}`}
                                                                                    checked={isSelf}
                                                                                    onChange={() => updateVD({ mode: 'self_drive' })}
                                                                                    className="w-3.5 h-3.5 accent-blue-500"
                                                                                />
                                                                                <span className="text-[11px] font-medium text-gray-700">Self Drive</span>
                                                                            </label>
                                                                        </div>
                                                                        {/* Sub-heading */}
                                                                        <p className="text-[11px] font-bold text-gray-800 mb-2">
                                                                            {isSelf ? 'Self Drive' : 'Vehicle with Driver/ Chaffeur'}
                                                                        </p>
                                                                        {/* Vehicle Type + No. of Vehicles */}
                                                                        <div className="grid grid-cols-[1fr_180px] gap-3 mb-2">
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Vehicle Type</p>
                                                                                <SearchableSelect
                                                                                    options={vehicleMasters.map(v => ({
                                                                                        value: v.name,
                                                                                        label: v.name,
                                                                                        subtitle: `${v.brand_name} • ${v.seating_capacity} Seats`
                                                                                    }))}
                                                                                    value={vd.vehicleType || ''}
                                                                                    onChange={val => updateVD({
                                                                                        vehicleType: val,
                                                                                        _vehicleDetails: vehicleMasters.find(v => v.name === val)
                                                                                    })}
                                                                                    placeholder="🔍 Select vehicle model..."
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">No. of Vehicles</p>
                                                                                <select
                                                                                    value={vd.noOfVehicles || '1'}
                                                                                    onChange={e => updateVD({ noOfVehicles: e.target.value })}
                                                                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400 bg-white"
                                                                                >
                                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        {/* Pick Up Date + Pick Up Location */}
                                                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Pick Up Date <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                <input
                                                                                    type="date"
                                                                                    value={vd.pickUpDate || ''}
                                                                                    onChange={e => updateVD({ pickUpDate: e.target.value })}
                                                                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Pick Up Location <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                <SearchableSelect
                                                                                    options={pickupPoints.map(p => ({
                                                                                        value: p.name,
                                                                                        label: p.name,
                                                                                        subtitle: p.city_name
                                                                                    }))}
                                                                                    value={vd.pickUpLocation || ''}
                                                                                    onChange={val => updateVD({ pickUpLocation: val })}
                                                                                    placeholder="🔍 Search pickup point..."
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Drop Off Date + Drop Off Location */}
                                                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Drop Off Date <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                <input
                                                                                    type="date"
                                                                                    value={vd.dropOffDate || ''}
                                                                                    onChange={e => updateVD({ dropOffDate: e.target.value })}
                                                                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Drop Off Location <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                <SearchableSelect
                                                                                    options={pickupPoints.map(p => ({
                                                                                        value: p.name,
                                                                                        label: p.name,
                                                                                        subtitle: p.city_name
                                                                                    }))}
                                                                                    value={vd.dropOffLocation || ''}
                                                                                    onChange={val => updateVD({ dropOffLocation: val })}
                                                                                    placeholder="🔍 Search drop point..."
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Vehicle Brand + Pick Up time + Drop off time */}
                                                                        <div className="grid grid-cols-3 gap-3">
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5">
                                                                                    Vehicle Brand <span className="text-sky-400 font-normal">(Optional)</span>
                                                                                </p>
                                                                                <SearchableSelect
                                                                                    options={vehicleBrands.map(b => ({ value: b.name, label: b.name }))}
                                                                                    value={vd.vehicleBrand || ''}
                                                                                    onChange={val => updateVD({ vehicleBrand: val })}
                                                                                    placeholder="Select Brand"
                                                                                    className="w-full"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5 flex items-center gap-1">
                                                                                    Pick Up time <span className="text-orange-400 text-[10px]">?</span> <span className="text-sky-400 font-normal">(Optional)</span>
                                                                                </p>
                                                                                <input
                                                                                    type="time"
                                                                                    value={vd.pickUpTime || ''}
                                                                                    onChange={e => updateVD({ pickUpTime: e.target.value })}
                                                                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-0.5 flex items-center gap-1">
                                                                                    Drop off time <span className="text-orange-400 text-[10px]">?</span> <span className="text-sky-400 font-normal">(Optional)</span>
                                                                                </p>
                                                                                <input
                                                                                    type="time"
                                                                                    value={vd.dropOffTime || ''}
                                                                                    onChange={e => updateVD({ dropOffTime: e.target.value })}
                                                                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Driver Selection */}
                                                                        {!isSelf && (
                                                                            <div className="mt-3">
                                                                                <p className="text-[10px] font-semibold text-gray-700 mb-1">Driver Name <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                <SearchableSelect
                                                                                    options={driverMasters.map(d => ({
                                                                                        value: d.id.toString(),
                                                                                        label: d.name,
                                                                                        subtitle: d.mobile_number
                                                                                    }))}
                                                                                    value={vd.driverId || ''}
                                                                                    onChange={val => {
                                                                                        const d = driverMasters.find(dm => dm.id.toString() === val);
                                                                                        updateVD({
                                                                                            driverId: val,
                                                                                            driverName: d?.name || ''
                                                                                        });
                                                                                    }}
                                                                                    placeholder="🔍 Select driver from masters..."
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const nextDay = itineraryDays.length + 1;
                                                    setItineraryDays([...itineraryDays, {
                                                        day: nextDay.toString(),
                                                        title: "",
                                                        description: "",
                                                        master_template: "",
                                                        image: null,
                                                        existing_image: null,
                                                        save_to_master: false,
                                                        details_json: { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] }
                                                    }]);
                                                }}
                                                className="w-full py-6 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#14532d]/40 hover:text-[#14532d] transition-all hover:bg-green-50 active:scale-[0.99] group"
                                            >
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-2xl mb-2 group-hover:scale-110 group-hover:bg-white shadow-sm transition-all">+</div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Discovery Day</span>
                                            </button>
                                        </div>
                                    </Section>








                                    {/* TRIP INFORMATION */}
                                    <Section title="Trip Information" active={activeSection === 'policy'}>
                                        <div className="space-y-6 max-w-5xl mx-auto">
                                            {/* Global Arrival & Departure Logistics */}
                                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ${!formData.with_flight ? 'opacity-30 blur-[1px] pointer-events-none select-none grayscale transition-all duration-500' : 'transition-all duration-300'}`}>
                                                {/* Arrival */}
                                                <div className="bg-white p-6 rounded-[2rem] border-2 border-blue-50 relative group shadow-sm">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-[12px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Plane size={16} className="rotate-45" /> Arrival Logistics
                                                        </h4>
                                                        <div className="flex bg-gray-50 p-1 rounded-xl border-2 border-gray-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, with_arrival: true })}
                                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.with_arrival ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                INCLUDED
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, with_arrival: false })}
                                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${!formData.with_arrival ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                EXCLUDED
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={!formData.with_arrival ? "opacity-30 blur-[1px] pointer-events-none select-none grayscale transition-all duration-500" : "transition-all duration-300 space-y-5"}>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <FormLabel label="Arrival City" optional />
                                                                <SearchableSelect
                                                                    options={[
                                                                        { value: "Any City", label: "Any City" },
                                                                        ...startingCities.map(city => ({ value: city.name, label: city.name }))
                                                                    ]}
                                                                    value={formData.arrival_city}
                                                                    onChange={(val) => setFormData(prev => ({ ...prev, arrival_city: val }))}
                                                                    placeholder="Select City"
                                                                    className="!py-1"
                                                                    error={errors.arrival_city}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <FormLabel label="No. of Nights" required />
                                                                <Input type="number" name="arrival_no_of_nights" value={formData.arrival_no_of_nights} onChange={handleInputChange} className="!py-1" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <FormLabel label="Date" optional />
                                                                    <Input type="date" name="arrival_date" value={formData.arrival_date} onChange={handleInputChange} className="!py-1 [&::-webkit-calendar-picker-indicator]:scale-75" error={errors.arrival_date} />
                                                                </div>
                                                                <div>
                                                                    <FormLabel label="Time" optional />
                                                                    <Input type="time" name="arrival_time" value={formData.arrival_time} onChange={handleInputChange} className="!py-1" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <FormLabel label="Airline" optional />
                                                                <SearchableSelect
                                                                    options={airlines.map(a => ({ value: a.name, label: a.name }))}
                                                                    value={formData.arrival_airline}
                                                                    onChange={(val) => setFormData(prev => ({ ...prev, arrival_airline: val }))}
                                                                    placeholder="Select Airline"
                                                                    className="!py-1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <FormLabel label="Flight No." optional />
                                                                <Input name="arrival_flight_no" value={formData.arrival_flight_no} onChange={handleInputChange} placeholder="e.g. EK501" className="!py-1" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Arrival Airport" optional />
                                                            <Input name="arrival_airport" value={formData.arrival_airport} onChange={handleInputChange} placeholder="Airport Name" className="!py-1" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Departure */}
                                                <div className="bg-white p-6 rounded-[2rem] border-2 border-indigo-50 relative group shadow-sm">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-[12px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Plane size={16} className="-rotate-45" /> Departure Logistics
                                                        </h4>
                                                        <div className="flex bg-gray-50 p-1 rounded-xl border-2 border-gray-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, with_departure: true })}
                                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${formData.with_departure ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                INCLUDED
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, with_departure: false })}
                                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${!formData.with_departure ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                EXCLUDED
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={!formData.with_departure ? "opacity-30 blur-[1px] pointer-events-none select-none grayscale transition-all duration-500" : "transition-all duration-300 space-y-5"}>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <FormLabel label="Departure City" optional />
                                                                <SearchableSelect
                                                                    options={[
                                                                        { value: "Any City", label: "Any City" },
                                                                        ...startingCities.map(city => ({ value: city.name, label: city.name }))
                                                                    ]}
                                                                    value={formData.departure_city}
                                                                    onChange={(val) => setFormData(prev => ({ ...prev, departure_city: val }))}
                                                                    placeholder="Select City"
                                                                    className="!py-1"
                                                                    error={errors.departure_city}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <FormLabel label="Date" optional />
                                                                    <Input type="date" name="departure_date" value={formData.departure_date} onChange={handleInputChange} className="!py-1 [&::-webkit-calendar-picker-indicator]:scale-75" error={errors.departure_date} />
                                                                </div>
                                                                <div>
                                                                    <FormLabel label="Time" optional />
                                                                    <Input type="time" name="departure_time" value={formData.departure_time} onChange={handleInputChange} className="!py-1" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <FormLabel label="Airline" optional />
                                                                <SearchableSelect
                                                                    options={airlines.map(a => ({ value: a.name, label: a.name }))}
                                                                    value={formData.departure_airline}
                                                                    onChange={(val) => setFormData(prev => ({ ...prev, departure_airline: val }))}
                                                                    placeholder="Select Airline"
                                                                    className="!py-1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <FormLabel label="Flight No." optional />
                                                                <Input name="departure_flight_no" value={formData.departure_flight_no} onChange={handleInputChange} placeholder="e.g. UA890" className="!py-1" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Departure Airport" optional />
                                                            <Input name="departure_airport" value={formData.departure_airport} onChange={handleInputChange} placeholder="Enter full airport name..." className="!py-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div>
                                                <h3 className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-1 flex items-center gap-2">
                                                    <FileText size={16} className="text-[#14532d]" /> Package Policy & Details
                                                </h3>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-6">Terms, conditions and coverage</p>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                    <div className="space-y-10">
                                                        <DynamicList
                                                            label="Inclusions"
                                                            items={inclusions}
                                                            setItems={setInclusions}
                                                            placeholder="e.g. Accommodation as per itinerary..."
                                                            required
                                                        />
                                                        <DynamicList
                                                            label="Exclusions"
                                                            items={exclusions}
                                                            setItems={setExclusions}
                                                            placeholder="e.g. Personal expenses, laundry etc."
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-10">
                                                        <DynamicList
                                                            label="Terms & Policy"
                                                            items={cancellationPolicies}
                                                            setItems={setCancellationPolicies}
                                                            placeholder="e.g. 30 days before departure - 25% charge"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Section>

                                    {/* NEXT STEP BUTTON HANDLER */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-[2rem]">
                                        {(() => {
                                            const currentIndex = navItems.findIndex(item => item.id === activeSection);
                                            return (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (currentIndex > 0) {
                                                                setActiveSection(navItems[currentIndex - 1].id);
                                                                document.querySelector('.flex-1.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }
                                                        }}
                                                        disabled={currentIndex === 0}
                                                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95'}`}
                                                    >
                                                        ← Previous Step
                                                    </button>

                                                    <div className="flex gap-2">
                                                        {navItems.map((item, i) => (
                                                            <div key={item.id} className={`h-1.5 rounded-full transition-all duration-500 ${activeSection === item.id ? 'w-8 bg-[#14532d]' : 'w-1.5 bg-gray-200'}`}></div>
                                                        ))}
                                                    </div>

                                                    {currentIndex < navItems.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveSection(navItems[currentIndex + 1].id);
                                                                document.querySelector('.flex-1.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2 rounded-xl bg-[#14532d] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/10 hover:scale-105 active:scale-95 transition-all"
                                                        >
                                                            Next Step →
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={handleSubmit}
                                                            type="button"
                                                            disabled={saving}
                                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2 rounded-xl bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
                                                        >
                                                            {saving ? "SAVING..." : "COMPLETE & SAVE"}
                                                        </button>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </form>
                            </div >
                        </div >
                    </div >
                </div >

                {/* Add New Accommodation Modal */}
                {
                    showHotelModal && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                            <div className="bg-white rounded-[1.5rem] w-full max-w-xl h-fit max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-widest leading-none">Add New Accommodation</h2>
                                    <button onClick={() => setShowHotelModal(false)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-outfit">
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="p-4 overflow-y-auto custom-scrollbar space-y-2.5 flex-1 min-h-0 text-left">
                                    <div className="grid grid-cols-12 gap-2.5">
                                        <div className="col-span-8">
                                            <FormLabel label="Name" required />
                                            <Input placeholder="Hotel name" value={newHotelForm.name} onChange={(e) => setNewHotelForm({ ...newHotelForm, name: e.target.value })} />
                                        </div>
                                        <div className="col-span-4">
                                            <FormLabel label="Stars" required />
                                            <select className="w-full bg-white border-2 border-gray-100 px-3 py-1.5 rounded-xl text-[11px] font-black outline-none focus:border-[#14532d] transition-all" value={newHotelForm.stars} onChange={(e) => setNewHotelForm({ ...newHotelForm, stars: Number(e.target.value) })}>
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <FormLabel label="City" required />
                                            <SearchableSelect
                                                options={destinations.map(d => ({ value: d.name, label: d.name }))}
                                                value={newHotelForm.city}
                                                onChange={(val) => setNewHotelForm({ ...newHotelForm, city: val })}
                                                placeholder="Select City"
                                            />
                                        </div>
                                        <div>
                                            <FormLabel label="Address" optional />
                                            <Input placeholder="Hotel address" value={newHotelForm.address} onChange={(e) => setNewHotelForm({ ...newHotelForm, address: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <FormLabel label="Phone" optional />
                                            <Input placeholder="Phone number" value={newHotelForm.phone} onChange={(e) => setNewHotelForm({ ...newHotelForm, phone: e.target.value })} />
                                        </div>
                                        <div>
                                            <FormLabel label="Website" optional />
                                            <Input placeholder="URL" value={newHotelForm.website} onChange={(e) => setNewHotelForm({ ...newHotelForm, website: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 gap-2.5">
                                        <div className="col-span-6">
                                            <FormLabel label="Email" optional />
                                            <Input placeholder="Email address" value={newHotelForm.email} onChange={(e) => setNewHotelForm({ ...newHotelForm, email: e.target.value })} />
                                        </div>
                                        <div className="col-span-3">
                                            <FormLabel label="Lat" optional />
                                            <Input placeholder="0.00" value={newHotelForm.latitude} onChange={(e) => setNewHotelForm({ ...newHotelForm, latitude: e.target.value })} />
                                        </div>
                                        <div className="col-span-3">
                                            <FormLabel label="Long" optional />
                                            <Input placeholder="0.00" value={newHotelForm.longitude} onChange={(e) => setNewHotelForm({ ...newHotelForm, longitude: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <FormLabel label="Images" optional />
                                        <div className="flex flex-wrap gap-2.5 min-h-[40px]">
                                            {newHotelForm.images && newHotelForm.images.map((img, idx) => (
                                                <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden group border-2 border-gray-100 shadow-sm animate-in zoom-in-50">
                                                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="Preview" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImgs = [...newHotelForm.images];
                                                            newImgs.splice(idx, 1);
                                                            setNewHotelForm({ ...newHotelForm, images: newImgs });
                                                        }}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} className="text-white" />
                                                    </button>
                                                    {idx === 0 && <div className="absolute top-0 left-0 bg-[#14532d] text-[5px] text-white font-black px-1 py-0.5 uppercase">Main</div>}
                                                </div>
                                            ))}
                                            <input type="file" id="hotel-image-upload-edit" className="hidden" multiple onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                setNewHotelForm({ ...newHotelForm, images: [...(newHotelForm.images || []), ...files] });
                                            }} />
                                            <label htmlFor="hotel-image-upload-edit" className="w-14 h-14 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-all cursor-pointer group">
                                                <Plus size={14} className="text-gray-300 group-hover:text-[#14532d] transition-colors" />
                                                <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Add</span>
                                            </label>
                                        </div>
                                        {newHotelForm.images?.length > 1 && (
                                            <p className="text-[7px] text-gray-400 font-bold italic uppercase tracking-wider">* Only the first image will be saved to masters</p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowHotelModal(false)} className="px-5 py-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-600 transition-all font-outfit">Cancel</button>
                                    <button type="button" onClick={handleSaveHotel} className="px-6 py-1.5 bg-[#14532d] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 hover:scale-105 active:scale-95 transition-all font-outfit">Save Hotel</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    );
};

export default HolidayPackageEdit;


