from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

router = DefaultRouter()
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

urlpatterns = [
    path('', include(router.urls)),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
]
