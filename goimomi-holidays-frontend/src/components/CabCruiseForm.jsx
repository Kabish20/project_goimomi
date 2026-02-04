import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SuccessModal from "../components/SuccessModal";

const CabCruiseForm = ({ isOpen, onClose, type }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
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
            destination: destination,
            purpose: description,
            enquiry_type: type,
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

            if (response.status === 201) {
                setShowSuccess(true);
                setTimeout(() => {
                    setName("");
                    setEmail("");
                    setPhone("");
                    setDestination("");
                    setDescription("");
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
                message={`Your ${type} enquiry has been submitted successfully! Our team will contact you shortly.`}
            />
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 font-sans">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
                    {/* Header Image/Banner */}
                    <div className="h-16 bg-gradient-to-r from-[#14532d] to-[#1a6b3d] flex items-center justify-center relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <h2 className="text-xl font-bold text-white relative z-10 tracking-tight">
                            {type === 'Cab' ? '🚗 Cab Booking' : '🚢 Cruise Enquiry'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-5">
                        <p className="text-center text-gray-500 text-xs mb-4">
                            Fill in the details below to get the best {type.toLowerCase()} deals.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                        Email ID *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="phone" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                        Mobile Number *
                                    </label>
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
                                        inputClass="!w-full !h-[34px] !text-xs !rounded-lg !border-gray-200 !bg-gray-50 focus:!ring-2 focus:!ring-[#14532d]/20 focus:!border-[#14532d] focus:!outline-none transition-all"
                                        buttonClass="!rounded-l-lg !border-gray-200 !bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="destination" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                        Travel Destination *
                                    </label>
                                    <input
                                        id="destination"
                                        type="text"
                                        placeholder="Where to?"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="description" className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                    Description / Special Requests
                                </label>
                                <textarea
                                    id="description"
                                    rows="2"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#14532d]/20 focus:border-[#14532d] transition-all resize-none"
                                    placeholder="Tell us more about your travel needs..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="pt-2">
                                {error && (
                                    <div className="text-red-500 text-[10px] text-center mb-3 bg-red-50 py-1.5 rounded border border-red-100">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#14532d] text-white py-2.5 rounded-lg font-bold hover:bg-[#0d2f1f] shadow-lg hover:shadow-[#14532d]/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-xs"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </div>
                                    ) : 'Confirm Booking Enquiry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CabCruiseForm;
