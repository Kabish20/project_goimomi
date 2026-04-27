import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * ZohoCruiseForm Component
 * Updated with the latest Zoho CRM Web-To-Lead snippet for cruise enquiries.
 */
const ZohoCruiseForm = ({ isOpen, onClose, initialData = {} }) => {
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
      s.src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=7368c4cda5b97e3ffd4904f12f38b410ad6a800e19a94727d5b778e5df488d8eee46a18e15dcabf8cfdca4b251fb32a2gidac61a9e28d6886309aec5390c781c2dd8547047e959baf5054b0e111f08ae4cegide4dd80880e862c2d39a2856cf8766252edbaae35b328b0f18aa7f55094db4013gid8f566533f9f3cd217c3aca05fe60fb316b8fa25258927d1f9440341551d563c2&tw=bd837f6c28568dc8cd5d342212f5b08b83564c342b1606bde6374f6f149dfbcd';
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
      <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
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
            .zcwf_lblLeft .zcwf_col_fld input[type=text], .zcwf_lblLeft .zcwf_col_fld textarea { 
              width: 100%; border: 1px solid #c0c6cc !important; border-radius: 8px; padding: 10px; font-family: Arial; font-size: 13px; outline: none; transition: all 0.2s; background: #f9fafb;
            }
            .zcwf_lblLeft .zcwf_col_fld input[type=text]:focus, .zcwf_lblLeft .zcwf_col_fld textarea:focus { border-color: #0284c7 !important; background: #fff; box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.05); }
            .zcwf_lblLeft .formsubmit.zcwf_button { 
              color: white !important; background: linear-gradient(0deg, #1e3a8a 0%, #0284c7 100%); border: none; padding: 12px 30px; cursor: pointer; font-weight: bold; border-radius: 8px; font-size: 14px; transition: transform 0.2s;
            }
            .zcwf_lblLeft .formsubmit.zcwf_button:hover { transform: translateY(-1px); }
            .zcwf_lblLeft .zcwf_button { font-size: 13px; color: #313949; border: 1px solid #c0c6cc; padding: 12px 25px; border-radius: 8px; cursor: pointer; margin-right: 10px; background: #fff; }
            @media all and (max-width: 600px) {
              .zcwf_lblLeft .zcwf_row { flex-direction: column; }
              .zcwf_lblLeft .zcwf_col_lab { width: 100%; padding-bottom: 5px; }
              .zcwf_lblLeft .zcwf_col_fld { width: 100%; }
            }
          `}} />

          <div className='zcwf_title'>Cruise Enquiry</div>
          
          <form 
            ref={formRef}
            id='webform482015000013960190' 
            action='https://crm.zoho.in/crm/WebToLeadForm' 
            name='WebToLeads482015000013960190' 
            method='POST' 
            onSubmit={handleZohoSubmit} 
            acceptCharset='UTF-8'
          >
            {/* Hidden Fields from Snippet */}
            <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='913b4cee6f9d0d43455b9b429a994b8fae481b82d5dd5c053a380e216e4dd79a' readOnly />
            <input type='hidden' name='zc_gad' id='zc_gad' value='' />
            <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='96d21536d8ae8ea725ef0a87dca8a1dc739fadb6d5462013c0902f01c23d8ccaf451b68d635945c6ab9f9087f69473d3' readOnly />
            <input type='text' style={{ display: 'none' }} name='actionType' value='TGVhZHM=' readOnly />
            <input type='text' style={{ display: 'none' }} name='returnURL' value='null' readOnly />
            <input type='text' style={{ display: 'none' }} id='ldeskuid' name='ldeskuid' readOnly />
            <input type='text' style={{ display: 'none' }} id='LDTuvid' name='LDTuvid' readOnly />
            <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' value='' readOnly />

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Last_Name'>Full Name <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='Last_Name' name='Last Name' maxLength='80' placeholder="Enter full name" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Mobile'>Mobile <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='Mobile' name='Mobile' maxLength='30' placeholder="+91" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Email'>Email <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' ftype='email' id='Email' name='Email' maxLength='100' placeholder="john@example.com" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF10'>From City</label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='LEADCF10' name='LEADCF10' maxLength='255' placeholder="Departure city" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF5'>To City</label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='LEADCF5' name='LEADCF5' maxLength='255' placeholder="Destination city" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF117'>Cruise Date</label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='LEADCF117' name='LEADCF117' placeholder='DD-MM-YYYY' onFocus={(e) => { e.target.type = 'date' }} onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }} />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF9'>Special Requests</label></div>
              <div className='zcwf_col_fld'>
                <textarea id='LEADCF9' name='LEADCF9' rows="3" placeholder="Any specific requirements or preferences?"></textarea>
              </div>
            </div>

            <div className='zcwf_row' style={{ marginTop: '20px' }}>
              <div className='zcwf_col_lab'></div>
              <div className='zcwf_col_fld'>
                <input type='submit' id='formsubmit' className='formsubmit zcwf_button' value='Submit Enquiry' />
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

export default ZohoCruiseForm;
