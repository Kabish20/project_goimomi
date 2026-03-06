import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search, Package, Image as ImageIcon } from "lucide-react";
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
      const response = await api.get(`${API_BASE_URL}/packages/?all=true`);
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
        await api.delete(`${API_BASE_URL}/packages/${id}/`);
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
      // Use PATCH to only update is_active without needing full package data
      await api.patch(`${API_BASE_URL}/packages/${pkg.id}/`, { is_active: !pkg.is_active });
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
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
      </style>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        {/* Action Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Holiday Package</h1>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
              <span className="text-green-500">Inventory</span> / <span>Packages</span> / <span className="text-gray-900">Live Management</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/admin/packages/add")}
              className="px-6 py-2.5 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              NEW PACKAGE
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats & Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search by package name, destination or details..."
                  className="w-full bg-white border-2 border-gray-100 pl-14 pr-6 py-3.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white border-2 border-green-100 rounded-full py-3 px-6 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[9px] text-[#14532d] font-black uppercase tracking-widest opacity-60">Live Packages</p>
                  <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{filteredPackages.length}</p>
                </div>
                <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-[#14532d]">
                  <Package size={16} />
                </div>
              </div>
            </div>

            {/* Notification Messages */}
            {message && (
              <div className="p-5 bg-green-50 border-2 border-green-100 text-[#14532d] rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl text-lg">✨</div>
                  <p className="font-black text-xs uppercase tracking-wider">{message}</p>
                </div>
                <button onClick={() => setMessage("")} className="text-green-800/50 hover:text-green-800 font-bold px-2">✕</button>
              </div>
            )}
            {error && (
              <div className="p-5 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl text-lg">⚠</div>
                  <p className="font-black text-xs uppercase tracking-wider">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-red-800/50 hover:text-red-800 font-bold px-2">✕</button>
              </div>
            )}

            {/* Packages Table UI */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-green-900/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Package Info</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Details</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Pricing</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Status</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading && packages.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform flex items-center justify-center text-gray-300">
                                <Package size={18} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-black text-gray-900 tracking-tight truncate">{pkg.title || pkg.name}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: #{pkg.h_id || pkg.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-green-50 text-[#14532d] text-[8px] font-black uppercase tracking-wider border border-green-100/50">
                                  {pkg.category || 'Global'}
                                </span>
                                <span className="text-[9px] font-bold text-gray-500 whitespace-nowrap">
                                  {pkg.days} Days / {pkg.starting_city}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-xs font-black text-gray-900 leading-none">₹{pkg.Offer_price?.toLocaleString() || pkg.offer_price?.toLocaleString() || pkg.price?.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleStatusToggle(pkg)}
                              disabled={loading}
                              className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] transition-all border ${pkg.is_active
                                ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                : "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                                }`}
                            >
                              {pkg.is_active ? "LIVE" : "DRAFT"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(pkg)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm group/btn"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(pkg.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm group/btn"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && filteredPackages.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-32 text-center text-gray-300">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                              <Search size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matching packages found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em] py-8">
              End of Inventory Feed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayPackageManage;
