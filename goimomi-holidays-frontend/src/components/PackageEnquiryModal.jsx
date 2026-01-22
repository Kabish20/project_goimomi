import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaUsers, FaChild, FaMoon, FaCalendarAlt, FaHotel, FaUtensils, FaPlane, FaWallet } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SuccessModal from "./SuccessModal";

const PackageEnquiryModal = ({ isOpen, onClose, packageData }) => {
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
    }, [packageData]);

    if (!isOpen) return null;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                message="Your enquiry has been submitted successfully! We will contact you soon."
            />

            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[#14532d] p-3 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold">Plan Your Trip</h2>
                        <p className="text-green-100 opacity-90 text-[10px]">Fill in the details for {packageData?.title || "your customized holiday"}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-3 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                        {/* Destination */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <FaPlane className="text-green-700" /> Destination
                            </label>
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        {/* Check-in Date */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <FaCalendarAlt className="text-green-700" /> Check-in Date
                            </label>
                            <input
                                type="date"
                                name="travel_date"
                                value={formData.travel_date}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        {/* Nights & Rooms */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                    <FaMoon className="text-green-700" /> No. of Nights
                                </label>
                                <input
                                    type="number"
                                    name="nights"
                                    min="1"
                                    value={formData.nights}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                    <FaHotel className="text-green-700" /> No. of Rooms
                                </label>
                                <input
                                    type="number"
                                    name="rooms"
                                    min="1"
                                    value={formData.rooms}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Adults & Children */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                    <FaUsers className="text-green-700" /> Adults
                                </label>
                                <input
                                    type="number"
                                    name="adults"
                                    min="1"
                                    value={formData.adults}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                    <FaChild className="text-green-700" /> Children
                                </label>
                                <input
                                    type="number"
                                    name="children"
                                    min="0"
                                    value={formData.children}
                                    onChange={(e) => handleChildCountChange(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Child Ages if children > 0 */}
                        {formData.children > 0 && (
                            <div className="md:col-span-2 p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-wrap gap-2">
                                {formData.childAges.map((age, index) => (
                                    <div key={index} className="space-y-1">
                                        <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Child {index + 1} Age</label>
                                        <input
                                            type="number"
                                            placeholder="Age"
                                            value={age}
                                            onChange={(e) => handleChildAgeChange(index, e.target.value)}
                                            className="w-20 px-3 py-1 bg-white border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Hotel Category */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                Hotel Category
                            </label>
                            <select
                                name="star_rating"
                                value={formData.star_rating}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                required
                            >
                                <option value="">Select Star Rating</option>
                                <option value="3">3 Star</option>
                                <option value="4">4 Star</option>
                                <option value="5">5 Star</option>
                                <option value="Boutique">Boutique</option>
                            </select>
                        </div>

                        {/* Room Type */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                Room Type
                            </label>
                            <input
                                type="text"
                                name="room_type"
                                placeholder="Ex: Deluxe, Suite, Twin Sharing"
                                value={formData.room_type}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Meal Plan */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <FaUtensils className="text-green-700" /> Meal Plan
                            </label>
                            <select
                                name="meal_plan"
                                value={formData.meal_plan}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                            >
                                <option value="">Select Meal Plan</option>
                                <option value="Breakfast Only">Breakfast Only (CP)</option>
                                <option value="Breakfast + Dinner">Breakfast + Dinner (MAP)</option>
                                <option value="All Meals">All Meals (AP)</option>
                                <option value="No Meals">Room Only</option>
                            </select>
                        </div>

                        {/* Transfer */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <FaPlane className="text-green-700" /> Transfer
                            </label>
                            <input
                                type="text"
                                name="transfer_details"
                                placeholder="Ex: Private AC Car, Shared Shuttle"
                                value={formData.transfer_details}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Budget */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <FaWallet className="text-green-700" /> Estimated Budget
                            </label>
                            <input
                                type="text"
                                name="budget"
                                placeholder="Ex: ₹50,000"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>

                        {/* Other Inclusions */}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                Other Inclusions / Special Requests
                            </label>
                            <textarea
                                name="other_inclusions"
                                placeholder="Tell us about sightseeing, specific activities, etc."
                                value={formData.other_inclusions}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all resize-none text-sm"
                            />
                        </div>

                        <div className="md:col-span-2 h-px bg-gray-100 my-1"></div>

                        {/* Personal Details Section */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Ex: John Doe"
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                            <PhoneInput
                                country={"in"}
                                value={formData.phone}
                                onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                                inputProps={{
                                    name: "phone",
                                    required: true,
                                    placeholder: "Ex: +91 98765 43210"
                                }}
                                containerClass="!w-full"
                                inputClass="!w-full !px-3 !py-1.5 !bg-gray-50 !border !border-gray-200 !rounded-xl focus:!ring-2 focus:!ring-[#14532d] focus:!border-transparent !outline-none !transition-all !text-sm !h-[34px]"
                                buttonClass="!bg-gray-50 !border !border-gray-200 !rounded-l-xl"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ex: john@example.com"
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Nationality</label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2 border-t pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-1.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-1.5 bg-[#14532d] text-white font-bold rounded-xl shadow-md shadow-green-900/10 hover:bg-[#0f3d21] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                        >
                            {loading ? "Submitting..." : "Send Enquiry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackageEnquiryModal;
