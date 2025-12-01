from django.db import models # pyright: ignore[reportMissingModuleSource]
from django.contrib.auth.models import User # pyright: ignore[reportMissingModuleSource]
from django.db.models.signals import post_save # pyright: ignore[reportMissingModuleSource]
from django.dispatch import receiver # pyright: ignore[reportMissingModuleSource]
from rest_framework.authtoken.models import Token # pyright: ignore[reportMissingImports]


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"


class CustomizedHoliday(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    destination = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Customized Holiday from {self.name}"


class CustomizedUmrah(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    package_type = models.CharField(max_length=200)
    travel_date = models.DateField()
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Customized Umrah from {self.name}"


class VisaEnquiry(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    passport_expiry_date = models.DateField(blank=True, null=True)
    destination_country = models.CharField(max_length=100)
    visa_type = models.CharField(max_length=50)
    intended_travel_date = models.DateField(blank=True, null=True)
    processing_urgency = models.CharField(max_length=20, blank=True, null=True)
    purpose_of_visit = models.TextField(blank=True, null=True)
    previous_visa_rejection = models.CharField(max_length=3, choices=[('No', 'No'), ('Yes', 'Yes')], blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visa Enquiry from {self.full_name} for {self.destination_country}"
