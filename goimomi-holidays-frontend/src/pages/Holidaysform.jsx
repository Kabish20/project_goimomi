import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";

const HOLIDAY_TYPES = [
  "Beach", "Nightlife", "Family", "Honeymoon", "Hill Station", "Adventure",
  "Nature", "Snow", "Wildlife", "Desert", "Luxury", "Budget", "Romantic",
  "Spiritual", "Religious", "Pilgrimage", "Historical", "Cultural", "Heritage",
  "City Tour", "Shopping", "Food & Cuisine", "Cruise", "Island", "Water Sports",
  "Trekking", "Safari", "Backpacking", "Group Tour", "Solo Travel", "Friends Trip",
  "Weekend Getaway", "Offbeat", "Scenic", "Photography", "Eco Tourism", "Wellness",
  "Ayurveda", "Yoga", "Medical Tourism", "Business", "MICE", "Educational", "Festival Tour"
];

const HolidaysFormModal = ({ isOpen, onClose, packageType }) => {
  const [step, setStep] = useState(1);

  // Step 1 States (Umrah-style)
  const [cities, setCities] = useState([{ cityName: "", nights: 1 }]);
  const [startCity, setStartCity] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [nationality, setNationality] = useState("Indian");

  const [rooms, setRooms] = useState(1);
  const [roomDetails, setRoomDetails] = useState([{ adults: 2, children: 0, childAges: [] }]);
  const [travelerDropdownOpen, setTravelerDropdownOpen] = useState(false);
  const [starRating, setStarRating] = useState("");
  const [holidayType, setHolidayType] = useState("");

  const [roomType, setRoomType] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [transfer, setTransfer] = useState("");
  const [otherInclusions, setOtherInclusions] = useState("");
  const [budget, setBudget] = useState("");

  // Data from Backend
  const [destinationsList, setDestinationsList] = useState([]);
  const [startingCitiesList, setStartingCitiesList] = useState([]);
  const [nationalitiesList, setNationalitiesList] = useState([]);

  // Dropdown States
  const [activeCityIndex, setActiveCityIndex] = useState(null); // Which row in 'cities' is open
  const [citySearch, setCitySearch] = useState("");
  const [isStartCityOpen, setIsStartCityOpen] = useState(false);
  const [startCitySearch, setStartCitySearch] = useState("");
  const [isNationalityOpen, setIsNationalityOpen] = useState(false);
  const [nationalitySearch, setNationalitySearch] = useState("");

  // Fetch Data
  React.useEffect(() => {
    if (isOpen) {
      axios.get("/api/destinations/")
        .then(res => setDestinationsList(res.data))
        .catch(err => console.error("Error fetching destinations:", err));

      axios.get("/api/starting-cities/")
        .then(res => setStartingCitiesList(res.data))
        .catch(err => console.error("Error fetching starting cities:", err));

      axios.get("/api/nationalities/")
        .then(res => setNationalitiesList(res.data))
        .catch(err => console.error("Error fetching nationalities:", err));
    }
  }, [isOpen]);

  // Click Outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".custom-dropdown-container")) {
        setActiveCityIndex(null);
        setIsStartCityOpen(false);
        setIsNationalityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDestinations = destinationsList.filter(d =>
    d.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    (d.country && d.country.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const filteredStartingCities = startingCitiesList.filter(c =>
    c.name.toLowerCase().includes(startCitySearch.toLowerCase())
  );

  const filteredNationalities = nationalitiesList.filter(n =>
    n.nationality.toLowerCase().includes(nationalitySearch.toLowerCase()) ||
    n.country.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  // Step 2 States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Helpers — SAME AS UMRAH
  const updateCity = (i, key, val) => {
    const updated = [...cities];
    updated[i][key] = val;
    setCities(updated);
  };
  const addCity = () => setCities([...cities, { cityName: "", nights: 1 }]);
  const removeCity = (i) => setCities(cities.filter((_, index) => index !== i));

  const travelerSummary = () => {
    const adults = roomDetails.reduce((sum, r) => sum + r.adults, 0);
    const children = roomDetails.reduce((sum, r) => sum + r.children, 0);

    let text = `${rooms} rooms, ${adults} adults`;
    if (children > 0) text += `, ${children} children`;
    return text;
  };

  const adjustRooms = (count) => {
    if (count < 1 || count > 6) return;

    let updated = [...roomDetails];
    if (count > updated.length) {
      updated.push({ adults: 2, children: 0, childAges: [] });
    } else {
      updated = updated.slice(0, count);
    }
    setRooms(count);
    setRoomDetails(updated);
  };

  const updateAdults = (i, val) => {
    const updated = [...roomDetails];
    updated[i].adults = Math.max(1, updated[i].adults + val);
    setRoomDetails(updated);
  };

  const updateChildren = (i, val) => {
    const updated = [...roomDetails];
    const newCount = Math.max(0, updated[i].children + val);
    updated[i].children = newCount;

    // Adjust child ages array
    if (newCount > updated[i].childAges.length) {
      for (let j = updated[i].childAges.length; j < newCount; j++) {
        updated[i].childAges.push("");
      }
    } else {
      updated[i].childAges.length = newCount;
    }
    setRoomDetails(updated);
  };

  const updateChildAge = (roomIdx, childIdx, val) => {
    const updated = [...roomDetails];
    updated[roomIdx].childAges[childIdx] = val;
    setRoomDetails(updated);
  };

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};

    // Validate cities
    if (cities.length === 0) {
      newErrors.cities = "Add at least one destination";
    } else {
      const invalidCity = cities.some(city => !city.cityName || !city.nights);
      if (invalidCity) {
        newErrors.cities = "Complete all destination fields";
      }
    }

    // Validate required fields
    if (!startCity) newErrors.startCity = "Required";
    if (!travelDate) newErrors.travelDate = "Required";
    if (!nationality) newErrors.nationality = "Required";
    if (!starRating) newErrors.starRating = "Required";
    if (!holidayType) newErrors.holidayType = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Required";
    if (!email.trim()) {
      newErrors.email = "Required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email";
    }
    if (!phone.trim()) {
      newErrors.phone = "Required";
    } else if (!/^[\d+\-\s]{10,20}$/.test(phone)) {
      newErrors.phone = "Invalid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmitFinal = async () => {
    if (!validateStep2()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    // Transform cities to match backend expected format (cityName -> destination)
    const formattedCities = cities.map(city => ({
      destination: city.cityName,
      nights: city.nights
    }));

    const totalAdults = roomDetails.reduce((sum, r) => sum + r.adults, 0);
    const totalChildren = roomDetails.reduce((sum, r) => sum + r.children, 0);

    const payload = {
      package_type: packageType,
      cities: formattedCities,
      start_city: startCity,
      travel_date: travelDate,
      nationality: nationality,
      rooms: rooms,
      room_details: roomDetails,
      adults: totalAdults,
      children: totalChildren,
      star_rating: starRating,
      holiday_type: holidayType,
      room_type: roomType,
      meal_plan: mealPlan,
      transfer_details: transfer,
      other_inclusions: otherInclusions,
      budget: budget,
      full_name: fullName,
      email: email,
      phone: phone,
      message: message,
    };

    try {
      const response = await axios.post(
        '/api/holiday-form/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 201) {
        // Show success modal
        setShowSuccessModal(true);

        // Reset form after a short delay
        setTimeout(() => {
          setStep(1);
          setCities([{ cityName: "", nights: 1 }]);
          setStartCity("");
          setTravelDate("");
          setNationality("Indian");
          setRooms(1);
          setRoomDetails([{ adults: 2, children: 0 }]);
          setStarRating("");
          setHolidayType("");
          setRoomType("");
          setMealPlan("");
          setTransfer("");
          setOtherInclusions("");
          setBudget("");
          setFullName("");
          setEmail("");
          setPhone("");
          setMessage("");
          setErrors({});

          // Close the modal after resetting the form
          setTimeout(() => {
            setShowSuccessModal(false);
            onClose();
          }, 2000);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "An error occurred. Please try again later.";
      if (error.response) {
        // Try to get the first validation error message if available
        const data = error.response.data;
        if (typeof data === 'object') {
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      }
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        message="Your holiday enquiry has been submitted successfully! Our team will contact you shortly."
      />
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto relative">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>

          {/* STEP 1 — EXACT UMRAH UI */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-4">Plan Your Customized Holiday</h2>

              {/* Selected Package */}
              {packageType && (
                <div className="p-3 bg-green-50 border-l-4 border-green-600 rounded mb-6">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Selected Package:</span> {packageType}
                  </p>
                </div>
              )}

              {/* MULTI-CITY LIST (Umrah style) */}
              <div className="space-y-3 mb-6">
                {cities.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-full relative custom-dropdown-container">
                      <div
                        className={`border px-3 py-2 rounded w-full bg-white cursor-pointer flex justify-between items-center ${errors.cities ? 'border-red-500' : ''}`}
                        onClick={() => {
                          setActiveCityIndex(activeCityIndex === i ? null : i);
                          setCitySearch("");
                        }}
                      >
                        <span className={item.cityName ? "text-gray-900" : "text-gray-400"}>
                          {item.cityName || "Destination"}
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${activeCityIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {activeCityIndex === i && (
                        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-xl overflow-hidden min-w-[200px]">
                          <div className="p-2 border-b bg-gray-50">
                            <input
                              type="text"
                              placeholder="Search destination..."
                              className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-700"
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                          <ul className="max-h-52 overflow-y-auto py-1">
                            {filteredDestinations.length > 0 ? (
                              filteredDestinations.map((dest) => (
                                <li
                                  key={dest.id}
                                  className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                  onClick={() => {
                                    updateCity(i, "cityName", dest.name);
                                    setActiveCityIndex(null);
                                    if (errors.cities) setErrors({ ...errors, cities: '' });
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span>{dest.name}</span>
                                    {dest.country && <span className="text-[10px] text-gray-400 uppercase">{dest.country}</span>}
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-2 text-gray-500 text-sm italic">No results found</li>
                            )}
                          </ul>
                        </div>
                      )}
                      {errors.cities && <p className="text-red-500 text-sm mt-1">{errors.cities}</p>}
                    </div>

                    <select
                      className="border px-3 py-2 rounded"
                      value={item.nights}
                      onChange={(e) => updateCity(i, "nights", Number(e.target.value))}
                    >
                      {[...Array(30)].map((_, x) => (
                        <option key={x} value={x + 1}>
                          {x + 1} night{x > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>

                    {cities.length > 1 && (
                      <button onClick={() => removeCity(i)} className="text-red-500 text-lg">
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button onClick={addCity} className="text-blue-600 text-sm">
                  + Add Another Destination
                </button>
              </div>

              {/* MAIN TRIP DETAILS (exact Umrah feel) */}
              <div className="grid grid-cols-2 gap-4 mb-6">

                <div>
                  <label className="font-semibold">Starting City *</label>
                  <div className="w-full relative custom-dropdown-container">
                    <div
                      className={`border px-3 py-2 rounded w-full bg-white cursor-pointer flex justify-between items-center mt-1 ${errors.startCity ? 'border-red-500' : ''}`}
                      onClick={() => {
                        setIsStartCityOpen(!isStartCityOpen);
                        setStartCitySearch("");
                      }}
                    >
                      <span className={startCity ? "text-gray-900" : "text-gray-400"}>
                        {startCity || "Starting City"}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isStartCityOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isStartCityOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-xl overflow-hidden">
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
                        <ul className="max-h-52 overflow-y-auto py-1">
                          {filteredStartingCities.length > 0 ? (
                            filteredStartingCities.map((city) => (
                              <li
                                key={city.id}
                                className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                onClick={() => {
                                  setStartCity(city.name);
                                  setIsStartCityOpen(false);
                                  if (errors.startCity) setErrors({ ...errors, startCity: '' });
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{city.name}</span>
                                  {city.region && <span className="text-[10px] text-gray-400 uppercase">{city.region}</span>}
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500 text-sm italic">No results found</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {errors.startCity && <p className="text-red-500 text-sm mt-1">{errors.startCity}</p>}
                  </div>
                </div>

                <div>
                  <label className="font-semibold">Nationality *</label>
                  <div className="w-full relative custom-dropdown-container">
                    <div
                      className={`border px-3 py-2 rounded w-full bg-white cursor-pointer flex justify-between items-center mt-1 ${errors.nationality ? 'border-red-500' : ''}`}
                      onClick={() => {
                        setIsNationalityOpen(!isNationalityOpen);
                        setNationalitySearch("");
                      }}
                    >
                      <span className={nationality ? "text-gray-900" : "text-gray-400"}>
                        {nationality || "Select Nationality"}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isNationalityOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isNationalityOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-xl overflow-hidden">
                        <div className="p-2 border-b bg-gray-50">
                          <input
                            type="text"
                            placeholder="Search nationality..."
                            className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-green-700"
                            value={nationalitySearch}
                            onChange={(e) => setNationalitySearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                        <ul className="max-h-52 overflow-y-auto py-1">
                          {filteredNationalities.length > 0 ? (
                            filteredNationalities.map((nat) => (
                              <li
                                key={nat.id}
                                className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                onClick={() => {
                                  setNationality(nat.nationality);
                                  setIsNationalityOpen(false);
                                  if (errors.nationality) setErrors({ ...errors, nationality: '' });
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{nat.nationality}</span>
                                  <span className="text-[10px] text-gray-400 uppercase">{nat.country}</span>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500 text-sm italic">No results found</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                  </div>
                </div>

                <div>
                  <label className="font-semibold">Travel Date *</label>
                  <div className="w-full">
                    <input
                      type="date"
                      className={`border px-3 py-2 rounded w-full ${errors.travelDate ? 'border-red-500' : ''}`}
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        if (errors.travelDate) setErrors({ ...errors, travelDate: '' });
                      }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.travelDate && <p className="text-red-500 text-sm mt-1">{errors.travelDate}</p>}
                  </div>
                </div>

                {/* TRAVELER DROPDOWN (same as Umrah) */}
                <div className="relative">
                  <label className="font-semibold">Travelers *</label>

                  <button
                    type="button"
                    onClick={() => setTravelerDropdownOpen(!travelerDropdownOpen)}
                    className="border rounded w-full px-3 py-2 mt-1 text-left flex justify-between items-center"
                  >
                    <span>{travelerSummary()}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${travelerDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {travelerDropdownOpen && (
                    <div className="absolute bg-white border shadow-xl rounded w-full mt-2 p-4 z-20">

                      {/* ROOMS */}
                      <div className="flex justify-between mb-3">
                        <span className="font-semibold">Rooms</span>
                        <div className="flex items-center gap-3">
                          <button className="border px-2" onClick={() => adjustRooms(rooms - 1)}>
                            -
                          </button>
                          <span>{rooms}</span>
                          <button className="border px-2" onClick={() => adjustRooms(rooms + 1)}>
                            +
                          </button>
                        </div>
                      </div>

                      {/* ROOM DETAILS */}
                      {roomDetails.map((room, i) => (
                        <div key={i} className="border-t py-3">
                          <p className="font-semibold mb-2">Room {i + 1}</p>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Adults */}
                            <div>
                              <p className="text-sm">Adults (12+)</p>
                              <div className="flex justify-between border rounded px-3 py-2">
                                <button type="button" onClick={() => updateAdults(i, -1)}>-</button>
                                <span>{room.adults}</span>
                                <button type="button" onClick={() => updateAdults(i, 1)}>+</button>
                              </div>
                            </div>

                            {/* Children */}
                            <div>
                              <p className="text-sm">Children</p>
                              <div className="flex justify-between border rounded px-3 py-2">
                                <button type="button" onClick={() => updateChildren(i, -1)}>-</button>
                                <span>{room.children}</span>
                                <button type="button" onClick={() => updateChildren(i, 1)}>+</button>
                              </div>
                            </div>

                            {/* Child Ages */}
                            {room.children > 0 && (
                              <div className="col-span-2 mt-2 grid grid-cols-2 gap-2">
                                {room.childAges.map((age, childIdx) => (
                                  <div key={childIdx}>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Child {childIdx + 1} Age</p>
                                    <input
                                      type="number"
                                      className="border rounded w-full px-2 py-1 text-sm"
                                      value={age}
                                      onChange={(e) => updateChildAge(i, childIdx, e.target.value)}
                                      placeholder="Age"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Star Rating */}
                <div>
                  <label className="font-semibold">Hotel Star Rating</label>
                  <select
                    className={`border rounded px-3 py-2 w-full mt-1 ${errors.starRating ? 'border-red-500' : ''}`}
                    value={starRating}
                    onChange={(e) => {
                      setStarRating(e.target.value);
                      if (errors.starRating) setErrors({ ...errors, starRating: '' });
                    }}
                  >
                    <option value="">Select</option>
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                  </select>
                  {errors.starRating && <p className="text-red-500 text-sm mt-1">{errors.starRating}</p>}
                </div>

                {/* Holiday Type */}
                <div>
                  <label className="font-semibold">Holiday Type</label>
                  <select
                    className={`border rounded px-3 py-2 w-full mt-1 ${errors.holidayType ? 'border-red-500' : ''}`}
                    value={holidayType}
                    onChange={(e) => {
                      setHolidayType(e.target.value);
                      if (errors.holidayType) setErrors({ ...errors, holidayType: '' });
                    }}
                  >
                    <option value="">Select Type</option>
                    {HOLIDAY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.holidayType && <p className="text-red-500 text-sm mt-1">{errors.holidayType}</p>}
                </div>

                {/* Room Type */}
                <div>
                  <label className="font-semibold">Room Type</label>
                  <input
                    type="text"
                    placeholder="Ex: Deluxe, Suite"
                    className="border rounded px-3 py-2 w-full mt-1"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  />
                </div>

                {/* Meal Plan */}
                <div>
                  <label className="font-semibold">Meal Plan</label>
                  <select
                    className="border rounded px-3 py-2 w-full mt-1"
                    value={mealPlan}
                    onChange={(e) => setMealPlan(e.target.value)}
                  >
                    <option value="">Select Meal Plan</option>
                    <option value="Breakfast Only">Breakfast Only (CP)</option>
                    <option value="Breakfast + Dinner">Breakfast + Dinner (MAP)</option>
                    <option value="All Meals">All Meals (AP)</option>
                    <option value="No Meals">Room Only</option>
                  </select>
                </div>

                {/* Transfer */}
                <div>
                  <label className="font-semibold">Transfer Details</label>
                  <input
                    type="text"
                    placeholder="Ex: Private AC Car"
                    className="border rounded px-3 py-2 w-full mt-1"
                    value={transfer}
                    onChange={(e) => setTransfer(e.target.value)}
                  />
                </div>

                {/* Budget moved here for 2-col layout */}
                <div>
                  <label className="font-semibold">Budget Per Person</label>
                  <input
                    type="text"
                    className="border px-3 py-2 rounded w-full mt-1"
                    placeholder="Ex: ₹25,000 – ₹60,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>

              </div>

              {/* Other Inclusions */}
              <div className="mb-6">
                <label className="font-semibold">Other Inclusions / Special Requests</label>
                <textarea
                  className="border px-3 py-2 rounded w-full mt-1 h-20 resize-none"
                  placeholder="Tell us about sightseeing, specific activities, etc."
                  value={otherInclusions}
                  onChange={(e) => setOtherInclusions(e.target.value)}
                />
              </div>

              {/* Continue */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
                {errors.cities && <p className="text-red-500 text-sm mt-2">{errors.cities}</p>}
                {errors.startCity && <p className="text-red-500 text-sm mt-2">{errors.startCity}</p>}
                {errors.travelDate && <p className="text-red-500 text-sm mt-2">{errors.travelDate}</p>}
                {errors.nationality && <p className="text-red-500 text-sm mt-2">{errors.nationality}</p>}
                {errors.starRating && <p className="text-red-500 text-sm mt-2">{errors.starRating}</p>}
                {errors.holidayType && <p className="text-red-500 text-sm mt-2">{errors.holidayType}</p>}
              </div>
            </>
          )}

          {/* STEP 2 — SAME UI AS UMRAH */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-4">Your Contact Details</h2>

              <div className="space-y-5">
                <div>
                  <label className="font-semibold">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-semibold">Email *</label>
                  <input
                    type="email"
                    placeholder="xxxxxx@xxxx.com"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-semibold">Phone *</label>
                  <input
                    type="text"
                    placeholder="91-xxxxxxxxxx"
                    className="border px-3 py-2 rounded w-full mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-semibold">Additional Message</label>
                  <textarea
                    placeholder="Tell us more about your preferences..."
                    className="border px-3 py-2 rounded w-full mt-1 h-32 resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-10">
                <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg">
                  ← Back
                </button>

                <button
                  onClick={handleSubmitFinal}
                  className="px-8 py-3 bg-[#14532d] text-white rounded-lg hover:bg-[#0d2f1f]"
                >
                  Submit Enquiry
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default HolidaysFormModal;
