import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Plus, Save, ArrowLeft, Globe, Flag, Trash2
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const NationalityEdit = () => {
  const { id } = useParams();
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setFetching(true);
      const [nationalityRes, countriesRes] = await Promise.all([
        api.get(`/api/nationalities/${id}/`),
        api.get("/api/countries/")
      ]);
      
      setCountries(countriesRes.data || []);
      setFormData({
        name: nationalityRes.data.name,
        country: nationalityRes.data.country
      });
    } catch (err) {
      console.error("Error fetching nationality details:", err);
      setError("Failed to load details.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Nationality name is required");
    if (!formData.country) return setError("Country is required");

    try {
      setLoading(true);
      await api.put(`/api/nationalities/${id}/`, formData);
      navigate("/admin/management-country/nationalities");
    } catch (err) {
      console.error("Error updating nationality:", err);
      setError("Failed to update nationality.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this nationality?")) return;
    try {
      setLoading(true);
      await api.delete(`/api/nationalities/${id}/`);
      navigate("/admin/management-country/nationalities");
    } catch (err) {
      console.error("Error deleting nationality:", err);
      alert("Failed to delete nationality.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex bg-[#fcfdfc] h-screen items-center justify-center font-outfit text-[#14532d] uppercase font-black text-[10px] animate-pulse">Scanning Nationality Database...</div>;

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit text-[11px] font-bold">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden text-gray-900 uppercase">
        <AdminTopbar />
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 shadow-sm text-gray-900 uppercase tracking-tighter">
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase">Edit Nationality Profile</h1>
            <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1 flex items-center gap-2">
              <span className="text-green-600">Master Data</span> / <span className="text-gray-900">National Records</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100">
                <Trash2 size={14} />
            </button>
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all border border-gray-100 shadow-sm">
                <ArrowLeft size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-2xl mx-auto focus-within:scale-[1.002] transition-transform duration-700">
            <form onSubmit={handleSubmit} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-8 space-y-6">
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Country Origin</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={14} />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] shadow-sm appearance-none cursor-pointer font-bold transition-all"
                      >
                        <option value="">SELECT COUNTRY</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality Name</label>
                    <div className="relative group">
                      <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={14} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Emirati"
                        className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] shadow-sm font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 text-white">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#14532d] py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    {loading ? "SAVING Profile..." : "UPDATE NATIONALITY Record"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-white border border-gray-100 text-gray-400 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-50 hover:text-gray-900 transition-all active:scale-[0.98]"
                  >
                    CANCEL Modify
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalityEdit;



