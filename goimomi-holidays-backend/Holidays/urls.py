from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register("holiday-form", views.HolidayEnquiryAPI, basename="holiday-enquiry")
router.register("umrah-form", views.UmrahEnquiryAPI, basename="umrah-enquiry")
router.register("enquiry-form", views.EnquiryAPI, basename="enquiry")
router.register("packages", views.HolidayPackageViewSet, basename="package")
router.register("destinations", views.DestinationViewSet, basename="destination")
router.register("starting-cities", views.StartingCityViewSet, basename="starting-city")
router.register("itinerary-masters", views.ItineraryMasterViewSet, basename="itinerary-master")
router.register("users", views.UserViewSet, basename="user")
router.register("nationalities", views.NationalityViewSet, basename="nationality")
router.register("umrah-destinations", views.UmrahDestinationViewSet, basename="umrah-destination")
router.register("visas", views.VisaViewSet, basename="visa")
router.register("visa-applications", views.VisaApplicationViewSet, basename="visa-application")
router.register("visa-applicants", views.VisaApplicantViewSet, basename="visa-applicant")
router.register("additional-documents", views.VisaAdditionalDocumentViewSet, basename="additional-document")
router.register("countries", views.CountryViewSet, basename="country")
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
]
