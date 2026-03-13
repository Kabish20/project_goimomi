import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Car, Users, Briefcase, Settings } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const VehicleMasterManage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [brands, setBrands] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicles();
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await api.get("/api/vehicle-brands/");
            setBrands(Array.isArray(response.data) ? response.data : (response.data?.results || []));
        } catch (err) {
            console.error("Error fetching brands:", err);
        }
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/vehicle-masters/");
            const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
            setVehicles(data);
            setFilteredVehicles(data);
            setError("");
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            setError(`Failed to load vehicles: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = vehicles.filter(v => {
            const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.description?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
        setFilteredVehicles(filtered);
    }, [searchTerm, vehicles]);

    const handleEdit = (id) => {
        navigate(`/admin/vehicle-masters/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                setLoading(true);
                await api.delete(`/api/vehicle-masters/${id}/`);
                setMessage("Vehicle deleted successfully!");
                fetchVehicles();
            } catch (err) {
                console.error("Error deleting vehicle:", err);
                setError("Failed to delete vehicle. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">Vehicle Masters</h1>
                            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Manage your vehicle inventory</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={fetchVehicles}
                                className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-700 transition active:scale-95 shadow-lg shadow-gray-900/10"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => navigate("/admin/vehicle-masters/add")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0f4a24] transition active:scale-95 shadow-lg shadow-green-900/10"
                            >
                                <Plus size={16} />
                                Add New Vehicle
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, brand or description..."
                                className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Vehicle Info</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Capacity</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Description</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading && vehicles.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                                                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Inventory...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredVehicles.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic text-sm font-medium">
                                                {searchTerm ? `No vehicles matching "${searchTerm}"` : "No vehicles in inventory."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVehicles.map((v) => (
                                            <tr key={v.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform flex items-center justify-center text-gray-300">
                                                            {v.photo ? (
                                                                <img src={v.photo} alt={v.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Car size={20} />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-xs font-black text-gray-900 tracking-tight truncate uppercase leading-tight">{v.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="px-1.5 py-0.5 bg-green-50 text-[#14532d] text-[8px] font-black rounded border border-green-100/50 uppercase tracking-wider">
                                                                    {v.brand_name}
                                                                </span>
                                                                {v.latest_rate_card_file && (
                                                                    <a 
                                                                        href={v.latest_rate_card_file} 
                                                                        target="_blank" 
                                                                        rel="noreferrer"
                                                                        className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded border border-blue-100/50 uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <FileText size={8} /> Rate Card
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-700 uppercase">
                                                            <div className="flex items-center gap-1.5">
                                                                <Users size={12} className="text-gray-400" />
                                                                <span>{v.seating_capacity} Seats</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Briefcase size={12} className="text-gray-400" />
                                                                <span>{v.luggage_capacity} Bags</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-[10px] text-gray-500 font-medium line-clamp-2 leading-relaxed italic">
                                                        {v.description || "No description provided."}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(v.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(v.id)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
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

export default VehicleMasterManage;
