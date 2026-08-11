import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import usePageSEO from "../../../hooks/usePageSEO";
import api from "../../../api";

const PaymentCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const bookingId = searchParams.get("id");
  const bookingReference = searchParams.get("booking_id");
  const hasValidBookingId = Boolean(bookingId && /^\d+$/.test(bookingId));

  usePageSEO(
    "Secure Payment Gateway - Goimomi Holidays",
    "Continue to Zoho's hosted checkout to complete your Goimomi Holidays booking payment."
  );

  const launchHostedCheckout = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!hasValidBookingId) {
      setErrorMessage("This checkout link is missing a valid booking ID.");
      return;
    }

    setIsLaunching(true);

    try {
      const response = await api.post(
        `/api/cab-bookings/${bookingId}/create-zoho-payment-session/`
      );
      const redirectUrl = response.data?.redirect_url;

      if (!redirectUrl) {
        throw new Error("Zoho Payments did not return a checkout link.");
      }

      window.location.assign(redirectUrl);
    } catch (error) {
      console.error("Unable to start Zoho hosted checkout:", error);
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "Unable to start secure checkout. Please try again."
      );
      setIsLaunching(false);
    }
  };

  return (
    <main className="mt-16 flex min-h-screen items-center bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-5">
        <div className="border-b border-slate-200 p-6 sm:p-10 md:col-span-3 md:border-b-0 md:border-r">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
              <LockKeyhole className="h-3.5 w-3.5" /> Hosted checkout
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              Continue to secure payment
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Payment details are collected only on Zoho&apos;s hosted checkout page. Your booking total and available payment methods are confirmed there.
            </p>
          </div>

          {errorMessage && (
            <div
              className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {!hasValidBookingId && !errorMessage && (
            <div
              className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>This checkout link is incomplete. Return to your booking and start payment again.</p>
            </div>
          )}

          <form onSubmit={launchHostedCheckout}>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!hasValidBookingId || isLaunching}
              type="submit"
            >
              {isLaunching ? "Opening secure checkout..." : "Open Zoho secure checkout"}
              {isLaunching ? (
                <ShieldCheck className="h-4 w-4 animate-pulse" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
            </button>
          </form>

          <button
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-800"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" /> Return to booking
          </button>
        </div>

        <aside className="bg-slate-100 p-6 sm:p-10 md:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Booking payment</h2>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booking reference</p>
            <p className="mt-2 break-all font-mono text-sm font-bold text-slate-800">
              {bookingReference || (hasValidBookingId ? `Booking #${bookingId}` : "Unavailable")}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm leading-6 text-slate-600">
              The final total is verified by the booking service before Zoho checkout opens.
            </p>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
            Goimomi Holidays uses Zoho hosted checkout for payment processing.
          </div>
        </aside>
      </section>
    </main>
  );
};

export default PaymentCheckout;
