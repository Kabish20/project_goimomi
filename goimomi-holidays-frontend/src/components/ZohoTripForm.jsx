import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, MapPin, Calendar, Users, Home, ChevronDown } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * Optimized Room Config Sub-component
 */
const RoomConfig = React.memo(({ room, updateRoom }) => (
    <div className="bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
        <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest mb-2">Room {room.id}</p>
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-500">Adults</span>
                <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => updateRoom(room.id, 'adults', -1)} className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px] transition-colors">-</button>
                    <span className="text-[10px] font-black w-3 text-center">{room.adults}</span>
                    <button type="button" onClick={() => updateRoom(room.id, 'adults', 1)} className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px] transition-colors">+</button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-500">Children</span>
                <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => updateRoom(room.id, 'children', -1)} className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px] transition-colors">-</button>
                    <span className="text-[10px] font-black w-3 text-center">{room.children}</span>
                    <button type="button" onClick={() => updateRoom(room.id, 'children', 1)} className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px] transition-colors">+</button>
                </div>
            </div>
        </div>
    </div>
));

/**
 * ZohoTripForm Component
 * Specialized Zoho CRM Web-to-Lead form for Trip Planning (Holidays, Umrah, Business).
 */
const ZohoTripForm = ({ isOpen, onClose, initialData = {} }) => {
  const formRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [rooms, setRooms] = useState([{ id: 1, adults: 2, children: 0 }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      widgetcode: 'siq728d0317d0309852f4889fdec03e4cabaa5c80fa1a246bd2cdb3b355a354df81',
      ready: function () { }
    };

    if (!document.getElementById('zsiqscript')) {
      const s = document.createElement('script');
      s.type = 'text/javascript'; s.id = 'zsiqscript'; s.defer = true;
      s.src = 'https://salesiq.zoho.in/widget';
      const t = document.getElementsByTagName('script')[0];
      if (t && t.parentNode) t.parentNode.insertBefore(s, t);
      else document.head.appendChild(s);
    }

    const rid = "2dee421d4a0efc16e062a4aac03b6ef5adec86cee0eb0529d3cca6b67eb9bd08252bc843bca57374276537ba0e38d9c6gidf45a1ddf9bedb5a65fec23d26902c07ecf5336ee1875f60c1f596cb3c8481a0dgid5fb57052e1447db948b6c542243f0a212b89d607bbd4aafcfe0555850bc0e3cdgid9201c4a57b821c8059c26e1cfe06a96ce739ef3ace24c703bde45204cfd14e1d";
    const tw = "1fabe5fee52f39080f25e0f3eb345715df84580725980034d104d40a71a9ea8f";
    if (!document.getElementById('wf_anal_trip')) {
      const s = document.createElement('script');
      s.id = 'wf_anal_trip';
      s.src = `https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=${rid}&tw=${tw}`;
      document.body.appendChild(s);
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalRooms = rooms.length;
  const totalAdults = useMemo(() => rooms.reduce((acc, r) => acc + r.adults, 0), [rooms]);
  const totalChildren = useMemo(() => rooms.reduce((acc, r) => acc + r.children, 0), [rooms]);

  const updateRoom = useCallback((id, field, delta) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: Math.max(field === 'adults' ? 1 : 0, r[field] + delta) } : r));
  }, []);

  const handleRoomChange = useCallback((delta) => {
    setRooms(prev => {
      if (delta > 0 && prev.length < 5) return [...prev, { id: prev.length + 1, adults: 2, children: 0 }];
      if (delta < 0 && prev.length > 1) return prev.slice(0, -1);
      return prev;
    });
  }, []);

  const handleZohoSubmit = (e) => {
    const form = formRef.current;
    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (phoneDigits.startsWith("91") && phoneDigits.length !== 12) {
      alert("Please enter a valid 10-digit phone number after the country code (+91).");
      e.preventDefault(); return false;
    }
    const submitBtn = form.querySelector('.formsubmit');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600" />
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={16} /></button>
        <div className="p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600"><MapPin size={18} /></div>
                <div><h2 className="text-[15px] font-black text-[#14532d] uppercase tracking-tight">{initialData.packageTitle || "Plan Your Trip"}</h2><p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">{initialData.category || "Explore the world with Goimomi."}</p></div>
            </div>
            <form ref={formRef} action='https://crm.zoho.in/crm/WebToLeadForm' method='POST' onSubmit={handleZohoSubmit} acceptCharset='UTF-8' className="space-y-2">
                <input type='text' className="hidden" name='xnQsjsdp' value='3b353a2a4a0ef50ab8ee1869a576bd8cdd4ce02aa78cb2780a4d4000fc53d35b' readOnly />
                <input type='text' className="hidden" name='xmIwtLD' value='dc89b294a83cc2acd16b65cc120db7982ceabb1040730b6a630c1c6a7ce1640d7968fc201a885aa4afe209b39ad90fa3' readOnly />
                <input type='text' className="hidden" name='actionType' value='TGVhZHM=' readOnly />
                <input type='text' className="hidden" name='returnURL' value={window.location.href} readOnly />
                <input type="hidden" name="LEADCF52" value={totalRooms} /><input type="hidden" name="LEADCF51" value={totalAdults} /><input type="hidden" name="LEADCF53" value={totalChildren} />

                <div className="space-y-0.5">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                    <input name='Last Name' type='text' className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none" placeholder="John Doe" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile *</label>
                        <input type="hidden" name="Mobile" value={phone} />
                        <PhoneInput country={"in"} value={phone} onChange={setPhone} inputClass="!w-full !bg-gray-50 !border-2 !border-transparent focus:!border-emerald-50 focus:!bg-white !rounded-xl !px-3 !py-1.5 !text-[10px] !font-bold !outline-none !h-[31px]" containerClass="!w-full" buttonClass="!bg-gray-50 !border-none !rounded-l-xl" />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <input name='Email' type='text' className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none" placeholder="Email" />
                    </div>
                </div>
                <div className="space-y-0.5">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Travel Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input name='LEADCF116' type='date' className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl py-1.5 pl-9 pr-3 text-[10px] font-bold outline-none" />
                    </div>
                </div>
                <div className="space-y-0.5 relative" ref={dropdownRef}>
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Travelers & Rooms</label>
                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-gray-50 border-2 border-transparent hover:border-emerald-50 rounded-xl px-3 py-1.5 text-[10px] font-bold text-left flex items-center justify-between">
                        <div className="flex items-center gap-2"><Users size={14} className="text-gray-400" /><span>{totalRooms} Rm, {totalAdults} Ad</span></div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute bottom-full mb-1 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] p-3 animate-in slide-in-from-bottom-2 duration-200">
                            <div className="flex items-center justify-between mb-3 px-1"><span className="text-[10px] font-black uppercase text-[#064e3b]">Rooms</span>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => handleRoomChange(-1)} className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400">-</button>
                                    <span className="text-xs font-black w-4 text-center">{totalRooms}</span>
                                    <button type="button" onClick={() => handleRoomChange(1)} className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-400">+</button>
                                </div>
                            </div>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                {rooms.map((room) => <RoomConfig key={room.id} room={room} updateRoom={updateRoom} />)}
                            </div>
                            <button type="button" onClick={() => setIsDropdownOpen(false)} className="w-full mt-3 py-1.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors">Done</button>
                        </div>
                    )}
                </div>
                <button type='submit' className="formsubmit w-full bg-[#14532d] hover:bg-[#0f4022] text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] mt-2">Submit Trip Plan</button>
            </form>
            <p className="mt-3 text-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.2em]">Secure Zoho CRM Integration • Privacy Protected</p>
        </div>
      </div>
    </div>
  );
};

export default ZohoTripForm;
