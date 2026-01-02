from django.forms import ModelForm
from .models import HolidayEnquiry, UmrahEnquiry, Enquiry


class HolidayEnquiryForm(ModelForm):
    class Meta:
        model = HolidayEnquiry
        fields = "__all__"


class UmrahEnquiryForm(ModelForm):
    class Meta:
        model = UmrahEnquiry
        fields = "__all__"


class EnquiryForm(ModelForm):
    class Meta:
        model = Enquiry
        fields = "__all__"
