import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, Save, Calendar, DollarSign, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const VisaApplicationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    status: "Pending",
    internal_id: "",
    group_name: "",
    departure_date: "",
    return_date: "",
    total_price: 0,
    application_type: "Individual",
    visa: null, // We keep the ID but display info
  });
  const [visaDetails, setVisaDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/visa-applications/${id}/`);
      const data = response.data;
      setFormData({
        status: data.status,
        internal_id: data.internal_id || "",
        group_name: data.group_name || "",
        departure_date: data.departure_date,
        return_date: data.return_date,
        total_price: data.total_price,
        application_type: data.application_type,
        visa: data.visa,
      });
      // Store extra details for display
      setVisaDetails({
        country: data.visa_country,
        title: data.visa_title,
        applicants: data.applicants
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      setStatusMessage({ text: "Failed to fetch application details", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ text: "", type: "" });

    try {
      await axios.patch(`/api/visa-applications/${id}/`, formData);
      setStatusMessage({ text: "Application updated successfully!", type: "success" });
      setTimeout(() => {
        navigate("/admin/visa-applications");
      }, 1500);
    } catch (error) {
      console.error("Error updating application:", error);
      setStatusMessage({ 
        text: error.response?.data?.detail || "Failed to update application. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14532d]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/admin/visa-applications")}
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Visa Application #{id}</h1>
          </div>

          {statusMessage.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
                statusMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Application Info</h2>
              <p className="text-sm text-gray-500">
                Visa: <span className="font-medium text-gray-900">{visaDetails?.country} - {visaDetails?.title}</span>
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Status */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Application Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Type</label>
                  <select
                    name="application_type"
                    value={formData.application_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Group">Group</option>
                  </select>
                </div>

                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name (Optional)</label>
                  <input
                    type="text"
                    name="group_name"
                    value={formData.group_name}
                    onChange={handleChange}
                    placeholder="e.g. Family Trip"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Internal ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Reference ID</label>
                  <input
                    type="text"
                    name="internal_id"
                    value={formData.internal_id}
                    onChange={handleChange}
                    placeholder="e.g. REF-2024-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Total Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                    <input
                      type="number"
                      name="total_price"
                      value={formData.total_price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    name="return_date"
                    value={formData.return_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2 bg-[#14532d] text-white rounded-lg hover:bg-[#0f4a24] transition-colors font-medium shadow-sm ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <Save size={20} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaApplicationEdit;
