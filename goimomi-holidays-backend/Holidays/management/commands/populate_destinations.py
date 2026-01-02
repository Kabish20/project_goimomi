from django.core.management.base import BaseCommand
from Holidays.models import Destination

class Command(BaseCommand):
    help = 'Populates the Destination table with initial data'

    def handle(self, *args, **kwargs):
        data = {
            "DOMESTIC (INDIA)": [
                "India", "Goa", "Kerala", "Manali", "Shimla", "Ooty", "Kodaikanal", "Rajasthan", "Udaipur", "Jaipur", "Agra", "Varanasi", "Rishikesh", "Darjeeling", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Andaman & Nicobar Islands", "Lakshadweep", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Puducherry"
            ],
            "SOUTH EAST ASIA": [
                "Thailand", "Bangkok", "Pattaya", "Phuket", "Krabi", "Chiang Mai", "Vietnam", "Hanoi", "Ho Chi Minh City", "Da Nang", "Halong Bay", "Vietnam, Cambodia & Laos", "Cambodia", "Siem Reap", "Phnom Penh", "Laos", "Vientiane", "Luang Prabang", "Singapore", "Malaysia", "Kuala Lumpur", "Langkawi", "Penang", "Indonesia", "Bali", "Jakarta", "Yogyakarta", "Philippines", "Manila", "Cebu", "Boracay", "Myanmar", "Yangon", "Bagan", "Brunei", "East Timor"
            ],
            "MIDDLE EAST": [
                "United Arab Emirates", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Saudi Arabia", "Makkah", "Madinah", "Riyadh", "Jeddah", "Qatar", "Doha", "Oman", "Muscat", "Salalah", "Bahrain", "Manama", "Kuwait", "Kuwait City", "Jordan", "Amman", "Petra", "Israel", "Jerusalem", "Tel Aviv", "Palestine", "Bethlehem", "Lebanon", "Beirut", "Iraq", "Baghdad", "Iran", "Tehran", "Yemen", "Syria"
            ],
            "EUROPE": [
                "Europe", "United Kingdom", "London", "Scotland", "Ireland", "France", "Paris", "Nice", "Belgium", "Brussels", "Netherlands", "Amsterdam", "Luxembourg", "Germany", "Berlin", "Munich", "Austria", "Vienna", "Salzburg", "Switzerland", "Zurich", "Lucerne", "Interlaken", "Poland", "Czech Republic", "Prague", "Hungary", "Budapest", "Italy", "Rome", "Venice", "Florence", "Milan", "Spain", "Barcelona", "Madrid", "Portugal", "Lisbon", "Greece", "Athens", "Santorini", "Turkey", "Istanbul", "Cappadocia", "Norway", "Sweden", "Denmark", "Finland", "Iceland", "Russia", "Ukraine", "Romania", "Bulgaria", "Croatia", "Slovenia", "Serbia", "Bosnia and Herzegovina", "Montenegro", "Albania", "North Macedonia"
            ],
            "UNITED KINGDOM": [
                "United Kingdom", "England", "Scotland", "Wales", "Northern Ireland", "London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Bristol", "Oxford", "Cambridge", "Bath", "Brighton", "Nottingham", "York", "Edinburgh", "Glasgow", "Inverness", "Cardiff", "Swansea", "Belfast", "Derry", "Ireland", "Dublin"
            ],
            "CENTRAL ASIA / CIS": [
                "Kazakhstan", "Almaty", "Astana", "Uzbekistan", "Tashkent", "Samarkand", "Bukhara", "Kyrgyzstan", "Bishkek", "Tajikistan", "Dushanbe", "Turkmenistan", "Ashgabat", "Azerbaijan", "Baku", "Georgia", "Tbilisi", "Batumi", "Armenia", "Yerevan", "Russia", "Moscow", "Saint Petersburg", "Ukraine", "Kyiv", "Belarus", "Minsk", "Moldova", "Chisinau", "Uzbekistan, Azerbaijan, Georgia"
            ],
            "SOUTH ASIA": [
                "Nepal", "Bhutan", "Nepal, Bhutan", "Sri Lanka", "Maldives"
            ],
            "EAST ASIA": [
                "Cambodia", "Taiwan", "Japan", "South Korea", "China", "Hong Kong"
            ],
            "AUSTRALIA & NEW ZEALAND": [
                "Australia", "Sydney", "Melbourne", "New Zealand"
            ],
            "AFRICA": [
                "South Africa", "Kenya", "Egypt", "Tanzania", "Nigeria", "Ghana", "Ethiopia"
            ],
            "AMERICAS": [
                "USA", "New York", "Las Vegas", "Los Angeles", "Canada", "Toronto", "Vancouver", "Mexico"
            ]
        }

        count = 0
        for region, destinations in data.items():
            for dest_name in destinations:
                obj, created = Destination.objects.get_or_create(
                    name=dest_name,
                    defaults={'region': region}
                )
                if created:
                    count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {count} new destinations'))
