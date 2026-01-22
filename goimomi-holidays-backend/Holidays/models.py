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
    purpose = models.TextField(blank=True, null=True)

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

    header_image = models.ImageField(upload_to="packages/headers/")
    card_image = models.ImageField(upload_to="packages/cards/")

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
    
    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']
    
    def __str__(self):
        return self.name


# Visa Models
class Visa(models.Model):
    country = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    entry_type = models.CharField(max_length=50, default="Single")  # Single, Multiple
    validity = models.CharField(max_length=50, default="30 days")
    duration = models.CharField(max_length=50, default="30 days")
    processing_time = models.CharField(max_length=100)
    price = models.IntegerField()
    documents_required = models.TextField(blank=True, help_text="Comma-separated list")
    VISA_TYPES = [
        ('Paper Visa', 'Paper Visa'),
        ('Sticker Visa', 'Sticker Visa'),
    ]
    visa_type = models.CharField(max_length=50, choices=VISA_TYPES, default='Paper Visa')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['country', 'price']

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
    passport_front = models.ImageField(upload_to='visa_apps/passports/')
    photo = models.ImageField(upload_to='visa_apps/photos/')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.passport_number})"
