from rest_framework import serializers # type: ignore
from .models import ContactMessage, CustomizedHoliday, CustomizedUmrah, VisaEnquiry

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'  # Or specify the fields you want to expose

class CustomizedHolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomizedHoliday
        fields = '__all__'

class CustomizedUmrahSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomizedUmrah
        fields = '__all__'

class VisaEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaEnquiry
        fields = '__all__'
