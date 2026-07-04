import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, Home, AlertCircle, Phone, Mail } from 'lucide-react';
import usePageSEO from '../../../hooks/usePageSEO';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id') || searchParams.get('id') || searchParams.get('booking') || '';

  usePageSEO(
    "Payment Failed | Goimomi Holidays",
    "Your payment could not be processed. Please try again or contact support for help with your booking.",
    undefined,
    "payment failed, transaction declined, support, goimomi holidays"
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
        {/* Decorative background red line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
        
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-shake">
          <XCircle size={56} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
          Payment Failed
        </h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">
          Transaction declined or cancelled
        </p>

        {bookingId && (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-1">
              Attempted Booking ID
            </span>
            <span className="text-xl font-black text-red-950 tracking-wide font-mono">
              {bookingId}
            </span>
          </div>
        )}

        <p className="text-gray-600 mb-8 leading-relaxed font-medium">
          We were unable to process your payment. This could be due to a temporary issue with your bank, card, or connection. 
          No funds have been captured for this attempt.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 text-left flex gap-3 items-start">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">What should I do?</h4>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              You can try initiating the payment again. If the amount was debited from your account, it will automatically be refunded within 3-5 business days.
            </p>
          </div>
        </div>

        <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-3">
          <div className="flex items-center justify-center gap-3 text-sm font-bold text-gray-400">
            <Phone size={16} /> +91 8110082222
          </div>
          <div className="flex items-center justify-center gap-3 text-sm font-bold text-gray-400">
            <Mail size={16} /> hello@goimomi.com
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
          >
            <Home size={14} /> Home
          </Link>
          <Link 
            to="/holidays" 
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-900/20 transition-all active:scale-95"
          >
            Retry Booking
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
