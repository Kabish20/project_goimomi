import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Anchor, Edit2, Trash2, RefreshCcw, Ship, X, Check, Save, AlertCircle, MapPin
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CruiseTerminalManage = () => {
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState(null);

  // Modal states
  const [formData, setFormData] = useState({ terminal_name: "", cruise_name: "", cruise_code: "", city: "" });
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTerminals();
    fetchCities();
  }, []);

  const fetchTerminals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/cruise-terminals/");
      setTerminals(response.data || []);
    } catch (err) {
      console.error("Error fetching terminals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (search = "") => {
    try {
      const response = await api.get(`/api/cities/${search ? `?search=${search}` : ""}`);
      setCities(response.data || []);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleOpenModal = (terminal = null) => {
    if (terminal) {
      setEditingTerminal(terminal);
      setFormData({
        terminal_name: terminal.terminal_name,
        cruise_name: terminal.cruise_name || "",
        cruise_code: terminal.cruise_code || "",
        city: terminal.city
      });
      setCitySearch(terminal.city_name || "");
      setCities([]);
    } else {
      setEditingTerminal(null);
      setFormData({ terminal_name: "", cruise_name: "", cruise_code: "", city: "" });
      setCitySearch("");
      setCities([]);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.terminal_name || !formData.city) {
      showToast("Terminal name and city are required.", "error");
      return;
    }

    try {
      setIsSaving(true);
      if (editingTerminal) {
        await api.put(`/api/cruise-terminals/${editingTerminal.id}/`, formData);
        showToast("Terminal updated successfully!");
      } else {
        await api.post("/api/cruise-terminals/", formData);
        showToast("New terminal added!");
      }
      setShowModal(false);
      fetchTerminals();
    } catch (err) {
      console.error("Error saving terminal:", err);
      showToast("Error saving cruise terminal.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this terminal?")) return;
    try {
      await api.delete(`/api/cruise-terminals/${id}/`);
      showToast("Terminal deleted.");
      fetchTerminals();
    } catch {
      showToast("Failed to delete terminal.", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = terminals.filter(t =>
    t.terminal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cruise_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cruise_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.city_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 right-8 px-6 py-3 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-wider shadow-2xl z-[100] border border-white/20 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 ${toast.type === "success" ? "bg-cyan-600 text-white" : "bg-red-600 text-white"
            }`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </div>
        )}

        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">Cruise Terminal Management</h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Control global maritime ports</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => fetchTerminals()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-cyan-50 hover:text-cyan-600 transition-all border border-gray-100 shadow-sm"
              title="Refresh"
            >
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-2 rounded-xl bg-[#14532d] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 border border-green-800"
            >
              <Plus size={14} /> NEW TERMINAL
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search terminals, cruises or codes..."
                className="w-full bg-white border-2 border-gray-100 pl-14 pr-6 py-3 rounded-2xl text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-cyan-500/5 focus:border-cyan-500 transition-all shadow-xl shadow-gray-100/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden min-h-[500px]">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[200px]">Terminal & Cruise Info</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[180px]">Location & Identity</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 min-w-[180px]">Admin Region</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-cyan-500/10 border-t-cyan-500"></div>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">Syncing Maritime Hubs...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                            <Ship size={40} className="text-gray-400" />
                            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">No matching ports found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => (
                        <tr key={item.id} className="group hover:bg-[#fcfdfc] transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 flex items-center justify-center text-blue-600 border border-cyan-100/50 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                <Ship size={15} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-1.5 truncate uppercase" title={item.terminal_name}>{item.terminal_name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60 truncate">{item.cruise_name || "Merchant Hub"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-orange-400 shrink-0" />
                                <span className="text-[12px] font-bold text-gray-800">{item.city_name || "Unassigned"}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Anchor size={12} className="text-cyan-400 shrink-0" />
                                <span className="px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-600 text-[9px] font-black border border-cyan-100/50 uppercase tracking-tight">{item.cruise_code || "PORT"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5 whitespace-nowrap">Admin Region</span>
                              <span className="text-[12px] font-bold text-gray-700 uppercase truncate">{item.region_name || "Primary Region"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-gray-400 font-bold">
                              <button
                                onClick={() => handleOpenModal(item)}
                                className="w-7 h-7 flex items-center justify-center hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all border border-gray-50 hover:border-cyan-100 bg-white shadow-sm"
                                title="Edit Terminal"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-7 h-7 flex items-center justify-center hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-gray-50 hover:border-red-100 bg-white shadow-sm"
                                title="Delete Terminal"
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
              <div className="bg-gradient-to-r from-cyan-600 to-[#14532d] px-6 py-4 text-white rounded-t-[2rem]">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-black uppercase tracking-tighter">{editingTerminal ? "Edit Terminal" : "Add New Terminal"}</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">{editingTerminal ? `Editing ID: #${editingTerminal.id}` : "Register a new maritime port"}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-5 rounded-b-[2rem] bg-[#fcfdfc]">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Terminal Name</label>
                  <input
                    required
                    value={formData.terminal_name}
                    onChange={e => setFormData({ ...formData, terminal_name: e.target.value })}
                    placeholder="e.g. Aarhus Cruise Terminal"
                    className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/5 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cruise Name</label>
                    <input
                      value={formData.cruise_name}
                      onChange={e => setFormData({ ...formData, cruise_name: e.target.value })}
                      placeholder="e.g. Royal Caribbean"
                      className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-cyan-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cruise Code</label>
                    <input
                      value={formData.cruise_code}
                      onChange={e => setFormData({ ...formData, cruise_code: e.target.value.toUpperCase() })}
                      placeholder="e.g. RCCL"
                      className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-2.5 rounded-2xl text-xs font-black text-gray-900 focus:outline-none focus:border-cyan-600 transition-all text-center placeholder:font-normal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Assign City / Location</label>
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
                      className="w-full bg-gray-50 border-2 border-gray-100 pl-11 pr-5 py-2.5 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/5 transition-all"
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
                            className="w-full text-left px-4 py-2 hover:bg-cyan-50 rounded-xl text-[11px] font-bold text-gray-800 transition-colors flex justify-between items-center"
                          >
                            <span>{c.name}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">{c.country_name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {formData.city && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-cyan-600 text-white rounded-full p-0.5">
                        <Check size={10} />
                      </div>
                    )}
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
                    className="flex-[2] bg-cyan-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                    {editingTerminal ? "Update Terminal" : "Add Terminal"}
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

export default CruiseTerminalManage;
