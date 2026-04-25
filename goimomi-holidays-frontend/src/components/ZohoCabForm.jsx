import React, { useEffect, useRef, useState } from "react";
import { X, Car, Calendar } from "lucide-react";
import api from "../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * ZohoCabForm Component
 * Specialized Zoho CRM Web-to-Lead form for Cab Bookings.
 */
const ZohoCabForm = ({ isOpen, onClose, initialData = {} }) => {
  const formRef = useRef(null);
  const [vehicles, setVehicles] = useState([]);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    // Fetch master vehicle list
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/api/vehicle-masters/');
        const data = response.data;
        const vehicleList = Array.isArray(data) ? data : (data.results || []);
        setVehicles(vehicleList);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();

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

    // 3. Load WebForm Analytics for this specific form
    const rid = "fd429c25d9e963691383f1f5055fc2e630f44c60d7d8be7f5b3a75ea0c17e9cb02e3a42320715dfcd55248f5bfa3be6egidb2f7e5fe8cef6f39eea948db2d41ff93c605e92d138526c3b589ed2be32a018bgid39176fc5169993a5a6acfecf109d49aa58fe6e5df58b54a78866c4f64d173bebgid8f42256b19d1de84ce31ff267cb3c92cc2d325bcf099b15b6a3210df96d3ce3b";
    const tw = "ca62c34672bfc5382ffce7de8a4f2f8ed353057ef653a447c8dd80820468d60e";
    
    // Remove existing analytics script if it exists to avoid conflicts
    const existingAnal = document.getElementById('wf_anal_cab');
    if (existingAnal) existingAnal.remove();

    const s = document.createElement('script');
    s.id = 'wf_anal_cab';
    s.src = `https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=${rid}&tw=${tw}`;
    document.body.appendChild(s);

    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation functions from Zoho snippet
  const validateEmail = (form) => {
    const emailFld = form.querySelectorAll('[ftype=email]');
    for (let i = 0; i < emailFld.length; i++) {
      const emailVal = emailFld[i].value;
      if (emailVal.trim().length !== 0) {
        const atpos = emailVal.indexOf('@');
        const dotpos = emailVal.lastIndexOf('.');
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length) {
          alert('Please enter a valid email address.');
          emailFld[i].focus();
          return false;
        }
      }
    }
    return true;
  };

  const trackVisitor = (form) => {
    try {
      if (window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.visitor) {
        const LDTuvidObj = form['LDTuvid'];
        if (LDTuvidObj) {
          LDTuvidObj.value = window.$zoho.salesiq.visitor.uniqueid();
        }
        let name = form['Last Name'].value;
        const firstnameObj = form['First Name'];
        if (firstnameObj && firstnameObj.value) {
          name = firstnameObj.value + ' ' + name;
        }
        window.$zoho.salesiq.visitor.name(name);
        const emailObj = form['Email'];
        if (emailObj && emailObj.value) {
          window.$zoho.salesiq.visitor.email(emailObj.value);
        }
      }
    } catch (e) { 
        console.error("SalesIQ tracking error:", e);
    }
  };

  const handleZohoSubmit = (e) => {
    const form = formRef.current;
    const mndFields = ['Last Name', 'Email', 'Mobile'];
    const fldLangVal = ['FULL NAME', 'EMAIL', 'MOBILE'];

    for (let i = 0; i < mndFields.length; i++) {
        const fieldObj = form[mndFields[i]];
        if (fieldObj) {
            if (fieldObj.value.trim().length === 0) {
                alert(fldLangVal[i] + ' cannot be empty.');
                fieldObj.focus();
                e.preventDefault();
                return false;
            }
        }
    }

    // Phone validation: MUST be at least 10 digits after country code
    const phoneDigits = (phone || "").replace(/\D/g, "");
    // If it's India (+91), it should be 12 digits total (91 + 10 digits)
    if (phoneDigits.startsWith("91")) {
        if (phoneDigits.length !== 12) {
            alert("Please enter a valid 10-digit phone number after the country code (+91).");
            e.preventDefault();
            return false;
        }
    } else {
        // For other countries, just ensure it's reasonably long (e.g., at least 10 digits total)
        if (phoneDigits.length < 10) {
            alert("Please enter a valid phone number.");
            e.preventDefault();
            return false;
        }
    }

    trackVisitor(form);
    if (!validateEmail(form)) {
      e.preventDefault();
      return false;
    }
    
    // Disable button to prevent double submit
    const submitBtn = form.querySelector('.formsubmit');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');
    
    // Form will proceed with standard POST to Zoho
    return true;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 to-cyan-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-400 hover:text-gray-900"
        >
          <X size={18} />
        </button>

        <div className="p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <Car size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-[#14532d] leading-tight tracking-tight uppercase">
                        Cab Booking
                    </h2>
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-tight">
                        {initialData.fromCity && initialData.toCity 
                          ? `${initialData.fromCity} to ${initialData.toCity}`
                          : "Book your premium transfer today."}
                    </p>
                </div>
            </div>

            <form 
              ref={formRef}
              id='webform482015000013960215' 
              action='https://crm.zoho.in/crm/WebToLeadForm' 
              name='WebToLeads482015000013960215' 
              method='POST' 
              onSubmit={handleZohoSubmit}
              acceptCharset='UTF-8'
              className="space-y-2.5"
            >
                {/* Zoho Required Hidden Fields */}
                <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='1e89b966f4a9f4b3bfabf844f2be0a8d436d124b985dc8f3c90db10cc0cb1330' readOnly />
                <input type='hidden' name='zc_gad' id='zc_gad' value='' />
                <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='d8a92adbd57663bcda6d9a4b7207e7e17494ffeb531b4644e2dc7fe43ae17c6d106da7c4d7be3b48cfb6cf82c4ae2841' readOnly />
                <input type='text' style={{ display: 'none' }} name='actionType' value='TGVhZHM=' readOnly />
                <input type='text' style={{ display: 'none' }} name='returnURL' value={window.location.href} readOnly />
                <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' value='' readOnly />
                <input type='text' style={{ display: 'none' }} id='ldeskuid' name='ldeskuid' readOnly />
                <input type='text' style={{ display: 'none' }} id='LDTuvid' name='LDTuvid' readOnly />

                {/* Visible Fields - Personal Info */}
                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                    <input 
                        name='Last Name' 
                        type='text' 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                        placeholder="John Doe" 
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email *</label>
                        <input 
                            name='Email' 
                            type='text' 
                            ftype='email'
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="john@example.com" 
                            required
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile *</label>
                        <input type="hidden" name="Mobile" value={phone} />
                        <PhoneInput
                            country={"in"}
                            value={phone}
                            onChange={(val) => setPhone(val)}
                            inputClass="!w-full !bg-gray-50 !border-2 !border-transparent focus:!border-emerald-50 focus:!bg-white !rounded-xl !px-3 !py-1.5 !text-[10px] !font-bold !outline-none !transition-all !h-[31px]"
                            containerClass="!w-full"
                            buttonClass="!bg-gray-50 !border-none !rounded-l-xl"
                            dropdownClass="!rounded-xl !shadow-2xl !border-gray-100 !text-[10px] !font-bold !py-1 !max-h-[200px]"
                        />
                    </div>
                </div>

                {/* Visible Fields - Cab Info */}
                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Vehicle</label>
                    <select 
                        name='LEADCF11' 
                        defaultValue={
                            initialData.vehicle && !initialData.vehicle.startsWith("Transfer Enquiry") 
                            ? initialData.vehicle 
                            : "-None-"
                        }
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                    >
                        <option value='-None-'>-None-</option>
                        {initialData.vehicle && 
                         !initialData.vehicle.startsWith("Transfer Enquiry") && 
                         !vehicles.some(v => v.name === initialData.vehicle) && (
                            <option value={initialData.vehicle}>{initialData.vehicle}</option>
                        )}
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">From City</label>
                        <input 
                            name='LEADCF8' 
                            type='text' 
                            defaultValue={initialData.fromCity || ""}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="e.g. Mumbai" 
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">To City</label>
                        <input 
                            name='LEADCF7' 
                            type='text' 
                            defaultValue={initialData.toCity || ""}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="e.g. Goa" 
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Request (Optional)</label>
                    <textarea 
                        name='LEADCF6' 
                        rows="2"
                        defaultValue={
                            initialData.vehicle && initialData.vehicle.startsWith("Transfer Enquiry")
                            ? initialData.vehicle
                            : ""
                        }
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all resize-none" 
                        placeholder="Any specific vehicle or pickup requirements?"
                    ></textarea>
                </div>

                <button 
                  type='submit' 
                  className="formsubmit w-full bg-[#14532d] hover:bg-[#0f4022] text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/10 transition-all active:scale-[0.98] mt-1"
                >
                    Submit Booking
                </button>
            </form>
            
            <p className="mt-4 text-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                Secure Zoho CRM Integration • Privacy Protected
            </p>
        </div>
      </div>
    </div>
  );
};

export default ZohoCabForm;
