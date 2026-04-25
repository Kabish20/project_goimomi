import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUsers, FaChild, FaMoon, FaCalendarAlt, FaHotel, FaUtensils, FaPlane, FaWallet, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SuccessModal from "../../../components/SuccessModal";
import usePageSEO from "../../../hooks/usePageSEO";

const PackageEnquiryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const packageData = location.state?.pkg;

    usePageSEO(
        packageData ? `Enquire for ${packageData.title} | Goimomi Holidays` : "Holiday Package Enquiry | Goimomi Holidays",
        packageData ? `Request a quote for our ${packageData.title} package. Get the best deals and personalized travel assistance for your trip.` : "Enquire about our international and domestic holiday packages. Get personalized quotes and travel expert advice.",
        packageData?.card_image,
        "holiday enquiry, travel quote, package booking, vacation planning, goimomi holidays"
    );

    const getTomorrowDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        message: "",
        budget: "",
        departure_date: getTomorrowDate(),
        adults: 2,
        children: 0,
        nights: packageData?.days ? parseInt(packageData.days) - 1 : 4,
        hotel_rating: "3",
        package_type: packageData?.title || "Customized Holiday",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.full_name) newErrors.full_name = "Full name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        // Use regex for numeric check instead of replace which isn't there on phone number from PhoneInput initially
        const phoneDigits = (formData.phone || "").replace(/\D/g, "");
        if (!phoneDigits || phoneDigits.length < 10) {
            newErrors.phone = "At least 10 digits required";
        } else if (phoneDigits.startsWith("91") && phoneDigits.length !== 12) {
            newErrors.phone = "Exactly 10 digits required after +91";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await api.post("/api/enquiries/", {
                ...formData,
                source: "Package Enquiry Page",
                package_id: packageData?.id
            });
            setShowSuccessModal(true);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            alert("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <SuccessModal 
                isOpen={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)}
                message="Your enquiry has been submitted successfully! Our travel experts will get back to you shortly."
            />
            
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Package Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-4">
                                {packageData?.title ? `Enquire About ${packageData.title}` : "Customize Your Perfect Trip"}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Fill out the form correctly, and our travel specialists will curate a personalized itinerary just for you.
                            </p>
                        </div>

                        {packageData && (
                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group">
                                <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                                    <img 
                                        src={packageData.card_image} 
                                        alt={packageData.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[#14532d] font-bold text-sm">
                                        <FaMapMarkerAlt />
                                        <span className="uppercase tracking-widest">{packageData.destination_name || "International"}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900">{packageData.title}</h3>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase">
                                            <FaMoon className="text-[#14532d]" /> {packageData.days} Days / {parseInt(packageData.days) - 1} Nights
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold uppercase">
                                            <FaWallet className="text-[#14532d]" /> ₹{parseFloat(packageData.price).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                                <FaGlobe className="text-2xl text-[#14532d] mb-3" />
                                <h4 className="font-bold text-gray-900">Customized Itinerary</h4>
                                <p className="text-sm text-gray-600 mt-1">Tailored specifically to your preferences and budget.</p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                                <FaPlane className="text-2xl text-[#14532d] mb-3" />
                                <h4 className="font-bold text-gray-900">Expert Guidance</h4>
                                <p className="text-sm text-gray-600 mt-1">Get advice from specialists who know the world best.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                                    <input 
                                        type="text" 
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 bg-gray-50 border-2 ${errors.full_name ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900`}
                                        placeholder="Enter your full name" 
                                    />
                                    {errors.full_name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.full_name}</p>}
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email *</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 bg-gray-50 border-2 ${errors.email ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900`}
                                        placeholder="your@email.com" 
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number *</label>
                                    <PhoneInput
                                        country={'in'}
                                        value={formData.phone}
                                        onChange={phone => setFormData(prev => ({ ...prev, phone }))}
                                        containerClass="!w-full"
                                        inputClass={`!w-full !px-5 !py-7 !bg-gray-50 !border-2 ${errors.phone ? '!border-red-500' : '!border-transparent'} !rounded-2xl focus:!bg-white focus:!border-[#14532d] !transition-all !outline-none !font-medium !text-gray-900`}
                                        buttonClass="!bg-transparent !border-none !rounded-l-2xl"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-2 font-bold">{errors.phone}</p>}
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Travel Date *</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="date" 
                                            name="departure_date"
                                            value={formData.departure_date}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900" 
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nights</label>
                                    <div className="relative">
                                        <FaMoon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            name="nights"
                                            value={formData.nights}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900 appearance-none"
                                        >
                                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => (
                                                <option key={n} value={n}>{n} Nights</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Adults (12+ yrs)</label>
                                    <div className="relative">
                                        <FaUsers className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            name="adults"
                                            value={formData.adults}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900 appearance-none"
                                        >
                                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                <option key={n} value={n}>{n} Adults</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Children (2-12 yrs)</label>
                                    <div className="relative">
                                        <FaChild className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            name="children"
                                            value={formData.children}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900 appearance-none"
                                        >
                                            {[0,1,2,3,4,5].map(n => (
                                                <option key={n} value={n}>{n} Children</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hotel Category Preference</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {["3", "4", "5"].map((star) => (
                                            <label 
                                                key={star}
                                                className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all cursor-pointer font-bold ${formData.hotel_rating === star 
                                                    ? 'border-[#14532d] bg-green-50 text-[#14532d]' 
                                                    : 'border-gray-100 bg-gray-50 text-gray-400 hober:border-gray-200'}`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="hotel_rating" 
                                                    value={star}
                                                    checked={formData.hotel_rating === star}
                                                    onChange={handleChange}
                                                    className="hidden" 
                                                />
                                                <FaHotel className={formData.hotel_rating === star ? "text-[#14532d]" : "text-gray-300"} />
                                                {star} Star
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Budget Per Person (Optional)</label>
                                    <div className="relative">
                                        <FaWallet className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900"
                                            placeholder="Ex: ₹30,000" 
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Preferences (Optional)</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14532d] transition-all outline-none font-medium text-gray-900 resize-none"
                                        placeholder="Tell us about your interests, specific places you want to visit, or special requirements..."
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#14532d] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-green-900/20 hover:bg-[#0f4a24] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {submitting ? "Submitting..." : "Send Enquiry Request"}
                            </button>

                            <p className="text-center text-xs text-gray-400 font-bold">
                                Safe & Secure · Privacy Protected · Response in 24 Hours
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageEnquiryPage;



