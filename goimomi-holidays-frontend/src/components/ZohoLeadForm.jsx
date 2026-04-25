import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * ZohoLeadForm Component
 * Integrates Zoho CRM Web-to-Lead form with tracking scripts.
 */
const ZohoLeadForm = ({ isOpen, onClose }) => {
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
      t.parentNode.insertBefore(s, t);
    }

    // 3. Load WebForm Analytics
    if (!document.getElementById('wf_anal')) {
      const s = document.createElement('script');
      s.id = 'wf_anal';
      s.src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=cde622e98f7942ba164c5ce71a7e612826cb68616d5a4aef5d7f322c50d9d000225d9e68318503e2fb3cf07bb9dd218egid0fe9a73839d69162756a1f89bedd485547cb496f7ab27f3396e683f5c984dabfgidf541afbfaac05d2d701a371d6283ca459eee0ef31e4bc2648c8e547d9a3f568bgid4f94531f003bee82574bef2c5ff2490a3683efac7f03460382243887f38c9ca2&tw=2ef601e1a4a980e4592591b550ce5396f0ffb88dfb181ecd8750d2f869dd6e97';
      document.body.appendChild(s);
    }

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
      if (window.$zoho) {
        const LDTuvidObj = form['LDTuvid'];
        if (LDTuvidObj) {
          LDTuvidObj.value = window.$zoho.salesiq.visitor.uniqueid();
        }
        let name = form['Last Name'].value;
        const firstnameObj = form['First Name'];
        if (firstnameObj) {
          name = firstnameObj.value + ' ' + name;
        }
        window.$zoho.salesiq.visitor.name(name);
        const emailObj = form['Email'];
        if (emailObj) {
          window.$zoho.salesiq.visitor.email(emailObj.value);
        }
      }
    } catch (e) { }
  };

  const handleZohoSubmit = (e) => {
    const form = formRef.current;
    const mndFields = ['First Name', 'Last Name', 'Email', 'Mobile'];
    const fldLangVal = ['FIRST NAME', 'LAST NAME', 'EMAIL ADDRESS', 'PHONE NUMBER'];

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
      <div className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-400 hover:text-gray-900"
        >
          <X size={18} />
        </button>

        <div className="p-5 md:p-6">
            <h2 className="text-lg font-black text-[#14532d] mb-1 leading-tight tracking-tight">
                Welcome to Goimomi Holidays
            </h2>
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-4">
                Briefly share details with us.
            </p>

            <form 
              ref={formRef}
              id='webform482015000012389518' 
              action='https://crm.zoho.in/crm/WebToLeadForm' 
              name='WebToLeads482015000012389518' 
              method='POST' 
              onSubmit={handleZohoSubmit}
              acceptCharset='UTF-8'
              className="space-y-2.5"
            >
                {/* Zoho Required Hidden Fields */}
                <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='f98456093f3d9fa012da9b1f392957a6f9a73df303a1745e5005096696b06141' readOnly />
                <input type='hidden' name='zc_gad' id='zc_gad' value='' />
                <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='ca4c8c8f45e08494ccd44bede0849324b1a1f04a724600548b754da18ce709e1f7ad4e6116a66e64846484a5dfaa8824' readOnly />
                <input type='text' style={{ display: 'none' }} name='actionType' value='TGVhZHM=' readOnly />
                <input type='text' style={{ display: 'none' }} name='returnURL' value={window.location.href} readOnly />
                <input type='text' style={{ display: 'none' }} id='ldeskuid' name='ldeskuid' readOnly />
                <input type='text' style={{ display: 'none' }} id='LDTuvid' name='LDTuvid' readOnly />
                <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' value='' readOnly />

                {/* Visible Fields */}
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name *</label>
                        <input 
                            name='First Name' 
                            type='text' 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-50 focus:bg-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none transition-all" 
                            placeholder="John" 
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name *</label>
                        <input 
                            name='Last Name' 
                            type='text' 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-50 focus:bg-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none transition-all" 
                            placeholder="Doe" 
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                    <input 
                        name='Email' 
                        type='text' 
                        ftype='email'
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-50 focus:bg-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none transition-all" 
                        placeholder="john@example.com" 
                    />
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number *</label>
                    <input type="hidden" name="Mobile" value={phone} />
                    <PhoneInput
                        country={"in"}
                        value={phone}
                        onChange={(val) => setPhone(val)}
                        inputClass="!w-full !bg-gray-50 !border-2 !border-transparent focus:!border-green-50 focus:!bg-white !rounded-xl !px-3 !py-1.5 !text-xs !font-bold !outline-none !transition-all !h-[34px]"
                        containerClass="!w-full"
                        buttonClass="!bg-gray-50 !border-none !rounded-l-xl"
                        dropdownClass="!rounded-xl !shadow-2xl !border-gray-100 !text-[10px] !font-bold !py-1 !max-h-[200px]"
                    />
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                        name='Description' 
                        rows="2"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-50 focus:bg-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none transition-all resize-none" 
                        placeholder="How can we help?"
                    ></textarea>
                </div>

                <button 
                  type='submit' 
                  className="formsubmit w-full bg-[#14532d] hover:bg-[#0f4022] text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/10 transition-all active:scale-[0.98] mt-1"
                >
                    Submit Details
                </button>
            </form>
            
            <p className="mt-4 text-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                Secure CRM Integration • Privacy Protected
            </p>
        </div>
      </div>
    </div>
  );
};

export default ZohoLeadForm;
