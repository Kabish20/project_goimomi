from rest_framework import serializers
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from .models import (
    HolidayEnquiry, UmrahEnquiry, Enquiry, HolidayPackage, ItineraryDay, 
    Inclusion, Exclusion, Highlight, Destination, StartingCity, PackageDestination, 
    ItineraryMaster, Nationality, UmrahDestination, Visa, VisaApplication, VisaApplicant, Country
)



class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = "__all__"


class HolidayEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = HolidayEnquiry
        fields = "__all__"


class UmrahEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = UmrahEnquiry
        fields = "__all__"


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = "__all__"


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = ["day_number", "title", "description", "image", "master_template"]


class InclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inclusion
        fields = ["text"]


class ExclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exclusion
        fields = ["text"]


class HighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlight
        fields = ["text"]


class PackageDestinationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='destination.name', read_only=True)
    class Meta:
        model = PackageDestination
        fields = ["name", "nights"]


class HolidayPackageSerializer(serializers.ModelSerializer):
    itinerary = serializers.SerializerMethodField()
    inclusions = InclusionSerializer(many=True, read_only=True)
    exclusions = ExclusionSerializer(many=True, read_only=True)
    highlights = HighlightSerializer(many=True, read_only=True)
    destinations = PackageDestinationSerializer(source='extra_destinations', many=True, read_only=True)
    nights = serializers.SerializerMethodField()
    
    # Use distinct field names for writing to avoid clashing with read-only fields
    package_destinations = serializers.JSONField(write_only=True, required=False)
    itinerary_days = serializers.JSONField(write_only=True, required=False)
    inclusions_raw = serializers.JSONField(write_only=True, required=False)
    exclusions_raw = serializers.JSONField(write_only=True, required=False)
    highlights_raw = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = HolidayPackage
        fields = "__all__"

    def get_nights(self, obj):
        return sum(d.nights for d in obj.extra_destinations.all())

    def get_itinerary(self, obj):
        # Only show up to 'days' number of itinerary items
        qs = obj.itinerary.all()[:obj.days]
        return ItineraryDaySerializer(qs, many=True, context=self.context).data

    def create(self, validated_data):
        # Extract nested data
        package_destinations_data = validated_data.pop('package_destinations', [])
        itinerary_days_data = validated_data.pop('itinerary_days', [])
        inclusions_data = validated_data.pop('inclusions_raw', [])
        exclusions_data = validated_data.pop('exclusions_raw', [])
        highlights_data = validated_data.pop('highlights_raw', [])
        
        # Create the package
        package = HolidayPackage.objects.create(**validated_data)
        
        self._handle_nested_data(package, package_destinations_data, itinerary_days_data, inclusions_data, exclusions_data, highlights_data)
        return package

    def update(self, instance, validated_data):
        # Extract nested data
        package_destinations_data = validated_data.pop('package_destinations', [])
        itinerary_days_data = validated_data.pop('itinerary_days', [])
        inclusions_data = validated_data.pop('inclusions_raw', [])
        exclusions_data = validated_data.pop('exclusions_raw', [])
        highlights_data = validated_data.pop('highlights_raw', [])

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Clear existing relations and re-create (simple approach for nested data)
        instance.extra_destinations.all().delete()
        instance.itinerary.all().delete()
        instance.inclusions.all().delete()
        instance.exclusions.all().delete()
        instance.highlights.all().delete()

        self._handle_nested_data(instance, package_destinations_data, itinerary_days_data, inclusions_data, exclusions_data, highlights_data)
        return instance

    def _handle_nested_data(self, package, package_destinations_data, itinerary_days_data, inclusions_data, exclusions_data, highlights_data):
        # Create package destinations
        if package_destinations_data:
            for dest_data in package_destinations_data:
                if dest_data.get('destination'):
                    try:
                        destination = Destination.objects.get(name=dest_data['destination'])
                        PackageDestination.objects.create(
                            package=package,
                            destination=destination,
                            nights=dest_data.get('nights', 1)
                        )
                    except Destination.DoesNotExist:
                        pass
        
        # Create itinerary days
        if itinerary_days_data:
            request = self.context.get('request')
            for i, day_data in enumerate(itinerary_days_data):
                if day_data.get('day') and day_data.get('title'):
                    # Handle Image
                    image_file = None
                    if request and request.FILES:
                        image_key = f'itinerary_image_{i}'
                        image_file = request.FILES.get(image_key)

                    # Handle Master Template
                    master_template_obj = None
                    if day_data.get('master_template'):
                         try:
                             master_template_obj = ItineraryMaster.objects.get(id=day_data['master_template'])
                         except ItineraryMaster.DoesNotExist:
                             pass
                    elif day_data.get('title'):
                        # Auto-create ItineraryMaster if not provided
                        try:
                            # Prepare image for master template (clone content)
                            master_image = None
                            if image_file:
                                try:
                                    if hasattr(image_file, 'open'):
                                        image_file.open()
                                    file_content = image_file.read()
                                    master_image = ContentFile(file_content, name=image_file.name)
                                    image_file.seek(0) # Reset for ItineraryDay
                                except Exception as img_err:
                                    print(f"Error clone image for master: {img_err}")
                                    pass

                            master_template_obj = ItineraryMaster.objects.create(
                                name=day_data['title'][:200], # Truncate to fit max_length
                                title=day_data['title'][:200],
                                description=day_data.get('description', ''),
                                image=master_image
                            )
                        except Exception as e:
                            print(f"Error creating ItineraryMaster: {e}")
                            pass

                    ItineraryDay.objects.create(
                        package=package,
                        day_number=day_data['day'],
                        title=day_data['title'],
                        description=day_data.get('description', ''),
                        master_template=master_template_obj,
                        image=image_file
                    )
        
        # Create inclusions
        if inclusions_data:
            for inclusion_text in inclusions_data:
                if inclusion_text:
                    Inclusion.objects.create(package=package, text=inclusion_text)
        
        # Create exclusions
        if exclusions_data:
            for exclusion_text in exclusions_data:
                if exclusion_text:
                    Exclusion.objects.create(package=package, text=exclusion_text)

        # Create highlights
        if highlights_data:
            for highlight_text in highlights_data:
                if highlight_text:
                    Highlight.objects.create(package=package, text=highlight_text)


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"


class StartingCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = StartingCity
        fields = "__all__"


class UmrahDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UmrahDestination
        fields = "__all__"


class ItineraryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryMaster
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'last_login', 'date_joined', 'password']

    def create(self, validated_data):
        # Default new users created via this API to be staff so they can login to admin dashboard
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_staff=True # Important: Make them staff by default
        )
        return user


class VisaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visa
        fields = "__all__"


class VisaApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaApplicant
        fields = "__all__"



class VisaApplicationSerializer(serializers.ModelSerializer):
    applicants = VisaApplicantSerializer(many=True, read_only=True)
    visa_country = serializers.CharField(source='visa.country', read_only=True)
    visa_title = serializers.CharField(source='visa.title', read_only=True)

    class Meta:
        model = VisaApplication
        fields = "__all__"


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"
