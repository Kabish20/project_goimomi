import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * ZohoCustomizedForm Component
 * Updated with the latest Zoho CRM Web-To-Lead snippet for customized holiday enquiries.
 */
const ZohoCustomizedForm = ({ isOpen, onClose, initialData = {} }) => {
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
      s.src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=46314d6cd7b797131d787c772cb7865cd4853f5d95033f4032a21156d985d8dfae25216eb11048cc8d21de461b59f221gid5036749f6a9d6d3ed175b8196ebb40789f85835fe8d57a23fa77a70936287653gid370d521989297dcb92397f5e9cbc97ef367beb18c4b4d4f987b22d7409834e9cgide4816e63337d809032a3a9d66f048901ddd49baf514674f90cb44424175ad2e0&tw=4bbf7e34fddd4ebed6b6920e5ae87ad327c76a5793bdac26016e52b360a121e6';
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
    } catch {
      // SalesIQ tracking is optional and must not block form submission.
    }
  };

  const handleZohoSubmit = (e) => {
    const form = formRef.current;
    document.charset = "UTF-8";

    // Mandatory fields check from snippet
    const mndFields = ['Last Name', 'Mobile'];
    const fldLangVal = ['Full Name', 'Mobile'];

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
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-400 hover:text-gray-900"
        >
          <X size={18} />
        </button>

        <div id='crmWebToEntityForm' className='zcwf_lblLeft crmWebToEntityForm' style={{ backgroundColor: 'white', color: 'black', width: '100%', padding: '25px', boxSizing: 'border-box', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            #crmWebToEntityForm.zcwf_lblLeft * { box-sizing: border-box; direction: ltr; }
            .zcwf_lblLeft .zcwf_title { word-wrap: break-word; padding: 0px 6px 15px; font-weight: bold; font-family: Arial; font-size: 20px; color: #14532d; border-bottom: 1px solid #f0f0f0; margin-bottom: 20px; }
            .zcwf_lblLeft .zcwf_row { margin: 12px 0px; display: flex; align-items: flex-start; }
            .zcwf_lblLeft .zcwf_col_lab { width: 35%; font-size: 12px; font-family: Arial; padding: 10px 6px 0px; font-weight: bold; color: #4b5563; }
            .zcwf_lblLeft .zcwf_col_fld { width: 65%; padding: 0px 6px; position: relative; }
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

          <div className='zcwf_title'>Customized Holiday Plan</div>
          
          <form 
            ref={formRef}
            id='webform482015000013976002' 
            action='https://crm.zoho.in/crm/WebToLeadForm' 
            name='WebToLeads482015000013976002' 
            method='POST' 
            onSubmit={handleZohoSubmit} 
            acceptCharset='UTF-8'
          >
            {/* Hidden Fields from Snippet */}
            <input type='text' style={{ display: 'none' }} name='xnQsjsdp' value='03b9acf6a7ad90ed00ac4114c3cb02dc577bcd07fd9c723926dfe8a069d83486' readOnly />
            <input type='hidden' name='zc_gad' id='zc_gad' value='' />
            <input type='text' style={{ display: 'none' }} name='xmIwtLD' value='473fcb54d6914b8d7d67d0dd1782aebb13ef302d2fd1c2c21f8b794832e51903836a2655572cd12f28d71ad68107e91e' readOnly />
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
              <div className='zcwf_col_lab'><label htmlFor='Mobile'>Mobile <span style={{ color: 'red' }}>*</span></label></div>
              <div className='zcwf_col_fld'><input type='text' id='Mobile' name='Mobile' maxLength='30' placeholder="+91" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF19'>Destination</label></div>
              <div className='zcwf_col_fld'>
                <select id='LEADCF19' name='LEADCF19'>
                  <option value='-None-'>-None-</option>
                  <option value='Domestic'>Domestic</option>
                  <option value='International'>International</option>
                </select>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF21'>Nights</label></div>
              <div className='zcwf_col_fld'>
                <select id='LEADCF21' name='LEADCF21'>
                  <option value='-None-'>-None-</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Night':'Nights'}</option>)}
                </select>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF13'>Starting City</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF13' name='LEADCF13' maxLength='255' placeholder="City of departure" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF12'>Nationality</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF12' name='LEADCF12' maxLength='255' defaultValue="Indian" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF119'>Travel Date</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF119' name='LEADCF119' placeholder='DD-MM-YYYY' onFocus={(e) => { e.target.type = 'date' }} onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }} /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF52'>Rooms</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF52' name='LEADCF52' maxLength='9' placeholder="No. of rooms" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF55'>Adult Travelers</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF55' name='LEADCF55' maxLength='9' placeholder="No. of adults" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF54'>Child Travelers</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF54' name='LEADCF54' maxLength='9' placeholder="No. of children" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF17'>Hotel Star Rating</label></div>
              <div className='zcwf_col_fld'>
                <select id='LEADCF17' name='LEADCF17'>
                  <option value='-None-'>-None-</option>
                  <option value='3 Star'>3 Star</option>
                  <option value='4 Star'>4 Star</option>
                  <option value='5 Star'>5 Star</option>
                  <option value='Luxury'>Luxury</option>
                </select>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF18'>Holiday Type</label></div>
              <div className='zcwf_col_fld'>
                <select id='LEADCF18' name='LEADCF18'>
                  <option value='-None-'>-None-</option>
                  <option value='Family'>Family</option>
                  <option value='Honeymoon'>Honeymoon</option>
                  <option value='Adventure'>Adventure</option>
                  <option value='Religious'>Religious</option>
                </select>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF15'>Room Type</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF15' name='LEADCF15' maxLength='255' placeholder="e.g. Deluxe, Suite" /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF20'>Meal Plan</label></div>
              <div className='zcwf_col_fld'>
                <select id='LEADCF20' name='LEADCF20'>
                  <option value='Select Meal Plan'>Select Meal Plan</option>
                  <option value='Breakfast Only (CP)'>Breakfast Only (CP)</option>
                  <option value='Breakfast + Dinner (MAP)'>Breakfast + Dinner (MAP)</option>
                  <option value='All Meals (AP)'>All Meals (AP)</option>
                  <option value='Room Only'>Room Only</option>
                </select>
              </div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF16'>Transfer Details</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF16' name='LEADCF16' maxLength='255' placeholder="Private, Shared, etc." /></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF14'>Special Requests</label></div>
              <div className='zcwf_col_fld'><textarea id='LEADCF14' name='LEADCF14' rows="3" placeholder="Any other inclusions or specific requirements?"></textarea></div>
            </div>

            <div className='zcwf_row'>
              <div className='zcwf_col_lab'><label htmlFor='LEADCF66'>Budget Per Person</label></div>
              <div className='zcwf_col_fld'><input type='text' id='LEADCF66' name='LEADCF66' maxLength='16' placeholder="Estimated budget" /></div>
            </div>

            <div className='zcwf_row' style={{ marginTop: '20px' }}>
              <div className='zcwf_col_lab'></div>
              <div className='zcwf_col_fld'>
                <input type='submit' id='formsubmit' className='formsubmit zcwf_button' value='Submit Request' />
                <input type='reset' className='zcwf_button' value='Reset' />
              </div>
            </div>
          </form>
        </div>
        
        <p className="pb-4 text-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.2em]">
            Secure CRM Integration • Privacy Protected
        </p>
      </div>
    </div>
  );
};

export default ZohoCustomizedForm;
