import React from 'react'
import umrahImg from '../assets/umrah.png'

const CustomizedUmrah = () => {
  return (
    <main className="font-sans text-gray-700 antialiased">
      {/* Hero */}
      <section className="relative hero-bg h-80 md:h-96 flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <img
            src={umrahImg}
            alt="Umrah"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative bg-black/40 w-full h-full flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-3">
              Customized Umrah Packages
            </h1>
            <p className="text-sm md:text-base">
              Personalized Umrah packages designed to give you a peaceful and
              hassle-free pilgrimage experience.
            </p>
          </div>
        </div>
      </section>

      {/* Main content placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* 👉 Convert your cards, package details and steps from
            'customized umarh.html' and place them here as JSX */}
        <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700">
          (Coming soon: exact cards & pricing details from your Umrah page)
        </div>
      </section>
    </main>
  )
}

export default CustomizedUmrah
