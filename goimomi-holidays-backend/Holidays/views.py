import json
import requests as http_requests

# Django Imports
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db.models import Q, F


# Rest Framework Imports
from rest_framework import status, serializers
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, ViewSet
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework.throttling import AnonRateThrottle

class IsAuthenticatedOrWriteOnly(BasePermission):
    """
    Allow any user to POST (create) a resource,
    but require authentication for any other action (read, update, delete).
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return request.user and request.user.is_authenticated

class EmailSharingRateThrottle(AnonRateThrottle):
    rate = '5/minute' # limit email requests to 5 per minute per IP


from .models import (
    HolidayEnquiry, UmrahEnquiry, Enquiry, HolidayPackage,
    ItineraryMaster, Visa,
    VisaApplication, VisaApplicant, VisaAdditionalDocument,
    Supplier, CruiseCalendar, HotelMaster, Airline, SightseeingMaster,
    SightseeingImage, MealMaster, VehicleBrand, Accommodation,
    AccommodationImage, RoomType, VehicleMaster, DriverMaster,
    VehicleRateCard, PickupPointMaster, CabBooking, CabAdditionalDocument,
    CancellationPolicy, CantonEnquiry, City, Region, Nationality, Country, Airport, CruiseTerminal, OTPVerification
)
from .serializers import (
    HolidayEnquirySerializer, UmrahEnquirySerializer, EnquirySerializer,
    HolidayPackageSerializer,
    ItineraryMasterSerializer, UserSerializer,
    VisaSerializer, VisaApplicationSerializer,
    VisaApplicantSerializer, VisaAdditionalDocumentSerializer,
    SupplierSerializer, CruiseCalendarSerializer,
    HotelMasterSerializer, AirlineSerializer, SightseeingMasterSerializer,
    MealMasterSerializer, VehicleBrandSerializer, AccommodationSerializer,
    RoomTypeSerializer, VehicleMasterSerializer, DriverMasterSerializer,
    VehicleRateCardSerializer, PickupPointMasterSerializer,
    CabBookingSerializer, CabAdditionalDocumentSerializer,
    CancellationPolicySerializer, CantonEnquirySerializer, CitySerializer,
    RegionSerializer, NationalitySerializer, CountrySerializer, AirportSerializer, CruiseTerminalSerializer,
)



class CantonEnquiryAPI(ModelViewSet):
    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = CantonEnquiry.objects.all().order_by('-created_at')
    serializer_class = CantonEnquirySerializer
    pagination_class = None

class AirportViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = AirportSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Airport.objects.all().order_by('name')
        city_id = self.request.query_params.get('city_id')
        country_id = self.request.query_params.get('country_id')
        if city_id and city_id != 'undefined':
            queryset = queryset.filter(city_id=city_id)
        if country_id and country_id != 'undefined':
            queryset = queryset.filter(city__country_id=country_id)
        return queryset

class CruiseTerminalViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CruiseTerminalSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CruiseTerminal.objects.all().order_by('terminal_name')
        country_id = self.request.query_params.get('country_id')
        if country_id and country_id != 'undefined':
            queryset = queryset.filter(city__country_id=country_id)
        return queryset

class CountryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer
    pagination_class = None

class NationalityViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = NationalitySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Nationality.objects.all().order_by('name')
        country_id = self.request.query_params.get('country_id')
        if country_id:
            queryset = queryset.filter(country_id=country_id)
        return queryset

class RegionViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = RegionSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Region.objects.all().order_by('name')
        country_id = self.request.query_params.get('country_id')
        if country_id and country_id != 'undefined':
            queryset = queryset.filter(country_id=country_id)
        return queryset

class CityViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CitySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = City.objects.exclude(name='Jeddah (JED)').order_by('name')
        region_id = self.request.query_params.get('region_id')
        country_id = self.request.query_params.get('country_id')
        if region_id and region_id != 'undefined':
            queryset = queryset.filter(region_id=region_id)
        if country_id and country_id != 'undefined':
            queryset = queryset.filter(country_id=country_id)
        return queryset

    def list(self, request, *args, **kwargs):
        print("DEBUG: CityViewSet list called!")
        queryset = self.get_queryset().select_related('country', 'region').values(
            'id', 'name', 
            country_name=F('country__name'), 
            region_name=F('region__name')
        )
        res_list = list(queryset)
        print(f"DEBUG: CityViewSet returning {len(res_list)} cities.")
        return Response(res_list)

class DashboardStatsAPI(APIView):
    """
    Optimized endpoint for the Admin Dashboard Hub.
    Returns all counts and the recent consolidated enquiries list in ONE request.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Counts (Cheap operations)
        stats = {
            "packages": HolidayPackage.objects.count(),
            "enquiries": Enquiry.objects.count(),
            "holidayEnquiries": HolidayEnquiry.objects.count(),
            "umrahEnquiries": UmrahEnquiry.objects.count(),
            "itineraryMasters": ItineraryMaster.objects.count(),
            "visas": Visa.objects.count(),
            "visaApplications": VisaApplication.objects.count(),
            "cantonEnquiries": CantonEnquiry.objects.count(),
            "cabBookings": CabBooking.objects.count(),
            "cabEnquiries": Enquiry.objects.filter(enquiry_type='Cab').count(),
            "cruiseEnquiries": Enquiry.objects.filter(enquiry_type='Cruise').count(),
            "hotelEnquiries": Enquiry.objects.filter(enquiry_type='Hotel').count(),
        }

        # 2. Recent Enquiries (Limited to 10 latest across types to avoid heavy load)
        recent = []
        
        # General/Other Enquiries (Enquiry model handles Cab, Cruise, Hotel, Business)
        for e in Enquiry.objects.all().order_by('-created_at')[:8]:
            purpose = e.purpose
            if e.enquiry_type == 'Cab':
                purpose = f"Cab: {e.vehicle or 'N/A'} - {e.from_city or 'N/A'} to {e.to_city or 'N/A'}"
            elif e.enquiry_type == 'Cruise':
                purpose = f"Cruise: {e.destination or 'N/A'} at {e.from_city or 'N/A'}"
            
            recent.append({
                "id": e.id, "type": e.enquiry_type or "General", "name": e.name, 
                "email": e.email, "phone": e.phone, "created_at": e.created_at, "purpose": purpose or "No details provided"
            })
        
        # Holiday Enquiries
        for e in HolidayEnquiry.objects.all().order_by('-created_at')[:5]:
            recent.append({
                "id": e.id, "type": "Holiday", "name": e.full_name, "email": e.email, "phone": e.phone,
                "created_at": e.created_at, "purpose": f"Package: {e.package_type or 'N/A'}"
            })

        # Umrah Enquiries
        for e in UmrahEnquiry.objects.all().order_by('-created_at')[:5]:
            recent.append({
                "id": e.id, "type": "Umrah", "name": e.full_name, "email": e.email, "phone": e.phone, 
                "created_at": e.created_at, "purpose": "Umrah Journey"
            })

        # Visa Applications
        for e in VisaApplication.objects.select_related('visa').prefetch_related('applicants').all().order_by('-created_at')[:5]:
            # Get primary applicant details
            app = e.applicants.first()
            name = f"{app.first_name} {app.last_name}" if app else "No Applicant"
            phone = app.phone if app else "—"
            recent.append({
                "id": e.id, "type": "Visa", "name": name, "email": "—", "phone": phone,
                "created_at": e.created_at, "purpose": f"Visa for {e.visa.country or 'N/A'}"
            })

        # Canton Enquiries
        for e in CantonEnquiry.objects.all().order_by('-created_at')[:5]:
            recent.append({
                "id": e.id, "type": "Canton", "name": e.full_name, "email": "—", "phone": e.whatsapp_number,
                "created_at": e.created_at, "purpose": f"Phase: {e.selected_phase} ({e.business_name or 'N/A'})"
            })

        # Cab Bookings
        for e in CabBooking.objects.all().order_by('-created_at')[:5]:
            recent.append({
                "id": e.id, "type": "Cab Booking", "name": f"{e.first_name} {e.last_name}", "email": e.email or "—",
                "phone": e.phone, "created_at": e.created_at, "purpose": f"{e.from_city} to {e.to_city} ({e.vehicle_name})"
            })

        # Sort combined list and take top 10
        # Convert all to list then sort securely
        recent.sort(key=lambda x: x['created_at'], reverse=True)
        recent = recent[:10]

        return Response({
            "stats": stats,
            "recentEnquiries": recent
        })

@authentication_classes([])
@permission_classes([AllowAny])
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_staff:
                return Response({
                    "success": True,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "is_superuser": user.is_superuser
                    }
                })
            else:
                return Response({"error": "Access denied. Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



class HolidayEnquiryAPI(ModelViewSet):
    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = HolidayEnquiry.objects.all()
    serializer_class = HolidayEnquirySerializer
    pagination_class = None

    def perform_create(self, serializer):
        enquiry = serializer.save()
        try:
            from .utils import send_enquiry_email
            send_enquiry_email(enquiry, "Holiday Package")
        except Exception as e:
            print(f"Error calling send_enquiry_email: {e}")


class UmrahEnquiryAPI(ModelViewSet):
    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = UmrahEnquiry.objects.all()
    serializer_class = UmrahEnquirySerializer
    pagination_class = None

    def perform_create(self, serializer):
        enquiry = serializer.save()
        try:
            from .utils import send_enquiry_email
            send_enquiry_email(enquiry, "Umrah")
        except Exception as e:
            print(f"Error calling send_enquiry_email: {e}")


class EnquiryAPI(ModelViewSet):
    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    pagination_class = None

    def perform_create(self, serializer):
        enquiry = serializer.save()
        try:
            from .utils import send_enquiry_email
            enquiry_type = getattr(enquiry, 'enquiry_type', 'General')
            send_enquiry_email(enquiry, enquiry_type)
        except Exception as e:
            print(f"Error calling send_enquiry_email: {e}")


class HolidayPackageViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = HolidayPackage.objects.all()
    serializer_class = HolidayPackageSerializer

    def get_queryset(self):
        queryset = HolidayPackage.objects.prefetch_related(
            'inclusions', 'exclusions', 'highlights', 'cancellation_policies', 
            'extra_destinations', 'extra_destinations__destination', 'itinerary', 'vehicles'
        ).select_related('supplier').all()
        
        # Admin can pass ?all=true to see both active and inactive in lists
        is_all = self.request.query_params.get('all', 'false').lower() == 'true'
        
        # In list view, we usually filter by is_active unless 'all=true' is passed
        if self.action == 'list' and not is_all:
            today = timezone.now().date()
            
            # Filter by is_active first
            queryset = queryset.filter(is_active=True)
            
            # Filter out expired fixed departures
            packages = list(queryset)
            active_ids = []
            for pkg in packages:
                if pkg.fixed_departure and pkg.fixed_departure_data:
                    try:
                        # Check if any travel date's booking is still valid
                        is_valid = False
                        data = pkg.fixed_departure_data
                        if isinstance(data, str):
                            data = json.loads(data)
                        
                        for slot in data:
                            valid_until_str = slot.get('booking_valid_until')
                            if valid_until_str:
                                valid_until = timezone.datetime.strptime(valid_until_str, '%Y-%m-%d').date()
                                if valid_until >= today:
                                    is_valid = True
                                    break
                        if is_valid:
                            active_ids.append(pkg.id)
                    except:
                        # If parsing fails, keep it active to be safe
                        active_ids.append(pkg.id)
                else:
                    # Regular packages are already filtered by is_active
                    active_ids.append(pkg.id)
            queryset = queryset.filter(id__in=active_ids)

        with_flight = self.request.query_params.get('with_flight', None)
        if with_flight is not None:
             if with_flight.lower() == 'true':
                 queryset = queryset.filter(with_flight=True)
             elif with_flight.lower() == 'false':
                 queryset = queryset.filter(with_flight=False)
                 
        return queryset
        
    def paginate_queryset(self, queryset):
        # Disable pagination for home page 'popular' requests to avoid breaking frontend arrays
        if self.request.query_params.get('is_popular') == 'true':
            return None
        return super().paginate_queryset(queryset)








class ItineraryMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = ItineraryMaster.objects.all()
    serializer_class = ItineraryMasterSerializer
    pagination_class = None



class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = None









class VisaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Visa.objects.all()
    serializer_class = VisaSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Visa.objects.select_related('supplier').all()
        is_all = self.request.query_params.get('all', 'false').lower() == 'true'
        
        # Admin view or explicit 'all' param
        if getattr(self, 'action', 'list') != 'list' or is_all:
            return queryset

        # Default filtering for public view
        country = self.request.query_params.get('country', None)
        is_popular = self.request.query_params.get('is_popular', None)
        
        queryset = queryset.filter(is_active=True)
        
        if country:
            queryset = queryset.filter(country__iexact=country)
            
        if is_popular is not None:
            queryset = queryset.filter(is_popular=is_popular.lower() == 'true')
            
        return queryset


class VisaApplicationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = VisaApplication.objects.all().order_by('-created_at')
    serializer_class = VisaApplicationSerializer
    pagination_class = None

    def create(self, request, *args, **kwargs):
        data = request.data
        applicants_json = data.get('applicants_data')
        try:
            applicants_list = json.loads(applicants_json) if applicants_json else []
        except:
            applicants_list = []
            
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        
        for i, applicant_data in enumerate(applicants_list):
            passport_front = request.FILES.get(f'applicant_{i}_passport_front')
            photo = request.FILES.get(f'applicant_{i}_photo')
            
            applicant = VisaApplicant.objects.create(
                application=application,
                first_name=applicant_data.get('first_name', ''),
                last_name=applicant_data.get('last_name', ''),
                passport_number=applicant_data.get('passport_number', ''),
                sex=applicant_data.get('sex', 'Male'),
                dob=applicant_data.get('dob'),
                place_of_birth=applicant_data.get('place_of_birth', ''),
                place_of_issue=applicant_data.get('place_of_issue', ''),
                marital_status=applicant_data.get('marital_status', 'Single'),
                date_of_issue=applicant_data.get('date_of_issue'),
                date_of_expiry=applicant_data.get('date_of_expiry'),
                passport_front=passport_front,
                photo=photo
            )

            # Handle additional documents
            additional_docs = applicant_data.get('additional_documents', [])
            for j, doc_data in enumerate(additional_docs):
                doc_file = request.FILES.get(f'applicant_{i}_additional_doc_{j}')
                if doc_file:
                    VisaAdditionalDocument.objects.create(
                        applicant=applicant,
                        document_name=doc_data.get('name', f'Document {j+1}'),
                        file=doc_file
                    )
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VisaApplicantViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VisaApplicant.objects.all()
    serializer_class = VisaApplicantSerializer
    pagination_class = None


class VisaAdditionalDocumentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VisaAdditionalDocument.objects.all()
    serializer_class = VisaAdditionalDocumentSerializer
    pagination_class = None




class SupplierViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Supplier.objects.all().order_by('-created_at')
    serializer_class = SupplierSerializer
    pagination_class = None

@authentication_classes([])
@permission_classes([AllowAny])
class SendVisaDetailsAPI(APIView):
    throttle_classes = [EmailSharingRateThrottle]

    def post(self, request):
        email = request.data.get("email")
        subject = request.data.get("subject")
        body = request.data.get("body")
        
        if not email or not subject or not body:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'hello@goimomi.com',
                [email],
                fail_silently=False,
            )
            return Response({"success": "Email sent successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CruiseCalendarViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = CruiseCalendar.objects.all().order_by('-created_at')
    serializer_class = CruiseCalendarSerializer
    pagination_class = None

class HotelMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = HotelMaster.objects.all().order_by('name')
    serializer_class = HotelMasterSerializer
    pagination_class = None

class AirlineViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Airline.objects.all().order_by('name')
    serializer_class = AirlineSerializer
    pagination_class = None

class SightseeingMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = SightseeingMaster.objects.all()
    serializer_class = SightseeingMasterSerializer
    pagination_class = None

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Handle 'city_link' name to ID mapping if ID is not provided
        dest_id = data.get('city_link')
        if not dest_id or dest_id == "":
            dest_name = data.get('city')
            if dest_name:
                dest = City.objects.filter(name=dest_name).first()
                if dest:
                    data['city_link'] = dest.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        sightseeing = serializer.save()

        # Handle multiple images
        images = request.FILES.getlist('gallery_images')
        for img in images:
            SightseeingImage.objects.create(sightseeing=sightseeing, image=img)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        
        dest_id = data.get('city_link')
        if not dest_id or dest_id == "":
            dest_name = data.get('city')
            if dest_name:
                dest = City.objects.filter(name=dest_name).first()
                if dest:
                    data['city_link'] = dest.id

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        sightseeing = serializer.save()

        # Handle multiple images (optional: clear existing or just append)
        images = request.FILES.getlist('gallery_images')
        if images:
            # Optionally clear existing gallery if needed
            # sightseeing.images.all().delete()
            for img in images:
                SightseeingImage.objects.create(sightseeing=sightseeing, image=img)

        return Response(serializer.data)

class MealMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = MealMaster.objects.all()
    serializer_class = MealMasterSerializer
    pagination_class = None

class VehicleBrandViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = VehicleBrand.objects.all().order_by('name')
    serializer_class = VehicleBrandSerializer
    pagination_class = None

    def list(self, request, *args, **kwargs):
        # Health check log
        print(f"INFO: VehicleBrand API accessed. Total brands: {self.get_queryset().count()}")
        return super().list(request, *args, **kwargs)

class AccommodationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Accommodation.objects.all().order_by('-created_at')
    serializer_class = AccommodationSerializer
    pagination_class = None

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        accommodation = serializer.save()

        # Handle multiple images
        images = request.FILES.getlist('accommodation_images')
        for img in images:
            AccommodationImage.objects.create(accommodation=accommodation, image=img)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        accommodation = serializer.save()

        # Handle multiple images
        images = request.FILES.getlist('accommodation_images')
        if images:
            # Optionally clear existing images if needed
            # accommodation.images.all().delete()
            for img in images:
                AccommodationImage.objects.create(accommodation=accommodation, image=img)

        return Response(serializer.data)

class RoomTypeViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    pagination_class = None

class VehicleMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = VehicleMaster.objects.all().order_by('-created_at')
    serializer_class = VehicleMasterSerializer
    pagination_class = None

class DriverMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = DriverMaster.objects.all().order_by('-created_at')
    serializer_class = DriverMasterSerializer
    pagination_class = None

class VehicleRateCardViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VehicleRateCard.objects.all().order_by('-created_at')
    serializer_class = VehicleRateCardSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        vehicle_id = self.request.query_params.get('vehicle')
        if name:
            queryset = queryset.filter(name=name)
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        return queryset
class PickupPointMasterViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PickupPointMasterSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = PickupPointMaster.objects.all().order_by('name')
        country_id = self.request.query_params.get('country_id')
        if country_id and country_id != 'undefined':
            queryset = queryset.filter(city__country_id=country_id)
        return queryset


def generate_zoho_payment_link(booking):
    """
    Generates a Zoho Payments checkout link for the given CabBooking.
    Falls back to a local simulation URL when Zoho credentials are not yet configured.
    Returns the payment URL string, or None on unexpected failure.
    """
    zoho_client_id = getattr(settings, 'ZOHO_CRM_CLIENT_ID', '').strip()
    zoho_client_secret = getattr(settings, 'ZOHO_CRM_CLIENT_SECRET', '').strip()
    zoho_refresh_token = getattr(settings, 'ZOHO_CRM_REFRESH_TOKEN', '').strip()

    customer_name = f"{booking.first_name} {booking.last_name}".strip()
    amount = float(booking.price or 0)

    # ── DEVELOPMENT FALLBACK ───────────────────────────────────────────────────
    # If Zoho OAuth credentials aren't set, redirect to the built-in simulation
    # centre so the checkout flow can be tested without a live Zoho account.
    if not (zoho_client_id and zoho_client_secret and zoho_refresh_token):
        import urllib.parse
        params = urllib.parse.urlencode({
            'booking_id': booking.booking_id,
            'amount':     amount,
            'name':       customer_name,
            'email':      booking.email or '',
            'phone':      booking.phone or '',
            'type':       'cab',
        })
        base = 'http://127.0.0.1:8000' if settings.DEBUG else 'https://goimomi.com'
        sim_url = f"{base}/api/payment-webhook/?{params}"
        print(f"[Payment] Zoho creds not set — redirecting to local sim: {sim_url}")
        return sim_url

    # ── LIVE ZOHO PAYMENTS FLOW ───────────────────────────────────────────────
    try:
        # 1. Get a fresh OAuth2 access token via refresh token
        token_resp = http_requests.post(
            'https://accounts.zoho.com/oauth/v2/token',
            data={
                'refresh_token': zoho_refresh_token,
                'client_id':     zoho_client_id,
                'client_secret': zoho_client_secret,
                'grant_type':    'refresh_token',
            },
            timeout=10,
        )
        token_data = token_resp.json()
        access_token = token_data.get('access_token')
        if not access_token:
            print(f"[Payment] Failed to get Zoho access token: {token_data}")
            return None

        # 2. Create the payment link in Zoho Payments
        redirect_url = f"https://goimomi.com/payment-success/?booking_id={booking.booking_id}"
        link_resp = http_requests.post(
            'https://payments.zoho.com/api/v1/paymentlinks',
            json={
                'amount':           amount,
                'currency':         'INR',
                'reference_number': booking.booking_id,
                'description':      f"Goimomi Cab Booking: {booking.booking_id}",
                'customer': {
                    'name':  customer_name,
                    'email': booking.email or '',
                    'phone': booking.phone or '',
                },
                # metadata is echoed back in the webhook payload so our
                # webhook handler can identify the booking
                'metadata': {'booking_id': booking.booking_id},
                'redirect_url': redirect_url,
            },
            headers={
                'Authorization': f'Zoho-oauthtoken {access_token}',
                'Content-Type':  'application/json',
            },
            timeout=15,
        )
        link_data = link_resp.json()
        payment_url = link_data.get('payment_url') or link_data.get('link_url')
        if payment_url:
            print(f"[Payment] Zoho payment link generated for {booking.booking_id}: {payment_url}")
            return payment_url
        else:
            print(f"[Payment] Zoho did not return a URL: {link_data}")
            return None

    except Exception as exc:
        print(f"[Payment] Exception generating Zoho payment link: {exc}")
        return None


class CabBookingViewSet(ModelViewSet):

    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = CabBooking.objects.all().order_by('-created_at')
    serializer_class = CabBookingSerializer
    pagination_class = None

    @action(detail=False, methods=['post'], url_path='send-otp', permission_classes=[AllowAny])
    def send_otp(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate 6 digit OTP
        import random
        otp = str(random.randint(100000, 999999))
        
        # Save or update OTP in the database
        OTPVerification.objects.update_or_create(
            email=email,
            defaults={'otp': otp, 'is_verified': False}
        )
        
        subject = "Your Goimomi Cab Booking Verification OTP"
        message = f"Hello,\n\nYour OTP code for verifying your email on Goimomi Holidays is: {otp}\n\nThis OTP is valid for 5 minutes.\n\nThank you,\nGoimomi Holidays Team"
        
        # HTML template matching the premium design system
        html_message = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #14532d; padding: 24px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase;">GOIMOMI HOLIDAYS</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff; color: #1e293b;">
                <h2 style="margin-top: 0; color: #14532d; font-size: 20px; font-weight: bold; border-bottom: 2px solid #f0fdf4; padding-bottom: 12px;">Email Verification Code</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #475569;">Hello,</p>
                <p style="font-size: 15px; line-height: 1.6; color: #475569;">Thank you for choosing Goimomi Holidays. To proceed with your cab booking, please use the verification code below to verify your email address:</p>
                
                <div style="text-align: center; margin: 32px 0;">
                    <span style="display: inline-block; background-color: #f0fdf4; border: 1px dashed #14532d; color: #14532d; font-size: 32px; font-weight: 800; letter-spacing: 0.15em; padding: 12px 36px; border-radius: 8px;">{otp}</span>
                </div>
                
                <p style="font-size: 13px; color: #64748b; line-height: 1.6; background-color: #f8fafc; padding: 12px; border-radius: 8px; border-left: 4px solid #cbd5e1;">
                    <strong>Notice:</strong> This code is highly confidential and is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
                </p>
            </div>
            <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                <p style="margin: 0;">&copy; 2026 Goimomi Holidays. All rights reserved.</p>
                <p style="margin: 4px 0 0 0;">Need help? Contact our 24/7 Travel Desk: <a href="tel:+918110082222" style="color: #14532d; text-decoration: none; font-weight: bold;">+91 81100 82222</a></p>
            </div>
        </div>
        """
        
        try:
            from django.core.mail import EmailMultiAlternatives
            msg = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()
            return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)
            except Exception as mail_err:
                print(f"Error sending OTP email: {mail_err}")
                return Response({'error': 'Failed to send OTP email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='verify-otp', permission_classes=[AllowAny])
    def verify_otp(self, request):
        email = request.data.get('email', '').strip().lower()
        otp_input = request.data.get('otp', '').strip()
        
        if not email or not otp_input:
            return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        from datetime import timedelta
        try:
            otp_obj = OTPVerification.objects.get(email=email)
            # Check if expired (5 minutes = 300 seconds)
            if timezone.now() - otp_obj.created_at > timedelta(minutes=5):
                return Response({'error': 'OTP has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if otp_obj.otp == otp_input:
                otp_obj.is_verified = True
                otp_obj.save()
                return Response({'message': 'OTP verified successfully.'}, status=status.HTTP_200_OK)
        except OTPVerification.DoesNotExist:
            pass
            
        return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            email = request.data.get('email', '').strip().lower()
            try:
                otp_obj = OTPVerification.objects.get(email=email)
                from datetime import timedelta
                if not otp_obj.is_verified or (timezone.now() - otp_obj.created_at > timedelta(minutes=30)):
                    return Response({'error': 'Email verification is required before submitting a booking.'}, status=status.HTTP_400_BAD_REQUEST)
                otp_obj.delete()
            except OTPVerification.DoesNotExist:
                return Response({'error': 'Email verification is required before submitting a booking.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the booking record via the parent class
        response = super().create(request, *args, **kwargs)

        # After successful creation, generate Zoho payment link
        if response.status_code == 201:
            try:
                booking_id = response.data.get('booking_id')
                booking_pk = response.data.get('id')
                if booking_id and booking_pk:
                    booking_obj = CabBooking.objects.get(pk=booking_pk)
                    payment_url = generate_zoho_payment_link(booking_obj)
                    if payment_url:
                        response.data['payment_url'] = payment_url
            except Exception as e:
                print(f"Error generating payment link: {e}")

        return response

    def perform_create(self, serializer):
        booking = serializer.save()
        booking.refresh_from_db()
        try:
            from .utils import send_booking_voucher
            send_booking_voucher(booking)
        except Exception as e:
            print(f"Error calling send_booking_voucher: {e}")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        
        # Handle confirmation_doc if it's a file
        confirmation_doc = request.FILES.get('confirmation_doc')
        if confirmation_doc:
            data['confirmation_doc'] = confirmation_doc
        elif 'confirmation_doc' in request.data and not request.data.get('confirmation_doc'):
            # If the field is present but empty/falsey, it means removal
            data['confirmation_doc'] = None
            
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        # Handle additional documents
        docs_count = request.data.get('additional_docs_count', 0)
        try:
            docs_count = int(docs_count)
        except:
            docs_count = 0
            
        for i in range(docs_count):
            file = request.FILES.get(f'additional_doc_{i}')
            name = request.data.get(f'additional_doc_name_{i}', f'Document {i+1}')
            if file:
                CabAdditionalDocument.objects.create(
                    booking=booking,
                    document_name=name,
                    file=file
                )
        
        # Handle removals
        remove_ids = request.data.get('remove_doc_ids')
        if remove_ids:
            try:
                ids = json.loads(remove_ids) if isinstance(remove_ids, str) else remove_ids
                if ids:
                    CabAdditionalDocument.objects.filter(id__in=ids, booking=booking).delete()
            except:
                pass

        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='send-email', permission_classes=[IsAuthenticated])
    def send_email(self, request, pk=None):
        booking = self.get_object()
        try:
            from .utils import send_booking_voucher
            success = send_booking_voucher(booking)
            if success:
                return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to send email. Check backend log for errors."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CabAdditionalDocumentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CabAdditionalDocument.objects.all()
    serializer_class = CabAdditionalDocumentSerializer
    pagination_class = None

class CabSearchAPI(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        # Extract and clean parameters
        from_city = request.query_params.get('from_city', '').split('(')[0].split(',')[0].strip().lower()
        if not from_city:
            from_city = request.query_params.get('from_city', '').strip().lower()
            
        to_city = request.query_params.get('to_city', '').split('(')[0].split(',')[0].strip().lower()
        if not to_city:
            to_city = request.query_params.get('to_city', '').strip().lower()

        # Normalize city name aliases so search always matches DB records
        CITY_ALIASES = {
            'makkah': 'mecca',
            'mekka':  'mecca',
            'medina': 'madinah',
            'madina': 'madinah',
        }
        from_city = CITY_ALIASES.get(from_city, from_city)
        to_city   = CITY_ALIASES.get(to_city,   to_city)

            
        pickup_date = request.query_params.get('pickup_date')
        pickup_point = request.query_params.get('pickup_point', '').strip().lower()
        drop_point = request.query_params.get('drop_point', '').strip().lower()

        if not from_city or not to_city or not pickup_date:
            return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            p_date = timezone.datetime.strptime(pickup_date, '%Y-%m-%d').date()
        except:
            return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        # Find rate cards valid for the date
        rate_cards = VehicleRateCard.objects.filter(
            validity_start__lte=p_date,
            validity_end__gte=p_date
        )

        available_options = []
        for rc in rate_cards:
            column_vehicles = [v.strip() if v else "" for v in (rc.column_vehicles or [])]
            
            for route in rc.routes:
                # Case-insensitive city matching with stripping
                rc_from = str(route.get('start_city', '')).strip().lower()
                rc_to = str(route.get('drop_city', '')).strip().lower()

                # Robust matching: match if both cities are found (exact or partial)
                from_matched = (rc_from == from_city) or (rc_from in from_city) or (from_city in rc_from)
                to_matched = (rc_to == to_city) or (rc_to in to_city) or (to_city in rc_to)
                
                # Check optional pickup & drop points if they were searched
                rc_pickup = str(route.get('start_from', '')).strip().lower()
                rc_drop = str(route.get('drop_to', '')).strip().lower()
                
                pickup_matched = not pickup_point or (rc_pickup == pickup_point) or (rc_pickup in pickup_point) or (pickup_point in rc_pickup)
                drop_matched = not drop_point or (rc_drop == drop_point) or (rc_drop in drop_point) or (drop_point in rc_drop)
                
                if from_matched and to_matched and pickup_matched and drop_matched:
                    # Found a match!
                    for i, v_name in enumerate(column_vehicles):
                        if not v_name: continue
                        
                        price = route.get(f'v{i+1}')
                        if price and str(price).strip() != "" and str(price).strip() != "0":
                            # Try exact model match first, then full name match
                            vehicle = VehicleMaster.objects.filter(name__iexact=v_name).first()
                            if not vehicle:
                                # Try matching against brand + name
                                all_v = VehicleMaster.objects.all()
                                for v in all_v:
                                    full_name = f"{v.brand.name} {v.name}" if v.brand else v.name
                                    if full_name.lower() == v_name.lower():
                                        vehicle = v
                                        break
                            
                            if vehicle:
                                available_options.append({
                                    "id": vehicle.id,
                                    "name": vehicle.name,
                                    "category": vehicle.brand.name if vehicle.brand else "Standard",
                                    "passengers": vehicle.seating_capacity,
                                    "bags": vehicle.luggage_capacity,
                                    "price": price,
                                    "pickup_point": route.get('start_from'),
                                    "drop_point": route.get('drop_to'),
                                    "image": vehicle.photo.url if vehicle.photo else None,
                                    "description": vehicle.description
                                })
        
        # Deduplicate by name and points to show all unique route options fed in
        unique_options = {}
        for opt in available_options:
            key = f"{opt['name']}_{opt['pickup_point']}_{opt['drop_point']}"
            try:
                # Ensure price is handled safely
                raw_price = opt.get('price')
                if raw_price is None or str(raw_price).strip() == "":
                    price_val = 0.0
                elif isinstance(raw_price, (int, float)):
                    price_val = float(raw_price)
                else:
                    price_val = float(str(raw_price))
                
                if key not in unique_options or price_val < float(unique_options[key].get('price', float('inf'))):
                    unique_options[key] = opt
            except (ValueError, TypeError):
                if key not in unique_options:
                    unique_options[key] = opt

        return Response(list(unique_options.values()))


import os
import re
from django.http import HttpResponse
from django.utils.safestring import mark_safe

@authentication_classes([])
@permission_classes([AllowAny])
class DynamicSEOView(APIView):
    """
    Experimental View to serve index.html with dynamic meta tags for crawlers.
    This helps social media previews (WhatsApp/FB) show correct titles/descriptions.
    """
    def get(self, request, path=""):
        # 1. Default fallback values
        title = "Goimomi Holidays – Customized Holiday Packages & Travel Experiences"
        description = "Goimomi Holidays offers customized vacation packages, family trips, honeymoon tours, adventure travel, and premium holiday planning tailored to your preferences."
        keywords = "goimomi holidays, travel agency, international tours, domestic holidays, visa services, holiday packages"
        image = "https://goimomi.com/logo-preview.png"
        
        # 2. Dynamic content based on path
        # Holiday Details: /holiday/123
        if path.startswith('holiday/'):
            try:
                pkg_id = path.split('/')[-1]
                pkg = HolidayPackage.objects.get(id=pkg_id)
                title = f"{pkg.title} | Goimomi Holidays"
                plain_desc = re.sub('<[^<]+?>', '', pkg.description or '')
                description = (plain_desc[:160] + '...') if len(plain_desc) > 160 else plain_desc
                if pkg.card_image:
                    image = request.build_absolute_uri(pkg.card_image.url)
                # Maybe add dynamic keywords if model had it
            except:
                pass
        
        # Canton: /canton
        elif 'canton' in path.lower():
            title = "Canton Fair 2026 | Register Now with Goimomi Holidays"
            description = "Join the prestigious Canton Fair 2026 with Goimomi Holidays. Experience the world's largest trade fair with our premium all-inclusive travel packages: luxury 4-star stays, seamless visa assistance, and expert business guidance."
            keywords = "Canton Fair 2026, Canton Fair registration, Canton Fair travel package, Goimomi Holidays, Guangzhou trade fair, Business travel China"
            
        # Cabs: /cab
        elif 'cab' in path.lower():
            title = "Premium Cab & Transfer Services | Goimomi Holidays"
            description = "Book reliable and comfortable airport transfers and intercity cabs with Goimomi Holidays. Professional drivers, clean vehicles, and 24/7 support for all your travel needs."
            keywords = "Premium cab service, airport transfers, intercity taxi, Goimomi Holidays, Jeddah airport transfer, Makkah taxi service, Madinah cab booking"
            
        # Umrah: /umrah
        elif 'umrah' in path.lower():
            title = "Customized Umrah Packages | Sacred Spiritual Journey | Goimomi Holidays"
            description = "Experience a blessed pilgrimage with Goimomi Holidays' customized Umrah packages. Premium accommodation, expert guidance, and seamless travel for your spiritual journey."
            keywords = "Customized Umrah packages, Umrah pilgrimage 2026, Umrah from India, luxury Umrah stay, economy Umrah package, Makkah Madinah Ziyarat"
            
        # Customized Holidays: /customized-holidays
        elif 'customized-holidays' in path.lower():
            title = "Customized Holiday Packages | Goimomi Holidays"
            description = "Design your perfect vacation with our fully customizable holiday packages. Tailor-made itineraries, luxury stays, and seamless travel planning for your dream getaway."
            keywords = "Customized holiday packages, tailor-made travel, personalized vacation planning, Goimomi Holidays, luxury travel packages"

        # Holidays List: /holidays
        elif 'holidays' in path.lower() or 'packages' in path.lower():
            title = "Premium Holiday Packages | Goimomi Holidays"
            description = "Browse our collection of premium tour packages. From exotic beach escapes to mountain adventures, find your perfect travel experience."
            keywords = "Goimomi Holidays, holiday packages, tour packages, travel agency, premium vacations"

        # European Tours: /Europeantours
        elif 'europe' in path.lower():
            title = "European Tour Packages | Goimomi Holidays"
            description = "Explore the best of Europe with Goimomi Holidays. From Paris to Rome, discover our comprehensive tour packages for your dream European vacation."
            keywords = "European tour packages, Europe vacation, Paris Rome tours, Switzerland holiday, Goimomi Holidays"

        # Cruise: /cruise
        elif 'cruise' in path.lower():
            title = "Luxury Cruise Holidays | Goimomi Holidays"
            description = "Sail the high seas in style with Goimomi Holidays. Discover luxury cruise voyages with world-class dining, premium suites, and unforgettable destinations."
            keywords = "Luxury cruise holidays, Cordelia Cruises, cruise booking India, ocean-view suites, Goimomi Holidays"

        # Plan Your Trip: /form
        elif 'form' in path.lower() or 'plan' in path.lower():
            title = "Plan Your Trip | Custom Travel Planner | Goimomi Holidays"
            description = "Customize your dream holiday with Goimomi Holidays. Use our trip planner to select destinations, flights, and activities tailored to your budget."
            keywords = "Plan your trip, travel planner, custom holiday, vacation inquiry, Goimomi Holidays"

        # About Us: /aboutus
        elif 'about' in path.lower():
            title = "About Goimomi Holidays | Our Journey & Commitment"
            description = "Learn about Goimomi Holidays, our mission, and our decade-long journey as a trusted travel partner in India."
            keywords = "About Goimomi Holidays, travel agency India, trusted travel partner, corporate travel services"

        # Business Home: /businesshome
        elif 'business' in path.lower():
            title = "Elevate Your Business Travel | Goimomi Business"
            description = "Empower your enterprise with Goimomi Business Solutions. Strategic corporate travel management and global sourcing support."
            keywords = "Corporate travel solutions, business travel management, Goimomi Business, Canton Fair sourcing"

        # Contact Us: /contactus
        elif 'contact' in path.lower():
            title = "Contact Goimomi Holidays | 24/7 Travel Support"
            description = "Connect with Goimomi Holidays for expert travel guidance. Our team is available 24/7 to assist with your holiday and business travel needs."
            keywords = "Contact Goimomi Holidays, travel support, holiday inquiry, visa consultation"

        # Holiday Home: /holidayhome
        elif 'holidayhome' in path.lower():
            title = "Plan Your Perfect Holiday | Goimomi Holidays"
            description = "Explore curated domestic and international holiday collections. Your gateway to extraordinary travel experiences."
            keywords = "Holiday packages, international tours, domestic travel, Goimomi Holidays"

        # Hotel: /hotel
        elif 'hotel' in path.lower():
            title = "Premium Hotel Bookings | Goimomi Holidays"
            description = "Book handpicked luxury hotels and resorts worldwide with Goimomi Holidays. Best rates and 24/7 support guaranteed."
            keywords = "Hotel booking, luxury stays, resort booking, Goimomi hotel deals"

        # Privacy Policy: /privacy-policy
        elif 'privacy' in path.lower():
            title = "Privacy Policy | Goimomi Holidays"
            description = "Learn about our commitment to protecting your personal data and privacy at Goimomi Holidays."
            keywords = "Privacy policy, data protection, Goimomi Holidays"

        # Terms & Conditions: /terms-and-conditions
        elif 'terms' in path.lower():
            title = "Terms & Conditions | Goimomi Holidays"
            description = "Read the terms and conditions for using Goimomi Holidays services and our guest user agreement."
            keywords = "Terms and conditions, user agreement, Goimomi Holidays"

        # Cancellation Policy: /cancellation-policy
        elif 'cancellation' in path.lower():
            title = "Cancellation Policy | Goimomi Holidays"
            description = "Understand the cancellation and refund rules for your travel bookings with Goimomi Holidays."
            keywords = "Cancellation policy, refund rules, Goimomi Holidays"

        # Package Enquiry: /enquiry
        elif 'enquiry' in path.lower():
            title = "Holiday Package Enquiry | Goimomi Holidays"
            description = "Enquire about our international and domestic holiday packages. Get personalized quotes and travel expert advice."
            keywords = "holiday enquiry, travel quote, package booking, vacation planning, goimomi holidays"

        # Contact Success: /contact/success
        elif 'success' in path.lower():
            title = "Message Sent Successfully | Goimomi Holidays"
            description = "Thank you for contacting Goimomi Holidays. Your enquiry has been received, and our travel experts will get back to you shortly."
            keywords = "contact success, enquiry submitted, thank you, goimomi holidays"

        # Visa Services: /visa
        elif 'visa' in path.lower():
            if 'apply' in path.lower():
                try:
                    visa_id = path.split('/')[-1]
                    from .models import Visa
                    v = Visa.objects.get(id=visa_id)
                    title = f"Apply for {v.title} | Goimomi Holidays"
                    description = f"Submit your application for {v.title} for {v.country}. Fast and secure online visa processing."
                    keywords = f"apply for {v.title}, {v.country} visa, online visa form"
                except:
                    title = "Visa Application | Goimomi Holidays"
                    description = "Complete your international visa application with Goimomi Holidays."
            elif 'results' in path.lower():
                title = "Visa Search Results | Goimomi Holidays"
                description = "Explore visa options for your next trip. Get details on fees, processing time, and documents required."
                keywords = "visa search, travel visa search, visa explorer"
            else:
                title = "Online Visa Services | Fast & Reliable Processing | Goimomi Holidays"
                description = "Apply for international visas online with Goimomi Holidays. Get expert assistance and fast, hassle-free visa processing for over 100+ countries."
                keywords = "online visa, visa application, travel visa services, fast visa processing, international visa assistance"

        # Admin Login: /adminLogin
        elif 'adminlogin' in path.lower():
            title = "Admin Login | Goimomi Holidays"
            description = "Secure portal for Goimomi Holidays administration."
            keywords = "Admin login, Goimomi portal"

        # 3. Load the index.html
        # Note: Set frontend_dist_path correctly in your settings.py or use an absolute path
        frontend_dist_path = os.path.join(settings.BASE_DIR, '..', 'goimomi-holidays-frontend', 'dist', 'index.html')
        
        # Fallback for local dev or different structure
        if not os.path.exists(frontend_dist_path):
            frontend_dist_path = os.path.join(settings.BASE_DIR, 'dist', 'index.html')

        try:
            with open(frontend_dist_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Replace meta tags using regex
                content = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', content)
                content = re.sub(r'<meta property="og:title" content=".*?" />', f'<meta property="og:title" content="{title}" />', content)
                content = re.sub(r'<meta property="og:description" content=".*?" />', f'<meta property="og:description" content="{description}" />', content)
                content = re.sub(r'<meta property="og:image" content=".*?" />', f'<meta property="og:image" content="{image}" />', content)
                content = re.sub(r'<meta name="description" content=".*?" />', f'<meta name="description" content="{description}" />', content)
                content = re.sub(r'<meta name="keywords" content=".*?" />', f'<meta name="keywords" content="{keywords}" />', content)
                content = re.sub(r'<meta itemprop="name" content=".*?" />', f'<meta itemprop="name" content="{title}" />', content)
                content = re.sub(r'<meta itemprop="description" content=".*?" />', f'<meta itemprop="description" content="{description}" />', content)
                content = re.sub(r'<meta itemprop="image" content=".*?" />', f'<meta itemprop="image" content="{image}" />', content)
                
                return HttpResponse(content)
        except Exception as e:
            # If index.html not found, return a basic error or redirect to frontend
            return HttpResponse(f"Error loading frontend: {str(e)}", status=500)

class DestinationHierarchyAPI(APIView):
    """
    Optimized API to return the hierarchy for Country Management with pagination and search.
    Supports tabs: all, countries, nationalities, regions, cities, airports, pickup-points, terminals
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        tab = request.query_params.get('tab', 'all')
        search = request.query_params.get('search', '')
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))

        # 1. Determine base queryset based on tab
        if tab == 'countries':
            queryset = Country.objects.prefetch_related('nationalities').all().order_by('name')
            if search:
                queryset = queryset.filter(name__icontains=search)
        elif tab == 'nationalities':
            queryset = Nationality.objects.select_related('country').all().order_by('name')
            if search:
                queryset = queryset.filter(Q(name__icontains=search) | Q(country__name__icontains=search))
        elif tab == 'regions':
            queryset = Region.objects.select_related('country').all().order_by('name')
            if search:
                queryset = queryset.filter(Q(name__icontains=search) | Q(country__name__icontains=search))
        elif tab == 'cities':
            queryset = City.objects.select_related('region', 'country').prefetch_related('country__nationalities').all().order_by('name')
            if search:
                queryset = queryset.filter(Q(name__icontains=search) | Q(region__name__icontains=search) | Q(country__name__icontains=search))
        elif tab == 'airports':
            queryset = Airport.objects.select_related('city__region', 'city__country').all().order_by('name')
            if search:
                queryset = queryset.filter(Q(name__icontains=search) | Q(iata_code__icontains=search) | Q(city__name__icontains=search))
        elif tab == 'pickup-points':
            queryset = PickupPointMaster.objects.select_related('city').all().order_by('name')
            if search:
                queryset = queryset.filter(Q(name__icontains=search) | Q(city__name__icontains=search))
        elif tab == 'terminals':
            queryset = CruiseTerminal.objects.all().order_by('terminal_name')
            if search:
                queryset = queryset.filter(Q(terminal_name__icontains=search) | Q(cruise_name__icontains=search))
        else: # 'all'
            queryset = City.objects.select_related('region', 'country').prefetch_related('country__nationalities').all().order_by('country__name', 'region__name', 'name')
            if search:
                queryset = queryset.filter(Q(name__icontains=search) | Q(region__name__icontains=search) | Q(country__name__icontains=search))

        # 2. Pagination
        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        paged_queryset = queryset[start:end]

        # 3. Build Response Hierarchy
        results = []
        
        # Pre-fetch sub-items for the current page to avoid N+1
        city_ids = [c.id for c in paged_queryset if isinstance(c, City)]
        city_list = [c for c in paged_queryset if isinstance(c, City)]
        
        airports_map = {}
        pickup_map = {}
        terminal_map = {}
        
        if city_ids:
            # Efficiently batch fetch airports
            for a in Airport.objects.filter(city_id__in=city_ids).values('id', 'name', 'iata_code', 'city_id'):
                cid = a['city_id']
                if cid not in airports_map: airports_map[cid] = []
                airports_map[cid].append(a)

            # Batch fetch pickups by city ID
            for p in PickupPointMaster.objects.filter(city_id__in=city_ids).values('id', 'name', 'city_id'):
                cid = p['city_id']
                if cid not in pickup_map: pickup_map[cid] = []
                pickup_map[cid].append(p)

            # Batch fetch terminals by city ID
            for t in CruiseTerminal.objects.filter(city_id__in=city_ids).values('id', 'terminal_name', 'cruise_name', 'cruise_code', 'city_id'):
                cid = t['city_id']
                if cid not in terminal_map: terminal_map[cid] = []
                terminal_map[cid].append(t)

        # Construct rows
        for item in paged_queryset:
            if isinstance(item, Country):
                row = self._build_country_row(item)
            elif isinstance(item, Nationality):
                row = self._build_nationality_row(item)
            elif isinstance(item, Region):
                row = self._build_region_row(item)
            elif isinstance(item, City):
                row = self._build_city_row(item, airports_map, pickup_map, terminal_map)
            elif isinstance(item, Airport):
                row = self._build_airport_row(item)
            elif isinstance(item, PickupPointMaster):
                row = self._build_pickup_row(item)
            elif isinstance(item, CruiseTerminal):
                row = self._build_terminal_row(item)
            else:
                row = {}
            
            results.append(row)

        return Response({
            "count": total_count,
            "next_page": page + 1 if end < total_count else None,
            "prev_page": page - 1 if page > 1 else None,
            "results": results,
            "total_pages": (total_count + page_size - 1) // page_size if page_size > 0 else 1
        })

    def _get_country_info(self, country):
        if not country:
            return None, "—", "—"
        
        # Get nationalities from country if prefetched/pre-related
        # In many cases, we can't do .nationalities.all() easily without hits, 
        # but the view already prefetches country__nationalities
        nationalities = "—"
        if hasattr(country, 'nationalities'):
            # This handles both prefetch_related and related_name.all()
            try:
                nats = [n.name for n in country.nationalities.all()]
                if nats:
                    nationalities = ", ".join(nats)
            except:
                pass
        
        return country.id, country.name, nationalities

    def _build_country_row(self, country):
        cid, cname, nat = self._get_country_info(country)
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nat,
            "region_name": "—",
            "city_name": "—",
            "airports_count": 0,
            "pickup_points_count": 0,
            "cruise_terminals_count": 0
        }

    def _build_nationality_row(self, nationality):
        cid, cname, _ = self._get_country_info(nationality.country)
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nationality.name,
            "region_name": "—",
            "city_name": "—",
            "airports_count": 0,
            "pickup_points_count": 0,
            "cruise_terminals_count": 0
        }

    def _build_region_row(self, region):
        cid, cname, nat = self._get_country_info(region.country)
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nat,
            "region_id": region.id,
            "region_name": region.name,
            "city_name": "—",
            "airports_count": 0,
            "pickup_points_count": 0,
            "cruise_terminals_count": 0
        }

    def _build_city_row(self, city, airports_map, pickup_map, terminal_map):
        cid, cname, nat = self._get_country_info(city.country)
        
        airports = airports_map.get(city.id, [])
        pickups = pickup_map.get(city.id, [])
        terminals = terminal_map.get(city.id, [])
        
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nat,
            "region_id": city.region.id if city.region else None,
            "region_name": city.region.name if city.region else "—",
            "city_id": city.id,
            "city_name": city.name,
            "airports": airports,
            "airports_count": len(airports),
            "pickup_points": pickups,
            "pickup_points_count": len(pickups),
            "cruise_terminals": terminals,
            "cruise_terminals_count": len(terminals)
        }

    def _build_airport_row(self, airport):
        city = airport.city
        cid, cname, nat = self._get_country_info(city.country if city else None)
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nat,
            "region_id": city.region.id if city and city.region else None,
            "region_name": city.region.name if city and city.region else "—",
            "city_id": city.id if city else None,
            "city_name": city.name if city else "—",
            "displayed_name": f"{airport.name} ({airport.iata_code})",
            "airports_count": 1
        }

    def _build_pickup_row(self, pickup):
        city = pickup.city
        cid, cname, nat = self._get_country_info(city.country if city else None)
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nat,
            "region_id": city.region.id if city and city.region else None,
            "region_name": city.region.name if city and city.region else "—",
            "city_id": city.id if city else None,
            "city_name": city.name if city else "—",
            "displayed_name": pickup.name,
            "pickup_points_count": 1
        }

    def _build_terminal_row(self, terminal):
        city = terminal.city
        cid, cname, nat = self._get_country_info(city.country if city else None)
        return {
            "country_id": cid,
            "country_name": cname,
            "nationality": nat,
            "region_id": city.region.id if city and city.region else None,
            "region_name": city.region.name if city and city.region else "—",
            "city_id": city.id if city else None,
            "city_name": city.name if city else "—",
            "displayed_name": f"{terminal.terminal_name} - {terminal.cruise_name}" if terminal.cruise_name else terminal.terminal_name,
            "cruise_terminals_count": 1
        }


import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from Holidays.models import CabBooking, CantonEnquiry
from Holidays.utils import (
    verify_zoho_signature,
    upsert_zoho_crm_contact,
    send_whatsapp_confirmation,
    generate_booking_pdf
)
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

@method_decorator(csrf_exempt, name='dispatch')
class ZohoPaymentWebhookViewSet(ViewSet):
    """
    API Webhook Endpoint for Zoho Payments
    """
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        # Only allow simulator in debug mode
        if not settings.DEBUG:
            return JsonResponse({'error': 'Method not allowed'}, status=405)
            
        from django.http import HttpResponse
        
        recent_cabs = CabBooking.objects.all().order_by('-created_at')[:15]
        recent_cantons = CantonEnquiry.objects.all().order_by('-created_at')[:15]
        
        # Populate selector options
        cab_options = ""
        cab_table_rows = ""
        for cab in recent_cabs:
            cab_options += f'<option value="{cab.booking_id}" data-amount="{cab.price}" data-name="{cab.first_name} {cab.last_name}" data-email="{cab.email or ""}" data-phone="{cab.phone or ""}">{cab.booking_id} - {cab.first_name} {cab.last_name} (INR {cab.price})</option>\n'
            
            status_class = "badge-success" if cab.status == "Confirmed" else ("badge-failed" if cab.status == "Cancelled" else "badge-pending")
            cab_table_rows += f"""
            <tr>
                <td><b>{cab.booking_id}</b></td>
                <td>{cab.first_name} {cab.last_name}<br><small style="color: #64748b;">{cab.email or ''} | {cab.phone}</small></td>
                <td>{cab.vehicle_name}</td>
                <td>INR {cab.price}</td>
                <td><span class="badge {status_class}">{cab.status}</span></td>
            </tr>
            """
            
        canton_options = ""
        canton_table_rows = ""
        for canton in recent_cantons:
            canton_options += f'<option value="{canton.id}" data-amount="500.00" data-name="{canton.full_name}" data-email="" data-phone="{canton.whatsapp_number}">Enquiry #{canton.id} - {canton.full_name} (INR 500.00)</option>\n'
            
            status_class = "badge-success" if canton.payment_status == "Success" else ("badge-failed" if canton.payment_status == "Failed" else "badge-pending")
            canton_table_rows += f"""
            <tr>
                <td><b>Enquiry #{canton.id}</b></td>
                <td>{canton.full_name}<br><small style="color: #64748b;">{canton.whatsapp_number}</small></td>
                <td>{canton.business_name} - {canton.selected_phase}</td>
                <td><span class="badge {status_class}">{canton.payment_status}</span></td>
            </tr>
            """
            
        html_template = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Goimomi Holidays - Zoho Webhook Test Dashboard</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }}
        .container {{ max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }}
        @media(max-width: 900px) {{ .container {{ grid-template-columns: 1fr; }} }}
        .card {{ background: #ffffff; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; margin-bottom: 24px; }}
        h1, h2, h3 {{ color: #14532d; font-weight: 800; margin-top: 0; }}
        .form-group {{ margin-bottom: 16px; }}
        label {{ display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 6px; }}
        input, select, textarea {{ width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.875rem; box-sizing: border-box; }}
        input:focus, select:focus {{ outline: none; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }}
        .btn {{ background-color: #14532d; color: white; border: none; padding: 12px 20px; font-size: 0.875rem; font-weight: 700; border-radius: 8px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; width: 100%; transition: all 0.2s; }}
        .btn:hover {{ background-color: #0f4a24; }}
        .btn:active {{ transform: scale(0.98); }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.875rem; }}
        th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }}
        th {{ background-color: #f1f5f9; color: #475569; font-weight: 700; }}
        .badge {{ display: inline-block; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 9999px; text-transform: uppercase; }}
        .badge-pending {{ background-color: #fef3c7; color: #d97706; }}
        .badge-success {{ background-color: #dcfce7; color: #15803d; }}
        .badge-info {{ background-color: #e0f2fe; color: #0369a1; }}
        .badge-failed {{ background-color: #fee2e2; color: #b91c1c; }}
        pre {{ background-color: #0f172a; color: #38bdf8; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.8125rem; max-height: 250px; }}
        .header {{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; }}
        .status-pill {{ font-size: 0.875rem; font-weight: 700; padding: 4px 12px; border-radius: 9999px; background-color: #dcfce7; color: #15803d; }}
    </style>
</head>
<body>
    <div class="header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🌴</span>
            <div>
                <h1 style="margin: 0; font-size: 1.5rem;">Goimomi Holidays</h1>
                <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Zoho Payments Webhook Simulation Center</p>
            </div>
        </div>
        <span class="status-pill">Localhost Development Mode</span>
    </div>
    
    <div class="container">
        <!-- Simulator Form -->
        <div>
            <div class="card">
                <h2>Simulate Webhook Event</h2>
                <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 20px;">Use this form to send a simulated Zoho Payments webhook call to the local backend. This triggers database updates, voucher PDFs, CRM contacts, and notifications.</p>
                
                <form id="webhookForm">
                    <div class="form-group">
                        <label>Target Type</label>
                        <select id="targetType" onchange="handleTargetTypeChange()">
                            <option value="cab">Cab Booking</option>
                            <option value="canton">Canton Enquiry</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="cabSelectorGroup">
                        <label>Select Cab Booking Record</label>
                        <select id="cabSelect" onchange="fillFromCab()">
                            <option value="">-- Choose Recent Cab Booking --</option>
                            {cab_options}
                        </select>
                    </div>

                    <div class="form-group" id="cantonSelectorGroup" style="display: none;">
                        <label>Select Canton Enquiry Record</label>
                        <select id="cantonSelect" onchange="fillFromCanton()">
                            <option value="">-- Choose Recent Canton Enquiry --</option>
                            {canton_options}
                        </select>
                    </div>

                    <div class="form-group">
                        <label id="idLabel">Booking ID</label>
                        <input type="text" id="targetId" placeholder="e.g. GO-TRN-0001" required>
                    </div>

                    <div class="form-group">
                        <label>Event Type</label>
                        <select id="eventType">
                            <option value="payment.succeeded">payment.succeeded (Standard Payment Success)</option>
                            <option value="payment_link.paid">payment_link.paid (Link Completed)</option>
                            <option value="payment.failed">payment.failed (Failure - Ignored by View)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Transaction / Payment ID</label>
                        <input type="text" id="paymentId" required>
                    </div>

                    <div class="form-group">
                        <label>Amount (INR)</label>
                        <input type="number" step="0.01" id="amount" required>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <h3 style="font-size: 1rem; margin-bottom: 12px;">Customer Details</h3>

                    <div class="form-group">
                        <label>Customer Name</label>
                        <input type="text" id="custName" value="John Doe">
                    </div>

                    <div class="form-group">
                        <label>Customer Email</label>
                        <input type="email" id="custEmail" value="customer@example.com">
                    </div>

                    <div class="form-group">
                        <label>Customer Phone</label>
                        <input type="text" id="custPhone" value="+919876543210">
                    </div>

                    <button type="submit" class="btn">Send Simulated Webhook</button>
                </form>
            </div>

            <div class="card">
                <h2>Simulation Output</h2>
                <pre id="output">No simulation run yet. Click "Send Simulated Webhook" to execute.</pre>
            </div>
        </div>
        
        <!-- Live Database View -->
        <div>
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h2 style="margin: 0;">Recent Cab Bookings</h2>
                    <a href="javascript:location.reload()" style="font-size: 0.875rem; color: #16a34a; font-weight: 600; text-decoration: none;">🔄 Refresh</a>
                </div>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Name</th>
                                <th>Vehicle</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cab_table_rows}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h2 style="margin: 0;">Recent Canton Enquiries</h2>
                </div>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Business</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {canton_table_rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Set a random mock payment ID on load
        document.getElementById('paymentId').value = 'PAY_MOCK_' + Math.floor(1000000 + Math.random() * 9000000);

        // Pre-fill query parameters if present
        const urlParams = new URLSearchParams(window.location.search);
        const qType = urlParams.get('type');
        const qBookingId = urlParams.get('booking_id');
        const qAmount = urlParams.get('amount');
        const qName = urlParams.get('name');
        const qEmail = urlParams.get('email');
        const qPhone = urlParams.get('phone');

        if (qType) {{
            document.getElementById('targetType').value = qType;
            if (qType === 'canton') {{
                document.getElementById('cabSelectorGroup').style.display = 'none';
                document.getElementById('cantonSelectorGroup').style.display = 'block';
                document.getElementById('idLabel').innerText = 'Enquiry ID';
                document.getElementById('targetId').placeholder = 'e.g. 5';
            }}
        }}
        if (qBookingId) {{
            document.getElementById('targetId').value = qBookingId;
            document.getElementById('cabSelectorGroup').style.display = 'none';
            document.getElementById('cantonSelectorGroup').style.display = 'none';
        }}
        if (qAmount) {{
            document.getElementById('amount').value = qAmount;
        }}
        if (qName) {{
            document.getElementById('custName').value = qName;
        }}
        if (qEmail) {{
            document.getElementById('custEmail').value = qEmail;
        }}
        if (qPhone) {{
            document.getElementById('custPhone').value = qPhone;
        }}

        function handleTargetTypeChange() {{
            const type = document.getElementById('targetType').value;
            if (type === 'cab') {{
                document.getElementById('cabSelectorGroup').style.display = 'block';
                document.getElementById('cantonSelectorGroup').style.display = 'none';
                document.getElementById('idLabel').innerText = 'Booking ID';
                document.getElementById('targetId').placeholder = 'e.g. GO-TRN-0001';
                fillFromCab();
            }} else {{
                document.getElementById('cabSelectorGroup').style.display = 'none';
                document.getElementById('cantonSelectorGroup').style.display = 'block';
                document.getElementById('idLabel').innerText = 'Enquiry ID';
                document.getElementById('targetId').placeholder = 'e.g. 5';
                fillFromCanton();
            }}
        }}

        function fillFromCab() {{
            const select = document.getElementById('cabSelect');
            const selectedOpt = select.options[select.selectedIndex];
            if (!selectedOpt || selectedOpt.value === '') {{
                document.getElementById('targetId').value = '';
                return;
            }}
            document.getElementById('targetId').value = selectedOpt.value;
            document.getElementById('amount').value = selectedOpt.getAttribute('data-amount');
            document.getElementById('custName').value = selectedOpt.getAttribute('data-name');
            document.getElementById('custEmail').value = selectedOpt.getAttribute('data-email');
            document.getElementById('custPhone').value = selectedOpt.getAttribute('data-phone');
        }}

        function fillFromCanton() {{
            const select = document.getElementById('cantonSelect');
            const selectedOpt = select.options[select.selectedIndex];
            if (!selectedOpt || selectedOpt.value === '') {{
                document.getElementById('targetId').value = '';
                return;
            }}
            document.getElementById('targetId').value = selectedOpt.value;
            document.getElementById('amount').value = selectedOpt.getAttribute('data-amount');
            document.getElementById('custName').value = selectedOpt.getAttribute('data-name');
            document.getElementById('custEmail').value = selectedOpt.getAttribute('data-email');
            document.getElementById('custPhone').value = selectedOpt.getAttribute('data-phone');
        }}

        document.getElementById('webhookForm').addEventListener('submit', async (e) => {{
            e.preventDefault();
            const output = document.getElementById('output');
            output.innerText = 'Sending request...';
            
            const targetType = document.getElementById('targetType').value;
            const targetId = document.getElementById('targetId').value;
            const eventType = document.getElementById('eventType').value;
            const paymentId = document.getElementById('paymentId').value;
            const amount = document.getElementById('amount').value;
            const custName = document.getElementById('custName').value;
            const custEmail = document.getElementById('custEmail').value;
            const custPhone = document.getElementById('custPhone').value;

            const payload = {{
                event_type: eventType,
                payload: {{
                    id: paymentId,
                    payment_id: paymentId,
                    amount: parseFloat(amount),
                    metadata: {{
                        booking_id: targetType === 'cab' ? targetId : undefined,
                        enquiry_id: targetType === 'canton' ? targetId : undefined
                    }},
                    customer_details: {{
                        email: custEmail,
                        phone: custPhone,
                        name: custName
                    }}
                }}
            }};

            try {{
                const response = await fetch('/api/payment-webhook/', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify(payload)
                }});
                
                const data = await response.json();
                output.innerText = `HTTP Status: ${{response.status}} ${{response.statusText}}\\n\\n` + JSON.stringify(data, null, 2);
            }} catch (err) {{
                output.innerText = 'Error calling local API:\\n' + err.toString();
            }}
        }});
    </script>
</body>
</html>"""
        return HttpResponse(html_template)

    def create(self, request, *args, **kwargs):
        # 1. Signature Verification (Mandatory in production)
        received_signature = request.headers.get('X-Zoho-Webhook-Signature')
        raw_body = request.body
        
        if not settings.DEBUG and not received_signature:
            return JsonResponse({'error': 'Signature required in production.'}, status=401)
            
        if received_signature:
            is_valid = verify_zoho_signature(raw_body, received_signature)
            if not is_valid:
                return JsonResponse({'error': 'Invalid signature signature verification failed.'}, status=401)
        
        # 2. Parse Webhook Event JSON
        try:
            event_data = json.loads(raw_body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)
            
        event_type = event_data.get('event_type')
        payload = event_data.get('payload', {})
        
        # Only process successful payments
        if event_type not in ['payment.succeeded', 'payment_link.paid']:
            return JsonResponse({'status': 'ignored', 'message': f'Event type {event_type} not handled'}, status=200)

        # 3. Retrieve payment details
        payment_id = payload.get('payment_id') or payload.get('id')
        amount = payload.get('amount')
        
        # Retrieve metadata or custom fields to locate original booking
        metadata = payload.get('metadata', {})
        booking_id = metadata.get('booking_id')
        enquiry_id = metadata.get('enquiry_id')
        
        customer_email = payload.get('customer_details', {}).get('email')
        customer_phone = payload.get('customer_details', {}).get('phone')
        customer_name = payload.get('customer_details', {}).get('name', 'Valued Customer')
        
        # Split customer name for CRM Contact requirements
        name_parts = customer_name.strip().split(' ', 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ""
        last_name = name_parts[1] if len(name_parts) > 1 else "Customer"

        target_booking = None
        
        # 4. Database updates
        if booking_id:
            try:
                target_booking = CabBooking.objects.get(booking_id=booking_id)
                target_booking.status = 'Confirmed'
                target_booking.invoice_number = payment_id  # Save transaction ID
                target_booking.save()
            except CabBooking.DoesNotExist:
                print(f"Booking {booking_id} not found.")
                
        elif enquiry_id:
            try:
                enquiry = CantonEnquiry.objects.get(id=enquiry_id)
                enquiry.payment_status = 'Success'
                enquiry.transaction_id = payment_id
                enquiry.save()
            except CantonEnquiry.DoesNotExist:
                print(f"Enquiry {enquiry_id} not found.")

        # 5. Zoho CRM Customer Sync
        crm_data = {
            'first_name': first_name,
            'last_name': last_name,
            'email': customer_email or (target_booking.email if target_booking else ''),
            'phone': customer_phone or (target_booking.phone if target_booking else '')
        }
        if crm_data['email']:
            upsert_zoho_crm_contact(crm_data)

        # 6. Notifications (Email & WhatsApp)
        # Send Confirmation Email with PDF attachment if CabBooking was updated
        if target_booking and target_booking.email:
            self.send_confirmation_email(target_booking, amount, payment_id)

        # Send WhatsApp Confirmation
        phone_to_notify = customer_phone or (target_booking.phone if target_booking else None)
        if phone_to_notify and booking_id:
            send_whatsapp_confirmation(phone_to_notify, booking_id, str(amount))

        return JsonResponse({'status': 'success', 'message': 'Webhook processed successfully'}, status=200)

    def send_confirmation_email(self, booking, amount, payment_id):
        """
        Sends booking confirmation email with PDF voucher.
        """
        subject = f"Goimomi Holidays - Booking Confirmed - {booking.booking_id}"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
                <h2 style="color: #0284c7;">Payment Successful!</h2>
                <p>Dear {booking.first_name},</p>
                <p>Thank you for booking with Goimomi Holidays. Your payment has been successfully processed.</p>
                <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                <p><strong>Transaction ID:</strong> {payment_id}</p>
                <p><strong>Amount Paid:</strong> INR {amount}</p>
                <p>Your PDF confirmation voucher is attached to this email.</p>
                <p>If you have any questions, please contact our support team.</p>
                <p>Warm regards,<br>Goimomi Holidays</p>
            </body>
        </html>
        """
        email = EmailMultiAlternatives(
            subject=subject,
            body="Thank you for your payment. Your booking has been confirmed.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[booking.email]
        )
        email.attach_alternative(html_content, "text/html")
        
        try:
            pdf_bytes = generate_booking_pdf(booking)
            email.attach(f"Voucher_{booking.booking_id}.pdf", pdf_bytes, "application/pdf")
        except Exception as e:
            print(f"Error attaching PDF to email: {e}")
            
        try:
            email.send()
        except Exception as e:
            print(f"Error sending email: {e}")


