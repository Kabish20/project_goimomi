import React, { useState, useEffect } from "react";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import api from "../../../api";
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  Link as LinkIcon,
  ShieldCheck
} from "lucide-react";

const LogisticsProviderManage = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    tracking_link: "",
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/logistics-providers/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setProviders(data);
      setFilteredProviders(data);
    } catch (err) {
      console.error("Error fetching logistics providers:", err);
      setError("Failed to load logistics providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = providers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.tracking_link?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((p) => p.is_active === isActive);
    }
    setFilteredProviders(result);
  }, [searchTerm, statusFilter, providers]);

  const handleOpenAdd = () => {
    setForm({ name: "", tracking_link: "", is_active: true });
    setEditingProvider(null);
    setShowAddModal(true);
    setError("");
  };

  const handleOpenEdit = (provider) => {
    setEditingProvider(provider);
    setForm({
      name: provider.name || "",
      tracking_link: provider.tracking_link || "",
      is_active: provider.is_active ?? true
    });
    setShowAddModal(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Logistics Provider Name is required.");
      return;
    }
    if (!form.tracking_link.trim()) {
      setError("Tracking Link is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (editingProvider) {
        await api.put(`/api/logistics-providers/${editingProvider.id}/`, form);
        setMessage(`Provider "${form.name}" updated successfully!`);
      } else {
        await api.post("/api/logistics-providers/", form);
        setMessage(`Provider "${form.name}" added successfully!`);
      }
      setShowAddModal(false);
      setEditingProvider(null);
      fetchProviders();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving logistics provider:", err);
      setError(err.response?.data?.error || "Failed to save logistics provider.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (provider) => {
    const updatedStatus = !provider.is_active;
    try {
      setProviders((prev) =>
        prev.map((p) => (p.id === provider.id ? { ...p, is_active: updatedStatus } : p))
      );
      await api.patch(`/api/logistics-providers/${provider.id}/`, { is_active: updatedStatus });
      setMessage(`"${provider.name}" status updated to ${updatedStatus ? "Active" : "Inactive"}`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error toggling provider status:", err);
      fetchProviders();
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/logistics-providers/${id}/`);
      setProviders((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      setMessage("Logistics provider deleted successfully.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error deleting logistics provider:", err);
      alert("Failed to delete provider.");
    }
  };

  // Pre-seed common Indian couriers if list is empty
  const handleSeedDefaults = async () => {
    const defaults = [
      { name: "Blue Dart", tracking_link: "https://www.bluedart.com/tracking", is_active: true },
      { name: "Delhivery", tracking_link: "https://track.delhivery.com/", is_active: true },
      { name: "DTDC Courier", tracking_link: "https://www.dtdc.in/tracking.asp", is_active: true },
      { name: "India Post", tracking_link: "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx", is_active: true },
      { name: "FedEx", tracking_link: "https://www.fedex.com/fedextrack/", is_active: true },
      { name: "DHL Express", tracking_link: "https://www.dhl.com/in-en/home/tracking.html", is_active: true },
      { name: "The Professional Couriers", tracking_link: "https://www.tpcindia.com/", is_active: true }
    ];

    try {
      setLoading(true);
      for (const item of defaults) {
        await api.post("/api/logistics-providers/", item);
      }
      setMessage("Default Logistics Providers added successfully!");
      fetchProviders();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error seeding defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
              <Truck size={16} /> Admin Master
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Logistics Provider Master</h1>
            <p className="text-xs text-gray-500 mt-1">Manage courier & shipping providers and tracking links for order dispatches.</p>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {providers.length === 0 && !loading && (
              <button
                onClick={handleSeedDefaults}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-4 py-2.5 rounded-xl font-bold text-xs transition border border-emerald-200"
              >
                <ShieldCheck size={16} /> Seed Default Couriers
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#14532d] hover:bg-[#1a6b3d] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md hover:shadow-lg"
            >
              <Plus size={16} /> Add Logistics Provider
            </button>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" /> {message}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logistics provider name or tracking link..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Providers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <RefreshCw size={28} className="animate-spin mr-3 text-green-600" /> Loading logistics providers...
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Truck size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-gray-700">No logistics providers found</p>
              <p className="text-xs mt-1">Click "Add Logistics Provider" or "Seed Default Couriers" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#14532d] text-white">
                  <tr>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">#</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Logistics Provider Name</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Tracking Link URL</th>
                    <th className="text-center py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="text-center py-3.5 px-4 text-xs font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredProviders.map((provider, index) => (
                    <tr key={provider.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-400">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                          <Truck size={16} className="text-emerald-700 shrink-0" />
                          {provider.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={provider.tracking_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline break-all max-w-[360px]"
                        >
                          <LinkIcon size={13} className="shrink-0 text-blue-500" />
                          <span className="truncate">{provider.tracking_link}</span>
                          <ExternalLink size={11} className="shrink-0 opacity-70" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(provider)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                            provider.is_active
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {provider.is_active ? "● Active" : "○ Inactive"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleOpenEdit(provider)}
                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                            title="Edit Provider"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(provider.id)}
                            className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition"
                            title="Delete Provider"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#14532d] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Truck size={20} />
                <h3 className="text-lg font-black">{editingProvider ? "Edit Logistics Provider" : "Add Logistics Provider"}</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Logistics Provider Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Dart Express, Delhivery, DTDC, India Post"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tracking Link URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.bluedart.com/tracking or https://track.delhivery.com/"
                  value={form.tracking_link}
                  onChange={(e) => setForm((p) => ({ ...p, tracking_link: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">This tracking URL will be sent to customers in dispatch emails.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="provider_active"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 text-green-700 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="provider_active" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Set as Active Provider
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#14532d] hover:bg-[#1a6b3d] text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProvider ? "Update Provider" : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <XCircle size={48} className="mx-auto text-red-500" />
            <h3 className="text-lg font-black text-gray-900">Delete Logistics Provider?</h3>
            <p className="text-xs text-gray-500">Are you sure you want to delete this logistics provider? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default LogisticsProviderManage;
