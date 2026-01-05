import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExternalLink, RefreshCw, Settings } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminCard from "../../components/admin/AdminCard";

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
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Fetch all data in parallel with error handling for each endpoint
      const fetchPromises = [
        axios.get(`${API_BASE_URL}/destinations/`).catch(err => ({ error: err, endpoint: 'destinations' })),
        axios.get(`${API_BASE_URL}/packages/`).catch(err => ({ error: err, endpoint: 'packages' })),
        axios.get(`${API_BASE_URL}/enquiry-form/`).catch(err => ({ error: err, endpoint: 'enquiries' })),
        axios.get(`${API_BASE_URL}/holiday-form/`).catch(err => ({ error: err, endpoint: 'holiday-enquiries' })),
        axios.get(`${API_BASE_URL}/umrah-form/`).catch(err => ({ error: err, endpoint: 'umrah-enquiries' })),
        axios.get(`${API_BASE_URL}/starting-cities/`).catch(err => ({ error: err, endpoint: 'starting-cities' })),
        axios.get(`${API_BASE_URL}/itinerary-masters/`).catch(err => ({ error: err, endpoint: 'itinerary-masters' })),
        axios.get(`${API_BASE_URL}/nationalities/`).catch(err => ({ error: err, endpoint: 'nationalities' })),
        axios.get(`${API_BASE_URL}/umrah-destinations/`).catch(err => ({ error: err, endpoint: 'umrah-destinations' })),
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
      };

      const allEnquiries = [];
      const errors = [];

      responses.forEach((response, index) => {
        const endpoints = ['destinations', 'packages', 'enquiries', 'holiday-enquiries', 'umrah-enquiries', 'starting-cities', 'itinerary-masters', 'nationalities', 'umrah-destinations'];
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
      setError(`Failed to load dashboard data: ${err.message}. Please check if the Django backend is running on ${API_BASE_URL}`);
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
    if (enquiry.first_name) return `${enquiry.first_name} ${enquiry.last_name || ""}`.trim();
    return "Unknown";
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
                <AdminCard title="Destinations" count={stats.destinations} />
                <AdminCard title="Holiday Packages" count={stats.packages} />
                <AdminCard title="Starting Cities" count={stats.startingCities} />
                <AdminCard title="Itinerary Masters" count={stats.itineraryMasters} />
                <AdminCard title="General Enquiries" count={stats.enquiries} />
                <AdminCard title="Holiday Enquiries" count={stats.holidayEnquiries} />
                <AdminCard title="Umrah Enquiries" count={stats.umrahEnquiries} />
                <AdminCard title="Nationalities" count={stats.nationalities} />
                <AdminCard title="Umrah Destinations" count={stats.umrahDestinations} />
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
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Type</th>
                          <th className="text-left py-2">Contact</th>
                          <th className="text-left py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEnquiries.map((enquiry) => (
                          <tr key={`${enquiry.type}-${enquiry.id}`} className="border-b hover:bg-gray-50">
                            <td className="py-2">{getEnquiryName(enquiry)}</td>
                            <td className="py-2">
                              <span className="px-2 py-1 bg-[#14532d] text-white text-xs rounded">
                                {enquiry.type}
                              </span>
                            </td>
                            <td className="py-2">{enquiry.email || enquiry.phone || 'N/A'}</td>
                            <td className="py-2">{formatDate(enquiry.created_at || enquiry.submitted_at)}</td>
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
    </div>
  );
};

export default AdminDashboard;
