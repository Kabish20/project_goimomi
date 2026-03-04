import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import EnquiryForm from './components/EnquiryForm.jsx'

// Pages
import Home from './pages/Home.jsx'
import About from './pages/Aboutus.jsx'
import Contact from './pages/Contactus.jsx'
import ContactSuccess from './pages/ContactSuccess.jsx'
import CustomizedHolidays from './pages/CustomizedHolidays.jsx'
import CustomizedUmrah from './pages/CustomizedUmrah.jsx'
import Holidays from './pages/Holidays.jsx'
import PlanTrip from './pages/Holidaysform.jsx'
import Cab from './pages/cab.jsx'
import Cruise from './pages/Cruise.jsx'
import VisaSearch from './pages/VisaSearch.jsx'
import VisaResults from './pages/VisaResults.jsx'
import VisaApplication from './pages/VisaApplication.jsx'
import Europeantours from './pages/Europeantours.jsx'

import Hotel from './pages/hotel.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import CancellationPolicy from './pages/CancellationPolicy.jsx'
import HolidayDetails from "./pages/HolidayDetails.jsx";

import PackageEnquiryPage from "./pages/PackageEnquiryPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import DestinationAdd from "./pages/admin/DestinationAdd.jsx";
import DestinationManage from "./pages/admin/DestinationManage.jsx";
import DestinationEdit from "./pages/admin/DestinationEdit.jsx";
import HolidayPackageAdd from "./pages/admin/HolidayPackageAdd.jsx";
import HolidayPackageEdit from "./pages/admin/HolidayPackageEdit.jsx";
import HolidayPackageManage from "./pages/admin/HolidayPackageManage.jsx";
import EnquiryManage from "./pages/admin/EnquiryManage.jsx";
import HolidayEnquiryManage from "./pages/admin/HolidayEnquiryManage.jsx";
import HolidayEnquiryAdd from "./pages/admin/HolidayEnquiryAdd.jsx";
import UmrahEnquiryAdd from "./pages/admin/UmrahEnquiryAdd.jsx";
import UmrahEnquiryManage from "./pages/admin/UmrahEnquiryManage.jsx";
import StartingCityManage from "./pages/admin/StartingCityManage.jsx";
import StartingCityAdd from "./pages/admin/StartingCityAdd.jsx";
import StartingCityEdit from "./pages/admin/StartingCityEdit.jsx";
import ItineraryMasterManage from "./pages/admin/ItineraryMasterManage.jsx";
import ItineraryMasterEdit from "./pages/admin/ItineraryMasterEdit.jsx";
import ItineraryMasterAdd from "./pages/admin/ItineraryMasterAdd.jsx";
import SightseeingMasterManage from "./pages/admin/SightseeingMasterManage.jsx";
import SightseeingMasterAdd from "./pages/admin/SightseeingMasterAdd.jsx";
import SightseeingMasterEdit from "./pages/admin/SightseeingMasterEdit.jsx";
import UsersList from "./pages/admin/UsersList.jsx";
import UserAdd from "./pages/admin/UserAdd.jsx";
import UserEdit from "./pages/admin/UserEdit.jsx";
import NationalityManage from "./pages/admin/NationalityManage.jsx";
import NationalityAdd from "./pages/admin/NationalityAdd.jsx";
import NationalityEdit from "./pages/admin/NationalityEdit.jsx";
import UmrahDestinationManage from "./pages/admin/UmrahDestinationManage.jsx";
import UmrahDestinationAdd from "./pages/admin/UmrahDestinationAdd.jsx";
import UmrahDestinationEdit from "./pages/admin/UmrahDestinationEdit.jsx";
import AdminVisaManage from "./pages/admin/AdminVisaManage.jsx";
import AdminVisaAdd from "./pages/admin/AdminVisaAdd.jsx";
import AdminVisaEdit from "./pages/admin/AdminVisaEdit.jsx";
import CountryManage from "./pages/admin/CountryManage.jsx";
import CountryAdd from "./pages/admin/CountryAdd.jsx";
import CountryEdit from "./pages/admin/CountryEdit.jsx";
import VisaApplicationManage from "./pages/admin/VisaApplicationManage.jsx";
import VisaApplicationEdit from "./pages/admin/VisaApplicationEdit.jsx";
import CabEnquiryManage from "./pages/admin/CabEnquiryManage.jsx";
import CruiseEnquiryManage from "./pages/admin/CruiseEnquiryManage.jsx";
import HotelEnquiryManage from "./pages/admin/HotelEnquiryManage.jsx";
import GeneralEnquiryManage from "./pages/admin/GeneralEnquiryManage.jsx";
import SupplierManage from "./pages/admin/SupplierManage.jsx";
import SupplierAdd from "./pages/admin/SupplierAdd.jsx";
import SupplierEdit from "./pages/admin/SupplierEdit.jsx";
import CruiseCalendarManage from "./pages/admin/CruiseCalendarManage.jsx";
import CruiseCalendarAdd from "./pages/admin/CruiseCalendarAdd.jsx";
import CruiseCalendarEdit from "./pages/admin/CruiseCalendarEdit.jsx";
import AccommodationManage from "./pages/admin/AccommodationManage.jsx";
import AccommodationAdd from "./pages/admin/AccommodationAdd.jsx";
import AccommodationEdit from "./pages/admin/AccommodationEdit.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    // Only show if not on admin path and hasn't been shown before
    if (!isAdminPath) {
      const hasShown = sessionStorage.getItem("generalEnquiryShown");
      if (!hasShown) {
        const timer = setTimeout(() => {
          setIsEnquiryOpen(true);
          sessionStorage.setItem("generalEnquiryShown", "true");
        }, 3000); // Open after 3 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [isAdminPath]);

  return (
    <div className={`flex flex-col ${isAdminPath ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <ScrollToTop />

      {!isAdminPath && <Navbar />}

      <main className={`flex-1 ${isAdminPath ? 'flex flex-col min-h-0 overflow-hidden' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<div className="p-20 text-4xl font-black text-green-600">React is Working!</div>} />
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

          <Route path="/hotel" element={<Hotel />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/holiday/:id" element={<HolidayDetails />} />

          <Route path="/enquiry" element={<PackageEnquiryPage />} />
          <Route path="/visa" element={<VisaSearch />} />
          <Route path="/visa/results" element={<VisaResults />} />
          <Route path="/visa/apply/:id" element={<VisaApplication />} />
          <Route path="/Europeantours" element={<Europeantours />} />


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
            <Route path="/admin/holidays" element={<HolidayPackageManage />} />
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
            <Route path="/admin/sightseeing-masters" element={<SightseeingMasterManage />} />
            <Route path="/admin/sightseeing-masters/add" element={<SightseeingMasterAdd />} />
            <Route path="/admin/sightseeing-masters/edit/:id" element={<SightseeingMasterEdit />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/users/add" element={<UserAdd />} />
            <Route path="/admin/users/edit/:id" element={<UserEdit />} />
            <Route path="/admin/nationalities" element={<NationalityManage />} />
            <Route path="/admin/nationalities/add" element={<NationalityAdd />} />
            <Route path="/admin/nationalities/edit/:id" element={<NationalityEdit />} />
            <Route path="/admin/umrah-destinations" element={<UmrahDestinationManage />} />
            <Route path="/admin/umrah-destinations/add" element={<UmrahDestinationAdd />} />
            <Route path="/admin/umrah-destinations/edit/:id" element={<UmrahDestinationEdit />} />
            <Route path="/admin/visas" element={<AdminVisaManage />} />
            <Route path="/admin/visas/add" element={<AdminVisaAdd />} />
            <Route path="/admin/visas/edit/:id" element={<AdminVisaEdit />} />
            <Route path="/admin/countries" element={<CountryManage />} />
            <Route path="/admin/countries/add" element={<CountryAdd />} />
            <Route path="/admin/countries/edit/:id" element={<CountryEdit />} />
            <Route path="/admin/visa-applications" element={<VisaApplicationManage />} />
            <Route path="/admin/visa-applications/edit/:id" element={<VisaApplicationEdit />} />
            <Route path="/admin/cab-enquiries" element={<CabEnquiryManage />} />
            <Route path="/admin/cruise-enquiries" element={<CruiseEnquiryManage />} />
            <Route path="/admin/hotel-enquiries" element={<HotelEnquiryManage />} />
            <Route path="/admin/general-enquiries" element={<GeneralEnquiryManage />} />
            <Route path="/admin/suppliers" element={<SupplierManage />} />
            <Route path="/admin/suppliers/add" element={<SupplierAdd />} />
            <Route path="/admin/suppliers/edit/:id" element={<SupplierEdit />} />
            <Route path="/admin/cruise-calendar" element={<CruiseCalendarManage />} />
            <Route path="/admin/cruise-calendar/add" element={<CruiseCalendarAdd />} />
            <Route path="/admin/cruise-calendar/edit/:id" element={<CruiseCalendarEdit />} />
            <Route path="/admin/accommodations" element={<AccommodationManage />} />
            <Route path="/admin/accommodations/add" element={<AccommodationAdd />} />
            <Route path="/admin/accommodations/edit/:id" element={<AccommodationEdit />} />
          </Route>
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
      <EnquiryForm isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  );
};

export default App
