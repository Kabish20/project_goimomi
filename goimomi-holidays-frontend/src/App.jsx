import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import EnquiryForm from './components/EnquiryForm.jsx'

// Lazy Load Pages
const Home = lazy(() => import('./pages/General/Home/Home.jsx'));
const About = lazy(() => import('./pages/General/Aboutus/Aboutus.jsx'));
const Contact = lazy(() => import('./pages/General/Contactus/Contactus.jsx'));
const ContactSuccess = lazy(() => import('./pages/General/ContactSuccess/ContactSuccess.jsx'));
const CustomizedHolidays = lazy(() => import('./pages/Holidays/CustomizedHolidays/CustomizedHolidays.jsx'));
const CustomizedUmrah = lazy(() => import('./pages/Umrah/CustomizedUmrah/CustomizedUmrah.jsx'));
const Holidays = lazy(() => import('./pages/Holidays/Holidays/Holidays.jsx'));
const PlanTrip = lazy(() => import('./pages/Holidays/Holidaysform/Holidaysform.jsx'));
const Cab = lazy(() => import('./pages/Services/cab/cab.jsx'));
const Cruise = lazy(() => import('./pages/Services/Cruise/Cruise.jsx'));
const VisaSearch = lazy(() => import('./pages/Visa/VisaSearch/VisaSearch.jsx'));
const VisaResults = lazy(() => import('./pages/Visa/VisaResults/VisaResults.jsx'));
const VisaApplication = lazy(() => import('./pages/Visa/VisaApplication/VisaApplication.jsx'));
const Europeantours = lazy(() => import('./pages/Holidays/Europeantours/Europeantours.jsx'));
const Hotel = lazy(() => import('./pages/Services/hotel/hotel.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/Policies/PrivacyPolicy/PrivacyPolicy.jsx'));
const TermsConditions = lazy(() => import('./pages/Policies/TermsConditions/TermsConditions.jsx'));
const CancellationPolicy = lazy(() => import('./pages/Policies/CancellationPolicy/CancellationPolicy.jsx'));
const HolidayDetails = lazy(() => import("./pages/Holidays/HolidayDetails/HolidayDetails.jsx"));
const Canton = lazy(() => import("./pages/Business/Canton/Canton.jsx"));
const HolidayHome = lazy(() => import("./pages/Holidays/holidayhome/holidayhome.jsx"));
const PackageEnquiryPage = lazy(() => import("./pages/Holidays/PackageEnquiryPage/PackageEnquiryPage.jsx"));
const BusinessHome = lazy(() => import("./pages/Business/businesshome/businesshome.jsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard/AdminDashboard.jsx"));
const HolidayPackageAdd = lazy(() => import("./pages/admin/HolidayPackageAdd/HolidayPackageAdd.jsx"));
const HolidayPackageEdit = lazy(() => import("./pages/admin/HolidayPackageEdit/HolidayPackageEdit.jsx"));
const HolidayPackageManage = lazy(() => import("./pages/admin/HolidayPackageManage/HolidayPackageManage.jsx"));
const EnquiryManage = lazy(() => import("./pages/admin/EnquiryManage/EnquiryManage.jsx"));
const HolidayEnquiryManage = lazy(() => import("./pages/admin/HolidayEnquiryManage/HolidayEnquiryManage.jsx"));
const HolidayEnquiryAdd = lazy(() => import("./pages/admin/HolidayEnquiryAdd/HolidayEnquiryAdd.jsx"));
const UmrahEnquiryAdd = lazy(() => import("./pages/admin/UmrahEnquiryAdd/UmrahEnquiryAdd.jsx"));
const UmrahEnquiryManage = lazy(() => import("./pages/admin/UmrahEnquiryManage/UmrahEnquiryManage.jsx"));
const ItineraryMasterManage = lazy(() => import("./pages/admin/ItineraryMasterManage/ItineraryMasterManage.jsx"));
const ItineraryMasterEdit = lazy(() => import("./pages/admin/ItineraryMasterEdit/ItineraryMasterEdit.jsx"));
const ItineraryMasterAdd = lazy(() => import("./pages/admin/ItineraryMasterAdd/ItineraryMasterAdd.jsx"));
const SightseeingMasterManage = lazy(() => import("./pages/admin/SightseeingMasterManage/SightseeingMasterManage.jsx"));
const SightseeingMasterAdd = lazy(() => import("./pages/admin/SightseeingMasterAdd/SightseeingMasterAdd.jsx"));
const SightseeingMasterEdit = lazy(() => import("./pages/admin/SightseeingMasterEdit/SightseeingMasterEdit.jsx"));
const UsersList = lazy(() => import("./pages/admin/UsersList/UsersList.jsx"));
const UserAdd = lazy(() => import("./pages/admin/UserAdd/UserAdd.jsx"));
const UserEdit = lazy(() => import("./pages/admin/UserEdit/UserEdit.jsx"));
const AdminVisaManage = lazy(() => import("./pages/admin/AdminVisaManage/AdminVisaManage.jsx"));
const AdminVisaAdd = lazy(() => import("./pages/admin/AdminVisaAdd/AdminVisaAdd.jsx"));
const AdminVisaEdit = lazy(() => import("./pages/admin/AdminVisaEdit/AdminVisaEdit.jsx"));
const VisaApplicationManage = lazy(() => import("./pages/admin/VisaApplicationManage/VisaApplicationManage.jsx"));
const VisaApplicationEdit = lazy(() => import("./pages/admin/VisaApplicationEdit/VisaApplicationEdit.jsx"));
const CantonEnquiryManage = lazy(() => import("./pages/admin/CantonEnquiryManage/CantonEnquiryManage.jsx"));
const CabEnquiryManage = lazy(() => import("./pages/admin/CabEnquiryManage/CabEnquiryManage.jsx"));
const CabBookingManage = lazy(() => import("./pages/admin/CabBookingManage/CabBookingManage.jsx"));
const CruiseEnquiryManage = lazy(() => import("./pages/admin/CruiseEnquiryManage/CruiseEnquiryManage.jsx"));
const HotelEnquiryManage = lazy(() => import("./pages/admin/HotelEnquiryManage/HotelEnquiryManage.jsx"));
const GeneralEnquiryManage = lazy(() => import("./pages/admin/GeneralEnquiryManage/GeneralEnquiryManage.jsx"));
const SupplierManage = lazy(() => import("./pages/admin/SupplierManage/SupplierManage.jsx"));
const SupplierAdd = lazy(() => import("./pages/admin/SupplierAdd/SupplierAdd.jsx"));
const SupplierEdit = lazy(() => import("./pages/admin/SupplierEdit/SupplierEdit.jsx"));
const CruiseCalendarManage = lazy(() => import("./pages/admin/CruiseCalendarManage/CruiseCalendarManage.jsx"));
const CruiseCalendarAdd = lazy(() => import("./pages/admin/CruiseCalendarAdd/CruiseCalendarAdd.jsx"));
const CruiseCalendarEdit = lazy(() => import("./pages/admin/CruiseCalendarEdit/CruiseCalendarEdit.jsx"));
const AccommodationManage = lazy(() => import("./pages/admin/AccommodationManage/AccommodationManage.jsx"));
const AccommodationAdd = lazy(() => import("./pages/admin/AccommodationAdd/AccommodationAdd.jsx"));
const AccommodationEdit = lazy(() => import("./pages/admin/AccommodationEdit/AccommodationEdit.jsx"));
const VehicleMasterManage = lazy(() => import("./pages/admin/VehicleMasterManage/VehicleMasterManage.jsx"));
const VehicleMasterAdd = lazy(() => import("./pages/admin/VehicleMasterAdd/VehicleMasterAdd.jsx"));
const VehicleMasterEdit = lazy(() => import("./pages/admin/VehicleMasterEdit/VehicleMasterEdit.jsx"));
const DriverMasterManage = lazy(() => import("./pages/admin/DriverMasterManage/DriverMasterManage.jsx"));
const DriverMasterAdd = lazy(() => import("./pages/admin/DriverMasterAdd/DriverMasterAdd.jsx"));
const DriverMasterEdit = lazy(() => import("./pages/admin/DriverMasterEdit/DriverMasterEdit.jsx"));
const VehicleRateCardManage = lazy(() => import("./pages/admin/VehicleRateCardManage/VehicleRateCardManage.jsx"));
const VehicleRateCardAdd = lazy(() => import("./pages/admin/VehicleRateCardAdd/VehicleRateCardAdd.jsx"));
const VehicleRateCardEdit = lazy(() => import("./pages/admin/VehicleRateCardEdit/VehicleRateCardEdit.jsx"));
const PickupPointManage = lazy(() => import("./pages/admin/PickupPointManage/PickupPointManage.jsx"));
const CountryManagement = lazy(() => import("./pages/admin/CountryManagement/CountryManagement.jsx"));
const CountryAdd = lazy(() => import("./pages/admin/CountryAdd/CountryAdd.jsx"));
const CountryEdit = lazy(() => import("./pages/admin/CountryEdit/CountryEdit.jsx"));
const NationalityManage = lazy(() => import("./pages/admin/NationalityManage/NationalityManage.jsx"));
const NationalityAdd = lazy(() => import("./pages/admin/NationalityAdd/NationalityAdd.jsx"));
const NationalityEdit = lazy(() => import("./pages/admin/NationalityEdit/NationalityEdit.jsx"));
const RegionManage = lazy(() => import("./pages/admin/RegionManage/RegionManage.jsx"));
const RegionAdd = lazy(() => import("./pages/admin/RegionAdd/RegionAdd.jsx"));
const RegionEdit = lazy(() => import("./pages/admin/RegionEdit/RegionEdit.jsx"));
const CityManage = lazy(() => import("./pages/admin/CityManage/CityManage.jsx"));
const CityAdd = lazy(() => import("./pages/admin/CityAdd/CityAdd.jsx"));
const CityEdit = lazy(() => import("./pages/admin/CityEdit/CityEdit.jsx"));
const AirportManage = lazy(() => import("./pages/admin/AirportManage/AirportManage.jsx"));
const CruiseTerminalManage = lazy(() => import("./pages/admin/CruiseTerminalManage/CruiseTerminalManage.jsx"));

const AdminLogin = lazy(() => import("./pages/General/AdminLogin/AdminLogin.jsx"));
import ProtectedRoute from "./components/admin/ProtectedRoute/ProtectedRoute";

import ErrorBoundary from './components/ErrorBoundary.jsx'

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

  // Global IntersectionObserver for .fade-up animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-up:not(.visible)');
      elements.forEach(el => {
        if (el.style.animationDelay) {
          el.style.setProperty('--delay', el.style.animationDelay);
        }
        observer.observe(el);
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className={`flex flex-col ${isAdminPath ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <ScrollToTop />

      {!isAdminPath && <Navbar />}

      <main className={`flex-1 ${isAdminPath ? 'flex flex-col min-h-0 overflow-hidden' : ''}`}>
        <ErrorBoundary>
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
      </ErrorBoundary>
    </main>

    {!isAdminPath && <Footer />}
      <EnquiryForm isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  );
};

export default App



