import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stays } from '../../pages/Holidays/Manali/manaliData';
import { packages as northEastPackages } from '../../pages/Holidays/Sikkim/sikkimData';
import { packages as andamanPackages } from '../../pages/Holidays/Andaman/andamanData';
import { hotels as goaHotels } from '../../pages/Holidays/Goa/goaData';
import './TrendingDomesticDestinations.css';

const destinations = [
  {
    name: 'Kashmir',
    region: 'North India',
    startingPrice: 6499,
    highlights: ['4 nights / 5 days', 'Srinagar, Gulmarg & Pahalgam', 'Budget & private holiday options'],
    image: '/images/kashmir/kashmir-destination-card.webp',
    imageAlt: 'Kashmir-inspired scene of a yellow-canopied shikara on a lake beneath Himalayan mountains',
    description: 'Shikara rides, alpine meadows and scenic mountain escapes.',
    path: '/kashmir',
  },
  {
    name: 'Manali',
    region: 'Himachal Pradesh',
    startingPrice: Math.min(...stays.map(stay => stay.price / 2)),
    highlights: ['3 nights / 4 days', 'Solang Valley & Atal Tunnel', 'Private cab from Chandigarh'],
    image: '/images/manali/manali-destination-card.webp',
    imageAlt: 'Manali-inspired scene of a turquoise river, pine forests and snow-capped Himalayan peaks',
    description: 'A private Himalayan escape through scenic valleys and pine forests.',
    path: '/manali',
  },
  {
    name: 'Sikkim',
    region: 'Assam & Meghalaya',
    startingPrice: Math.min(...northEastPackages.map(option => option.pricePerAdult)),
    highlights: ['6 nights / 7 days', 'Assam & Meghalaya', '4 adults · 2 rooms'],
    image: '/images/north-east/dawki-hero.webp',
    imageAlt: 'Meghalaya-inspired scene of a wooden boat on an emerald river between forested hills',
    description: 'Guwahati, Kaziranga, Shillong and Cherrapunji, together in one journey.',
    path: '/sikkim',
  },
  {
    name: 'Andaman',
    region: 'Andaman & Nicobar Islands',
    startingPrice: Math.min(...andamanPackages.map(option => option.price)),
    highlights: ['3 or 4 nights / 4 or 5 days', 'Port Blair, Ross Island & North Bay', 'Private transfers & ferry excursions'],
    image: '/images/andaman/andaman-destination-card.jpg',
    imageAlt: 'Andaman Islands pristine white beach with turquoise water, coral reef and a wooden boat',
    description: 'Island history, clear water and a slower winter rhythm by the sea.',
    path: '/andaman',
  },
  {
    name: 'Goa',
    region: 'North & South Goa',
    startingPrice: Math.min(...goaHotels.map(hotel => hotel.pricePerAdult)),
    highlights: ['3 nights / 4 days', '6 adults · 2 rooms', 'Breakfast & private Innova Crysta'],
    image: '/images/goa/goa-coast-hero.webp',
    imageAlt: 'Goa-inspired golden beach, coconut palms and a coastal fort by the Arabian Sea',
    description: 'Beach days, colourful streets and a private Innova Crysta for your group.',
    path: '/goa',
  },
];

/* Duplicate for seamless infinite loop */
const loopedDestinations = [...destinations, ...destinations];

export default function TrendingDomesticDestinations() {
  return (
    <section className="domestic-trending-section" aria-labelledby="domestic-trending-title">
      <div className="domestic-trending-container">
        <div className="domestic-trending-heading">
          <div>
            <span className="domestic-trending-eyebrow">DISCOVER INCREDIBLE INDIA</span>
            <h2 id="domestic-trending-title">Trending Domestic Destinations</h2>
          </div>
          <p>Choose your next Indian escape and start planning something beautiful.</p>
        </div>
      </div>

      {/* Full-width marquee strip — outside the container so it bleeds edge-to-edge */}
      <div className="domestic-trending-overflow" aria-label="Scrolling destination cards">
        <div className="domestic-trending-track">
          {loopedDestinations.map((destination, index) => (
            <article
              className="domestic-trending-card"
              key={`${destination.name}-${index}`}
              aria-hidden={index >= destinations.length ? true : undefined}
            >
              <div className="domestic-trending-photo">
                <img
                  src={destination.image}
                  alt={destination.imageAlt}
                  loading={index < destinations.length ? 'eager' : 'lazy'}
                  decoding="async"
                  width="800"
                  height="533"
                />
                <div className="domestic-trending-price">
                  <span>Starting From</span>
                  <strong>₹{destination.startingPrice.toLocaleString('en-IN')}</strong>
                  <small>Per Person</small>
                </div>
              </div>
              <div className="domestic-trending-card-body">
                <span className="domestic-trending-region">{destination.region}</span>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <ul className="domestic-trending-highlights">
                  {destination.highlights.map(highlight => (
                    <li key={highlight}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Link to={destination.path} className="domestic-trending-link" tabIndex={index >= destinations.length ? -1 : undefined}>
                  <span>Explore {destination.name}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
