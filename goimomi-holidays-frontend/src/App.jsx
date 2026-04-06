import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import EnquiryForm from './components/EnquiryForm.jsx'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/Aboutus.jsx'));
const Contact = lazy(() => import('./pages/Contactus.jsx'));
const ContactSuccess = lazy(() => import('./pages/ContactSuccess.jsx'));
const CustomizedHolidays = lazy(() => import('./pages/CustomizedHolidays.jsx'));
const CustomizedUmrah = lazy(() => import('./pages/CustomizedUmrah.jsx'));
const Holidays = lazy(() => import('./pages/Holidays.jsx'));
const PlanTrip = lazy(() => import('./pages/Holidaysform.jsx'));
const Cab = lazy(() => import('./pages/cab.jsx'));
const Cruise = lazy(() => import('./pages/Cruise.jsx'));
const VisaSearch = lazy(() => import('./pages/VisaSearch.jsx'));
const VisaResults = lazy(() => import('./pages/VisaResults.jsx'));
const VisaApplication = lazy(() => import('./pages/VisaApplication.jsx'));
const Europeantours = lazy(() => import('./pages/Europeantours.jsx'));
const Hotel = lazy(() => import('./pages/hotel.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsConditions = lazy(() => import('./pages/TermsConditions.jsx'));
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy.jsx'));
const HolidayDetails = lazy(() => import("./pages/HolidayDetails.jsx"));
const Canton = lazy(() => import("./pages/Canton.jsx"));
const HolidayHome = lazy(() => import("./pages/holidayhome.jsx"));
const PackageEnquiryPage = lazy(() => import("./pages/PackageEnquiryPage.jsx"));
const BusinessHome = lazy(() => import("./pages/businesshome.jsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const HolidayPackageAdd = lazy(() => import("./pages/admin/HolidayPackageAdd.jsx"));
const HolidayPackageEdit = lazy(() => import("./pages/admin/HolidayPackageEdit.jsx"));
const HolidayPackageManage = lazy(() => import("./pages/admin/HolidayPackageManage.jsx"));
const EnquiryManage = lazy(() => import("./pages/admin/EnquiryManage.jsx"));
const HolidayEnquiryManage = lazy(() => import("./pages/admin/HolidayEnquiryManage.jsx"));
const HolidayEnquiryAdd = lazy(() => import("./pages/admin/HolidayEnquiryAdd.jsx"));
const UmrahEnquiryAdd = lazy(() => import("./pages/admin/UmrahEnquiryAdd.jsx"));
const UmrahEnquiryManage = lazy(() => import("./pages/admin/UmrahEnquiryManage.jsx"));
const ItineraryMasterManage = lazy(() => import("./pages/admin/ItineraryMasterManage.jsx"));
const ItineraryMasterEdit = lazy(() => import("./pages/admin/ItineraryMasterEdit.jsx"));
const ItineraryMasterAdd = lazy(() => import("./pages/admin/ItineraryMasterAdd.jsx"));
const SightseeingMasterManage = lazy(() => import("./pages/admin/SightseeingMasterManage.jsx"));
const SightseeingMasterAdd = lazy(() => import("./pages/admin/SightseeingMasterAdd.jsx"));
const SightseeingMasterEdit = lazy(() => import("./pages/admin/SightseeingMasterEdit.jsx"));
const UsersList = lazy(() => import("./pages/admin/UsersList.jsx"));
const UserAdd = lazy(() => import("./pages/admin/UserAdd.jsx"));
const UserEdit = lazy(() => import("./pages/admin/UserEdit.jsx"));
const AdminVisaManage = lazy(() => import("./pages/admin/AdminVisaManage.jsx"));
const AdminVisaAdd = lazy(() => import("./pages/admin/AdminVisaAdd.jsx"));
const AdminVisaEdit = lazy(() => import("./pages/admin/AdminVisaEdit.jsx"));
const VisaApplicationManage = lazy(() => import("./pages/admin/VisaApplicationManage.jsx"));
const VisaApplicationEdit = lazy(() => import("./pages/admin/VisaApplicationEdit.jsx"));
const CantonEnquiryManage = lazy(() => import("./pages/admin/CantonEnquiryManage.jsx"));
const CabEnquiryManage = lazy(() => import("./pages/admin/CabEnquiryManage.jsx"));
const CabBookingManage = lazy(() => import("./pages/admin/CabBookingManage.jsx"));
const CruiseEnquiryManage = lazy(() => import("./pages/admin/CruiseEnquiryManage.jsx"));
const HotelEnquiryManage = lazy(() => import("./pages/admin/HotelEnquiryManage.jsx"));
const GeneralEnquiryManage = lazy(() => import("./pages/admin/GeneralEnquiryManage.jsx"));
const SupplierManage = lazy(() => import("./pages/admin/SupplierManage.jsx"));
const SupplierAdd = lazy(() => import("./pages/admin/SupplierAdd.jsx"));
const SupplierEdit = lazy(() => import("./pages/admin/SupplierEdit.jsx"));
const CruiseCalendarManage = lazy(() => import("./pages/admin/CruiseCalendarManage.jsx"));
const CruiseCalendarAdd = lazy(() => import("./pages/admin/CruiseCalendarAdd.jsx"));
const CruiseCalendarEdit = lazy(() => import("./pages/admin/CruiseCalendarEdit.jsx"));
const AccommodationManage = lazy(() => import("./pages/admin/AccommodationManage.jsx"));
const AccommodationAdd = lazy(() => import("./pages/admin/AccommodationAdd.jsx"));
const AccommodationEdit = lazy(() => import("./pages/admin/AccommodationEdit.jsx"));
const VehicleMasterManage = lazy(() => import("./pages/admin/VehicleMasterManage.jsx"));
const VehicleMasterAdd = lazy(() => import("./pages/admin/VehicleMasterAdd.jsx"));
const VehicleMasterEdit = lazy(() => import("./pages/admin/VehicleMasterEdit.jsx"));
const DriverMasterManage = lazy(() => import("./pages/admin/DriverMasterManage.jsx"));
const DriverMasterAdd = lazy(() => import("./pages/admin/DriverMasterAdd.jsx"));
const DriverMasterEdit = lazy(() => import("./pages/admin/DriverMasterEdit.jsx"));
const VehicleRateCardManage = lazy(() => import("./pages/admin/VehicleRateCardManage.jsx"));
const VehicleRateCardAdd = lazy(() => import("./pages/admin/VehicleRateCardAdd.jsx"));
const VehicleRateCardEdit = lazy(() => import("./pages/admin/VehicleRateCardEdit.jsx"));
const PickupPointManage = lazy(() => import("./pages/admin/PickupPointManage.jsx"));
const CountryManagement = lazy(() => import("./pages/admin/CountryManagement.jsx"));
const CountryAdd = lazy(() => import("./pages/admin/CountryAdd.jsx"));
const CountryEdit = lazy(() => import("./pages/admin/CountryEdit.jsx"));
const NationalityManage = lazy(() => import("./pages/admin/NationalityManage.jsx"));
const NationalityAdd = lazy(() => import("./pages/admin/NationalityAdd.jsx"));
const NationalityEdit = lazy(() => import("./pages/admin/NationalityEdit.jsx"));
const RegionManage = lazy(() => import("./pages/admin/RegionManage.jsx"));
const RegionAdd = lazy(() => import("./pages/admin/RegionAdd.jsx"));
const RegionEdit = lazy(() => import("./pages/admin/RegionEdit.jsx"));
const CityManage = lazy(() => import("./pages/admin/CityManage.jsx"));
const CityAdd = lazy(() => import("./pages/admin/CityAdd.jsx"));
const CityEdit = lazy(() => import("./pages/admin/CityEdit.jsx"));
const AirportManage = lazy(() => import("./pages/admin/AirportManage.jsx"));
const CruiseTerminalManage = lazy(() => import("./pages/admin/CruiseTerminalManage.jsx"));

const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-[#14532d] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/canton" element={<Canton />} />
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<div className="p-20 text-4xl font-black text-green-600">React is Working!</div>} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/contactus" element={<Contact />} />
            <Route path="/contact/success" element={<ContactSuccess />} />
            <Route path="/holidayhome" element={<HolidayHome />} />
            <Route path="/businesshome" element={<BusinessHome />} />
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/packages/add" element={<HolidayPackageAdd />} />
              <Route path="/admin/packages/edit/:id" element={<HolidayPackageEdit />} />
              <Route path="/admin/packages" element={<HolidayPackageManage />} />
              <Route path="/admin/holidays" element={<HolidayPackageManage />} />
              <Route path="/admin/enquiries" element={<EnquiryManage />} />
              <Route path="/admin/holiday-enquiries/add" element={<HolidayEnquiryAdd />} />
              <Route path="/admin/holiday-enquiries" element={<HolidayEnquiryManage />} />
              <Route path="/admin/umrah-enquiries/add" element={<UmrahEnquiryAdd />} />
              <Route path="/admin/umrah-enquiries" element={<UmrahEnquiryManage />} />
              <Route path="/admin/itinerary-masters" element={<ItineraryMasterManage />} />
              <Route path="/admin/itinerary-masters/add" element={<ItineraryMasterAdd />} />
              <Route path="/admin/itinerary-masters/edit/:id" element={<ItineraryMasterEdit />} />
              <Route path="/admin/sightseeing-masters" element={<SightseeingMasterManage />} />
              <Route path="/admin/sightseeing-masters/add" element={<SightseeingMasterAdd />} />
              <Route path="/admin/sightseeing-masters/edit/:id" element={<SightseeingMasterEdit />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/users/add" element={<UserAdd />} />
              <Route path="/admin/users/edit/:id" element={<UserEdit />} />
              <Route path="/admin/visas" element={<AdminVisaManage />} />
              <Route path="/admin/visas/add" element={<AdminVisaAdd />} />
              <Route path="/admin/visas/edit/:id" element={<AdminVisaEdit />} />
              <Route path="/admin/visa-applications" element={<VisaApplicationManage />} />
              <Route path="/admin/visa-applications/edit/:id" element={<VisaApplicationEdit />} />
              <Route path="/admin/cab-enquiries" element={<CabEnquiryManage />} />
              <Route path="/admin/cab-bookings" element={<CabBookingManage />} />
              <Route path="/admin/canton-enquiries" element={<CantonEnquiryManage />} />
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
              <Route path="/admin/vehicle-masters" element={<VehicleMasterManage />} />
              <Route path="/admin/vehicle-masters/add" element={<VehicleMasterAdd />} />
              <Route path="/admin/vehicle-masters/edit/:id" element={<VehicleMasterEdit />} />
              <Route path="/admin/driver-masters" element={<DriverMasterManage />} />
              <Route path="/admin/driver-masters/add" element={<DriverMasterAdd />} />
              <Route path="/admin/driver-masters/edit/:id" element={<DriverMasterEdit />} />
              <Route path="/admin/vehicle-rate-cards" element={<VehicleRateCardManage />} />
              <Route path="/admin/vehicle-rate-cards/add" element={<VehicleRateCardAdd />} />
              <Route path="/admin/vehicle-rate-cards/edit/:id" element={<VehicleRateCardEdit />} />
              <Route path="/admin/pickup-point-masters" element={<PickupPointManage />} />

              {/* Management Country Routes */}
              <Route path="/admin/management-country" element={<CountryManagement />} />
              <Route path="/admin/management-country/countries/add" element={<CountryAdd />} />
              <Route path="/admin/management-country/countries/edit/:id" element={<CountryEdit />} />

              <Route path="/admin/management-country/nationalities" element={<NationalityManage />} />
              <Route path="/admin/management-country/nationalities/add" element={<NationalityAdd />} />
              <Route path="/admin/management-country/nationalities/edit/:id" element={<NationalityEdit />} />

              <Route path="/admin/management-country/regions" element={<RegionManage />} />
              <Route path="/admin/management-country/regions/add" element={<RegionAdd />} />
              <Route path="/admin/management-country/regions/edit/:id" element={<RegionEdit />} />

              <Route path="/admin/management-country/cities" element={<CityManage />} />
              <Route path="/admin/management-country/cities/add" element={<CityAdd />} />
              <Route path="/admin/management-country/cities/edit/:id" element={<CityEdit />} />

              <Route path="/admin/management-country/airports" element={<AirportManage />} />
              <Route path="/admin/management-country/pickup-points" element={<PickupPointManage />} />
              <Route path="/admin/management-country/cruise-terminals" element={<CruiseTerminalManage />} />
            </Route>

            {/* User-friendly aliases and catch-all */}
            <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admindashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin%20dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminPath && <Footer />}
      <EnquiryForm isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  );
};

export default App
