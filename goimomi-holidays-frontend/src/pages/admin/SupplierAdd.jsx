import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";
import CountryCodePicker from "../../components/admin/CountryCodePicker";

const SupplierAdd = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        company_name: "",
        services: [],
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "",
        country_code: "+91",
        contact_no: "",
        contact_person: "",
    });
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCountries, setFetchingCountries] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const API_BASE_URL = "/api";

    const serviceOptions = ["HOLIDAYS", "Visa", "Flight", "Hotel", "Attestation"];

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            setFetchingCountries(true);
            const response = await axios.get(`${API_BASE_URL}/countries/`);
            // Map countries for SearchableSelect
            const countryOptions = response.data.map(c => ({
                label: c.name,
                value: c.name
            }));
            setCountries(countryOptions);
        } catch (err) {
            console.error("Error fetching countries:", err);
            setError("Failed to load countries list.");
        } finally {
            setFetchingCountries(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
        setMessage("");
        setError("");
    };

    const handleCountryChange = (val) => {
        setForm({ ...form, country: val });
        setErrors({ ...errors, country: "" });
    };

    const handleCountryCodeChange = (val) => {
        setForm({ ...form, country_code: val });
    };

    const handleServiceChange = (service) => {
        const updatedServices = form.services.includes(service)
            ? form.services.filter(s => s !== service)
            : [...form.services, service];
        setForm({ ...form, services: updatedServices });
        setErrors({ ...errors, services: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.company_name.trim()) newErrors.company_name = "Company Name is required";
        if (form.services.length === 0) newErrors.services = "Select at least one service";
        if (!form.address_line1.trim()) newErrors.address_line1 = "Address Line 1 is required";
        if (!form.city.trim()) newErrors.city = "City is required";
        if (!form.state.trim()) newErrors.state = "State is required";
        if (!form.country.trim()) newErrors.country = "Country is required";
        if (!form.contact_no.trim()) newErrors.contact_no = "Contact No is required";
        if (!form.contact_person.trim()) newErrors.contact_person = "Contact Person is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) {
            setError("Please fix the errors in the form.");
            return;
        }
        setLoading(true);
        setMessage("");
        setError("");

        const submitData = {
            ...form,
            contact_no: `${form.country_code} ${form.contact_no}`.trim()
        };
        // Remove country_code from the payload sent to backend if backend doesn't expect it
        delete submitData.country_code;

        try {
            const response = await axios.post(`${API_BASE_URL}/suppliers/`, submitData);

            if (response.status === 201) {
                setMessage("Supplier added successfully!");
                setTimeout(() => navigate("/admin/suppliers"), 2000);
            }
        } catch (err) {
            console.error("Error adding supplier:", err);
            setError(err.response?.data?.detail || "Failed to add supplier. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-6">
                            <button
                                onClick={() => navigate('/admin/suppliers')}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm font-bold"
                            >
                                Back
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Add New Supplier</h1>
                        </div>

                        {message && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded shadow-sm">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded shadow-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="company_name"
                                            value={form.company_name}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-1.5 text-sm border ${errors.company_name ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-[#14532d] outline-none transition`}
                                            placeholder="Company name"
                                            required
                                        />
                                        {errors.company_name && <p className="text-red-500 text-[10px]">{errors.company_name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Contact Person <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="contact_person"
                                            value={form.contact_person}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-1.5 text-sm border ${errors.contact_person ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-[#14532d] outline-none transition`}
                                            placeholder="Person name"
                                            required
                                        />
                                        {errors.contact_person && <p className="text-red-500 text-[10px]">{errors.contact_person}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Contact No <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-1">
                                            <CountryCodePicker
                                                value={form.country_code}
                                                onChange={handleCountryCodeChange}
                                                disabled={loading}
                                            />
                                            <input
                                                name="contact_no"
                                                value={form.contact_no}
                                                onChange={handleChange}
                                                className={`flex-1 px-3 py-1.5 text-sm border ${errors.contact_no ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-[#14532d] outline-none transition`}
                                                placeholder="Number"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        Services <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-wrap gap-3 p-2.5 border border-gray-200 rounded bg-gray-50">
                                        {serviceOptions.map((service) => (
                                            <label key={service} className="flex items-center gap-1.5 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={form.services.includes(service)}
                                                    onChange={() => handleServiceChange(service)}
                                                    className="w-3.5 h-3.5 text-[#14532d] border-gray-300 rounded focus:ring-[#14532d]"
                                                />
                                                <span className="text-xs font-medium text-gray-600 group-hover:text-[#14532d] transition">
                                                    {service}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="address_line1"
                                            value={form.address_line1}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-1.5 text-sm border ${errors.address_line1 ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-[#14532d] outline-none transition`}
                                            placeholder="Building, Street"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Address Line 2
                                        </label>
                                        <input
                                            name="address_line2"
                                            value={form.address_line2}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#14532d] outline-none transition"
                                            placeholder="Area, Landmark"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#14532d] outline-none transition"
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#14532d] outline-none transition"
                                            placeholder="State"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <SearchableSelect
                                            options={countries}
                                            value={form.country}
                                            onChange={handleCountryChange}
                                            placeholder="Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-[#14532d] text-white rounded text-sm hover:bg-[#0f4a24] transition disabled:opacity-50 font-bold uppercase tracking-wide shadow-sm"
                                >
                                    {loading ? "Saving..." : "Save Supplier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierAdd;
