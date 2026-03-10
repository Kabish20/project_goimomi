import React, { useState, useEffect } from "react";
import api from "../api";
import CabCruiseForm from "../components/CabCruiseForm";
import cruiseHeroImg from "../assets/cruise_hero.jpg";

const Cruise = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCruise, setSelectedCruise] = useState("");

  const handleBookCruise = (cruiseName) => {
    setSelectedCruise(`Interested in: ${cruiseName}`);
    setIsFormOpen(true);
  };

  const [calendarData, setCalendarData] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await api.get("/api/cruise-calendar/");
        setCalendarData(response.data);
      } catch (err) {
        console.error("Error fetching cruise calendar:", err);
      } finally {
        setLoadingCalendar(false);
      }
    };
    fetchCalendar();
  }, []);

  // No stationary fleet array anymore - using dynamic calendarData

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110"
          style={{
            backgroundImage: `url(${cruiseHeroImg})`,
            filter: "brightness(0.6)"
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Luxury Cruise Holidays <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600"
              style={{
                display: "inline-block",
                padding: "0.1em 0"
              }}
            >
              Sail in Style
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Discover the world's most beautiful destinations from the comfort of a floating palace.
            Exquisite dining, world-class entertainment, and breathtaking views await.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <span>Plan Your Cruise Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cruise Calendar Section */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Sailing Schedule</h2>
          <p className="text-lg text-gray-600">Plan your voyage with our updated cruise calendar.</p>
        </div>

        {loadingCalendar ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        ) : calendarData.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#14532d] text-white">
                <tr className="divide-x divide-white/10">
                  <th className="py-5 px-6 text-left font-bold uppercase tracking-wider">Cruise Nights</th>
                  <th className="py-5 px-6 text-left font-bold uppercase tracking-wider">Itinerary</th>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <th key={m} className="py-5 px-3 text-center font-bold uppercase tracking-wider">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calendarData.map((row, idx) => (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-green-50/50 transition-colors divide-x divide-gray-100`}>
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">{row.cruise_type}</td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{row.itinerary}</td>
                    {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(m => (
                      <td key={m} className="py-4 px-3 text-center text-green-700 font-bold">
                        {row[m] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 italic bg-white rounded-3xl shadow-sm border border-gray-100">
            Schedule updates coming soon. Contact us for latest availability.
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "World-Class Dining",
                desc: "Indulge in gourmet meals prepared by expert chefs across multiple restaurants.",
                icon: "🍽️"
              },
              {
                title: "Luxurious Cabins",
                desc: "Wake up to a new view every day in our premium ocean-view suites.",
                icon: "🛌"
              },
              {
                title: "Global Destinations",
                desc: "Visit multiple countries and cities in a single, seamless vacation journey.",
                icon: "🌍"
              }
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CabCruiseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCruise("");
        }}
        type="Cruise"
        initialDescription={selectedCruise}
      />

    </div>
  );
};

export default Cruise;
