// Year assumed from the other supplied 2026 packages; change here if clarified.
export const trip = { dates: '3 nights / 4 days', startDate: '2026-10-01', adults: 6, rooms: 2, nights: 3, vehicle: 'Innova Crysta' };
export const hotels = [
  { name: 'Zone Connect by The Park Parra', pricePerAdult: 9400 },
  { name: 'Vilmaris Breeze Hotel', pricePerAdult: 9400 },
  { name: 'Bells Beach Resort', pricePerAdult: 9700 },
];
export const days = [
  {
    title: 'Welcome to Goa', date: 'Day 1', time: 'Arrival & hotel check-in',
    description: 'Arrive at Goa Dabolim Airport, meet your private vehicle and transfer to your selected hotel for check-in. Settle into your rooms and enjoy the start of your Goa holiday.',
    places: ['Dabolim Airport', 'Hotel check-in'],
  },
  {
    title: 'North Goa beaches & Aguada', date: 'Day 2', time: '10:00 AM–6:00 PM · private vehicle',
    description: 'Spend the day exploring North Goa by private vehicle. Visit Calangute, Baga, Sinquerim and Anjuna, then explore Aguada Fort and the lighthouse before continuing to Vagator. A lunch stop is planned during the sightseeing day.',
    places: ['Calangute Beach', 'Baga Beach', 'Sinquerim Beach', 'Anjuna Beach', 'Aguada Fort & lighthouse', 'Vagator Beach'],
    note: 'Lunch and entry tickets are not included. Water sports at Baga are optional; availability and charges require confirmation.',
  },
  {
    title: 'South Goa heritage & colourful streets', date: 'Day 3', time: '10:00 AM–6:00 PM · private vehicle',
    description: 'Explore temples, churches and the waterfront on your South Goa sightseeing day. The programme includes Mangeshi and Shantadurga temples, a spice plantation lunch stop, Miramar and Dona Paula, the Old Goa churches, Balaji Temple, Panjim and the colourful houses of Fontainhas.',
    places: ['Mangeshi Temple', 'Shantadurga Temple', 'Spice plantation lunch stop', 'Miramar Beach', 'Dona Paula', 'Sé Cathedral, Old Goa', 'St. Augustine Church, Old Goa', 'Chapel of Our Lady of the Mount, Old Goa', 'Balaji Temple', 'Panjim City', 'Fontainhas colourful houses'],
    note: 'The spice plantation visit is a lunch stop; lunch and all entry tickets are payable separately. The final order and coverage depend on local timings and traffic.',
  },
  {
    title: 'Until next time, Goa', date: 'Day 4', time: 'Hotel checkout & departure transfer',
    description: 'Check out from your hotel and travel by private vehicle to Dabolim Airport for your onward journey.',
    places: ['Hotel checkout', 'Dabolim Airport drop'],
  },
];
export const inclusions = [
  'Private pickup from the airport or railway station',
  '3 nights accommodation at the selected hotel',
  'Private drop to the airport or railway station',
  'Breakfast',
  'Transport by Innova Crysta',
  'Sightseeing as listed in the itinerary',
  'All taxes',
  'Parking',
  'Tolls',
];
export const exclusions = ['Anything not specifically included above', 'Lunch, including lunch stops during sightseeing', 'Dinner', 'All entry tickets'];
export const information = [
  'The quoted rates apply to a minimum of 6 adults, accommodated in 2 rooms on triple sharing. A different group size or room arrangement requires a fresh quote.',
  'All three hotel options include the same Innova Crysta transport and itinerary. Hotel availability and the exact room category are confirmed at booking.',
  'North and South Goa sightseeing are scheduled from 10:00 AM to 6:00 PM. The order of visits may vary with traffic and opening times.',
  'Breakfast is included. Lunch and dinner are excluded, including the North Goa lunch stop and South Goa spice plantation lunch stop.',
  'The day-by-day itinerary uses Dabolim Airport. Private railway-station pickup and drop are also listed in the inclusions; share the station and train details when enquiring.',
  'Water sports at Baga are optional and are not priced in this quotation. Entry tickets and any services outside the inclusions are payable separately.',
];
export const rupees = amount => `₹${amount.toLocaleString('en-IN')}`;
export const totalFor = hotel => hotel.pricePerAdult * trip.adults;
