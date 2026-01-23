import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminCountryManage = () => {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get("/api/countries/");
            setCountries(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching countries:", error);
            setStatusMessage({ text: "Failed to fetch countries", type: "error" });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this country? This might affect linked visas.")) {
            try {
                await axios.delete(`/api/countries/${id}/`);
                setCountries(countries.filter((c) => c.id !== id));
                setStatusMessage({ text: "Country deleted successfully", type: "success" });
            } catch (error) {
                console.error("Error deleting country:", error);
                setStatusMessage({ text: "Failed to delete country", type: "error" });
            }
        }
    };

    const filteredCountries = countries.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">Manage Countries (Headers & Videos)</h1>
                        <button
                            onClick={() => navigate("/admin/countries/add")}
                            className="bg-[#14532d] hover:bg-[#1f7a45] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            ADD COUNTRY
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
                                placeholder="Search countries..."
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
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Name</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Code</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Media</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10">
                                                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredCountries.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-500">
                                                No countries found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCountries.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-gray-900 border-r">{c.name}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{c.code || "-"}</td>
                                                <td className="py-4 px-6 text-center border-r">
                                                    <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                                                        {c.video ? <span className="text-green-600 font-bold">Video ✓</span> : <span>No Video</span>}
                                                        {c.header_image ? <span className="text-green-600 font-bold">Header ✓</span> : <span>No Header</span>}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => navigate(`/admin/countries/edit/${c.id}`)}
                                                            className="flex items-center gap-1.5 bg-[#1f7a45] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(c.id)}
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
                            {filteredCountries.length} countries
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCountryManage;
