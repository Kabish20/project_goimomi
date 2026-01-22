import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUsers, FaChild, FaMoon, FaCalendarAlt, FaHotel, FaUtensils, FaPlane, FaWallet, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SuccessModal from "../components/SuccessModal";

const PackageEnquiryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const packageData = location.state?.pkg;

    const [formData, setFormData] = useState({
        destination: "",
        travel_date: "",
        nights: 1,
        rooms: 1,
        adults: 2,
        children: 0,
        childAges: [],
        star_rating: "",
        room_type: "",
        meal_plan: "",
        transfer_details: "",
        other_inclusions: "",
        budget: "",
        full_name: "",
        email: "",
        phone: "",
        nationality: "Indian",
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (packageData) {
            setFormData((prev) => ({
                ...prev,
                destination: packageData.title || "",
                nights: packageData.days ? packageData.days - 1 : 1,
            }));
        }
        window.scrollTo(0, 0);
    }, [packageData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChildCountChange = (count) => {
        const newCount = parseInt(count) || 0;
        const newAges = [...formData.childAges];
        if (newCount > formData.childAges.length) {
            for (let i = formData.childAges.length; i < newCount; i++) {
                newAges.push("");
            }
        } else {
            newAges.length = newCount;
        }
        setFormData((prev) => ({ ...prev, children: newCount, childAges: newAges }));
    };

    const handleChildAgeChange = (index, age) => {
        const newAges = [...formData.childAges];
        newAges[index] = age;
        setFormData((prev) => ({ ...prev, childAges: newAges }));
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.destination.trim()) newErrors.destination = "Destination is required";
        if (!formData.travel_date) newErrors.travel_date = "Travel date is required";
        if (!formData.nights || formData.nights < 1) newErrors.nights = "Invalid nights";
        if (!formData.rooms || formData.rooms < 1) newErrors.rooms = "Invalid rooms";
        if (!formData.adults || formData.adults < 1) newErrors.adults = "Invalid adults";

        if (!formData.star_rating) newErrors.star_rating = "Hotel category is required";

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        } else if (formData.full_name.trim().length < 3) {
            newErrors.full_name = "Name must be at least 3 characters";
        }

        if (!formData.phone || formData.phone.trim().length < 5) {
            newErrors.phone = "Invalid phone number";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";

        if (formData.children > 0) {
            formData.childAges.forEach((age, index) => {
                if (!age || age < 0 || age > 12) {
                    newErrors[`childAge_${index}`] = "Invalid age (0-12)";
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            if (firstError) alert(firstError);
            return;
        }
        setLoading(true);

        const payload = {
            ...formData,
            package_type: packageData?.title || "Custom Package",
            message: `Room Type: ${formData.room_type}\nMeal Plan: ${formData.meal_plan}\nTransfer: ${formData.transfer_details}\nOther Inclusions: ${formData.other_inclusions}`,
            room_details: [{
                adults: formData.adults,
                children: formData.children,
                child_ages: formData.childAges
            }]
        };

        try {
            await axios.post("/api/holiday-form/", payload);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate(-1);
            }, 3000);
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4">
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                message="Your enquiry has been submitted successfully! We will contact you soon."
            />

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-[#14532d] shadow-xl rounded-t-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-2">Package Enquiry</h1>
                        <p className="text-green-100 opacity-90 text-lg">
                            {packageData ? `Requesting details for ${packageData.title}` : "Customize your perfect holiday experience"}
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                </div>

                {/* Form Container */}
                <div className="bg-white shadow-2xl rounded-b-[2.5rem] p-12 border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* Travel Details Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaPlane className="text-green-700" /> Travel Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Destination</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-4 top-3.5 text-green-700" />
                                        <input
                                            type="text"
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            placeholder="Where do you want to go?"
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 ${errors.destination ? 'border-red-500' : 'border-transparent'} border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all`}
                                        />
                                        {errors.destination && <p className="text-red-500 text-xs mt-1 ml-1">{errors.destination}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Check-in Date</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-4 top-3.5 text-green-700" />
                                        <input
                                            type="date"
                                            name="travel_date"
                                            value={formData.travel_date}
                                            onChange={handleChange}
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 ${errors.travel_date ? 'border-red-500' : 'border-transparent'} border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all`}
                                        />
                                        {errors.travel_date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.travel_date}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Nights</label>
                                        <div className="relative">
                                            <FaMoon className="absolute left-4 top-3.5 text-green-700" />
                                            <input
                                                type="number"
                                                name="nights"
                                                min="1"
                                                value={formData.nights}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Rooms</label>
                                        <div className="relative">
                                            <FaHotel className="absolute left-4 top-3.5 text-green-700" />
                                            <input
                                                type="number"
                                                name="rooms"
                                                min="1"
                                                value={formData.rooms}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Adults (12+)</label>
                                        <div className="relative">
                                            <FaUsers className="absolute left-4 top-3.5 text-green-700" />
                                            <input
                                                type="number"
                                                name="adults"
                                                min="1"
                                                value={formData.adults}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 ${errors.adults ? 'border-red-500' : 'border-transparent'} border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all`}
                                            />
                                            {errors.adults && <p className="text-red-500 text-xs mt-1 ml-1">{errors.adults}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Children</label>
                                        <div className="relative">
                                            <FaChild className="absolute left-4 top-3.5 text-green-700" />
                                            <input
                                                type="number"
                                                name="children"
                                                min="0"
                                                value={formData.children}
                                                onChange={(e) => handleChildCountChange(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {formData.children > 0 && (
                                <div className="mt-6 p-6 bg-green-50/50 rounded-2xl border-2 border-dashed border-green-200 flex flex-wrap gap-6 animate-in slide-in-from-top-4 duration-300">
                                    {formData.childAges.map((age, index) => (
                                        <div key={index} className="space-y-2">
                                            <label className="text-xs font-black text-green-800 uppercase">Child {index + 1} Age</label>
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                value={age}
                                                onChange={(e) => handleChildAgeChange(index, e.target.value)}
                                                className={`w-24 px-4 py-2 bg-white border-2 ${errors[`childAge_${index}`] ? 'border-red-500' : 'border-green-100'} rounded-xl outline-none focus:border-green-500`}
                                            />
                                            {errors[`childAge_${index}`] && <p className="text-red-500 text-[10px] mt-1">{errors[`childAge_${index}`]}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="border-gray-100" />

                        {/* Preferences Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaStar className="text-yellow-600" /> Preferences
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Hotel Category</label>
                                    <select
                                        name="star_rating"
                                        value={formData.star_rating}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.star_rating ? 'border-red-500' : 'border-transparent'} border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all appearance-none`}
                                    >
                                        <option value="">Select Star Rating</option>
                                        <option value="3">3 Star (Budget)</option>
                                        <option value="4">4 Star (Standard)</option>
                                        <option value="5">5 Star (Luxury)</option>
                                        <option value="Boutique">Boutique Properties</option>
                                    </select>
                                    {errors.star_rating && <p className="text-red-500 text-xs mt-1 ml-1">{errors.star_rating}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Room Type</label>
                                    <input
                                        type="text"
                                        name="room_type"
                                        placeholder="Ex: Deluxe, Suite, Twin Sharing"
                                        value={formData.room_type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Meal Plan</label>
                                    <div className="relative">
                                        <FaUtensils className="absolute left-4 top-3.5 text-green-700" />
                                        <select
                                            name="meal_plan"
                                            value={formData.meal_plan}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select Meal Plan</option>
                                            <option value="Breakfast Only">Breakfast Only (CP)</option>
                                            <option value="Breakfast + Dinner">Breakfast + Dinner (MAP)</option>
                                            <option value="All Meals">All Meals (AP)</option>
                                            <option value="No Meals">Room Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Transfer</label>
                                    <input
                                        type="text"
                                        name="transfer_details"
                                        placeholder="Ex: Private AC Car, Shared Shuttle"
                                        value={formData.transfer_details}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Estimated Budget</label>
                                    <div className="relative">
                                        <FaWallet className="absolute left-4 top-3.5 text-green-700" />
                                        <input
                                            type="text"
                                            name="budget"
                                            placeholder="What is your planned budget per person? (Ex: ₹50,000)"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Other Inclusions / Special Requests</label>
                                    <textarea
                                        name="other_inclusions"
                                        placeholder="Tell us about sightseeing, specific activities, or any other preferences..."
                                        value={formData.other_inclusions}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Personal Details Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Your Full Name"
                                        className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.full_name ? 'border-red-500' : 'border-transparent'} border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all`}
                                    />
                                    {errors.full_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.full_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="mt-1">
                                        <PhoneInput
                                            country={"in"}
                                            value={formData.phone}
                                            onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                                            inputProps={{
                                                name: "phone",
                                                required: true,
                                            }}
                                            containerClass="!w-full"
                                            inputClass={`!w-full !px-4 !py-3 !bg-gray-50 !border-2 ${errors.phone ? '!border-red-500' : '!border-transparent'} !border-b-gray-200 !rounded-xl focus:!border-green-700 focus:!bg-white !outline-none !transition-all !h-[50px]`}
                                            buttonClass="!bg-gray-50 !border-2 !border-transparent !border-b-gray-200 !rounded-l-xl"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        className={`w-full px-4 py-3 bg-gray-50 border-2 ${errors.email ? 'border-red-500' : 'border-transparent'} border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Nationality</label>
                                    <div className="relative">
                                        <FaGlobe className="absolute left-4 top-3.5 text-green-700" />
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent border-b-gray-200 rounded-xl focus:border-green-700 focus:bg-white outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submission */}
                        <div className="pt-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                            <p className="text-sm text-gray-500 max-w-md italic">
                                By submitting this form, you agree to our privacy policy and our team will contact you shortly to discuss your holiday plans.
                            </p>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 md:px-10 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] md:px-16 py-4 bg-[#14532d] text-white font-black rounded-2xl shadow-2xl shadow-green-900/40 hover:bg-[#0f3d21] transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                                >
                                    {loading ? "Processing..." : "Submit Enquiry"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PackageEnquiryPage;
