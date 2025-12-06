import React from 'react'
import { Link } from 'react-router-dom'

const ContactSuccess = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-extrabold">Thank You!</h1>
      <p className="mt-4 text-gray-600">
        Your message has been sent successfully. We&apos;ll get back to you
        within one business day.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-5 py-3 bg-goimomi-primary text-white rounded-lg shadow hover:brightness-105 transition text-sm"
      >
        Back to Home
      </Link>
    </main>
  )
}

export default ContactSuccess
