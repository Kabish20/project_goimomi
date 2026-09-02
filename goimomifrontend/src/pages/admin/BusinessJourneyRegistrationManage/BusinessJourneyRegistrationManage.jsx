import React, { useState, useEffect } from "react";
import api from "../../../api";
import {
  Search,
  Eye,
  Trash2,
  Mail,
  Phone,
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Save,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  Users,
  RefreshCw
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import { useNavigate } from "react-router-dom";

const BusinessJourneyRegistrationManage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReg, setSelectedReg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [journeyFilter, setJourneyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/business-journey-registrations/`);
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      setRegistrations(data);
      setFilteredRegistrations(data);
      setError("");
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError(`Failed to load business registrations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = registrations;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (reg) =>
          reg.full_name?.toLowerCase().includes(term) ||
          reg.company_name?.toLowerCase().includes(term) ||
          reg.phone?.toLowerCase().includes(term) ||
          reg.email?.toLowerCase().includes(term) ||
          reg.whatsapp_number?.toLowerCase().includes(term) ||
          reg.journey?.toLowerCase().includes(term)
      );
    }

    if (journeyFilter !== "all") {
      result = result.filter(
        (reg) => (reg.journey || "").toLowerCase().includes(journeyFilter.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (reg) => (reg.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredRegistrations(result);
  }, [searchTerm, journeyFilter, statusFilter, registrations]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...selectedReg });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await api.patch(`${API_BASE_URL}/business-journey-registrations/${selectedReg.id}/`, editForm);
      const updated = { ...selectedReg, ...editForm };
      setSelectedReg(updated);
      setFilteredRegistrations(filteredRegistrations.map((r) => (r.id === updated.id ? updated : r)));
      setRegistrations(registrations.map((r) => (r.id === updated.id ? updated : r)));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update registration:", err);
      alert("Failed to update registration.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`${API_BASE_URL}/business-journey-registrations/${id}/`, { status: newStatus });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        setLoading(true);
        await api.delete(`${API_BASE_URL}/business-journey-registrations/${id}/`);
        fetchRegistrations();
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg(null);
        }
      } catch (err) {
        console.error("Error deleting registration:", err);
        setError("Failed to delete registration. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return isNaN(d) ? dateString : d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Contacted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getJourneyBadge = (journey) => {
    const j = (journey || "").toLowerCase();
    if (j.includes("yelagiri")) {
      return "bg-teal-50 text-teal-800 border-teal-200";
    }
    if (j.includes("sri lanka")) {
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    }
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  };

  // Stats calculation
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === "Pending" || !r.status).length;
  const contactedCount = registrations.filter((r) => r.status === "Contacted").length;
  const confirmedCount = registrations.filter((r) => r.status === "Confirmed").length;

  return (
    <div className="flex bg-gray-100 h-full overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  Chithirai & Business Journey Enquiries
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage all enquiries & registrations for Chithirai Global, Yelagiri, Sri Lanka & Business Networking Journeys
                </p>
              </div>
            </div>
            <button
              onClick={fetchRegistrations}
              className="flex items-center gap-2 bg-[#14532d] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#0f4a24] transition shadow-sm"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</p>
                <p className="text-lg font-black text-gray-800">{totalCount}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending</p>
                <p className="text-lg font-black text-amber-700">{pendingCount}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Contacted</p>
                <p className="text-lg font-black text-blue-700">{contactedCount}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Confirmed</p>
                <p className="text-lg font-black text-emerald-700">{confirmedCount}</p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, phone, email, journey..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={journeyFilter}
                onChange={(e) => setJourneyFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
              >
                <option value="all">All Journeys</option>
                <option value="chithirai">Chithirai Global</option>
                <option value="yelagiri">Yelagiri</option>
                <option value="sri lanka">Sri Lanka</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
              <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Loading registrations...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#14532d] text-white">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">
                        Applicant / Company
                      </th>
                      <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">
                        Contact Info
                      </th>
                      <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">
                        Journey
                      </th>
                      <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">
                        Registered Date
                      </th>
                      <th className="text-center py-3 px-4 font-semibold uppercase text-[10px] tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-500 text-xs">
                          {searchTerm
                            ? `No registrations found matching "${searchTerm}".`
                            : "No registrations recorded yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Name & Company */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <div className="font-bold text-xs text-gray-900">{reg.full_name}</div>
                            {reg.company_name ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                                <Building2 size={11} className="text-emerald-700 shrink-0" />
                                <span className="truncate max-w-[180px]">{reg.company_name}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">Individual</span>
                            )}
                          </td>

                          {/* Contact Info */}
                          <td className="py-3 px-4 border-r border-gray-100 text-[11px]">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                                <Phone size={11} className="text-emerald-700 shrink-0" />
                                <a href={`tel:${reg.phone}`} className="hover:underline">
                                  {reg.phone || "—"}
                                </a>
                              </div>
                              {reg.whatsapp_number && (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                                  <MessageCircle size={11} className="shrink-0" />
                                  <a
                                    href={`https://wa.me/${reg.whatsapp_number.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline text-[10px]"
                                  >
                                    {reg.whatsapp_number}
                                  </a>
                                </div>
                              )}
                              {reg.email && (
                                <div className="flex items-center gap-1.5 text-gray-500 text-[10px]">
                                  <Mail size={11} className="shrink-0" />
                                  <a href={`mailto:${reg.email}`} className="hover:underline truncate max-w-[160px]">
                                    {reg.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Journey */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <span
                              className={`inline-block px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${getJourneyBadge(
                                reg.journey
                              )}`}
                            >
                              {reg.journey || "Chithirai Global"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 border-r border-gray-100">
                            <select
                              value={reg.status || "Pending"}
                              onChange={(e) => handleQuickStatusChange(reg.id, e.target.value)}
                              className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border outline-none cursor-pointer transition ${getStatusBadge(
                                reg.status
                              )}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-[11px] text-gray-600 border-r border-gray-100 whitespace-nowrap">
                            {formatDate(reg.created_at)}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                onClick={() => setSelectedReg(reg)}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[10px] font-black uppercase transition shadow-xs"
                              >
                                <Eye size={11} />
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(reg.id)}
                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[10px] font-black uppercase transition shadow-xs"
                              >
                                <Trash2 size={11} />
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

      {/* Registration Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 font-sans animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-slate-50/70">
              <div className="flex-1 pr-4">
                {isEditing ? (
                  <input
                    name="full_name"
                    value={editForm.full_name || ""}
                    onChange={handleEditChange}
                    placeholder="Full Name"
                    className="w-full text-base font-bold text-gray-900 border border-gray-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-[#14532d] outline-none"
                  />
                ) : (
                  <h2 className="text-lg font-black text-gray-900">{selectedReg.full_name}</h2>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${getJourneyBadge(
                      selectedReg.journey
                    )}`}
                  >
                    {selectedReg.journey || "Chithirai Global"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${getStatusBadge(
                      selectedReg.status
                    )}`}
                  >
                    {selectedReg.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase transition"
                  >
                    <Edit size={12} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="flex items-center gap-1 bg-[#14532d] text-white hover:bg-[#0f4a24] px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase disabled:opacity-50"
                    >
                      <Save size={12} /> {isUpdating ? "..." : "Save"}
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedReg(null);
                    setIsEditing(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Quick Contact Action Bar */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 bg-emerald-700 text-white text-center py-2.5 text-xs font-bold uppercase tracking-wider">
              {selectedReg.phone ? (
                <a
                  href={`tel:${selectedReg.phone}`}
                  className="flex items-center justify-center gap-1.5 hover:opacity-80 py-1 transition"
                >
                  <Phone size={13} /> Call
                </a>
              ) : (
                <span className="opacity-50 py-1">No Phone</span>
              )}
              {selectedReg.whatsapp_number ? (
                <a
                  href={`https://wa.me/${selectedReg.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 hover:opacity-80 py-1 transition"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              ) : (
                <span className="opacity-50 py-1">No WhatsApp</span>
              )}
              {selectedReg.email ? (
                <a
                  href={`mailto:${selectedReg.email}`}
                  className="flex items-center justify-center gap-1.5 hover:opacity-80 py-1 transition"
                >
                  <Mail size={13} /> Email
                </a>
              ) : (
                <span className="opacity-50 py-1">No Email</span>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-gray-700">
              {/* Company Details */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Company / Organization
                </p>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Building2 size={15} className="text-emerald-700 shrink-0" />
                  {isEditing ? (
                    <input
                      name="company_name"
                      value={editForm.company_name || ""}
                      onChange={handleEditChange}
                      placeholder="Company Name"
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    <span className="font-bold text-gray-800">
                      {selectedReg.company_name || "Individual / Not Provided"}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile Phone</p>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <Phone size={14} className="text-emerald-700 shrink-0" />
                    {isEditing ? (
                      <input
                        name="phone"
                        value={editForm.phone || ""}
                        onChange={handleEditChange}
                        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      <span className="font-medium">{selectedReg.phone || "—"}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Number</p>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <MessageCircle size={14} className="text-emerald-700 shrink-0" />
                    {isEditing ? (
                      <input
                        name="whatsapp_number"
                        value={editForm.whatsapp_number || ""}
                        onChange={handleEditChange}
                        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      <span className="font-medium">{selectedReg.whatsapp_number || "—"}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Mail size={14} className="text-emerald-700 shrink-0" />
                  {isEditing ? (
                    <input
                      name="email"
                      type="email"
                      value={editForm.email || ""}
                      onChange={handleEditChange}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    <span className="font-medium">{selectedReg.email || "—"}</span>
                  )}
                </div>
              </div>

              {/* Journey & Status Editable Section */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Journey Destination</p>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {isEditing ? (
                      <input
                        name="journey"
                        value={editForm.journey || ""}
                        onChange={handleEditChange}
                        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-gray-800">{selectedReg.journey || "Chithirai Global"}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {isEditing ? (
                      <select
                        name="status"
                        value={editForm.status || "Pending"}
                        onChange={handleEditChange}
                        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="font-bold">{selectedReg.status || "Pending"}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message / Notes */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message / Notes</p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                  {isEditing ? (
                    <textarea
                      name="message"
                      rows={3}
                      value={editForm.message || ""}
                      onChange={handleEditChange}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedReg.message || "No additional message provided."}
                    </p>
                  )}
                </div>
              </div>

              {/* Submission Date */}
              <div className="pt-2 text-[10px] text-gray-400 flex items-center justify-between">
                <span>Registration ID: #{selectedReg.id}</span>
                <span>Submitted: {formatDate(selectedReg.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessJourneyRegistrationManage;
