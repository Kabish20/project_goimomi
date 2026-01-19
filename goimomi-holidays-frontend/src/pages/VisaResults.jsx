import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Home, Plane, Calendar, Search } from "lucide-react";

const VisaResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <div className="max-w-6xl mx-auto px-4 py-8">
                {visas.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <p className="text-gray-600 text-lg">No visas found for {goingTo}</p>
                        <button
                            onClick={() => navigate("/visa")}
                            className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                        >
                            Try another search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {visas.map((visa) => (
                            <div
                                key={visa.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Header */}
                                <div className="bg-[#14532d] text-white px-6 py-4">
                                    <h3 className="text-xl font-bold">{visa.title}</h3>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Estimated Arrival */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                                        <CheckCircle size={18} className="text-green-500" />
                                        <span>
                                            Estimated visa arrival by{" "}
                                            <strong className="text-gray-900">{calculateEstimatedArrival(visa.processing_time, departureDate)}</strong>
                                        </span>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-5 gap-4 mb-6">
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 mb-1">Entry</div>
                                            <div className="text-sm font-medium text-gray-900">{visa.entry_type}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 mb-1">Validity</div>
                                            <div className="text-sm font-medium text-gray-900">{visa.validity}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 mb-1">Duration</div>
                                            <div className="text-sm font-medium text-gray-900">{visa.duration}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 mb-1">Documents</div>
                                            <button className="text-sm font-medium text-[#14532d] hover:underline">
                                                View Here
                                            </button>
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 mb-1">Processing Time</div>
                                            <div className="text-sm font-medium text-gray-900">{visa.processing_time}</div>
                                        </div>
                                    </div>

                                    {/* Price and Select */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900">₹{visa.price.toLocaleString()}</span>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <button
                                            onClick={() => handleSelect(visa)}
                                            className="px-8 py-2.5 bg-white border-2 border-[#14532d] text-[#14532d] rounded-lg font-semibold hover:bg-[#14532d] hover:text-white transition-colors"
                                        >
                                            Select
                                        </button>
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
