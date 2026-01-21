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
        (option.label || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={wrapperRef}>
            <div
                className={`bg-white border border-gray-300 px-3 py-2 rounded w-full text-black cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-[#14532d] ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <span className="text-gray-400 text-xs ml-2 flex-shrink-0">▼</span>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#14532d]"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${option.value === value ? "bg-green-50 text-[#14532d]" : "text-black"}`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
