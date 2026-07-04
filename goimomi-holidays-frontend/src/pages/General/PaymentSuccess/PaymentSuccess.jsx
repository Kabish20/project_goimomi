import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, ArrowRight, Phone, Mail } from 'lucide-react';
import usePageSEO from '../../../hooks/usePageSEO';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id') || searchParams.get('id') || searchParams.get('booking') || 'GM10256';

  usePageSEO(
    "Payment Successful | Goimomi Holidays",
    "Your payment was successful and your booking has been confirmed with Goimomi Holidays.",
    undefined,
    "payment success, booking confirmed, goimomi holidays"
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-500"></div>
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <CheckCircle size={56} className="text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
          Payment Successful
        </h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">
          Thank you for choosing Goimomi
        </p>

        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-8">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Booking ID
          </span>
          <span className="text-2xl font-black text-emerald-950 tracking-wide font-mono">
            {bookingId}
          </span>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed font-medium">
          Thank you for booking with <span className="text-[#14532d] font-bold">Goimomi Holidays</span>. 
          Your payment has been received and your booking is confirmed. 
          A confirmation voucher and receipt have been sent to your email address.
        </p>

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
            className="flex items-center justify-center gap-2 bg-[#14532d] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0f4a24] shadow-xl shadow-green-900/20 transition-all active:scale-95"
          >
            Explore <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
