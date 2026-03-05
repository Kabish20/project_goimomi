from rest_framework.routers import SimpleRouter
from django.urls import path, include
from .views import *

router = SimpleRouter()
router.register("holiday-form", HolidayEnquiryAPI)
router.register("umrah-form", UmrahEnquiryAPI)
router.register("enquiry-form", EnquiryAPI)
router.register("packages", HolidayPackageViewSet)
router.register("destinations", DestinationViewSet)
router.register("starting-cities", StartingCityViewSet)
router.register("itinerary-masters", ItineraryMasterViewSet)
router.register("users", UserViewSet)
router.register("nationalities", NationalityViewSet)
router.register("umrah-destinations", UmrahDestinationViewSet)
router.register("visas", VisaViewSet)
router.register("visa-applications", VisaApplicationViewSet)
router.register("visa-applicants", VisaApplicantViewSet)
router.register("additional-documents", VisaAdditionalDocumentViewSet)
router.register("countries", CountryViewSet)
router.register("suppliers", SupplierViewSet)
router.register("cruise-calendar", CruiseCalendarViewSet)
router.register("hotel-masters", HotelMasterViewSet)
router.register("airlines", AirlineViewSet)
router.register("sightseeing-masters", SightseeingMasterViewSet)
router.register("meal-masters", MealMasterViewSet)
router.register("vehicle-brands", VehicleBrandViewSet)
router.register("accommodations", AccommodationViewSet)
router.register("room-types", RoomTypeViewSet)
router.register("vehicle-masters", VehicleMasterViewSet)
router.register("driver-masters", DriverMasterViewSet)
router.register("vehicle-rate-cards", VehicleRateCardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('send-visa-details/', SendVisaDetailsAPI.as_view(), name='send-visa-details'),
]
