import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const SupplierManage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/suppliers/`);
            setSuppliers(response.data);
            setFilteredSuppliers(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setError(`Failed to load suppliers: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = suppliers.filter(supplier =>
            supplier.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredSuppliers(filtered);
    }, [searchTerm, suppliers]);

    const handleEdit = (supplier) => {
        navigate(`/admin/suppliers/edit/${supplier.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/suppliers/${id}/`);
                setMessage("Supplier deleted successfully!");
                fetchSuppliers();
            } catch (err) {
                console.error("Error deleting supplier:", err);
                setError("Failed to delete supplier. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">Manage Suppliers</h1>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchSuppliers}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                            >
                                Refresh List
                            </button>
                            <button
                                onClick={() => navigate("/admin/suppliers/add")}
                                className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition"
                            >
                                <Plus size={16} />
                                Add New Supplier
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
                                placeholder="Search by company, person, city or service..."
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
                            <table className="w-full">
                                <thead className="bg-[#14532d] text-white">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Company Name</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Contact Person</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Services</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Contact No</th>
                                        <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Location</th>
                                        <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSuppliers.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">
                                                {searchTerm ? "No suppliers match your search" : "No suppliers found. Add your first supplier!"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSuppliers.map((supplier) => (
                                            <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-gray-900 border-r">{supplier.company_name}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{supplier.contact_person}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">
                                                    <div className="flex flex-wrap gap-1">
                                                        {supplier.services?.map((service, idx) => (
                                                            <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                                                {service}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{supplier.contact_no}</td>
                                                <td className="py-4 px-6 text-gray-600 border-r">{supplier.city}, {supplier.country}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => handleEdit(supplier)}
                                                            className="px-3 py-1.5 bg-[#1f7a45] text-white rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm flex items-center gap-1.5"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(supplier.id)}
                                                            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition shadow-sm flex items-center gap-1.5"
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierManage;
