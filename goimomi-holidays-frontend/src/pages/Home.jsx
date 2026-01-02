import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import EnquiryForm from "../components/EnquiryForm";

// WhatsApp Chat Widget Component
const WhatsAppWidget = ({ isOpen, onClose }) => {
  const widgetRef = useRef(null);
  const phoneNumber = '916382220393';
  const defaultMessage = 'Hello! I have a question about your services.';

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        // Check if the click is not on the WhatsApp button
        const whatsappButton = document.querySelector('.whatsapp-button');
        if (whatsappButton && !whatsappButton.contains(event.target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-24 right-8 w-80 bg-white rounded-t-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
    >
      {/* Header */}
      <div className="bg-green-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.92-3.558 7.94-7.93A7.898 7.898 0 0 0 13.6 2.326z" />
          </svg>
          <span className="font-semibold">WhatsApp Chat</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>

      {/* Chat Content */}
      <div className="p-4 bg-gray-50 h-64 overflow-y-auto">
        <div className="mb-4">
          <div className="bg-green-100 rounded-lg p-3 inline-block max-w-xs">
            <p className="text-sm">Hello! How can we help you today?</p>
            <p className="text-xs text-gray-500 mt-1">Goimomi Holidays Support</p>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 my-2">--- Start of conversation ---</p>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Type a message..."
            value={defaultMessage}
            readOnly
          />
          <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r-lg"
            aria-label="Send message on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l5-14zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Click the send button to open WhatsApp</p>
      </div>
    </div>
  );
};

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import hero1 from "../assets/Hero/sunset.png";
import hero2 from "../assets/Hero/bluesea.png";
import hero3 from "../assets/Hero/old.png";
import hero4 from "../assets/Hero/stone.png";
import hero5 from "../assets/mountain.png";
import hero6 from "../assets/turkey.png";

// POPULAR DESTINATIONS
import maldives from "../assets/PopularDestinations/maldives.png";
import dubai from "../assets/PopularDestinations/dubaiSafari.png";
import singapore from "../assets/PopularDestinations/singapore.png";
import paris from "../assets/PopularDestinations/paris.png";
import santorini from "../assets/PopularDestinations/santorini.png";
import bali from "../assets/PopularDestinations/bali.png";

// SPECIAL OFFERS
import dubaiOffer from "../assets/Specialoffers/dubai.png";
import keralaOffer from "../assets/Specialoffers/keralaBackwaters.png";
import europeOffer from "../assets/Specialoffers/venice.png";
import thailandOffer from "../assets/Specialoffers/thailand.png";
import switzerlandOffer from "../assets/Specialoffers/switzerland.png";
import maldivesOffer from "../assets/Specialoffers/maldivesOffer.png";

// GALLERY
import gallery1 from "../assets/TravelGallery/airport.png";
import gallery2 from "../assets/TravelGallery/usa.png";
import gallery3 from "../assets/TravelGallery/turkey.png";
import gallery4 from "../assets/TravelGallery/card4.png";
import gallery5 from "../assets/TravelGallery/Cities.png";
import gallery6 from "../assets/TravelGallery/desert.png";
import gallery7 from "../assets/TravelGallery/Abroad.png";
import gallery8 from "../assets/TravelGallery/umrah.png";


// TESTIMONIALS
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const heroContent = [
    { title: "Discover Ancient Streets", subtitle: "Historic tours and cultural experiences to bring the past alive." },
    { title: "Explore Blue Seas", subtitle: "Relax on pristine beaches with crystal-clear waters." },
    { title: "Walk Through Timeless Cities", subtitle: "Experience heritage-rich culture and stunning architecture." },
    { title: "Journey Into Nature", subtitle: "Feel the beauty of untouched landscapes around the world." },
    { title: "Scale Majestic Peaks", subtitle: "Adventure awaits in the heart of the world's most stunning mountains." },
    { title: "Discover Turkey's Wonders", subtitle: "Where East meets West in a fusion of history and beauty." }
  ];

  useEffect(() => {
    if (!isFormOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isFormOpen]);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      <EnquiryForm isOpen={isFormOpen} onClose={handleCloseForm} />
      {/* ---------------- HERO SLIDER ---------------- */}
      <section className="relative w-full h-[520px]">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {[hero1, hero2, hero3, hero4, hero5, hero6].map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-[520px] bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/40 backdrop-blur-md px-10 py-8 rounded-xl shadow-lg text-center fade-up">
                    <h1 className="text-5xl font-bold text-[#14532d]">
                      {heroContent[index].title}
                    </h1>
                    <p className="mt-3 text-lg text-gray-800">
                      {heroContent[index].subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ---------------- POPULAR DESTINATIONS ---------------- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#14532d] fade-up">
          Popular Destinations
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Discover amazing places around the world
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { img: maldives, title: "Maldives Luxury Escape", price: "₹29,500" },
            { img: dubai, title: "Dubai Desert & City Adventure", price: "₹35,000" },
            { img: singapore, title: "Singapore City & Island Getaway", price: "₹30,000" },
            { img: paris, title: "Paris Romantic Getaway", price: "₹45,000" },
            { img: santorini, title: "Santorini Greek Island Paradise", price: "₹42,000" },
            { img: bali, title: "Bali Tropical Adventure", price: "₹28,000" }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border fade-up zoom-hover"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <img src={item.img} className="h-52 w-full object-cover" />
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">Experience unparalleled beauty...</p>
                <p className="font-semibold text-lg text-[#14532d]">{item.price}</p>
                <button className="bg-[#14532d] text-white px-4 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SPECIAL OFFERS ---------------- */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-[#14532d] fade-up">
          Special Offers
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Limited time deals you don't want to miss
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-7xl mx-auto">
          {[
            { img: dubaiOffer, discount: "15% OFF", title: "Dubai Dream Getaway" },
            { img: keralaOffer, discount: "10% OFF", title: "Kerala Backwaters Bliss" },
            { img: europeOffer, discount: "20% OFF", title: "Europe Grand Tour Early Bird" },
            { img: thailandOffer, discount: "25% OFF", title: "Thailand Island Paradise" },
            { img: switzerlandOffer, discount: "18% OFF", title: "Swiss Alps Winter Wonderland" },
            { img: maldivesOffer, discount: "30% OFF", title: "Maldives Luxury Villa Escape" }
          ].map((offer, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border fade-up zoom-hover"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="relative">
                <img src={offer.img} className="h-52 w-full object-cover" />
                <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {offer.discount}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold">{offer.title}</h3>
                <p className="text-gray-600 text-sm">Exclusive holiday offer curated for you...</p>
                <button className="bg-[#14532d] text-white w-full py-2 rounded-lg font-semibold">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-[#14532d] fade-up">
          Travel Gallery
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Moments captured from our travelers
        </p>

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto mt-10">
          {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8].map((img, i) => (
            <img
              key={i}
              src={img}
              className="rounded-2xl shadow-xl h-64 w-full object-cover fade-up zoom-hover"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </section>
      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center text-[#14532d] fade-up">
          What Our Travelers Say
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Real experiences from our valued customers
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-14">

          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border fade-up zoom-hover" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <img src={user1} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">Priya Sharma</h3>
                <p className="text-yellow-500 text-sm">★★★★★</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              "Goimomi made our Maldives honeymoon unforgettable. Perfect service!"
            </p>
            <p className="mt-4 text-xs text-gray-500">Service: Maldives Package</p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border fade-up zoom-hover" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-4">
              <img src={user2} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">Rajesh Kumar</h3>
                <p className="text-yellow-500 text-sm">★★★★★</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              "Our Kerala trip was seamless and memorable thanks to Goimomi Holidays!"
            </p>
            <p className="mt-4 text-xs text-gray-500">Service: Kerala Domestic Tour</p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border fade-up zoom-hover" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-3 mb-4">
              <img src={user3} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">Anjali Singh</h3>
                <p className="text-yellow-500 text-sm">★★★★☆</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              "Visa assistance was smooth and stress-free. Highly recommended!"
            </p>
            <p className="mt-4 text-xs text-gray-500">Service: Europe Visa</p>
          </div>

        </div>
      </section>

      {/* ---------------- WHY CHOOSE US SECTION ---------------- */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Why Goimomi Holidays */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-[#14532d] mb-4">Why Goimomi Holidays?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Established in 2010, Goimomi Holidays has since positioned itself as one of the leading companies,
              providing great offers, competitive airfares, exclusive discounts, and a seamless online booking
              experience to many of its customers. The experience of booking your flight tickets, hotel stay, and
              holiday package with complete ease and no hassles at all. We also deliver amazing offers, such as
              Instant Discounts, Fare Calendar, MyRewardsProgram, MyWallet, and many more while booking your
              flight tickets online to make the experience better and better for our customers.
            </p>
          </div>

          {/* Booking Flights with Goimomi Holidays */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-[#14532d] mb-4">Booking Flights with Goimomi Holidays</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              At Goimomi Holidays, you can find the best of deals and cheap air tickets to any place you want by
              booking in just a few simple clicks. Just use our deals and you will surely find great discounts
              on your flight tickets. Goimomi Holidays helps you book flight tickets that are affordable and customized
              to your convenience. With customer satisfaction being our ultimate goal, we also have a 24/7
              dedicated helpline to cater to our customer's queries and concerns. Serving over 5 million happy
              customers and counting, we also have a 24/7 dedicated helpline who need a quick and easy means
              to find air tickets. You can get a hold of the cheapest flight of your choice today while also
              enjoying the other available options for your travel needs with us.
            </p>
          </div>

          {/* Domestic Flights with Goimomi Holidays */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-[#14532d] mb-4">Domestic Flights with Goimomi Holidays</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Goimomi Holidays is India's leading player for flight bookings. With the cheapest fare guarantee,
              experience great value at the lowest price. Instant notifications ensure current flight status,
              instant fare drops, amazing discounts, instant refunds and rebook options, price comparisons and
              many more interesting features.
            </p>
          </div>

        </div>
      </section>

      {/* WhatsApp Widget */}
      <WhatsAppWidget
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
        className="whatsapp-button fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        aria-label="Open WhatsApp chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.92-3.558 7.94-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.608-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.944-.044-.079-.163-.124-.344-.223z" />
        </svg>
      </button>
    </div>
  );
};

export default Home;