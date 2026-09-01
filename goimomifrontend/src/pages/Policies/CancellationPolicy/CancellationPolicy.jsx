import React from "react";
import { AlertCircle, CalendarClock, RefreshCcw } from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import PolicyPageLayout, { PolicyCallout, PolicyContact, PolicyList, PolicySection } from "../PolicyPageLayout";

const navigation = [
  { id: "before-you-cancel", label: "Before you cancel" },
  { id: "how-to-request", label: "How to request" },
  { id: "cancellation-timing", label: "Effective timing" },
  { id: "service-rules", label: "Service-specific rules" },
  { id: "special-cases", label: "Special situations" },
  { id: "amendments", label: "Changes and amendments" },
  { id: "refunds", label: "Refunds and credits" },
  { id: "disruptions", label: "Disruptions and force majeure" },
  { id: "contact", label: "Contact us" },
];

const CancellationPolicy = () => {
  usePageSEO(
    "Cancellation Policy | Goimomi Holidays",
    "Understand how Goimomi Holidays handles travel cancellations, amendments, supplier charges, refunds, credits, and booking disruptions.",
    undefined,
    "Goimomi Holidays cancellation policy, travel refunds, booking changes, holiday cancellation, flight cancellation"
  );

  return (
    <PolicyPageLayout
      icon={RefreshCcw}
      title="Cancellation Policy"
      summary="Plans can change. This policy explains the steps, timelines, supplier charges, and refund process that generally apply when you need to cancel or amend a booking."
      navigation={navigation}
    >
      <PolicyCallout title="The booking-specific rule always comes first" tone="gold">
        Cancellation charges depend on the service, supplier, fare or rate type, travel date, and time we receive your written request. Your confirmation, invoice, ticket, or supplier terms may be stricter or more specific than this general policy.
      </PolicyCallout>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <CalendarClock className="mb-3 text-[#14532d]" size={21} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Request early</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-900">Supplier penalties usually increase closer to departure.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <AlertCircle className="mb-3 text-[#14532d]" size={21} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">No-shows</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-900">Missing a service without notice may result in no refund.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <RefreshCcw className="mb-3 text-[#14532d]" size={21} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Refund route</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-900">Approved refunds return through the original payment method.</p>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <PolicySection id="before-you-cancel" number="01" title="Before you cancel">
          <p>
            Please check your confirmation and contact our travel desk as soon as you know that plans have changed. A cancellation is not complete until we acknowledge the request in writing. Continuing to hold a booking while considering cancellation may allow supplier charges to increase.
          </p>
          <PolicyList items={[
            "Cancellation charges may include supplier penalties, non-refundable fares or deposits, taxes, visa or authority fees, payment processing charges, and Goimomi service fees disclosed for the booking.",
            "The person who made the booking is responsible for ensuring that every traveller affected by the cancellation is informed.",
            "If only part of a booking is cancelled, the remaining services may be repriced and may no longer be eligible for the original package or group rate.",
            "A cancellation request does not automatically cancel connected flights, hotels, transfers, visas, cruises, insurance, or other components unless we confirm each component has been cancelled.",
          ]} />
        </PolicySection>

        <PolicySection id="how-to-request" number="02" title="How to submit a cancellation request">
          <p>Send your request in writing by email or through the support channel used for your booking. Include:</p>
          <PolicyList items={[
            "Booking or invoice reference number.",
            "Lead traveller name and contact number.",
            "The exact service or traveller(s) to be cancelled.",
            "The reason for cancellation, if you wish to share it, and any supporting documents requested for a supplier or insurer.",
          ]} />
          <p>
            We will review the request, check the applicable supplier terms, and confirm the estimated charges or refund before processing where reasonably possible. Requests received outside business hours, on a public holiday, or after a supplier deadline may be treated as received on the next working day.
          </p>
          <PolicyContact subject="Cancellation request - Goimomi Holidays" />
        </PolicySection>

        <PolicySection id="cancellation-timing" number="03" title="When a cancellation takes effect">
          <p>
            The effective time of a cancellation is the time our team or the relevant supplier receives a complete written request, subject to the supplier's operating hours and local time. A message sent to an individual travel consultant, social-media account, or third-party supplier may not be treated as received by Goimomi Holidays until it reaches the correct support channel.
          </p>
          <PolicyList items={[
            "Supplier cut-off times are normally based on the local time of the airline, property, operator, port, authority, or other supplier.",
            "A request made close to departure, check-in, pickup, sailing, appointment, or an amendment deadline may be processed under the stricter late-cancellation or no-show rule.",
            "If a supplier requires a cancellation directly, we will tell you where possible. You should keep the supplier cancellation number and send it to us for the booking record.",
            "Where a booking has several components, each component may have a different cancellation deadline and charge.",
          ]} />
          <PolicyCallout title="Written acknowledgement matters">
            Please do not assume that a cancellation is complete because you have sent a message. Wait for our written acknowledgement and confirmation of the applicable charges or next steps.
          </PolicyCallout>
        </PolicySection>

        <PolicySection id="service-rules" number="04" title="Service-specific cancellation rules">
          <p>Different travel products have different rules. The following principles generally apply:</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] border-b border-slate-200 bg-[#f0fdf4] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#14532d]">
              <span>Service</span>
              <span>What generally applies</span>
            </div>
            <div className="divide-y divide-slate-200 text-sm leading-7 text-slate-600">
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Flights</strong><span>Airline fare rules control. Promotional, basic, partially used, or no-show tickets may be non-refundable. Airport taxes or refundable components are returned only when the airline permits it.</span></div>
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Hotels</strong><span>Rates may be flexible, partially refundable, or non-refundable. The property or wholesaler deadline and local time apply.</span></div>
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Tours and packages</strong><span>Deposits, accommodation, transport, permits, activities, and tickets may have separate penalties. The package confirmation will show the applicable terms where available.</span></div>
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Cruises</strong><span>Cruise-line schedules commonly have staged penalties and may become fully non-refundable near departure. The cruise line’s terms control.</span></div>
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Cabs and transfers</strong><span>Supplier waiting-time, late-arrival, no-show, and close-to-travel rules may apply. Bookings cancelled inside the supplier’s stated penalty window may be non-refundable.</span></div>
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Visa assistance</strong><span>Authority fees, application charges, appointments, courier fees, and service charges may be non-refundable once processing or submission has started. Approval is never guaranteed.</span></div>
              <div className="grid grid-cols-[minmax(110px,0.7fr)_minmax(0,1.3fr)] gap-3 px-4 py-4"><strong className="text-slate-900">Shop products</strong><span>Product dispatch, delivery, return, and damage rules shown for the product or at checkout apply separately to physical goods.</span></div>
            </div>
          </div>
        </PolicySection>

        <PolicySection id="special-cases" number="05" title="Special situations">
          <p>
            We will review exceptional circumstances fairly and help present supporting documents to the supplier, but a special circumstance does not automatically override the fare, rate, ticket, or package conditions.
          </p>
          <PolicyList items={[
            "Visa refusal or delayed visa processing does not by itself cancel a flight, hotel, cruise, or package without the applicable supplier charge. Do not book a non-refundable service before confirming that the terms suit your visa timeline.",
            "Illness, injury, bereavement, pregnancy, job changes, or other personal circumstances may be considered by an insurer or supplier. Evidence may be required and approval is not guaranteed.",
            "If a supplier cancels or materially changes a service, we will explain the options made available by that supplier. Refunds and rebooking remain subject to supplier terms and applicable law.",
            "Travel insurance cancellation claims must be made directly under the insurer's claim process. We can provide available booking documents but do not decide insurance claims.",
          ]} />
        </PolicySection>

        <PolicySection id="amendments" number="06" title="Changes, rebooking, and no-shows">
          <p>
            We will try to help with date changes, name corrections, route changes, room changes, or other amendments, but acceptance depends on the supplier. Any difference in fare or rate, amendment fee, reissue fee, and applicable Goimomi service fee must be paid before the change is confirmed.
          </p>
          <PolicyList items={[
            "Name changes can be restricted or prohibited, especially for airline tickets, cruises, visas, and tickets issued in a traveller’s name.",
            "A missed departure, late arrival, failure to check in, or unused service may be treated as a no-show and may cancel the remaining itinerary without refund.",
            "Once travel has started, unused nights, sectors, transfers, activities, or package components are generally non-refundable unless the supplier approves otherwise.",
          ]} />
        </PolicySection>

        <PolicySection id="refunds" number="07" title="Refunds, credits, and processing times">
          <p>
            Once a cancellation is approved, we will request the refund from the relevant supplier. Refunds are processed after the supplier or payment partner releases the funds and are normally returned to the original payment method. Banks, card issuers, and international payment networks may take additional time to display the credit.
          </p>
          <PolicyList items={[
            "As a general guide, an approved refund may take approximately 3-7 business days after processing, but the full supplier and banking timeline can be longer.",
            "Refunds are reduced by applicable supplier penalties, non-refundable components, taxes or authority fees, payment processing charges, currency conversion differences, and disclosed service fees.",
            "Where a supplier offers a travel credit instead of cash, the credit will be subject to the supplier’s validity, passenger, route, and booking conditions.",
            "If you believe a refund is overdue, contact us with the booking reference and any refund advice already received so we can investigate with the supplier or payment partner.",
          ]} />
          <p>
            Unless the booking documents state otherwise, the estimated refund is calculated as: amount paid, less supplier cancellation or amendment charges, non-refundable components, taxes or authority fees, payment costs, currency losses, and any disclosed Goimomi service fees. A refund may be zero when the deductions equal or exceed the amount paid.
          </p>
          <p>
            Please do not initiate a payment reversal or chargeback while a refund is being investigated without first contacting us. A duplicate recovery may delay the resolution and may be referred to the relevant payment provider for review.
          </p>
          <PolicyCallout title="Keep your confirmation" tone="gold">
            Refund calculations are based on the booking record and the rules in effect for the ticket, rate, or package purchased. Please keep your invoice, cancellation acknowledgement, and refund advice until the payment appears.
          </PolicyCallout>
        </PolicySection>

        <PolicySection id="disruptions" number="08" title="Supplier disruptions and force majeure">
          <p>
            Weather events, natural disasters, public-health emergencies, strikes, war, civil unrest, government restrictions, airport or border closures, technical failures, and other events outside reasonable control may interrupt travel. In these situations, available changes, credits, or refunds are usually determined by the affected supplier or authority.
          </p>
          <p>
            We will pass on relevant supplier options and assist with available requests, but we cannot promise a refund or compensation that the supplier does not provide. Travel insurance may cover certain losses depending on the policy and circumstances.
          </p>
          <p>
            If you choose not to travel because of a general concern, government advisory, personal preference, or an event that does not trigger a supplier waiver, normal cancellation charges may still apply. We recommend checking your travel insurance and the latest supplier notice before cancelling.
          </p>
        </PolicySection>

        <PolicySection id="contact" number="09" title="Questions, complaints, or help with a cancellation">
          <p>
            We understand that cancelling travel can be stressful. Contact us as early as possible and our team will explain the applicable rule, coordinate with the supplier, and keep you informed of the outcome.
          </p>
          <PolicyContact subject="Cancellation support - Goimomi Holidays" />
          <p>
            If you are unhappy with a cancellation decision or refund calculation, tell us what you believe is incorrect and include the booking reference, payment receipt, and any supplier communication. We will review the record and respond with the basis for the decision or the next available step.
          </p>
          <p className="text-sm text-slate-500">
            This general policy is effective from 1 September 2026 and may be updated as supplier practices or applicable requirements change. Your booking confirmation remains the best source for the exact charge and refund terms for your reservation.
          </p>
        </PolicySection>
      </div>
    </PolicyPageLayout>
  );
};

export default CancellationPolicy;
