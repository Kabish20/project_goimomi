import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SuccessModal from "../components/SuccessModal";

const EnquiryForm = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      name: name,
      email: email,
      phone: phone,
      purpose: purpose,
    };

    try {
      const response = await axios.post(
        '/api/enquiry-form/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 201) {  // 201 Created
        setShowSuccess(true);
        // Reset form after a short delay to show the success message
        setTimeout(() => {
          setName("");
          setEmail("");
          setPhone("");
          setPurpose("");
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        throw new Error("Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        setError(error.response.data.detail || 'Failed to submit form');
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        message="Your enquiry has been submitted successfully! Our team will contact you shortly."
      />
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-[320px] rounded-xl shadow-xl p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-center text-[#0b1a3d] mb-1">
            Welcome to Goimomi Holidays
          </h2>
          <p className="text-center text-gray-500 text-[11px] mb-4">
            Briefly share your details with us.
          </p>
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <label htmlFor="name" className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                className="border border-gray-200 px-2.5 py-1 rounded-lg w-full mt-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                className="border border-gray-200 px-2.5 py-1 rounded-lg w-full mt-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                Phone Number *
              </label>
              <div className="mt-0.5">
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputProps={{
                    name: "phone",
                    required: true,
                    id: "phone"
                  }}
                  containerClass="!w-full"
                  inputClass="!w-full !h-[30px] !text-xs !rounded-lg !border-gray-200 focus:!ring-1 focus:!ring-[#14532d] focus:!outline-none"
                  buttonClass="!rounded-l-lg !border-gray-200 !h-[30px]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="purpose" className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                Message
              </label>
              <textarea
                id="purpose"
                rows="2"
                className="border border-gray-200 px-2.5 py-1 rounded-lg w-full mt-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#14532d] resize-none"
                placeholder="How can we help?"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="pt-1">
              <div className="space-y-2">
                {error && (
                  <div className="text-red-500 text-[10px] text-center">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#14532d] text-white py-1.5 rounded-lg font-bold hover:bg-[#0d2f1f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Now'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EnquiryForm;