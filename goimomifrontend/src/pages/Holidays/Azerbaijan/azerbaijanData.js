// Prices are package totals for two adults sharing one room; displayed rates divide by two.
export const hotels = [
  { name: 'Metro City Hotel', stars: 3, price: 52430, description: 'A comfortable base for your Baku adventure.' },
  { name: 'Parkside Hotel', stars: 4, price: 63700, description: 'Choose a four-star stay for your private escape.' },
];

export const days = [
  { title: 'Arrival in Baku', subtitle: 'A warm welcome, a smooth arrival', description: 'Welcome to Baku, Azerbaijan. Upon arrival at the airport, meet your driver and enjoy a comfortable private transfer to your hotel. Complete the hotel check-in formalities and spend the remaining time at leisure.', highlights: ['Private airport transfer', 'Hotel check-in', 'Time at leisure'], overnight: true },
  { title: 'Baku City Tour', subtitle: 'Centuries of stories. A skyline of tomorrow.', description: 'After breakfast at the hotel, proceed for a full-day exploration of Baku and discover the city’s famous historical, cultural and modern attractions. Return to your hotel after sightseeing.', attractions: [
    ['Highland Park', 'Panoramic views overlooking Baku and the Caspian Sea.'],
    ['Flame Towers', 'One of the most iconic symbols of modern Baku.'],
    ['Baku Boulevard', 'The scenic promenade along the Caspian Sea.'],
    ['Azerbaijan Carpet Museum', 'Unique architecture and Azerbaijan’s traditional carpet-making heritage.'],
    ['Little Venice', 'Picturesque canals and charming surroundings.'],
    ['Old City (Icherisheher)', 'Ancient streets and architecture in Baku’s historic heart.'],
    ['Nizami Street', 'One of Baku’s popular shopping and entertainment streets.'],
    ['Heydar Aliyev Centre', 'An exterior visit to the landmark known for its striking contemporary curves.'],
  ], highlights: ['History & architecture', 'Caspian waterfront', 'Old City'], overnight: true },
  { title: 'Full-Day Shahdag Tour', subtitle: 'A little closer to the mountains', description: 'Enjoy breakfast before a scenic full-day excursion to Shahdag. Surrounded by the spectacular Caucasus Mountains, this mountain destination offers breathtaking landscapes throughout the year. Enjoy the scenery and a one-way cable car ride, included in your package. Return to Baku after the tour.', highlights: ['Caucasus mountain scenery', 'One-way cable car included', 'Private excursion'], overnight: true },
  { title: 'Absheron Tour & Shopping', subtitle: 'Discover the land of fire', description: 'After breakfast, explore the Absheron Peninsula and its historical and natural fire attractions. Entrance tickets for both the Fire Temple and Fire Mountain are included. Later, enjoy a shopping tour in Baku, exploring local stores, shopping streets and souvenir options before returning to the hotel.', attractions: [
    ['Ateshgah Fire Temple', 'Explore the historic cultural landmark associated with Azerbaijan’s ancient fire-worshipping heritage.'],
    ['Yanar Dag — Fire Mountain', 'Witness the natural burning hillside, where flames emerge from underground gas deposits.'],
  ], highlights: ['Fire Temple ticket included', 'Fire Mountain ticket included', 'Shopping time'], overnight: true },
  { title: 'Departure from Baku', subtitle: 'Wonderful memories, all packed up', description: 'Enjoy your final breakfast at the hotel. Check out and proceed by private transfer to the airport according to your flight schedule. Depart Baku with wonderful memories of your Azerbaijan holiday.', highlights: ['Breakfast', 'Hotel check-out', 'Private airport transfer'], overnight: false },
];

export const inclusions = [
  '4 nights accommodation at your selected hotel', 'Standard Double Room accommodation', 'Daily breakfast at the hotel',
  'Private transportation throughout the itinerary', 'Comfortable sedan car for transfers and sightseeing', 'English-speaking driver',
  'Airport arrival transfer', 'Airport departure transfer', 'Baku City Tour', 'Full-Day Shahdag Tour', 'Absheron Peninsula Tour', 'Shopping Tour',
  'One-way Shahdag Cable Car ticket', 'Ateshgah Fire Temple entrance ticket', 'Yanar Dag / Fire Mountain entrance ticket',
  '2 bottles of drinking water per person per day', 'All tours mentioned in the confirmed itinerary',
];

export const exclusions = [
  'International or domestic air tickets', 'Azerbaijan visa', 'Lunches and dinners', 'Personal expenses', 'Shopping and souvenirs',
  'Separate professional tour guide', 'Entrance tickets not specifically mentioned under inclusions',
  'Additional sightseeing or activities not mentioned in the itinerary', 'Any services requested outside the confirmed program',
];

export const important = [
  'Package prices are calculated for 2 adults travelling together.',
  'Accommodation will be provided according to the selected hotel option.',
  'Hotel rooms are subject to availability at the time of booking and confirmation.',
  'Sightseeing and transfers are provided on a private basis by sedan car.',
  'An English-speaking driver is included; a separate professional tour guide is not included.',
  'Only the entrance tickets specifically mentioned under package inclusions are included.',
  'Flight tickets and Azerbaijan visa charges are not included in the package price.',
  'Final itinerary timings may vary depending on local traffic, weather conditions and operational requirements.',
];

export const rupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;
