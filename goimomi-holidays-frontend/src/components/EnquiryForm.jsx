import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";

const EnquiryForm = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
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
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-center text-[#0b1a3d] mb-2">
            Welcome to Goimomi Holidays
          </h2>
          <p className="text-center text-gray-600 text-sm mb-5">
            Please provide your details to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                className="border px-3 py-1.5 rounded-lg w-full mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                className="border px-3 py-1.5 rounded-lg w-full mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="purpose" className="text-sm font-semibold text-gray-700">
                Message
              </label>
              <textarea
                id="purpose"
                rows="2"
                className="border px-3 py-1.5 rounded-lg w-full mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d] resize-none"
                placeholder="Briefly tell us why you're visiting..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <div className="space-y-2">
                {error && (
                  <div className="text-red-500 text-xs text-center">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#14532d] text-white py-2 rounded-lg font-semibold hover:bg-[#0d2f1f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
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