from django.contrib import admin
from django import forms
from django.utils.safestring import mark_safe
from .models import *


class HolidayPackageAdminForm(forms.ModelForm):
    """Custom form for HolidayPackage admin"""
    
    package_categories = forms.MultipleChoiceField(
        choices=[
            ('Budget', 'Budget'),
            ('Standard', 'Standard'),
            ('Deluxe', 'Deluxe'),
            ('Luxury', 'Luxury'),
            ('Premium', 'Premium')
        ],
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    
    class Meta:
        model = HolidayPackage
        fields = ['title', 'description', 'category', 'supplier', 'fixed_departure', 'package_categories', 'starting_city', 'ending_city', 'days', 'start_date', 'group_size', 'Offer_price', 'price', 'header_image', 'card_image']



@admin.register(HolidayEnquiry)
class HolidayEnquiryAdmin(admin.ModelAdmin):
    list_display = ("full_name", "start_city", "travel_date", "created_at")


admin.site.register(UmrahEnquiry)

admin.site.register(Enquiry)


class ItineraryInline(admin.TabularInline):
    model = ItineraryDay
    extra = 0
    autocomplete_fields = ['master_template']
    fields = ('day_number', 'master_template', 'title', 'description', 'image')

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # We can add JS here to auto-populate if needed, 
        # but for now we'll just allow selection.
        return formset


class InclusionInline(admin.TabularInline):
    model = Inclusion
    extra = 1


class ExclusionInline(admin.TabularInline):
    model = Exclusion
    extra = 1


class PackageDestinationInline(admin.TabularInline):
    model = PackageDestination
    extra = 1
    autocomplete_fields = ['destination']
    fields = ('destination', 'nights')


@admin.register(HolidayPackage)
class HolidayPackageAdmin(admin.ModelAdmin):
    form = HolidayPackageAdminForm
    list_display = ("title", "Offer_price", "price", "days", "supplier", "fixed_departure")
    list_filter = ("category", "starting_city", "fixed_departure", "supplier")
    search_fields = ("title", "starting_city")
    inlines = [PackageDestinationInline, ItineraryInline, InclusionInline, ExclusionInline]
    
    class Media:
        js = ('Holidays/js/itinerary_auto.js',)
    
    fieldsets = (
        ('Package Information', {
            'fields': ('title', 'description', 'category')
        }),
        ('Location Details', {
            'fields': ('starting_city', 'ending_city'),
        }),
        ('Duration & Dates', {
            'fields': ('days', 'start_date', 'group_size')
        }),
        ('Pricing', {
            'fields': ('Offer_price', 'price')
        }),
        ('Images', {
            'fields': ('header_image', 'card_image')
        }),
    )


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "region")
    list_filter = ("country", "region")
    search_fields = ("name", "country", "region")
    ordering = ("country", "name")





@admin.register(ItineraryMaster)
class ItineraryMasterAdmin(admin.ModelAdmin):
    list_display = ("name", "title")
    search_fields = ("name", "title", "description")



@admin.register(Visa)
class VisaAdmin(admin.ModelAdmin):
    list_display = ('country', 'title', 'cost_price', 'service_charge', 'selling_price', 'entry_type', 'is_active')
    list_filter = ('country', 'entry_type', 'is_active')
    search_fields = ('country', 'title')

class VisaApplicantInline(admin.TabularInline):
    model = VisaApplicant
    extra = 0

@admin.register(VisaApplication)
class VisaApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'visa', 'application_type', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'application_type')
    inlines = [VisaApplicantInline]

@admin.register(VisaApplicant)
class VisaApplicantAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'passport_number', 'nationality')
    search_fields = ('first_name', 'last_name', 'passport_number')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'city', 'state', 'country', 'contact_person', 'contact_no')
    list_filter = ('city', 'state', 'country')
    search_fields = ('company_name', 'city', 'state', 'country', 'contact_person')

class SightseeingImageInline(admin.TabularInline):
    model = SightseeingImage
    extra = 1

@admin.register(SightseeingMaster)
class SightseeingMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'destination', 'city', 'price')
    list_filter = ('destination', 'city')
    search_fields = ('name', 'city', 'description')
    inlines = [SightseeingImageInline]

