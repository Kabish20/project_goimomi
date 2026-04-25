import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Plane, ChevronRight, Edit2, Trash2, MapPin, RefreshCcw, X, Check, Save, AlertCircle
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const AirportManage = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAirport, setEditingAirport] = useState(null);

  // Modal states
  const [formData, setFormData] = useState({ name: "", iata_code: "", city: "" });
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAirports();
    fetchCities();
  }, []);

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/airports/");
      setAirports(Array.isArray(response.data) ? response.data : (response.data?.results || []));
    } catch (err) {
      console.error("Error fetching airports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (search = "") => {
    try {
      const response = await api.get(`/api/cities/${search ? `?search=${search}` : ""}`);
      setCities(Array.isArray(response.data) ? response.data : (response.data?.results || []));
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleOpenModal = (airport = null) => {
    if (airport) {
      setEditingAirport(airport);
      setFormData({
        name: airport.name,
        iata_code: airport.iata_code,
        city: airport.city
      });
      setCitySearch(airport.city_name || "");
      setCities([]);
    } else {
      setEditingAirport(null);
      setFormData({ name: "", iata_code: "", city: "" });
      setCitySearch("");
      setCities([]);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.iata_code || !formData.city) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      setIsSaving(true);
      if (editingAirport) {
        await api.put(`/api/airports/${editingAirport.id}/`, formData);
        showToast("Airport updated successfully!");
      } else {
        await api.post("/api/airports/", formData);
        showToast("New airport added!");
      }
      setShowModal(false);
      fetchAirports();
    } catch (err) {
      console.error("Error saving airport:", err);
      showToast("Error saving airport. Check if IATA already exists.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this airport?")) return;
    try {
      await api.delete(`/api/airports/${id}/`);
      showToast("Airport deleted.");
      fetchAirports();
    } catch {
      showToast("Failed to delete airport.", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = airports.filter(a =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.iata_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.city_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 right-8 px-6 py-3 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-wider shadow-2xl z-[100] border border-white/20 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">Airport Management</h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Control global airport database</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => fetchAirports()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-[#14532d] transition-all border border-gray-100 shadow-sm"
              title="Refresh"
            >
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-2 rounded-xl bg-[#14532d] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 border border-green-800"
            >
              <Plus size={14} /> NEW AIRPORT
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search by name, IATA code, or city..."
                className="w-full bg-white border-2 border-gray-100 pl-14 pr-6 py-3 rounded-2xl text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all shadow-xl shadow-gray-100/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden min-h-[500px]">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[200px]">Airport & Code</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[180px]">City / Location</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[180px]">Region</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#14532d]/10 border-t-[#14532d]"></div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">Syncing global database...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                            <Plane size={40} className="text-gray-400" />
                            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">No matching records found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => (
                        <tr key={item.id} className="group hover:bg-[#fcfdfc] transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                <Plane size={15} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-1.5 truncate uppercase" title={item.name}>{item.name}</p>
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-black tracking-widest border border-blue-100/50 uppercase">IATA: {item.iata_code}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100/50">
                                <MapPin size={12} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[12px] font-bold text-gray-800 truncate block">{item.city_name || "Unassigned"}</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.country_name || "Unknown"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5 whitespace-nowrap">Admin Region</span>
                              <span className="text-[12px] font-bold text-gray-700 uppercase truncate">{item.region_name || "Global Region"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenModal(item)}
                                className="w-7 h-7 flex items-center justify-center hover:text-[#14532d] hover:bg-green-50 rounded-lg transition-all border border-gray-50 hover:border-green-100 bg-white shadow-sm"
                                title="Edit Airport"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-7 h-7 flex items-center justify-center hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-gray-50 hover:border-red-100 bg-white shadow-sm"
                                title="Delete Airport"
                              >
                                <Trash2 size={12} />
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#14532d] to-green-800 px-6 py-4 text-white rounded-t-[2rem]">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-black uppercase tracking-tighter">{editingAirport ? "Edit Airport" : "Add New Airport"}</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">{editingAirport ? `Editing ID: #${editingAirport.id}` : "Register a new terminal"}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-5 rounded-b-[2rem] bg-[#fcfdfc]">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Airport Full Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Heathrow International Airport"
                    className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:ring-4 focus:ring-[#14532d]/5 transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">IATA Code</label>
                    <input
                      required
                      maxLength={3}
                      value={formData.iata_code}
                      onChange={e => setFormData({ ...formData, iata_code: e.target.value.toUpperCase() })}
                      placeholder="LHR"
                      className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-2.5 rounded-2xl text-xs font-black text-center text-[#14532d] focus:outline-none focus:border-[#14532d] focus:ring-4 focus:ring-[#14532d]/5 transition-all uppercase"
                    />
                  </div>
                  <div className="col-span-2 relative">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Assign City</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        value={citySearch}
                        onChange={e => {
                          setCitySearch(e.target.value);
                          fetchCities(e.target.value);
                        }}
                        placeholder="Search for city..."
                        className="w-full bg-gray-50 border-2 border-gray-100 pl-11 pr-5 py-2.5 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:ring-4 focus:ring-[#14532d]/5 transition-all"
                      />
                      {citySearch && cities.length > 0 && formData.city !== cities[0].id && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-40 overflow-y-auto z-[210] p-2 space-y-1 custom-scrollbar">
                          {cities.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, city: c.id });
                                setCitySearch(c.name);
                                setCities([]);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-green-50 rounded-xl text-[11px] font-bold text-gray-800 transition-colors flex justify-between items-center"
                            >
                              <span>{c.name}</span>
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">{c.country_name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {formData.city && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#14532d] text-white rounded-full p-0.5">
                          <Check size={10} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-[2] bg-[#14532d] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                    {editingAirport ? "Update Airport" : "Add Airport"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AirportManage;



