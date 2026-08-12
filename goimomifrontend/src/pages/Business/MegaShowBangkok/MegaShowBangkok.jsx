import React, { useEffect } from 'react';
import megaheader from '../../../assets/megaheader.png';

const MegaShowBangkok = () => {
  useEffect(() => {
    try {
      const zf_frame = document.getElementById("ziframe_915123");
      if (zf_frame) {
        let ifrmSrc = zf_frame.src;
        if (!((new RegExp("[?&]referrername=")).test(ifrmSrc))) {
          let rfr = window.location.href;
          try {
            rfr = window.self !== window.top ? window.top.location.href : (/^https?:\/\/[\w.-]+\.[a-zA-Z]{2,}/i.test(rfr) ? rfr : "");
          } catch {
            // Accessing a parent window can fail for cross-origin embeds.
          }
          if (rfr && rfr !== "") {
            if (rfr.length > 1800) {
              let queryIndex = rfr.indexOf('?');
              if (queryIndex > -1) {
                rfr = rfr.substring(0, queryIndex);
              }
              if (rfr.length > 1800) {
                rfr = rfr.substring(0, 1800);
              }
            }
            ifrmSrc += ((ifrmSrc.indexOf('?') > 0) ? '&' : '?') + 'referrername=' + encodeURIComponent(rfr);
          }
        }
        if (zf_frame.src !== ifrmSrc) {
          zf_frame.src = ifrmSrc;
        }
      }
    } catch {
      // Leave the embedded form unchanged if its optional setup fails.
    }
  }, []);

  const faqs = [
    {
      q: "Is this package suitable for business buyers?",
      a: "Yes. The package is designed for business visitors, importers, distributors, e-commerce sellers, retailers and sourcing professionals."
    },
    {
      q: "Is flight ticket included?",
      a: "No. Flight ticket is not included, but GOIMOMI Holidays can assist with flight booking."
    },
    {
      q: "Is visa included?",
      a: "Visa is not included unless specifically mentioned. Visa assistance can be provided separately."
    },
    {
      q: "Is airport transfer included?",
      a: "Yes. Fixed airport transfers with meet & greet assistance are included."
    },
    {
      q: "Which package should I choose?",
      a: "Choose 3N Bangkok if your main focus is the exhibition. Choose 3N Bangkok + 2N Pattaya if you want to combine business meetings with leisure time."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={megaheader} alt="Mega Show Bangkok" className="w-full h-full object-cover object-center transform scale-105 animate-slowZoom" />
          <div className="absolute inset-0 bg-slate-900/70 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center mt-16">
          <span style={{ animationDelay: '100ms' }} className="fade-up inline-block py-1 px-4 mb-6 rounded-full bg-yellow-500/20 text-yellow-400 font-bold tracking-widest text-sm border border-yellow-500/30 uppercase backdrop-blur-sm animate-[pulse_3s_ease-in-out_infinite]">
            15–17 July 2026 • QSNCC, Bangkok
          </span>
          <h1 style={{ animationDelay: '300ms' }} className="fade-up text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-xl hover:scale-105 transition-transform duration-500">
            MEGA SHOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 inline-block hover:rotate-2 transition-transform duration-300">Bangkok 2026</span>
          </h1>
          <p style={{ animationDelay: '500ms' }} className="fade-up text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light drop-shadow-md">
            Attend Asia’s Leading B2B Sourcing Exhibition. Join global buyers, importers, and retailers with our premium Business Travel Packages.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#packages" className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-black rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide">
              Get Package Price
            </a>
            <a href="https://wa.me/918110082222" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold rounded-full hover:bg-white hover:text-slate-900 transition-all duration-300 uppercase tracking-wide flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
              WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      {/* 2. Important Event Highlights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase">Event <span className="text-yellow-600">Highlights</span></h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center fade-up">
            {[
              { label: "Dates", value: "15–17 July 2026", icon: "📅" },
              { label: "Venue", value: "QSNCC, Bangkok", icon: "🏛️" },
              { label: "Exhibitors", value: "1,200+", icon: "🏢" },
              { label: "Buyers Expected", value: "20,000+", icon: "👥" }
            ].map((stat, i) => (
              <div key={i} style={{ animationDelay: `${i * 150}ms` }} className="fade-up bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group">
                <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300 group-hover:rotate-6">{stat.icon}</div>
                <div className="text-2xl font-black text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Target Audience Section */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 fade-up">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Who Should <br /><span className="text-yellow-500">Attend?</span></h2>
              <p className="text-slate-300 text-lg font-light leading-relaxed mb-8">
                This exclusive event is perfectly tailored for business professionals seeking direct access to global suppliers, new product lines, and high-value sourcing networks.
              </p>
              <div className="w-16 h-1 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Importers & Distributors", "Retail Chain Owners", "Supermarket Buyers", "Amazon, Shopify & E-commerce Sellers",
                "Corporate Gifting Companies", "Home Décor & Lifestyle Stores", "Electronics & Appliance Traders",
                "Hardware, Outdoor & Tool Buyers", "Stationery, Toys & Edu Products"
              ].map((item, idx) => (
                <div key={idx} style={{ animationDelay: `${idx * 100}ms` }} className="fade-up flex items-center gap-4 bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4 rounded-xl hover:bg-slate-800 hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors duration-300">✓</div>
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Package Options */}
      <section id="packages" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase">Choose Your <span className="text-yellow-600">Package</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Select a package tailored for pure business sourcing or combine it with a well-deserved leisure retreat in Pattaya.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 fade-up">
            {/* Package 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 hover:shadow-2xl transition-shadow flex flex-col relative">
              <div className="h-56 bg-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-blue-900 opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
                  <div>
                    <div className="text-yellow-400 font-bold tracking-widest text-sm mb-2 uppercase">3 Nights / 4 Days</div>
                    <h3 className="text-3xl font-black mb-3">3N Bangkok<br />Business Package</h3>
                    <div className="text-2xl font-black text-white">₹33,499 <span className="text-sm font-normal text-slate-300">/ person</span></div>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-slate-600 font-medium mb-6">Best for: Visitors focused only on the trade show and quick sourcing meetings.</p>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-3"><span className="text-green-500 mt-1">✔</span><span><strong>Stay:</strong> Bangkok only (4-star hotel)</span></div>
                  <div className="flex items-start gap-3"><span className="text-green-500 mt-1">✔</span><span><strong>Meals:</strong> Breakfast & Dinner</span></div>
                  <div className="flex items-start gap-3"><span className="text-green-500 mt-1">✔</span><span><strong>Includes:</strong> Airport transfers, venue transfers, expo reg. assistance, city tour, insurance, networking dinner.</span></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
                  <h4 className="font-bold text-slate-800 mb-3 uppercase text-sm">Itinerary Summary</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li><strong className="text-slate-800">Day 1:</strong> Arrival in Bangkok, hotel check-in, dinner</li>
                    <li><strong className="text-slate-800">Day 2:</strong> MEGA SHOW visit at QSNCC, networking dinner</li>
                    <li><strong className="text-slate-800">Day 3:</strong> MEGA SHOW visit, half-day city tour, dinner</li>
                    <li><strong className="text-slate-800">Day 4:</strong> Breakfast, checkout and airport transfer</li>
                  </ul>
                </div>
                <a href="#enquiry-form" className="block w-full py-4 text-center bg-slate-900 text-white font-bold rounded-xl hover:bg-yellow-500 hover:text-slate-900 transition-colors uppercase tracking-wide">
                  Enquire for 3N Bangkok
                </a>
              </div>
            </div>

            {/* Package 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-2 border-yellow-500 relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-xs font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10">Popular Choice</div>
              <div className="h-56 bg-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-yellow-900 opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
                  <div>
                    <div className="text-yellow-400 font-bold tracking-widest text-sm mb-2 uppercase">5 Nights / 6 Days</div>
                    <h3 className="text-3xl font-black mb-3">Bangkok + Pattaya<br />Business & Leisure</h3>
                    <div className="text-2xl font-black text-white">₹41,499 <span className="text-sm font-normal text-slate-300">/ person</span></div>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-slate-600 font-medium mb-6">Best for: Business delegates who want to combine sourcing meetings with Pattaya leisure.</p>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-3"><span className="text-yellow-600 mt-1">✔</span><span><strong>Stay:</strong> 3N Bangkok + 2N Pattaya (4-star hotels)</span></div>
                  <div className="flex items-start gap-3"><span className="text-yellow-600 mt-1">✔</span><span><strong>Meals:</strong> Breakfast & Dinner</span></div>
                  <div className="flex items-start gap-3"><span className="text-yellow-600 mt-1">✔</span><span><strong>Includes:</strong> All transfers, expo assistance, Bangkok & Pattaya city tours, insurance, networking dinner.</span></div>
                </div>
                <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 mb-8">
                  <h4 className="font-bold text-slate-800 mb-3 uppercase text-sm">Itinerary Summary</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li><strong className="text-slate-800">Day 1:</strong> Arrival in Bangkok, check-in, dinner</li>
                    <li><strong className="text-slate-800">Day 2:</strong> MEGA SHOW visit, networking dinner</li>
                    <li><strong className="text-slate-800">Day 3:</strong> MEGA SHOW visit, half-day city tour</li>
                    <li><strong className="text-slate-800">Day 4:</strong> Transfer from Bangkok to Pattaya</li>
                    <li><strong className="text-slate-800">Day 5:</strong> Pattaya city tour and leisure</li>
                    <li><strong className="text-slate-800">Day 6:</strong> Checkout and airport transfer</li>
                  </ul>
                </div>
                <a href="#enquiry-form" className="block w-full py-4 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-bold rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all uppercase tracking-wide">
                  Enquire for 5N Package
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Inclusions & Exclusions */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 fade-up">
            {/* Inclusions */}
            <div className="p-8 rounded-3xl bg-green-50/50 border border-green-100">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                Package Inclusions
              </h3>
              <ul className="space-y-4">
                {[
                  "4-star hotel accommodation on twin-sharing basis",
                  "Daily breakfast and dinner",
                  "Airport transfers with meet & greet assistance",
                  "Fixed venue transfers by coach",
                  "Expo registration assistance",
                  "Orientation dinner and networking dinner",
                  "Bangkok city tour as per itinerary",
                  "Pattaya city tour for 5N package",
                  "Travel insurance",
                  "Road tax, parking, fuel and transfer charges",
                  "500 ml water bottle per person per day"
                ].map((item, i) => (
                  <li key={i} style={{ animationDelay: `${i * 100}ms` }} className="fade-up flex items-start gap-3 text-slate-700 group hover:-translate-y-1 transition-transform">
                    <span className="text-green-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform">■</span>
                    <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="p-8 rounded-3xl bg-red-50/50 border border-red-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">✕</span>
                Package Exclusions
              </h3>
              <ul className="space-y-4">
                {[
                  "International flight tickets",
                  "Thailand visa charges, if applicable",
                  "Lunch during the tour",
                  "GST and TCS, if applicable",
                  "Personal expenses such as laundry, tips, telephone calls and shopping",
                  "Optional sightseeing or private tours",
                  "Any service not mentioned in inclusions",
                  "Extra cost due to flight cancellation, weather, health issues, roadblocks or other unavoidable situations"
                ].map((item, i) => (
                  <li key={i} style={{ animationDelay: `${i * 100}ms` }} className="fade-up flex items-start gap-3 text-slate-700 group hover:-translate-y-1 transition-transform">
                    <span className="text-red-400 shrink-0 mt-0.5 group-hover:scale-125 transition-transform">■</span>
                    <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why GOIMOMI */}
      <section className="py-20 bg-slate-900 text-white text-center border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-slate-900 to-slate-900"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 fade-up">
          <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase">Why Book With <span className="text-yellow-500">GOIMOMI Holidays?</span></h2>
          <p className="text-xl font-light text-slate-300 mb-10">Business Travel, Managed Professionally. Your Bangkok business trip is handled end-to-end — from travel planning to hotel stay, airport transfers, event support and local coordination.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Business Travel Consultation", "4-Star Stay", "Airport Transfers", "Expo Assistance", "Indian Dinner", "Visa Support", "Dedicated WhatsApp Support"].map((badge, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ & Lead Form */}
      <section id="enquiry-form" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16">
          {/* FAQ */}
          <div className="lg:w-1/2 fade-up">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 uppercase">Frequently Asked <span className="text-yellow-600">Questions</span></h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-yellow-200 transition-colors">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Q. {faq.q}</h4>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 fade-up">
            <div className="bg-white p-2 md:p-6 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden w-full flex justify-center">
              <iframe
                id="ziframe_915123"
                title="MEGA SHOW BANGKOK Form"
                aria-label="MEGA SHOW BANGKOK"
                frameBorder="0"
                style={{ height: '700px', width: '100%', border: 'none' }}
                src="https://forms.zohopublic.in/GoimomiHolidays/form/MEGASHOWBANGKOK/formperma/9aYM6NQZnf_dAlnqEKaan16HSmF58iu58N8ZYNbJozQ"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Closing CTA */}
      <section className="py-24 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-6 fade-up">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">Ready to Attend MEGA SHOW Bangkok 2026?</h2>
          <p className="text-xl font-medium mb-10 text-slate-800">Plan your business sourcing trip with GOIMOMI Holidays and experience a professionally managed Bangkok travel package.</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">📞</span>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Call / WhatsApp</div>
                <div className="text-xl font-black">+91 81100 82222</div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-900/10"></div>
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">✉️</span>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Us</div>
                <a href="mailto:hello@goimomi.com" className="text-xl font-black hover:underline">hello@goimomi.com</a>
              </div>
            </div>
          </div>
          <a href="#enquiry-form" className="inline-block px-10 py-5 bg-slate-900 text-white font-black rounded-full hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 uppercase tracking-widest text-lg">
            Book Your Business Travel Package
          </a>
        </div>
      </section>

    </div>
  );
};

export default MegaShowBangkok;
