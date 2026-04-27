import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * ZohoCabForm Component
 * Updated with the latest Zoho CRM Web-To-Lead snippet for cab bookings.
 */
const ZohoCabForm = ({ isOpen, onClose, initialData = {} }) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. SalesIQ Global Config & Script
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      widgetcode: 'siq728d0317d0309852f4889fdec03e4cabaa5c80fa1a246bd2cdb3b355a354df81',
      values: {},
      ready: function () { }
    };

    if (!document.getElementById('zsiqscript')) {
      const d = document;
      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.id = 'zsiqscript';
      s.defer = true;
      s.src = 'https://salesiq.zoho.in/widget';
      const t = d.getElementsByTagName('script')[0];
      if (t && t.parentNode) {
        t.parentNode.insertBefore(s, t);
      } else {
        document.head.appendChild(s);
      }
    }

    // 2. WebForm Analytics Tracking
    if (!document.getElementById('wf_anal')) {
      const s = document.createElement('script');
      s.id = 'wf_anal';
      s.src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=fd429c25d9e963691383f1f5055fc2e630f44c60d7d8be7f5b3a75ea0c17e9cb02e3a42320715dfcd55248f5bfa3be6egidb2f7e5fe8cef6f39eea948db2d41ff93c605e92d138526c3b589ed2be32a018bgid39176fc5169993a5a6acfecf109d49aa58fe6e5df58b54a78866c4f64d173bebgid8f42256b19d1de84ce31ff267cb3c92cc2d325bcf099b15b6a3210df96d3ce3b&tw=ca62c34672bfc5382ffce7de8a4f2f8ed353057ef653a447c8dd80820468d60e';
      document.body.appendChild(s);
    }

    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (form) => {
    const emailFld = form.querySelectorAll('[ftype=email]');
    for (let i = 0; i < emailFld.length; i++) {
      const emailVal = emailFld[i].value;
      if (emailVal.trim().length !== 0) {
        const atpos = emailVal.indexOf('@');
        const dotpos = emailVal.lastIndexOf('.');
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length) {
          alert('Please enter a valid email address. ');
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
    document.charset = "UTF-8";

    // Mandatory fields check from snippet
    const mndFields = ['Last Name', 'Email', 'Mobile'];
    const fldLangVal = ['Full Name', 'Email', 'Mobile'];

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

    trackVisitor(form);
    if (!validateEmail(form)) {
      e.preventDefault();
      return false;
    }

    // Disable button to prevent double submit
    const submitBtn = form.querySelector('.formsubmit');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');

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
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-400 hover:text-gray-900"
        >
          <X size={18} />
        </button>

        <div id='crmWebToEntityForm' className='zcwf_lblLeft crmWebToEntityForm' style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '25px', boxSizing: 'border-box', textAlign: 'left' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            #crmWebToEntityForm.zcwf_lblLeft * { box-sizing: border-box; direction: ltr; }
            .zcwf_lblLeft .zcwf_title { word-wrap: break-word; padding: 0px 6px 15px; font-weight: bold; font-family: Arial; font-size: 18px; color: #14532d; border-bottom: 1px solid #f0f0f0; margin-bottom: 20px; }
            .zcwf_lblLeft .zcwf_row { margin: 15px 0px; display: flex; align-items: flex-start; }
            .zcwf_lblLeft .zcwf_col_lab { width: 30%; font-size: 12px; font-family: Arial; padding: 10px 6px 0px; font-weight: bold; color: #4b5563; }
            .zcwf_lblLeft .zcwf_col_fld { width: 70%; padding: 0px 6px; position: relative; }
            .zcwf_lblLeft .zcwf_col_fld input[type=text], .zcwf_lblLeft .zcwf_col_fld select, .zcwf_lblLeft .zcwf_col_fld textarea { 
              width: 100%; border: 1px solid #c0c6cc !important; border-radius: 8px; padding: 10px; font-family: Arial; font-size: 13px; outline: none; transition: all 0.2s; background: #f9fafb;
            }
            .zcwf_lblLeft .zcwf_col_fld input:focus, .zcwf_lblLeft .zcwf_col_fld select:focus, .zcwf_lblLeft .zcwf_col_fld textarea:focus { border-color: #10b981 !important; background: #fff; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05); }
            .zcwf_lblLeft .formsubmit.zcwf_button { 
              color: white !important; background: linear-gradient(0deg, #14532d 0%, #10b981 100%); border: none; padding: 12px 30px; cursor: pointer; font-weight: bold; border-radius: 8px; font-size: 14px; transition: transform 0.2s;
            }
            .zcwf_lblLeft .formsubmit.zcwf_button:hover { transform: translateY(-1px); }
            .zcwf_lblLeft .zcwf_button { font-size: 13px; color: #313949; border: 1px solid #c0c6cc; padding: 12px 25px; border-radius: 8px; cursor: pointer; margin-right: 10px; background: #fff; }
            @media all and (max-width: 600px) {
              .zcwf_lblLeft .zcwf_row { flex-direction: column; }
              .zcwf_lblLeft .zcwf_col_lab { width: 100%; padding-bottom: 5px; }
              .zcwf_lblLeft .zcwf_col_fld { width: 100%; }
            }
          `}} />

          <div className='zcwf_title'>Cab Booking Enquiry</div>
          
          <form 
            ref={formRef}
            id='webform482015000013960215' 
            action='https://crm.zoho.in/crm/WebToLeadForm' 
            name='WebToLeads482015000013960215' 
            method='POST' 
            onSubmit={handleZohoSubmit} 
            acceptCharset='UTF-8'
          >
            {/* Hidden Fields from Snippet */}
            <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='1e89b966f4a9f4b3bfabf844f2be0a8d436d124b985dc8f3c90db10cc0cb1330' readOnly />
            <input type='hidden' name='zc_gad' id='zc_gad' value='' />
            <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='d8a92adbd57663bcda6d9a4b7207e7e17494ffeb531b4644e2dc7fe43ae17c6d106da7c4d7be3b48cfb6cf82c4ae2841' readOnly />
            <input type='text' style={{ display: 'none' }} name='actionType' value='TGVhZHM=' readOnly />
            <input type='text' style={{ display: 'none' }} name='returnURL' value='null' readOnly />
            <input type='text' style={{ display: 'none' }} id='ldeskuid' name='ldeskuid' readOnly />
            <input type='text' style={{ display: 'none' }} id='LDTuvid' name='LDTuvid' readOnly />
            <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' value='' readOnly />

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Last_Name'>Full Name <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'><input type='text' id='Last_Name' name='Last Name' maxLength='80' placeholder="Enter full name" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Email'>Email <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'><input type='text' ftype='email' id='Email' name='Email' maxLength='100' placeholder="john@example.com" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Mobile'>Mobile <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'><input type='text' id='Mobile' name='Mobile' maxLength='30' placeholder="+91" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF11'>Select Vehicle</label></div>
              <div className='zcwf_col_fld'>
                <select id='LEADCF11' name='LEADCF11'>
                  <option value='-None-'>-None-</option>
                  <option value='Car'>Car</option>
                  <option value='AC Car'>AC Car</option>
                </select>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF8'>From City</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF8' name='LEADCF8' maxLength='255' placeholder="Departure city" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF7'>To City</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF7' name='LEADCF7' maxLength='255' placeholder="Destination city" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF6'>Special Request</label></div>
              <div className='zcwf_col_fld'><textarea id='LEADCF6' name='LEADCF6' rows="3" placeholder="Any specific requirements?"></textarea></div>
            </div>

            <div className='zcwf_row' style={{ marginTop: '20px' }}>
              <div className='zcwf_col_lab'></div>
              <div className='zcwf_col_fld'>
                <input type='submit' id='formsubmit' className='formsubmit zcwf_button' value='Submit Booking' />
                <input type='reset' className='zcwf_button' value='Reset' />
              </div>
            </div>
          </form>
        </div>
        
        <p className="pb-6 text-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.2em]">
            Secure CRM Integration • Privacy Protected
        </p>
      </div>
    </div>
  );
};

export default ZohoCabForm;
