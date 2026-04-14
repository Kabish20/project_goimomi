import os
import django
import sys

# Set up Django environment
sys.path.append('/home/ubuntu/project/goimomi-holidays-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import Accommodation, Country, City

data = """Country	Hotel Name	City	Star Rating
India	The Taj Mahal Palace	Mumbai	5-Star
India	The Oberoi	New Delhi	5-Star
India	ITC Grand Chola	Chennai	5-Star
India	The Leela Palace	Bengaluru	5-Star
India	Taj Lake Palace	Udaipur	5-Star
India	The Imperial	New Delhi	5-Star
India	ITC Maurya	New Delhi	5-Star
India	The Oberoi Udaivilas	Udaipur	5-Star
India	Taj Falaknuma Palace	Hyderabad	5-Star
India	Umaid Bhawan Palace	Jodhpur	5-Star
India	The Taj Mahal Hotel	New Delhi	5-Star
India	ITC Windsor	Bengaluru	5-Star
India	The Leela Palace Chennai	Chennai	5-Star
India	Rambagh Palace	Jaipur	5-Star
India	Wildflower Hall	Shimla	5-Star
India	Radisson Blu	Mumbai	4-Star
India	Hyatt Regency	Chennai	4-Star
India	Novotel	Hyderabad	4-Star
India	Crowne Plaza	Kochi	4-Star
India	Courtyard by Marriott	Pune	4-Star
India	Marriott Jaipur	Jaipur	4-Star
India	Hilton Garden Inn	Bengaluru	4-Star
India	Sheraton Grand Bangalore	Bengaluru	4-Star
India	The Park Hotels	Kolkata	4-Star
India	DoubleTree by Hilton	Ahmedabad	4-Star
India	Lemon Tree Hotel	Bengaluru	3-Star
India	Ginger Hotel	Chennai	3-Star
India	FabHotel	Jaipur	3-Star
India	Keys Prima Hotel	Pune	3-Star
India	Treebo Hotels	Mumbai	3-Star
India	Sarovar Portico	Amritsar	3-Star
Sri Lanka	Shangri-La Colombo	Colombo	5-Star
Sri Lanka	Galle Face Hotel	Colombo	5-Star
Sri Lanka	Amanwella	Tangalle	5-Star
Sri Lanka	Cinnamon Grand	Colombo	4-Star
Sri Lanka	Jetwing Blue	Negombo	4-Star
Sri Lanka	Ibis Colombo City	Colombo	3-Star
Sri Lanka	Hotel Ceysands	Negombo	3-Star
Nepal	Dwarika's Hotel	Kathmandu	5-Star
Nepal	Hyatt Regency Kathmandu	Kathmandu	5-Star
Nepal	Radisson Hotel Kathmandu	Kathmandu	4-Star
Nepal	Hotel Shanker	Kathmandu	3-Star
Maldives	Soneva Fushi	Baa Atoll	5-Star
Maldives	One&Only Reethi Rah	North Male Atoll	5-Star
Maldives	Cheval Blanc Randheli	Noonu Atoll	5-Star
Maldives	Centara Grand Island Resort	Maldives	4-Star
Maldives	Bandos Maldives	North Male Atoll	4-Star
Pakistan	Pearl Continental Hotel	Karachi	5-Star
Pakistan	Serena Hotel	Islamabad	5-Star
Pakistan	Marriott Islamabad	Islamabad	4-Star
Pakistan	Avari Towers	Karachi	4-Star
Pakistan	Holiday Inn Karachi	Karachi	3-Star
Bangladesh	Radisson Blu Dhaka	Dhaka	5-Star
Bangladesh	InterContinental Dhaka	Dhaka	5-Star
Bangladesh	Pan Pacific Sonargaon	Dhaka	4-Star
Bangladesh	Amari Dhaka	Dhaka	3-Star
China	The Peninsula	Beijing	5-Star
China	Mandarin Oriental	Shanghai	5-Star
China	Park Hyatt	Shanghai	5-Star
China	The Ritz-Carlton	Guangzhou	5-Star
China	Four Seasons Hotel	Hangzhou	5-Star
China	Aman Summer Palace	Beijing	5-Star
China	The Peninsula Shanghai	Shanghai	5-Star
China	St. Regis Beijing	Beijing	5-Star
China	W Hotel Guangzhou	Guangzhou	5-Star
China	Kerry Hotel Pudong	Shanghai	5-Star
China	Hilton	Beijing	4-Star
China	Sheraton	Shanghai	4-Star
China	Marriott	Chengdu	4-Star
China	Swissotel Beijing	Beijing	4-Star
China	Doubletree by Hilton Xiamen	Xiamen	4-Star
China	Holiday Inn Express	Beijing	3-Star
China	Ibis	Shanghai	3-Star
China	Home Inn	Guangzhou	3-Star
China	Hanting Hotel	Shenzhen	3-Star
Japan	The Peninsula Tokyo	Tokyo	5-Star
Japan	Aman Tokyo	Tokyo	5-Star
Japan	Park Hyatt Tokyo	Tokyo	5-Star
Japan	The Ritz-Carlton Kyoto	Kyoto	5-Star
Japan	Four Seasons Osaka	Osaka	5-Star
Japan	Mandarin Oriental Tokyo	Tokyo	5-Star
Japan	The Capitol Hotel Tokyu	Tokyo	5-Star
Japan	Hotel The Mitsui Kyoto	Kyoto	5-Star
Japan	Hyatt Regency Kyoto	Kyoto	5-Star
Japan	ANA InterContinental	Tokyo	4-Star
Japan	Hilton Osaka	Osaka	4-Star
Japan	Marriott Kyoto	Kyoto	4-Star
Japan	Keio Plaza Hotel	Tokyo	4-Star
Japan	Hotel Granvia Kyoto	Kyoto	4-Star
Japan	Dormy Inn	Tokyo	3-Star
Japan	Sotetsu Fresa Inn	Tokyo	3-Star
Japan	Vessel Hotel	Osaka	3-Star
Japan	Toyoko Inn	Tokyo	3-Star
South Korea	The Shilla Seoul	Seoul	5-Star
South Korea	Lotte Hotel Seoul	Seoul	5-Star
South Korea	Four Seasons Seoul	Seoul	5-Star
South Korea	Grand Hyatt Seoul	Seoul	5-Star
South Korea	Park Hyatt Busan	Busan	5-Star
South Korea	InterContinental Seoul COEX	Seoul	4-Star
South Korea	Novotel Ambassador Busan	Busan	4-Star
South Korea	ibis Ambassador Seoul	Seoul	3-Star
South Korea	Tmark Hotel Myeongdong	Seoul	3-Star
Hong Kong	The Peninsula Hong Kong	Kowloon	5-Star
Hong Kong	Mandarin Oriental	Hong Kong	5-Star
Hong Kong	Four Seasons Hong Kong	Hong Kong	5-Star
Hong Kong	The Ritz-Carlton Hong Kong	Hong Kong	5-Star
Hong Kong	Hyatt Regency Tsim Sha Tsui	Kowloon	4-Star
Hong Kong	Holiday Inn Golden Mile	Hong Kong	4-Star
Hong Kong	Ibis Hong Kong Central	Hong Kong	3-Star
Hong Kong	iclub Sheung Wan Hotel	Hong Kong	3-Star
Taiwan	Grand Hyatt Taipei	Taipei	5-Star
Taiwan	Mandarin Oriental Taipei	Taipei	5-Star
Taiwan	Sheraton Grand Taipei	Taipei	4-Star
Taiwan	Marriott Taipei	Taipei	4-Star
Taiwan	Ibis Taipei Zhongzheng	Taipei	3-Star
Singapore	Marina Bay Sands	Singapore	5-Star
Singapore	Raffles Hotel	Singapore	5-Star
Singapore	The Fullerton Hotel	Singapore	5-Star
Singapore	Capella Singapore	Sentosa	5-Star
Singapore	Shangri-La Singapore	Singapore	5-Star
Singapore	Four Seasons Singapore	Singapore	5-Star
Singapore	Holiday Inn Atrium	Singapore	4-Star
Singapore	Park Royal on Pickering	Singapore	4-Star
Singapore	Orchard Hotel Singapore	Singapore	4-Star
Singapore	Hotel G Singapore	Singapore	3-Star
Singapore	Ibis Singapore	Singapore	3-Star
Singapore	Hotel 81 Furama	Singapore	3-Star
Malaysia	Petronas Mandarin Oriental	Kuala Lumpur	5-Star
Malaysia	The Ritz-Carlton KL	Kuala Lumpur	5-Star
Malaysia	Four Seasons Kuala Lumpur	Kuala Lumpur	5-Star
Malaysia	Shangri-La Tanjung Aru	Kota Kinabalu	5-Star
Malaysia	Hilton Kuala Lumpur	Kuala Lumpur	4-Star
Malaysia	Doubletree by Hilton KL	Kuala Lumpur	4-Star
Malaysia	Parkroyal Penang Resort	Penang	4-Star
Malaysia	Hotel Sentral	Kuala Lumpur	3-Star
Indonesia	Four Seasons Bali at Sayan	Bali	5-Star
Indonesia	Amankila	Bali	5-Star
Indonesia	The Mulia Bali	Nusa Dua	5-Star
Indonesia	Mandarin Oriental Jakarta	Jakarta	5-Star
Indonesia	The Ritz-Carlton Jakarta	Jakarta	5-Star
Indonesia	Amanjiwo	Yogyakarta	5-Star
Indonesia	Grand Mercure Bali	Bali	4-Star
Indonesia	Sheraton Bandung	Bandung	4-Star
Indonesia	Marriott Jakarta	Jakarta	4-Star
Indonesia	Ibis Bali Seminyak	Bali	3-Star
Indonesia	Favehotel Gatot Subroto	Jakarta	3-Star
Thailand	Mandarin Oriental	Bangkok	5-Star
Thailand	The Peninsula Bangkok	Bangkok	5-Star
Thailand	Amanpuri	Phuket	5-Star
Thailand	Four Seasons Chiang Mai	Chiang Mai	5-Star
Thailand	Anantara Riverside Bangkok	Bangkok	5-Star
Thailand	Capella Bangkok	Bangkok	5-Star
Thailand	Centara Grand	Bangkok	4-Star
Thailand	Amari Phuket	Phuket	4-Star
Thailand	Pullman Bangkok King Power	Bangkok	4-Star
Thailand	Ibis Bangkok Riverside	Bangkok	3-Star
Thailand	Sleep With Me Hotel	Bangkok	3-Star
Thailand	Novotel Hua Hin	Hua Hin	3-Star
Vietnam	Park Hyatt Saigon	Ho Chi Minh City	5-Star
Vietnam	Sofitel Legend Metropole	Hanoi	5-Star
Vietnam	InterContinental Danang	Da Nang	5-Star
Vietnam	Six Senses Ninh Van Bay	Nha Trang	5-Star
Vietnam	Sheraton Hanoi	Hanoi	4-Star
Vietnam	Novotel Ho Chi Minh City	Ho Chi Minh City	4-Star
Vietnam	Ibis Saigon Airport	Ho Chi Minh City	3-Star
Vietnam	Hanoi La Siesta Hotel	Hanoi	3-Star
Philippines	Raffles Makati	Manila	5-Star
Philippines	Shangri-La BGC	Taguig	5-Star
Philippines	Four Seasons Manila	Manila	5-Star
Philippines	Hilton Manila	Manila	4-Star
Philippines	Marriott Manila	Manila	4-Star
Philippines	Ibis Manila Ermita	Manila	3-Star
Philippines	Go Hotels Manila	Manila	3-Star
Cambodia	Amansara	Siem Reap	5-Star
Cambodia	Raffles Hotel le Royal	Phnom Penh	5-Star
Cambodia	Sofitel Phnom Penh	Phnom Penh	4-Star
Cambodia	Ibis Phnom Penh	Phnom Penh	3-Star
Myanmar	The Strand Rangoon	Yangon	5-Star
Myanmar	Aman at Summer Palace	Mandalay	5-Star
Myanmar	Novotel Yangon Max	Yangon	4-Star
Myanmar	Ibis Yangon Centre	Yangon	3-Star
Uae (Dubai & Abu Dhabi)	Burj Al Arab	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	Atlantis The Palm	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	Jumeirah Beach Hotel	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	Emirates Palace	Abu Dhabi	5-Star
Uae (Dubai & Abu Dhabi)	Four Seasons DIFC	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	The Ritz-Carlton Dubai	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	Waldorf Astoria Dubai	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	One&Only The Palm Dubai	Dubai	5-Star
Uae (Dubai & Abu Dhabi)	St. Regis Abu Dhabi	Abu Dhabi	5-Star
Uae (Dubai & Abu Dhabi)	Yas Island Rotana	Abu Dhabi	5-Star
Uae (Dubai & Abu Dhabi)	Crowne Plaza Dubai	Dubai	4-Star
Uae (Dubai & Abu Dhabi)	Radisson Blu	Abu Dhabi	4-Star
Uae (Dubai & Abu Dhabi)	Movenpick	Dubai	4-Star
Uae (Dubai & Abu Dhabi)	Hilton Abu Dhabi	Abu Dhabi	4-Star
Uae (Dubai & Abu Dhabi)	Premier Inn	Dubai	3-Star
Uae (Dubai & Abu Dhabi)	Ibis Al Barsha	Dubai	3-Star
Uae (Dubai & Abu Dhabi)	City Max Hotel	Dubai	3-Star
Uae (Dubai & Abu Dhabi)	ibis Abu Dhabi Gate	Abu Dhabi	3-Star
Saudi Arabia	Four Seasons Riyadh	Riyadh	5-Star
Saudi Arabia	The Ritz-Carlton Riyadh	Riyadh	5-Star
Saudi Arabia	Park Hyatt Jeddah	Jeddah	5-Star
Saudi Arabia	Fairmont Makkah Clock Tower	Mecca	5-Star
Saudi Arabia	Waldorf Astoria Jeddah	Jeddah	5-Star
Saudi Arabia	Hilton Makkah Convention	Mecca	4-Star
Saudi Arabia	Pullman Zamzam Madina	Medina	4-Star
Saudi Arabia	Crowne Plaza Riyadh	Riyadh	4-Star
Saudi Arabia	ibis Riyadh Olaya	Riyadh	3-Star
Saudi Arabia	Al Hamra Hilton Jeddah	Jeddah	3-Star
Qatar	Mandarin Oriental Doha	Doha	5-Star
Qatar	Four Seasons Hotel Doha	Doha	5-Star
Qatar	St. Regis Doha	Doha	5-Star
Qatar	W Doha Hotel	Doha	5-Star
Qatar	Radisson Blu Doha	Doha	4-Star
Qatar	Hilton Doha	Doha	4-Star
Qatar	Ibis Doha	Doha	3-Star
Kuwait	The Regency Hotel	Kuwait City	5-Star
Kuwait	Four Seasons Kuwait	Kuwait City	5-Star
Kuwait	Crowne Plaza Kuwait	Kuwait City	4-Star
Kuwait	Ibis Kuwait Salmiya	Kuwait City	3-Star
Bahrain	The Ritz-Carlton Bahrain	Manama	5-Star
Bahrain	Four Seasons Bahrain Bay	Manama	5-Star
Bahrain	Crowne Plaza Bahrain	Manama	4-Star
Bahrain	Ibis Seef Manama	Manama	3-Star
Oman	Alila Jabal Akhdar	Al Hajar Mts	5-Star
Oman	The Chedi Muscat	Muscat	5-Star
Oman	Four Seasons Muscat	Muscat	5-Star
Oman	Radisson Blu Muscat	Muscat	4-Star
Oman	Crowne Plaza Muscat	Muscat	4-Star
Oman	ibis Muscat	Muscat	3-Star
Jordan	Kempinski Hotel Aqaba	Aqaba	5-Star
Jordan	Six Senses Shaharut	Wadi Rum	5-Star
Jordan	Marriott Amman	Amman	4-Star
Jordan	Grand Hyatt Amman	Amman	4-Star
Jordan	ibis Amman	Amman	3-Star
Israel	The Norman Tel Aviv	Tel Aviv	5-Star
Israel	King David Hotel	Jerusalem	5-Star
Israel	Hilton Tel Aviv	Tel Aviv	4-Star
Israel	Leonardo Royal Jerusalem	Jerusalem	4-Star
Israel	ibis Tel Aviv	Tel Aviv	3-Star
Turkey	Ciragan Palace Kempinski	Istanbul	5-Star
Turkey	Four Seasons Bosphorus	Istanbul	5-Star
Turkey	Mandarin Oriental Bodrum	Bodrum	5-Star
Turkey	The St. Regis Istanbul	Istanbul	5-Star
Turkey	Hilton Istanbul Bosphorus	Istanbul	4-Star
Turkey	Radisson Blu Hotel Istanbul	Istanbul	4-Star
Turkey	Marriott Ankara	Ankara	4-Star
Turkey	Ibis Istanbul Zeytinburnu	Istanbul	3-Star
Turkey	Holiday Inn Istanbul	Istanbul	3-Star
United Kingdom	The Savoy	London	5-Star
United Kingdom	Claridge's	London	5-Star
United Kingdom	The Ritz London	London	5-Star
United Kingdom	Mandarin Oriental Hyde Park	London	5-Star
United Kingdom	The Connaught	London	5-Star
United Kingdom	The Langham London	London	5-Star
United Kingdom	Hotel Cafe Royal	London	5-Star
United Kingdom	Radisson Blu Edwardian	London	4-Star
United Kingdom	Hilton London Metropole	London	4-Star
United Kingdom	Hotel Indigo Edinburgh	Edinburgh	4-Star
United Kingdom	Crowne Plaza Manchester	Manchester	4-Star
United Kingdom	Marriott Glasgow	Glasgow	4-Star
United Kingdom	DoubleTree Leeds City Centre	Leeds	4-Star
United Kingdom	Premier Inn London City	London	3-Star
United Kingdom	Travelodge London	London	3-Star
United Kingdom	Holiday Inn Express	Birmingham	3-Star
United Kingdom	ibis Edinburgh Centre	Edinburgh	3-Star
France	Hotel Ritz Paris	Paris	5-Star
France	Four Seasons George V	Paris	5-Star
France	Le Bristol Paris	Paris	5-Star
France	Hotel de Crillon	Paris	5-Star
France	InterContinental Carlton	Cannes	5-Star
France	Hotel Martinez	Cannes	5-Star
France	Le Royal Monceau	Paris	5-Star
France	Mercure Paris Opera	Paris	4-Star
France	Novotel Paris Centre	Paris	4-Star
France	Pullman Paris Montparnasse	Paris	4-Star
France	Sofitel Lyon Bellecour	Lyon	4-Star
France	Grand Hotel Bordeaux	Bordeaux	4-Star
France	Ibis Paris Gare du Nord	Paris	3-Star
France	Hotel du Continent	Paris	3-Star
France	Campanile Lyon Centre	Lyon	3-Star
France	Kyriad Bordeaux Centre	Bordeaux	3-Star
Germany	Hotel Adlon Kempinski	Berlin	5-Star
Germany	Bayerischer Hof	Munich	5-Star
Germany	Fairmont Hotel Vier Jahresz.	Hamburg	5-Star
Germany	Schlosshotel im Grunewald	Berlin	5-Star
Germany	Hotel Elephant Weimar	Weimar	5-Star
Germany	Radisson Blu Berlin	Berlin	4-Star
Germany	Hilton Frankfurt City Centre	Frankfurt	4-Star
Germany	Maritim Hotel	Munich	4-Star
Germany	Steigenberger Hotel	Düsseldorf	4-Star
Germany	Sofitel Hamburg	Hamburg	4-Star
Germany	Ibis Berlin Mitte	Berlin	3-Star
Germany	Holiday Inn Express Munich	Munich	3-Star
Germany	B&B Hotel Hamburg	Hamburg	3-Star
Germany	Motel One Frankfurt	Frankfurt	3-Star
Italy	Hotel Danieli	Venice	5-Star
Italy	Four Seasons Florence	Florence	5-Star
Italy	The St. Regis Rome	Rome	5-Star
Italy	Bulgari Hotel Milano	Milan	5-Star
Italy	Grand Hotel Tremezzo	Lake Como	5-Star
Italy	Villa d'Este	Cernobbio	5-Star
Italy	Hassler Roma	Rome	5-Star
Italy	Boscolo Roma	Rome	4-Star
Italy	NH Collection Milano	Milan	4-Star
Italy	Starhotels Michelangelo	Florence	4-Star
Italy	Jolly Hotel	Turin	4-Star
Italy	Sina Bernini Bristol	Rome	4-Star
Italy	Hotel Universo	Rome	3-Star
Italy	Ibis Milano Ca Granda	Milan	3-Star
Italy	Hotel Olimpia	Venice	3-Star
Italy	Hotel Galileo	Florence	3-Star
Spain	Hotel Arts Barcelona	Barcelona	5-Star
Spain	Villa Magna Madrid	Madrid	5-Star
Spain	Melia Sevilla	Seville	5-Star
Spain	La Reserva Rotana	Mallorca	5-Star
Spain	Hotel Alfonso XIII	Seville	5-Star
Spain	NH Gran Hotel Calderon	Barcelona	4-Star
Spain	Silken Puerta America	Madrid	4-Star
Spain	AC Hotel Malaga Palacio	Malaga	4-Star
Spain	Marriott Barcelona	Barcelona	4-Star
Spain	Meliá Valencia	Valencia	4-Star
Spain	Ibis Barcelona Centro	Barcelona	3-Star
Spain	Holiday Inn Express Madrid	Madrid	3-Star
Spain	Hotel Exe Sevilla Macarena	Seville	3-Star
Spain	ibis Valencia Feria	Valencia	3-Star
Portugal	Bairro Alto Hotel	Lisbon	5-Star
Portugal	The Yeatman	Porto	5-Star
Portugal	Bela Vista Hotel & Spa	Portimao	5-Star
Portugal	Tivoli Avenida Liberdade	Lisbon	4-Star
Portugal	Sheraton Porto Hotel	Porto	4-Star
Portugal	Ibis Lisbon Centro	Lisbon	3-Star
Portugal	Holiday Inn Express Porto	Porto	3-Star
Netherlands	Waldorf Astoria Amsterdam	Amsterdam	5-Star
Netherlands	Hotel de l'Europe Amsterdam	Amsterdam	5-Star
Netherlands	Hilton Amsterdam	Amsterdam	4-Star
Netherlands	Marriott Amsterdam	Amsterdam	4-Star
Netherlands	ibis Amsterdam Centre	Amsterdam	3-Star
Netherlands	NH Amsterdam Centre	Amsterdam	3-Star
Belgium	Hotel Amigo Brussels	Brussels	5-Star
Belgium	The Dominican Brussels	Brussels	5-Star
Belgium	Hilton Brussels Grand Place	Brussels	4-Star
Belgium	Marriott Brussels	Brussels	4-Star
Switzerland	The Dolder Grand	Zurich	5-Star
Switzerland	Badrutt's Palace Hotel	St. Moritz	5-Star
Switzerland	Hotel Beau-Rivage Palace	Lausanne	5-Star
Switzerland	Hotel Metropole	Geneva	5-Star
Switzerland	Fairmont Le Montreux Palace	Montreux	5-Star
Switzerland	Crowne Plaza Zurich	Zurich	4-Star
Switzerland	Movenpick Hotel Geneva	Geneva	4-Star
Switzerland	Radisson Blu Bern	Bern	4-Star
Switzerland	Ibis Zurich City West	Zurich	3-Star
Switzerland	Hotel Alpha	Geneva	3-Star
Austria	Hotel Sacher Wien	Vienna	5-Star
Austria	Grand Hotel Wien	Vienna	5-Star
Austria	Hotel Imperial Vienna	Vienna	5-Star
Austria	Radisson Blu Style Hotel	Vienna	4-Star
Austria	Hilton Vienna Plaza	Vienna	4-Star
Austria	ibis Wien Mariahilf	Vienna	3-Star
Austria	Holiday Inn Vienna	Vienna	3-Star
Czech Republic	Four Seasons Prague	Prague	5-Star
Czech Republic	Hotel Paris Prague	Prague	5-Star
Czech Republic	Hilton Prague	Prague	4-Star
Czech Republic	Marriott Prague	Prague	4-Star
Czech Republic	ibis Praha Wenceslas Square	Prague	3-Star
Poland	Hotel Bristol Warsaw	Warsaw	5-Star
Poland	Copernicus Hotel	Krakow	5-Star
Poland	Hilton Warsaw	Warsaw	4-Star
Poland	Radisson Blu Krakow	Krakow	4-Star
Poland	ibis Warsaw Centre	Warsaw	3-Star
Hungary	Four Seasons Gresham Palace	Budapest	5-Star
Hungary	Kempinski Hotel Corvinus	Budapest	5-Star
Hungary	Hilton Budapest	Budapest	4-Star
Hungary	ibis Budapest City	Budapest	3-Star
Greece	Hotel Grande Bretagne	Athens	5-Star
Greece	Mystique Santorini	Santorini	5-Star
Greece	Canaves Oia Epitome	Santorini	5-Star
Greece	Radisson Blu Atenas	Athens	4-Star
Greece	Hilton Athens	Athens	4-Star
Greece	ibis Athens Kallithea	Athens	3-Star
Russia	Four Seasons Moscow	Moscow	5-Star
Russia	The Ritz-Carlton Moscow	Moscow	5-Star
Russia	Lotte Hotel Moscow	Moscow	5-Star
Russia	Hilton Moscow Leningradskaya	Moscow	4-Star
Russia	Radisson Royal Hotel Moscow	Moscow	4-Star
Russia	ibis Moscow Dynamo	Moscow	3-Star
Sweden	Grand Hotel Stockholm	Stockholm	5-Star
Sweden	At Six Stockholm	Stockholm	5-Star
Sweden	Radisson Blu Waterfront	Stockholm	4-Star
Sweden	ibis Stockholm Arlanda	Stockholm	3-Star
Norway	The Thief Oslo	Oslo	5-Star
Norway	Hotel Continental Oslo	Oslo	5-Star
Norway	ibis Oslo Sentrum	Oslo	3-Star
Denmark	Hotel d'Angleterre	Copenhagen	5-Star
Denmark	Nimb Hotel	Copenhagen	5-Star
Denmark	Marriott Copenhagen	Copenhagen	4-Star
Denmark	ibis Copenhagen City Center	Copenhagen	3-Star
Finland	Hotel Kämp	Helsinki	5-Star
Finland	Klaus K Hotel	Helsinki	5-Star
Finland	Hilton Helsinki Strand	Helsinki	4-Star
Finland	ibis Helsinki	Helsinki	3-Star
Ireland	The Shelbourne Hotel	Dublin	5-Star
Ireland	Ashford Castle	Cong	5-Star
Ireland	Radisson Blu Royal Hotel	Dublin	4-Star
Ireland	ibis Dublin	Dublin	3-Star
Usa	The Plaza Hotel	New York	5-Star
Usa	Four Seasons New York	New York	5-Star
Usa	The Beverly Hills Hotel	Los Angeles	5-Star
Usa	The Ritz-Carlton Chicago	Chicago	5-Star
Usa	Fontainebleau Miami Beach	Miami	5-Star
Usa	Bellagio Hotel & Casino	Las Vegas	5-Star
Usa	Aman New York	New York	5-Star
Usa	St. Regis San Francisco	San Francisco	5-Star
Usa	Hotel del Coronado	San Diego	5-Star
Usa	The Broadmoor	Colorado Springs	5-Star
Usa	The Greenbrier	White Sulphur Springs	5-Star
Usa	Four Seasons Washington DC	Washington DC	5-Star
Usa	Wynn Las Vegas	Las Vegas	5-Star
Usa	Marriott Marquis NYC	New York	4-Star
Usa	Hilton Chicago	Chicago	4-Star
Usa	Westin Bonaventure	Los Angeles	4-Star
Usa	Loews Miami Beach	Miami	4-Star
Usa	Hyatt Regency Seattle	Seattle	4-Star
Usa	Omni Nashville Hotel	Nashville	4-Star
Usa	InterContinental Houston	Houston	4-Star
Usa	Hyatt Regency Boston	Boston	4-Star
Usa	Renaissance Dallas Hotel	Dallas	4-Star
Usa	Marriott Phoenix Resort	Phoenix	4-Star
Usa	Holiday Inn Times Square	New York	3-Star
Usa	Comfort Inn Magnificent Mile	Chicago	3-Star
Usa	Courtyard by Marriott LAX	Los Angeles	3-Star
Usa	Hampton Inn Miami	Miami	3-Star
Usa	Aloft Dallas Downtown	Dallas	3-Star
Usa	Hyatt Place Seattle	Seattle	3-Star
Canada	Fairmont Banff Springs	Banff	5-Star
Canada	The Ritz-Carlton Montreal	Montreal	5-Star
Canada	Fairmont Pacific Rim	Vancouver	5-Star
Canada	Hazelton Hotel Toronto	Toronto	5-Star
Canada	Hilton Toronto	Toronto	4-Star
Canada	Marriott Vancouver	Vancouver	4-Star
Canada	Westin Ottawa	Ottawa	4-Star
Canada	Sheraton Calgary	Calgary	4-Star
Canada	Holiday Inn Express Toronto	Toronto	3-Star
Canada	Sandman Hotel Vancouver	Vancouver	3-Star
Canada	ibis Ottawa Downtown	Ottawa	3-Star
Mexico	Four Seasons Mexico City	Mexico City	5-Star
Mexico	The St. Regis Mexico City	Mexico City	5-Star
Mexico	Grand Velas Riviera Maya	Cancun	5-Star
Mexico	Las Ventanas al Paraiso	Los Cabos	5-Star
Mexico	One&Only Palmilla	Los Cabos	5-Star
Mexico	Marriott CasaMagna Cancun	Cancun	4-Star
Mexico	Camino Real Polanco	Mexico City	4-Star
Mexico	Hilton Guadalajara Midtown	Guadalajara	4-Star
Mexico	Holiday Inn Cancun Arenas	Cancun	3-Star
Mexico	Ibis Mexico City Buenavista	Mexico City	3-Star
Caribbean	Sandy Lane Hotel	Barbados	5-Star
Caribbean	Half Moon Jamaica	Montego Bay	5-Star
Caribbean	Eden Rock	St. Barths	5-Star
Caribbean	Jumby Bay Island	Antigua	5-Star
Caribbean	Marriott St. Kitts Beach	St. Kitts	4-Star
Caribbean	Hilton Barbados Resort	Bridgetown	4-Star
Caribbean	ibis Bridgetown	Bridgetown	3-Star
Central America	Belmond Hotel Das Cataratas	Iguazu	5-Star
Central America	JW Marriott San Jose	San Jose	4-Star
Central America	Crowne Plaza Panama	Panama City	4-Star
Central America	ibis Panama	Panama City	3-Star
Brazil	Copacabana Palace	Rio de Janeiro	5-Star
Brazil	Hotel Unique	Sao Paulo	5-Star
Brazil	Fasano Rio de Janeiro	Rio de Janeiro	5-Star
Brazil	Aman Jaguar Camp	Pantanal	5-Star
Brazil	Palácio Tangará	Sao Paulo	5-Star
Brazil	Windsor Marapendi	Rio de Janeiro	4-Star
Brazil	Grand Hyatt Sao Paulo	Sao Paulo	4-Star
Brazil	Marriott Belo Horizonte	Belo Horizonte	4-Star
Brazil	Ibis Rio de Janeiro	Rio de Janeiro	3-Star
Brazil	Holiday Inn Sao Paulo	Sao Paulo	3-Star
Argentina	Four Seasons Buenos Aires	Buenos Aires	5-Star
Argentina	Alvear Palace Hotel	Buenos Aires	5-Star
Argentina	Llao Llao Hotel	Bariloche	5-Star
Argentina	Marriott Plaza Buenos Aires	Buenos Aires	4-Star
Argentina	Sheraton Mendoza	Mendoza	4-Star
Argentina	Ibis Buenos Aires Centro	Buenos Aires	3-Star
Chile	The Singular Santiago	Santiago	5-Star
Chile	W Santiago	Santiago	5-Star
Chile	explora Patagonia	Torres del Paine	5-Star
Chile	Marriott Santiago	Santiago	4-Star
Chile	ibis Santiago	Santiago	3-Star
Colombia	Casa San Agustin	Cartagena	5-Star
Colombia	Hotel El Cielo	Bogota	5-Star
Colombia	Marriott Bogota	Bogota	4-Star
Colombia	Hilton Bogota	Bogota	4-Star
Colombia	ibis Bogota Museo	Bogota	3-Star
Peru	Belmond Miraflores Park	Lima	5-Star
Peru	Inkaterra Machu Picchu	Machu Picchu	5-Star
Peru	Marriott Lima	Lima	4-Star
Peru	Hilton Lima Miraflores	Lima	4-Star
Peru	ibis Lima Miraflores	Lima	3-Star
South Africa	One&Only Cape Town	Cape Town	5-Star
South Africa	The Saxon Hotel	Johannesburg	5-Star
South Africa	Ellerman House	Cape Town	5-Star
South Africa	Singita Sabi Sand	Kruger	5-Star
South Africa	&Beyond Phinda Private Game	KwaZulu-Natal	5-Star
South Africa	Radisson Blu Cape Town	Cape Town	4-Star
South Africa	Hilton Sandton	Johannesburg	4-Star
South Africa	Marriott Crystal Towers	Cape Town	4-Star
South Africa	Protea Hotel Fire & Ice	Cape Town	3-Star
South Africa	City Lodge Johannesburg	Johannesburg	3-Star
Egypt	Marriott Mena House	Cairo (Giza)	5-Star
Egypt	Oberoi Sahl Hasheesh	Hurghada	5-Star
Egypt	Kempinski Soma Bay	Hurghada	5-Star
Egypt	Hilton Luxor Resort	Luxor	4-Star
Egypt	Movenpick Resort Aswan	Aswan	4-Star
Egypt	Ibis Cairo Citystars	Cairo	3-Star
Egypt	Sonesta Hotel Cairo	Cairo	3-Star
Kenya	Giraffe Manor	Nairobi	5-Star
Kenya	Fairmont The Norfolk	Nairobi	5-Star
Kenya	Angama Mara	Masai Mara	5-Star
Kenya	&Beyond Kichwa Tembo	Masai Mara	5-Star
Kenya	Radisson Blu Nairobi	Nairobi	4-Star
Kenya	Hilton Nairobi	Nairobi	4-Star
Kenya	Holiday Inn Nairobi	Nairobi	3-Star
Tanzania	Singita Grumeti	Serengeti	5-Star
Tanzania	andBeyond Ngorongoro Crater	Ngorongoro	5-Star
Tanzania	Serena Hotel Dar es Salaam	Dar es Salaam	4-Star
Tanzania	ibis Dar es Salaam	Dar es Salaam	3-Star
Nigeria	Eko Hotel & Suites	Lagos	5-Star
Nigeria	Marriott Lagos	Lagos	4-Star
Nigeria	Hilton Abuja	Abuja	4-Star
Nigeria	ibis Lagos Airport	Lagos	3-Star
Ghana	Kempinski Hotel Gold Coast	Accra	5-Star
Ghana	Marriott Accra	Accra	4-Star
Ghana	ibis Accra Airport	Accra	3-Star
Ethiopia	Sheraton Addis	Addis Ababa	5-Star
Ethiopia	Hilton Addis Ababa	Addis Ababa	4-Star
Ethiopia	ibis Addis Ababa	Addis Ababa	3-Star
Morocco	La Mamounia	Marrakech	5-Star
Morocco	Royal Mansour Marrakech	Marrakech	5-Star
Morocco	Palais Faraj Suites & Spa	Fez	5-Star
Morocco	Marriott Casablanca	Casablanca	4-Star
Morocco	Radisson Blu Marrakech	Marrakech	4-Star
Morocco	ibis Casablanca City Center	Casablanca	3-Star
Mauritius	One&Only Le Saint Geran	Mauritius	5-Star
Mauritius	Constance Belle Mare Plage	Mauritius	5-Star
Mauritius	Radisson Blu Azuri Resort	Mauritius	4-Star
Mauritius	Veranda Grand Baie	Mauritius	3-Star
Australia	Park Hyatt Sydney	Sydney	5-Star
Australia	Langham Hotel Melbourne	Melbourne	5-Star
Australia	Four Seasons Sydney	Sydney	5-Star
Australia	qualia Resort	Hamilton Island	5-Star
Australia	Southern Ocean Lodge	Kangaroo Island	5-Star
Australia	Hilton Sydney	Sydney	4-Star
Australia	Marriott Melbourne	Melbourne	4-Star
Australia	Crowne Plaza Brisbane	Brisbane	4-Star
Australia	InterContinental Perth	Perth	4-Star
Australia	Doubletree Adelaide	Adelaide	4-Star
Australia	Ibis Sydney	Sydney	3-Star
Australia	Holiday Inn Melbourne	Melbourne	3-Star
Australia	ibis Brisbane	Brisbane	3-Star
New Zealand	The Rees Hotel	Queenstown	5-Star
New Zealand	Sofitel Auckland	Auckland	5-Star
New Zealand	Blanket Bay Lodge	Glenorchy	5-Star
New Zealand	Grand Millennium Auckland	Auckland	4-Star
New Zealand	Crowne Plaza Wellington	Wellington	4-Star
New Zealand	Ibis Auckland Ellerslie	Auckland	3-Star
Fiji	Laucala Island Resort	Cakaudrove	5-Star
Fiji	Kokomo Private Island Resort	Kadavu	5-Star
Fiji	Sheraton Fiji Resort	Nadi	4-Star
Fiji	Novotel Lami Bay Suva	Suva	3-Star
Kazakhstan	The Ritz-Carlton Almaty	Almaty	5-Star"""

lines = data.split('\n')
header = lines[0].split('\t')

created_count = 0
updated_count = 0

for line in lines[1:]:
    if not line.strip():
        continue
    parts = line.split('\t')
    if len(parts) < 4:
        continue
    
    country_name = parts[0].strip()
    hotel_name = parts[1].strip()
    city_name = parts[2].strip()
    star_rating = parts[3].strip().replace('-', ' ') # Map "5-Star" to "5 Star"
    
    # Optional: Get city link for the accommodation if city exists in DB
    country_obj = Country.objects.filter(name__iexact=country_name).first()
    city_obj = None
    if country_obj:
        city_obj = City.objects.filter(name__iexact=city_name, country=country_obj).first()

    # Create or Update
    acc, created = Accommodation.objects.update_or_create(
        name=hotel_name,
        city=city_name,
        defaults={
            'star_category': star_rating,
            'city_link': city_obj,
            'country_code': country_name[:3].upper() # Fallback country code
        }
    )
    
    if created:
        created_count += 1
    else:
        updated_count += 1

print(f"Ingestion Complete: {created_count} created, {updated_count} updated.")
