import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import FormModal from "../components/FormModal";

const Holidays = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ===================== FILTER STATES =====================
  const [category, setCategory] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    // 1. Check Query Params (Priority)
    const categoryParam = searchParams.get("category");

    if (categoryParam) {
      setCategory(categoryParam);
    }
    // 2. Check State (Fallback)
    else if (location.state?.category) {
      setCategory(location.state.category);
    }
    // 3. Default (Reset)
    else {
      setCategory("");
    }

    if (location.state?.filter) {
      setDestination(location.state.filter);
    }
  }, [searchParams, location.state]);

  const [nights, setNights] = useState("");
  const [startingCity, setStartingCity] = useState("");
  const [budget, setBudget] = useState([0, 200000]);
  const [flightFilter, setFlightFilter] = useState("All");

  const [isDestOpen, setIsDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const [isStartCityOpen, setIsStartCityOpen] = useState(false);
  const [startCitySearch, setStartCitySearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPkgTitle, setSelectedPkgTitle] = useState("");

  // ===================== PACKAGE DATA =====================
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationsList, setDestinationsList] = useState([]);
  const [startingCitiesList, setStartingCitiesList] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Fetch packages
    axios.get("/api/packages/")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error("Error fetching packages:", err))
      .finally(() => setLoading(false));

    // Fetch destinations
    axios.get("/api/destinations/")
      .then((res) => setDestinationsList(res.data))
      .catch((err) => console.error("Error fetching destinations:", err));

    // Fetch starting cities
    axios.get("/api/starting-cities/")
      .then((res) => setStartingCitiesList(res.data))
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

  // Helper to fix image URLs
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
    }
    return url;
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

    const flightMatch =
      flightFilter === "All" ||
      (flightFilter === "With Flight" && pkg.with_flight === true) ||
      (flightFilter === "Without Flight" && pkg.with_flight === false);

    return (
      categoryMatch &&
      destinationMatch &&
      flightMatch &&
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

        {/* FLIGHT FILTER */}
        <div className="mb-6 border-t pt-4">
          <label className="font-semibold block mb-3 text-gray-800">Flight</label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {["All", "With Flight", "Without Flight"].map((option) => (
              <label key={option} className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="radio"
                  name="flightFilter"
                  value={option}
                  checked={flightFilter === option}
                  onChange={(e) => setFlightFilter(e.target.value)}
                  className="w-3.5 h-3.5 text-[#14532d] focus:ring-[#14532d] cursor-pointer"
                />
                <span className={`text-xs ${flightFilter === option ? "text-[#14532d] font-semibold" : "text-gray-600"} group-hover:text-[#14532d]`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* NIGHTS */}
        <div className="mb-6">
          <label className="font-semibold">Total Nights</label>
          <select
            className="w-full p-2 border rounded mt-2"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
          >
            <option value="">Any</option>
            {[...Array(29)].map((_, i) => (
              <option key={i + 2} value={i + 2}>{i + 2} Nights</option>
            ))}
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
          <label className="font-semibold">Budget (per person)</label>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={budget[1]}
            onChange={(e) => setBudget([0, Number(e.target.value)])}
            className="w-full mt-2 accent-[#14532d]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹ 0</span>
            <span className="font-bold text-[#14532d]">Up to ₹ {budget[1].toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* ====================== RIGHT SIDE (PACKAGE LISTING) ====================== */}
      <div className="w-[75%] p-8 overflow-y-auto h-screen">

        <h2 className="text-2xl font-bold mb-6">Holiday Packages {category && `- ${category}`}</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-400">No Holiday Packages Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria to find matching packages.</p>
            <button
              onClick={() => {
                setCategory("");
                setDestination("");
                setNights("");
                setStartingCity("");
                setBudget([0, 200000]);
                setFlightFilter("All");
              }}
              className="mt-6 bg-[#14532d] text-white px-8 py-2 rounded-lg font-semibold hover:bg-[#0f4022] transition-colors shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row border border-gray-100"
              >
                {/* IMAGE SECTION */}
                <div className="relative w-full md:w-80 h-56 md:h-auto overflow-hidden">
                  <img
                    src={getImageUrl(pkg.card_image)}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Package+Image" }}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    alt={pkg.title}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      {pkg.days} Days / {pkg.days - 1} Nights
                    </span>
                    {pkg.with_flight && (
                      <span className="bg-green-600/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                        ✈️ Flights Included
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2 hover:text-[#14532d] transition-colors cursor-pointer" onClick={() => navigate(`/holiday/${pkg.id}`)}>
                        {pkg.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold">
                        ⭐ 4.5
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                      <span className="text-[#14532d]">📍</span>
                      {pkg.starting_city}
                      {pkg.destinations && pkg.destinations.length > 0 &&
                        ` • ${pkg.destinations.map(d => `${d.name}`).join(" • ")}`}
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {pkg.highlights && pkg.highlights.slice(0, 4).map((h, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                          <span className="text-[#14532d]">✓</span>
                          <span className="truncate">{h.text}</span>
                        </div>
                      ))}
                      {!pkg.highlights?.length && (
                        <>
                          <div className="flex items-center gap-2 text-gray-600 text-sm"><span className="text-[#14532d]">✓</span> Accommodation</div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm"><span className="text-[#14532d]">✓</span> Daily Breakfast</div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm"><span className="text-[#14532d]">✓</span> Sightseeing</div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm"><span className="text-[#14532d]">✓</span> Transfers</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900 leading-none">
                          ₹ {(pkg.Offer_price || 0).toLocaleString()}
                        </span>
                        {pkg.price > pkg.Offer_price && (
                          <span className="text-gray-400 line-through text-sm">
                            ₹ {pkg.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-[10px] mt-0.5">*per person</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="bg-[#14532d] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0f4022] hover:shadow-lg transition-all transform active:scale-95"
                        onClick={() => navigate(`/holiday/${pkg.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageType={selectedPkgTitle}
      />
    </div>
  );
};

export default Holidays;
