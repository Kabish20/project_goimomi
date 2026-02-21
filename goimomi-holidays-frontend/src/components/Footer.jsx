import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6"; // if you still want FaPlus
import { Link, useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#14532d] text-white pt-12 pb-8 px-6 border-t border-white/5">
      {/* -------------------- TOP CTA -------------------- */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Ready to Plan Your Dream Getaway?</h2>
        <p className="mt-2 text-sm text-white/70 leading-relaxed font-medium">
          Contact our expert team today for a free consultation and customized itinerary.
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="mt-4 bg-[#e9b343] text-[#14532d] font-black uppercase tracking-wider text-xs px-6 py-2 rounded-full shadow-lg hover:bg-[#f2c25d] transition-all active:scale-95"
        >
          Get In Touch Now
        </button>
      </div>

      {/* -------------------- MAIN FOOTER CONTENT -------------------- */}
      <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto text-sm">

        {/* ------ Column 1: About ------ */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">Goimomi Holidays</h3>
            <p className="text-white/70 leading-relaxed text-[13px] font-medium">
              Your trusted travel partner for creating unforgettable memories.
              Specializing in domestic & international packages and personalized experiences.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a
              href="https://facebook.com/goimomi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#e9b343] hover:text-[#14532d] transition-all">
              <FaFacebookF size={14} />
            </a>

            <a
              href="https://instagram.com/goimomi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#e9b343] hover:text-[#14532d] transition-all">
              <FaInstagram size={14} />
            </a>

            <a
              href="https://youtube.com/@goimomi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#e9b343] hover:text-[#14532d] transition-all">
              <FaYoutube size={14} />
            </a>
          </div>
        </div>


        {/* ------ Column 2: Quick Links ------ */}
        <div>
          <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9b343] mb-4">Quick Links</h3>
          <ul className="space-y-1.5 text-white/70 text-[13px] font-medium">
            <li><a href="https://booking.goimomi.com/" className="hover:text-white transition-colors">Flights</a></li>
            <li><a href="https://booking.goimomi.com/" className="hover:text-white transition-colors">Hotels</a></li>
            <li><Link to="/visa" className="hover:text-white transition-colors">Visa</Link></li>
            <li><Link to="/holidays" state={{ category: "Domestic" }} className="hover:text-white transition-colors">Domestic</Link></li>
            <li><Link to="/holidays" state={{ category: "International" }} className="hover:text-white transition-colors">International</Link></li>
            <li><Link to="/holidays" state={{ category: "Umrah" }} className="hover:text-white transition-colors">Hajj/Umrah</Link></li>
            <li><Link to="/customizedHolidays" className="hover:text-white transition-colors">Customized Holidays</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* ------ Column 3: Services ------ */}
        <div>
          <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9b343] mb-4">Our Services</h3>
          <ul className="space-y-1.5 text-white/70 text-[13px] font-medium">
            <li><a href="https://booking.goimomi.com/" className="hover:text-white transition-colors">Hotel Booking</a></li>
            <li><a href="https://booking.goimomi.com/" className="hover:text-white transition-colors">Flights Booking</a></li>
            <li><Link to="/cab" className="hover:text-white transition-colors">Cab Booking</Link></li>
            <li><Link to="/cruise" className="hover:text-white transition-colors">Cruise Bookings</Link></li>
            <li><Link to="/visa" className="hover:text-white transition-colors">Visa Services</Link></li>
          </ul>
        </div>


        {/* ------ Column 4: Contact Info ------ */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9b343] mb-4">Contact Info</h3>

          <div className="flex items-start gap-2.5 text-white/70 text-[13px] font-medium">
            <FaLocationDot className="text-[#e9b343] mt-0.5 shrink-0" size={14} />
            <p>Trichy • Hyderabad • Dubai</p>
          </div>

          <div className="flex items-center gap-2.5 text-white/70 text-[13px] font-medium">
            <FaPhoneAlt className="text-[#e9b343] shrink-0" size={14} />
            <p>+91 638 222 0393</p>
          </div>

          <div className="flex items-center gap-2.5 text-white/70 text-[13px] font-medium">
            <FaEnvelope className="text-[#e9b343] shrink-0" size={14} />
            <p>hello@goimomi.com</p>
          </div>
        </div>
      </div>

      {/* -------------------- BOTTOM LINE -------------------- */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center">
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">© 2025 Goimomi Holidays. All rights reserved.</p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-widest text-white/60">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
