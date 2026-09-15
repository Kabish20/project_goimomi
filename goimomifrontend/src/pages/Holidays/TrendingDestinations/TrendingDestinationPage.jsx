import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass, Globe2, Headphones, MapPin, Mountain, Phone, Search, SlidersHorizontal } from 'lucide-react';
import usePageSEO from '../../../hooks/usePageSEO';
import './trendingDestinations.css';

export default function TrendingDestinationPage({ kind, title, eyebrow, headline, introduction, hero, heroAlt, heroCaption, destinations }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const domestic = kind === 'Domestic';
  const regions = [...new Set(destinations.map(destination => destination.region))];
  const filtered = destinations.filter(destination => (region === 'All regions' || destination.region === region) && `${destination.name} ${destination.country} ${destination.region} ${destination.highlights.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
  usePageSEO(`${title} | Goimomi Holidays`, introduction, domestic ? '/images/kashmir/dal-lake-social.jpg' : hero, `${kind.toLowerCase()} holiday destinations, ${destinations.map(destination => destination.name).join(', ')}, Goimomi Holidays`);

  return <div className={`trending-page ${domestic ? 'trending-domestic' : 'trending-international'}`}>
    <section className="td-hero" aria-labelledby="td-heading">
      <img src={hero} alt={heroAlt} className="td-hero-image" fetchPriority="high" />
      <div className="td-hero-overlay" />
      <div className="td-container td-hero-content">
        <div className="td-breadcrumb"><Link to="/holidayhome">Goimomi Holidays</Link><span>/</span><span>{kind} destinations</span></div>
        <span className="td-eyebrow">{eyebrow}</span>
        <h1 id="td-heading">{headline}</h1>
        <p>{introduction}</p>
        <a className="td-button td-button-gold" href="#destination-collection">Explore {kind.toLowerCase()} escapes <ArrowRight size={18} /></a>
        <div className="td-hero-caption"><MapPin size={13} />{heroCaption}</div>
      </div>
    </section>

    <nav className="td-collection-nav" aria-label="Destination collections"><div className="td-container"><Link to="/trendingdomesticdestination" aria-current={domestic ? 'page' : undefined}><Mountain size={18} /> Trending Domestic Destination</Link><Link to="/trendinginternationaldestination" aria-current={!domestic ? 'page' : undefined}><Globe2 size={18} /> Trending International Destination</Link></div></nav>

    <section id="destination-collection" className="td-container td-section">
      <div className="td-section-heading"><div><span className="td-eyebrow">THE GOIMOMI DESTINATION COLLECTION</span><h2>{title}</h2></div><p>{domestic ? 'Beautiful places, closer to home. Choose where your next story begins.' : 'Follow your curiosity. Discover somewhere you’ve always wanted to go.'}</p></div>
      <div className="td-search-bar"><label className="td-search" htmlFor="td-search"><Search size={19} /><input id="td-search" type="search" placeholder="Search a destination or experience" value={query} onChange={event => setQuery(event.target.value)} /></label><label className="td-region" htmlFor="td-region"><SlidersHorizontal size={17} /><span className="sr-only">Filter by region</span><select id="td-region" value={region} onChange={event => setRegion(event.target.value)}><option>All regions</option>{regions.map(value => <option key={value}>{value}</option>)}</select></label></div>
      <p className="td-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'} to discover</p>
      <div className="td-destination-grid">{filtered.map(destination => <article className="td-card" key={destination.name}>
        <Link className="td-card-image" to={destination.path || `/holidays?category=${kind}`} state={destination.path ? undefined : { filter: destination.name }} aria-label={`Explore ${destination.name} packages`}><img src={destination.image} alt={`${destination.name} destination inspiration`} loading="lazy" /><span className="td-country"><MapPin size={12} />{destination.country}</span>{destination.price && <span className="td-featured-badge">FEATURED ESCAPE</span>}</Link>
        <div className="td-card-body"><span className="td-eyebrow">{destination.region}</span><h3>{destination.name}</h3><p>{destination.description}</p><ul>{destination.highlights.map(highlight => <li key={highlight}><Check size={13} />{highlight}</li>)}</ul><div className="td-card-footer"><span>{destination.price ? <>From <strong>{destination.price}</strong><small>{destination.priceLabel || 'per person'}</small></> : <><strong>Your holiday, your way</strong><small>Explore packages & request a quote</small></>}</span><Link to={destination.path || `/holidays?category=${kind}`} state={destination.path ? undefined : { filter: destination.name }} aria-label={`View ${destination.name} packages`}><ArrowRight size={21} /></Link></div>{destination.imageNote && <small className="td-image-note">{destination.imageNote}</small>}</div>
      </article>)}</div>
      {filtered.length === 0 && <div className="td-empty"><Compass size={36} /><h3>A different direction?</h3><p>No destinations match your search. Try another name or explore the full collection.</p><button className="td-button td-button-green" onClick={() => { setQuery(''); setRegion('All regions'); }}>Show all destinations</button></div>}
      <p className="td-collection-note">A curated collection for travel inspiration. Package availability, activities and final prices are confirmed when you enquire.</p>
    </section>

    {domestic && <section className="td-feature-section"><div className="td-container td-feature-grid"><img src="/images/kashmir/dal-lake-hero.webp" alt="AI-generated shikara scene inspired by Dal Lake, Kashmir" loading="lazy" /><div><span className="td-eyebrow">IN THE SPOTLIGHT · KASHMIR</span><h2>Five days.<br /><em>Memories for much longer.</em></h2><p>Srinagar · Sonmarg · Gulmarg · Pahalgam</p><p>Make Srinagar your base for four nights, with breakfast and dinner included. Choose shared sightseeing or the freedom of your own private vehicle.</p><div className="td-package-prices"><div><small>BUDGET PACKAGE</small><strong>₹6,499 <span>/ person</span></strong><p>Shared SIC sightseeing</p></div><div><small>PRIVATE LEISURE</small><strong>₹9,034 <span>onwards / person</span></strong><p>Your own cab & timings</p></div></div><p className="td-price-note">Private starting rate: 03★ Basic, Tempo Traveller, minimum 12 guests, twin sharing. Budget airport transfers excluded; private airport transfers included.</p><Link to="/kashmir" className="td-button td-button-green">See the complete Kashmir package <ArrowRight size={17} /></Link></div></div></section>}

    <section className="td-container td-section td-plan-section"><div><span className="td-eyebrow">THOUGHTFULLY PLANNED, FROM THE START.</span><h2>A little help.<br /><em>A better holiday.</em></h2><p>Bring your ideas. We’ll help you find the right journey.</p></div><div className="td-plan-items">{[[Compass, 'Choose your destination', 'Explore the places that speak to you and browse the available holiday options.'], [SlidersHorizontal, 'Make it your own', 'Share your dates, group size and preferences for a personalised quote.'], [Headphones, 'Plan with our team', 'Confirm your itinerary, accommodation, inclusions and travel arrangements before booking.']].map(([Icon, label, detail]) => <div key={label}><Icon size={23} /><span><h3>{label}</h3><p>{detail}</p></span></div>)}</div></section>
    <section className="td-cta"><div className="td-container"><div><span className="td-eyebrow">LET’S TURN SOMEDAY INTO A PLAN.</span><h2>Wherever you’re dreaming of,<br /><em>let’s get you there.</em></h2></div><div className="td-cta-actions"><Link className="td-button td-button-gold" to="/customizedHolidays">Plan a personalised holiday <ArrowRight size={18} /></Link><a href="tel:+918110082222"><Phone size={16} />+91 8110082222</a></div></div></section>
  </div>;
}
