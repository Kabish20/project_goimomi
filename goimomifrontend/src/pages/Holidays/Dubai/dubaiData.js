export const trip = {
  name: '3★ Dubai Holiday Package', destination: 'Dubai, UAE',
  duration: '4 nights / 5 days', nights: 4, adults: 2, pricePerAdult: 25330,
  hotel: 'Citymax Bur Dubai', room: 'Twin sharing', mealPlan: 'BB – Breakfast Basis',
  validity: '15 October 2026 – 30 January 2027',
  validFrom: '2026-10-15', validUntil: '2027-01-30',
  image: '/images/dubai/dubai-creek-sunset.png',
  imageAlt: 'Dubai-inspired skyline and illuminated wooden dhow on the water at sunset',
};

export const rupees = value => `₹${value.toLocaleString('en-IN')}`;
export const seo = {
  title: `Dubai Holiday Package | 4 Nights / 5 Days from ${rupees(trip.pricePerAdult)} | Goimomi`,
  description: 'Stay at 3-star Citymax Bur Dubai with breakfast, a half-day city tour, deluxe desert safari, Dubai Creek dinner cruise and private airport transfers. Valid 15 October 2026 – 30 January 2027.',
  keywords: 'Dubai holiday package, Citymax Bur Dubai, Dubai Creek cruise, desert safari, 4 nights 5 days, twin sharing',
};

export const days = [
  {
    title: 'Arrival in Dubai', timing: 'Arrival day',
    description: 'Arrive at Dubai International Airport. Meet and greet upon arrival and proceed to your hotel by private airport transfer. Check in at Citymax Bur Dubai and spend the rest of the day at leisure.',
    highlights: ['Airport meet & greet', 'Private airport transfer', 'Citymax Bur Dubai check-in', 'Rest of the day at leisure'],
    note: 'Overnight stay in Dubai.',
  },
  {
    title: 'Dubai City Tour & Creek Cruise', timing: 'Half-day tour & evening cruise',
    description: 'After breakfast, proceed for a Half-Day Dubai City Tour on SIC basis, covering the major highlights of Dubai. Later in the evening, enjoy a relaxing Dubai Creek Cruise with Dinner while taking in the illuminated city views.',
    highlights: ['Breakfast at the hotel', 'Half-Day Dubai City Tour · SIC basis', 'Dubai Creek Cruise with Dinner'],
    note: 'SIC means seat-in-coach: a shared tour. Overnight stay in Dubai.',
  },
  {
    title: 'Desert Safari', timing: 'Morning at leisure & desert excursion',
    description: 'Enjoy breakfast at the hotel and spend the morning at leisure. Later, proceed for an exciting Deluxe Desert Safari on SIC basis and experience Dubai’s spectacular desert landscape. Return to the hotel after the safari.',
    highlights: ['Breakfast at the hotel', 'Morning at leisure', 'Deluxe Desert Safari · SIC basis'],
    note: 'Overnight stay in Dubai.',
  },
  {
    title: 'Leisure Day', timing: 'A day at your own pace',
    description: 'After breakfast, enjoy the day at your own pace. You may explore Dubai, enjoy shopping, or arrange optional sightseeing and attractions at an additional cost.',
    highlights: ['Breakfast at the hotel', 'Free time to explore or shop', 'Optional sightseeing & attractions · additional cost'],
    note: 'Overnight stay in Dubai.',
  },
  {
    title: 'Departure', timing: 'Departure day',
    description: 'Enjoy breakfast at the hotel and check out. Proceed to Dubai International Airport by private transfer for your onward journey.',
    highlights: ['Breakfast at the hotel', 'Hotel check-out', 'Private departure airport transfer'],
    note: 'Tour ends with wonderful Dubai memories.',
  },
];

export const inclusions = [
  '4 nights accommodation at Citymax Bur Dubai',
  'Accommodation on twin sharing basis',
  'Daily breakfast',
  'Half-Day Dubai City Tour – SIC basis',
  'Deluxe Desert Safari – SIC basis',
  'Dubai Creek Cruise with Dinner',
  'Private arrival airport transfer',
  'Private departure airport transfer',
  'Welcome kit',
  'UAE VAT included',
];

export const exclusions = [
  'International / domestic airfare',
  'UAE visa charges',
  'Tourism Dirham Fee – payable directly at the hotel',
  'Lunch and meals not specifically mentioned',
  'Personal expenses such as laundry, telephone and tips',
  'Optional tours, activities and attraction tickets',
  'Travel insurance',
  'Any service not specifically mentioned under Package Inclusions',
];
