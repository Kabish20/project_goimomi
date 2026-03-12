import React, { useState, useEffect } from "react";
import api from "../../api";
import { Search, Eye, Trash2, Mail, Phone, Calendar, MapPin, Edit, Save, X } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleEditEnquiry = () => {
    setIsEditing(true);
    setEditForm({ ...selectedEnquiry });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await api.patch(`${API_BASE_URL}/holiday-form/${selectedEnquiry.id}/`, editForm);
      const updated = { ...selectedEnquiry, ...editForm };
      setSelectedEnquiry(updated);
      setFilteredEnquiries(filteredEnquiries.map(e => e.id === updated.id ? updated : e));
      setEnquiries(enquiries.map(e => e.id === updated.id ? updated : e));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update enquiry.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedEnquiry(null);
    setIsEditing(false);
  };

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/holiday-form/`);
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      setEnquiries(data);
      setFilteredEnquiries(data);
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
        await api.delete(`${API_BASE_URL}/holiday-form/${id}/`);
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
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Name</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Type</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Start City</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Travel Date</th>
                    <th className="text-left py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Created At</th>
                    <th className="text-center py-2 px-4 font-bold uppercase text-[10px] tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500 text-xs">
                        {searchTerm ? `No holiday enquiries match "${searchTerm}"` : "No holiday enquiries found."}
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-4 font-medium text-gray-900 border-r text-xs">
                          {enquiry.full_name}
                        </td>
                        <td className="py-2 px-4 border-r text-xs font-bold text-gray-700">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${enquiry.package_type ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-[#14532d]'}`}>
                            {enquiry.package_type || "Customized"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-r text-gray-600 text-xs">{enquiry.start_city}</td>
                        <td className="py-2 px-4 border-r text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-400" />
                            {formatDate(enquiry.travel_date)}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-xs border-r text-gray-500">
                          {formatDate(enquiry.created_at)}
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700"
                            >
                              <Eye size={12} />
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(enquiry.id)}
                              className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-700"
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
                <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10">
                  <div className="flex flex-col flex-1 relative">
                    {isEditing ? (
                      <input 
                        name="full_name" 
                        value={editForm.full_name || ""} 
                        onChange={handleEditChange} 
                        className="text-lg font-black text-gray-900 border border-gray-300 rounded px-2 py-1 focus:ring-[#14532d] outline-none max-w-sm mb-1" 
                      />
                    ) : (
                      <h2 className="text-lg font-black text-gray-900 leading-tight">{selectedEnquiry.full_name}</h2>
                    )}
                    <div className="flex items-center gap-1.5 text-[#14532d] font-bold text-[10px] mt-0.5">
                      <MapPin size={12} />
                      {isEditing ? (
                        <input 
                          name="destination" 
                          value={editForm.destination || ""} 
                          onChange={handleEditChange} 
                          className="border border-gray-300 rounded px-1 w-48 text-gray-700" 
                        />
                      ) : (
                        <span>{selectedEnquiry.destination}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 mr-8">
                    {!isEditing ? (
                      <button onClick={handleEditEnquiry} className="flex items-center gap-1 bg-green-50 text-[#14532d] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors">
                        <Edit size={14} /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleCancelEdit} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200">
                          Cancel
                        </button>
                        <button onClick={handleUpdate} disabled={isUpdating} className="flex items-center gap-1 bg-[#14532d] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0f4a24]">
                          <Save size={14} /> {isUpdating ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleCloseModal}
                    className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full text-2xl leading-none"
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
                            <span className="font-bold text-gray-700 w-full flex-1">
                              {isEditing ? <input name="phone" value={editForm.phone || ""} onChange={handleEditChange} className="w-full border border-gray-300 rounded px-2 py-1 font-normal text-xs" /> : selectedEnquiry.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 bg-gray-50/50 p-2 rounded-xl border border-gray-100 group transition-colors text-sm">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                              <Mail size={14} className="text-[#14532d]" />
                            </div>
                            <span className="font-bold text-gray-700 truncate w-full flex-1">
                              {isEditing ? <input name="email" value={editForm.email || ""} onChange={handleEditChange} className="w-full border border-gray-300 rounded px-2 py-1 font-normal text-xs" /> : selectedEnquiry.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Travel Summary</p>
                        <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 text-xs grid grid-cols-2 gap-y-1.5 items-center">
                          <span className="text-gray-500 font-bold">Travel Date:</span>
                          <span className="font-bold text-gray-800 text-right">
                            {isEditing ? <input type="date" name="travel_date" value={editForm.travel_date || ""} onChange={handleEditChange} className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full text-left" /> : formatDate(selectedEnquiry.travel_date)}
                          </span>
                          <span className="text-gray-500 font-bold">Duration:</span>
                          <span className="font-bold text-gray-800 text-right flex items-center justify-end gap-1">
                            {isEditing ? <input name="nights" value={editForm.nights || ""} onChange={handleEditChange} className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full text-left" /> : `${selectedEnquiry.nights} Nights`}
                          </span>
                          <span className="text-gray-500 font-bold">Budget:</span>
                          <span className="font-bold text-green-700 text-right flex items-center justify-end">
                            {isEditing ? <input name="budget" value={editForm.budget || ""} onChange={handleEditChange} className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full text-left" /> : selectedEnquiry.budget}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inclusions & Preferences</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
                        {[
                          { label: "Star Rating", name: "star_rating", value: isEditing ? editForm.star_rating : (selectedEnquiry.star_rating ? `${selectedEnquiry.star_rating} Star` : "N/A") },
                          { label: "Meal Plan", name: "meal_plan", value: isEditing ? editForm.meal_plan : selectedEnquiry.meal_plan },
                          { label: "Room Type", name: "room_type", value: isEditing ? editForm.room_type : selectedEnquiry.room_type },
                          { label: "Transfer", name: "transfer_details", value: isEditing ? editForm.transfer_details : selectedEnquiry.transfer_details }
                        ].map((item, i) => (
                          <div key={i} className="bg-white border border-gray-100 p-2 rounded-lg shadow-sm text-center group hover:border-[#14532d]/20 transition-colors flex flex-col justify-center">
                            <p className="text-[8px] text-gray-400 uppercase font-black">{item.label}</p>
                            {isEditing ? (
                              <input name={item.name} value={item.value || ""} onChange={handleEditChange} className="text-[10px] font-bold text-gray-700 w-full text-center border border-gray-300 rounded mt-1 py-0.5 outline-none focus:border-[#14532d]" />
                            ) : (
                              <p className="text-[10px] font-bold text-gray-700 line-clamp-1">{item.value || "N/A"}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message & Requests</p>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-gray-600 text-[13px] leading-relaxed min-h-[60px]">
                        {isEditing ? (
                          <textarea 
                            name="message" 
                            value={editForm.message || ""} 
                            onChange={handleEditChange} 
                            className="w-full text-xs border border-gray-300 rounded p-2 focus:ring-[#14532d] outline-none min-h-[80px]" 
                          />
                        ) : (
                          selectedEnquiry.message || "No message provided."
                        )}
                      </div>
                    </div>

                    <div className="pt-1 text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Submitted on {formatDate(selectedEnquiry.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedEnquiry.id);
                      handleCloseModal();
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
