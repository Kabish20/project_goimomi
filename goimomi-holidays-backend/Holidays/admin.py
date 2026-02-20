from django.contrib import admin
from django import forms
from django.utils.safestring import mark_safe
from .models import *


class HolidayPackageAdminForm(forms.ModelForm):
    """Custom form for HolidayPackage admin with dropdown for starting_city"""
    
    starting_city = forms.ChoiceField(
        choices=[],
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    
    class Meta:
        model = HolidayPackage
        fields = ['title', 'description', 'category', 'starting_city', 'days', 'start_date', 'group_size', 'Offer_price', 'price', 'header_image', 'card_image']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Populate starting_city choices from StartingCity model
        starting_city_choices = [('', '---------')]  # Empty choice
        starting_cities = StartingCity.objects.all().order_by('region', 'name')
        
        # Group by region
        current_region = None
        region_group = []
        
        for city in starting_cities:
            if current_region != city.region and region_group:
                starting_city_choices.append((current_region, region_group))
                region_group = []
            current_region = city.region
            region_group.append((city.name, city.name))
        
        # Add the last group
        if region_group:
            starting_city_choices.append((current_region, region_group))
        
        self.fields['starting_city'].choices = starting_city_choices
        
        # Add custom attributes to enable the "add another" link
        self.fields['starting_city'].widget.attrs.update({
            'data-model': 'startingcity',
            'data-app': 'Holidays',
        })


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
    list_display = ("title", "Offer_price", "price", "days", "start_date")
    list_filter = ("category", "starting_city")
    search_fields = ("title", "starting_city")
    inlines = [PackageDestinationInline, ItineraryInline, InclusionInline, ExclusionInline]
    
    class Media:
        js = ('Holidays/js/itinerary_auto.js',)
    
    fieldsets = (
        ('Package Information', {
            'fields': ('title', 'description', 'category')
        }),
        ('Location Details', {
            'fields': ('starting_city',),
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


@admin.register(StartingCity)
class StartingCityAdmin(admin.ModelAdmin):
    list_display = ("name", "region")
    list_filter = ("region",)
    search_fields = ("name", "region")
    ordering = ("region", "name")


@admin.register(ItineraryMaster)
class ItineraryMasterAdmin(admin.ModelAdmin):
    list_display = ("name", "title")
    search_fields = ("name", "title", "description")


@admin.register(Nationality)
class NationalityAdmin(admin.ModelAdmin):
    list_display = ('country', 'nationality', 'continent')
    list_filter = ('continent',)
    search_fields = ('country', 'nationality')

@admin.register(UmrahDestination)
class UmrahDestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    list_filter = ('country',)
    search_fields = ('name', 'country')

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

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

