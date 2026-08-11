import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * ZohoLeadForm Component
 * Updated with the latest Zoho CRM Web-To-Lead snippet.
 */
const ZohoLeadForm = ({ isOpen, onClose }) => {
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
    } catch {
      // SalesIQ tracking is optional and must not block form submission.
    }
  };

  const handleZohoSubmit = (e) => {
    const form = formRef.current;
    
    // Set charset for Zoho
    document.charset = "UTF-8";

    // Mandatory fields check from snippet
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

  const tooltipShow = (el) => {
    const tooltip = el.nextElementSibling;
    const tooltipDisplay = tooltip.style.display;
    if (tooltipDisplay === 'none') {
      const allTooltip = document.getElementsByClassName('zcwf_tooltip_over');
      for (let i = 0; i < allTooltip.length; i++) {
        allTooltip[i].style.display = 'none';
      }
      tooltip.style.display = 'block';
    } else {
      tooltip.style.display = 'none';
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-400 hover:text-gray-900"
        >
          <X size={18} />
        </button>

        <div id='crmWebToEntityForm' className='zcwf_lblTopBottom crmWebToEntityForm' style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '25px', boxSizing: 'border-box', textAlign: 'left' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            #crmWebToEntityForm.zcwf_lblTopBottom * { box-sizing: border-box; direction: ltr; }
            .zcwf_lblTopBottom .zcwf_title { word-wrap: break-word; padding: 0px 6px 10px; font-weight: bold; font-family: Arial; font-size: 16px; color: #14532d; }
            .zcwf_lblTopBottom .zcwf_row { margin: 15px 0px; }
            .zcwf_lblTopBottom .zcwf_col_lab { font-size: 12px; font-family: Arial; padding: 0px 6px 4px; font-weight: bold; }
            .zcwf_lblTopBottom .zcwf_col_fld { padding: 0px 6px; position: relative; }
            .zcwf_lblTopBottom .zcwf_col_fld input[type=text], .zcwf_lblTopBottom .zcwf_col_fld textarea { 
              width: 100%; border: 1px solid #c0c6cc !important; border-radius: 4px; padding: 10px; font-family: Arial; font-size: 13px; outline: none; transition: border-color 0.2s;
            }
            .zcwf_lblTopBottom .zcwf_col_fld input[type=text]:focus, .zcwf_lblTopBottom .zcwf_col_fld textarea:focus { border-color: #0279FF !important; }
            .zcwf_lblTopBottom .zcwf_col_help { float: left; margin-top: 5px; margin-left: 2px; }
            .zcwf_lblTopBottom .zcwf_help_icon { cursor: pointer; width: 16px; height: 16px; display: inline-block; background: #fff; border: 1px solid #c0c6cc; color: #c1c1c1; text-align: center; font-size: 11px; line-height: 16px; font-weight: bold; border-radius: 50%; }
            .zcwf_lblTopBottom .formsubmit.zcwf_button { 
              color: white !important; background: linear-gradient(0deg, #0279FF 0%, #00A3F3 100%); border: none; padding: 10px 24px; cursor: pointer; font-weight: bold; border-radius: 4px; font-size: 14px;
            }
            .zcwf_lblTopBottom .zcwf_button { font-size: 13px; color: #313949; border: 1px solid #c0c6cc; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 8px; background: #fff; }
            .zcwf_lblTopBottom .zcwf_tooltip_over { position: absolute; left: 25px; top: 0; display: none; z-index: 100; }
            .zcwf_lblTopBottom .zcwf_tooltip_ctn { background: #dedede; padding: 3px 6px; border-radius: 4px; word-break: break-word; min-width: 100px; max-width: 150px; color: #313949; font-size: 11px; }
          `}} />

          <div className='zcwf_title'>Welcome to Goimomi Holidays- Briefly share details with us.</div>
          
          <form 
            ref={formRef}
            id='webform482015000012389518' 
            action='https://crm.zoho.in/crm/WebToLeadForm' 
            name='WebToLeads482015000012389518' 
            method='POST' 
            onSubmit={handleZohoSubmit} 
            acceptCharset='UTF-8'
          >
            {/* Hidden Fields from Snippet */}
            <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='f98456093f3d9fa012da9b1f392957a6f9a73df303a1745e5005096696b06141' readOnly />
            <input type='hidden' name='zc_gad' id='zc_gad' value='' />
            <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='ca4c8c8f45e08494ccd44bede0849324b1a1f04a724600548b754da18ce709e1f7ad4e6116a66e64846484a5dfaa8824' readOnly />
            <input type='text' style={{ display: 'none' }} name='actionType' value='TGVhZHM=' readOnly />
            <input type='text' style={{ display: 'none' }} name='returnURL' value='null' readOnly />
            <input type='text' style={{ display: 'none' }} id='ldeskuid' name='ldeskuid' readOnly />
            <input type='text' style={{ display: 'none' }} id='LDTuvid' name='LDTuvid' readOnly />
            <input type='text' style={{ display: 'none' }} name='aG9uZXlwb3Q' value='' readOnly />

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='First_Name'>FIRST NAME <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='First_Name' name='First Name' maxLength='40' placeholder="Enter first name" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Last_Name'>LAST NAME <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='Last_Name' name='Last Name' maxLength='80' placeholder="Enter last name" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Email'>EMAIL ADDRESS <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' ftype='email' id='Email' name='Email' maxLength='100' placeholder="e.g. john@example.com" />
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Mobile'>PHONE NUMBER <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'>
                <input type='text' id='Mobile' name='Mobile' maxLength='30' placeholder="e.g. +91 9876543210" />
                <div className='zcwf_col_help'>
                  <span 
                    className="zcwf_help_icon" 
                    onClick={(e) => tooltipShow(e.target)}
                    title="Country Code Hint"
                  >?</span>
                  <div className='zcwf_tooltip_over'>
                    <span className='zcwf_tooltip_ctn'>+91</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='Description'>MESSAGE</label></div>
              <div className='zcwf_col_fld'>
                <textarea id='Description' name='Description' rows="3" placeholder="How can we help?"></textarea>
              </div>
            </div>

            <div className='zcwf_row' style={{ marginTop: '25px' }}>
              <div className='zcwf_col_lab'></div>
              <div className='zcwf_col_fld'>
                <input type='submit' id='formsubmit' className='formsubmit zcwf_button' value='Submit' />
                <input type='reset' className='zcwf_button' value='Reset' />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ZohoLeadForm;
