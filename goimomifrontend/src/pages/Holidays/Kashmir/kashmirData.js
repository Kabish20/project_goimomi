export const hotelCategories = [
  { label: '03★ Basic', hotels: ['Hotel Lime Wood Inn', 'Hotel City Grace'] },
  { label: '03★ Deluxe', hotels: ['Hotel Jhelum Resort', 'Hotel Lee-Heritage'] },
  { label: '03★ Premium', hotels: ['The Stay Villa', 'OV Boutique'] },
  { label: '04★ Basic', hotels: ['Hotel Arsion Luxury', 'Hotel Apple Orchard'] },
  { label: '04★ Deluxe', hotels: ['Hotel Lemon Tree', 'Hotel Sarvour Portico'] },
  { label: '04★ Premium', hotels: ['Hotel Four Point by Sheraton', 'Hotel Saviour Premier'] },
];

export const privateRates = [
  { vehicle: 'Etios / Swift Dzire', pax: 2, prices: [13519, 14831, 17456, 26644, 31894, 41081] },
  { vehicle: 'Innova / Ertiga', pax: 4, prices: [11058, 12370, 14995, 24183, 29433, 38620] },
  { vehicle: 'Innova / Ertiga', pax: 6, prices: [9691, 11003, 13628, 22816, 28066, 37253] },
  { vehicle: 'Innova Crysta', pax: 4, prices: [11878, 13191, 15816, 25003, 30253, 39441] },
  { vehicle: 'Innova Crysta', pax: 6, prices: [10238, 11550, 14175, 23363, 28613, 37800] },
  { vehicle: 'Tempo Traveller', pax: 8, prices: [10073, 11386, 14011, 23198, 28448, 37636] },
  { vehicle: 'Tempo Traveller', pax: 10, prices: [9450, 10763, 13388, 22575, 27825, 37013] },
  { vehicle: 'Tempo Traveller', pax: 12, prices: [9034, 10347, 12972, 22159, 27409, 36597] },
  { vehicle: 'Urbania', pax: 6, prices: [12972, 14284, 16909, 26097, 31347, 40534] },
  { vehicle: 'Urbania', pax: 8, prices: [11468, 12780, 15405, 24593, 29843, 39030] },
  { vehicle: 'Urbania', pax: 10, prices: [10566, 11878, 14503, 23691, 28941, 38128] },
  { vehicle: 'Urbania', pax: 12, prices: [9964, 11277, 13902, 23089, 28339, 37527] },
];

export const supplements = [
  { label: 'Extra bed · 12 years & above', prices: [6563, 9188, 11550, 14700, 23625, 26250] },
  { label: 'Child without bed · 5–11 years', prices: [4594, 5906, 8925, 11550, 15750, 10500] },
];

export const itinerary = [
  {
    place: 'Srinagar', title: 'Arrival. An evening by Dal Lake.', tag: 'A beautiful beginning',
    description: 'Arrive in Srinagar and check in to your hotel. Private guests are received at the airport by our driver; Budget guests reach the hotel on their own, with directions and on-call assistance from our team. As the sun drops, glide across Dal Lake on a shikara — past floating gardens, century-old houseboats and Char Chinar island, with the mountains turning gold behind you.',
    highlights: ['Dal Lake', 'Floating gardens', 'Shikara experience'],
  },
  {
    place: 'Sonmarg', title: 'The meadow of gold.', tag: 'Rivers, glaciers & mountain air',
    description: 'A full day in Sonmarg, driving beside the Sindh River into the high Himalaya. Walk or ride a pony up to the Thajiwas Glacier, where snow lingers even in summer — and if the season allows, take a local cab to Zero Point for snow above the clouds. Evening return to your Srinagar hotel.',
    highlights: ['Sindh River', 'Thajiwas Glacier', 'Optional Zero Point visit'],
  },
  {
    place: 'Gulmarg', title: 'Above it all. The Gondola day.', tag: 'Your mountain moment',
    description: 'The day everyone waits for. In Gulmarg, ride one of the world’s highest cable cars — Gondola Phase 1 to Kongdoori, and onward to Apharwat Peak if you wish — for views your camera will never fully capture. Meadows in every direction, St. Mary’s Church, and one of the highest golf courses on Earth. Back to Srinagar by evening.',
    highlights: ['Gondola · optional', 'St. Mary’s Church', 'Alpine meadows'],
  },
  {
    place: 'Pahalgam', title: 'Saffron fields & storybook valleys.', tag: 'Take the scenic route',
    description: 'Drive through Kashmir’s storybook countryside — the saffron fields of Pampore, the ancient Awantipora ruins, apple orchards and cricket-bat villages — to Pahalgam. Stand in the film-famous Betaab Valley, walk beside the rushing Lidder river, and if you like, take a pony up to Baisaran — “Mini Switzerland.” Return to Srinagar for the night.',
    highlights: ['Pampore', 'Betaab Valley', 'Lidder River'],
  },
  {
    place: 'Srinagar', title: 'Until next time, Kashmir.', tag: 'A suitcase full of memories',
    description: 'Check out after breakfast and depart with a phone full of photographs. Private guests enjoy an included airport drop. Airport drop is not included in the Budget package — our team helps you arrange a cab on the spot, at actuals.',
    highlights: ['Breakfast', 'Hotel check-out', 'Onward journey'],
  },
];

export const budgetInclusions = [
  '4 nights in Srinagar · Hotel Akar Inn or similar (Budget)',
  'Breakfast & dinner daily',
  'Sonmarg, Gulmarg, Pahalgam & local sightseeing',
  'Shared SIC coach for sightseeing',
  'Directions and on-call help to reach your hotel',
];

export const privateInclusions = [
  '4 nights in Srinagar · your choice of hotel category',
  'Breakfast & dinner daily',
  'Private vehicle throughout · sightseeing on your timings',
  'Driver charges, fuel, tolls & parking',
  'Our team on call throughout your trip',
  'Airport pickup & drop included',
];

export const exclusions = [
  'Airfare / train fare to and from Srinagar',
  'Lunch and personal expenses',
  'Entry tickets and monument / garden fees',
  'Gulmarg Gondola tickets',
  'Pony rides, local union cabs and optional activities',
  'Any meals or services not mentioned under inclusions',
  'Travel insurance',
  'Additional expenses due to weather, road closures or unforeseen circumstances',
  'Airport pickup & drop for the Budget / Group Departure package',
];

export const formatRupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;
