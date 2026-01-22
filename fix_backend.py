import os

BASE_DIR = os.path.expanduser('~/goimomi/goimomi-holidays-backend')

def main():
    # Fix models.py
    models_path = os.path.join(BASE_DIR, 'Holidays/models.py')
    with open(models_path, 'r') as f:
        models_content = f.read()
    
    if 'class VisaApplication' not in models_content:
        extra_models = """

class VisaApplication(models.Model):
    visa = models.ForeignKey(Visa, on_delete=models.CASCADE)
    application_type = models.CharField(max_length=20, choices=[('Individual', 'Individual'), ('Group', 'Group')], default='Individual')
    internal_id = models.CharField(max_length=100, blank=True)
    group_name = models.CharField(max_length=100, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Processing', 'Processing'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application {self.pk} - {self.visa.country}"

class VisaApplicant(models.Model):
    application = models.ForeignKey(VisaApplication, related_name='applicants', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20)
    passport_number = models.CharField(max_length=20)
    nationality = models.CharField(max_length=100)
    sex = models.CharField(max_length=10)
    dob = models.DateField()
    place_of_birth = models.CharField(max_length=100)
    place_of_issue = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=20)
    date_of_issue = models.DateField()
    date_of_expiry = models.DateField()
    passport_front = models.ImageField(upload_to='visa_apps/passports/', null=True, blank=True)
    photo = models.ImageField(upload_to='visa_apps/photos/', null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.passport_number})"
"""
        with open(models_path, 'a') as f:
            f.write(extra_models)
        print("Updated models.py")

    # Fix serializers.py
    serializers_path = os.path.join(BASE_DIR, 'Holidays/serializers.py')
    with open(serializers_path, 'r') as f:
        ser_lines = f.readlines()
    
    new_ser_lines = []
    import_done = False
    for line in ser_lines:
        if 'from .models import (' in line and not import_done:
            new_ser_lines.append(line)
            new_ser_lines.append("    VisaApplication, VisaApplicant,\n")
            import_done = True
        elif 'class Meta:' in line and 'model = Nationality' in next_line_if_exists(ser_lines, ser_lines.index(line)):
             # We'll add the field in the meta class below
             new_ser_lines.append(line)
        else:
            new_ser_lines.append(line)
    
    # Actually simpler to just append the new serializers and hope for the best, 
    # but I need the imports to work.
    
    # Overwrite serializers.py with a fixed header and appended content
    with open(serializers_path, 'r') as f:
        content = f.read()
    
    if 'VisaApplication' not in content:
        # Crude but effective import fix
        content = content.replace('from .models import (', 'from .models import (\n    VisaApplication, VisaApplicant,')
    
    if 'class VisaApplicationSerializer' not in content:
        extra_serializers = """

class VisaApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaApplicant
        fields = "__all__"

class VisaApplicationSerializer(serializers.ModelSerializer):
    applicants = VisaApplicantSerializer(many=True, read_only=True)
    visa_country = serializers.ReadOnlyField(source='visa.country')
    visa_title = serializers.ReadOnlyField(source='visa.title')

    class Meta:
        model = VisaApplication
        fields = "__all__"

class NationalitySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='country', read_only=True)
    class Meta:
        model = Nationality
        fields = "__all__"
"""
        # Remove old NationalitySerializer if it exists to avoid duplication
        import re
        content = re.sub(r'class NationalitySerializer.*?fields = "__all__"', '', content, flags=re.DOTALL)
        
        with open(serializers_path, 'w') as f:
            f.write(content + extra_serializers)
        print("Updated serializers.py")

    # Fix views.py
    views_path = os.path.join(BASE_DIR, 'Holidays/views.py')
    with open(views_path, 'r') as f:
        views_content = f.read()
    
    if 'class VisaApplicationViewSet' not in views_content:
        extra_views = """

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
            departure_date=data.get('departure_date') if data.get('departure_date') and data.get('departure_date') != '' else None,
            return_date=data.get('return_date') if data.get('return_date') and data.get('return_date') != '' else None,
            total_price=data.get('total_price', 0),
            status='Pending'
        )
        
        # Parse applicants data
        applicants_data_json = data.get('applicants_data', '[]')
        applicants_data = json.loads(applicants_data_json)
        
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
                dob=app_data.get('dob') if app_data.get('dob') else None,
                place_of_birth=app_data.get('place_of_birth', ''),
                place_of_issue=app_data.get('place_of_issue', ''),
                marital_status=app_data.get('marital_status', ''),
                date_of_issue=app_data.get('date_of_issue') if app_data.get('date_of_issue') else None,
                date_of_expiry=app_data.get('date_of_expiry') if app_data.get('date_of_expiry') else None,
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
"""
        with open(views_path, 'a') as f:
            f.write(extra_views)
        print("Updated views.py")

    # Fix urls.py
    urls_path = os.path.join(BASE_DIR, 'Holidays/urls.py')
    new_urls = """from rest_framework.routers import DefaultRouter
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
router.register("countries", NationalityViewSet) # Alias for frontend
router.register("umrah-destinations", UmrahDestinationViewSet)
router.register("visas", VisaViewSet)
router.register("visa-applications", VisaApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
]
"""
    with open(urls_path, 'w') as f:
        f.write(new_urls)
    print("Fixed urls.py")

def next_line_if_exists(lines, index):
    if index + 1 < len(lines):
        return lines[index+1]
    return ""

if __name__ == "__main__":
    main()
