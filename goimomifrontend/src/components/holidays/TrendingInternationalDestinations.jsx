import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hotels } from '../../pages/Holidays/Azerbaijan/azerbaijanData';
import './TrendingDomesticDestinations.css';

const highlights = ['4 nights / 5 days', 'Baku, Shahdag & Absheron', 'Private transfers & breakfast'];
const startingPrice = Math.min(...hotels.map(hotel => hotel.price / 2));

export default function TrendingInternationalDestinations() {
  return (
    <section className="domestic-trending-section international-trending-section" aria-labelledby="international-trending-title">
      <div className="domestic-trending-container">
        <div className="domestic-trending-heading">
          <div>
            <span className="domestic-trending-eyebrow">DISCOVER BEYOND BORDERS</span>
            <h2 id="international-trending-title">Trending International Destination</h2>
          </div>
          <p>Discover your next international escape, thoughtfully planned for you.</p>
        </div>
        <div className="domestic-trending-grid international-trending-grid">
          <article className="domestic-trending-card">
            <div className="domestic-trending-photo">
              <img src="/images/azerbaijan/baku-hero.webp" alt="Baku-inspired skyline with the Flame Towers and Caspian waterfront at sunset" loading="lazy" decoding="async" width="1672" height="941" />
              <div className="domestic-trending-price">
                <span>Starting From</span>
                <strong>₹{startingPrice.toLocaleString('en-IN')}</strong>
                <small>Per Person</small>
              </div>
            </div>
            <div className="domestic-trending-card-body">
              <span className="domestic-trending-region">Baku & the Caucasus</span>
              <h3>Azerbaijan</h3>
              <p>Discover Baku's skyline, mountain scenery and the Land of Fire.</p>
              <ul className="domestic-trending-highlights">
                {highlights.map(highlight => <li key={highlight}><CheckCircle2 size={15} aria-hidden="true" />{highlight}</li>)}
              </ul>
              <Link to="/azerbaijan" className="domestic-trending-link"><span>Explore Azerbaijan</span><ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
