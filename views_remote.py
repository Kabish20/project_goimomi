from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes # Import decorators
from rest_framework.permissions import AllowAny # Import AllowAny
from django.contrib.auth import authenticate
from .models import *
from .serializers import *


@authentication_classes([])
@permission_classes([AllowAny])
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        
        user = authenticate(username=username, password=password)
        
        with open("login_debug.log", "a") as f:
            f.write(f"Login attempt for username='{username}'\n")
            if user:
                 f.write(f"User found: {user.username}, is_staff={user.is_staff}, is_superuser={user.is_superuser}\n")
            else:
                 f.write("User authentication failed\n")

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


from django.contrib.auth.models import User

class UserViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
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
        is_active = self.request.query_params.get('is_active', None)
        if is_active == 'true':
            queryset = queryset.filter(is_active=True)
        return queryset




class VisaApplicationViewSet(ModelViewSet):
    queryset = VisaApplication.objects.all().order_by('-created_at')
    serializer_class = VisaApplicationSerializer
    
    def create(self, request, *args, **kwargs):
        import json
        data = request.data
        
        # Create the VisaApplication first
        application = VisaApplication.objects.create(
            visa_id=data.get('visa'),
            application_type=data.get('application_type', 'Individual'),
            internal_id=data.get('internal_id', ''),
            group_name=data.get('group_name', ''),
            departure_date=data.get('departure_date') if data.get('departure_date') else None,
            return_date=data.get('return_date') if data.get('return_date') else None,
            total_price=data.get('total_price', 0),
            status='Pending'
        )
        
        # Parse applicants data
        applicants_data = json.loads(data.get('applicants_data', '[]'))
        
        for index, app_data in enumerate(applicants_data):
            # Create applicant
            applicant = VisaApplicant.objects.create(
                application=application,
                first_name=app_data.get('first_name', ''),
                last_name=app_data.get('last_name', ''),
                phone=app_data.get('phone', ''),
                passport_number=app_data.get('passport_number', ''),
                nationality=app_data.get('nationality', ''),
                sex=app_data.get('sex', ''),
                dob=app_data.get('dob'),
                place_of_birth=app_data.get('place_of_birth', ''),
                place_of_issue=app_data.get('place_of_issue', ''),
                marital_status=app_data.get('marital_status', ''),
                date_of_issue=app_data.get('date_of_issue'),
                date_of_expiry=app_data.get('date_of_expiry'),
            )
            
            # Handle files
            passport_front = request.FILES.get(f'applicant_{index}_passport_front')
            if passport_front:
                applicant.passport_front = passport_front
            
            photo = request.FILES.get(f'applicant_{index}_photo')
            if photo:
                applicant.photo = photo
                
            applicant.save()
            
        return Response(VisaApplicationSerializer(application).data)
