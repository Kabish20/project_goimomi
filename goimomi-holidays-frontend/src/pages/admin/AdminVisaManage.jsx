import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminVisaManage = () => {
    const [visas, setVisas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchVisas();
    }, []);

    const fetchVisas = async () => {
        try {
            const response = await axios.get("/api/visas/?all=true");
            setVisas(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching visas:", error);
            setStatusMessage({ text: "Failed to fetch visas", type: "error" });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this visa?")) {
            try {
                await axios.delete(`/api/visas/${id}/`);
                setVisas(visas.filter((v) => v.id !== id));
                setStatusMessage({ text: "Visa deleted successfully", type: "success" });
            } catch (error) {
                console.error("Error deleting visa:", error);
                setStatusMessage({ text: "Failed to delete visa", type: "error" });
            }
        }
    };

    const handleStatusToggle = async (visa) => {
        try {
            const updatedVisa = { ...visa, is_active: !visa.is_active };
            await axios.put(`/api/visas/${visa.id}/`, updatedVisa);
            setVisas(visas.map((v) => (v.id === visa.id ? updatedVisa : v)));
            setStatusMessage({
                text: `Visa ${!visa.is_active ? "activated" : "deactivated"} successfully`,
                type: "success",
            });
        } catch (error) {
            console.error("Error toggling visa status:", error);
            setStatusMessage({ text: "Failed to toggle visa status", type: "error" });
        }
    };

    const filteredVisas = visas.filter(
        (v) =>
            v.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">Select visa to change</h1>
                        <button
                            onClick={() => navigate("/admin/visas/add")}
                            className="bg-[#14532d] hover:bg-[#1f7a45] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            ADD VISA
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search visas..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                            />
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex justify-between items-center ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            <span>{statusMessage.text}</span>
                            <button onClick={() => setStatusMessage({ text: "", type: "" })}>✕</button>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#14532d] text-white">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Country</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Title</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Entry Type</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Validity</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Price</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Active</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-10">
                                                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredVisas.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-10 text-gray-500">
                                                No visas found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVisas.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-gray-900 border-r">{v.country}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{v.title}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{v.entry_type}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{v.validity}</td>
                                                <td className="py-4 px-6 text-gray-900 font-medium border-r">₹{v.price}</td>
                                                <td className="py-4 px-6 text-center border-r">
                                                    <button
                                                        onClick={() => handleStatusToggle(v)}
                                                        title={v.is_active ? "Click to deactivate" : "Click to activate"}
                                                        className="hover:scale-110 transition-transform active:scale-95"
                                                    >
                                                        {v.is_active ? (
                                                            <CheckCircle size={24} className="text-green-500 mx-auto" />
                                                        ) : (
                                                            <XCircle size={24} className="text-gray-300 mx-auto" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => navigate(`/admin/visas/edit/${v.id}`)}
                                                            className="flex items-center gap-1.5 bg-[#1f7a45] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(v.id)}
                                                            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700 transition shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
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
                        <div className="p-4 bg-gray-50 border-t text-sm text-gray-500 font-medium">
                            {filteredVisas.length} visas
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVisaManage;
