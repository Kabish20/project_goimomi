import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Home, Plane, Calendar, Search, X, Copy, MapPin, ChevronDown } from "lucide-react";

const getImageUrl = (url) => {
    if (!url) return "";
    if (typeof url !== "string") return url;
    if (url.startsWith("http")) {
        return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
    }
    return url;
};

const VisaResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDocPopup, setActiveDocPopup] = useState(null);

    // Search state managed locally for interactivity
    const [citizenOf, setCitizenOf] = useState(searchParams.get("citizenOf") || "India");
    const [goingTo, setGoingTo] = useState(searchParams.get("goingTo") || "");
    const [departureDate, setDepartureDate] = useState(searchParams.get("departureDate") || "");
    const [returnDate, setReturnDate] = useState(searchParams.get("returnDate") || "");

    // Dropdown and Search Logic
    const [countries, setCountries] = useState([]);
    const [showCitizenDropdown, setShowCitizenDropdown] = useState(false);
    const [showGoingToDropdown, setShowGoingToDropdown] = useState(false);
    const [citizenSearch, setCitizenSearch] = useState(searchParams.get("citizenOf") || "India");
    const [goingToSearch, setGoingToSearch] = useState(searchParams.get("goingTo") || "");

    const citizenRef = useRef(null);
    const goingToRef = useRef(null);

    useEffect(() => {
        fetchVisas();
        fetchCountries();
    }, [searchParams.get("goingTo")]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (citizenRef.current && !citizenRef.current.contains(event.target)) {
                setShowCitizenDropdown(false);
            }
            if (goingToRef.current && !goingToRef.current.contains(event.target)) {
                setShowGoingToDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get("/api/countries/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchVisas = async () => {
        const country = searchParams.get("goingTo");
        console.log(`[DEBUG] Fetching visas for destination: "${country}"`);
        if (!country) {
            console.warn("[DEBUG] No country parameter found in URL");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`/api/visas/?country=${encodeURIComponent(country)}`);
            console.log(`[DEBUG] API Response for "${country}":`, response.data);

            // Strict matching to prevent cross-contamination (e.g. USA search showing UAE results)
            const strictFilteredVisas = response.data.filter(v => {
                const match = v.country && v.country.trim().toLowerCase() === country.trim().toLowerCase();
                if (!match) {
                    console.log(`[DEBUG] Filtering out visa "${v.title}" because it belongs to country "${v.country}" but searching for "${country}"`);
                }
                return match;
            });

            console.log(`[DEBUG] Final filtered visas count: ${strictFilteredVisas.length}`);
            setVisas(strictFilteredVisas);
        } catch (error) {
            console.error("[DEBUG] Error fetching visas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchRefresh = () => {
        if (!goingTo) {
            alert("Please select a destination country");
            return;
        }
        const params = new URLSearchParams({
            citizenOf,
            goingTo,
            departureDate,
            returnDate
        });
        setSearchParams(params);
    };

    const filteredCitizenCountries = countries.filter(c =>
        c.name.toLowerCase().includes(citizenSearch.toLowerCase())
    );

    const filteredGoingToCountries = countries.filter(c =>
        c.name.toLowerCase().includes(goingToSearch.toLowerCase())
    );

    const calculateEstimatedArrival = (processingTime, depDate) => {
        if (!depDate) return "N/A";

        try {
            const departure = new Date(depDate);
            if (isNaN(departure.getTime())) return "N/A";

            const processingDays = parseInt(processingTime) || 3;
            const estimatedDate = new Date(departure);
            estimatedDate.setDate(estimatedDate.getDate() - processingDays);

            const day = estimatedDate.getDate();
            const month = estimatedDate.toLocaleDateString('en-GB', { month: 'short' });
            const year = estimatedDate.getFullYear();

            return `${day}${getDaySuffix(day)} ${month}, ${year}`;
        } catch (e) {
            return "N/A";
        }
    };

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const handleSelect = (visa) => {
        navigate(`/visa/apply/${visa.id}`, {
            state: {
                visa,
                citizenOf,
                departureDate,
                returnDate
            }
        });
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Searching for visas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Bar - Sticky & Interactive (Restored) */}
            <div className="bg-white shadow-sm sticky top-0 z-50 py-2">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-2 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                        {/* Citizen Of */}
                        <div className="flex-1 relative" ref={citizenRef}>
                            <div
                                className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
                                onClick={() => setShowCitizenDropdown(!showCitizenDropdown)}
                            >
                                <Home size={16} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Citizen of</p>
                                    <input
                                        type="text"
                                        value={citizenSearch}
                                        onChange={(e) => {
                                            setCitizenSearch(e.target.value);
                                            setShowCitizenDropdown(true);
                                        }}
                                        className="w-full outline-none text-sm text-gray-900 font-bold placeholder:text-gray-300"
                                        placeholder="Country"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showCitizenDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {showCitizenDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-48 overflow-y-auto z-50">
                                    {filteredCitizenCountries.length > 0 ? (
                                        filteredCitizenCountries.map((country) => (
                                            <div
                                                key={country.id}
                                                className={`px-3 py-2 text-sm hover:bg-green-50 cursor-pointer flex items-center gap-2 ${citizenOf === country.name ? 'text-[#14532d] font-bold' : 'text-gray-700'}`}
                                                onClick={() => {
                                                    setCitizenOf(country.name);
                                                    setCitizenSearch(country.name);
                                                    setShowCitizenDropdown(false);
                                                }}
                                            >
                                                {country.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-xs text-gray-400 text-center italic">No results</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Going To */}
                        <div className="flex-1 relative" ref={goingToRef}>
                            <div
                                className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
                                onClick={() => setShowGoingToDropdown(!showGoingToDropdown)}
                            >
                                <Plane size={16} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Going to</p>
                                    <input
                                        type="text"
                                        value={goingToSearch}
                                        onChange={(e) => {
                                            setGoingToSearch(e.target.value);
                                            setShowGoingToDropdown(true);
                                        }}
                                        className="w-full outline-none text-sm text-gray-900 font-bold placeholder:text-gray-300"
                                        placeholder="Destination"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showGoingToDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {showGoingToDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-48 overflow-y-auto z-50">
                                    {filteredGoingToCountries.length > 0 ? (
                                        filteredGoingToCountries.map((country) => (
                                            <div
                                                key={country.id}
                                                className={`px-3 py-2 text-sm hover:bg-green-50 cursor-pointer flex items-center gap-2 ${goingTo === country.name ? 'text-[#14532d] font-bold' : 'text-gray-700'}`}
                                                onClick={() => {
                                                    setGoingTo(country.name);
                                                    setGoingToSearch(country.name);
                                                    setShowGoingToDropdown(false);
                                                }}
                                            >
                                                {country.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-xs text-gray-400 text-center italic">No results</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Departure Date */}
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100">
                            <Calendar size={16} className="text-gray-400" />
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Departure</p>
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="w-full outline-none text-sm text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        {/* Return Date */}
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100">
                            <Calendar size={16} className="text-gray-400" />
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Return</p>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full outline-none text-sm text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearchRefresh}
                            className="px-6 py-2 bg-[#14532d] hover:bg-[#0f4a24] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                        >
                            <Search size={16} />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {visas.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <p className="text-gray-600 text-lg">No visas found for {goingTo}</p>
                        <button
                            onClick={() => navigate("/visa")}
                            className="mt-4 text-[#14532d] hover:text-[#0f4a24] font-semibold"
                        >
                            Try another search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {visas.map((visa) => {
                            console.log(`Visa ID: ${visa.id}`, visa);
                            return (
                                <div
                                    key={visa.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
                                >
                                    {/* Header with Background Image/Video */}
                                    <div className="relative h-20 md:h-24 rounded-t-2xl overflow-hidden bg-[#14532d]">
                                        {visa.card_image && (
                                            <img
                                                src={getImageUrl(visa.card_image)}
                                                alt={visa.title}
                                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#14532d] to-transparent" />
                                        <div className="absolute bottom-3 left-6 text-white">
                                            <h3 className="text-xl md:text-2xl font-bold drop-shadow-md">{visa.title}</h3>
                                            {visa.country_details?.name && (
                                                <p className="text-xs font-medium text-green-100 uppercase tracking-widest">{visa.country_details.name}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-6">
                                        {/* Estimated Arrival Badge */}
                                        <div className="flex items-center gap-3 mb-6 bg-green-50/50 p-2 rounded-lg w-fit">
                                            <CheckCircle size={20} className="text-[#14532d]" fill="white" />
                                            <span className="text-[#14532d] font-medium text-sm">
                                                Estimated visa arrival by <span className="font-bold">{calculateEstimatedArrival(visa.processing_time, departureDate)}</span>
                                            </span>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                            {/* Details Grid */}
                                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-gray-50/50 p-4 rounded-xl w-full">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</span>
                                                    <span className="text-sm font-semibold text-gray-900 line-clamp-1">{visa.visa_type}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entry</span>
                                                    <span className="text-sm font-semibold text-gray-900">{visa.entry_type}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Validity</span>
                                                    <span className="text-sm font-semibold text-gray-900">{visa.validity || "N/A"}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</span>
                                                    <span className="text-sm font-semibold text-gray-900">{visa.duration || "N/A"}</span>
                                                </div>

                                                {/* Documents - Popup */}
                                                <div className="flex flex-col gap-1 relative">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Documents</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDocPopup(activeDocPopup === `doc_${visa.id}` ? null : `doc_${visa.id}`);
                                                        }}
                                                        className="text-sm font-semibold text-[#14532d] hover:underline text-left"
                                                    >
                                                        View Here
                                                    </button>

                                                    {activeDocPopup === `doc_${visa.id}` && (
                                                        <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h4 className="font-bold text-gray-900">Documents</h4>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleCopy(visa.documents_required);
                                                                        }}
                                                                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                                                                    >
                                                                        <Copy size={14} />
                                                                        <span className="text-xs font-medium">Copy</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveDocPopup(null);
                                                                        }}
                                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <ul className="list-disc pl-4 space-y-2">
                                                                {visa.documents_required ? visa.documents_required.split(',').map((doc, idx) => (
                                                                    <li key={idx} className="text-sm text-gray-700 leading-relaxed pl-1">{doc.trim()}</li>
                                                                )) : (
                                                                    <li className="text-sm text-gray-500 italic">No specific documents listed.</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Photography - Popup */}
                                                <div className="flex flex-col gap-1 relative">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Photo</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDocPopup(activeDocPopup === `photo_${visa.id}` ? null : `photo_${visa.id}`);
                                                        }}
                                                        className="text-sm font-semibold text-[#14532d] hover:underline text-left"
                                                    >
                                                        View Here
                                                    </button>

                                                    {activeDocPopup === `photo_${visa.id}` && (
                                                        <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h4 className="font-bold text-gray-900">Photography</h4>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleCopy(visa.photography_required);
                                                                        }}
                                                                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                                                                    >
                                                                        <Copy size={14} />
                                                                        <span className="text-xs font-medium">Copy</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveDocPopup(null);
                                                                        }}
                                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <ul className="list-disc pl-4 space-y-2">
                                                                {visa.photography_required ? visa.photography_required.split(',').map((req, idx) => (
                                                                    <li key={idx} className="text-sm text-gray-700 leading-relaxed pl-1">{req.trim()}</li>
                                                                )) : (
                                                                    <li className="text-sm text-gray-500 italic">No specific photography requirements.</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Processing Time</span>
                                                    <span className="text-sm font-semibold text-gray-900">{visa.processing_time}</span>
                                                </div>
                                            </div>

                                            {/* Price and Action */}
                                            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 min-w-[150px]">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xl font-bold text-gray-900">₹{visa.price.toLocaleString()}</span>
                                                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <button
                                                    onClick={() => handleSelect(visa)}
                                                    className="px-8 py-2 bg-white border border-[#14532d] text-[#14532d] rounded-full font-semibold hover:bg-[#14532d] hover:text-white transition-all text-sm"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisaResults;
