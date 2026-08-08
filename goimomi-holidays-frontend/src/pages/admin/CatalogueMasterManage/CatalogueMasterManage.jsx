import React, { useState, useEffect } from "react";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import api from "../../../api";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  ListPlus,
  Tag
} from "lucide-react";

const CatalogueMasterManage = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [filteredCatalogues, setFilteredCatalogues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Modals state
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedCatForSub, setSelectedCatForSub] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ type: null, id: null, name: "" });

  // Catalogue Form State
  const [catForm, setCatForm] = useState({
    name: "",
    code: "",
    description: "",
    is_active: true,
    sub_catalogues: []
  });

  // Multiple Sub Catalogues Form State (For bulk add modal)
  const [bulkSubItems, setBulkSubItems] = useState([
    { name: "", order: 1, is_active: true }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCatalogues = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cataloguemasters/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setCatalogues(data);
      setFilteredCatalogues(data);
    } catch (err) {
      console.error("Error fetching catalogues:", err);
      setError("Failed to load Catalogue Masters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  // Check URL query for action=add
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "add") {
      handleOpenAddCat();
    }
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = catalogues;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.code?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term) ||
          c.sub_catalogues?.some(s => s.name?.toLowerCase().includes(term))
      );
    }
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((c) => c.is_active === isActive);
    }
    setFilteredCatalogues(result);
  }, [searchTerm, statusFilter, catalogues]);

  // Open Catalogue Add Modal
  const handleOpenAddCat = () => {
    setEditingCat(null);
    setCatForm({
      name: "",
      code: "",
      description: "",
      is_active: true,
      sub_catalogues: [{ name: "", order: 1, is_active: true }]
    });
    setShowCatModal(true);
    setError("");
    setMessage("");
  };

  // Open Catalogue Edit Modal
  const handleOpenEditCat = (cat) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name || "",
      code: cat.code || "",
      description: cat.description || "",
      is_active: cat.is_active ?? true,
      sub_catalogues: cat.sub_catalogues?.length > 0 ? cat.sub_catalogues : []
    });
    setShowCatModal(true);
    setError("");
    setMessage("");
  };

  // Handle adding dynamic sub-catalogue row in Catalogue Modal
  const handleAddSubRow = () => {
    setCatForm(prev => ({
      ...prev,
      sub_catalogues: [
        ...prev.sub_catalogues,
        { name: "", order: prev.sub_catalogues.length + 1, is_active: true }
      ]
    }));
  };

  const handleRemoveSubRow = (index) => {
    setCatForm(prev => ({
      ...prev,
      sub_catalogues: prev.sub_catalogues.filter((_, i) => i !== index)
    }));
  };

  const handleSubRowChange = (index, field, value) => {
    setCatForm(prev => {
      const updated = [...prev.sub_catalogues];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sub_catalogues: updated };
    });
  };

  // Submit Catalogue (Create / Edit)
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      setError("Catalogue Master Name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      const payload = {
        name: catForm.name.trim(),
        code: catForm.code.trim() || null,
        description: catForm.description.trim() || null,
        is_active: catForm.is_active,
        sub_catalogues: catForm.sub_catalogues
          .filter(s => s.name && s.name.trim() !== "")
          .map((s, idx) => ({ name: s.name.trim(), order: idx + 1, is_active: true }))
      };

      if (editingCat) {
        await api.put(`/api/cataloguemasters/${editingCat.id}/`, payload);
        setMessage("Catalogue Master updated successfully!");
      } else {
        await api.post("/api/cataloguemasters/", payload);
        setMessage("Catalogue Master created successfully!");
      }

      setShowCatModal(false);
      fetchCatalogues();
    } catch (err) {
      console.error("Error saving catalogue master:", err);
      const errMsg = err.response?.data?.code?.[0] || err.response?.data?.name?.[0] || "Failed to save Catalogue Master.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk Sub Catalogues Modal Handlers
  const handleOpenAddSubBulk = (cat) => {
    setSelectedCatForSub(cat);
    setBulkSubItems([
      { name: "", order: (cat.sub_catalogues?.length || 0) + 1, is_active: true }
    ]);
    setShowAddSubModal(true);
    setError("");
  };

  const handleAddBulkRow = () => {
    setBulkSubItems(prev => [
      ...prev,
      { name: "", order: prev.length + (selectedCatForSub?.sub_catalogues?.length || 0) + 1, is_active: true }
    ]);
  };

  const handleRemoveBulkRow = (index) => {
    setBulkSubItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleBulkSubChange = (index, field, value) => {
    setBulkSubItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleBulkSubSubmit = async (e) => {
    e.preventDefault();
    const validSubs = bulkSubItems
      .filter(s => s.name && s.name.trim() !== "")
      .map((s, idx) => ({ name: s.name.trim(), order: idx + 1, is_active: true }));

    if (validSubs.length === 0) {
      setError("Please fill in at least one Sub-Catalogue name.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await api.post(`/api/cataloguemasters/${selectedCatForSub.id}/addsubcatalogues/`, validSubs);
      setMessage(`Successfully added ${validSubs.length} sub-catalogue(s)!`);
      setShowAddSubModal(false);
      fetchCatalogues();
    } catch (err) {
      console.error("Error adding sub-catalogues:", err);
      setError("Failed to add sub-catalogues.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Action
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      setSubmitting(true);
      if (deleteConfirm.type === "catalogue") {
        await api.delete(`/api/cataloguemasters/${deleteConfirm.id}/`);
        setMessage("Catalogue Master deleted successfully!");
      } else if (deleteConfirm.type === "sub") {
        await api.delete(`/api/subcatalogues/${deleteConfirm.id}/`);
        setMessage("Sub Catalogue deleted successfully!");
      }
      setDeleteConfirm({ type: null, id: null, name: "" });
      fetchCatalogues();
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen text-slate-800 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <div className="p-3 sm:p-5 space-y-4 max-w-6xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[10px] uppercase tracking-wider mb-0.5">
                <Layers size={14} /> Product Master
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Catalogue Master Management
              </h1>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Manage master catalogues and attach multiple sub-catalogues effortlessly.
              </p>
            </div>
            <button
              onClick={handleOpenAddCat}
              className="flex items-center justify-center gap-1.5 bg-[#14532d] hover:bg-[#1a6b3d] text-white font-bold px-4 py-2 rounded-lg text-xs shadow-xs transition-all shrink-0"
            >
              <Plus size={14} />
              Add Catalogue Master
            </button>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-medium shadow-xs">
              <span className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600" /> {message}
              </span>
              <button onClick={() => setMessage("")} className="text-emerald-600 hover:text-emerald-800">
                <X size={16} />
              </button>
            </div>
          )}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs font-medium shadow-xs">
              <span className="flex items-center gap-2">
                <XCircle size={14} className="text-rose-600" /> {error}
              </span>
              <button onClick={() => setError("")} className="text-rose-600 hover:text-rose-800">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search & Filter Control */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search catalogues or sub-catalogues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <button
                onClick={fetchCatalogues}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors border border-gray-200"
                title="Refresh List"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Catalogues Cards / List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCatalogues.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-xs">
              <Layers size={40} className="mx-auto text-gray-300 mb-2" />
              <h3 className="text-sm font-bold text-gray-700">No Catalogue Masters Found</h3>
              <p className="text-gray-400 text-xs mt-0.5">Get started by creating your first Catalogue Master.</p>
              <button
                onClick={handleOpenAddCat}
                className="mt-3 px-3.5 py-1.5 bg-[#14532d] hover:bg-[#1a6b3d] text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Catalogue Master
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCatalogues.map((cat) => {
                const isExpanded = expandedId === cat.id;
                const subsCount = cat.sub_catalogues?.length || 0;

                return (
                  <div
                    key={cat.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs transition-all hover:shadow-sm"
                  >
                    {/* Main Row */}
                    <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3 cursor-pointer flex-1" onClick={() => setExpandedId(isExpanded ? null : cat.id)}>
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 border border-emerald-100">
                          <Layers size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 hover:text-emerald-800 transition-colors">
                              {cat.name}
                            </h2>
                            {cat.code && (
                              <span className="px-1.5 py-0.5 bg-gray-100 text-emerald-800 text-[10px] font-mono font-semibold rounded border border-gray-200">
                                {cat.code}
                              </span>
                            )}
                            {cat.is_active ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle size={10} /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                <XCircle size={10} /> Inactive
                              </span>
                            )}
                          </div>
                          {cat.description && (
                            <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">{cat.description}</p>
                          )}
                          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-3">
                            <span>
                              Sub Catalogues: <strong className="text-gray-700">{subsCount}</strong>
                            </span>
                            <span>ID: #{cat.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleOpenAddSubBulk(cat)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md border border-emerald-200 transition-colors flex items-center gap-1"
                          title="Add Sub Catalogues"
                        >
                          <ListPlus size={12} /> + Sub Catalogue
                        </button>
                        <button
                          onClick={() => handleOpenEditCat(cat)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Edit Catalogue Master"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: "catalogue", id: cat.id, name: cat.name })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Catalogue Master"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Sub Catalogues Drawer */}
                    {isExpanded && (
                      <div className="bg-slate-50 border-t border-gray-200 p-3 sm:p-4 space-y-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1.5">
                            <Tag size={12} className="text-emerald-700" />
                            Sub Catalogues ({subsCount})
                          </h4>
                          <button
                            onClick={() => handleOpenAddSubBulk(cat)}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Sub Catalogues
                          </button>
                        </div>

                        {subsCount === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-xs bg-white rounded-lg border border-dashed border-gray-200">
                            No Sub Catalogues added yet.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {cat.sub_catalogues.map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-white border border-gray-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-2 shadow-2xs text-xs font-bold text-gray-800 transition-colors"
                              >
                                <span>{sub.name}</span>
                                <button
                                  onClick={() => setDeleteConfirm({ type: "sub", id: sub.id, name: sub.name })}
                                  className="text-gray-400 hover:text-rose-600 transition-colors"
                                  title="Delete Sub Catalogue"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Catalogue Add/Edit Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Layers className="text-emerald-700" size={16} />
                {editingCat ? "Edit Catalogue Master" : "Add Catalogue Master"}
              </h3>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCatSubmit} className="p-4 overflow-y-auto space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Catalogue Master Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. International Holiday Packages"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Code / Slug (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INTL-CAT"
                    value={catForm.code}
                    onChange={(e) => setCatForm({ ...catForm, code: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catForm.is_active}
                      onChange={(e) => setCatForm({ ...catForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-gray-700">Is Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter catalogue description..."
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Sub Catalogues Section */}
              <div className="pt-2.5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Tag size={14} className="text-emerald-700" />
                    Sub Catalogues ({catForm.sub_catalogues.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSubRow}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold rounded-md transition-colors flex items-center gap-1 border border-emerald-200"
                  >
                    <Plus size={12} /> Add Sub Catalogue Row
                  </button>
                </div>

                {catForm.sub_catalogues.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">No sub-catalogues added to this master yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {catForm.sub_catalogues.map((sub, idx) => (
                      <div key={idx} className="bg-gray-50/80 p-2 rounded-lg border border-gray-200 flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Sub Catalogue Name *"
                          value={sub.name}
                          onChange={(e) => handleSubRowChange(idx, "name", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-md px-2.5 py-1 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSubRow(idx)}
                          className="text-gray-400 hover:text-rose-600 p-1 shrink-0"
                          title="Remove Row"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#14532d] hover:bg-[#1a6b3d] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Saving..." : editingCat ? "Update Catalogue" : "Save Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Sub Catalogues Modal */}
      {showAddSubModal && selectedCatForSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <ListPlus className="text-emerald-700" size={16} />
                  Add Multiple Sub Catalogues
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">To: <strong className="text-emerald-800">{selectedCatForSub.name}</strong></p>
              </div>
              <button onClick={() => setShowAddSubModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBulkSubSubmit} className="p-4 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Sub Catalogues to Add</span>
                <button
                  type="button"
                  onClick={handleAddBulkRow}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold rounded-md flex items-center gap-1 border border-emerald-200"
                >
                  <Plus size={12} /> Add Row
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {bulkSubItems.map((sub, idx) => (
                  <div key={idx} className="bg-gray-50/80 p-2 rounded-lg border border-gray-200 flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Sub Catalogue Name *"
                      value={sub.name}
                      onChange={(e) => handleBulkSubChange(idx, "name", e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md px-2.5 py-1 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {bulkSubItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBulkRow(idx)}
                        className="text-gray-400 hover:text-rose-600 p-1 shrink-0"
                        title="Remove Row"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubModal(false)}
                  className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#14532d] hover:bg-[#1a6b3d] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Adding..." : "Add Sub Catalogues"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.id && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-sm p-5 text-center shadow-xl">
            <Trash2 size={32} className="mx-auto text-rose-500 mb-2" />
            <h3 className="text-sm font-bold text-gray-900">Confirm Delete</h3>
            <p className="text-gray-500 text-xs mt-1">
              Are you sure you want to delete <strong className="text-gray-800">"{deleteConfirm.name}"</strong>?
              {deleteConfirm.type === "catalogue" && " All associated sub-catalogues will also be deleted."}
            </p>
            <div className="flex justify-center gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirm({ type: null, id: null, name: "" })}
                className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogueMasterManage;
