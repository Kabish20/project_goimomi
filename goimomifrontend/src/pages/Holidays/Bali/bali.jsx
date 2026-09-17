import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CarFront, Check, ChevronDown, Coffee, Hotel, MapPin, Phone, ShieldCheck, Ship } from 'lucide-react';
import api from '../../../api';
import usePageSEO from '../../../hooks/usePageSEO';
import TrendingInternationalDestinations from '../../../components/holidays/TrendingInternationalDestinations';
import { days, inclusions, rupees, trip } from './baliData';
import '../TrendingDestinations/trendingDestinations.css';
import './bali.css';

export default function Bali() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  usePageSEO('Bali Special Package | 5 Days / 4 Nights from ₹24,570 | Goimomi', 'Discover Ubud, Kintamani, Nusa Penida and South Bali with 4 nights at Bliss Surfer Hotel or similar, private transfers, fast boats, breakfast and a Nusa Penida lunch.', trip.image, 'Bali package, Ubud, Kintamani, Nusa Penida, Uluwatu, Bliss Surfer Hotel');
  const updateForm = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submitEnquiry = async event => {
    event.preventDefault();
    if (status === 'submitting') return;
    if (!form.name.trim() || !/^[+0-9 ()-]+$/.test(form.phone) || form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter your name and a phone number with at least 10 digits.'); return;
    }
    if (!form.date || form.date < minDate) { setError('Please select today or a future travel date.'); return; }
    setStatus('submitting'); setError('');
    try {
      await api.post('/api/holiday-form/', {
        package_type: trip.name, start_city: 'Bali · Ngurah Rai International Airport', nationality: 'Not specified',
        travel_date: form.date, rooms: 1, adults: 2, children: 0, star_rating: 'Unrated', holiday_type: 'International',
        budget: String(trip.pricePerAdult * trip.adults), full_name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), nights: 4,
        cities: [{ destination: 'Bali', nights: 4 }], room_details: [{ adults: 2, children: 0, child_ages: [] }],
        room_type: 'Superior Room · twin sharing', meal_plan: '4 breakfasts + 1 lunch in Nusa Penida',
        transfer_details: 'Private Toyota Avanza; return fast boat; private vehicle in Nusa Penida',
        message: [`Source: Bali package page. ${trip.hotel}. 5 days / 4 nights, 1 Superior Room for 2 adults.`, `${rupees(trip.pricePerAdult)} per adult based on twin sharing. Total for two adults: ${rupees(trip.pricePerAdult * 2)}.`, 'Requested dates, hotel and final quotation subject to confirmation. Jimbaran seafood dinner not included.', form.message.trim()].filter(Boolean).join('\n'),
      });
      setStatus('success');
    } catch { setError('We could not send your enquiry. Please try again or call +91 8110082222.'); setStatus('error'); }
  };

  return <div className="trending-page bali-page">
    <section className="td-hero bl-hero" aria-labelledby="bl-title">
      <img className="td-hero-image" src={trip.image} alt="Bali-inspired view of Kelingking Beach’s green cliffs and turquoise sea on Nusa Penida" width="1672" height="941" fetchPriority="high" />
      <div className="td-hero-overlay" />
      <div className="td-container td-hero-content">
        <div className="td-breadcrumb"><Link to="/holidays?category=International">International Holidays</Link><span>/</span><span>Bali</span></div>
        <span className="td-eyebrow">BALI SPECIAL · FIVE DAYS OF ISLAND DISCOVERY</span>
        <h1 id="bl-title">A little Bali.<br /><em>A world of wonder.</em></h1>
        <p>Rice terraces, temple sunsets and the wild beauty of Nusa Penida. Experience the island in five carefully planned days, with your own private transfers.</p>
        <div className="bl-hero-actions"><a href="#bl-itinerary" className="td-button td-button-gold">Explore your journey <ArrowRight size={17} /></a><span>Starting from <strong>{rupees(trip.pricePerAdult)}</strong><small>per person</small></span></div>
        <div className="td-hero-caption"><MapPin size={13} />Inspired by Kelingking Beach · Nusa Penida</div>
      </div>
    </section>
    <div className="td-container bl-facts">{[[Hotel, '4 nights in Bali', '1 Superior Room'], [CarFront, 'Private Toyota Avanza', 'Tours & airport transfers'], [Coffee, '4 breakfasts + 1 lunch', 'Lunch in Nusa Penida'], [Ship, 'Nusa Penida included', 'Return fast boat tickets']].map(([Icon, title, detail]) => <div key={title}><Icon size={24} /><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div>
    <nav className="bl-nav" aria-label="Bali package sections"><div className="td-container">{[['bl-overview', 'Overview'], ['bl-itinerary', 'Itinerary'], ['bl-stay', 'Stay & price'], ['bl-inclusions', 'Inclusions'], ['bl-enquire', 'Enquire now']].map(([id, title]) => <a href={`#${id}`} key={id}>{title}</a>)}</div></nav>

    <section id="bl-overview" className="td-container td-section bl-overview"><div><span className="td-eyebrow">FROM UBUD’S GREENS TO PENIDA’S BLUES</span><h2>Every day, <em>a different Bali.</em></h2></div><div><p>Begin with a warm airport welcome, then discover Central Bali, cross the sea to Nusa Penida and spend a day exploring the south. Your hotel, private transport and selected experiences bring the journey together.</p><div className="bl-route"><MapPin size={18} />Arrival → Ubud & Kintamani → Nusa Penida → South Bali → Departure</div></div></section>
    <section id="bl-itinerary" className="bl-soft"><div className="td-container td-section"><div className="td-section-heading"><div><span className="td-eyebrow">5 DAYS / 4 NIGHTS</span><h2>Your island story, <em>day by day.</em></h2></div><p>A blend of landscapes, local discoveries and coastal moments, with private tours and transfers.</p></div><div className="bl-itinerary"><aside className="bl-journey-photo"><img src={trip.image} alt="Illustrative Nusa Penida cliffside above a sandy cove" loading="lazy" /><div><Ship size={28} /><h3>Beyond the shoreline.</h3><p>Nusa Penida west coast · Day 3</p></div></aside><div className="bl-days">{days.map((day, index) => <details className="bl-day" key={day.title} open={index === 0}><summary><span className="bl-day-number">DAY<strong>{String(index + 1).padStart(2, '0')}</strong></span><span><small>{day.timing}</small><h3>{day.title}</h3></span><ChevronDown size={18} /></summary><div className="bl-day-body"><p>{day.description}</p><ul>{day.highlights.map(item => <li key={item}><Check size={14} />{item}</li>)}</ul><p className="bl-day-note">{day.note}</p></div></details>)}</div></div></div></section>

    <section id="bl-stay" className="td-container td-section"><div className="td-section-heading"><div><span className="td-eyebrow">YOUR HOME ON THE ISLAND</span><h2>Settle in. <em>Set out.</em></h2></div><p>Four nights, one Superior Room, and time to discover Bali together.</p></div><div className="bl-stay"><div><Hotel size={30} /><h3>{trip.hotel}</h3><p>{trip.room} · 4 nights · 2 adults</p><ul><li><Check size={16} />4 complimentary breakfasts, subject to hotel timings</li><li><Check size={16} />Breakfast box before the early Nusa Penida tour</li><li><Check size={16} />Standard check-in: 2:00 PM</li></ul><p className="bl-fine">Early arrivals may wait in the lobby until the room is ready. Hotel and travel dates are subject to confirmation.</p></div><div className="bl-price"><span>BALI SPECIAL PACKAGE</span><strong>{rupees(trip.pricePerAdult)}</strong><small>per adult · based on twin sharing</small><p>{rupees(trip.pricePerAdult * 2)} for 2 adults</p><a href="#bl-enquire" className="td-button td-button-green">Enquire about this stay <ArrowRight size={16} /></a></div></div></section>

    <section id="bl-inclusions" className="bl-soft"><div className="td-container td-section"><span className="td-eyebrow">KNOW YOUR PACKAGE</span><h2>The essentials, <em>already arranged.</em></h2><div className="bl-inclusions"><article><h3>Included in your holiday</h3><ul>{inclusions.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul></article><article><h3>Good to know</h3><div className="bl-info"><CalendarDays size={20} /><p>Ubud & Kintamani and South Bali tours each last approximately 10 hours. The Nusa Penida day starts at 6:00 AM.</p></div><div className="bl-info"><Coffee size={20} /><p>Jimbaran seafood dinner is not included. The meal plan covers 4 breakfasts and 1 lunch in Nusa Penida.</p></div><div className="bl-info"><CarFront size={20} /><p>Your Bali tours and transfers use a private Toyota Avanza. A private vehicle is also included for Nusa Penida sightseeing.</p></div><p className="bl-fine">Flights, visa arrangements, other meals and additional activities are not listed in this package brief. Ask our team to confirm any extras, travel-date availability and the final quote.</p></article></div></div></section>

    <section id="bl-enquire" className="bl-enquire"><div className="td-container bl-enquire-grid"><div><span className="td-eyebrow">LET’S TAKE YOU TO BALI</span><h2>Your next chapter.<br /><em>An island away.</em></h2><p>Share your preferred dates and flight details. Our team will help confirm your stay and plan your Bali escape.</p><div className="bl-enquiry-summary"><strong>{trip.hotel}</strong><span>5 days / 4 nights · 1 Superior Room · 2 adults</span><p>{rupees(trip.pricePerAdult)} <small>per adult · twin sharing</small></p><span>Total for 2 adults: {rupees(trip.pricePerAdult * 2)}</span></div><a className="bl-phone" href="tel:+918110082222"><Phone size={20} />+91 8110082222</a></div><div className="bl-form-card">{status === 'success' ? <div className="bl-success" role="status"><ShieldCheck size={42} /><h3>Your Bali enquiry is in.</h3><p>Our team will contact you about your dates and package availability.</p><button type="button" className="td-button td-button-green" onClick={() => setStatus('idle')}>Make another enquiry</button></div> : <form onSubmit={submitEnquiry}><h3>Plan your Bali holiday</h3><p>Enquiry only · no payment required</p><fieldset disabled={status === 'submitting'}><div className="bl-form-row"><label htmlFor="bl-name">Full name<input id="bl-name" name="name" value={form.name} onChange={updateForm} autoComplete="name" maxLength={100} required /></label><label htmlFor="bl-phone">Phone number<input id="bl-phone" name="phone" value={form.phone} onChange={updateForm} type="tel" autoComplete="tel" maxLength={20} required /></label></div><label htmlFor="bl-email">Email address<input id="bl-email" name="email" value={form.email} onChange={updateForm} type="email" autoComplete="email" required /></label><label htmlFor="bl-date">Preferred travel date<input id="bl-date" name="date" value={form.date} onChange={updateForm} type="date" min={minDate} required /></label><label htmlFor="bl-message">Anything else? <span>(optional)</span><textarea id="bl-message" name="message" value={form.message} onChange={updateForm} rows={3} maxLength={2000} placeholder="Flight timings, room preferences or questions" /></label>{error && <p role="alert" className="bl-error">{error}</p>}<button className="td-button td-button-green" type="submit">{status === 'submitting' ? 'Sending your enquiry…' : 'Enquire about Bali'}<ArrowRight size={16} /></button><p className="bl-privacy">By submitting, you agree to be contacted about your trip. <Link to="/privacy-policy">Privacy policy</Link></p></fieldset></form>}</div></div></section>
    <TrendingInternationalDestinations />
  </div>;
}
