import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";
import { X, MapPin, Calendar, Package, Image as ImageIcon } from "lucide-react";

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

const FormLabel = ({ label, limit, current, required, optional, info }) => (
    <div className="flex justify-between items-end mb-1.5">
        <div className="flex items-center gap-2">
            <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.15em]">{label} {required && <span className="text-red-500">*</span>}</span>
            {optional && <span className="text-[#14532d] text-[8px] font-black bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
            {info && (
                <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-[#14532d] transition-colors bg-gray-50 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black border border-gray-100">?</span>
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-md bg-opacity-95 border border-white/10 leading-relaxed font-medium">
                        {info}
                    </div>
                </div>
            )}
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
    const [highlights, setHighlights] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        starting_city: "",
        days: "",
        start_date: "",
        group_size: 0,
        offer_price: "",
        price: "",
        header_image: null,
        card_image: null,
        with_flight: false,
        is_active: true,
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
                const [citiesRes, destRes, mastersRes, pkgRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/starting-cities/`),
                    axios.get(`${API_BASE_URL}/destinations/`),
                    axios.get(`${API_BASE_URL}/itinerary-masters/`),
                    axios.get(`${API_BASE_URL}/packages/${id}/`),
                ]);

                setStartingCities(citiesRes.data);
                setDestinations(destRes.data);
                setItineraryMasters(mastersRes.data);

                // Populate Form Data
                const pkg = pkgRes.data;
                setFormData({
                    title: pkg.title || "",
                    description: pkg.description || "",
                    category: pkg.category || "",
                    starting_city: pkg.starting_city || "",
                    days: pkg.days || "",
                    start_date: pkg.start_date || "",
                    group_size: pkg.group_size || 0,
                    offer_price: pkg.Offer_price || "", // Note capitalization in model
                    price: pkg.price || "",
                    header_image: null, // Keep null unless changing
                    card_image: null,
                    with_flight: pkg.with_flight || false,
                    is_active: pkg.is_active !== undefined ? pkg.is_active : true,
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

    // Sync Package Destinations with "Days" input (One row per night)
    useEffect(() => {
        if (loading) return;
        const dayCount = parseInt(formData.days, 10);
        const totalNights = isNaN(dayCount) ? 0 : Math.max(0, dayCount - 1);

        setPackageDestinations((prev) => {
            if (prev.length === totalNights) return prev;
            if (totalNights > prev.length) {
                const newRows = [];
                for (let i = prev.length + 1; i <= totalNights; i++) {
                    newRows.push({ destination: "", nights: 1 });
                }
                return [...prev, ...newRows];
            } else {
                return prev.slice(0, totalNights);
            }
        });
    }, [formData.days, loading]);


    /* ---------- handlers ---------- */
    const addRow = (setter, row) => setter((p) => [...p, row]);
    const removeRow = (setter, index) =>
        setter((p) => p.filter((_, i) => i !== index));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "offer_price" || name === "price") {
            const cleanValue = value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, [name]: cleanValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
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
                master_template: day.master_template
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
        { id: 'overview', label: 'Trip Overview', icon: <Package size={18} /> },
        { id: 'location', label: 'Arrival & Departure', icon: <MapPin size={18} /> },
        { id: 'itinerary', label: 'Day Wise Itinerary', icon: <Calendar size={18} />, subItems: itineraryDays.map((_, i) => ({ id: `day-${i}`, label: `Day ${i + 1}`, dest: getDestinationForDay(i) })) },
        { id: 'pricing', label: 'Pricing', icon: <span className="text-lg">💰</span> },
        { id: 'images', label: 'Images', icon: <span className="text-lg">🖼️</span> },
        { id: 'policy', label: 'Trip Information', icon: <span className="text-lg">ℹ️</span> },
    ];

    return (
        <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
            </style>
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
                    <div className="w-64 bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar flex flex-col p-4 shrink-0">
                        <nav className="flex-1 space-y-1">
                            {navItems.map((item) => (
                                <div key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all duration-500 group relative overflow-hidden ${activeSection === item.id ? 'bg-[#14532d] text-white shadow-2xl shadow-green-900/30 -translate-y-1' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        {activeSection === item.id && (
                                            <div className="absolute right-0 top-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                                        )}
                                        <span className={`transition-all duration-500 ${activeSection === item.id ? 'scale-110 rotate-3 text-green-300' : 'text-gray-300 group-hover:text-gray-900 group-hover:scale-110'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="uppercase tracking-[0.15em] text-[10px]">{item.label}</span>
                                    </button>
                                    {item.subItems && activeSection === 'itinerary' && (
                                        <div className="mt-3 ml-6 pl-4 border-l-2 border-green-50 space-y-1 py-1.5 animate-in slide-in-from-top-4">
                                            {item.subItems.map((sub, idx) => (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[9px] font-black text-gray-400 hover:bg-gray-50 hover:text-[#14532d] transition-all group relative"
                                                    onClick={() => {
                                                        const el = document.getElementById(`itinerary-day-${idx}`);
                                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    }}
                                                >
                                                    <div className={`w-1 h-1 rounded-full ${idx === 0 ? 'bg-green-500' : 'bg-gray-300'} group-hover:scale-150 group-hover:bg-[#14532d] transition-all`}></div>
                                                    <span className="uppercase tracking-widest">{sub.label}</span>
                                                    <span className="text-[7.5px] text-gray-300 font-bold ml-auto opacity-0 group-hover:opacity-100 transition-opacity uppercase">{sub.dest}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                        <div className="mt-8 p-8 bg-[#14532d]/5 rounded-[2.5rem] border border-[#14532d]/10 relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 w-20 h-20 bg-[#14532d]/5 rounded-tl-[4rem]"></div>
                            <p className="text-[10px] text-[#14532d] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Admin Notice</p>
                            <p className="text-[10px] font-bold text-gray-600 leading-relaxed italic border-l-2 border-[#14532d]/30 pl-3">Modify your package details carefully. Changes will be instantly reflected on the live site upon update.</p>
                            <div className="mt-4 pt-4 border-t border-[#14532d]/10">
                                <p className="text-[8px] font-black text-[#14532d]/50 uppercase tracking-widest mb-1">Internal Reference</p>
                                <p className="text-[10px] font-black text-[#14532d]">{id}</p>
                            </div>
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

                                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
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
                                        </div>
                                    </div>


                                </Section>

                                {/* LOCATION DETAILS */}
                                <Section title="Arrival & Departure" active={activeSection === 'location'}>
                                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <FormLabel label="Starting City" required info="The city where the tour begins" />
                                                    <SearchableSelect
                                                        options={startingCities.map(city => ({ value: city.name, label: city.name }))}
                                                        value={formData.starting_city}
                                                        onChange={(val) => setFormData(prev => ({ ...prev, starting_city: val }))}
                                                        placeholder="Search starting city..."
                                                        className="modern-select"
                                                    />
                                                    {errors.starting_city && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">⚠ {errors.starting_city}</p>}
                                                </div>

                                                <div className="pt-4 border-t border-gray-100">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <FormLabel label="Tour Route (Nights Setup)" info="Add nights to your trip to define the itinerary duration" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newDays = parseInt(formData.days || 1, 10) + 1;
                                                                setFormData(prev => ({ ...prev, days: newDays.toString() }));
                                                            }}
                                                            className="bg-white px-3 py-1.5 rounded-xl border-2 border-gray-100 text-[9px] font-black text-[#14532d] hover:bg-green-50 active:scale-95 transition-all shadow-sm"
                                                        >
                                                            + ADD NIGHT
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {packageDestinations.map((row, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm group animate-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                                <div className="w-10 py-1 rounded-lg bg-green-50 flex flex-col items-center justify-center shrink-0 border border-green-100">
                                                                    <span className="text-[7px] font-black text-[#14532d] uppercase">Night</span>
                                                                    <span className="text-xs font-black text-[#14532d] leading-none">{i + 1}</span>
                                                                </div>
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
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const currentDays = parseInt(formData.days || 1, 10);
                                                                        if (currentDays > 1) {
                                                                            setFormData(prev => ({ ...prev, days: (currentDays - 1).toString() }));
                                                                        }
                                                                    }}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <X size={14} />
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
                                                        <FormLabel label="Offer Price" required info="The discounted price shown to users" />
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
                                                        <FormLabel label="Regular Price" optional info="Strikethrough price for comparison" />
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
                                                    <FormLabel label="Total Duration (Days)" info="Calculated based on nights + 1" />
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

                                {/* IMAGES */}
                                <Section title="Marketing Images" active={activeSection === 'images'}>
                                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                        <div className="grid grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <FormLabel label="Header Image" info="Large banner shown at the top of the package page" />
                                                <div className="aspect-[21/9] w-full bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d] transition-all cursor-pointer">
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
                                                                    className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                                                                >
                                                                    <X size={20} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-6">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Header</p>
                                                            <p className="text-[8px] text-gray-300 mt-1">Recommended: 1920x800px</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        name="header_image"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            handleFileChange(e);
                                                            if (e.target.files[0]) {
                                                                setHeaderPreview(URL.createObjectURL(e.target.files[0]));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {formData.header_image && <p className="text-[10px] text-center font-bold text-[#14532d] uppercase tracking-widest">New Header Selected</p>}
                                                {errors.header_image && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">⚠ {errors.header_image}</p>}
                                            </div>

                                            <div className="space-y-4">
                                                <FormLabel label="Card Image" info="Thumbnail image shown in listings and search results" />
                                                <div className="aspect-[4/3] w-full bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d] transition-all cursor-pointer">
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
                                                                    className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                                                                >
                                                                    <X size={20} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-6">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mx-auto mb-3">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Card</p>
                                                            <p className="text-[8px] text-gray-300 mt-1">Recommended: 800x600px</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        name="card_image"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            handleFileChange(e);
                                                            if (e.target.files[0]) {
                                                                setCardPreview(URL.createObjectURL(e.target.files[0]));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {formData.card_image && <p className="text-[10px] text-center font-bold text-[#14532d] uppercase tracking-widest">New Card Selected</p>}
                                                {errors.card_image && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">⚠ {errors.card_image}</p>}
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

                                                <div className="p-8 space-y-8">
                                                    <div className="grid grid-cols-3 gap-8">
                                                        <div className="col-span-2 space-y-6">
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <FormLabel label="Day Description" required />
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Master Template:</span>
                                                                        <select
                                                                            value={row.master_template}
                                                                            onChange={(e) => handleMasterTemplateChange(i, e.target.value)}
                                                                            className="bg-green-50/50 border border-green-100 px-3 py-1 rounded-lg text-[10px] font-black text-[#14532d] uppercase tracking-widest focus:ring-0 focus:outline-none cursor-pointer hover:bg-green-100/50 transition-colors"
                                                                        >
                                                                            <option value="">Manual Entry</option>
                                                                            {(() => {
                                                                                const currentDest = getDestinationForDay(i);
                                                                                const destSpecificMasters = currentDest && currentDest !== "---" ? (groupedItineraryMasters[currentDest] || []) : [];
                                                                                const globalMasters = groupedItineraryMasters["Global / General"] || [];
                                                                                return (
                                                                                    <>
                                                                                        {destSpecificMasters.length > 0 && (
                                                                                            <optgroup label={`${currentDest} Templates`}>
                                                                                                {destSpecificMasters.map(m => (
                                                                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                                                                ))}
                                                                                            </optgroup>
                                                                                        )}
                                                                                        <optgroup label="General Templates">
                                                                                            {globalMasters.map(m => (
                                                                                                <option key={m.id} value={m.id}>{m.name}</option>
                                                                                            ))}
                                                                                        </optgroup>
                                                                                    </>
                                                                                );
                                                                            })()}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <textarea
                                                                    value={row.description}
                                                                    onChange={(e) => {
                                                                        const copy = [...itineraryDays];
                                                                        copy[i].description = e.target.value;
                                                                        setItineraryDays(copy);
                                                                    }}
                                                                    rows="8"
                                                                    placeholder="Describe the day's adventure in detail..."
                                                                    className="w-full bg-white border-2 border-gray-100 p-5 rounded-2xl text-sm text-gray-700 leading-relaxed focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] focus:outline-none transition-all hover:border-gray-200 resize-none"
                                                                />
                                                            </div>

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

                                {/* POLICY & TRIP INFO */}
                                <Section title="Trip Information" active={activeSection === 'policy'}>
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-4 bg-[#14532d] rounded-full"></div>
                                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Inclusions</h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => addRow(setInclusions, "")}
                                                        className="px-3 py-1.5 rounded-lg bg-green-100 text-[#14532d] text-[10px] font-black uppercase tracking-widest hover:bg-[#14532d] hover:text-white transition-all"
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {inclusions.map((inc, i) => (
                                                        <div key={i} className="flex gap-2 group animate-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                            <div className="flex-1">
                                                                <Input
                                                                    value={inc}
                                                                    onChange={(e) => {
                                                                        const copy = [...inclusions];
                                                                        copy[i] = e.target.value;
                                                                        setInclusions(copy);
                                                                    }}
                                                                    placeholder="e.g. Round trip economy class airfare"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRow(setInclusions, i)}
                                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-red-50/30 rounded-2xl p-8 border border-red-100/50">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                                        <h3 className="text-xs font-black text-red-900/40 uppercase tracking-widest">Exclusions</h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => addRow(setExclusions, "")}
                                                        className="px-3 py-1.5 rounded-lg bg-red-100/50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {exclusions.map((exc, i) => (
                                                        <div key={i} className="flex gap-2 group animate-in slide-in-from-right-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                            <div className="flex-1">
                                                                <Input
                                                                    value={exc}
                                                                    onChange={(e) => {
                                                                        const copy = [...exclusions];
                                                                        copy[i] = e.target.value;
                                                                        setExclusions(copy);
                                                                    }}
                                                                    placeholder="e.g. Personal expenses like laundry, drinks"
                                                                    className="border-red-100 focus:border-red-400 focus:ring-red-400/10 placeholder:text-red-200"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRow(setExclusions, i)}
                                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-red-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HolidayPackageEdit;
