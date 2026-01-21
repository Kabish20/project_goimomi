import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const ItineraryMasterManage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/itinerary-masters/`);
      setItineraries(response.data);
      setFilteredItineraries(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching itineraries:", err);
      setError(`Failed to load itineraries: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = itineraries.filter(itinerary =>
      itinerary.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItineraries(filtered);
  }, [searchTerm, itineraries]);

  const handleEdit = (itinerary) => {
    navigate(`/admin/itinerary-masters/edit/${itinerary.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/itinerary-masters/${id}/`);
        setMessage("Itinerary deleted successfully!");
        fetchItineraries();
      } catch (err) {
        console.error("Error deleting itinerary:", err);
        setError("Failed to delete itinerary. Please try again.");
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
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-gray-800">Manage Itinerary Masters</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchItineraries}
                className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-700 transition"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/admin/itinerary-masters/add")}
                className="flex items-center gap-1.5 bg-[#14532d] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#0f4a24] transition"
              >
                <Plus size={14} />
                Add New
              </button>
            </div>
          </div>
          electoral
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
              />
            </div>
          </div>
          electoral
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

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
              <p className="mt-2 text-gray-600">Loading itineraries...</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14532d] text-white">
                  <tr>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Name (ID)</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Title</th>
                    <th className="text-center py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItineraries.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500 text-sm">
                        {searchTerm ? `No results for "${searchTerm}"` : "No itineraries found."}
                      </td>
                    </tr>
                  ) : (
                    filteredItineraries.map((itinerary) => (
                      <tr key={itinerary.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-gray-900 border-r text-sm">{itinerary.name}</td>
                        <td className="py-2.5 px-4 text-gray-700 border-r font-medium text-sm">{itinerary.title}</td>
                        <td className="py-2.5 px-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(itinerary)}
                              className="flex items-center gap-1.5 text-green-700 font-bold hover:text-green-900 transition text-xs"
                            >
                              <Edit2 size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(itinerary.id)}
                              className="flex items-center gap-1.5 text-red-600 font-bold hover:text-red-800 transition text-xs"
                            >
                              <Trash2 size={12} />
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

export default ItineraryMasterManage;
