import React from "react";
import { FiPhone, FiMail, FiMapPin, FiUser, FiMessageCircle } from "react-icons/fi";
import emailjs from "emailjs-com";

const Contact = () => {

  // ✅ Popup State (Placed correctly inside component)
  const [showSuccess, setShowSuccess] = React.useState(false);

  const [errors, setErrors] = React.useState({});

  const validateForm = (formData) => {
    const newErrors = {};
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const contactingFor = formData.get("contactingFor");
    const message = formData.get("message");

    if (!fullName || fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phone || !/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    if (!contactingFor) {
      newErrors.contactingFor = "Please select an option";
    }
    if (!message || message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (!validateForm(formData)) {
      return;
    }

    emailjs
      .sendForm(
        "service_x3a6b6q",
        "template_5n2g5an",
        e.target,
        "2ijCA8UT7XinXqIXE"
      )
      .then(
        () => {
          setShowSuccess(true); // 🎉 Show popup
          setErrors({});
          e.target.reset();     // Clear form
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send message: " + error.text);
        }
      );
  };

  return (
    <main className="bg-gradient-to-b from-[#0b1a3d0a] to-white py-16">

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm text-center animate__animated animate__fadeInUp">
            <h2 className="text-2xl font-bold text-[#14532d]">Message Sent Successfully!</h2>
            <p className="text-gray-600 mt-2">
              Thank you for contacting us. Our team will get back to you shortly.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 bg-[#14532d] text-white px-6 py-2 rounded-lg hover:bg-[#14532d] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#14532d] drop-shadow-sm">
          Contact Us
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm md:text-base">
          Have inquiries about holiday packages, custom trips, or booking-related questions?
          We’re here to help you plan your perfect journey.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">

        {/* Left Section */}
        <div className="space-y-8 animate__animated animate__fadeInLeft">
          <h2 className="text-2xl font-semibold text-[#14532d] mb-4">Get in Touch</h2>

          <p className="text-gray-600 leading-relaxed">
            We value your queries and feedback. Reach out to us anytime, and our travel
            experts will respond quickly to assist you with your travel needs.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <FiPhone className="text-[#14532d] text-2xl" />
              <p className="text-gray-700 font-medium">+91 638 222 0393</p>
            </div>

            <div className="flex items-center gap-4">
              <FiMail className="text-[#14532d] text-2xl" />
              <p className="text-gray-700 font-medium">hello@goimomi.com</p>
            </div>

            <div className="flex items-center gap-4">
              <FiMapPin className="text-[#14532d] text-2xl" />
              <p className="text-gray-700 font-medium leading-tight">
                5, Crescent Park Apartment, <br />
                Hazrath Sulaiman Street, <br />
                Kaja Nagar, Trichy - 620020
              </p>
            </div>

            <div className="flex items-center gap-4">
              <FiMapPin className="text-[#14532d] text-2xl" />
              <p className="text-gray-700 font-medium leading-tight">
                # 5-3-21/5/3, Plot No : 2, <br />
                Behind Ali's Mart, Z&Z Colony<br />
                Raichur Road, MAHABUBNAGAR - 509 001<br />
                Telangana, India
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#14532d] text-white rounded-xl shadow-xl max-w-sm">
            <p className="text-lg font-semibold">We're Available 24/7</p>
            <p className="text-sm mt-1 text-gray-300">
              Connect with our support team anytime for quick assistance.
            </p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-8 animate__animated animate__fadeInUp">
          <h3 className="text-xl font-semibold text-[#14532d] mb-6">Send Us a Message</h3>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d] ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}>
                <FiUser className="text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  className="w-full outline-none text-gray-700 text-sm"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d] ${errors.email ? 'border-red-500' : 'border-gray-200'}`}>
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  className="w-full outline-none text-gray-700 text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d] ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}>
                <FiPhone className="text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  className="w-full outline-none text-gray-700 text-sm"
                  placeholder="Enter 10 digit number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
            </div>

            {/* Contacting For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacting For:</label>

              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d] ${errors.contactingFor ? 'border-red-500' : 'border-gray-200'}`}>
                <select
                  name="contactingFor"
                  className="w-full outline-none text-gray-700 text-sm bg-transparent">
                  <option value="">Select an option</option>
                  <option value="Visa">Visa</option>
                  <option value="Tour Package">Tour Package</option>
                  <option value="Umrah">Umrah</option>
                  <option value="Haj">Haj</option>
                  <option value="Group Ticket">Group Ticket</option>
                  <option value="Passport Assistance">Passport Assistance</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Review">Review</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.contactingFor && <p className="text-red-500 text-[10px] mt-1">{errors.contactingFor}</p>}
            </div>


            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className={`flex items-start gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d] ${errors.message ? 'border-red-500' : 'border-gray-200'}`}>
                <FiMessageCircle className="text-gray-500 mt-1" />
                <textarea
                  rows="4"
                  name="message"
                  className="w-full outline-none text-gray-700 text-sm resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#14532d] text-white font-semibold py-3 rounded-lg hover:bg-[#08132f] transition shadow-lg text-sm"
            >
              Submit
            </button>

          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
