import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="w-full bg-gray-50 py-16 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 md:p-16 max-w-4xl w-full">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-[#0b1a3d]">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Last Updated: November 2025
        </p>

        {/* Navigation Links */}
        <div className="mt-10 text-gray-700">
          <p className="font-semibold">On this page:</p>
          <div className="flex flex-wrap gap-6 text-blue-700 mt-3 font-medium">
            <a href="#commitment" className="hover:underline">Our Commitment</a>
            <a href="#security" className="hover:underline">Security</a>
            <a href="#info" className="hover:underline">Information We Collect</a>
            <a href="#cookies" className="hover:underline">Cookie Policy</a>
            <a href="#manage" className="hover:underline">Managing Cookies</a>
          </div>
        </div>

        {/* Section 1 */}
        <section id="commitment" className="mt-12">
          <h2 className="text-3xl font-semibold text-[#0b1a3d]">
            Our Commitment to Privacy
          </h2>

          <p className="text-gray-700 mt-4 leading-7">
            We respect and are committed to protecting your privacy. 
            We will not publish, sell, or rent your personal data to third parties without your explicit consent. 
            The practices described in this policy apply to data collected by Goimomi Holidays across our domain and subdomains.
            <br /><br />
            By using our site, you agree to the terms of this policy. If you disagree, please discontinue use of the website. 
            This policy forms part of our User Agreement and is effective upon your first use of the site.
          </p>

          {/* Yellow Box */}
          <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-400 p-5 italic text-gray-700">
            This policy does not cover third-party sites that we link to.  
            Please review their privacy policies before providing personal information to them.
          </div>
        </section>

        {/* Section 2 */}
        <section id="security" className="mt-16">
          <h2 className="text-3xl font-semibold text-[#0b1a3d]">
            Privacy Guarantee & Data Security
          </h2>

          <p className="text-gray-700 mt-4 leading-7">
            We do not sell or rent personal information to third parties for marketing without explicit consent.
            <br /><br />
            From time to time we may publish aggregated, non-identifiable statistics about site usage 
            (for example, total visitors or most popular packages).
            <br /><br />
            Access to personal information is restricted to employees and contractors who need it to perform their duties.
            Violations of our privacy policy may result in disciplinary action, up to termination and potential legal action.
          </p>
        </section>

        {/* Section 3 */}
        <section id="info" className="mt-16">
          <h2 className="text-3xl font-semibold text-[#0b1a3d]">
            Information We Collect
          </h2>

          <p className="text-gray-700 mt-4 leading-7">
            The personal information we collect is used primarily to process orders and to deliver and improve our services.
            This policy applies to data you provide through any of our channels and media unless stated otherwise.
          </p>

          <h3 className="text-xl font-semibold mt-8 text-[#0b1a3d]">Security Measures</h3>
          <p className="text-gray-700 mt-3">
            We use appropriate physical, electronic, and managerial procedures to safeguard the information we collect online.
            These measures are continuously reviewed and updated as industry standards evolve.
          </p>

          <h3 className="text-xl font-semibold mt-8 text-[#0b1a3d]">Use of IP Address</h3>
          <p className="text-gray-700 mt-3">
            We use IP addresses to facilitate server diagnostics, administer the website, and collect aggregate demographic information. 
            You acknowledge providing such data voluntarily while using our services.
          </p>
        </section>

        {/* Section 4 */}
        <section id="cookies" className="mt-16">
          <h2 className="text-3xl font-semibold text-[#0b1a3d]">
            Cookie Policy
          </h2>

          <p className="text-gray-700 mt-4 leading-7">
            We are committed to transparency about how we use cookies on our website. 
            Cookies help deliver a more efficient and personalized browsing experience.
          </p>

          <h3 className="text-xl font-semibold mt-8 text-[#0b1a3d]">What is a Cookie?</h3>
          <p className="text-gray-700 mt-3 leading-7">
            A cookie is a small text file stored on your device by the browser. Cookies can remember preferences, 
            session state, and other useful information to enhance your experience.
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 leading-7">
            <li><strong>Session Cookies:</strong> temporary cookies erased when you close your browser.</li>
            <li><strong>Persistent Cookies:</strong> stored for a set time to help us analyze usage patterns and improve our services.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 text-[#0b1a3d]">Cookie Categories</h3>

          <div className="mt-4 space-y-4 text-gray-700 leading-7">
            <p><strong>Essential</strong><br/>Required for core website functions including session management and cart operation.</p>

            <p><strong>Functional</strong><br/>Enhances user preferences and improves usability.</p>

            <p><strong>Analytics</strong><br/>
              Used to measure performance and gather anonymized data (e.g., Google Analytics). 
              See Google’s privacy info: 
              <a href="https://policies.google.com/privacy/partners" target="_blank" className="text-blue-700 underline">
                google.com/policies/privacy/partners
              </a>
            </p>

            <p><strong>Advertising</strong><br/>Used to deliver relevant ads. Only reputable third-party partners are used.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="manage" className="mt-16">
          <h2 className="text-3xl font-semibold text-[#0b1a3d]">
            Managing Cookies
          </h2>

          <p className="text-gray-700 mt-4 leading-7">
            To manage or delete cookies, please change settings in your browser. Most browsers allow blocking or deleting cookies via  
            <strong> Settings → Privacy & Security</strong>.  
            You may also use browser extensions to control cookies more granularly.
            <br /><br />
            For privacy-related questions or personal data deletion requests, contact us at:  
            <span className="text-blue-700 font-semibold"> privacy@goimomi.example</span>
          </p>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-20 border-t pt-6">
          © 2025 Goimomi Holidays. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
