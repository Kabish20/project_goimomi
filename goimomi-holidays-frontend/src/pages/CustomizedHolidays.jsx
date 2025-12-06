import React from "react";
import {
  FaCalendarAlt,
  FaHotel,
  FaUsers,
  FaPlane,
  FaShieldAlt,
  FaStar,
  FaUtensils,
  FaCheckCircle,
  FaPhoneAlt,
} from "react-icons/fa";

// 🔹 Update these image paths based on your actual assets folder
import heroImg from "../assets/cusholidays.png";
import beachImg from "../assets/beach & island.png";
import mountainImg from "../assets/mountain.png";
import cultureImg from "../assets/temples.png";

const CustomizedHolidays = () => {
  return (
    <div className="w-full overflow-hidden text-gray-800">

      {/* ======================================
          HERO SECTION
      ======================================= */}
      <section
        className="relative h-[75vh] bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl font-bold mb-4">Customized Holidays</h1>

          <p className="text-lg opacity-90">
            Create your perfect holiday experience with our fully customizable
            travel packages tailored to your dreams, budget, and preferences.
          </p>

          <button className="mt-8 bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-md font-semibold shadow-lg">
            📸 Plan Your Dream Holiday
          </button>
        </div>
      </section>

      {/* ======================================
          CUSTOMIZATION OPTIONS
      ======================================= */}
      <section className="py-20 bg-white">
        <h2 className="text-center text-4xl font-bold text-blue-900">
          Customize Every Aspect of Your Holiday
        </h2>
        <p className="text-center mt-3 text-gray-600">
          Build your perfect holiday package with our flexible customization options
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-14 px-6">

          {/* CARD 1 */}
          <OptionCard
            icon={<FaCalendarAlt size={35} />}
            title="Flexible Dates"
            items={[
              "Weekend Getaway (2-3 Days)",
              "Short Break (4-7 Days)",
              "Extended Holiday (8-14 Days)",
              "Long Vacation (15+ Days)",
              "Custom Duration",
            ]}
          />

          {/* CARD 2 */}
          <OptionCard
            icon={<FaHotel size={35} />}
            title="Accommodation Choice"
            items={[
              "Budget Hotels",
              "Mid-Range Hotels",
              "Luxury Hotels",
              "Resorts & Villas",
              "Boutique Properties",
            ]}
          />

          {/* CARD 3 */}
          <OptionCard
            icon={<FaUsers size={35} />}
            title="Group Size"
            items={[
              "Solo Travel",
              "Couple Package",
              "Family Package",
              "Friends Group (5–10)",
              "Large Group (10+)",
            ]}
          />

          {/* CARD 4 */}
          <OptionCard
            icon={<FaPlane size={35} />}
            title="Travel Preferences"
            items={[
              "Flight + Hotel",
              "Train + Hotel",
              "Road Trip",
              "Cruise Package",
              "Adventure Travel",
            ]}
          />
        </div>
      </section>

      {/* ======================================
          WHAT'S INCLUDED
      ======================================= */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-center text-4xl font-bold text-blue-900">
          What’s Included in Your Custom Holiday
        </h2>
        <p className="text-center mt-3 text-gray-600">
          Premium features and services for a comfortable and memorable travel experience
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-14 px-6">

          <IncludeCard
            icon={<FaStar size={35} className="text-yellow-600" />}
            title="Personalized Itinerary"
            text="Tailored schedule based on your interests and travel preferences."
          />

          <IncludeCard
            icon={<FaUsers size={35} className="text-yellow-600" />}
            title="Expert Local Guides"
            text="Knowledgeable guides to enhance your travel experience."
          />

          <IncludeCard
            icon={<FaPlane size={35} className="text-yellow-600" />}
            title="Premium Transportation"
            text="Comfortable AC vehicles for all transfers & sightseeing."
          />

          <IncludeCard
            icon={<FaUtensils size={35} className="text-yellow-600" />}
            title="Curated Dining"
            text="Authentic local cuisine and fine dining experiences."
          />

          <IncludeCard
            icon={<FaShieldAlt size={35} className="text-yellow-600" />}
            title="24/7 Support"
            text="Round-the-clock assistance throughout your journey."
          />

          <IncludeCard
            icon={<FaCheckCircle size={35} className="text-yellow-600" />}
            title="Travel Insurance"
            text="Comprehensive travel insurance coverage for peace of mind."
          />
        </div>
      </section>

      {/* ======================================
          HOLIDAY TYPE CARDS
      ======================================= */}
      <section className="py-20 bg-white">
        <h2 className="text-center text-4xl font-bold text-blue-900">
          Choose Your Custom Holiday Type
        </h2>
        <p className="text-center mt-3 text-gray-600">
          Select the base package and customize it according to your travel preferences
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-14 px-6">
          <HolidayCard
            img={beachImg}
            title="Beach & Island Getaway"
            price="₹25,000"
            features={[
              "Beachfront accommodation",
              "Water sports activities",
              "Sunset cruises",
              "Local island tours",
            ]}
          />

          <HolidayCard
            img={mountainImg}
            title="Mountain Adventure"
            price="₹35,000"
            features={[
              "Trekking & hiking",
              "Mountain lodges",
              "Adventure activities",
              "Scenic viewpoints",
            ]}
          />

          <HolidayCard
            img={cultureImg}
            title="Cultural Heritage Tour"
            price="₹30,000"
            features={[
              "Historical sites",
              "Cultural experiences",
              "Local cuisine tours",
              "Heritage accommodations",
            ]}
          />
        </div>
      </section>

      {/* ======================================
          CONTACT SECTION
      ======================================= */}
      <section className="py-20 bg-blue-900 text-white">
        <h2 className="text-center text-4xl font-bold">Plan Your Dream Holiday Today</h2>

        <p className="text-center mt-3 text-gray-200 max-w-3xl mx-auto">
          Our travel experts are here to guide you with personalized travel solutions.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto mt-16 px-6">

          <ContactCard
            icon={<FaPhoneAlt size={35} className="text-yellow-500" />}
            title="Phone Support"
            subtitle="24/7 Customer Service"
            info="+91 638 222 0393"
          />

          <ContactCard
            icon={<FaStar size={35} className="text-yellow-500" />}
            title="Email Support"
            subtitle="Quick Response"
            info="hello@goimomi.com"
          />

          <ContactCard
            icon={<FaUsers size={35} className="text-yellow-500" />}
            title="WhatsApp Chat"
            subtitle="Instant Messaging"
            info="Chat with Us"
          />
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <button className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 text-white rounded-md font-semibold">
            📸 Start Planning Your Holiday
          </button>
          <button className="border border-white px-8 py-3 rounded-md hover:bg-white hover:text-blue-900 transition">
            📞 Call Now
          </button>
        </div>
      </section>

    </div>
  );
};

export default CustomizedHolidays;

//
// ====================================================
//              SUB COMPONENTS
// ====================================================
//

const OptionCard = ({ icon, title, items }) => (
  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border">
    <div className="text-blue-900 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-blue-900 mb-4">{title}</h3>

    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-700">
          <FaCheckCircle className="text-green-600" /> {item}
        </li>
      ))}
    </ul>
  </div>
);

const IncludeCard = ({ icon, title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-md text-center">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
    <p className="text-gray-600 mt-2">{text}</p>
  </div>
);

const HolidayCard = ({ img, title, price, features }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <img src={img} alt={title} className="w-full h-56 object-cover" />

    <div className="p-6">
      <h3 className="text-2xl font-semibold text-blue-900">{title}</h3>
      <p className="mt-4 text-xl font-semibold text-blue-900">
        Starting from {price}
      </p>

      <div className="mt-4 space-y-2">
        {features.map((f, idx) => (
          <p key={idx} className="flex items-center gap-2 text-gray-700">
            <FaCheckCircle className="text-green-600" /> {f}
          </p>
        ))}
      </div>

      <button className="mt-6 w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 font-semibold 
      ">
        📸 Customize This Holiday
      </button>
    </div>
  </div>
);

const ContactCard = ({ icon, title, subtitle, info }) => (
  <div className="bg-blue-900 p-8 rounded-xl text-center border border-indigo-50">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-300 mt-1">{subtitle}</p>
    <p className="text-yellow-400 mt-3 text-lg">{info}</p>
  </div>
);

