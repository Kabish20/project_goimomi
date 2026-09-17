import DestinationCard from './DestinationCard';
import { hotels } from '../../pages/Holidays/Azerbaijan/azerbaijanData';
import { trip as baliTrip } from '../../pages/Holidays/Bali/baliData';
import './TrendingDomesticDestinations.css';

const destinations = [
  { name: 'Azerbaijan', region: 'Baku & the Caucasus', path: '/azerbaijan', image: '/images/azerbaijan/baku-hero.webp', imageAlt: 'Baku-inspired skyline with the Flame Towers and Caspian waterfront at sunset', startingPrice: Math.min(...hotels.map(hotel => hotel.price / 2)), description: 'Discover Baku’s skyline, mountain scenery and the Land of Fire.', highlights: ['4 nights / 5 days', 'Baku, Shahdag & Absheron', 'Private transfers & breakfast'] },
  { name: 'Bali', region: 'Ubud, Penida & South Bali', path: '/bali', image: baliTrip.image, imageAlt: 'Bali-inspired green cliffs and turquoise sea at Kelingking Beach, Nusa Penida', startingPrice: baliTrip.pricePerAdult, description: 'Rice terraces, temple sunsets and the spectacular coast of Nusa Penida.', highlights: ['4 nights / 5 days', 'Ubud, Kintamani & Nusa Penida', 'Private tours, boat & selected meals'] },
];

export default function TrendingInternationalDestinations() {
  return (
    <section className="domestic-trending-section international-trending-section" aria-labelledby="international-trending-title">
      <div className="domestic-trending-container">
        <div className="domestic-trending-heading">
          <div>
            <span className="domestic-trending-eyebrow">DISCOVER BEYOND BORDERS</span>
            <h2 id="international-trending-title">Trending International Destinations</h2>
          </div>
          <p>Discover your next international escape, thoughtfully planned for you.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {destinations.map(destination => (
            <DestinationCard key={destination.path} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
