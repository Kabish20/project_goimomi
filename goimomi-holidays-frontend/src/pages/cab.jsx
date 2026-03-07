import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Clock, Users, ArrowLeftRight } from "lucide-react";
import api from "../api";
import SearchableSelect from "../components/admin/SearchableSelect";
import CabCruiseForm from "../components/CabCruiseForm";
import cabSearchBg from "../assets/Hero/cab_search_bg_v4.jpg";

const Cab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");
  const [tripType, setTripType] = useState("one-way");
  const [destinations, setDestinations] = useState([]);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const guestPopoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isGuestsOpen && !event.target.closest('.guest-selector')) {
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGuestsOpen]);

  const [searchParams, setSearchParams] = useState({
    fromId: "",
    toId: "",
    fromName: "",
    toName: "",
    pickupDate: "2026-03-08T14:30",
    returnDate: "2026-03-09T14:30",
    guests: 1
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get("/api/destinations/");
      if (Array.isArray(response.data)) {
        const options = response.data.map(d => ({
          label: d.name,
          value: d.id.toString(),
          subtitle: d.country || ""
        }));
        setDestinations(options);
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  const handleSwap = () => {
    setSearchParams(prev => ({
      ...prev,
      fromId: prev.toId,
      toId: prev.fromId,
      fromName: prev.toName,
      toName: prev.fromName
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const fromLabel = searchParams.fromName || "---";
    const toLabel = searchParams.toName || "---";

    const details = tripType === "return"
      ? `Return Transfer Enquiry: From ${fromLabel} to ${toLabel}. Pickup: ${searchParams.pickupDate}, Return: ${searchParams.returnDate} for ${searchParams.guests} guests.`
      : `One-way Transfer Enquiry: From ${fromLabel} to ${toLabel} on ${searchParams.pickupDate} for ${searchParams.guests} guests.`;

    setSelectedCar(details);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hero Section with Search */}
      <div
        className="relative h-[45vh] md:h-[50vh] flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 83, 45, 0.35), rgba(20, 83, 45, 0.35)), url(${cabSearchBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-6xl z-10 -mt-8">
          {/* Tab Navigation - Only Transfers */}
          <div className="flex mb-[-1px] relative z-20">
            <div className="bg-white px-6 py-2.5 rounded-t-xl font-bold text-[#14532d] flex items-center gap-2 shadow-sm border-b-2 border-white text-sm">
              Transfers
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-r-xl rounded-bl-xl shadow-xl p-3 md:p-4">
            <form onSubmit={handleSearch}>
              {/* Trip Type Selector */}
              <div className="flex gap-6 mb-4 ml-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === "one-way"}
                      onChange={() => setTripType("one-way")}
                      className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-[#ff4d1a] transition-all"
                    />
                    <div className="absolute h-1.5 w-1.5 rounded-full bg-[#ff4d1a] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-tight">One-way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === "return"}
                      onChange={() => setTripType("return")}
                      className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-[#ff4d1a] transition-all"
                    />
                    <div className="absolute h-1.5 w-1.5 rounded-full bg-[#ff4d1a] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-tight">Return</span>
                </label>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                {/* From & To with Swap */}
                <div className={`${tripType === 'return' ? 'md:col-span-4' : 'md:col-span-5'} grid grid-cols-1 md:grid-cols-2 gap-1.5 relative`}>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d1a] z-10 pointer-events-none">
                      <MapPin size={16} />
                    </div>
                    <SearchableSelect
                      options={destinations}
                      value={searchParams.fromId}
                      onChange={(val) => {
                        const opt = destinations.find(d => d.value === val);
                        setSearchParams(prev => ({ ...prev, fromId: val, fromName: opt?.label || "" }));
                      }}
                      placeholder="From city"
                      size="compact"
                      className="!pl-9 !py-2.5 !text-xs !border-2 !border-gray-200 !rounded-lg"
                    />
                  </div>

                  {/* Swap Icon */}
                  <div
                    onClick={handleSwap}
                    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-0.5 rounded-md border border-gray-100 shadow-sm text-gray-400 hover:text-[#ff4d1a] cursor-pointer transition-colors active:scale-90"
                  >
                    <ArrowLeftRight size={12} />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d1a] z-10 pointer-events-none">
                      <MapPin size={16} />
                    </div>
                    <SearchableSelect
                      options={destinations}
                      value={searchParams.toId}
                      onChange={(val) => {
                        const opt = destinations.find(d => d.value === val);
                        setSearchParams(prev => ({ ...prev, toId: val, toName: opt?.label || "" }));
                      }}
                      placeholder="To city"
                      size="compact"
                      className="!pl-9 !py-2.5 !text-xs !border-2 !border-gray-200 !rounded-lg"
                    />
                  </div>
                </div>

                {/* Pickup Date & Time */}
                <div className={`${tripType === 'return' ? 'md:col-span-4 grid grid-cols-2 gap-2' : 'md:col-span-3'}`}>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d1a] transition-colors pointer-events-none">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="datetime-local"
                      value={searchParams.pickupDate}
                      onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all text-xs font-bold text-gray-900"
                    />
                  </div>

                  {tripType === "return" && (
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d1a] transition-colors pointer-events-none">
                        <Calendar size={16} />
                      </div>
                      <input
                        type="datetime-local"
                        value={searchParams.returnDate}
                        onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all text-xs font-bold text-gray-900"
                      />
                    </div>
                  )}
                </div>

                {/* Guests */}
                <div className="md:col-span-2 relative group guest-selector">
                  <div
                    onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                    className="flex items-center gap-3 w-full pl-9 pr-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#ff4d1a] transition-all"
                  >
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Users size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{searchParams.guests} guests</span>
                  </div>

                  {isGuestsOpen && (
                    <div
                      ref={guestPopoverRef}
                      className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-4 z-50 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <span className="text-sm font-bold text-gray-500">Guests</span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setSearchParams(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                          >
                            <span className="text-xl font-light">−</span>
                          </button>
                          <span className="text-sm font-bold text-gray-900 min-w-[12px] text-center">{searchParams.guests}</span>
                          <button
                            type="button"
                            onClick={() => setSearchParams(prev => ({ ...prev, guests: prev.guests + 1 }))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                          >
                            <span className="text-xl font-light">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <div className="md:col-span-2 self-end">
                  <button
                    type="submit"
                    className="w-full h-[42px] bg-gradient-to-r from-[#ff4d1a] to-[#ff8c1a] text-white rounded-lg font-bold uppercase tracking-wider shadow-md hover:shadow-[#ff4d1a]/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>



        </div>
      </div>

      {/* Benefits Content - Also minimized */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-inner">✈️</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Airport Transfers</h3>
            <p className="text-gray-500 text-xs">Punctual pickups to and from all major airports.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-inner">💼</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Business Travel</h3>
            <p className="text-gray-500 text-xs">Arrive in comfort with our premium fleet and drivers.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-inner">🏙️</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">City Tours</h3>
            <p className="text-gray-500 text-xs">Explore with our experienced local drivers.</p>
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

