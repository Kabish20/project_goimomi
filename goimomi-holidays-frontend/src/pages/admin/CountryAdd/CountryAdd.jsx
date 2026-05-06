import React, { useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Save, ArrowLeft, Globe, Flag, MapPin
} from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const CountryAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
    card_image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Country name is required");

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("is_active", formData.is_active);
      if (formData.card_image) {
        data.append("card_image", formData.card_image);
      }

      await api.post("/api/countries/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/admin/management-country");
    } catch (err) {
      console.error("Error creating country:", err);
      setError("Failed to create country. Check if it already exists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit text-[11px] font-bold">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase">Add New Country</h1>
            <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1 flex items-center gap-2">
              <span className="text-green-600">Master Data</span> / <span className="text-gray-900">Country Registration</span>
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all border border-gray-100"
          >
            <ArrowLeft size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar bg-[#fcfdfc]">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-8 space-y-6">
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Country Name</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d]" size={14} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. United Arab Emirates"
                        className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] shadow-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nano Banner (Country Image)</label>
                    <div className="relative group">
                      <input
                        type="file"
                        name="card_image"
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 px-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] shadow-sm transition-all text-[10px]"
                        accept="image/*"
                      />
                    </div>
                    <p className="text-[8px] text-gray-400 font-medium ml-1 italic">Vertical orientation (4:5) recommended for best results.</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                    />
                    <label htmlFor="is_active" className="text-[10px] font-black text-gray-600 uppercase tracking-widest cursor-pointer select-none">
                      Country is active and available for selection
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#14532d] text-white py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    {loading ? "PROCESING..." : "SAVE COUNTRY"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-white border border-gray-100 text-gray-400 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-[0.98]"
                  >
                    CANCEL
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

export default CountryAdd;



