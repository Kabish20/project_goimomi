import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

/* ---------- UI helpers ---------- */
const Section = ({ title, children, className = "bg-white border border-gray-300 p-3" }) => (
  <div className="mb-4">
    <div className="bg-[#14532d] text-white px-3 py-1.5 font-semibold text-xs uppercase">
      {title}
    </div>
    <div className={className}>{children}</div>
  </div>
);

const Input = (props) => (
  <div>
    <input
      {...props}
      className={`bg-white border ${props.error ? 'border-red-500' : 'border-gray-300'} px-2 py-1.5 rounded w-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent ${props.className || ''}`}
    />
    {props.error && <p className="text-red-500 text-[10px] mt-0.5">{props.error}</p>}
  </div>
);


const HolidayPackageAdd = () => {
  const [packageDestinations, setPackageDestinations] = useState([
    { destination: "", nights: 1 },
  ]);

  // Updated state for Itinerary Days to include master_template and image
  const [itineraryDays, setItineraryDays] = useState([
    { day: "1", title: "", description: "", master_template: "", image: null },
  ]);

  const [inclusions, setInclusions] = useState([""]);
  const [exclusions, setExclusions] = useState([""]);
  const [highlights, setHighlights] = useState([""]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    starting_city: "",
    days: "",
    start_date: "",
    group_size: 0,
    offer_price: "",
    price: "",
    header_image: null,
    card_image: null,
    with_flight: false,
  });

  const [startingCities, setStartingCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [itineraryMasters, setItineraryMasters] = useState([]); // State for Master Templates
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const groupedStartingCities = useMemo(() => {
    const groups = startingCities.reduce((acc, city) => {
      const region = (city.region || "Other").toString().trim() || "Other";
      const key = region.toUpperCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(city);
      return acc;
    }, {});

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
    });

    const ordered = {};
    Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        ordered[key] = groups[key];
      });

    return ordered;
  }, [startingCities]);

  const groupedItineraryMasters = useMemo(() => {
    const selectedDestinationNames = packageDestinations
      .map(pd => pd.destination)
      .filter(name => name !== "");

    return itineraryMasters.reduce((acc, master) => {
      let destName = "Global / General";
      if (master.destination) {
        const destObj = destinations.find((d) => d.id === master.destination);
        if (destObj) destName = destObj.name;
      }

      if (!acc[destName]) acc[destName] = [];
      acc[destName].push(master);
      return acc;
    }, {});
  }, [itineraryMasters, destinations]);

  const API_BASE_URL = "/api";

  // Fetch data on mount
  useEffect(() => {
    fetchStartingCities();
    fetchDestinations();
    fetchItineraryMasters(); // Fetch templates
  }, []);

  const fetchStartingCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/starting-cities/`);
      setStartingCities(response.data);
    } catch (err) {
      console.error("Error fetching starting cities:", err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/destinations/`);
      setDestinations(response.data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  const fetchItineraryMasters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/itinerary-masters/`);
      setItineraryMasters(response.data);
    } catch (err) {
      console.error("Error fetching itinerary masters:", err);
    }
  };

  // Sync itinerary days with "Days" input
  useEffect(() => {
    const dayCount = parseInt(formData.days, 10);
    if (!isNaN(dayCount) && dayCount >= 0) {
      setItineraryDays((prev) => {
        const currentCount = prev.length;
        if (dayCount === currentCount) return prev;

        if (dayCount > currentCount) {
          // Add new days
          const newDays = [];
          for (let i = currentCount + 1; i <= dayCount; i++) {
            newDays.push({
              day: i.toString(),
              title: "",
              description: "",
              master_template: "",
              image: null,
            });
          }
          return [...prev, ...newDays];
        } else {
          // Remove extra days
          return prev.slice(0, dayCount);
        }
      });
    }
  }, [formData.days]);

  // Sync Package Destinations with "Days" input (One row per night)
  useEffect(() => {
    const dayCount = parseInt(formData.days, 10);
    const totalNights = isNaN(dayCount) ? 0 : Math.max(0, dayCount - 1);

    setPackageDestinations((prev) => {
      if (prev.length === totalNights) return prev;
      if (totalNights > prev.length) {
        const newRows = [];
        for (let i = prev.length + 1; i <= totalNights; i++) {
          newRows.push({ destination: "", nights: 1 });
        }
        return [...prev, ...newRows];
      } else {
        return prev.slice(0, totalNights);
      }
    });
  }, [formData.days]);

  /* ---------- handlers ---------- */
  const addRow = (setter, row) => setter((p) => [...p, row]);
  const removeRow = (setter, index) =>
    setter((p) => p.filter((_, i) => i !== index));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getNightRange = (index) => {
    let start = 1;
    for (let i = 0; i < index; i++) {
      start += parseInt(packageDestinations[i].nights || 0, 10);
    }
    const nights = parseInt(packageDestinations[index].nights || 0, 10);
    if (nights <= 0) return "";
    if (nights === 1) return `Night ${start}`;
    return `Nights ${start}-${start + nights - 1}`;
  };

  const getDestinationForDay = (dayIndex) => {
    let currentDay = 0;
    for (let dest of packageDestinations) {
      const nights = parseInt(dest.nights || 0, 10);
      if (dayIndex >= currentDay && dayIndex < currentDay + nights) {
        return dest.destination || "---";
      }
      currentDay += nights;
    }
    // Handle the last day (Departure Day)
    const totalNights = packageDestinations.reduce((acc, d) => acc + parseInt(d.nights || 0, 10), 0);
    if (dayIndex === totalNights && packageDestinations.length > 0) {
      return packageDestinations[packageDestinations.length - 1].destination || "---";
    }
    return "---";
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.starting_city) newErrors.starting_city = "Starting city is required";
    if (!formData.days || formData.days <= 0) newErrors.days = "Days must be greater than 0";
    if (!formData.offer_price || formData.offer_price <= 0) newErrors.offer_price = "Offer price is required";
    if (!formData.header_image) newErrors.header_image = "Header image is required";
    if (!formData.card_image) newErrors.card_image = "Card image is required";

    if (packageDestinations.length === 0) {
      newErrors.packageDestinations = "At least one destination is required";
    } else {
      packageDestinations.forEach((dest, index) => {
        if (!dest.destination) newErrors[`dest_${index}`] = "Required";
        if (!dest.nights || dest.nights <= 0) newErrors[`nights_${index}`] = "Required";
      });
    }

    // Itinerary validations
    itineraryDays.forEach((day, index) => {
      if (!day.title || !day.title.trim()) {
        newErrors[`itinerary_title_${index}`] = "Title required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fix the errors in the form.");
      window.scrollTo(0, 0);
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("starting_city", formData.starting_city);
      // Ensure 'days' matches the actual number of itinerary rows
      formDataToSend.append("days", itineraryDays.length);
      if (formData.start_date) formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("group_size", formData.group_size);
      formDataToSend.append("Offer_price", formData.offer_price);
      if (formData.price) formDataToSend.append("price", formData.price);
      formDataToSend.append("with_flight", formData.with_flight);

      // Add main images
      if (formData.header_image) {
        formDataToSend.append("header_image", formData.header_image);
      }
      if (formData.card_image) {
        formDataToSend.append("card_image", formData.card_image);
      }

      // Add package destinations
      formDataToSend.append("package_destinations", JSON.stringify(packageDestinations));

      // Add itinerary days JSON
      const itineraryJson = itineraryDays.map(day => ({
        day: day.day,
        title: day.title,
        description: day.description,
        master_template: day.master_template
      }));
      formDataToSend.append("itinerary_days", JSON.stringify(itineraryJson));

      // Add itinerary images as separate files
      itineraryDays.forEach((day, index) => {
        if (day.image instanceof File) {
          formDataToSend.append(`itinerary_image_${index}`, day.image);
        }
      });

      // Add inclusions, exclusions and highlights
      formDataToSend.append("inclusions_raw", JSON.stringify(inclusions.filter(i => i.trim() !== "")));
      formDataToSend.append("exclusions_raw", JSON.stringify(exclusions.filter(e => e.trim() !== "")));
      formDataToSend.append("highlights_raw", JSON.stringify(highlights.filter(h => h.trim() !== "")));

      const response = await axios.post(`${API_BASE_URL}/packages/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setMessage("Holiday package added successfully!");
        setErrors({});
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          starting_city: "",
          days: "",
          start_date: "",
          group_size: 0,
          offer_price: "",
          price: "",
          header_image: null,
          card_image: null,
        });
        setPackageDestinations([{ destination: "", nights: 1 }]);
        setItineraryDays([{ day: "1", title: "", description: "", master_template: "", image: null }]);
        setInclusions([""]);
        setExclusions([""]);
        setHighlights([""]);
      }
    } catch (err) {
      console.error("Error adding package:", err);
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(`Server Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        setError("Failed to add package. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };



  // Helper to handle Master Template selection
  const handleMasterTemplateChange = (index, templateId) => {
    const copy = [...itineraryDays];
    copy[index].master_template = templateId;

    // Auto-fill fields if a template is selected
    if (templateId) {
      const template = itineraryMasters.find(t => t.id === parseInt(templateId));
      if (template) {
        copy[index].title = template.title || "";
        copy[index].description = template.description || "";
        // Note: We cannot programmatically set the file input value for security reasons.
      }
    }
    setItineraryDays(copy);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar />

        <div className="p-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-1">Add Holiday Package</h1>
                <p className="text-xs text-gray-600">Create a new holiday package for travelers</p>
              </div>
              <button
                onClick={() => navigate('/admin/packages')}
                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 transition"
              >
                Back to List
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* BASIC INFO */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Package Title:*</span>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Magic of Thailand"
                    error={errors.title}
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Description:*</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`bg-white border ${errors.description ? 'border-red-500' : 'border-gray-300'} p-2 rounded w-full h-24 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d] focus:border-transparent`}
                    placeholder="A brief overview of the package..."
                  />
                  {errors.description && <p className="text-red-500 text-[10px] mt-0.5">{errors.description}</p>}
                </label>
              </div>

              <div className="flex gap-6 items-end mt-3">
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Category:*</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`bg-white border ${errors.category ? 'border-red-500' : 'border-gray-300'} p-2 rounded w-48 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#14532d] focus:border-transparent`}
                  >
                    <option value="">Select category</option>
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                    <option value="Umrah">Umrah</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-[10px] mt-0.5">{errors.category}</p>}
                </label>

                <div className="mb-1">
                  <span className="text-gray-700 font-semibold text-xs uppercase block mb-1">Flight:</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="with_flight"
                        checked={formData.with_flight === true}
                        onChange={() => setFormData({ ...formData, with_flight: true })}
                        className="w-3 h-3 text-[#14532d] focus:ring-[#14532d]"
                      />
                      <span className="text-gray-700 text-sm">With Flight</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="with_flight"
                        checked={formData.with_flight === false}
                        onChange={() => setFormData({ ...formData, with_flight: false })}
                        className="w-3 h-3 text-[#14532d] focus:ring-[#14532d]"
                      />
                      <span className="text-gray-700 text-sm">Without Flight</span>
                    </label>
                  </div>
                </div>
              </div>
            </Section>

            {/* LOCATION DETAILS */}
            <Section title="Location Details">
              <label className="block w-48">
                <span className="text-gray-700 font-semibold text-xs uppercase">Starting city:*</span>
                <SearchableSelect
                  options={startingCities.map(city => ({ value: city.name, label: city.name }))}
                  value={formData.starting_city}
                  onChange={(val) => setFormData(prev => ({ ...prev, starting_city: val }))}
                  placeholder="----------"
                />
                {errors.starting_city && <p className="text-red-500 text-[10px] mt-0.5">{errors.starting_city}</p>}
              </label>
            </Section>

            {/* DURATION */}
            <Section title="Duration & Dates">
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Days:*</span>
                  <Input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    error={errors.days}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Start date:</span>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Group size:</span>
                  <Input
                    type="number"
                    name="group_size"
                    value={formData.group_size}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </Section>

            {/* PRICING */}
            <Section title="Pricing">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Offer price:*</span>
                  <Input
                    type="number"
                    name="offer_price"
                    value={formData.offer_price}
                    onChange={handleInputChange}
                    error={errors.offer_price}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-semibold text-xs uppercase">Price:</span>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </Section>

            {/* IMAGES */}
            <Section title="Images">
              <label className="block mb-3">
                <span className="text-gray-700 font-semibold text-xs uppercase">Header image:*</span>
                <Input
                  type="file"
                  name="header_image"
                  onChange={handleFileChange}
                  accept="image/*"
                  error={errors.header_image}
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-semibold text-xs uppercase">Card image:*</span>
                <Input
                  type="file"
                  name="card_image"
                  onChange={handleFileChange}
                  accept="image/*"
                  error={errors.card_image}
                />
              </label>
            </Section>

            {/* PACKAGE DESTINATIONS */}
            <Section title="Package Destinations" className="bg-white border border-gray-300 p-0">
              <div className="text-gray-800">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-3 px-3 py-1.5 bg-[#e6f0eb] text-[#14532d] text-[10px] font-bold uppercase tracking-wider border-b border-green-100">
                  <div className="col-span-2">Stay</div>
                  <div className="col-span-9">Destination City</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {/* Data Rows */}
                {packageDestinations.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-3 py-2 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-2 py-1 px-1.5 bg-gray-100 rounded border border-gray-200 text-center font-bold text-[#14532d] text-xs">
                      Night {i + 1}
                    </div>
                    <div className="col-span-9">
                      <SearchableSelect
                        options={destinations.map(d => ({ value: d.name, label: d.name }))}
                        value={row.destination}
                        onChange={(val) => {
                          const copy = [...packageDestinations];
                          copy[i].destination = val;
                          setPackageDestinations(copy);
                        }}
                        placeholder={`Select city for Night ${i + 1}`}
                      />
                      {errors[`dest_${i}`] && <p className="text-red-500 text-[10px] mt-0.5">{errors[`dest_${i}`]}</p>}
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const currentDays = parseInt(formData.days || 1, 10);
                          if (currentDays > 1) {
                            setFormData(prev => ({ ...prev, days: (currentDays - 1).toString() }));
                            setPackageDestinations(prev => prev.filter((_, idx) => idx !== i));
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-sm transition-transform hover:scale-125"
                        title="Remove this night"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Button */}
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      const newDays = parseInt(formData.days || 1, 10) + 1;
                      setFormData(prev => ({ ...prev, days: newDays.toString() }));
                    }}
                    className="flex items-center gap-1 text-[#14532d] hover:text-[#0f4a24] font-semibold text-xs"
                  >
                    <span>+</span> Add another Night (Increases duration)
                  </button>
                </div>
              </div>
            </Section>

            {/* ITINERARY DAYS - RESTYLED */}
            <Section title="Itinerary Days" className="bg-white border border-gray-300 p-0">
              <div className="text-gray-800">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-3 px-3 py-1.5 bg-[#e6f0eb] text-[#14532d] text-[10px] font-bold uppercase tracking-wider border-b border-green-100">
                  <div className="col-span-1">Day Number</div>
                  <div className="col-span-3">Master Template</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2">Image</div>
                </div>

                {/* Rows */}
                {itineraryDays.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-gray-200 items-start hover:bg-gray-50 transition-colors">
                    {/* Day Number */}
                    <div className="col-span-1 flex flex-col items-center gap-0.5">
                      <div className="w-full py-0.5 px-1.5 bg-gray-100 rounded border border-gray-200 text-center font-bold text-[#14532d] text-xs">
                        {i + 1}
                      </div>
                      <span className="text-[9px] font-bold text-green-800 uppercase text-center leading-none">
                        {getDestinationForDay(i)}
                      </span>
                    </div>

                    {/* Master Template */}
                    <div className="col-span-3">
                      <select
                        value={row.master_template}
                        onChange={(e) => handleMasterTemplateChange(i, e.target.value)}
                        className="w-full bg-white border border-gray-300 text-black px-2 py-1 rounded focus:border-[#14532d] focus:ring-1 focus:ring-[#14532d] focus:outline-none text-xs"
                      >
                        <option value="">Select Template...</option>
                        {(() => {
                          const currentDest = getDestinationForDay(i);
                          // If currentDest is empty, show Global
                          // If currentDest is set, show ONLY that destination's templates
                          const targetGroup = currentDest && currentDest !== "---" ? currentDest : "Global / General";
                          const masters = groupedItineraryMasters[targetGroup] || [];

                          if (masters.length === 0) return <option disabled>No templates for {targetGroup}</option>;

                          return (
                            <optgroup label={targetGroup}>
                              {masters.map((master) => (
                                <option key={master.id} value={master.id}>
                                  {master.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })()}
                      </select>
                      <div className="flex gap-1 mt-1 text-gray-400 text-[10px]">
                        <button type="button" className="hover:text-[#14532d]" title="Edit"><i className="fas fa-pencil-alt"></i></button>
                        <button type="button" className="hover:text-[#14532d]" title="Add"><i className="fas fa-plus"></i></button>
                        <button type="button" className="hover:text-[#14532d]" title="View"><i className="fas fa-eye"></i></button>
                        <button
                          type="button"
                          onClick={() => removeRow(setItineraryDays, i)}
                          className="text-red-500 hover:text-red-700 font-bold"
                          title="Remove this day"
                        >
                          ✖
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="col-span-3">
                      <Input
                        type="text"
                        placeholder="Day Title"
                        value={row.title}
                        onChange={(e) => {
                          const copy = [...itineraryDays];
                          copy[i].title = e.target.value;
                          setItineraryDays(copy);
                        }}
                        error={errors[`itinerary_title_${i}`]}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-3">
                      <textarea
                        value={row.description}
                        onChange={(e) => {
                          const copy = [...itineraryDays];
                          copy[i].description = e.target.value;
                          setItineraryDays(copy);
                        }}
                        rows="3"
                        className="w-full bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded focus:border-[#14532d] focus:ring-1 focus:ring-[#14532d] focus:outline-none text-xs"
                      />
                    </div>

                    {/* Image */}
                    <div className="col-span-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const copy = [...itineraryDays];
                          copy[i].image = e.target.files[0];
                          setItineraryDays(copy);
                        }}
                        className="w-full text-[10px] text-gray-500 file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-green-50 file:text-[#14532d] hover:file:bg-green-100"
                      />
                      {row.image && <p className="text-green-600 text-[9px] mt-0.5">File selected: {row.image.name}</p>}
                    </div>

                  </div>
                ))}

                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() =>
                      addRow(setItineraryDays, {
                        day: "",
                        title: "",
                        description: "",
                        master_template: "",
                        image: null
                      })
                    }
                    className="flex items-center gap-1 text-[#14532d] hover:text-[#0f4a24] font-semibold text-xs"
                  >
                    <span>+</span> Add another Itinerary day
                  </button>
                </div>
              </div>
            </Section>

            {/* INCLUSIONS */}
            <Section title="Inclusions">
              {inclusions.map((inc, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <Input
                    value={inc}
                    onChange={(e) => {
                      const copy = [...inclusions];
                      copy[i] = e.target.value;
                      setInclusions(copy);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(setInclusions, i)}
                    className="text-red-600 hover:text-red-800 font-bold whitespace-nowrap text-sm"
                  >
                    ✖ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRow(setInclusions, "")}
                className="text-[#14532d] hover:text-[#0f4a24] font-semibold text-sm"
              >
                + Add another Inclusion
              </button>
            </Section>

            {/* EXCLUSIONS */}
            <Section title="Exclusions">
              {exclusions.map((exc, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <Input
                    value={exc}
                    onChange={(e) => {
                      const copy = [...exclusions];
                      copy[i] = e.target.value;
                      setExclusions(copy);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(setExclusions, i)}
                    className="text-red-600 hover:text-red-800 font-bold whitespace-nowrap text-sm"
                  >
                    ✖ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRow(setExclusions, "")}
                className="text-[#14532d] hover:text-[#0f4a24] font-semibold text-sm"
              >
                + Add another Exclusion
              </button>
            </Section>

            {/* HIGHLIGHTS */}
            <Section title="Highlights">
              {highlights.map((high, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <Input
                    value={high}
                    onChange={(e) => {
                      const copy = [...highlights];
                      copy[i] = e.target.value;
                      setHighlights(copy);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(setHighlights, i)}
                    className="text-red-600 hover:text-red-800 font-bold whitespace-nowrap text-sm"
                  >
                    ✖ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRow(setHighlights, "")}
                className="text-[#14532d] hover:text-[#0f4a24] font-semibold text-sm"
              >
                + Add another Highlight
              </button>
            </Section>

            {/* SAVE BUTTONS */}
            <div className="flex gap-2 mt-4 bg-white p-4 rounded-lg shadow-sm">
              <button
                type="submit"
                className="bg-[#14532d] px-4 py-2 rounded text-white hover:bg-[#0f4a24] transition text-sm font-semibold"
                disabled={loading}
              >
                {loading ? "SAVING..." : "SAVE"}
              </button>
              <button
                type="button"
                className="bg-[#1f7a45] px-4 py-2 rounded text-white hover:bg-[#1a6338] transition text-sm font-semibold"
                disabled={loading}
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/packages')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition text-sm font-semibold"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
};

export default HolidayPackageAdd;
