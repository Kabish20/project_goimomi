import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ComingSoon from './components/ComingSoon.jsx'

// Pages
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import ContactSuccess from './pages/ContactSuccess.jsx'
import CustomizedHolidays from './pages/CustomizedHolidays.jsx'
import CustomizedUmrah from './pages/CustomizedUmrah.jsx'
import Holidays from './pages/Holidays.jsx'
import PlanTrip from './pages/Holidaysform.jsx'
import Cab from './pages/cab.jsx'
import Cruise from './pages/curise.jsx'
import Visa from './pages/visa.jsx'
import Hotel from './pages/hotel.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import CancellationPolicy from './pages/CancellationPolicy.jsx'
import HolidayDetails from "./pages/HolidayDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DestinationAdd from "./pages/admin/DestinationAdd";
import DestinationManage from "./pages/admin/DestinationManage";
import DestinationEdit from "./pages/admin/DestinationEdit";
import HolidayPackageAdd from "./pages/admin/HolidayPackageAdd";
import HolidayPackageEdit from "./pages/admin/HolidayPackageEdit";
import HolidayPackageManage from "./pages/admin/HolidayPackageManage";
import EnquiryManage from "./pages/admin/EnquiryManage";
import HolidayEnquiryManage from "./pages/admin/HolidayEnquiryManage";
import HolidayEnquiryAdd from "./pages/admin/HolidayEnquiryAdd";
import UmrahEnquiryAdd from "./pages/admin/UmrahEnquiryAdd";
import UmrahEnquiryManage from "./pages/admin/UmrahEnquiryManage";
import StartingCityManage from "./pages/admin/StartingCityManage";
import StartingCityAdd from "./pages/admin/StartingCityAdd";
import StartingCityEdit from "./pages/admin/StartingCityEdit";
import ItineraryMasterManage from "./pages/admin/ItineraryMasterManage";
import ItineraryMasterEdit from "./pages/admin/ItineraryMasterEdit";
import ItineraryMasterAdd from "./pages/admin/ItineraryMasterAdd";
import UsersList from "./pages/admin/UsersList";
import UserAdd from "./pages/admin/UserAdd";
import UserEdit from "./pages/admin/UserEdit";
import NationalityManage from "./pages/admin/NationalityManage";
import NationalityAdd from "./pages/admin/NationalityAdd";
import NationalityEdit from "./pages/admin/NationalityEdit";
import UmrahDestinationManage from "./pages/admin/UmrahDestinationManage";
import UmrahDestinationAdd from "./pages/admin/UmrahDestinationAdd";
import UmrahDestinationEdit from "./pages/admin/UmrahDestinationEdit";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";

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
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/customizedHolidays" element={<CustomizedHolidays />} />
          <Route
            path="/umrah-package"
            element={
              <ComingSoon
                title="Umrah Packages"
                description="We are curated special Umrah packages for you. Stay tuned for the launch!"
              />
            }
          />
          <Route path="/customizedumrah" element={<CustomizedUmrah />} />
          <Route path="/form" element={<PlanTrip isOpen={true} onClose={() => window.history.back()} />} />
          <Route path="/cab" element={<Cab />} />
          <Route path="/cruise" element={<Cruise />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/holiday/:id" element={<HolidayDetails />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/destinations/add" element={<DestinationAdd />} />
            <Route path="/admin/destinations/edit/:id" element={<DestinationEdit />} />
            <Route path="/admin/destinations" element={<DestinationManage />} />
            <Route path="/admin/packages/add" element={<HolidayPackageAdd />} />
            <Route path="/admin/packages/edit/:id" element={<HolidayPackageEdit />} />
            <Route path="/admin/packages" element={<HolidayPackageManage />} />
            <Route path="/admin/enquiries" element={<EnquiryManage />} />
            <Route path="/admin/holiday-enquiries/add" element={<HolidayEnquiryAdd />} />
            <Route path="/admin/holiday-enquiries" element={<HolidayEnquiryManage />} />
            <Route path="/admin/umrah-enquiries/add" element={<UmrahEnquiryAdd />} />
            <Route path="/admin/umrah-enquiries" element={<UmrahEnquiryManage />} />
            <Route path="/admin/starting-cities" element={<StartingCityManage />} />
            <Route path="/admin/starting-cities/add" element={<StartingCityAdd />} />
            <Route path="/admin/starting-cities/edit/:id" element={<StartingCityEdit />} />
            <Route path="/admin/itinerary-masters" element={<ItineraryMasterManage />} />
            <Route path="/admin/itinerary-masters/add" element={<ItineraryMasterAdd />} />
            <Route path="/admin/itinerary-masters/edit/:id" element={<ItineraryMasterEdit />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/users/add" element={<UserAdd />} />
            <Route path="/admin/users/edit/:id" element={<UserEdit />} />
            <Route path="/admin/nationalities" element={<NationalityManage />} />
            <Route path="/admin/nationalities/add" element={<NationalityAdd />} />
            <Route path="/admin/nationalities/edit/:id" element={<NationalityEdit />} />
            <Route path="/admin/umrah-destinations" element={<UmrahDestinationManage />} />
            <Route path="/admin/umrah-destinations/add" element={<UmrahDestinationAdd />} />
            <Route path="/admin/umrah-destinations/edit/:id" element={<UmrahDestinationEdit />} />
          </Route>
        </Routes>
      </main>


      <Footer />
    </div>
  )
}

export default App
