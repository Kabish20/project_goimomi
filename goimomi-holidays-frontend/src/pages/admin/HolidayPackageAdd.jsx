import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";
import { X, MapPin, Calendar, Package } from "lucide-react";

/* ---------- UI helpers ---------- */
const Section = ({ title, children, active }) => (
  <div className={`transition-all duration-500 ease-out ${active ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98] hidden'}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-[#14532d] w-1.5 h-8 rounded-full shadow-lg shadow-green-900/10"></div>
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{title}</h2>
        <div className="flex gap-1 mt-1.5">
          <div className="h-0.5 w-10 bg-green-100 rounded-full"></div>
          <div className="h-0.5 w-2 bg-green-200 rounded-full"></div>
        </div>
      </div>
    </div>
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">{children}</div>
  </div>
);

const FormLabel = ({ label, limit, current, required, optional, info }) => (
  <div className="flex justify-between items-end mb-1.5">
    <div className="flex items-center gap-2">
      <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.15em]">{label} {required && <span className="text-red-500">*</span>}</span>
      {optional && <span className="text-[#14532d] text-[8px] font-black bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
      {info && (
        <div className="group relative">
          <span className="cursor-help text-gray-400 hover:text-[#14532d] transition-colors bg-gray-50 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black border border-gray-100">?</span>
          <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-md bg-opacity-95 border border-white/10 leading-relaxed font-medium">
            {info}
          </div>
        </div>
      )}
    </div>
    {limit && (
      <span className={`text-[9px] font-black tracking-widest ${(current || 0) > limit ? 'text-red-500' : 'text-gray-300'}`}>
        {current || 0} / {limit}
      </span>
    )}
  </div>
);

const Input = (props) => (
  <div>
    <input
      {...props}
      className={`bg-white border-2 ${props.error ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'} px-4 py-2.5 rounded-xl w-full text-gray-900 text-xs font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 hover:shadow-sm ${props.className || ''}`}
    />
    {props.error && <p className="text-red-500 text-[9px] font-black mt-1.5 flex items-center gap-2 ml-1 uppercase tracking-wider italic">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
      {props.error}
    </p>}
  </div>
);

const formatWithCommas = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const cleanValue = value.toString().replace(/\D/g, "");
  if (!cleanValue) return "";
  return new Intl.NumberFormat("en-IN").format(cleanValue);
};


const HolidayPackageAdd = () => {
  const navigate = useNavigate();
  const [packageDestinations, setPackageDestinations] = useState([
    { destination: "", nights: 1 },
  ]);

  // Updated state for Itinerary Days to include master_template, image, and save_to_master toggle
  const [itineraryDays, setItineraryDays] = useState([
    { day: "1", title: "", description: "", master_template: "", image: null, save_to_master: false },
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
    is_active: true,
  });

  const [startingCities, setStartingCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [itineraryMasters, setItineraryMasters] = useState([]); // State for Master Templates
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const TITLE_LIMIT = 200;
  const DESC_LIMIT = 2000;
  const HIGHLIGHTS_LIMIT = 1000;

  const groupedItineraryMasters = useMemo(() => {
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
              save_to_master: false,
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
    if (name === "offer_price" || name === "price") {
      const cleanValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleMasterTemplateChange = (index, templateId) => {
    const copy = [...itineraryDays];
    copy[index].master_template = templateId;
    if (templateId) {
      const template = itineraryMasters.find((t) => t.id === parseInt(templateId));
      if (template) {
        copy[index].title = template.title || "";
        copy[index].description = template.description || "";
      }
    }
    setItineraryDays(copy);
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Package title is required";
    if (!formData.description?.trim()) newErrors.description = "Package description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.starting_city) newErrors.starting_city = "Please select a starting city";
    if (!formData.days || parseInt(formData.days) <= 0) newErrors.days = "Duration (days) must be at least 1";
    if (!formData.offer_price || parseFloat(formData.offer_price) <= 0) newErrors.offer_price = "Offer price must be greater than 0";

    if (packageDestinations.length === 0 && parseInt(formData.days) > 1) {
      newErrors.packageDestinations = "At least one destination night is required";
    } else {
      packageDestinations.forEach((dest, index) => {
        if (!dest.destination) newErrors[`dest_${index}`] = "City required";
      });
    }

    // Itinerary validations
    itineraryDays.forEach((day, index) => {
      if (!day.title || !day.title.trim()) {
        newErrors[`itinerary_title_${index}`] = "Itinerary title required (e.g. Arrival)";
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
      formDataToSend.append("is_active", formData.is_active);

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
          is_active: true,
        });
        setPackageDestinations([{ destination: "", nights: 1 }]);
        setItineraryDays([{ day: "1", title: "", description: "", master_template: "", image: null, save_to_master: false }]);
        setInclusions([""]);
        setExclusions([""]);
        setHighlights([""]);
      }
      // After package is successfully created, save marked itineraries to master
      for (let i = 0; i < itineraryDays.length; i++) {
        const day = itineraryDays[i];
        if (day.save_to_master && day.title) {
          try {
            const masterData = new FormData();
            masterData.append("name", day.title);
            masterData.append("title", day.title);
            masterData.append("description", day.description);

            // Get destination for this day to categorize master
            const destName = getDestinationForDay(i);
            const destObj = destinations.find(d => d.name === destName);
            if (destObj) {
              masterData.append("destination", destObj.id);
            }

            if (day.image) {
              masterData.append("image", day.image);
            }

            await axios.post(`${API_BASE_URL}/itinerary-masters/`, masterData, {
              headers: { "Content-Type": "multipart/form-data" }
            });
            console.log(`Saved day ${i + 1} to master as ${day.master_name}`);
          } catch (mErr) {
            console.error(`Error saving day ${i + 1} to master:`, mErr);
            // We don't stop the main package creation if master saving fails
          }
        }
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



  const navItems = [
    { id: 'overview', label: 'Trip Overview', icon: <Package size={18} /> },
    { id: 'location', label: 'Arrival & Departure', icon: <MapPin size={18} /> },
    { id: 'itinerary', label: 'Day Wise Itinerary', icon: <Calendar size={18} />, subItems: itineraryDays.map((_, i) => ({ id: `day-${i}`, label: `Day ${i + 1}`, dest: getDestinationForDay(i) })) },
    { id: 'pricing', label: 'Pricing', icon: <span className="text-lg">💰</span> },
    { id: 'images', label: 'Images', icon: <span className="text-lg">🖼️</span> },
    { id: 'info', label: 'Trip Information', icon: <span className="text-lg">ℹ️</span> },
  ];

  return (
    <div className="flex bg-[#fcfdfc] h-screen overflow-hidden font-outfit">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');`}
      </style>
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />

        {/* Action Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-3.5 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Add Holiday Package</h1>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
              <span className="text-green-500">Inventory</span> / <span>Holidays</span> / <span className="text-gray-900">New Creation</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
              className="px-6 py-2 rounded-xl border-2 border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 shadow-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-8 py-2 rounded-xl bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:scale-100"
              disabled={loading}
              form="package-form"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Package size={14} />
              )}
              {loading ? "SAVING..." : "SAVE PACKAGE"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex h-full overflow-hidden relative bg-[#fcfdfc]">
          {/* Internal Navigation Sidebar */}
          <div className="w-64 bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar flex flex-col p-4 shrink-0">
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all duration-500 group relative overflow-hidden ${activeSection === item.id ? 'bg-[#14532d] text-white shadow-2xl shadow-green-900/30 -translate-y-1' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    {activeSection === item.id && (
                      <div className="absolute right-0 top-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                    )}
                    <span className={`transition-all duration-500 ${activeSection === item.id ? 'scale-110 rotate-3 text-green-300' : 'text-gray-300 group-hover:text-gray-900 group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    <span className="uppercase tracking-[0.15em] text-[10px]">{item.label}</span>
                  </button>
                  {item.subItems && activeSection === 'itinerary' && (
                    <div className="mt-3 ml-6 pl-4 border-l-2 border-green-50 space-y-1 py-1.5 animate-in slide-in-from-top-4">
                      {item.subItems.map((sub, idx) => (
                        <button
                          key={sub.id}
                          type="button"
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[9px] font-black text-gray-400 hover:bg-gray-50 hover:text-[#14532d] transition-all group relative"
                          onClick={() => {
                            const el = document.getElementById(`itinerary-day-${idx}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                        >
                          <div className={`w-1 h-1 rounded-full ${idx === 0 ? 'bg-green-500' : 'bg-gray-300'} group-hover:scale-150 group-hover:bg-[#14532d] transition-all`}></div>
                          <span className="uppercase tracking-widest">{sub.label}</span>
                          <span className="text-[7.5px] text-gray-300 font-bold ml-auto opacity-0 group-hover:opacity-100 transition-opacity uppercase">{sub.dest}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-4 p-5 bg-[#14532d]/5 rounded-2xl border border-[#14532d]/10 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-16 h-16 bg-[#14532d]/5 rounded-tl-[3rem]"></div>
              <p className="text-[9px] text-[#14532d] font-black uppercase tracking-[0.2em] mb-1.5 opacity-60">Admin Notice</p>
              <p className="text-[9px] font-bold text-gray-600 leading-relaxed italic border-l-2 border-[#14532d]/30 pl-3">Ensure all itinerary details are accurate before publishing.</p>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar bg-[#fcfdfc]">
            <div className="max-w-4xl mx-auto pb-12">
              {/* Messages */}
              {message && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-100 text-[#14532d] rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-green-900/5">
                  <div className="bg-white w-9 h-9 rounded-xl shadow-lg flex items-center justify-center text-lg">✨</div>
                  <p className="font-black text-xs uppercase tracking-wider">{message}</p>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-red-900/5">
                  <div className="bg-white w-9 h-9 rounded-xl shadow-lg flex items-center justify-center text-lg">⚠</div>
                  <p className="font-black text-xs uppercase tracking-wider">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} id="package-form">
                {/* TRIP OVERVIEW */}
                <Section title="Trip Overview" active={activeSection === 'overview'}>
                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <FormLabel
                        label="Trip Title"
                        required
                        limit={TITLE_LIMIT}
                        current={formData.title ? formData.title.length : 0}
                        info="The display name for the package"
                      />
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="SINGAPORE DELIGHT"
                        error={errors.title}
                      />
                    </div>

                    <div>
                      <FormLabel
                        label="Trip Description"
                        required
                        limit={DESC_LIMIT}
                        current={formData.description ? formData.description.length : 0}
                        info="Detail what makes this trip special"
                      />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`bg-white border-2 ${errors.description ? 'border-red-200' : 'border-gray-100'} p-3.5 rounded-xl w-full h-40 text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all hover:border-gray-200`}
                        placeholder="Singapore, a vibrant city-state..."
                      />
                      {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1.5">⚠ {errors.description}</p>}
                    </div>

                    {/* Trip Highlights Integrated into Overview */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-50 pb-6">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 tracking-tight">Trip Highlights</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Core experience identifiers</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addRow(setHighlights, "")}
                          className="bg-[#14532d] text-white px-6 py-2.5 rounded-xl text-[10px] font-black shadow-xl shadow-green-900/10 active:scale-95 transition-all hover:bg-black uppercase tracking-wider"
                        >
                          + ADD HIGHLIGHT
                        </button>
                      </div>

                      <div className="space-y-4">
                        {highlights.map((h, i) => (
                          <div key={i} className="flex gap-4 items-center group animate-in slide-in-from-right-2" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/20"></div>
                            <div className="flex-1">
                              <Input
                                value={h}
                                onChange={(e) => { const copy = [...highlights]; copy[i] = e.target.value; setHighlights(copy); }}
                                placeholder="e.g. Traditional Malay Dinner Experience..."
                                className="!bg-gray-50/30 !border-transparent focus:!bg-white focus:!border-green-100 !rounded-2xl !py-3.5"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRow(setHighlights, i)}
                              className="text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <FormLabel label="Category" required />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`bg-white border-2 ${errors.category ? 'border-red-200' : 'border-gray-100'} p-3 rounded-xl w-full text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all font-bold`}
                        >
                          <option value="">Select category</option>
                          <option value="Domestic">Domestic</option>
                          <option value="International">International</option>
                          <option value="Umrah">Umrah</option>
                        </select>
                      </div>

                      <div className="bg-gray-50/50 p-4 rounded-2xl border-2 border-gray-50 flex gap-6">
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Flight</span>
                          <div className="flex gap-2">
                            {[true, false].map((val) => (
                              <button
                                key={val.toString()}
                                type="button"
                                onClick={() => setFormData({ ...formData, with_flight: val })}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${formData.with_flight === val ? 'bg-[#14532d] border-[#14532d] text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                              >
                                {val ? 'WITH' : 'NO'} FLIGHT
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Status</span>
                          <div className="flex gap-2">
                            {[true, false].map((val) => (
                              <button
                                key={val.toString()}
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: val })}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${formData.is_active === val ? 'bg-[#14532d] border-[#14532d] text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                              >
                                {val ? 'ACTIVE' : 'DRAFT'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                {/* ARRIVAL & DEPARTURE */}
                <Section title="Arrival & Departure" active={activeSection === 'location'}>
                  <div className="space-y-8">
                    <div className="max-w-md">
                      <FormLabel label="Starting City" required />
                      <SearchableSelect
                        options={startingCities.map(city => ({ value: city.name, label: city.name }))}
                        value={formData.starting_city}
                        onChange={(val) => setFormData(prev => ({ ...prev, starting_city: val }))}
                        placeholder="Where the trip starts..."
                      />
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-[0.2em]">Package Destinations</h3>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, days: (parseInt(prev.days || 1) + 1).toString() }))}
                          className="bg-white px-3 py-1.5 rounded-full border-2 border-gray-100 text-[9px] font-black text-[#14532d] hover:bg-green-50 active:scale-95 transition-all"
                        >
                          + ADD MORE NIGHTS
                        </button>
                      </div>

                      <div className="space-y-3">
                        {packageDestinations.map((row, i) => (
                          <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="shrink-0 w-20 py-2 bg-white border-2 border-gray-100 rounded-full text-center font-black text-[#14532d] text-[10px] shadow-sm shadow-green-900/5 uppercase tracking-widest">
                              Night {i + 1}
                            </div>
                            <div className="flex-1">
                              <SearchableSelect
                                options={destinations.map(d => ({ value: d.name, label: d.name, subtitle: d.country }))}
                                value={row.destination}
                                onChange={(val) => {
                                  const copy = [...packageDestinations];
                                  copy[i].destination = val;
                                  setPackageDestinations(copy);
                                }}
                                placeholder="Select city..."
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, days: Math.max(1, parseInt(prev.days || 1) - 1).toString() }))}
                              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-red-300 hover:text-red-500 transition-all active:scale-90"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <FormLabel label="Total Days" required />
                        <Input type="number" name="days" value={formData.days} onChange={handleInputChange} min="1" />
                      </div>
                      <div>
                        <FormLabel label="Group Size" optional />
                        <Input type="number" name="group_size" value={formData.group_size} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                </Section>

                {/* ITINERARY */}
                <Section title="Day Wise Itinerary" active={activeSection === 'itinerary'}>
                  <div className="space-y-12">
                    {itineraryDays.map((row, i) => (
                      <div key={i} id={`itinerary-day-${i}`} className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 relative group/day hover:border-[#14532d]/40 transition-all shadow-sm hover:shadow-2xl hover:shadow-green-900/5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="absolute -left-4 top-10 w-8 h-8 rounded-full bg-red-500 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-[10px] group-hover/day:scale-125 transition-transform z-10">
                          {i + 1}
                        </div>

                        <div className="flex justify-between items-start mb-8 pl-4">
                          <div>
                            <p className="text-[10px] font-black text-[#14532d] uppercase tracking-[0.2em] mb-1">Day {i + 1} Profile</p>
                            <h3 className="text-xl font-black text-gray-900">{getDestinationForDay(i)}</h3>
                          </div>
                          <div className="flex gap-4">
                            <select
                              value={row.master_template}
                              onChange={(e) => handleMasterTemplateChange(i, e.target.value)}
                              className="bg-gray-50 border-2 border-transparent px-4 py-2 rounded-xl text-xs font-bold focus:border-[#14532d] focus:bg-white outline-none transition-all"
                            >
                              <option value="">Load from Master...</option>
                              {(() => {
                                const currentDest = getDestinationForDay(i);
                                const destSpecificMasters = currentDest && currentDest !== "---" ? (groupedItineraryMasters[currentDest] || []) : [];
                                const globalMasters = groupedItineraryMasters["Global / General"] || [];
                                return (
                                  <>
                                    {destSpecificMasters.length > 0 && <optgroup label={`${currentDest} Templates`}>{destSpecificMasters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>}
                                    {globalMasters.length > 0 && <optgroup label="Global Templates">{globalMasters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>}
                                  </>
                                );
                              })()}
                            </select>
                            <button type="button" onClick={() => removeRow(setItineraryDays, i)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"><X size={16} /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4">
                          <div className="space-y-6">
                            <div>
                              <FormLabel label="Trip Title (e.g. Flight Arrival)" required />
                              <Input
                                placeholder="Arrival in Singapore..."
                                value={row.title}
                                onChange={(e) => { const copy = [...itineraryDays]; copy[i].title = e.target.value; setItineraryDays(copy); }}
                                error={errors[`itinerary_title_${i}`]}
                              />
                            </div>
                            <div>
                              <FormLabel label="Description" optional />
                              <textarea
                                value={row.description}
                                onChange={(e) => { const copy = [...itineraryDays]; copy[i].description = e.target.value; setItineraryDays(copy); }}
                                className="bg-gray-50 border-2 border-transparent p-4 rounded-2xl w-full h-40 text-sm font-medium focus:border-[#14532d] focus:bg-white transition-all outline-none"
                                placeholder="Describe the day's journey..."
                              />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <FormLabel label="Day Visual (Image)" optional />
                              <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all min-h-[160px] flex flex-col items-center justify-center ${row.image ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#14532d]/40'}`}>
                                {row.image ? (
                                  <div className="relative group/dayimg">
                                    <img src={URL.createObjectURL(row.image)} alt="Day" className="h-32 w-full object-cover rounded-2xl border-2 border-white shadow-xl transition-transform group-hover/dayimg:scale-[1.05]" />
                                    <button type="button" onClick={() => { const copy = [...itineraryDays]; copy[i].image = null; setItineraryDays(copy); }} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl opacity-0 group-hover/dayimg:opacity-100 transition-opacity"><X size={12} /></button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 mb-2 font-black text-2xl group-hover/day:scale-110 group-hover:rotate-12 transition-all">+</div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Add Preview Image</p>
                                    <input type="file" accept="image/*" onChange={(e) => { const copy = [...itineraryDays]; copy[i].image = e.target.files[0]; setItineraryDays(copy); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                  </>
                                )}
                              </div>
                            </div>
                            <div className={`p-4 rounded-2xl border-2 transition-all ${row.save_to_master ? 'bg-[#14532d] border-[#14532d] text-white' : 'bg-gray-50 border-transparent text-gray-500 hover:border-gray-200 hover:bg-white'}`}>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={row.save_to_master} onChange={(e) => { const copy = [...itineraryDays]; copy[i].save_to_master = e.target.checked; setItineraryDays(copy); }} className="w-5 h-5 rounded-lg border-gray-300 text-[#14532d] focus:ring-[#14532d]" />
                                <div className="flex flex-col">
                                  <span className="text-xs font-black uppercase tracking-tighter">Archive to Masters</span>
                                  <span className="text-[9px] opacity-70 font-medium">Available for future packages</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addRow(setItineraryDays, { day: "", title: "", description: "", master_template: "", image: null })} className="w-full py-6 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#14532d]/40 hover:text-[#14532d] transition-all hover:bg-green-50 active:scale-[0.99] group">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-2xl mb-2 group-hover:scale-110 group-hover:bg-white shadow-sm transition-all">+</div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Discovery Day</span>
                    </button>
                  </div>
                </Section>

                {/* PRICING */}
                <Section title="Pricing" active={activeSection === 'pricing'}>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-50 transition-all group-hover:scale-110"></div>
                      <FormLabel label="Offer Price (Final)" required info="Customer final payable amount" />
                      <div className="relative z-10">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300 group-hover:text-[#14532d] transition-colors">₹</span>
                        <Input type="text" name="offer_price" value={formatWithCommas(formData.offer_price)} onChange={handleInputChange} className="!pl-10 !text-xl !font-black !py-4" error={errors.offer_price} />
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full opacity-50 transition-all group-hover:scale-110"></div>
                      <FormLabel label="Markup Price (Strike)" optional info="Original value for showing discount" />
                      <div className="relative z-10">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300 group-hover:text-red-400 transition-colors">₹</span>
                        <Input type="text" name="price" value={formatWithCommas(formData.price)} onChange={handleInputChange} className="!pl-10 !text-xl !font-black !py-4" />
                      </div>
                    </div>
                  </div>
                </Section>

                {/* IMAGES */}
                <Section title="Media Gallery" active={activeSection === 'images'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className={`relative border-2 border-dashed rounded-[3rem] p-10 transition-all min-h-[320px] flex flex-col items-center justify-center ${formData.header_image ? 'bg-green-50/30 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-[#14532d]/40'} group cursor-pointer`}>
                      {formData.header_image ? (
                        <div className="text-center group/main">
                          <img src={URL.createObjectURL(formData.header_image)} alt="H" className="h-48 w-full object-cover rounded-[2rem] border-4 border-white shadow-2xl transition-transform group-hover/main:scale-[1.02]" />
                          <div className="flex justify-center gap-2 mt-4">
                            <span className="bg-[#14532d] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">Header Asset</span>
                            <button type="button" onClick={() => setFormData({ ...formData, header_image: null })} className="bg-red-500 text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-[2rem] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#14532d] group-hover:text-white transition-all text-gray-400 font-black text-4xl mb-6 shadow-green-900/5 rotate-6">+</div>
                          <p className="font-black text-gray-900 text-xs uppercase tracking-[0.3em]">Header Banner</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-2">1920x600 Preferred</p>
                          <input type="file" name="header_image" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </>
                      )}
                    </div>

                    <div className={`relative border-2 border-dashed rounded-[3rem] p-10 transition-all min-h-[320px] flex flex-col items-center justify-center ${formData.card_image ? 'bg-green-50/30 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-[#14532d]/40'} group cursor-pointer`}>
                      {formData.card_image ? (
                        <div className="text-center group/card w-[200px]">
                          <img src={URL.createObjectURL(formData.card_image)} alt="C" className="h-64 w-full object-cover rounded-[2rem] border-4 border-white shadow-2xl transition-transform group-hover/card:scale-[1.02]" />
                          <div className="flex justify-center gap-2 mt-4">
                            <span className="bg-[#14532d] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">Listing Card</span>
                            <button type="button" onClick={() => setFormData({ ...formData, card_image: null })} className="bg-red-500 text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-[2rem] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#14532d] group-hover:text-white transition-all text-gray-400 font-black text-4xl mb-6 shadow-green-900/5 -rotate-6">+</div>
                          <p className="font-black text-gray-900 text-xs uppercase tracking-[0.3em]">Card Visual</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-2">400x500 Preferred</p>
                          <input type="file" name="card_image" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </>
                      )}
                    </div>
                  </div>
                </Section>

                <Section title="Trip Information" active={activeSection === 'info'}>
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-black text-gray-900 tracking-tight">Inclusions</h3>
                          <button type="button" onClick={() => addRow(setInclusions, "")} className="bg-green-50 text-[#14532d] w-8 h-8 rounded-xl font-black flex items-center justify-center hover:bg-green-500 hover:text-white transition-all active:scale-90 border border-green-100 shadow-sm">+</button>
                        </div>
                        <div className="space-y-3">
                          {inclusions.map((item, i) => (
                            <div key={i} className="flex gap-4 items-center group">
                              <span className="text-green-500 font-black text-xl leading-none transition-transform group-hover:rotate-12 group-hover:scale-125">✓</span>
                              <div className="flex-1"><Input value={item} onChange={(e) => { const copy = [...inclusions]; copy[i] = e.target.value; setInclusions(copy); }} className="!bg-gray-50/20 !border-transparent focus:!bg-white !text-xs" /></div>
                              <button type="button" onClick={() => removeRow(setInclusions, i)} className="text-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-black text-gray-900 tracking-tight">Exclusions</h3>
                          <button type="button" onClick={() => addRow(setExclusions, "")} className="bg-gray-50 text-gray-400 w-8 h-8 rounded-xl font-black flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90 border border-gray-100 shadow-sm">+</button>
                        </div>
                        <div className="space-y-3">
                          {exclusions.map((item, i) => (
                            <div key={i} className="flex gap-4 items-center group">
                              <span className="text-red-400 font-black text-xl leading-none transition-transform group-hover:-rotate-12 group-hover:scale-125">×</span>
                              <div className="flex-1"><Input value={item} onChange={(e) => { const copy = [...exclusions]; copy[i] = e.target.value; setExclusions(copy); }} className="!bg-gray-50/20 !border-transparent focus:!bg-white !text-xs" /></div>
                              <button type="button" onClick={() => removeRow(setExclusions, i)} className="text-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayPackageAdd;
