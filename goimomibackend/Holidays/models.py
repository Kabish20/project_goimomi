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
    
    # New fields for Cab/Cruise structured enquiry
    vehicle = models.CharField(max_length=100, blank=True, null=True)
    from_city = models.CharField(max_length=100, blank=True, null=True)
    to_city = models.CharField(max_length=100, blank=True, null=True)
    travel_date = models.DateField(blank=True, null=True)
    
    enquiry_type = models.CharField(
        max_length=50, 
        choices=[
            ('General', 'General'), 
            ('Cab', 'Cab'), 
            ('Cruise', 'Cruise'), 
            ('Hotel', 'Hotel'),
            ('Business Travel', 'Business Travel')
        ], 
        default="General"
    )

    created_at = models.DateTimeField(auto_now_add=True)


class HolidayPackage(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    
    category = models.CharField(
        max_length=20,
        choices=[('Domestic', 'Domestic'), ('International', 'International'), ('Umrah', 'Umrah'), ('Business Travel', 'Business Travel')],
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
    destination = models.ForeignKey('City', on_delete=models.CASCADE, null=True, blank=True)
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






class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    card_image = models.ImageField(upload_to="countries/cards/", null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Countries"


class Nationality(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='nationalities', null=True, blank=True)

    def __str__(self):
        return self.name


class Region(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='regions')

    def __str__(self):
        return f"{self.name} ({self.country.name})"

    class Meta:
        unique_together = ('name', 'country')


class City(models.Model):
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='cities', null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')

    def __str__(self):
        if self.region:
            return f"{self.name}, {self.region.name} ({self.country.name})"
        return f"{self.name} ({self.country.name})"

    class Meta:
        unique_together = ('name', 'region', 'country')


class Airport(models.Model):
    name = models.CharField(max_length=200)
    iata_code = models.CharField(max_length=10)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, related_name='airports')

    def __str__(self):
        return f"{self.name} ({self.iata_code})"





class CruiseTerminal(models.Model):
    terminal_name = models.CharField(max_length=255)
    cruise_name = models.CharField(max_length=255, null=True, blank=True)
    cruise_code = models.CharField(max_length=50, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='cruise_terminals', null=True, blank=True)

    def __str__(self):
        city_name = self.city.name if self.city else "Global"
        if self.cruise_name:
            return f"{self.terminal_name} - {self.cruise_name} ({self.cruise_code}) - {city_name}"
        return f"{self.terminal_name} - {city_name}"


class ItineraryMaster(models.Model):
    city = models.ForeignKey(
        'City',
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
        return f"{self.city.name if self.city else 'Global'} - {self.name}"









# Country Master for Visa



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
    payment_status = models.CharField(
        max_length=50,
        choices=[('Pending', 'Pending'), ('Paid', 'Paid'), ('Failed', 'Failed')],
        default='Pending'
    )
    zoho_payment_session_id = models.CharField(max_length=255, blank=True, null=True)
    zoho_access_key = models.CharField(max_length=255, blank=True, null=True)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"App for {self.visa.country} ({self.id})"


class PackageBooking(models.Model):
    booking_id = models.CharField(max_length=20, unique=True, blank=True, null=True, editable=False)
    package = models.ForeignKey(HolidayPackage, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    package_title = models.CharField(max_length=255)
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=25)
    travel_date = models.DateField()
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Confirmed', 'Confirmed'),
            ('Cancelled', 'Cancelled')
        ],
        default='Pending'
    )
    payment_status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Paid', 'Paid'),
            ('Failed', 'Failed')
        ],
        default='Pending'
    )
    zoho_payment_session_id = models.CharField(max_length=255, blank=True, null=True)
    zoho_access_key = models.CharField(max_length=255, blank=True, null=True)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.booking_id:
            self.booking_id = f'GO-PKG-{str(self.pk).zfill(4)}'
            PackageBooking.objects.filter(pk=self.pk).update(booking_id=self.booking_id)
            self.booking_id = f'GO-PKG-{str(self.pk).zfill(4)}'

    def __str__(self):
        return f"{self.booking_id or self.pk} - {self.full_name} ({self.package_title})"



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
    city_link = models.ForeignKey('City', on_delete=models.CASCADE, related_name="accommodation_templates", null=True, blank=True)
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
    city_link = models.ForeignKey('City', on_delete=models.CASCADE, related_name="sightseeing_templates", null=True, blank=True)
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
        return f"{self.city_link.name if self.city_link else (self.city or 'No City')} - {self.name}"

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
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='pickup_points')
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.city.name})"

class CabBooking(models.Model):
    booking_id = models.CharField(max_length=20, unique=True, blank=True, null=True, editable=False)
    vehicle_name = models.CharField(max_length=255)
    vehicle_category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    from_city = models.CharField(max_length=255)
    to_city = models.CharField(max_length=255)
    pickup_date = models.DateField()
    guests = models.PositiveIntegerField()
    gender = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        default='Male'
    )
    title = models.CharField(max_length=10, blank=True, null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=25)
    email = models.EmailField(blank=True, null=True)
    luggage_count = models.CharField(max_length=50, blank=True, null=True)
    transfer_type = models.CharField(max_length=50) # 'airport' or 'intercity'
    
    # Airport Specific
    flight_number = models.CharField(max_length=50, blank=True, null=True)
    terminal = models.CharField(max_length=50, blank=True, null=True)
    airport_name = models.CharField(max_length=255, blank=True, null=True)
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
            ('defined', 'defined'),
            ('Confirmed', 'Confirmed'),
            ('Completed', 'Completed'),
            ('Cancelled', 'Cancelled')
        ], 
        default='Booking Requested'
    )
    driver = models.CharField(max_length=255, blank=True, null=True)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    zoho_payment_session_id = models.CharField(max_length=255, blank=True, null=True)
    zoho_access_key = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-sync gender if only title is provided
        if not self.gender and self.title:
            if self.title in ['Ms.', 'Mrs.', 'Miss']:
                self.gender = 'Female'
            elif self.title in ['Mr.', 'Master']:
                self.gender = 'Male'
        # Auto-sync title if only gender is provided
        if not self.title and self.gender:
            if self.gender == 'Female':
                self.title = 'Ms.'
            else:
                self.title = 'Mr.'

        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.booking_id:
            self.booking_id = f'GO-TRN-{str(self.pk).zfill(4)}'
            CabBooking.objects.filter(pk=self.pk).update(booking_id=self.booking_id)
            self.booking_id = f'GO-TRN-{str(self.pk).zfill(4)}'

    def __str__(self):
        return f"{self.booking_id or self.pk} - {self.first_name} {self.last_name} ({self.vehicle_name})"

class CabAdditionalDocument(models.Model):
    booking = models.ForeignKey(CabBooking, related_name='additional_documents', on_delete=models.CASCADE)
    document_name = models.CharField(max_length=100, blank=True, null=True)
    file = models.FileField(upload_to='cab_bookings/additional/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Doc for {self.booking.first_name} - {self.document_name or 'unnamed'}"

class CantonEnquiry(models.Model):
    full_name = models.CharField(max_length=150)
    whatsapp_number = models.CharField(max_length=20)
    business_name = models.CharField(max_length=255)
    selected_phase = models.CharField(max_length=150)
    payment_status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Success', 'Success'), ('Failed', 'Failed')],
        default='Pending'
    )
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.selected_phase}"

class BusinessJourneyRegistration(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Contacted', 'Contacted'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    ]

    full_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True, null=True)
    whatsapp_number = models.CharField(max_length=30, blank=True, null=True)
    journey = models.CharField(max_length=150, default="Chithirai Global", blank=True, null=True)
    contacting_for = models.CharField(max_length=255, default="Chithirai Global Journey Registration", blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Business Journey Registration"
        verbose_name_plural = "Business Journey Registrations"

    def __str__(self):
        return f"{self.full_name} - {self.company_name or 'No Company'} ({self.journey})"

class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} - {self.otp} (Verified: {self.is_verified})"



# ─────────────────────────────────────────────────────────────────────────────
# Goimomi Product
# ─────────────────────────────────────────────────────────────────────────────

class GoimomiProduct(models.Model):

    STOCK_STATUS_CHOICES = [
        ('in_stock', 'In Stock'),
        ('out_of_stock', 'Out of Stock'),
    ]

    product_id = models.CharField(max_length=100, blank=True, null=True, unique=True, help_text="Product ID format e.g. GO-PRO-0001")
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Selling price")
    mrp = models.DecimalField(max_digits=10, decimal_places=2, help_text="Maximum Retail Price")
    quantity = models.PositiveIntegerField(default=0)
    stock_status = models.CharField(
        max_length=20,
        choices=STOCK_STATUS_CHOICES,
        default='in_stock',
    )
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    catalogue = models.ForeignKey('CatalogueMaster', related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    sub_catalogue = models.ForeignKey('SubCatalogue', related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    sub_catalogues = models.ManyToManyField('SubCatalogue', blank=True, related_name='products_multi')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Goimomi Product"
        verbose_name_plural = "Goimomi Products"

    def __str__(self):
        pid = self.product_id or f'GO-PRO-{str(self.pk).zfill(4)}'
        return f"{pid} - {self.title}"

    def save(self, *args, **kwargs):
        if self.quantity is not None:
            if self.quantity <= 0:
                self.quantity = 0
                self.stock_status = 'out_of_stock'
            elif not self.stock_status:
                self.stock_status = 'in_stock'
        super().save(*args, **kwargs)
        if not self.product_id:
            self.product_id = f'GO-PRO-{str(self.pk).zfill(4)}'
            GoimomiProduct.objects.filter(pk=self.pk).update(product_id=self.product_id)

    @property
    def discount_percent(self):
        if self.mrp and self.mrp > 0:
            return round(((self.mrp - self.price) / self.mrp) * 100)
        return 0


class GoimomiProductImage(models.Model):
    """Additional images for a GoimomiProduct."""
    product = models.ForeignKey(
        GoimomiProduct,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='products/gallery/')
    order = models.PositiveIntegerField(default=0, help_text='Display order')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f'Image #{self.pk} for {self.product.title}'


# ─────────────────────────────────────────────────────────────────────────────
# Goimomi Product Order
# ─────────────────────────────────────────────────────────────────────────────

class GoimomiProductOrder(models.Model):
    order_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    product = models.ForeignKey(GoimomiProduct, on_delete=models.SET_NULL, null=True, related_name='orders')
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Unit price at checkout")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total amount paid")
    address = models.TextField()
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=20, blank=True, null=True)
    cart_items = models.JSONField(blank=True, null=True, help_text="Cart items list if cart checkout")
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Confirmed', 'Confirmed'),
            ('Shipped', 'Shipped'),
            ('Delivered', 'Delivered'),
            ('Cancelled', 'Cancelled')
        ],
        default='Pending'
    )
    zoho_payment_session_id = models.CharField(max_length=255, blank=True, null=True)
    zoho_access_key = models.CharField(max_length=255, blank=True, null=True)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    book_invoice_number = models.CharField(max_length=100, blank=True, null=True, help_text="Custom / Offline Book Invoice Number")
    logistics_provider = models.CharField(max_length=100, blank=True, null=True, help_text="Courier / Logistics Provider Name")
    tracking_number = models.CharField(max_length=100, blank=True, null=True, help_text="Courier Tracking / Waybill Number")
    bill_copy = models.FileField(upload_to='orders/bills/', blank=True, null=True, help_text="Uploaded shipping bill/receipt copy")
    stock_deducted_at = models.DateTimeField(blank=True, null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Goimomi Product Order"
        verbose_name_plural = "Goimomi Product Orders"

    def __str__(self):
        return f"Order {self.order_id or self.pk} - {self.name}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.order_id:
            self.order_id = f'GO-ORD-{str(self.pk).zfill(4)}'
            if not self.invoice_number:
                self.invoice_number = self.order_id
            GoimomiProductOrder.objects.filter(pk=self.pk).update(order_id=self.order_id, invoice_number=self.invoice_number)
            self.order_id = f'GO-ORD-{str(self.pk).zfill(4)}'


# ─────────────────────────────────────────────────────────────────────────────
# Logistics Provider Master
# ─────────────────────────────────────────────────────────────────────────────

class LogisticsProvider(models.Model):
    name = models.CharField(max_length=255, help_text="Logistics Provider Name (e.g. Blue Dart, Delhivery)")
    tracking_link = models.CharField(max_length=500, help_text="Base tracking URL")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Logistics Provider"
        verbose_name_plural = "Logistics Providers"

    def __str__(self):
        return self.name


# ─────────────────────────────────────────────────────────────────────────────
# Catalogue Master & Sub Catalogue
# ─────────────────────────────────────────────────────────────────────────────

class CatalogueMaster(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True, blank=True, null=True, help_text="Unique code or slug")
    description = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='catalogues/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Catalogue Master"
        verbose_name_plural = "Catalogue Masters"

    def __str__(self):
        return self.name


class SubCatalogue(models.Model):
    catalogue = models.ForeignKey(
        CatalogueMaster,
        related_name='sub_catalogues',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='sub_catalogues/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display ordering position")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Sub Catalogue"
        verbose_name_plural = "Sub Catalogues"

    def __str__(self):
        return f"{self.catalogue.name} -> {self.name}"


# ─────────────────────────────────────────────────────────────────────────────
# Zoho CRM Webhook Logs
# ─────────────────────────────────────────────────────────────────────────────

class ZohoWebhookLog(models.Model):
    event_type = models.CharField(max_length=100, default='crm_webhook')
    module = models.CharField(max_length=100, blank=True, null=True, help_text="Zoho Module e.g. Leads, Contacts, Deals")
    payload = models.JSONField(default=dict, blank=True, help_text="Raw payload received from Zoho CRM")
    headers = models.JSONField(default=dict, blank=True, help_text="HTTP request headers")
    status = models.CharField(
        max_length=50,
        choices=[
            ('received', 'Received'),
            ('success', 'Success'),
            ('error', 'Error'),
            ('unauthorized', 'Unauthorized')
        ],
        default='received'
    )
    response_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Zoho Webhook Log"
        verbose_name_plural = "Zoho Webhook Logs"

    def __str__(self):
        return f"Zoho Webhook [{self.module or 'CRM'}] - {self.status} ({self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''})"



