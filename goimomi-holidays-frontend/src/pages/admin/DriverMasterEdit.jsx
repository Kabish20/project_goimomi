import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Camera, CreditCard, Phone, MessageSquare, Info, FileText, Loader } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

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

const COUNTRY_CODES = [
    { code: "+91", label: "IN (+91)" },
    { code: "+971", label: "AE (+971)" },
    { code: "+966", label: "SA (+966)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+1", label: "US (+1)" },
    { code: "+974", label: "QA (+974)" },
    { code: "+968", label: "OM (+968)" },
    { code: "+973", label: "BH (+973)" },
    { code: "+965", label: "KW (+965)" },
    { code: "+20", label: "EG (+20)" },
    { code: "+60", label: "MY (+60)" },
    { code: "+65", label: "SG (+65)" },
    { code: "+66", label: "TH (+66)" },
    { code: "+62", label: "ID (+62)" },
    { code: "+61", label: "AU (+61)" },
];

const DriverMasterEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        id_no: "",
        mobile_number: "",
        mobile_code: "+91",
        whatsapp_number: "",
        whatsapp_code: "+91",
        id_copy: null,
        photo: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [idCopyName, setIdCopyName] = useState("");

    useEffect(() => {
        fetchDriverDetails();
    }, [id]);

    const fetchDriverDetails = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`/api/driver-masters/${id}/`);
            const data = res.data;

            const mobileparts = (data.mobile_number || "").split(' ');
            const mCode = mobileparts.length > 1 ? mobileparts[0] : "+91";
            const mNum = mobileparts.length > 1 ? mobileparts.slice(1).join(' ') : (data.mobile_number || "");

            const whatsappparts = (data.whatsapp_number || "").split(' ');
            const wCode = whatsappparts.length > 1 ? whatsappparts[0] : "+91";
            const wNum = whatsappparts.length > 1 ? whatsappparts.slice(1).join(' ') : (data.whatsapp_number || "");

            setFormData({
                name: data.name,
                id_no: data.id_no,
                mobile_number: mNum,
                mobile_code: mCode,
                whatsapp_number: wNum,
                whatsapp_code: wCode,
                id_copy: null,
                photo: null
            });
            if (data.photo) setPhotoPreview(data.photo);
            if (data.id_copy) setIdCopyName(data.id_copy.split('/').pop());
            setFetching(false);
        } catch (err) {
            console.error("Error fetching driver details:", err);
            alert("Driver record not found.");
            navigate("/admin/driver-masters");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [name]: file }));
            if (name === "photo") {
                setPhotoPreview(URL.createObjectURL(file));
            } else if (name === "id_copy") {
                setIdCopyName(file.name);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.id_no || !formData.mobile_number) {
            alert("Please fill in the Name, ID Number, and Mobile Number.");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            const finalData = { ...formData };
            finalData.mobile_number = `${formData.mobile_code} ${formData.mobile_number}`;
            finalData.whatsapp_number = formData.whatsapp_number ? `${formData.whatsapp_code} ${formData.whatsapp_number}` : "";

            delete finalData.mobile_code;
            delete finalData.whatsapp_code;

            Object.keys(finalData).forEach(key => {
                if ((key === 'photo' || key === 'id_copy') && finalData[key] === null) return;
                fd.append(key, finalData[key]);
            });

            await axios.put(`/api/driver-masters/${id}/`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Driver updated successfully!");
            navigate("/admin/driver-masters");
        } catch (err) {
            console.error("Error updating driver:", err);
            alert("Failed to update driver master.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-[#14532d]" size={40} />
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Loading Driver Profile...</p>
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
                            onClick={() => navigate("/admin/driver-masters")}
                            className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-6 group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Drivers
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">Edit Driver Profile</h1>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Update driver credentials and contact details</p>
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
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Contact & Identity</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <FormLabel label="Full Name" required />
                                            <div className="relative">
                                                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. John Doe"
                                                    className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all hover:border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="Mobile Number" required />
                                            <div className="flex gap-2">
                                                <div className="w-24 shrink-0">
                                                    <select
                                                        name="mobile_code"
                                                        value={formData.mobile_code}
                                                        onChange={handleInputChange}
                                                        className="bg-white border-2 border-gray-100 px-2 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:border-[#14532d]"
                                                    >
                                                        {COUNTRY_CODES.map(c => (
                                                            <option key={c.code} value={c.code}>{c.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="relative flex-1">
                                                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                    <input
                                                        type="text"
                                                        name="mobile_number"
                                                        value={formData.mobile_number}
                                                        onChange={handleInputChange}
                                                        placeholder="9876543210"
                                                        className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all hover:border-gray-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel label="WhatsApp Number" />
                                            <div className="flex gap-2">
                                                <div className="w-24 shrink-0">
                                                    <select
                                                        name="whatsapp_code"
                                                        value={formData.whatsapp_code}
                                                        onChange={handleInputChange}
                                                        className="bg-white border-2 border-gray-100 px-2 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:border-[#14532d]"
                                                    >
                                                        {COUNTRY_CODES.map(c => (
                                                            <option key={c.code} value={c.code}>{c.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="relative flex-1">
                                                    <MessageSquare size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                    <input
                                                        type="text"
                                                        name="whatsapp_number"
                                                        value={formData.whatsapp_number}
                                                        onChange={handleInputChange}
                                                        placeholder="9876543210"
                                                        className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all hover:border-gray-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="ID Number (Passport/Aadhar/License)" required />
                                            <div className="relative">
                                                <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="text"
                                                    name="id_no"
                                                    value={formData.id_no}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter identification number"
                                                    className="bg-white border-2 border-gray-100 pl-10 pr-4 py-2 rounded-xl w-full text-gray-900 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] transition-all hover:border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel label="Update ID Copy" optional />
                                            <div className="relative group/upload">
                                                <div className={`w-full h-16 border-2 border-dashed rounded-2xl flex items-center px-6 transition-all ${idCopyName ? 'border-[#14532d]/30 bg-green-50/30' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'}`}>
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover/upload:text-[#14532d] transition-colors">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="ml-4 overflow-hidden">
                                                        <p className="text-[10px] font-black text-gray-900 uppercase truncate">
                                                            {idCopyName || "Select ID Copy File"}
                                                        </p>
                                                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">
                                                            {idCopyName ? "Click to Replace File" : "Check existing ID or upload new"}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        name="id_copy"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Side: Media */}
                            <div className="space-y-6">
                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                        <h2 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Driver Photo</h2>
                                    </div>

                                    <div className="aspect-square w-full bg-gray-50 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#14532d]/30 transition-colors mx-auto max-w-[200px]">
                                        {photoPreview ? (
                                            <img src={photoPreview} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="Driver Profile" />
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-[#14532d] group-hover:scale-110 transition-all">
                                                    <Camera size={20} />
                                                </div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Profile Photo</p>
                                            </div>
                                        )}
                                        <input type="file" name="photo" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />

                                        {photoPreview && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-[8px] font-black uppercase tracking-[0.2em] border border-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm">Update</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <div className="flex gap-3">
                                            <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
                                            <div>
                                                <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider mb-1">Upload Tips</p>
                                                <p className="text-[9px] text-blue-700/70 leading-relaxed font-medium">Keep photos updated and ensure ID copies are clearly legible for verification.</p>
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

export default DriverMasterEdit;
