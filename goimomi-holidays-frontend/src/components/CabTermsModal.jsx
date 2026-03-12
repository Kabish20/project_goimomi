import React from "react";
import { X } from "lucide-react";

const CabTermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 mt-16 md:mt-0">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden mt-10 md:mt-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Terms & Conditions</h2>
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
            <h3 className="text-lg font-black text-gray-900 mb-2">1. GENERAL</h3>
            <p className="mb-2">1.1. This agreement is a public offer of Goimomi Technologies, hereinafter referred to as "the Contractor", to the Customer (a private person or a legal entity) for making the Transfer Services Contract (hereinafter referred to as "the Contract") on the conditions set forth in this Offer.</p>
            <p className="mb-2">1.2. This Contract shall be made under a special procedure: through acceptance of this Offer containing all essential conditions of the Contract, without signing by the Parties.</p>
            <p className="mb-2">1.3. Performance of actions by the Customer to fulfil the contract conditions specified in the Offer, including placement of an Order at the website and payment for the services by the Customer (payment using a bank card or otherwise, as offered at the Contractor's website) shall mean full and unconditional acceptance of the Offer.</p>
            <p className="mb-2">1.4. After receipt of the Order, all information stated therein shall form the basis for the Contract between the Contractor and the Customer. In this case, "the Customer" ("a Party to the Contract") shall mean any person specified in the payment document on whose behalf the payment has been made.</p>
            <p className="mb-2">1.5. This Contract is a multilateral transaction consisting of the accepted public offer and its integral parts, as well as appendices, agreements, procedures and provisions posted at the Contractor's website.</p>
            <p className="mb-2">1.6. The Contractor shall provide the Customer with reliable information on the scope and characteristics of transfer services. The services shall be directly provided to the Customer by third parties. The Contractor is not a carrier, taxi provider or motor vehicle owner and shall provide reservation (preliminary Order) of services rendered by third parties; therefore, the Contractor shall not be liable for life and health of Customers (passengers).</p>
            
            <h4 className="font-bold text-gray-900 mt-4 mb-2">1.7 ZERO CARD FEES</h4>
            <p className="mb-2">We dislike companies that add sneaky fees during the booking process as much as you do! So we refuse to do it.</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>ZERO credit card fees</li>
              <li>ZERO PayPal fees</li>
              <li>ZERO direct deposit fees</li>
              <li>ZERO booking fees</li>
            </ul>
            <p className="mb-2">Your bank or credit card provider may apply currency conversion fees.</p>

            <h4 className="font-bold text-gray-900 mt-4 mb-2">1.8 Standard Cancellation Policy</h4>
            <p className="mb-2">All bookings cancelled inside 10 days prior to travel are non-refundable.</p>
            <p className="mb-2">Fully paid bookings cancelled 10 days or more prior to travel may incur cancellation fees levied by suppliers ranging from 30% – 80%.</p>
            <p className="mb-2">Cancellations must be submitted in writing or through the User Profile → Manage Booking section.</p>
            <p className="mb-2">If a credit has been approved it is valid for 6 months from the cancellation date.</p>

            <h4 className="font-bold text-gray-900 mt-4 mb-2">1.9 Refund Policy</h4>
            <p className="mb-2">All refund requests must be submitted in writing.</p>
            <p className="mb-2">Claims must be made within 10 days after completion of travel arrangements.</p>
            <p className="mb-2">Refunds will NOT be issued for:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Weather disruptions</li>
              <li>Illness</li>
              <li>Flight delays or missed flights</li>
            </ul>
            <p className="mb-2">These must be claimed through travel insurance.</p>
            <p className="mb-2">Once travel has commenced: Unused services are non-refundable.</p>
            <p className="mb-2">Refunds are processed through the original payment method and may take 3–7 business days to appear.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">2. TERMS AND DEFINITIONS</h3>
            <p className="mb-2"><strong>Transfer</strong> is an integrated service that includes:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>Waiting for the client at the airport or station</li>
              <li>Meeting the client with a signboard</li>
              <li>Driver assistance with baggage</li>
              <li>Transport to the destination point</li>
            </ul>
            <p className="mb-2">Transfers may be provided using: Motor cars, Minivans, Minibuses.</p>
            <p className="mb-2">Minibus transfers may display the meeting sign on the vehicle windshield instead of the terminal.</p>
            <p className="mb-2"><strong>Vehicle With Driver Rental:</strong> Provision of a vehicle with driver for transportation within the city specified in the order. Service unit: 1 rental hour. Trips outside the city or to airports are treated as transfer services.</p>
            <p className="mb-2"><strong>Client:</strong> A person who uses the transfer services booked by the Customer.</p>
            <p className="mb-2"><strong>Contract:</strong> This agreement governing the service provision.</p>
            <p className="mb-2"><strong>Offer:</strong> A public offer to provide services under the specified terms.</p>
            <p className="mb-2"><strong>Acceptance:</strong> Full and unconditional acceptance of the Offer through service booking or payment.</p>
            <p className="mb-2"><strong>Website:</strong> The official website registered on the Internet: <a href="https://goimomi.com" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">https://goimomi.com</a></p>
            <p className="mb-2"><strong>Online Reservation System:</strong> Electronic system for booking and managing transfer services.</p>
            <p className="mb-2"><strong>Payment:</strong> Funds transferred by the Customer to the Contractor for the services.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">3. SUBJECT OF THE CONTRACT</h3>
            <p className="mb-2">3.1. The subject of this Contract is providing the Customer the ability to reserve transfer and related services via the Goimomi Online Reservation System.</p>
            <p className="mb-2">3.2. Orders may be placed up to 24 hours prior to the service start time.</p>
            <p className="mb-2">3.3. By placing the Order, the Customer agrees to receive service and promotional notifications via phone or email.</p>
            <p className="mb-2">3.4. Additional addresses during a trip may incur additional charges communicated during booking.</p>
            <p className="mb-2">3.5. Goimomi will attempt to provide drivers speaking English or the local language, but this is not guaranteed.</p>
            <p className="mb-2">3.6. Additional services such as Child seats, Toll roads, and Special luggage must be requested during booking.</p>
            <p className="mb-2">3.7. Passenger count must match vehicle capacity. Children may not sit in the front seat. Luggage limitations: 2 Large bags, 3 Medium bags, 4 Small bags. Non-standard luggage may require additional charges.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">4. MOTOR CAR WITH DRIVER RENTAL</h3>
            <p className="mb-2">4.1 Minimum rental time is defined on the website.</p>
            <p className="mb-2">4.2 Rental services are available only through advance booking.</p>
            <p className="mb-2">4.3 Rental services are charged regardless of vehicle usage time or route changes.</p>
            <p className="mb-2">4.4 Trips to airports or railway stations are classified as transfers.</p>
            <p className="mb-2">4.5 Rental payments are non-cash only.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">5. MINIVANS & MINIBUSES</h3>
            <p className="mb-2">5.1 Signboards may be placed on the vehicle windshield or body.</p>
            <p className="mb-2">5.2 Baggage assistance may not be included.</p>
            <p className="mb-2">5.3 Group bookings must appoint a supervisor passenger responsible for coordinating the group.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">6. OBLIGATIONS OF THE PARTIES</h3>
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Customer Obligations</h4>
              <p className="mb-2">The Customer shall:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Provide accurate booking information</li>
                <li>Provide valid phone/email contact details</li>
                <li>Arrive at the pickup point on time</li>
              </ul>
              <p className="mb-2">Waiting time: 1 hour at airports, 20 minutes at other locations.</p>
              <p className="mb-2">Passengers must follow transport rules and respect the vehicle.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Contractor Obligations</h4>
              <p className="mb-2">Goimomi shall:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Provide services according to the booking</li>
                <li>Replace the vehicle in case of breakdown</li>
                <li>Confirm booking via email or SMS</li>
                <li>Send an itinerary receipt</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">7. SETTLEMENT PROCEDURE</h3>
            <p className="mb-2">7.1 Service prices are listed on the website.</p>
            <p className="mb-2">7.2 The Customer confirms acceptance of the price when placing an order.</p>
            <p className="mb-2">7.3 Private customers must pay 100% in advance. If payment fails, the service will not be confirmed.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">8. LIABILITY OF THE PARTIES</h3>
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Customer Liability</h4>
              <p className="mb-2">Customers are responsible for damages caused inside the vehicle. Cleaning or repair costs may be charged.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Contractor Liability</h4>
              <p className="mb-2">If the service fails due to the Contractor's fault: The service cost will be refunded.</p>
              <p className="mb-2">If the Customer misses a flight due to Contractor fault: Compensation up to 500 units of the service currency may be provided with proof.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">9. DISPUTE RESOLUTION</h3>
            <p className="mb-2">Disputes shall first be resolved through negotiation.</p>
            <p className="mb-2">Claims must be submitted in writing and reviewed within 5 business days.</p>
            <p className="mb-2">If unresolved, disputes may be handled through arbitration courts.</p>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">10. FINAL PROVISIONS</h3>
            <p className="mb-2">10.1 This contract becomes effective once the booking is confirmed.</p>
            <p className="mb-2">10.2 Goimomi reserves the right to update the contract terms.</p>
            <p className="mb-2">10.3 Force majeure events such as natural disasters or government actions release parties from liability.</p>
            <p className="mb-2">10.4 By accepting this contract, the Customer consents to the use of personal data for service execution.</p>
            <p className="mb-2">10.5 Customer data will be kept confidential.</p>
          </section>

          <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4">COMPANY DETAILS</h3>
            <p className="mb-1 font-bold">Goimomi Holidays</p>
            <p className="mb-1 text-sm">5, Crescent Park Apartment<br/>Hazrath Sulaiman Street<br/>Kaja Nagar, Trichy – 620020<br/>Tamil Nadu, India</p>
            <p className="mb-1 mt-3"><strong>Phone:</strong> +91 638 222 0393</p>
            <p className="mb-1"><strong>Email:</strong> <a href="mailto:hello@goimomi.com" className="text-green-600 hover:underline">hello@goimomi.com</a></p>
            <p className="mb-1"><strong>Website:</strong> <a href="https://goimomi.com" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">https://goimomi.com</a></p>
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

export default CabTermsModal;
