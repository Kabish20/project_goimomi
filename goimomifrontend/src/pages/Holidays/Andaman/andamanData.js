export const packages = [
  {
    name: 'Andaman Retreat',
    duration: '3 Nights / 4 Days',
    stay: '3 nights in Port Blair',
    price: 10723,
    days: [
      ['Arrival, Cellular Jail & Light and Sound Show', 'Arrive at Port Blair (Sri Vijaya Puram), transfer to the hotel, and visit Cellular Jail after lunch. In the evening, attend the Light and Sound Show inside the jail complex.', 'Port Blair'],
      ['Ross Island & North Bay Island', 'Board a boat from Aberdeen Jetty for Ross Island (Netaji Subhash Chandra Bose Dweep) and North Bay Island (Coral Island). Optional activities include snorkeling, scuba diving, sea walk and glass-bottom boat rides.', 'Port Blair'],
      ['City Museums & Corbyn’s Cove Beach', 'Visit the Anthropological Museum, Samudrika Naval Marine Museum and Fisheries Museum. After lunch, unwind at Corbyn’s Cove Beach, with optional jet skiing and speed boat rides.', 'Port Blair'],
      ['Departure', 'After breakfast, check out and transfer to the airport for your departure from Port Blair (Sri Vijaya Puram).', ''],
    ],
    highlights: ['Cellular Jail and Light and Sound Show', 'Ross Island and North Bay Island', 'City museums and Corbyn’s Cove Beach'],
    inclusions: ['3 nights accommodation in Port Blair on double sharing', 'Daily breakfast except on the day of arrival', 'Private AC vehicle for sightseeing and transfers', 'Cellular Jail and Light and Sound Show entry tickets', 'Permits, parking and itinerary entry fees', 'Dedicated tour coordinator / ground support'],
  },
  {
    name: 'Enchanting Andaman',
    duration: '4 Nights / 5 Days',
    stay: '4 nights in Port Blair',
    price: 17839,
    days: [
      ['Arrival, Cellular Jail & Light and Sound Show', 'Arrive at Port Blair (Sri Vijaya Puram), transfer to the hotel, and visit Cellular Jail after lunch. Attend the Light and Sound Show in the evening.', 'Port Blair'],
      ['Ross Island & North Bay Island', 'Take a full-day boat excursion from Aberdeen Jetty to Ross Island (Netaji Subhash Chandra Bose Dweep) and North Bay Island (Coral Island). Optional water activities are available.', 'Port Blair'],
      ['Havelock Island & Radhanagar Beach', 'Take an early morning ferry to Havelock Island (Swaraj Dweep). Enjoy free time at Radhanagar Beach for swimming, relaxing and photography before returning to Port Blair by ferry.', 'Port Blair'],
      ['City Museums & Corbyn’s Cove Beach', 'Explore the Anthropological Museum, Samudrika Naval Marine Museum and Fisheries Museum, then spend a relaxed afternoon at Corbyn’s Cove Beach.', 'Port Blair'],
      ['Departure', 'After breakfast, check out and transfer to the airport for your departure from Port Blair (Sri Vijaya Puram).', ''],
    ],
    highlights: ['Everything in Andaman Retreat', 'Same-day Havelock Island ferry excursion', 'Radhanagar Beach on Swaraj Dweep'],
    inclusions: ['4 nights accommodation in Port Blair on double sharing', 'Daily breakfast except on the day of arrival', 'Private AC vehicle for sightseeing and transfers', 'Cellular Jail and Light and Sound Show entry tickets', 'Round-trip ferry tickets to Havelock in a private air-conditioned vessel', 'Permits, parking and itinerary entry fees', 'Dedicated tour coordinator / ground support'],
  },
];

export const rateTables = [
  { name: 'Andaman Retreat', rows: [['Budget', 10723, 8273, 6520, 5620], ['Standard', 11585, 8273, 6520, 5920], ['Executive', 13310, 9308, 7420, 5920], ['Deluxe', 17278, 11378, 9220, 7720], ['Superior', 20728, 12758, 10420, 10420], ['Premium', 30215, 16346, 13540, 11770]] },
  { name: 'Enchanting Andaman', rows: [['Budget', 17839, 14340, 11796, 10596], ['Standard', 18989, 14340, 11796, 10996], ['Executive', 21289, 15720, 12996, 10996], ['Deluxe', 26579, 18480, 15396, 13396], ['Superior', 31179, 20320, 16996, 16996], ['Premium', 43829, 25104, 21156, 18796]] },
];

export const formatRupees = value => `₹${value.toLocaleString('en-IN')}`;