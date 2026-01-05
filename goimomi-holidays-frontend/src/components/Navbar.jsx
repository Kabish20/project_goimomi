import React, { useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/goimomilogo.png'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [desktopHoliday, setDesktopHoliday] = React.useState(false)
  const [mobileHoliday, setMobileHoliday] = React.useState(false)
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopHoliday(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const animatedButton =
    "flex flex-col items-center justify-center text-xs hover:text-goimomi-primary active:scale-90 transition-transform duration-200 focus:outline-none";

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-goimomi-primary text-white text-sm hidden md:block">
        <div className="max-w-10xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span>📞</span> +91 638 222 0393
            </span>
            <span className="flex items-center gap-2">
              <span>✉️</span> hello@goimomi.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>24/7 Customer Support Available</span>
            <a
              href="https://b2b.goimomi.com/"
              className="bg-white text-goimomi-primary rounded-full px-3 py-1 font-medium"
              rel="noopener noreferrer"
            >
              Agent Login
            </a>
            <Link
              to="/admin-login"
              className="bg-white text-goimomi-primary rounded-full px-3 py-1 font-medium"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-4 py-3">

          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Goimomi Holidays" className="h-20 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-9 text-slate-800">

            {/* Flights */}
            <a
              href="https://booking.goimomi.com/"
              rel="noopener noreferrer"
              className={animatedButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-airplane-engines" viewBox="0 0 16 16"><path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.35 4.35 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0M7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1s.458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7z" /></svg>
              <span className="font-medium">Flights</span>
            </a>

            {/* Hotels */}
            <NavLink to="/hotel" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-buildings-fill" viewBox="0 0 16 16"><path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zM2 11h1v1H2zm2 0h1v1H4zm-1 2v1H2v-1zm1 0h1v1H4zm9-10v1h-1V3zM8 5h1v1H8zm1 2v1H8V7zM8 9h1v1H8zm2 0h1v1h-1zm-1 2v1H8v-1zm1 0h1v1h-1zm3-2v1h-1V9zm-1 2h1v1h-1zm-2-4h1v1h-1zm3 0v1h-1V7zm-2-2v1h-1V5zm1 0h1v1h-1z" /></svg>
              <span className="font-medium">Hotels</span>
            </NavLink>

            {/* Visa */}
            <NavLink to="/visa" className={animatedButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-passport-fill" viewBox="0 0 16 16"><path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /><path d="M2 3.252a1.5 1.5 0 0 1 1.232-1.476l8-1.454A1.5 1.5 0 0 1 13 1.797v.47A2 2 0 0 1 14 4v10a2 2 0 0 1-2 2H4a2 2 0 0 1-1.51-.688 1.5 1.5 0 0 1-.49-1.11V3.253ZM5 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0m0 4.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5" /></svg>
              <span className="font-medium">Visa</span>
            </NavLink>

            {/* Holidays Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={animatedButton}
                onClick={() => setDesktopHoliday(!desktopHoliday)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" /><path d="M8 0a.5.5 0 0 1 .5.5V2A.5.5 0 0 1 8 2V.5A.5.5 0 0 1 8 0zM8 14a.5.5 0 0 1 .5.5V15.5a.5.5 0 0 1-1 0V14.5A.5.5 0 0 1 8 14zM2.05 2.05a.5.5 0 0 1 .707 0L3.88 3.27A.5.5 0 0 1 3.27 3.88L2.05 2.66a.5.5 0 0 1 0-.707zM12.12 12.12a.5.5 0 0 1 .707 0l1.121 1.121a.5.5 0 1 1-.707.707L12.12 12.83a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5H2A.5.5 0 0 1 2 8H.5A.5.5 0 0 1 0 8zM14 8a.5.5 0 0 1 .5-.5H15.5a.5.5 0 0 1 0 1H14.5A.5.5 0 0 1 14 8zM2.05 13.95a.5.5 0 0 1 0-.707L3.27 12.12a.5.5 0 0 1 .61.61L2.76 13.95a.5.5 0 0 1-.707 0zM12.12 3.88a.5.5 0 0 1 0-.707l1.121-1.121a.5.5 0 1 1 .707.707L12.83 3.88a.5.5 0 0 1-.707 0z" /></svg>

                <span className="font-medium flex items-center gap-1">
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
                    to="/holidays"
                    state={{ category: "Domestic" }}
                    onClick={() => setDesktopHoliday(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light text-left w-full"
                  >
                    Domestic
                  </NavLink>
                  <NavLink
                    to="/holidays"
                    state={{ category: "International" }}
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
                    to="/holidays"
                    state={{ category: "Umrah" }}
                    onClick={() => setDesktopHoliday(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light"
                  >
                    Umrah Package
                  </NavLink>
                  <NavLink
                    to="/customizedumrah"
                    onClick={() => setDesktopHoliday(false)}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-goimomi-light"
                  >
                    Customized Umrah
                  </NavLink>
                </div>
              )}
            </div>


            {/* Cabs */}
            <NavLink to="/cab" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-taxi-front-fill" viewBox="0 0 16 16"><path d="M6 1a1 1 0 0 0-1 1v1h-.181A2.5 2.5 0 0 0 2.52 4.515l-.792 1.848a.8.8 0 0 1-.38.404c-.5.25-.855.715-.965 1.262L.05 9.708a2.5 2.5 0 0 0-.049.49v.413c0 .814.39 1.543 1 1.997V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.338c1.292.048 2.745.088 4 .088s2.708-.04 4-.088V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.892c.61-.454 1-1.183 1-1.997v-.413q0-.248-.049-.49l-.335-1.68a1.8 1.8 0 0 0-.964-1.261.8.8 0 0 1-.381-.404l-.792-1.848A2.5 2.5 0 0 0 11.181 3H11V2a1 1 0 0 0-1-1zM4.309 4h7.382a.5.5 0 0 1 .447.276l.956 1.913a.51.51 0 0 1-.497.731c-.91-.073-3.35-.17-4.597-.17s-3.688.097-4.597.17a.51.51 0 0 1-.497-.731l.956-1.913A.5.5 0 0 1 4.309 4M4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-9 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" /></svg>
              <span className="font-medium">Cabs</span>
            </NavLink>

            {/* Cruise Bookings */}
            <NavLink to="/cruise" className={({ isActive }) =>
              `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
            }>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-ship" viewBox="0 0 16 16"><path d="M8.146 2.792a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L9 4.207V7.5a.5.5 0 0 1-1 0V4.207L6.854 5.5a.5.5 0 1 1-.708-.708z" /><path d="M3.5 7h9l1 3H2.5l1-3z" /><path d="M1.5 11h13l-1.5 4h-10L1.5 11z" /></svg>
              <span className="font-medium">Cruise Bookings</span>
            </NavLink>

            {/* About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" /><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" /></svg>
              About
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${animatedButton} ${isActive ? "text-goimomi-primary" : ""}`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" /></svg>
              Contact
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
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-airplane-engines" viewBox="0 0 16 16"><path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.35 4.35 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0M7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1s.458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7z" /></svg>
                Flight
              </a>

              <NavLink to="/hotel" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-buildings-fill" viewBox="0 0 16 16"><path d="M15 .5a.5.5 0 0 0-.724-.447l-8 4A.5.5 0 0 0 6 4.5v3.14L.342 9.526A.5.5 0 0 0 0 10v5.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V14h1v1.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zM2 11h1v1H2zm2 0h1v1H4zm-1 2v1H2v-1zm1 0h1v1H4zm9-10v1h-1V3zM8 5h1v1H8zm1 2v1H8V7zM8 9h1v1H8zm2 0h1v1h-1zm-1 2v1H8v-1zm1 0h1v1h-1zm3-2v1h-1V9zm-1 2h1v1h-1zm-2-4h1v1h-1zm3 0v1h-1V7zm-2-2v1h-1V5zm1 0h1v1h-1z" /></svg>
                Hotels
              </NavLink>

              <NavLink to="/visa" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-passport-fill" viewBox="0 0 16 16"><path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /><path d="M2 3.252a1.5 1.5 0 0 1 1.232-1.476l8-1.454A1.5 1.5 0 0 1 13 1.797v.47A2 2 0 0 1 14 4v10a2 2 0 0 1-2 2H4a2 2 0 0 1-1.51-.688 1.5 1.5 0 0 1-.49-1.11V3.253ZM5 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0m0 4.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5" /></svg>
                Visa
              </NavLink>

              <div>
                <button
                  onClick={() => setMobileHoliday((prev) => !prev)}
                  className="w-full flex items-center justify-between py-2 hover:text-[#14532d] transition"
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" /><path d="M8 0a.5.5 0 0 1 .5.5V2A.5.5 0 0 1 8 2V.5A.5.5 0 0 1 8 0zM8 14a.5.5 0 0 1 .5.5V15.5a.5.5 0 0 1-1 0V14.5A.5.5 0 0 1 8 14zM2.05 2.05a.5.5 0 0 1 .707 0L3.88 3.27A.5.5 0 0 1 3.27 3.88L2.05 2.66a.5.5 0 0 1 0-.707zM12.12 12.12a.5.5 0 0 1 .707 0l1.121 1.121a.5.5 0 1 1-.707.707L12.12 12.83a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5H2A.5.5 0 0 1 2 8H.5A.5.5 0 0 1 0 8zM14 8a.5.5 0 0 1 .5-.5H15.5a.5.5 0 0 1 0 1H14.5A.5.5 0 0 1 14 8zM2.05 13.95a.5.5 0 0 1 0-.707L3.27 12.12a.5.5 0 0 1 .61.61L2.76 13.95a.5.5 0 0 1-.707 0zM12.12 3.88a.5.5 0 0 1 0-.707l1.121-1.121a.5.5 0 1 1 .707.707L12.83 3.88a.5.5 0 0 1-.707 0z" /></svg>
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
                      to="/holidays"
                      state={{ category: "Domestic" }}
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      Domestic
                    </NavLink>
                    <NavLink
                      to="/holidays"
                      state={{ category: "International" }}
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
                      to="/holidays"
                      state={{ category: "Umrah" }}
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      Umrah Package
                    </NavLink>
                    <NavLink
                      to="/customizedumrah"
                      className="flex items-center gap-3 py-1 pl-2 text-sm hover:text-[#14532d] transition"
                      onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}
                    >
                      Customized Umrah
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="/cab" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-taxi-front-fill" viewBox="0 0 16 16"><path d="M6 1a1 1 0 0 0-1 1v1h-.181A2.5 2.5 0 0 0 2.52 4.515l-.792 1.848a.8.8 0 0 1-.38.404c-.5.25-.855.715-.965 1.262L.05 9.708a2.5 2.5 0 0 0-.049.49v.413c0 .814.39 1.543 1 1.997V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.338c1.292.048 2.745.088 4 .088s2.708-.04 4-.088V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.892c.61-.454 1-1.183 1-1.997v-.413q0-.248-.049-.49l-.335-1.68a1.8 1.8 0 0 0-.964-1.261.8.8 0 0 1-.381-.404l-.792-1.848A2.5 2.5 0 0 0 11.181 3H11V2a1 1 0 0 0-1-1zM4.309 4h7.382a.5.5 0 0 1 .447.276l.956 1.913a.51.51 0 0 1-.497.731c-.91-.073-3.35-.17-4.597-.17s-3.688.097-4.597.17a.51.51 0 0 1-.497-.731l.956-1.913A.5.5 0 0 1 4.309 4M4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-9 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" /></svg>
                Cabs
              </NavLink>

              <NavLink to="/cruise" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-ship" viewBox="0 0 16 16"><path d="M8.146 2.792a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L9 4.207V7.5a.5.5 0 0 1-1 0V4.207L6.854 5.5a.5.5 0 1 1-.708-.708z" /><path d="M3.5 7h9l1 3H2.5l1-3z" /><path d="M1.5 11h13l-1.5 4h-10L1.5 11z" /></svg>
                Cruise Bookings
              </NavLink>

              <NavLink to="/about" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" /><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" /></svg>
                About Us
              </NavLink>

              <NavLink to="/contact" className="flex items-center justify-start gap-3 py-2 hover:text-[#14532d] transition w-full" onClick={() => { setMobileOpen(false); setMobileHoliday(false); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" /></svg>
                Contact Us
              </NavLink>

              {/* Login Buttons for Mobile */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <a
                  href="https://b2b.goimomi.com/"
                  className="w-full text-center bg-goimomi-primary text-white rounded-lg py-2 font-medium"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                >
                  Agent Login
                </a>
                <Link
                  to="/admin-login"
                  className="w-full text-center border-2 border-goimomi-primary text-goimomi-primary rounded-lg py-2 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Login
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar; 