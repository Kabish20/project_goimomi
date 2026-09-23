import React from 'react';

export default function GlobalHorizonsDocuments({ profile }) {
  const ready = profile?.attending_poster && profile?.profile_booklet;
  return <div className="mt-6 overflow-hidden rounded-2xl border border-[#dedbcf] bg-[#f7f4eb] text-left">
    <div className="border-b border-[#dedbcf] px-5 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a702f]">Global Horizons · Sri Lanka 2026</p>
      <h3 className="mt-1 text-xl font-bold text-emerald-950">Your participant downloads</h3>
    </div>
    {ready ? <>
      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {profile.attending_poster_image ? <a href={profile.attending_poster_image} target="_blank" rel="noreferrer" className="block self-start overflow-hidden rounded-lg bg-white shadow-sm" aria-label="Open attending poster preview">
          <img src={profile.attending_poster_image} alt={`I'm attending poster for ${profile.full_name}`} className="aspect-[4/5] w-full object-contain" />
        </a> : <div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-[#123e29] p-6 text-center text-3xl font-bold text-white">I'M<br />ATTENDING.</div>}
        <div className="flex min-w-0 flex-col justify-center">
          <h4 className="text-lg font-bold text-[#123e29]">Let your network know.</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">Share your attending poster on Instagram or Facebook, and introduce yourself with your professional profile booklet.</p>
          {profile.attending_poster_image && <>
            <a href={profile.attending_poster_image} target="_blank" rel="noreferrer" download className="mt-4 rounded-lg bg-[#123e29] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-900">Download social poster (PNG)</a>
            <p className="mt-2 text-center text-xs text-slate-500">1080 × 1350 px · Portrait post</p>
          </>}
          <a href={profile.profile_booklet} target="_blank" rel="noreferrer" download className="mt-4 rounded-lg border border-[#123e29] bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-900">Download profile booklet (PDF)</a>
          <a href={profile.attending_poster} target="_blank" rel="noreferrer" download className="mt-3 text-center text-xs font-semibold text-emerald-900 underline underline-offset-4">Download attending poster (PDF)</a>
        </div>
      </div>
    </> : <p className="p-5 text-sm leading-6 text-slate-600">Your profile is saved, but the downloads are not available yet. Please contact the Global Horizons team to prepare them.</p>}
  </div>;
}
