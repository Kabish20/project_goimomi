import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Home, Plane, Calendar, Search, X, Copy } from "lucide-react";

const VisaResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDocPopup, setActiveDocPopup] = useState(null);

    const citizenOf = searchParams.get("citizenOf") || "India";
    const goingTo = searchParams.get("goingTo") || "";
    const departureDate = searchParams.get("departureDate") || "";
    const returnDate = searchParams.get("returnDate") || "";

    useEffect(() => {
        if (goingTo) {
            fetchVisas();
        }
    }, [goingTo]);

    const fetchVisas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/visas/?country=${goingTo}`);
            setVisas(response.data);
        } catch (error) {
            console.error("Error fetching visas:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateEstimatedArrival = (processingTime, departureDate) => {
        if (!departureDate) return "N/A";

        const departure = new Date(departureDate);
        const processingDays = parseInt(processingTime) || 3;
        const estimatedDate = new Date(departure);
        estimatedDate.setDate(estimatedDate.getDate() - processingDays);

        const day = estimatedDate.getDate();
        const month = estimatedDate.toLocaleDateString('en-GB', { month: 'short' });
        const year = estimatedDate.getFullYear();

        return `${day}${getDaySuffix(day)} ${month}, ${year}`;
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
        // Optional: Add toast notification here
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
            {/* Search Bar - Sticky */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Citizen Of */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200">
                            <Home size={18} className="text-gray-400" />
                            <div className="flex-1">
                                <div className="text-xs text-gray-400 mb-0.5">Citizen of</div>
                                <div className="text-sm font-medium text-gray-700">{citizenOf}</div>
                            </div>
                        </div>

                        {/* Going To */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200">
                            <Plane size={18} className="text-gray-400" />
                            <div className="flex-1">
                                <div className="text-xs text-gray-400 mb-0.5">Going to</div>
                                <div className="text-sm font-medium text-gray-700">{goingTo}</div>
                            </div>
                        </div>

                        {/* Departure Date */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200">
                            <Calendar size={18} className="text-gray-400" />
                            <div className="flex-1">
                                <div className="text-xs text-gray-400 mb-0.5">Departure Date</div>
                                <div className="text-sm font-medium text-gray-700">{departureDate || "Not specified"}</div>
                            </div>
                        </div>

                        {/* Return Date */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200">
                            <Calendar size={18} className="text-gray-400" />
                            <div className="flex-1">
                                <div className="text-xs text-gray-400 mb-0.5">Return Date</div>
                                <div className="text-sm font-medium text-gray-700">{returnDate || "Not specified"}</div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={() => navigate("/visa")}
                            className="px-6 py-3 bg-[#14532d] hover:bg-[#0f4a24] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Search size={18} />
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
                        {visas.map((visa) => (
                            <div
                                key={visa.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
                            >
                                {/* Header */}
                                <div className="bg-[#14532d] text-white px-6 py-3 rounded-t-2xl">
                                    <h3 className="text-lg font-bold">{visa.title}</h3>
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
                                        <div className="flex-1 grid grid-cols-5 gap-8 bg-gray-50/50 p-4 rounded-xl w-full">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entry</span>
                                                <span className="text-sm font-semibold text-gray-900">{visa.entry_type}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Validity</span>
                                                <span className="text-sm font-semibold text-gray-900">{visa.validity}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</span>
                                                <span className="text-sm font-semibold text-gray-900">{visa.duration}</span>
                                            </div>

                                            {/* Documents - Popup */}
                                            <div className="flex flex-col gap-1 relative">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Documents</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDocPopup(activeDocPopup === visa.id ? null : visa.id);
                                                    }}
                                                    className="text-sm font-semibold text-[#14532d] hover:underline text-left"
                                                >
                                                    View Here
                                                </button>

                                                {activeDocPopup === visa.id && (
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
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisaResults;
