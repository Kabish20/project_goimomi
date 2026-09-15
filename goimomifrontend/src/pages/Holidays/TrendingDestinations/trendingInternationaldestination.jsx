import TrendingDestinationPage from './TrendingDestinationPage';
import bangkok from '../../../assets/Home/Destinations/destination-bangkok.png';
import bali from '../../../assets/Home/Destinations/destination-bali.png';
import uae from '../../../assets/Home/Destinations/destination-uae.png';
import singapore from '../../../assets/Home/Destinations/destination-singapore.png';
import paris from '../../../assets/Home/Destinations/destination-paris.png';

const destinations = [
  { name: 'Azerbaijan', region: 'Caucasus', country: 'Azerbaijan', image: '/images/azerbaijan/baku-hero.webp', description: 'Discover Baku’s skyline and Old City, the mountains of Shahdag and Absheron’s fire landmarks on a private holiday designed for two.', highlights: ['Baku · Shahdag · Absheron', '4 nights / 5 days', 'Private sedan · breakfast'], path: '/azerbaijan', price: '₹52,430', priceLabel: 'total for 2 adults', imageNote: 'AI-generated destination inspiration' },
  { name: 'Bangkok', region: 'Southeast Asia', country: 'Thailand', image: bangkok, description: 'Discover ornate temples, lively markets and riverside evenings. Browse Thailand holidays with Bangkok as your starting point.', highlights: ['City discoveries', 'Thai flavours', 'Cultural experiences'] },
  { name: 'Bali', region: 'Southeast Asia', country: 'Indonesia', image: bali, description: 'Make room for terraced hillsides, temple visits and unhurried beach days. A tropical escape for moments together.', highlights: ['Island escapes', 'Nature & culture', 'Time to unwind'] },
  { name: 'UAE', region: 'Middle East', country: 'United Arab Emirates', image: uae, description: 'Pair a modern city break with desert landscapes and waterfront evenings. Explore holidays shaped around the experiences you love.', highlights: ['City skylines', 'Desert experiences', 'Waterfront walks'] },
  { name: 'Singapore', region: 'Southeast Asia', country: 'Singapore', image: singapore, description: 'Explore leafy gardens, lively neighbourhoods and a world of food in one city. Discover options for families, couples and curious travellers.', highlights: ['Gardens & city life', 'Family adventures', 'Local food trails'] },
  { name: 'Paris', region: 'Europe', country: 'France', image: paris, description: 'Follow the Seine, linger in a café and discover art and architecture around every corner. Begin planning your own Paris story.', highlights: ['Art & architecture', 'Riverside strolls', 'Café culture'] },
];

export default function TrendingInternationalDestination() {
  return <TrendingDestinationPage kind="International" title="Trending International Destination" eyebrow="NEW PLACES. NEW PERSPECTIVES." headline={<>A world of possibility.<br /><em>Where will you go?</em></>} introduction="Island days, iconic cities and adventures beyond the familiar. Explore our international destination collection and find a holiday that feels like you." hero={bali} heroAlt="Lush terraced landscape in Bali" heroCaption="Bali, Indonesia · Destination inspiration" destinations={destinations} />;
}
