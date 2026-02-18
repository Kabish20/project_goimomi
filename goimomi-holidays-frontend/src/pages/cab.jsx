import React, { useState } from "react";
import CabCruiseForm from "../components/CabCruiseForm";

const Cab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");

  const handleBookCar = (carName) => {
    setSelectedCar(`Interested in: ${carName}`);
    setIsFormOpen(true);
  };

  const fleet = [
    {
      name: "Sedan (Toyota Camry / Hyundai Sonata)",
      pax: "2-3 Pax",
      category: "Executive Sedan"
    },
    {
      name: "Ford Taurus",
      pax: "2-3 Pax",
      category: "Premium Sedan"
    },
    {
      name: "Hyundai H1 (Staria/Starex)",
      pax: "3-5 Pax",
      category: "Luxury Van"
    },
    {
      name: "GMC Yukon XL (22-24)",
      pax: "6-7 Pax",
      category: "Full-Size SUV"
    },
    {
      name: "NEW GMC Yukon XL 2025",
      pax: "6-7 Pax",
      category: "Luxury SUV"
    },
    {
      name: "Hiace High Roof",
      pax: "7-9 Pax",
      category: "Family Van"
    },
    {
      name: "Toyota Coaster (with Driver)",
      pax: "10-13 Pax",
      category: "Mini Bus"
    }
  ];

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1554672408-730436b60dde?q=80&w=2000&auto=format&fit=crop')",
            filter: "brightness(0.6)"
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Premium Cab Services <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600"
              style={{
                display: "inline-block",
                padding: "0.1em 0"
              }}
            >
              For Your Comfort
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Experience hassle-free travel with our professional drivers and well-maintained fleet.
            From airport transfers to local sightseeing, we've got you covered.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#14532d] hover:bg-[#0f4a24] text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <span>Book Your Cab Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fleet Section */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Our Premium Fleet</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose from our wide range of vehicles designed for every need and group size.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleet.map((car, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              <div className="p-5 flex-grow">
                <div className="mb-3 flex flex-col gap-2">
                  <span className="w-fit bg-green-50 text-green-700 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                    {car.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300 leading-snug">
                    {car.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="font-bold">{car.pax}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold italic">24/7 AVAIL</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => handleBookCar(car.name)}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2"
                >
                  Book Now
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Services Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Airport Transfers",
                desc: "Reliable and punctual pickups and drop-offs to ensure you never miss a flight.",
                icon: "✈️"
              },
              {
                title: "Business Travel",
                desc: "Arrive in style and comfort for your meetings with our premium sedan fleet.",
                icon: "💼"
              },
              {
                title: "Family Outings",
                desc: "Spacious vans and SUVs to accommodate your entire family and luggage comfortably.",
                icon: "👨‍👩‍👧‍👦"
              }
            ].map((service, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CabCruiseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCar("");
        }}
        type="Cab"
        initialDescription={selectedCar}
      />

    </div>
  );
};

export default Cab;
