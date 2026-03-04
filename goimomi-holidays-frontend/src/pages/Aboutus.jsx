import React from 'react'
import aboutHero from '../assets/aboutus.png'
import officeImg from '../assets/office.png'

const About = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-80 md:h-96">
          <img
            src={aboutHero}
            className="w-full h-full object-cover"
            alt="About Goimomi Holidays"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h1 className="text-4xl md:text-5xl heading-font font-bold">
                About Goimomi Holidays
              </h1>
              <p className="mt-3 text-lg md:text-xl">
                Creating unforgettable travel experiences for over a decade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="mb-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl heading-font font-semibold">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2014, Goimomi Holidays began as a small travel agency
              with a big dream - to make extraordinary travel experiences
              accessible to everyone. What started as a passion project by a
              group of travel enthusiasts has grown into one of India&apos;s most
              trusted travel companies.
            </p>
            <p className="text-gray-600">
              Over the years, we have helped thousands of travelers explore the
              world, from the pristine beaches of Maldives to the bustling
              streets of Dubai, from the serene backwaters of Kerala to the
              majestic mountains of Kashmir. Each journey we plan is a testament
              to our commitment to excellence and attention to detail.
            </p>
            <p className="text-gray-600">
              Today, Goimomi Holidays stands as a symbol of trust, reliability,
              and exceptional service in the travel industry. We continue to
              innovate and expand our offerings while maintaining the personal
              touch that has made us who we are.
            </p>
          </div>

          <div className="relative p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <img
              src={officeImg}
              className="w-full h-72 object-cover rounded-lg"
              alt="Goimomi office"
            />
            <div className="absolute bottom-8 right-8 bg-goimomi-gold text-goimomi-dark p-4 rounded-lg text-center font-bold shadow-xl">
              <p className="text-3xl md:text-4xl leading-none">10+</p>
              <p className="text-xs md:text-sm">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-10" />

      {/* Mission & Vision */}
      <section className="mb-12">
        <h2 className="text-3xl heading-font font-semibold text-center mb-8">
          Our Mission &amp; Vision
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-3">
            <h3 className="text-xl font-bold text-goimomi-dark">Our Mission</h3>
            <p className="text-gray-600">
              To provide exceptional travel experiences that exceed our
              customers&apos; expectations while ensuring their safety, comfort, and
              satisfaction. We strive to make travel accessible, affordable, and
              memorable for everyone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-3">
            <h3 className="text-xl font-bold text-goimomi-dark">Our Vision</h3>
            <p className="text-gray-600">
              To become the leading travel company in India, recognized for our
              innovation, reliability, and customer-centric approach. We
              envision a world where travel brings people together, promotes
              understanding, and creates positive impacts on local communities
              and environments.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-10" />

      {/* Achievements */}
      <section className="mb-12 bg-goimomi-primary text-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl heading-font font-semibold text-center">
          Our Achievements
        </h2>
        <p className="text-center text-gray-200 mt-2 mb-8 text-sm">
          Numbers that speak for our commitment to excellence
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-goimomi-gold">10+</p>
            <p className="mt-2 text-gray-100 text-sm">Years of Experience</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-goimomi-gold">
              50,000+
            </p>
            <p className="mt-2 text-gray-100 text-sm">Happy Travelers</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-goimomi-gold">100+</p>
            <p className="mt-2 text-gray-100 text-sm">Destinations Covered</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-goimomi-gold">24/7</p>
            <p className="mt-2 text-gray-100 text-sm">Customer Support</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
