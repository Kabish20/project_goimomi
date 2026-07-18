import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Search, Trash2, Edit2, Plus, Image as ImageIcon, Share2, Mail, Eye, X, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";

const AdminVisaArticleManage = () => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    // Sharing States
    const [emailModalArticle, setEmailModalArticle] = useState(null);
    const [sharingEmail, setSharingEmail] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);

    const [whatsappModalArticle, setWhatsappModalArticle] = useState(null);
    const [sharingPhone, setSharingPhone] = useState(() => localStorage.getItem("lastSharedCustomerPhone") || "");
    const [sharingPhoneCode, setSharingPhoneCode] = useState(() => localStorage.getItem("lastSharedCustomerPhoneCode") || "91");

    const [previewArticle, setPreviewArticle] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await api.get("/api/visa-articles/");
            setArticles(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching visa articles:", error);
            setStatusMessage({ text: "Failed to fetch visa articles", type: "error" });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this visa article?")) {
            try {
                await api.delete(`/api/visa-articles/${id}/`);
                setArticles(articles.filter((art) => art.id !== id));
                setStatusMessage({ text: "Visa article deleted successfully", type: "success" });
            } catch (error) {
                console.error("Error deleting visa article:", error);
                setStatusMessage({ text: "Failed to delete visa article", type: "error" });
            }
        }
    };

    // Share Handlers
    const handleWhatsAppShareDirect = (art) => {
        if (sharingPhone.trim()) {
            // We have a phone number, send directly! (One click!)
            const cleanCode = sharingPhoneCode.replace(/\D/g, "");
            const cleanPhone = sharingPhone.replace(/\D/g, "");
            const targetNumber = `${cleanCode}${cleanPhone}`;

            let text = `*${art.title}*\n\n`;
            if (art.description) {
                text += `${art.description}\n\n`;
            }
            text += `Shared via Goimomi Holidays.`;

            // Detect mobile or desktop to use direct URLs
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const baseUrl = isMobile 
                ? "https://api.whatsapp.com/send" 
                : "https://web.whatsapp.com/send";

            window.open(`${baseUrl}?phone=${targetNumber}&text=${encodeURIComponent(text)}`, '_blank');
        } else {
            // No phone number, show the modal to enter it.
            setWhatsappModalArticle(art);
        }
    };

    const handleWhatsAppShareSubmit = (e) => {
        e.preventDefault();
        if (!sharingPhone || !whatsappModalArticle) return;

        // Clean values
        const cleanCode = sharingPhoneCode.replace(/\D/g, "");
        const cleanPhone = sharingPhone.replace(/\D/g, "");
        const targetNumber = `${cleanCode}${cleanPhone}`;

        // Save to localStorage so it persists for future one-click sharing
        localStorage.setItem("lastSharedCustomerPhone", sharingPhone);
        localStorage.setItem("lastSharedCustomerPhoneCode", sharingPhoneCode);

        let text = `*${whatsappModalArticle.title}*\n\n`;
        if (whatsappModalArticle.description) {
            text += `${whatsappModalArticle.description}\n\n`;
        }
        text += `Shared via Goimomi Holidays.`;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const baseUrl = isMobile 
            ? "https://api.whatsapp.com/send" 
            : "https://web.whatsapp.com/send";

        window.open(`${baseUrl}?phone=${targetNumber}&text=${encodeURIComponent(text)}`, '_blank');
        setWhatsappModalArticle(null);
    };

    const handleEmailShareInitiate = (art) => {
        setEmailModalArticle(art);
        setSharingEmail("");
    };

    const handleEmailShareSubmit = async (e) => {
        e.preventDefault();
        if (!sharingEmail || !emailModalArticle) return;
        setSendingEmail(true);

        const subject = `Visa Article Details: ${emailModalArticle.title}`;
        const body = `Hello,\n\nPlease find the details with regards to your visa article query for "${emailModalArticle.title}":\n\n${emailModalArticle.description || "No description provided"}\n\nBest regards,\nGoimomi Holidays Team`;

        try {
            await api.post('/api/send-visa-details/', {
                email: sharingEmail,
                subject,
                body
            });
            alert("Article details sent successfully to " + sharingEmail);
            setEmailModalArticle(null);
            setSharingEmail("");
        } catch (error) {
            console.error("Error sending email:", error);
            // Fallback to mailto link
            window.location.href = `mailto:${sharingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setEmailModalArticle(null);
            setSharingEmail("");
        } finally {
            setSendingEmail(false);
        }
    };

    const filteredArticles = articles.filter(
        (art) =>
            art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (art.description && art.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex bg-gray-100 h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-4 bg-[#fcfdfc]">
                    <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90 rounded-2xl mb-4">
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tighter">Visa Articles</h1>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                                <span className="text-green-500">Inventory</span> / <span>Articles</span> / <span className="text-gray-900">Visa Content</span>
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/admin/visa-articles/add")}
                            className="px-6 py-2 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={12} /> ADD ARTICLE
                        </button>
                    </div>

                    {/* Search Bar & Target Customer Number */}
                    <div className="flex flex-wrap gap-4 items-center mb-4">
                        <div className="relative w-full max-w-xs group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search articles by title or description..."
                                className="w-full bg-white border-2 border-gray-100 pl-11 pr-4 py-2 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-white border-2 border-gray-100 px-4 py-1.5 rounded-full shadow-sm">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Target Customer WhatsApp:</span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={sharingPhoneCode}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSharingPhoneCode(val);
                                        localStorage.setItem("lastSharedCustomerPhoneCode", val);
                                    }}
                                    placeholder="+91"
                                    className="w-10 bg-transparent text-xs font-bold text-gray-905 border-none outline-none focus:ring-0 text-center"
                                />
                                <span className="text-gray-300">|</span>
                                <input
                                    type="tel"
                                    value={sharingPhone}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSharingPhone(val);
                                        localStorage.setItem("lastSharedCustomerPhone", val);
                                    }}
                                    placeholder="Enter mobile number"
                                    className="w-36 bg-transparent text-xs font-bold text-gray-905 border-none outline-none focus:ring-0"
                                />
                                {sharingPhone && (
                                    <button 
                                        onClick={() => {
                                            setSharingPhone("");
                                            localStorage.removeItem("lastSharedCustomerPhone");
                                        }}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex justify-between items-center ${
                                statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                            <span>{statusMessage.text}</span>
                            <button onClick={() => setStatusMessage({ text: "", type: "" })}>✕</button>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Title</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Description</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Images</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Share</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-10">
                                                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : filteredArticles.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-10 text-gray-500 text-xs font-bold">
                                                No articles found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredArticles.map((art) => (
                                            <tr key={art.id} className="group hover:bg-[#fcfdfc] transition-colors border-b border-gray-50 last:border-0 hover:shadow-inner">
                                                <td className="px-6 py-3 font-black text-gray-900 text-xs w-1/5">{art.title}</td>
                                                <td className="px-6 py-3 text-xs font-bold text-gray-400 w-1/3">
                                                    {art.description ? (
                                                        art.description.length > 80 ? (
                                                            `${art.description.substring(0, 80)}...`
                                                        ) : (
                                                            art.description
                                                        )
                                                    ) : (
                                                        <span className="italic text-gray-300">No description provided</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-center w-1/12">
                                                    <div className="flex items-center justify-center gap-1 text-xs font-black text-gray-500">
                                                        <ImageIcon size={14} className="text-gray-400" />
                                                        <span>{art.images ? art.images.length : 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-center w-1/3">
                                                    {/* Capsule Share Bar */}
                                                    <div className="inline-flex items-center gap-2 bg-[#2d2d2d] text-white rounded-full px-3.5 py-1.5 shadow-sm border border-neutral-700/50">
                                                        <div className="flex items-center gap-1.5 text-white/80 font-bold text-[9px] uppercase tracking-wider pr-2 border-r border-white/20">
                                                            <Share2 size={11} className="text-white/60" />
                                                            <span>Share :</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleWhatsAppShareDirect(art)}
                                                                className="flex items-center gap-1 text-white hover:text-white/80 font-bold text-[9px] md:text-[10px] transition-colors"
                                                            >
                                                                <MessageCircle size={12} className="text-emerald-400" />
                                                                WhatsApp
                                                            </button>
                                                            <button
                                                                onClick={() => handleEmailShareInitiate(art)}
                                                                className="flex items-center gap-1 text-white hover:text-white/80 font-bold text-[9px] md:text-[10px] transition-colors"
                                                            >
                                                                <Mail size={12} className="text-[#3b82f6]" />
                                                                Email
                                                            </button>
                                                            <button
                                                                onClick={() => setPreviewArticle(art)}
                                                                className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 font-bold text-[9px] md:text-[10px] transition-colors"
                                                            >
                                                                <Eye size={12} className="text-yellow-500" />
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right w-1/12">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => navigate(`/admin/visa-articles/edit/${art.id}`)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(art.id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp Share Modal */}
            {whatsappModalArticle && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setWhatsappModalArticle(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-[#14532d] text-white px-5 py-4 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Share via WhatsApp</h3>
                            <button onClick={() => setWhatsappModalArticle(null)} className="text-white/80 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleWhatsAppShareSubmit} className="p-5 space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider">Customer WhatsApp Number</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={sharingPhoneCode}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setSharingPhoneCode(val);
                                            localStorage.setItem("lastSharedCustomerPhoneCode", val);
                                        }}
                                        placeholder="+91"
                                        className="w-16 bg-white border-2 border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#14532d] transition-all text-center"
                                    />
                                    <input
                                        type="tel"
                                        required
                                        value={sharingPhone}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setSharingPhone(val);
                                            localStorage.setItem("lastSharedCustomerPhone", val);
                                        }}
                                        placeholder="Enter customer number"
                                        className="flex-1 bg-white border-2 border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#14532d] transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setWhatsappModalArticle(null)}
                                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all uppercase tracking-widest"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Email Share Modal */}
            {emailModalArticle && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setEmailModalArticle(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-[#14532d] text-white px-5 py-4 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Email Article Details</h3>
                            <button onClick={() => setEmailModalArticle(null)} className="text-white/80 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEmailShareSubmit} className="p-5 space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-wider">Recipient Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={sharingEmail}
                                    onChange={e => setSharingEmail(e.target.value)}
                                    placeholder="e.g. client@example.com"
                                    className="w-full bg-white border-2 border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#14532d] transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEmailModalArticle(null)}
                                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className="px-4 py-2 bg-[#14532d] text-white rounded-xl text-xs font-black hover:bg-[#0f4a24] transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    {sendingEmail ? "Sending..." : "Send Details"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Preview Modal */}
            {previewArticle && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" onClick={() => setPreviewArticle(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="bg-[#14532d] text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Article Preview</h3>
                            <button onClick={() => setPreviewArticle(null)} className="text-white/80 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">{previewArticle.title}</h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#14532d] to-green-500 rounded-full"></div>
                            </div>
                            
                            <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                {previewArticle.description || <span className="italic text-gray-400">No content provided</span>}
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-3">Attached Images ({previewArticle.images ? previewArticle.images.length : 0})</h4>
                                {previewArticle.images && previewArticle.images.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {previewArticle.images.map((imgObj) => (
                                            <a
                                                key={imgObj.id}
                                                href={imgObj.image}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="aspect-square rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group block relative"
                                            >
                                                <img src={imgObj.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-white bg-black/40 border border-white/20 rounded px-2 py-1 uppercase tracking-wider">Open Image</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                                        No images attached
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setPreviewArticle(null)}
                                className="px-5 py-2 bg-neutral-800 text-white rounded-xl text-xs font-bold hover:bg-neutral-900 transition-all uppercase tracking-wider"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVisaArticleManage;
