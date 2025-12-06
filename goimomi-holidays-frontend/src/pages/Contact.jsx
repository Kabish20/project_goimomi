import React from "react";
import { FiPhone, FiMail, FiMapPin, FiUser, FiMessageCircle } from "react-icons/fi";
import emailjs from "emailjs-com";

const Contact = () => {
  
  // ✅ Popup State (Placed correctly inside component)
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

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
          e.target.reset();     // Clear form
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send message");
        }
      );
  };

  return (
    <main className="bg-gradient-to-b from-[#0b1a3d0a] to-white py-16">

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm text-center animate__animated animate__fadeInUp">
            <h2 className="text-2xl font-bold text-[#0b1a3d]">Message Sent Successfully!</h2>
            <p className="text-gray-600 mt-2">
              Thank you for contacting us. Our team will get back to you shortly.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 bg-[#0b1a3d] text-white px-6 py-2 rounded-lg hover:bg-[#08132d] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b1a3d] drop-shadow-sm">
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
          <h2 className="text-2xl font-semibold text-[#0b1a3d] mb-4">Get in Touch</h2>

          <p className="text-gray-600 leading-relaxed">
            We value your queries and feedback. Reach out to us anytime, and our travel
            experts will respond quickly to assist you with your travel needs.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <FiPhone className="text-[#0b1a3d] text-2xl" />
              <p className="text-gray-700 font-medium">+91 638 222 0393</p>
            </div>

            <div className="flex items-center gap-4">
              <FiMail className="text-[#0b1a3d] text-2xl" />
              <p className="text-gray-700 font-medium">hello@goimomi.com</p>
            </div>

            <div className="flex items-center gap-4">
              <FiMapPin className="text-[#0b1a3d] text-2xl" />
              <p className="text-gray-700 font-medium leading-tight">
                5, Crescent Park Apartment, <br />
                Hazrath Sulaiman Street, <br />
                Kaja Nagar, Trichy - 620020
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#0b1a3d] text-white rounded-xl shadow-xl max-w-sm">
            <p className="text-lg font-semibold">We're Available 24/7</p>
            <p className="text-sm mt-1 text-gray-300">
              Connect with our support team anytime for quick assistance.
            </p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-8 animate__animated animate__fadeInUp">
          <h3 className="text-xl font-semibold text-[#0b1a3d] mb-6">Send Us a Message</h3>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d]">
                <FiUser className="text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full outline-none text-gray-700 text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d]">
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full outline-none text-gray-700 text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d]">
                <FiPhone className="text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full outline-none text-gray-700 text-sm"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="flex items-start gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0b1a3d]">
                <FiMessageCircle className="text-gray-500 mt-1" />
                <textarea
                  rows="4"
                  name="message"
                  required
                  className="w-full outline-none text-gray-700 text-sm resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0b1a3d] text-white font-semibold py-3 rounded-lg hover:bg-[#08132f] transition shadow-lg text-sm"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
