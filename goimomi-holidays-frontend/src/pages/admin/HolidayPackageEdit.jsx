import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";
import { X, MapPin, Calendar, Package, Image as ImageIcon, Plane, Hotel, Car, Info, IndianRupee, ClipboardList, Globe, Search, Plus, Star, Utensils, Camera, Bus, Bed, List, ListOrdered, PlayCircle } from "lucide-react";

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
    const [accommodations, setAccommodations] = useState([]);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelMasters, setHotelMasters] = useState([]);
    const [sightseeingMasters, setSightseeingMasters] = useState([]);
    const [mealMasters, setMealMasters] = useState([]);
    const [newHotelForm, setNewHotelForm] = useState({
        name: "", stars: "3", address: "", city: "", phone: "", website: "", email: "", latitude: "", longitude: "", images: []
    });
    const [vehicles, setVehicles] = useState([]);
    // New Sightseeing panel state
    const [newSightseeingForm, setNewSightseeingForm] = useState({ name: '', description: '', address: '', city: '', latitude: '', longitude: '', images: [] });
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
        with_flight: false,
        is_active: true,
        arrival_city: "",
        arrival_date: "",
        arrival_time: "",
        arrival_airport: "",
        departure_city: "",
        departure_date: "",
        departure_time: "",
        departure_airport: "",
        highlights: "",
    });

    // Previews for existing images to show if no new file selected
    const [headerPreview, setHeaderPreview] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);

    const [startingCities, setStartingCities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [itineraryMasters, setItineraryMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

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
                const [citiesRes, destRes, mastersRes, hotelMastersRes, sightseeingMastersRes, mealMastersRes, pkgRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/starting-cities/`),
                    axios.get(`${API_BASE_URL}/destinations/`),
                    axios.get(`${API_BASE_URL}/itinerary-masters/`),
                    axios.get(`${API_BASE_URL}/hotel-masters/`),
                    axios.get(`${API_BASE_URL}/sightseeing-masters/`),
                    axios.get(`${API_BASE_URL}/meal-masters/`),
                    axios.get(`${API_BASE_URL}/packages/${id}/`),
                ]);

                if (Array.isArray(citiesRes.data)) setStartingCities(citiesRes.data);
                if (Array.isArray(destRes.data)) setDestinations(destRes.data);
                if (Array.isArray(mastersRes.data)) setItineraryMasters(mastersRes.data);
                if (Array.isArray(hotelMastersRes.data)) setHotelMasters(hotelMastersRes.data);
                if (Array.isArray(sightseeingMastersRes.data)) setSightseeingMasters(sightseeingMastersRes.data);
                if (Array.isArray(mealMastersRes.data)) setMealMasters(mealMastersRes.data);

                // Populate Form Data
                const pkg = pkgRes.data;
                setFormData({
                    title: pkg.title || "",
                    description: pkg.description || "",
                    category: pkg.category || "",
                    starting_city: pkg.starting_city || "",
                    days: pkg.days?.toString() || "",
                    start_date: pkg.start_date || "",
                    group_size: pkg.group_size || 0,
                    offer_price: pkg.Offer_price?.toString() || "", // Note capitalization in model
                    price: pkg.price?.toString() || "",
                    header_image: null, // Keep null unless changing
                    card_image: null,
                    with_flight: pkg.with_flight || false,
                    is_active: pkg.is_active !== undefined ? pkg.is_active : true,
                    arrival_city: pkg.arrival_city || "",
                    arrival_date: pkg.arrival_date || "",
                    arrival_time: pkg.arrival_time || "",
                    arrival_airport: pkg.arrival_airport || "",
                    departure_city: pkg.departure_city || "",
                    departure_date: pkg.departure_date || "",
                    departure_time: pkg.departure_time || "",
                    departure_airport: pkg.departure_airport || "",
                    highlights: pkg.highlights && Array.isArray(pkg.highlights) ? pkg.highlights.map(h => h.text).join("\n") : "",
                });

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
                if (pkg.inclusions && Array.isArray(pkg.inclusions)) {
                    setInclusions(pkg.inclusions.map(i => i.text));
                }

                // Exclusions
                if (pkg.exclusions && Array.isArray(pkg.exclusions)) {
                    setExclusions(pkg.exclusions.map(e => e.text));
                }

                // Highlights
                if (pkg.highlights && Array.isArray(pkg.highlights)) {
                    setHighlights(pkg.highlights.map(h => h.text));
                }

                // Cancellation Policies
                if (pkg.cancellation_policies && Array.isArray(pkg.cancellation_policies)) {
                    setCancellationPolicies(pkg.cancellation_policies.map(c => c.text));
                }

                // Accommodations - NEW STRUCTURE
                const defaultRoom = { id: Date.now() + 1, type: "", meals: "", passengers: "", checkIn: "", checkOut: "", noOfRooms: "1" };
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

            const response = await axios.post(`${API_BASE_URL}/hotel-masters/`, formDataToSend);
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
                            day: i.toString(), title: "", description: "", master_template: "", image: null, save_to_master: false
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
            setFormData(prev => ({ ...prev, days: calculatedDays.toString() }));
        }
    }, [packageDestinations, loading]);


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
        const insertText = start === 0 || currentVal[start - 1] === '\n' ? '• ' : '\n• ';
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
            const res = await axios.post(`/api/hotel-masters/`, {
                name: newHotelForm.name, stars: newHotelForm.stars,
                address: newHotelForm.address, city: newHotelForm.city,
                website: newHotelForm.website, email: newHotelForm.email,
                latitude: newHotelForm.latitude, longitude: newHotelForm.longitude,
            });
            const savedHotel = res.data;
            setHotelMasters(prev => [...prev, savedHotel]);
            const copy = [...itineraryDays];
            if (!copy[dayIndex].details_json.accommodations) copy[dayIndex].details_json.accommodations = [];
            copy[dayIndex].details_json.accommodations.push({
                hotelId: savedHotel.id, hotelName: savedHotel.name,
                roomType: '', meals: '', noOfRooms: '1', checkIn: '', checkOut: '', passengers: ''
            });
            copy[dayIndex].details_json._showNewAcc = false;
            setItineraryDays(copy);
            setNewHotelForm({ name: '', stars: '3', address: '', city: '', phone: '', website: '', email: '', latitude: '', longitude: '', images: [] });
        } catch (err) {
            console.error('Error saving hotel:', err);
            alert('Failed to save accommodation. Please try again.');
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
        if (!formData.offer_price || parseFloat(formData.offer_price) <= 0) newErrors.offer_price = "Offer price must be greater than 0";

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
            setError("Please fix the errors in the form.");
            window.scrollTo(0, 0);
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
            formDataToSend.append("starting_city", formData.starting_city);
            // Ensure 'days' matches the actual number of itinerary rows
            formDataToSend.append("days", itineraryDays.length);
            if (formData.start_date) formDataToSend.append("start_date", formData.start_date);
            formDataToSend.append("group_size", formData.group_size);
            formDataToSend.append("Offer_price", formData.offer_price);
            if (formData.price) formDataToSend.append("price", formData.price);
            formDataToSend.append("with_flight", formData.with_flight);
            formDataToSend.append("is_active", formData.is_active);
            formDataToSend.append("arrival_city", formData.arrival_city);
            formDataToSend.append("arrival_date", formData.arrival_date);
            formDataToSend.append("arrival_time", formData.arrival_time);
            formDataToSend.append("arrival_airport", formData.arrival_airport);
            formDataToSend.append("departure_city", formData.departure_city);
            formDataToSend.append("departure_date", formData.departure_date);
            formDataToSend.append("departure_time", formData.departure_time);
            formDataToSend.append("departure_airport", formData.departure_airport);

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
                    // Combine hotel name and room details into a single string for the backend's 'text' field
                    const roomDetails = acc.rooms.map(r => {
                        let details = [];
                        if (r.type) details.push(r.type);
                        if (r.meals) details.push(`(${r.meals})`);
                        if (r.passengers) details.push(`for ${r.passengers}`);
                        if (r.checkIn && r.checkOut) details.push(`(${r.checkIn} to ${r.checkOut})`);
                        if (r.noOfRooms && r.noOfRooms !== "1") details.push(`${r.noOfRooms} rooms`);
                        return details.join(" ");
                    }).filter(Boolean).join(", ");
                    return `${acc.hotelName}${roomDetails ? ` - ${roomDetails}` : ''}`;
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
                setMessage("Holiday package updated successfully!");
                setErrors({});
                window.scrollTo(0, 0);
            }

            // After package is successfully updated, save marked itineraries to master
            for (let i = 0; i < itineraryDays.length; i++) {
                const day = itineraryDays[i];
                if (day.save_to_master && day.title) {
                    try {
                        const masterData = new FormData();
                        masterData.append("name", day.title);
                        masterData.append("title", day.title);
                        masterData.append("description", day.description);

                        // Get destination for this day to categorize master
                        const destName = getDestinationForDay(i);
                        const destObj = destinations.find(d => d.name === destName);
                        if (destObj) {
                            masterData.append("destination", destObj.id);
                        }

                        if (day.image) {
                            masterData.append("image", day.image);
                        }

                        if (day.details_json) {
                            masterData.append("details_json", JSON.stringify(day.details_json));
                        }

                        await axios.post(`${API_BASE_URL}/itinerary-masters/`, masterData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });
                        console.log(`Saved day ${i + 1} to master as ${day.master_name}`);
                    } catch (mErr) {
                        console.error(`Error saving day ${i + 1} to master:`, mErr);
                    }
                }
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
                copy[index].title = template.title || "";
                copy[index].description = template.description || "";
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
        <div className="flex bg-[#fcfdfc] h-screen overflow-hidden">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                {/* Action Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-3.5 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tighter">Edit Holiday Package</h1>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                            <span className="text-green-500">Inventory</span> / <span>Holidays</span> / <span className="text-gray-900">{formData.title || "Package"}</span>
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

                <div className="flex-1 flex h-full overflow-hidden relative bg-[#fcfdfc]">
                    {/* Internal Navigation Sidebar */}
                    <div className="w-48 bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar flex flex-col p-3 shrink-0">
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
                    <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar bg-[#fcfdfc]">
                        <div className="max-w-4xl mx-auto pb-12">
                            {/* Messages */}
                            {message && (
                                <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 text-[#14532d] rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="bg-green-100 p-2 rounded-full">✅</div>
                                    <p className="font-bold text-xs uppercase tracking-wider">{message}</p>
                                </div>
                            )}
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
                                                        placeholder="Where the trip starts..."
                                                    />
                                                    {errors.starting_city && <p className="text-red-500 text-[9px] font-bold mt-1 flex items-center gap-1">⚠ {errors.starting_city}</p>}
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
                                                        placeholder="Where the trip ends..."
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
                                                    <div className={`aspect-[21/9] w-full bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d] transition-all cursor-pointer`}>
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
                                                    <div className={`aspect-[4/3] w-full bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d] transition-all cursor-pointer`}>
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
                                                {errors.description && <p className="text-red-500 text-[9px] font-bold mt-1.5 flex items-center gap-1">⚠ {errors.description}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <FormLabel label="Package Category" required />
                                                    <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleInputChange}
                                                        className={`bg-white border-2 ${errors.category ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'} px-4 py-2.5 rounded-xl w-full text-gray-800 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] hover:border-gray-200 cursor-pointer`}
                                                    >
                                                        <option value="">Select Category</option>
                                                        <option value="Domestic">Domestic</option>
                                                        <option value="International">International</option>
                                                        <option value="Umrah">Umrah</option>
                                                    </select>
                                                </div>

                                                <div className="flex gap-6">
                                                    <div className="flex-1">
                                                        <FormLabel label="Flight Inclusion" />
                                                        <div className="flex bg-white p-1 rounded-xl border-2 border-gray-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, with_flight: true })}
                                                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${formData.with_flight ? 'bg-[#14532d] text-white shadow-lg shadow-green-900/10' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                WITH FLIGHT
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, with_flight: false })}
                                                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${!formData.with_flight ? 'bg-red-500 text-white shadow-lg shadow-red-900/10' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                NO FLIGHT
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <FormLabel label="Package Status" />
                                                        <div className="flex bg-white p-1 rounded-xl border-2 border-gray-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, is_active: true })}
                                                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${formData.is_active ? 'bg-green-500 text-white shadow-lg shadow-green-900/10' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                ACTIVE
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, is_active: false })}
                                                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${!formData.is_active ? 'bg-gray-400 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                HIDDEN
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Trip Highlights Integrated into Overview */}
                                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-6">
                                                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                                                    <div>
                                                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">Trip Highlights</h3>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Core experience identifiers</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => addRow(setHighlights, "")}
                                                        className="bg-[#14532d] text-white px-4 py-2 rounded-xl text-[9px] font-black shadow-lg shadow-green-900/10 active:scale-95 transition-all hover:bg-black uppercase tracking-widest"
                                                    >
                                                        + ADD HIGHLIGHT
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                                    {highlights.map((h, i) => (
                                                        <div key={i} className="flex gap-3 items-center group animate-in slide-in-from-right-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 group-hover:scale-150 transition-all shadow-lg shadow-green-500/20"></div>
                                                            <div className="flex-1">
                                                                <Input
                                                                    value={h}
                                                                    onChange={(e) => {
                                                                        const copy = [...highlights];
                                                                        copy[i] = e.target.value;
                                                                        setHighlights(copy);
                                                                    }}
                                                                    placeholder="e.g. Traditional Malay Dinner..."
                                                                    className="!bg-gray-50/30 !border-transparent focus:!bg-white focus:!border-green-100 !py-2 !text-[11px] !rounded-2xl"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRow(setHighlights, i)}
                                                                className="text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>


                                        </div>
                                    </div>


                                </Section>



                                {/* LOCATION DETAILS */}
                                <Section title="Arrival & Departure" active={activeSection === 'location'}>
                                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div>
                                                            <FormLabel label="Tour Route" />
                                                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Group nights by destination</p>
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
                                                            <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm group animate-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                                <div className="flex-1">
                                                                    <SearchableSelect
                                                                        options={destinations.map(d => ({ value: d.name, label: d.name, subtitle: d.country || d.region || '' }))}
                                                                        value={row.destination}
                                                                        onChange={(val) => {
                                                                            const copy = [...packageDestinations];
                                                                            copy[i].destination = val;
                                                                            setPackageDestinations(copy);
                                                                        }}
                                                                        placeholder="Select City..."
                                                                    />
                                                                </div>
                                                                <div className="w-28">
                                                                    <select
                                                                        value={row.nights}
                                                                        onChange={(e) => {
                                                                            const copy = [...packageDestinations];
                                                                            copy[i].nights = parseInt(e.target.value);
                                                                            setPackageDestinations(copy);
                                                                        }}
                                                                        className="w-full bg-gray-50/50 border-2 border-transparent px-3 py-2.5 rounded-xl text-gray-900 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-[#14532d] transition-all cursor-pointer appearance-none text-center"
                                                                    >
                                                                        {[...Array(21)].map((_, n) => (
                                                                            <option key={n + 1} value={n + 1}>{n + 1} {n + 1 === 1 ? 'Night' : 'Nights'}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (packageDestinations.length > 1) {
                                                                            removeRow(setPackageDestinations, i);
                                                                        }
                                                                    }}
                                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${packageDestinations.length > 1 ? 'hover:bg-red-50 text-red-400' : 'text-gray-100 pointer-events-none'}`}
                                                                    disabled={packageDestinations.length <= 1}
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm self-start">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-1.5 h-4 bg-[#14532d] rounded-full"></div>
                                                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Route Summary</h3>
                                                </div>
                                                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-dashed-green">
                                                    <div className="relative">
                                                        <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-[#14532d] ring-4 ring-green-50"></div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Departure</p>
                                                        <p className="text-sm font-black text-gray-900">{formData.starting_city || "---"}</p>
                                                    </div>
                                                    {packageDestinations.slice(0, 3).map((dest, i) => (
                                                        <div key={i} className="relative">
                                                            <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full border-2 border-gray-200 bg-white"></div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Night {i + 1}</p>
                                                            <p className="text-sm font-black text-gray-900">{dest.destination || "---"}</p>
                                                        </div>
                                                    ))}
                                                    {packageDestinations.length > 3 && (
                                                        <p className="text-[10px] font-bold text-[#14532d]">+{packageDestinations.length - 3} More Nights</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrival & Departure Flight/Transfer Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 mt-8 border-t border-gray-200">
                                            {/* Arrival */}
                                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                    <Plane size={14} className="rotate-45" /> Arrival Logistics
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <FormLabel label="To (Destination)" />
                                                            <SearchableSelect
                                                                options={destinations.map(d => ({ value: d.name, label: d.name }))}
                                                                value={formData.arrival_city}
                                                                onChange={(val) => setFormData(prev => ({ ...prev, arrival_city: val }))}
                                                                placeholder="e.g. Singapore"
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Date" />
                                                            <Input type="date" name="arrival_date" value={formData.arrival_date} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <FormLabel label="Time" optional />
                                                            <Input type="time" name="arrival_time" value={formData.arrival_time} onChange={handleInputChange} />
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Airport" optional />
                                                            <Input name="arrival_airport" value={formData.arrival_airport} onChange={handleInputChange} placeholder="Enter Airport" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Departure */}
                                            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                    <Plane size={14} className="-rotate-45" /> Departure Logistics
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <FormLabel label="To (From City)" />
                                                            <SearchableSelect
                                                                options={destinations.map(d => ({ value: d.name, label: d.name }))}
                                                                value={formData.departure_city}
                                                                onChange={(val) => setFormData(prev => ({ ...prev, departure_city: val }))}
                                                                placeholder="e.g. Maldives"
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Date" />
                                                            <Input type="date" name="departure_date" value={formData.departure_date} onChange={handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <FormLabel label="Time" optional />
                                                            <Input type="time" name="departure_time" value={formData.departure_time} onChange={handleInputChange} />
                                                        </div>
                                                        <div>
                                                            <FormLabel label="Airport" optional />
                                                            <Input name="departure_airport" value={formData.departure_airport} onChange={handleInputChange} placeholder="Enter Airport" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                {/* PRICING */}
                                <Section title="Pricing & Availability" active={activeSection === 'pricing'}>
                                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1 h-4 bg-[#14532d] rounded-full"></div>
                                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Settings</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <FormLabel label="Offer Price" required />
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                                            <Input
                                                                type="text"
                                                                name="offer_price"
                                                                value={formatWithCommas(formData.offer_price)}
                                                                onChange={handleInputChange}
                                                                error={errors.offer_price}
                                                                className="pl-8"
                                                                placeholder="0"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <FormLabel label="Regular Price" optional />
                                                        <div className="relative border-l border-gray-100 pl-4">
                                                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                                            <Input
                                                                type="text"
                                                                name="price"
                                                                value={formatWithCommas(formData.price)}
                                                                onChange={handleInputChange}
                                                                className="pl-8"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-medium italic">Note: Prices are formatted with commas automatically for Indian Rupees.</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1 h-4 bg-[#14532d] rounded-full"></div>
                                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip Schedule</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <FormLabel label="Start Date" required />
                                                        <Input
                                                            type="date"
                                                            name="start_date"
                                                            value={formData.start_date}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormLabel label="Max Group Size" />
                                                        <Input
                                                            type="number"
                                                            name="group_size"
                                                            value={formData.group_size}
                                                            onChange={handleInputChange}
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <FormLabel label="Total Duration (Days)" />
                                                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                        <div className="p-3 bg-green-50 rounded-lg text-[#14532d]">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xl font-black text-gray-900 leading-none">{formData.days || 1} Days</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{parseInt(formData.days || 1) - 1} Nights Included</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Section>



                                {/* DAY WISE ITINERARY */}
                                <Section title="Day Wise Itinerary" active={activeSection === 'itinerary'}>
                                    <div className="space-y-8">
                                        {itineraryDays.map((row, i) => (
                                            <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                                                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-[#14532d] flex flex-col items-center justify-center text-white shadow-lg shadow-green-900/10">
                                                            <span className="text-[10px] font-black uppercase tracking-tighter leading-none opacity-70">Day</span>
                                                            <span className="text-lg font-black leading-none">{i + 1}</span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Destination</span>
                                                                <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                                                                <span className="text-[10px] font-black text-[#14532d] uppercase tracking-widest leading-none">{getDestinationForDay(i)}</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter amazing title for this day..."
                                                                value={row.title}
                                                                onChange={(e) => {
                                                                    const copy = [...itineraryDays];
                                                                    copy[i].title = e.target.value;
                                                                    setItineraryDays(copy);
                                                                }}
                                                                className="text-lg font-black text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-gray-200"
                                                            />
                                                            {errors[`itinerary_title_${i}`] && <p className="text-red-500 text-[10px] font-bold mt-1">⚠ {errors[`itinerary_title_${i}`]}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex bg-white p-1 rounded-xl border border-gray-100 scale-75 origin-right">
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
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#14532d] hover:bg-green-50 transition-all font-bold"
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
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#14532d] hover:bg-green-50 transition-all font-bold"
                                                                title="Move Down"
                                                            >
                                                                ↓
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRow(setItineraryDays, i)}
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all border border-gray-50 hover:border-red-100"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="px-8 pb-4">
                                                    <div className="flex items-center gap-3 mb-6 p-1 bg-gray-100/50 rounded-2xl w-fit">
                                                        {[
                                                            { id: 'day_itinerary', label: 'Day Itinerary', icon: <ClipboardList size={14} /> },
                                                            { id: 'sightseeing', label: 'Sightseeing', icon: <Camera size={14} /> },
                                                            { id: 'accommodation', label: 'Accommodation', icon: <Bed size={14} /> },
                                                            { id: 'vehicle', label: 'Vehicle', icon: <Car size={14} /> }
                                                        ].map(tab => (
                                                            <button
                                                                key={tab.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    const copy = [...itineraryDays];
                                                                    if (!copy[i].details_json) {
                                                                        copy[i].details_json = { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] };
                                                                    }
                                                                    copy[i].details_json.active_tab = tab.id;
                                                                    setItineraryDays(copy);
                                                                }}
                                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${(row.details_json?.active_tab || 'day_itinerary') === tab.id
                                                                    ? 'bg-white text-[#14532d] shadow-sm'
                                                                    : 'text-gray-400 hover:text-gray-600'
                                                                    }`}
                                                            >
                                                                {tab.icon}
                                                                {tab.label}
                                                            </button>
                                                        ))}
                                                    </div>

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
                                                            const filteredDayMasters = dayMasterSearch
                                                                ? itineraryMasters.filter(m =>
                                                                    m.name?.toLowerCase().includes(dayMasterSearch.toLowerCase()) ||
                                                                    m.title?.toLowerCase().includes(dayMasterSearch.toLowerCase())
                                                                ) : [];
                                                            const mealOptions = ['No Meals', 'Breakfast', 'Lunch', 'High-Tea', 'Dinner'];
                                                            return (
                                                                <div className="grid grid-cols-3 gap-8">
                                                                    <div className="col-span-2 space-y-4">
                                                                        {/* Note */}
                                                                        <p className="text-[10px] text-red-600 font-medium">Note - You can save only one Day Wise Itinerary for each itinerary!</p>

                                                                        {/* Search day itinerary */}
                                                                        <div>
                                                                            <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search day itinerary from the database</p>
                                                                            <div className="relative">
                                                                                <input
                                                                                    type="text"
                                                                                    value={dayMasterSearch}
                                                                                    onChange={e => updateDay({ _dayMasterSearch: e.target.value })}
                                                                                    placeholder="Type to look up for day itinerary in masters"
                                                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[11px] focus:outline-none focus:border-blue-400 pr-8"
                                                                                />
                                                                                <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                            </div>
                                                                            {filteredDayMasters.length > 0 && (
                                                                                <div className="border border-gray-200 rounded-sm bg-white shadow-sm mt-0.5 max-h-36 overflow-y-auto">
                                                                                    {filteredDayMasters.map(m => (
                                                                                        <button
                                                                                            key={m.id}
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                handleMasterTemplateChange(i, m.id.toString());
                                                                                                updateDay({ _dayMasterSearch: '' });
                                                                                            }}
                                                                                            className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                                                                        >
                                                                                            <span className="font-medium text-gray-800">{m.name || m.title}</span>
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Day description or empty state */}
                                                                        {!row.description ? (
                                                                            <div className="border-2 border-dashed border-gray-200 rounded-sm h-24 flex items-center justify-center">
                                                                                <p className="text-[11px] text-gray-400">No Day Itinerary added</p>
                                                                            </div>
                                                                        ) : (
                                                                            <textarea
                                                                                value={row.description}
                                                                                onChange={(e) => {
                                                                                    const copy = [...itineraryDays];
                                                                                    copy[i].description = e.target.value;
                                                                                    setItineraryDays(copy);
                                                                                }}
                                                                                rows="6"
                                                                                placeholder="Describe the day's adventure in detail..."
                                                                                className="w-full bg-white border border-gray-300 p-3 rounded-sm text-[11px] text-gray-700 leading-relaxed focus:outline-none focus:border-blue-400 transition-all resize-none"
                                                                            />
                                                                        )}

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
                                                                                <option value="No Transfer">No Transfer</option>
                                                                            </select>
                                                                        </div>

                                                                        {/* Save to master */}
                                                                        <div className="flex items-center gap-6 p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="relative">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={`save_master_${i}`}
                                                                                            checked={row.save_to_master}
                                                                                            onChange={(e) => {
                                                                                                const copy = [...itineraryDays];
                                                                                                copy[i].save_to_master = e.target.checked;
                                                                                                setItineraryDays(copy);
                                                                                            }}
                                                                                            className="peer hidden"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`save_master_${i}`}
                                                                                            className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 peer-checked:border-[#14532d] peer-checked:bg-[#14532d] peer-checked:text-white transition-all shadow-sm"
                                                                                        >
                                                                                            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center p-0.5">
                                                                                                {row.save_to_master && <div className="w-full h-full bg-white rounded-full"></div>}
                                                                                            </div>
                                                                                            <span className="text-[10px] font-black uppercase tracking-widest">Save to Masters</span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-[10px] text-green-700/50 font-medium italic max-w-[150px]">Saving helps you reuse this itinerary description in other packages.</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <FormLabel label="Day Visual" />
                                                                        <div className="aspect-square w-full bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d] transition-all cursor-pointer">
                                                                            {(row.image || row.existing_image) ? (
                                                                                <>
                                                                                    <img
                                                                                        src={row.image ? URL.createObjectURL(row.image) : row.existing_image}
                                                                                        className="w-full h-full object-cover"
                                                                                        alt="Preview"
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                const copy = [...itineraryDays];
                                                                                                copy[i].image = null;
                                                                                                copy[i].existing_image = null;
                                                                                                setItineraryDays(copy);
                                                                                            }}
                                                                                            className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                                                                                        >
                                                                                            <X size={20} />
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <div className="text-center p-6 pb-2">
                                                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
                                                                                        <Package size={24} />
                                                                                    </div>
                                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Image</p>
                                                                                    <p className="text-[8px] text-gray-300 mt-1">Recommended square size</p>
                                                                                </div>
                                                                            )}
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                onChange={(e) => {
                                                                                    if (e.target.files[0]) {
                                                                                        const copy = [...itineraryDays];
                                                                                        copy[i].image = e.target.files[0];
                                                                                        setItineraryDays(copy);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {(row.image || row.existing_image) && (
                                                                            <p className="text-[10px] text-center font-bold text-[#14532d] uppercase tracking-widest">
                                                                                {row.image ? "New Image Selected" : "Existing Image"}
                                                                            </p>
                                                                        )}
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
                                                            const filteredSightseeings = sightseeingSearch
                                                                ? sightseeingMasters.filter(sm =>
                                                                    sm.name?.toLowerCase().includes(sightseeingSearch.toLowerCase()) ||
                                                                    sm.city?.toLowerCase().includes(sightseeingSearch.toLowerCase())
                                                                ) : [];
                                                            return (
                                                                <div className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    {/* Main sightseeing panel */}
                                                                    <div className="flex-1 space-y-3">
                                                                        {/* Search */}
                                                                        <div>
                                                                            <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search sightseeing from the database</p>
                                                                            <div className="relative">
                                                                                <input
                                                                                    type="text"
                                                                                    value={sightseeingSearch}
                                                                                    onChange={e => updateDay({ _sightseeingSearch: e.target.value })}
                                                                                    placeholder="Type to look up for sightseeing in masters"
                                                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[11px] focus:outline-none focus:border-blue-400 pr-8"
                                                                                />
                                                                                <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                                            </div>
                                                                            {/* Search results dropdown */}
                                                                            {filteredSightseeings.length > 0 && (
                                                                                <div className="border border-gray-200 rounded-sm bg-white shadow-sm mt-0.5 max-h-36 overflow-y-auto">
                                                                                    {filteredSightseeings.map(sm => (
                                                                                        <button
                                                                                            key={sm.id}
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                const copy = [...itineraryDays];
                                                                                                if (!copy[i].details_json.sightseeing) copy[i].details_json.sightseeing = [];
                                                                                                const already = copy[i].details_json.sightseeing.includes(sm.name);
                                                                                                if (!already) copy[i].details_json.sightseeing.push(sm.name);
                                                                                                copy[i].details_json._sightseeingSearch = '';
                                                                                                setItineraryDays(copy);
                                                                                            }}
                                                                                            className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                                                                        >
                                                                                            <span className="font-medium text-gray-800">{sm.name}</span>
                                                                                            {sm.city && <span className="text-gray-400 ml-1">· {sm.city}</span>}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            )}
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
                                                                                            {destinations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5 flex items-center gap-1">Latitude & Longitude <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span></p>
                                                                                    <div className="flex gap-1">
                                                                                        <input type="text" value={newSightseeingForm.latitude} onChange={e => setNewSightseeingForm(p => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        <input type="text" value={newSightseeingForm.longitude} onChange={e => setNewSightseeingForm(p => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
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
                                                                                            const fd = new FormData();
                                                                                            fd.append('name', newSightseeingForm.name);
                                                                                            fd.append('description', newSightseeingForm.description);
                                                                                            fd.append('address', newSightseeingForm.address);
                                                                                            fd.append('city', newSightseeingForm.city);
                                                                                            fd.append('latitude', newSightseeingForm.latitude);
                                                                                            fd.append('longitude', newSightseeingForm.longitude);
                                                                                            if (newSightseeingForm.images.length > 0) fd.append('image', newSightseeingForm.images[0]);
                                                                                            const res = await axios.post('/api/sightseeing-masters/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                                                            setSightseeingMasters(prev => [...prev, res.data]);
                                                                                            const copy = [...itineraryDays];
                                                                                            if (!copy[i].details_json.sightseeing) copy[i].details_json.sightseeing = [];
                                                                                            copy[i].details_json.sightseeing.push(res.data.name);
                                                                                            setItineraryDays(copy);
                                                                                            setNewSightseeingForm({ name: '', description: '', address: '', city: '', latitude: '', longitude: '', images: [] });
                                                                                            setSightseeingPanelDayIndex(null);
                                                                                        } catch (err) {
                                                                                            console.error('Error saving sightseeing:', err);
                                                                                            alert('Failed to save sightseeing.');
                                                                                        }
                                                                                    }}
                                                                                    className="w-full py-1.5 bg-[#14532d] text-white text-[10px] font-bold rounded-sm hover:bg-green-800 transition-colors"
                                                                                >Add</button>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => { setSightseeingPanelDayIndex(i); setNewSightseeingForm({ name: '', description: '', address: '', city: '', latitude: '', longitude: '', images: [] }); }}
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
                                                            const roomDetails = row.details_json?._roomDetails || { noOfRooms: '', checkIn: '', checkOut: '', rooms: [] };
                                                            const updateDay = (patch) => {
                                                                const copy = [...itineraryDays];
                                                                copy[i].details_json = { ...copy[i].details_json, ...patch };
                                                                setItineraryDays(copy);
                                                            };
                                                            const updateRoomDetails = (patch) => {
                                                                const copy = [...itineraryDays];
                                                                const rd = copy[i].details_json?._roomDetails || { noOfRooms: '', checkIn: '', checkOut: '', rooms: [] };
                                                                copy[i].details_json._roomDetails = { ...rd, ...patch };
                                                                setItineraryDays(copy);
                                                            };
                                                            const filteredHotels = searchQ
                                                                ? hotelMasters.filter(h =>
                                                                    h.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
                                                                    h.city?.toLowerCase().includes(searchQ.toLowerCase())
                                                                ) : [];
                                                            return (
                                                                <div className="bg-white p-0 space-y-0">
                                                                    {/* Header */}
                                                                    <div className="flex items-center justify-between pb-1.5">
                                                                        <h3 className="text-[12px] font-bold text-gray-900">Accommodation</h3>
                                                                    </div>

                                                                    {/* Search Accommodation */}
                                                                    <div className="mb-2">
                                                                        <p className="text-[10px] text-gray-500 mb-1">Search Accommodation from the database</p>
                                                                        {/* Search Input */}
                                                                        <div className="relative">
                                                                            <input
                                                                                type="text"
                                                                                value={searchQ}
                                                                                onChange={e => updateDay({ _accSearch: e.target.value })}
                                                                                placeholder=""
                                                                                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[11px] focus:outline-none focus:border-blue-400 pr-6"
                                                                            />
                                                                            {searchQ && (
                                                                                <button type="button" onClick={() => updateDay({ _accSearch: '' })} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 font-bold text-[11px]">×</button>
                                                                            )}
                                                                        </div>

                                                                        {/* Two-panel dropdown */}
                                                                        <div className="border border-gray-200 rounded-sm mt-0.5 bg-white shadow-sm">
                                                                            {/* Top panel: Add New Accommodation */}
                                                                            <div className="border border-dashed border-orange-200 m-1.5 rounded-sm">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => updateDay({ _showNewAcc: !showForm })}
                                                                                    className="w-full py-1.5 text-[11px] text-orange-400 font-medium hover:bg-orange-50 transition-colors"
                                                                                >
                                                                                    {showForm ? 'Close Form' : 'Add New Accommodation'}
                                                                                </button>
                                                                            </div>
                                                                            {/* Bottom panel: search results / empty state */}
                                                                            <div className="border border-dashed border-gray-200 m-1.5 mt-0 rounded-sm min-h-[44px] max-h-[100px] overflow-y-auto flex flex-col">
                                                                                {filteredHotels.length > 0 ? filteredHotels.map(h => (
                                                                                    <button
                                                                                        key={h.id}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const copy = [...itineraryDays];
                                                                                            if (!copy[i].details_json.accommodations) copy[i].details_json.accommodations = [];
                                                                                            const alreadyAdded = copy[i].details_json.accommodations.find(a => a.hotelId === h.id);
                                                                                            if (!alreadyAdded) {
                                                                                                copy[i].details_json.accommodations.push({ hotelId: h.id, hotelName: h.name });
                                                                                            }
                                                                                            copy[i].details_json._accSearch = '';
                                                                                            setItineraryDays(copy);
                                                                                        }}
                                                                                        className="w-full text-left px-2 py-1 text-[10px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                                                                    >
                                                                                        <span className="font-medium text-gray-800">{h.name}</span>
                                                                                        {h.city && <span className="text-gray-400 ml-1">· {h.city}</span>}
                                                                                    </button>
                                                                                )) : (
                                                                                    <div className="flex-1 flex items-center justify-center">
                                                                                        <p className="text-[10px] text-gray-400">No accommodation added</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Selected accommodations tags */}
                                                                        {accs.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                                {accs.map((acc, accIdx) => (
                                                                                    <span key={accIdx} className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5 font-medium">
                                                                                        {acc.hotelName}
                                                                                        <button type="button" onClick={() => { const copy = [...itineraryDays]; copy[i].details_json.accommodations.splice(accIdx, 1); setItineraryDays(copy); }} className="text-blue-400 hover:text-red-500 ml-0.5">×</button>
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Add New Accommodation Form */}
                                                                    {showForm && (
                                                                        <div className="border border-gray-200 rounded p-3 bg-gray-50/50 space-y-2 mb-2">
                                                                            <h4 className="text-[11px] font-bold text-gray-800">Add New Accommodation</h4>
                                                                            {/* Row 1: Name + Star */}
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Name of the Accommodation</p>
                                                                                    <input type="text" value={newHotelForm.name} onChange={e => setNewHotelForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter name of the acccommodation" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Star Category</p>
                                                                                    <select value={newHotelForm.stars} onChange={e => setNewHotelForm(p => ({ ...p, stars: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                                                                        <option value="">Select</option>
                                                                                        {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star</option>)}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            {/* Row 2: Address + City */}
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Accommodation Address <span className="text-sky-400 font-normal">(optional)</span></p>
                                                                                    <input type="text" value={newHotelForm.address} onChange={e => setNewHotelForm(p => ({ ...p, address: e.target.value }))} placeholder="Enter accommodation address" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5">City (Country)</p>
                                                                                    <input type="text" value={newHotelForm.city} onChange={e => setNewHotelForm(p => ({ ...p, city: e.target.value }))} placeholder="Select a city..." className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                </div>
                                                                            </div>
                                                                            {/* Row 3: Phone */}
                                                                            <div>
                                                                                <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Phone No. <span className="text-sky-400 font-normal">(optional)</span></p>
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    <input type="text" value={newHotelForm.phone || ''} onChange={e => setNewHotelForm(p => ({ ...p, phone: e.target.value }))} placeholder="Select country code" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                    <input type="text" placeholder="Enter phone no." className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                </div>
                                                                            </div>
                                                                            {/* Row 4: Website + Email */}
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Website <span className="text-sky-400 font-normal">(optional)</span></p>
                                                                                    <input type="text" value={newHotelForm.website} onChange={e => setNewHotelForm(p => ({ ...p, website: e.target.value }))} placeholder="Enter accommodation website" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Email Id <span className="text-sky-400 font-normal">(optional)</span></p>
                                                                                    <input type="email" value={newHotelForm.email} onChange={e => setNewHotelForm(p => ({ ...p, email: e.target.value }))} placeholder="Type Email Id" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                </div>
                                                                            </div>
                                                                            {/* Row 5: Lat/Lng */}
                                                                            <div>
                                                                                <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Latitude &amp; Longitude <span className="text-sky-400 font-normal">(optional)</span></p>
                                                                                <div className="flex gap-2 items-center">
                                                                                    <input type="text" value={newHotelForm.latitude} onChange={e => setNewHotelForm(p => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                    <input type="text" value={newHotelForm.longitude} onChange={e => setNewHotelForm(p => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                    <span className="text-orange-400 text-[13px]">ⓘ</span>
                                                                                </div>
                                                                            </div>
                                                                            {/* Row 6: Images */}
                                                                            <div>
                                                                                <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Accommodation Images <span className="text-gray-400 font-normal">(up to 5, max 1 MB)</span></p>
                                                                                <div className="border border-dashed border-gray-300 rounded-sm p-2 flex gap-1.5 flex-wrap min-h-[44px]">
                                                                                    <label className="w-[50px] h-[44px] border border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 text-[9px] text-center">
                                                                                        <span className="text-sm leading-none">+</span>
                                                                                        <span>Add</span>
                                                                                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                                                                            const files = Array.from(e.target.files).slice(0, 5);
                                                                                            setNewHotelForm(p => ({ ...p, images: [...(p.images || []), ...files].slice(0, 5) }));
                                                                                        }} />
                                                                                    </label>
                                                                                    {(newHotelForm.images || []).map((img, idx) => (
                                                                                        <div key={idx} className="relative w-[50px] h-[44px]">
                                                                                            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded border border-gray-200" />
                                                                                            <button type="button" onClick={() => setNewHotelForm(p => ({ ...p, images: p.images.filter((_, j) => j !== idx) }))} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">×</button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <button type="button" onClick={() => handleSaveNewHotel(i)} className="w-full py-1 bg-[#14532d] text-white text-[10px] font-bold rounded-sm hover:bg-green-800 transition-colors">
                                                                                Save Accommodation
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {/* Divider */}
                                                                    <hr className="border-gray-200 my-2" />

                                                                    {/* Add Room Details */}
                                                                    <div>
                                                                        <p className="text-[11px] font-bold text-gray-800 mb-1.5">Add Room Details</p>
                                                                        {/* No. of Rooms / Check In / Check Out */}
                                                                        <div className="grid grid-cols-3 gap-2 mb-2">
                                                                            <div>
                                                                                <p className="text-[10px] font-medium text-gray-600 mb-0.5">No. of Rooms</p>
                                                                                <select
                                                                                    value={roomDetails.noOfRooms || ''}
                                                                                    onChange={e => {
                                                                                        const n = parseInt(e.target.value) || 0;
                                                                                        const rooms = Array.from({ length: n }, (_, idx) => roomDetails.rooms?.[idx] || { roomType: '', meals: '', passengers: '' });
                                                                                        updateRoomDetails({ noOfRooms: e.target.value, rooms });
                                                                                    }}
                                                                                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white"
                                                                                >
                                                                                    <option value="">Select</option>
                                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                                                                </select>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-medium text-gray-600 mb-0.5">Check In</p>
                                                                                <input type="date" value={roomDetails.checkIn || ''} onChange={e => updateRoomDetails({ checkIn: e.target.value })} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-medium text-gray-600 mb-0.5">Check Out</p>
                                                                                <input type="date" value={roomDetails.checkOut || ''} onChange={e => updateRoomDetails({ checkOut: e.target.value })} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                            </div>
                                                                        </div>
                                                                        {/* Per-room rows */}
                                                                        {(roomDetails.rooms || []).length > 0 && (
                                                                            <div>
                                                                                {/* Column headers */}
                                                                                <div className="grid grid-cols-[64px_1fr_1fr_1fr] gap-2 mb-0.5">
                                                                                    <div />
                                                                                    <p className="text-[9px] font-medium text-gray-600">Room Type</p>
                                                                                    <p className="text-[9px] font-medium text-gray-600">Meal Type</p>
                                                                                    <p className="text-[9px] font-medium text-gray-600">Passengers <span className="text-sky-400">(Optional)</span></p>
                                                                                </div>
                                                                                {(roomDetails.rooms || []).map((room, rIdx) => (
                                                                                    <div key={rIdx} className="grid grid-cols-[64px_1fr_1fr_1fr] gap-2 mb-1 items-center">
                                                                                        <p className="text-[9px] font-medium text-gray-500 text-right pr-1">Room {rIdx + 1} :</p>
                                                                                        <input type="text" value={room.roomType || ''} onChange={e => { const copy = [...itineraryDays]; const rooms = [...(copy[i].details_json._roomDetails?.rooms || [])]; rooms[rIdx] = { ...rooms[rIdx], roomType: e.target.value }; copy[i].details_json._roomDetails = { ...copy[i].details_json._roomDetails, rooms }; setItineraryDays(copy); }} placeholder="Enter Room Type" className="w-full border border-gray-300 rounded-sm px-1.5 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                        <select value={room.meals || ''} onChange={e => { const copy = [...itineraryDays]; const rooms = [...(copy[i].details_json._roomDetails?.rooms || [])]; rooms[rIdx] = { ...rooms[rIdx], meals: e.target.value }; copy[i].details_json._roomDetails = { ...copy[i].details_json._roomDetails, rooms }; setItineraryDays(copy); }} className="w-full border border-gray-300 rounded-sm px-1.5 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                                                                            <option value="">Select meals included</option>
                                                                                            <option value="EP">EP (Room Only)</option>
                                                                                            <option value="CP">CP (Breakfast)</option>
                                                                                            <option value="MAP">MAP (Half Board)</option>
                                                                                            <option value="AP">AP (Full Board)</option>
                                                                                        </select>
                                                                                        <input type="text" value={room.passengers || ''} onChange={e => { const copy = [...itineraryDays]; const rooms = [...(copy[i].details_json._roomDetails?.rooms || [])]; rooms[rIdx] = { ...rooms[rIdx], passengers: e.target.value }; copy[i].details_json._roomDetails = { ...copy[i].details_json._roomDetails, rooms }; setItineraryDays(copy); }} className="w-full border border-gray-300 rounded-sm px-1.5 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}

                                                        {/* 5. VEHICLE */}
                                                        {row.details_json?.active_tab === 'vehicle' && (() => {
                                                            const vd = row.details_json?.vehicle_data || {};
                                                            const vehicleMode = vd.mode || 'self_drive';
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
                                                                                checked={isSelf}
                                                                                onChange={() => updateVD({ mode: 'self_drive' })}
                                                                                className="w-3.5 h-3.5 accent-blue-500"
                                                                            />
                                                                            <span className="text-[11px] font-medium text-gray-700">Self Drive</span>
                                                                        </label>
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
                                                                    </div>
                                                                    {/* Sub-heading */}
                                                                    <p className="text-[11px] font-bold text-gray-800 mb-2">
                                                                        {isSelf ? 'Self Drive' : 'Vehicle with Driver/ Chaffeur'}
                                                                    </p>
                                                                    {/* Vehicle Type + No. of Vehicles */}
                                                                    <div className="grid grid-cols-[1fr_180px] gap-3 mb-2">
                                                                        <div>
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Vehicle Type</p>
                                                                            <input
                                                                                type="text"
                                                                                value={vd.vehicleType || ''}
                                                                                onChange={e => updateVD({ vehicleType: e.target.value })}
                                                                                placeholder="Enter vehicle type - eg. sedan/ suv/ coach etc."
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
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
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Pick Up Date</p>
                                                                            <input
                                                                                type="date"
                                                                                value={vd.pickUpDate || ''}
                                                                                onChange={e => updateVD({ pickUpDate: e.target.value })}
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Pick Up Location</p>
                                                                            <input
                                                                                type="text"
                                                                                value={vd.pickUpLocation || ''}
                                                                                onChange={e => updateVD({ pickUpLocation: e.target.value })}
                                                                                placeholder={isSelf ? 'Enter address from where vehicle will be picked up' : 'Enter address from where passenger will be picked up'}
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* Drop Off Date + Drop Off Location */}
                                                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                                                        <div>
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Drop Off Date</p>
                                                                            <input
                                                                                type="date"
                                                                                value={vd.dropOffDate || ''}
                                                                                onChange={e => updateVD({ dropOffDate: e.target.value })}
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Drop Off Location</p>
                                                                            <input
                                                                                type="text"
                                                                                value={vd.dropOffLocation || ''}
                                                                                onChange={e => updateVD({ dropOffLocation: e.target.value })}
                                                                                placeholder={isSelf ? 'Enter address to where the vehicle will be dropped off' : 'Enter address where passenger will be dropped off'}
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* Vehicle Brand + Pick Up time + Drop off time */}
                                                                    <div className="grid grid-cols-3 gap-3">
                                                                        <div>
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5">
                                                                                Vehicle Brand <span className="text-sky-400 font-normal">(Optional)</span>
                                                                            </p>
                                                                            <input
                                                                                type="text"
                                                                                value={vd.vehicleBrand || ''}
                                                                                onChange={e => updateVD({ vehicleBrand: e.target.value })}
                                                                                placeholder="Enter Vehicle Brand"
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-semibold text-gray-700 mb-0.5 flex items-center gap-1">
                                                                                Pick Up time <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span>
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
                                                                                Drop off time <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span>
                                                                            </p>
                                                                            <input
                                                                                type="time"
                                                                                value={vd.dropOffTime || ''}
                                                                                onChange={e => updateVD({ dropOffTime: e.target.value })}
                                                                                className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                                                            />
                                                                        </div>
                                                                    </div>
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
                                                    day: nextDay,
                                                    title: "",
                                                    description: "",
                                                    master_template: "",
                                                    image: null,
                                                    existing_image: null,
                                                    save_to_master: false,
                                                    details_json: { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] }
                                                }]);
                                            }}
                                            className="w-full py-6 rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center gap-2 text-gray-400 hover:border-[#14532d] hover:bg-green-50/30 hover:text-[#14532d] transition-all"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border-2 border-white shadow-inner">
                                                <span className="text-2xl font-light">+</span>
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">Add Itinerary Day</span>
                                        </button>
                                    </div>
                                </Section>

                                {/* TRIP INFORMATION */}
                                <Section title="Trip Information" active={activeSection === 'policy'}>
                                    <div className="space-y-6 max-w-5xl mx-auto">

                                        {/* INCLUSIONS */}
                                        <div>
                                            <h3 className="text-[12px] font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-1.5">
                                                Inclusions <span className="text-sky-400 font-normal text-[10px] opacity-90">(Optional)</span>
                                            </h3>
                                            <div className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                                                <div className="border-b border-gray-200 bg-white px-2 py-1 flex gap-1.5">
                                                    <button type="button" onClick={() => insertBullet(inclusionsRef, inclusions, setInclusions)} title="Insert bullet point" className="w-6 h-6 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                                                        <List size={13} />
                                                    </button>
                                                </div>
                                                <textarea
                                                    ref={inclusionsRef}
                                                    className="w-full min-h-[90px] px-3 py-2 text-[12px] text-gray-700 focus:outline-none resize-y"
                                                    placeholder="• Accommodation as per itinerary&#10;• Transfers as per itinerary&#10;• Sightseeing as per itinerary"
                                                    value={inclusions.join('\n')}
                                                    onChange={(e) => setInclusions(e.target.value.split('\n'))}
                                                    spellCheck="false"
                                                />
                                            </div>
                                        </div>

                                        {/* EXCLUSIONS */}
                                        <div>
                                            <h3 className="text-[12px] font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-1.5">
                                                Exclusions <span className="text-sky-400 font-normal text-[10px] opacity-90">(Optional)</span>
                                            </h3>
                                            <div className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                                                <div className="border-b border-gray-200 bg-white px-2 py-1 flex gap-1.5">
                                                    <button type="button" onClick={() => insertBullet(exclusionsRef, exclusions, setExclusions)} title="Insert bullet point" className="w-6 h-6 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                                                        <List size={13} />
                                                    </button>
                                                </div>
                                                <textarea
                                                    ref={exclusionsRef}
                                                    className="w-full min-h-[90px] px-3 py-2 text-[12px] text-gray-700 focus:outline-none resize-y"
                                                    placeholder="• Cost of Visa and travel insurance&#10;• Any heads not mentioned under INCLUSIONS"
                                                    value={exclusions.join('\n')}
                                                    onChange={(e) => setExclusions(e.target.value.split('\n'))}
                                                    spellCheck="false"
                                                />
                                            </div>
                                        </div>

                                        {/* CANCELLATION POLICY */}
                                        <div>
                                            <h3 className="text-[12px] font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-1.5">
                                                Cancellation Policy <span className="text-sky-400 font-normal text-[10px] opacity-90">(Optional)</span>
                                            </h3>
                                            <div className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                                                <div className="border-b border-gray-200 bg-white px-2 py-1 flex gap-1.5">
                                                    <button type="button" onClick={() => insertNumbered(cancellationRef, cancellationPolicies, setCancellationPolicies)} title="Insert numbered item" className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                                                        <ListOrdered size={13} />
                                                    </button>
                                                </div>
                                                <textarea
                                                    ref={cancellationRef}
                                                    className="w-full min-h-[90px] px-3 py-2 text-[12px] text-gray-700 focus:outline-none resize-y"
                                                    placeholder="1. 60 days prior – 25% cancellation of the tour cost&#10;2. 45 days prior – 50% cancellation of the tour cost"
                                                    value={cancellationPolicies.join('\n')}
                                                    onChange={(e) => setCancellationPolicies(e.target.value.split('\n'))}
                                                    spellCheck="false"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </Section>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default HolidayPackageEdit;
