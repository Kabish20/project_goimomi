import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, Plane, ChevronRight, Edit2, Trash2, MapPin, RefreshCcw, Landmark
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AirportManage = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/airports/");
      setAirports(response.data || []);
    } catch (err) {
      console.error("Error fetching airports:", err);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Airport Management</h1>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => fetchAirports()} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100 shadow-sm">
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => navigate("/admin/management-country/airports/add")} className="px-5 py-2.5 rounded-full bg-[#14532d] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-[1.03] transition-all flex items-center gap-2 border border-green-800">
              <Plus size={12} /> NEW AIRPORT
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={14} />
              <input type="text" placeholder="Search by name, IATA code, or city..." className="w-full bg-white border border-gray-100 pl-11 pr-5 py-3 rounded-2xl text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
             <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 whitespace-nowrap">Airport & Code</th>
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 whitespace-nowrap">City Location</th>
                      <th className="px-6 py-3.5 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400 text-[9px] uppercase tracking-[0.3em] font-black animate-pulse">Syncing Airports...</td></tr>
                    ) : filtered.length === 0 ? (
                       <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400 text-[9px] uppercase tracking-[0.3em] font-black">No matching records found</td></tr>
                    ) : (
                      filtered.map((item) => (
                        <tr key={item.id} className="group hover:bg-[#fcfdfc] transition-all">
                          <td className="px-6 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-sm shrink-0">
                                <Plane size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-gray-900 tracking-tight truncate">{item.name}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 opacity-60">IATA: {item.iata_code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2.5">
                            <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-red-400 shrink-0" />
                              <span className="text-[11px] font-bold text-gray-700 truncate">{item.city_name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 text-right">
                             <div className="flex items-center justify-end gap-1.5 text-gray-400">
                                <button onClick={() => navigate(`/admin/management-country/airports/edit/${item.id}`)} className="w-7 h-7 flex items-center justify-center hover:text-[#14532d] hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-green-100"><Edit2 size={13} /></button>
                                <button className="w-7 h-7 flex items-center justify-center hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 size={13} /></button>
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

export default AirportManage;
