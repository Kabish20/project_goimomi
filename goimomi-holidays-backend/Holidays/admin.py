from django.contrib import admin
from django import forms
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
    list_display = ('first_name', 'last_name', 'passport_number')
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
    list_display = ('name', 'city_link', 'city', 'price')
    list_filter = ('city_link', 'city')
    search_fields = ('name', 'city', 'description')
    inlines = [SightseeingImageInline]

@admin.register(CruiseTerminal)
class CruiseTerminalAdmin(admin.ModelAdmin):
    list_display = ("terminal_name", "cruise_name", "cruise_code")
    search_fields = ("terminal_name", "cruise_name", "cruise_code")

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ("name", "iata_code")
    search_fields = ("name", "iata_code")

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

@admin.register(Nationality)
class NationalityAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "country")
    search_fields = ("name", "country")

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "region_name", "country")
    list_filter = ("country", "region")
    search_fields = ("name", "region__name", "country__name")

    def region_name(self, obj):
        return obj.region.name if obj.region else "-"


@admin.register(PickupPointMaster)
class PickupPointMasterAdmin(admin.ModelAdmin):
    list_display = ("name", "city")
    list_filter = ("city",)
    search_fields = ("name", "city__name")


class CabAdditionalDocumentInline(admin.TabularInline):
    model = CabAdditionalDocument
    extra = 0


@admin.register(CabBooking)
class CabBookingAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "from_city", "to_city", "pickup_date", "status", "created_at")
    list_filter = ("status", "transfer_type", "pickup_date")
    search_fields = ("first_name", "last_name", "phone", "email", "from_city", "to_city", "airport_name")
    inlines = [CabAdditionalDocumentInline]
    readonly_fields = ("created_at",)
    fieldsets = (
        ('Customer Details', {
            'fields': (('title', 'first_name', 'last_name'), ('phone', 'email'))
        }),
        ('Travel Information', {
            'fields': (('transfer_type', 'pickup_date', 'guests'), ('from_city', 'to_city'), 'luggage_count')
        }),
        ('Airport Transfer Details', {
            'fields': ('airport_name', 'flight_number', 'terminal', 'arrival_time', 'departure_time'),
            'classes': ('collapse',),
            'description': 'Fields relevant for Airport Transfers'
        }),
        ('Inter-city Details', {
            'fields': ('pickup_location_details', 'pickup_time'),
            'classes': ('collapse',),
            'description': 'Fields relevant for Inter-city Transfers'
        }),
        ('Booking Status', {
            'fields': ('status', 'driver', 'invoice_number', 'special_requirements', 'created_at')
        }),
    )


from .models import GoimomiProduct, GoimomiProductImage

class GoimomiProductImageInline(admin.TabularInline):
    model = GoimomiProductImage
    extra = 1

@admin.register(GoimomiProduct)
class GoimomiProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'mrp', 'quantity', 'stock_status', 'created_at')
    list_filter = ('stock_status',)
    search_fields = ('title',)
    list_editable = ('stock_status', 'quantity')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [GoimomiProductImageInline]
    fieldsets = (
        ('Product Details', {
            'fields': ('title', 'description', 'image')
        }),
        ('Pricing', {
            'fields': ('price', 'mrp')
        }),
        ('Stock', {
            'fields': ('quantity', 'stock_status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class SubCatalogueInline(admin.TabularInline):
    model = SubCatalogue
    extra = 1
    fields = ('name', 'code', 'order', 'is_active')


@admin.register(CatalogueMaster)
class CatalogueMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'code', 'description')
    inlines = [SubCatalogueInline]


@admin.register(SubCatalogue)
class SubCatalogueAdmin(admin.ModelAdmin):
    list_display = ('name', 'catalogue', 'code', 'order', 'is_active', 'created_at')
    list_filter = ('catalogue', 'is_active')
    search_fields = ('name', 'code', 'catalogue__name')

