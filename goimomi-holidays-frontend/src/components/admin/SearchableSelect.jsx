import React, { useState, useEffect, useRef } from "react";

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", disabled = false, allowCustom = false }) => {
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
        <div className={`relative w-full ${isOpen ? 'z-[100]' : 'z-auto'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={wrapperRef}>
            <div
                className={`bg-white border-2 border-gray-200 px-3 py-1.5 rounded-xl w-full text-black cursor-pointer flex justify-between items-center transition-all hover:border-gray-300 focus-within:border-[#14532d] focus-within:ring-4 focus-within:ring-[#14532d]/5 ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <span className="truncate flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900">{selectedOption.label}</span>
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
                <div className="absolute z-[9999] w-full mt-1.5 bg-white border-2 border-gray-300 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] max-h-48 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md">
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-[10px] font-bold text-gray-900 focus:outline-none focus:border-[#14532d] focus:bg-white transition-all placeholder:text-gray-300"
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
                                    className={`px-3 py-2 text-[12px] cursor-pointer transition-all flex flex-col gap-0 ${option.value === value ? "bg-green-50 text-[#14532d]" : "text-gray-900 hover:bg-gray-50 hover:text-black"}`}
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
                            <div className="p-2 bg-gray-50/50 space-y-2">
                                <div className="px-2 py-2 text-[10px] font-black text-gray-300 text-center uppercase tracking-widest">
                                    No matches found
                                </div>
                                {allowCustom && searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(searchTerm);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className="w-full py-2 bg-[#14532d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                    >
                                        Use "{searchTerm}"
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
