import React, { useState, useEffect, useRef } from "react";
import { countries } from "../../utils/countriesData";

const CountryCodePicker = ({ value, onChange, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);
    const optionsRef = useRef([]);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dial_code.includes(searchTerm)
    );

    const activeCountry = activeIndex >= 0 ? filteredCountries[activeIndex] : null;

    useEffect(() => {
        setActiveIndex(-1);
    }, [searchTerm, isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => (prev < filteredCountries.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev === 0 ? -1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeCountry) {
                onChange(activeCountry.dial_code);
                setIsOpen(false);
                setSearchTerm("");
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setSearchTerm("");
        }
    };

    useEffect(() => {
        if (activeIndex >= 0 && optionsRef.current[activeIndex]) {
            optionsRef.current[activeIndex].scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        }
    }, [activeIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedCountry = countries.find(c => c.dial_code === value) || countries.find(c => c.dial_code === "+91");

    return (
        <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={wrapperRef}>
            <div
                className={`bg-gray-50/50 border border-gray-100 px-2 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-white transition-all ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="text-sm">{selectedCountry?.emoji}</span>
                <span className="text-gray-800 font-bold text-[11px] truncate">{value || "+91"}</span>
                <span className="text-gray-300 text-[8px] ml-auto">▼</span>
            </div>

            {isOpen && (
                <div className="absolute z-[110] left-0 mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="p-1.5 border-b border-gray-50 bg-white">
                        <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-100 rounded-md text-[10px] font-bold focus:outline-none focus:border-green-500/50 bg-gray-50/50"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country, index) => (
                                <div
                                    key={`${country.code}-${country.dial_code}`}
                                    ref={el => optionsRef.current[index] = el}
                                    className={`px-2.5 py-1.5 text-[10px] cursor-pointer flex items-center gap-2 transition-colors 
                                      ${value === country.dial_code ? "bg-green-50 text-green-700 font-bold" : (index === activeIndex ? "bg-gray-50 text-black border-l-2 border-green-500" : "text-gray-600 hover:bg-gray-50")}
                                    `}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => {
                                        onChange(country.dial_code);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    <span className="text-sm w-4 flex-shrink-0">{country.emoji}</span>
                                    <span className="flex-1 truncate uppercase tracking-tight">{country.name}</span>
                                    <span className="text-gray-400 font-mono text-[9px]">{country.dial_code}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-2 py-3 text-[9px] text-gray-400 text-center italic">No results</div>
                        )}
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
            `}} />
        </div>
    );
};

export default CountryCodePicker;
