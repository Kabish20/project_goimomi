from rest_framework.routers import DefaultRouter, SimpleRouter
from django.urls import path, include
from django.conf import settings
from . import views

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()
router.register("holiday-form", views.HolidayEnquiryAPI, basename="holiday-enquiry")
router.register("umrah-form", views.UmrahEnquiryAPI, basename="umrah-enquiry")
router.register("enquiry-form", views.EnquiryAPI, basename="enquiry")
router.register("canton-enquiries", views.CantonEnquiryAPI, basename="canton-enquiry")
router.register("cruise-terminals", views.CruiseTerminalViewSet, basename="cruise-terminal")
router.register("airports", views.AirportViewSet, basename="airport")
router.register("countries", views.CountryViewSet, basename="country")
router.register("nationalities", views.NationalityViewSet, basename="nationality")
router.register("regions", views.RegionViewSet, basename="region")
router.register("cities", views.CityViewSet, basename="city")
router.register("packages", views.HolidayPackageViewSet, basename="package")
router.register("itinerary-masters", views.ItineraryMasterViewSet, basename="itinerary-master")
router.register("users", views.UserViewSet, basename="user")
router.register("visas", views.VisaViewSet, basename="visa")
router.register("visa-applications", views.VisaApplicationViewSet, basename="visa-application")
router.register("visa-applicants", views.VisaApplicantViewSet, basename="visa-applicant")
router.register("additional-documents", views.VisaAdditionalDocumentViewSet, basename="additional-document")
router.register("suppliers", views.SupplierViewSet, basename="supplier")
router.register("cruise-calendar", views.CruiseCalendarViewSet, basename="cruise-calendar")
router.register("hotel-masters", views.HotelMasterViewSet, basename="hotel-master")
router.register("airlines", views.AirlineViewSet, basename="airline")
router.register("sightseeing-masters", views.SightseeingMasterViewSet, basename="sightseeing-master")
router.register("meal-masters", views.MealMasterViewSet, basename="meal-master")
router.register("vehicle-brands", views.VehicleBrandViewSet, basename="vehiclebrand")
router.register("accommodations", views.AccommodationViewSet, basename="accommodation")
router.register("room-types", views.RoomTypeViewSet, basename="room-type")
router.register("vehicle-masters", views.VehicleMasterViewSet, basename="vehicle-master")
router.register("driver-masters", views.DriverMasterViewSet, basename="driver-master")
router.register("vehicle-rate-cards", views.VehicleRateCardViewSet, basename="vehicle-rate-card")
router.register("pickup-point-masters", views.PickupPointMasterViewSet, basename="pickup-point-master")
router.register("cab-bookings", views.CabBookingViewSet, basename="cab-booking")
router.register("cab-additional-documents", views.CabAdditionalDocumentViewSet, basename="cab-additional-document")

urlpatterns = [
    path('', include(router.urls)),
    path('admin-login/', views.AdminLoginView.as_view(), name='admin-login'),
    path('send-visa-details/', views.SendVisaDetailsAPI.as_view(), name='send-visa-details'),
    path('cab-search/', views.CabSearchAPI.as_view(), name='cab-search'),
    path('destination-hierarchy/', views.DestinationHierarchyAPI.as_view(), name='destination-hierarchy'),
    
    # Catch-all for Frontend pages to provide dynamic SEO for crawlers
    # Warning: Only use this if you want Django to handle the initial page load
    path('share/<path:path>/', views.DynamicSEOView.as_view(), name='dynamic-seo-share'),
]
