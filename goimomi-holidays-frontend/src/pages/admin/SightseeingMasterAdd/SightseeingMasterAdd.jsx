import React, { useState, useEffect, useMemo } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { MapPin, Image as ImageIcon, Plus, X, ArrowLeft, Camera, Clock, IndianRupee, Link as LinkIcon, Info } from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import SearchableSelect from "../../../components/admin/SearchableSelect/SearchableSelect";

const FormLabel = ({ label, required, optional }) => (
    <div className="flex items-center gap-1.5 mb-1">
        <span className="text-gray-700 font-black text-[9px] uppercase tracking-[0.12em]">{label} {required && <span className="text-red-500">*</span>}</span>
        {optional && <span className="text-[#14532d] text-[7px] font-black bg-green-50 px-1 py-0.5 rounded border border-green-100/50 uppercase">Opt</span>}
    </div>
);

const Input = (props) => (
    <input
        {...props}
        className="bg-white border border-gray-200 px-2.5 py-1 rounded-md w-full text-gray-900 text-[10px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] hover:border-gray-300"
    />
);

const SightseeingMasterAdd = () => {
    const navigate = useNavigate();
    const [allCities, setAllCities] = useState([]);
    const [allRegions, setAllRegions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);

    const [formData, setFormData] = useState({
        city_link: "",
        name: "",
        description: "",
        address: "",
        city: "",
        duration: "",
        price: "0",
        latitude: "",
        longitude: "",
        map_link: "",
        image: null
    });

    const [galleryImages, setGalleryImages] = useState([]);
    const [previews, setPreviews] = useState({ main: null, gallery: [] });

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            setCitiesLoading(true);
            const [citiesRes, regionsRes] = await Promise.all([
                api.get('/api/cities/'),
                api.get('/api/regions/')
            ]);
            const citiesData = Array.isArray(citiesRes.data) ? citiesRes.data : (citiesRes.data?.results || []);
            const regionsData = Array.isArray(regionsRes.data) ? regionsRes.data : (regionsRes.data?.results || []);
            setAllCities(citiesData);
            setAllRegions(regionsData);
        } catch (err) {
            console.error("Error fetching cities/regions:", err);
        } finally {
            setCitiesLoading(false);
        }
    };

    // Build combined city+region options grouped by country (matches HolidayPackageAdd pattern)
    const cities = useMemo(() => {
        const groups = {};
        const addToGroups = (item, type) => {
            if (!item || !item.name) return;
            const country = (item.country_name || item.country || "Other").toString().toUpperCase();
            if (!groups[country]) groups[country] = [];
            const key = `${type}-${item.id}`;
            const exists = groups[country].find(opt => opt._key === key);
            if (!exists) {
                groups[country].push({
                    _key: key,
                    value: item.id,
                    label: item.name,
                    subtitle: type === 'city'
                        ? (item.region_name || 'City')
                        : 'Region',
                    badge: type
                });
            }
        };
        allCities.forEach(c => addToGroups(c, 'city'));
        allRegions.forEach(r => addToGroups(r, 'region'));
        return Object.entries(groups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, opts]) => ({
                label,
                options: opts.sort((a, b) => a.label.localeCompare(b.label))
            }));
    }, [allCities, allRegions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviews(prev => ({ ...prev, main: URL.createObjectURL(file) }));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => ({ ...prev, gallery: [...prev.gallery, ...newPreviews] }));
    };

    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.city_link) {
            alert("Please fill in the Name and select a City.");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== "") {
                    fd.append(key, formData[key]);
                }
            });

            galleryImages.forEach(img => {
                fd.append("gallery_images", img);
            });

            await api.post("/api/sightseeing-masters/", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Sightseeing Master created successfully!");
            navigate("/admin/sightseeing-masters");
        } catch (err) {
            console.error("Error creating sightseeing:", err);
            alert("Failed to create sightseeing master.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-3">
                    <div className="max-w-5xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/sightseeing-masters")}
                            className="flex items-center gap-1.5 text-gray-400 font-bold text-[8px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-3"
                        >
                            <ArrowLeft size={10} /> Back to List
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                            <div>
                                <h1 className="text-base font-black text-gray-900 tracking-tight leading-none mb-0.5">Add New Sightseeing</h1>
                                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">Create a master sightseeing template</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Save Sightseeing"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                            {/* Left Column: Basic Info */}
                            <div className="lg:col-span-2 space-y-2.5">
                                <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-2.5">
                                        <div className="w-0.5 h-4 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[9px] font-black text-gray-700 uppercase tracking-wider">Basic Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        <div className="md:col-span-2">
                                            <FormLabel label="Sightseeing Name" required />
                                            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Burj Khalifa At the Top" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="City / Region" required />
                                            <SearchableSelect
                                                options={cities}
                                                value={formData.city_link}
                                                onChange={(val) => setFormData(prev => ({ ...prev, city_link: val }))}
                                                placeholder={citiesLoading ? "Loading..." : "Search city or region..."}
                                            />
                                        </div>

                                        <div>
                                            <FormLabel label="City Name" optional />
                                            <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Dubai" />
                                        </div>

                                        <div>
                                            <FormLabel label="Duration" optional />
                                            <div className="relative">
                                                <Clock size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. 2 Hours"
                                                    className="bg-white border border-gray-200 pl-7 pr-2.5 py-1 rounded-md w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Approx Price" optional />
                                            <div className="relative">
                                                <IndianRupee size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="bg-white border border-gray-200 pl-7 pr-2.5 py-1 rounded-md w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Map Link" optional />
                                            <div className="relative">
                                                <LinkIcon size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    name="map_link"
                                                    value={formData.map_link}
                                                    onChange={handleInputChange}
                                                    placeholder="Google Maps URL"
                                                    className="bg-white border border-gray-200 pl-7 pr-2.5 py-1 rounded-md w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Full Description" />
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="2"
                                                placeholder="Enter details about this sightseeing..."
                                                className="bg-white border border-gray-200 px-2.5 py-1 rounded-md w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] resize-none"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Exact Address" optional />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="1"
                                                className="bg-white border border-gray-200 px-2.5 py-1 rounded-md w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#14532d]/10 focus:border-[#14532d] resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-0.5 h-4 bg-orange-400 rounded-full"></div>
                                        <h2 className="text-[9px] font-black text-gray-700 uppercase tracking-wider">Geo Coordinates</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <FormLabel label="Latitude" optional />
                                            <Input name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g. 25.12345" />
                                        </div>
                                        <div>
                                            <FormLabel label="Longitude" optional />
                                            <Input name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g. 55.12345" />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-[8px] text-gray-400 flex items-center gap-1.5">
                                        <Info size={9} className="text-orange-400" />
                                        Used for map locations if specific links are missing.
                                    </p>
                                </section>
                            </div>

                            {/* Right Column: Visuals */}
                            <div className="space-y-2.5">
                                <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-0.5 h-4 bg-blue-500 rounded-full"></div>
                                        <h2 className="text-[9px] font-black text-gray-700 uppercase tracking-wider">Cover Image</h2>
                                    </div>
                                    <div className="aspect-[4/3] w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                                        {previews.main ? (
                                            <img src={previews.main} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Click to upload</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </section>

                                <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-0.5 h-4 bg-purple-500 rounded-full"></div>
                                            <h2 className="text-[9px] font-black text-gray-700 uppercase tracking-wider">Gallery</h2>
                                        </div>
                                        <label className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest cursor-pointer hover:bg-purple-600 hover:text-white transition-all">
                                            + Add
                                            <input type="file" multiple onChange={handleGalleryChange} className="hidden" />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1">
                                        {previews.gallery.length === 0 && (
                                            <div className="col-span-full py-4 text-center border border-dashed border-gray-100 rounded-lg">
                                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">No Gallery</span>
                                            </div>
                                        )}
                                        {previews.gallery.map((url, i) => (
                                            <div key={i} className="aspect-square rounded-md overflow-hidden relative group">
                                                <img src={url} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    onClick={() => removeGalleryImage(i)}
                                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white p-0.5 rounded transition-opacity"
                                                >
                                                    <X size={7} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SightseeingMasterAdd;



