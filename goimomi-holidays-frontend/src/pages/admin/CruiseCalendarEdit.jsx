import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Loader2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CruiseCalendarEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        cruise_type: "",
        itinerary: "",
        jan: "",
        feb: "",
        mar: "",
        apr: "",
        may: "",
        jun: "",
        jul: "",
        aug: "",
        sep: "",
        oct: "",
        nov: "",
        dec: ""
    });

    useEffect(() => {
        fetchCalendarEntry();
    }, [id]);

    const fetchCalendarEntry = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/cruise-calendar/${id}/`);
            setFormData(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching calendar entry:", err);
            setError("Failed to load the calendar entry. It may have been deleted.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");

            if (!formData.cruise_type || !formData.itinerary) {
                setError("Cruise Type and Itinerary are required");
                setSaving(false);
                return;
            }

            await api.put(`${API_BASE_URL}/cruise-calendar/${id}/`, formData);
            navigate("/admin/cruise-calendar");
        } catch (err) {
            console.error("Error updating cruise calendar:", err);
            setError(`Failed to update cruise calendar entry: ${err.response?.data?.message || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const months = [
        { key: 'jan', label: 'January' },
        { key: 'feb', label: 'February' },
        { key: 'mar', label: 'March' },
        { key: 'apr', label: 'April' },
        { key: 'may', label: 'May' },
        { key: 'jun', label: 'June' },
        { key: 'jul', label: 'July' },
        { key: 'aug', label: 'August' },
        { key: 'sep', label: 'September' },
        { key: 'oct', label: 'October' },
        { key: 'nov', label: 'November' },
        { key: 'dec', label: 'December' }
    ];

    if (loading) {
        return (
            <div className="flex bg-gray-100 h-full overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-[#14532d] w-12 h-12 mb-4" />
                    <p className="text-gray-600 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/cruise-calendar")}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                        >
                            <ArrowLeft size={20} />
                            Back to Management
                        </button>

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="bg-[#14532d] p-6 text-white">
                                <h1 className="text-2xl font-bold flex items-center gap-3">
                                    <Calendar />
                                    Edit Cruise Calendar Entry
                                </h1>
                                <p className="text-green-100 mt-1">Modify the schedule for {formData.cruise_type}.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
                                        <span>{error}</span>
                                        <button type="button" onClick={() => setError("")}>✕</button>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Cruise Type <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="cruise_type"
                                            value={formData.cruise_type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Itinerary <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="itinerary"
                                            value={formData.itinerary}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-lg font-bold text-[#14532d] border-b border-green-100 pb-2 mb-6 uppercase tracking-widest">Monthly Availability / Dates</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {months.map(({ key, label }) => (
                                            <div key={key} className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase">{label}</label>
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={formData[key] || ""}
                                                    onChange={handleChange}
                                                    placeholder="Dates or label"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#14532d] outline-none transition text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className={`flex items-center gap-2 px-8 py-3 bg-[#14532d] text-white rounded-lg font-bold hover:bg-[#0f4a24] transition shadow-md ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {saving ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        {saving ? "Updating..." : "Update Calendar Entry"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CruiseCalendarEdit;
