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
    starting_city = models.CharField(max_length=100)

    days = models.PositiveIntegerField()
    start_date = models.DateField(null=True, blank=True)

    Offer_price = models.PositiveIntegerField()
    price = models.PositiveIntegerField(null=True, blank=True)

    group_size = models.PositiveIntegerField(default=0)
    with_flight = models.BooleanField(default=False)

    header_image = models.ImageField(upload_to="packages/headers/", null=True, blank=True)
    card_image = models.ImageField(upload_to="packages/cards/", null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

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


class Destination(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
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
    created_at = models.DateTimeField(auto_now_add=True)

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
