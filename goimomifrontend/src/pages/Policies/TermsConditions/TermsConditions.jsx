import React from "react";
import { FileText } from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import PolicyPageLayout, { PolicyCallout, PolicyContact, PolicyList, PolicySection } from "../PolicyPageLayout";

const navigation = [
  { id: "agreement", label: "Agreement and scope" },
  { id: "definitions", label: "Key definitions" },
  { id: "services", label: "Our travel services" },
  { id: "booking", label: "Bookings and payments" },
  { id: "traveller", label: "Your responsibilities" },
  { id: "website-use", label: "Website use and communications" },
  { id: "changes", label: "Changes and disruptions" },
  { id: "liability", label: "Liability and insurance" },
  { id: "legal", label: "Legal terms" },
  { id: "contact", label: "Contact us" },
];

const TermsConditions = () => {
  usePageSEO(
    "Terms & Conditions | Goimomi Holidays",
    "Read the terms governing Goimomi Holidays website use, travel enquiries, bookings, payments, suppliers, changes, and customer responsibilities.",
    undefined,
    "Goimomi Holidays terms and conditions, travel booking terms, holiday package terms, payment terms"
  );

  return (
    <PolicyPageLayout
      icon={FileText}
      title="Terms & Conditions"
      summary="These terms explain how our website, travel services, bookings, payments, and supplier relationships work so you can book with confidence."
      navigation={navigation}
    >
      <PolicySection id="agreement" number="01" title="Agreement and scope">
        <p>
          These Terms & Conditions apply when you browse goimomi.com, submit an enquiry, request a quotation, or book a product or service through Goimomi Holidays. By using the website or proceeding with a booking, you agree to these terms and any booking-specific terms shown before payment or in your confirmation.
        </p>
        <p>
          “Goimomi Holidays”, “we”, “us”, and “our” refer to Goimomi Holidays. “You” and “traveller” refer to the person using the website or the person named on a booking. If you book on behalf of others, you confirm that you are authorised to accept these terms for them.
        </p>
        <PolicyCallout title="Please read before payment" tone="gold">
          Travel products are often supplied by third parties. The airline, hotel, transport operator, cruise line, tour operator, visa authority, or other supplier may apply additional terms, restrictions, and cancellation charges. Those terms form part of your booking and will be shared where available.
        </PolicyCallout>
      </PolicySection>

      <PolicySection id="definitions" number="02" title="Key definitions">
        <p>For clarity, the following words have the meanings below:</p>
        <PolicyList items={[
          "Website means goimomi.com and any related Goimomi Holidays page, form, booking flow, or digital service we operate.",
          "Service means a flight, hotel, holiday package, cab, transfer, cruise, visa-assistance service, business-travel arrangement, shop product, or other product described by us.",
          "Supplier means the airline, hotel, transport provider, cruise line, tour operator, visa authority, insurer, payment processor, courier, or other third party that provides or supports a service.",
          "Booking means a reservation, ticket, voucher, itinerary, order, or service request accepted by us or a supplier.",
          "Confirmation means the written document, email, ticket, voucher, invoice, or itinerary showing that a booking has been accepted and the applicable conditions.",
        ]} />
        <p>
          If a booking document defines a term differently for a particular service, the booking document and supplier rules will apply to that service.
        </p>
      </PolicySection>

      <PolicySection id="services" number="03" title="Our role and travel services">
        <p>
          We arrange or facilitate travel services including flights, hotels, holiday packages, cabs, cruises, visa assistance, business travel, and related products. Unless your confirmation expressly says otherwise, we act as a booking agent or facilitator and the relevant supplier remains responsible for operating its service.
        </p>
        <PolicyList items={[
          "A quotation or website listing is an invitation to enquire and is not a guarantee of availability or a completed booking.",
          "A booking becomes confirmed only when the required payment is received and we or the relevant supplier issue written confirmation, ticket, voucher, or itinerary.",
          "Descriptions, images, schedules, fares, taxes, availability, and inclusions can change before confirmation and may be subject to supplier or government updates.",
          "Visa decisions, immigration permission, airline acceptance, and entry into a country are controlled by the relevant authorities or carrier and are not guaranteed by Goimomi Holidays.",
        ]} />
        <p>
          We may present options from different suppliers and help coordinate the reservation. We do not guarantee that a supplier will continue to operate, maintain a particular standard, or accept a request outside its published rules.
        </p>
      </PolicySection>

      <PolicySection id="booking" number="04" title="Bookings, prices, and payments">
        <p>To make or maintain a booking, you agree to provide accurate traveller details and complete payment by the stated deadline.</p>
        <PolicyList items={[
          "Prices are usually quoted in the currency shown at the time of enquiry or checkout. Taxes, service fees, card charges, currency conversion fees, deposits, and supplier charges will be identified where applicable.",
          "A fare, room, itinerary, or package is not held unless we confirm it in writing. If a price or availability changes before confirmation, we will inform you before proceeding where reasonably possible.",
          "You authorise us and our payment partners to process the payment method you provide. Payment gateway or bank charges may be non-refundable when a transaction is reversed, cancelled, or refunded.",
          "If payment is late, incomplete, reversed, or declined, we may release the reservation, cancel the booking, or recover any outstanding amount allowed under applicable law.",
          "You must review the names, dates, destinations, inclusions, exclusions, and payment amount in your confirmation immediately and tell us about an error as soon as possible.",
        ]} />
        <p>
          Deposits and advance payments may be required to secure a service. A payment is not evidence that a booking is confirmed unless we or the supplier issue the relevant confirmation. We may request additional information to verify a payment or traveller identity before issuing travel documents.
        </p>
        <p>
          Special requests, such as adjoining rooms, meals, seats, accessibility support, child seats, extra baggage, early check-in, or late checkout, are requests only unless specifically confirmed in writing. Supplier charges may apply.
        </p>
      </PolicySection>

      <PolicySection id="traveller" number="05" title="Your responsibilities as a traveller">
        <p>You are responsible for the following throughout the booking and travel process:</p>
        <PolicyList items={[
          "Providing complete and accurate names, dates of birth, contact details, passport information, and other requested details for every traveller.",
          "Checking passport validity, visas, permits, vaccination or health requirements, transit rules, baggage allowances, check-in times, and other destination requirements.",
          "Arriving on time and carrying the required original documents, confirmations, identification, and payment cards.",
          "Following the rules of airlines, hotels, transport operators, cruise lines, visa authorities, local authorities, and other suppliers.",
          "Treating staff, drivers, guides, accommodation, vehicles, and other travellers respectfully and paying for any loss or damage caused by your actions where applicable.",
        ]} />
        <p>
          You must not use the website for unlawful activity, impersonate another person, interfere with its operation, introduce malicious code, scrape content without permission, or use another person’s payment or identity details without authority.
        </p>
        <p>
          If you are travelling with children, elderly passengers, or a person who needs assistance, you are responsible for telling us about relevant requirements early and checking that the supplier can accommodate them. We cannot guarantee an arrangement that a supplier has not confirmed.
        </p>
      </PolicySection>

      <PolicySection id="website-use" number="06" title="Website use, content, and communications">
        <p>
          Website content is provided for general travel information and may contain typographical errors, outdated availability, supplier information, or links to third-party websites. We may correct, update, suspend, or withdraw content and functionality without prior notice.
        </p>
        <p>
          By submitting an enquiry, booking, or support request, you agree that we may contact you by email, phone, SMS, WhatsApp, or another channel using the details you provide. You can opt out of promotional communications, but service and booking messages may still be sent when necessary.
        </p>
        <p>
          If you send a review, suggestion, photograph, or other feedback, you confirm that you have the right to share it and allow Goimomi Holidays to use it for service improvement or marketing in accordance with our Privacy Policy. We may moderate or remove content that is unlawful, misleading, abusive, or unrelated.
        </p>
        <PolicyCallout title="Respectful use">
          Do not upload confidential documents, payment credentials, malware, or another person’s personal information unless you are authorised and the information is requested for a legitimate booking or support purpose.
        </PolicyCallout>
      </PolicySection>

      <PolicySection id="changes" number="07" title="Changes, cancellations, and disruptions">
        <p>
          Change and cancellation requests must be sent to us in writing using the contact details below. Charges are determined by the relevant booking terms and supplier rules. Our separate Cancellation Policy explains the general approach, but the terms on your confirmation or supplier ticket will control if they are more specific.
        </p>
        <PolicyList items={[
          "We may help request a change, but a supplier is not required to accept it. Fare differences, amendment fees, service fees, and other charges may apply.",
          "Airlines, hotels, cruises, tour operators, transport providers, and authorities may change schedules, routes, accommodation, inclusions, or operating conditions.",
          "If a supplier changes or cancels a service, available remedies are normally limited to those offered by that supplier, subject to applicable law.",
          "We may contact you using the details on your booking. You are responsible for checking messages and telling us if your contact details change.",
        ]} />
        <p>
          Our Cancellation Policy provides general guidance on requests, supplier penalties, amendments, no-shows, credits, and refunds. Please read it together with the specific terms shown on your confirmation, ticket, voucher, invoice, or product page.
        </p>
      </PolicySection>

      <PolicySection id="liability" number="08" title="Liability, suppliers, and travel insurance">
        <p>
          We take reasonable care when selecting and coordinating travel services, but we do not operate every flight, hotel, vehicle, cruise, tour, or visa process listed on our website. To the extent permitted by law, we are not responsible for a supplier’s acts, omissions, delay, overbooking, refusal to carry, service failure, or changes outside our control.
        </p>
        <p>
          We are also not responsible for events such as weather, natural disasters, epidemics, strikes, war, civil unrest, government action, border closures, technical failures, or other force majeure events that could not reasonably be prevented.
        </p>
        <PolicyCallout title="Travel insurance is strongly recommended">
          Consider insurance that covers medical treatment, trip cancellation, interruption, delays, baggage, personal liability, and emergency assistance. It is your responsibility to check that the policy is suitable for your circumstances and destination.
        </PolicyCallout>
        <p>
          Nothing in these terms excludes or limits a liability that cannot legally be excluded, including liability for fraud, wilful misconduct, or rights that cannot be waived under applicable consumer law.
        </p>
        <p>
          Where we are legally responsible for a proven failure in our own service, our responsibility is limited to the direct and reasonably foreseeable loss allowed by applicable law. We are not responsible for indirect loss, loss of enjoyment, or consequential loss where the law permits that limitation.
        </p>
      </PolicySection>

      <PolicySection id="legal" number="09" title="Intellectual property, privacy, and legal terms">
        <p>
          Website text, branding, design, images, graphics, and other content belong to Goimomi Holidays or our licensors. You may use the website for personal, lawful travel planning and booking purposes. You must not copy, reproduce, publish, sell, or commercially exploit our content without written permission.
        </p>
        <p>
          We may update the website or these terms from time to time. Updates take effect when posted. If a court finds a provision invalid or unenforceable, the remaining provisions will continue to apply.
        </p>
        <p>
          Our Privacy Policy explains how we handle personal information. If you have a complaint about a service, please contact us first so we can review the booking and coordinate with the relevant supplier.
        </p>
        <p>
          These terms are governed by the laws of India. Subject to applicable law and any mandatory consumer rights, disputes will be submitted to the courts having jurisdiction in Trichy, Tamil Nadu.
        </p>
      </PolicySection>

      <PolicySection id="contact" number="10" title="Contact and support">
        <p>
          For a booking question, payment issue, amendment, cancellation, complaint, or clarification about these terms, please contact our travel desk with your booking reference and the traveller name.
        </p>
        <PolicyContact subject="Terms and booking enquiry - Goimomi Holidays" />
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
          <p className="font-black text-slate-900">Goimomi Holidays</p>
          <p>5, Crescent Park Apartment, Hazrath Sulaiman Street, Kaja Nagar, Trichy - 620020, Tamil Nadu, India</p>
          <p className="mt-2">By email: <a href="mailto:hello@goimomi.com" className="font-bold text-[#14532d] hover:underline">hello@goimomi.com</a></p>
        </div>
      </PolicySection>
    </PolicyPageLayout>
  );
};

export default TermsConditions;
