import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Download, X, Calendar, User, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const VisaApplicationManage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/visa-applications/`);
      setApplications(response.data);
      setFilteredApplications(response.data);
      setError("");
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

  const handleView = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
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
        await axios.delete(`${API_BASE_URL}/visa-applications/${id}/`);
        setApplications(applications.filter(app => app.id !== id));
        // Filtered applications will update automatically via useEffect dependent on 'applications'
        // But since useEffect depends on searchTerm and applications, and setApplications updates state, 
        // the effect will run. However, it's safer to update filtered list immediately or ensure effect runs.
        // The existing useEffect [searchTerm, applications] will handle it.
      } catch (err) {
        console.error("Error deleting application:", err);
        alert("Failed to delete application");
      }
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Manage Visa Applications</h1>
            <button
              onClick={fetchApplications}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Refresh List
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by country, visa, group name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14532d]"
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
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">ID</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Visa</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Type</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Dates</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Status</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
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
                        <td className="py-4 px-6 font-medium text-gray-900 border-r">#{app.id}</td>
                        <td className="py-4 px-6 border-r">
                          <div className="font-semibold text-gray-900">{app.visa_country}</div>
                          <div className="text-xs text-gray-500">{app.visa_title}</div>
                        </td>
                        <td className="py-4 px-6 border-r">
                          <div className="text-sm text-gray-900">{app.application_type}</div>
                          {app.group_name && <div className="text-xs text-gray-500">Group: {app.group_name}</div>}
                        </td>
                        <td className="py-4 px-6 border-r">
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar size={12} /> Dep: {formatDate(app.departure_date)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar size={12} /> Ret: {formatDate(app.return_date)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-r">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                app.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(app)}
                              className="text-[#14532d] hover:text-[#0f4a24] p-2 rounded-full hover:bg-green-50 transition-colors"
                              title="View Details & Documents"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(app.id)}
                              className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-50 transition-colors"
                              title="Edit Application"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 size={18} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">Application Details #{selectedApplication.id}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visa</label>
                  <p className="font-semibold text-gray-900">{selectedApplication.visa_country} - {selectedApplication.visa_title}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                  <p className="font-semibold text-gray-900">{selectedApplication.application_type} {selectedApplication.group_name ? `(${selectedApplication.group_name})` : ''}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Internal ID</label>
                  <p className="font-semibold text-gray-900">{selectedApplication.internal_id || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Price</label>
                  <p className="font-semibold text-gray-900">₹{selectedApplication.total_price}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</label>
                  <p className="font-semibold text-gray-900">{new Date(selectedApplication.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Applicants & Documents */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-[#14532d]" />
                  Applicants & Documents
                </h3>

                <div className="space-y-4">
                  {selectedApplication.applicants && selectedApplication.applicants.length > 0 ? (
                    selectedApplication.applicants.map((applicant, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-[#14532d] transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          {/* Applicant Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-[#14532d] text-white text-xs font-bold px-2 py-0.5 rounded-full">#{index + 1}</span>
                              <h4 className="font-bold text-gray-900">{applicant.first_name} {applicant.last_name}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                              <p>Passport: <span className="font-medium text-gray-900">{applicant.passport_number}</span></p>
                              <p>Nationality: <span className="font-medium text-gray-900">{applicant.nationality}</span></p>
                              <p>DOB: <span className="font-medium text-gray-900">{applicant.dob}</span></p>
                              <p>Sex: <span className="font-medium text-gray-900">{applicant.sex}</span></p>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            {applicant.passport_front ? (
                              <a
                                href={applicant.passport_front}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                              >
                                <Download size={16} /> Download Passport
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic px-4 py-2">No Passport Uploaded</span>
                            )}

                            {applicant.photo ? (
                              <a
                                href={applicant.photo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                              >
                                <Download size={16} /> Download Photo
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic px-4 py-2">No Photo Uploaded</span>
                            )}

                            {/* Additional Documents */}
                            {applicant.additional_documents && applicant.additional_documents.map((doc, dIdx) => (
                              <a
                                key={dIdx}
                                href={doc.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                              >
                                <Download size={16} /> {doc.document_name || `Doc ${dIdx + 1}`}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No applicant details found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
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
