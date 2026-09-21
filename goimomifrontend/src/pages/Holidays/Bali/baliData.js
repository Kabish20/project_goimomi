export const trip = {
  name: 'Bali Special Package', duration: '3 nights / 4 days', nights: 3, pricePerAdult: 17300,
  hotel: 'BRTIS HOTEL', room: 'Twin sharing', adults: 2,
  destination: 'Bali, Indonesia', season: 'Low Season 2026', variant: 'Without Bali Swing',
  image: '/images/bali/bali-temple.jpeg',
};
export const rupees = value => `₹${value.toLocaleString('en-IN')}`;
export const peakPeriods = ['27 March – 15 April 2026', '01 July – 31 August 2026', '15 December 2026 – 10 January 2027'];
export const days = [
  {
    title: 'Arrival in Bali | Welcome to the island', timing: 'Arrival day',
    description: 'Arrive at Bali International Airport, where our representative will welcome you and assist with your private transfer to the hotel. Complete check-in and relax after your journey. Depending on your flight arrival time, you may have an opportunity to visit Tanah Lot Temple, an iconic sea temple known for its coastal setting and sunset views. Return to the hotel and enjoy the evening at leisure.',
    highlights: ['Airport welcome & private hotel transfer', 'Hotel check-in', 'Tanah Lot Temple · subject to flight arrival time'],
    note: 'Overnight stay in Bali. Standard hotel check-in timings apply.',
  },
  {
    title: 'Tanjung Benoa | Melasti Beach | Uluwatu Temple', timing: 'Full-day sightseeing',
    description: 'After breakfast, visit Tanjung Benoa for optional water sports such as parasailing, jet skiing and banana boat rides. Continue to Melasti Beach and the Tropical Temptation Beach Club area to enjoy the coastline and beach atmosphere. In the evening, explore Uluwatu Temple on its cliff overlooking the Indian Ocean and enjoy the sunset before returning to your hotel.',
    highlights: ['Tanjung Benoa · water sports at your own expense', 'Tropical Temptation Beach Club – Melasti Beach · transfers only', 'Uluwatu Temple & sunset views'],
    note: 'Beach club expenses, food and beverages are payable directly by the guest. Overnight stay in Bali.',
  },
  {
    title: 'Ubud | Tegenungan Waterfall | Rice Terrace | Kintamani', timing: 'Full-day cultural & scenic tour',
    description: 'After breakfast, visit Tegenungan Waterfall, surrounded by tropical greenery, with time for photographs and relaxation. Continue to Ubud Palace to experience traditional architecture and cultural heritage. Explore a picturesque Bali rice terrace, then head to Kintamani for panoramic views of Mount Batur volcano and its crater lake. Finish with a traditional Bali coffee plantation visit to learn about local coffee cultivation and production before returning to your hotel.',
    highlights: ['Tegenungan Waterfall', 'Ubud Palace', 'Bali Rice Terrace', 'Kintamani · Mount Batur volcano & crater lake views', 'Bali Coffee Plantation'],
    note: 'Overnight stay in Bali.',
  },
  {
    title: 'Departure from Bali', timing: 'Departure day',
    description: 'Enjoy your final breakfast at the hotel, complete check-out and proceed by private transfer to Bali International Airport according to your scheduled flight departure. Depart with unforgettable memories of your holiday.',
    highlights: ['Breakfast at the hotel', 'Hotel check-out', 'Private airport transfer'],
    note: 'Tour ends. Airport transfer timing will be arranged around your flight details.',
  },
];
export const inclusions = [
  '3 nights hotel accommodation at BRTIS HOTEL', 'Daily breakfast at the hotel',
  'Private air-conditioned vehicle', 'English-speaking guide / driver',
  'Airport arrival & departure transfers', 'Sightseeing as mentioned in the itinerary',
  'Applicable entrance tickets', 'Parking charges',
];
export const exclusions = [
  'International / domestic airfare',
  'Indonesia visa charges · Visa on Arrival: approximately USD 35 per person, subject to prevailing government regulations',
  'Water sports activities at Tanjung Benoa', 'Bali Swing',
  'Meals other than those specifically mentioned', 'Beach club expenses, food, beverages or personal expenses',
  'Tips / gratuities for guide and driver', 'Travel insurance',
  'Personal expenses such as laundry, telephone calls, shopping and mini-bar',
  'Optional tours and activities', 'Any service or expense not specifically mentioned under Package Inclusions',
];
export const importantNotes = [
  'Hotel rooms are subject to availability at the time of confirmation.',
  'The itinerary is tentative and may be rearranged depending on flight timings, traffic, weather and local operational requirements.',
  'Sightseeing sequence may change without reducing the overall services included in the package.',
  'Standard hotel check-in and check-out timings apply.',
  'Early check-in and late check-out are subject to hotel availability and may attract additional charges.',
  'Optional tours, water sports and additional activities are payable directly by the guest.',
  'Package rates apply for the specified travel period and may change during peak dates, festivals or special events.',
  'Cancellation charges apply as per the applicable cancellation policy.',
  'Final booking is confirmed only after receipt of the required advance payment and confirmation from the hotel and service providers.',
];
