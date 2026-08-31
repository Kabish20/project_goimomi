import React from "react";
import QuickEnquiryForm from "../forms/QuickEnquiryForm.jsx";
const FormModal = ({ isOpen, onClose, packageType, packageData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
      <div className="w-full max-w-[360px] bg-white rounded-[2.5rem] relative overflow-visible shadow-2xl p-2 pb-8">
         <button 
           onClick={onClose}
           className="absolute top-4 right-4 z-[210] text-gray-400 hover:text-gray-900 transition-colors"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
         <QuickEnquiryForm 
           packageTitle={packageType} 
           packageData={packageData} 
           onClose={onClose} 
           isModal={true}
         />
      </div>
    </div>
  );
};

export default FormModal;
