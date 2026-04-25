import React, { useState } from "react";
import { Share2, Mail, Eye, MessageCircle, FileDown, ArrowRight, Hotel, Utensils, Zap } from "lucide-react";
import { getImageUrl } from "../utils/imageUtils";

const HolidayCard = React.memo(({ pkg, navigate, generateShareText, setEmailModalPkg, downloadPackagePDF, setViewDetailsPkg }) => {
  const [activeTab, setActiveTab] = useState("Hotels");
  const [selectedTier, setSelectedTier] = useState("Standard");
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(0);

  const uniqueHotels = React.useMemo(() => {
    const hotels = [];
    (pkg.itinerary || []).forEach(day => {
      try {
        const details = typeof day.details_json === 'string' ? JSON.parse(day.details_json || '{}') : day.details_json;
        (details?.accommodations || []).forEach(acc => {
          const name = acc.hotelName || acc.hotel_name;
          if (name && !hotels.includes(name)) hotels.push(name);
        });
      } catch (e) { }
    });
    return hotels;
  }, [pkg.itinerary]);

  const sightseeings = React.useMemo(() => {
    const s = [];
    (pkg.itinerary || []).forEach(day => {
      try {
        const details = typeof day.details_json === 'string' ? JSON.parse(day.details_json || '{}') : day.details_json;
        (details?.sightseeing || []).forEach(item => {
          if (item && !s.includes(item)) s.push(item);
        });
      } catch (e) { }
    });
    return s;
  }, [pkg.itinerary]);

  const slots = React.useMemo(() => {
    try {
      const raw = pkg.fixed_departure_data ? (typeof pkg.fixed_departure_data === 'string' ? JSON.parse(pkg.fixed_departure_data) : pkg.fixed_departure_data) : [];
      return raw.map(s => ({
        ...s,
        travel_date: s.travel_date || s.date || s.travelDate || ""
      }));
    } catch (e) { return []; }
  }, [pkg.fixed_departure_data]);

  const currentPrice = React.useMemo(() => {
    if (slots.length > 0) {
      const slot = slots[selectedSlotIdx] || slots[0];
      const tierKey = Object.keys(slot.tiers || {}).find(k => k.toLowerCase() === (selectedTier || "standard").toLowerCase());
      const tierData = slot.tiers?.[tierKey];
      if (tierData && tierData.length > 0) {
        const data = tierData[0];
        return data.offer_price || data.Offer_price || data.price;
      }
    }
    return pkg.Offer_price || pkg.offer_price;
  }, [slots, selectedTier, selectedSlotIdx, pkg.Offer_price, pkg.offer_price]);

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4 flex flex-col font-sans max-w-[1000px] mx-auto overflow-hidden">
      {/* HEADER BAR */}
      <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-800">
          <span className="font-extrabold text-black">({pkg.nights || pkg.days - 1}N/{pkg.days}D)</span> - {pkg.fixed_departure ? 'Fix Departure: ' : ''}{pkg.title}
        </h3>

        {/* SHARE PILL BAR */}
        <div className="bg-[#4d4d4d] text-white rounded-full py-1 px-3 flex items-center gap-3 shadow-md scale-95 origin-right">
          <div className="flex items-center gap-1.5 pr-3 border-r border-gray-500">
            <Share2 size={12} className="text-gray-300" />
            <span className="text-[9px] font-black tracking-widest uppercase">Share :</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/?text=${encodeURIComponent(generateShareText(pkg))}`, '_blank'); }}
            className="flex items-center gap-1 hover:text-green-400 transition-colors"
          >
            <MessageCircle size={12} />
            <span className="text-[9px] font-bold">WhatsApp</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setEmailModalPkg(pkg); }}
            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            <Mail size={12} />
            <span className="text-[9px] font-bold">Email</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); downloadPackagePDF(pkg); }}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
          >
            <FileDown size={12} />
            <span className="text-[9px] font-bold">PDF</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setViewDetailsPkg(pkg, selectedTier); }}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity ml-1"
          >
            <Eye size={12} className="text-yellow-500" />
            <span className="text-[9px] font-bold text-yellow-500">View</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[180px] p-3 flex flex-col items-center shrink-0">
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shadow-sm border border-gray-100">
            {pkg.fixed_departure && (
              <div 
                onClick={() => setActiveTab("Dates")}
                className="absolute top-0 left-0 z-20 flex flex-col items-start translate-x-[-2px] translate-y-[-2px] cursor-pointer group"
              >
                <div className="bg-[#1a1a1a] text-white px-3 py-1 text-[11px] font-bold shadow-md rounded-tl-xl group-hover:bg-[#333] transition-colors">
                  Fix Departure
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1a1a1a] ml-2 group-hover:border-t-[#333] transition-colors"></div>
              </div>
            )}
            <img 
              src={getImageUrl(pkg.card_image)} 
              className="absolute inset-0 w-full h-full object-cover" 
              alt={pkg.title}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <button
            onClick={() => navigate(`/holiday/${pkg.id}`, { state: { selectedTier } })}
            className="w-full mt-2 border border-[#16a34a] text-[#16a34a] py-1 text-[11px] font-medium hover:bg-green-50 transition-colors"
          >
            View Detailed Itinerary
          </button>
        </div>

        <div className="flex-1 p-0 flex flex-col border-r border-gray-200">
          <div className="flex border-b border-gray-200">
            {["Hotels", "Sightseeings", "Inclusion", "Exclusion", "Dates"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[12px] font-medium transition-all relative ${activeTab === tab
                  ? "bg-[#333] text-white"
                  : "text-gray-700 hover:text-[#16a34a]"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#333]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-3 flex-1">
            {activeTab === "Hotels" && (
              <div className="border border-gray-200 rounded-sm">
                <div className="bg-[#f2f2f2] px-3 py-1 text-[11px] font-bold text-gray-700 border-b border-gray-200 uppercase tracking-tight">
                  Hotels Included
                </div>
                <div className="p-3 space-y-2">
                  {uniqueHotels.length > 0 ? uniqueHotels.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></div>
                      <span className="text-[12px] font-black text-[#3498db] tracking-tight">{h}</span>
                    </div>
                  )) : (
                    <div className="p-2 text-center text-gray-400 italic text-[11px]">No hotel details specified.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Sightseeings" && (
              <div className="flex flex-wrap gap-1.5">
                {sightseeings.length > 0 ? sightseeings.map((s, i) => (
                  <span key={i} className="bg-gray-50 border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 rounded">{s}</span>
                )) : <div className="p-4 text-center text-gray-400 italic w-full">Standard sightseeing.</div>}
              </div>
            )}

            {activeTab === "Inclusion" && (
              <ul className="grid grid-cols-2 gap-1 text-[11px] text-gray-700">
                {(pkg.inclusions?.length ? pkg.inclusions : [{ text: "Accommodation" }, { text: "Daily Breakfast" }]).map((inc, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-green-600 font-bold">✓</span>
                    {inc.text}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "Exclusion" && (
              <ul className="grid grid-cols-2 gap-1 text-[11px] text-gray-500">
                {(pkg.exclusions?.length ? pkg.exclusions : [{ text: "Optional Tours" }, { text: "Personal Expenses" }]).map((exc, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-red-500 font-bold">×</span>
                    {exc.text}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "Dates" && (
              <div className="grid grid-cols-3 gap-1.5">
                {slots.length > 0 ? slots.map((s, i) => {
                  const tierKey = Object.keys(s.tiers || {}).find(k => k.toLowerCase() === (selectedTier || "standard").toLowerCase());
                  const tierRows = s.tiers?.[tierKey] || [];
                  const priceData = tierRows[0];
                  const price = priceData ? (priceData.offer_price || priceData.Offer_price || priceData.price) : null;
                  const isSelected = selectedSlotIdx === i;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedSlotIdx(i)}
                      className={`border px-1.5 py-1 text-center flex flex-col items-center justify-center rounded-sm cursor-pointer transition-all ${
                        isSelected ? "border-[#16a34a] bg-green-50" : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${isSelected ? "text-[#16a34a]" : "text-gray-400"}`}>
                        {s.travel_date 
                          ? new Date(s.travel_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' }).toUpperCase()
                          : "DATE TBA"}
                      </span>
                      {price && (
                        <span className={`text-[11px] font-black mt-1 ${isSelected ? "text-[#15803d]" : "text-[#16a34a]"}`}>
                          ₹{Math.round(price/1000)}K
                        </span>
                      )}
                    </div>
                  );
                }) : <div className="p-4 text-center text-gray-400 italic w-full">Contact for availability.</div>}
              </div>
            )}
          </div>

          <div className="px-3 pb-3 flex items-center gap-3">
            <span className="text-[12px] font-bold text-gray-800">Inclusion :</span>
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500"><Hotel size={14} /></div>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500"><Utensils size={14} /></div>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500"><ArrowRight size={14} /></div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[200px] bg-[#fdfdfd] p-4 flex flex-col items-center justify-center">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full bg-white border border-gray-200 p-1.5 text-[13px] outline-none mb-4 rounded-sm"
          >
            {pkg.package_categories?.length > 0 ? pkg.package_categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            )) : <option value="Standard">Standard</option>}
          </select>

          <div className="text-center mb-4">
            <p className="text-[12px] text-gray-400 font-medium">Starting From</p>
            <h4 className="text-[22px] font-black text-[#16a34a] leading-none my-1 tracking-tight">INR {Number(currentPrice || 0).toLocaleString('en-IN')}</h4>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Per Person</p>
          </div>

          <button
            onClick={() => navigate(`/holiday/${pkg.id}`, { state: { selectedTier } })}
            className="w-full bg-white border border-[#16a34a] text-[#16a34a] py-2 text-[13px] font-bold hover:bg-green-50 transition-colors rounded-sm"
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
});

HolidayCard.displayName = "HolidayCard";
export default HolidayCard;
