import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";
import { X, MapPin, Calendar, Package, Plane, Hotel, Car, Info, IndianRupee, ClipboardList, Globe, Search, Plus, Star, List, ListOrdered, PlayCircle } from "lucide-react";

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

const FormLabel = ({ label, limit, current, required, optional }) => (
  <div className="flex justify-between items-end mb-1">
    <div className="flex items-center gap-1.5">
      <span className="text-gray-900 font-black text-[9px] uppercase tracking-[0.12em]">{label} {required && <span className="text-red-500">*</span>}</span>
      {optional && <span className="text-[#14532d] text-[7px] font-black bg-green-50 px-1 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
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
      className={`bg-white border-2 ${props.error ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'} px-3.5 py-1.5 rounded-xl w-full text-gray-900 text-[11px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 hover:shadow-sm ${props.className || ''}`}
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

  const [highlights, setHighlights] = useState([""]);
  const [inclusions, setInclusions] = useState([""]);
  const [exclusions, setExclusions] = useState([""]);
  const [cancellationPolicies, setCancellationPolicies] = useState([""]);

  // Refs for Trip Information textareas
  const inclusionsRef = useRef(null);
  const exclusionsRef = useRef(null);
  const cancellationRef = useRef(null);
  const highlightsRef = useRef(null);
  const [itineraryDays, setItineraryDays] = useState([
    {
      day: "1",
      title: "",
      description: "",
      master_template: "",
      image: null,
      save_to_master: false,
      details_json: { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], vehicles: [""] }
    },
  ]);
  const [accommodations, setAccommodations] = useState([]); // Kept for legacy/global if needed, but primary is in itineraryDays

  const [showHotelModal, setShowHotelModal] = useState(false);
  const [hotelSearchQuery, setHotelSearchQuery] = useState("");
  const [hotelMasters, setHotelMasters] = useState([]);
  const [sightseeingMasters, setSightseeingMasters] = useState([]);
  const [mealMasters, setMealMasters] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [newHotelForm, setNewHotelForm] = useState({
    name: "", stars: "3", address: "", city: "", phone: "", website: "", email: "", latitude: "", longitude: "", images: []
  });
  const [vehicles, setVehicles] = useState([""]);
  // New Sightseeing panel state
  const [newSightseeingForm, setNewSightseeingForm] = useState({
    name: '', description: '', address: '', city: '', duration: '', price: '', map_link: '',
    latitude: '', longitude: '', images: []
  });
  const [sightseeingPanelDayIndex, setSightseeingPanelDayIndex] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    starting_city: "",
    ending_city: "",
    days: "",
    start_date: "",
    group_size: 0,
    offer_price: "",
    price: "",
    header_image: null,
    card_image: null,
    supplier: "",
    with_flight: false,
    fixed_departure: false,
    package_categories: [], // ['Budget', 'Standard', 'Deluxe', 'Luxury', 'Premium']
    is_active: true,
    with_arrival: true,
    arrival_city: "",
    arrival_date: "",
    arrival_time: "",
    arrival_airport: "",
    arrival_airline: "",
    arrival_flight_no: "",
    with_departure: true,
    departure_city: "",
    departure_date: "",
    departure_time: "",
    departure_airport: "",
    departure_airline: "",
    departure_flight_no: "",
    sharing: "TWIN",
    arrival_no_of_nights: "",
  });

  const [startingCities, setStartingCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [itineraryMasters, setItineraryMasters] = useState([]); // State for Master Templates
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNightsDropdownOpen, setIsNightsDropdownOpen] = useState(false);
  const totalPages = 5;

  const TITLE_LIMIT = 200;
  const DESC_LIMIT = 2000;
  const HIGHLIGHTS_LIMIT = 1000;

  const navigatePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else if (direction === 'back' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

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
    fetchHotelMasters();
    fetchSightseeingMasters();
    fetchMealMasters();
    fetchSuppliers();
    fetchAirlines();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suppliers/`);
      if (Array.isArray(response.data)) {
        const filteredSuppliers = response.data.filter(supplier =>
          supplier.services && supplier.services.some(service => service.toLowerCase() === 'holidays')
        );
        setSuppliers(filteredSuppliers);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchStartingCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/starting-cities/`);
      if (Array.isArray(response.data)) {
        setStartingCities(response.data);
      }
    } catch (err) {
      console.error("Error fetching starting cities:", err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/destinations/`);
      if (Array.isArray(response.data)) {
        setDestinations(response.data);
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  const fetchHotelMasters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hotel-masters/`);
      if (Array.isArray(response.data)) {
        setHotelMasters(response.data);
      }
    } catch (err) {
      console.error("Error fetching hotel masters:", err);
    }
  };

  const fetchItineraryMasters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/itinerary-masters/`);
      if (Array.isArray(response.data)) {
        setItineraryMasters(response.data);
      }
    } catch (err) {
      console.error("Error fetching itinerary masters:", err);
    }
  };

  const fetchSightseeingMasters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sightseeing-masters/`);
      if (Array.isArray(response.data)) {
        setSightseeingMasters(response.data);
      }
    } catch (err) {
      console.error("Error fetching sightseeing masters:", err);
    }
  };

  const fetchAirlines = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/airlines/`);
      if (Array.isArray(response.data)) {
        setAirlines(response.data);
      }
    } catch (err) {
      console.error("Error fetching airlines:", err);
    }
  };

  const fetchMealMasters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/meal-masters/`);
      if (Array.isArray(response.data)) {
        setMealMasters(response.data);
      }
    } catch (err) {
      console.error("Error fetching meal masters:", err);
    }
  };

  const handleSaveHotel = async () => {
    if (!newHotelForm.name || !newHotelForm.city) {
      alert("Hotel Name and City are required");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", newHotelForm.name);
      formDataToSend.append("stars", newHotelForm.stars);
      formDataToSend.append("address", newHotelForm.address);
      formDataToSend.append("city", newHotelForm.city);
      formDataToSend.append("phone", newHotelForm.phone);
      formDataToSend.append("website", newHotelForm.website);
      formDataToSend.append("email", newHotelForm.email);
      formDataToSend.append("latitude", newHotelForm.latitude);
      formDataToSend.append("longitude", newHotelForm.longitude);

      if (newHotelForm.images && newHotelForm.images.length > 0) {
        formDataToSend.append("image", newHotelForm.images[0]); // Using first image for now based on model
      }

      const response = await axios.post(`${API_BASE_URL}/hotel-masters/`, formDataToSend);
      setHotelMasters(prev => [...prev, response.data]);
      setShowHotelModal(false);
      setNewHotelForm({
        name: "", stars: "3", address: "", city: "", phone: "", website: "", email: "", latitude: "", longitude: "", images: []
      });
      alert("Hotel added to masters successfully!");
    } catch (err) {
      console.error("Error saving hotel master:", err);
      alert("Failed to save hotel. Please check your inputs.");
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
              details_json: { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] }
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

  // Sync Duration based on Destination Nights (Days = Sum of Nights + 1)
  useEffect(() => {
    const totalNights = packageDestinations.reduce((acc, d) => acc + parseInt(d.nights || 0, 10), 0);
    const calculatedDays = totalNights + 1;
    if (formData.days !== calculatedDays.toString()) {
      setFormData(prev => ({ ...prev, days: calculatedDays.toString() }));
    }
  }, [packageDestinations]);

  /* ---------- handlers ---------- */
  const addRow = (setter, row) => setter((p) => [...p, row]);
  const removeRow = (setter, index) =>
    setter((p) => p.filter((_, i) => i !== index));

  // Inserts a bullet point at the cursor position in a textarea
  const insertBullet = (ref, lines, setter) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const currentVal = lines.join('\n');
    const insertText = start === 0 || currentVal[start - 1] === '\n' ? '• ' : '\n• ';
    const newVal = currentVal.slice(0, start) + insertText + currentVal.slice(start);
    setter(newVal.split('\n'));
    setTimeout(() => {
      el.focus();
      const newCursor = start + insertText.length;
      el.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Inserts the next numbered item at the cursor position in a textarea
  const insertNumbered = (ref, lines, setter) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const currentVal = lines.join('\n');
    const existing = currentVal.split('\n').filter(l => /^\d+\./.test(l.trim()));
    const nextNum = existing.length + 1;
    const insertText = start === 0 || currentVal[start - 1] === '\n' ? `${nextNum}. ` : `\n${nextNum}. `;
    const newVal = currentVal.slice(0, start) + insertText + currentVal.slice(start);
    setter(newVal.split('\n'));
    setTimeout(() => {
      el.focus();
      const newCursor = start + insertText.length;
      el.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

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
      if (formData.supplier) formDataToSend.append("supplier", formData.supplier);
      formDataToSend.append("starting_city", formData.starting_city);
      // Ensure 'days' matches the actual number of itinerary rows
      formDataToSend.append("days", itineraryDays.length);
      if (formData.start_date) formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("group_size", formData.group_size);
      formDataToSend.append("Offer_price", formData.offer_price);
      if (formData.price) formDataToSend.append("price", formData.price);
      formDataToSend.append("with_flight", formData.with_flight);
      formDataToSend.append("fixed_departure", formData.fixed_departure);
      formDataToSend.append("sharing", formData.sharing);
      formDataToSend.append("package_categories", JSON.stringify(formData.package_categories || []));
      formDataToSend.append("is_active", formData.is_active);
      formDataToSend.append("with_arrival", formData.with_arrival);
      formDataToSend.append("arrival_city", formData.arrival_city);
      formDataToSend.append("arrival_date", formData.arrival_date);
      formDataToSend.append("arrival_time", formData.arrival_time);
      formDataToSend.append("arrival_airport", formData.arrival_airport);
      formDataToSend.append("arrival_airline", formData.arrival_airline);
      formDataToSend.append("arrival_flight_no", formData.arrival_flight_no);
      formDataToSend.append("with_departure", formData.with_departure);
      formDataToSend.append("departure_city", formData.departure_city);
      formDataToSend.append("departure_date", formData.departure_date);
      formDataToSend.append("departure_time", formData.departure_time);
      formDataToSend.append("departure_airport", formData.departure_airport);
      formDataToSend.append("departure_airline", formData.departure_airline);
      formDataToSend.append("departure_flight_no", formData.departure_flight_no);
      formDataToSend.append("arrival_no_of_nights", formData.arrival_no_of_nights);

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
      formDataToSend.append("cancellation_policies_raw", JSON.stringify(cancellationPolicies.filter(c => c.trim() !== "")));

      // Sanitize accommodations for backend (if it expects strings, we might need to map it)
      const sanitizedAccommodations = accommodations.map(acc => {
        if (acc.hotelName) {
          return `${acc.hotelName} - ${acc.rooms.map(r => `${r.type} (${r.meals})`).join(", ")}`;
        }
        return "";
      }).filter(a => a !== "");

      formDataToSend.append("accommodations_raw", JSON.stringify(sanitizedAccommodations));
      formDataToSend.append("vehicles_raw", JSON.stringify(vehicles.filter(v => v.trim() !== "")));

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
          sharing: "TWIN",
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
    { id: 1, label: 'Trip Overview', icon: <Globe size={15} />, color: 'bg-emerald-500' },
    { id: 2, label: 'Arrival & Departure', icon: <Plane size={15} />, color: 'bg-blue-500' },
    { id: 3, label: 'Day Wise Itinerary', icon: <ClipboardList size={15} />, color: 'bg-indigo-600' },
    { id: 4, label: 'Pricing', icon: <IndianRupee size={15} />, color: 'bg-amber-500' },
    { id: 5, label: 'Trip Information', icon: <Info size={15} />, color: 'bg-sky-400' },
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
              <span className="text-green-500">Inventory</span> / <span>Holidays</span> / <span className="text-gray-900">Step {currentPage} of {totalPages}</span>
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

            {currentPage === totalPages && (
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
            )}
          </div>
        </div>

        <div className="flex-1 flex h-full overflow-hidden relative bg-[#fcfdfc]">
          {/* Internal Navigation Sidebar */}
          <div className="w-48 bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar flex flex-col p-3 shrink-0">
            <div className="mb-3 px-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-black text-[#14532d] uppercase tracking-widest">Progress</span>
                <span className="text-[9px] font-bold text-gray-400">{Math.round((currentPage / totalPages) * 100)}%</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#14532d] transition-all duration-500 ease-out" style={{ width: `${(currentPage / totalPages) * 100}%` }}></div>
              </div>
            </div>

            <nav className="flex-1 space-y-0.5">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group relative overflow-hidden ${currentPage === item.id ? 'bg-[#14532d] text-white shadow-lg shadow-green-900/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${currentPage === item.id ? 'text-white ' + item.color : 'text-gray-300 group-hover:text-gray-700'}`}>
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] leading-tight">{item.label}</span>
                  </button>
                  {item.id === 3 && currentPage === 3 && (
                    <div className="mt-1 ml-4 pl-3 border-l-2 border-green-50 space-y-0.5 py-1 animate-in slide-in-from-top-4">
                      {itineraryDays.map((sub, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-medium text-gray-400 hover:bg-gray-50 hover:text-[#14532d] transition-all group"
                          onClick={() => {
                            const el = document.getElementById(`itinerary-day-${idx}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                        >
                          <div className={`w-1 h-1 rounded-full shrink-0 ${currentPage === 3 ? 'bg-green-500' : 'bg-gray-300'} group-hover:bg-[#14532d] transition-all`}></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">Day {idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-3 p-3 bg-[#14532d]/5 rounded-xl border border-[#14532d]/10">
              <p className="text-[9px] font-black text-[#14532d] uppercase tracking-widest mb-1 opacity-60">Tip</p>
              <p className="text-[10px] font-medium text-gray-500 leading-snug italic">
                {currentPage === 1 && "Start with the trip details and highlights."}
                {currentPage === 2 && "Where the journey begins and ends."}
                {currentPage === 3 && "Define the daily itinerary for the guests."}
                {currentPage === 4 && "Pricing and commercial details."}
                {currentPage === 5 && "Inclusions, Exclusions and final information."}
              </p>
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
                {/* TRIP OVERVIEW - PAGE 1 */}
                <Section title="Trip Overview" active={currentPage === 1}>
                  <div className="grid grid-cols-1 gap-8">
                    {/* Top Options: Departure & Tiers */}
                    <div className="bg-gray-50/50 px-5 py-4 rounded-2xl border-2 border-gray-50 flex flex-col xl:flex-row xl:items-center gap-6">
                      {/* Fixed Departure */}
                      <div className="flex items-center gap-3 w-max">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Departure</span>
                        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#14532d]/30 transition-all shadow-sm group">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d] transition-all cursor-pointer"
                            checked={formData.fixed_departure}
                            onChange={(e) => setFormData({ ...formData, fixed_departure: e.target.checked })}
                          />
                          <span className="text-[10px] font-bold text-gray-700 group-hover:text-[#14532d] transition-colors">Fixed Departure</span>
                        </label>
                      </div>

                      <div className="hidden xl:block w-px h-6 bg-gray-200"></div>

                      {/* Package Tiers */}
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="min-w-fit">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Package Tiers</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Budget', 'Standard', 'Deluxe', 'Luxury', 'Premium'].map((tier) => (
                            <label key={tier} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-100 hover:border-[#14532d]/30 transition-all shadow-sm group">
                              <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d] transition-all cursor-pointer"
                                checked={formData.package_categories && formData.package_categories.includes(tier)}
                                onChange={(e) => {
                                  const currentTiers = formData.package_categories || [];
                                  if (e.target.checked) setFormData({ ...formData, package_categories: [...currentTiers, tier] });
                                  else setFormData({ ...formData, package_categories: currentTiers.filter(t => t !== tier) });
                                }}
                              />
                              <span className="text-[10px] font-bold text-gray-700 group-hover:text-[#14532d] transition-colors">{tier}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Starting & Ending City */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel label="Starting City" required />
                        <SearchableSelect
                          options={[
                            { value: "Any City", label: "Any City" },
                            ...startingCities.map(city => ({ value: city.name, label: city.name }))
                          ]}
                          value={formData.starting_city}
                          onChange={(val) => setFormData(prev => ({ ...prev, starting_city: val }))}
                          placeholder="Where the trip starts..."
                        />
                        {errors.starting_city && <p className="text-red-500 text-[9px] font-bold mt-1 flex items-center gap-1">⚠ {errors.starting_city}</p>}
                      </div>
                      <div>
                        <FormLabel label="Ending City" />
                        <SearchableSelect
                          options={[
                            { value: "Any City", label: "Any City" },
                            ...startingCities.map(city => ({ value: city.name, label: city.name }))
                          ]}
                          value={formData.ending_city}
                          onChange={(val) => setFormData(prev => ({ ...prev, ending_city: val }))}
                          placeholder="Where the trip ends..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <FormLabel
                          label="Trip Title"
                          required
                          limit={TITLE_LIMIT}
                          current={formData.title ? formData.title.length : 0}
                        />
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="SINGAPORE DELIGHT"
                          error={errors.title}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all h-full min-h-[100px] flex flex-col items-center justify-center ${formData.header_image ? 'bg-green-50/30 border-green-200' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-[#14532d]/40'} group cursor-pointer`}>
                          {formData.header_image ? (
                            <div className="text-center group/main w-full h-full relative">
                              <img src={URL.createObjectURL(formData.header_image)} alt="H" className="h-full w-full object-cover rounded-xl border-2 border-white shadow-sm" />
                              <button type="button" onClick={() => setFormData({ ...formData, header_image: null })} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg active:scale-90 transition-transform"><X size={10} /></button>
                            </div>
                          ) : (
                            <>
                              <div className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 font-black text-xl mb-1">+</div>
                              <p className="font-black text-gray-900 text-[8px] uppercase tracking-widest">Header Banner</p>
                              <input type="file" name="header_image" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                          )}
                        </div>

                        <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all h-full min-h-[100px] flex flex-col items-center justify-center ${formData.card_image ? 'bg-green-50/30 border-green-200' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-[#14532d]/40'} group cursor-pointer`}>
                          {formData.card_image ? (
                            <div className="text-center group/card w-full h-full relative">
                              <img src={URL.createObjectURL(formData.card_image)} alt="C" className="h-full w-full object-cover rounded-xl border-2 border-white shadow-sm" />
                              <button type="button" onClick={() => setFormData({ ...formData, card_image: null })} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg active:scale-90 transition-transform"><X size={10} /></button>
                            </div>
                          ) : (
                            <>
                              <div className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 font-black text-xl mb-1">+</div>
                              <p className="font-black text-gray-900 text-[8px] uppercase tracking-widest">Card Visual</p>
                              <input type="file" name="card_image" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <FormLabel
                        label="Trip Description"
                        required
                        limit={DESC_LIMIT}
                        current={formData.description ? formData.description.length : 0}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FormLabel label="Category" required />
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`bg-white border-2 ${errors.category ? 'border-red-200' : 'border-gray-100'} p-3 rounded-xl w-full text-gray-800 text-[11px] focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all font-bold`}
                          >
                            <option value="">Select category</option>
                            <option value="Domestic">Domestic</option>
                            <option value="International">International</option>
                            <option value="Umrah">Umrah</option>
                          </select>
                        </div>
                        <div>
                          <FormLabel label="Supplier" optional />
                          <select
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleInputChange}
                            className={`bg-white border-2 border-gray-100 p-3 rounded-xl w-full text-gray-800 text-[11px] focus:outline-none focus:ring-4 focus:ring-[#14532d]/10 focus:border-[#14532d] transition-all font-bold`}
                          >
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                              <option key={s.id} value={s.id}>{s.company_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="bg-gray-50/50 p-4 rounded-2xl border-2 border-gray-50 flex gap-4 mt-1.5 overflow-x-auto">
                        <div className="flex-1 min-w-[120px]">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Flight</span>
                          <div className="flex gap-1.5">
                            {[true, false].map((val) => (
                              <button
                                key={`flight-${val}`}
                                type="button"
                                onClick={() => setFormData({ ...formData, with_flight: val })}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all border-2 ${formData.with_flight === val ? 'bg-[#14532d] border-[#14532d] text-white shadow-md shadow-green-900/10' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'}`}
                              >
                                {val ? 'WITH' : 'NO'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 min-w-[120px]">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Status</span>
                          <div className="flex gap-1.5">
                            {[true, false].map((val) => (
                              <button
                                key={`act-${val}`}
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: val })}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all border-2 ${formData.is_active === val ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-900/10' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'}`}
                              >
                                {val ? 'ACTIVE' : 'DRAFT'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trip Highlights Integrated into Overview */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-6">
                      <div className="mb-4">
                        <h3 className="text-[14px] font-black text-gray-900 tracking-tight leading-none">Trip Highlights</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Core experience identifiers</p>
                      </div>

                      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-2 py-1.5 flex gap-1.5">
                          <button type="button" onClick={() => insertBullet(highlightsRef, highlights, setHighlights)} title="Insert bullet point" className="w-6 h-6 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#14532d] transition-all shadow-sm">
                            <List size={12} />
                          </button>
                        </div>
                        <textarea
                          ref={highlightsRef}
                          className="w-full min-h-[80px] p-3 text-[11px] text-gray-700 focus:outline-none resize-y leading-relaxed bg-white"
                          placeholder="• Traditional Malay Dinner Experience&#10;• Cultural Tour of the City"
                          value={highlights.join('\n')}
                          onChange={(e) => setHighlights(e.target.value.split('\n'))}
                          spellCheck="false"
                        />
                      </div>
                    </div>


                  </div>
                </Section>

                {/* ARRIVAL & DEPARTURE - PAGE 2 */}
                <Section title="Arrival & Departure" active={currentPage === 2}>
                  <div className="space-y-8">
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-[0.2em]">Package Destinations</h3>
                          <p className="text-[8px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Map your journey stay by stay</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPackageDestinations(prev => [...prev, { destination: "", nights: 1 }])}
                          className="bg-white px-4 py-2 rounded-xl border-2 border-gray-100 text-[10px] font-black text-[#14532d] hover:bg-green-50 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                        >
                          + ADD DESTINATION
                        </button>
                      </div>

                      <div className="space-y-3">
                        {packageDestinations.map((row, i) => (
                          <div key={i} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 bg-white/50 p-2 rounded-2xl border border-gray-50" style={{ animationDelay: `${i * 100}ms` }}>
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
                            <div className="w-32">
                              <select
                                value={row.nights}
                                onChange={(e) => {
                                  const copy = [...packageDestinations];
                                  copy[i].nights = parseInt(e.target.value);
                                  setPackageDestinations(copy);
                                }}
                                className="w-full bg-white border-2 border-gray-100 px-3 py-2.5 rounded-xl text-gray-900 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all cursor-pointer appearance-none text-center"
                              >
                                {[...Array(21)].map((_, n) => (
                                  <option key={n + 1} value={n + 1}>{n + 1} {n + 1 === 1 ? 'Night' : 'Nights'}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (packageDestinations.length > 1) {
                                  removeRow(setPackageDestinations, i);
                                }
                              }}
                              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${packageDestinations.length > 1 ? 'hover:bg-red-50 text-red-200 hover:text-red-500' : 'text-gray-100 cursor-not-allowed'}`}
                              disabled={packageDestinations.length <= 1}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <FormLabel label="Total Days (Auto)" required />
                        <Input type="number" name="days" value={formData.days} readOnly className="!bg-gray-50/50 cursor-not-allowed opacity-70" />
                      </div>
                      <div>
                        <FormLabel label="Group Size" optional />
                        <Input type="number" name="group_size" value={formData.group_size} onChange={handleInputChange} />
                      </div>
                    </div>

                  </div>
                </Section>

                {/* DAY WISE ITINERARY - PAGE 3 */}
                <Section title="Day Wise Itinerary" active={currentPage === 3}>
                  <div className="space-y-6">
                    {itineraryDays.map((row, i) => (
                      <div key={i} id={`itinerary-day-${i}`} className="bg-white rounded-[2rem] border-2 border-gray-100 p-8 relative group/day hover:border-[#14532d]/40 transition-all shadow-sm hover:shadow-2xl hover:shadow-green-900/5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="absolute -left-4 top-10 w-8 h-8 rounded-full bg-red-500 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-[10px] group-hover/day:scale-125 transition-transform z-10">
                          {i + 1}
                        </div>

                        <div className="flex justify-between items-start mb-6 pl-4">
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

                        {/* SUB-TABS NAVIGATION */}
                        <div className="flex items-center gap-3 mb-6 pl-4">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Add to this day:</span>
                          <div className="flex gap-1.5 bg-gray-50/50 p-1 rounded-2xl border border-gray-100/50 shrink-0">
                            {[
                              { id: 'day_itinerary', label: 'Day Itinerary', symbol: '' },
                              { id: 'sightseeing', label: 'Sightseeing', symbol: '+ ' },
                              { id: 'accommodation', label: 'Accommodation', symbol: '+ ' },
                              { id: 'vehicle', label: 'Vehicle', symbol: '+ ' }
                            ].map(tab => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  const copy = [...itineraryDays];
                                  if (!copy[i].details_json) copy[i].details_json = { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] };
                                  copy[i].details_json.active_tab = tab.id;
                                  setItineraryDays(copy);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${(row.details_json?.active_tab || 'day_itinerary') === tab.id
                                  ? 'bg-[#ffe4e1] text-[#b91c1c] shadow-md scale-105'
                                  : 'text-gray-500 hover:bg-white hover:text-[#14532d]'
                                  }`}
                              >
                                {tab.symbol}{tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pl-4">
                          {/* DAY ITINERARY TAB */}
                          {(!row.details_json?.active_tab || row.details_json?.active_tab === 'day_itinerary') && (() => {
                            const dayMasterSearch = row.details_json?._dayMasterSearch || '';
                            const dayMeals = row.details_json?.meals_included || [];
                            const dayTransferType = row.details_json?.transfer_type || '';
                            const updateDay = (patch) => {
                              const copy = [...itineraryDays];
                              copy[i].details_json = { ...copy[i].details_json, ...patch };
                              setItineraryDays(copy);
                            };
                            const filteredDayMasters = dayMasterSearch
                              ? itineraryMasters.filter(m =>
                                m.name?.toLowerCase().includes(dayMasterSearch.toLowerCase()) ||
                                m.title?.toLowerCase().includes(dayMasterSearch.toLowerCase())
                              ) : [];
                            const mealOptions = ['No Meals', 'Breakfast', 'Lunch', 'High-Tea', 'Dinner'];
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-4">
                                  {/* Note */}
                                  <p className="text-[10px] text-red-600 font-medium">Note - You can save only one Day Wise Itinerary for each itinerary!</p>

                                  {/* Day title */}
                                  <div>
                                    <FormLabel label="Trip Title (e.g. Flight Arrival)" required />
                                    <Input
                                      placeholder="Arrival in Singapore..."
                                      value={row.title}
                                      onChange={(e) => { const copy = [...itineraryDays]; copy[i].title = e.target.value; setItineraryDays(copy); }}
                                      error={errors[`itinerary_title_${i}`]}
                                    />
                                  </div>

                                  {/* Search day itinerary from masters */}
                                  <div>
                                    <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search day itinerary from the database</p>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={dayMasterSearch}
                                        onChange={e => updateDay({ _dayMasterSearch: e.target.value })}
                                        placeholder="Type to look up for day itinerary in masters"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[11px] focus:outline-none focus:border-blue-400 pr-8"
                                      />
                                      <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {filteredDayMasters.length > 0 && (
                                      <div className="border border-gray-200 rounded-sm bg-white shadow-sm mt-0.5 max-h-36 overflow-y-auto">
                                        {filteredDayMasters.map(m => (
                                          <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => {
                                              handleMasterTemplateChange(i, m.id.toString());
                                              updateDay({ _dayMasterSearch: '' });
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                          >
                                            <span className="font-medium text-gray-800">{m.name || m.title}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Day description */}
                                  <div>
                                    <FormLabel label="Description" optional />
                                    <textarea
                                      value={row.description}
                                      onChange={(e) => { const copy = [...itineraryDays]; copy[i].description = e.target.value; setItineraryDays(copy); }}
                                      className="bg-gray-50 border-2 border-transparent p-4 rounded-2xl w-full h-28 text-sm font-medium focus:border-[#14532d] focus:bg-white transition-all outline-none resize-none"
                                      placeholder="Describe the day's journey..."
                                    />
                                  </div>

                                  {/* Meals included */}
                                  <div>
                                    <p className="text-[11px] font-bold text-gray-800 mb-2">Meals included for the day</p>
                                    <div className="flex flex-wrap gap-4">
                                      {mealOptions.map(meal => (
                                        <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={dayMeals.includes(meal)}
                                            onChange={e => {
                                              const updated = e.target.checked
                                                ? [...dayMeals, meal]
                                                : dayMeals.filter(m => m !== meal);
                                              updateDay({ meals_included: updated });
                                            }}
                                            className="w-3.5 h-3.5 border border-gray-300 rounded-sm accent-[#14532d]"
                                          />
                                          <span className="text-[11px] text-gray-700">{meal}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Transfer Type */}
                                  <div>
                                    <p className="text-[11px] font-bold text-gray-800 mb-1.5">Transfer Type</p>
                                    <select
                                      value={dayTransferType}
                                      onChange={e => updateDay({ transfer_type: e.target.value })}
                                      className="w-48 border border-gray-300 rounded-sm px-2 py-1.5 text-[11px] focus:outline-none focus:border-blue-400 bg-white"
                                    >
                                      <option value="">Select Transfer Type</option>
                                      <option value="Private">Private</option>
                                      <option value="Shared">Shared</option>
                                      <option value="Self Drive">Self Drive</option>
                                      <option value="No Transfer">No Transfer</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <FormLabel label="Day Visual (Image)" optional />
                                    <div className={`relative border-2 border-dashed rounded-3xl p-4 transition-all min-h-[120px] flex flex-col items-center justify-center ${row.image ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-[#14532d]/40'}`}>
                                      {row.image ? (
                                        <div className="relative group/dayimg">
                                          <img src={URL.createObjectURL(row.image)} alt="Day" className="h-28 w-full object-cover rounded-2xl border-2 border-white shadow-xl transition-transform group-hover/dayimg:scale-[1.05]" />
                                          <button type="button" onClick={() => { const copy = [...itineraryDays]; copy[i].image = null; setItineraryDays(copy); }} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl opacity-0 group-hover/dayimg:opacity-100 transition-opacity"><X size={12} /></button>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-400 mb-2 font-black text-xl group-hover/day:scale-110 group-hover:rotate-12 transition-all">+</div>
                                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Add Preview Image</p>
                                          <input type="file" accept="image/*" onChange={(e) => { const copy = [...itineraryDays]; copy[i].image = e.target.files[0]; setItineraryDays(copy); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className={`p-3 rounded-2xl border-2 transition-all ${row.save_to_master ? 'bg-[#14532d] border-[#14532d] text-white' : 'bg-gray-50 border-transparent text-gray-500 hover:border-gray-200 hover:bg-white'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                      <input type="checkbox" checked={row.save_to_master} onChange={(e) => { const copy = [...itineraryDays]; copy[i].save_to_master = e.target.checked; setItineraryDays(copy); }} className="w-4 h-4 rounded-lg border-gray-300 text-[#14532d] focus:ring-[#14532d]" />
                                      <div className="flex flex-col leading-none">
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Archive to Masters</span>
                                        <span className="text-[8px] opacity-70 font-medium">Available for future packages</span>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* SIGHTSEEING TAB */}
                          {row.details_json?.active_tab === 'sightseeing' && (() => {
                            const sightseeingSearch = row.details_json?._sightseeingSearch || '';
                            const addedSightseeings = (row.details_json?.sightseeing || []).filter(s => s && s.trim());
                            const updateDay = (patch) => {
                              const copy = [...itineraryDays];
                              copy[i].details_json = { ...copy[i].details_json, ...patch };
                              setItineraryDays(copy);
                            };
                            const filteredSightseeings = sightseeingSearch
                              ? sightseeingMasters.filter(sm =>
                                sm.name?.toLowerCase().includes(sightseeingSearch.toLowerCase()) ||
                                sm.city?.toLowerCase().includes(sightseeingSearch.toLowerCase())
                              ) : [];
                            return (
                              <div className="flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                {/* Main sightseeing panel */}
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <p className="text-[11px] font-bold text-gray-800 mb-1.5">Search sightseeing from the database</p>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={sightseeingSearch}
                                        onChange={e => updateDay({ _sightseeingSearch: e.target.value })}
                                        placeholder="Type to look up for sightseeing in masters"
                                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[11px] focus:outline-none focus:border-blue-400 pr-8"
                                      />
                                      <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {filteredSightseeings.length > 0 && (
                                      <div className="border border-gray-200 rounded-sm bg-white shadow-sm mt-0.5 max-h-36 overflow-y-auto">
                                        {filteredSightseeings.map(sm => (
                                          <button
                                            key={sm.id}
                                            type="button"
                                            onClick={() => {
                                              const copy = [...itineraryDays];
                                              if (!copy[i].details_json.sightseeing) copy[i].details_json.sightseeing = [];
                                              const already = copy[i].details_json.sightseeing.includes(sm.name);
                                              if (!already) copy[i].details_json.sightseeing.push(sm.name);
                                              copy[i].details_json._sightseeingSearch = '';
                                              setItineraryDays(copy);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                          >
                                            <span className="font-medium text-gray-800">{sm.name}</span>
                                            {sm.city && <span className="text-gray-400 ml-1">· {sm.city}</span>}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Added sightseeings or empty state */}
                                  {addedSightseeings.length === 0 ? (
                                    <div className="border-2 border-dashed border-gray-200 rounded-sm h-24 flex items-center justify-center">
                                      <p className="text-[11px] text-gray-400">No Sightseeing added</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {addedSightseeings.map((s, sIdx) => {
                                        const masterData = sightseeingMasters.find(sm => sm.name === s);
                                        return (
                                          <div key={sIdx} className="border border-gray-200 rounded-sm bg-white p-3 flex gap-3 group relative">
                                            {masterData?.image && (
                                              <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 bg-gray-100">
                                                <img src={masterData.image.startsWith('http') ? masterData.image.replace('http://localhost:8000', '').replace('http://127.0.0.1:8000', '') : masterData.image} alt={s} className="w-full h-full object-cover" />
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              {masterData?.city && <p className="text-[9px] text-gray-400">{masterData.city}</p>}
                                              <div className="flex items-center gap-2">
                                                <p className="text-[11px] font-bold text-gray-900">{s}</p>
                                                {masterData?.latitude && masterData?.longitude && (
                                                  <a
                                                    href={`https://maps.google.com/?q=${masterData.latitude},${masterData.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] text-blue-500 hover:underline"
                                                  >View on Map</a>
                                                )}
                                              </div>
                                              {masterData?.address && <p className="text-[9px] text-gray-500">{masterData.address}</p>}
                                              {masterData?.description && (
                                                <p className="text-[9px] text-gray-500 line-clamp-2 mt-0.5">{masterData.description}</p>
                                              )}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const copy = [...itineraryDays];
                                                copy[i].details_json.sightseeing = copy[i].details_json.sightseeing.filter((_, idx) => idx !== sIdx);
                                                setItineraryDays(copy);
                                              }}
                                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                              <X size={12} />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* Add New Sightseeing panel */}
                                <div className="w-56 shrink-0">
                                  {sightseeingPanelDayIndex === i ? (
                                    <div className="border border-gray-200 rounded-sm p-3 bg-gray-50/50 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-gray-800">Add New Sightseeing</h4>
                                        <button type="button" onClick={() => setSightseeingPanelDayIndex(null)} className="text-gray-400 hover:text-gray-600"><X size={12} /></button>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Name of the Sightseeing</p>
                                        <input type="text" value={newSightseeingForm.name} onChange={e => setNewSightseeingForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter name" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Sightseeing Description <span className="text-gray-400 font-normal">(maximum 3000 characters)</span></p>
                                        <textarea value={newSightseeingForm.description} onChange={e => setNewSightseeingForm(p => ({ ...p, description: e.target.value }))} maxLength={3000} placeholder="Enter description" rows={3} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 resize-none" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                          <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Address <span className="text-sky-400 font-normal">(Optional)</span></p>
                                          <input type="text" value={newSightseeingForm.address} onChange={e => setNewSightseeingForm(p => ({ ...p, address: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-semibold text-gray-600 mb-0.5">City (Country)</p>
                                          <select value={newSightseeingForm.city} onChange={e => setNewSightseeingForm(p => ({ ...p, city: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                            <option value="">Select a city...</option>
                                            {destinations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-1.5">
                                        <div>
                                          <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Duration</p>
                                          <input type="text" value={newSightseeingForm.duration} onChange={e => setNewSightseeingForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 4 Hours" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Entry Price</p>
                                          <input type="number" value={newSightseeingForm.price} onChange={e => setNewSightseeingForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Map Link</p>
                                        <input type="text" value={newSightseeingForm.map_link} onChange={e => setNewSightseeingForm(p => ({ ...p, map_link: e.target.value }))} placeholder="https://maps.google.com/..." className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5 flex items-center gap-1">Latitude & Longitude <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span></p>
                                        <div className="flex gap-1">
                                          <input type="text" value={newSightseeingForm.latitude} onChange={e => setNewSightseeingForm(p => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                          <input type="text" value={newSightseeingForm.longitude} onChange={e => setNewSightseeingForm(p => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Sightseeing Images <span className="text-gray-400 font-normal">(Add up to 5 images with max file size of 1 MB)</span></p>
                                        <div className="border border-dashed border-gray-300 rounded-sm p-2 flex gap-1.5 flex-wrap min-h-[44px]">
                                          <label className="w-[46px] h-[40px] border border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 text-[9px] text-center">
                                            <span className="text-sm leading-none">+</span>
                                            <span>Add{<br />}Images</span>
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                              const files = Array.from(e.target.files).slice(0, 5);
                                              setNewSightseeingForm(p => ({ ...p, images: [...(p.images || []), ...files].slice(0, 5) }));
                                            }} />
                                          </label>
                                          {(newSightseeingForm.images || []).map((img, imgIdx) => (
                                            <div key={imgIdx} className="relative w-[46px] h-[40px]">
                                              <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded border border-gray-200" />
                                              <button type="button" onClick={() => setNewSightseeingForm(p => ({ ...p, images: p.images.filter((_, j) => j !== imgIdx) }))} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">×</button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          if (!newSightseeingForm.name.trim()) { alert('Please enter the sightseeing name.'); return; }
                                          try {
                                            const fd = new FormData();
                                            fd.append('name', newSightseeingForm.name);
                                            fd.append('description', newSightseeingForm.description);
                                            fd.append('address', newSightseeingForm.address);
                                            fd.append('city', newSightseeingForm.city);
                                            fd.append('duration', newSightseeingForm.duration);
                                            fd.append('price', newSightseeingForm.price);
                                            fd.append('map_link', newSightseeingForm.map_link);
                                            fd.append('latitude', newSightseeingForm.latitude);
                                            fd.append('longitude', newSightseeingForm.longitude);
                                            if (newSightseeingForm.images && newSightseeingForm.images.length > 0) {
                                              fd.append('image', newSightseeingForm.images[0]);
                                              newSightseeingForm.images.forEach(img => {
                                                fd.append('gallery_images', img);
                                              });
                                            }
                                            const res = await axios.post('/api/sightseeing-masters/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                            setSightseeingMasters(prev => [...prev, res.data]);
                                            const copy = [...itineraryDays];
                                            if (!copy[i].details_json.sightseeing) copy[i].details_json.sightseeing = [];
                                            copy[i].details_json.sightseeing.push(res.data.name);
                                            setItineraryDays(copy);
                                            setNewSightseeingForm({
                                              name: '', description: '', address: '', city: '', duration: '', price: '', map_link: '',
                                              latitude: '', longitude: '', images: []
                                            });
                                            setSightseeingPanelDayIndex(null);
                                          } catch (err) {
                                            console.error('Error saving sightseeing:', err);
                                            alert('Failed to save sightseeing.');
                                          }
                                        }}
                                        className="w-full py-1.5 bg-[#14532d] text-white text-[10px] font-bold rounded-sm hover:bg-green-800 transition-colors"
                                      >Add</button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => { setSightseeingPanelDayIndex(i); setNewSightseeingForm({ name: '', description: '', address: '', city: '', latitude: '', longitude: '', images: [] }); }}
                                      className="w-full py-2 border border-dashed border-orange-300 text-orange-500 text-[10px] font-medium rounded-sm hover:bg-orange-50 transition-colors"
                                    >+ Add New Sightseeing</button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}


                          {/* ACCOMMODATION TAB */}
                          {row.details_json?.active_tab === 'accommodation' && (() => {
                            const accs = row.details_json?.accommodations || [];
                            const searchQ = row.details_json?._accSearch || '';
                            const showForm = row.details_json?._showNewAcc || false;
                            const roomDetails = row.details_json?._roomDetails || { noOfRooms: '', checkIn: '', checkOut: '', rooms: [] };
                            const updateDay = (patch) => {
                              const copy = [...itineraryDays];
                              copy[i].details_json = { ...copy[i].details_json, ...patch };
                              setItineraryDays(copy);
                            };
                            const updateRoomDetails = (patch) => {
                              const copy = [...itineraryDays];
                              const rd = copy[i].details_json?._roomDetails || { noOfRooms: '', checkIn: '', checkOut: '', rooms: [] };
                              copy[i].details_json._roomDetails = { ...rd, ...patch };
                              setItineraryDays(copy);
                            };
                            const filteredHotels = searchQ
                              ? hotelMasters.filter(h =>
                                h.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
                                h.city?.toLowerCase().includes(searchQ.toLowerCase())
                              ) : [];
                            return (
                              <div className="bg-white p-0 space-y-0">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-1.5">
                                  <h3 className="text-[12px] font-bold text-gray-900">Accommodation</h3>
                                </div>

                                {/* Search Accommodation */}
                                <div className="mb-2">
                                  <p className="text-[10px] text-gray-500 mb-1">Search Accommodation from the database</p>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={searchQ}
                                      onChange={e => updateDay({ _accSearch: e.target.value })}
                                      placeholder=""
                                      className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[11px] focus:outline-none focus:border-blue-400 pr-6"
                                    />
                                    {searchQ && (
                                      <button type="button" onClick={() => updateDay({ _accSearch: '' })} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 font-bold text-[11px]">×</button>
                                    )}
                                  </div>

                                  {/* Two-panel dropdown */}
                                  <div className="border border-gray-200 rounded-sm mt-0.5 bg-white shadow-sm">
                                    {/* Top panel: Add New Accommodation */}
                                    <div className="border border-dashed border-orange-200 m-1.5 rounded-sm">
                                      <button
                                        type="button"
                                        onClick={() => updateDay({ _showNewAcc: !showForm })}
                                        className="w-full py-1.5 text-[11px] text-orange-400 font-medium hover:bg-orange-50 transition-colors"
                                      >
                                        {showForm ? 'Close Form' : 'Add New Accommodation'}
                                      </button>
                                    </div>
                                    {/* Bottom panel: search results / empty state */}
                                    <div className="border border-dashed border-gray-200 m-1.5 mt-0 rounded-sm min-h-[44px] max-h-[100px] overflow-y-auto flex flex-col">
                                      {filteredHotels.length > 0 ? filteredHotels.map(h => (
                                        <button
                                          key={h.id}
                                          type="button"
                                          onClick={() => {
                                            const copy = [...itineraryDays];
                                            if (!copy[i].details_json.accommodations) copy[i].details_json.accommodations = [];
                                            const alreadyAdded = copy[i].details_json.accommodations.find(a => a.hotelId === h.id);
                                            if (!alreadyAdded) {
                                              copy[i].details_json.accommodations.push({ hotelId: h.id, hotelName: h.name });
                                            }
                                            copy[i].details_json._accSearch = '';
                                            setItineraryDays(copy);
                                          }}
                                          className="w-full text-left px-2 py-1 text-[10px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                        >
                                          <span className="font-medium text-gray-800">{h.name}</span>
                                          {h.city && <span className="text-gray-400 ml-1">· {h.city}</span>}
                                        </button>
                                      )) : (
                                        <div className="flex-1 flex items-center justify-center">
                                          <p className="text-[10px] text-gray-400">No accommodation added</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Selected accommodation tags */}
                                  {accs.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {accs.map((acc, accIdx) => (
                                        <span key={accIdx} className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5 font-medium">
                                          {acc.hotelName}
                                          <button type="button" onClick={() => { const copy = [...itineraryDays]; copy[i].details_json.accommodations.splice(accIdx, 1); setItineraryDays(copy); }} className="text-blue-400 hover:text-red-500 ml-0.5">×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Add New Accommodation Form */}
                                {showForm && (
                                  <div className="border border-gray-200 rounded p-3 bg-gray-50/50 space-y-2 mb-2">
                                    <h4 className="text-[11px] font-bold text-gray-800">Add New Accommodation</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Name of the Accommodation</p>
                                        <input type="text" value={newHotelForm.name} onChange={e => setNewHotelForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter name" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Star Category</p>
                                        <select value={newHotelForm.stars} onChange={e => setNewHotelForm(p => ({ ...p, stars: e.target.value }))} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                          <option value="">Select</option>
                                          {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star</option>)}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Accommodation Address <span className="text-sky-400 font-normal">(optional)</span></p>
                                        <input type="text" value={newHotelForm.address} onChange={e => setNewHotelForm(p => ({ ...p, address: e.target.value }))} placeholder="Enter accommodation address" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">City (Country)</p>
                                        <input type="text" value={newHotelForm.city} onChange={e => setNewHotelForm(p => ({ ...p, city: e.target.value }))} placeholder="Select a city..." className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Phone No. <span className="text-sky-400 font-normal">(optional)</span></p>
                                      <div className="grid grid-cols-2 gap-2">
                                        <input type="text" value={newHotelForm.phone || ''} onChange={e => setNewHotelForm(p => ({ ...p, phone: e.target.value }))} placeholder="Country code" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        <input type="text" placeholder="Phone no." className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Website <span className="text-sky-400 font-normal">(optional)</span></p>
                                        <input type="text" value={newHotelForm.website} onChange={e => setNewHotelForm(p => ({ ...p, website: e.target.value }))} placeholder="Enter website" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Email Id <span className="text-sky-400 font-normal">(optional)</span></p>
                                        <input type="email" value={newHotelForm.email} onChange={e => setNewHotelForm(p => ({ ...p, email: e.target.value }))} placeholder="Type Email Id" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Latitude &amp; Longitude <span className="text-sky-400 font-normal">(optional)</span></p>
                                      <div className="flex gap-2 items-center">
                                        <input type="text" value={newHotelForm.latitude} onChange={e => setNewHotelForm(p => ({ ...p, latitude: e.target.value }))} placeholder="Latitude" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        <input type="text" value={newHotelForm.longitude} onChange={e => setNewHotelForm(p => ({ ...p, longitude: e.target.value }))} placeholder="Longitude" className="flex-1 min-w-0 border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                        <span className="text-orange-400 text-[13px]">ⓘ</span>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[9px] font-semibold text-gray-600 mb-0.5">Accommodation Images <span className="text-gray-400 font-normal">(up to 5, max 1 MB)</span></p>
                                      <div className="border border-dashed border-gray-300 rounded-sm p-2 flex gap-1.5 flex-wrap min-h-[44px]">
                                        <label className="w-[50px] h-[44px] border border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 text-[9px] text-center">
                                          <span className="text-sm leading-none">+</span>
                                          <span>Add</span>
                                          <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                            const files = Array.from(e.target.files).slice(0, 5);
                                            setNewHotelForm(p => ({ ...p, images: [...(p.images || []), ...files].slice(0, 5) }));
                                          }} />
                                        </label>
                                        {(newHotelForm.images || []).map((img, idx) => (
                                          <div key={idx} className="relative w-[50px] h-[44px]">
                                            <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded border border-gray-200" />
                                            <button type="button" onClick={() => setNewHotelForm(p => ({ ...p, images: p.images.filter((_, j) => j !== idx) }))} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">×</button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <button type="button" onClick={handleSaveHotel} className="w-full py-1 bg-[#14532d] text-white text-[10px] font-bold rounded-sm hover:bg-green-800 transition-colors">
                                      Save Accommodation
                                    </button>
                                  </div>
                                )}

                                {/* Divider */}
                                <hr className="border-gray-200 my-2" />

                                {/* Add Room Details */}
                                <div>
                                  <p className="text-[11px] font-bold text-gray-800 mb-1.5">Add Room Details</p>
                                  <div className="grid grid-cols-3 gap-2 mb-2">
                                    <div>
                                      <p className="text-[10px] font-medium text-gray-600 mb-0.5">No. of Nights</p>
                                      <select
                                        value={roomDetails.noOfRooms || ''}
                                        onChange={e => {
                                          const n = parseInt(e.target.value) || 0;
                                          const rooms = Array.from({ length: n }, (_, idx) => roomDetails.rooms?.[idx] || { roomType: '', meals: '' });
                                          updateRoomDetails({ noOfRooms: e.target.value, rooms });
                                        }}
                                        className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white"
                                      >
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                      </select>
                                    </div>
                                    <div className={!formData.fixed_departure ? "opacity-40 blur-[1px] pointer-events-none select-none transition-all duration-300" : "transition-all duration-300"}>
                                      <p className="text-[10px] font-medium text-gray-600 mb-0.5">Check In</p>
                                      <input disabled={!formData.fixed_departure} type="date" value={roomDetails.checkIn || ''} onChange={e => updateRoomDetails({ checkIn: e.target.value })} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                    </div>
                                    <div className={!formData.fixed_departure ? "opacity-40 blur-[1px] pointer-events-none select-none transition-all duration-300" : "transition-all duration-300"}>
                                      <p className="text-[10px] font-medium text-gray-600 mb-0.5">Check Out</p>
                                      <input disabled={!formData.fixed_departure} type="date" value={roomDetails.checkOut || ''} onChange={e => updateRoomDetails({ checkOut: e.target.value })} className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                    </div>
                                  </div>
                                  {(roomDetails.rooms || []).length > 0 && (
                                    <div>
                                      <div className="grid grid-cols-[64px_1fr_1fr] gap-2 mb-0.5">
                                        <div />
                                        <p className="text-[9px] font-medium text-gray-600">Room Type</p>
                                        <p className="text-[9px] font-medium text-gray-600">Meal Type</p>
                                      </div>
                                      {(roomDetails.rooms || []).map((room, rIdx) => (
                                        <div key={rIdx} className="grid grid-cols-[64px_1fr_1fr] gap-2 mb-1 items-center">
                                          <p className="text-[9px] font-medium text-gray-500 text-right pr-1">Night {rIdx + 1} :</p>
                                          <input type="text" value={room.roomType || ''} onChange={e => { const copy = [...itineraryDays]; const rooms = [...(copy[i].details_json._roomDetails?.rooms || [])]; rooms[rIdx] = { ...rooms[rIdx], roomType: e.target.value }; copy[i].details_json._roomDetails = { ...copy[i].details_json._roomDetails, rooms }; setItineraryDays(copy); }} placeholder="Enter Room Type" className="w-full border border-gray-300 rounded-sm px-1.5 py-1 text-[10px] focus:outline-none focus:border-blue-400" />
                                          <select value={room.meals || ''} onChange={e => { const copy = [...itineraryDays]; const rooms = [...(copy[i].details_json._roomDetails?.rooms || [])]; rooms[rIdx] = { ...rooms[rIdx], meals: e.target.value }; copy[i].details_json._roomDetails = { ...copy[i].details_json._roomDetails, rooms }; setItineraryDays(copy); }} className="w-full border border-gray-300 rounded-sm px-1.5 py-1 text-[10px] focus:outline-none focus:border-blue-400 bg-white">
                                            <option value="">Select meals included</option>
                                            <option value="EP">EP (Room Only)</option>
                                            <option value="CP">CP (Breakfast)</option>
                                            <option value="MAP">MAP (Half Board)</option>
                                            <option value="AP">AP (Full Board)</option>
                                          </select>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* VEHICLE TAB */}
                          {row.details_json?.active_tab === 'vehicle' && (() => {
                            const vd = row.details_json?.vehicle_data || {};
                            const vehicleMode = vd.mode || 'self_drive';
                            const updateVD = (patch) => {
                              const copy = [...itineraryDays];
                              copy[i].details_json.vehicle_data = { ...vd, ...patch };
                              setItineraryDays(copy);
                            };
                            const isSelf = vehicleMode === 'self_drive';
                            return (
                              <div className="bg-white p-0">
                                {/* Header row */}
                                <div className="mb-3">
                                  <h3 className="text-[13px] font-bold text-gray-900">Vehicle</h3>
                                </div>
                                {/* Radio buttons */}
                                <div className="flex items-center gap-6 mb-3">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`vehicleMode_add_${i}`}
                                      checked={isSelf}
                                      onChange={() => updateVD({ mode: 'self_drive' })}
                                      className="w-3.5 h-3.5 accent-blue-500"
                                    />
                                    <span className="text-[11px] font-medium text-gray-700">Self Drive</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`vehicleMode_add_${i}`}
                                      checked={!isSelf}
                                      onChange={() => updateVD({ mode: 'with_driver' })}
                                      className="w-3.5 h-3.5 accent-blue-500"
                                    />
                                    <span className="text-[11px] font-medium text-gray-700">Vehicle with Driver/ Chaffeur</span>
                                  </label>
                                </div>
                                {/* Sub-heading */}
                                <p className="text-[11px] font-bold text-gray-800 mb-2">
                                  {isSelf ? 'Self Drive' : 'Vehicle with Driver/ Chaffeur'}
                                </p>
                                {/* Vehicle Type + No. of Vehicles */}
                                <div className="grid grid-cols-[1fr_160px] gap-3 mb-2">
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Vehicle Type</p>
                                    <input
                                      type="text"
                                      value={vd.vehicleType || ''}
                                      onChange={e => updateVD({ vehicleType: e.target.value })}
                                      placeholder="Enter vehicle type - eg. sedan/ suv/ coach etc."
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">No. of Vehicles</p>
                                    <select
                                      value={vd.noOfVehicles || '1'}
                                      onChange={e => updateVD({ noOfVehicles: e.target.value })}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400 bg-white"
                                    >
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </div>
                                </div>
                                {/* Pick Up Date + Pick Up Location */}
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Pick Up Date</p>
                                    <input
                                      type="date"
                                      value={vd.pickUpDate || ''}
                                      onChange={e => updateVD({ pickUpDate: e.target.value })}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Pick Up Location</p>
                                    <input
                                      type="text"
                                      value={vd.pickUpLocation || ''}
                                      onChange={e => updateVD({ pickUpLocation: e.target.value })}
                                      placeholder={isSelf ? 'Enter address from where vehicle will be picked up' : 'Enter address from where passenger will be picked up'}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                </div>
                                {/* Drop Off Date + Drop Off Location */}
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Drop Off Date</p>
                                    <input
                                      type="date"
                                      value={vd.dropOffDate || ''}
                                      onChange={e => updateVD({ dropOffDate: e.target.value })}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Drop Off Location</p>
                                    <input
                                      type="text"
                                      value={vd.dropOffLocation || ''}
                                      onChange={e => updateVD({ dropOffLocation: e.target.value })}
                                      placeholder={isSelf ? 'Enter address to where the vehicle will be dropped off' : 'Enter address where passenger will be dropped off'}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                </div>
                                {/* Vehicle Brand + Pick Up time + Drop off time */}
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">
                                      Vehicle Brand <span className="text-sky-400 font-normal">(Optional)</span>
                                    </p>
                                    <input
                                      type="text"
                                      value={vd.vehicleBrand || ''}
                                      onChange={e => updateVD({ vehicleBrand: e.target.value })}
                                      placeholder="Enter Vehicle Brand"
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5 flex items-center gap-1">
                                      Pick Up time <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span>
                                    </p>
                                    <input
                                      type="time"
                                      value={vd.pickUpTime || ''}
                                      onChange={e => updateVD({ pickUpTime: e.target.value })}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5 flex items-center gap-1">
                                      Drop off time <span className="text-orange-400 text-[10px]">ⓘ</span> <span className="text-sky-400 font-normal">(Optional)</span>
                                    </p>
                                    <input
                                      type="time"
                                      value={vd.dropOffTime || ''}
                                      onChange={e => updateVD({ dropOffTime: e.target.value })}
                                      className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-blue-400"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addRow(setItineraryDays, { day: "", title: "", description: "", master_template: "", image: null, details_json: { active_tab: 'day_itinerary', sightseeing: [""], transfers: [""], accommodations: [], meals: [""], vehicles: [""] } })} className="w-full py-6 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#14532d]/40 hover:text-[#14532d] transition-all hover:bg-green-50 active:scale-[0.99] group">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-2xl mb-2 group-hover:scale-110 group-hover:bg-white shadow-sm transition-all">+</div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Discovery Day</span>
                    </button>
                  </div>
                </Section>

                {/* PRICING - PAGE 4 */}
                <Section title="Pricing" active={currentPage === 4}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-16 h-16 bg-green-50 rounded-bl-full opacity-50 transition-all group-hover:scale-110"></div>
                      <FormLabel label="Offer Price (Final)" required />
                      <div className="relative z-10">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-gray-300 group-hover:text-[#14532d] transition-colors text-xs">₹</span>
                        <Input type="text" name="offer_price" value={formatWithCommas(formData.offer_price)} onChange={handleInputChange} className="!pl-8 !text-xs !font-black !py-1.5" error={errors.offer_price} />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-16 h-16 bg-red-50 rounded-bl-full opacity-50 transition-all group-hover:scale-110"></div>
                      <FormLabel label="Markup Price (Strike)" optional />
                      <div className="relative z-10">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-gray-300 group-hover:text-red-400 transition-colors text-xs">₹</span>
                        <Input type="text" name="price" value={formatWithCommas(formData.price)} onChange={handleInputChange} className="!pl-8 !text-xs !font-black !py-1.5" />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-bl-full opacity-50 transition-all group-hover:scale-110"></div>
                      <FormLabel label="Sharing Option" required />
                      <div className="relative z-10">
                        <select
                          name="sharing"
                          value={formData.sharing}
                          onChange={handleInputChange}
                          className="bg-white border-2 border-gray-100 px-3 py-1.5 rounded-xl w-full text-gray-900 text-[10px] font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200"
                        >
                          <option value="SINGLE">SINGLE SHARING</option>
                          <option value="TWIN">TWIN SHARING</option>
                          <option value="TRIPLE">TRIPLE SHARING</option>
                          <option value="QUAD">QUAD SHARING</option>
                          <option value="QUINT">QUINT SHARING</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Trip Information" active={currentPage === 5}>
                  <div className="space-y-6 max-w-5xl mx-auto">
                    {/* Arrival & Departure Flight/Transfer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {/* Arrival */}
                      <div className="bg-blue-50/20 p-3 rounded-lg border border-blue-100/30">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Plane size={12} className="rotate-45" /> Arrival Logistics
                          </h4>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.with_arrival}
                              onChange={(e) => setFormData({ ...formData, with_arrival: e.target.checked })}
                              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none">Included</span>
                          </label>
                        </div>

                        <div className={!formData.with_arrival ? "opacity-30 blur-[1px] pointer-events-none select-none grayscale transition-all duration-500" : "transition-all duration-300"}>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <FormLabel label="Arrival City" optional />
                              <Input name="arrival_city" value={formData.arrival_city} onChange={handleInputChange} placeholder="City Name" className="!py-1 !text-[10px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div>
                                <FormLabel label="Date" optional />
                                <Input type="date" name="arrival_date" value={formData.arrival_date} onChange={handleInputChange} className="!py-1 !text-[10px] !px-1 [&::-webkit-calendar-picker-indicator]:scale-75" />
                              </div>
                              <div>
                                <FormLabel label="Time" optional />
                                <Input type="time" name="arrival_time" value={formData.arrival_time} onChange={handleInputChange} className="!py-1 !text-[10px] !px-1 [&::-webkit-calendar-picker-indicator]:scale-75" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <FormLabel label="Airline" optional />
                              <SearchableSelect
                                options={airlines.map(a => ({ value: a.name, label: a.name }))}
                                value={formData.arrival_airline}
                                onChange={(val) => setFormData(prev => ({ ...prev, arrival_airline: val }))}
                                placeholder="Select"
                                className="!py-1 !text-[10px]"
                              />
                            </div>
                            <div>
                              <FormLabel label="Flight No." optional />
                              <Input name="arrival_flight_no" value={formData.arrival_flight_no} onChange={handleInputChange} placeholder="No." className="!py-1 !text-[10px]" />
                            </div>
                          </div>
                          <div>
                            <FormLabel label="Airport" optional />
                            <Input name="arrival_airport" value={formData.arrival_airport} onChange={handleInputChange} placeholder="Airport Name" className="!py-1 !text-[10px]" />
                          </div>

                          {/* Custom Compact Night Selector - Forces Downward */}
                          <div className="relative mt-3 pt-3 border-t border-blue-50 flex flex-col items-center">
                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1.5">Stay Duration</p>
                            <div className="relative w-full max-w-[140px]">
                              <button
                                type="button"
                                onClick={() => setIsNightsDropdownOpen(!isNightsDropdownOpen)}
                                className="w-full flex items-center justify-between bg-white border-2 border-[#14532d] rounded-full px-4 py-1 text-[10px] font-black text-[#14532d] uppercase active:scale-95 transition-all shadow-sm shadow-green-100"
                              >
                                <span>{formData.arrival_no_of_nights ? `${formData.arrival_no_of_nights} ${formData.arrival_no_of_nights === '1' ? 'NIGHT' : 'NIGHTS'}` : 'SELECT NIGHTS'}</span>
                                <span className={`ml-2 transition-transform duration-300 ${isNightsDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                              </button>

                              {isNightsDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-[9] cursor-default" onClick={() => setIsNightsDropdownOpen(false)}></div>
                                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border-2 border-[#14532d] rounded-xl shadow-2xl z-10 overflow-hidden max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(n => (
                                      <button
                                        key={n}
                                        type="button"
                                        onClick={() => {
                                          const val = n.toString();
                                          setFormData(prev => ({ ...prev, arrival_no_of_nights: val }));
                                          const newItineraryDays = itineraryDays.map(day => {
                                            const currentRD = day.details_json?._roomDetails || { noOfRooms: '', rooms: [] };
                                            const rooms = Array.from({ length: n }, (_, idx) => currentRD.rooms?.[idx] || { roomType: '', meals: '' });
                                            return { ...day, details_json: { ...day.details_json, _roomDetails: { ...currentRD, noOfRooms: val, rooms } } };
                                          });
                                          setItineraryDays(newItineraryDays);
                                          setIsNightsDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-[10px] font-black uppercase text-gray-700 hover:bg-green-50 hover:text-[#14532d] text-left border-b border-gray-50 last:border-0 transition-colors"
                                      >
                                        {n} {n === 1 ? 'NIGHT' : 'NIGHTS'}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            <p className="text-[7px] text-gray-400 mt-1.5 uppercase font-bold italic">Auto-syncs to itinerary accommodation</p>
                          </div>
                        </div>
                      </div>

                      {/* Departure */}
                      <div className="bg-indigo-50/20 p-3 rounded-lg border border-indigo-100/30">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Plane size={12} className="-rotate-45" /> Departure Logistics
                          </h4>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.with_departure}
                              onChange={(e) => setFormData({ ...formData, with_departure: e.target.checked })}
                              className="w-3 h-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Included</span>
                          </label>
                        </div>
                        <div className={!formData.with_departure ? "opacity-30 blur-[1px] pointer-events-none select-none grayscale transition-all duration-500" : "transition-all duration-300"}>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <FormLabel label="Departure City" optional />
                              <Input name="departure_city" value={formData.departure_city} onChange={handleInputChange} placeholder="City Name" className="!py-1 !text-[10px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div>
                                <FormLabel label="Date" optional />
                                <Input type="date" name="departure_date" value={formData.departure_date} onChange={handleInputChange} className="!py-1 !text-[10px] !px-1 [&::-webkit-calendar-picker-indicator]:scale-75" />
                              </div>
                              <div>
                                <FormLabel label="Time" optional />
                                <Input type="time" name="departure_time" value={formData.departure_time} onChange={handleInputChange} className="!py-1 !text-[10px] !px-1 [&::-webkit-calendar-picker-indicator]:scale-75" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <FormLabel label="Airline" optional />
                              <SearchableSelect
                                options={airlines.map(a => ({ value: a.name, label: a.name }))}
                                value={formData.departure_airline}
                                onChange={(val) => setFormData(prev => ({ ...prev, departure_airline: val }))}
                                placeholder="Select"
                                className="!py-1 !text-[10px]"
                              />
                            </div>
                            <div>
                              <FormLabel label="Flight No." optional />
                              <Input name="departure_flight_no" value={formData.departure_flight_no} onChange={handleInputChange} placeholder="No." className="!py-1 !text-[10px]" />
                            </div>
                          </div>
                          <div>
                            <FormLabel label="Airport" optional />
                            <Input name="departure_airport" value={formData.departure_airport} onChange={handleInputChange} placeholder="Airport Name" className="!py-1 !text-[10px]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INCLUSIONS */}
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-1.5">
                        Inclusions <span className="text-sky-400 font-normal text-[10px] opacity-90">(Optional)</span>
                      </h3>
                      <div className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                        <div className="border-b border-gray-200 bg-white px-2 py-1 flex gap-1.5">
                          <button type="button" onClick={() => insertBullet(inclusionsRef, inclusions, setInclusions)} title="Insert bullet point" className="w-6 h-6 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                            <List size={13} />
                          </button>
                        </div>
                        <textarea
                          ref={inclusionsRef}
                          className="w-full min-h-[90px] px-3 py-2 text-[12px] text-gray-700 focus:outline-none resize-y"
                          placeholder="• Accommodation as per itinerary&#10;• Transfers as per itinerary&#10;• Sightseeing as per itinerary"
                          value={inclusions.join('\n')}
                          onChange={(e) => setInclusions(e.target.value.split('\n'))}
                          spellCheck="false"
                        />
                      </div>
                    </div>

                    {/* EXCLUSIONS */}
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-1.5">
                        Exclusions <span className="text-sky-400 font-normal text-[10px] opacity-90">(Optional)</span>
                      </h3>
                      <div className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                        <div className="border-b border-gray-200 bg-white px-2 py-1 flex gap-1.5">
                          <button type="button" onClick={() => insertBullet(exclusionsRef, exclusions, setExclusions)} title="Insert bullet point" className="w-6 h-6 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                            <List size={13} />
                          </button>
                        </div>
                        <textarea
                          ref={exclusionsRef}
                          className="w-full min-h-[90px] px-3 py-2 text-[12px] text-gray-700 focus:outline-none resize-y"
                          placeholder="• Cost of Visa and travel insurance&#10;• Any heads not mentioned under INCLUSIONS"
                          value={exclusions.join('\n')}
                          onChange={(e) => setExclusions(e.target.value.split('\n'))}
                          spellCheck="false"
                        />
                      </div>
                    </div>

                    {/* CANCELLATION POLICY */}
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-800 tracking-tight mb-2 flex items-center gap-1.5">
                        Cancellation Policy <span className="text-sky-400 font-normal text-[10px] opacity-90">(Optional)</span>
                      </h3>
                      <div className="border border-gray-300 bg-white rounded-sm overflow-hidden shadow-sm">
                        <div className="border-b border-gray-200 bg-white px-2 py-1 flex gap-1.5">
                          <button type="button" onClick={() => insertNumbered(cancellationRef, cancellationPolicies, setCancellationPolicies)} title="Insert numbered item" className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                            <ListOrdered size={13} />
                          </button>
                        </div>
                        <textarea
                          ref={cancellationRef}
                          className="w-full min-h-[90px] px-3 py-2 text-[12px] text-gray-700 focus:outline-none resize-y"
                          placeholder="1. 60 days prior – 25% cancellation of the tour cost&#10;2. 45 days prior – 50% cancellation of the tour cost"
                          value={cancellationPolicies.join('\n')}
                          onChange={(e) => setCancellationPolicies(e.target.value.split('\n'))}
                          spellCheck="false"
                        />
                      </div>
                    </div>

                  </div>
                </Section>

                {/* Navigation Buttons for Pages */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-[2rem]">
                  <button
                    type="button"
                    onClick={() => navigatePage('back')}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed text-gray-400' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95'}`}
                  >
                    ← Previous Step
                  </button>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${currentPage === i ? 'w-8 bg-[#14532d]' : 'w-1.5 bg-gray-200'}`}></div>
                    ))}
                  </div>

                  {currentPage < totalPages ? (
                    <button
                      type="button"
                      onClick={() => navigatePage('next')}
                      className="flex items-center gap-2 px-8 py-2 rounded-xl bg-[#14532d] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/10 hover:scale-105 active:scale-95 transition-all"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      type="button"
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-2 rounded-xl bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
                    >
                      {loading ? "SAVING..." : "COMPLETE & SAVE"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div >
        </div >
      </div >

      {/* Add New Accommodation Modal */}
      {showHotelModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="bg-white rounded-[1.5rem] w-full max-w-xl h-fit max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-widest leading-none">Add New Accommodation</h2>
              <button onClick={() => setShowHotelModal(false)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-outfit">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar space-y-2.5 flex-1 min-h-0">
              <div className="grid grid-cols-12 gap-2.5">
                <div className="col-span-8">
                  <FormLabel label="Name" required />
                  <Input placeholder="Hotel name" value={newHotelForm.name} onChange={(e) => setNewHotelForm({ ...newHotelForm, name: e.target.value })} />
                </div>
                <div className="col-span-4">
                  <FormLabel label="Stars" required />
                  <select className="w-full bg-white border-2 border-gray-100 px-3 py-1.5 rounded-xl text-[11px] font-black outline-none focus:border-[#14532d] transition-all" value={newHotelForm.stars} onChange={(e) => setNewHotelForm({ ...newHotelForm, stars: e.target.value })}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <FormLabel label="City" required />
                  <SearchableSelect
                    options={destinations.map(d => ({ value: d.name, label: d.name }))}
                    value={newHotelForm.city}
                    onChange={(val) => setNewHotelForm({ ...newHotelForm, city: val })}
                    placeholder="Select City"
                  />
                </div>
                <div>
                  <FormLabel label="Address" optional />
                  <Input placeholder="Hotel address" value={newHotelForm.address} onChange={(e) => setNewHotelForm({ ...newHotelForm, address: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <FormLabel label="Phone" optional />
                  <Input placeholder="Phone number" value={newHotelForm.phone} onChange={(e) => setNewHotelForm({ ...newHotelForm, phone: e.target.value })} />
                </div>
                <div>
                  <FormLabel label="Website" optional />
                  <Input placeholder="URL" value={newHotelForm.website} onChange={(e) => setNewHotelForm({ ...newHotelForm, website: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2.5">
                <div className="col-span-6">
                  <FormLabel label="Email" optional />
                  <Input placeholder="Email address" value={newHotelForm.email} onChange={(e) => setNewHotelForm({ ...newHotelForm, email: e.target.value })} />
                </div>
                <div className="col-span-3">
                  <FormLabel label="Lat" optional />
                  <Input placeholder="0.00" value={newHotelForm.latitude} onChange={(e) => setNewHotelForm({ ...newHotelForm, latitude: e.target.value })} />
                </div>
                <div className="col-span-3">
                  <FormLabel label="Long" optional />
                  <Input placeholder="0.00" value={newHotelForm.longitude} onChange={(e) => setNewHotelForm({ ...newHotelForm, longitude: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <FormLabel label="Images" optional />
                <div className="flex flex-wrap gap-2.5 min-h-[40px]">
                  {newHotelForm.images && newHotelForm.images.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden group border-2 border-gray-100 shadow-sm animate-in zoom-in-50">
                      <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImgs = [...newHotelForm.images];
                          newImgs.splice(idx, 1);
                          setNewHotelForm({ ...newHotelForm, images: newImgs });
                        }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} className="text-white" />
                      </button>
                      {idx === 0 && <div className="absolute top-0 left-0 bg-[#14532d] text-[5px] text-white font-black px-1 py-0.5 uppercase">Main</div>}
                    </div>
                  ))}
                  <input type="file" id="hotel-image-upload-new" className="hidden" multiple onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setNewHotelForm({ ...newHotelForm, images: [...(newHotelForm.images || []), ...files] });
                  }} />
                  <label htmlFor="hotel-image-upload-new" className="w-14 h-14 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-all cursor-pointer group">
                    <Plus size={14} className="text-gray-300 group-hover:text-[#14532d] transition-colors" />
                    <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Add</span>
                  </label>
                </div>
                {newHotelForm.images?.length > 1 && (
                  <p className="text-[7px] text-gray-400 font-bold italic uppercase tracking-wider">* Only the first image will be saved to masters</p>
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setShowHotelModal(false)} className="px-5 py-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-600 transition-all font-outfit">Cancel</button>
              <button type="button" onClick={handleSaveHotel} className="px-6 py-1.5 bg-[#14532d] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 hover:scale-105 active:scale-95 transition-all font-outfit">Save Hotel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayPackageAdd;
