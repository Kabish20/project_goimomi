import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Handshake,
  Lightbulb,
  MapPin,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import usePageSEO from "../../hooks/usePageSEO";

import pondicherryImage from "../../assets/Chithirai/Journeys/pondicherry-bleisure.png";

const highlights = [
  "3 days / 2 nights",
  "Scaling Up Frameworks",
  "Peer business conversations",
  "Pondicherry setting",
  "Regular fee: ₹4,900/-",
  "100% opportunity",
];

const itinerary = [
  {
    day: "DAY 1",
    date: "17 DEC | THURSDAY",
    city: "PONDICHERRY",
    summary: "Step back from the daily grind, reset your perspective and see your business with fresh eyes.",
    activities: [
      { icon: <MapPin />, title: "Arrive in Pondicherry and settle in", detail: "Ease into three focused days by the coast" },
      { icon: <Coffee />, title: "Welcome refreshments and introductions" },
      { icon: <Sparkles />, title: "ScaleX opening session", detail: "Rethink where your business is today" },
      { icon: <UsersRound />, title: "Peer conversations", detail: "Share experiences with fellow business owners" },
      { icon: <Handshake />, title: "Evening networking", detail: "Make space for meaningful new connections" },
    ],
  },
  {
    day: "DAY 2",
    date: "18 DEC | FRIDAY",
    city: "PONDICHERRY",
    summary: "Discover the frameworks that can help you move from running a business to scaling a business.",
    activities: [
      { icon: <Coffee />, title: "Morning reflection and coffee" },
      { icon: <Lightbulb />, title: "Scaling Up Frameworks workshop", detail: "Work through practical ideas for the next level" },
      { icon: <Target />, title: "Business clarity session", detail: "Identify priorities, bottlenecks and growth opportunities" },
      { icon: <UsersRound />, title: "Peer learning circle", detail: "Exchange honest lessons and useful perspectives" },
      { icon: <Handshake />, title: "Business networking and connection time" },
    ],
  },
  {
    day: "DAY 3",
    date: "19 DEC | SATURDAY",
    city: "PONDICHERRY",
    summary: "Turn the thinking into a clear direction, practical next steps and a commitment to scale.",
    activities: [
      { icon: <Sparkles />, title: "ScaleX action-planning session", detail: "Translate the frameworks into your business context" },
      { icon: <Target />, title: "Next-level growth roadmap", detail: "Define the actions that move your business forward" },
      { icon: <UsersRound />, title: "Commitment and accountability circle" },
      { icon: <BadgeCheck />, title: "Closing reflections", detail: "Leave with clarity, connections and momentum" },
      { icon: <MapPin />, title: "Departure from Pondicherry", detail: "Take the ScaleX thinking back to your business" },
    ],
  },
];

const PondicherryJourney = () => {
  usePageSEO(
    "ScaleX Pondicherry | Scaling Up Frameworks",
    "Join ScaleX in Pondicherry from 17 to 19 December 2026 for three days of business reflection, scaling frameworks, peer learning and meaningful connections.",
    pondicherryImage,
    "ScaleX Pondicherry, scaling up frameworks, business growth workshop, Pondicherry business retreat, Chithirai Global"
  );

  return (
    <div className="w-full overflow-hidden bg-[#f7fbf8] text-slate-800">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#08251b] text-white md:min-h-[700px]">
        <img src={pondicherryImage} alt="Pondicherry coast with business networking on a terrace" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#061914_0%,rgba(6,25,20,.9)_34%,rgba(6,25,20,.2)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061914]/90 via-transparent to-transparent" />

        <div className="mx-auto flex min-h-[620px] max-w-7xl items-end px-6 py-16 md:min-h-[700px] md:px-10 md:py-20">
          <div className="max-w-4xl">
            <Link to="/chithirai-global" className="mb-9 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200 hover:gap-3">
              <ArrowLeft className="h-4 w-4" /> Back to Chithirai Global
            </Link>
            <div className="flex items-center gap-3 text-emerald-300">
              <span className="h-px w-10 bg-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.42em]">Chithirai Global Journey</span>
            </div>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-0.055em] sm:text-6xl md:text-8xl">
              ScaleX
              <span className="block text-emerald-300">Scaling Up Frameworks</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-100 md:text-lg">
              Three days to step back from the daily grind, rethink your business, and discover the frameworks that can take you from running a business → scaling a business.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-amber-950 shadow-lg">
              <Sparkles className="h-4 w-4" /> Offer valid till Monday, 10th August 2026
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-900"><CalendarDays className="h-4 w-4" /> 17–19 December 2026</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white"><MapPin className="h-4 w-4" /> Pondicherry</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to="/chithirai-global?register=1&journey=ScaleX%20Pondicherry" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wider text-[#062016] hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                Register interest <ArrowRight className="h-4 w-4" />
              </Link>
              <div>
                <p className="text-2xl font-black text-white">₹4,900/-</p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">Regular fee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-100 bg-white px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {highlights.map((highlight) => (
            <div key={highlight} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> {highlight}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3 text-emerald-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">🔥✨ ScaleX</span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.045em] text-slate-950 md:text-6xl">Don’t just grow. Scale.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">If your business is ready for the next level, this is your time to ScaleX.</p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-[2rem] bg-[#08251b] p-8 text-white shadow-xl md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-300">100% Opportunity.</p>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-emerald-50">Three days to step back from the daily grind, rethink your business, and discover the frameworks that can take you from running a business → scaling a business.</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">Regular fee</p>
                <p className="mt-2 text-3xl font-black">₹4,900/-</p>
              </div>
            </div>
            <p className="mt-8 border-t border-white/10 pt-6 text-sm font-bold text-emerald-200">Offer valid till Monday, 10th August 2026</p>
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-[#eaf5ed] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">The day-wise itinerary</span>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] text-slate-950 md:text-6xl">Three days to rethink and scale.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Each day is designed to help you step away from the daily grind, work through practical frameworks and leave with a clearer path for your next level.</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {itinerary.map((day) => (
              <article key={day.day} className="overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-sm">
                <div className="bg-[#08251b] px-6 py-6 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.35em] text-emerald-300">{day.day}</p>
                      <p className="mt-2 text-xs font-bold tracking-wider text-white/80">{day.date}</p>
                    </div>
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-200">{day.city}</span>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-200">{day.summary}</p>
                </div>
                <div className="divide-y divide-slate-100 px-6">
                  {day.activities.map((activity) => (
                    <div key={`${day.day}-${activity.title}`} className="flex gap-3 py-4">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        {React.cloneElement(activity.icon, { className: "h-4 w-4" })}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-5 text-slate-800">{activity.title}</p>
                        {activity.detail && <p className="mt-1 text-xs leading-5 text-slate-500">{activity.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-400 px-6 py-20 text-[#062016] md:px-10 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.45em] text-emerald-950/70">Your next level starts here</span>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-0.055em] md:text-7xl">ScaleX in Pondicherry.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-950/75">ScaleX — Don’t just grow. Scale.</p>
          </div>
          <Link to="/chithirai-global?register=1&journey=ScaleX%20Pondicherry" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#062016] px-7 py-4 text-sm font-black uppercase tracking-wider text-white hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl">
            Register interest <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PondicherryJourney;
