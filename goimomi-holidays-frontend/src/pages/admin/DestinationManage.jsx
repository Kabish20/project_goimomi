import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, ArrowLeft, Search } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const DestinationManage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      console.log("Fetching destinations from:", `${API_BASE_URL}/destinations/`);
      const response = await axios.get(`${API_BASE_URL}/destinations/`);
      console.log("API Response:", response.data);
      setDestinations(response.data);
      setFilteredDestinations(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError(`Failed to load destinations: ${err.message}. Please check if the backend server is running on ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter destinations based on search term
    const filtered = destinations.filter(destination =>
      (destination.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (destination.region || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (destination.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (destination.country || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchTerm, destinations]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/destinations/${id}/`);
        setMessage("Destination deleted successfully!");
        fetchDestinations(); // Refresh list
      } catch (err) {
        console.error("Error deleting destination:", err);
        setError("Failed to delete destination. Please try again.");
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

        <div className="flex-1 overflow-y-auto p-4 bg-[#fcfdfc]">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90 rounded-2xl mb-4 gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter">Destination Inventory</h1>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-green-500">Inventory</span> / <span>Destinations</span> / <span className="text-gray-900">Map Registry</span>
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/admin/destinations/add")}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                ADD DESTINATION
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400 group-focus-within:text-[#14532d] transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search destinations..."
                className="w-full bg-white border-2 border-gray-100 pl-11 pr-10 py-2.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">×</span>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>



          {/* Messages */}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && destinations.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
              <p className="mt-2 text-gray-600">Loading destinations...</p>
            </div>
          ) : (
            /* Destinations List */
            <div className="bg-white rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Location Name</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Country / Region</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Home Display</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDestinations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-gray-500">
                          {searchTerm ? `No destinations match "${searchTerm}"` : "No destinations found. Add one to get started!"}
                        </td>
                      </tr>
                    ) : (
                      filteredDestinations.map((destination) => (
                        <tr key={destination.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0 hover:shadow-inner">
                          <td className="px-6 py-3 font-black text-gray-900 text-xs">{destination.name}</td>
                          <td className="px-6 py-3 text-xs font-bold text-gray-400">{destination.country}</td>
                          <td className="px-6 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${destination.is_popular
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-gray-50 text-gray-400 border-gray-100"
                              }`}>
                              {destination.is_popular ? "POPULAR" : "REGULAR"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigate(`/admin/destinations/edit/${destination.id}`)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(destination.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
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
          )}


        </div>
      </div>
    </div>
  );
};

export default DestinationManage;
