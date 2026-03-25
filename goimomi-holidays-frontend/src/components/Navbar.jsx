import React, { useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/goimomilogo.png'
import AdminLogin from '../pages/AdminLogin.jsx'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [desktopHoliday, setDesktopHoliday] = React.useState(false)
  const [mobileHoliday, setMobileHoliday] = React.useState(false)
  const [desktopUmrah, setDesktopUmrah] = React.useState(false)
  const [mobileUmrah, setMobileUmrah] = React.useState(false)
  const [desktopBusiness, setDesktopBusiness] = React.useState(false)
  const [mobileBusiness, setMobileBusiness] = React.useState(false)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = React.useState(false)
  const holidayRef = useRef(null);
  const umrahRef = useRef(null);
  const businessRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Toggle Holiday Dropdown
      if (holidayRef.current && !holidayRef.current.contains(event.target)) {
        setDesktopHoliday(false);
      }
      // Toggle Umrah Dropdown
      if (umrahRef.current && !umrahRef.current.contains(event.target)) {
        setDesktopUmrah(false);
      }
      // Toggle Business Dropdown
      if (businessRef.current && !businessRef.current.contains(event.target)) {
        setDesktopBusiness(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lock body scroll when admin login is open
  useEffect(() => {
    if (isAdminLoginOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAdminLoginOpen]);

  const animatedButton =
    "flex flex-col items-center justify-center text-xs hover:text-goimomi-primary active:scale-90 transition-transform duration-200 focus:outline-none";

  return (
    <header className="w-full sticky top-0 z-[100]">
      {/* Top bar */}
      <div className="bg-goimomi-primary text-white text-xs hidden md:block">
        <div className="max-w-10xl mx-auto flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <span className="text-sm">📞</span> +91 638 222 0393
            </span>
            <span className="flex items-center gap-2">
              <span className="text-sm">✉️</span> hello@goimomi.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="opacity-95 font-medium">24/7 Customer Support Available</span>
            <div className="flex items-center gap-2">
              <a
                href="https://b2b.goimomi.com/"
                className="bg-white text-goimomi-primary rounded-full px-3 py-1 font-bold hover:bg-green-50 transition-all text-xs uppercase tracking-wide"
                rel="noopener noreferrer"
              >
                Agent Login
              </a>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="bg-white text-goimomi-primary rounded-full px-3 py-1 font-black hover:bg-green-50 transition-all text-xs uppercase tracking-wide shadow-sm"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-white/95 backdrop-blur-md sticky top-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-2.5">

          {/* Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <img src={logo} alt="Goimomi Holidays" className="h-[65px] w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-slate-700">
            {/* Flights */}
            <a
              href="https://booking.goimomi.com/"
              rel="noopener noreferrer"
              className={animatedButton}
            >
              <img src="https://cdn-icons-png.flaticon.com/128/1350/1350120.png" alt="Flights" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Flights</span>
            </a>

            {/* Hotels */}
            <a
              href="https://booking.goimomi.com/"
              rel="noopener noreferrer"
              className={animatedButton}
            >
              <img src="https://cdn-icons-png.flaticon.com/128/3168/3168622.png" alt="Hotels" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Hotels</span>
            </a>

            {/* Visa */}
            <NavLink to="/visa" className={animatedButton}>
              <img src="https://cdn-icons-png.flaticon.com/128/15544/15544932.png" alt="Visa" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Visa</span>
            </NavLink>

            {/*European Tour */}

            <NavLink to="/Europeantours" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <img src="https://cdn-icons-png.flaticon.com/128/701/701349.png" alt="Europe Tours" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Europe Tours</span>
            </NavLink>

            {/* Canton Fair */}
            <NavLink to="/canton" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <img src="https://cdn-icons-png.flaticon.com/128/14785/14785126.png" alt="Canton Fair" className="w-[38px] h-[38px] mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Canton Fair</span>
            </NavLink>

            {/* Business Trip Dropdown */}
            <div className="relative" ref={businessRef}>
              <button
                type="button"
                className={animatedButton}
                onClick={() => {
                  setDesktopBusiness(!desktopBusiness);
                  setDesktopUmrah(false);
                  setDesktopHoliday(false);
                }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/9638/9638464.png" alt="Business Trip" className="w-9 h-9 mb-1 object-contain" />
                <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-0.5">
                  Business Trip
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 transition-transform duration-300 ${desktopBusiness ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.205l3.71-3.974a.75.75 0 1 1 1.08 1.04l-4.24 4.54a.75.75 0 0 1-1.08 0l-4.24-4.54a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {desktopBusiness && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 rounded-xl border border-slate-100 bg-white text-slate-700 shadow-xl">
                  <NavLink
                    to="/holidays?category=Business Trip"
                    onClick={() => setDesktopBusiness(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    Business Trip
                  </NavLink>
                </div>
              )}
            </div>

            {/* Umrah / Hajj Dropdown */}
            <div className="relative" ref={umrahRef}>
              <button
                type="button"
                className={animatedButton}
                onClick={() => {
                  setDesktopUmrah(!desktopUmrah);
                  setDesktopHoliday(false);
                }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/5203/5203166.png" alt="Umrah / Hajj" className="w-9 h-9 mb-1 object-contain" />
                <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-0.5">
                  Umrah / Hajj
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 transition-transform duration-300 ${desktopUmrah ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.205l3.71-3.974a.75.75 0 1 1 1.08 1.04l-4.24 4.54a.75.75 0 0 1-1.08 0l-4.24-4.54a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {desktopUmrah && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 rounded-xl border border-slate-100 bg-white text-slate-700 shadow-xl">
                  <NavLink
                    to="/holidays?category=Umrah"
                    onClick={() => setDesktopUmrah(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    Umrah
                  </NavLink>
                  <NavLink
                    to="/customizedumrah"
                    onClick={() => setDesktopUmrah(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    Customized Umrah
                  </NavLink>
                </div>
              )}
            </div>

            {/* Holidays Dropdown */}
            <div className="relative" ref={holidayRef}>
              <button
                type="button"
                className={animatedButton}
                onClick={() => {
                  setDesktopHoliday(!desktopHoliday);
                  setDesktopUmrah(false);
                }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/9369/9369093.png" alt="Holidays" className="w-9 h-9 mb-1 object-contain" />

                <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-0.5">
                  Holidays
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 transition-transform duration-300 ${desktopHoliday ? "rotate-180" : "rotate-0"
                      }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.205l3.71-3.974a.75.75 0 1 1 1.08 1.04l-4.24 4.54a.75.75 0 0 1-1.08 0l-4.24-4.54a.75.75 0 0 1 .02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>


              {/* Dropdown */}
              {desktopHoliday && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 rounded-xl border border-slate-100 bg-white text-slate-700 shadow-xl">
                  <NavLink
                    to="/holidays?category=Domestic"
                    onClick={() => setDesktopHoliday(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    Domestic
                  </NavLink>
                  <NavLink
                    to="/holidays?category=International"
                    onClick={() => setDesktopHoliday(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    International
                  </NavLink>
                  <NavLink
                    to="/customizedHolidays"
                    onClick={() => setDesktopHoliday(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    Customized Holidays
                  </NavLink>
                  <NavLink
                    to="/Europeantours"
                    onClick={() => setDesktopHoliday(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-goimomi-light"
                  >
                    Europe Tours
                  </NavLink>
                </div>
              )}
            </div>




            {/* Cabs */}
            <NavLink to="/cab" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <img src="https://cdn-icons-png.flaticon.com/128/4874/4874225.png" alt="Cabs" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Cabs</span>
            </NavLink>

            {/* Cruise Bookings */}
            <NavLink to="/cruise" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <img src="https://cdn-icons-png.flaticon.com/128/4320/4320227.png" alt="Cruise" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Cruise</span>
            </NavLink>

            {/* About */}
            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/128/10613/10613643.png" alt="About" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">About</span>
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contactus"
              className={({ isActive }) =>
                `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/128/2706/2706907.png" alt="Contact" className="w-9 h-9 mb-1 object-contain" />
              <span className="font-bold text-[11px] uppercase tracking-wide">Contact</span>
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md border border-slate-200"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white shadow-md animate-slideDown">
            <div className="px-5 py-4 space-y-3 text-base font-medium">

              <a
                href="https://booking.goimomi.com/"
                rel="noopener noreferrer"
                className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full"
                onClick={() => setMobileOpen(false)}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/1350/1350120.png" alt="Flight" className="w-6 h-6 object-contain" />
                Flight
              </a>

              <a
                href="https://booking.goimomi.com/"
                rel="noopener noreferrer"
                className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full"
                onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/3168/3168622.png" alt="Hotels" className="w-6 h-6 object-contain" />
                Hotels
              </a>

              <NavLink to="/visa" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/15544/15544932.png" alt="Visa" className="w-6 h-6 object-contain" />
                Visa
              </NavLink>

              <div>
                <button
                  onClick={() => {
                    setMobileBusiness(!mobileBusiness);
                    setMobileUmrah(false);
                    setMobileHoliday(false);
                  }}
                  className="w-full flex items-center justify-between py-2 hover:text-[#14532d] transition"
                >
                  <span className="flex items-center gap-3">
                    <img src="https://cdn-icons-png.flaticon.com/128/9638/9638464.png" alt="Business Trip" className="w-6 h-6 object-contain" />
                    Business Trip
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${mobileBusiness ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.205l3.71-3.974a.75.75 0 1 1 1.08 1.04l-4.24 4.54a.75.75 0 0 1-1.08 0l-4.24-4.54a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                {mobileBusiness && (
                  <div className="pl-6 space-y-2">
                    <NavLink to="/holidays?category=Business Trip" className="block py-1 text-sm hover:text-[#14532d] transition" onClick={() => setMobileOpen(false)}>
                      Business Trip
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setMobileUmrah(!mobileUmrah);
                    setMobileHoliday(false);
                  }}
                  className="w-full flex items-center justify-between py-2 hover:text-[#14532d] transition"
                >
                  <span className="flex items-center gap-3">
                    <img src="https://cdn-icons-png.flaticon.com/128/5203/5203166.png" alt="Umrah / Hajj" className="w-6 h-6 object-contain" />
                    Umrah / Hajj
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${mobileUmrah ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.205l3.71-3.974a.75.75 0 1 1 1.08 1.04l-4.24 4.54a.75.75 0 0 1-1.08 0l-4.24-4.54a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                {mobileUmrah && (
                  <div className="pl-6 space-y-2">
                    <NavLink to="/holidays?category=Umrah" className="block py-1 text-sm hover:text-[#14532d] transition" onClick={() => setMobileOpen(false)}>
                      Umrah 
                    </NavLink>
                    <NavLink to="/customizedumrah" className="block py-1 text-sm hover:text-[#14532d] transition" onClick={() => setMobileOpen(false)}>
                      Customized Umrah
                    </NavLink>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    setMobileHoliday(!mobileHoliday);
                    setMobileUmrah(false);
                  }}
                  className="w-full flex items-center justify-between py-2 hover:text-[#14532d] transition"
                >
                  <span className="flex items-center gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/128/9369/9369093.png" alt="Holidays" className="w-6 h-6 object-contain" />
                    Holidays
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${mobileHoliday ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.205l3.71-3.974a.75.75 0 1 1 1.08 1.04l-4.24 4.54a.75.75 0 0 1-1.08 0l-4.24-4.54a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                {mobileHoliday && (
                  <div className="pl-6 space-y-2">
                    <NavLink
                      to="/holidays?category=Domestic"
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      Domestic
                    </NavLink>
                    <NavLink
                      to="/holidays?category=International"
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      International
                    </NavLink>
                    <NavLink
                      to="/customizedHolidays"
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      Customized Holidays
                    </NavLink>
                    <NavLink
                      to="/Europeantours"
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      European Tour
                    </NavLink>
                  </div>
                )}
              </div>
              <NavLink to="/Europeantours" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/701/701349.png" alt="Europe Tours" className="w-6 h-6 object-contain" />
                Europe Tours
              </NavLink>

              <NavLink to="/canton" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/14785/14785126.png" alt="Canton Fair" className="w-6 h-6 object-contain" />
                Canton Fair
              </NavLink>

              <NavLink to="/cab" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/4874/4874225.png" alt="Cabs" className="w-6 h-6 object-contain" />
                Cabs
              </NavLink>

              <NavLink to="/cruise" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/4320/4320227.png" alt="Cruise" className="w-6 h-6 object-contain" />
                Cruise Bookings
              </NavLink>

              <NavLink to="/aboutus" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/10613/10613643.png" alt="About" className="w-6 h-6 object-contain" />
                About Us
              </NavLink>

              <NavLink to="/contactus" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <img src="https://cdn-icons-png.flaticon.com/128/2706/2706907.png" alt="Contact" className="w-6 h-6 object-contain" />
                Contact Us
              </NavLink>

              {/* Social Links for "Instagram Part" */}
              <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Follow Our Journey</span>
                <div className="flex items-center gap-6">
                  <a href="https://www.instagram.com/goimomi_holidays/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl shadow-lg shadow-pink-500/20 active:scale-90 transition-transform">
                    <img src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png" className="w-6 h-6 invert brightness-100" alt="Instagram" />
                  </a>
                  <a href="https://www.facebook.com/goimomi" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#1877F2] rounded-2xl shadow-lg shadow-blue-500/20 active:scale-90 transition-transform">
                    <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" className="w-6 h-6 invert brightness-100" alt="Facebook" />
                  </a>
                  <a href="https://wa.me/916382220393" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#25D366] rounded-2xl shadow-lg shadow-green-500/20 active:scale-90 transition-transform">
                    <img src="https://cdn-icons-png.flaticon.com/128/733/733585.png" className="w-6 h-6 invert brightness-100" alt="WhatsApp" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />
    </header>
  );
};

export default Navbar; 