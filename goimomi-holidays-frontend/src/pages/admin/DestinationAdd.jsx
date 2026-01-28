import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const DestinationAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    region: "",
    city: "",
    country: "",
    card_image: null,
    is_popular: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_BASE_URL = "/api";

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm({ ...form, [name]: file });
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else if (type === "checkbox") {
      if (name === "is_popular" && checked && !form.card_image) {
        setError("Please upload a card image before marking as popular.");
        return;
      }
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
    setMessage("");
    setError("");
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, continueEditing = false) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      setError("Please fix the errors in the form.");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("region", form.region);
    formData.append("city", form.city);
    formData.append("country", form.country);
    formData.append("is_popular", form.is_popular);
    if (form.card_image) {
      formData.append("card_image", form.card_image);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/destinations/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setMessage("Destination added successfully!");
        setErrors({});

        if (continueEditing) {
          const newId = response.data.id;
          setTimeout(() => navigate(`/admin/destinations/edit/${newId}`), 1000);
        } else {
          setForm({
            name: "",
            region: "",
            city: "",
            country: "",
            card_image: null,
            is_popular: false,
          });
          setPreviewUrl(null);
        }
      }
    } catch (err) {
      console.error("Error adding destination:", err);
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          setError(errorMessages);
        } else {
          setError("Failed to add destination. Please try again.");
        }
      } else {
        setError("Failed to add destination. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    await handleSubmit(null, false);
  };

  const handleSaveAndContinue = async () => {
    await handleSubmit(null, true);
  };

  return (
    <div className="flex bg-gray-100 h-full overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        <div className="flex-1 overflow-y-auto p-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => navigate('/admin/destinations')}
                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight"
              >
                Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">Add New Destination</h1>
            </div>

            {message && (
              <div className="mb-3 p-2 bg-green-50 ring-1 ring-green-200 text-green-700 rounded text-xs font-bold animate-in fade-in slide-in-from-top-2">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-3 p-2 bg-red-50 ring-1 ring-red-200 text-red-700 rounded text-xs font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="block font-bold text-gray-400 uppercase tracking-widest">
                      Destination Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium`}
                      placeholder="e.g. North Goa"
                      required
                      disabled={loading}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] italic font-bold tracking-tight">{errors.name}</p>}
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="block font-bold text-gray-400 uppercase tracking-widest">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className={`w-full px-3 py-1.5 border ${errors.country ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium`}
                      placeholder="e.g. India"
                      required
                      disabled={loading}
                    />
                    {errors.country && <p className="text-red-500 text-[10px] italic font-bold tracking-tight">{errors.country}</p>}
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="block font-bold text-gray-400 uppercase tracking-widest">
                      City / Locality
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                      placeholder="e.g. Panjim"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="block font-bold text-gray-400 uppercase tracking-widest">
                      Region / State
                    </label>
                    <input
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic font-medium"
                      placeholder="e.g. West India"
                      disabled={loading}
                    />
                  </div>

                  {/* Card Image upload */}
                  <div className="space-y-1 text-xs md:col-span-2">
                    <label className="block font-bold text-gray-400 uppercase tracking-widest">
                      Card Image (For Home/Popular)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          name="card_image"
                          onChange={handleChange}
                          accept="image/*"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all text-gray-500 font-medium file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-green-50 file:text-[#14532d] hover:file:bg-green-100"
                        />
                        <p className="mt-1 text-[9px] text-gray-400 italic">Recommended size: 800x600px. JPG, PNG</p>
                      </div>
                      {previewUrl && (
                        <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Popular checkbox */}
                  <div className="md:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group w-fit">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_popular"
                          checked={form.is_popular}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="h-4 w-8 bg-gray-200 rounded-full transition-colors peer-checked:bg-[#14532d]"></div>
                        <div className="absolute top-0.5 left-0.5 h-3 w-3 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-[#14532d] transition-colors">
                        Show on Website Frontend (Popular Section)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-[#14532d] text-white rounded-xl hover:bg-[#0f4a24] transition-all transform active:scale-95 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/10"
                >
                  {loading ? "Saving..." : "Save Destination"}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAndAddAnother}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all transform active:scale-95 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                    disabled={loading}
                  >
                    Add Another
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    className="px-4 py-2 bg-white text-[#14532d] border border-[#14532d]/20 rounded-xl hover:bg-green-50 transition-all transform active:scale-95 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                    disabled={loading}
                  >
                    Edit After Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
  );
};

export default DestinationAdd;
