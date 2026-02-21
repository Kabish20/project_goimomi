import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, Trash2, Mail, Phone, Calendar, MapPin } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useNavigate } from "react-router-dom";

const HolidayEnquiryManage = () => {
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
      const response = await axios.get(`${API_BASE_URL}/holiday-form/`);
      setEnquiries(response.data);
      setFilteredEnquiries(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching holiday enquiries:", err);
      setError(`Failed to load holiday enquiries: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = enquiries.filter(enquiry =>
      enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.destination?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnquiries(filtered);
  }, [searchTerm, enquiries]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday enquiry?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/holiday-form/${id}/`);
        fetchEnquiries();
      } catch (err) {
        console.error("Error deleting holiday enquiry:", err);
        setError("Failed to delete holiday enquiry. Please try again.");
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
    <div className="flex bg-gray-100 h-full overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Select holiday enquiry to change</h1>
            <div className="flex gap-4">
              <button
                onClick={fetchEnquiries}
                className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded font-medium hover:bg-gray-200 transition text-sm"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/admin/holiday-enquiries/add")}
                className="bg-[#14532d] text-white px-4 py-2 rounded font-medium hover:bg-[#0f4a24] transition text-sm uppercase tracking-wider"
              >
                Add Holiday Enquiry
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
                placeholder="Search holiday enquiries by name, email, phone, or destination..."
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
              <p className="mt-2 text-gray-600">Loading holiday enquiries...</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14532d] text-white">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Name</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Start City</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Travel Date</th>
                    <th className="text-left py-4 px-6 font-semibold uppercase text-sm tracking-wider">Created At</th>
                    <th className="text-center py-4 px-6 font-semibold uppercase text-sm tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-500">
                        {searchTerm ? `No holiday enquiries match "${searchTerm}"` : "No holiday enquiries found."}
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 border-r text-sm">
                          {enquiry.full_name}
                        </td>
                        <td className="py-3 px-4 border-r text-gray-600">{enquiry.start_city}</td>
                        <td className="py-3 px-4 border-r text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(enquiry.travel_date)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm border-r">
                          {formatDate(enquiry.created_at)}
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-black text-gray-900 leading-tight">{selectedEnquiry.full_name}</h2>
                    <div className="flex items-center gap-1.5 text-[#14532d] font-bold text-[10px] mt-0.5">
                      <MapPin size={12} />
                      <span>{selectedEnquiry.destination}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal Information</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 group transition-colors text-sm">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                              <Phone size={14} className="text-[#14532d]" />
                            </div>
                            <span className="font-bold text-gray-700">{selectedEnquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 group transition-colors text-sm">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                              <Mail size={14} className="text-[#14532d]" />
                            </div>
                            <span className="font-bold text-gray-700 truncate">{selectedEnquiry.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Travel Summary</p>
                        <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 text-xs grid grid-cols-2 gap-y-1.5">
                          <span className="text-gray-500 font-bold">Travel Date:</span>
                          <span className="font-bold text-gray-800 text-right">{formatDate(selectedEnquiry.travel_date)}</span>
                          <span className="text-gray-500 font-bold">Duration:</span>
                          <span className="font-bold text-gray-800 text-right">{selectedEnquiry.nights} Nights</span>
                          <span className="text-gray-500 font-bold">Budget:</span>
                          <span className="font-bold text-green-700 text-right">{selectedEnquiry.budget}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inclusions & Preferences</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                        {[
                          { label: "Star Rating", value: `${selectedEnquiry.star_rating} Star` },
                          { label: "Meal Plan", value: selectedEnquiry.meal_plan },
                          { label: "Room Type", value: selectedEnquiry.room_type },
                          { label: "Transfer", value: selectedEnquiry.transfer_details }
                        ].map((item, i) => (
                          <div key={i} className="bg-white border border-gray-100 p-2 rounded-lg shadow-sm text-center group hover:border-[#14532d]/20 transition-colors">
                            <p className="text-[8px] text-gray-400 uppercase font-black">{item.label}</p>
                            <p className="text-[10px] font-bold text-gray-700 line-clamp-1">{item.value || "N/A"}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message & Requests</p>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-gray-600 text-[13px] leading-relaxed min-h-[60px]">
                        {selectedEnquiry.message || "No message provided."}
                      </div>
                    </div>

                    <div className="pt-1 text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Submitted on {formatDate(selectedEnquiry.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedEnquiry.id);
                      setSelectedEnquiry(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
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

export default HolidayEnquiryManage;
