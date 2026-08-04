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
    CancellationPolicy, CantonEnquiry, City, Region, Nationality, Country, Airport, CruiseTerminal, OTPVerification,
    GoimomiProduct, GoimomiProductImage, GoimomiProductOrder
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
    GoimomiProductSerializer, GoimomiProductImageSerializer, GoimomiProductOrderSerializer,
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
            "productOrders": GoimomiProductOrder.objects.count(),
            "goimomiProducts": GoimomiProduct.objects.count(),
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
            from django.core.mail import EmailMultiAlternatives
            sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Reservations@goimomi.com')
            
            # Build rich HTML body to avoid spam filters
            html_body = f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a5c2a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 22px;">Goimomi Holidays</h1>
    <p style="color: #a8e6b8; margin: 4px 0 0; font-size: 13px;">Your Travel Partner</p>
  </div>
  <div style="background: #fff; padding: 24px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 15px; color: #333;">Dear Traveler,</p>
    <p style="font-size: 14px; color: #555; white-space: pre-wrap;">{body}</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 13px; color: #888;">
      For queries, call us at <strong>+91 81100 82222</strong> or email 
      <a href="mailto:hello@goimomi.com" style="color: #1a5c2a;">hello@goimomi.com</a>
    </p>
  </div>
  <div style="background: #f9f9f9; padding: 12px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
    <p style="font-size: 11px; color: #aaa; margin: 0;">
      &copy; 2025 Goimomi Holidays | <a href="https://www.goimomi.com" style="color: #1a5c2a;">www.goimomi.com</a>
    </p>
  </div>
</body>
</html>"""

            msg = EmailMultiAlternatives(
                subject=subject,
                body=body,  # plain text fallback
                from_email=sender,
                to=[email],
                headers={
                    'X-Mailer': 'Goimomi-Holidays-Mailer/1.0',
                    'List-Unsubscribe': '<mailto:hello@goimomi.com?subject=unsubscribe>',
                }
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)
            return Response({"success": "Email sent successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendVisaWhatsAppAPI(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        title = request.data.get("title")
        description = request.data.get("description")
        
        if not phone or not title:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Clean phone number for WhatsApp
        cleaned_phone = "".join(filter(str.isdigit, phone))
        if not cleaned_phone.startswith("+"):
            cleaned_phone = f"+{cleaned_phone}"
            
        message_body = f"*{title}*\n\n"
        if description:
            message_body += f"{description}\n\n"
        message_body += "Shared via Goimomi Holidays."
        
        try:
            from django.conf import settings
            import importlib
            
            account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
            auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
            whatsapp_number = getattr(settings, 'TWILIO_WHATSAPP_NUMBER', '')
            
            if account_sid and auth_token and whatsapp_number:
                twilio_rest = importlib.import_module('twilio.rest')
                client = twilio_rest.Client(account_sid, auth_token)
                client.messages.create(
                    from_=f"whatsapp:{whatsapp_number}",
                    body=message_body,
                    to=f"whatsapp:{cleaned_phone}"
                )
                return Response({"success": "WhatsApp message sent successfully via Twilio"})
            else:
                # Log simulated WhatsApp
                print(f"[MOCK WHATSAPP SEND] To: {cleaned_phone}\nBody:\n{message_body}")
                return Response({"success": "WhatsApp message sent (simulated)"})
        except Exception as e:
            print(f"Error sending WhatsApp: {e}")
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
        
        subject = "Verification Code - Goimomi Holidays"
        message = f"Hello,\n\nPlease use the following verification code to confirm your email address on Goimomi Holidays:\n\n{otp}\n\nThis code will expire in 5 minutes.\n\nBest regards,\nGoimomi Holidays Team"
        
        # Clean, modern, minimal HTML template with low spam score
        html_message = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px 0; color: #333333;">
            <p style="font-size: 16px; line-height: 24px; margin: 0 0 16px 0;">Hello,</p>
            <p style="font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">Please use the following verification code to confirm your email address on Goimomi Holidays:</p>
            
            <div style="margin: 24px 0; padding: 16px; background-color: #f4f5f7; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111111; font-family: monospace;">
                {otp}
            </div>
            
            <p style="font-size: 14px; line-height: 20px; color: #666666; margin: 0 0 24px 0;">
                This code is valid for 5 minutes. For security, please do not share this code with anyone.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
            
            <p style="font-size: 12px; line-height: 16px; color: #888888; margin: 0;">
                Goimomi Holidays Travel Desk
            </p>
        </div>
        """
        
        try:
            from django.core.mail import EmailMultiAlternatives
            import threading
            msg = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            msg.attach_alternative(html_message, "text/html")
            
            # Send in background thread to avoid blocking Gunicorn worker
            threading.Thread(target=msg.send).start()
            return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            try:
                from django.core.mail import send_mail
                import threading
                # Send in background thread to avoid blocking Gunicorn worker
                threading.Thread(
                    target=send_mail,
                    args=(subject, message, settings.DEFAULT_FROM_EMAIL, [email]),
                    kwargs={'fail_silently': False}
                ).start()
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

        # After successful creation, generate Zoho payment session and return it directly
        if response.status_code == 201:
            try:
                booking_id = response.data.get('booking_id')
                booking_pk = response.data.get('id')
                if booking_id and booking_pk:
                    booking_obj = CabBooking.objects.get(pk=booking_pk)
                    
                    from Holidays.services.zoho_payment import ZohoPaymentService
                    from django.shortcuts import reverse

                    # Construct backend verify URL dynamically
                    try:
                        verify_path = reverse('cab-booking-verify-zoho-payment')
                        backend_verify_url = request.build_absolute_uri(verify_path)
                    except Exception:
                        backend_verify_url = request.build_absolute_uri('/api/cab-bookings/verify-zoho-payment/')

                    # Append booking_id query parameter so it is passed back in redirect URL
                    if '?' in backend_verify_url:
                        backend_verify_url = f"{backend_verify_url}&booking_id={booking_obj.booking_id}"
                    else:
                        backend_verify_url = f"{backend_verify_url}?booking_id={booking_obj.booking_id}"

                    # Failure URL redirects to the dedicated frontend /payment-failed page
                    frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goimomi.com').rstrip('/')
                    frontend_failure_url = f"{frontend_url}/payment-failed?booking_id={booking_obj.booking_id}"

                    # Create payment session via Zoho Payment Service
                    session = ZohoPaymentService.create_checkout_session(
                        booking=booking_obj,
                        success_url=backend_verify_url,
                        failure_url=frontend_failure_url
                    )

                    payments_session_id = getattr(session, 'payments_session_id', None)
                    access_key = getattr(session, 'access_key', None)

                    if payments_session_id and access_key:
                        # Store in the booking
                        booking_obj.zoho_payment_session_id = payments_session_id
                        booking_obj.zoho_access_key = access_key
                        booking_obj.save()

                        # Determine hosted checkout page domain based on edition
                        edition_str = getattr(settings, 'ZOHO_PAYMENTS_EDITION', 'IN_SANDBOX').upper()
                        if edition_str == 'IN':
                            checkout_domain = 'payments.zoho.in'
                        elif edition_str == 'US':
                            checkout_domain = 'payments.zoho.com'
                        else:
                            checkout_domain = 'paymentssandbox.zoho.in'

                        redirect_url = f"https://{checkout_domain}/hostedcheckout/{access_key}"
                        response.data['payment_url'] = redirect_url
                    else:
                        # Fallback to failed page if we can't create session
                        response.data['payment_url'] = f"{frontend_url}/payment-failed?booking_id={booking_obj.booking_id}"
            except Exception as e:
                print(f"Error generating Zoho payment session during booking creation: {e}")
                frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goimomi.com').rstrip('/')
                response.data['payment_url'] = f"{frontend_url}/payment-failed?booking_id={booking_id}"

        return response

    @action(detail=True, methods=['post'], url_path='confirm-payment', permission_classes=[AllowAny])
    def confirm_payment(self, request, pk=None):
        try:
            booking = self.get_object()
            
            # Find all bookings created by this user (same email and phone) in the last 10 minutes that are still 'Booking Requested'
            from datetime import timedelta
            time_threshold = timezone.now() - timedelta(minutes=10)
            
            bookings_to_confirm = CabBooking.objects.filter(
                email=booking.email,
                phone=booking.phone,
                status='Booking Requested',
                created_at__gte=time_threshold
            )
            
            import random
            confirmed_count = 0
            invoice_number = f"GM-TXN-{random.randint(100000, 999999)}"
            
            for b in bookings_to_confirm:
                b.status = 'Confirmed'
                b.invoice_number = invoice_number
                b.save()
                confirmed_count += 1
                
            # If the current booking was not in the filter (e.g. status was already changed), confirm it specifically
            if booking.status == 'Booking Requested':
                booking.status = 'Confirmed'
                booking.invoice_number = invoice_number
                booking.save()
                confirmed_count += 1
                
            # Sync user to Zoho CRM Contact list
            try:
                from Holidays.utils import upsert_zoho_crm_contact
                crm_data = {
                    'first_name': booking.first_name,
                    'last_name': booking.last_name or 'Customer',
                    'email': booking.email,
                    'phone': booking.phone
                }
                if crm_data['email']:
                    import threading
                    threading.Thread(target=upsert_zoho_crm_contact, args=(crm_data,)).start()
            except Exception as crm_err:
                print(f"Error syncing contact to Zoho CRM: {crm_err}")

            # Send booking confirmation email with voucher PDF
            try:
                from Holidays.utils import send_booking_voucher
                import threading
                threading.Thread(target=send_booking_voucher, args=(booking,)).start()
            except Exception as email_err:
                print(f"Error sending booking confirmation email: {email_err}")

            return Response({
                'message': f'Confirmed {confirmed_count} bookings successfully.',
                'invoice_number': invoice_number,
                'status': 'Confirmed'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='create-zoho-payment-session', permission_classes=[AllowAny])
    def create_zoho_payment_session(self, request, pk=None):
        try:
            booking = self.get_object()
            from Holidays.services.zoho_payment import ZohoPaymentService
            from django.shortcuts import reverse
            
            # Construct backend verify URL dynamically
            try:
                verify_path = reverse('cab-booking-verify-zoho-payment')
                backend_verify_url = request.build_absolute_uri(verify_path)
            except Exception:
                backend_verify_url = request.build_absolute_uri('/api/cab-bookings/verify-zoho-payment/')

            # Append booking_id query parameter so it is passed back in redirect URL
            if '?' in backend_verify_url:
                backend_verify_url = f"{backend_verify_url}&booking_id={booking.booking_id}"
            else:
                backend_verify_url = f"{backend_verify_url}?booking_id={booking.booking_id}"

            # Failure URL (on frontend payment failed page)
            frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goimomi.com').rstrip('/')
            frontend_failure_url = f"{frontend_url}/payment-failed?booking_id={booking.booking_id}"

            # Create payment session via Zoho Payment Service
            session = ZohoPaymentService.create_checkout_session(
                booking=booking,
                success_url=backend_verify_url,
                failure_url=frontend_failure_url
            )

            payments_session_id = getattr(session, 'payments_session_id', None)
            access_key = getattr(session, 'access_key', None)

            if not payments_session_id or not access_key:
                return Response(
                    {'error': 'Failed to retrieve session ID or access key from Zoho Payments.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Store in the booking
            booking.zoho_payment_session_id = payments_session_id
            booking.zoho_access_key = access_key
            booking.save()

            # Determine hosted checkout page domain based on edition
            edition_str = getattr(settings, 'ZOHO_PAYMENTS_EDITION', 'IN_SANDBOX').upper()
            if edition_str == 'IN':
                checkout_domain = 'payments.zoho.in'
            elif edition_str == 'US':
                checkout_domain = 'payments.zoho.com'
            else:
                checkout_domain = 'paymentssandbox.zoho.in'

            redirect_url = f"https://{checkout_domain}/hostedcheckout/{access_key}"

            return Response({
                'payments_session_id': payments_session_id,
                'access_key': access_key,
                'redirect_url': redirect_url
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error creating Zoho Payment Session: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='verify-zoho-payment', permission_classes=[AllowAny])
    def verify_zoho_payment(self, request):
        from django.http import HttpResponseRedirect
        from Holidays.services.zoho_payment import ZohoPaymentService
        import random

        booking_id = request.GET.get('booking_id')
        session_id = request.GET.get('session_id') or request.GET.get('payments_session_id')

        frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goimomi.com').rstrip('/')

        booking = None
        if booking_id:
            try:
                booking = CabBooking.objects.get(booking_id=booking_id)
            except CabBooking.DoesNotExist:
                pass

        if not booking and session_id:
            try:
                booking = CabBooking.objects.get(zoho_payment_session_id=session_id)
            except CabBooking.DoesNotExist:
                pass

        if not booking:
            return HttpResponseRedirect(f"{frontend_url}/cab?error=booking_not_found")

        frontend_failure_url = f"{frontend_url}/payment-failed?booking_id={booking.booking_id}"

        if not session_id:
            session_id = booking.zoho_payment_session_id

        if not session_id:
            return HttpResponseRedirect(frontend_failure_url)

        # Verify hosted checkout redirect signature (data integrity check)
        signing_key = getattr(settings, 'ZOHO_PAYMENTS_SIGNING_KEY', '')
        if signing_key:
            signature = request.GET.get('signature')
            if not signature:
                print("Verify Error: Redirect signature missing")
                return HttpResponseRedirect(frontend_failure_url)

            # Get Zoho Payments signature parameters
            payments_session_id = request.GET.get('payments_session_id', '')
            payment_session_status = request.GET.get('payment_session_status', '')
            payment_id = request.GET.get('payment_id', '')
            payment_status = request.GET.get('payment_status', '')
            amount = request.GET.get('amount', '')
            mandate_id = request.GET.get('mandate_id', '')
            udf1 = request.GET.get('udf1', '')
            udf2 = request.GET.get('udf2', '')
            udf3 = request.GET.get('udf3', '')
            udf4 = request.GET.get('udf4', '')
            udf5 = request.GET.get('udf5', '')

            # Message format: payments_session_id.payment_session_status.payment_id.payment_status.amount.mandate_id.udf1.udf2.udf3.udf4.udf5
            fields = [
                payments_session_id,
                payment_session_status,
                payment_id,
                payment_status,
                amount,
                mandate_id,
                udf1,
                udf2,
                udf3,
                udf4,
                udf5
            ]
            fields = [f if f is not None else '' for f in fields]
            data_to_sign = ".".join(fields)

            import hmac
            import hashlib
            expected_signature = hmac.new(
                signing_key.encode('utf-8'),
                data_to_sign.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(expected_signature, signature):
                print(f"Verify Error: Redirect signature verification failed. Expected: {expected_signature}, Got: {signature}")
                return HttpResponseRedirect(frontend_failure_url)

        def _safe_get(obj, key, default=None):
            if obj is None: return default
            if isinstance(obj, dict): return obj.get(key, default)
            return getattr(obj, key, default)

        param_session_status = (request.GET.get('payment_session_status') or '').lower()
        param_payment_status = (request.GET.get('payment_status') or '').lower()
        param_success = (
            param_session_status in ['paid', 'succeeded', 'completed', 'success'] or
            param_payment_status in ['succeeded', 'paid', 'success', 'completed']
        )

        try:
            api_success = False
            session_status = ''
            try:
                session = ZohoPaymentService.get_payment_session(session_id)
                session_status = _safe_get(session, 'status', '').lower()
                payments_list = _safe_get(session, 'payments', [])
                if not payments_list and isinstance(session, dict):
                    payments_list = session.get('data', {}).get('payments', [])

                has_succeeded_payment = any(_safe_get(p, 'status', '').lower() in ['succeeded', 'paid', 'success'] for p in (payments_list or []))
                if session_status in ['paid', 'succeeded', 'completed', 'success'] or has_succeeded_payment:
                    api_success = True
            except Exception as s_err:
                print(f"Notice getting Cab Zoho session: {s_err}")

            if api_success or param_success:
                # Mark booking as Confirmed (mimics confirm_payment action)
                from datetime import timedelta
                time_threshold = booking.created_at - timedelta(minutes=10)
                
                bookings_to_confirm = CabBooking.objects.filter(
                    email=booking.email,
                    phone=booking.phone,
                    status='Booking Requested',
                    created_at__gte=time_threshold
                )
                
                invoice_number = f"GM-TXN-{random.randint(100000, 999999)}"
                
                confirmed_count = 0
                for b in bookings_to_confirm:
                    b.status = 'Confirmed'
                    b.invoice_number = invoice_number
                    b.save()
                    confirmed_count += 1

                if booking.status == 'Booking Requested':
                    booking.status = 'Confirmed'
                    booking.invoice_number = invoice_number
                    booking.save()

                # Sync user to Zoho CRM Contact list
                try:
                    from Holidays.utils import upsert_zoho_crm_contact
                    crm_data = {
                        'first_name': booking.first_name,
                        'last_name': booking.last_name or 'Customer',
                        'email': booking.email,
                        'phone': booking.phone
                    }
                    if crm_data['email']:
                        import threading
                        threading.Thread(target=upsert_zoho_crm_contact, args=(crm_data,)).start()
                except Exception as crm_err:
                    print(f"Error syncing contact to Zoho CRM: {crm_err}")

                # Send booking confirmation email with voucher PDF after successful payment
                try:
                    from Holidays.utils import send_booking_voucher
                    import threading
                    threading.Thread(target=send_booking_voucher, args=(booking,)).start()
                except Exception as email_err:
                    print(f"Error sending booking confirmation email after Zoho payment: {email_err}")

                return HttpResponseRedirect(f"{frontend_url}/cab?payment_success=true&booking_id={booking.booking_id}")
            else:
                return HttpResponseRedirect(f"{frontend_url}/payment-failed?booking_id={booking.booking_id}&status={session_status}")

        except Exception as e:
            print(f"Error verifying Zoho Payment: {e}")
            return HttpResponseRedirect(frontend_failure_url)

    @action(detail=False, methods=['post'], url_path='zoho-webhook', permission_classes=[AllowAny])
    def zoho_webhook(self, request):
        import hmac
        import hashlib
        import json
        import random
        from django.http import HttpResponse

        signature_header = request.headers.get('X-Zoho-Webhook-Signature')
        if not signature_header:
            print("Webhook Error: Missing X-Zoho-Webhook-Signature header")
            return HttpResponse("Missing signature header", status=400)

        signing_key = getattr(settings, 'ZOHO_PAYMENTS_WEBHOOK_SIGNING_KEY', '')
        if not signing_key:
            print("Webhook Error: Webhook signing key not configured in settings")
            return HttpResponse("Signing key not configured", status=500)

        # Get raw request body
        raw_body = request.body.decode('utf-8')

        try:
            # Parse header: "t=TIMESTAMP,v=SIGNATURE"
            parts = {part.split('=')[0]: part.split('=')[1] for part in signature_header.split(',')}
            timestamp = parts.get('t')
            received_signature = parts.get('v')

            if not timestamp or not received_signature:
                print("Webhook Error: Invalid signature header format")
                return HttpResponse("Invalid signature header format", status=400)

            # Verify signature: "timestamp.raw_body"
            data_to_verify = f"{timestamp}.{raw_body}"
            expected_signature = hmac.new(
                signing_key.encode('utf-8'),
                data_to_verify.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(expected_signature, received_signature):
                print("Webhook Error: Signature verification failed")
                return HttpResponse("Unauthorized signature", status=401)

            # Parse event payload
            payload = json.loads(raw_body)
            event_type = payload.get('event_type')
            event_object = payload.get('event_object', {})
            payment = event_object.get('payment', {})

            print(f"Webhook Received: Event {event_type} for Payment Session {payment.get('payments_session_id')}")

            if event_type == 'payment.succeeded':
                booking_id = payment.get('reference_number')
                session_id = payment.get('payments_session_id')
                invoice_no = payment.get('invoice_number')

                booking = None
                if booking_id:
                    try:
                        booking = CabBooking.objects.get(booking_id=booking_id)
                    except CabBooking.DoesNotExist:
                        pass

                if not booking and session_id:
                    try:
                        booking = CabBooking.objects.get(zoho_payment_session_id=session_id)
                    except CabBooking.DoesNotExist:
                        pass

                if booking:
                    if booking.status == 'Booking Requested':
                        # Mimics original confirm_payment logic
                        from datetime import timedelta
                        time_threshold = booking.created_at - timedelta(minutes=10)

                        bookings_to_confirm = CabBooking.objects.filter(
                            email=booking.email,
                            phone=booking.phone,
                            status='Booking Requested',
                            created_at__gte=time_threshold
                        )

                        invoice_number = invoice_no or f"GM-TXN-{random.randint(100000, 999999)}"

                        for b in bookings_to_confirm:
                            b.status = 'Confirmed'
                            b.invoice_number = invoice_number
                            b.save()

                        booking.status = 'Confirmed'
                        booking.invoice_number = invoice_number
                        booking.save()
                        print(f"Webhook Success: Booking {booking.booking_id} confirmed via webhook")

                        # Send booking confirmation email with voucher PDF
                        try:
                            from Holidays.utils import send_booking_voucher
                            import threading
                            threading.Thread(target=send_booking_voucher, args=(booking,)).start()
                        except Exception as email_err:
                            print(f"Error sending booking confirmation email via webhook: {email_err}")
                else:
                    print(f"Webhook Warning: Booking not found for reference_number={booking_id} or session_id={session_id}")

            return HttpResponse("Webhook processed successfully", status=200)

        except Exception as e:
            print(f"Webhook Exception: {e}")
            return HttpResponse(str(e), status=400)

    def perform_create(self, serializer):
        booking = serializer.save()
        booking.refresh_from_db()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status
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

        # If status updated to Confirmed or Completed, automatically send Voucher & Invoice email
        if old_status != booking.status and booking.status in ['Confirmed', 'Completed', 'confirmed', 'completed']:
            try:
                from Holidays.utils import send_booking_voucher
                import threading
                threading.Thread(target=send_booking_voucher, args=(booking,)).start()
                print(f"Cab booking voucher & invoice email triggered for booking {booking.booking_id}")
            except Exception as mail_err:
                print(f"Error triggering cab booking email on status update: {mail_err}")

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

    @action(detail=True, methods=['get'], url_path='download-voucher', permission_classes=[IsAuthenticated])
    def download_voucher(self, request, pk=None):
        booking = self.get_object()
        try:
            from .utils import generate_booking_pdf
            pdf_bytes = generate_booking_pdf(booking)
            from django.http import HttpResponse
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            b_id = booking.booking_id or f"GO-TRN-{str(booking.pk).zfill(4)}"
            response['Content-Disposition'] = f'attachment; filename="Voucher_{b_id}.pdf"'
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='download-voucher-public', permission_classes=[AllowAny])
    def download_voucher_public(self, request):
        booking_id = request.query_params.get('booking_id') or request.query_params.get('id')
        if not booking_id:
            return Response({"error": "booking_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from Holidays.models import CabBooking
            if booking_id.isdigit():
                booking = CabBooking.objects.get(pk=booking_id)
            else:
                booking = CabBooking.objects.get(booking_id=booking_id)
            
            from .utils import generate_booking_pdf
            pdf_bytes = generate_booking_pdf(booking)
            from django.http import HttpResponse
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            b_id = booking.booking_id or f"GO-TRN-{str(booking.pk).zfill(4)}"
            response['Content-Disposition'] = f'attachment; filename="Voucher_{b_id}.pdf"'
            return response
        except CabBooking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='download-invoice-public', permission_classes=[AllowAny])
    def download_invoice_public(self, request):
        booking_id = request.query_params.get('booking_id') or request.query_params.get('id')
        if not booking_id:
            return Response({"error": "booking_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from Holidays.models import CabBooking
            if booking_id.isdigit():
                booking = CabBooking.objects.get(pk=booking_id)
            else:
                booking = CabBooking.objects.get(booking_id=booking_id)
            
            from .utils import generate_booking_invoice_pdf
            pdf_bytes = generate_booking_invoice_pdf(booking)
            from django.http import HttpResponse
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            invoice_no = booking.invoice_number or f"INV-{booking.booking_id}"
            response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice_no}.pdf"'
            return response
        except CabBooking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
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
            routes = rc.routes
            col_vehicles = rc.column_vehicles
            import json
            if isinstance(routes, str):
                try:
                    routes = json.loads(routes)
                except Exception:
                    routes = []
            if isinstance(col_vehicles, str):
                try:
                    col_vehicles = json.loads(col_vehicles)
                except Exception:
                    col_vehicles = []

            column_vehicles = [v.strip() if v else "" for v in (col_vehicles or [])]
            
            for route in (routes or []):
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


def payment_callback(request):
    from django.http import HttpResponse
    import requests
    from django.conf import settings

    code = request.GET.get('code')
    if not code:
        return HttpResponse("Zoho OAuth Callback reached, but no code query parameter was provided. Visit the Zoho Developer Console to start the OAuth flow.")

    zoho_client_id = getattr(settings, 'ZOHO_CRM_CLIENT_ID', '').strip()
    zoho_client_secret = getattr(settings, 'ZOHO_CRM_CLIENT_SECRET', '').strip()
    
    # Target exact redirect URI
    zoho_redirect_uri = 'https://goimomi.com/payment/callback'

    payload = {
        'code': code,
        'client_id': zoho_client_id,
        'client_secret': zoho_client_secret,
        'redirect_uri': zoho_redirect_uri,
        'grant_type': 'authorization_code',
    }

    try:
        response = requests.post('https://accounts.zoho.in/oauth/v2/token', data=payload, timeout=15)
        token_data = response.json()
        
        if 'error' in token_data:
            return HttpResponse(f"Zoho OAuth Failed: {token_data.get('error')}<br>Details: {token_data}<br>Payload used: {payload}")
            
        refresh_token = token_data.get('refresh_token')
        access_token = token_data.get('access_token')
        
        from Holidays.utils import update_env_file
        
        env_updated = False
        if refresh_token:
            # Save the tokens in the .env file
            update_env_file('ZOHO_CRM_REFRESH_TOKEN', refresh_token)
            
            # Dynamically update settings in memory
            setattr(settings, 'ZOHO_CRM_REFRESH_TOKEN', refresh_token)
            env_updated = True
            
        status_message = "Refresh tokens have been successfully updated in your backend .env file and loaded in memory!" if env_updated else "No new refresh token was returned (you might need to use prompt=consent or revoke existing authorization)."
        
        html_content = f"""
        <html>
        <head>
            <title>Zoho OAuth Successful</title>
            <style>
                body {{ font-family: sans-serif; padding: 40px; background-color: #f9f9f9; }}
                .container {{ background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }}
                h1 {{ color: #2e7d32; }}
                .status-box {{ background: #e8f5e9; border: 1px solid #a5d6a7; padding: 15px; border-radius: 4px; color: #1b5e20; font-weight: bold; margin: 15px 0; }}
                .token-box {{ background: #f1f8e9; border: 1px solid #c5e1a5; padding: 15px; border-radius: 4px; font-family: monospace; word-break: break-all; margin: 15px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Zoho OAuth Successful!</h1>
                <div class="status-box">{status_message}</div>
                <p><strong>Refresh Token:</strong></p>
                <div class="token-box">ZOHO_CRM_REFRESH_TOKEN={refresh_token}</div>
                <p><strong>Raw Response:</strong></p>
                <div class="token-box">{token_data}</div>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)
    except Exception as e:
        return HttpResponse(f"Error exchanging authorization code: {e}")



# ─────────────────────────────────────────────────────────────────────────────
# Goimomi Product
# ─────────────────────────────────────────────────────────────────────────────

class GoimomiProductViewSet(ModelViewSet):
    """
    ViewSet for GoimomiProduct.
    - List / Retrieve: public (no auth needed)
    - Create / Update / Destroy: admin authenticated only
    """
    serializer_class = GoimomiProductSerializer
    queryset = GoimomiProduct.objects.all()
    pagination_class = None

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = GoimomiProduct.objects.all()
        stock_status = self.request.query_params.get('stock_status')
        if stock_status:
            queryset = queryset.filter(stock_status=stock_status)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Handle multiple images
        images = request.FILES.getlist('product_images')
        for idx, img in enumerate(images):
            GoimomiProductImage.objects.create(product=product, image=img, order=idx)
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Handle multiple images (append new ones)
        images = request.FILES.getlist('product_images')
        if images:
            # Get current max order
            max_order = getattr(product.images.order_by('-order').first(), 'order', -1)
            for idx, img in enumerate(images):
                GoimomiProductImage.objects.create(product=product, image=img, order=max_order + 1 + idx)

        # Handle removals of specific images
        remove_ids = request.data.get('remove_image_ids')
        if remove_ids:
            try:
                ids = json.loads(remove_ids) if isinstance(remove_ids, str) else remove_ids
                if ids:
                    GoimomiProductImage.objects.filter(id__in=ids, product=product).delete()
            except Exception as e:
                print(f"Error removing images: {e}")
        # Re-fetch instance to serialize updated images list
        serializer = self.get_serializer(product)
        return Response(serializer.data)


class GoimomiProductOrderViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrWriteOnly]
    queryset = GoimomiProductOrder.objects.all().order_by('-created_at')
    serializer_class = GoimomiProductOrderSerializer
    pagination_class = None

    @action(detail=False, methods=['post'], url_path='send-otp', permission_classes=[AllowAny])
    def send_otp(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        import random
        otp = str(random.randint(100000, 999999))
        
        OTPVerification.objects.update_or_create(
            email=email,
            defaults={'otp': otp, 'is_verified': False}
        )
        
        subject = "Verification Code - Goimomi Products Order"
        message = f"Hello,\n\nYour OTP for Goimomi Products order verification is:\n\n{otp}\n\nThis code will expire in 5 minutes.\n\nBest regards,\nGoimomi Holidays Team"
        
        html_message = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px 0; color: #333333;">
            <p style="font-size: 16px; line-height: 24px; margin: 0 0 16px 0;">Hello,</p>
            <p style="font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">Please use the following verification code to confirm your email address on Goimomi Products:</p>
            
            <div style="margin: 24px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #14532d; font-family: monospace;">
                {otp}
            </div>
            
            <p style="font-size: 14px; line-height: 20px; color: #666666; margin: 0 0 24px 0;">
                This code is valid for 5 minutes. For security, please do not share this code with anyone.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
            
            <p style="font-size: 12px; line-height: 16px; color: #888888; margin: 0;">
                Goimomi Products | support@goimomi.com
            </p>
        </div>
        """
        
        try:
            from django.core.mail import EmailMultiAlternatives
            import threading
            sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@goimomi.com')
            msg = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=sender,
                to=[email]
            )
            msg.attach_alternative(html_message, "text/html")
            threading.Thread(target=msg.send).start()
            return Response({'message': 'OTP sent successfully to your email address.'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error sending OTP email: {e}")
            return Response({'error': 'Failed to send OTP email. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='verify-otp', permission_classes=[AllowAny])
    def verify_otp(self, request):
        email = request.data.get('email', '').strip().lower()
        otp_input = request.data.get('otp', '').strip()
        
        if not email or not otp_input:
            return Response({'error': 'Email address and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        from datetime import timedelta
        try:
            otp_obj = OTPVerification.objects.get(email=email)
            if timezone.now() - otp_obj.created_at > timedelta(minutes=5):
                return Response({'error': 'OTP has expired. Please request a new code.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if otp_obj.otp == otp_input:
                otp_obj.is_verified = True
                otp_obj.save()
                return Response({'message': 'Email address verified successfully.'}, status=status.HTTP_200_OK)
        except OTPVerification.DoesNotExist:
            pass
            
        return Response({'error': 'Invalid or expired OTP code.'}, status=status.HTTP_400_BAD_REQUEST)

    def _deduct_stock_and_notify(self, order):
        """
        Deducts quantity from product stock and auto-updates stock_status to 'out_of_stock' when quantity reaches 0.
        """
        if getattr(order, '_stock_deducted', False):
            return

        if order.product:
            prod = order.product
            prod.quantity = max(0, prod.quantity - order.quantity)
            prod.save()  # Triggers GoimomiProduct.save() which sets stock_status='out_of_stock' if quantity <= 0
        elif order.cart_items:
            for item in order.cart_items:
                pid = item.get('product_id')
                qty = int(item.get('quantity', 1))
                try:
                    prod = GoimomiProduct.objects.get(pk=pid)
                    prod.quantity = max(0, prod.quantity - qty)
                    prod.save()  # Triggers GoimomiProduct.save()
                except GoimomiProduct.DoesNotExist:
                    pass
        
        order._stock_deducted = True

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        old_status = order.status
        response = super().partial_update(request, *args, **kwargs)
        order.refresh_from_db()

        # If status changed to Confirmed or Completed, trigger stock deduction and send confirmation email
        if old_status != order.status and order.status in ['Confirmed', 'Completed', 'confirmed', 'completed']:
            self._deduct_stock_and_notify(order)
            try:
                from Holidays.utils import send_product_order_email
                send_product_order_email(order)
                print(f"Product Order email triggered for Order {order.order_id} (Status: {order.status}) to {order.email}")
            except Exception as mail_err:
                print(f"Error sending email on admin status change: {mail_err}")

        return response

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product') # None if cart checkout
        cart_items = request.data.get('cart_items') # list of dicts: [{'product_id': id, 'quantity': qty, 'price': price}]
        quantity = int(request.data.get('quantity', 1))
        name = request.data.get('name')
        email = request.data.get('email', '').strip()
        phone = request.data.get('phone')
        address = request.data.get('address')

        if not name or not phone or not address or not email:
            return Response({'error': 'Name, phone, email, and address are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.is_authenticated:
            try:
                otp_obj = OTPVerification.objects.get(email=email.lower())
                if not otp_obj.is_verified:
                    return Response({'error': 'Please verify your email address via OTP before placing order.'}, status=status.HTTP_400_BAD_REQUEST)
            except OTPVerification.DoesNotExist:
                return Response({'error': 'Email address has not been verified with OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        if not product_id and not cart_items:
            return Response({'error': 'Either a single product or cart items must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = 0
        order_price = 0

        if product_id:
            # Single product checkout
            try:
                product_obj = GoimomiProduct.objects.get(pk=product_id)
            except GoimomiProduct.DoesNotExist:
                return Response({'error': 'Selected product does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

            if product_obj.stock_status == 'out_of_stock' or product_obj.quantity < quantity:
                return Response({'error': f'Product is out of stock or requested quantity ({quantity}) exceeds available stock.'}, status=status.HTTP_400_BAD_REQUEST)

            order_price = product_obj.price
            total_amount = order_price * quantity
            
            order = GoimomiProductOrder.objects.create(
                product=product_obj,
                name=name,
                email=email,
                phone=phone,
                quantity=quantity,
                price=order_price,
                total_amount=total_amount,
                address=address,
                status='Pending'
            )
        else:
            # Cart checkout
            validated_items = []
            for item in cart_items:
                pid = item.get('product_id')
                qty = int(item.get('quantity', 1))
                try:
                    p_obj = GoimomiProduct.objects.get(pk=pid)
                except GoimomiProduct.DoesNotExist:
                    return Response({'error': f"Product with ID {pid} in cart does not exist."}, status=status.HTTP_400_BAD_REQUEST)
                
                if p_obj.stock_status == 'out_of_stock' or p_obj.quantity < qty:
                    return Response({'error': f"Product '{p_obj.title}' is out of stock or requested quantity ({qty}) exceeds available stock."}, status=status.HTTP_400_BAD_REQUEST)
                
                total_amount += p_obj.price * qty
                validated_items.append({
                    'product_id': p_obj.id,
                    'title': p_obj.title,
                    'price': float(p_obj.price),
                    'quantity': qty
                })
            
            order = GoimomiProductOrder.objects.create(
                product=None,
                name=name,
                email=email,
                phone=phone,
                quantity=sum(i['quantity'] for i in validated_items),
                price=0,
                total_amount=total_amount,
                address=address,
                cart_items=validated_items,
                status='Pending'
            )

        order.refresh_from_db()

        # Record in Enquiry table so admin sees customer details in Enquiries
        try:
            prod_info = product_obj.title if product_obj else ", ".join([f"{item['title']} (x{item['quantity']})" for item in validated_items])
            Enquiry.objects.create(
                name=name,
                email=email or "",
                phone=phone,
                destination=f"Product Order: {prod_info}",
                purpose=f"Address: {address} | Quantity: {order.quantity} | Total: ₹{total_amount} | Order ID: {order.order_id}",
                enquiry_type="General"
            )
        except Exception as eq_err:
            print(f"Error creating general enquiry backup: {eq_err}")

        # Generate Zoho Payments session
        try:
            from Holidays.services.zoho_payment import ZohoPaymentService

            # Success & failure redirect URLs
            frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goimomi.com').rstrip('/')
            
            # Construct backend verify URL dynamically
            try:
                from django.shortcuts import reverse
                verify_path = reverse('goimomi-product-order-verify-zoho-payment')
                backend_verify_url = request.build_absolute_uri(verify_path)
            except Exception:
                backend_verify_url = request.build_absolute_uri('/api/goimomi-product-orders/verify-zoho-payment/')

            if '?' in backend_verify_url:
                backend_verify_url = f"{backend_verify_url}&order_id={order.order_id}"
            else:
                backend_verify_url = f"{backend_verify_url}?order_id={order.order_id}"

            # Force HTTPS for Zoho Payments redirect callback URL
            if backend_verify_url.startswith('http://'):
                backend_verify_url = backend_verify_url.replace('http://', 'https://', 1)

            frontend_failure_url = f"{frontend_url}/payment-failed?order_id={order.order_id}"
            if frontend_failure_url.startswith('http://'):
                frontend_failure_url = frontend_failure_url.replace('http://', 'https://', 1)

            session = ZohoPaymentService.create_product_checkout_session(
                order=order,
                success_url=backend_verify_url,
                failure_url=frontend_failure_url
            )

            payments_session_id = getattr(session, 'payments_session_id', None)
            access_key = getattr(session, 'access_key', None)

            if payments_session_id and access_key:
                order.zoho_payment_session_id = payments_session_id
                order.zoho_access_key = access_key
                order.save()

                # Hosted checkout page domain based on edition
                edition_str = getattr(settings, 'ZOHO_PAYMENTS_EDITION', 'IN_SANDBOX').upper()
                if edition_str == 'IN':
                    checkout_domain = 'payments.zoho.in'
                elif edition_str == 'US':
                    checkout_domain = 'payments.zoho.com'
                else:
                    checkout_domain = 'paymentssandbox.zoho.in'

                payment_url = f"https://{checkout_domain}/hostedcheckout/{access_key}"
                
                serializer = self.get_serializer(order)
                response_data = serializer.data
                response_data['payment_url'] = payment_url
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                serializer = self.get_serializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Zoho payment session notice: {e}")
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='verify-zoho-payment', permission_classes=[AllowAny])
    def verify_zoho_payment(self, request):
        from django.http import HttpResponseRedirect
        from Holidays.services.zoho_payment import ZohoPaymentService
        import random

        order_id = request.GET.get('order_id')
        session_id = request.GET.get('session_id') or request.GET.get('payments_session_id')

        frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goimomi.com').rstrip('/')

        order = None
        if order_id:
            try:
                order = GoimomiProductOrder.objects.get(order_id=order_id)
            except GoimomiProductOrder.DoesNotExist:
                pass

        if not order and session_id:
            try:
                order = GoimomiProductOrder.objects.get(zoho_payment_session_id=session_id)
            except GoimomiProductOrder.DoesNotExist:
                pass

        if not order:
            return HttpResponseRedirect(f"{frontend_url}/goimomi-product?error=order_not_found")

        frontend_failure_url = f"{frontend_url}/payment-failed?order_id={order.order_id}"

        if not session_id:
            session_id = order.zoho_payment_session_id

        if not session_id:
            return HttpResponseRedirect(frontend_failure_url)

        def _safe_get(obj, key, default=None):
            if obj is None: return default
            if isinstance(obj, dict): return obj.get(key, default)
            return getattr(obj, key, default)

        param_session_status = (request.GET.get('payment_session_status') or '').lower()
        param_payment_status = (request.GET.get('payment_status') or '').lower()
        param_success = (
            param_session_status in ['paid', 'succeeded', 'completed', 'success'] or
            param_payment_status in ['succeeded', 'paid', 'success', 'completed']
        )

        signature_ok = True
        signing_key = getattr(settings, 'ZOHO_PAYMENTS_SIGNING_KEY', '')
        if signing_key:
            signature = request.GET.get('signature')
            if signature:
                payments_session_id = request.GET.get('payments_session_id', '')
                payment_session_status = request.GET.get('payment_session_status', '')
                payment_id = request.GET.get('payment_id', '')
                payment_status = request.GET.get('payment_status', '')
                amount = request.GET.get('amount', '')
                mandate_id = request.GET.get('mandate_id', '')
                udf1 = request.GET.get('udf1', '')
                udf2 = request.GET.get('udf2', '')
                udf3 = request.GET.get('udf3', '')
                udf4 = request.GET.get('udf4', '')
                udf5 = request.GET.get('udf5', '')

                fields = [
                    payments_session_id, payment_session_status, payment_id,
                    payment_status, amount, mandate_id, udf1, udf2, udf3, udf4, udf5
                ]
                fields = [f if f is not None else '' for f in fields]
                data_to_sign = ".".join(fields)

                import hmac
                import hashlib
                expected_signature = hmac.new(
                    signing_key.encode('utf-8'),
                    data_to_sign.encode('utf-8'),
                    hashlib.sha256
                ).hexdigest()
                
                if not hmac.compare_digest(expected_signature, signature):
                    print(f"Verify Warning: Product Order signature mismatch. Expected: {expected_signature}, Got: {signature}")
                    signature_ok = False
        try:
            param_success = False
            session_status = request.GET.get('payment_session_status') or request.GET.get('payment_status') or request.POST.get('payment_session_status') or request.POST.get('payment_status')
            if session_status in ['paid', 'completed', 'succeeded', 'PAID', 'COMPLETED', 'SUCCEEDED']:
                param_success = True

            signature_ok = True
            signature = request.GET.get('signature') or request.POST.get('signature')
            signing_key = getattr(settings, 'ZOHO_PAYMENTS_WEBHOOK_SIGNING_KEY', '')
            if signature and signing_key:
                try:
                    import hmac, hashlib
                    payments_session_id = session_id or getattr(order, 'zoho_payment_session_id', '')
                    payment_session_status = session_status or 'paid'
                    payment_id = request.GET.get('payment_id', '')
                    payment_status = request.GET.get('payment_status', '')
                    amount = str(request.GET.get('amount', ''))
                    mandate_id = request.GET.get('mandate_id', '')
                    udf1 = request.GET.get('udf1', '')
                    udf2 = request.GET.get('udf2', '')
                    udf3 = request.GET.get('udf3', '')
                    udf4 = request.GET.get('udf4', '')
                    udf5 = request.GET.get('udf5', '')
                    
                    data_str = f"{payments_session_id}|{payment_session_status}|{payment_id}|{payment_status}|{amount}|{mandate_id}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}"
                    expected_signature = hmac.new(signing_key.encode('utf-8'), data_str.encode('utf-8'), hashlib.sha256).hexdigest()
                    if not hmac.compare_digest(expected_signature, signature):
                        print("Notice: Query params signature mismatch, verifying via API...")
                        signature_ok = False
                except Exception as sig_err:
                    print(f"Signature check notice: {sig_err}")

            api_success = False
            try:
                from Holidays.services.zoho_payment import ZohoPaymentService
                s_status, s_data = ZohoPaymentService.get_payment_session(order.zoho_payment_session_id)
                def _safe_get(obj, key, default=None):
                    if isinstance(obj, dict):
                        return obj.get(key, default)
                    return getattr(obj, key, default)

                remote_status = str(_safe_get(s_data, 'status', '')).lower()
                if remote_status in ['paid', 'completed', 'succeeded']:
                    api_success = True
            except Exception as s_err:
                print(f"Notice retrieving Product Zoho session: {s_err}")

            if (param_success and signature_ok) or api_success or param_success:
                # Mark order as Confirmed / Completed
                if order.status in ['Pending', 'pending']:
                    order.status = 'Confirmed'
                    order.invoice_number = f"GM-PRD-{random.randint(100000, 999999)}"
                    order.save()

                    # Deduct product stock quantity and auto-update stock_status
                    self._deduct_stock_and_notify(order)

                    # Sync user to Zoho CRM Contact list
                    try:
                        from Holidays.utils import upsert_zoho_crm_contact
                        crm_data = {
                            'first_name': order.name.split(' ')[0] if ' ' in order.name else order.name,
                            'last_name': order.name.split(' ', 1)[1] if ' ' in order.name else 'Customer',
                            'email': order.email,
                            'phone': order.phone
                        }
                        if crm_data['email']:
                            import threading
                            threading.Thread(target=upsert_zoho_crm_contact, args=(crm_data,)).start()
                    except Exception as crm_err:
                        print(f"Error syncing product customer to Zoho CRM: {crm_err}")

                    # Send Product Order confirmation email (From: support@goimomi.com, CC: hello@goimomi.com)
                    try:
                        from Holidays.utils import send_product_order_email
                        send_product_order_email(order)
                    except Exception as mail_err:
                        print(f"Error sending product order email: {mail_err}")

                # Redirect to frontend success page
                return HttpResponseRedirect(f"{frontend_url}/goimomi-product?payment_success=true&order_id={order.order_id}")
            else:
                return HttpResponseRedirect(f"{frontend_url}/payment-failed?order_id={order.order_id}&status={session_status}")

        except Exception as e:
            print(f"Error verifying Zoho Product Payment: {e}")
            return HttpResponseRedirect(frontend_failure_url)

    @action(detail=False, methods=['post'], url_path='zoho-webhook', permission_classes=[AllowAny])
    def zoho_webhook(self, request):
        import hmac
        import hashlib
        import json
        import random
        from django.http import HttpResponse

        signature_header = request.headers.get('X-Zoho-Webhook-Signature')
        raw_body = request.body.decode('utf-8')

        signing_key = getattr(settings, 'ZOHO_PAYMENTS_WEBHOOK_SIGNING_KEY', '')
        if signature_header and signing_key:
            try:
                parts = {part.split('=')[0]: part.split('=')[1] for part in signature_header.split(',')}
                timestamp = parts.get('t')
                received_signature = parts.get('v')

                if timestamp and received_signature:
                    data_to_verify = f"{timestamp}.{raw_body}"
                    expected_signature = hmac.new(
                        signing_key.encode('utf-8'),
                        data_to_verify.encode('utf-8'),
                        hashlib.sha256
                    ).hexdigest()

                    if not hmac.compare_digest(expected_signature, received_signature):
                        print("Webhook Error: Signature verification failed")
                        return HttpResponse("Unauthorized signature", status=401)
            except Exception as sig_err:
                print(f"Webhook Signature Check Notice: {sig_err}")

        try:
            payload = json.loads(raw_body)
            event_type = payload.get('event_type')
            event_object = payload.get('event_object', {})
            payment = event_object.get('payment', {}) or event_object.get('payment_session', {}) or event_object

            print(f"Webhook Received: Event {event_type} for Product Order")

            if event_type in ['payment.succeeded', 'payment_session.paid', 'payment_session.completed', 'payment.created', 'hosted_page.payment_succeeded']:
                order_id = payment.get('reference_number') or event_object.get('reference_number')
                session_id = payment.get('payments_session_id') or event_object.get('payments_session_id')

                order = None
                if order_id:
                    try:
                        order = GoimomiProductOrder.objects.get(order_id=order_id)
                    except GoimomiProductOrder.DoesNotExist:
                        pass

                if not order and session_id:
                    try:
                        order = GoimomiProductOrder.objects.get(zoho_payment_session_id=session_id)
                    except GoimomiProductOrder.DoesNotExist:
                        pass

                if order:
                    if order.status in ['Pending', 'pending']:
                        order.status = 'Confirmed'
                        order.invoice_number = payment.get('invoice_number') or f"GM-PRD-{random.randint(100000, 999999)}"
                        order.save()
                        print(f"Webhook Success: Product Order {order.order_id} confirmed via webhook")

                        # Deduct product stock quantity and auto-update stock_status
                        self._deduct_stock_and_notify(order)

                        # Sync user to Zoho CRM Contact list
                        try:
                            from Holidays.utils import upsert_zoho_crm_contact
                            crm_data = {
                                'first_name': order.name.split(' ')[0] if ' ' in order.name else order.name,
                                'last_name': order.name.split(' ', 1)[1] if ' ' in order.name else 'Customer',
                                'email': order.email,
                                'phone': order.phone
                            }
                            if crm_data['email']:
                                import threading
                                threading.Thread(target=upsert_zoho_crm_contact, args=(crm_data,)).start()
                        except Exception as crm_err:
                            print(f"Error syncing product customer to Zoho CRM via webhook: {crm_err}")

                        # Send Product Order confirmation email
                        try:
                            from Holidays.utils import send_product_order_email
                            send_product_order_email(order)
                        except Exception as mail_err:
                            print(f"Error sending product order email via webhook: {mail_err}")
                else:
                    print(f"Webhook Warning: Product Order not found for reference_number={order_id} or session_id={session_id}")

            return HttpResponse("Webhook processed successfully", status=200)

        except Exception as e:
            print(f"Webhook Exception: {e}")
            return HttpResponse(str(e), status=400)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status
        response = super().partial_update(request, *args, **kwargs)
        instance.refresh_from_db()
        if old_status != instance.status and instance.status in ['Confirmed', 'Completed']:
            try:
                from Holidays.utils import send_product_order_email
                send_product_order_email(instance)
            except Exception as mail_err:
                print(f"Error sending product order email on partial_update: {mail_err}")
        return response


