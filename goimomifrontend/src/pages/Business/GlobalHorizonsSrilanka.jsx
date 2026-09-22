import React, { useState } from 'react';
import { CheckCircle2, Globe2 } from 'lucide-react';
import GlobalHorizonsProfileForm from '../../components/forms/GlobalHorizonsProfileForm';
import usePageSEO from '../../hooks/usePageSEO';

export default function GlobalHorizonsSrilanka() {
  const [saved, setSaved] = useState(false);
  usePageSEO('Global Horizons Sri Lanka | Participant Profile | Goimomi', 'Share your professional profile for Global Horizons Sri Lanka. Connect with Tamil entrepreneurs in Colombo through curated introductions and networking dinners.', '/images/seo/sri-lanka-business-journey.jpg');

  return <div className="min-h-screen bg-[#f4f8f5] px-4 py-6 sm:px-6 sm:py-8">
    <div className="mx-auto max-w-2xl">
      <header className="mb-5">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-900"><Globe2 size={18} /> Colombo · Entrepreneur connections</span>
        <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">Global Horizons - Srilanka</h1>
        <h2 className="mt-2 text-base font-semibold text-slate-700">Participant Profile Request</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">As part of our Sri Lanka program, we are arranging dinners with Tamil entrepreneurs in Colombo. Please share a brief profile so we can match you with meaningful connections and make the conversations purposeful and enriching.</p>
      </header>
      <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
        {saved ? <div role="status" className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-emerald-700" size={48} />
          <h2 className="text-2xl font-bold text-emerald-950">Thank you for sharing your profile</h2>
          <p className="mt-3 leading-7 text-slate-600">Your details and photo have been saved. The Global Horizons team will use your profile to curate introductions in Sri Lanka.</p>
        </div> : <GlobalHorizonsProfileForm onSaved={() => { setSaved(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
      </section>
    </div>
  </div>;
}
