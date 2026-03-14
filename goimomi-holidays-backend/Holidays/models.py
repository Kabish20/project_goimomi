from django.db import models


class HolidayEnquiry(models.Model):
    package_type = models.CharField(max_length=100, blank=True, null=True)
    start_city = models.CharField(max_length=100)
    nationality = models.CharField(max_length=50)
    travel_date = models.DateField()

    rooms = models.PositiveIntegerField()
    star_rating = models.CharField(max_length=10)
    holiday_type = models.CharField(max_length=50)
    budget = models.CharField(max_length=50, blank=True)

    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    # Added fields for detailed tracking
    adults = models.PositiveIntegerField(default=0)
    children = models.PositiveIntegerField(default=0)
    message = models.TextField(blank=True, null=True)

    cities = models.JSONField(default=list)
    room_details = models.JSONField(default=list)

    # Additional fields requested for "Enquire Now" form
    room_type = models.CharField(max_length=100, blank=True, null=True)
    meal_plan = models.CharField(max_length=100, blank=True, null=True)
    transfer_details = models.CharField(max_length=100, blank=True, null=True)
    other_inclusions = models.TextField(blank=True, null=True)
    nights = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name



class UmrahEnquiry(models.Model):
    package_type = models.CharField(max_length=100, blank=True, null=True)
    start_city = models.CharField(max_length=100)
    nationality = models.CharField(max_length=50)
    travel_date = models.DateField()

    rooms = models.PositiveIntegerField()
    star_rating = models.CharField(max_length=10)
    budget = models.CharField(max_length=50, blank=True)

    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    # Added fields for detailed tracking
    adults = models.PositiveIntegerField(default=0)
    children = models.PositiveIntegerField(default=0)
    infants = models.PositiveIntegerField(default=0)
    message = models.TextField(blank=True, null=True)

    cities = models.JSONField(default=list)
    room_details = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)


class Enquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    destination = models.CharField(max_length=200, blank=True, null=True)
    purpose = models.TextField(blank=True, null=True)
    enquiry_type = models.CharField(max_length=50, default="General") # General, Cab, Cruise

    created_at = models.DateTimeField(auto_now_add=True)


class HolidayPackage(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    category = models.CharField(
        max_length=20,
        choices=[('Domestic', 'Domestic'), ('International', 'International'), ('Umrah', 'Umrah')],
        default='Domestic'
    )
    
    # New Fields
    supplier = models.ForeignKey('Supplier', on_delete=models.SET_NULL, null=True, blank=True, related_name='packages')
    fixed_departure = models.BooleanField(default=False)
    package_categories = models.JSONField(default=list, blank=True, null=True) # ['Budget', 'Standard', 'Deluxe', 'Luxury', 'Premium']
    fixed_departure_data = models.JSONField(default=list, blank=True, null=True) 

    starting_city = models.CharField(max_length=100)
    ending_city = models.CharField(max_length=100, blank=True, null=True)

    days = models.PositiveIntegerField()
    start_date = models.DateField(null=True, blank=True)

    Offer_price = models.PositiveIntegerField()
    price = models.PositiveIntegerField(null=True, blank=True)

    group_size = models.PositiveIntegerField(default=0)
    with_flight = models.BooleanField(default=False)
    
    # Arrival Logistics
    with_arrival = models.BooleanField(default=True)
    arrival_city = models.CharField(max_length=100, blank=True, null=True)
    arrival_date = models.DateField(null=True, blank=True)
    arrival_time = models.TimeField(null=True, blank=True)
    arrival_airport = models.CharField(max_length=100, blank=True, null=True)
    arrival_airline = models.CharField(max_length=100, blank=True, null=True)
    arrival_flight_no = models.CharField(max_length=50, blank=True, null=True)

    # Departure Logistics
    with_departure = models.BooleanField(default=True)
    departure_city = models.CharField(max_length=100, blank=True, null=True)
    departure_date = models.DateField(null=True, blank=True)
    departure_time = models.TimeField(null=True, blank=True)
    departure_airport = models.CharField(max_length=100, blank=True, null=True)
    departure_airline = models.CharField(max_length=100, blank=True, null=True)
    departure_flight_no = models.CharField(max_length=50, blank=True, null=True)

    header_image = models.ImageField(upload_to="packages/headers/", null=True, blank=True)
    card_image = models.ImageField(upload_to="packages/cards/", null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    sharing = models.CharField(
        max_length=20,
        choices=[('SINGLE', 'SINGLE'), ('TWIN', 'TWIN'), ('TRIPLE', 'TRIPLE'), ('QUAD', 'QUAD'), ('QUINT', 'QUINT')],
        default='SINGLE',
        blank=True, null=True
    )
    accommodations_raw = models.JSONField(default=list, blank=True, null=True)
    vehicles_raw = models.JSONField(default=list, blank=True, null=True)
    inclusions_raw = models.JSONField(default=list, blank=True, null=True)
    exclusions_raw = models.JSONField(default=list, blank=True, null=True)
    highlights_raw = models.JSONField(default=list, blank=True, null=True)
    cancellation_policies_raw = models.JSONField(default=list, blank=True, null=True)
    terms_and_policies_raw = models.JSONField(default=list, blank=True, null=True)
    arrival_no_of_nights = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.title


class PackageDestination(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="extra_destinations",
        on_delete=models.CASCADE
    )
    destination = models.ForeignKey('Destination', on_delete=models.CASCADE)
    nights = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.package.title} - {self.destination.name}"


class ItineraryDay(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="itinerary",
        on_delete=models.CASCADE
    )
    master_template = models.ForeignKey(
        'ItineraryMaster',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Optional: Select a master template to pre-populate or reference data."
    )
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="packages/itinerary/", blank=True, null=True)
    details_json = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        ordering = ["day_number"]

    def __str__(self):
        return f"{self.package.title} - Day {self.day_number}"


class Inclusion(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="inclusions",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class Exclusion(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="exclusions",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class Highlight(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="highlights",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class CancellationPolicy(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="cancellation_policies",
        on_delete=models.CASCADE
    )
    text = models.TextField()

    def __str__(self):
        return f"Policy for {self.package.title}"



class Destination(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    card_image = models.ImageField(upload_to="destinations/cards/", null=True, blank=True)
    is_popular = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name


class StartingCity(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name


class ItineraryMaster(models.Model):
    destination = models.ForeignKey(
        'Destination',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="itinerary_templates"
    )
    name = models.CharField(max_length=200, help_text="A unique name to identify this template (e.g., 'Goa Arrival')")
    title = models.CharField(max_length=200, help_text="The title that will appear in the package (e.g., 'Arrival and Check-in')")
    description = models.TextField()
    image = models.ImageField(upload_to="itinerary_master/", blank=True, null=True)
    details_json = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f"{self.destination.name if self.destination else 'Global'} - {self.name}"


class Nationality(models.Model):
    country = models.CharField(max_length=100)
    nationality = models.CharField(max_length=100)
    continent = models.CharField(max_length=50)

    class Meta:
        verbose_name_plural = "Nationalities"
        ordering = ['continent', 'country']

    def __str__(self):
        return f"{self.country} ({self.nationality})"


class UmrahDestination(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    class Meta:
        ordering = ['country', 'name']

    def __str__(self):
        return f"{self.name} - {self.country}"



# Country Master for Visa
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, blank=True, null=True)
    # header_image = models.ImageField(upload_to="countries/headers/", blank=True, null=True)
    # video = models.FileField(upload_to="countries/videos/", blank=True, null=True, help_text="Upload a video for the country header")
    
    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']
    
    def __str__(self):
        return self.name


# Visa Models
class Visa(models.Model):
    country = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    ENTRY_TYPES = [
        ('Single-Entry Visa', 'Single-Entry Visa'),
        ('Double-Entry Visa', 'Double-Entry Visa'),
        ('Multiple-Entry Visa', 'Multiple-Entry Visa'),
        ('Transit Visa', 'Transit Visa'),
        ('Visa on Arrival', 'Visa on Arrival'),
        ('Electronic Visa (e-Visa)', 'Electronic Visa (e-Visa)'),
        ('Re-Entry Visa', 'Re-Entry Visa'),
    ]
    entry_type = models.CharField(max_length=50, choices=ENTRY_TYPES, default="Single-Entry Visa")
    validity = models.CharField(max_length=50, default="30 days")
    duration = models.CharField(max_length=50, default="30 days")
    processing_time = models.CharField(max_length=100)
    cost_price = models.IntegerField(default=0)
    service_charge = models.IntegerField(default=0)
    selling_price = models.IntegerField(default=0)
    documents_required = models.TextField(blank=True, help_text="Comma-separated list")
    photography_required = models.TextField(blank=True, help_text="Comma-separated list of photography requirements")
    # Individual Overrides (Optional) - REMOVED AS PER REQUEST
    VISA_TYPES = [
        ('✈️ Tourist Visa', '✈️ Tourist Visa'),
        ('💼 Business Visa', '💼 Business Visa'),
        ('🎓 Student Visa', '🎓 Student Visa'),
        ('👨💼 Work / Employment Visa', '👨💼 Work / Employment Visa'),
        ('👨👩👧 Family / Dependent Visa', '👨👩👧 Family / Dependent Visa'),
        ('❤️ Marriage / Fiancé(e) Visa', '❤️ Marriage / Fiancé(e) Visa'),
        ('🏡 Permanent Residence / Immigrant Visa', '🏡 Permanent Residence / Immigrant Visa'),
        ('🛂 Transit Visa', '🛂 Transit Visa'),
        ('🩺 Medical Visa', '🩺 Medical Visa'),
        ('🌍 Diplomatic / Official Visa', '🌍 Diplomatic / Official Visa'),
    ]
    visa_type = models.CharField(max_length=100, choices=VISA_TYPES, default='✈️ Tourist Visa')
    # header_image = models.ImageField(upload_to="visas/headers/", blank=True, null=True)
    card_image = models.ImageField(upload_to="visas/cards/", blank=True, null=True)
    # video = models.FileField(upload_to="visas/videos/", blank=True, null=True, help_text="Upload a video for the visa page header")
    supplier = models.ForeignKey('Supplier', on_delete=models.SET_NULL, null=True, blank=True, related_name='visas')
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        self.selling_price = self.cost_price + self.service_charge
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['country', 'selling_price']

    def __str__(self):
        return f"{self.country} - {self.title}"


class VisaApplication(models.Model):
    APPLICATION_TYPES = [
        ('Individual', 'Individual'),
        ('Group', 'Group'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    visa = models.ForeignKey(Visa, on_delete=models.CASCADE, related_name='applications')
    application_type = models.CharField(max_length=20, choices=APPLICATION_TYPES, default='Individual')
    internal_id = models.CharField(max_length=100, blank=True, null=True)
    group_name = models.CharField(max_length=100, blank=True, null=True)
    departure_date = models.DateField()
    return_date = models.DateField()
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"App for {self.visa.country} ({self.id})"


class VisaApplicant(models.Model):
    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    MARITAL_STATUS_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
    ]

    application = models.ForeignKey(VisaApplication, related_name='applicants', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    passport_number = models.CharField(max_length=50)
    nationality = models.CharField(max_length=50)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    dob = models.DateField()
    place_of_birth = models.CharField(max_length=100)
    place_of_issue = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_issue = models.DateField()
    date_of_expiry = models.DateField()
    passport_front = models.ImageField(upload_to='visa_apps/passports/', blank=True, null=True)
    photo = models.ImageField(upload_to='visa_apps/photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.passport_number})"


class VisaAdditionalDocument(models.Model):
    applicant = models.ForeignKey(VisaApplicant, related_name='additional_documents', on_delete=models.CASCADE)
    document_name = models.CharField(max_length=100, blank=True, null=True)
    file = models.FileField(upload_to='visa_apps/additional_docs/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Doc for {self.applicant.first_name} - {self.document_name or 'unnamed'}"

class Supplier(models.Model):
    company_name = models.CharField(max_length=255)
    services = models.JSONField(default=list, help_text="List of services: HOLIDAYS, Visa, Flight, Hotel, Attestation")
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=20)
    contact_person = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name

class CruiseCalendar(models.Model):
    cruise_type = models.CharField(max_length=100) # Used as Category
    itinerary = models.CharField(max_length=255)   # Used as Title
    jan = models.CharField(max_length=100, blank=True, null=True)
    feb = models.CharField(max_length=100, blank=True, null=True)
    mar = models.CharField(max_length=100, blank=True, null=True)
    apr = models.CharField(max_length=100, blank=True, null=True)
    may = models.CharField(max_length=100, blank=True, null=True)
    jun = models.CharField(max_length=100, blank=True, null=True)
    jul = models.CharField(max_length=100, blank=True, null=True)
    aug = models.CharField(max_length=100, blank=True, null=True)
    sep = models.CharField(max_length=100, blank=True, null=True)
    oct = models.CharField(max_length=100, blank=True, null=True)
    nov = models.CharField(max_length=100, blank=True, null=True)
    dec = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cruise_type} - {self.itinerary[:30]}"


class HotelMaster(models.Model):
    name = models.CharField(max_length=255)
    stars = models.CharField(max_length=10, default="3")
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    image = models.ImageField(upload_to="hotels/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Accommodation(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="accommodation_templates", null=True, blank=True)
    name = models.CharField(max_length=255)
    star_category = models.CharField(max_length=20, default="3 Star")
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    country_code = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class AccommodationImage(models.Model):
    accommodation = models.ForeignKey(Accommodation, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="accommodations/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.accommodation.name}"

class Airline(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to="airlines/", null=True, blank=True)

    def __str__(self):
        return self.name

class HolidayVehicle(models.Model):
    package = models.ForeignKey(
        HolidayPackage,
        related_name="vehicles",
        on_delete=models.CASCADE
    )
    category = models.CharField(max_length=100) # Self Drive, Vehicle with Driver/ Chauffeur
    vehicle_type = models.CharField(max_length=200)
    no_of_vehicles = models.PositiveIntegerField(default=1)
    pickup_date = models.DateField(null=True, blank=True)
    pickup_location = models.TextField(blank=True, null=True)
    dropoff_date = models.DateField(null=True, blank=True)
    dropoff_location = models.TextField(blank=True, null=True)
    vehicle_brand = models.CharField(max_length=200, blank=True, null=True)
    pickup_time = models.TimeField(null=True, blank=True)
    dropoff_time = models.TimeField(null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.vehicle_type} for {self.package.title}"
class SightseeingMaster(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="sightseeing_templates")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    duration = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    image = models.ImageField(upload_to="sightseeing/", blank=True, null=True)
    map_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.destination.name} - {self.name}"

class SightseeingImage(models.Model):
    sightseeing = models.ForeignKey(SightseeingMaster, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="sightseeing/gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.sightseeing.name}"

class MealMaster(models.Model):
    name = models.CharField(max_length=255)
    meal_type = models.CharField(max_length=100, help_text="e.g. Breakfast, Lunch, Dinner")
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    image = models.ImageField(upload_to="meals/", blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.meal_type})"

class VehicleBrand(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class RoomType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class VehicleMaster(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    brand = models.ForeignKey(VehicleBrand, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')
    seating_capacity = models.PositiveIntegerField(null=True, blank=True)
    luggage_capacity = models.PositiveIntegerField(null=True, blank=True)
    driver = models.ForeignKey("DriverMaster", on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')
    photo = models.ImageField(upload_to="vehicles/", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand.name} {self.name}"

class DriverMaster(models.Model):
    name = models.CharField(max_length=255)
    id_no = models.CharField(max_length=255)
    id_copy = models.FileField(upload_to="driver_ids/", blank=True, null=True)
    photo = models.ImageField(upload_to="drivers/", blank=True, null=True)
    mobile_number = models.CharField(max_length=20)
    whatsapp_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class VehicleRateCard(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    supplier = models.ForeignKey('Supplier', on_delete=models.SET_NULL, null=True, blank=True, related_name='rate_cards')
    vehicle = models.ForeignKey('VehicleMaster', on_delete=models.CASCADE, null=True, blank=True, related_name='rate_cards')
    validity_start = models.DateField()
    validity_end = models.DateField()
    # Storing the tabular data as JSON
    # Structure: [{ "start_from": "...", "drop_to": "...", "v1": "", "v2": "", "v3": "", "v4": "" }]
    routes = models.JSONField(default=list)
    column_vehicles = models.JSONField(default=list, blank=True, null=True)
    rate_card_file = models.FileField(upload_to="rate_cards/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PickupPointMaster(models.Model):
    city = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='pickup_points')
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.city.name})"

class CabBooking(models.Model):
    vehicle_name = models.CharField(max_length=255)
    vehicle_category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    from_city = models.CharField(max_length=255)
    to_city = models.CharField(max_length=255)
    pickup_date = models.DateField()
    guests = models.PositiveIntegerField()
    title = models.CharField(max_length=10)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=25)
    email = models.EmailField(blank=True, null=True)
    luggage_count = models.CharField(max_length=50, blank=True, null=True)
    transfer_type = models.CharField(max_length=50) # 'airport' or 'intercity'
    
    # Airport Specific
    flight_number = models.CharField(max_length=50, blank=True, null=True)
    terminal = models.CharField(max_length=50, blank=True, null=True)
    arrival_time = models.CharField(max_length=50, blank=True, null=True)
    departure_time = models.CharField(max_length=50, blank=True, null=True)
    
    # Inter-city Specific
    pickup_location_details = models.TextField(blank=True, null=True)
    pickup_time = models.CharField(max_length=50, blank=True, null=True)
    
    special_requirements = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=50, 
        choices=[
            ('Booking Requested', 'Booking Requested'),
            ('Tentative Confirmation', 'Tentative Confirmation'),
            ('Completed', 'Completed'),
            ('Cancelled', 'Cancelled')
        ], 
        default='Booking Requested'
    )
    driver = models.CharField(max_length=255, blank=True, null=True)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.first_name} {self.last_name} - {self.vehicle_name}"

class CabAdditionalDocument(models.Model):
    booking = models.ForeignKey(CabBooking, related_name='additional_documents', on_delete=models.CASCADE)
    document_name = models.CharField(max_length=100, blank=True, null=True)
    file = models.FileField(upload_to='cab_bookings/additional/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Doc for {self.booking.first_name} - {self.document_name or 'unnamed'}"
