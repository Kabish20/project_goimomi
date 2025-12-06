import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

// Pages
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import ContactSuccess from './pages/ContactSuccess.jsx'
import CustomizedHolidays from './pages/CustomizedHolidays.jsx'
import CustomizedUmrah from './pages/CustomizedUmrah.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import CancellationPolicy from './pages/CancellationPolicy.jsx'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* 👇 ScrollToTop FIX */}
      <ScrollToTop />

      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/success" element={<ContactSuccess />} />
          <Route path="/customized-holidays" element={<CustomizedHolidays />} />
          <Route path="/customized-umrah" element={<CustomizedUmrah />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
