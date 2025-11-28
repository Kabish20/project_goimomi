from django.urls import path # pyright: ignore[reportMissingModuleSource]
from django.views.generic import TemplateView # pyright: ignore[reportMissingModuleSource]
from rest_framework.routers import DefaultRouter # type: ignore

from .views import (
    home_view,
    aboutus_view,
    contact_view,
    contact_success_view,
    terms_view,
    privacy_view,
    cancellation_view,
    ContactMessageViewSet,
    CustomizedHolidayViewSet,
    CustomizedUmrahViewSet,
    customized_holidays,
    customized_umrah,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'contact-messages', ContactMessageViewSet, basename='contactmessage')
router.register(r'customized-holidays', CustomizedHolidayViewSet, basename='customizedholiday')
router.register(r'customized-umrah', CustomizedUmrahViewSet, basename='customizedumrah')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', home_view, name='home'),
    path('about/', aboutus_view, name='about'),
    path('contact/', contact_view, name='contact'),
    path('contact/success/', contact_success_view, name='contact_success'),
    path('terms/', terms_view, name='terms'),
    path('privacy/', privacy_view, name='privacy'),
    path('cancellation/', cancellation_view, name='cancellation'),
    path('customized-holidays/', customized_holidays, name='customized_holidays'),
    path('customized-umrah/', customized_umrah, name='customized_umrah'),
]

# Add router URLs to the urlpatterns
urlpatterns += router.urls
