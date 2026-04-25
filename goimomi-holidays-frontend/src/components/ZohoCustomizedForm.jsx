import React, { useEffect, useRef, useState } from "react";
import { X, MapPin, Calendar, Users, Home, ChevronDown, Clock, Globe, Briefcase, Star, Utensils, MessageSquare, CreditCard, Sparkles, Plus } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "../api";

/**
 * ZohoCustomizedForm Component
 * Specialized Zoho CRM Web-to-Lead form for "Customized" Holiday/Umrah requests.
 * Features a dynamic multi-destination workflow and premium traveler selection.
 */
const ZohoCustomizedForm = ({ isOpen, onClose, initialData = {} }) => {
  const formRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [rooms, setRooms] = useState([{ id: 1, adults: 2, children: 0 }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [destinations, setDestinations] = useState([{ id: Date.now(), name: "", nights: "1 night" }]);
  const [cities, setCities] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [citiesRes, natRes] = await Promise.all([
          api.get("/api/cities/"),
          api.get("/api/nationalities/")
        ]);
        setCities(citiesRes.data || []);
        setNationalities(natRes.data || []);
      } catch (err) {
        console.error("Error fetching form data:", err);
      }
    };
    fetchData();

    // 1. SalesIQ Global Config
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      widgetcode: 'siq728d0317d0309852f4889fdec03e4cabaa5c80fa1a246bd2cdb3b355a354df81',
      values: {},
      ready: function () { }
    };

    // 2. Load SalesIQ Script
    if (!document.getElementById('zsiqscript')) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.id = 'zsiqscript';
      s.defer = true;
      s.src = 'https://salesiq.zoho.in/widget';
      const t = document.getElementsByTagName('script')[0];
      if (t && t.parentNode) {
        t.parentNode.insertBefore(s, t);
      } else {
        document.head.appendChild(s);
      }
    }

    // 3. Load WebForm Analytics
    const rid = "46314d6cd7b797131d787c772cb7865cd4853f5d95033f4032a21156d985d8dfae25216eb11048cc8d21de461b59f221gid5036749f6a9d6d3ed175b8196ebb40789f85835fe8d57a23fa77a70936287653gid370d521989297dcb92397f5e9cbc97ef367beb18c4b4d4f987b22d7409834e9cgide4816e63337d809032a3a9d66f048901ddd49baf514674f90cb44424175ad2e0";
    const tw = "4bbf7e34fddd4ebed6b6920e5ae87ad327c76a5793bdac26016e52b360a121e6";
    
    const existingAnal = document.getElementById('wf_anal_customized');
    if (existingAnal) existingAnal.remove();

    const s = document.createElement('script');
    s.id = 'wf_anal_customized';
    s.src = `https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=${rid}&tw=${tw}`;
    document.body.appendChild(s);

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Destination Management
  const addDestination = () => {
    if (destinations.length < 5) {
      setDestinations([...destinations, { id: Date.now(), name: "", nights: "1 night" }]);
    }
  };

  const updateDestination = (id, field, value) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDestination = (id) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  // Rooms Management
  const totalRooms = rooms.length;
  const totalAdults = rooms.reduce((acc, r) => acc + r.adults, 0);
  const totalChildren = rooms.reduce((acc, r) => acc + r.children, 0);

  const updateRoom = (id, field, delta) => {
    setRooms(prev => prev.map(r => {
      if (r.id === id) {
        const newVal = Math.max(field === 'adults' ? 1 : 0, r[field] + delta);
        return { ...r, [field]: newVal };
      }
      return r;
    }));
  };

  const handleRoomChange = (delta) => {
    if (delta > 0 && rooms.length < 5) {
      setRooms([...rooms, { id: rooms.length + 1, adults: 2, children: 0 }]);
    } else if (delta < 0 && rooms.length > 1) {
      setRooms(rooms.slice(0, -1));
    }
  };

  const trackVisitor = (form) => {
    try {
      if (window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.visitor) {
        const LDTuvidObj = form['LDTuvid'];
        if (LDTuvidObj) {
          LDTuvidObj.value = window.$zoho.salesiq.visitor.uniqueid();
        }
        let name = form['Last Name'].value;
        window.$zoho.salesiq.visitor.name(name);
      }
    } catch (e) { }
  };

  const handleZohoSubmit = (e) => {
    const form = formRef.current;
    const mndFields = ['Last Name', 'Mobile'];
    
    for (let i = 0; i < mndFields.length; i++) {
      const fieldObj = form[mndFields[i]];
      if (fieldObj && fieldObj.value.trim().length === 0) {
        alert(mndFields[i] + ' cannot be empty.');
        fieldObj.focus();
        e.preventDefault();
        return false;
      }
    }

    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (phoneDigits.startsWith("91") && phoneDigits.length !== 12) {
      alert("Please enter a valid 10-digit phone number after (+91).");
      e.preventDefault();
      return false;
    } else if (phoneDigits.length < 10) {
      alert("Please enter a valid phone number.");
      e.preventDefault();
      return false;
    }

    trackVisitor(form);
    
    const submitBtn = form.querySelector('.formsubmit');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');
    return true;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-gray-100 p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
              <Sparkles size={14} />
            </div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-tight">Customized Trip Plan</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={14} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
          <form 
            ref={formRef}
            id='webform482015000013976002' 
            action='https://crm.zoho.in/crm/WebToLeadForm' 
            name='WebToLeads482015000013976002' 
            method='POST' 
            onSubmit={handleZohoSubmit}
            acceptCharset='UTF-8'
            className="space-y-4"
          >
            {/* Zoho Hidden Fields */}
            <input type='text' className="hidden" name='xnQsjsdp' value='03b9acf6a7ad90ed00ac4114c3cb02dc577bcd07fd9c723926dfe8a069d83486' readOnly />
            <input type='hidden' name='zc_gad' id='zc_gad' value='' />
            <input type='text' className="hidden" name='xmIwtLD' value='473fcb54d6914b8d7d67d0dd1782aebb13ef302d2fd1c2c21f8b794832e51903836a2655572cd12f28d71ad68107e91e' readOnly />
            <input type='text' className="hidden" name='actionType' value='TGVhZHM=' readOnly />
            <input type='text' className="hidden" name='returnURL' value={window.location.href} readOnly />
            <input type='text' className="hidden" id='ldeskuid' name='ldeskuid' readOnly />
            <input type='text' className="hidden" id='LDTuvid' name='LDTuvid' readOnly />
            <input type='text' className="hidden" name='aG9uZXlwb3Q' value='' readOnly />

            {/* Sync Fields */}
            <input type="hidden" name="LEADCF52" value={totalRooms} />
            <input type="hidden" name="LEADCF55" value={totalAdults} />
            <input type="hidden" name="LEADCF54" value={totalChildren} />
            <input type="hidden" name="LEADCF19" value={destinations.map(d => `${d.name} (${d.nights})`).join(", ")} />

            {/* Personal Info (Minimized) */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Full Name *</label>
                    <input name='Last Name' type='text' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none" placeholder="Enter name" required />
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Mobile *</label>
                    <input type="hidden" name="Mobile" value={phone} />
                    <PhoneInput
                        country={"in"}
                        value={phone}
                        onChange={(val) => setPhone(val)}
                        inputClass="!w-full !bg-white !border !border-gray-200 !rounded-md !px-2 !py-1.5 !text-[10px] !h-auto !outline-none focus:!border-emerald-500"
                        containerClass="!w-full"
                        buttonClass="!bg-white !border-gray-200 !rounded-l-md"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Email ID</label>
                <input name='Email' type='email' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none" placeholder="Enter your email" />
            </div>

            {/* Destination Workflow */}
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-800 uppercase">Destinations & Nights</label>
              {destinations.map((dest, index) => (
                <div key={dest.id} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                  <div className="flex-1 relative">
                    <select 
                        value={dest.name} 
                        onChange={(e) => updateDestination(dest.id, 'name', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none"
                    >
                        <option value="">Destination</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                  </div>
                  <div className="w-24 relative">
                    <select 
                        value={dest.nights} 
                        onChange={(e) => updateDestination(dest.id, 'nights', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none text-center"
                    >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={`${n} night${n > 1 ? 's' : ''}`}>{n} night{n > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                  </div>
                  {destinations.length > 1 && (
                    <button type="button" onClick={() => removeDestination(dest.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                        <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addDestination}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <Plus size={12} />
                Add Another Destination
              </button>
            </div>

            {/* Starting City & Nationality */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Starting City *</label>
                    <div className="relative">
                        <select name='LEADCF13' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none">
                            <option value="">Select City</option>
                            {cities.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Nationality *</label>
                    <div className="relative">
                        <select name='LEADCF12' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none">
                            <option value="Indian">Indian</option>
                            {nationalities.filter(n => n.name !== "Indian").map(n => (
                                <option key={n.id} value={n.name}>{n.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                </div>
            </div>

            {/* Travel Date & Travelers */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Travel Date *</label>
                    <input name='LEADCF119' type='date' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none" required />
                </div>
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Travelers *</label>
                    <button 
                        type="button" 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none flex items-center justify-between"
                    >
                        <span>{totalRooms} Rm, {totalAdults} Ad</span>
                        <ChevronDown size={12} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 z-[100] p-3 animate-in fade-in slide-in-from-top-1 duration-200">
                             <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[10px] font-black uppercase text-gray-800">Rooms</span>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => handleRoomChange(-1)} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">-</button>
                                    <span className="text-[10px] font-black">{totalRooms}</span>
                                    <button type="button" onClick={() => handleRoomChange(1)} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">+</button>
                                </div>
                            </div>
                            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                {rooms.map((room) => (
                                    <div key={room.id} className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">Room {room.id}</p>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-bold text-gray-500">Adults</span>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => updateRoom(room.id, 'adults', -1)} className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px]">-</button>
                                                    <span className="text-[10px] font-black">{room.adults}</span>
                                                    <button type="button" onClick={() => updateRoom(room.id, 'adults', 1)} className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px]">+</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-bold text-gray-500">Children</span>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => updateRoom(room.id, 'children', -1)} className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px]">-</button>
                                                    <span className="text-[10px] font-black">{room.children}</span>
                                                    <button type="button" onClick={() => updateRoom(room.id, 'children', 1)} className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white text-gray-400 text-[10px]">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => setIsDropdownOpen(false)} className="w-full mt-3 py-1 bg-emerald-600 text-white text-[9px] font-black uppercase rounded transition-colors">Done</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Star Rating & Holiday Type */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Hotel Star Rating</label>
                    <div className="relative">
                        <select name='LEADCF17' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none">
                            <option value="">Select Rating</option>
                            {["3 Star", "4 Star", "5 Star", "Luxury"].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Holiday Type</label>
                    <div className="relative">
                        <select name='LEADCF18' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none">
                            <option value="">Select Type</option>
                            {["Family", "Honeymoon", "Adventure", "Religious", "Business"].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                </div>
            </div>

            {/* Room Type & Meal Plan */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Room Type</label>
                    <input name='LEADCF15' type='text' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none" placeholder="Ex: Deluxe, Suite" />
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Meal Plan</label>
                    <div className="relative">
                        <select name='LEADCF20' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none">
                            <option value="Select Meal Plan">Select Meal Plan</option>
                            <option value='Breakfast Only (CP)'>Breakfast Only (CP)</option>
                            <option value='Breakfast + Dinner (MAP)'>Breakfast + Dinner (MAP)</option>
                            <option value='All Meals (AP)'>All Meals (AP)</option>
                            <option value='Room Only'>Room Only</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                </div>
            </div>

            {/* Transfer & Budget */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Transfer Details</label>
                    <input name='LEADCF16' type='text' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none" placeholder="Ex: Private AC Car" />
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Budget Per Person</label>
                    <input name='LEADCF66' type='text' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none" placeholder="Ex: ₹25,000 – ₹60,000" />
                </div>
            </div>

            {/* Special Requests */}
            <div>
                <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Other Inclusions / Special Requests</label>
                <textarea name='LEADCF14' rows="3" className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none resize-none" placeholder="Tell us about sightseeing, specific activities, etc."></textarea>
            </div>

            {/* Submit */}
            <button type='submit' className="formsubmit w-full bg-[#14532d] hover:bg-[#0f4022] text-white py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] mt-2">
                Submit Request
            </button>

            <p className="text-center text-[7px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                Secure CRM Integration • Privacy Protected
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ZohoCustomizedForm;
