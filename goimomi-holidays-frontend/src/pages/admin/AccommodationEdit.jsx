import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    MapPin,
    Image as ImageIcon,
    Plus,
    X,
    ArrowLeft,
    Camera,
    Globe,
    Phone,
    Mail,
    Link as LinkIcon,
    Info,
    Star
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const FormLabel = ({ label, required, optional }) => (
    <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-900 font-black text-[9px] uppercase tracking-[0.1em]">{label} {required && <span className="text-red-500">*</span>}</span>
        {optional && <span className="text-[#14532d] text-[7px] font-black bg-green-50 px-1 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
    </div>
);

const Input = (props) => (
    <input
        {...props}
        className="bg-white border-2 border-gray-100 px-2.5 py-1.2 rounded-lg w-full text-gray-900 text-[10px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200"
    />
);

const Select = (props) => (
    <select
        {...props}
        className="bg-white border-2 border-gray-100 px-2.5 py-1.2 rounded-lg w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 appearance-none cursor-pointer"
    />
);

const AccommodationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [destinations, setDestinations] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        star_category: "3 Star",
        address: "",
        city: "",
        country_code: "",
        phone: "",
        website: "",
        email: "",
        latitude: "",
        longitude: ""
    });

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get("/api/destinations/");
                setDestinations(res.data);
            } catch (err) {
                console.error("Error fetching destinations:", err);
            }
        };
        fetchDestinations();
    }, []);

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const res = await axios.get(`/api/accommodations/${id}/`);
                const data = res.data;
                setFormData({
                    name: data.name || "",
                    star_category: data.star_category || "3 Star",
                    address: data.address || "",
                    city: data.city || "",
                    country_code: data.country_code || "",
                    phone: data.phone || "",
                    website: data.website || "",
                    email: data.email || "",
                    latitude: data.latitude || "",
                    longitude: data.longitude || ""
                });
                if (data.images) {
                    setExistingImages(data.images);
                }
            } catch (err) {
                console.error("Error fetching accommodation:", err);
                alert("Failed to load accommodation data.");
            } finally {
                setFetching(false);
            }
        };
        fetchAccommodation();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + images.length + files.length > 5) {
            alert("Maximum 5 images allowed.");
            return;
        }

        setImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imgId) => {
        if (window.confirm("Remove this image from server?")) {
            // Usually we'd have a separate endpoint or handle it in update
            // For now, let's just filter it out locally and assume the user will save
            setExistingImages(prev => prev.filter(img => img.id !== imgId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.city) {
            alert("Please fill in the Name and City.");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    fd.append(key, formData[key]);
                }
            });

            images.forEach(img => {
                fd.append("accommodation_images", img);
            });

            await axios.put(`/api/accommodations/${id}/`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Accommodation updated successfully!");
            navigate("/admin/accommodations");
        } catch (err) {
            console.error("Error updating accommodation:", err);
            alert("Failed to update accommodation.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 font-sans">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#14532d]/10 border-t-[#14532d]"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Loading Property...</p>
            </div>
        </div>
    );

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-5 text-gray-900">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/accommodations")}
                            className="flex items-center gap-1.5 text-gray-400 font-bold text-[8px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-3"
                        >
                            <ArrowLeft size={10} /> Back to List
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
                            <div>
                                <h1 className="text-lg font-black tracking-tight leading-none mb-1 uppercase italic text-gray-900">Edit Accommodation</h1>
                                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.15em]">Update property details for <span className="text-[#14532d]">{formData.name}</span></p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Physical Details */}
                            <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-4 bg-[#14532d] rounded-full"></div>
                                    <h2 className="text-[10px] font-black uppercase tracking-wider">Property Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <FormLabel label="Accommodation Name" required />
                                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" />
                                    </div>

                                    <div>
                                        <FormLabel label="Star Category" />
                                        <div className="relative">
                                            <Select name="star_category" value={formData.star_category} onChange={handleInputChange}>
                                                <option value="1 Star">1 Star</option>
                                                <option value="2 Star">2 Star</option>
                                                <option value="3 Star">3 Star</option>
                                                <option value="4 Star">4 Star</option>
                                                <option value="5 Star">5 Star</option>
                                                <option value="Boutique">Boutique</option>
                                                <option value="Resort">Resort</option>
                                            </Select>
                                            <Star size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="z-10 relative">
                                        <FormLabel label="City (Country)" required />
                                        <div className="relative">
                                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                                                <MapPin size={10} />
                                            </div>
                                            <div className="pl-6 w-full">
                                                <SearchableSelect
                                                    options={destinations.map(d => ({ value: d.name, label: d.name }))}
                                                    value={formData.city}
                                                    onChange={(val) => handleInputChange({ target: { name: 'city', value: val } })}
                                                    placeholder="Select city..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <FormLabel label="Address" optional />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="1"
                                            placeholder="Enter address"
                                            className="bg-white border-2 border-gray-100 px-2.5 py-2 rounded-xl w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] resize-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Contact Info */}
                            <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                    <h2 className="text-[10px] font-black uppercase tracking-wider">Contact Info</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1">
                                            <FormLabel label="Code" optional />
                                            <Input name="country_code" value={formData.country_code} onChange={handleInputChange} placeholder="+91" />
                                        </div>
                                        <div className="col-span-2">
                                            <FormLabel label="Phone" optional />
                                            <div className="relative">
                                                <Phone size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Phone no."
                                                    className="bg-white border-2 border-gray-100 pl-7 pr-2.5 py-1.2 rounded-lg w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <FormLabel label="Email" optional />
                                        <div className="relative">
                                            <Mail size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email Id"
                                                className="bg-white border-2 border-gray-100 pl-7 pr-2.5 py-1.2 rounded-lg w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <FormLabel label="Website" optional />
                                        <div className="relative">
                                            <LinkIcon size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                placeholder="Website URL"
                                                className="bg-white border-2 border-gray-100 pl-7 pr-2.5 py-1.2 rounded-lg w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                                <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                                        <h2 className="text-[10px] font-black uppercase tracking-wider">Location</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <FormLabel label="Lat" optional />
                                            <Input name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="Lat" />
                                        </div>
                                        <div>
                                            <FormLabel label="Lng" optional />
                                            <Input name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="Lng" />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                            <h2 className="text-[10px] font-black uppercase tracking-wider">Images</h2>
                                        </div>
                                        <span className="text-[7px] font-bold text-gray-400 uppercase">{existingImages.length + previews.length}/5</span>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2">
                                        {/* Existing Images */}
                                        {existingImages.map((img) => (
                                            <div key={img.id} className="aspect-square rounded-lg overflow-hidden relative group bg-gray-50 border border-gray-100">
                                                <img src={img.image} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(img.id)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* New Preview Images */}
                                        {previews.map((url, i) => (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden relative group border-[#14532d]/20 ring-1 ring-[#14532d]/10">
                                                <img src={url} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}

                                        {existingImages.length + previews.length < 5 && (
                                            <label className="aspect-square rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group">
                                                <Plus size={12} className="text-gray-400 group-hover:text-[#14532d]" />
                                                <input type="file" multiple onChange={handleImageChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    <p className="mt-4 text-[9px] text-gray-400 font-medium italic opacity-50">Max size 1MB. JPG, PNG.</p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccommodationEdit;
