import React, { useState, useEffect } from "react";
import api from "../../api";
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
        api.get(`${API_BASE_URL}/enquiry-form/`),
        api.get(`${API_BASE_URL}/holiday-form/`),
        api.get(`${API_BASE_URL}/umrah-form/`)
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
        <div className="flex-1 overflow-y-auto p-4 bg-[#fcfdfc]">
          <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90 rounded-2xl mb-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter">Enquiry Hub</h1>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                <span className="text-green-500">Service</span> / <span>Enquiries</span> / <span className="text-gray-900">Communication Center</span>
              </p>
            </div>
            <button
              onClick={fetchCounts}
              className="px-6 py-2 rounded-full border-2 border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 shadow-sm"
            >
              Sync Data
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(card.path)}
                  className="bg-white p-4 rounded-xl shadow-lg shadow-green-900/5 border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between h-full min-h-[120px]"
                >
                  <div className={`absolute top-0 right-0 p-2 ${card.bgColor} ${card.color} rounded-bl-lg opacity-40 group-hover:opacity-100 transition-all transform group-hover:scale-110`}>
                    {React.cloneElement(card.icon, { size: 16 })}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[9px] font-black text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">
                      {card.title.split(' ')[0]}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black tracking-tighter ${card.color} leading-none`}>
                        {card.count}
                      </span>
                      <span className="text-gray-300 font-bold uppercase text-[7px] tracking-tighter">NEW</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between text-[8px] font-black text-[#14532d] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                    <span>Manage</span>
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
