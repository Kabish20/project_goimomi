from rest_framework import serializers
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from .models import (
    HolidayEnquiry, UmrahEnquiry, Enquiry, HolidayPackage, ItineraryDay, 
    Inclusion, Exclusion, Highlight, Destination, StartingCity, PackageDestination, 
    ItineraryMaster, Nationality, UmrahDestination, Visa, VisaApplication, VisaApplicant, Country, VisaAdditionalDocument
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email

        return token



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
        # Extract nested data with None as default to detect if they were provided
        package_destinations_data = validated_data.pop('package_destinations', None)
        itinerary_days_data = validated_data.pop('itinerary_days', None)
        inclusions_data = validated_data.pop('inclusions_raw', None)
        exclusions_data = validated_data.pop('exclusions_raw', None)
        highlights_data = validated_data.pop('highlights_raw', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # ONLY update nested data if it was explicitly provided in the request
        # This prevents data loss when updating only basic fields (like is_active)
        if any(x is not None for x in [package_destinations_data, itinerary_days_data, inclusions_data, exclusions_data, highlights_data]):
            
            # Clear existing simple relations ONLY if provided
            if package_destinations_data is not None:
                instance.extra_destinations.all().delete()
            if inclusions_data is not None:
                instance.inclusions.all().delete()
            if exclusions_data is not None:
                instance.exclusions.all().delete()
            if highlights_data is not None:
                instance.highlights.all().delete()

            # The _handle_nested_data method already handles itinerary deletion/preservation logic
            self._handle_nested_data(instance, package_destinations_data, itinerary_days_data, inclusions_data, exclusions_data, highlights_data)
        
        return instance

    def _handle_nested_data(self, package, package_destinations_data, itinerary_days_data, inclusions_data, exclusions_data, highlights_data):
        import json
        
        # Helper to ensure we have a list/dict, but ONLY if not None
        def ensure_json(data):
            if data is None: return None
            if isinstance(data, str):
                try: return json.loads(data)
                except: return []
            return data

        package_destinations_data = ensure_json(package_destinations_data)
        itinerary_days_data = ensure_json(itinerary_days_data)
        inclusions_data = ensure_json(inclusions_data)
        exclusions_data = ensure_json(exclusions_data)
        highlights_data = ensure_json(highlights_data)

        # 1. Package Destinations (only if provided)
        if package_destinations_data is not None:
            for dest_data in package_destinations_data:
                if dest_data.get('destination'):
                    dest_obj = Destination.objects.filter(name=dest_data['destination']).first()
                    if dest_obj:
                        PackageDestination.objects.create(
                            package=package,
                            destination=dest_obj,
                            nights=dest_data.get('nights', 1)
                        )

        # 2. Itinerary Days (only if provided)
        if itinerary_days_data is not None:
            request = self.context.get('request')
            primary_dest = None
            
            # Get primary destination from input or existing if input missing destinations
            if package_destinations_data and len(package_destinations_data) > 0:
                primary_dest = Destination.objects.filter(name=package_destinations_data[0].get('destination')).first()
            if not primary_dest:
                p_dest_obj = package.extra_destinations.first()
                if p_dest_obj: primary_dest = p_dest_obj.destination

            # Capture existing itinerary days to preserve images
            existing_days = {d.day_number: d for d in package.itinerary.all()}
            # We will delete them but keep references to their image files
            package.itinerary.all().delete()

            for i, day_data in enumerate(itinerary_days_data):
                title = day_data.get('title', '').strip()
                if not title: continue

                day_num = day_data.get('day')
                try: day_num = int(day_num)
                except: day_num = i + 1

                # Handle Image
                image_file = None
                if request and request.FILES:
                    image_file = request.FILES.get(f'itinerary_image_{i}')

                # Master Template logic
                master_template_obj = None
                master_id = day_data.get('master_template')
                if master_id:
                    master_template_obj = ItineraryMaster.objects.filter(id=master_id).first()

                if master_template_obj:
                    # Update existing master
                    master_template_obj.title = title[:200]
                    master_template_obj.description = day_data.get('description', '')
                    if image_file:
                        try:
                            if hasattr(image_file, 'open'): image_file.open()
                            file_content = image_file.read()
                            master_template_obj.image.save(image_file.name, ContentFile(file_content), save=False)
                            image_file.seek(0)
                        except: pass
                    master_template_obj.save()
                else:
                    # Create NEW master
                    try:
                        master_image = None
                        if image_file:
                            try:
                                if hasattr(image_file, 'open'): image_file.open()
                                file_content = image_file.read()
                                master_image = ContentFile(file_content, name=image_file.name)
                                image_file.seek(0)
                            except: pass
                        
                        master_template_obj = ItineraryMaster.objects.create(
                            destination=primary_dest,
                            name=title[:200],
                            title=title[:200],
                            description=day_data.get('description', ''),
                            image=master_image
                        )
                    except Exception as e:
                        print(f"Error auto-master: {e}")

                # Preserve old image if no new one uploaded
                if not image_file and day_num in existing_days:
                    image_file = existing_days[day_num].image

                ItineraryDay.objects.create(
                    package=package,
                    day_number=day_num,
                    title=title,
                    description=day_data.get('description', ''),
                    master_template=master_template_obj,
                    image=image_file or (master_template_obj.image if master_template_obj else None)
                )

        # 3. Simple list fields (only if provided)
        if inclusions_data is not None:
            for text in inclusions_data:
                if text: Inclusion.objects.create(package=package, text=text)
        if exclusions_data is not None:
            for text in exclusions_data:
                if text: Exclusion.objects.create(package=package, text=text)
        if highlights_data is not None:
            for text in highlights_data:
                if text: Highlight.objects.create(package=package, text=text)


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
    country_details = serializers.SerializerMethodField()

    class Meta:
        model = Visa
        fields = [
            'id', 'country', 'title', 'entry_type', 'validity', 'duration', 
            'processing_time', 'price', 'documents_required', 'photography_required', 
            'visa_type', 'card_image', 'is_active', 
            'created_at', 'country_details'
        ]

    def get_country_details(self, obj):
        try:
            country = Country.objects.filter(name=obj.country).first()
            if country:
                return CountrySerializer(country).data
        except Exception:
            pass
        return None


class VisaAdditionalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaAdditionalDocument
        fields = "__all__"


class VisaApplicantSerializer(serializers.ModelSerializer):
    additional_documents = VisaAdditionalDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = VisaApplicant
        fields = "__all__"



class VisaApplicationSerializer(serializers.ModelSerializer):
    applicants = VisaApplicantSerializer(many=True, read_only=True)
    visa_country = serializers.CharField(source='visa.country', read_only=True)
    visa_title = serializers.CharField(source='visa.title', read_only=True)

    class Meta:
        model = VisaApplication
        fields = [
            'id', 'visa', 'application_type', 'internal_id', 'group_name', 
            'departure_date', 'return_date', 'total_price', 'status', 
            'created_at', 'applicants', 'visa_country', 'visa_title'
        ]


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"
