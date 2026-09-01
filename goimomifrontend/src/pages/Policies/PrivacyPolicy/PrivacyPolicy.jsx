import React from "react";
import { Globe2, LockKeyhole, ShieldCheck } from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import PolicyPageLayout, { PolicyCallout, PolicyContact, PolicyList, PolicySection } from "../PolicyPageLayout";

const navigation = [
  { id: "overview", label: "Overview" },
  { id: "who-this-covers", label: "Who this covers" },
  { id: "information", label: "Information we collect" },
  { id: "use", label: "How we use information" },
  { id: "sharing", label: "When we share information" },
  { id: "international", label: "International processing" },
  { id: "cookies", label: "Cookies and analytics" },
  { id: "rights", label: "Security, retention, and rights" },
  { id: "children", label: "Children and documents" },
  { id: "contact", label: "Contact us" },
];

const PrivacyPolicy = () => {
  usePageSEO(
    "Privacy Policy | Goimomi Holidays",
    "Learn how Goimomi Holidays collects, uses, shares, and protects personal information across our travel services and website.",
    undefined,
    "Goimomi Holidays privacy policy, travel data protection, booking privacy, cookies"
  );

  return (
    <PolicyPageLayout
      icon={ShieldCheck}
      title="Privacy Policy"
      summary="We use your information to make travel planning smoother, bookings more reliable, and support more personal - while keeping your choices clear and your data handled responsibly."
      navigation={navigation}
    >
      <PolicySection id="overview" number="01" title="Our commitment to your privacy">
        <p>
          This Privacy Policy explains how Goimomi Holidays collects, uses, stores, and shares information when you visit our website, contact us, request a quote, make a booking, or use one of our travel services. It applies to our holiday packages, flights, hotels, cabs, cruises, visa assistance, business travel, and related services.
        </p>
        <p>
          By using our website or giving us your information, you acknowledge this policy. Where a service provider has its own privacy notice, that provider may also process your information under its terms.
        </p>
        <PolicyCallout title="In short">
          We do not sell or rent your personal information. We share only the information needed to arrange your requested service, operate our business, meet legal obligations, or protect our customers and systems.
        </PolicyCallout>
      </PolicySection>

      <PolicySection id="who-this-covers" number="02" title="Who this policy covers">
        <p>
          This policy applies to visitors, customers, travellers, agents, business partners, and anyone who communicates with Goimomi Holidays through our website, forms, phone, email, WhatsApp, social channels, booking systems, or in-person service channels.
        </p>
        <p>
          It covers information collected directly by Goimomi Holidays and information we receive from a person making a booking for you or from a supplier helping us deliver your requested service. It does not replace a supplier's own privacy notice, which may apply when that supplier processes your information independently.
        </p>
      </PolicySection>

      <PolicySection id="information" number="03" title="Information we collect">
        <p>Depending on the service you request, we may collect the following categories of information:</p>
        <PolicyList items={[
          "Contact details, such as your name, email address, telephone number, billing address, and preferred communication method.",
          "Traveller and booking details, including passenger names, dates of travel, destinations, preferences, accommodation details, and emergency contact information.",
          "Documents needed for a requested service, such as passport or visa information. Please share only documents requested by our team through an appropriate channel.",
          "Payment and transaction information, including payment status, invoice details, and limited payment references. Full card details are handled by our payment partners and are not stored by us unless expressly stated.",
          "Communications, including enquiries, feedback, support requests, call notes, and messages sent through our forms, email, phone, WhatsApp, or other channels.",
          "Technical information, such as IP address, browser, device type, operating system, pages visited, and approximate usage information collected through logs and similar technologies.",
        ]} />
        <p>
          We may receive limited information from airlines, hotels, transport operators, visa partners, payment processors, or other suppliers when it is needed to fulfil your booking or respond to your request.
        </p>
        <p>
          We do not ask for special-category information unless it is necessary for the service you request, such as an accessibility or dietary requirement. Please do not send health, identity, passport, or financial information through an unrequested or suspicious link.
        </p>
      </PolicySection>

      <PolicySection id="use" number="04" title="How we use your information">
        <p>We use information only for legitimate business and service purposes, including to:</p>
        <PolicyList items={[
          "Respond to enquiries, prepare quotations, and provide travel advice or customer support.",
          "Create, confirm, administer, and service bookings, payments, invoices, itineraries, and travel documents.",
          "Coordinate with airlines, hotels, transport operators, cruise lines, visa authorities, insurers, and other providers selected for your trip.",
          "Send booking updates, service messages, safety notices, and other communications necessary to manage your travel.",
          "Improve our website, products, service quality, fraud prevention, security, and internal operations.",
          "Send offers or travel updates where permitted and where you have not opted out of marketing communications.",
          "Comply with applicable law, respond to lawful requests, resolve disputes, and enforce our agreements.",
        ]} />
        <p>
          Depending on the situation and applicable law, our reasons for processing information may include fulfilling a contract or booking, taking steps at your request before a contract, obtaining your consent, complying with a legal obligation, or pursuing legitimate business interests such as security, service improvement, and fraud prevention.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <LockKeyhole className="mb-3 text-[#14532d]" size={20} />
            <h3 className="font-black text-slate-900">Service first</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">We collect what is relevant to the request you make, from a quote to a confirmed itinerary.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <Globe2 className="mb-3 text-[#14532d]" size={20} />
            <h3 className="font-black text-slate-900">Travel requires coordination</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">International travel may require information to be shared with providers in the destination country.</p>
          </div>
        </div>
      </PolicySection>

      <PolicySection id="sharing" number="05" title="When we share information">
        <p>We may share relevant information with trusted parties when necessary to deliver a service or operate Goimomi Holidays, including:</p>
        <PolicyList items={[
          "Travel suppliers and service operators, such as airlines, hotels, transport providers, cruise lines, tour operators, and visa partners.",
          "Payment gateways, banks, fraud-prevention providers, technology vendors, and customer-support tools.",
          "CRM, enquiry-management, communication, hosting, analytics, and document-processing providers that help us operate the website and respond to you.",
          "Professional advisers, auditors, insurers, or business partners who are subject to appropriate confidentiality obligations.",
          "Government authorities, border agencies, courts, or law-enforcement bodies where disclosure is required or permitted by law.",
        ]} />
        <p>
          We require service providers to use information only for the agreed purpose or as otherwise permitted by law. We do not authorise third parties to use your information for their own unrelated marketing without an appropriate legal basis or your consent where required.
        </p>
      </PolicySection>

      <PolicySection id="international" number="06" title="International processing and travel suppliers">
        <p>
          Travel is cross-border by nature. If you request an international flight, hotel, cruise, transfer, package, visa service, or business trip, relevant information may need to be sent to providers or authorities in India or in a destination, transit, or service country.
        </p>
        <p>
          Different countries may have different data-protection standards. We share only information reasonably required for the requested service and expect our direct service providers to protect it according to their contractual, professional, or legal duties.
        </p>
        <PolicyCallout title="Your choice">
          If you do not provide information required by a supplier or authority, we may be unable to issue a ticket, confirm accommodation, process a visa request, or provide another requested service.
        </PolicyCallout>
      </PolicySection>

      <PolicySection id="cookies" number="07" title="Cookies and analytics">
        <p>
          Cookies are small files stored on your device that help a website remember preferences, maintain sessions, understand usage, and improve performance. We may use essential cookies for core features and, where enabled, analytics or preference cookies to understand how visitors use our website.
        </p>
        <p>
          You can control or delete cookies through your browser settings. Disabling essential cookies may affect site functionality. If third-party analytics or advertising tools are enabled on a specific service, those providers may process information under their own notices.
        </p>
        <PolicyCallout title="Your browser controls" tone="gold">
          Most browsers let you review, block, or delete cookies from their Privacy or Security settings. Your choices may need to be repeated on another device or browser.
        </PolicyCallout>
        <p>
          We may also use pixels, tags, or similar technologies in emails or pages to understand whether a message was opened or a link was used. Where marketing consent or an opt-out is required, we will respect your preference.
        </p>
      </PolicySection>

      <PolicySection id="rights" number="08" title="Security, retention, and your rights">
        <p>Subject to applicable law and reasonable verification, you may contact us to:</p>
        <PolicyList items={[
          "Request access to personal information we hold about you.",
          "Ask us to correct information that is inaccurate or incomplete.",
          "Ask us to delete information when it is no longer needed, unless we must retain it for a legal or legitimate business reason.",
          "Withdraw consent or opt out of promotional communications. Service and booking messages may still be sent when necessary.",
          "Ask questions about how your information is used or raise a privacy concern.",
        ]} />
        <p>
          We use reasonable administrative, technical, and organisational safeguards designed to protect information from unauthorised access, loss, misuse, or alteration. No website, transmission, or storage system can be guaranteed completely secure, so please use care when sending documents and keep your account and device secure.
        </p>
        <p>
          We retain information for as long as needed to provide services, maintain business and tax records, resolve disputes, prevent fraud, and meet legal obligations. Retention periods depend on the type of information and the service involved.
        </p>
        <p>
          When information is no longer required, we may securely delete it, anonymise it, or restrict access to it. We may keep a limited record of an opt-out or deletion request so that we can respect your choice and demonstrate compliance.
        </p>
      </PolicySection>

      <PolicySection id="children" number="09" title="Children, travellers, and travel documents">
        <p>
          Our website and booking services are intended to be used by adults or by minors under the supervision of a parent or legal guardian. We may process information about a child when it is supplied by an authorised adult for a family booking, ticket, visa, hotel, or other travel service.
        </p>
        <p>
          Passport, visa, identity, and other travel documents are used only for the service or compliance purpose for which they were requested. We may redact, restrict, return, or securely dispose of copies when they are no longer needed, subject to legal and supplier requirements.
        </p>
      </PolicySection>

      <PolicySection id="contact" number="10" title="Contact us about privacy">
        <p>
          If you have a privacy question, want to exercise a data right, or believe your information has been handled incorrectly, please contact Goimomi Holidays. We may ask for details to verify your identity and locate the relevant booking or enquiry.
        </p>
        <PolicyContact subject="Privacy request - Goimomi Holidays" />
        <p className="text-sm text-slate-500">
          Goimomi Holidays may update this policy when our services, technology, or legal obligations change. The latest version will always be posted on this page, with the updated date shown above. If you are unhappy with our response, you may also have the right to contact the relevant privacy or consumer authority in your location.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
};

export default PrivacyPolicy;
