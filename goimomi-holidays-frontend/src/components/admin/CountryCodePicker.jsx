import React, { useState, useEffect, useRef } from "react";
import { countries } from "../../utils/countriesData";

const CountryCodePicker = ({ value, onChange, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dial_code.includes(searchTerm)
    );

    const selectedCountry = countries.find(c => c.dial_code === value) || countries.find(c => c.dial_code === "+91");

    return (
        <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={wrapperRef}>
            <div
                className={`bg-white border border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-[#14532d] ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="text-xl">{selectedCountry?.emoji}</span>
                <span className="text-gray-700 font-medium">{value || "+91"}</span>
                <span className="text-gray-400 text-[10px] ml-1">▼</span>
            </div>

            {isOpen && (
                <div className="absolute z-[110] left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-blue-100 rounded-lg text-sm focus:outline-none focus:border-[#14532d] bg-gray-50"
                            placeholder="Search country or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <div
                                    key={`${country.code}-${country.dial_code}`}
                                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 flex items-center gap-3 transition-colors ${value === country.dial_code ? "bg-green-50 text-[#14532d]" : "text-gray-700"}`}
                                    onClick={() => {
                                        onChange(country.dial_code);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    <span className="text-2xl w-8 flex-shrink-0">{country.emoji}</span>
                                    <span className="flex-1 truncate font-medium">{country.name}</span>
                                    <span className="text-gray-400 font-mono text-xs">{country.dial_code}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-4 text-sm text-gray-500 text-center italic">No country matches</div>
                        )}
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f9fafb;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}} />
        </div>
    );
};

export default CountryCodePicker;
