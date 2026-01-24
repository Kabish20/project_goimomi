import React, { useState } from "react";
import CabCruiseForm from "../components/CabCruiseForm";

import cruiseHeroImg from "../assets/cruise_hero.jpg";

const Cruise = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

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
              className="bg-clip-text text-transparent bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1545438102-793ca835df7b?q=80&w=1000&auto=format&fit=crop')",
                WebkitBackgroundClip: "text",
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
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <CabCruiseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        type="Cruise"
      />

    </div>
  );
};

export default Cruise;
