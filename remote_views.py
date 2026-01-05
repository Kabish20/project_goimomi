from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
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
    queryset = HolidayPackage.objects.all()
    serializer_class = HolidayPackageSerializer


class DestinationViewSet(ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    pagination_class = None


class StartingCityViewSet(ModelViewSet):
    queryset = StartingCity.objects.all()
    serializer_class = StartingCitySerializer
    pagination_class = None


class ItineraryMasterViewSet(ModelViewSet):
    queryset = ItineraryMaster.objects.all()
    serializer_class = ItineraryMasterSerializer
    pagination_class = None


from django.contrib.auth.models import User

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = None


class NationalityViewSet(ModelViewSet):
    queryset = Nationality.objects.all()
    serializer_class = NationalitySerializer
    pagination_class = None


class UmrahDestinationViewSet(ModelViewSet):
    queryset = UmrahDestination.objects.all()
    serializer_class = UmrahDestinationSerializer
    pagination_class = None
