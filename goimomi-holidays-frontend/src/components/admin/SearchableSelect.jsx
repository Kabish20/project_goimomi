import React, { useState, useEffect, useRef } from "react";

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", disabled = false }) => {
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

    const filteredOptions = options.filter(option =>
        (option.label || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.subtitle || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={wrapperRef}>
            <div
                className={`bg-white border-2 border-gray-100 px-4 py-2 rounded-xl w-full text-black cursor-pointer flex justify-between items-center transition-all hover:border-gray-200 focus-within:border-[#14532d] focus-within:ring-4 focus-within:ring-[#14532d]/5 ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <span className="truncate flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{selectedOption.label}</span>
                        {selectedOption.subtitle && (
                            <span className="text-[9px] text-[#14532d] font-black bg-green-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                {selectedOption.subtitle}
                            </span>
                        )}
                    </span>
                ) : (
                    <span className="truncate text-gray-400 text-xs font-medium">{placeholder}</span>
                )}
                <span className={`text-gray-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-[100] w-full mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-green-900/10 max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md">
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:bg-white transition-all placeholder:text-gray-300"
                            placeholder="Type to filter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`px-4 py-2 text-xs cursor-pointer transition-all flex flex-col gap-0.5 ${option.value === value ? "bg-green-50 text-[#14532d]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    <div className="font-black tracking-tight">{option.label}</div>
                                    {option.subtitle && (
                                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                            {option.subtitle}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-4 text-[10px] font-black text-gray-300 text-center uppercase tracking-widest bg-gray-50/50">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
