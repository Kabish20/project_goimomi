// Prices are package totals for two adults sharing one room; displayed rates divide by two.
export const stays = [
  { name: 'Value Stay', price: 23500, room: 'Deluxe Room', hotels: ['Hotel Manali Paradise', 'Holiday BnB'] },
  { name: 'Comfort Stay', price: 25000, room: 'Deluxe Room', hotels: ['Hotel Snow Paradise Manali', 'MBN Resorts Manali', 'Hotel Snow Creek Manali'] },
  { name: 'Premium Stay', price: 29500, room: 'Super Deluxe Room', hotels: ['Holiday Resorts Manali', 'Victory Resort', 'Jannat Resorts & Spa Manali'] },
];
export const travelDate = '2026-11-26';
export const days = [
  { date: '26 November 2026', title: 'Chandigarh to Manali', description: 'On arrival at Chandigarh Airport, meet your representative / driver and begin the scenic journey towards Manali. Enjoy the changing landscapes as you travel into the Himalayan region, stopping at Pandoh Dam en route. After reaching Manali, check in to your hotel and relax.', distance: 'Approximately 320 km · around 8–9 hours, depending on traffic and road conditions', places: ['Pandoh Dam'], meals: 'Dinner', overnight: 'Manali' },
  { date: '27 November 2026', title: 'Manali Local Sightseeing', description: 'After breakfast at the hotel, set out for a full day of Manali local sightseeing. Explore its cultural, spiritual and leisure attractions, from peaceful temples to the lively Mall Road. Return to your hotel and enjoy your evening at leisure.', places: ['Hadimba Devi Temple', 'Vashisht Hot Water Springs', 'Old Shiva Temple', 'Tibetan Monastery', 'Club House', 'Van Vihar', 'Manali Mall Road'], meals: 'Breakfast & dinner', overnight: 'Manali' },
  { date: '28 November 2026', title: 'Solang Valley & Atal Tunnel', description: 'Enjoy breakfast before travelling towards the spectacular Solang Valley. Take in the snow-capped Himalayan peaks and beautiful valleys, with stops at Nehru Kund, Solang Valley and Atal Tunnel. Available adventure activities can be enjoyed at your own expense. Return to Manali after sightseeing.', places: ['Nehru Kund', 'Solang Valley', 'Atal Tunnel'], note: 'Visits to Solang Valley, Atal Tunnel and surrounding areas are subject to weather, road, traffic and local government conditions.', meals: 'Breakfast & dinner', overnight: 'Manali' },
  { date: '29 November 2026', title: 'Manali — Kullu — Chandigarh', description: 'After breakfast, check out and begin your return journey to Chandigarh through Kullu Valley. Explore the en-route attractions before your drop at Chandigarh Airport, Chandigarh Railway Station or a Chandigarh hotel.', distance: 'Approximately 320 km · around 8–9 hours, depending on road and traffic conditions', places: ['Kullu Valley', 'Kullu Paragliding Point', 'Kullu River Rafting Area', 'Vaishno Devi Temple'], note: 'Paragliding and river rafting are optional and charged separately unless specifically included in your confirmed booking.', meals: 'Breakfast' },
];
export const inclusions = [
  'Chandigarh pickup', 'Chandigarh drop', '3 nights accommodation in Manali', '1 Deluxe / Super Deluxe Room, depending on your selected package',
  '3 breakfasts', '3 dinners', 'Private sedan for 4 days', 'Transportation as per the mentioned itinerary', 'Manali local sightseeing',
  'Solang Valley sightseeing', 'Atal Tunnel visit, subject to accessibility', 'Kullu sightseeing on the return journey', 'Driver allowance',
  'Toll charges', 'Parking charges applicable to the scheduled itinerary',
];
export const exclusions = [
  'Airfare or train tickets', 'Lunch', 'Personal expenses', 'Entry tickets unless specifically mentioned', 'Adventure activity charges',
  'Paragliding charges', 'River rafting charges', 'Snow activity charges', 'Skiing, snowmobile or other seasonal activities',
  'Local union vehicle charges, if applicable', 'Additional sightseeing not mentioned in the itinerary',
  'Expenses caused by road closures, bad weather, natural events or circumstances beyond our control',
  'Any service not specifically mentioned under Package Inclusions',
];
export const information = [
  'Accommodation is subject to availability at the time of booking. A similar-category property may be provided if the listed hotel is unavailable.',
  'Sightseeing schedules may be modified depending on weather, traffic, road conditions and local regulations.',
  'Access to Solang Valley, Atal Tunnel and snow-point areas depends on prevailing weather and road conditions.',
  'Paragliding and river rafting depend on local operating conditions and are excluded unless specifically confirmed.',
  'Transportation follows the stated itinerary. Additional routes, sightseeing locations or extra vehicle usage may attract additional charges.',
];
export const rupees = amount => `₹${amount.toLocaleString('en-IN')}`;
