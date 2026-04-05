import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, Globe, ChevronRight, MapPin, Flag, Plane, Truck, Anchor, 
  ArrowRight, Layers, Table as TableIcon, Filter, RefreshCcw, MoreVertical,
  Edit2, Trash2
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CountryManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, countries, nationalities, etc.
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/destination-hierarchy/");
      setData(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching hierarchy data:", err);
      setError("Failed to load management data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = React.useMemo(() => {
    let raw = data.filter(item => {
      const matchesSearch = 
        item.country_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    if (activeTab === "all") return raw;

    const seen = new Set();
    if (activeTab === "countries") {
      return raw.filter(item => {
        if (!item.country_id || seen.has(item.country_id)) return false;
        seen.add(item.country_id);
        return true;
      });
    }
    if (activeTab === "regions") {
      return raw.filter(item => {
        if (!item.region_id || seen.has(item.region_id)) return false;
        seen.add(item.region_id);
        return true;
      });
    }
    if (activeTab === "cities") {
      return raw.filter(item => !!item.city_id);
    }
    if (activeTab === "nationalities") {
      return raw.filter(item => item.nationality && item.nationality !== "—");
    }
    if (activeTab === "airports") {
      let expanded = [];
      raw.forEach(item => {
        if (item.airports && item.airports.length > 0) {
          item.airports.forEach(airport => {
            expanded.push({ ...item, displayed_name: `${airport.name} (${airport.iata_code})`, sub_type: "Airport" });
          });
        }
      });
      return expanded;
    }
    if (activeTab === "pickup-points") {
      let expanded = [];
      raw.forEach(item => {
        if (item.pickup_points && item.pickup_points.length > 0) {
          item.pickup_points.forEach(pp => {
            expanded.push({ ...item, displayed_name: pp.name, sub_type: "Pickup Point" });
          });
        }
      });
      return expanded;
    }
    if (activeTab === "terminals") {
      let expanded = [];
      raw.forEach(item => {
        if (item.cruise_terminals && item.cruise_terminals.length > 0) {
          item.cruise_terminals.forEach(terminal => {
            expanded.push({ ...item, displayed_name: `${terminal.terminal_name} - ${terminal.cruise_name}`, sub_type: "Terminal" });
          });
        }
      });
      return expanded;
    }
    
    return raw;
  }, [data, searchTerm, activeTab]);

  const stats = [
    { label: "Total Countries", value: data.length, icon: <Globe size={18} />, color: "bg-blue-500" },
    { label: "Active Regions", value: "24", icon: <Layers size={18} />, color: "bg-purple-500" },
    { label: "Total Cities", value: "148", icon: <MapPin size={18} />, color: "bg-green-500" },
    { label: "Airports", value: "12", icon: <Plane size={18} />, color: "bg-amber-500" },
  ];

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
      </style>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        
        {/* Action Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Country Management</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchData()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100 shadow-sm"
              title="Refresh Data"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => navigate("/admin/management-country/countries/add")}
              className="px-6 py-2.5 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-green-800"
            >
              <Plus size={14} />
              NEW COUNTRY
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-6">
            

            {/* Hierarchy Tabs & Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex bg-white p-1 rounded-full border border-gray-100 shadow-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "Overview", icon: <TableIcon size={14} /> },
                  { id: "countries", label: "Countries", icon: <Globe size={14} /> },
                  { id: "nationalities", label: "Nationalities", icon: <Flag size={14} /> },
                  { id: "regions", label: "Regions", icon: <Layers size={14} /> },
                  { id: "cities", label: "Cities", icon: <MapPin size={14} /> },
                  { id: "airports", label: "Airports", icon: <Plane size={14} /> },
                  { id: "pickup-points", label: "Pickup Points", icon: <Truck size={14} /> },
                  { id: "terminals", label: "Terminals", icon: <Anchor size={14} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? "bg-[#14532d] text-white shadow-lg shadow-green-900/20" 
                        : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="relative group w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search hierarchy..."
                  className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Hierarchical Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Country</th>
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Nationality</th>
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Region / State</th>
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                        {activeTab === "airports" ? "Airport Details" : 
                         activeTab === "pickup-points" ? "Pickup Point Details" : 
                         activeTab === "terminals" ? "Terminal Details" : "City Details"}
                      </th>
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#14532d]/10 border-t-[#14532d]"></div>
                            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] animate-pulse">Syncing Hierarchy...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                           <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                            <Globe size={48} />
                            <p className="text-gray-900 font-bold text-[9px] uppercase tracking-[0.2em]">No hierarchy data found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, idx) => (
                        <tr key={idx} className="group hover:bg-[#fcfdfc] transition-all">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-[#14532d] group-hover:scale-105 transition-transform border border-green-100/30 shadow-sm relative shrink-0">
                                <Globe size={14} />
                                {row.airports_count > 0 && (
                                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border border-white flex items-center justify-center shadow-sm">
                                    <Plane size={6} className="text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-900 tracking-tight truncate">{row.country_name}</p>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5 opacity-60">
                                  ID: #{row.country_id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                             <div className="flex items-center">
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
                                  row.nationality !== "—" ? "bg-blue-50 text-blue-700 border-blue-100/50" : "bg-gray-50 text-gray-300 border-gray-100/30"
                                }`}>
                                  {row.nationality}
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex flex-col gap-0">
                              <p className={`text-[11px] font-bold truncate max-w-[150px] ${row.region_name !== "—" ? "text-gray-700" : "text-gray-300"}`}>{row.region_name}</p>
                              {row.region_name !== "—" && (
                                <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest opacity-60">ID: #{row.region_id}</p>
                              )}
                            </div>
                          </td>
                           <td className="px-6 py-3">
                              <div className="flex flex-col gap-0.5">
                                 <div className="flex items-center gap-1.5">
                                   {activeTab === "airports" ? <Plane size={10} className="text-blue-400" /> :
                                    activeTab === "pickup-points" ? <Truck size={10} className="text-amber-400" /> :
                                    activeTab === "terminals" ? <Anchor size={10} className="text-cyan-400" /> :
                                    <MapPin size={10} className={row.city_name !== "—" ? "text-red-400" : "text-gray-200"} />}
                                   <p className={`text-[11px] font-black truncate max-w-[150px] ${row.city_name !== "—" || row.displayed_name ? "text-gray-900" : "text-gray-300"}`}>
                                     {row.displayed_name || row.city_name}
                                   </p>
                                 </div>
                                 {!row.displayed_name && (
                                   <div className="flex items-center gap-2 mt-0.5">
                                      {row.airports_count > 0 && <span className="flex items-center gap-0.5 text-[7px] font-bold text-blue-500 uppercase tracking-tighter"><Plane size={6} /> {row.airports_count}</span>}
                                      {row.pickup_points_count > 0 && <span className="flex items-center gap-0.5 text-[7px] font-bold text-amber-600 uppercase tracking-tighter"><Truck size={6} /> {row.pickup_points_count}</span>}
                                      {row.cruise_terminals_count > 0 && <span className="flex items-center gap-0.5 text-[7px] font-bold text-cyan-500 uppercase tracking-tighter"><Anchor size={6} /> {row.cruise_terminals_count}</span>}
                                   </div>
                                 )}
                              </div>
                           </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => navigate(`/admin/management-country/countries/edit/${row.country_id}`)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all border border-gray-100"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Placeholder */}
              <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Showing {filteredData.length} records</p>
                <div className="flex gap-2">
                   <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 text-[8px] font-black uppercase tracking-widest cursor-not-allowed">Prev</button>
                   <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 text-[8px] font-black uppercase tracking-widest cursor-not-allowed">Next</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryManagement;
