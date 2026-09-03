import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  Gift,
  Handshake,
  MapPin,
  Plane,
  UsersRound,
} from "lucide-react";
import usePageSEO from "../../hooks/usePageSEO";

import dubaiImage from "../../assets/Chithirai/Journeys/dubai.png";

const highlights = [
  "One-to-one business matchmaking",
  "Business opportunities presentation",
  "Business awards",
  "2 days. Powerful impact.",
  "Venue to be finalised",
  "Registration fee: ₹29,000/-",
];

const itinerary = [
  {
    day: "DAY 1",
    date: "21 NOV | SATURDAY",
    city: "DUBAI",
    summary: "Introduce yourself, your business and your ambition while opening focused conversations with Tamil entrepreneurs.",
    activities: [
      { icon: <UsersRound />, title: "Self introduction", detail: "Share your business, strengths and what you are looking for" },
      { icon: <Handshake />, title: "1-2-1 conclave", detail: "One-to-one business matchmaking" },
      { icon: <Building2 />, title: "Business opportunities presentation", detail: "Discover new pathways for partnerships and collaboration" },
    ],
  },
  {
    day: "DAY 2",
    date: "22 NOV | SUNDAY",
    city: "DUBAI",
    summary: "Turn introductions into ideas, partnerships and a powerful shared celebration of business achievement.",
    activities: [
      { icon: <Building2 />, title: "Business presentations", detail: "Present your work, offer and opportunities" },
      { icon: <UsersRound />, title: "Group discussions", detail: "Exchange ideas with fellow entrepreneurs" },
      { icon: <Gift />, title: "Gift exchange", detail: "Celebrate the relationships built during the mission" },
      { icon: <Award />, title: "Business awards", detail: "Recognise achievement and entrepreneurial impact" },
    ],
  },
];

const feeIncludes = ["Meeting cost", "Food during the meetings"];
const feeExcludes = ["Air ticket", "Visa", "Hotel stay", "Anything not mentioned in inclusion"];

const DubaiJourney = () => {
  usePageSEO(
    "International Business Mission Dubai 2026 | Global Horizons",
    "Join the International Business Mission Dubai 2026 from 21 to 22 November for business matchmaking, presentations, group discussions and awards.",
    dubaiImage,
    "Global Horizons Dubai 2026, International Business Mission Dubai, Tamil entrepreneur networking, Dubai business matchmaking, business awards"
  );

  return (
    <div className="w-full overflow-hidden bg-[#f7fbf8] text-slate-800">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#08251b] text-white md:min-h-[700px]">
        <img src={dubaiImage} alt="Dubai skyline with Tamil business networking" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#061914_0%,rgba(6,25,20,.9)_34%,rgba(6,25,20,.2)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061914]/90 via-transparent to-transparent" />

        <div className="mx-auto flex min-h-[620px] max-w-7xl items-end px-6 py-16 md:min-h-[700px] md:px-10 md:py-20">
          <div className="max-w-4xl">
            <Link to="/chithirai-global" className="mb-9 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200 hover:gap-3">
              <ArrowLeft className="h-4 w-4" /> Back to Chithirai Global
            </Link>
            <div className="flex items-center gap-3 text-emerald-300">
              <span className="h-px w-10 bg-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.42em]">Where Tamil entrepreneurs meet the world</span>
            </div>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-0.055em] sm:text-6xl md:text-8xl">
              Global Horizons
              <span className="block text-emerald-300">Dubai 2026</span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl font-black uppercase tracking-tight text-white md:text-2xl">International Business Mission — Dubai</p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-100 md:text-lg">Two days of focused introductions, business opportunities, powerful discussions and meaningful connections.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-amber-950 shadow-lg">
              <CalendarDays className="h-4 w-4" /> 2 days. Powerful impact.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-900"><CalendarDays className="h-4 w-4" /> 21–22 November 2026</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white"><MapPin className="h-4 w-4" /> Venue to be finalised</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to="/chithirai-global?register=1&journey=International%20Business%20Mission%20Dubai" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wider text-[#062016] hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                Register interest <ArrowRight className="h-4 w-4" />
              </Link>
              <div>
                <p className="text-2xl font-black text-white">₹29,000/-</p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">Registration fee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-100 bg-white px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">The international business mission</span>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] text-slate-950 md:text-6xl">Where Tamil entrepreneurs meet the world.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">A focused Dubai mission created for introductions, business opportunities, presentations, discussions and recognition.</p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-[2rem] bg-[#08251b] p-8 text-white shadow-xl md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-300">Key highlights</p>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-emerald-50">One-to-one business matchmaking, business opportunities presentation and business awards — all designed to create a powerful impact in just two days.</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">Registration fee</p>
                <p className="mt-2 text-3xl font-black">₹29,000/-</p>
              </div>
            </div>
            <p className="mt-8 border-t border-white/10 pt-6 text-sm font-bold text-emerald-200">Venue to be finalised</p>
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-[#eaf5ed] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">The day-wise itinerary</span>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] text-slate-950 md:text-6xl">2 days. Powerful impact.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Every session is designed to move from introduction to opportunity, discussion and recognition.</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
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

      <section className="px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-[#08251b] p-8 text-white shadow-xl md:p-10">
            <div className="flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em]">Fee includes</span>
            </div>
            <div className="mt-7 space-y-4">
              {feeIncludes.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-emerald-50">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="flex items-center gap-3 text-slate-700">
              <Plane className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em]">Fee excludes</span>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {feeExcludes.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-400 px-6 py-20 text-[#062016] md:px-10 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.45em] text-emerald-950/70">Global Horizons Dubai 2026</span>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-0.055em] md:text-7xl">Powerful impact.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-950/75">Where Tamil entrepreneurs meet the world through introductions, opportunities and meaningful business connections.</p>
          </div>
          <Link to="/chithirai-global?register=1&journey=International%20Business%20Mission%20Dubai" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#062016] px-7 py-4 text-sm font-black uppercase tracking-wider text-white hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl">
            Register interest <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DubaiJourney;
