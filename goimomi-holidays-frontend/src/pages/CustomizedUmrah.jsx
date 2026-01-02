import React, { useState } from "react";
import {
  FaCheckCircle,
  FaPhoneAlt,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import { FaRegHeart, FaPlane, FaHotel, FaShieldHalved } from "react-icons/fa6";
import FormModal from "../components/FormModal.jsx";
import umrahImage from "../assets/umrah.png";
import umrah2Image from "../assets/umrah2.png";
import umrah3Image from "../assets/umrah3.png";

const CustomizedUmrah = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  return (
    <div className="w-full overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section
        className="w-full h-[90vh] bg-cover bg-center relative flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: `url(${umrahImage})`,
        }}
      >
        <div className="absolute inset-0 bg-green-900/70"></div>

        <div className="relative text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Customized Umrah Packages
          </h1>
          <p className="text-lg md:text-xl leading-relaxed">
            Embark on the spiritual journey of a lifetime with our comprehensive Umrah packages.
            Experience the blessed pilgrimage with comfort, guidance, and peace of mind.
          </p>

          <div className="mt-8 flex gap-6 justify-center">
            <button 
              onClick={() => {
                setSelectedPackage("Standard Umrah Package");
                setIsFormOpen(true);
              }}
              className="bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition">
              Customize My Umrah
            </button>
          </div>
        </div>
      </section>




      {/* ================= HIGHLIGHTS SECTION ================= */}
      <section className="py-20 bg-green-50 px-6">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-4">
          Umrah Package Highlights
        </h2>
        <p className="text-center text-gray-700 mb-14 text-lg">
          Comprehensive Umrah packages designed for your spiritual journey
        </p>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

          {/* Features */}
          <div className="border border-yellow-400 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <FaRegHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-green-900">
                Umrah Package Features
              </h3>
            </div>

            <ul className="space-y-4 text-lg text-gray-700">
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Flexible Umrah packages (7, 14, 21 days)</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Premium accommodation near Haram Sharif</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Direct flights or convenient connections</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Personal religious guide for rituals</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Private transportation for comfort</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Fast-track visa processing</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Daily meals</li>
              <li><FaCheckCircle className="inline text-yellow-500 mr-2" /> Ziyarat included</li>
            </ul>
          </div>

          {/* Additional Services */}
          <div className="border border-green-300 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-green-900">
                Additional Services
              </h3>
            </div>

            <ul className="space-y-4 text-lg text-gray-700">
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> 24/7 customer support</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Group & individual packages</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Tawaf & Saee assistance</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Shopping arrangements</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Madinah visit & tours</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Zam Zam water & materials</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Medical support</li>
              <li><FaCheckCircle className="inline text-green-600 mr-2" /> Pre-departure orientation</li>
            </ul>
          </div>
        </div>
      </section>




      {/* ================= OUR PACKAGES SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-4">
          Our Umrah Packages
        </h2>
        <p className="text-center text-gray-700 mb-12 text-lg">
          Choose the Umrah package that best suits your spiritual journey
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

          {/* ECONOMY */}
          <div className="border rounded-xl overflow-hidden shadow bg-green-50">
            <img
              src={umrahImage}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-green-900">Economy Umrah Package</h3>
              <p className="text-gray-700 mb-4">Affordable Umrah package with essential services.</p>

              <p className="text-lg font-semibold mt-3">Starting from</p>
              <p className="text-3xl font-bold text-green-800 mb-3">₹65,000</p>

              <button 
                onClick={() => {
                  setSelectedPackage("Economy Umrah Package");
                  setIsFormOpen(true);
                }}
                className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700">
                Book Economy Umrah Package
              </button>
            </div>
          </div>

          {/* STANDARD */}
          <div className="border rounded-xl overflow-hidden shadow bg-green-50">
            <img
              src={umrah2Image}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-green-900">Standard Umrah Package</h3>
              <p className="text-gray-700 mb-4">Comfortable Umrah journey with premium services.</p>

              <p className="text-lg font-semibold mt-3">Starting from</p>
              <p className="text-3xl font-bold text-green-800 mb-3">₹85,000</p>

              <button 
                onClick={() => {
                  setSelectedPackage("Standard Umrah Package");
                  setIsFormOpen(true);
                }}
                className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700">
                Book Standard Umrah Package
              </button>
            </div>
          </div>

          {/* VIP */}
          <div className="border rounded-xl overflow-hidden shadow bg-green-50">
            <img
              src={umrah3Image}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-green-900">VIP Umrah Package</h3>
              <p className="text-gray-700 mb-4">Luxury Umrah experience with exclusive amenities.</p>

              <p className="text-lg font-semibold mt-3">Starting from</p>
              <p className="text-3xl font-bold text-green-800 mb-3">₹1,25,000</p>

              <button 
                onClick={() => {
                  setSelectedPackage("VIP Umrah Package");
                  setIsFormOpen(true);
                }}
                className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700">
                Book VIP Umrah Package
              </button>
            </div>
          </div>

        </div>
      </section>




      {/* ================= SERVICES SECTION ================= */}
      <section className="py-20 bg-green-50 px-6">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-700 mb-12 text-lg">
          Complete support for your spiritual journey
        </p>

        <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">

          <div className="p-8 bg-white rounded-xl shadow text-center">
            <FaPlane className="text-green-800 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Flight Arrangements</h3>
            <p className="text-gray-700">Direct flights with group coordination.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow text-center">
            <FaHotel className="text-green-800 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Premium Accommodation</h3>
            <p className="text-gray-700">Comfortable hotels near Haram.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow text-center">
            <FaShieldHalved className="text-green-800 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Visa & Documentation</h3>
            <p className="text-gray-700">Complete visa and paperwork support.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow text-center">
            <FaRegHeart className="text-green-800 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">Religious Guidance</h3>
            <p className="text-gray-700">Experienced scholars for rituals.</p>
          </div>
        </div>
      </section>




      {/* ================= FINAL CTA ================= */}
      <section
        className="py-20 text-white text-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${umrah3Image})`,
        }}
      >
        <div className="absolute inset-0 bg-green-900/85"></div>

        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Begin Your Sacred Umrah Journey Today</h2>
          <p className="text-lg mb-10">
            Book your Umrah package now and embark on the journey of a lifetime.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div>
              <FaPhoneAlt className="text-yellow-400 text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-xl">Call Now</h3>
              <p>638 222 0393</p>
            </div>

            <div>
              <FaUsers className="text-yellow-400 text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-xl">Group Bookings</h3>
              <p>Special Discounts Available</p>
            </div>

            <div>
              <FaShieldAlt className="text-yellow-400 text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-xl">Secure Booking</h3>
              <p>Safe & Trusted Process</p>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <button 
              onClick={() => {
                setSelectedPackage("Economy Umrah Package");
                setIsFormOpen(true);
              }}
              className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400">
                Customize My Umrah
            </button>
          </div>
        </div>
      </section>

      <FormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        packageType={selectedPackage}
      />

    </div>
  );
};

export default CustomizedUmrah;
