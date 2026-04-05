import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, MapPin, ChevronRight, Edit2, Trash2, Globe, Layers, 
  Map as MapIcon, Filter, RefreshCcw, Download, Info
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const CityManage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/cities/");
      setCities(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to load cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter(city => 
    city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        
        {/* Action Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase">City Management</h1>
          </div>
          <div className="flex gap-2">
             <button
              onClick={() => fetchCities()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100"
            >
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => navigate("/admin/management-country/cities/add")}
              className="px-4 py-2 rounded-full bg-[#14532d] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus size={12} />
              NEW CITY
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d]" size={14} />
                <input
                  type="text"
                  placeholder="Search cities, regions, or countries..."
                  className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white border border-gray-100 rounded-full py-2 px-4 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-[8px] text-[#14532d] font-black uppercase tracking-widest opacity-60">Total Cities</p>
                   <p className="text-base font-black text-gray-900 leading-none">{filteredCities.length}</p>
                </div>
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-[#14532d]">
                  <MapPin size={14} />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <th className="px-6 py-3 border-b border-gray-100">City Details</th>
                      <th className="px-6 py-3 border-b border-gray-100">Region / State</th>
                      <th className="px-6 py-3 border-b border-gray-100">Country</th>
                      <th className="px-6 py-3 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr>
                        <td colSpan="4" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#14532d]/10 border-t-[#14532d]"></div>
                            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] animate-pulse">Loading Cities...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCities.map((city) => (
                        <tr key={city.id} className="group hover:bg-[#fcfdfc] transition-all">
                          <td className="px-6 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-sm shrink-0">
                                <MapPin size={14} />
                              </div>
                              <p className="text-xs font-black text-gray-900 tracking-tight">{city.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-2.5">
                            <div className="flex items-center gap-2">
                              <Layers size={12} className="text-purple-400 shrink-0" />
                              <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">{city.region_name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-2.5">
                             <div className="flex items-center gap-2">
                              <Globe size={12} className="text-green-400 shrink-0" />
                              <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">{city.country_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 text-right">
                             <div className="flex items-center justify-end gap-1 text-gray-400">
                                <button 
                                  onClick={() => navigate(`/admin/management-country/cities/edit/${city.id}`)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:text-[#14532d] hover:bg-green-50 transition-all"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:text-red-600 hover:bg-red-50 transition-all">
                                  <Trash2 size={13} />
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
    </div>
  );
};

export default CityManage;
