import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Image as ImageIcon } from "lucide-react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

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

const AdminVisaArticleEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    // Existing images from backend
    const [existingImages, setExistingImages] = useState([]);
    // Image IDs to remove
    const [removeImageIds, setRemoveImageIds] = useState([]);

    // New uploaded images
    const [newImages, setNewImages] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/api/visa-articles/${id}/`);
                const data = response.data;
                setFormData({
                    title: data.title || "",
                    description: data.description || ""
                });
                setExistingImages(data.images || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching visa article:", err);
                alert("Failed to fetch visa article.");
                navigate("/admin/visa-articles");
            }
        };
        fetchArticle();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingImages.length - removeImageIds.length + newImages.length + files.length;
        if (totalImages > 10) {
            alert("Maximum 10 images allowed in total.");
            return;
        }

        setNewImages(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setNewPreviews(prev => [...prev, ...previews]);
    };

    const removeExistingImage = (imgId) => {
        setRemoveImageIds(prev => [...prev, imgId]);
    };

    const undoRemoveExistingImage = (imgId) => {
        setRemoveImageIds(prev => prev.filter(id => id !== imgId));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            alert("Please fill in the Title.");
            return;
        }

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("description", formData.description);

            // Append list of image IDs to remove
            if (removeImageIds.length > 0) {
                fd.append("remove_image_ids", JSON.stringify(removeImageIds));
            }

            // Append new images
            newImages.forEach(img => {
                fd.append("visa_article_images", img);
            });

            await api.put(`/api/visa-articles/${id}/`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Visa article updated successfully!");
            navigate("/admin/visa-articles");
        } catch (err) {
            console.error("Error updating visa article:", err);
            alert("Failed to update visa article.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-gray-50 h-full overflow-hidden font-sans">
                <AdminSidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <AdminTopbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#14532d] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    const totalActiveImagesCount = existingImages.length - removeImageIds.length + newImages.length;

    return (
        <div className="flex bg-gray-50 h-screen overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />

                <div className="flex-1 overflow-y-auto p-4 md:p-5">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate("/admin/visa-articles")}
                            className="flex items-center gap-1.5 text-gray-400 font-bold text-[8px] uppercase tracking-widest hover:text-[#14532d] transition-all mb-3"
                        >
                            <ArrowLeft size={10} /> Back to List
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
                            <div>
                                <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">Edit Visa Article</h1>
                                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.15em]">Update visa article content</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-[#14532d] text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Article Details */}
                            <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-4 bg-[#14532d] rounded-full"></div>
                                    <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Article Content</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <FormLabel label="Article Title" required />
                                        <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter article title" />
                                    </div>

                                    <div>
                                        <FormLabel label="Description / Content" optional />
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="8"
                                            placeholder="Write article details here..."
                                            className="bg-white border-2 border-gray-100 px-2.5 py-2 rounded-xl w-full text-gray-900 text-[10px] font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] resize-y"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Images Section */}
                            <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                        <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Gallery Images</h2>
                                    </div>
                                    <span className="text-[7px] font-bold text-gray-400 uppercase">{totalActiveImagesCount}/10</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {/* Existing Images */}
                                    {existingImages.map((imgObj) => {
                                        const isRemoved = removeImageIds.includes(imgObj.id);
                                        return (
                                            <div key={imgObj.id} className={`aspect-square rounded-lg overflow-hidden relative group border ${isRemoved ? 'opacity-40 border-red-200' : 'border-gray-50'}`}>
                                                <img src={imgObj.image} className="w-full h-full object-cover" alt="" />
                                                {isRemoved ? (
                                                    <div className="absolute inset-0 bg-red-900/10 flex flex-col items-center justify-center p-1">
                                                        <span className="text-[8px] font-black text-red-600 bg-red-50 border border-red-100 rounded px-1 py-0.5 uppercase mb-1 shadow">To Delete</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => undoRemoveExistingImage(imgObj.id)}
                                                            className="text-[7px] font-black uppercase text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-1 py-0.5 rounded shadow-sm"
                                                        >
                                                            Undo
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(imgObj.id)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                    >
                                                        <X size={8} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* New Images previews */}
                                    {newPreviews.map((url, i) => (
                                        <div key={i} className="aspect-square rounded-lg overflow-hidden relative group border border-green-200 shadow-sm">
                                            <img src={url} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute top-1 left-1">
                                                <span className="text-[6px] font-black text-green-700 bg-green-50 border border-green-200 rounded px-1 uppercase shadow-sm">New</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                            >
                                                <X size={8} />
                                            </button>
                                        </div>
                                    ))}

                                    {totalActiveImagesCount < 10 && (
                                        <label className="aspect-square rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group">
                                            <Plus size={12} className="text-gray-400 group-hover:text-[#14532d]" />
                                            <input type="file" multiple onChange={handleNewImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <p className="mt-4 text-[9px] text-gray-400 font-medium italic opacity-50">Max size 2MB per image. JPG, PNG.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVisaArticleEdit;
