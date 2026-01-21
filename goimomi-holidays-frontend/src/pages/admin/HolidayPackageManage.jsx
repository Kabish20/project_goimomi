import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const HolidayPackageManage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/packages/?all=true`);
      setPackages(response.data);
      setFilteredPackages(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError(`Failed to load packages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = packages.filter(pkg =>
      pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [searchTerm, packages]);

  const handleEdit = (pkg) => {
    navigate(`/admin/packages/edit/${pkg.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/packages/${id}/`);
        setMessage("Package deleted successfully!");
        fetchPackages();
      } catch (err) {
        console.error("Error deleting package:", err);
        setError("Failed to delete package. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusToggle = async (pkg) => {
    try {
      setLoading(true);
      const updatedPkg = { ...pkg, is_active: !pkg.is_active };
      // Sending only necessary data for update if possible, but put usually expects full object
      await axios.put(`${API_BASE_URL}/packages/${pkg.id}/`, updatedPkg);
      setMessage(`Package ${!pkg.is_active ? "activated" : "deactivated"} successfully!`);
      fetchPackages();
    } catch (err) {
      console.error("Error toggling status:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Manage Holiday Packages</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchPackages}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Refresh List
              </button>
              <button
                onClick={() => navigate("/admin/packages/add")}
                className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition"
              >
                <Plus size={16} />
                Add New Package
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
                placeholder="Search packages by name, category, or description..."
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
                    <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Title</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Category</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Start City</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Days</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-xs tracking-wider">Price</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Active</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-xs tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPackages.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-gray-500 font-medium">
                        {searchTerm ? "No packages match your search" : "No packages found. Add your first package!"}
                      </td>
                    </tr>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 border-r">{pkg.title}</td>
                        <td className="py-4 px-6 text-gray-600 border-r">{pkg.category}</td>
                        <td className="py-4 px-6 text-gray-600 border-r">{pkg.starting_city}</td>
                        <td className="py-4 px-6 text-gray-600 border-r">{pkg.days} days</td>
                        <td className="py-4 px-6 text-gray-900 font-bold border-r">₹{pkg.Offer_price}</td>
                        <td className="py-4 px-6 text-center border-r">
                          <button
                            onClick={() => handleStatusToggle(pkg)}
                            title={pkg.is_active ? "Click to deactivate" : "Click to activate"}
                            className="hover:scale-110 transition-transform active:scale-95"
                          >
                            {pkg.is_active ? (
                              <svg className="w-6 h-6 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(pkg)}
                              className="px-3 py-1.5 bg-[#1f7a45] text-white rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm flex items-center gap-1.5"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(pkg.id)}
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

export default HolidayPackageManage;
