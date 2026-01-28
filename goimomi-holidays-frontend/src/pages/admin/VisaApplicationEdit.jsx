import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, Save, Calendar, DollarSign, FileText, Eye, Download, User, Edit, Trash2, Upload, Plus, X as LucideX } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

// Helper to fix image URLs
const getImageUrl = (url) => {
  if (!url) return "";
  if (typeof url !== "string") return url;
  if (url.startsWith("http")) {
    return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
  }
  return url;
};

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
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingApplicantId, setEditingApplicantId] = useState(null);
  const [editApplicantData, setEditApplicantData] = useState({});
  const [isUpdatingApplicant, setIsUpdatingApplicant] = useState(false);

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

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showImageModal]);

  const handleStartEditApplicant = (applicant) => {
    setEditingApplicantId(applicant.id);
    setEditApplicantData({ ...applicant, additional_documents: undefined });
  };

  const handleCancelEditApplicant = () => {
    setEditingApplicantId(null);
    setEditApplicantData({});
  };

  const handleSaveApplicant = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsUpdatingApplicant(true);
      const fieldsToInclude = [
        'first_name', 'last_name', 'passport_number', 'nationality',
        'sex', 'dob', 'place_of_birth', 'place_of_issue',
        'marital_status', 'phone', 'date_of_issue', 'date_of_expiry'
      ];

      const dataToSend = {};
      fieldsToInclude.forEach(key => {
        if (editApplicantData[key] !== undefined) {
          dataToSend[key] = editApplicantData[key];
        }
      });

      await axios.patch(`/api/visa-applicants/${editingApplicantId}/`, dataToSend);

      // Update local state
      setVisaDetails(prev => ({
        ...prev,
        applicants: prev.applicants.map(a =>
          a.id === editingApplicantId ? { ...a, ...dataToSend } : a
        )
      }));

      setEditingApplicantId(null);
      setEditApplicantData({});
      alert("Applicant details updated successfully!");
    } catch (err) {
      console.error("Error updating applicant:", err);
      alert(`Failed to update applicant details`);
    } finally {
      setIsUpdatingApplicant(false);
    }
  };

  const handleUploadPassport = async (applicantId, file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('passport_front', file);
      await axios.patch(`/api/visa-applicants/${applicantId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchApplication();
      alert('Passport uploaded successfully!');
    } catch (err) {
      alert('Failed to upload passport');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadPhoto = async (applicantId, file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      await axios.patch(`/api/visa-applicants/${applicantId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchApplication();
      alert('Photo uploaded successfully!');
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAdditionalDoc = async (applicantId, file, documentName) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_name', documentName || file.name);
      formData.append('applicant', applicantId);
      await axios.post(`/api/additional-documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchApplication();
      alert('Additional document uploaded successfully!');
    } catch (err) {
      alert('Failed to upload additional document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePassport = async (applicantId) => {
    if (!window.confirm('Are you sure you want to delete this passport?')) return;
    try {
      setIsUploading(true);
      await axios.patch(`/api/visa-applicants/${applicantId}/`, { passport_front: '' });
      await fetchApplication();
      alert('Passport deleted successfully!');
    } catch (err) {
      alert('Failed to delete passport');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (applicantId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      setIsUploading(true);
      await axios.patch(`/api/visa-applicants/${applicantId}/`, { photo: '' });
      await fetchApplication();
      alert('Photo deleted successfully!');
    } catch (err) {
      alert('Failed to delete photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAdditionalDoc = async (docId, applicantId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      setIsUploading(true);
      await axios.delete(`/api/additional-documents/${docId}/`);
      await fetchApplication();
      alert('Document deleted successfully!');
    } catch (err) {
      alert('Failed to delete document');
    } finally {
      setIsUploading(false);
    }
  };

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
      <div className="flex bg-gray-100 h-full overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14532d]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-full w-full overflow-hidden relative">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
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
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${statusMessage.type === "success"
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
                  className={`flex items-center gap-2 px-6 py-2 bg-[#14532d] text-white rounded-lg hover:bg-[#0f4a24] transition-colors font-medium shadow-sm ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  <Save size={20} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Applicants Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <User size={20} className="text-[#14532d]" />
              <h3 className="text-lg font-bold text-gray-900">Applicants & Documents</h3>
            </div>

            <div className="p-6 space-y-6">
              {visaDetails?.applicants && visaDetails.applicants.length > 0 ? (
                visaDetails.applicants.map((applicant, index) => (
                  <div key={applicant.id} className="border border-gray-200 rounded-xl p-6 hover:border-[#14532d] transition-colors bg-white">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      {/* Left: Applicant Data */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#14532d] text-white text-xs font-bold px-2 py-0.5 rounded-full">#{index + 1}</span>
                            <h4 className="font-bold text-lg text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                          </div>
                          {editingApplicantId !== applicant.id ? (
                            <button
                              onClick={() => handleStartEditApplicant(applicant)}
                              className="p-1.5 text-gray-400 hover:text-[#14532d] hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Applicant Data"
                            >
                              <Edit size={18} />
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveApplicant}
                                disabled={isUpdatingApplicant}
                                className="px-4 py-1.5 bg-[#14532d] text-white text-sm font-bold rounded-lg hover:bg-[#0f4a24] disabled:opacity-50"
                              >
                                {isUpdatingApplicant ? "..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancelEditApplicant}
                                className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        {editingApplicantId === applicant.id ? (
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              { label: 'First Name', name: 'first_name' },
                              { label: 'Last Name', name: 'last_name' },
                              { label: 'Passport', name: 'passport_number' },
                              { label: 'Nationality', name: 'nationality' },
                              { label: 'DOB', name: 'dob', type: 'date' },
                              { label: 'Sex', name: 'sex', type: 'select', options: ['Male', 'Female', 'Other'] },
                              { label: 'Marital', name: 'marital_status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
                              { label: 'POB', name: 'place_of_birth' },
                              { label: 'POI', name: 'place_of_issue' },
                              { label: 'Issued', name: 'date_of_issue', type: 'date' },
                              { label: 'Expiry', name: 'date_of_expiry', type: 'date' },
                              { label: 'Phone', name: 'phone' },
                            ].map((field) => (
                              <div key={field.name} className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{field.label}</label>
                                {field.type === 'select' ? (
                                  <select
                                    value={editApplicantData[field.name] || ''}
                                    onChange={(e) => setEditApplicantData({ ...editApplicantData, [field.name]: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none"
                                  >
                                    <option value="">Select</option>
                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type || 'text'}
                                    value={editApplicantData[field.name] || ''}
                                    onChange={(e) => setEditApplicantData({ ...editApplicantData, [field.name]: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-600">
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Passport</span>
                              <span className="font-medium text-gray-900">{applicant.passport_number || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Nationality</span>
                              <span className="font-medium text-gray-900">{applicant.nationality || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">DOB</span>
                              <span className="font-medium text-gray-900">{applicant.dob || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Sex</span>
                              <span className="font-medium text-gray-900">{applicant.sex || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Marital</span>
                              <span className="font-medium text-gray-900">{applicant.marital_status || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">POB</span>
                              <span className="font-medium text-gray-900">{applicant.place_of_birth || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">POI</span>
                              <span className="font-medium text-gray-900">{applicant.place_of_issue || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Issued</span>
                              <span className="font-medium text-gray-900">{applicant.date_of_issue || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry</span>
                              <span className="font-medium text-gray-900">{applicant.date_of_expiry || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                              <span className="font-medium text-gray-900">{applicant.phone || 'N/A'}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Documents Section */}
                      <div className="flex flex-col gap-4 min-w-[240px] border-l border-gray-100 pl-6">
                        {/* Passport */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Passport</label>
                          {applicant.passport_front ? (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setImagePreview(getImageUrl(applicant.passport_front));
                                    setShowImageModal(true);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold flex-1 justify-center"
                                >
                                  <Eye size={14} /> View
                                </button>
                                <a
                                  href={getImageUrl(applicant.passport_front)}
                                  download={`Passport_${applicant.first_name}`}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold flex-1 justify-center"
                                >
                                  <Download size={14} /> Download
                                </a>
                              </div>
                              <button
                                onClick={() => handleDeletePassport(applicant.id)}
                                className="w-full flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold justify-center"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                id={`passport-${applicant.id}`}
                                className="hidden"
                                onChange={(e) => e.target.files[0] && handleUploadPassport(applicant.id, e.target.files[0])}
                              />
                              <label htmlFor={`passport-${applicant.id}`} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold justify-center cursor-pointer border border-dashed border-blue-200">
                                <Upload size={16} /> Upload Passport
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Photo */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Photo</label>
                          {applicant.photo ? (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setImagePreview(getImageUrl(applicant.photo));
                                    setShowImageModal(true);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-bold flex-1 justify-center"
                                >
                                  <Eye size={14} /> View
                                </button>
                                <a
                                  href={getImageUrl(applicant.photo)}
                                  download={`Photo_${applicant.first_name}`}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-bold flex-1 justify-center"
                                >
                                  <Download size={14} /> Download
                                </a>
                              </div>
                              <button
                                onClick={() => handleDeletePhoto(applicant.id)}
                                className="w-full flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold justify-center"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                id={`photo-${applicant.id}`}
                                className="hidden"
                                onChange={(e) => e.target.files[0] && handleUploadPhoto(applicant.id, e.target.files[0])}
                              />
                              <label htmlFor={`photo-${applicant.id}`} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-bold justify-center cursor-pointer border border-dashed border-purple-200">
                                <Upload size={16} /> Upload Photo
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Additional Docs */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Docs</label>
                          {applicant.additional_documents?.map((doc, dIdx) => (
                            <div key={doc.id} className="space-y-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 mb-1 truncate">{doc.document_name}</p>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setImagePreview(getImageUrl(doc.file));
                                    setShowImageModal(true);
                                  }}
                                  className="p-1 px-2 bg-white text-gray-600 border border-gray-200 rounded hover:bg-gray-100"
                                >
                                  <Eye size={12} />
                                </button>
                                <a
                                  href={getImageUrl(doc.file)}
                                  download
                                  className="p-1 px-2 bg-white text-gray-600 border border-gray-200 rounded hover:bg-gray-100"
                                >
                                  <Download size={12} />
                                </a>
                                <button
                                  onClick={() => handleDeleteAdditionalDoc(doc.id, applicant.id)}
                                  className="p-1 px-2 bg-white text-red-600 border border-gray-200 rounded hover:bg-red-50 ml-auto"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}

                          <input
                            type="file"
                            id={`add-doc-${applicant.id}`}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                const name = prompt("Document name:", e.target.files[0].name);
                                handleUploadAdditionalDoc(applicant.id, e.target.files[0], name);
                              }
                            }}
                          />
                          <label htmlFor={`add-doc-${applicant.id}`} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-bold justify-center cursor-pointer border border-dashed border-green-200">
                            <Plus size={14} /> Add Document
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No applicants found for this application.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
              <h3 className="font-bold text-gray-800">Document Preview</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
              >
                <LucideX size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center min-h-[300px]">
              {imagePreview?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${imagePreview}#toolbar=0`}
                  className="w-full h-full min-h-[600px] border-none rounded-lg"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={imagePreview}
                  alt="Document Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0">
              <a
                href={imagePreview}
                download
                className="px-4 py-2 bg-[#14532d] text-white rounded-lg hover:bg-[#0f4a24] transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} /> Download
              </a>
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaApplicationEdit;
