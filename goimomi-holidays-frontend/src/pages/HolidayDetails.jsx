import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FormModal from "../components/FormModal";

const HolidayDetails = () => {
  const { id } = useParams();
  const [openDay, setOpenDay] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url.replace("http://localhost:8000", "").replace("http://127.0.0.1:8000", "");
    }
    return url;
  };

  const toggleDay = (index) => {
    setOpenDay(openDay === index ? null : index);
  };

  useEffect(() => {
    axios.get(`/api/packages/${id}/`)
      .then((res) => setPkg(res.data))
      .catch((err) => console.error("Error fetching package details:", err));
  }, [id]);

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

                  {item.image && (
                    <img
                      src={getImageUrl(item.image)}
                      className="w-full h-52 object-cover rounded-xl mb-4"
                    />
                  )}

                  <p className="text-gray-700">{item.description}</p>
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

        {/* RIGHT PRICE CARD */}
        <div className="w-[35%] sticky top-10 bg-white shadow-xl rounded-2xl p-6 h-fit">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm leading-tight">Starts at per</p>
              <p className="text-gray-500 text-sm leading-tight">person</p>
            </div>
            <div className="text-right">
              {pkg.price && (
                <p className="line-through text-gray-400 text-sm">
                  ₹ {pkg.price.toLocaleString()}
                </p>
              )}
              <p className="text-3xl font-bold text-black">₹ {(pkg.Offer_price || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-gray-600 font-medium">{pkg.nights}Nights / {pkg.days}Days</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#14532d] text-white py-3 rounded-xl mt-6 text-lg hover:bg-[#0f4022] transition-colors uppercase font-bold tracking-wider"
          >
            Enquire Now
          </button>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageType={pkg?.title}
      />
    </div>
  );
};

export default HolidayDetails;
