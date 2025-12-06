import React from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// HERO IMAGES
import hero1 from "../assets/sunset.png";
import hero2 from "../assets/bluesea.png";
import hero3 from "../assets/old.png";
import hero4 from "../assets/stone.png";

// POPULAR DESTINATIONS
import maldives from "../assets/maldives.png";
import dubai from "../assets/dubaiSafari.png";
import singapore from "../assets/singapore.png";

// SPECIAL OFFERS
import dubaiOffer from "../assets/dubai.png";
import keralaOffer from "../assets/keralaBackwaters.png";
import europeOffer from "../assets/venice.png";

// GALLERY
import gallery1 from "../assets/airport.png";
import gallery2 from "../assets/usa.png";
import gallery3 from "../assets/turkey.png";
import gallery4 from "../assets/card4.png";

// TESTIMONIALS
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";

const Home = () => {
  const heroContent = [
    { title: "Discover Ancient Streets", subtitle: "Historic tours and cultural experiences to bring the past alive." },
    { title: "Explore Blue Seas", subtitle: "Relax on pristine beaches with crystal-clear waters." },
    { title: "Walk Through Timeless Cities", subtitle: "Experience heritage-rich culture and stunning architecture." },
    { title: "Journey Into Nature", subtitle: "Feel the beauty of untouched landscapes around the world." }
  ];

  return (
    <div className="w-full overflow-hidden bg-white">

      {/* ---------------- HERO SLIDER ---------------- */}
      <section className="relative w-full h-[520px]">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {[hero1, hero2, hero3, hero4].map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-[520px] bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/40 backdrop-blur-md px-10 py-8 rounded-xl shadow-lg text-center fade-up">
                    <h1 className="text-5xl font-bold text-[#0b1a3d]">
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
        <h2 className="text-4xl font-bold text-center text-[#0b1a3d] fade-up">
          Popular Destinations
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Discover amazing places around the world
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[ 
            { img: maldives, title: "Maldives Luxury Escape", price: "₹29,500" },
            { img: dubai, title: "Dubai Desert & City Adventure", price: "₹35,000" },
            { img: singapore, title: "Singapore City & Island Getaway", price: "₹30,000" }
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
                <p className="font-semibold text-lg text-[#0b1a3d]">{item.price}</p>
                <button className="bg-[#0b1a3d] text-white px-4 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SPECIAL OFFERS ---------------- */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-[#0b1a3d] fade-up">
          Special Offers
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Limited time deals you don't want to miss
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-7xl mx-auto">
          {[ 
            { img: dubaiOffer, discount: "15% OFF", title: "Dubai Dream Getaway" },
            { img: keralaOffer, discount: "10% OFF", title: "Kerala Backwaters Bliss" },
            { img: europeOffer, discount: "20% OFF", title: "Europe Grand Tour Early Bird" }
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
                <button className="bg-[#e9b343] text-white w-full py-2 rounded-lg font-semibold">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-[#0b1a3d] fade-up">
          Travel Gallery
        </h2>
        <p className="text-center text-gray-600 mt-2 fade-up">
          Moments captured from our travelers
        </p>

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto mt-10">
          {[gallery1, gallery2, gallery3, gallery4].map((img, i) => (
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
  <h2 className="text-4xl font-bold text-center text-[#0b1a3d] fade-up">
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


    </div>
  );
};

export default Home;       