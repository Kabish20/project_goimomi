import React, { useEffect, useRef, useState } from "react";
import { X, Ship, Calendar } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * ZohoCruiseForm Component
 * Specialized Zoho CRM Web-to-Lead form for Cruise Enquiries.
 */
const ZohoCruiseForm = ({ isOpen, onClose, initialData = {} }) => {
  const formRef = useRef(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isOpen) return;

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
    const rid = "7368c4cda5b97e3ffd4904f12f38b410ad6a800e19a94727d5b778e5df488d8eee46a18e15dcabf8cfdca4b251fb32a2gidac61a9e28d6886309aec5390c781c2dd8547047e959baf5054b0e111f08ae4cegide4dd80880e862c2d39a2856cf8766252edbaae35b328b0f18aa7f55094db4013gid8f566533f9f3cd217c3aca05fe60fb316b8fa25258927d1f9440341551d563c2";
    const tw = "bd837f6c28568dc8cd5d342212f5b08b83564c342b1606bde6374f6f149dfbcd";
    
    // Remove existing analytics script if it exists to avoid conflicts
    const existingAnal = document.getElementById('wf_anal_cruise');
    if (existingAnal) existingAnal.remove();

    const s = document.createElement('script');
    s.id = 'wf_anal_cruise';
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
    if (phoneDigits.startsWith("91")) {
        if (phoneDigits.length !== 12) {
            alert("Please enter a valid 10-digit phone number after the country code (+91).");
            e.preventDefault();
            return false;
        }
    } else if (phoneDigits.length < 10) {
        alert("Please enter a valid phone number.");
        e.preventDefault();
        return false;
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
      <div className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
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
                    <Ship size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-[#14532d] leading-tight tracking-tight">
                        Cruise Enquiry
                    </h2>
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                        Plan your luxury voyage with us.
                    </p>
                </div>
            </div>

            <form 
              ref={formRef}
              id='webform482015000013960190' 
              action='https://crm.zoho.in/crm/WebToLeadForm' 
              name='WebToLeads482015000013960190' 
              method='POST' 
              onSubmit={handleZohoSubmit}
              acceptCharset='UTF-8'
              className="space-y-2.5"
            >
                {/* Zoho Required Hidden Fields */}
                <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='913b4cee6f9d0d43455b9b429a994b8fae481b82d5dd5c053a380e216e4dd79a' readOnly />
                <input type='hidden' name='zc_gad' id='zc_gad' value='' />
                <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='96d21536d8ae8ea725ef0a87dca8a1dc739fadb6d5462013c0902f01c23d8ccaf451b68d635945c6ab9f9087f69473d3' readOnly />
                <input type='text' style={{ display: 'none' }} name='actionType' value='TGVhZHM=' readOnly />
                <input type='text' style={{ display: 'none' }} name='returnURL' value={window.location.href} readOnly />
                <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' value='' readOnly />
                <input type='text' style={{ display: 'none' }} id='LDTuvid' name='LDTuvid' readOnly />

                {/* Visible Fields - Personal Info */}
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                        <input 
                            name='First Name' 
                            type='text' 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="John" 
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name *</label>
                        <input 
                            name='Last Name' 
                            type='text' 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="Doe" 
                            required
                        />
                    </div>
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

                {/* Visible Fields - Cruise Info */}
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">From City</label>
                        <input 
                            name='LEADCF10' 
                            type='text' 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="e.g. Mumbai" 
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">To City</label>
                        <input 
                            name='LEADCF5' 
                            type='text' 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all" 
                            placeholder="e.g. Goa" 
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Sailing Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        <input 
                            name='LEADCF117' 
                            type='date' 
                            ftype='date'
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl py-1.5 pl-9 pr-3 text-[10px] font-bold outline-none transition-all" 
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Requests (Optional)</label>
                    <textarea 
                        name='LEADCF9' 
                        rows="2"
                        defaultValue={initialData.description || ""}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-50 focus:bg-white rounded-xl px-3 py-1.5 text-[10px] font-bold outline-none transition-all resize-none" 
                        placeholder="Share your specific requirements..."
                    ></textarea>
                </div>

                <button 
                  type='submit' 
                  className="formsubmit w-full bg-[#14532d] hover:bg-[#0f4022] text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/10 transition-all active:scale-[0.98] mt-1"
                >
                    Submit Enquiry
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

export default ZohoCruiseForm;
