import React, { useState, useEffect } from "react";
import { Hotel } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api";
import FormModal from "../components/FormModal";
import { getImageUrl } from "../utils/imageUtils";
import jsPDF from "jspdf";
import goimomilogo from "../assets/goimomilogo.png";
import pdfImg1 from "../assets/pdf/BALI - awesome waterfalls near UBUD.jpeg";
import pdfImg2 from "../assets/pdf/Egypt.jpeg";
import pdfImg3 from "../assets/pdf/FAMILY FUN IN VIETNAM _ Tailor-made tour - Exotic Voyages.jpeg";
import pdfImg4 from "../assets/pdf/16 of the Best Places to Visit in Italy.jpeg";
import pdfImg5 from "../assets/pdf/Petra (Jordan).jpeg";
import pdfImg6 from "../assets/pdf/The Colosseum, Rome.jpeg";
import pdfImg7 from "../assets/pdf/Matera_ The City of Stones.jpeg";
import pdfImg8 from "../assets/pdf/20 Best City Breaks in the World - Travel Den.jpeg";
import pdfImg9 from "../assets/pdf/A guide to the Azores.jpeg";
import pdfImg10 from "../assets/pdf/5 Day Phuket Thailand Itinerary - Guide To Things To Do.jpeg";
import pdfImg11 from "../assets/pdf/10 Top Cities In India To Visit - Hand Luggage Only - Travel, Food And Photography Blog.jpeg";
import pdfImg12 from "../assets/pdf/Navigating Japanese Culture_ 20 Essential Etiquette Tips for Travelers.jpeg";
import pdfImg13 from "../assets/pdf/amazing places in the world to travel.jpeg";
import pdfImg14 from "../assets/pdf/The ultimate travel Guide to Cappadocia, Turkey - Jyo Shankar.jpeg";
import pdfImg15 from "../assets/pdf/100 Most Beautiful UNESCO World Heritage Sites - Road Affair.jpeg";
import pdfImg16 from "../assets/pdf/15 Best Places In Turkey To Visit - Hand Luggage Only - Travel, Food And Photography Blog.jpeg";

const HolidayDetails = () => {
  const { id } = useParams();
  const [openDay, setOpenDay] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricePopupOpen, setPricePopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Itinerary");


  const toggleDay = (index) => {
    setOpenDay(openDay === index ? null : index);
  };

  useEffect(() => {
    api.get(`/api/packages/${id}/`)
      .then((res) => setPkg(res.data))
      .catch((err) => console.error("Error fetching package details:", err));

    api.get("/api/accommodations/")
      .then((res) => setAccommodations(res.data))
      .catch((err) => console.error("Error fetching accommodations:", err));

    const handleClickOutside = (event) => {
      if (!event.target.closest(".holiday-details-price-info")) {
        setPricePopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  const downloadPackagePDF = async (pkg) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const sidebarWidth = 50;
    const padding = 15;

    const addHeader = (doc, title) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.addImage(goimomilogo, 'PNG', padding, 5, 40, 12);
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text(title, pageWidth - padding, 12, { align: "right" });
      doc.setDrawColor(243, 244, 246);
      doc.line(padding, 20, pageWidth - padding, 20);
    };

    const addFooter = (doc, pageNum, totalPages) => {
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - padding, pageHeight - 10, { align: "right" });
      doc.text("© goimomi.com | +91 6382220393 | hello@goimomi.com", padding, pageHeight - 10);
    };

    // PAGE 1: COVER - 2-column image sidebar
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
    const baseImgs = [pdfImg1, pdfImg2, pdfImg3, pdfImg4, pdfImg5, pdfImg6, pdfImg7, pdfImg8, pdfImg9, pdfImg10, pdfImg11, pdfImg12, pdfImg13, pdfImg14, pdfImg15, pdfImg16];
    const imgSize = 24;
    const colW = sidebarWidth / 2;
    let sidebarY = 0;
    let imgIndex = 0;
    while (sidebarY + imgSize <= pageHeight) {
      try {
        doc.addImage(baseImgs[imgIndex % baseImgs.length], 'JPEG', 0, sidebarY, colW, imgSize, undefined, 'FAST');
        doc.addImage(baseImgs[(imgIndex + 1) % baseImgs.length], 'JPEG', colW, sidebarY, colW, imgSize, undefined, 'FAST');
      } catch (e) { }
      sidebarY += imgSize;
      imgIndex += 2;
    }

    let centerX = sidebarWidth + (pageWidth - sidebarWidth) / 2;
    try { doc.addImage(goimomilogo, 'PNG', centerX - 30, 40, 60, 20); } catch (e) { }

    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    const titleLines = doc.splitTextToSize(pkg.title.toUpperCase(), pageWidth - sidebarWidth - 30);
    doc.text(titleLines, centerX, 100, { align: "center" });

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`${pkg.starting_city} (${pkg.days}D / ${pkg.nights || pkg.days - 1}N)`, centerX, 125, { align: "center" });




    // PAGE 2
    doc.addPage(); addHeader(doc, pkg.title);
    let y = 35; doc.setTextColor(31, 41, 55); doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text("Trip Overview", padding, y); y += 10;
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(75, 85, 99);
    if (pkg.description) {
      const descLines = doc.splitTextToSize(pkg.description, pageWidth - (padding * 2));
      doc.text(descLines, padding, y); y += (descLines.length * 5) + 15;
    }
    if (pkg.highlights && pkg.highlights.length > 0) {
      doc.setTextColor(31, 41, 55); doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Trip Highlights", padding, y); y += 8;
      pkg.highlights.forEach(h => {
        doc.setFillColor(20, 83, 45); doc.circle(padding + 2, y - 1, 1, 'F');
        doc.setTextColor(75, 85, 99); doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(h.text, padding + 7, y); y += 7;
        if (y > pageHeight - 30) { addFooter(doc, 2, 4); doc.addPage(); addHeader(doc, pkg.title); y = 35; }
      });
    }
    addFooter(doc, 2, 4);

    // PAGE 3
    doc.addPage(); addHeader(doc, "Day Wise Itinerary"); y = 35;
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      pkg.itinerary.forEach((day) => {
        doc.setFillColor(243, 244, 246); doc.rect(padding, y, pageWidth - (padding * 2), 10, 'F');
        doc.setTextColor(20, 83, 45); doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text(`DAY ${day.day_number}: ${day.title}`, padding + 5, y + 7); y += 15;
        if (day.description) {
          doc.setTextColor(75, 85, 99); doc.setFontSize(9); doc.setFont("helvetica", "normal");
          const splitDesc = doc.splitTextToSize(day.description, pageWidth - (padding * 2) - 10);
          doc.text(splitDesc, padding + 5, y); y += (splitDesc.length * 4.5) + 10;
        }
        if (y > pageHeight - 40) { addFooter(doc, 3, 4); doc.addPage(); addHeader(doc, "Day Wise Itinerary (Contd.)"); y = 35; }
      });
    }
    addFooter(doc, 3, 4);

    // PAGE 4
    doc.addPage(); addHeader(doc, "Policies & Details"); y = 35;
    if (pkg.inclusions && pkg.inclusions.length > 0) {
      doc.setTextColor(20, 83, 45); doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Inclusions", padding, y); y += 10;
      pkg.inclusions.forEach(inc => {
        doc.setTextColor(75, 85, 99); doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(`• ${inc.text}`, padding + 5, y); y += 7;
      });
      y += 15;
    }
    if (pkg.exclusions && pkg.exclusions.length > 0) {
      doc.setTextColor(220, 38, 38); doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Exclusions", padding, y); y += 10;
      pkg.exclusions.forEach(exc => {
        doc.setTextColor(75, 85, 99); doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(`• ${exc.text}`, padding + 5, y); y += 7;
      });
    }
    addFooter(doc, 4, 4);
    doc.save(`GoImomi_${pkg.title.replace(/\s+/g, '_')}.pdf`);
  };

  if (!pkg) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="w-full bg-gray-50 pb-20">

      {/* HEADER IMAGE */}
      <img src={getImageUrl(pkg.header_image)} className="w-full h-[430px] object-cover" />

      <div className="w-[85%] mx-auto mt-10 flex gap-10">

        {/* LEFT CONTENT */}
        <div className="w-[65%]">
          <h1 className="text-4xl font-bold mb-4">{pkg.title}</h1>
          
          {/* Trip Description */}
          {pkg.description && (
            <div className="mb-8">
              <p className="text-gray-600 text-[15px] leading-relaxed">
                {pkg.description}
              </p>
            </div>
          )}

          {/* Highlights Summary */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="mb-10 bg-green-50/50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-[12px] font-black text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Trip Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {((pkg.highlights_raw && Array.isArray(pkg.highlights_raw) && pkg.highlights_raw.length > 0) ? pkg.highlights_raw.map(h => ({text: h})) : (pkg.highlights || [])).map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-1 w-1 h-1 rounded-full bg-green-400 flex-shrink-0"></div>
                    <span className="text-[13px] text-gray-700 font-medium leading-tight">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABS HEADER - STICKY / FLOATING */}
          <div className="sticky top-[115px] z-30 bg-white/95 backdrop-blur-md py-4 mb-6 -mx-4 px-4 shadow-sm border-b border-gray-100">
            <div className="flex flex-row overflow-x-auto gap-2 pb-1 custom-scrollbar no-scrollbar">
              {["Itinerary", "Sightseeing", "Hotels", "Inclusions & Exclusions", "Terms & Policy"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[10px] font-black rounded-lg shadow-sm transition-all flex-shrink-0 whitespace-nowrap uppercase tracking-wider ${activeTab === tab
                      ? "bg-[#16a34a] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="animate-in fade-in duration-500">

            {activeTab === "Itinerary" && (
              <div className="space-y-12">
                {pkg.itinerary?.map((item, index) => {
                  const details = typeof item.details_json === 'string' ? JSON.parse(item.details_json || '{}') : item.details_json;
                  return (
                    <div key={index} className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      {/* Day Header - Minimalist line across */}
                      <div className="border-b border-gray-300 mb-6 w-full">
                        <h2 className="text-xl font-bold text-gray-800 pb-1">Day {String(item.day_number).padStart(2, '0')}</h2>
                      </div>

                      {/* EXPERIENCE CARD */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm mb-4 relative">
                        <h3 className="text-base font-bold text-gray-900 mb-4">{item.title}</h3>
                        <p className="text-gray-700 text-[13px] leading-relaxed mb-1">
                          {item.description}
                        </p>


                        {/* Transfers Row */}
                        {details?.transfers?.length > 0 && (
                          <div className="text-[13px] text-gray-900 mb-8">
                            {details.transfers.map((t, ti) => {
                              let label = t.type;
                              if (t.type === 'Airport/Train') label = 'Airport to Hotel';
                              if (t.type === 'Sightseeing') label = 'Sightseeing';
                              return (
                                <span key={ti}>
                                  {ti > 0 && " | "}
                                  <span className="font-bold">{label}</span> : {t.vehicle_model}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Meals Matrix */}
                        <div className="flex gap-16 pt-6 border-t border-gray-100">
                          {[
                            { label: 'Breakfast', val: details?.meals?.breakfast },
                            { label: 'Lunch', val: details?.meals?.lunch },
                            { label: 'Dinner', val: details?.meals?.dinner }
                          ].map((m, mi) => (
                            <div key={mi} className="flex flex-col">
                              <span className="text-[12px] text-gray-300 font-medium mb-1">{m.label}</span>
                              <span className={`text-[12px] font-medium ${m.val ? 'text-gray-900' : 'text-gray-300'}`}>
                                {m.val ? 'Included' : 'Not Included'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* STAY CARD */}
                      {details?.accommodations?.map((h, hi) => {
                        const master = accommodations.find(a =>
                          (h.hotelId && a.id === h.hotelId) ||
                          (h.hotelName && a.name === h.hotelName)
                        );
                        return (
                          <div key={hi} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm mb-4 last:mb-0">
                            <h4 className="text-base font-bold text-gray-900 mb-1">{h.hotelName || master?.name || h.hotel_name || "Hotel Selection"}</h4>
                            <div className="flex gap-0.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-[10px] ${i < Number(master?.stars || h.stars || 0) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                              ))}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[12px] text-gray-900"><span className="font-bold">Room</span> : Standard Room</p>
                              <p className="text-[12px] text-gray-900"><span className="font-bold">Meals</span> : {h.meals || master?.meals || 'MAP (Breakfast & Dinner)'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "Sightseeing" && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 bg-[#16a34a] rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">Sightseeing & Activities</h3>
                </div>

                {(() => {
                  const activities = pkg.itinerary?.flatMap(day => {
                    const details = typeof day.details_json === 'string' ? JSON.parse(day.details_json || '{}') : day.details_json;
                    return (details?.sightseeing || []).filter(s => s && s.trim()).map(s => ({ text: s, dayNum: day.day_number }));
                  }) || [];

                  if (activities.length > 0) {
                    return (
                      <div className="space-y-3">
                        {activities.map((act, i) => (
                          <div key={i} className="flex gap-3 p-3 bg-gray-50/50 rounded-xl items-start border border-gray-100 hover:border-green-100 transition-colors">
                            <div className="bg-green-100 text-[#16a34a] text-[9px] font-black px-2 py-0.5 rounded-lg shrink-0">DAY {act.dayNum}</div>
                            <p className="text-gray-700 text-xs font-medium leading-relaxed">{act.text}</p>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-10">
                        <p className="text-gray-500 mb-2 font-medium">Standard sightseeing as per the itinerary is included.</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Detailed activity list available on enquiry</p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {activeTab === "Hotels" && (
              <div className="space-y-4">
                {(() => {
                  const allAcc = pkg.itinerary?.flatMap(day => {
                    const details = typeof day.details_json === 'string' ? JSON.parse(day.details_json || '{}') : day.details_json;
                    return (details?.accommodations || []).map(h => {
                      const master = accommodations.find(a =>
                        (h.hotelId && a.id === h.hotelId) ||
                        (h.hotelName && a.name === h.hotelName)
                      );
                      return {
                        ...h,
                        hotelName: h.hotelName || master?.name || "Hotel Selection",
                        city: master?.city || h.city || "",
                        stars: master?.stars || h.stars || 3,
                        image: master?.image || h.image || "",
                        dayNum: day.day_number,
                        country: pkg.destinations?.find(d => d.name === (master?.city || h.city))?.country || master?.destination_name || "Domestic"
                      };
                    });
                  }) || [];

                  // Group by hotel name to deduplicate and count nights
                  const hotelGroups = allAcc.reduce((acc, curr) => {
                    const key = curr.hotelName;
                    if (!acc[key]) {
                      acc[key] = {
                        ...curr,
                        nights: 1,
                        days: [curr.dayNum],
                      };
                    } else {
                      acc[key].nights += 1;
                      acc[key].days.push(curr.dayNum);
                    }
                    return acc;
                  }, {});

                  const hotels = Object.values(hotelGroups);

                  if (hotels.length > 0) {
                    return (
                      <div className="space-y-4">
                        {hotels.map((hotel, i) => (
                          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-3.5 flex flex-col md:flex-row gap-5 transition-all hover:shadow-md">
                            {/* Hotel Image - Minimized */}
                            <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 group relative">
                              {hotel.image ? (
                                <img src={getImageUrl(hotel.image)} alt={hotel.hotelName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/50">
                                  <div className="p-3 bg-[#16a34a]/10 rounded-full mb-1 shadow-sm">
                                    <Hotel size={20} className="text-[#16a34a]" strokeWidth={2} />
                                  </div>
                                  <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Image TBA</span>
                                </div>
                              )}
                            </div>

                            {/* Hotel Info - Compact */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-[#16a34a]/10 text-[#16a34a] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#16a34a]/10">
                                      STAY START / CHECK-IN
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-bold italic">
                                      {hotel.nights} {hotel.nights > 1 ? 'Nights' : 'Night'} stay
                                    </span>
                                  </div>
                                  <div className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                                    {hotel.nights} {hotel.nights > 1 ? 'NIGHTS' : 'NIGHT'}
                                  </div>
                                </div>

                                <h3 className="text-[13px] font-black text-gray-900 mb-0.5 leading-tight">
                                  {hotel.city ? `${hotel.city} - ` : ''}{hotel.hotelName}
                                </h3>

                                <div className="flex gap-0.5 mb-2">
                                  {[...Array(5)].map((_, si) => (
                                    <span key={si} className={`text-[10px] ${si < Number(hotel.stars || 3) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-10 pt-2 border-t border-gray-50">
                                <div>
                                  <p className="text-gray-400 text-[7px] font-black uppercase tracking-widest mb-0.5">Room Type</p>
                                  <p className="text-gray-900 font-bold text-[10px] uppercase">Standard Room</p>
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-400 text-[7px] font-black uppercase tracking-widest mb-0.5">Meal Plan</p>
                                  <p className="text-gray-900 font-bold text-[10px] uppercase truncate">{hotel.meals || 'MAP (Breakfast & Dinner)'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Hotel className="text-gray-300" size={40} />
                        </div>
                        <h4 className="text-gray-900 font-black mb-1 uppercase tracking-wider">Accommodation Details TBA</h4>
                        <p className="text-xs text-gray-400 font-medium">Specific hotels are assigned upon final booking confirmation.</p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {activeTab === "Inclusions & Exclusions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50/30 p-5 rounded-2xl border border-green-100">
                  <h3 className="text-sm font-black mb-4 text-[#14532d] flex items-center gap-2 tracking-wider">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    INCLUSIONS
                  </h3>
                  <ul className="space-y-2">
                    {(pkg.inclusions_raw && Array.isArray(pkg.inclusions_raw) && pkg.inclusions_raw.length > 0) ? (
                      pkg.inclusions_raw.map((inc, i) => (
                        <li key={i} className="text-gray-700 flex items-start gap-2 text-xs font-medium">
                          <span className="text-green-500 font-black">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))
                    ) : pkg.inclusions?.map((inc, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2 text-xs font-medium">
                        <span className="text-green-500 font-black">✓</span>
                        <span>{inc.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/30 p-5 rounded-2xl border border-red-100">
                  <h3 className="text-sm font-black mb-4 text-red-800 flex items-center gap-2 tracking-wider">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    EXCLUSIONS
                  </h3>
                  <ul className="space-y-2">
                    {(pkg.exclusions_raw && Array.isArray(pkg.exclusions_raw) && pkg.exclusions_raw.length > 0) ? (
                      pkg.exclusions_raw.map((exc, i) => (
                        <li key={i} className="text-gray-700 flex items-start gap-2 text-xs font-medium">
                          <span className="text-red-500 font-black">×</span>
                          <span>{exc}</span>
                        </li>
                      ))
                    ) : pkg.exclusions?.map((exc, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2 text-xs font-medium">
                        <span className="text-red-500 font-black">×</span>
                        <span>{exc.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "Terms & Policy" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Terms & Policy</h3>
                <div className="text-gray-600 text-[11px] leading-relaxed space-y-3">
                  {(pkg.terms_and_policies_raw && Array.isArray(pkg.terms_and_policies_raw) && pkg.terms_and_policies_raw.length > 0) ? (
                    pkg.terms_and_policies_raw.map((policy, i) => (
                      <p key={i}>• {policy}</p>
                    ))
                  ) : (pkg.cancellation_policies_raw && Array.isArray(pkg.cancellation_policies_raw) && pkg.cancellation_policies_raw.length > 0) ? (
                    pkg.cancellation_policies_raw.map((policy, i) => (
                      <p key={i}>• {policy}</p>
                    ))
                  ) : (pkg.cancellation_policies && Array.isArray(pkg.cancellation_policies) && pkg.cancellation_policies.length > 0) ? (
                    pkg.cancellation_policies.map((policy, i) => (
                      <p key={i}>• {policy.text}</p>
                    ))
                  ) : (
                    <>
                      <p>• The itinerary is subject to change based on weather conditions, flight schedules, and other logistics.</p>
                      <p>• Prices are starting from and may vary during peak seasons or due to availability.</p>
                      <p>• 5% GST and TCS as per government regulations will be applicable.</p>
                      <p>• Passport should be valid for at least 6 months from the date of travel.</p>
                    </>
                  )}
                  <p className="pt-3 text-[10px] italic text-gray-400 font-bold uppercase tracking-tight">Please refer to our main Terms & Policy page for full details.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PRICE CARD - Compact */}
        <div className="w-[35%] sticky top-10 bg-white shadow-md rounded-xl p-4 h-fit border border-gray-100">

          {/* Price Row */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider leading-tight">Starts at<br />per person</p>
            <div className="text-right relative holiday-details-price-info">
              {pkg.price && (
                <p className="line-through text-gray-400 text-xs">₹ {Number(pkg.price || 0).toLocaleString('en-IN')}</p>
              )}
              <div className="flex items-center justify-end gap-1">
                <p className="text-xl font-black text-gray-900">₹ {Number(pkg.Offer_price || 0).toLocaleString('en-IN')}</p>
                <button
                  onClick={() => setPricePopupOpen(!pricePopupOpen)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  <svg className="w-3.5 h-3.5 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>

              {pricePopupOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] p-3 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <p className="text-[10px] font-bold text-gray-900 mb-1">Conditions Applied</p>
                  <div className="h-0.5 w-6 bg-[#14532d] rounded-full mb-1.5"></div>
                  <p className="text-[9px] text-gray-500 leading-relaxed">
                    Prices are starting from and can change based on peak season and availability.
                  </p>
                  <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"></div>
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2.5 mb-3">
            <svg className="w-3.5 h-3.5 text-[#14532d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-[11px] font-semibold">{pkg.days} Days / {pkg.nights} Nights</p>
          </div>

          {/* Enquire Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#14532d] text-white py-2 rounded-lg text-[11px] font-black hover:bg-[#0f4022] transition-colors uppercase tracking-widest"
          >
            Enquire Now
          </button>

          {/* Download Button */}
          <button
            onClick={() => downloadPackagePDF(pkg)}
            className="w-full bg-white text-[#14532d] border border-[#14532d] py-2 rounded-lg mt-2 text-[11px] font-black hover:bg-green-50 transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Brochure
          </button>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageType={pkg?.title}
      />
    </div >
  );
};

export default HolidayDetails;
