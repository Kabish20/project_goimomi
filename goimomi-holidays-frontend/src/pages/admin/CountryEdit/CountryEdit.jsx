import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save, ArrowLeft, Globe, Trash2, Flag, Layers, MapPin,
  Plane, Truck, Anchor, ChevronRight, ChevronDown, Plus,
  Check, X, RefreshCcw, Edit2, AlertCircle, CheckCircle2
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

/* ═══════════════════════════════════════
   INLINE EDIT COMPONENT
═══════════════════════════════════════ */
const InlineEdit = ({ value, onSave, placeholder = "Click to edit..." }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    if (draft.trim()) onSave(draft.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <span className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
          className="border-2 border-[#14532d] rounded-lg px-2.5 py-1 text-[12px] font-bold text-gray-900 focus:outline-none bg-white min-w-[160px] shadow-sm"
        />
        <button onClick={commit} className="w-6 h-6 rounded-lg bg-[#14532d] flex items-center justify-center text-white hover:bg-green-700 transition-all shadow-sm">
          <Check size={11} />
        </button>
        <button onClick={() => { setDraft(value); setEditing(false); }} className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all">
          <X size={11} />
        </button>
      </span>
    );
  }
  return (
    <span
      className="group/ie inline-flex items-center gap-2 cursor-pointer hover:text-[#14532d] transition-colors"
      onClick={e => { e.stopPropagation(); setDraft(value); setEditing(true); }}
      title="Click to edit"
    >
      <span className="font-bold">{value || <span className="text-gray-300 font-normal italic text-[11px]">{placeholder}</span>}</span>
      <Edit2 size={10} className="opacity-0 group-hover/ie:opacity-50 transition-opacity text-[#14532d] shrink-0" />
    </span>
  );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const CountryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  const [nationalities, setNationalities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [orphanCities, setOrphanCities] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState(new Set());

  // draft states for new items
  const [newNat, setNewNat] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newCityDraft, setNewCityDraft] = useState({});   // { [regionId]: string }
  const [newAirport, setNewAirport] = useState({});        // { [cityId]: { name, iata_code } }
  const [showAirportForm, setShowAirportForm] = useState({}); // { [cityId]: bool }

  const [newPickupPoint, setNewPickupPoint] = useState({});   // { [cityId]: { name } }
  const [showPickupForm, setShowPickupForm] = useState({});   // { [cityId]: bool }

  const [newTerminal, setNewTerminal] = useState({});         // { [cityId]: { terminal_name, cruise_name, cruise_code } }
  const [showTerminalForm, setShowTerminalForm] = useState({}); // { [cityId]: bool }

  /* ── toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── fetch all ── */
  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      setFetching(true);
      const [cRes, natRes, regRes, citRes, airRes, pickRes, termRes] = await Promise.all([
        api.get(`/api/countries/${id}/`),
        api.get(`/api/nationalities/?country_id=${id}`),
        api.get(`/api/regions/?country_id=${id}`),
        api.get(`/api/cities/?country_id=${id}`),
        api.get(`/api/airports/?country_id=${id}`),
        api.get(`/api/pickup-point-masters/?country_id=${id}`),
        api.get(`/api/cruise-terminals/?country_id=${id}`),
      ]);

      setCountryName(cRes.data.name);
      setNationalities(natRes.data);

      const airports = airRes.data;
      const pickups = pickRes.data;
      const terminals = termRes.data;

      const cities = citRes.data.map(c => ({
        ...c,
        airports: airports.filter(a => a.city === c.id),
        pickup_points: pickups.filter(p => p.city === c.id),
        cruise_terminals: terminals.filter(t => t.city === c.id),
      }));

      const regs = regRes.data.map(r => ({
        ...r,
        cities: cities.filter(c => c.region === r.id),
      }));

      setRegions(regs);
      setOrphanCities(cities.filter(c => !c.region));

      // auto-expand all regions
      setExpandedRegions(new Set(regs.map(r => r.id)));
    } catch (e) {
      console.error(e);
      showToast("Failed to load county data.", "error");
    } finally {
      setFetching(false);
    }
  };

  /* ═══════════ COUNTRY ═══════════ */
  const saveCountry = async () => {
    if (!countryName.trim()) return showToast("Country name is required.", "error");
    try {
      setLoading(true);
      await api.put(`/api/countries/${id}/`, { name: countryName.trim() });
      showToast("Country name updated!");
    } catch { showToast("Failed to update country.", "error"); }
    finally { setLoading(false); }
  };

  const deleteCountry = async () => {
    if (!window.confirm("Delete this country? All related data will also be affected.")) return;
    try {
      await api.delete(`/api/countries/${id}/`);
      navigate("/admin/management-country");
    } catch { showToast("Failed to delete (may be in use).", "error"); }
  };

  /* ═══════════ NATIONALITY ═══════════ */
  const addNationality = async () => {
    if (!newNat.trim()) return;
    try {
      const res = await api.post("/api/nationalities/", { name: newNat.trim(), country: parseInt(id) });
      setNationalities(p => [...p, res.data]);
      setNewNat("");
      showToast("Nationality added!");
    } catch { showToast("Could not add nationality.", "error"); }
  };

  const updateNationality = async (natId, name) => {
    try {
      const res = await api.put(`/api/nationalities/${natId}/`, { name, country: parseInt(id) });
      setNationalities(p => p.map(n => n.id === natId ? { ...n, name: res.data.name } : n));
      showToast("Nationality updated!");
    } catch { showToast("Could not update nationality.", "error"); }
  };

  const deleteNationality = async (natId) => {
    if (!window.confirm("Delete this nationality?")) return;
    try {
      await api.delete(`/api/nationalities/${natId}/`);
      setNationalities(p => p.filter(n => n.id !== natId));
      showToast("Nationality removed.");
    } catch { showToast("Could not delete nationality.", "error"); }
  };

  /* ═══════════ REGION ═══════════ */
  const addRegion = async () => {
    if (!newRegion.trim()) return;
    try {
      const res = await api.post("/api/regions/", { name: newRegion.trim(), country: parseInt(id) });
      const newR = { ...res.data, cities: [] };
      setRegions(p => [...p, newR]);
      setExpandedRegions(p => new Set([...p, newR.id]));
      setNewRegion("");
      showToast("Region added!");
    } catch { showToast("Could not add region.", "error"); }
  };

  const updateRegion = async (regId, name) => {
    try {
      await api.put(`/api/regions/${regId}/`, { name, country: parseInt(id) });
      setRegions(p => p.map(r => r.id === regId ? { ...r, name } : r));
      showToast("Region updated!");
    } catch { showToast("Could not update region.", "error"); }
  };

  const deleteRegion = async (regId) => {
    if (!window.confirm("Delete this region and all its cities?")) return;
    try {
      await api.delete(`/api/regions/${regId}/`);
      setRegions(p => p.filter(r => r.id !== regId));
      showToast("Region deleted.");
    } catch { showToast("Could not delete region.", "error"); }
  };

  /* ═══════════ CITY ═══════════ */
  const addCity = async (regionId) => {
    const name = (newCityDraft[regionId] || "").trim();
    if (!name) return;
    try {
      const res = await api.post("/api/cities/", { name, region: regionId, country: parseInt(id) });
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: [...r.cities, { ...res.data, airports: [] }] } : r));
      setNewCityDraft(p => ({ ...p, [regionId]: "" }));
      showToast("City added!");
    } catch { showToast("Could not add city.", "error"); }
  };

  const updateCity = async (cityId, regionId, name) => {
    try {
      await api.put(`/api/cities/${cityId}/`, { name, region: regionId, country: parseInt(id) });
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId ? { ...c, name } : c) } : r));
      showToast("City updated!");
    } catch { showToast("Could not update city.", "error"); }
  };

  const deleteCity = async (cityId, regionId) => {
    if (!window.confirm("Delete this city?")) return;
    try {
      await api.delete(`/api/cities/${cityId}/`);
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.filter(c => c.id !== cityId) } : r));
      showToast("City deleted.");
    } catch { showToast("Could not delete city.", "error"); }
  };

  /* ═══════════ AIRPORT ═══════════ */
  const addAirport = async (cityId, regionId) => {
    const draft = newAirport[cityId] || {};
    const name = (draft.name || "").trim();
    const iata = (draft.iata_code || "").trim().toUpperCase();
    if (!name || !iata) return showToast("Airport name and IATA code are required.", "error");
    try {
      const res = await api.post("/api/airports/", { name, iata_code: iata, city: cityId });
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId ? { ...c, airports: [...c.airports, res.data] } : c) } : r));
      setNewAirport(p => ({ ...p, [cityId]: { name: "", iata_code: "" } }));
      setShowAirportForm(p => ({ ...p, [cityId]: false }));
      showToast("Airport added!");
    } catch { showToast("Could not add airport.", "error"); }
  };

  const deleteAirport = async (airportId, cityId, regionId) => {
    if (!window.confirm("Delete this airport?")) return;
    try {
      await api.delete(`/api/airports/${airportId}/`);
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId
            ? { ...c, airports: c.airports.filter(a => a.id !== airportId) } : c) } : r));
      showToast("Airport deleted.");
    } catch { showToast("Could not delete airport.", "error"); }
  };

  /* ═══════════ PICKUP POINT ═══════════ */
  const addPickupPoint = async (cityId, regionId) => {
    const draft = newPickupPoint[cityId] || {};
    const name = (draft.name || "").trim();
    if (!name) return showToast("Pickup point name is required.", "error");
    try {
      const res = await api.post("/api/pickup-point-masters/", { name, city: cityId });
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId ? { ...c, pickup_points: [...(c.pickup_points || []), res.data] } : c) } : r));
      setNewPickupPoint(p => ({ ...p, [cityId]: { name: "" } }));
      setShowPickupForm(p => ({ ...p, [cityId]: false }));
      showToast("Pickup point added!");
    } catch { showToast("Could not add pickup point.", "error"); }
  };

  const deletePickupPoint = async (pointId, cityId, regionId) => {
    if (!window.confirm("Delete this pickup point?")) return;
    try {
      await api.delete(`/api/pickup-point-masters/${pointId}/`);
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId
            ? { ...c, pickup_points: c.pickup_points.filter(p => p.id !== pointId) } : c) } : r));
      showToast("Pickup point deleted.");
    } catch { showToast("Could not delete pickup point.", "error"); }
  };

  /* ═══════════ CRUISE TERMINAL ═══════════ */
  const addTerminal = async (cityId, regionId) => {
    const draft = newTerminal[cityId] || {};
    const name = (draft.terminal_name || "").trim();
    if (!name) return showToast("Terminal name is required.", "error");
    try {
      const res = await api.post("/api/cruise-terminals/", { 
        terminal_name: name, 
        cruise_name: draft.cruise_name || "", 
        cruise_code: draft.cruise_code || "", 
        city: cityId 
      });
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId ? { ...c, cruise_terminals: [...(c.cruise_terminals || []), res.data] } : c) } : r));
      setNewTerminal(p => ({ ...p, [cityId]: { terminal_name: "", cruise_name: "", cruise_code: "" } }));
      setShowTerminalForm(p => ({ ...p, [cityId]: false }));
      showToast("Cruise terminal added!");
    } catch { showToast("Could not add terminal.", "error"); }
  };

  const deleteTerminal = async (termId, cityId, regionId) => {
    if (!window.confirm("Delete this cruise terminal?")) return;
    try {
      await api.delete(`/api/cruise-terminals/${termId}/`);
      setRegions(p => p.map(r => r.id === regionId
        ? { ...r, cities: r.cities.map(c => c.id === cityId
            ? { ...c, cruise_terminals: c.cruise_terminals.filter(t => t.id !== termId) } : c) } : r));
      showToast("Cruise terminal deleted.");
    } catch { showToast("Could not delete terminal.", "error"); }
  };

  const toggleRegion = (regId) => {
    setExpandedRegions(p => {
      const n = new Set(p);
      n.has(regId) ? n.delete(regId) : n.add(regId);
      return n;
    });
  };

  /* ════════════════════════════════
      LOADING STATE
  ════════════════════════════════ */
  if (fetching) return (
    <div className="flex bg-[#f8faf8] h-screen overflow-hidden font-outfit">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#14532d]/20 border-t-[#14532d]" />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Building Hierarchy…</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════
      MAIN RENDER
  ════════════════════════════════ */
  return (
    <div className="flex bg-[#f8faf8] h-screen overflow-hidden font-outfit">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .tree-line { position: relative; }
        .tree-line::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #e9d5ff, #bbf7d0);
          border-radius: 2px;
        }
      `}</style>

      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        {/* ── PAGE HEADER ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#14532d] to-green-600 flex items-center justify-center shadow-lg shadow-green-900/20">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Edit Country</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Master Data</span>
                <ChevronRight size={9} className="text-gray-300" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{countryName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-[#14532d] transition-all border border-gray-100 shadow-sm" title="Refresh">
              <RefreshCcw size={14} />
            </button>
            <button onClick={deleteCountry} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm" title="Delete Country">
              <Trash2 size={14} />
            </button>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider hover:bg-gray-200 transition-all">
              <ArrowLeft size={13} /> Back
            </button>
          </div>
        </div>

        {/* ── TOAST ── */}
        {toast && (
          <div className={`mx-8 mt-4 px-4 py-3 rounded-2xl flex items-center gap-3 text-[11px] font-bold shadow-lg border shrink-0 ${
            toast.type === "success"
              ? "bg-green-50 border-green-100 text-green-800"
              : "bg-red-50 border-red-100 text-red-700"
          }`}>
            {toast.type === "success"
              ? <CheckCircle2 size={15} className="shrink-0 text-green-600" />
              : <AlertCircle size={15} className="shrink-0 text-red-500" />}
            {toast.msg}
          </div>
        )}

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-5">

          {/* ╔══════════════════════════════════╗
              ║  1 — COUNTRY NAME CARD           ║
              ╚══════════════════════════════════╝ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* header stripe */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 via-white to-white border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14532d] to-green-600 flex items-center justify-center shadow-md">
                <Globe size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[8px] font-black text-green-700 uppercase tracking-[0.25em]">Country</p>
                <p className="text-base font-black text-gray-900 leading-tight">{countryName}</p>
              </div>
              <span className="ml-auto px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-wider">ID #{id}</span>
            </div>
            {/* input row */}
            <div className="flex items-end gap-3 p-6">
              <div className="flex-1">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Country Name</label>
                <input
                  value={countryName}
                  onChange={e => setCountryName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveCountry()}
                  placeholder="e.g. United Arab Emirates"
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:ring-4 focus:ring-[#14532d]/5 transition-all bg-gray-50/30"
                />
              </div>
              <button
                onClick={saveCountry}
                disabled={loading}
                className="flex items-center gap-2 bg-[#14532d] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/20 hover:bg-green-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Save size={14} />
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {/* ╔══════════════════════════════════╗
              ║  2 — NATIONALITY CARD            ║
              ╚══════════════════════════════════╝ */}
          <div className="bg-white rounded-3xl border border-blue-100/60 shadow-sm overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                  <Flag size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.25em]">Step 1 of Hierarchy</p>
                  <p className="text-sm font-black text-gray-900 leading-tight">Nationalities</p>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-black">{nationalities.length}</span>
              </div>
            </div>

            {/* list */}
            <div className="divide-y divide-gray-50">
              {nationalities.length === 0 ? (
                <div className="px-6 py-5 flex items-center gap-2 text-gray-300">
                  <Flag size={14} />
                  <span className="text-[11px] font-bold italic">No nationalities added yet</span>
                </div>
              ) : (
                nationalities.map(nat => (
                  <div key={nat.id} className="group flex items-center gap-3 px-6 py-3 hover:bg-blue-50/30 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Flag size={12} className="text-blue-400" />
                    </div>
                    <span className="flex-1 text-[13px] text-gray-800">
                      <InlineEdit value={nat.name} onSave={name => updateNationality(nat.id, name)} />
                    </span>
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">ID #{nat.id}</span>
                    <button
                      onClick={() => deleteNationality(nat.id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* add row */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-dashed border-blue-100 bg-blue-50/20">
              <Flag size={13} className="text-blue-300 shrink-0" />
              <input
                value={newNat}
                onChange={e => setNewNat(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addNationality()}
                placeholder="Type nationality name and press Enter…"
                className="flex-1 bg-white border border-blue-100 rounded-xl px-3.5 py-2 text-[12px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all placeholder:text-gray-300 placeholder:font-normal"
              />
              <button
                onClick={addNationality}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-sm"
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>

          {/* ╔══════════════════════════════════╗
              ║  3 — REGIONS TREE                ║
              ╚══════════════════════════════════╝ */}
          <div className="bg-white rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
                  <Layers size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-purple-500 uppercase tracking-[0.25em]">Step 2 → 3 → 4+ of Hierarchy</p>
                  <p className="text-sm font-black text-gray-900 leading-tight">Regions → Cities → Airports</p>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-black">{regions.length}</span>
              </div>
            </div>

            {/* region list */}
            <div className="divide-y divide-gray-50">
              {regions.length === 0 ? (
                <div className="px-6 py-5 flex items-center gap-2 text-gray-300">
                  <Layers size={14} />
                  <span className="text-[11px] font-bold italic">No regions added yet</span>
                </div>
              ) : (
                regions.map((region, ri) => {
                  const isOpen = expandedRegions.has(region.id);
                  const cityCount = region.cities?.length || 0;
                  const airportCount = region.cities?.reduce((s, c) => s + (c.airports?.length || 0), 0) || 0;

                  return (
                    <div key={region.id}>
                      {/* ── REGION ROW ── */}
                      <div
                        className={`flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-colors group ${isOpen ? "bg-purple-50/40" : "hover:bg-purple-50/20"}`}
                        onClick={() => toggleRegion(region.id)}
                      >
                        {/* expand icon */}
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isOpen ? "bg-purple-500 text-white" : "bg-purple-50 text-purple-400"}`}>
                          {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </div>

                        {/* region icon */}
                        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                          <Layers size={14} className="text-purple-600" />
                        </div>

                        {/* name */}
                        <div className="flex-1">
                          <div className="text-[13px] text-gray-900" onClick={e => e.stopPropagation()}>
                            <InlineEdit value={region.name} onSave={name => updateRegion(region.id, name)} />
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                            Region · ID #{region.id}
                          </p>
                        </div>

                        {/* stats */}
                        <div className="flex items-center gap-3 mr-2">
                          {cityCount > 0 && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-wider">
                              <MapPin size={9} /> {cityCount} {cityCount === 1 ? "City" : "Cities"}
                            </span>
                          )}
                          {airportCount > 0 && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-blue-400 uppercase tracking-wider">
                              <Plane size={9} /> {airportCount}
                            </span>
                          )}
                        </div>

                        {/* delete */}
                        <button
                          onClick={e => { e.stopPropagation(); deleteRegion(region.id); }}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>

                      {/* ── CITY LIST (when open) ── */}
                      {isOpen && (
                        <div className="pl-14 pr-6 pb-4 bg-purple-50/20 space-y-2">
                          {cityCount === 0 && (
                            <div className="flex items-center gap-2 py-2 text-gray-300">
                              <MapPin size={12} />
                              <span className="text-[11px] font-bold italic">No cities in this region yet</span>
                            </div>
                          )}

                          {region.cities?.map(city => (
                            <CityCard
                              key={city.id}
                              city={city}
                              regionId={region.id}
                              onUpdateCity={updateCity}
                              onDeleteCity={deleteCity}
                              
                              onAddAirport={addAirport}
                              onDeleteAirport={deleteAirport}
                              airportDraft={newAirport[city.id] || { name: "", iata_code: "" }}
                              onAirportDraftChange={(field, val) =>
                                setNewAirport(p => ({ ...p, [city.id]: { ...(p[city.id] || {}), [field]: val } }))
                              }
                              showForm={!!showAirportForm[city.id]}
                              onToggleForm={() => setShowAirportForm(p => ({ ...p, [city.id]: !p[city.id] }))}
                              onCloseForm={() => setShowAirportForm(p => ({ ...p, [city.id]: false }))}

                              onAddPickup={addPickupPoint}
                              onDeletePickup={deletePickupPoint}
                              pickupDraft={newPickupPoint[city.id] || { name: "" }}
                              onPickupDraftChange={(field, val) =>
                                setNewPickupPoint(p => ({ ...p, [city.id]: { ...(p[city.id] || {}), [field]: val } }))
                              }
                              showPickupForm={!!showPickupForm[city.id]}
                              onTogglePickupForm={() => setShowPickupForm(p => ({ ...p, [city.id]: !p[city.id] }))}
                              onClosePickupForm={() => setShowPickupForm(p => ({ ...p, [city.id]: false }))}

                              onAddTerminal={addTerminal}
                              onDeleteTerminal={deleteTerminal}
                              terminalDraft={newTerminal[city.id] || { terminal_name: "", cruise_name: "", cruise_code: "" }}
                              onTerminalDraftChange={(field, val) =>
                                setNewTerminal(p => ({ ...p, [city.id]: { ...(p[city.id] || {}), [field]: val } }))
                              }
                              showTerminalForm={!!showTerminalForm[city.id]}
                              onToggleTerminalForm={() => setShowTerminalForm(p => ({ ...p, [city.id]: !p[city.id] }))}
                              onCloseTerminalForm={() => setShowTerminalForm(p => ({ ...p, [city.id]: false }))}

                              navigate={navigate}
                            />
                          ))}

                          {/* ── ADD CITY ── */}
                          <div className="flex items-center gap-2 pt-1 mt-1">
                            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                              <Plus size={12} className="text-red-400" />
                            </div>
                            <input
                              value={newCityDraft[region.id] || ""}
                              onChange={e => setNewCityDraft(p => ({ ...p, [region.id]: e.target.value }))}
                              onKeyDown={e => e.key === "Enter" && addCity(region.id)}
                              placeholder="Add new city to this region…"
                              className="flex-1 bg-white border border-red-100 rounded-xl px-3.5 py-2 text-[12px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all placeholder:text-gray-300 placeholder:font-normal"
                            />
                            <button
                              onClick={() => addCity(region.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-red-600 transition-all shadow-sm"
                            >
                              <Plus size={12} /> City
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* ── ADD REGION ── */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-dashed border-purple-100 bg-purple-50/20">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Plus size={12} className="text-purple-500" />
              </div>
              <input
                value={newRegion}
                onChange={e => setNewRegion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addRegion()}
                placeholder="Type region name and press Enter…"
                className="flex-1 bg-white border border-purple-100 rounded-xl px-3.5 py-2 text-[12px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all placeholder:text-gray-300 placeholder:font-normal"
              />
              <button
                onClick={addRegion}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-purple-600 transition-all shadow-sm"
              >
                <Plus size={12} /> Add Region
              </button>
            </div>
          </div>

          {/* ── ORPHAN CITIES (no region) ── */}
          {orphanCities.length > 0 && (
            <div className="bg-white rounded-3xl border border-amber-100/60 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-3.5 bg-amber-50/50 border-b border-amber-100/40">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
                  <MapPin size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-amber-600 uppercase tracking-[0.25em]">Unassigned Cities</p>
                  <p className="text-sm font-black text-gray-900">Cities without Region</p>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black">{orphanCities.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {orphanCities.map(city => (
                  <div key={city.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <MapPin size={12} className="text-amber-500" />
                    </div>
                    <span className="flex-1 text-[13px] font-bold text-gray-800">{city.name}</span>
                    {city.airports?.length > 0 && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-blue-400">
                        <Plane size={9} /> {city.airports.length}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   CITY CARD
═══════════════════════════════════════ */
const CityCard = ({
  city, regionId,
  onUpdateCity, onDeleteCity,
  onAddAirport, onDeleteAirport,
  airportDraft, onAirportDraftChange,
  showForm, onToggleForm, onCloseForm,
  
  onAddPickup, onDeletePickup,
  pickupDraft, onPickupDraftChange,
  showPickupForm, onTogglePickupForm, onClosePickupForm,

  onAddTerminal, onDeleteTerminal,
  terminalDraft, onTerminalDraftChange,
  showTerminalForm, onToggleTerminalForm, onCloseTerminalForm,

  navigate,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* City header */}
      <div className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-50/60 to-white border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
          <MapPin size={13} className="text-red-500" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] text-gray-900">
            <InlineEdit value={city.name} onSave={name => onUpdateCity(city.id, regionId, name)} />
          </div>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">City · ID #{city.id}</p>
        </div>
        <div className="flex items-center gap-2">
            {city.airports?.length > 0 && <span className="flex items-center gap-1 text-[8px] font-black text-blue-400"> <Plane size={9} /> {city.airports.length}</span>}
            {city.pickup_points?.length > 0 && <span className="flex items-center gap-1 text-[8px] font-black text-amber-500"> <Truck size={9} /> {city.pickup_points.length}</span>}
            {city.cruise_terminals?.length > 0 && <span className="flex items-center gap-1 text-[8px] font-black text-cyan-500"> <Anchor size={9} /> {city.cruise_terminals.length}</span>}
        </div>
        <button
          onClick={() => onDeleteCity(city.id, regionId)}
          className="ml-2 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={10} />
        </button>
      </div>

      <div className="p-3 space-y-4">
        {/* ── AIRPORTS ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Plane size={10} className="text-blue-400" />
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.15em]">Airports</span>
            </div>
            <button
              onClick={onToggleForm}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all"
            >
              <Plus size={9} /> Add
            </button>
          </div>
          {city.airports?.length === 0 && !showForm ? (
            <p className="text-[10px] text-gray-300 font-bold italic pl-1">No airports</p>
          ) : (
            city.airports?.map(airport => (
              <div key={airport.id} className="group/ap flex items-center gap-2 bg-blue-50/40 rounded-xl px-2.5 py-1.5 border border-blue-100/40">
                <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded tracking-wider">{airport.iata_code}</span>
                <span className="flex-1 text-[11px] font-bold text-gray-700 truncate">{airport.name}</span>
                <button onClick={() => onDeleteAirport(airport.id, city.id, regionId)} className="opacity-0 group-hover/ap:opacity-100 text-red-400 hover:text-red-500"><Trash2 size={9} /></button>
              </div>
            ))
          )}
          {showForm && (
            <div className="flex items-center gap-2 pt-1">
              <input autoFocus value={airportDraft.name} onChange={e => onAirportDraftChange("name", e.target.value)} placeholder="Name" className="flex-1 border text-[11px] rounded-lg px-2 py-1" />
              <input value={airportDraft.iata_code} onChange={e => onAirportDraftChange("iata_code", e.target.value.toUpperCase())} placeholder="IATA" maxLength={4} className="w-12 border text-[11px] rounded-lg px-2 py-1 text-center font-black" />
              <button onClick={() => onAddAirport(city.id, regionId)} className="bg-blue-500 text-white p-1 rounded-lg"><Check size={12} /></button>
              <button onClick={onCloseForm} className="bg-gray-100 text-gray-400 p-1 rounded-lg"><X size={12} /></button>
            </div>
          )}
        </div>

        {/* ── PICKUP POINTS ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Truck size={10} className="text-amber-500" />
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.15em]">Pickup Points</span>
            </div>
            <button
              onClick={onTogglePickupForm}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-wider hover:bg-amber-600 hover:text-white transition-all"
            >
              <Plus size={9} /> Add
            </button>
          </div>
          {city.pickup_points?.length === 0 && !showPickupForm ? (
            <p className="text-[10px] text-gray-300 font-bold italic pl-1">No pickup points</p>
          ) : (
            city.pickup_points?.map(point => (
              <div key={point.id} className="group/pp flex items-center gap-2 bg-amber-50/40 rounded-xl px-2.5 py-1.5 border border-amber-100/40">
                <Truck size={10} className="text-amber-400 shrink-0" />
                <span className="flex-1 text-[11px] font-bold text-gray-700 truncate">{point.name}</span>
                <button onClick={() => onDeletePickup(point.id, city.id, regionId)} className="opacity-0 group-hover/pp:opacity-100 text-red-400 hover:text-red-500"><Trash2 size={9} /></button>
              </div>
            ))
          )}
          {showPickupForm && (
            <div className="flex items-center gap-2 pt-1">
              <input autoFocus value={pickupDraft.name} onChange={e => onPickupDraftChange("name", e.target.value)} placeholder="Pickup point name..." className="flex-1 border text-[11px] rounded-lg px-2 py-1" />
              <button onClick={() => onAddPickup(city.id, regionId)} className="bg-amber-600 text-white p-1 rounded-lg"><Check size={12} /></button>
              <button onClick={onClosePickupForm} className="bg-gray-100 text-gray-400 p-1 rounded-lg"><X size={12} /></button>
            </div>
          )}
        </div>

        {/* ── CRUISE TERMINALS ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Anchor size={10} className="text-cyan-500" />
              <span className="text-[9px] font-black text-cyan-600 uppercase tracking-[0.15em]">Cruise Terminals</span>
            </div>
            <button
              onClick={onToggleTerminalForm}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-50 text-cyan-600 text-[8px] font-black uppercase tracking-wider hover:bg-cyan-600 hover:text-white transition-all"
            >
              <Plus size={9} /> Add
            </button>
          </div>
          {city.cruise_terminals?.length === 0 && !showTerminalForm ? (
            <p className="text-[10px] text-gray-300 font-bold italic pl-1">No cruise terminals</p>
          ) : (
            city.cruise_terminals?.map(term => (
              <div key={term.id} className="group/ct flex flex-col bg-cyan-50/40 rounded-xl px-2.5 py-1.5 border border-cyan-100/40">
                <div className="flex items-center gap-2">
                    <Anchor size={10} className="text-cyan-400 shrink-0" />
                    <span className="flex-1 text-[11px] font-bold text-gray-700 truncate">{term.terminal_name}</span>
                    <button onClick={() => onDeleteTerminal(term.id, city.id, regionId)} className="opacity-0 group-hover/ct:opacity-100 text-red-400 hover:text-red-500"><Trash2 size={9} /></button>
                </div>
                {term.cruise_name && (
                    <p className="text-[8px] font-black text-cyan-600 uppercase tracking-widest mt-0.5 ml-4 opacity-70">
                        {term.cruise_name} {term.cruise_code && `(${term.cruise_code})`}
                    </p>
                )}
              </div>
            ))
          )}
          {showTerminalForm && (
            <div className="space-y-2 pt-1 border-t border-dashed border-cyan-100 mt-1">
              <input autoFocus value={terminalDraft.terminal_name} onChange={e => onTerminalDraftChange("terminal_name", e.target.value)} placeholder="Terminal name..." className="w-full border text-[11px] rounded-lg px-2 py-1" />
              <div className="flex gap-2">
                <input value={terminalDraft.cruise_name} onChange={e => onTerminalDraftChange("cruise_name", e.target.value)} placeholder="Cruise name (opt)" className="flex-1 border text-[11px] rounded-lg px-2 py-1" />
                <input value={terminalDraft.cruise_code} onChange={e => onTerminalDraftChange("cruise_code", e.target.value)} placeholder="Code" className="w-16 border text-[11px] rounded-lg px-2 py-1" />
                <button onClick={() => onAddTerminal(city.id, regionId)} className="bg-cyan-600 text-white px-2 rounded-lg hover:bg-cyan-700"><Check size={12} /></button>
                <button onClick={onCloseTerminalForm} className="bg-gray-100 text-gray-400 px-2 rounded-lg"><X size={12} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryEdit;



