import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import Nationality

data_text = """
Africa (54)
Algeria – Algerian
Angola – Angolan
Benin – Burundian
Botswana – Motswana
Burkina Faso – Burkinabé
Burundi – Burundian
Cabo Verde – Cape Verdean
Cameroon – Cameroonian
Central African Republic – Central African
Chad – Chadian
Comoros – Comorian
Congo – Congolese
Democratic Republic of the Congo – Congolese
Djibouti – Djiboutian
Egypt – Egyptian
Equatorial Guinea – Equatorial Guinean
Eritrea – Eritrean
Eswatini – Swazi
Ethiopia – Ethiopian
Gabon – Gabonese
Gambia – Gambian
Ghana – Ghanaian
Guinea – Guinean
Guinea-Bissau – Bissau-Guinean
Ivory Coast – Ivorian
Kenya – Kenyan
Lesotho – Mosotho
Liberia – Liberian
Libya – Libyan
Madagascar – Malagasy
Malawi – Malawian
Mali – Malian
Mauritania – Mauritanian
Mauritius – Mauritian
Morocco – Moroccan
Mozambique – Mozambican
Namibia – Namibian
Niger – Nigerien
Nigeria – Nigerian
Rwanda – Rwandan
São Tomé and Príncipe – São Toméan
Senegal – Senegalese
Seychelles – Seychellois
Sierra Leone – Sierra Leonean
Somalia – Somali
South Africa – South African
South Sudan – South Sudanese
Sudan – Sudanese
Tanzania – Tanzanian
Togo – Togolese
Tunisia – Tunisian
Uganda – Ugandan
Zambia – Zambian
Zimbabwe – Zimbabwean

Asia (49)
Afghanistan – Afghan
Armenia – Armenian
Azerbaijan – Azerbaijani
Bahrain – Bahraini
Bangladesh – Bangladeshi
Bhutan – Bhutanese
Brunei – Bruneian
Cambodia – Cambodian
China – Chinese
Cyprus – Cypriot
Georgia – Georgian
India – Indian
Indonesia – Indonesian
Iran – Iranian
Iraq – Iraqi
Israel – Israeli
Japan – Japanese
Jordan – Jordanian
Kazakhstan – Kazakh
Kuwait – Kuwaiti
Kyrgyzstan – Kyrgyz
Laos – Laotian
Lebanon – Lebanese
Malaysia – Malaysian
Maldives – Maldivian
Mongolia – Mongolian
Myanmar – Burmese
Nepal – Nepali
North Korea – North Korean
Oman – Omani
Pakistan – Pakistani
Philippines – Filipino
Qatar – Qatari
Saudi Arabia – Saudi
Singapore – Singaporean
South Korea – South Korean
Sri Lanka – Sri Lankan
Syria – Syrian
Tajikistan – Tajik
Thailand – Thai
Timor-Leste – Timorese
Turkey – Turkish
Turkmenistan – Turkmen
United Arab Emirates – Emirati
Uzbekistan – Uzbek
Vietnam – Vietnamese
Yemen – Yemeni

Europe (44)
Albania – Albanian
Andorra – Andorran
Austria – Austrian
Belarus – Belarusian
Belgium – Belgian
Bosnia and Herzegovina – Bosnian
Bulgaria – Bulgarian
Croatia – Croatian
Czech Republic – Czech
Denmark – Danish
Estonia – Estonian
Finland – Finnish
France – French
Germany – German
Greece – Greek
Hungary – Hungarian
Iceland – Icelandic
Ireland – Irish
Italy – Italian
Latvia – Latvian
Liechtenstein – Liechtensteiner
Lithuania – Lithuanian
Luxembourg – Luxembourger
Malta – Maltese
Moldova – Moldovan
Monaco – Monegasque
Montenegro – Montenegrin
Netherlands – Dutch
North Macedonia – Macedonian
Norway – Norwegian
Poland – Polish
Portugal – Portuguese
Romania – Romanian
Russia – Russian
San Marino – Sammarinese
Serbia – Serbian
Slovakia – Slovak
Slovenia – Slovenian
Spain – Spanish
Sweden – Swedish
Switzerland – Swiss
Ukraine – Ukrainian
United Kingdom – British
Vatican City – Vatican

North America (23)
Antigua and Barbuda – Antiguan
Bahamas – Bahamian
Barbados – Barbadian
Belize – Belizean
Canada – Canadian
Costa Rica – Costa Rican
Cuba – Cuban
Dominica – Dominican
Dominican Republic – Dominican
El Salvador – Salvadoran
Grenada – Grenadian
Guatemala – Guatemalan
Haiti – Haitian
Honduras – Honduran
Jamaica – Jamaican
Mexico – Mexican
Nicaragua – Nicaraguan
Panama – Panamanian
Saint Kitts and Nevis – Kittitian
Saint Lucia – Saint Lucian
Saint Vincent and the Grenadines – Vincentian
Trinidad and Tobago – Trinidadian
United States – American

South America (12)
Argentina – Argentine
Bolivia – Bolivian
Brazil – Brazilian
Chile – Chilean
Colombia – Colombian
Ecuador – Ecuadorian
Guyana – Guyanese
Paraguay – Paraguayan
Peru – Peruvian
Suriname – Surinamese
Uruguay – Uruguayan
Venezuela – Venezuelan

Oceania (14)
Australia – Australian
Fiji – Fijian
Kiribati – I-Kiribati
Marshall Islands – Marshallese
Micronesia – Micronesian
Nauru – Nauruan
New Zealand – New Zealander
Palau – Palauan
Papua New Guinea – Papua New Guinean
Samoa – Samoan
Solomon Islands – Solomon Islander
Tonga – Tongan
Tuvalu – Tuvaluan
Vanuatu – Ni-Vanuatu

Other / Special
Taiwan – Taiwanese
"""

def populate():
    lines = data_text.strip().split('\n')
    current_continent = ""
    count = 0

    # Clear existing data
    Nationality.objects.all().delete()

    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if it's a continent header
        if '(' in line and not '–' in line:
            current_continent = line.split('(')[0].strip()
            print(f"Switching to continent: {current_continent}")
            continue
        
        if line == "Other / Special":
            current_continent = "Other"
            print("Switching to continent: Other")
            continue

        # Parse country and nationality
        if '–' in line:
            parts = line.split('–')
            country = parts[0].strip()
            nationality = parts[1].strip()
            
            Nationality.objects.create(
                country=country,
                nationality=nationality,
                continent=current_continent
            )
            count += 1

    print(f"Successfully populated {count} nationalities.")

if __name__ == "__main__":
    populate()
