import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Handshake,
  Hotel,
  MapPin,
  Mountain,
  Sparkles,
  UsersRound,
  BadgeCheck,
} from "lucide-react";
import usePageSEO from "../../hooks/usePageSEO";

import yelagiriImage from "../../assets/Chithirai/Journeys/yelagiri-hero.png";

const snapshot = [
  {
    icon: <CalendarDays className="h-5 w-5" />,
    label: "Dates",
    value: "18-20 September 2026",
    detail: "Three-day community journey",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Venue",
    value: "AGS Holiday Resorts",
    detail: "Yelagiri Hills, Tamil Nadu",
  },
  {
    icon: <span className="text-lg font-black">₹</span>,
    label: "Participation",
    value: "₹4500/-",
    detail: "Stay extra",
  },
];

const experiences = [
  {
    icon: <UsersRound className="h-5 w-5" />,
    title: "Community connections",
    description: "Spend time with Tamil entrepreneurs, professionals and business leaders in a relaxed setting.",
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    title: "Meaningful conversations",
    description: "Create space for new introductions, shared ideas and relationships that continue beyond the retreat.",
  },
  {
    icon: <Mountain className="h-5 w-5" />,
    title: "A refreshing setting",
    description: "Enjoy the calm of Yelagiri Hills while stepping away from the everyday pace of business.",
  },
];

const YelagiriJourney = () => {
  usePageSEO(
    "Yelagiri Business Retreat | Chithirai Global",
    "Join the Chithirai Global Yelagiri community journey from 18 to 20 September at AGS Holiday Resorts. Participation is ₹4500/- and stay is extra.",
    yelagiriImage,
    "Chithirai Global Yelagiri journey, AGS Holiday Resorts, Tamil entrepreneur networking, Yelagiri business retreat"
  );

  return (
    <div className="w-full overflow-hidden bg-[#f7fbf8] text-slate-800">
      <section className="relative isolate min-h-[600px] overflow-hidden bg-[#08251b] text-white md:min-h-[680px]">
        <img src={yelagiriImage} alt="Misty green hills and resort landscape in Yelagiri" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#061914_0%,rgba(6,25,20,.9)_34%,rgba(6,25,20,.2)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061914]/90 via-transparent to-transparent" />

        <div className="mx-auto flex min-h-[600px] max-w-7xl items-end px-6 py-16 md:min-h-[680px] md:px-10 md:py-20">
          <div className="max-w-3xl">
            <Link to="/chithirai-global" className="mb-9 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200 hover:gap-3">
              <ArrowLeft className="h-4 w-4" /> Back to Chithirai Global
            </Link>
            <div className="flex items-center gap-3 text-emerald-300">
              <span className="h-px w-10 bg-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.42em]">Chithirai Global Journey</span>
            </div>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[.9] tracking-[-0.055em] sm:text-6xl md:text-8xl">
              Yelagiri
              <span className="block text-emerald-300">18-20 September</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-100 md:text-lg">A refreshing hill retreat for stronger business relationships, thoughtful conversations and new community connections.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-emerald-900"><CalendarDays className="h-4 w-4" /> 18-20 September 2026</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white"><MapPin className="h-4 w-4" /> AGS Holiday Resorts</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link to="/chithirai-global?register=1&journey=Yelagiri" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-4 text-sm font-black uppercase tracking-wider text-[#062016] hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                Register interest <ArrowRight className="h-4 w-4" />
              </Link>
              <div>
                <p className="text-2xl font-black text-white">₹4500/-</p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">Stay extra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-100 bg-white px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
          {snapshot.map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-900">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">{item.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700">{item.label}</p>
                <p className="mt-1 text-sm font-black">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3 text-emerald-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Yelagiri experience</span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.045em] text-slate-950 md:text-6xl">Take a little time to connect better.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">Yelagiri gives the Chithirai Global community a quieter setting to meet, exchange ideas and build relationships with room to breathe.</p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {experiences.map((experience) => (
              <article key={experience.title} className="rounded-[1.75rem] border border-emerald-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{experience.icon}</div>
                <h3 className="mt-7 text-xl font-black uppercase tracking-tight text-slate-950">{experience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{experience.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">Journey snapshot</span>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] text-slate-950 md:text-6xl">Everything clear before you travel.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">Here are the confirmed details shared for the Yelagiri community journey. Register your interest and the team will follow up with availability and final travel information.</p>
          </div>

          <div className="rounded-[2rem] bg-[#08251b] p-7 text-white shadow-xl md:p-9">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-[#062016]"><CalendarDays className="h-5 w-5" /></div>
                <div><p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">When</p><p className="mt-2 text-lg font-black">18-20 September 2026</p></div>
              </div>
              <div className="flex gap-4 border-t border-white/10 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-[#062016]"><Hotel className="h-5 w-5" /></div>
                <div><p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Where</p><p className="mt-2 text-lg font-black">AGS Holiday Resorts, Yelagiri</p></div>
              </div>
              <div className="flex gap-4 border-t border-white/10 pt-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-lg font-black text-[#062016]">₹</div>
                <div><p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Participation</p><p className="mt-2 text-lg font-black">₹4500/- <span className="text-sm font-bold text-emerald-200">(stay extra)</span></p></div>
              </div>
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-emerald-50">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <p>The listed amount is ₹4500/- and stay is extra. Our team will share the final inclusions after you register.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-400 px-6 py-20 text-[#062016] md:px-10 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.45em] text-emerald-950/70">Save your place</span>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[.9] tracking-[-0.055em] md:text-7xl">See you in Yelagiri.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-950/75">Tell us you are interested and the Chithirai Global team will share the next steps for the 18-20 September journey.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YelagiriJourney;
