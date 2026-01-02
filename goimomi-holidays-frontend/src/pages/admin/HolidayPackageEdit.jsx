import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

/* ---------- UI helpers (same as Add) ---------- */
const Section = ({ title, children, className = "bg-white border border-gray-300 p-4" }) => (
    <div className="mb-6">
        <div className="bg-[#14532d] text-white px-4 py-2 font-semibold text-sm uppercase">
            {title}
        </div>
        <div className={className}>{children}</div>
    </div>
);

const Input = (props) => (
    <input
        {...props}
        className={`bg-white border border-gray-300 px-3 py-2 rounded w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent ${props.className || ''}`}
    />
);

const SearchableSelect = ({ options, value, onChange, placeholder = "Select..." }) => {
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
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                className="bg-white border border-gray-300 px-3 py-2 rounded w-full text-gray-800 cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-[#14532d]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className="text-gray-400 text-xs">▼</span>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-hidden flex flex-col">
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
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${option.value === value ? "bg-green-50 text-[#14532d]" : "text-gray-800"}`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
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

const HolidayPackageEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [packageDestinations, setPackageDestinations] = useState([]);
    const [itineraryDays, setItineraryDays] = useState([]);
    const [inclusions, setInclusions] = useState([]);
    const [exclusions, setExclusions] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        starting_city: "",
        days: "",
        start_date: "",
        group_size: 0,
        offer_price: "",
        price: "",
        header_image: null,
        card_image: null,
    });

    // Previews for existing images to show if no new file selected
    const [headerPreview, setHeaderPreview] = useState(null);
    const [cardPreview, setCardPreview] = useState(null);

    const [startingCities, setStartingCities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [itineraryMasters, setItineraryMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const API_BASE_URL = "/api";

    // Compute grouped starting cities
    const groupedStartingCities = useMemo(() => {
        const groups = startingCities.reduce((acc, city) => {
            const region = (city.region || "Other").toString().trim() || "Other";
            const key = region.toUpperCase();
            if (!acc[key]) acc[key] = [];
            acc[key].push(city);
            return acc;
        }, {});

        Object.keys(groups).forEach((key) => {
            groups[key].sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
        });

        const ordered = {};
        Object.keys(groups)
            .sort((a, b) => a.localeCompare(b))
            .forEach((key) => {
                ordered[key] = groups[key];
            });

        return ordered;
    }, [startingCities]);


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch dependencies in parallel
                const [citiesRes, destRes, mastersRes, pkgRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/starting-cities/`),
                    axios.get(`${API_BASE_URL}/destinations/`),
                    axios.get(`${API_BASE_URL}/itinerary-masters/`),
                    axios.get(`${API_BASE_URL}/packages/${id}/`),
                ]);

                setStartingCities(citiesRes.data);
                setDestinations(destRes.data);
                setItineraryMasters(mastersRes.data);

                // Populate Form Data
                const pkg = pkgRes.data;
                setFormData({
                    title: pkg.title || "",
                    description: pkg.description || "",
                    category: pkg.category || "",
                    starting_city: pkg.starting_city || "",
                    days: pkg.days || "",
                    start_date: pkg.start_date || "",
                    group_size: pkg.group_size || 0,
                    offer_price: pkg.Offer_price || "", // Note capitalization in model
                    price: pkg.price || "",
                    header_image: null, // Keep null unless changing
                    card_image: null,
                });

                // Set Previews
                setHeaderPreview(pkg.header_image);
                setCardPreview(pkg.card_image);

                // Populate Nested Data
                // Destinations
                if (pkg.destinations && Array.isArray(pkg.destinations)) {
                    setPackageDestinations(pkg.destinations.map(d => ({
                        destination: d.name, // Serializer returns name in 'name' field
                        nights: d.nights
                    })));
                }

                // Itinerary
                if (pkg.itinerary && Array.isArray(pkg.itinerary)) {
                    setItineraryDays(pkg.itinerary.map(day => ({
                        day: day.day_number,
                        title: day.title,
                        description: day.description,
                        master_template: day.master_template || "",
                        image: null, // We generally don't pre-fill file inputs. 
                        existing_image: day.image // Can show preview if needed
                    })));
                }

                // Inclusions
                if (pkg.inclusions && Array.isArray(pkg.inclusions)) {
                    setInclusions(pkg.inclusions.map(i => i.text));
                }

                // Exclusions
                if (pkg.exclusions && Array.isArray(pkg.exclusions)) {
                    setExclusions(pkg.exclusions.map(e => e.text));
                }

            } catch (err) {
                console.error("Error loading package data:", err);
                setError("Failed to load package details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);


    useEffect(() => {
        // NOTE: Logic to sync itinerary days count with 'days' input is tricky in edit mode
        // because we don't want to accidentally delete fetched data if the fetched 'days' count is weird.
        // But generally we should respect the 'days' input.
        // For now, let's just let the user manually add/remove rows or let the input drive it carefully.
        // We'll reimplement the sync but ensure we don't wipe data immediately on load.
        // Actually, let's strictly stick to the Add logic: if user changes number, we adjust rows.
        // But wait, initial load sets 'days'.
    }, [formData.days]);

    // Sync logic similar to Add, but be careful not to trigger on initial load if states aren't ready.
    // We can skip this automatic sync for Edit to avoid accidental data loss, or implement it carefully.
    // Let's implement a manual "Update Rows" button or just let them add/remove manually?
    // The Add page had auto-sync. Let's keep it but only if rows.length != days
    useEffect(() => {
        if (loading) return;
        const dayCount = parseInt(formData.days, 10);
        if (!isNaN(dayCount) && dayCount >= 0) {
            setItineraryDays(prev => {
                if (prev.length === dayCount) return prev;
                if (dayCount > prev.length) {
                    const newDays = [];
                    for (let i = prev.length + 1; i <= dayCount; i++) {
                        newDays.push({
                            day: i.toString(), title: "", description: "", master_template: "", image: null
                        });
                    }
                    return [...prev, ...newDays];
                } else {
                    return prev.slice(0, dayCount);
                }
            });
        }
    }, [formData.days, loading]);


    /* ---------- handlers ---------- */
    const addRow = (setter, row) => setter((p) => [...p, row]);
    const removeRow = (setter, index) =>
        setter((p) => p.filter((_, i) => i !== index));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const formDataToSend = new FormData();

            // Add basic fields
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("starting_city", formData.starting_city);
            // Ensure 'days' matches the actual number of itinerary rows
            formDataToSend.append("days", itineraryDays.length);
            if (formData.start_date) formDataToSend.append("start_date", formData.start_date);
            formDataToSend.append("group_size", formData.group_size);
            formDataToSend.append("Offer_price", formData.offer_price);
            if (formData.price) formDataToSend.append("price", formData.price);

            // Add main images ONLY if new file selected
            if (formData.header_image instanceof File) {
                formDataToSend.append("header_image", formData.header_image);
            }
            if (formData.card_image instanceof File) {
                formDataToSend.append("card_image", formData.card_image);
            }

            // Add package destinations
            formDataToSend.append("package_destinations", JSON.stringify(packageDestinations));

            // Add itinerary days JSON
            const itineraryJson = itineraryDays.map(day => ({
                day: day.day,
                title: day.title,
                description: day.description,
                master_template: day.master_template
            }));
            formDataToSend.append("itinerary_days", JSON.stringify(itineraryJson));

            // Add itinerary images
            itineraryDays.forEach((day, index) => {
                if (day.image instanceof File) {
                    formDataToSend.append(`itinerary_image_${index}`, day.image);
                }
            });

            // Add inclusions and exclusions
            formDataToSend.append("inclusions", JSON.stringify(inclusions.filter(i => i && i.trim() !== "")));
            formDataToSend.append("exclusions", JSON.stringify(exclusions.filter(e => e && e.trim() !== "")));

            // Use PUT to update
            const response = await axios.put(`${API_BASE_URL}/packages/${id}/`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setMessage("Holiday package updated successfully!");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.error("Error updating package:", err);
            if (err.response?.data) {
                // Handle varied error structures
                let msg = "Failed to update package.";
                try {
                    msg = JSON.stringify(err.response.data);
                } catch (e) { }
                setError(msg);
            } else {
                setError("Failed to update package. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleMasterTemplateChange = (index, templateId) => {
        const copy = [...itineraryDays];
        copy[index].master_template = templateId;
        if (templateId) {
            const template = itineraryMasters.find(t => t.id === parseInt(templateId));
            if (template) {
                copy[index].title = template.title || "";
                copy[index].description = template.description || "";
            }
        }
        setItineraryDays(copy);
    };

    if (loading) {
        return (
            <div className="flex bg-gray-100 min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-10 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminTopbar />

                <div className="p-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Holiday Package</h1>
                            <p className="text-gray-600">Update package details</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/packages')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Back to List
                        </button>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* PACKAGE INFORMATION */}
                        <Section title="Package Information">
                            <div className="grid grid-cols-1 gap-4">
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Title:</span>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Description:</span>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="bg-white border border-gray-300 p-3 rounded w-full h-32 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Category:</span>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="bg-white border border-gray-300 p-2 rounded w-60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="Domestic">Domestic</option>
                                        <option value="International">International</option>
                                        <option value="Umrah">Umrah</option>
                                    </select>
                                </label>
                            </div>
                        </Section>

                        {/* LOCATION DETAILS */}
                        <Section title="Location Details">
                            <label className="block">
                                <span className="text-gray-700 font-medium mb-1 block">Starting city:</span>
                                <select
                                    name="starting_city"
                                    value={formData.starting_city}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-300 p-2 rounded w-60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent"
                                    required
                                >
                                    <option value="">----------</option>
                                    {Object.entries(groupedStartingCities).map(([region, cities]) => (
                                        <optgroup key={region} label={region}>
                                            {cities.map((city) => (
                                                <option key={city.id} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </label>
                        </Section>

                        {/* DURATION */}
                        <Section title="Duration & Dates">
                            <div className="grid grid-cols-3 gap-4">
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Days:</span>
                                    <Input
                                        type="number"
                                        name="days"
                                        value={formData.days}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Start date:</span>
                                    <Input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Group size:</span>
                                    <Input
                                        type="number"
                                        name="group_size"
                                        value={formData.group_size}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        </Section>

                        {/* PRICING */}
                        <Section title="Pricing">
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Offer price:</span>
                                    <Input
                                        type="number"
                                        name="offer_price"
                                        value={formData.offer_price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Price:</span>
                                    <Input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        </Section>

                        {/* IMAGES */}
                        <Section title="Images">
                            <div className="grid grid-cols-2 gap-6">
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Header image:</span>
                                    {headerPreview && (
                                        <div className="mb-2">
                                            <img src={headerPreview} alt="Header Preview" className="h-32 object-cover rounded border" />
                                            <p className="text-xs text-gray-500">Current Image</p>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        name="header_image"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep current image</p>
                                </label>
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Card image:</span>
                                    {cardPreview && (
                                        <div className="mb-2">
                                            <img src={cardPreview} alt="Card Preview" className="h-32 object-cover rounded border" />
                                            <p className="text-xs text-gray-500">Current Image</p>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        name="card_image"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave blank to keep current image</p>
                                </label>
                            </div>
                        </Section>

                        {/* PACKAGE DESTINATIONS */}
                        <Section title="Package Destinations">
                            {packageDestinations.map((row, i) => (
                                <div key={i} className="grid grid-cols-4 gap-4 mb-3 items-center">
                                    <SearchableSelect
                                        options={destinations.map(d => ({ value: d.name, label: d.name }))}
                                        value={row.destination}
                                        onChange={(val) => {
                                            const copy = [...packageDestinations];
                                            copy[i].destination = val;
                                            setPackageDestinations(copy);
                                        }}
                                        placeholder="Select destination"
                                    />

                                    <Input
                                        type="number"
                                        placeholder="Nights"
                                        value={row.nights}
                                        onChange={(e) => {
                                            const copy = [...packageDestinations];
                                            copy[i].nights = e.target.value;
                                            setPackageDestinations(copy);
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeRow(setPackageDestinations, i)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                        ✖ Remove
                                    </button>
                                </div>
                            ))}

                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        addRow(setPackageDestinations, { destination: "", nights: 1 })
                                    }
                                    className="text-[#14532d] hover:text-[#0f4a24] font-semibold"
                                >
                                    + Add another Package destination
                                </button>
                            </div>
                        </Section>

                        {/* ITINERARY DAYS */}
                        <Section title="Itinerary Days" className="bg-white border border-gray-300 p-0">
                            <div className="text-gray-800">
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-[#e6f0eb] text-[#14532d] text-xs font-bold uppercase tracking-wider border-b border-green-100">
                                    <div className="col-span-1">Day</div>
                                    <div className="col-span-3">Master Template</div>
                                    <div className="col-span-3">Title</div>
                                    <div className="col-span-3">Description</div>
                                    <div className="col-span-2">Image</div>
                                </div>

                                {itineraryDays.map((row, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-200 items-start hover:bg-gray-50 transition-colors">
                                        <div className="col-span-1">
                                            <input
                                                type="number"
                                                placeholder="#"
                                                value={row.day}
                                                onChange={(e) => {
                                                    const copy = [...itineraryDays];
                                                    copy[i].day = e.target.value;
                                                    setItineraryDays(copy);
                                                }}
                                                className="w-full bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded focus:border-[#14532d] focus:ring-1 focus:ring-[#14532d] text-sm"
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <select
                                                value={row.master_template}
                                                onChange={(e) => handleMasterTemplateChange(i, e.target.value)}
                                                className="w-full bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded focus:border-[#14532d] text-sm"
                                            >
                                                <option value="">Select Template...</option>
                                                {itineraryMasters.map(master => (
                                                    <option key={master.id} value={master.id}>{master.name}</option>
                                                ))}
                                            </select>
                                            <div className="flex gap-2 mt-2 text-gray-400 text-xs text-right w-full justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(setItineraryDays, i)}
                                                    className="text-red-500 hover:text-red-700 font-bold"
                                                >
                                                    ✖ Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                value={row.title}
                                                onChange={(e) => {
                                                    const copy = [...itineraryDays];
                                                    copy[i].title = e.target.value;
                                                    setItineraryDays(copy);
                                                }}
                                                className="w-full bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded focus:border-[#14532d] text-sm"
                                            />
                                        </div>

                                        <div className="col-span-3">
                                            <textarea
                                                value={row.description}
                                                onChange={(e) => {
                                                    const copy = [...itineraryDays];
                                                    copy[i].description = e.target.value;
                                                    setItineraryDays(copy);
                                                }}
                                                rows="4"
                                                className="w-full bg-white border border-gray-300 text-gray-800 px-2 py-1 rounded focus:border-[#14532d] text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            {row.existing_image && !row.image && (
                                                <div className="mb-2">
                                                    <img src={row.existing_image} alt="Day" className="h-16 w-full object-cover rounded" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const copy = [...itineraryDays];
                                                    copy[i].image = e.target.files[0];
                                                    setItineraryDays(copy);
                                                }}
                                                className="w-full text-xs text-gray-500"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addRow(setItineraryDays, {
                                                day: (itineraryDays.length + 1).toString(),
                                                title: "",
                                                description: "",
                                                master_template: "",
                                                image: null
                                            })
                                        }
                                        className="flex items-center gap-1 text-[#14532d] hover:text-[#0f4a24] font-semibold text-sm"
                                    >
                                        <span>+</span> Add another Itinerary day
                                    </button>
                                </div>
                            </div>
                        </Section>

                        {/* INCLUSIONS */}
                        <Section title="Inclusions">
                            {inclusions.map((inc, i) => (
                                <div key={i} className="flex gap-4 mb-2">
                                    <Input
                                        value={inc}
                                        onChange={(e) => {
                                            const copy = [...inclusions];
                                            copy[i] = e.target.value;
                                            setInclusions(copy);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeRow(setInclusions, i)}
                                        className="text-red-600 hover:text-red-800 font-bold whitespace-nowrap"
                                    >
                                        ✖ Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addRow(setInclusions, "")}
                                className="text-[#14532d] hover:text-[#0f4a24] font-semibold"
                            >
                                + Add another Inclusion
                            </button>
                        </Section>

                        {/* EXCLUSIONS */}
                        <Section title="Exclusions">
                            {exclusions.map((exc, i) => (
                                <div key={i} className="flex gap-4 mb-2">
                                    <Input
                                        value={exc}
                                        onChange={(e) => {
                                            const copy = [...exclusions];
                                            copy[i] = e.target.value;
                                            setExclusions(copy);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeRow(setExclusions, i)}
                                        className="text-red-600 hover:text-red-800 font-bold whitespace-nowrap"
                                    >
                                        ✖ Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addRow(setExclusions, "")}
                                className="text-[#14532d] hover:text-[#0f4a24] font-semibold"
                            >
                                + Add another Exclusion
                            </button>
                        </Section>

                        {/* SAVE BUTTONS */}
                        <div className="flex gap-3 mt-6 bg-white p-6 rounded-lg shadow-sm">
                            <button
                                type="submit"
                                className="bg-[#14532d] px-6 py-2 rounded text-white hover:bg-[#0f4a24] transition font-semibold"
                                disabled={saving}
                            >
                                {saving ? "UPDATING..." : "UPDATE PACKAGE"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default HolidayPackageEdit;
