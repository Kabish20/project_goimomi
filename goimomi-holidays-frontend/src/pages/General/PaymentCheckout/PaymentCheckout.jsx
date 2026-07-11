import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  CreditCard, Lock, ShieldCheck, CheckCircle2, Wallet, 
  Smartphone, Building2, ArrowRight, ShieldAlert, Sparkles,
  Info
} from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import api from "../../../api";

const PaymentCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookingId = searchParams.get("booking_id") || "GM-TRN-MOCK";
  const dbId = searchParams.get("id");
  const rawAmount = searchParams.get("amount") || "4999";
  const amount = parseFloat(rawAmount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  usePageSEO(
    "Secure Payment Gateway - Goimomi Holidays",
    "Complete your booking transaction securely using Goimomi Holidays premium payment gateway."
  );

  const [activeTab, setActiveTab] = useState("card"); // card, upi, netbank, wallet
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0); // 0: idle, 1: authenticating, 2: completing
  const [errorMsg, setErrorMsg] = useState("");

  // Card Form States
  const [cardNo, setCardNo] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI Form States
  const [upiId, setUpiId] = useState("");

  // Netbanking States
  const [selectedBank, setSelectedBank] = useState("");

  // Wallet States
  const [selectedWallet, setSelectedWallet] = useState("");

  // Format Card Number (space every 4 digits)
  const handleCardNoChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNo(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Format CVV (max 3 digits)
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const validateForm = () => {
    setErrorMsg("");
    if (activeTab === "card") {
      if (cardNo.replace(/\s/g, "").length !== 16) {
        setErrorMsg("Please enter a valid 16-digit card number.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setErrorMsg("Please enter a valid expiry date (MM/YY).");
        return false;
      }
      const [month] = cardExpiry.split("/");
      const m = parseInt(month);
      if (m < 1 || m > 12) {
        setErrorMsg("Expiry month must be between 01 and 12.");
        return false;
      }
      if (cardCvv.length !== 3) {
        setErrorMsg("Please enter a valid 3-digit CVV code.");
        return false;
      }
      if (!cardName.trim()) {
        setErrorMsg("Please enter the cardholder name.");
        return false;
      }
    } else if (activeTab === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setErrorMsg("Please enter a valid UPI ID (e.g. name@okhdfc).");
        return false;
      }
    }
    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    setProcessStep(1);

    try {
      // Step 1: Secure Handshake - request Zoho Payment Session from Backend
      const response = await api.post(`/api/cab-bookings/${dbId}/create-zoho-payment-session/`);
      
      setProcessStep(2);
      
      if (response.data && response.data.redirect_url) {
        // Redirect browser to Zoho Payments secure hosted page
        setTimeout(() => {
          window.location.href = response.data.redirect_url;
        }, 800);
      } else {
        throw new Error("Unable to initialize Zoho Payments session.");
      }
    } catch (err) {
      console.error("Zoho Payments initiation failed:", err);
      const backendError = err.response?.data?.error || err.message || "Failed to initiate transaction.";
      setErrorMsg(`Payment Error: ${backendError}`);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 mt-16 flex items-center justify-center font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid md:grid-cols-12 relative animate-in fade-in duration-500">
        
        {/* Processing/Loading overlay */}
        {processing && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-24 h-24 relative mb-6">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-50 border-t-[#14532d] animate-spin" />
              {/* Inner glowing core */}
              <div className="absolute inset-4 bg-emerald-50 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#14532d] animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-[#1e293b] tracking-tight uppercase mb-2">
              {processStep === 1 ? "Securing Handshake..." : "Authorizing Transaction..."}
            </h3>
            <p className="text-sm font-semibold text-slate-500 max-w-sm leading-relaxed">
              {processStep === 1 
                ? "Connecting to the bank servers via 256-bit encrypted secure tunnel." 
                : "Processing deposit authorization and establishing travel reservation."}
            </p>
            <div className="flex items-center gap-1.5 mt-8 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              <ShieldCheck className="w-3.5 h-3.5" /> PCI-DSS Compliant Gateway
            </div>
          </div>
        )}

        {/* Left Form Panel */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-r border-slate-100">
          <div>
            {/* Header */}
            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 bg-[#14532d]/10 text-[#14532d] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Lock className="w-3 h-3" /> Secure Payment Checkout
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Select Your <span className="text-[#14532d]">Payment Method</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Choose from trusted banking channels below to authorize your deposit.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 animate-bounce">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-rose-800 uppercase tracking-wide">Validation Error</p>
                  <p className="text-xs font-semibold text-rose-600 mt-0.5 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Payment Category Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-100/50">
              {[
                { id: "card", label: "Cards", icon: CreditCard },
                { id: "upi", label: "UPI", icon: Smartphone }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setErrorMsg("");
                    }}
                    className={`py-3 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isActive 
                        ? "bg-white text-[#14532d] font-black shadow-md border border-[#14532d]/5" 
                        : "text-slate-500 hover:text-[#14532d] font-bold"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#14532d]" : "text-slate-400"}`} />
                    <span className="text-[10px] tracking-wide uppercase">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Content Forms */}
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              
              {/* Tab 1: Cards Form */}
              {activeTab === "card" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#14532d] uppercase tracking-wider">Cards Option</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Enabled</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500">Collect payments globally using credit or debit cards.</p>
                    <div className="flex gap-2 mt-3 items-center flex-wrap">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Accepted Cards:</span>
                      <div className="flex gap-1.5 items-center">

                        {/* RuPay */}
                        <div className="flex items-center justify-center h-7 px-2 bg-white border border-slate-200 rounded-md shadow-sm">
                          <svg viewBox="0 0 90 28" width="52" height="20" xmlns="http://www.w3.org/2000/svg">
                            <text x="0" y="21" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#1a56db">Ru</text>
                            <text x="30" y="21" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#e3550d">Pay</text>
                          </svg>
                        </div>

                        {/* Mastercard */}
                        <div className="flex items-center justify-center h-7 px-2 bg-white border border-slate-200 rounded-md shadow-sm gap-1">
                          <svg viewBox="0 0 46 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="15" r="14" fill="#eb001b"/>
                            <circle cx="30" cy="15" r="14" fill="#f79e1b" fillOpacity="0.9"/>
                            <path d="M23 4.8a14 14 0 0 1 0 20.4A14 14 0 0 1 23 4.8z" fill="#ff5f00"/>
                          </svg>
                        </div>

                        {/* Visa */}
                        <div className="flex items-center justify-center h-7 px-2 bg-white border border-slate-200 rounded-md shadow-sm">
                          <svg viewBox="0 0 72 24" width="46" height="20" xmlns="http://www.w3.org/2000/svg">
                            <text x="0" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#1a1f71" fontStyle="italic" letterSpacing="-1">VISA</text>
                          </svg>
                        </div>

                      </div>
                    </div>

                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Cardholder Name</label>
                    <input 
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] text-sm font-semibold transition-all uppercase placeholder-slate-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={cardNo}
                        onChange={handleCardNoChange}
                        placeholder="4532 0123 4567 8901"
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] text-sm font-semibold tracking-widest font-mono transition-all placeholder-slate-400 outline-none"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Expiration (MM/YY)</label>
                      <input 
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="12/29"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] text-sm font-semibold tracking-wider font-mono text-center transition-all placeholder-slate-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">CVV Code</label>
                      <input 
                        type="password"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        placeholder="***"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] text-sm font-semibold tracking-widest font-mono text-center transition-all placeholder-slate-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: UPI Form */}
              {activeTab === "upi" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#14532d] uppercase tracking-wider">UPI Option</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Enabled</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500">Receive instant payments from anywhere.</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-extrabold uppercase">Bank Account</span>
                      <span className="text-[9px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-extrabold uppercase">RuPay Credit Card</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">UPI ID / VPA</label>
                    <input 
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                      placeholder="username@bank"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] text-sm font-semibold tracking-wider transition-all placeholder-slate-400 outline-none"
                    />
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                      Enter your UPI address and click Complete Payment. A notification request will be pushed directly to your Google Pay, PhonePe, or BHIM app to approve the transaction.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-8 py-4 bg-[#14532d] hover:bg-[#0f4a24] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-950/20 transition-all active:scale-98 flex items-center justify-center gap-2 group"
              >
                Complete Secure Payment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Secure Badging footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure SSL Connection
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Powered by Zoho Checkout
            </div>
          </div>
        </div>

        {/* Right Summary Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#14532d]/5 to-slate-50 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6">Booking Details</h3>
            
            <div className="space-y-5">
              {/* Card for Booking ID */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</p>
                  <p className="text-base font-black text-slate-800 tracking-wider font-mono mt-0.5">{bookingId}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Card for Amount */}
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</p>
                  <p className="text-2xl font-black text-[#14532d] tracking-wide mt-0.5">₹{amount}</p>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  INR
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="mt-8 border-t border-slate-200/50 pt-8 space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#14532d]/10 flex items-center justify-center text-[#14532d] flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Instant Confirmation</h4>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-0.5">
                    Your cab booking will transition immediately to "Confirmed" in our scheduling network once authorization clears.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-[10px] text-slate-400 font-semibold leading-relaxed border-t border-slate-200/50 pt-6">
            Goimomi Holidays Pvt. Ltd. | Reg. No. U63040TN2022PTC150246. All payments are strictly encrypted and processed via accredited PCI channels.
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentCheckout;
