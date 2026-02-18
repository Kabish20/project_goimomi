import React, { useState } from "react";
import CabCruiseForm from "../components/CabCruiseForm";
import cruiseHeroImg from "../assets/cruise_hero.jpg";

const Cruise = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCruise, setSelectedCruise] = useState("");

  const handleBookCruise = (cruiseName) => {
    setSelectedCruise(`Interested in: ${cruiseName}`);
    setIsFormOpen(true);
  };

  const fleet = [
    {
      name: "Mediterranean Luxury Liner",
      pax: "Any Group Size",
      category: "European Cruise"
    },
    {
      name: "Caribbean Island Hopper",
      pax: "Any Group Size",
      category: "Tropical Cruise"
    },
    {
      name: "Singapore & SE Asia Voyager",
      pax: "Any Group Size",
      category: "Asian Cruise"
    },
    {
      name: "Dubai & Arabia Explorer",
      pax: "Any Group Size",
      category: "Gulf Cruise"
    },
    {
      name: "Alaska Glaciers Expedition",
      pax: "Any Group Size",
      category: "Arctic Cruise"
    },
    {
      name: "Norwegian Fjords Adventure",
      pax: "Any Group Size",
      category: "Scenic Cruise"
    },
    {
      name: "World Grand Voyage",
      pax: "Any Group Size",
      category: "Premium Cruise"
    },
    {
      name: "Boutique River Cruise",
      pax: "Any Group Size",
      category: "Inland Cruise"
    }
  ];

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

      {/* Fleet Section (Cruises) */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Our Premium Cruise Collections</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose your perfect voyage from our curated selection of global cruise destinations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleet.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              <div className="p-5 flex-grow">
                <div className="mb-3 flex flex-col gap-2">
                  <span className="w-fit bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-snug">
                    {item.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 015.25-2.906z" />
                    </svg>
                    <span className="font-bold">{item.pax}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold italic">BEST DEALS</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => handleBookCruise(item.name)}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2"
                >
                  Enquire Now
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
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
