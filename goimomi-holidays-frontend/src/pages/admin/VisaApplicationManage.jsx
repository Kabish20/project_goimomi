import React, { useState, useEffect } from "react";
import api from "../../api";
import { Search, Eye, Download, X, Calendar, User, Edit, Trash2, Upload, Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const VisaApplicationManage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingApplicantId, setEditingApplicantId] = useState(null);
  const [editApplicantData, setEditApplicantData] = useState({});
  const [isUpdatingApplicant, setIsUpdatingApplicant] = useState(false);
  
  // Application editing states
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [editAppForm, setEditAppForm] = useState({});
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchApplications();
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showModal || showImageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showImageModal]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/visa-applications/`);
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      setApplications(data);
      setFilteredApplications(data);
      setError("");
      return data;
    } catch (err) {
      console.error("Error fetching visa applications:", err);
      setError(`Failed to load applications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = applications.filter(app =>
      app.visa_country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.visa_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

  const handleView = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setEditingApplicantId(null);
    setIsEditingApp(false);
    setEditAppForm({});
  };

  const handleEditAppStart = () => {
    setIsEditingApp(true);
    setEditAppForm({ ...selectedApplication });
  };

  const handleEditAppChange = (e) => {
    setEditAppForm({ ...editAppForm, [e.target.name]: e.target.value });
  };

  const handleUpdateApp = async () => {
    try {
      setIsUpdatingApp(true);
      await api.patch(`${API_BASE_URL}/visa-applications/${selectedApplication.id}/`, editAppForm);
      const updated = { ...selectedApplication, ...editAppForm };
      setSelectedApplication(updated);
      setFilteredApplications(filteredApplications.map(e => e.id === updated.id ? updated : e));
      setApplications(applications.map(e => e.id === updated.id ? updated : e));
      setIsEditingApp(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update application.");
    } finally {
      setIsUpdatingApp(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (id) => {
    navigate(`/admin/visa-applications/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        await api.delete(`${API_BASE_URL}/visa-applications/${id}/`);
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        console.error("Error deleting application:", err);
        alert("Failed to delete application");
      }
    }
  };

  // Document Management within the list view
  const handleUploadPassport = async (applicantId, file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('passport_front', file);
      await api.patch(`${API_BASE_URL}/visa-applicants/${applicantId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }
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
      await api.patch(`${API_BASE_URL}/visa-applicants/${applicantId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }
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
      await api.post(`${API_BASE_URL}/additional-documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }
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
      await api.patch(`${API_BASE_URL}/visa-applicants/${applicantId}/`, { passport_front: '' });
      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }
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
      await api.patch(`${API_BASE_URL}/visa-applicants/${applicantId}/`, { photo: '' });
      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }
      alert('Photo deleted successfully!');
    } catch (err) {
      alert('Failed to delete photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAdditionalDoc = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      setIsUploading(true);
      await api.delete(`${API_BASE_URL}/additional-documents/${docId}/`);
      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }
      alert('Document deleted successfully!');
    } catch (err) {
      alert('Failed to delete document');
    } finally {
      setIsUploading(false);
    }
  };

  // Applicant Data Editing
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

      await api.patch(`${API_BASE_URL}/visa-applicants/${editingApplicantId}/`, dataToSend);

      const data = await fetchApplications();
      if (data) {
        const updatedApp = data.find(a => a.id === selectedApplication.id);
        setSelectedApplication(updatedApp);
      }

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

  return (
    <div className="flex bg-gray-100 h-full w-full overflow-hidden relative">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Manage Visa Applications</h1>
            <button
              onClick={fetchApplications}
              className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition text-xs font-bold"
            >
              Refresh List
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-xs">
              <Search size={16} className="absolute left-3 top-2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#14532d] bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14532d] text-white">
                  <tr>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">ID</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Visa</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Type</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Dates</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Status</th>
                    <th className="text-center py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-500">
                        {searchTerm ? `No applications match "${searchTerm}"` : "No visa applications found."}
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-4 font-medium text-gray-900 border-r text-xs">#{app.id}</td>
                        <td className="py-2 px-4 border-r">
                          <div className="font-bold text-gray-900 text-xs">{app.visa_country}</div>
                          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{app.visa_title}</div>
                        </td>
                        <td className="py-2 px-4 border-r">
                          <div className="text-[11px] font-medium text-gray-900">{app.application_type}</div>
                          {app.group_name && <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Grp: {app.group_name}</div>}
                        </td>
                        <td className="py-2 px-4 border-r">
                          <div className="flex flex-col gap-0.5 text-[10px] font-bold">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar size={10} /> {formatDate(app.departure_date)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600 border-t border-gray-100 pt-0.5 mt-0.5">
                              <Calendar size={10} /> {formatDate(app.return_date)}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest
                            ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                app.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleView(app)}
                              className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(app.id)}
                              className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
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

      {/* Modal for Details & Documents */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10 w-full overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2.5 rounded-xl">
                  <User size={20} className="text-[#14532d]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Application #{selectedApplication.id}</h2>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">{selectedApplication.visa_country} - {selectedApplication.visa_title}</p>
                </div>
              </div>



              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors absolute right-5 top-5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Basic Info Card */}
                <div className="lg:col-span-1 space-y-5">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Basic Info</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedApplication.status === 'Approved' ? 'bg-green-100 text-green-800' : selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Total Price</span>
                        <span className="text-base font-bold text-[#14532d]">₹{Number(selectedApplication.total_price || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Departure</span>
                          <span className="text-xs font-medium text-gray-700">{formatDate(selectedApplication.departure_date)}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Return</span>
                          <span className="text-xs font-medium text-gray-700">{formatDate(selectedApplication.return_date)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Reference</span>
                        <span className="text-xs font-medium text-gray-700">{selectedApplication.internal_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applicants & Documents Section */}
                <div className="lg:col-span-3 space-y-4">
                  {selectedApplication.applicants?.map((applicant, index) => (
                    <div key={applicant.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                          <span className="bg-[#14532d] text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                            {index + 1}
                          </span>
                          {applicant.first_name} {applicant.last_name}
                        </h4>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-[11px] text-gray-600">
                          <div>
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Passport</span>
                            <span className="font-semibold text-gray-900">{applicant.passport_number || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nationality</span>
                            <span className="font-semibold text-gray-900">{applicant.nationality || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">DOB</span>
                            <span className="font-semibold text-gray-900">{applicant.dob || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                            <span className="font-semibold text-gray-900">{applicant.phone || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Passport Document */}
                          <div className="border border-gray-100 rounded-xl p-2.5 bg-gray-50 flex flex-col justify-between">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Passport Front</label>
                            {applicant.passport_front ? (
                              <div className="space-y-1.5 mt-auto">
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setImagePreview(getImageUrl(applicant.passport_front));
                                      setShowImageModal(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 py-1 px-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-[9px] font-bold"
                                  >
                                    <Eye size={10} /> View
                                  </button>
                                  <a
                                    href={getImageUrl(applicant.passport_front)}
                                    download={`Passport_${applicant.first_name}`}
                                    className="flex-1 flex items-center justify-center gap-1 py-1 px-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-[9px] font-bold"
                                  >
                                    <Download size={10} /> Save
                                  </a>
                                </div>
                                <button
                                  onClick={() => handleDeletePassport(applicant.id)}
                                  className="w-full flex items-center justify-center gap-1 py-1 px-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-[9px] font-bold"
                                >
                                  <Trash2 size={10} /> Delete
                                </button>
                              </div>
                            ) : (
                              <div className="mt-auto">
                                <input
                                  type="file"
                                  id={`passport-${applicant.id}`}
                                  className="hidden"
                                  onChange={(e) => e.target.files[0] && handleUploadPassport(applicant.id, e.target.files[0])}
                                />
                                <label htmlFor={`passport-${applicant.id}`} className="flex items-center justify-center gap-1.5 px-2 py-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-green-50 hover:border-[#14532d] hover:text-[#14532d] transition-all text-gray-500 text-[10px] font-bold">
                                  <Upload size={12} /> Upload
                                </label>
                              </div>
                            )}
                          </div>

                          {/* Photo Document */}
                          <div className="border border-gray-100 rounded-xl p-2.5 bg-gray-50 flex flex-col justify-between">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Photo</label>
                            {applicant.photo ? (
                              <div className="space-y-1.5 mt-auto">
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setImagePreview(getImageUrl(applicant.photo));
                                      setShowImageModal(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 py-1 px-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-[9px] font-bold"
                                  >
                                    <Eye size={10} /> View
                                  </button>
                                  <a
                                    href={getImageUrl(applicant.photo)}
                                    download={`Photo_${applicant.first_name}`}
                                    className="flex-1 flex items-center justify-center gap-1 py-1 px-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-[9px] font-bold"
                                  >
                                    <Download size={10} /> Save
                                  </a>
                                </div>
                                <button
                                  onClick={() => handleDeletePhoto(applicant.id)}
                                  className="w-full flex items-center justify-center gap-1 py-1 px-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-[9px] font-bold"
                                >
                                  <Trash2 size={10} /> Delete
                                </button>
                              </div>
                            ) : (
                              <div className="mt-auto">
                                <input
                                  type="file"
                                  id={`photo-${applicant.id}`}
                                  className="hidden"
                                  onChange={(e) => e.target.files[0] && handleUploadPhoto(applicant.id, e.target.files[0])}
                                />
                                <label htmlFor={`photo-${applicant.id}`} className="flex items-center justify-center gap-1.5 px-2 py-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-green-50 hover:border-[#14532d] hover:text-[#14532d] transition-all text-gray-500 text-[10px] font-bold">
                                  <Upload size={12} /> Upload
                                </label>
                              </div>
                            )}
                          </div>

                          {/* Additional Docs */}
                          <div className="border border-gray-100 rounded-xl p-2.5 bg-gray-50 flex flex-col justify-between">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Other Docs</label>
                            <div className="space-y-1.5 mt-auto">
                              {applicant.additional_documents?.map((doc) => (
                                <div key={doc.id} className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between gap-1.5">
                                  <span className="text-[8px] font-bold text-gray-600 truncate flex-1">{doc.document_name}</span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        setImagePreview(getImageUrl(doc.file));
                                        setShowImageModal(true);
                                      }}
                                      className="p-1 hover:text-blue-600"
                                    ><Eye size={10} /></button>
                                    <button
                                      onClick={() => handleDeleteAdditionalDoc(doc.id, applicant.id)}
                                      className="p-1 hover:text-red-600"
                                    ><Trash2 size={10} /></button>
                                  </div>
                                </div>
                              ))}
                              <input
                                type="file"
                                id={`add-doc-${applicant.id}`}
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    const name = prompt("Document Name (e.g. Bank Statement):", e.target.files[0].name);
                                    handleUploadAdditionalDoc(applicant.id, e.target.files[0], name);
                                  }
                                }}
                              />
                              <label htmlFor={`add-doc-${applicant.id}`} className="flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-[#14532d] hover:text-[#14532d] transition-all text-gray-400 text-[9px] font-bold">
                                <Plus size={10} /> Add
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0 z-10">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

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
                <X size={20} />
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
                    console.error('Image load failed:', imagePreview);
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

export default VisaApplicationManage;
