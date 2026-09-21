import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CarFront, Check, ChevronRight, Clock3, Hotel, MapPin, Phone, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import TrendingDomesticDestinations from '../../../components/holidays/TrendingDomesticDestinations';
import usePageSEO from '../../../hooks/usePageSEO';
import api from '../../../api';
import '../TrendingDestinations/trendingDestinations.css';
import './GoldenTriangle.css';

const heroImage = '/images/trending/golden-triangle-tour.jpg';

const itinerary = [
  {
    day: 'Day 01',
    title: 'Delhi Arrival & Sightseeing',
    description: 'Meet our representative at Delhi Airport, railway station or hotel. Explore India Gate, Qutub Minar, Lotus Temple and Red Fort, then transfer to your hotel. Overnight stay: Delhi.',
    highlights: ['Airport / station pickup', 'Delhi city highlights', 'Hotel check-in'],
  },
  {
    day: 'Day 02',
    title: 'Delhi to Agra',
    description: 'Drive to Agra after breakfast and discover the Taj Mahal, Agra Fort, Mehtab Bagh and the local market in a memorable day.',
    highlights: ['Approx. 230 km / 4–5 hours', 'Taj Mahal visit', 'Agra overnight stay'],
  },
  {
    day: 'Day 03',
    title: 'Agra to Jaipur via Fatehpur Sikri',
    description: 'After breakfast, check out and continue to Jaipur with a stop at Fatehpur Sikri. Check in and explore Jaipur Local Market if time permits. Overnight stay: Jaipur.',
    highlights: ['Approx. 240 km / 5–6 hours', 'Fatehpur Sikri', 'Jaipur hotel stay'],
  },
  {
    day: 'Day 04',
    title: 'Jaipur Local Sightseeing',
    description: 'Discover Jaipur’s royal heritage with Amber Fort, Jal Mahal, City Palace, Jantar Mantar, Hawa Mahal and local markets.',
    highlights: ['Amber Fort', 'City Palace', 'Overnight stay: Jaipur'],
  },
  {
    day: 'Day 05',
    title: 'Jaipur to Delhi Departure',
    description: 'After breakfast, head back to Delhi and get dropped at the airport, railway station or hotel as per your travel plan.',
    highlights: ['Approx. 280 km / 5–6 hours', 'Departure transfer', 'Tour ends'],
  },
];

const packagesData = {
  budget: {
    name: 'Budget Package',
    tag: 'Package 01',
    description: 'Comfortable deluxe stays, private vehicle, breakfasts & dinners for an authentic Golden Triangle journey.',
    startingPrice: '₹14,650',
    options: [
      {
        guests: '2 Guests',
        config: '01 Room · Sedan Car',
        price: '₹19,800',
        label: 'Per Person',
        note: 'Best for couples seeking a comfortable Golden Triangle escape.',
      },
      {
        guests: '4 Guests',
        config: '02 Rooms · Sedan Car',
        price: '₹16,500',
        label: 'Per Person',
        note: 'Great value for friends or small families travelling together.',
      },
      {
        guests: '6 Guests',
        config: '03 Rooms · Ertiga',
        price: '₹14,650',
        label: 'Per Person',
        note: 'Maximum comfort and space with private Ertiga cab for your group.',
      },
    ],
    hotels: [
      { city: 'Delhi', options: 'Hotel Liwasa Inn / Hotel Red Castle / Hotel Arch International', room: 'Deluxe Room / Similar Category' },
      { city: 'Agra', options: 'Hotel Light House / Hotel Taj Vilas', room: 'Deluxe Room / Similar Category' },
      { city: 'Jaipur', options: 'Hotel Laxmi Niwas', room: 'Deluxe Room / Similar Category' },
    ],
  },
  leisure: {
    name: 'Private Leisure Package',
    tag: 'Package 02',
    description: 'Upgraded handpicked deluxe properties with seamless private transportation and premium hospitality.',
    startingPrice: '₹17,600',
    options: [
      {
        guests: '2 Guests',
        config: '01 Room · Sedan Car',
        price: '₹22,000',
        label: 'Per Person',
        note: 'Executive couple getaway with handpicked premium deluxe stays.',
      },
      {
        guests: '4 Guests',
        config: '02 Rooms · Sedan Car',
        price: '₹19,250',
        label: 'Per Person',
        note: 'A smooth, premium travel rhythm with deluxe stays and private transfers.',
      },
      {
        guests: '6 Guests',
        config: '03 Rooms · Ertiga',
        price: '₹17,600',
        label: 'Per Person',
        note: 'Premium family getaway with roomier Ertiga cab and superior comfort.',
      },
    ],
    hotels: [
      { city: 'Delhi', options: 'Hotel Triple Tree / Arch The Lohias', room: 'Deluxe Room / Similar Category' },
      { city: 'Agra', options: 'Hotel Atulyaa Taj', room: 'Deluxe Room / Similar Category' },
      { city: 'Jaipur', options: 'Hotel Laxmi Palace / Hotel Regenta Jaipur / Hotel Aarna Premier, Jagatpura', room: 'Deluxe Room / Similar Category' },
    ],
  },
};

const packageInclusions = [
  'Delhi pickup as per arrival details',
  'Delhi drop as per departure details',
  '01 Night accommodation in Delhi',
  '01 Night accommodation in Agra',
  '02 Nights accommodation in Jaipur',
  '04 Breakfasts',
  '04 Dinners',
  '04 Nights hotel accommodation',
  'Private cab for 05 Days as per the itinerary',
  'Driver allowance',
  'Toll charges',
  'Parking charges',
  'Transportation for the sightseeing mentioned in the itinerary',
];

const packageExclusions = [
  'Airfare / Train Fare',
  'Lunch',
  'Monument and sightseeing entrance tickets',
  'Camera / Video charges',
  'Adventure activity charges',
  'Personal expenses',
  'Hotel room heater charges, if applicable',
  'Additional sightseeing not mentioned in the itinerary',
  'Night travel charges, if applicable',
  'Any expenses arising due to weather conditions, road closures, delays or circumstances beyond our control',
  'Anything not specifically mentioned under Package Inclusions',
];

export default function GoldenTriangle() {
  const [selectedPlan, setSelectedPlan] = useState('budget');
  const currentPlan = packagesData[selectedPlan];
  const [groupIndex, setGroupIndex] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [status, setStatus] = useState('idle');
  const selectedGroup = currentPlan.options[groupIndex];
  const updateForm = event => setForm(value => ({ ...value, [event.target.name]: event.target.value }));
  const submitEnquiry = async event => {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    const adults = [2, 4, 6][groupIndex];
    const perPerson = Number(selectedGroup.price.replace(/\D/g, ''));
    try {
      await api.post('/api/holiday-form/', {
        package_type: `Delhi Agra Jaipur - ${currentPlan.name}`,
        start_city: 'Delhi', nationality: 'Not specified', travel_date: form.date,
        rooms: adults / 2, adults, children: 0, nights: 4,
        star_rating: 'Unrated', holiday_type: 'Domestic', budget: String(perPerson * adults),
        full_name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        room_type: 'Deluxe Room / Similar Category', meal_plan: '4 breakfasts and 4 dinners',
        transfer_details: `${adults === 6 ? 'Ertiga' : 'Sedan'} for 5 days; Delhi pickup and drop`,
        cities: [{ destination: 'Delhi', nights: 1 }, { destination: 'Agra', nights: 1 }, { destination: 'Jaipur', nights: 2 }],
        message: `Golden Triangle enquiry. ${currentPlan.name}; ${selectedGroup.config}; starting at INR ${perPerson} per person for ${adults} guests. Subject to availability.\n${form.message}`,
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  usePageSEO(
    'Delhi Agra Jaipur Tour Package | Golden Triangle 4N / 5D | Goimomi',
    'Explore the Golden Triangle with Delhi, Agra and Jaipur in 4 nights / 5 days. Includes hotel stays, private cab, breakfasts, dinners and well-planned heritage sightseeing.',
    heroImage,
    'Delhi Agra Jaipur tour package, Golden Triangle holiday, India heritage tour, Jaipur trip, Taj Mahal package'
  );

  return (
    <div className="gt-page trending-page">
      <section className="td-hero gt-hero" aria-labelledby="gt-title">
        <img className="td-hero-image" src={heroImage} alt="Golden Triangle tour featuring Delhi Red Fort, Agra Taj Mahal and Jaipur Hawa Mahal" fetchPriority="high" width="1600" height="1000" />
        <div className="td-hero-overlay" />
        <div className="td-container td-hero-content">
          <div className="td-breadcrumb">
            <Link to="/holidayhome">Goimomi Holidays</Link>
            <span>/</span>
            <span>Golden Triangle</span>
          </div>
          <span className="td-eyebrow">ICONIC INDIA HERITAGE ROUTE</span>
          <h1 id="gt-title">Discover the <em>Golden Triangle.</em></h1>
          <p>Delhi, Agra and Jaipur come together in one unforgettable journey through imperial history, Mughal architecture and Rajasthan’s royal charm.</p>
          <div className="gt-hero-chips">
            <span><MapPin size={15} /> Delhi → Agra → Jaipur → Delhi</span>
            <span><CalendarDays size={15} /> 4 Nights / 5 Days</span>
          </div>
          <div className="gt-hero-actions">
            <a className="td-button td-button-gold" href="#packages">Browse packages <ArrowRight size={18} /></a>
            <a className="gt-hero-link" href="#itinerary">View itinerary <ChevronRight size={16} /></a>
          </div>
          <div className="gt-hero-bottom">
            <span><Clock3 size={16} /> 5 days</span>
            <span>From <strong>₹14,650</strong> <small>/ person</small></span>
          </div>
          <small>Illustrative route artwork</small>
        </div>
      </section>

      <section className="gt-why gt-section td-container" aria-label="Why choose this route">
        <div className="gt-intro">
          <span className="td-eyebrow">WHY THIS JOURNEY</span>
          <h2>Experience India’s most iconic heritage circuit.</h2>
        </div>
        <div className="gt-feature-grid">
          {[
            ['Taj Mahal', 'Witness the world-famous marble monument in Agra, one of the most iconic sights in India.'],
            ['Historical Capital', 'Explore the layered history of Delhi through its UNESCO landmarks and key city landmarks.'],
            ['Royal Jaipur', 'Enjoy the Pink City’s forts, palaces, observatories and vibrant local culture.'],
          ].map(([title, desc]) => (
            <article key={title} className="gt-feature-card">
              <span className="gt-feature-icon"><Sparkles size={18} /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="packages" className="gt-section td-container">
        <div className="td-section-heading">
          <div>
            <span className="td-eyebrow">PACKAGE OPTIONS</span>
            <h2>Choose the best fit for your group.</h2>
          </div>
          <p>Comfortable hotel stays, meals, private cab and heritage sightseeing across Delhi, Agra and Jaipur.</p>
        </div>

        <div className="gt-package-tabs" role="tablist" aria-label="Package category selection">
          <button
            type="button"
            role="tab" aria-selected={selectedPlan === 'budget'}
            className={`gt-package-tab ${selectedPlan === 'budget' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('budget')}
          >
            Budget Package (From ₹14,650)
          </button>
          <button
            type="button"
            role="tab" aria-selected={selectedPlan === 'leisure'}
            className={`gt-package-tab ${selectedPlan === 'leisure' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('leisure')}
          >
            Private Leisure Package (From ₹17,600)
          </button>
        </div>

        <div className="gt-package-grid">
          {currentPlan.options.map((pkg, index) => (
            <article key={pkg.guests} className="gt-package-card">
              <div className="gt-package-top">
                <span className="gt-tag">{pkg.guests}</span>
                <span className="gt-spec">{pkg.config}</span>
              </div>
              <h3>{currentPlan.name}</h3>
              <div className="gt-price-row">
                <span>From</span>
                <strong>{pkg.price}</strong>
                <span>{pkg.label}</span>
              </div>
              <p>{pkg.note}</p>
              <a className="td-button td-button-green" href="#enquire" onClick={() => { setGroupIndex(index); setStatus('idle'); }}>Plan this trip <ArrowRight size={17} /></a>
            </article>
          ))}
        </div>

        <div className="gt-hotel-section">
          <div className="td-section-heading" style={{ marginTop: '40px', marginBottom: '20px' }}>
            <div>
              <span className="td-eyebrow">HOTEL OPTIONS — {currentPlan.tag.toUpperCase()}</span>
              <h3 style={{ fontSize: '1.7rem', margin: '6px 0 0' }}>Deluxe Accommodation Options</h3>
            </div>
            <p>Proposed hotels in Delhi, Agra and Jaipur. Deluxe Room or similar category, subject to availability.</p>
          </div>
          <div className="gt-hotel-grid">
            {currentPlan.hotels.map((h) => (
              <div key={h.city} className="gt-hotel-card">
                <h4>{h.city}</h4>
                <p><strong>{h.options}</strong></p>
                <small style={{ display: 'block', marginTop: '6px', color: '#668076' }}>{h.room}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="itinerary" className="gt-section td-container">
        <div className="td-section-heading">
          <div>
            <span className="td-eyebrow">ITINERARY</span>
            <h2>Your 5-day heritage journey.</h2>
          </div>
          <p>Explore the highlights without rushing, with well-paced transfers and overnight stays.</p>
        </div>

        <div className="gt-itinerary-list">
          {itinerary.map((item) => (
            <article key={item.day} className="gt-day-card">
              <div className="gt-day-header">
                <span className="gt-day-badge">{item.day}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.description}</p>
              <div className="gt-badges">
                {item.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gt-section td-container">
        <div className="gt-info-grid">
          <article className="gt-panel">
            <span className="td-eyebrow">STAY & TRAVEL</span>
            <h3>Accommodation Plan</h3>
            <ul className="gt-list">
              <li><Hotel size={15} /><strong>Delhi:</strong> 01 Night</li>
              <li><Hotel size={15} /><strong>Agra:</strong> 01 Night</li>
              <li><Hotel size={15} /><strong>Jaipur:</strong> 02 Nights</li>
              <li><Clock3 size={15} /><strong>Total Duration:</strong> 04 Nights / 05 Days</li>
            </ul>
          </article>

          <article className="gt-panel">
            <span className="td-eyebrow">INCLUSIONS</span>
            <h3>Package Inclusions</h3>
            <ul className="gt-list">
              {packageInclusions.map((item) => (
                <li key={item}><Check size={15} />{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="gt-exclusions">
          <h3>Package Exclusions</h3>
          <ul>
            {packageExclusions.map((item) => (
              <li key={item}><X size={15} />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="enquire" className="gt-enquire-section">
        <div className="td-container gt-enquire-inner">
          <div>
            <span className="td-eyebrow">START YOUR JOURNEY</span>
            <h2>Let’s plan your Golden Triangle getaway.</h2>
            <p>Speak with our travel team for availability, room preferences and a personalised quote.</p>
            <div className="gt-callout">
              <Phone size={20} />
              <a href="tel:+918110082222">+91 8110082222</a>
            </div>
          </div>

          <div className="gt-enquire-card">
            <div className="gt-cards">
              <div>
                <ShieldCheck size={18} />
                <span>Private cab included</span>
              </div>
              <div>
                <CarFront size={18} />
                <span>Multiple group options</span>
              </div>
              <div>
                <Users size={18} />
                <span>Flights / rail not included</span>
              </div>
            </div>
            <form className="gt-enquiry-form" onSubmit={submitEnquiry}>
              <p><strong>{currentPlan.name}</strong> · {selectedGroup.price} per person, starting price</p>
              <label>Group size<select value={groupIndex} onChange={event => { setGroupIndex(Number(event.target.value)); setStatus('idle'); }} disabled={status === 'submitting'}>{currentPlan.options.map((option, index) => <option key={option.guests} value={index}>{option.guests} — {option.config}</option>)}</select></label>
              <label>Full name<input name="name" value={form.name} onChange={updateForm} required autoComplete="name" maxLength={100} /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={updateForm} required autoComplete="email" /></label>
              <label>Phone<input name="phone" type="tel" value={form.phone} onChange={updateForm} required autoComplete="tel" pattern="[+0-9 ()-]{10,20}" maxLength={20} /></label>
              <label>Travel date<input name="date" type="date" value={form.date} onChange={updateForm} required min={new Date().toLocaleDateString('en-CA')} /></label>
              <label>Message<textarea name="message" value={form.message} onChange={updateForm} rows={3} /></label>
              <button type="submit" className="td-button td-button-gold" disabled={status === 'submitting' || status === 'success'}>{status === 'submitting' ? 'Sending…' : status === 'success' ? 'Enquiry received' : 'Request a quote'} <ArrowRight size={17} /></button>
              {status === 'success' && <p role="status">Your enquiry has been received. Our team will contact you to confirm availability.</p>}
              {status === 'error' && <p role="alert">We couldn’t submit your enquiry. Please try again or call +91 8110082222.</p>}
            </form>
          </div>
        </div>
      </section>

      <TrendingDomesticDestinations />
    </div>
  );
}
