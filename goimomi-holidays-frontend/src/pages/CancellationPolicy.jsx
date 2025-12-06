import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {/* ---------------- HEADER SECTION ---------------- */}
      <header className="bg-green-800 text-white py-14 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide">
          Cancellation Policy
        </h1>
        <p className="mt-3 text-lg opacity-90">
          Learn how we handle cancellations and booking changes
        </p>
      </header>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="max-w-5xl mx-auto bg-white mt-10 p-10 rounded-2xl shadow-md">
        
        {/* Accuracy of Information */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Accuracy of Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Goimomi Holidays does not guarantee the accuracy or completeness
            of the information found on this website. We are not responsible for
            any damages—direct, indirect, incidental, or consequential—resulting
            from the use of this information. Content may change anytime
            without prior notice.
          </p>
        </section>

        {/* Confidentiality */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Confidentiality
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All information collected or stored by Goimomi Holidays is
            confidential and may only be disclosed when required by law.
          </p>
        </section>

        {/* Copyright Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Copyright Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You may cite or copy information from this site for personal use.
            Unauthorized commercial use is strictly prohibited.
          </p>
        </section>

        {/* Enforceability */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Enforceability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If any part of these terms is found invalid, it will be modified to
            match applicable laws without changing the original intent.
          </p>
        </section>

        {/* Security Warnings */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Security Warnings
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Users must ensure their devices are protected from viruses and
            malicious programs. Goimomi Holidays is not liable for damages
            arising from website usage or linked sites.
          </p>
        </section>

        {/* Products & Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Products & Services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Information on this site is for descriptive purposes only and does
            not serve as an offer to sell. Availability may vary by location.
            Please contact us for detailed terms and conditions.
          </p>
        </section>

        {/* Professional Advice */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Professional Advice
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The content provided does not constitute professional advice.
            For legal, tax, or financial matters, consult a qualified
            professional.
          </p>
        </section>

        {/* Warranties */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Warranties
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Goimomi Holidays disclaims all warranties—express or implied—
            related to the website and its usage. We are not responsible for
            damages resulting from misuse.
          </p>
        </section>

        {/* Comments */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            Comments & Suggestions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For any queries or feedback, please reach out to us at{" "}
            <span className="text-green-700 font-semibold">
              hello@goimomi.com
            </span>.
          </p>
        </section>
      </div>

      {/* Bottom Padding */}
      <div className="h-10"></div>
    </div>
  );
};

export default CancellationPolicy;
