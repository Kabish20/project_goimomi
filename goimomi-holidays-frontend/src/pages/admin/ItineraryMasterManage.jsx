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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
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
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Manage Itinerary Masters</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchItineraries}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Refresh List
              </button>
              <button
                onClick={() => navigate("/admin/itinerary-masters/add")}
                className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition"
              >
                <Plus size={16} />
                Add New Itinerary
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
                placeholder="Search itineraries by name or title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d]"
              />
            </div>
          </div>

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

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14532d] text-white">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Name (ID)</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Title</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Description</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItineraries.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500">
                        {searchTerm ? `No itinerary masters match "${searchTerm}"` : "No itinerary masters found."}
                      </td>
                    </tr>
                  ) : (
                    filteredItineraries.map((itinerary) => (
                      <tr key={itinerary.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 border-r">{itinerary.name}</td>
                        <td className="py-4 px-6 text-gray-700 border-r font-medium">{itinerary.title}</td>
                        <td className="py-4 px-6 text-gray-600 border-r max-w-xs">
                          <p className="line-clamp-2" title={itinerary.description}>
                            {itinerary.description}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleEdit(itinerary)}
                              className="flex items-center gap-1.5 bg-[#1f7a45] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(itinerary.id)}
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
        </div>
      </div>
    </div>
  );
};

export default ItineraryMasterManage;
