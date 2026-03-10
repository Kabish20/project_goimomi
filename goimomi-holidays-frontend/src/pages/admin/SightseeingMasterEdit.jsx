import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Image as ImageIcon, Plus, X, ArrowLeft, Camera, Clock, IndianRupee, Link as LinkIcon, Info, Trash2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import SearchableSelect from "../../components/admin/SearchableSelect";

const FormLabel = ({ label, required, optional }) => (
    <div className="flex items-center gap-2 mb-1.5">
        <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.15em]">{label} {required && <span className="text-red-500">*</span>}</span>
        {optional && <span className="text-[#14532d] text-[8px] font-black bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100/50 uppercase">Optional</span>}
    </div>
);

const Input = (props) => (
    <input
        {...props}
        className="bg-white border-2 border-gray-100 px-3 py-1.5 rounded-lg w-full text-gray-900 text-[11px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200"
    />
);

const SightseeingMasterEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        destination: "",
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

    const [existingImage, setExistingImage] = useState(null);
    const [existingGallery, setExistingGallery] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [previews, setPreviews] = useState({ main: null, gallery: [] });

    useEffect(() => {
        fetchDestinations();
        fetchSightseeingData();
    }, [id]);

    const fetchDestinations = async () => {
        try {
            const res = await api.get("/api/destinations/");
            setDestinations(res.data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
        }
    };

    const fetchSightseeingData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/sightseeing-masters/${id}/`);
            const data = res.data;
            setFormData({
                destination: data.destination || "",
                name: data.name || "",
                description: data.description || "",
                address: data.address || "",
                city: data.city || "",
                duration: data.duration || "",
                price: data.price || "0",
                latitude: data.latitude || "",
                longitude: data.longitude || "",
                map_link: data.map_link || "",
                image: null
            });
            setExistingImage(data.image);
            setExistingGallery(data.images || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching sightseeing data:", err);
            alert("Failed to load sightseeing data.");
            navigate("/admin/sightseeing-masters");
        }
    };

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
        setSaving(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    fd.append(key, formData[key]);
                }
            });

            galleryImages.forEach(img => {
                fd.append("gallery_images", img);
            });

            await api.put(`/api/sightseeing-masters/${id}/`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Sightseeing Master updated successfully!");
            navigate("/admin/sightseeing-masters");
        } catch (err) {
            console.error("Error updating sightseeing:", err);
            alert("Failed to update sightseeing master.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14532d]"></div>
        </div>
    );

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/sightseeing-masters")}
                            className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-4"
                        >
                            <ArrowLeft size={12} /> Back to List
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Edit Sightseeing</h1>
                                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Update sightseeing template information</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-[#14532d] text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Update Sightseeing"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Basic Info */}
                            <div className="lg:col-span-2 space-y-4">
                                <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-5 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Basic Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <FormLabel label="Sightseeing Name" required />
                                            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Burj Khalifa At the Top" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Destination / City Group" required />
                                            <SearchableSelect
                                                options={destinations.map(d => ({ value: d.id, label: d.name }))}
                                                value={formData.destination}
                                                onChange={(val) => setFormData(prev => ({ ...prev, destination: val }))}
                                                placeholder="Select Destination..."
                                            />
                                        </div>

                                        <div>
                                            <FormLabel label="City Name" optional />
                                            <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Dubai" />
                                        </div>

                                        <div>
                                            <FormLabel label="Duration" optional />
                                            <div className="relative">
                                                <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. 2 Hours"
                                                    className="bg-white border-2 border-gray-100 pl-8 pr-3 py-1.5 rounded-lg w-full text-gray-900 text-[11px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Approx Price" optional />
                                            <div className="relative">
                                                <IndianRupee size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="bg-white border-2 border-gray-100 pl-8 pr-3 py-1.5 rounded-lg w-full text-gray-900 text-[11px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Map Link" optional />
                                            <div className="relative">
                                                <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    name="map_link"
                                                    value={formData.map_link}
                                                    onChange={handleInputChange}
                                                    placeholder="Google Maps URL"
                                                    className="bg-white border-2 border-gray-100 pl-8 pr-3 py-1.5 rounded-lg w-full text-gray-900 text-[11px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d]"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Full Description" />
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Enter details about this sightseeing..."
                                                className="bg-white border-2 border-gray-100 px-3 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] resize-none"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Exact Address" optional />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="1"
                                                className="bg-white border-2 border-gray-100 px-3 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-5 bg-orange-400 rounded-full"></div>
                                        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Geo Coordinates</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <FormLabel label="Latitude" optional />
                                            <Input name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g. 25.12345" />
                                        </div>
                                        <div>
                                            <FormLabel label="Longitude" optional />
                                            <Input name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g. 55.12345" />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Visuals */}
                            <div className="space-y-4">
                                <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                                        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Cover Image</h2>
                                    </div>
                                    <div className="aspect-[4/3] w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group">
                                        {previews.main ? (
                                            <img src={previews.main} className="w-full h-full object-cover" alt="Preview" />
                                        ) : existingImage ? (
                                            <img src={existingImage} className="w-full h-full object-cover" alt="Existing" />
                                        ) : (
                                            <div className="text-center">
                                                <Camera className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Select Image</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    {(previews.main || existingImage) && (
                                        <p className="mt-1.5 text-[8px] text-center font-black uppercase text-gray-400 tracking-tighter">Click to change</p>
                                    )}
                                </section>

                                <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                                            <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Gallery</h2>
                                        </div>
                                        <label className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-purple-600 hover:text-white transition-all">
                                            Add
                                            <input type="file" multiple onChange={handleGalleryChange} className="hidden" />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1.5">
                                        {/* Existing Gallery */}
                                        {existingGallery.map((img, i) => (
                                            <div key={`exist-${i}`} className="aspect-square rounded-lg overflow-hidden relative group border border-gray-100">
                                                <img src={img.image} className="w-full h-full object-cover" alt="" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[7px] font-black text-white uppercase tracking-widest">Existing</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* New Gallery Previews */}
                                        {previews.gallery.map((url, i) => (
                                            <div key={`new-${i}`} className="aspect-square rounded-lg overflow-hidden relative group border-2 border-purple-100 shadow-sm shadow-purple-900/10">
                                                <img src={url} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    onClick={() => removeGalleryImage(i)}
                                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white p-0.5 rounded"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}

                                        {existingGallery.length === 0 && previews.gallery.length === 0 && (
                                            <div className="col-span-full py-6 text-center border-2 border-dashed border-gray-50 rounded-xl">
                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">No Photos</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-3 text-[8px] text-gray-400 italic">New photos will be appended.</p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SightseeingMasterEdit;
