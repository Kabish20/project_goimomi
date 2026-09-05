import React, { useState } from 'react';
import usePageSEO from '../../../hooks/usePageSEO';
import { RefreshCw, ExternalLink, ShieldCheck, PhoneCall, Mail, Maximize2, Minimize2 } from 'lucide-react';

const ZOHO_SHEET_URL =
  'https://sheet.zohopublic.in/sheet/published/umq2mc0806074b948468a987801e80675ad36';

const VisaRateCardB2B = () => {
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  usePageSEO(
    'B2B Visa Rate Card | Goimomi Holidays',
    'Official Goimomi Holidays B2B Visa Rate Card with live updated partner pricing, processing times, and document requirements for travel agents.',
    undefined,
    'B2B visa rate card, visa partner pricing, travel agent visa rates, visa processing fees, Goimomi Holidays'
  );

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1040px] mx-auto space-y-5">
        {/* Header Title & Controls */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <ShieldCheck size={13} />
                B2B Partner Portal
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Updates
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Official Visa Rate Card
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Real-time partner rates and fees for travel agencies and corporate partners.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleRefresh}
              title="Refresh sheet data"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200 active:scale-95"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit wide view' : 'Fit to width'}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200 active:scale-95"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isFullscreen ? 'Standard View' : 'Wide View'}</span>
            </button>
            <a
              href={ZOHO_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full sheet in new tab"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-goimomi-primary hover:bg-[#114b28] rounded-xl transition shadow-sm active:scale-95"
            >
              <ExternalLink size={14} />
              <span>Open Tab</span>
            </a>
          </div>
        </div>

        {/* Rate Card Container - Centered and width-constrained to clip empty columns */}
        <div
          className={`transition-all duration-300 ${
            isFullscreen ? 'max-w-none w-full' : 'max-w-[1020px] mx-auto w-full'
          }`}
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="w-full h-[760px] sm:h-[820px] bg-slate-100 relative">
              <iframe
                key={key}
                src={ZOHO_SHEET_URL}
                title="B2B Visa Rate Card"
                className="w-full h-full border-0"
                allow="clipboard-read; clipboard-write"
              />
            </div>
          </div>
        </div>

        {/* Partner Support Footer Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-[#0b2719] text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-sm sm:text-base font-bold text-white">
              Need custom visa rates or bulk group assistance?
            </h2>
            <p className="text-xs text-emerald-200/80">
              Our 24/7 B2B visa operations team is available for travel partners and agent inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href="tel:+918110082222"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0b2719] text-xs font-bold rounded-xl hover:bg-emerald-50 transition"
            >
              <PhoneCall size={14} />
              +91 8110082222
            </a>
            <a
              href="mailto:hello@goimomi.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800/80 text-white text-xs font-bold rounded-xl hover:bg-emerald-700/80 transition border border-emerald-600/40"
            >
              <Mail size={14} />
              hello@goimomi.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaRateCardB2B;
