import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ========== SAMPLE IMAGES FROM ASSETS ==========
import bhutanImg from "../assets/Package/Id1.png";
import vietnamImg from "../assets/Package/Id2.png";
import dubaiImg from "../assets/Package/Id3.png";
import singaporeImg from "../assets/Package/Id4.png";
import malaysiaImg from "../assets/Package/Id5.png";
import saudiArabiaImg from "../assets/Package/Id6.png";
import europeImg from "../assets/Package/Id7.png";
import ukImg from "../assets/Package/Id8.png";
import uzbekistanImg from "../assets/Package/Id9.png";
import nepalImg from "../assets/Package/Id10.png";
import cambodiaImg from "../assets/Package/Id11.png";


const Holidays = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ===================== FILTER STATES =====================
  const [category, setCategory] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (location.state?.filter) {
      setDestination(location.state.filter);
    }
    if (location.state?.category) {
      setCategory(location.state.category);
    } else {
      setCategory("");
    }
  }, [location, location.state]);

  const [nights, setNights] = useState("");
  const [startingCity, setStartingCity] = useState("");
  const [budget, setBudget] = useState([0, 200000]);
  const [flightOption, setFlightOption] = useState("");

  const [isDestOpen, setIsDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const [isStartCityOpen, setIsStartCityOpen] = useState(false);
  const [startCitySearch, setStartCitySearch] = useState("");

  // ===================== PACKAGE DATA =====================
  const [packages, setPackages] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [startingCitiesList, setStartingCitiesList] = useState([]);

  useEffect(() => {
    // Fetch packages
    fetch("/api/packages/")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Error fetching packages:", err));

    // Fetch destinations
    fetch("/api/destinations/")
      .then((res) => res.json())
      .then((data) => setDestinationsList(data))
      .catch((err) => console.error("Error fetching destinations:", err));

    // Fetch starting cities
    fetch("/api/starting-cities/")
      .then((res) => res.json())
      .then((data) => setStartingCitiesList(data))
      .catch((err) => console.error("Error fetching starting cities:", err));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dest-dropdown-container")) {
        setIsDestOpen(false);
      }
      if (!event.target.closest(".startcity-dropdown-container")) {
        setIsStartCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDestinationsList = destinationsList.filter(dest =>
    dest.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    (dest.country && dest.country.toLowerCase().includes(destSearch.toLowerCase()))
  );

  const filteredStartingCitiesList = startingCitiesList.filter(city =>
    city.name.toLowerCase().includes(startCitySearch.toLowerCase())
  );

  // Group starting cities by region
  const groupedStartingCities = startingCitiesList.reduce((acc, city) => {
    const region = city.region || "Other";
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(city);
    return acc;
  }, {});

  // Helper to fix image URLs
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${path}`;
  };

  // ===================== FILTERED LIST =====================
  const filtered = packages.filter((pkg) => {
    const categoryMatch = category ? pkg.category === category : true;

    // Destination match
    const destinationMatch = !destination ? true : (
      pkg.destinations && pkg.destinations.some(d => d.name === destination)
    );

    // Ensure price is a number
    const price = Number(pkg.Offer_price || 0);

    return (
      categoryMatch &&
      destinationMatch &&
      (nights ? pkg.nights === Number(nights) : true) &&
      (startingCity ? pkg.starting_city === startingCity : true) &&
      price >= budget[0] &&
      price <= budget[1]
    );
  });

  return (
    <div className="w-full flex bg-gray-50 min-h-screen">

      {/* ====================== LEFT FILTER PANEL ====================== */}
      <div className="w-[25%] bg-white shadow-md p-6 sticky top-0 h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>

        {/* DESTINATION (SEARCHABLE) */}
        <div className="mb-6 relative dest-dropdown-container">
          <label className="font-semibold block mb-2">Destination</label>

          <div
            className="w-full p-2 border rounded bg-white cursor-pointer flex justify-between items-center"
            onClick={() => setIsDestOpen(!isDestOpen)}
          >
            <span className={destination ? "text-gray-900" : "text-gray-500"}>
              {destination || "Any Destination"}
            </span>
            <span className="text-xs transition-transform duration-200" style={{ transform: isDestOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </div>

          {isDestOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-2 border-b bg-gray-50">
                <input
                  type="text"
                  placeholder="Search destination..."
                  className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-700"
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <ul className="max-h-60 overflow-y-auto py-1">
                <li
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                  onClick={() => {
                    setDestination("");
                    setIsDestOpen(false);
                    setDestSearch("");
                  }}
                >
                  Any Destination
                </li>
                {filteredDestinationsList.length > 0 ? (
                  filteredDestinationsList.map((dest) => (
                    <li
                      key={dest.id}
                      className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm ${destination === dest.name ? 'bg-green-100 font-semibold' : ''}`}
                      onClick={() => {
                        setDestination(dest.name);
                        setIsDestOpen(false);
                        setDestSearch("");
                      }}
                    >
                      <div className="flex flex-col">
                        <span>{dest.name}</span>
                        {dest.country && <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{dest.country}</span>}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-sm italic">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* NIGHTS */}
        <div className="mb-6">
          <label className="font-semibold">Total Nights</label>
          <select
            className="w-full p-2 border rounded mt-2"
            onChange={(e) => setNights(e.target.value)}
          >
            <option value="">Any</option>
            <option value="2">2 Nights</option>
            <option value="3">3 Nights</option>
            <option value="4">4 Nights</option>
            <option value="5">5 Nights</option>
            <option value="6">6 Nights</option>
            <option value="7">7 Nights</option>
            <option value="8">8 Nights</option>
            <option value="9">9 Nights</option>
            <option value="10">10 Nights</option>
            <option value="11">11 Nights</option>
            <option value="12">12 Nights</option>
            <option value="13">13 Nights</option>
            <option value="14">14 Nights</option>
            <option value="15">15 Nights</option>
            <option value="16">16 Nights</option>
            <option value="17">17 Nights</option>
            <option value="18">18 Nights</option>
            <option value="19">19 Nights</option>
            <option value="20">20 Nights</option>
            <option value="21">21 Nights</option>
            <option value="22">22 Nights</option>
            <option value="23">23 Nights</option>
            <option value="24">24 Nights</option>
            <option value="25">25 Nights</option>
            <option value="26">26 Nights</option>
            <option value="27">27 Nights</option>
            <option value="28">28 Nights</option>
            <option value="29">29 Nights</option>
            <option value="30">30 Nights</option>
          </select>
        </div>

        {/* STARTING CITY (SEARCHABLE) */}
        <div className="mb-6 relative startcity-dropdown-container">
          <label className="font-semibold block mb-2">Starting City</label>

          <div
            className="w-full p-2 border rounded bg-white cursor-pointer flex justify-between items-center"
            onClick={() => setIsStartCityOpen(!isStartCityOpen)}
          >
            <span className={startingCity ? "text-gray-900" : "text-gray-500"}>
              {startingCity || "Any Starting City"}
            </span>
            <span className="text-xs transition-transform duration-200" style={{ transform: isStartCityOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </div>

          {isStartCityOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-2 border-b bg-gray-50">
                <input
                  type="text"
                  placeholder="Search starting city..."
                  className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-700"
                  value={startCitySearch}
                  onChange={(e) => setStartCitySearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
              <ul className="max-h-60 overflow-y-auto py-1">
                <li
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                  onClick={() => {
                    setStartingCity("");
                    setIsStartCityOpen(false);
                    setStartCitySearch("");
                  }}
                >
                  Any Starting City
                </li>
                {filteredStartingCitiesList.length > 0 ? (
                  filteredStartingCitiesList.map((city) => (
                    <li
                      key={city.id}
                      className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm ${startingCity === city.name ? 'bg-green-100 font-semibold' : ''}`}
                      onClick={() => {
                        setStartingCity(city.name);
                        setIsStartCityOpen(false);
                        setStartCitySearch("");
                      }}
                    >
                      <div className="flex flex-col">
                        <span>{city.name}</span>
                        {city.region && <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{city.region}</span>}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-sm italic">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* BUDGET */}
        <div className="mb-6">
          <label className="font-semibold">Budget</label>
          <input
            type="range"
            min="0"
            max="200000"
            value={budget[1]}
            onChange={(e) => setBudget([0, Number(e.target.value)])}
            className="w-full mt-2"
          />
          <p className="text-sm mt-1">₹ {budget[0]} – ₹ {budget[1]}</p>
        </div>

        {/* FLIGHT OPTION */}
        <div className="mb-6">
          <label className="font-semibold">Flight Option</label>
          <select
            className="w-full p-2 border rounded mt-2"
            onChange={(e) => setFlightOption(e.target.value)}
          >
            <option value="">Any</option>
            <option value="With Flight">With Flight</option>
            <option value="Without Flight">Without Flight</option>
          </select>
        </div>
      </div>

      {/* ====================== RIGHT SIDE (PACKAGE LISTING) ====================== */}
      <div className="w-[75%] p-8">

        <h2 className="text-2xl font-bold mb-6">Holiday Packages</h2>



        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-xl shadow-md p-5 mb-6 flex gap-6 justify-between"
          >

            {/* IMAGE SECTION */}
            <div className="relative w-72 h-48 bg-gray-200 rounded-lg">
              <img
                src={getImageUrl(pkg.card_image)}
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image" }}
                className="w-72 h-48 rounded-lg object-cover"
                alt={pkg.title}
              />

              {/* Days badge */}
              <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {pkg.days} days
              </span>

              {/* Guaranteed Fixed Departure */}
              <span className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-3 py-1 rounded">
                GUARANTEED FIXED DEPARTURE
              </span>
            </div>

            {/* MAIN DETAILS SECTION */}
            <div className="flex-1">

              <h3 className="text-xl font-semibold">{pkg.title}</h3>

              {/* LOCATION */}
              <p className="text-gray-600 text-sm mt-1">
                {pkg.starting_city}
                {pkg.destinations && pkg.destinations.length > 0 &&
                  ` • ${pkg.destinations.map(d => `${d.name} (${d.nights}N)`).join(" • ")}`}
              </p>

              {/* BULLETS */}
              <ul className="text-gray-700 text-sm mt-3 space-y-1">
                <li>• Accommodation in all places as per itinerary</li>
                <li>• Daily Breakfast & Dinner included</li>
                <li>• All Tours and Transfers on private basis</li>
                <li>• Sightseeing as per the itinerary</li>
                <li>• All Entrance Fees included</li>
              </ul>



              {/* Departure info */}
              <div className="flex gap-12 mt-4 text-sm">
                <div>
                  <p className="text-gray-500">Departure Starting</p>
                  <p className="font-semibold">
                    {pkg.start_date
                      ? new Date(pkg.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "Flexible Dates"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Max. Group Size</p>
                  <p className="font-semibold">{pkg.group_size}</p>
                </div>
              </div>
            </div>

            {/* PRICE & BUTTON */}
            <div className="text-right flex flex-col justify-between">

              <div>
                {pkg.price && (
                  <p className="line-through text-gray-400 text-sm">
                    ₹ {pkg.price.toLocaleString()}
                  </p>
                )}
                <p className="text-2xl font-bold">₹ {(pkg.Offer_price || 0).toLocaleString()}</p>
                <p className="text-gray-500 text-xs">per person</p>
              </div>

              <button
                className="bg-[#14532d] text-white px-6 py-2 rounded-lg mt-4 text-sm"
                onClick={() => navigate(`/holiday/${pkg.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holidays;
