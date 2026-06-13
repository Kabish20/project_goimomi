import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

const SearchableSelect = ({ options = [], value, onChange, placeholder = "Select...", searchPlaceholder = "Search...", disabled = false, allowCustom = false, error, size = "default", className = "", uniqueByLabel = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(100);
    const [dropdownStyle, setDropdownStyle] = useState({});
    
    const wrapperRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const optionsRef = useRef([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
            setDisplayCount(100);
        }, 150);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { allOptionsFlat, processedOptions } = useMemo(() => {
        let flat = [];
        const seen = new Set();
        const processed = [];
        
        options.forEach(opt => {
            if (opt.options) {
                const uniqueSubOpts = [];
                opt.options.forEach(subOpt => {
                    const key = uniqueByLabel ? subOpt.label?.toLowerCase().trim() : subOpt.value;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueSubOpts.push(subOpt);
                    }
                });
                if (uniqueSubOpts.length > 0) {
                    const startIdx = flat.length;
                    const optionsWithIndices = uniqueSubOpts.map((subOpt, i) => {
                        const mapped = { ...subOpt, overallIndex: startIdx + i };
                        flat.push(mapped);
                        return mapped;
                    });
                    processed.push({ ...opt, options: optionsWithIndices });
                }
            } else {
                const key = uniqueByLabel ? opt.label?.toLowerCase().trim() : opt.value;
                if (!seen.has(key)) {
                    seen.add(key);
                    const mapped = { ...opt, overallIndex: flat.length };
                    flat.push(mapped);
                    processed.push(mapped);
                }
            }
        });
        return { allOptionsFlat: flat, processedOptions: processed };
    }, [options, uniqueByLabel]);

    const filteredOptions = useMemo(() => {
        const term = debouncedTerm.toLowerCase();
        if (!term) return allOptionsFlat;
        return allOptionsFlat.filter(option =>
            (option.label || "").toLowerCase().includes(term) ||
            (option.subtitle || "").toLowerCase().includes(term)
        );
    }, [allOptionsFlat, debouncedTerm]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 500) {
            setDisplayCount(prev => Math.min(prev + 150, (debouncedTerm ? filteredOptions : allOptionsFlat).length));
        }
    };

    useEffect(() => { setActiveIndex(-1); }, [searchTerm, isOpen]);

    const handleKeyDown = (e) => {
        if (!isOpen) { if (e.key === "Enter" || e.key === "ArrowDown") setIsOpen(true); return; }
        const currentList = debouncedTerm ? filteredOptions : allOptionsFlat;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => (prev < Math.min(displayCount, currentList.length) - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev === 0 ? -1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0) {
                onChange(currentList[activeIndex].value);
                setIsOpen(false);
                setSearchTerm("");
            } else if (allowCustom && searchTerm) {
                onChange(searchTerm);
                setIsOpen(false);
                setSearchTerm("");
            }
        } else if (e.key === "Escape") { setIsOpen(false); setSearchTerm(""); }
    };

    useEffect(() => {
        if (activeIndex >= 0 && optionsRef.current[activeIndex]) {
            optionsRef.current[activeIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, [activeIndex]);

    const updateDropdownPosition = useCallback(() => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const minDropdownHeight = 350;
        
        // Decide whether to open upward or downward based on available space
        const openUpward = spaceBelow < minDropdownHeight && spaceAbove > spaceBelow;
        
        // Calculate dynamic max height to prevent cutting off
        const availableSpace = openUpward ? spaceAbove - 20 : spaceBelow - 20;
        const maxHeight = Math.min(minDropdownHeight, availableSpace);

        setDropdownStyle({
            position: "fixed",
            left: rect.left,
            width: rect.width,
            zIndex: 999999,
            maxHeight: maxHeight,
            ...(openUpward ? { bottom: viewportHeight - rect.top + 4, top: "auto" } : { top: rect.bottom + 4, bottom: "auto" }),
        });
    }, []);

    useEffect(() => { if (isOpen) updateDropdownPosition(); }, [isOpen, updateDropdownPosition]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            const raf = requestAnimationFrame(() => { searchInputRef.current?.focus({ preventScroll: true }); });
            return () => cancelAnimationFrame(raf);
        }
    }, [isOpen]);

    useEffect(() => {
        const clickOut = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target) && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false); setSearchTerm("");
            }
        };
        const scrollGlob = () => { if (isOpen) updateDropdownPosition(); };
        document.addEventListener("mousedown", clickOut);
        window.addEventListener("scroll", scrollGlob, true);
        window.addEventListener("resize", updateDropdownPosition);
        return () => {
            document.removeEventListener("mousedown", clickOut);
            window.removeEventListener("scroll", scrollGlob, true);
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, [isOpen, updateDropdownPosition]);

    const renderedItems = useMemo(() => {
        const itemClass = (isMatch, idx, val, active) => `
            px-3 py-1.5 text-[10px] cursor-pointer transition-all flex flex-col gap-0
            ${val === value ? "bg-green-50 text-[#14532d]" : (idx === active ? "bg-gray-100 text-black border-l-4 border-[#14532d]" : "text-gray-900 hover:bg-gray-50 hover:text-black")}
        `;

        if (debouncedTerm) {
            return filteredOptions.slice(0, displayCount).map((option, index) => (
                <div key={option.value} ref={el => optionsRef.current[index] = el}
                    className={itemClass(true, index, option.value, activeIndex)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => { e.preventDefault(); onChange(option.value); setIsOpen(false); setSearchTerm(""); }}>
                    <div className="font-black tracking-tight leading-tight">{option.label}</div>
                    {option.subtitle && <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{option.subtitle}</div>}
                </div>
            ));
        }

        let renderedCount = 0;
        const items = [];
        for (const group of processedOptions) {
            if (renderedCount >= displayCount) break;
            if (group.options) {
                const groupOpts = [];
                for (const option of group.options) {
                    if (renderedCount >= displayCount) break;
                    groupOpts.push(
                        <div key={option.value} ref={el => optionsRef.current[option.overallIndex] = el}
                            className={itemClass(false, option.overallIndex, option.value, activeIndex)}
                            onMouseEnter={() => setActiveIndex(option.overallIndex)}
                            onMouseDown={(e) => { e.preventDefault(); onChange(option.value); setIsOpen(false); setSearchTerm(""); }}>
                            <div className="font-black tracking-tight pl-2 leading-tight">{option.label}</div>
                            {option.subtitle && <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest pl-2">{option.subtitle}</div>}
                        </div>
                    );
                    renderedCount++;
                }
                if (groupOpts.length > 0) {
                    items.push(<div key={group.label}><div className="px-3 py-1 bg-gray-50/50 text-[8px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 border-y border-gray-100/30 backdrop-blur-sm">{group.label}</div>{groupOpts}</div>);
                }
            } else {
                items.push(
                    <div key={group.value} ref={el => optionsRef.current[group.overallIndex] = el}
                        className={itemClass(false, group.overallIndex, group.value, activeIndex)}
                        onMouseEnter={() => setActiveIndex(group.overallIndex)}
                        onMouseDown={(e) => { e.preventDefault(); onChange(group.value); setIsOpen(false); setSearchTerm(""); }}>
                        <div className="font-black tracking-tight leading-tight">{group.label}</div>
                        {group.subtitle && <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{group.subtitle}</div>}
                    </div>
                );
                renderedCount++;
            }
        }
        return items;
    }, [debouncedTerm, filteredOptions, processedOptions, displayCount, value, activeIndex, onChange]);

    const selectedOption = allOptionsFlat.find(opt => opt.value === value);

    const dropdown = isOpen && !disabled ? (
        <div ref={dropdownRef} style={dropdownStyle} className="bg-white border-2 border-gray-100 rounded-xl shadow-[0_30px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 z-[100] bg-white border-b border-gray-100 p-1.5 shadow-sm">
                <div className="relative group">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within:text-[#14532d] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        className="w-full bg-gray-50/50 border-2 border-transparent focus:border-green-50 focus:bg-white rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] font-black text-gray-900 placeholder:text-gray-300 placeholder:italic transition-all outline-none" 
                        placeholder={searchPlaceholder} 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        onKeyDown={handleKeyDown} 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            </div>
            <div ref={scrollContainerRef} onScroll={handleScroll} className="overflow-y-auto flex-1 custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                {renderedItems}
                {(debouncedTerm ? filteredOptions : allOptionsFlat).length > displayCount && (
                    <div className="px-3 py-3 text-center">
                        <div className="text-[8px] font-black text-gray-300 animate-pulse uppercase tracking-[0.2em]">Scrolling for more...</div>
                    </div>
                )}
                {filteredOptions.length === 0 && debouncedTerm && (
                    <div className="py-6 text-center bg-gray-50/30"><div className="text-gray-400 font-black text-[9px] uppercase tracking-widest leading-none">No cities found</div></div>
                )}
            </div>
        </div>
    ) : null;

    const isCompact = size === "compact";
    return (
        <div className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={wrapperRef}>
            <div className={`bg-white border-2 ${error ? 'border-red-200 ring-4 ring-red-50' : isOpen ? 'border-[#14532d] ring-4 ring-[#14532d]/5' : 'border-gray-200 hover:border-gray-300'} ${isCompact ? 'px-2 py-0.5 rounded-lg' : 'px-3 py-1 rounded-xl'} w-full text-black cursor-pointer flex justify-between items-center transition-all ${disabled ? 'pointer-events-none' : ''} ${className}`} onClick={() => !disabled && setIsOpen(!isOpen)}>
                {selectedOption ? (<span className="truncate flex items-center gap-2"><span className="text-xs font-black text-gray-900 leading-tight">{selectedOption.label}</span>{selectedOption.subtitle && (<span className={`${isCompact ? 'text-[7px]' : 'text-[8px]'} px-1 py-0 text-[#14532d] font-black bg-green-50 rounded-md uppercase tracking-tighter`}>{selectedOption.subtitle}</span>)}</span>) : (<span className="truncate text-gray-400 text-xs font-medium">{placeholder}</span>)}
                
                <div className="flex items-center gap-2">
                    {selectedOption && !disabled && (
                        <button 
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors group/clear"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                        >
                            <svg className="w-3 h-3 text-gray-300 group-hover/clear:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <span className={`text-gray-300 ${isCompact ? 'text-[8px]' : 'text-[10px]'} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>
            </div>
            {error && (<p className="text-red-500 text-[7px] font-black mt-1 uppercase tracking-widest pl-1">{error}</p>)}
            {isOpen && !disabled && dropdown && typeof document !== "undefined" && createPortal(dropdown, document.body)}
        </div>
    );
};

export default SearchableSelect;


