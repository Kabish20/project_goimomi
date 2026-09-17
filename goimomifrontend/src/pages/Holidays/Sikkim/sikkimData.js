export const trip = {
  name: 'North East — Assam & Meghalaya',
  startDate: '2026-11-08',
  dates: '6 nights / 7 days',
  nights: 6,
  adults: 4,
  rooms: 2,
  vehicle: '1 Innova Crysta',
};

export const stops = [
  { city: 'Guwahati', nights: 1, dates: '1 night', label: 'Night 1' },
  { city: 'Kaziranga', nights: 1, dates: '1 night', label: 'Night 2' },
  { city: 'Shillong', nights: 2, dates: '2 nights', label: 'Nights 3–4' },
  { city: 'Cherrapunji', nights: 2, dates: '2 nights', label: 'Nights 5–6' },
];

// Supplier prices are already per adult on double sharing, for four adults in two rooms.
export const packages = [
  {
    name: 'Deluxe Package', pricePerAdult: 40000,
    hotels: [
      { name: 'Heaven Garden Empire', category: 'Deluxe', room: 'Deluxe Room' },
      { name: 'Hongthor Resort', category: 'Super Dlx', room: 'Deluxe Room' },
      { name: 'The Ri Shat Sngi Orchid Resort', category: 'Deluxe', room: 'Deluxe Room' },
      { name: "Pyrkyn’s Inn", category: 'Deluxe', room: 'Executive Room' },
    ],
  },
  {
    name: 'Super Deluxe Package', pricePerAdult: 51000,
    hotels: [
      { name: 'Hotel Palacio', category: 'Super Dlx', room: 'Elite' },
      { name: 'Hotel Borgos', category: 'Super Dlx', room: 'Kohora Studio Room' },
      { name: 'M Crown Hotel', category: 'Super Dlx', room: 'Executive Room' },
      { name: 'Cherrapunjee Holiday Resort', category: 'Super Deluxe', room: 'Valley View Room with AC', note: 'Vegetarian hotel' },
    ],
  },
  {
    name: 'Premium', pricePerAdult: 58725,
    hotels: [
      { name: 'Hotel Ratnamouli Palace', category: 'Premium', room: 'Premier Room' },
      { name: 'Red River Retreat', category: 'Premium', room: 'Signature Room' },
      { name: 'The Shillong Address', category: 'Super Dlx', room: 'Supreme City View Room' },
      { name: 'Cherrapunjee Holiday Resort', category: 'Super Deluxe', room: 'Superior Valley View Room with AC', note: 'Vegetarian hotel' },
    ],
  },
];

export const days = [
  {
    date: '8 November 2026', title: 'Guwahati arrival & sightseeing', overnight: 'Guwahati',
    date: 'Day 1', title: 'Guwahati arrival & sightseeing', overnight: 'Guwahati',
    description: 'Meet your vehicle at Guwahati airport or railway station and begin city sightseeing directly, without an early check-in or rest stop. Visit Kamakhya Temple, Srimanta Sankardev Kalakshetra and the Brahmaputra riverfront. Umananda Temple or the State Zoo cum Botanical Garden can be considered if time and your preferences allow. Check in to your hotel in the evening.',
    places: ['Kamakhya Temple', 'Kalakshetra', 'Brahmaputra riverfront'],
  },
  {
    date: '9 November 2026', title: 'Guwahati to Kaziranga', overnight: 'Kaziranga',
    date: 'Day 2', title: 'Guwahati to Kaziranga', overnight: 'Kaziranga',
    description: 'After breakfast, drive to Kaziranga and check in to your hotel. Settle in for an overnight stay close to the region’s wildlife landscapes.',
    places: ['Kaziranga'],
  },
  {
    date: '10 November 2026', title: 'Kaziranga safari & onward to Shillong', overnight: 'Shillong',
    date: 'Day 3', title: 'Kaziranga safari & onward to Shillong', overnight: 'Shillong',
    description: 'The supplied programme offers an optional early-morning elephant ride around 5:15–6:15 AM, subject to availability. Return for breakfast, with time for leisure or plantation visits. An optional Central Range jeep safari follows after lunch, before the onward drive to Shillong via Umiam Lake. Ward’s Lake and the Botanical Garden are time permitting.',
    places: ['Kaziranga', 'Umiam Lake', 'Shillong'],
    note: 'Safari charges are extra. Safari availability, entry fees and the timing of the onward transfer must be confirmed before booking.',
  },
  {
    date: '11 November 2026', title: 'Laitlum Canyons & Krang Suri Falls', overnight: 'Shillong',
    date: 'Day 4', title: 'Laitlum Canyons & Krang Suri Falls', overnight: 'Shillong',
    description: 'After breakfast, explore the green gorges and sweeping views of Laitlum Canyons, then continue to Krang Suri Falls. Enjoy the waterfall scenery before returning to Shillong for the night. Any water activities depend on local access and conditions.',
    places: ['Laitlum Canyons', 'Krang Suri Falls'],
  },
  {
    date: '12 November 2026', title: 'Mawlynnong & Dawki, then Cherrapunji', overnight: 'Cherrapunji',
    date: 'Day 5', title: 'Mawlynnong & Dawki, then Cherrapunji', overnight: 'Cherrapunji',
    description: 'Check out after breakfast and travel via Mawlynnong and the nearby living root bridge. Continue to Dawki and the clear waters of the Umngot River, where optional boating can be arranged at an extra charge. After sightseeing, proceed to your Cherrapunji hotel.',
    places: ['Mawlynnong', 'Living root bridge', 'Dawki & Umngot River'],
  },
  {
    date: '13 November 2026', title: 'Day 6 itinerary awaiting confirmation', overnight: 'Cherrapunji — as listed in the hotel schedule',
    date: 'Day 6', title: 'Day 6 itinerary awaiting confirmation', overnight: 'Cherrapunji — as listed in the hotel schedule',
    description: 'The sightseeing programme for this day is being revised. Your listed accommodation remains in Cherrapunji; the final route and overnight arrangements will be confirmed with your itinerary.',
    places: [], pending: true,
  },
  {
    date: '14 November 2026', title: 'Day 7 departure transfer awaiting confirmation',
    date: 'Day 7', title: 'Day 7 departure transfer awaiting confirmation',
    description: 'Departure is planned via Guwahati airport or railway station. The pickup city and transfer programme are awaiting the corrected itinerary.',
    places: [], pending: true,
  },
];

export const inclusions = [
  'Accommodation as per the selected category and itinerary',
  'All hotel taxes, as per government rates at the time of booking',
  'All surface transportation as per the itinerary',
  'Vehicle changes as required by state regulations',
  'Meals as specified in the itinerary',
  'All scheduled sightseeing and transfers as per the itinerary',
];

export const exclusions = [
  'Airfare and train tickets',
  'Vehicle use beyond the scheduled itinerary: ₹2,000 for 2 hours or ₹4,000 for 4 hours, as quoted',
  'Protected Area Permit for foreign nationals, where applicable: USD 30 per person as quoted',
  'Visa fees and processing charges',
  'Lunch during sightseeing, unless specified',
  'Inner Line Permit processing fees for Indian nationals, where applicable',
  'All applicable permit fees for designated areas',
  'Monument and park entrance fees, camera charges and safari charges',
  'Optional activities, including boating, rafting, cable cars and cultural shows',
  'Room heaters: ₹250–500 per night, as quoted',
  'Early check-in and late check-out fees',
  'Room upgrades, minibar and laundry',
  'Shopping, tips and porter charges',
  'Telephone, internet and medical expenses',
  'Travel insurance and personal medications',
  'Extra vehicles for personal use',
  'Professional guides beyond any complimentary trip leader specified by the operator',
  'Expenses arising from flight or train delays',
  'Costs due to landslides, roadblocks and route changes',
  'Costs arising from natural calamities, strikes or political unrest',
  'Additional accommodation due to unexpected delays',
  'Fuel surcharge, if implemented',
  'Warm clothing, rain gear, power banks and batteries',
  'All beverages, bottled water and room service',
  'Meals during travel days, except hotel meals confirmed in the final meal plan',
];

export const information = [
  'The trip covers Assam and Meghalaya: Guwahati, Kaziranga, Shillong and Cherrapunji.',
  'Prices are per adult on twin sharing, based on 4 adults sharing 2 rooms. The departure is 8 November 2026, with hotel checkout on 14 November.',
  'Prices are per adult on twin sharing, based on 4 adults sharing 2 rooms for a 6 nights / 7 days itinerary.',
  'All listed hotel stays specify dinner and breakfast. The supplied exclusions also exclude travel-day meals; exact meal service on transfer days needs confirmation.',
  'Hotel names, categories and room types follow the supplied quotation. Availability and final arrangements are confirmed when booking.',
  'Super Deluxe and Premium options use a vegetarian hotel in Cherrapunji.',
  'One Innova Crysta is specified for the scheduled transfers and sightseeing. Vehicle changes may be required by state regulations.',
  'The Day 6 sightseeing route and Day 7 departure pickup city are awaiting the corrected itinerary. These arrangements must be confirmed before booking.',
  'Anything not specifically mentioned in the inclusions is excluded. Optional activities and quoted supplementary charges require confirmation.',
];

export const rupees = amount => `₹${amount.toLocaleString('en-IN')}`;
export const totalFor = option => option.pricePerAdult * trip.adults;
