import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const StartingCityManage = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/starting-cities/`);
      setCities(response.data);
      setFilteredCities(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError(`Failed to load cities: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = cities.filter(city =>
      city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleEdit = (city) => {
    setEditingId(city.id);
    setEditForm(city);
    setMessage("");
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setMessage("");
    setError("");
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/starting-cities/${id}/`, editForm);
      setMessage("City updated successfully!");
      setEditingId(null);
      setEditForm({});
      fetchCities();
    } catch (err) {
      console.error("Error updating city:", err);
      setError("Failed to update city. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/starting-cities/${id}/`);
        setMessage("City deleted successfully!");
        fetchCities();
      } catch (err) {
        console.error("Error deleting city:", err);
        setError("Failed to delete city. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Manage Starting Cities</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchCities}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Refresh List
              </button>
              <button
                onClick={() => navigate("/admin/starting-cities/add")}
                className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded hover:bg-[#0f4a24] transition"
              >
                <Plus size={16} />
                Add New City
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
                placeholder="Search cities by name or region..."
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
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">City Name</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Region</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCities.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-10 text-gray-500">
                        {searchTerm ? `No cities match "${searchTerm}"` : "No starting cities found. Add one to get started!"}
                      </td>
                    </tr>
                  ) : (
                    filteredCities.map((city) => (
                      <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 border-r">{city.name}</td>
                        <td className="py-4 px-6 text-gray-600 border-r">{city.region || "-"}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => navigate(`/admin/starting-cities/edit/${city.id}`)}
                              className="flex items-center gap-1.5 bg-[#1f7a45] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#1a6338] transition shadow-sm"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(city.id)}
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

export default StartingCityManage;
