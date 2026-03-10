import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Users, ArrowLeftRight } from "lucide-react";
import api from "../api";
import SearchableSelect from "../components/admin/SearchableSelect";
import CabCruiseForm from "../components/CabCruiseForm";
import cabSearchBg from "../assets/Hero/cab_search_bg_v4.jpg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Cab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [transferType, setTransferType] = useState("airport"); // 'airport' or 'intercity'
  const [phone, setPhone] = useState("");
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: null });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pickupPoints, setPickupPoints] = useState([]);

  // Form State
  const [bookingFormData, setBookingFormData] = useState({
    title: "Mr.",
    firstName: "",
    lastName: "",
    email: "",
    pickupPoint: "",
    dropPoint: "",
    luggageCount: "",
    flightNumber: "",
    terminal: "",
    arrivalTime: "",
    departureTime: "",
    pickupLocationDetails: "",
    pickupTime: "",
    specialRequirements: ""
  });

  const guestPopoverRef = useRef(null);

  const handleConfirmBooking = async () => {
    if (!isAgreed) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    if (!bookingFormData.firstName || !bookingFormData.lastName || !phone || !bookingFormData.email) {
      alert("Please fill in all mandatory fields (First Name, Last Name, Email, Phone)");
      return;
    }

    setBookingStatus({ loading: true, success: false, error: null });

    const payload = {
      vehicle_name: selectedVehicle.name,
      vehicle_category: selectedVehicle.category,
      price: selectedVehicle.price,
      from_city: searchParams.fromName,
      to_city: searchParams.toName,
      pickup_date: searchParams.pickupDate,
      guests: searchParams.guests,
      title: bookingFormData.title,
      first_name: bookingFormData.firstName,
      last_name: bookingFormData.lastName,
      email: bookingFormData.email,
      phone: phone,
      luggage_count: bookingFormData.luggageCount,
      transfer_type: transferType,
      flight_number: bookingFormData.flightNumber,
      terminal: bookingFormData.terminal,
      arrival_time: bookingFormData.arrivalTime,
      departure_time: bookingFormData.departureTime,
      pickup_location_details: `Pickup: ${bookingFormData.pickupPoint}, Drop: ${bookingFormData.dropPoint}. ${bookingFormData.pickupLocationDetails}`,
      pickup_time: bookingFormData.pickupTime,
      special_requirements: bookingFormData.specialRequirements
    };

    try {
      await api.post("/api/cab-bookings/", payload);
      setBookingStatus({ loading: false, success: true, error: null });
    } catch (err) {
      console.error("Booking error:", err);
      setBookingStatus({ loading: false, success: false, error: "Failed to confirm booking. Please try again." });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isGuestsOpen && !event.target.closest('.guest-selector')) {
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGuestsOpen]);

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [searchParams, setSearchParams] = useState({
    fromId: "",
    toId: "",
    fromName: "",
    toName: "",
    pickupDate: getTomorrowDate(),
    guests: 1
  });

  useEffect(() => {
    fetchDestinations();
    fetchPickupPoints();
  }, []);

  const fetchPickupPoints = async () => {
    try {
      const response = await api.get("/api/pickup-point-masters/");
      setPickupPoints(response.data);
    } catch (err) {
      console.error("Error fetching pickup points:", err);
    }
  };

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.fromName || !searchParams.toName) {
      alert("Please select both From and To cities.");
      return;
    }
    setSearchLoading(true);
    setIsSearched(true);
    try {
      const response = await api.get("/api/cab-search/", {
        params: {
          from_city: searchParams.fromName,
          to_city: searchParams.toName,
          pickup_date: searchParams.pickupDate
        }
      });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setSelectedCar(`Transfer Enquiry: From ${searchParams.fromName} to ${searchParams.toName} on ${searchParams.pickupDate} for ${searchParams.guests} guests.`);
        setTimeout(() => setIsFormOpen(true), 100);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookNow = (car) => {
    setSelectedVehicle(car);
    setIsBooking(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const vehicles = searchResults;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hero Section or Compact Search */}
      {!isSearched ? (
        <div
          className="relative h-[45vh] md:h-[50vh] flex flex-col items-center justify-center px-4 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 83, 45, 0.35), rgba(20, 83, 45, 0.35)), url(${cabSearchBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="w-full max-w-6xl z-10 -mt-8">
            <div className="flex mb-[-1px] relative z-20">
              <div className="bg-white px-6 py-2.5 rounded-t-xl font-bold text-[#14532d] flex items-center gap-2 shadow-sm border-b-2 border-white text-sm">
                Transfers
              </div>
            </div>

            <div className="bg-white rounded-r-xl rounded-bl-xl shadow-xl p-3 md:p-4">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-12 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-1.5 relative">
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] z-10 pointer-events-none">
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

                    <div
                      onClick={handleSwap}
                      className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-0.5 rounded-md border border-gray-100 shadow-sm text-gray-400 hover:text-[#14532d] cursor-pointer transition-colors active:scale-90"
                    >
                      <ArrowLeftRight size={12} />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] z-10 pointer-events-none">
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

                  <div className="md:col-span-6 lg:col-span-3">
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors pointer-events-none">
                        <Calendar size={16} />
                      </div>
                      <input
                        type="date"
                        value={searchParams.pickupDate}
                        onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all text-xs font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4 lg:col-span-2 relative group guest-selector">
                    <div
                      onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                      className="flex items-center gap-3 w-full pl-9 pr-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#14532d] transition-all"
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

                  <div className="md:col-span-2 lg:col-span-2 self-end">
                    <button
                      type="submit"
                      className="w-full h-[42px] bg-gradient-to-r from-[#14532d] to-[#15803d] text-white rounded-lg font-bold uppercase tracking-wider shadow-md hover:shadow-[#14532d]/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
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
      ) : isBooking ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => setIsBooking(false)}
            className="flex items-center gap-2 text-[#14532d] font-bold text-[10px] mb-4 hover:underline"
          >
            <ArrowLeftRight size={14} className="rotate-180" />
            Back to Search Results
          </button>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Main Booking Form */}
            <div className="lg:w-2/3 space-y-4">
              {/* Vehicle Header Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/4">
                    <img
                      src={selectedVehicle?.image}
                      alt={selectedVehicle?.name}
                      className="w-full h-auto object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">
                      {selectedVehicle?.category}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <span className="text-sm leading-none">🧳</span>
                        {selectedVehicle?.bags} Bags
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-gray-400" />
                        Max {selectedVehicle?.passengers}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-1 rounded-full border border-green-100 uppercase tracking-wider flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        30 min free waiting
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Timeline with Pickup/Drop Points */}
                <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#14532d]/10"></div>
                  <p className="text-[10px] font-black text-gray-900 mb-3 uppercase tracking-widest opacity-80">
                    {new Date(searchParams.pickupDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  <div className="space-y-4 relative">
                    <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 border-l-2 border-dashed border-gray-200"></div>

                    <div className="flex gap-4 relative items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-green-600 bg-white z-10 flex-shrink-0 mt-0.5"></div>
                      <div className="flex-1 -mt-0.5">
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          value={bookingFormData.pickupPoint || ""}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, pickupPoint: e.target.value }))}
                        >
                          <option value="">Select Pickup Point in {searchParams.fromName}</option>
                          {pickupPoints.filter(p => p.city_name === searchParams.fromName).map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 relative items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-[#14532d] bg-[#14532d] z-10 flex-shrink-0 mt-0.5"></div>
                      <div className="flex-1 -mt-0.5">
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          value={bookingFormData.dropPoint || ""}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, dropPoint: e.target.value }))}
                        >
                          <option value="">Select Drop Point in {searchParams.toName}</option>
                          {pickupPoints.filter(p => p.city_name === searchParams.toName).map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancellation Alert */}
                <div className="mt-3 bg-green-50/50 border border-green-100 p-2.5 rounded-xl flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-green-400 flex items-center justify-center text-green-500 text-[9px] font-black">✓</div>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-tight">
                    Free cancellation till {new Date(new Date(searchParams.pickupDate).getTime() - 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (48 hrs before pickup)
                  </p>
                </div>
              </div>

              {/* Guest Details Form */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-base font-black text-gray-900 tracking-tight">Primary Guest Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                    <select
                      value={bookingFormData.title}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      value={bookingFormData.firstName}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                    />
                  </div>
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      value={bookingFormData.lastName}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Email ID</label>
                    <input
                      type="email"
                      placeholder="Enter Email Address"
                      value={bookingFormData.email}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Guest Phone Number</label>
                    <PhoneInput
                      country={"in"}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      enableSearch={true}
                      disableSearchIcon={true}
                      searchPlaceholder="Search country..."
                      inputClass="!w-full !h-[34px] !text-[11px] !font-black !rounded-lg !border-gray-100 !bg-gray-50 focus:!ring-2 focus:!ring-[#14532d]/10 focus:!border-gray-200 transition-all font-sans"
                      containerClass="!w-full"
                      buttonClass="!rounded-l-lg !border-gray-100 !bg-gray-50 hover:!bg-gray-100 transition-colors"
                      dropdownClass="!rounded-xl !shadow-2xl !border-gray-100 !text-xs !font-black !font-sans !py-2 !w-[250px]"
                      searchClass="!mx-2 !my-1 !p-2 !rounded-lg !text-xs !font-sans !border-gray-100 focus:!border-green-600 !w-[calc(100%-16px)]"
                      searchStyle={{
                        margin: '8px',
                        width: 'calc(100% - 16px)',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '900',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Luggage</label>
                    <input
                      type="text"
                      placeholder="Enter number of Bags"
                      value={bookingFormData.luggageCount}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, luggageCount: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setTransferType("airport")}
                      className={`flex-1 py-2 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${transferType === "airport"
                        ? "bg-green-600 text-white shadow-md shadow-green-100"
                        : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                        }`}
                    >
                      Airport Transfer
                    </button>
                    <button
                      onClick={() => setTransferType("intercity")}
                      className={`flex-1 py-2 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${transferType === "intercity"
                        ? "bg-green-600 text-white shadow-md shadow-green-100"
                        : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                        }`}
                    >
                      Inter-city Transfer
                    </button>
                  </div>

                  {transferType === "airport" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Flight Number</label>
                          <input
                            type="text"
                            placeholder="Eg. AB153"
                            value={bookingFormData.flightNumber}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Terminal</label>
                          <input
                            type="text"
                            placeholder="Eg. T3"
                            value={bookingFormData.terminal}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, terminal: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Arrival Time</label>
                          <input
                            type="time"
                            value={bookingFormData.arrivalTime}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Departure Time</label>
                          <input
                            type="time"
                            value={bookingFormData.departureTime}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Pick up Location Details</label>
                        <textarea
                          rows="2"
                          placeholder="Enter complete pickup address with landmarks"
                          value={bookingFormData.pickupLocationDetails}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, pickupLocationDetails: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Pickup Time</label>
                          <input
                            type="time"
                            value={bookingFormData.pickupTime}
                            onChange={(e) => setBookingFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Special Requirements</label>
                  <textarea
                    rows="2"
                    placeholder="Select or add a request"
                    value={bookingFormData.specialRequirements}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-[11px] font-black text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-black text-gray-900 tracking-tight">Please Note</h3>
                <div className="bg-green-50/30 border border-green-100 p-4 rounded-2xl space-y-2">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full border border-green-300 flex items-center justify-center text-green-400 text-[9px] font-bold flex-shrink-0 mt-0.5">i</div>
                    <p className="text-[10px] font-bold text-gray-500 leading-tight">
                      In case of flight delays or cancellations, kindly inform Leamigo Helpline to ensure timely updates.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full border border-green-300 flex items-center justify-center text-green-400 text-[9px] font-bold flex-shrink-0 mt-0.5">i</div>
                    <p className="text-[10px] font-bold text-gray-500 leading-tight">
                      To ensure comfort and safety, book a bigger vehicle if your guest or luggage count is close to the limit.
                    </p>
                  </div>
                </div>
              </div>

              {/* T&C Acknowledge */}
              <div className="flex items-center gap-3 p-2">
                <div
                  onClick={() => setIsAgreed(!isAgreed)}
                  className={`w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${isAgreed ? "border-green-600 bg-green-600 text-white" : "border-gray-300 bg-white text-transparent"
                    }`}
                >
                  <span className="text-[10px] font-black">✓</span>
                </div>
                <p
                  className="text-[11px] font-black text-gray-400 cursor-pointer select-none"
                  onClick={() => setIsAgreed(!isAgreed)}
                >
                  By proceeding, I acknowledge that I have read and agree to the <span className="text-green-500 hover:underline">Terms & Conditions</span> and <span className="text-green-500 hover:underline">Privacy Policy</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 pt-2 pb-8">
                <div className="flex justify-center w-full">
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingStatus.loading || bookingStatus.success}
                    className={`min-w-[220px] py-2.5 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-100 ${bookingStatus.success
                      ? "bg-green-500 text-white cursor-default"
                      : "bg-green-600 text-white hover:bg-green-700"
                      } ${bookingStatus.loading ? "opacity-70 cursor-wait" : ""}`}
                  >
                    {bookingStatus.loading ? "Processing..." : bookingStatus.success ? "Booking Confirmed!" : "Confirm & Pay Later"}
                  </button>
                </div>
                {bookingStatus.error && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-bounce">
                    {bookingStatus.error}
                  </p>
                )}
                {bookingStatus.success && (
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                    Your booking enquiry has been sent successfully!
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-base font-black text-gray-900 mb-4 tracking-tight">Fare Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-black">
                    <span className="text-gray-400 uppercase tracking-widest">Base Price</span>
                    <span className="text-gray-900">₹{Number(selectedVehicle?.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-black text-green-700 uppercase tracking-[0.1em]">Total Amount</span>
                    <span className="text-lg font-black text-green-700">₹{Number(selectedVehicle?.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      ) : !isBooking ? (
        <div className="bg-white border-b border-gray-100 py-1.5 sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex align-center flex-1 min-w-[300px] border border-gray-200 rounded-lg divide-x divide-gray-100">
                {/* From City */}
                <div className="flex-1 p-1 px-2 relative group min-w-[140px]">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0">Where from?</p>
                  <SearchableSelect
                    options={destinations}
                    value={searchParams.fromId}
                    onChange={(val) => {
                      const opt = destinations.find(d => d.value === val);
                      setSearchParams(prev => ({ ...prev, fromId: val, fromName: opt?.label || "" }));
                    }}
                    placeholder="From city"
                    size="compact"
                    className="!pl-0 !py-0 !h-6 !text-[11px] !border-none !bg-transparent !font-black !text-gray-800 focus:!ring-0"
                  />
                </div>

                {/* To City */}
                <div className="flex-1 p-1 px-2 relative group min-w-[140px]">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0">Where to?</p>
                  <SearchableSelect
                    options={destinations}
                    value={searchParams.toId}
                    onChange={(val) => {
                      const opt = destinations.find(d => d.value === val);
                      setSearchParams(prev => ({ ...prev, toId: val, toName: opt?.label || "" }));
                    }}
                    placeholder="To city"
                    size="compact"
                    className="!pl-0 !py-0 !h-6 !text-[11px] !border-none !bg-transparent !font-black !text-gray-800 focus:!ring-0"
                  />
                </div>

                {/* Date */}
                <div className="flex-1 p-1 px-2 min-w-[120px]">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0">Onward journey</p>
                  <div className="flex items-center">
                    <input
                      type="date"
                      value={searchParams.pickupDate}
                      onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
                      className="w-full bg-transparent border-none p-0 h-6 text-[11px] font-black text-gray-800 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex-1 p-1 px-2 relative guest-selector min-w-[100px]">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0">Guests</p>
                  <div
                    onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                    className="flex justify-between items-center h-6 cursor-pointer"
                  >
                    <span className="text-[11px] font-black text-gray-800">{searchParams.guests} Guest</span>
                    <Users size={12} className="text-gray-400" />
                  </div>

                  {isGuestsOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl p-3 z-50 min-w-[180px] animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Pax</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSearchParams(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                            className="w-7 h-7 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 active:scale-95 transition-all font-black"
                          >
                            −
                          </button>
                          <span className="text-[12px] font-black text-gray-800 min-w-[12px] text-center">{searchParams.guests}</span>
                          <button
                            type="button"
                            onClick={() => setSearchParams(prev => ({ ...prev, guests: prev.guests + 1 }))}
                            className="w-7 h-7 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 active:scale-95 transition-all font-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#14532d] text-white px-6 py-3 rounded-lg font-black flex items-center gap-2 hover:bg-[#0f4022] transition-all shadow-md active:scale-95 text-[11px] uppercase tracking-wider h-[46px]"
              >
                <Search size={14} />
                Search
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Content Area */}
      {!isSearched ? (
        <div className="bg-white py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-inner">✈️</div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Airport Transfers</h3>
              <p className="text-gray-500 text-xs">Punctual pickups to and from all major airports.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-inner">💼</div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Business Travel</h3>
              <p className="text-gray-500 text-xs">Arrive in comfort with our premium fleet and drivers.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 text-2xl shadow-inner">🏙️</div>
              <h3 className="text-base font-bold text-gray-800 mb-1">City Tours</h3>
              <p className="text-gray-500 text-xs">Explore with our experienced local drivers.</p>
            </div>
          </div>
        </div>
      ) : !isBooking ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-base font-black text-gray-900 mb-5 tracking-tight">Why Book with Us?</h3>
                <div className="space-y-4">
                  {[
                    { title: "All-inclusive pricing", desc: "No hidden fees or surprises at checkout", icon: "💵" },
                    { title: "Free wait time", desc: "Complimentary wait time up to 60 min", icon: "🕒" },
                    { title: "Flexible Changes", desc: "Modify booking details with ease", icon: "🔄" },
                    { title: "Free Cancellation", desc: "Cancel your booking easily up to 24 hrs before pickup", icon: "📅" },
                    { title: "Meet & Greet included", desc: "Driver will welcome you at pickup", icon: "👥" },
                    { title: "Delay compensation", desc: "Get covered for flight delays", icon: "✈️" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-gray-800 leading-tight mb-0.5">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 leading-normal font-bold">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-3/4 space-y-6">

              {/* Vehicle List */}
              <div className="space-y-4">
                {searchLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100 flex shadow-sm">
                        <div className="w-[28%] bg-gray-50"></div>
                        <div className="flex-1 p-5 space-y-4">
                          <div className="h-6 bg-gray-100 w-1/3 rounded"></div>
                          <div className="h-4 bg-gray-100 w-1/2 rounded"></div>
                          <div className="flex gap-4">
                            <div className="h-4 bg-gray-100 w-16 rounded"></div>
                            <div className="h-4 bg-gray-100 w-16 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : vehicles.length > 0 ? (
                  vehicles.map((car) => (
                    <div key={car.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow max-w-4xl mx-auto">
                      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 divide-gray-100 h-auto md:h-36">
                        {/* Image */}
                        <div className="md:w-[28%] relative overflow-hidden bg-white flex items-center justify-center h-48 md:h-full">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-3 md:px-5 md:py-3 flex flex-col md:flex-row justify-between gap-2">
                          <div className="flex flex-col justify-center space-y-1.5">
                            <div>
                              <h3 className="text-base font-black text-gray-900 leading-tight uppercase tracking-tight">{car.name}</h3>
                              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{car.category}</p>
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                              <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                <Users size={11} className="text-gray-300" />
                                {car.passengers} Pax
                              </div>
                              <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                <span className="text-sm leading-none grayscale opacity-70">🧳</span>
                                {car.bags} Bags
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[8px] font-black text-green-600 bg-green-50/50 px-2.5 py-1 rounded-full w-max border border-green-100 uppercase tracking-widest leading-none">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500 text-white flex items-center justify-center text-[5px] font-black">✓</div>
                              Free cancellation till {new Date(new Date(searchParams.pickupDate).getTime() - 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                            </div>
                          </div>

                          {/* Price & Book */}
                          <div className="flex flex-col justify-center items-end gap-2 min-w-[110px]">
                            <div className="text-right">
                              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest block mb-0.5">Starting from</span>
                              <div className="flex items-baseline gap-0.5 text-[#14532d]">
                                <span className="text-base font-black">₹</span>
                                <span className="text-3xl font-black tracking-tighter">{Number(car?.price || 0).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleBookNow(car)}
                              className="w-full bg-[#14532d] text-white py-1.5 px-3 rounded-lg font-black text-[8px] uppercase tracking-[0.2em] hover:bg-[#0f4022] transition-all shadow-sm active:scale-95 whitespace-nowrap"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🚗</div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">No Vehicles Available</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Try changing your route or date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
