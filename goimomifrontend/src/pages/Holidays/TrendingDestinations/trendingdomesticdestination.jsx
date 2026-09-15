import TrendingDestinationPage from './TrendingDestinationPage';
import kerala from '../../../assets/Home/Destinations/destination-kerala.png';

const destinations = [
  { name: 'Manali', region: 'North India', country: 'India', image: '/images/manali/manali-hero.webp', description: 'A Chandigarh-to-Chandigarh mountain escape through Manali, Solang Valley, Atal Tunnel and Kullu. Travel 26–29 November 2026 with a private sedan and three nights in Manali.', highlights: ['3 nights / 4 days', '2 adults · private sedan', '3 breakfasts + 3 dinners'], path: '/manali', price: '₹23,500', priceLabel: 'for 2 adults + 5% GST', imageNote: 'AI-generated destination inspiration' },
  { name: 'Kashmir', region: 'North India', country: 'India', image: '/images/kashmir/dal-lake-hero.webp', description: 'Shikara evenings, alpine meadows and mountain roads. Discover Srinagar, Sonmarg, Gulmarg and Pahalgam in one beautiful journey.', highlights: ['4 nights / 5 days', 'Breakfast & dinner', 'Shared or private sightseeing'], path: '/kashmir', price: '₹6,499', imageNote: 'AI-generated destination inspiration' },
  { name: 'Kerala', region: 'South India', country: 'India', image: kerala, description: 'Slow down beside palm-lined backwaters, explore green hill country and make time for the coast. Find a Kerala escape that suits your pace.', highlights: ['Backwater escapes', 'Scenic hill country', 'Coastal getaways'] },
];

export default function TrendingDomesticDestination() {
  return <TrendingDestinationPage kind="Domestic" title="Trending Domestic Destination" eyebrow="CLOSER TO HOME. A WORLD TO DISCOVER." headline={<>Rediscover India.<br /><em>Find your next escape.</em></>} introduction="From the stillness of Kashmir’s lakes to Kerala’s palm-lined waterways, discover a collection of journeys that bring you closer to the beauty of India." hero="/images/kashmir/pahalgam-valley.webp" heroAlt="Kashmir-inspired river valley and Himalayan mountains" heroCaption="Inspired by Pahalgam, Kashmir · AI-generated imagery" destinations={destinations} />;
}
