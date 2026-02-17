import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Hotel, MapPin, Ship, Sun, Moon, MessageSquare } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const EnquiryManage = () => {
  const [counts, setCounts] = useState({
    general: 0,
    hotel: 0,
    holiday: 0,
    umrah: 0,
    cab: 0,
    cruise: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [generalRes, holidayRes, umrahRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/enquiry-form/`),
        axios.get(`${API_BASE_URL}/holiday-form/`),
        axios.get(`${API_BASE_URL}/umrah-form/`)
      ]);

      const generalData = generalRes.data || [];
      const holidayData = holidayRes.data || [];
      const umrahData = umrahRes.data || [];

      setCounts({
        general: generalData.filter(e => !e.enquiry_type || e.enquiry_type === 'General').length,
        hotel: generalData.filter(e => e.enquiry_type === 'Hotel').length,
        cab: generalData.filter(e => e.enquiry_type === 'Cab').length,
        cruise: generalData.filter(e => e.enquiry_type === 'Cruise').length,
        holiday: holidayData.length,
        umrah: umrahData.length
      });
      setError("");
    } catch (err) {
      console.error("Error fetching counts:", err);
      setError("Failed to load enquiry statistics.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Hotel Enquiries",
      count: counts.hotel,
      icon: <Hotel size={24} />,
      color: "text-[#14532d]",
      bgColor: "bg-green-50",
      path: "/admin/hotel-enquiries"
    },
    {
      title: "Holiday Enquiries",
      count: counts.holiday,
      icon: <Sun size={24} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: "/admin/holiday-enquiries"
    },
    {
      title: "Umrah Enquiries",
      count: counts.umrah,
      icon: <Moon size={24} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      path: "/admin/umrah-enquiries"
    },
    {
      title: "Cab Enquiries",
      count: counts.cab,
      icon: <MapPin size={24} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      path: "/admin/cab-enquiries"
    },
    {
      title: "Cruise Enquiries",
      count: counts.cruise,
      icon: <Ship size={24} />,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
      path: "/admin/cruise-enquiries"
    },
    {
      title: "General Enquiries",
      count: counts.general,
      icon: <MessageSquare size={24} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: "/admin/general-enquiries"
    }
  ];

  return (
    <div className="flex bg-gray-50 min-h-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Enquiries Dashboard</h1>
              <p className="text-gray-500 mt-1">Overview of all customer requests and bookings</p>
            </div>
            <button
              onClick={fetchCounts}
              className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
            >
              Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white h-32 rounded-xl animate-pulse shadow-sm border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(card.path)}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]"
                >
                  <div className={`absolute top-0 right-0 p-2.5 ${card.bgColor} ${card.color} rounded-bl-xl opacity-70 group-hover:opacity-100 transition-all transform group-hover:scale-110`}>
                    {React.cloneElement(card.icon, { size: 20 })}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest">
                      {card.title}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-4xl font-black tracking-tighter ${card.color}`}>
                        {card.count}
                      </span>
                      <span className="text-gray-300 font-bold uppercase text-[9px] tracking-tighter">New Enquiries</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-[#14532d] uppercase tracking-wider">
                    <span>Manage Requests</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryManage;
