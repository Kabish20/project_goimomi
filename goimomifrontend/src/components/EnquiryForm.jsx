import React from "react";
import ZohoLeadForm from "./ZohoLeadForm";

/**
 * EnquiryForm wrapper for ZohoLeadForm.
 * This ensures the main website enquiry popup now uses Zoho CRM for lead collection.
 */
const EnquiryForm = ({ isOpen, onClose }) => {
  return <ZohoLeadForm isOpen={isOpen} onClose={onClose} />;
};

export default EnquiryForm;