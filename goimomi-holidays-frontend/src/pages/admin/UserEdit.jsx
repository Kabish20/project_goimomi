import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserEdit = () => {
    const { id } = useParams();
    const [form, setForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        last_login: "",
        date_joined: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_BASE_URL = "/api";

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${id}/`);
            const data = response.data;
            setForm({
                username: data.username || "",
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                is_active: data.is_active !== undefined ? data.is_active : true,
                is_staff: data.is_staff || false,
                is_superuser: data.is_superuser || false,
                last_login: data.last_login || "",
                date_joined: data.date_joined || "",
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Failed to load user data.");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (redirectType) => {
        setError("");
        try {
            await axios.put(`${API_BASE_URL}/users/${id}/`, form);
            alert("User updated successfully!");
            if (redirectType === 'save') {
                navigate("/admin/users");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to update user. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    if (loading) return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6 flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14532d]"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
                            <div>
                                <h1 className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Change user</h1>
                                <h2 className="text-2xl font-bold text-gray-800 mt-1">{form.username}</h2>
                            </div>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1 rounded text-xs font-bold uppercase tracking-tight transition-colors">
                                History
                            </button>
                        </div>

                        {error && (
                            <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="p-6 space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-sm font-bold text-gray-700">Username:</label>
                                    <div className="md:col-span-2">
                                        <input
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            className="w-full max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-[#14532d] focus:border-[#14532d] outline-none text-sm transition-all"
                                        />
                                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                                            Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 pt-4 border-t border-gray-50">
                                    <label className="text-sm font-bold text-gray-700 mt-1">Password:</label>
                                    <div className="md:col-span-2">
                                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                                            <span className="font-mono font-bold">algorithm:</span> pbkdf2_sha256 <span className="font-mono font-bold ml-2">iterations:</span> 600000 <span className="font-mono font-bold ml-2">salt:</span> ******** <span className="font-mono font-bold ml-2">hash:</span> ********
                                            <br />
                                            <span className="inline-block mt-2 text-gray-500 italic">Raw passwords are not stored. You can change the password using <span className="text-blue-600 cursor-pointer hover:underline">this form</span>.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Info Section */}
                            <div className="rounded border border-gray-200 overflow-hidden">
                                <div className="bg-[#14532d] px-4 py-2 text-white text-xs font-bold uppercase tracking-wider">
                                    Personal Info
                                </div>
                                <div className="p-6 space-y-6 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                        <label className="text-sm font-bold text-gray-700">First name:</label>
                                        <input
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            className="md:col-span-2 w-full max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-[#14532d] outline-none text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-4 border-t border-gray-50">
                                        <label className="text-sm font-bold text-gray-700">Last name:</label>
                                        <input
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            className="md:col-span-2 w-full max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-[#14532d] outline-none text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-4 border-t border-gray-50">
                                        <label className="text-sm font-bold text-gray-700">Email address:</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="md:col-span-2 w-full max-w-md border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-[#14532d] outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div className="rounded border border-gray-200 overflow-hidden">
                                <div className="bg-[#14532d] px-4 py-2 text-white text-xs font-bold uppercase tracking-wider">
                                    Permissions
                                </div>
                                <div className="p-6 space-y-6 bg-white">
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={form.is_active}
                                            onChange={handleChange}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                        />
                                        <div>
                                            <label className="text-sm font-bold text-gray-700">Active</label>
                                            <p className="text-[11px] text-gray-500">Designates whether this user should be treated as active. Unselect this instead of deleting accounts.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 pt-4 border-t border-gray-50">
                                        <input
                                            type="checkbox"
                                            name="is_staff"
                                            checked={form.is_staff}
                                            onChange={handleChange}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                        />
                                        <div>
                                            <label className="text-sm font-bold text-gray-700">Staff status</label>
                                            <p className="text-[11px] text-gray-500">Designates whether the user can log into this admin site.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 pt-4 border-t border-gray-50">
                                        <input
                                            type="checkbox"
                                            name="is_superuser"
                                            checked={form.is_superuser}
                                            onChange={handleChange}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                        />
                                        <div>
                                            <label className="text-sm font-bold text-gray-700">Superuser status</label>
                                            <p className="text-[11px] text-gray-500">Designates that this user has all permissions without explicitly assigning them.</p>
                                        </div>
                                    </div>

                                    {/* Groups / Permissions Box Selectors UI (Conceptual) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-3 uppercase tracking-tighter">Groups:</label>
                                            <div className="border border-gray-200 rounded min-h-[150px] bg-gray-50 p-4 text-center flex flex-col justify-center items-center">
                                                <p className="text-xs text-gray-400 italic">No groups available</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-3 uppercase tracking-tighter invisible">Chosen:</label>
                                            <div className="border border-gray-200 rounded min-h-[150px] bg-gray-50 p-4 text-center flex flex-col justify-center items-center">
                                                <p className="text-xs text-gray-400 italic">No groups selected</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Dates Section */}
                            <div className="rounded border border-gray-200 overflow-hidden">
                                <div className="bg-[#14532d] px-4 py-2 text-white text-xs font-bold uppercase tracking-wider">
                                    Important Dates
                                </div>
                                <div className="p-6 space-y-6 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Last login:</label>
                                        <div className="md:col-span-2 text-sm text-gray-600 font-medium">
                                            {formatDate(form.last_login)}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-4 border-t border-gray-50">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Date joined:</label>
                                        <div className="md:col-span-2 text-sm text-gray-600 font-medium">
                                            {formatDate(form.date_joined)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 border-t border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-3 order-2 md:order-1 w-full md:w-auto">
                                <button
                                    onClick={() => handleSave('save')}
                                    className="flex-1 md:flex-none bg-[#14532d] hover:bg-[#0f4a24] text-white px-8 py-2.5 rounded text-xs font-bold uppercase tracking-widest shadow-sm transition-all"
                                >
                                    Save
                                </button>
                                <button className="flex-1 md:flex-none bg-[#457b9d] hover:bg-[#345d7a] text-white px-4 py-2.5 rounded text-xs font-bold uppercase tracking-widest shadow-sm transition-all">
                                    Save and add another
                                </button>
                                <button className="flex-1 md:flex-none bg-[#457b9d] hover:bg-[#345d7a] text-white px-4 py-2.5 rounded text-xs font-bold uppercase tracking-widest shadow-sm transition-all">
                                    Save and continue editing
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                                        axios.delete(`${API_BASE_URL}/users/${id}/`)
                                            .then(() => { navigate("/admin/users"); })
                                            .catch(() => alert("Error deleting user"));
                                    }
                                }}
                                className="order-1 md:order-2 w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded text-xs font-bold uppercase tracking-widest shadow-sm transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEdit;
