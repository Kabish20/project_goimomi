from django.shortcuts import render, redirect # pyright: ignore[reportMissingModuleSource]
from django.contrib.auth import authenticate, login # pyright: ignore[reportMissingModuleSource]
from .forms import ContactForm, CustomizedHolidayForm, CustomizedUmrahForm
from .models import ContactMessage, CustomizedHoliday, CustomizedUmrah, VisaEnquiry
from .serializers import ContactMessageSerializer, CustomizedHolidaySerializer, CustomizedUmrahSerializer, VisaEnquirySerializer

from rest_framework.views import APIView # pyright: ignore[reportMissingImports]
from rest_framework.response import Response # pyright: ignore[reportMissingImports]
from rest_framework import status, viewsets # type: ignore
from rest_framework.authtoken.models import Token # type: ignore


def home_view(request):
    return render(request,'home.html')

def aboutus_view(request):
    return render(request, 'aboutus.html')



def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact_success')  # Redirect to a success page
    else:
        form = ContactForm()
    return render(request, 'contactus.html', {'form': form})

def contact_success_view(request):
    return render(request, 'contact_success.html')



def terms_view(request):
    return render(request, 'Terms & Conditions.html')


def privacy_view(request):
    return render(request, 'privacy policy.html')


def cancellation_view(request):
    return render(request, 'Cancellation Policy.html')

def visa_view(request):
    return render(request, 'visa.html')


# API Views

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows contact messages to be viewed or edited.
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer


class CustomizedHolidayViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customized holidays to be viewed or edited.
    """
    queryset = CustomizedHoliday.objects.all().order_by('-created_at')
    serializer_class = CustomizedHolidaySerializer


class CustomizedUmrahViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customized umrah to be viewed or edited.
    """
    queryset = CustomizedUmrah.objects.all().order_by('-created_at')
    serializer_class = CustomizedUmrahSerializer


class VisaEnquiryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows visa enquiries to be viewed or edited.
    """
    queryset = VisaEnquiry.objects.all().order_by('-created_at')
    serializer_class = VisaEnquirySerializer


def customized_holidays(request):
    if request.method == 'POST':
        form = CustomizedHolidayForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact_success')
    else:
        form = CustomizedHolidayForm()
    return render(request, 'customized Holidays.html', {'form': form})

def customized_umrah(request):
    if request.method == 'POST':
        form = CustomizedUmrahForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('contact_success')
    else:
        form = CustomizedUmrahForm()
    return render(request, 'customized umarh.html', {'form': form})
