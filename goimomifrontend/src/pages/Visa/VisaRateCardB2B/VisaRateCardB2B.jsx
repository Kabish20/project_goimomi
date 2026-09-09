import React, { useState, useEffect, useRef, useCallback } from 'react';
import usePageSEO from '../../../hooks/usePageSEO';
import {
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Mail,
  Maximize2,
  Minimize2,
  Scan,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

const ZOHO_SHEET_URL =
  'https://sheet.zohopublic.in/sheet/publishedrange/e891f931c63f08cffbe2ada1f0d9509ff7ebd1c4f73242a9a3cc4b682a677a03?type=grid&mode=embed';

const BASE_WIDTH = 1140;
const BASE_HEIGHT = 1025;

const VisaRateCardB2B = () => {
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isFitToWidth, setIsFitToWidth] = useState(true);
  const containerRef = useRef(null);

  usePageSEO(
    'B2B Visa Rate Card | Goimomi Holidays',
    'Official Goimomi Holidays B2B Visa Rate Card with live updated partner pricing, processing times, and document requirements for travel agents.',
    'https://goimomi.com/images/seo/b2b-visa-partners.jpg',
    'B2B visa rate card, visa partner pricing, travel agent visa rates, visa processing fees, Goimomi Holidays'
  );

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const calculateFitScale = useCallback(() => {
    if (!containerRef.current) return 1;
    const availableWidth = containerRef.current.clientWidth - 32;
    if (availableWidth <= 0) return 1;
    const fitted = availableWidth / BASE_WIDTH;
    return Math.min(1, Math.max(0.35, parseFloat(fitted.toFixed(3))));
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (isFitToWidth) {
        setScale(calculateFitScale());
      }
    };

    updateScale();
    const timer = setTimeout(updateScale, 300);
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, [isFitToWidth, calculateFitScale, isFullscreen]);

  const toggleFitMode = () => {
    if (isFitToWidth) {
      setIsFitToWidth(false);
      setScale(1);
    } else {
      setIsFitToWidth(true);
      setScale(calculateFitScale());
    }
  };

  const handleZoom = (delta) => {
    setIsFitToWidth(false);
    setScale((prev) => {
      const next = parseFloat((prev + delta).toFixed(2));
      return Math.min(1.4, Math.max(0.4, next));
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-6 lg:px-8">
      <div
        className={`mx-auto space-y-5 transition-all duration-300 ${
          isFullscreen ? 'max-w-7xl' : 'max-w-[1240px]'
        }`}
      >
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

        {/* Centered & Responsive Sheet Card Container */}
        <div className="w-full">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
            {/* Control Sub-bar for Sheet Display (Fit to Width, Zoom, Centering indicators) */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Alignment:{' '}
                  <strong className="text-slate-800 font-semibold">Center-Fitted</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Scale:{' '}
                  <strong className="text-slate-800 font-semibold">
                    {Math.round(scale * 100)}%
                  </strong>
                </span>
                {isFitToWidth && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    Auto-Fit Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={toggleFitMode}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition text-[11px] border ${
                    isFitToWidth
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={
                    isFitToWidth
                      ? 'Switch to 100% natural resolution'
                      : 'Auto-fit sheet to container width'
                  }
                >
                  <Scan size={13} />
                  <span>{isFitToWidth ? 'Fitted Width' : 'Fit to Width'}</span>
                </button>

                <button
                  onClick={() => handleZoom(-0.05)}
                  disabled={scale <= 0.4}
                  className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition disabled:opacity-30 border border-transparent hover:border-slate-200"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>

                <button
                  onClick={() => {
                    setIsFitToWidth(false);
                    setScale(1);
                  }}
                  className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition border border-transparent hover:border-slate-200"
                  title="Reset to 100%"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  onClick={() => handleZoom(0.05)}
                  disabled={scale >= 1.4}
                  className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition disabled:opacity-30 border border-transparent hover:border-slate-200"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>

            {/* Center-Aligned Sheet Viewport */}
            <div
              ref={containerRef}
              className="w-full overflow-x-auto bg-slate-100/70 p-3 sm:p-5 flex justify-center items-center min-h-[500px]"
            >
              <div className="w-fit min-w-full flex justify-center items-center">
                <div
                  className="transition-all duration-200 flex justify-center items-center mx-auto"
                  style={{
                    width: `${Math.round(BASE_WIDTH * scale)}px`,
                    height: `${Math.round(BASE_HEIGHT * scale)}px`,
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    key={key}
                    src={ZOHO_SHEET_URL}
                    title="B2B Visa Rate Card"
                    width={BASE_WIDTH}
                    height={BASE_HEIGHT}
                    frameBorder="0"
                    scrolling="no"
                    className="block rounded-xl shadow-xs border border-slate-200/80 bg-white"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      width: `${BASE_WIDTH}px`,
                      height: `${BASE_HEIGHT}px`,
                    }}
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              </div>
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
