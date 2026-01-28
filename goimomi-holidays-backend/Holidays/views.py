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
        
        # Admin can pass ?all=true to see both active and inactive in lists
        is_all = self.request.query_params.get('all', 'false').lower() == 'true'
        
        # In list view, we usually filter by is_active unless 'all=true' is passed
        if self.action == 'list' and not is_all:
            queryset = queryset.filter(is_active=True)

        # For other actions (retrieve, update, etc.), we want the full queryset
        # so we can manage inactive items.

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
        queryset = queryset.filter(is_active=True)
        if country:
            queryset = queryset.filter(country__iexact=country)
            
        return queryset


class VisaApplicationViewSet(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = VisaApplication.objects.all().order_by('-created_at')
    serializer_class = VisaApplicationSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        applicants_json = data.get('applicants_data')
        import json
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
