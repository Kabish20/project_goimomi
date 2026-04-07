import React, { useState, useEffect } from "react";
import api from "../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SuccessModal from "../components/SuccessModal";

const CabCruiseForm = ({ isOpen, onClose, type, initialDescription = "", initialData = {} }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fromCity, setFromCity] = useState(initialData.from || "");
    const [toCity, setToCity] = useState(initialData.to || "");
    const [vehicle, setVehicle] = useState("");
    const [travelDate, setTravelDate] = useState(initialData.date || "");
    const [description, setDescription] = useState(initialDescription);
    const [vehicles, setVehicles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setDescription(initialDescription);
            if (initialData.from) setFromCity(initialData.from);
            if (initialData.to) setToCity(initialData.to);
            if (initialData.date) setTravelDate(initialData.date);
            fetchVehicles();
        }
    }, [initialDescription, initialData, isOpen]);

    const fetchVehicles = async () => {
        try {
            const response = await api.get("/api/vehicle-masters/");
            setVehicles(response.data);
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            // Fallback vehicles if API fails
            setVehicles([
                { id: 1, brand_name: "Sedan (4+1)", name: "" },
                { id: 2, brand_name: "SUV (6+1)", name: "" },
                { id: 3, brand_name: "Luxury Sedan", name: "" },
                { id: 4, brand_name: "Traveller", name: "" }
            ]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Phone validation
        const phoneDigits = (phone || "").replace(/\D/g, "");
        if (phoneDigits.length < 10) {
            setError("Phone number must be at least 10 digits");
            return;
        } else if (phoneDigits.startsWith("91") && phoneDigits.length !== 12) {
            setError("Exactly 10 digits required after +91");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: name,
            email: email || null,
            phone: phone,
            from_city: fromCity || null,
            to_city: toCity || null,
            vehicle: vehicle || null,
            travel_date: travelDate || null,
            purpose: description || null,
            enquiry_type: type || "General",
        };

        try {
            const response = await api.post(
                '/api/enquiry-form/',
                payload
            );

            if (response.status === 201) {
                setShowSuccess(true);
                setTimeout(() => {
                    setName("");
                    setEmail("");
                    setPhone("");
                    setVehicle("");
                    setFromCity("");
                    setToCity("");
                    setTravelDate("");
                    setDescription("");
                    setShowSuccess(false);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (typeof data === 'object') {
                    const messages = Object.keys(data).map(key => {
                        const val = data[key];
                        return `${key}: ${Array.isArray(val) ? val.join(', ') : val}`;
                    });
                    setError(messages.join(' | '));
                } else {
                    setError('Failed to submit form. Please check your input.');
                }
            } else {
                setError(error.message || 'An unexpected error occurred');
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 font-sans animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-[380px] rounded-[1.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-500 border border-white/20">
                    {/* Header with gradient and texture */}
                    <div className="h-14 bg-gradient-to-br from-[#14532d] via-[#1a6b3d] to-[#0f3d23] flex items-center justify-center relative">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent"></div>
                        
                        <h2 className="text-lg font-black text-white relative z-10 tracking-tight flex items-center gap-2">
                            {type === 'Cab' ? (
                                <><span className="text-xl">🚗</span> Cab Booking</>
                            ) : (
                                <><span className="text-xl">🚢</span> Cruise Enquiry</>
                            )}
                        </h2>
                        
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                            aria-label="Close"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-5 md:p-6">
                        <p className="text-center text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                            Details for best {type.toLowerCase()} deals.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Personal Info Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all placeholder:text-gray-300"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Email ID *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all placeholder:text-gray-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contact and Vehicle */}
                            <div className={`grid grid-cols-1 ${type === 'Cab' ? 'md:grid-cols-2' : ''} gap-3`}>
                                <div className="space-y-1">
                                    <label htmlFor="phone" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Mobile Number *
                                    </label>
                                    <PhoneInput
                                        country={"in"}
                                        value={phone}
                                        onChange={(phone) => setPhone(phone)}
                                        inputProps={{ name: "phone", required: true, id: "phone" }}
                                        containerClass="!w-full"
                                        inputClass="!w-full !h-[34px] !text-xs !font-bold !rounded-lg !border-gray-100 !bg-gray-50 focus:!ring-4 focus:!ring-[#14532d]/5 focus:!border-[#14532d]/40 focus:!outline-none transition-all"
                                        buttonClass="!rounded-l-lg !border-gray-100 !bg-gray-50 hover:!bg-gray-100"
                                    />
                                </div>
                                {type === 'Cab' && (
                                    <div className="space-y-1">
                                        <label htmlFor="vehicle" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                            Select Vehicle *
                                        </label>
                                        <select
                                            id="vehicle"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all appearance-none cursor-pointer"
                                            value={vehicle}
                                            onChange={(e) => setVehicle(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose Vehicle</option>
                                            <option value="Sedan">Sedan (4+1 Passengers)</option>
                                            <option value="SUV">SUV (6+1 Passengers)</option>
                                            <option value="Innova Crysta">Innova Crysta (Premium)</option>
                                            <option value="Traveller">Tempo Traveller (9-17 Seat)</option>
                                            {vehicles.map((v) => (
                                                <option key={v.id} value={v.brand_name || v.name}>
                                                    {v.brand_name} {v.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* From and To */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="from" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        From City *
                                    </label>
                                    <input
                                        id="from"
                                        type="text"
                                        placeholder="Starting point"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all"
                                        value={fromCity}
                                        onChange={(e) => setFromCity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="to" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        To City *
                                    </label>
                                    <input
                                        id="to"
                                        type="text"
                                        placeholder="Destination"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all"
                                        value={toCity}
                                        onChange={(e) => setToCity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Date Field */}
                            <div className="space-y-1">
                                <label htmlFor="date" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    Travel Date *
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all"
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="description" className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    Special Requests (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    rows="2"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]/40 transition-all resize-none placeholder:text-gray-300"
                                    placeholder="Extra luggage, child seats, etc."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="pt-1">
                                {error && (
                                    <div className="text-red-500 text-[9px] font-black uppercase text-center mb-2 bg-red-50 py-1.5 rounded-lg border border-red-100 tracking-wider">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#14532d] text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#0d2f1f] shadow-xl hover:shadow-[#14532d]/30 transform transition-all active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed text-[10px]"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </div>
                                    ) : 'Submit Enquiry'}
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
