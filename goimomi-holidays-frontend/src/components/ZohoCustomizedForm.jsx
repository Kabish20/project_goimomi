import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, MapPin, Calendar, Users, Home, ChevronDown, Clock, Globe, Briefcase, Star, Utensils, MessageSquare, CreditCard, Sparkles, Plus, Search } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "../api";
import { simpleCache } from "../utils/cache";

/**
 * Custom Searchable Select to "minimize" the massive dropdown list
 * and improve both performance and usability.
 */
const SearchableSelect = React.memo(({ name, placeholder, options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!search) return options.slice(0, 100); // Limit initial view for performance
    const term = search.toLowerCase();
    return options.filter(opt => opt.name.toLowerCase().includes(term)).slice(0, 100);
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  const selectedName = useMemo(() => {
      return options.find(o => o.name === value)?.name || "";
  }, [options, value]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input type="hidden" name={name} value={value} />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedName || placeholder}
        </span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-[1100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-1 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Search size={10} className="text-gray-400 ml-1" />
            <input 
              autoFocus
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent border-none outline-none text-[10px] py-1"
            />
          </div>
          <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt.id} 
                  onClick={() => handleSelect(opt.name)}
                  className="px-3 py-1.5 text-[10px] hover:bg-emerald-50 cursor-pointer transition-colors text-gray-700 font-medium"
                >
                  {opt.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-[10px] text-gray-400 italic">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

const DestinationRow = React.memo(({ dest, cities, updateDestination, removeDestination, showRemove }) => (
  <div className="flex gap-2 animate-in slide-in-from-left-1 duration-200">
    <SearchableSelect 
      className="flex-1"
      placeholder="Destination"
      options={cities}
      value={dest.name}
      onChange={(val) => updateDestination(dest.id, 'name', val)}
    />
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
    {showRemove && (
      <button type="button" onClick={() => removeDestination(dest.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
          <X size={14} />
      </button>
    )}
  </div>
));

const RoomConfig = React.memo(({ room, updateRoom }) => (
    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
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
));

/**
 * ZohoCustomizedForm Component
 */
const ZohoCustomizedForm = ({ isOpen, onClose, initialData = {} }) => {
  const formRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [rooms, setRooms] = useState([{ id: 1, adults: 2, children: 0 }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [destinations, setDestinations] = useState([{ id: Date.now(), name: "", nights: "1 night" }]);
  const [cities, setCities] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [startCity, setStartCity] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [citiesRes, natRes] = await Promise.all([
          simpleCache("cities", () => api.get("/api/cities/")),
          simpleCache("nationalities", () => api.get("/api/nationalities/"))
        ]);
        setCities(citiesRes.data || []);
        setNationalities(natRes.data || []);
      } catch (err) {
        console.error("Error fetching form data:", err);
      }
    };
    fetchData();

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

    const rid = "46314d6cd7b797131d787c772cb7865cd4853f5d95033f4032a21156d985d8dfae25216eb11048cc8d21de461b59f221gid5036749f6a9d6d3ed175b8196ebb40789f85835fe8d57a23fa77a70936287653gid370d521989297dcb92397f5e9cbc97ef367beb18c4b4d4f987b22d7409834e9cgide4816e63337d809032a3a9d66f048901ddd49baf514674f90cb44424175ad2e0";
    const tw = "4bbf7e34fddd4ebed6b6920e5ae87ad327c76a5793bdac26016e52b360a121e6";
    if (!document.getElementById('wf_anal_customized')) {
      const s = document.createElement('script');
      s.id = 'wf_anal_customized';
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addDestination = useCallback(() => {
    if (destinations.length < 5) {
      setDestinations(prev => [...prev, { id: Date.now(), name: "", nights: "1 night" }]);
    }
  }, [destinations.length]);

  const updateDestination = useCallback((id, field, value) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  }, []);

  const removeDestination = useCallback((id) => {
    setDestinations(prev => prev.length > 1 ? prev.filter(d => d.id !== id) : prev);
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
    const mndFields = ['Last Name', 'Mobile', 'LEADCF13'];
    for (let i = 0; i < mndFields.length; i++) {
      const fld = form[mndFields[i]];
      if (fld && fld.value.trim().length === 0) {
        alert(mndFields[i] === 'LEADCF13' ? 'Starting City cannot be empty.' : mndFields[i] + ' cannot be empty.');
        if (fld.focus) fld.focus();
        e.preventDefault(); return false;
      }
    }
    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (phoneDigits.startsWith("91") && phoneDigits.length !== 12) {
      alert("Please enter a valid 10-digit phone number after (+91).");
      e.preventDefault(); return false;
    }
    const submitBtn = form.querySelector('.formsubmit');
    if (submitBtn) { submitBtn.setAttribute('disabled', 'true'); submitBtn.innerText = "SUBMITTING..."; }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-gray-100 p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-50 rounded flex items-center justify-center text-emerald-600"><Sparkles size={14} /></div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-tight">Customized Trip Plan</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={14} /></button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
          <form ref={formRef} action='https://crm.zoho.in/crm/WebToLeadForm' method='POST' onSubmit={handleZohoSubmit} acceptCharset='UTF-8' className="space-y-4">
            <input type='text' className="hidden" name='xnQsjsdp' value='03b9acf6a7ad90ed00ac4114c3cb02dc577bcd07fd9c723926dfe8a069d83486' readOnly />
            <input type='text' className="hidden" name='xmIwtLD' value='473fcb54d6914b8d7d67d0dd1782aebb13ef302d2fd1c2c21f8b794832e51903836a2655572cd12f28d71ad68107e91e' readOnly />
            <input type='text' className="hidden" name='actionType' value='TGVhZHM=' readOnly />
            <input type='text' className="hidden" name='returnURL' value={window.location.href} readOnly />

            <input type="hidden" name="LEADCF52" value={totalRooms} />
            <input type="hidden" name="LEADCF55" value={totalAdults} />
            <input type="hidden" name="LEADCF54" value={totalChildren} />
            <input type="hidden" name="LEADCF19" value={destinations.map(d => `${d.name} (${d.nights})`).join(", ")} />

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Full Name *</label>
                    <input name='Last Name' type='text' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] outline-none" placeholder="Enter name" required />
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Mobile *</label>
                    <input type="hidden" name="Mobile" value={phone} />
                    <PhoneInput country={"in"} value={phone} onChange={setPhone} inputClass="!w-full !bg-white !border !border-gray-200 !rounded-md !px-2 !py-1.5 !text-[10px] !h-auto !outline-none" containerClass="!w-full" buttonClass="!bg-white !border-gray-200 !rounded-l-md" />
                </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-800 uppercase">Destinations & Nights</label>
              {destinations.map((dest) => (
                <DestinationRow key={dest.id} dest={dest} cities={cities} updateDestination={updateDestination} removeDestination={removeDestination} showRemove={destinations.length > 1} />
              ))}
              <button type="button" onClick={addDestination} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={12} />Add Another Destination</button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Starting City *</label>
                    <SearchableSelect 
                        name="LEADCF13"
                        placeholder="Select City"
                        options={cities}
                        value={startCity}
                        onChange={setStartCity}
                    />
                </div>
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Nationality *</label>
                    <SearchableSelect 
                        name="LEADCF12"
                        placeholder="Indian"
                        options={nationalities}
                        value={nationality}
                        onChange={setNationality}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Travel Date *</label>
                    <input name='LEADCF119' type='date' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] outline-none" required />
                </div>
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Travelers *</label>
                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] flex items-center justify-between">
                        <span>{totalRooms} Rm, {totalAdults} Ad</span>
                        <ChevronDown size={12} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute bottom-full mb-1 right-0 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 z-[100] p-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
                             <div className="flex items-center justify-between mb-3 px-1"><span className="text-[10px] font-black uppercase text-gray-800">Rooms</span>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => handleRoomChange(-1)} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">-</button>
                                    <span className="text-[10px] font-black">{totalRooms}</span>
                                    <button type="button" onClick={() => handleRoomChange(1)} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400">+</button>
                                </div>
                            </div>
                            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                {rooms.map((room) => <RoomConfig key={room.id} room={room} updateRoom={updateRoom} />)}
                            </div>
                            <button type="button" onClick={() => setIsDropdownOpen(false)} className="w-full mt-3 py-1 bg-emerald-600 text-white text-[9px] font-black uppercase rounded transition-colors">Done</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Hotel Star Rating</label><div className="relative"><select name='LEADCF17' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none"><option value="">Select Rating</option>{["3 Star", "4 Star", "5 Star", "Luxury"].map(v => <option key={v} value={v}>{v}</option>)}</select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} /></div></div>
                <div><label className="block text-[9px] font-black text-gray-800 uppercase mb-1">Holiday Type</label><div className="relative"><select name='LEADCF18' className="w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-[10px] focus:border-emerald-500 outline-none appearance-none"><option value="">Select Type</option>{["Family", "Honeymoon", "Adventure", "Religious", "Business"].map(v => <option key={v} value={v}>{v}</option>)}</select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} /></div></div>
            </div>

            <button type='submit' className="formsubmit w-full bg-[#14532d] hover:bg-[#0f4022] text-white py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-[0.98]">Submit Request</button>
            <p className="text-center text-[7px] text-gray-300 font-bold uppercase tracking-[0.2em]">Secure CRM Integration • Privacy Protected</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ZohoCustomizedForm;
