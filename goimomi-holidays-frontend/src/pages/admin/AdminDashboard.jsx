import React, { useState, useEffect } from "react";
import {
  ExternalLink, RefreshCw, Settings,
  MapPin, Package, Calendar, Users,
  Phone, Ship, Building2, Globe,
  Flag, CreditCard, ClipboardList,
  Map, PlaneTakeoff, HelpCircle, Car, Plus, ArrowRight
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminCard from "../../components/admin/AdminCard";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    destinations: 0,
    packages: 0,
    enquiries: 0,
    cabEnquiries: 0,
    cruiseEnquiries: 0,
    hotelEnquiries: 0,
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

      // Fetch all data in parallel with error handling for each endpoint
      const fetchPromises = [
        api.get(`${API_BASE_URL}/destinations/`).catch(err => ({ error: err, endpoint: 'destinations' })),
        api.get(`${API_BASE_URL}/packages/`).catch(err => ({ error: err, endpoint: 'packages' })),
        api.get(`${API_BASE_URL}/enquiry-form/`).catch(err => ({ error: err, endpoint: 'enquiries' })),
        api.get(`${API_BASE_URL}/holiday-form/`).catch(err => ({ error: err, endpoint: 'holiday-enquiries' })),
        api.get(`${API_BASE_URL}/umrah-form/`).catch(err => ({ error: err, endpoint: 'umrah-enquiries' })),
        api.get(`${API_BASE_URL}/starting-cities/`).catch(err => ({ error: err, endpoint: 'starting-cities' })),
        api.get(`${API_BASE_URL}/itinerary-masters/`).catch(err => ({ error: err, endpoint: 'itinerary-masters' })),
        api.get(`${API_BASE_URL}/nationalities/`).catch(err => ({ error: err, endpoint: 'nationalities' })),
        api.get(`${API_BASE_URL}/umrah-destinations/`).catch(err => ({ error: err, endpoint: 'umrah-destinations' })),
        api.get(`${API_BASE_URL}/visas/`).catch(err => ({ error: err, endpoint: 'visas' })),
        api.get(`${API_BASE_URL}/visa-applications/`).catch(err => ({ error: err, endpoint: 'visa-applications' })),
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
              newStats.cabEnquiries = response.data.filter(e => e.enquiry_type === 'Cab').length;
              newStats.cruiseEnquiries = response.data.filter(e => e.enquiry_type === 'Cruise').length;
              newStats.hotelEnquiries = response.data.filter(e => e.enquiry_type === 'Hotel').length;
              allEnquiries.push(...response.data.map(item => ({
                ...item,
                type: item.enquiry_type || 'General'
              })));
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
        .slice(0, 10);

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
    <div className="flex bg-gray-100 h-full overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-black text-gray-900 tracking-tighter uppercase">
              Dashboard Hub
            </h2>
            <div className="flex gap-2">
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
              {/* Core Inventory Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2 mb-4">
                <AdminCard title="Destinations" count={stats.destinations} link="/admin/destinations" icon={<MapPin />} />
                <AdminCard title="Packages" count={stats.packages} link="/admin/packages" icon={<Package />} />
                <AdminCard title="Cities" count={stats.startingCities} link="/admin/starting-cities" icon={<Building2 />} />
                <AdminCard title="Itinerary" count={stats.itineraryMasters} link="/admin/itinerary-masters" icon={<ClipboardList />} />
                <AdminCard title="Countries" count={stats.nationalities} link="/admin/nationalities" icon={<Flag />} />
                <AdminCard title="Umrah Dest" count={stats.umrahDestinations} link="/admin/umrah-destinations" icon={<Map />} />
                <AdminCard title="Visas" count={stats.visas} link="/admin/visas" icon={<Globe />} />
                <AdminCard title="Visa Apps" count={stats.visaApplications} link="/admin/visa-applications" icon={<CreditCard />} />
              </div>

              {/* Enquiry Stats - Horizontal Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="h-1 w-4 bg-[#14532d] rounded-full"></div>
                  <h3 className="text-sm font-medium uppercase tracking-widest text-[#14532d]">Customer Enquiries</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-2">
                  <AdminCard title="General Enq" count={stats.enquiries} link="/admin/enquiries" icon={<HelpCircle />} />
                  <AdminCard title="Cab Enq" count={stats.cabEnquiries} link="/admin/cab-enquiries" icon={<Phone />} />
                  <AdminCard title="Cruise Enq" count={stats.cruiseEnquiries} link="/admin/cruise-enquiries" icon={<Ship />} />
                  <AdminCard title="Hotel Enq" count={stats.hotelEnquiries} link="/admin/hotel-enquiries" icon={<Building2 />} />
                  <AdminCard title="Holiday Enq" count={stats.holidayEnquiries} link="/admin/holiday-enquiries" icon={<Calendar />} />
                  <AdminCard title="Umrah Enq" count={stats.umrahEnquiries} link="/admin/umrah-enquiries" icon={<Building2 />} />
                </div>
              </div>

              {/* Create Booking Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="h-1 w-3 bg-[#14532d] rounded-full"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#14532d]">Create Booking</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                  {/* Visa Booking Card */}
                  <div
                    onClick={() => navigate("/admin/visa-applications/add")}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-lg px-3 py-2 flex items-center justify-between hover:border-[#14532d] hover:shadow-sm transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-[#14532d] group-hover:bg-[#14532d] group-hover:text-white transition-all">
                        <Globe size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">Visa Booking</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Create a new visa application</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-green-50 border border-green-100 text-[#14532d] text-[8px] font-black uppercase tracking-wider">
                        {stats.visaApplications} total
                      </span>
                      <div className="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#14532d] group-hover:text-white transition-all">
                        <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>

                  {/* Cab Booking Card */}
                  <div
                    onClick={() => navigate("/admin/cab-bookings")}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-lg px-3 py-2 flex items-center justify-between hover:border-amber-400 hover:shadow-sm transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <Car size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">Cab Booking</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Manage taxi & transport bookings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-wider">
                        {stats.cabEnquiries} enq
                      </span>
                      <div className="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Recent Enquiries Container - Minimized Compact UI */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter uppercase italic">Recent Enquiries</h3>
                  </div>
                  <button
                    onClick={fetchDashboardData}
                    className="flex items-center gap-1.5 bg-[#14532d] hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:shadow-lg active:scale-95 shadow-md shadow-green-900/5"
                  >
                    <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>

                {recentEnquiries.length > 0 ? (
                  <div className="overflow-x-auto custom-scrollbar max-h-[450px] overflow-y-auto pr-1">
                    <table className="w-full text-sm border-separate border-spacing-y-1.5">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-slate-400">
                          <th className="text-left py-2 px-3 uppercase text-[9px] font-black tracking-[0.2em] bg-white">Name</th>
                          <th className="text-left py-2 px-3 uppercase text-[9px] font-black tracking-[0.2em] bg-white">Type</th>
                          <th className="text-left py-2 px-3 uppercase text-[9px] font-black tracking-[0.2em] bg-white">Email</th>
                          <th className="text-left py-2 px-3 uppercase text-[9px] font-black tracking-[0.2em] bg-white">Phone</th>
                          <th className="text-left py-2 px-3 uppercase text-[9px] font-black tracking-[0.2em] bg-white">Purpose</th>
                          <th className="py-2 px-3 text-center uppercase text-[9px] font-black tracking-[0.2em] bg-white">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEnquiries.map((enquiry) => (
                          <tr key={`${enquiry.type}-${enquiry.id}`} className="group bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 rounded-xl overflow-hidden">
                            <td className="py-2.5 px-3 font-black text-slate-900 text-[10px] uppercase tracking-tight rounded-l-xl border-y border-l border-slate-50/50 group-hover:border-slate-100">{getEnquiryName(enquiry)}</td>
                            <td className="py-2.5 px-3 border-y border-slate-50/50 group-hover:border-slate-100">
                              <span className={`px-2 py-0.5 text-[7px] font-black rounded-md uppercase border border-white shadow-sm ${enquiry.type === 'Holiday' ? 'bg-green-50 text-green-700' :
                                enquiry.type === 'Umrah' ? 'bg-purple-50 text-purple-700' :
                                  enquiry.type === 'Cab' ? 'bg-amber-50 text-amber-700' :
                                    enquiry.type === 'Cruise' ? 'bg-sky-50 text-sky-700' :
                                      enquiry.type === 'Hotel' ? 'bg-emerald-50 text-emerald-700' :
                                          'bg-blue-50 text-blue-700'
                                }`}>
                                {enquiry.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[10px] font-bold text-slate-500 border-y border-slate-50/50 group-hover:border-slate-100">{enquiry.email || 'N/A'}</td>
                            <td className="py-2.5 px-3 text-[10px] font-bold text-slate-500 border-y border-slate-50/50 group-hover:border-slate-100">{enquiry.phone || 'N/A'}</td>
                            <td className="py-2.5 px-3 text-[9px] font-bold text-slate-400 italic max-w-[150px] truncate border-y border-slate-50/50 group-hover:border-slate-100">
                              {getEnquiryPurpose(enquiry)}
                            </td>
                            <td className="py-2.5 px-3 text-center rounded-r-xl border-y border-r border-slate-50/50 group-hover:border-slate-100">
                              <button
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className="bg-[#14532d] hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all shadow-md shadow-green-900/5 active:scale-95"
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
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px]">No recent enquiries found</p>
                  </div>
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
