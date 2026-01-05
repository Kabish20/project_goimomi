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
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Manage Destinations</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchDestinations}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Refresh List
              </button>
              <button
                onClick={() => navigate("/admin/destinations/add")}
                className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition"
              >
                <Plus size={16} />
                Add New Destination
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search destinations by name, region, city, or country..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#14532d] text-white">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Name</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Region</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">City</th>
                      <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Country</th>
                      <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
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
                        <tr key={destination.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-medium text-gray-900 border-r">{destination.name}</td>
                          <td className="py-4 px-6 text-gray-600 border-r">{destination.region}</td>
                          <td className="py-4 px-6 text-gray-600 border-r">{destination.city}</td>
                          <td className="py-4 px-6 text-gray-600 border-r">{destination.country}</td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center gap-4">
                              <button
                                onClick={() => navigate(`/admin/destinations/edit/${destination.id}`)}
                                className="flex items-center gap-1.5 bg-[#1f7a45] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm"
                              >
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(destination.id)}
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
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default DestinationManage;
