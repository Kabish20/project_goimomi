import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";

const EnquiryForm = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-center text-[#0b1a3d] mb-6">
            Welcome to Goimomi Holidays
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Please provide your details to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                className="border px-3 py-2 rounded-lg w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="font-semibold text-gray-700">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                className="border px-3 py-2 rounded-lg w-full mt-1 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="pt-4">
              <div className="space-y-2">
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#14532d] text-white py-3 rounded-lg font-semibold hover:bg-[#0d2f1f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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