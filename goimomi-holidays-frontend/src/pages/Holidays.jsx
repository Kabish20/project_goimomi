import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Share2, Mail, Eye, MessageCircle, X, Copy, Calendar, MapPin, CheckCircle, ChevronDown, Search, FileDown, Plane, Clock, Building2, Sparkles, ArrowRight } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import FormModal from "../components/FormModal";
import goimomilogo from "../assets/goimomilogo.png";

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

  const [selectedPkgTitle, setSelectedPkgTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetailsPkg, setViewDetailsPkg] = useState(null);
  const [emailModalPkg, setEmailModalPkg] = useState(null);
  const [sharingEmail, setSharingEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const filteredDestinationsList = (destinationsList || []).filter(dest =>
  (dest?.name?.toLowerCase().includes(destSearch.toLowerCase()) ||
    (dest?.country && dest.country.toLowerCase().includes(destSearch.toLowerCase())))
  );

  const filteredStartingCitiesList = (startingCitiesList || []).filter(city =>
    city?.name?.toLowerCase().includes(startCitySearch.toLowerCase())
  );

  // Helper to fix image URLs
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
    }
    return url;
  };

  const generateShareText = (pkg) => {
    let text = `Hello, please find details with regards to your holiday query for:
${pkg.title}
Duration: ${pkg.days} Days / ${pkg.days - 1} Nights
Starting From: ₹ ${Number(pkg.Offer_price || 0).toLocaleString()}

${pkg.description ? `Description:\n${pkg.description}\n` : ""}
Highlights:
${pkg.highlights?.map(h => `• ${h.text}`)?.join("\n") || "• Accommodation\n• Daily Breakfast\n• Sightseeing\n• Transfers"}

${pkg.inclusions?.length > 0 ? `Inclusions:\n${pkg.inclusions.map(inc => `• ${inc.text}`).join("\n")}\n` : ""}
${pkg.exclusions?.length > 0 ? `Exclusions:\n${pkg.exclusions.map(exc => `• ${exc.text}`).join("\n")}\n` : ""}
Itinerary Summary:
${pkg.itinerary?.map(day => `Day ${day.day_number}: ${day.title}`)?.join("\n") || ""}

Destinations: ${pkg.starting_city}${pkg.destinations?.length > 0 ? " • " + pkg.destinations.map(d => d.name).join(" • ") : ""}

Thank you for choosing goimomi.com
Contact : +91 6382220393
Email : hello@goimomi.com`;
    return text;
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const downloadPackagePDF = async (pkg) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Logo / Header
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(0, 0, pageWidth, 40, 'F');

    try {
      const logo = await loadImage(goimomilogo);
      doc.addImage(logo, 'PNG', 15, 8, 50, 15);
    } catch (error) {
      console.error("Failed to load logo", error);
      doc.setTextColor(20, 83, 45); // #14532d
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("goimomi.com", 15, 25);
    }

    doc.setTextColor(20, 83, 45); // #14532d
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Your Premium Holiday Partner", 15, 30);
    doc.text("+91 6382220393 | hello@goimomi.com", pageWidth - 15, 30, { align: "right" });

    yPos = 55;

    // Package Title
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(pkg.title, 15, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${pkg.days} Days / ${pkg.days - 1} Nights | Starting choice - ${pkg.starting_city}`, 15, yPos);
    yPos += 15;

    // Package Image
    try {
      const imgUrl = getImageUrl(pkg.card_image);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imgUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      if (img.complete && img.naturalWidth > 0) {
        const imgWidth = pageWidth - 30;
        const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;
        const finalHeight = Math.min(imgHeight, 80);
        doc.addImage(img, 'JPEG', 15, yPos, imgWidth, finalHeight);
        yPos += finalHeight + 15;
      }
    } catch (e) {
      console.log("Image load error for PDF", e);
      yPos += 5;
    }

    // Highlights & Description
    const addSection = (title, items) => {
      if (!items || items.length === 0) return;
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setTextColor(20, 83, 45);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(title, 15, yPos);
      yPos += 7;
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const list = Array.isArray(items) ? items : [items];
      list.forEach(item => {
        const text = typeof item === 'object' ? item.text : item;
        if (text) {
          const splitText = doc.splitTextToSize(`• ${text}`, pageWidth - 40);
          doc.text(splitText, 20, yPos);
          yPos += (splitText.length * 5) + 2;
          if (yPos > 270) { doc.addPage(); yPos = 20; }
        }
      });
      yPos += 5;
    };

    addSection("Destinations", pkg.destinations?.map(d => d.name));
    addSection("Package Highlights", pkg.highlights);

    // Itinerary
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      if (yPos > 240) { doc.addPage(); yPos = 20; }
      doc.setTextColor(20, 83, 45);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Day Wise Itinerary", 15, yPos);
      yPos += 10;

      pkg.itinerary.forEach((day) => {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, 'F');
        doc.setTextColor(20, 83, 45);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Day ${day.day_number}: ${day.title}`, 20, yPos + 7);
        yPos += 15;

        if (day.description) {
          doc.setTextColor(75, 85, 99);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const splitDesc = doc.splitTextToSize(day.description, pageWidth - 40);
          doc.text(splitDesc, 20, yPos);
          yPos += (splitDesc.length * 4.5) + 5;
        }

        if (yPos > 270) { doc.addPage(); yPos = 20; }
      });
      yPos += 5;
    }

    addSection("Inclusions", pkg.inclusions);
    addSection("Exclusions", pkg.exclusions);



    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, 285, { align: "right" });
      doc.text("Thank you for choosing goimomi.com | +91 6382220393", 15, 285);
    }

    doc.save(`GoImomi_${pkg.title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleEmailShare = async (e) => {
    e.preventDefault();
    if (!sharingEmail || !emailModalPkg) return;
    setSendingEmail(true);

    const subject = `Holiday Package Information: ${emailModalPkg.title}`;
    const body = generateShareText(emailModalPkg);

    try {
      await axios.post('/api/send-visa-details/', {
        email: sharingEmail,
        subject,
        body
      });
      alert("Details sent successfully to " + sharingEmail);
      setEmailModalPkg(null);
      setSharingEmail("");
    } catch (error) {
      console.error("Error sending email:", error);
      window.location.href = `mailto:${sharingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setEmailModalPkg(null);
      setSharingEmail("");
    } finally {
      setSendingEmail(false);
    }
  };

  // ===================== FILTERED LIST =====================
  const filtered = packages.filter((pkg) => {
    if (!pkg) return false;
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
      <div className="w-[18%] min-w-[210px] bg-white border-r border-gray-100 sticky top-[140px] self-start h-[calc(100vh-140px)] overflow-y-auto hidden md:block custom-scrollbar">
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.1em]">Filters</h3>
            <button
              onClick={() => {
                setCategory("");
                setDestination("");
                setNights("");
                setStartingCity("");
                setBudget([0, 200000]);
                setFlightFilter("All");
              }}
              className="text-[9px] font-black text-[#14532d] hover:underline uppercase tracking-tighter"
            >
              Reset All
            </button>
          </div>

          {/* DESTINATION (SEARCHABLE) */}
          <div className="relative dest-dropdown-container">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 underline decoration-[#14532d]/20 underline-offset-4">
              Destination
            </label>
            <div
              className="w-full px-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl cursor-pointer flex justify-between items-center transition-all hover:bg-white hover:border-green-100"
              onClick={() => setIsDestOpen(!isDestOpen)}
            >
              <span className={`text-[11px] truncate ${destination ? "text-gray-900 font-bold" : "text-gray-400 font-medium"}`}>
                {destination || "Select Destination"}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${isDestOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDestOpen && (
              <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 bg-gray-50/50">
                  <div className="relative">
                    <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-7 pr-2 py-1.5 text-[10px] bg-white border border-gray-100 rounded-lg outline-none focus:border-[#14532d] transition-all"
                      value={destSearch}
                      onChange={(e) => setDestSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
                  <li
                    className={`px-3 py-1.5 hover:bg-green-50 cursor-pointer text-[11px] font-medium transition-colors ${!destination ? 'text-[#14532d] bg-green-50/50' : 'text-gray-600'}`}
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
                        className={`px-3 py-1.5 hover:bg-green-50 cursor-pointer text-[11px] transition-colors ${destination === dest.name ? 'text-[#14532d] bg-green-50/50 font-bold' : 'text-gray-600'}`}
                        onClick={() => {
                          setDestination(dest.name);
                          setIsDestOpen(false);
                          setDestSearch("");
                        }}
                      >
                        <div className="flex flex-col">
                          <span>{dest.name}</span>
                          {dest.country && <span className="text-[8px] text-gray-400 font-medium uppercase tracking-tight">{dest.country}</span>}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-400 text-[9px] text-center italic">No destinations found</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* FLIGHT FILTER */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 underline decoration-[#14532d]/20 underline-offset-4">
              Package Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["All", "With Flight", "Without Flight"].map((option) => (
                <button
                  key={option}
                  onClick={() => setFlightFilter(option)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[9px] font-black transition-all border leading-none ${flightFilter === option
                    ? "bg-[#14532d] border-[#14532d] text-white shadow-sm"
                    : "bg-gray-50/40 border-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white"
                    }`}
                  title={option}
                >
                  <span className="text-center">
                    {option === "All" ? "ALL" : option === "With Flight" ? "FLIGHT" : "NO FLT"}
                  </span>
                  {flightFilter === option && <CheckCircle size={8} />}
                </button>
              ))}
            </div>
          </div>

          {/* NIGHTS */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 underline decoration-[#14532d]/20 underline-offset-4">
              Duration (Nights)
            </label>
            <div className="relative group">
              <select
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-[11px] font-bold text-gray-900 appearance-none cursor-pointer transition-all hover:bg-white hover:border-green-100"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
              >
                <option value="">Any Duration</option>
                {[...Array(29)].map((_, i) => (
                  <option key={i + 2} value={i + 2}>{i + 2} Nights</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors" />
            </div>
          </div>

          {/* STARTING CITY (SEARCHABLE) */}
          <div className="relative startcity-dropdown-container">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 underline decoration-[#14532d]/20 underline-offset-4">
              Starting From
            </label>
            <div
              className="w-full px-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl cursor-pointer flex justify-between items-center transition-all hover:bg-white hover:border-green-100"
              onClick={() => setIsStartCityOpen(!isStartCityOpen)}
            >
              <span className={`text-[11px] truncate ${startingCity ? "text-gray-900 font-bold" : "text-gray-400 font-medium"}`}>
                {startingCity || "Select City"}
              </span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${isStartCityOpen ? 'rotate-180' : ''}`} />
            </div>

            {isStartCityOpen && (
              <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 bg-gray-50/50">
                  <div className="relative">
                    <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search city..."
                      className="w-full pl-7 pr-2 py-1.5 text-[10px] bg-white border border-gray-100 rounded-lg outline-none focus:border-[#14532d] transition-all"
                      value={startCitySearch}
                      onChange={(e) => setStartCitySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
                  <li
                    className={`px-3 py-1.5 hover:bg-green-50 cursor-pointer text-[11px] font-medium transition-colors ${!startingCity ? 'text-[#14532d] bg-green-50/50' : 'text-gray-600'}`}
                    onClick={() => {
                      setStartingCity("");
                      setIsStartCityOpen(false);
                      setStartCitySearch("");
                    }}
                  >
                    Any City
                  </li>
                  {filteredStartingCitiesList.length > 0 ? (
                    filteredStartingCitiesList.map((city) => (
                      <li
                        key={city.id}
                        className={`px-3 py-1.5 hover:bg-green-50 cursor-pointer text-[11px] transition-colors ${startingCity === city.name ? 'text-[#14532d] bg-green-50/50 font-bold' : 'text-gray-600'}`}
                        onClick={() => {
                          setStartingCity(city.name);
                          setIsStartCityOpen(false);
                          setStartCitySearch("");
                        }}
                      >
                        <div className="flex flex-col">
                          <span>{city.name}</span>
                          {city.region && <span className="text-[8px] text-gray-400 font-medium uppercase tracking-tight">{city.region}</span>}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-400 text-[9px] text-center italic">No cities found</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* BUDGET */}
          <div className="pt-1">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest underline decoration-[#14532d]/20 underline-offset-4">
                Budget
              </label>
              <span className="text-[10px] font-black text-[#14532d] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                ₹{budget[1].toLocaleString()}
              </span>
            </div>
            <div className="relative pt-3">
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={budget[1]}
                onChange={(e) => setBudget([0, Number(e.target.value)])}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#14532d]"
                style={{
                  background: `linear-gradient(to right, #14532d 0%, #14532d ${(budget[1] / 200000) * 100}%, #f3f4f6 ${(budget[1] / 200000) * 100}%, #f3f4f6 100%)`
                }}
              />
              <div className="flex justify-between text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest">
                <span>Free</span>
                <span>₹2,00,000+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== RIGHT SIDE (PACKAGE LISTING) ====================== */}
      <div className="flex-1 p-8 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar bg-white/50 backdrop-blur-sm">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Explorer Packages
              {category && <span className="text-[#14532d] ml-2">• {category}</span>}
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Discover handpicked destinations for your next adventure</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14532d]"></div>
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
                className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row border border-gray-100"
              >
                {/* Share Bar */}
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/10 z-20 transition-all hover:bg-black/80 shadow-lg">
                  <div className="flex items-center gap-1.5 text-white/90 font-bold text-[9px] uppercase tracking-wider border-r border-white/20 pr-2">
                    <Share2 size={11} className="text-white/70" />
                    <span className="hidden sm:inline">Share :</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = generateShareText(pkg);
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center gap-1 text-white hover:text-green-400 font-bold text-[9px] transition-colors"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle size={12} />
                      WhatsApp
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmailModalPkg(pkg);
                      }}
                      className="flex items-center gap-1 text-white hover:text-blue-400 font-bold text-[9px] transition-colors"
                      title="Share via Email"
                    >
                      <Mail size={12} />
                      Email
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPackagePDF(pkg);
                      }}
                      className="flex items-center gap-1 text-white hover:text-red-400 font-bold text-[9px] transition-colors"
                      title="Download PDF"
                    >
                      <FileDown size={12} />
                      PDF
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewDetailsPkg(pkg);
                      }}
                      className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 font-bold text-[9px] transition-colors"
                      title="Quick View"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="relative w-full md:w-64 h-48 md:h-64 overflow-hidden">
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
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1 hover:text-[#14532d] transition-colors cursor-pointer" onClick={() => navigate(`/holiday/${pkg.id}`)}>
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
                      {(pkg.highlights?.length ? pkg.highlights.slice(0, 4) : [
                        { text: "Accommodation" }, { text: "Daily Breakfast" }, { text: "Sightseeing" }, { text: "Transfers" }
                      ]).map((h, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                          <span className="text-[#14532d]">✓</span>
                          <span className="truncate">{h.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-gray-900 leading-none">
                          ₹ {Number(pkg.Offer_price || 0).toLocaleString()}
                        </span>
                        {Number(pkg.price) > Number(pkg.Offer_price) && (
                          <span className="text-gray-400 line-through text-sm">
                            ₹ {Number(pkg.price || 0).toLocaleString()}
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

      {viewDetailsPkg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewDetailsPkg(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <button
                onClick={() => {
                  const text = generateShareText(viewDetailsPkg);
                  navigator.clipboard.writeText(text);
                  alert("Details copied to clipboard!");
                }}
                className="flex items-center gap-1.5 text-[#14532d] font-bold text-[10px] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-all border border-green-100 uppercase tracking-wider"
              >
                <Copy size={12} />
                Copy Text
              </button>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">ITINERARY PREVIEW</h3>
              <button onClick={() => setViewDetailsPkg(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="font-sans text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                <p>Hello, please find details with regards to your holiday query for:</p>
                <p className="font-bold text-[#14532d]">{viewDetailsPkg.title}</p>
                <p>Duration: {viewDetailsPkg.days} Days / {viewDetailsPkg.days - 1} Nights</p>
                <p>Starting From: ₹ {Number(viewDetailsPkg.Offer_price || 0).toLocaleString()}</p>

                {viewDetailsPkg.description && (
                  <div className="mt-4">
                    <p className="font-bold">Description:</p>
                    <p className="text-gray-600 italic">{viewDetailsPkg.description}</p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="font-bold">Highlights:</p>
                  <div className="mt-0.5">
                    {viewDetailsPkg.highlights?.length ? viewDetailsPkg.highlights.map((h, i) => (
                      <p key={i}>• {h.text}</p>
                    )) : ["Accommodation", "Daily Breakfast", "Sightseeing", "Transfers"].map((text, i) => (
                      <p key={i}>• {text}</p>
                    ))}
                  </div>
                </div>

                {viewDetailsPkg.inclusions?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-bold">Inclusions:</p>
                    <div className="mt-0.5">
                      {viewDetailsPkg.inclusions.map((inc, i) => (
                        <p key={i}>• {inc.text}</p>
                      ))}
                    </div>
                  </div>
                )}

                {viewDetailsPkg.exclusions?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-bold">Exclusions:</p>
                    <div className="mt-0.5">
                      {viewDetailsPkg.exclusions.map((exc, i) => (
                        <p key={i}>• {exc.text}</p>
                      ))}
                    </div>
                  </div>
                )}

                {viewDetailsPkg.itinerary?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-bold">Itinerary Summary:</p>
                    <div className="mt-0.5">
                      {viewDetailsPkg.itinerary.map((day, i) => (
                        <p key={i}>Day {day.day_number}: {day.title}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-bold">Destinations: <span className="font-normal text-gray-600">{viewDetailsPkg.starting_city}{viewDetailsPkg.destinations?.length > 0 ? " • " + viewDetailsPkg.destinations.map(d => d.name).join(" • ") : ""}</span></p>
                </div>

                <div className="mt-6 space-y-1 border-emerald-500/20 border-l-2 pl-3 bg-green-50/30 p-2 rounded-r-lg">
                  <p className="italic text-[11px] text-gray-500">Thank you for choosing goimomi.com</p>
                  <p className="font-bold text-[#14532d] text-[12px]">Contact : +91 6382220393</p>
                  <p className="text-gray-600 font-medium text-[11px]">Email : hello@goimomi.com</p>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate(`/holiday/${viewDetailsPkg.id}`)}
                    className="bg-[#14532d] text-white px-8 py-2 rounded-xl text-[10px] font-black hover:bg-[#0f4022] transition-all shadow-md active:scale-95 uppercase tracking-widest"
                  >
                    View Full Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Share Modal */}
      {emailModalPkg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEmailModalPkg(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Share via Email</h3>
                <button onClick={() => setEmailModalPkg(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Enter the email address to share {emailModalPkg.title}.</p>
              <form onSubmit={handleEmailShare}>
                <input
                  type="email"
                  value={sharingEmail}
                  onChange={(e) => setSharingEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-[#14532d] outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="w-full py-3 bg-[#14532d] text-white rounded-xl font-bold hover:bg-[#0f4a24] transition-all disabled:opacity-50"
                >
                  {sendingEmail ? "Sending..." : "Send Details"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Holidays;
