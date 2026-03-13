import React, { useState, useEffect } from "react";
import api from "../../api";
import { Search, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const UmrahDestinationManage = () => {
    const [destinations, setDestinations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await api.get("/api/umrah-destinations/");
            setDestinations(Array.isArray(response.data) ? response.data : (response.data?.results || []));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching Umrah destinations:", error);
            setStatusMessage({ text: "Failed to fetch Umrah destinations", type: "error" });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this Umrah destination?")) {
            try {
                await api.delete(`/api/umrah-destinations/${id}/`);
                setDestinations(destinations.filter((d) => d.id !== id));
                setStatusMessage({ text: "Umrah destination deleted successfully", type: "success" });
            } catch (error) {
                console.error("Error deleting Umrah destination:", error);
                setStatusMessage({ text: "Failed to delete Umrah destination", type: "error" });
            }
        }
    };

    const filteredDestinations = destinations.filter(
        (d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-bold text-gray-800">Umrah Destinations</h1>
                        <button
                            onClick={() => navigate("/admin/umrah-destinations/add")}
                            className="bg-[#14532d] hover:bg-[#1f7a45] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm uppercase tracking-wide"
                        >
                            ADD UMRAH DESTINATION
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative max-w-sm">
                            <Search size={16} className="absolute left-3 top-2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search destinations..."
                                className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d] text-xs transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div
                            className={`mb-4 p-3 rounded-lg flex justify-between items-center text-xs ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            <span>{statusMessage.text}</span>
                            <button onClick={() => setStatusMessage({ text: "", type: "" })}>✕</button>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#14532d] text-white">
                                    <tr>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[9px] tracking-wider">City Name</th>
                                        <th className="text-left py-2 px-4 font-semibold uppercase text-[9px] tracking-wider">Country</th>
                                        <th className="text-center py-2 px-4 font-semibold uppercase text-[9px] tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-12">
                                                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredDestinations.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-12 text-gray-500 text-xs">
                                                No Umrah destinations found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDestinations.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-2 px-4 text-[11px] font-medium text-gray-900 border-r border-gray-50">{d.name}</td>
                                                <td className="py-2 px-4 text-[10px] text-gray-600 border-r border-gray-50 uppercase tracking-tight">{d.country}</td>
                                                <td className="py-2 px-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/umrah-destinations/edit/${d.id}`)}
                                                            className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold hover:bg-green-700 transition shadow-sm uppercase tracking-wide"
                                                        >
                                                            <Edit2 size={10} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(d.id)}
                                                            className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold hover:bg-red-700 transition shadow-sm uppercase tracking-wide"
                                                        >
                                                            <Trash2 size={10} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-2 px-4 bg-gray-50/50 border-t text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {filteredDestinations.length} destinations
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UmrahDestinationManage;
