import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6"; // if you still want FaPlus
import { Link, useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#14532d] text-white pt-20 pb-10 px-6">
      {/* -------------------- TOP CTA -------------------- */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold">Ready to Plan Your Dream Getaway?</h2>
        <p className="mt-3 text-gray-300">
          Contact our expert team today for a free consultation and customized itinerary.
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="mt-6 bg-[#e9b343] text-[#14532d] font-semibold px-8 py-3 rounded-lg shadow-lg"
        >
          Get In Touch Now
        </button>
      </div>

      {/* -------------------- MAIN FOOTER CONTENT -------------------- */}
      <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">

        {/* ------ Column 1: About ------ */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Goimomi Holidays</h3>
          <p className="text-gray-300 leading-relaxed">
            Your trusted travel partner for creating unforgettable memories.
            We specialize in domestic & international packages, group tours, and
            personalized holiday experiences.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">

            {/* Facebook */}
            <a
              href="https://facebook.com/goimomi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500/20 hover:bg-gray-500/40 transition">
              <FaFacebookF />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/goimomi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500/20 hover:bg-gray-500/40 transition">
              <FaInstagram />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@goimomi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500/20 hover:bg-gray-500/40 transition">
              <FaYoutube />
            </a>

          </div>
        </div>


        {/* ------ Column 2: Quick Links ------ */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a
                href="https://booking.goimomi.com/"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                Flights
              </a>
            </li>

            <li><Link to="/hotel" className="hover:text-white hover:underline">Hotels</Link></li>
            <li><Link to="/visa" className="hover:text-white hover:underline">Visa</Link></li>

            <li><Link to="/holidays" state={{ category: "Domestic" }} className="hover:text-white hover:underline">Domestic</Link></li>
            <li><Link to="/holidays" state={{ category: "International" }} className="hover:text-white hover:underline">International</Link></li>
            <li><Link to="/holidays" state={{ category: "Umrah" }} className="hover:text-white hover:underline">Hajj/Umrah</Link></li>
            <li><Link to="/customizedHolidays" className="hover:text-white hover:underline">Customized Holidays</Link></li>
            <li><Link to="/about" className="hover:text-white hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* ------ Column 3: Services ------ */}
        <div>
          <h3 className="text-xl font-bold mb-4">Our Services</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/hotel" className="hover:text-white hover:underline">Hotel Booking</Link></li>
            <li> <a href="https://booking.goimomi.com/" rel="noopener noreferrer" className="hover:text-white hover:underline">Flights Booking</a></li>
            <li><Link to="/cab" className="hover:text-white hover:underline">Cab Booking</Link></li>
            <li><Link to="/cruise" className="hover:text-white hover:underline">Cruise Bookings</Link></li>
            <li><Link to="/visa" className="hover:text-white hover:underline">Visa Services</Link></li>

          </ul>
        </div>


        {/* ------ Column 4: Contact Info ------ */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Info</h3>

          <div className="flex items-start gap-3 text-gray-300 mb-4">
            <FaLocationDot className="text-[#e9b343] text-xl" />
            <p>
              Tiruchirappalli
            </p>
          </div>
          <div className="flex items-start gap-3 text-gray-300 mb-4">
            <FaLocationDot className="text-[#e9b343] text-xl" />
            <p>
              Hyderabad
            </p>
          </div>
          <div className="flex items-start gap-3 text-gray-300 mb-4">
            <FaLocationDot className="text-[#e9b343] text-xl" />
            <p>
              Dubai
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-300 mb-4">
            <FaPhoneAlt className="text-[#e9b343]" />
            <p>+91 638 222 0393</p>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <FaEnvelope className="text-[#e9b343]" />
            <p>hello@goimomi.com</p>
          </div>
        </div>
      </div>

      {/* -------------------- BOTTOM LINE -------------------- */}
      <div className="border-t border-gray-600 mt-16 pt-6 text-center text-gray-300">
        <p>© 2025 Goimomi Holidays. All rights reserved.</p>

        <div className="flex justify-center gap-6 text-gray-300">
          <Link to="/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>

          <Link to="/terms-and-conditions" className="hover:text-white">
            Terms & Conditions
          </Link>

          <Link to="/cancellation-policy" className="hover:text-white">
            Cancellation Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
