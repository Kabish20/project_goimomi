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
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = "/api";

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
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
          // Redirect to edit page of the newly created destination
          const newId = response.data.id;
          setTimeout(() => navigate(`/admin/destinations/edit/${newId}`), 1000);
        } else {
          // Reset form
          setForm({
            name: "",
            region: "",
            city: "",
            country: "",
          });
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
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar />

        <div className="p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Destination</h1>
                <p className="text-gray-600">Create a new destination for your holiday packages</p>
              </div>
              <button
                onClick={() => navigate('/admin/destinations')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Back to List
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <span className="font-bold">✓</span> {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <span className="font-bold">⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none`}
                    placeholder="e.g., North Goa"
                    disabled={loading}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Region:</label>
                  <input
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                    placeholder="e.g., West India"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">City:</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none"
                    placeholder="e.g., Panjim"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Country: <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`w-full border ${errors.country ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded focus:ring-2 focus:ring-[#14532d] outline-none`}
                    placeholder="e.g., India"
                    disabled={loading}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-100 p-6 flex gap-3">
              <button
                type="submit"
                className="bg-[#14532d] text-white px-6 py-2 rounded hover:bg-[#0f4a24] transition font-semibold disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "SAVE"}
              </button>
              <button
                type="button"
                onClick={handleSaveAndAddAnother}
                className="bg-[#1f7a45] text-white px-6 py-2 rounded hover:bg-[#1a6338] transition font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="bg-[#1f7a45] text-white px-6 py-2 rounded hover:bg-[#1a6338] transition font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Save and continue editing
              </button>
            </div>
          </form>
        </div >
      </div >
    </div >
  );
};

export default DestinationAdd;
