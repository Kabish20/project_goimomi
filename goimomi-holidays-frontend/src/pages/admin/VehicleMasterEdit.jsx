import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Car, Camera, Users, Briefcase, Settings, Info, Loader } from "lucide-react";
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
        className="bg-white border-2 border-gray-100 px-3 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200"
    />
);

const VehicleMasterEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        seating_capacity: "",
        luggage_capacity: "",
        drive: "Manual",
        driver: "",
        description: "",
        photo: null
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchBrands();
        fetchDrivers();
        fetchVehicleDetails();
    }, [id]);

    const fetchDrivers = async () => {
        try {
            const res = await axios.get("/api/driver-masters/");
            setDrivers(res.data || []);
        } catch (err) {
            console.error("Error fetching drivers:", err);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get("/api/vehicle-brands/");
            setBrands(res.data);
        } catch (err) {
            console.error("Error fetching brands:", err);
        }
    };

    const fetchVehicleDetails = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`/api/vehicle-masters/${id}/`);
            const data = res.data;
            setFormData({
                name: data.name,
                brand: data.brand,
                seating_capacity: data.seating_capacity,
                luggage_capacity: data.luggage_capacity,
                drive: data.drive,
                driver: data.driver || "",
                description: data.description || "",
                photo: null
            });
            if (data.photo) setPreview(data.photo);
            setFetching(false);
        } catch (err) {
            console.error("Error fetching vehicle details:", err);
            alert("Record not found.");
            navigate("/admin/vehicle-masters");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.driver) {
            alert("Please select a Driver Name.");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'photo' && formData[key] === null) return;
                fd.append(key, formData[key]);
            });

            await axios.put(`/api/vehicle-masters/${id}/`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Vehicle updated successfully!");
            navigate("/admin/vehicle-masters");
        } catch (err) {
            console.error("Error updating vehicle:", err);
            alert("Failed to update vehicle.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-[#14532d]" size={40} />
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Loading Profile...</p>
            </div>
        </div>
    );

    return (
        <div className="flex bg-gray-50 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/vehicle-masters")}
                            className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-6 group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Vehicles
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">Edit Vehicle</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Update existing vehicle specifications</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Side: Forms */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-6 bg-[#14532d] rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">General specifications</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <FormLabel label="Vehicle Name / Model" optional />
                                            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Toyota Innova Crysta" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Vehicle Brand" optional />
                                            <SearchableSelect
                                                options={brands.map(b => ({ value: b.id, label: b.name }))}
                                                value={formData.brand}
                                                onChange={(val) => setFormData(prev => ({ ...prev, brand: val }))}
                                                placeholder="Select Brand..."
                                            />
                                        </div>

                                        <div>
                                            <FormLabel label="Seating Capacity" optional />
                                            <div className="relative">
                                                <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="number"
                                                    name="seating_capacity"
                                                    value={formData.seating_capacity}
                                                    onChange={handleInputChange}
                                                    className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Luggage Capacity (Bags)" optional />
                                            <div className="relative">
                                                <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="number"
                                                    name="luggage_capacity"
                                                    value={formData.luggage_capacity}
                                                    onChange={handleInputChange}
                                                    className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Transmission / Drive" optional />
                                            <div className="relative">
                                                <Settings size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <select
                                                    name="drive"
                                                    value={formData.drive}
                                                    onChange={handleInputChange}
                                                    className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all appearance-none"
                                                >
                                                    <option value="Manual">Manual</option>
                                                    <option value="Automatic">Automatic</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Driver Name" required />
                                            <SearchableSelect
                                                options={drivers.map(d => ({ value: d.id, label: d.name, subtitle: d.mobile_number }))}
                                                value={formData.driver}
                                                onChange={(val) => setFormData(prev => ({ ...prev, driver: val }))}
                                                placeholder="Select Driver..."
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Vehicle Description" />
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                placeholder="Tell something about this vehicle (features, comfort, etc.)"
                                                className="bg-white border-2 border-gray-100 px-4 py-3 rounded-2xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Side: Media */}
                            <div className="space-y-6">
                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Vehicle Photo</h2>
                                    </div>

                                    <div className="aspect-[4/3] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d]/30 transition-colors">
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="Vehicle Preview" />
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-[#14532d] group-hover:scale-110 transition-all">
                                                    <Camera size={24} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Upload Car Photo</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />

                                        {preview && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">Change Photo</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <div className="flex gap-3">
                                            <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
                                            <div>
                                                <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider mb-1">Image Tips</p>
                                                <p className="text-[9px] text-blue-700/70 leading-relaxed font-medium">Use a high-quality side-view photo. Update the image if the vehicle model is refreshed.</p>
                                            </div>
                                        </div>
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

export default VehicleMasterEdit;
