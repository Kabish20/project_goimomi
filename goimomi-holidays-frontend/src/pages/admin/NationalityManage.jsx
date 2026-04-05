import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, Flag, ChevronRight, Edit2, Trash2, Globe, RefreshCcw, User
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const NationalityManage = () => {
  const [nationalities, setNationalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNationalities();
  }, []);

  const fetchNationalities = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/nationalities/");
      setNationalities(response.data || []);
    } catch (err) {
      console.error("Error fetching nationalities:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = nationalities.filter(n => 
    n.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.country_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Nationality Management</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchNationalities()} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all border border-gray-100">
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => navigate("/admin/management-country/nationalities/add")} className="px-4 py-2 rounded-full bg-[#14532d] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/20 hover:scale-105 transition-all flex items-center gap-2">
              <Plus size={12} /> NEW NATIONALITY
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d]" size={14} />
              <input type="text" placeholder="Search nationalities or countries..." className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
             <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <th className="px-6 py-3 border-b border-gray-100">Nationality</th>
                      <th className="px-6 py-3 border-b border-gray-100">Parent Country</th>
                      <th className="px-6 py-3 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                       <tr><td colSpan="3" className="px-6 py-20 text-center"><div className="flex flex-col items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#14532d]/10 border-t-[#14532d]"></div><p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] animate-pulse">Loading...</p></div></td></tr>
                    ) : filtered.length === 0 ? (
                       <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400 text-[9px] uppercase tracking-[0.3em] font-black">No matching data found</td></tr>
                    ) : (
                      filtered.map((item) => (
                        <tr key={item.id} className="group hover:bg-[#fcfdfc] transition-all">
                          <td className="px-6 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/50 shadow-sm shrink-0">
                                <Flag size={14} />
                              </div>
                              <p className="text-xs font-black text-gray-900 tracking-tight">{item.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-2.5">
                             <div className="flex items-center gap-2">
                              <Globe size={12} className="text-green-400 shrink-0" />
                              <span className="text-[11px] font-bold text-gray-700">{item.country_name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 text-right">
                             <div className="flex items-center justify-end gap-1 text-gray-400">
                                <button 
                                  onClick={() => navigate(`/admin/management-country/nationalities/edit/${item.id}`)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:text-[#14532d] hover:bg-green-50 transition-all font-bold"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button 
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:text-red-600 hover:bg-red-50 transition-all"
                                >
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

export default NationalityManage;
