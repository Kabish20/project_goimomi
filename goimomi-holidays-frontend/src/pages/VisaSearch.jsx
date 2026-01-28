import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, Plane, Calendar, MapPin, ChevronDown, Zap, ShieldCheck, Headphones } from "lucide-react";
import axios from "axios";

const VisaSearch = () => {
    const navigate = useNavigate();
    const [citizenOf, setCitizenOf] = useState("India");
    const [goingTo, setGoingTo] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    // Country Data State
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dropdown States
    const [showCitizenDropdown, setShowCitizenDropdown] = useState(false);
    const [showGoingToDropdown, setShowGoingToDropdown] = useState(false);
    const [citizenSearch, setCitizenSearch] = useState("India");
    const [goingToSearch, setGoingToSearch] = useState("");
    const [popularDestinations, setPopularDestinations] = useState([]);
    const [popularVisas, setPopularVisas] = useState([]);

    const citizenRef = useRef(null);
    const goingToRef = useRef(null);

    // Fetch Initial Data
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [countriesRes, popularDestRes, popularVisasRes] = await Promise.all([
                    axios.get("/api/countries/"),
                    axios.get("/api/destinations/?is_popular=true"),
                    axios.get("/api/visas/?is_popular=true")
                ]);
                setCountries(countriesRes.data);
                setPopularDestinations(popularDestRes.data);
                setPopularVisas(popularVisasRes.data);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Close dropdowns when clicking outside
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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter countries
    const filteredCitizenCountries = countries.filter(c =>
        c.name.toLowerCase().includes(citizenSearch.toLowerCase())
    );

    const filteredGoingToCountries = countries.filter(c =>
        c.name.toLowerCase().includes(goingToSearch.toLowerCase())
    );

    const handleSearch = () => {
        if (!goingTo) {
            alert("Please select a destination country");
            return;
        }

        const params = new URLSearchParams({
            citizenOf,
            goingTo,
            departureDate: travelDate || "",
            returnDate: returnDate || ""
        });

        navigate(`/visa/results?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Search */}
            <div className="bg-[#14532d] pt-20 pb-32">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center text-white mb-12">
                        <h1 className="text-4xl font-bold mb-3">Visa Services</h1>
                        <p className="text-lg text-green-50">Fast, Reliable & Hassle-Free Visa Processing</p>
                    </div>

                    {/* Search Box - Exact UI Match */}
                    <div className="bg-white rounded-2xl shadow-2xl p-2">
                        <div className="flex flex-col md:flex-row gap-2">
                            {/* Citizen Of */}
                            <div className="flex-1 relative" ref={citizenRef}>
                                <div
                                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                    onClick={() => setShowCitizenDropdown(!showCitizenDropdown)}
                                >
                                    <Home size={20} className="text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-medium">Citizen of</p>
                                        <input
                                            type="text"
                                            value={citizenSearch}
                                            onChange={(e) => {
                                                setCitizenSearch(e.target.value);
                                                setShowCitizenDropdown(true);
                                            }}
                                            className="w-full outline-none text-gray-900 font-medium placeholder:text-gray-400 cursor-pointer"
                                            placeholder="Select country"
                                            onClick={(e) => e.stopPropagation()} // Allow typing without closing
                                        />
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCitizenDropdown ? 'rotate-180' : ''}`} />
                                </div>

                                {showCitizenDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50">
                                        {filteredCitizenCountries.length > 0 ? (
                                            filteredCitizenCountries.map((country) => (
                                                <div
                                                    key={country.id}
                                                    className={`px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center justify-between ${citizenOf === country.name ? 'bg-green-50 text-[#14532d]' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setCitizenOf(country.name);
                                                        setCitizenSearch(country.name);
                                                        setShowCitizenDropdown(false);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <MapPin size={16} className={citizenOf === country.name ? 'text-[#14532d]' : 'text-gray-400'} />
                                                        <span>{country.name}</span>
                                                    </div>
                                                    {citizenOf === country.name && <div className="w-2 h-2 rounded-full bg-[#14532d]" />}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-500 text-center">No countries found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Going To */}
                            <div className="flex-1 relative" ref={goingToRef}>
                                <div
                                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                    onClick={() => setShowGoingToDropdown(!showGoingToDropdown)}
                                >
                                    <Plane size={20} className="text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-medium">Going to</p>
                                        <input
                                            type="text"
                                            value={goingToSearch}
                                            onChange={(e) => {
                                                setGoingToSearch(e.target.value);
                                                setShowGoingToDropdown(true);
                                            }}
                                            className="w-full outline-none text-gray-900 font-medium placeholder:text-gray-400 cursor-pointer"
                                            placeholder="Select destination"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${showGoingToDropdown ? 'rotate-180' : ''}`} />
                                </div>

                                {showGoingToDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50">
                                        {filteredGoingToCountries.length > 0 ? (
                                            filteredGoingToCountries.map((country) => (
                                                <div
                                                    key={country.id}
                                                    className={`px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center justify-between ${goingTo === country.name ? 'bg-green-50 text-[#14532d]' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setGoingTo(country.name);
                                                        setGoingToSearch(country.name);
                                                        setShowGoingToDropdown(false);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <MapPin size={16} className={goingTo === country.name ? 'text-[#14532d]' : 'text-gray-400'} />
                                                        <span>{country.name}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-500 text-center">No countries found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Travel Date */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                                <Calendar size={20} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 font-medium">Departure Date</p>
                                    <input
                                        type="date"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        className="w-full outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Return Date */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                                <Calendar size={20} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 font-medium">Return Date</p>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        className="w-full outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="px-8 py-3 bg-[#14532d] hover:bg-[#0f4a24] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
                            >
                                <Search size={18} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap size={32} className="text-[#14532d]" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">Fast Processing</h3>
                        <p className="text-gray-600 text-sm">Get your visa processed quickly with our express services</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} className="text-[#14532d]" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">100% Secure</h3>
                        <p className="text-gray-600 text-sm">Your data is protected with bank-level security</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Headphones size={32} className="text-[#14532d]" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">24/7 Support</h3>
                        <p className="text-gray-600 text-sm">Our team is always ready to assist you</p>
                    </div>
                </div>
            </div>

            {/* Trending Visa Countries (UAE, Saudi, etc.) */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#14532d] mb-1">Quick Explore</span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending Visa Countries</h2>
                </div>

                <div className="flex flex-wrap gap-4">
                    {["United Arab Emirates", "Saudi Arabia", "Azerbaijan", "Singapore", "Thailand", "Vietnam", "Malaysia", "Qatar"].map((country) => (
                        <button
                            key={country}
                            onClick={() => {
                                setGoingTo(country);
                                setGoingToSearch(country);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-6 py-3 bg-white hover:bg-[#14532d] hover:text-white text-gray-700 rounded-2xl shadow-sm border border-gray-100 font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                        >
                            <MapPin size={14} className="opacity-50" />
                            {country}
                        </button>
                    ))}
                </div>
            </div>

            {/* Popular Destinations for Visa */}
            <div className="max-w-6xl mx-auto px-4 py-20 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Popular Destinations</h2>
                        <p className="text-gray-500 font-medium">Top picks for your next international adventure</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#14532d]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {popularDestinations.map((dest) => (
                            <div
                                key={dest.id}
                                onClick={() => {
                                    setGoingTo(dest.name);
                                    setGoingToSearch(dest.name);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-3 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                    <img
                                        src={dest.card_image || "/placeholder.jpg"}
                                        alt={dest.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-bold text-sm tracking-wide">{dest.name}</h3>
                                        <p className="text-white/70 text-[10px] uppercase font-black tracking-widest">{dest.country}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Popular Visas Section */}
            <div className="bg-gray-100/50 py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#14532d]">Trending Now</span>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Most Applied Visas</h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {popularVisas.map((visa) => (
                            <div
                                key={visa.id}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-transparent transition-all duration-500 group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-[#14532d] transition-colors duration-500">
                                        <Plane className="text-[#14532d] group-hover:text-white transition-colors duration-500" size={24} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starts at</p>
                                        <p className="text-2xl font-black text-[#14532d]">₹{visa.selling_price}</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{visa.title}</h3>
                                <p className="text-gray-500 text-xs font-medium mb-6 uppercase tracking-widest">{visa.country}</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span>Type: <b>{visa.visa_type}</b></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span>Validity: <b>{visa.validity}</b></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        <span>Process: <b>{visa.processing_time}</b></span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/visa/apply/${visa.id}`)}
                                    className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest group-hover:bg-[#14532d] group-hover:text-white transition-all duration-500 shadow-sm"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisaSearch;
