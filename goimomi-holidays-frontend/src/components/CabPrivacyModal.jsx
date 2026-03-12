import React from "react";
import { X } from "lucide-react";

const CabPrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 mt-16 md:mt-0">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden mt-10 md:mt-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Statement of Privacy</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto font-medium text-gray-700 space-y-6 text-sm">
          <section>
            <p className="mb-4">
              When using our website located at: <a href="https://goimomi.com" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">https://goimomi.com</a> (hereinafter referred to as the Website), or our application providing our services, in particular making online booking of a transfer through the Website or through the Application (hereinafter referred to as Booking), you entrust your personal information to us. In this regard, you may want to carefully read this Statement of Privacy (hereinafter referred to as the Statement).
            </p>
            <p className="mb-4">
              Goimomi Holidays organizes transfer and travel services in multiple countries worldwide — including airport transfers, railway station pickups, city transportation, and intercity travel.
            </p>
            <p className="mb-4">
              We work to ensure your journey is comfortable, safe, and convenient, and that ordering services on our Website is simple, fast, and reliable.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">1. Personal Data We Process</h3>
            <p className="mb-2">1.1. Goimomi Holidays collects information that you provide in the data fields on the Website or Application. For example, you may provide:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>First name and last name</li>
              <li>Email address</li>
              <li>Contact phone number</li>
              <li>Travel details</li>
              <li>Booking information</li>
              <li>Other information required for registration or service booking.</li>
            </ul>
            <p className="mb-2">1.2. We do not process special categories of Personal Data, including information related to:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Race or ethnicity</li>
              <li>Health information</li>
              <li>Sexual life or orientation</li>
              <li>Genetic or biometric data</li>
              <li>Political opinions</li>
              <li>Religious beliefs</li>
              <li>Trade union memberships</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">2. Purpose of Processing Personal Data</h3>
            <p className="mb-2">2.1. Your Personal Data is processed for the following purposes:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Processing and managing bookings</li>
              <li>Providing transfer and travel services</li>
              <li>Personalizing your user experience</li>
              <li>Responding to your inquiries or support requests</li>
              <li>Improving our services and website functionality</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">3. Consent to Processing of Personal Data</h3>
            <p className="mb-2">3.1. When using our services, Website, or Application, you confirm that you have read and understood this Privacy Statement.</p>
            <p className="mb-2">By continuing to use our services, you agree to the collection, storage, and use of your Personal Data as described in this Statement.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">4. Sharing Personal Data with Third Parties</h3>
            <p className="mb-2">4.1. In certain situations, Goimomi Holidays may share your Personal Data with third parties, such as:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Service providers (drivers, transportation partners)</li>
              <li>Payment processors</li>
              <li>Technical service providers</li>
            </ul>
            <p className="mb-2">We only share information when necessary to provide our services.</p>
            <p className="mb-2">By using our services, you acknowledge and agree to such data sharing when required.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">5. Your Rights</h3>
            <p className="mb-2">5.1. You have the right to control your Personal Data. You may:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Request access to your Personal Data</li>
              <li>Request correction or updates to your information</li>
              <li>Request deletion of your Personal Data</li>
              <li>Request restriction of processing</li>
            </ul>
            <p className="mb-2">To exercise these rights, you may contact us using the details below.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">6. Storage and Protection of Personal Data</h3>
            <p className="mb-2">6.1. We implement appropriate technical and organizational measures to protect your Personal Data against:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Unauthorized access</li>
              <li>Loss or destruction</li>
              <li>Alteration or misuse</li>
            </ul>
            <p className="mb-2">We take data protection seriously and continuously improve our security measures.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">7. Automatically Collected Information</h3>
            <p className="mb-2">7.1. When you use our Website or Application, we may automatically collect certain technical information, including:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>IP address</li>
              <li>Date and time of website access</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
            </ul>
            <p className="mb-2">This information helps us improve website performance and user experience.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">8. Changes to the Privacy Statement</h3>
            <p className="mb-2">8.1. Goimomi Holidays may update this Privacy Statement from time to time.</p>
            <p className="mb-2">Any changes will be published on our Website, and the updated version will become effective immediately after publication.</p>
          </section>

          <section className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
            <h3 className="text-lg font-black text-gray-900 mb-4">9. Company Contact Information</h3>
            <p className="mb-1">If you have any questions regarding this Privacy Statement or the protection of your Personal Data, please contact us:</p>
            <div className="mt-3">
              <p className="mb-1 font-bold">Company Name</p>
              <p className="mb-3">Goimomi Holidays</p>
              
              <p className="mb-1 font-bold">Address</p>
              <p className="mb-3 text-sm">5, Crescent Park Apartment<br/>Hazrath Sulaiman Street<br/>Kaja Nagar<br/>Trichy – 620020<br/>Tamil Nadu, India</p>
              
              <p className="mb-1"><strong>Phone:</strong> +91 638 222 0393</p>
              <p className="mb-1"><strong>Email:</strong> <a href="mailto:hello@goimomi.com" className="text-green-600 hover:underline">hello@goimomi.com</a></p>
              <p className="mb-1"><strong>Website:</strong> <a href="https://goimomi.com" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">https://goimomi.com</a></p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabPrivacyModal;
