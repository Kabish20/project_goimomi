from django.core.management.base import BaseCommand
from Holidays.models import StartingCity

class Command(BaseCommand):
    help = 'Populates the StartingCity table with initial data, including international airports.'

    def handle(self, *args, **kwargs):
        data = {
            "ANDAMAN & NICOBAR": [
                "Port Blair (IXZ)"
            ],
            "ANDHRA PRADESH": [
                "Visakhapatnam (VTZ)", "Vijayawada (VGA)", "Tirupati (TIR)", "Rajahmundry (RJA)", "Kadapa (CDP)", "Kurnool (KJB)"
            ],
            "ARUNACHAL PRADESH": [
                "Itanagar (Hollongi) (HGI)"
            ],
            "ASSAM": [
                "Guwahati (GAU)", "Dibrugarh (DIB)", "Jorhat (JRH)", "Silchar (IXS)", "Tezpur (TEZ)", "North Lakhimpur (IXI)"
            ],
            "BIHAR": [
                "Patna (PAT)", "Gaya (GAY)", "Darbhanga (DBR)"
            ],
            "CHHATTISGARH": [
                "Raipur (RPR)", "Bilaspur (PAB)", "Jagdalpur (JGB)"
            ],
            "DELHI": [
                "Delhi (DEL)"
            ],
            "GOA": [
                "Goa (Dabolim) (GOI)", "Manohar Intl (Mopa) (GOX)"
            ],
            "GUJARAT": [
                "Ahmedabad (AMD)", "Surat (STV)", "Vadodara (BDQ)", "Rajkot (RAJ)", "Bhavnagar (BHU)", "Jamnagar (JGA)", "Bhuj (BHJ)", "Porbandar (PBD)", "Kandla (IXY)"
            ],
            "HARYANA": [
                "Hisar (HSS)"
            ],
            "HIMACHAL PRADESH": [
                "Shimla (SLV)", "Kullu–Manali (KUU)", "Dharamshala (DHM)"
            ],
            "JAMMU & KASHMIR": [
                "Srinagar (SXR)", "Jammu (IXJ)"
            ],
            "JHARKHAND": [
                "Ranchi (IXR)", "Deoghar (DGH)"
            ],
            "KARNATAKA": [
                "Bangalore (BLR)", "Mangalore (IXE)", "Hubli (HBX)", "Belgaum (IXG)", "Mysore (MYQ)", "Kalaburagi (GBI)"
            ],
            "KERALA": [
                "Kochi (COK)", "Trivandrum (TRV)", "Calicut (CCJ)", "Kannur (CNN)"
            ],
            "LADAKH": [
                "Leh (IXL)"
            ],
            "MADHYA PRADESH": [
                "Indore (IDR)", "Bhopal (BHO)", "Jabalpur (JLR)", "Gwalior (GWL)", "Khajuraho (HJR)"
            ],
            "MAHARASHTRA": [
                "Mumbai (BOM)", "Pune (PNQ)", "Nagpur (NAG)", "Aurangabad (IXU)", "Nashik (ISK)", "Shirdi (SAG)", "Kolhapur (KLH)", "Solapur (SSE)"
            ],
            "MANIPUR": [
                "Imphal (IMF)"
            ],
            "MEGHALAYA": [
                "Shillong (SHL)"
            ],
            "MIZORAM": [
                "Aizawl (AJL)"
            ],
            "NAGALAND": [
                "Dimapur (DMU)"
            ],
            "ORISSA": [
                "Bhubaneswar (BBI)", "Jharsuguda (JRG)", "Rourkela (RRK)"
            ],
            "PUNJAB": [
                "Amritsar (ATQ)", "Chandigarh (IXC)", "Ludhiana (LUH)", "Bathinda (BUP)"
            ],
            "RAJASTHAN": [
                "Jaipur (JAI)", "Udaipur (UDR)", "Jodhpur (JDH)", "Bikaner (BKB)", "Kota (KTU)"
            ],
            "TAMIL NADU": [
                "Chennai (MAA)", "Coimbatore (CJB)", "Madurai (IXM)", "Trichy (TRZ)", "Salem (SXV)", "Tuticorin (TCR)"
            ],
            "TELANGANA": [
                "Hyderabad (HYD)"
            ],
            "TRIPURA": [
                "Agartala (IXA)"
            ],
            "UTTAR PRADESH": [
                "Lucknow (LKO)", "Varanasi (VNS)", "Prayagraj (IXD)", "Kanpur (KNU)", "Gorakhpur (GOP)"
            ],
            "UTTARAKHAND": [
                "Dehradun (DED)", "Pantnagar (PGH)"
            ],
            "WEST BENGAL": [
                "Kolkata (CCU)", "Bagdogra (IXB)", "Durgapur (RDP)", "Cooch Behar (COH)"
            ],
            # INTERNATIONAL
            "MIDDLE EAST": [
                "Dubai (DXB)", "Abu Dhabi (AUH)", "Sharjah (SHJ)", "Doha (DOH)", "Riyadh (RUH)", "Jeddah (JED)", "Muscat (MCT)", "Bahrain (BAH)", "Kuwait (KWI)", "Tel Aviv (TLV)", "Amman (AMM)", "Beirut (BEY)"
            ],
            "SOUTH EAST ASIA": [
                "Singapore (SIN)", "Bangkok (BKK)", "Kuala Lumpur (KUL)", "Jakarta (CGK)", "Bali (DPS)", "Manila (MNL)", "Ho Chi Minh City (SGN)", "Hanoi (HAN)", "Phuket (HKT)"
            ],
            "EAST ASIA": [
                "Tokyo (NRT)", "Tokyo (HND)", "Osaka (KIX)", "Seoul (ICN)", "Beijing (PEK)", "Shanghai (PVG)", "Hong Kong (HKG)", "Taipei (TPE)"
            ],
            "EUROPE": [
                "London Heathrow (LHR)", "London Gatwick (LGW)", "Paris (CDG)", "Frankfurt (FRA)", "Amsterdam (AMS)", "Madrid (MAD)", "Barcelona (BCN)", "Rome (FCO)", "Zurich (ZRH)", "Munich (MUC)", "Istanbul (IST)", "Moscow (SVO)", "Vienna (VIE)", "Brussels (BRU)", "Copenhagen (CPH)", "Dublin (DUB)"
            ],
            "NORTH AMERICA": [
                "New York (JFK)", "New York (EWR)", "Los Angeles (LAX)", "Chicago (ORD)", "San Francisco (SFO)", "Toronto (YYZ)", "Vancouver (YVR)", "Miami (MIA)", "Dallas (DFW)", "Atlanta (ATL)", "Washington (IAD)"
            ],
            "AUSTRALIA & OCEANIA": [
                "Sydney (SYD)", "Melbourne (MEL)", "Brisbane (BNE)", "Perth (PER)", "Auckland (AKL)"
            ],
            "AFRICA": [
                "Cairo (CAI)", "Johannesburg (JNB)", "Cape Town (CPT)", "Nairobi (NBO)", "Addis Ababa (ADD)", "Casablanca (CMN)", "Lagos (LOS)"
            ],
             "SOUTH AMERICA": [
                "Sao Paulo (GRU)", "Rio De Janeiro (GIG)", "Buenos Aires (EZE)", "Bogota (BOG)", "Lima (LIM)", "Santiago (SCL)"
             ]
        }

        count = 0
        for region, cities in data.items():
            for city_name in cities:
                obj, created = StartingCity.objects.get_or_create(
                    name=city_name,
                    defaults={'region': region}
                )
                if created:
                    count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {count} new starting cities'))
