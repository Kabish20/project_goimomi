import { Link } from 'react-router-dom';
import TrendingDomesticDestinations from '../../../components/holidays/TrendingDomesticDestinations';
import usePageSEO from '../../../hooks/usePageSEO';
import './trendingCollections.css';

export default function TrendingDomestic() {
  usePageSEO('Trending Domestic Holidays | Goimomi', 'Explore Kerala, Kashmir, Manali, Assam and Meghalaya, Andaman and Goa with our curated domestic holiday packages.', '/images/kerala/kerala-backwaters-hero.png');
  return <main className="trending-collection-page">
    <header className="trending-collection-intro"><nav aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/holidays?category=Domestic">Domestic Holidays</Link></nav><h1>Trending Domestic</h1><p>Find your next escape, closer to home.</p><Link to="/trendinginternationaldestination">Explore international holidays →</Link></header>
    <TrendingDomesticDestinations layout="grid" />
  </main>;
}
