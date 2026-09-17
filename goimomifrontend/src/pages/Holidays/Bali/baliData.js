export const trip = {
  name: 'Bali Special Package', duration: '5 days / 4 nights', pricePerAdult: 24570,
  hotel: 'Bliss Surfer Hotel or similar', room: '1 Superior Room', adults: 2,
  image: '/images/bali/bali-nusa-penida-hero.png',
};
export const rupees = value => `₹${value.toLocaleString('en-IN')}`;
export const days = [
  {
    title: 'Welcome to Bali', timing: 'Arrival day',
    description: 'Meet and greet at Ngurah Rai International Airport, followed by a private transfer to your hotel. Settle in and enjoy the beginning of your island escape.',
    highlights: ['Airport meet & greet', 'Private hotel transfer', 'Bliss Surfer Hotel or similar'],
    note: 'Standard check-in is 2:00 PM. If you arrive earlier, you may wait in the lobby until your room is ready.',
  },
  {
    title: 'Ubud & Kintamani', timing: 'Approximately 10 hours',
    description: 'Discover Central Bali, from the sculpted rice terraces of Tegallalang to the volcano views of Kintamani. Stop at a coffee plantation, browse Ubud Art Market and visit Ubud Royal Palace.',
    highlights: ['Tegallalang Rice Terrace · entrance included', 'Coffee plantation · complimentary tasting', 'Ubud Art Market', 'Ubud Royal Palace', 'Kintamani Volcano View Point · entrance included'],
    note: 'Breakfast is complimentary at the hotel, subject to hotel timings.',
  },
  {
    title: 'Nusa Penida’s west coast', timing: 'Starts at 6:00 AM',
    description: 'Take the fast boat to Nusa Penida and explore its dramatic western coastline by private vehicle. Visit Kelingking Beach, Angel’s Billabong, Broken Beach and Crystal Bay, with lunch at a local restaurant.',
    highlights: ['Kelingking Beach', 'Angel’s Billabong', 'Broken Beach', 'Crystal Bay', 'Return fast boat tickets', 'Private island vehicle, entrance & parking fees', 'À la carte lunch at a local restaurant'],
    note: 'The hotel will provide a breakfast box before your early departure.',
  },
  {
    title: 'South Bali, shore to sunset', timing: 'Approximately 10 hours',
    description: 'Visit Tanjung Benoa Beach for a complimentary banana boat ride, enjoy a shopping stop, then explore Uluwatu Cliff Temple. Finish the day at Jimbaran Beach.',
    highlights: ['Tanjung Benoa · 1 complimentary banana boat ride', 'Shopping stop · up to 2 hours', 'Uluwatu Cliff Temple · entrance included', 'Jimbaran Beach'],
    note: 'Seafood dinner at Jimbaran Beach is not included.',
  },
  {
    title: 'Until next time, Bali', timing: 'Departure day',
    description: 'Check out from your hotel and enjoy a private transfer to Ngurah Rai International Airport for your onward flight.',
    highlights: ['Hotel check-out', 'Private airport transfer'],
    note: 'Airport transfer timing will be arranged around your flight details.',
  },
];
export const inclusions = [
  '4 nights at Bliss Surfer Hotel or similar · 1 Superior Room',
  '4 complimentary hotel breakfasts, subject to hotel timings',
  'Breakfast box before the Nusa Penida departure',
  '1 à la carte lunch at a local restaurant in Nusa Penida',
  'Private Toyota Avanza for tours and airport transfers',
  'Return fast boat tickets and a private vehicle in Nusa Penida',
  'Nusa Penida entrance and parking fees',
  'Entrance to Tegallalang Rice Terrace, Kintamani viewpoint and Uluwatu Cliff Temple',
  'Complimentary coffee tasting and 1 banana boat ride',
];
