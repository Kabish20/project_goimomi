import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Calendar } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CruiseCalendarManage = () => {
    const [calendars, setCalendars] = useState([]);
    const [filteredCalendars, setFilteredCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchCalendars();
    }, []);

    const fetchCalendars = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${API_BASE_URL}/cruise-calendar/`);
            const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
            setCalendars(data);
            setFilteredCalendars(data);
            setError("");
        } catch (err) {
            console.error("Error fetching calendars:", err);
            setError(`Failed to load cruise calendars: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = calendars.filter(cal =>
            cal.cruise_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.itinerary?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCalendars(filtered);
    }, [searchTerm, calendars]);

    const handleEdit = (cal) => {
        navigate(`/admin/cruise-calendar/edit/${cal.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this calendar entry?")) {
            try {
                setLoading(true);
                await api.delete(`${API_BASE_URL}/cruise-calendar/${id}/`);
                setMessage("Calendar entry deleted successfully!");
                fetchCalendars();
            } catch (err) {
                console.error("Error deleting calendar:", err);
                setError("Failed to delete calendar. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar className="text-[#14532d]" />
                            Manage Cruise Calendar
                        </h1>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchCalendars}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                            >
                                Refresh List
                            </button>
                            <button
                                onClick={() => navigate("/admin/cruise-calendar/add")}
                                className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition"
                            >
                                <Plus size={16} />
                                Add New Entry
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by cruise type or itinerary..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded flex justify-between items-center">
                            <span>{message}</span>
                            <button onClick={() => setMessage("")}>✕</button>
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded flex justify-between items-center">
                            <span>{error}</span>
                            <button onClick={() => setError("")}>✕</button>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
                            <p className="mt-2 text-gray-600">Processing...</p>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-[#14532d] text-white">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Itinerary</th>
                                        {months.map(m => (
                                            <th key={m} className="text-center py-3 px-2 font-semibold uppercase text-xs tracking-wider">{m}</th>
                                        ))}
                                        <th className="text-center py-3 px-4 font-semibold uppercase text-xs tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCalendars.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan={months.length + 3} className="text-center py-10 text-gray-500 font-medium">
                                                {searchTerm ? "No entries match your search" : "No calendar entries found. Add your first entry!"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCalendars.map((cal) => (
                                            <tr key={cal.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-gray-900 border-r">{cal.cruise_type}</td>
                                                <td className="py-3 px-4 text-gray-600 border-r">{cal.itinerary}</td>
                                                {months.map(m => {
                                                    const val = cal[m.toLowerCase()];
                                                    return (
                                                        <td key={m} className="py-3 px-2 text-center text-gray-600 border-r font-medium">
                                                            {val ? (
                                                                <span className="text-green-600 truncate max-w-[50px] inline-block" title={val}>{val}</span>
                                                            ) : (
                                                                <span className="text-gray-300">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(cal)}
                                                            className="p-1.5 bg-[#1f7a45] text-white rounded-md hover:bg-[#1a6338] transition shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cal.id)}
                                                            className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CruiseCalendarManage;
