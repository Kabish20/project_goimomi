import React, { useState, useEffect } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricePopupOpen, setPricePopupOpen] = useState(false);


  const toggleDay = (index) => {
    setOpenDay(openDay === index ? null : index);
  };

  useEffect(() => {
    api.get(`/api/packages/${id}/`)
      .then((res) => setPkg(res.data))
      .catch((err) => console.error("Error fetching package details:", err));

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
          <h1 className="text-4xl font-bold mb-6">{pkg.title}</h1>


          {pkg.description && (
            <ul className="text-gray-700 text-base mb-6 space-y-2 list-disc list-inside">
              {pkg.description.split('\n').filter(line => line.trim()).map((point, index) => (
                <li key={index} className="leading-relaxed">{point.trim()}</li>
              ))}
            </ul>
          )}

          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-black">Highlights</h2>
              <ul className="text-gray-700 text-base space-y-2">
                {pkg.highlights.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-bold text-gray-900">•</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>

          {/* =================== DROPDOWN ITINERARY =================== */}
          {pkg.itinerary?.map((item, index) => (
            <div key={index} className="mb-4">

              {/* DAY HEADER BUTTON */}
              <button
                onClick={() => toggleDay(index)}
                className="w-full flex justify-between items-center bg-gray-100 px-6 py-4 rounded-xl shadow-md text-left hover:bg-gray-200 transition"
              >
                <span className="text-lg font-semibold">{`Day ${item.day_number} - ${item.title}`}</span>
                <span className="text-xl">{openDay === index ? "▲" : "▼"}</span>
              </button>

              {/* CONTENT */}
              {openDay === index && (
                <div className="bg-white p-5 shadow-md rounded-xl border mt-2">
                  <div className="flex gap-5 items-start">

                    {/* Description - Left Side */}
                    <div className={item.image ? "flex-1" : "w-full"}>
                      {item.description ? (
                        <p className="text-gray-700 leading-relaxed">{item.description}</p>
                      ) : (
                        <p className="text-gray-400 italic text-sm">No description available for this day.</p>
                      )}
                    </div>

                    {/* Image Card - Right Side */}
                    {item.image && (
                      <div className="w-[40%] shrink-0">
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          ))}

          {/* INCLUSIONS & EXCLUSIONS */}
          <div className="mt-10 flex gap-10">
            <div>
              <h3 className="text-xl font-bold mb-3">Inclusions</h3>
              {pkg.inclusions?.map((inc, i) => (
                <p key={i} className="text-gray-700 mb-1">• {inc.text}</p>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Exclusions</h3>
              {pkg.exclusions?.map((exc, i) => (
                <p key={i} className="text-gray-700 mb-1">• {exc.text}</p>
              ))}
            </div>
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
