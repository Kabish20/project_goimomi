import React from "react";

const CountryVisaCard = ({ country, onSelect }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(country.name)}
      className="group relative w-full aspect-[9/14] rounded-[26px] overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-end border border-white/15 bg-slate-900"
    >
      {/* Background Image */}
      <img
        src={country.image}
        alt={country.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop";
        }}
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 via-45% to-black/95 transition-opacity duration-300" />

      {/* Card Content (Centered Bottom) */}
      <div className="relative z-10 p-5 flex flex-col items-center text-center">
        {/* Flag Badge */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/40 shadow-md flex items-center justify-center bg-black/50 backdrop-blur-md mb-2 text-white">
          {country.flagUrl ? (
            <img src={country.flagUrl} alt={country.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-black leading-none uppercase">{country.flag}</span>
          )}
        </div>

        {/* Country Name (Serif typography) */}
        <h3
          className="text-white text-base md:text-lg font-extrabold uppercase tracking-widest leading-snug drop-shadow-md pb-1"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
        >
          {country.name}
        </h3>
      </div>
    </div>
  );
};

export default CountryVisaCard;
