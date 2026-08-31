import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, Users, MessageSquare, Send, Sparkles, ChevronDown, Minus, Plus, Calendar } from 'lucide-react';
import api from '../../api';
import SuccessModal from '../common/SuccessModal';
import CountryCodePicker from '../admin/CountryCodePicker/CountryCodePicker';

const QuickEnquiryForm = ({ packageTitle, packageData, onClose, isModal }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
    travel_date: '',
  });

  const [countryCode, setCountryCode] = useState('+91');
  const [rooms, setRooms] = useState(1);
  const [roomDetails, setRoomDetails] = useState([{ adults: 2, children: 0, childAges: [] }]);
  const [travelerDropdownOpen, setTravelerDropdownOpen] = useState(false);
  const travelerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const travelerSummary = () => {
    const adults = roomDetails.reduce((sum, r) => sum + r.adults, 0);
    const children = roomDetails.reduce((sum, r) => sum + r.children, 0);
    return `${rooms} Rm, ${adults} Ad${children > 0 ? `, ${children} Ch` : ''}`;
  };

  const adjustRooms = (count) => {
    if (count < 1 || count > 6) return;
    let updated = [...roomDetails];
    if (count > updated.length) {
      for (let i = updated.length; i < count; i++) {
        updated.push({ adults: 2, children: 0, childAges: [] });
      }
    } else {
      updated = updated.slice(0, count);
    }
    setRooms(count);
    setRoomDetails(updated);
  };

  const updateAdults = (i, val) => {
    const updated = [...roomDetails];
    updated[i].adults = Math.max(1, updated[i].adults + val);
    setRoomDetails(updated);
  };

  const updateChildren = (i, val) => {
    const updated = [...roomDetails];
    const newCount = Math.max(0, updated[i].children + val);
    updated[i].children = newCount;
    if (newCount > updated[i].childAges.length) {
      for (let j = updated[i].childAges.length; j < newCount; j++) {
        updated[i].childAges.push("");
      }
    } else {
      updated[i].childAges.length = newCount;
    }
    setRoomDetails(updated);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (travelerRef.current && !travelerRef.current.contains(event.target)) {
        setTravelerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Req';
    if (!formData.email.trim()) {
      newErrors.email = 'Req';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Err';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Req';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Err';
    }
    if (!formData.travel_date) newErrors.travel_date = 'Req';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        package_type: packageTitle || 'General Plan',
        full_name: formData.full_name,
        email: formData.email,
        phone: `${countryCode} ${formData.phone}`,
        travel_date: formData.travel_date,
        adults: roomDetails.reduce((sum, r) => sum + r.adults, 0),
        children: roomDetails.reduce((sum, r) => sum + r.children, 0),
        rooms: rooms,
        room_details: roomDetails,
        message: formData.message,
        start_city: 'Interested',
        nationality: 'Indian',
        star_rating: 'Any',
        holiday_type: 'Customized',
      };

      await api.post('/api/holiday-form/', payload);
      setShowSuccess(true);
      setFormData({ full_name: '', email: '', phone: '', message: '', travel_date: '' });
      setRooms(1);
      setRoomDetails([{ adults: 2, children: 0, childAges: [] }]);

      if (isModal && onClose) {
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isModal ? 'bg-transparent px-2 pt-4 pb-2' : 'bg-white rounded-[1.5rem] p-5 shadow-xl border border-gray-100'} relative overflow-visible max-w-[340px] mx-auto`}>
      <div className="relative z-10 px-0.5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="text-white" size={12} />
          </div>
          <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tight">Plan Your Trip</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="space-y-0.5">
            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input
                type="text"
                placeholder="Ex: Mohammed Kashif"
                className={`w-full bg-gray-50/50 border ${errors.full_name ? 'border-red-200' : 'border-gray-50'} rounded-lg py-1.5 pl-8 pr-2 text-[11px] font-bold text-gray-800 focus:outline-none focus:border-green-500 transition-all`}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
          </div>

          {/* Row 1: Phone with Country Code */}
          <div className="space-y-0.5">
              <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="flex gap-2">
                  <div className="w-24 flex-shrink-0 country-picker-minimized">
                      <CountryCodePicker 
                        value={countryCode} 
                        onChange={setCountryCode} 
                      />
                  </div>
                  <div className="relative flex-1">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                      <input
                          type="tel"
                          placeholder="00000 00000"
                          maxLength={10}
                          className={`w-full bg-gray-50/50 border ${errors.phone ? 'border-red-200' : 'border-gray-50'} rounded-lg py-1.5 pl-8 pr-2 text-[11px] font-bold text-gray-800 focus:outline-none focus:border-green-500 transition-all`}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phone: val });
                          }}
                      />
                  </div>
              </div>
          </div>

          {/* Row 2: Email & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={10} />
                <input
                  type="email"
                  placeholder="mail@..."
                  className={`w-full bg-gray-50/50 border ${errors.email ? 'border-red-200' : 'border-gray-50'} rounded-lg py-1.5 pl-8 pr-2 text-[11px] font-bold text-gray-800 focus:outline-none focus:border-green-500 transition-all`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-0.5">
              <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={10} />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full bg-gray-50/50 border ${errors.travel_date ? 'border-red-200' : 'border-gray-100'} rounded-lg py-1.5 pl-8 pr-2 text-[11px] font-bold text-gray-800 focus:outline-none focus:border-green-500`}
                  style={{ colorScheme: 'light' }}
                  value={formData.travel_date}
                  onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Travelers */}
          <div className="space-y-0.5 relative" ref={travelerRef}>
            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Travelers & Rooms</label>
            <button
              type="button"
              onClick={() => setTravelerDropdownOpen(!travelerDropdownOpen)}
              className="w-full bg-white border border-gray-100 rounded-lg py-2 px-3 text-[11px] font-bold text-gray-800 flex items-center justify-between shadow-sm hover:border-green-500/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <Users size={12} className="text-green-600" />
                <span className="truncate">{travelerSummary()}</span>
              </div>
              <ChevronDown size={12} className={`text-gray-400 transition-transform ${travelerDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {travelerDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-50 z-[100] p-3 animate-in fade-in slide-in-from-top-1 duration-200 max-h-[180px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-50">
                  <h4 className="text-[9px] font-black text-gray-700 uppercase">Rooms</h4>
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                    <button type="button" onClick={() => adjustRooms(rooms - 1)} className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center text-gray-400"><Minus size={10} /></button>
                    <span className="text-[10px] font-black w-3 text-center">{rooms}</span>
                    <button type="button" onClick={() => adjustRooms(rooms + 1)} className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center text-gray-400"><Plus size={10} /></button>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {roomDetails.map((room, i) => (
                    <div key={i} className="p-2 rounded-lg bg-gray-50/50 border border-gray-50">
                      <p className="text-[8px] font-black text-green-600 uppercase mb-2">Room {i + 1}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-bold text-gray-500">Adults</p>
                          <div className="flex items-center gap-2 bg-white p-0.5 rounded-lg border border-gray-100 shadow-sm">
                            <button type="button" onClick={() => updateAdults(i, -1)} className="w-4 h-4 flex items-center justify-center text-gray-400"><Minus size={10} /></button>
                            <span className="text-[10px] font-bold w-3 text-center">{room.adults}</span>
                            <button type="button" onClick={() => updateAdults(i, 1)} className="w-4 h-4 flex items-center justify-center text-gray-400"><Plus size={10} /></button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-bold text-gray-500">Children</p>
                          <div className="flex items-center gap-2 bg-white p-0.5 rounded-lg border border-gray-100 shadow-sm">
                            <button type="button" onClick={() => updateChildren(i, -1)} className="w-4 h-4 flex items-center justify-center text-gray-400"><Minus size={10} /></button>
                            <span className="text-[10px] font-bold w-3 text-center">{room.children}</span>
                            <button type="button" onClick={() => updateChildren(i, 1)} className="w-4 h-4 flex items-center justify-center text-gray-400"><Plus size={10} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Message */}
          <div className="space-y-0.5">
            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
            <textarea
              placeholder="Any requirements?"
              rows="1"
              className="w-full bg-gray-50/50 border border-gray-50 rounded-lg py-1.5 px-3 text-[11px] font-bold text-gray-800 focus:outline-none focus:border-green-500 resize-none transition-all shadow-sm"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16a34a] text-white py-2 rounded-xl text-[12px] font-black hover:bg-[#15803d] transition-all uppercase tracking-[0.1em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={14} />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .country-picker-minimized div > div {
          padding-top: 5px !important;
          padding-bottom: 5px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          background-color: rgb(249 250 251 / 0.5) !important;
        }
      `}} />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Request Received!"
      />
    </div>
  );
};

export default QuickEnquiryForm;
