import json

# Django Imports
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

# Rest Framework Imports
from rest_framework import status, serializers
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

# Local App Imports
from .models import (
    HolidayEnquiry, UmrahEnquiry, Enquiry, HolidayPackage, Destination,
    StartingCity, ItineraryMaster, Nationality, UmrahDestination, Visa,
    VisaApplication, VisaApplicant, VisaAdditionalDocument, Country,
    Supplier, CruiseCalendar, HotelMaster, Airline, SightseeingMaster,
    SightseeingImage, MealMaster, VehicleBrand, Accommodation,
    AccommodationImage, RoomType, VehicleMaster, DriverMaster,
    VehicleRateCard, PickupPointMaster, CabBooking, CabAdditionalDocument,
    CancellationPolicy
)
from .serializers import (
    HolidayEnquirySerializer, UmrahEnquirySerializer, EnquirySerializer,
    HolidayPackageSerializer, DestinationSerializer, StartingCitySerializer,
    ItineraryMasterSerializer, UserSerializer, NationalitySerializer,
    UmrahDestinationSerializer, VisaSerializer, VisaApplicationSerializer,
    VisaApplicantSerializer, VisaAdditionalDocumentSerializer,
    CountrySerializer, SupplierSerializer, CruiseCalendarSerializer,
    HotelMasterSerializer, AirlineSerializer, SightseeingMasterSerializer,
    MealMasterSerializer, VehicleBrandSerializer, AccommodationSerializer,
    RoomTypeSerializer, VehicleMasterSerializer, DriverMasterSerializer,
    VehicleRateCardSerializer, PickupPointMasterSerializer,
    CabBookingSerializer, CabAdditionalDocumentSerializer,
    CancellationPolicySerializer
)

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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = HolidayEnquiry.objects.all()
    serializer_class = HolidayEnquirySerializer


class UmrahEnquiryAPI(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = UmrahEnquiry.objects.all()
    serializer_class = UmrahEnquirySerializer


class EnquiryAPI(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer


class HolidayPackageViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = HolidayPackage.objects.all()
    serializer_class = HolidayPackageSerializer

    def get_queryset(self):
        queryset = HolidayPackage.objects.all()
        
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


class DestinationViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Destination.objects.all()
        is_popular = self.request.query_params.get('is_popular', None)
        if is_popular is not None:
            queryset = queryset.filter(is_popular=is_popular.lower() == 'true')
        return queryset


class StartingCityViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = StartingCity.objects.all()
    serializer_class = StartingCitySerializer
    pagination_class = None


class ItineraryMasterViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = ItineraryMaster.objects.all()
    serializer_class = ItineraryMasterSerializer
    pagination_class = None



class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = None


class NationalityViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Nationality.objects.all()
    serializer_class = NationalitySerializer
    pagination_class = None



class UmrahDestinationViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = UmrahDestination.objects.all()
    serializer_class = UmrahDestinationSerializer
    pagination_class = None


class VisaViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Visa.objects.all()
    serializer_class = VisaSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Visa.objects.all()
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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = VisaApplication.objects.all().order_by('-created_at')
    serializer_class = VisaApplicationSerializer

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
                nationality=applicant_data.get('nationality', ''),
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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = VisaApplicant.objects.all()
    serializer_class = VisaApplicantSerializer
    pagination_class = None


class VisaAdditionalDocumentViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = VisaAdditionalDocument.objects.all()
    serializer_class = VisaAdditionalDocumentSerializer
    pagination_class = None


class CountryViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    pagination_class = None

class SupplierViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Supplier.objects.all().order_by('-created_at')
    serializer_class = SupplierSerializer
    pagination_class = None

@authentication_classes([])
@permission_classes([AllowAny])
class SendVisaDetailsAPI(APIView):
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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = CruiseCalendar.objects.all().order_by('-created_at')
    serializer_class = CruiseCalendarSerializer
    pagination_class = None

class HotelMasterViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = HotelMaster.objects.all().order_by('name')
    serializer_class = HotelMasterSerializer
    pagination_class = None

class AirlineViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Airline.objects.all().order_by('name')
    serializer_class = AirlineSerializer

class SightseeingMasterViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = SightseeingMaster.objects.all()
    serializer_class = SightseeingMasterSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Handle 'destination' name to ID mapping if ID is not provided
        dest_id = data.get('destination')
        if not dest_id or dest_id == "":
            dest_name = data.get('city')
            if dest_name:
                dest = Destination.objects.filter(name=dest_name).first()
                if dest:
                    data['destination'] = dest.id

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
        
        dest_id = data.get('destination')
        if not dest_id or dest_id == "":
            dest_name = data.get('city')
            if dest_name:
                dest = Destination.objects.filter(name=dest_name).first()
                if dest:
                    data['destination'] = dest.id

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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = MealMaster.objects.all()
    serializer_class = MealMasterSerializer
    pagination_class = None

class VehicleBrandViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = VehicleBrand.objects.all().order_by('name')
    serializer_class = VehicleBrandSerializer
    pagination_class = None

    def list(self, request, *args, **kwargs):
        # Health check log
        print(f"INFO: VehicleBrand API accessed. Total brands: {self.get_queryset().count()}")
        return super().list(request, *args, **kwargs)

class AccommodationViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Accommodation.objects.all().order_by('-created_at')
    serializer_class = AccommodationSerializer

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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer

class VehicleMasterViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = VehicleMaster.objects.all().order_by('-created_at')
    serializer_class = VehicleMasterSerializer
    pagination_class = None

class DriverMasterViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = DriverMaster.objects.all().order_by('-created_at')
    serializer_class = DriverMasterSerializer
    pagination_class = None

class VehicleRateCardViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
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
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = PickupPointMaster.objects.all()
    serializer_class = PickupPointMasterSerializer

class CabBookingViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = CabBooking.objects.all().order_by('-created_at')
    serializer_class = CabBookingSerializer
    pagination_class = None

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

class CabAdditionalDocumentViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
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
            
        pickup_date = request.query_params.get('pickup_date')

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
                
                if from_matched and to_matched:
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

