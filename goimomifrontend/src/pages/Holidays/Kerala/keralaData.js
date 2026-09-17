export const rupees = value => `₹${value.toLocaleString('en-IN')}`;
export const packages = [
  {
    id: 'green-triangle', name: 'The Green Triangle', subtitle: 'The Essence of Kerala',
    nights: 4, duration: '4 nights / 5 days', gateway: 'Cochin',
    route: 'Cochin → Munnar → Thekkady → Alleppey → Cochin',
    description: 'Tea country, spice-scented hills and quiet backwaters. Discover three distinct sides of Kerala in one unhurried journey.',
    start: '2026-10-01', end: '2027-03-31', validity: '01 October 2026 – 31 March 2027', categories: ['3★', '4★', '5★'],
    rates: [
      { pax: 2, vehicle: 'Sedan', prices: [17200, 19100, 23800] },
      { pax: 4, vehicle: 'Innova', prices: [13800, 15700, 20500] },
      { pax: 6, vehicle: 'Traveller', prices: [14300, 16200, 21000] },
      { pax: 8, vehicle: 'Traveller', prices: [13200, 15100, 19800] },
    ],
    hotels: [
      { destination: 'Munnar · 2 nights', options: ['Arbour Resort or similar', 'Southern Panorama or similar', 'Leaf Resort or similar'] },
      { destination: 'Thekkady · 1 night', options: ['Tiger Trail or similar', 'Spice Grove or similar', 'Serene Horizen or similar'] },
      { destination: 'Alleppey · 1 night', options: ['Venice Iva Residency or similar', 'Paloma or similar', 'Ramada by Wyndham or similar'] },
    ],
    extras: [
      ['Extra bed adult', 7000, 8250, 10300], ['Child with bed', 5000, 5800, 7800],
      ['Child without bed', 3800, 4100, 5300], ['Dinner supplement · per person', 2800, 3300, 4200],
    ],
    days: [
      ['Cochin arrival → Munnar', 'Arrive at Cochin Airport or Railway Station and transfer to Munnar. View Cheeyappara and Valara Waterfalls en route, then check in and enjoy the rest of the day at leisure.', 'Munnar'],
      ['Munnar, a little closer', 'Explore Mattupetty Dam, Kundala Lake and Echo Point. Visit Rajamalai, where you may see the Nilgiri Tahr, subject to opening and availability.', 'Munnar'],
      ['Munnar → Thekkady', 'After breakfast, drive through mountain landscapes and spice plantation areas to Thekkady. Check in and enjoy sightseeing. An optional Periyar Lake boat safari is extra payable; advance online booking is advised.', 'Thekkady'],
      ['Thekkady → Alleppey', 'After breakfast, travel to Alleppey and check in to your hotel. Optional boating on Vembanad Lake is payable directly. Visit Alappuzha Beach in the evening for sunset.', 'Alleppey'],
      ['Alleppey → Cochin departure', 'Check out and transfer to Cochin Airport or Railway Station for your onward journey.', 'Departure'],
    ],
    notes: [
      'The itinerary is presented as 4 nights / 5 days, with departure on Day 5. The supplier’s departure heading says Day 06; final scheduling will be reconfirmed before booking.',
      'The 4-person rate specifies an Innova. The general transport inclusions also mention an Ertiga; the exact vehicle will be confirmed in your quotation.',
      'Alleppey accommodation is a hotel stay. Houseboat stays, Periyar boat safaris and Vembanad Lake boating are not included.',
    ],
  },
  {
    id: 'kannur', name: 'North Kerala – Kannur', subtitle: 'Rituals, shores & living traditions',
    nights: 2, duration: '2 nights / 3 days', gateway: 'Kannur', route: 'Kannur arrival → local temples & beaches → Kannur departure',
    description: 'Discover the coast through its beaches, handloom traditions and Theyyam rituals, with visits arranged around the local performance calendar.',
    start: '2026-08-01', end: '2027-03-31', validity: '01 August 2026 – 31 March 2027', categories: ['3★', '4★'],
    rates: [
      { pax: 2, vehicle: 'Sedan', prices: [13800, 14500] },
      { pax: 4, vehicle: 'Ertiga', prices: [10500, 10800] },
      { pax: 6, vehicle: 'Crysta', prices: [9700, 10100] },
    ],
    hotels: [{ destination: 'Kannur · 2 nights', options: ['Malabar Residency or similar', 'Benale International or similar'] }],
    extras: [['Extra bed adult', 4600, 4700], ['Child with bed', 3300, 3400], ['Child without bed', 2700, 2750]],
    days: [
      ['Welcome to Kannur', 'Arrive at Kannur Airport or Railway Station and transfer to your hotel. Visit St. Angelo Fort, Payyambalam Beach and Muzhappilangad Drive-in Beach. In the evening, visit Parassinikadavu Sree Muthappan Temple for the Muthappan ritual / Theyyam, subject to the day’s performance schedule.', 'Kannur'],
      ['Theyyam & the stories of the coast', 'After an early breakfast, visit a local Kavu or temple where Theyyam is scheduled. The temple and timing depend on the live calendar for your travel date. Later visits may include Aralam or local cultural attractions, Kannur Handloom Centre and the market, depending on timing. An optional second evening performance may be attended if available.', 'Kannur'],
      ['A final temple visit & departure', 'After breakfast, check out. Attend a morning Theyyam performance if available, then visit Parassinikadavu Muthappan Temple or another nearby temple / Kavu before your transfer to Kannur Airport or Railway Station.', 'Departure'],
    ],
    notes: [
      'Theyyam performances are subject to the live temple calendar and timing. Specific venues and performances cannot be guaranteed in advance.',
      'Hotel categories follow the supplier’s facility-based classification, rather than government categorisation. Standard check-in is 2:00 PM and check-out is 10:30 AM.',
      'Innova and Crysta are different vehicles; requesting a Crysta outside the listed rate may change the quotation.',
    ],
  },
];
export const lowestPrice = option => Math.min(...option.rates.flatMap(rate => rate.prices));
export const inclusions = ['Accommodation in listed hotels or similar, in base-category rooms', 'Breakfast at all hotels · CPAI meal plan', 'AC transport according to the selected group and vehicle rate', 'Driver bata, night halt, parking and tolls', 'Standard vehicle and driver service: 8:00 AM – 7:00 PM'];
export const exclusions = ['Flight and rail tickets; arrival, departure and hotel assistance', 'Lunch, beverages and extra meals unless specifically included', 'Sightseeing / monument entry, camera and activity charges', 'Personal expenses, guides and tour escorts', 'Boat and joy rides, plantation visits and trekking', 'Early check-in, late check-out and anything not listed as included'];
