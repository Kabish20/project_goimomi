import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", disabled = false, allowCustom = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownStyle, setDropdownStyle] = useState({});
    const wrapperRef = useRef(null);
    const dropdownRef = useRef(null);

    const updateDropdownPosition = useCallback(() => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 220;

        // Decide if it should open upward or downward
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        setDropdownStyle({
            position: "fixed",
            left: rect.left,
            width: rect.width,
            zIndex: 99999,
            ...(openUpward
                ? { bottom: viewportHeight - rect.top + 4, top: "auto" }
                : { top: rect.bottom + 4, bottom: "auto" }
            ),
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
        }
    }, [isOpen, updateDropdownPosition]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current && !wrapperRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        const handleScroll = () => {
            if (isOpen) updateDropdownPosition();
        };
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", updateDropdownPosition);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, [isOpen, updateDropdownPosition]);

    const filteredOptions = options.filter(option =>
        (option.label || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.subtitle || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(o => o.value === value);

    const dropdown = isOpen && !disabled ? (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-white border-2 border-gray-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] max-h-52 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
            <div className="p-1.5 border-b border-gray-100 bg-white">
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
                            onMouseDown={(e) => {
                                e.preventDefault();
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
                                onMouseDown={(e) => {
                                    e.preventDefault();
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
    ) : null;

    return (
        <div
            className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            ref={wrapperRef}
        >
            <div
                className={`bg-white border-2 ${isOpen ? 'border-[#14532d] ring-4 ring-[#14532d]/5' : 'border-gray-200 hover:border-gray-300'} px-3 py-1.5 rounded-xl w-full text-black cursor-pointer flex justify-between items-center transition-all ${disabled ? 'pointer-events-none' : ''}`}
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

            {typeof document !== "undefined" && createPortal(dropdown, document.body)}
        </div>
    );
};

export default SearchableSelect;
