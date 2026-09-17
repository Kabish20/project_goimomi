import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TrendingDomesticDestinations.css';

const destinations = [
  {
    name: 'Kashmir',
    region: 'North India',
    highlights: ['4 nights / 5 days', 'Srinagar, Gulmarg & Pahalgam', 'Budget & private holiday options'],
    image: '/images/kashmir/kashmir-destination-card.webp',
    imageAlt: 'Kashmir-inspired scene of a yellow-canopied shikara on a lake beneath Himalayan mountains',
    description: 'Shikara rides, alpine meadows and scenic mountain escapes.',
    path: '/kashmir',
  },
  {
    name: 'Manali',
    region: 'Himachal Pradesh',
    highlights: ['3 nights / 4 days', 'Solang Valley & Atal Tunnel', 'Private cab from Chandigarh'],
    image: '/images/manali/manali-destination-card.webp',
    imageAlt: 'Manali-inspired scene of a turquoise river, pine forests and snow-capped Himalayan peaks',
    description: 'A private Himalayan escape through scenic valleys and pine forests.',
    path: '/manali',
  },
  {
    name: 'Sikkim',
    region: 'Assam & Meghalaya',
    highlights: ['6 nights / 7 days', '8–14 November 2026', 'From ₹40,000 per adult · twin sharing'],
    image: '/images/north-east/dawki-hero.webp',
    imageAlt: 'Meghalaya-inspired scene of a wooden boat on an emerald river between forested hills',
    description: 'Guwahati, Kaziranga, Shillong and Cherrapunji, together in one journey.',
    path: '/sikkim',
  },
  {
    name: 'Andaman',
    region: 'Andaman & Nicobar Islands',
    highlights: ['3 or 4 nights / 4 or 5 days', 'Port Blair, Ross Island & North Bay', 'From ₹10,723 per person'],
    image: '/images/andaman/andaman-destination-card.jpg',
    imageAlt: 'Andaman Islands pristine white beach with turquoise water, coral reef and a wooden boat',
    description: 'Island history, clear water and a slower winter rhythm by the sea.',
    path: '/andaman',
  },
  {
    name: 'Goa',
    region: 'North & South Goa',
    highlights: ['3 nights / 4 days', '6 adults · 2 rooms · triple sharing', 'From ₹9,400 per adult'],
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
            <h2 id="domestic-trending-title">Trending domestic destinations</h2>
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
                <Link to={destination.path} className="domestic-trending-link">
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
