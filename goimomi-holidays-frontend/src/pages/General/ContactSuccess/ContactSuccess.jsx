import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Phone, Mail } from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";

const ContactSuccess = () => {
  const navigate = useNavigate();

  usePageSEO(
    "Message Sent Successfully | Goimomi Holidays",
    "Thank you for contacting Goimomi Holidays. Your enquiry has been received, and our travel experts will get back to you shortly.",
    undefined,
    "contact success, enquiry submitted, thank you, goimomi holidays"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // 5 seconds delay for better UX

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-gray-100">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle size={48} className="text-[#14532d]" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Message Sent!</h1>
        <p className="text-gray-600 mb-10 leading-relaxed font-medium">
          Thank you for reaching out to <span className="text-[#14532d] font-bold">Goimomi Holidays</span>. 
          We've received your enquiry and our travel experts will contact you within the next 24 hours.
        </p>

        <div className="space-y-4 mb-10">
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

        <p className="mt-10 text-xs text-gray-300 font-bold uppercase tracking-widest animate-pulse">
          Redirecting to home in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default ContactSuccess;



