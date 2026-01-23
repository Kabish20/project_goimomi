import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExternalLink, RefreshCw, Settings } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminCard from "../../components/admin/AdminCard";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    destinations: 0,
    packages: 0,
    enquiries: 0,
    holidayEnquiries: 0,
    umrahEnquiries: 0,
    startingCities: 0,
    itineraryMasters: 0,
    nationalities: 0,
    umrahDestinations: 0,
    visas: 0,
    visaApplications: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const navigate = useNavigate();

  // Base API URL
  const API_BASE_URL = "/api";
  const DJANGO_ADMIN_URL = "/admin/";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data from Django API...");

      const token = localStorage.getItem("accessToken");
      if (!token) {
        // If no token, you might want to redirect or handle it, 
        // though ProtectedRoute usually handles this.
        // navigate("/admin-login");
        // return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Fetch all data in parallel with error handling for each endpoint
      const fetchPromises = [
        axios.get(`${API_BASE_URL}/destinations/`, config).catch(err => ({ error: err, endpoint: 'destinations' })),
        axios.get(`${API_BASE_URL}/packages/`, config).catch(err => ({ error: err, endpoint: 'packages' })),
        axios.get(`${API_BASE_URL}/enquiry-form/`, config).catch(err => ({ error: err, endpoint: 'enquiries' })),
        axios.get(`${API_BASE_URL}/holiday-form/`, config).catch(err => ({ error: err, endpoint: 'holiday-enquiries' })),
        axios.get(`${API_BASE_URL}/umrah-form/`, config).catch(err => ({ error: err, endpoint: 'umrah-enquiries' })),
        axios.get(`${API_BASE_URL}/starting-cities/`, config).catch(err => ({ error: err, endpoint: 'starting-cities' })),
        axios.get(`${API_BASE_URL}/itinerary-masters/`, config).catch(err => ({ error: err, endpoint: 'itinerary-masters' })),
        axios.get(`${API_BASE_URL}/nationalities/`, config).catch(err => ({ error: err, endpoint: 'nationalities' })),
        axios.get(`${API_BASE_URL}/umrah-destinations/`, config).catch(err => ({ error: err, endpoint: 'umrah-destinations' })),
        axios.get(`${API_BASE_URL}/visas/`, config).catch(err => ({ error: err, endpoint: 'visas' })),
        axios.get(`${API_BASE_URL}/visa-applications/`, config).catch(err => ({ error: err, endpoint: 'visa-applications' })),
      ];

      const responses = await Promise.all(fetchPromises);

      // Process responses and handle errors
      const newStats = {
        destinations: 0,
        packages: 0,
        enquiries: 0,
        holidayEnquiries: 0,
        umrahEnquiries: 0,
        startingCities: 0,
        itineraryMasters: 0,
        nationalities: 0,
        umrahDestinations: 0,
        visas: 0,
        visaApplications: 0,
      };

      const allEnquiries = [];
      const errors = [];

      responses.forEach((response, index) => {
        const endpoints = ['destinations', 'packages', 'enquiries', 'holiday-enquiries', 'umrah-enquiries', 'starting-cities', 'itinerary-masters', 'nationalities', 'umrah-destinations', 'visas', 'visa-applications'];
        const endpoint = endpoints[index];

        if (response.error) {
          console.error(`Error fetching ${endpoint}:`, response.error);
          errors.push(`${endpoint}: ${response.error.message}`);
        } else if (response.data) {
          const count = Array.isArray(response.data) ? response.data.length : 0;

          switch (endpoint) {
            case 'destinations':
              newStats.destinations = count;
              break;
            case 'packages':
              newStats.packages = count;
              break;
            case 'enquiries':
              newStats.enquiries = count;
              allEnquiries.push(...response.data.map(item => ({ ...item, type: 'General' })));
              break;
            case 'holiday-enquiries':
              newStats.holidayEnquiries = count;
              allEnquiries.push(...response.data.map(item => ({ ...item, type: 'Holiday' })));
              break;
            case 'umrah-enquiries':
              newStats.umrahEnquiries = count;
              allEnquiries.push(...response.data.map(item => ({ ...item, type: 'Umrah' })));
              break;
            case 'starting-cities':
              newStats.startingCities = count;
              break;
            case 'itinerary-masters':
              newStats.itineraryMasters = count;
              break;
            case 'nationalities':
              newStats.nationalities = count;
              break;
            case 'umrah-destinations':
              newStats.umrahDestinations = count;
              break;
            case 'visas':
              newStats.visas = count;
              break;
            case 'visa-applications':
              newStats.visaApplications = count;
              break;
          }
        }
      });

      setStats(newStats);

      // Sort enquiries by ID (most recent first) and take latest 5
      const sortedEnquiries = allEnquiries
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 5);

      setRecentEnquiries(sortedEnquiries);
      // setLastUpdated(new Date());

      if (errors.length > 0) {
        setError(`Partial data loaded. Errors: ${errors.join(', ')}`);
      } else {
        setError(null);
      }

      console.log("Dashboard data loaded successfully:", { stats: newStats, enquiriesCount: sortedEnquiries.length });

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError(`Failed to load dashboard data: ${err.message}. Please check if the Django backend is running on ${API_BASE_URL}`);
      }
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getEnquiryName = (enquiry) => {
    if (enquiry.name) return enquiry.name;
    if (enquiry.full_name) return enquiry.full_name;
    if (enquiry.first_name) return `${enquiry.first_name} ${enquiry.last_name || ""}`.trim();
    return "Unknown";
  };

  const getEnquiryPurpose = (enquiry) => {
    return enquiry.purpose || enquiry.message || "Regular Enquiry";
  };

  const getEnquiryContact = (enquiry) => {
    return {
      email: enquiry.email || "N/A",
      phone: enquiry.phone || "N/A"
    };
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to Goimomi Admin Dashboard
            </h2>
            <div className="flex gap-3">
            </div>
          </div>



          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#14532d]"></div>
              <p className="mt-2 text-gray-600">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
                <AdminCard title="Destinations" count={stats.destinations} link="/admin/destinations" />
                <AdminCard title="Holiday Packages" count={stats.packages} link="/admin/packages" />
                <AdminCard title="Starting Cities" count={stats.startingCities} link="/admin/starting-cities" />
                <AdminCard title="Itinerary Masters" count={stats.itineraryMasters} link="/admin/itinerary-masters" />
                <AdminCard title="Goimomi Enquiries" count={stats.enquiries} link="/admin/enquiries" />
                <AdminCard title="Holiday Enquiries" count={stats.holidayEnquiries} link="/admin/holiday-enquiries" />
                <AdminCard title="Umrah Enquiries" count={stats.umrahEnquiries} link="/admin/umrah-enquiries" />
                <AdminCard title="Nationalities" count={stats.nationalities} link="/admin/nationalities" />
                <AdminCard title="Umrah Destinations" count={stats.umrahDestinations} link="/admin/umrah-destinations" />
                <AdminCard title="Visas" count={stats.visas} link="/admin/visas" />
                <AdminCard title="Visa Applications" count={stats.visaApplications} link="/admin/visa-applications" />
              </div>

              {/* Recent Enquiries */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Recent Enquiries</h3>
                  <button
                    onClick={fetchDashboardData}
                    className="text-sm bg-[#14532d] text-white px-3 py-1 rounded hover:bg-[#0f4a24]"
                  >
                    Refresh
                  </button>
                </div>

                {recentEnquiries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50/50">
                          <th className="text-left py-3 px-2 uppercase text-[10px] tracking-widest text-gray-400">Name</th>
                          <th className="text-left py-3 px-2 uppercase text-[10px] tracking-widest text-gray-400">Type</th>
                          <th className="text-left py-3 px-2 uppercase text-[10px] tracking-widest text-gray-400">Email</th>
                          <th className="text-left py-3 px-2 uppercase text-[10px] tracking-widest text-gray-400">Phone</th>
                          <th className="text-left py-3 px-2 uppercase text-[10px] tracking-widest text-gray-400">Purpose</th>
                          <th className="py-3 px-2 text-center uppercase text-[10px] tracking-widest text-gray-400">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEnquiries.map((enquiry) => (
                          <tr key={`${enquiry.type}-${enquiry.id}`} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2 font-medium">{getEnquiryName(enquiry)}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${enquiry.type === 'General' ? 'bg-blue-100 text-blue-700' :
                                enquiry.type === 'Holiday' ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                {enquiry.type}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-gray-600">{enquiry.email || 'N/A'}</td>
                            <td className="py-3 px-2 text-gray-600">{enquiry.phone || 'N/A'}</td>
                            <td className="py-3 px-2 text-gray-500 italic max-w-[150px] truncate">
                              {getEnquiryPurpose(enquiry)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <button
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className="bg-[#14532d] hover:bg-[#0f4a24] text-white px-3 py-1 rounded text-xs font-bold transition-all"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent enquiries found</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {
        selectedEnquiry && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-[#14532d] p-4 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">Enquiry Details</h2>
                  <p className="text-green-100 text-[10px] uppercase font-bold tracking-widest">{selectedEnquiry.type} Enquiry</p>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                    <p className="font-semibold text-gray-900">{getEnquiryName(selectedEnquiry)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Submitted</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedEnquiry.created_at || selectedEnquiry.submitted_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-semibold text-blue-600 break-all">{selectedEnquiry.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                    <p className="font-semibold text-gray-900">{selectedEnquiry.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Message / Purpose</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100 shadow-inner max-h-[200px] overflow-y-auto">
                    {getEnquiryPurpose(selectedEnquiry)}
                  </div>
                </div>

                {selectedEnquiry.type === 'Holiday' && selectedEnquiry.package_type && (
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Requested Package</p>
                      <p className="text-sm font-bold text-green-900">{selectedEnquiry.package_type}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all text-xs uppercase"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminDashboard;
