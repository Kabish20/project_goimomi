import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Trash2, Mail, Phone, Calendar } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useNavigate } from "react-router-dom";

const UmrahEnquiryManage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/umrah-form/`);
      setEnquiries(response.data);
      setFilteredEnquiries(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching umrah enquiries:", err);
      setError(`Failed to load umrah enquiries: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = enquiries.filter(enquiry =>
      enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.package_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnquiries(filtered);
  }, [searchTerm, enquiries]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this umrah enquiry?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/umrah-form/${id}/`);
        fetchEnquiries();
      } catch (err) {
        console.error("Error deleting umrah enquiry:", err);
        setError("Failed to delete umrah enquiry. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Select umrah enquiry to change</h1>
            <div className="flex gap-4">
              <button
                onClick={fetchEnquiries}
                className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded font-medium hover:bg-gray-200 transition text-sm"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/admin/umrah-enquiries/add")}
                className="bg-[#14532d] text-white px-4 py-2 rounded font-medium hover:bg-[#0f4a24] transition text-sm uppercase tracking-wider"
              >
                Add Umrah Enquiry
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search umrah enquiries by name, email, phone, or package type..."
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
              <p className="mt-2 text-gray-600">Loading umrah enquiries...</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14532d] text-white">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Name</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Contact</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Package Type</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Travel Date</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-500">
                        {searchTerm ? `No umrah enquiries match "${searchTerm}"` : "No umrah enquiries found."}
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 border-r text-sm">
                          {enquiry.full_name}
                        </td>
                        <td className="py-4 px-6 border-r text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-gray-400" />
                              {enquiry.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone size={14} className="text-gray-400" />
                              {enquiry.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{enquiry.package_type}</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(enquiry.travel_date)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              <Eye size={12} />
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(enquiry.id)}
                              className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              <Trash2 size={12} />
                              Delete
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

          {/* Enquiry Detail Modal */}
          {selectedEnquiry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Umrah Enquiry Details</h2>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Personal Information</h3>
                    <p><strong>Name:</strong> {selectedEnquiry.full_name}</p>
                    <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                    <p><strong>Phone:</strong> {selectedEnquiry.phone}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700">Umrah Details</h3>
                    <p><strong>Package Type:</strong> {selectedEnquiry.package_type}</p>
                    <p><strong>Travel Date:</strong> {formatDate(selectedEnquiry.travel_date)}</p>
                    <p><strong>Duration:</strong> {selectedEnquiry.duration} days</p>
                    <p><strong>Budget:</strong> ${selectedEnquiry.budget}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700">Group Information</h3>
                    <p><strong>Adults:</strong> {selectedEnquiry.adults}</p>
                    <p><strong>Children:</strong> {selectedEnquiry.children}</p>
                    <p><strong>Infants:</strong> {selectedEnquiry.infants}</p>

                    {selectedEnquiry.room_details && selectedEnquiry.room_details.length > 0 && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Room Breakdown:</p>
                        {selectedEnquiry.room_details.map((room, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            Room {idx + 1}: {room.adults} Adults, {room.children} Children
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700">Additional Information</h3>
                    <p><strong>Message:</strong></p>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700">Timestamp</h3>
                    <p>Submitted: {formatDate(selectedEnquiry.created_at)}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete Enquiry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UmrahEnquiryManage;
