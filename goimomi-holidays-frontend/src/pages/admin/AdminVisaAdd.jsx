import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Save, Plus, ChevronDown, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

const AdminVisaAdd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        country: "",
        title: "",
        entry_type: "Single-Entry Visa",
        validity: "30 days",
        duration: "30 days",
        processing_time: "3-5 Business Days",
        cost_price: 0,
        service_charge: 0,
        selling_price: 0,
        documents_required: "Passport Front, Photo",
        photography_required: "",
        visa_type: "✈️ Tourist Visa",
        is_active: true,
        supplier_id: "",
    });
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountries] = useState([]);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countrySearchTerm, setCountrySearchTerm] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
    const [supplierSearchTerm, setSupplierSearchTerm] = useState("");

    // Dynamic lists for documents and photos
    const [documentList, setDocumentList] = useState(["Passport Front", "Passport Back", "Digital Photo (White Background)"]);
    const [photoList, setPhotoList] = useState([""]);

    useEffect(() => {
        fetchCountries();
        fetchSuppliers();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get("/api/countries/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("/api/suppliers/");
            // Filter suppliers who provide Visa services
            const visaSuppliers = response.data.filter(supplier =>
                supplier.services && supplier.services.includes("Visa")
            );
            setSuppliers(visaSuppliers);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const addListItem = (setter) => setter(prev => [...prev, ""]);
    const removeListItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));
    const handleListChange = (setter, index, value) => {
        setter(prev => {
            const newList = [...prev];
            newList[index] = value;
            return newList;
        });
    };

    const formatWithCommas = (value) => {
        if (value === null || value === undefined || value === "") return "";
        const cleanValue = value.toString().replace(/\D/g, "");
        if (!cleanValue) return "";
        return new Intl.NumberFormat("en-IN").format(cleanValue);
    };



    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file,
                [`${name}_preview`]: file ? URL.createObjectURL(file) : null
            });
        } else {
            let updatedValue = type === "checkbox" ? checked : value;

            // Strip commas for price fields to keep state as numeric
            if (name === "cost_price" || name === "service_charge" || name === "selling_price") {
                updatedValue = value.toString().replace(/\D/g, "");
            }

            setFormData(prev => {
                const newData = { ...prev, [name]: updatedValue };

                // Auto-calculate selling price if cost or service charge changes
                if (name === "cost_price" || name === "service_charge") {
                    const cost = parseFloat(name === "cost_price" ? updatedValue : prev.cost_price) || 0;
                    const service = parseFloat(name === "service_charge" ? updatedValue : prev.service_charge) || 0;
                    newData.selling_price = cost + service;
                }

                return newData;
            });
        }
    };

    const handleSubmit = async (e, action = "save") => {
        if (e) e.preventDefault();



        if (!formData.country || !formData.title || formData.selling_price <= 0) {
            setStatusMessage({ text: "Please fill in all required fields. Selling price must be greater than 0.", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ text: "", type: "" });

        try {
            const data = new FormData();

            // Join lists with commas before saving
            const documentsString = documentList.filter(item => item.trim() !== "").join(", ");
            const photosString = photoList.filter(item => item.trim() !== "").join(", ");

            Object.keys(formData).forEach(key => {
                if (key !== "documents_required" && key !== "photography_required" && formData[key] !== null && !key.endsWith('_preview')) {
                    data.append(key, formData[key]);
                }
            });

            data.append("documents_required", documentsString);
            data.append("photography_required", photosString);

            const response = await axios.post("/api/visas/", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (action === "continue") {
                navigate(`/admin/visas/edit/${response.data.id}`);
            } else if (action === "another") {
                setFormData({
                    country: "",
                    title: "",
                    entry_type: "Single-Entry Visa",
                    validity: "30 days",
                    duration: "30 days",
                    processing_time: "3-5 Business Days",
                    cost_price: 0,
                    service_charge: 0,
                    selling_price: 0,
                    supplier_id: "",
                });
                setDocumentList(["Passport Front", "Passport Back", "Digital Photo (White Background)"]);
                setPhotoList([""]);
                setStatusMessage({ text: "Visa added successfully! Add another one.", type: "success" });
                setIsSubmitting(false);
            } else {
                navigate("/admin/visas");
            }
        } catch (error) {
            console.error("Error adding visa:", error);
            setStatusMessage({ text: "Failed to add visa. Please try again.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-3">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => navigate("/admin/visas")}
                                className="p-1 px-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight"
                            >
                                <ArrowLeft size={12} /> Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Add New Visa</h1>
                        </div>

                        {statusMessage.text && (
                            <div className={`p-2 rounded mb-3 text-xs font-bold ring-1 overflow-hidden animate-in fade-in slide-in-from-top-2 ${statusMessage.type === "success" ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-700 ring-red-200"
                                }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={(e) => handleSubmit(e)} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all cursor-pointer flex items-center justify-between bg-gray-50/50 hover:bg-white"
                                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            >
                                                <span className={formData.country ? "text-gray-900 font-medium" : "text-gray-400 italic"}>
                                                    {formData.country || "Select Country"}
                                                </span>
                                                <ChevronDown size={14} className="text-gray-400" />
                                            </div>

                                            {isCountryDropdownOpen && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-hidden flex flex-col scale-in-center">
                                                    <div className="p-2 border-b border-gray-50">
                                                        <div className="relative">
                                                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                value={countrySearchTerm}
                                                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                                                placeholder="Search..."
                                                                className="w-full pl-7 pr-3 py-1 text-xs border border-gray-100 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="overflow-y-auto flex-1">
                                                        {countries.filter(c => c.name.toLowerCase().includes(countrySearchTerm.toLowerCase())).length > 0 ? (
                                                            countries
                                                                .filter(c => c.name.toLowerCase().includes(countrySearchTerm.toLowerCase()))
                                                                .map((c) => (
                                                                    <div
                                                                        key={c.id}
                                                                        className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-green-50 hover:text-[#14532d] transition-colors ${formData.country === c.name ? "bg-[#14532d] text-white font-bold" : "text-gray-600"}`}
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, country: c.name });
                                                                            setIsCountryDropdownOpen(false);
                                                                            setCountrySearchTerm("");
                                                                        }}
                                                                    >
                                                                        {c.name}
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <div className="px-3 py-2 text-[10px] text-gray-400 text-center uppercase font-bold italic">No results</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Visa Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Vietnam E-Visa"
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all placeholder:italic placeholder:text-gray-300"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Visa Category
                                        </label>
                                        <select
                                            name="visa_type"
                                            value={formData.visa_type}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all bg-white"
                                        >
                                            <option value="✈️ Tourist Visa">✈️ Tourist Visa</option>
                                            <option value="💼 Business Visa">💼 Business Visa</option>
                                            <option value="🎓 Student Visa">🎓 Student Visa</option>
                                            <option value="👨💼 Work / Employment Visa">Work / Employment</option>
                                            <option value="👨👩👧 Family / Dependent Visa">Family / Dependent</option>
                                            <option value="❤️ Marriage / Fiancé(e) Visa">Marriage / Fiancé(e)</option>
                                            <option value="🏡 Permanent Residence">Residency</option>
                                            <option value="🛂 Transit Visa">Transit Visa</option>
                                            <option value="🩺 Medical Visa">Medical Visa</option>
                                            <option value="🌍 Diplomatic / Official Visa">Official Visa</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Entry Policy
                                        </label>
                                        <select
                                            name="entry_type"
                                            value={formData.entry_type}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all bg-white"
                                        >
                                            <option value="Single-Entry Visa">Single-Entry</option>
                                            <option value="Double-Entry Visa">Double-Entry</option>
                                            <option value="Multiple-Entry Visa">Multiple-Entry</option>
                                            <option value="Transit Visa">Transit</option>
                                            <option value="Visa on Arrival">On Arrival</option>
                                            <option value="Electronic Visa (e-Visa)">E-Visa</option>
                                            <option value="Re-Entry Visa">Re-Entry</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Validity
                                        </label>
                                        <input
                                            type="text"
                                            name="validity"
                                            value={formData.validity}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Stay Duration
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Processing
                                        </label>
                                        <input
                                            type="text"
                                            name="processing_time"
                                            value={formData.processing_time}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs text-blue-600">
                                        <label className="block font-bold text-blue-400 uppercase tracking-widest">
                                            Cost Price (₹)
                                        </label>
                                        <input
                                            type="text"
                                            name="cost_price"
                                            value={formatWithCommas(formData.cost_price)}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs text-[#14532d]">
                                        <label className="block font-bold text-green-700 uppercase tracking-widest">
                                            Service Charge (₹)
                                        </label>
                                        <input
                                            type="text"
                                            name="service_charge"
                                            value={formatWithCommas(formData.service_charge)}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all font-bold"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs text-green-600">
                                        <label className="block font-bold text-green-400 uppercase tracking-widest">
                                            Selling Price (₹)
                                        </label>
                                        <input
                                            type="text"
                                            name="selling_price"
                                            value={formatWithCommas(formData.selling_price)}
                                            readOnly
                                            className="w-full px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg outline-none transition-all font-bold cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <label className="block font-bold text-gray-400 uppercase tracking-widest">
                                            Supplier
                                        </label>
                                        <div className="relative">
                                            <div
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition-all cursor-pointer flex items-center justify-between bg-gray-50/50 hover:bg-white"
                                                onClick={() => setIsSupplierDropdownOpen(!isSupplierDropdownOpen)}
                                            >
                                                <span className={formData.supplier_id ? "text-gray-900 font-medium" : "text-gray-400 italic"}>
                                                    {formData.supplier_id ? suppliers.find(s => s.id === parseInt(formData.supplier_id))?.company_name : "Select Supplier"}
                                                </span>
                                                <ChevronDown size={14} className="text-gray-400" />
                                            </div>

                                            {isSupplierDropdownOpen && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-hidden flex flex-col scale-in-center">
                                                    <div className="p-2 border-b border-gray-50">
                                                        <div className="relative">
                                                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                value={supplierSearchTerm}
                                                                onChange={(e) => setSupplierSearchTerm(e.target.value)}
                                                                placeholder="Search..."
                                                                className="w-full pl-7 pr-3 py-1 text-xs border border-gray-100 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="overflow-y-auto flex-1">
                                                        <div
                                                            className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-50 transition-colors ${!formData.supplier_id ? "bg-gray-100 font-bold" : "text-gray-600"}`}
                                                            onClick={() => {
                                                                setFormData({ ...formData, supplier_id: "" });
                                                                setIsSupplierDropdownOpen(false);
                                                                setSupplierSearchTerm("");
                                                            }}
                                                        >
                                                            None (No Supplier)
                                                        </div>
                                                        {suppliers.filter(s => s.company_name.toLowerCase().includes(supplierSearchTerm.toLowerCase())).length > 0 ? (
                                                            suppliers
                                                                .filter(s => s.company_name.toLowerCase().includes(supplierSearchTerm.toLowerCase()))
                                                                .map((s) => (
                                                                    <div
                                                                        key={s.id}
                                                                        className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-green-50 hover:text-[#14532d] transition-colors ${formData.supplier_id === s.id.toString() ? "bg-[#14532d] text-white font-bold" : "text-gray-600"}`}
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, supplier_id: s.id.toString() });
                                                                            setIsSupplierDropdownOpen(false);
                                                                            setSupplierSearchTerm("");
                                                                        }}
                                                                    >
                                                                        {s.company_name}
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <div className="px-3 py-2 text-[10px] text-gray-400 text-center uppercase font-bold italic">No results</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Documents Required List */}
                                    <div className="space-y-3">
                                        <div className="bg-[#14532d] text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest rounded-t-lg">
                                            Required Documents
                                        </div>
                                        <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg bg-gray-50/30 space-y-3">
                                            {documentList.map((doc, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={doc}
                                                        onChange={(e) => handleListChange(setDocumentList, index, e.target.value)}
                                                        placeholder="e.g. Passport Front"
                                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all text-xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeListItem(setDocumentList, index)}
                                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-tight transition-colors"
                                                    >
                                                        <X size={14} className="stroke-[3]" />
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addListItem(setDocumentList)}
                                                className="mt-2 flex items-center gap-1.5 text-[#14532d] hover:text-[#0f4a24] font-black text-[10px] uppercase tracking-wider transition-all"
                                            >
                                                <Plus size={14} className="stroke-[3]" />
                                                Add Another Document
                                            </button>
                                        </div>
                                    </div>

                                    {/* Photo Requirements List */}
                                    <div className="space-y-3">
                                        <div className="bg-[#14532d] text-white px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest rounded-t-lg">
                                            Photo Requirements
                                        </div>
                                        <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg bg-gray-50/30 space-y-3">
                                            {photoList.map((photo, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={photo}
                                                        onChange={(e) => handleListChange(setPhotoList, index, e.target.value)}
                                                        placeholder="e.g. White background"
                                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14532d] outline-none transition-all text-xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeListItem(setPhotoList, index)}
                                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-tight transition-colors"
                                                    >
                                                        <X size={14} className="stroke-[3]" />
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addListItem(setPhotoList)}
                                                className="mt-2 flex items-center gap-1.5 text-[#14532d] hover:text-[#0f4a24] font-black text-[10px] uppercase tracking-wider transition-all"
                                            >
                                                <Plus size={14} className="stroke-[3]" />
                                                Add Another Requirement
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-wrap gap-4 px-1 pb-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            id="is_active"
                                            className="w-3.5 h-3.5 text-[#14532d] focus:ring-[#14532d] border-gray-300 rounded cursor-pointer"
                                        />
                                        <label htmlFor="is_active" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                                            Active & Visible on Website
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-[#14532d] text-white rounded-xl hover:bg-[#0f4a24] transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-900/20"
                                >
                                    {isSubmitting ? "Saving..." : "Save Visa"}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "another")}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-white text-[#14532d] border border-gray-200 rounded-xl hover:bg-gray-50 transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest"
                                >
                                    Save + New
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "continue")}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all transform active:scale-95 disabled:opacity-50 text-xs font-bold uppercase tracking-widest"
                                >
                                    Save + Edit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVisaAdd;
