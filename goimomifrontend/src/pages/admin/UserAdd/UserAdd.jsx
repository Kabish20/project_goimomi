import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../../components/admin/AdminTopbar/AdminTopbar";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

const UserAdd = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        first_name: "",
        last_name: "",
        is_staff: true,
        is_superuser: false,
        is_active: true,
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_BASE_URL = "/api";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (redirectType) => {
        setError("");

        // Basic Validation
        if (!form.username || !form.password) {
            setError("Username and password are required.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            const response = await api.post(`${API_BASE_URL}/users/`, {
                username: form.username,
                password: form.password,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                is_staff: form.is_staff,
                is_superuser: form.is_superuser,
                is_active: form.is_active,
            });

            alert("User created successfully!");

            if (redirectType === 'save') {
                navigate("/admin/users");
            } else if (redirectType === 'save_add_another') {
                setForm({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    first_name: "",
                    last_name: "",
                    is_staff: true,
                    is_superuser: false,
                    is_active: true,
                });
            } else if (redirectType === 'save_continue') {
                if (response.data && response.data.id) {
                    navigate(`/admin/users/edit/${response.data.id}`);
                } else {
                    navigate("/admin/users");
                }
            }

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                if (err.response.data.username) {
                    setError(`Error: ${err.response.data.username[0]}`);
                } else if (err.response.data.detail) {
                    setError(`Error: ${err.response.data.detail}`);
                } else {
                    setError("Failed to create user. Please check your inputs and try again.");
                }
            } else {
                setError("Failed to create user. Please try again.");
            }
        }
    };

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="p-6 text-black max-w-4xl bg-white rounded shadow">
                        <h1 className="text-xl font-semibold mb-4">Add User</h1>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs font-semibold">
                                {error}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mb-6">
                            Enter the user credentials and configure role permissions. By default, <strong>Staff status</strong> is enabled so the user can access the admin dashboard.
                        </p>

                        {/* Account Credentials */}
                        <div className="space-y-6 mb-6 pb-6 border-b border-gray-200">
                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-700 uppercase tracking-wider">Username *</label>
                                <input
                                    name="username"
                                    required
                                    value={form.username}
                                    onChange={handleChange}
                                    className="bg-white border border-gray-300 px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#14532d] text-sm"
                                    placeholder="e.g. support_manager"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
                                </p>
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="bg-white border border-gray-300 px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#14532d] text-sm"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                                    <input
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        className="bg-white border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#14532d] text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                                    <input
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        className="bg-white border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#14532d] text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="space-y-6 mb-6 pb-6 border-b border-gray-200">
                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-700 uppercase tracking-wider">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="bg-white border border-gray-300 px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#14532d] text-sm"
                                />
                                <ul className="text-[11px] text-gray-400 mt-2 space-y-0.5 list-disc list-inside">
                                    <li>Password must contain at least 8 characters.</li>
                                    <li>Avoid commonly used or entirely numeric passwords.</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-700 uppercase tracking-wider">Password confirmation *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="bg-white border border-gray-300 px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#14532d] text-sm"
                                />
                            </div>
                        </div>

                        {/* Permissions & Roles */}
                        <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">Permissions & Access Control</h3>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="is_staff"
                                    name="is_staff"
                                    checked={form.is_staff}
                                    onChange={handleChange}
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                />
                                <label htmlFor="is_staff" className="cursor-pointer">
                                    <span className="text-xs font-bold text-gray-800">Staff Status (Admin Access)</span>
                                    <p className="text-[11px] text-gray-500">Allows the user to log into this administrative dashboard and manage operations.</p>
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="is_superuser"
                                    name="is_superuser"
                                    checked={form.is_superuser}
                                    onChange={handleChange}
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                />
                                <label htmlFor="is_superuser" className="cursor-pointer">
                                    <span className="text-xs font-bold text-gray-800">Superuser Status</span>
                                    <p className="text-[11px] text-gray-500">Grants all system permissions without restriction.</p>
                                </label>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                />
                                <label htmlFor="is_active" className="cursor-pointer">
                                    <span className="text-xs font-bold text-gray-800">Active Account</span>
                                    <p className="text-[11px] text-gray-500">Uncheck this to temporarily disable this account without deleting data.</p>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 bg-gray-100 p-4 rounded text-xs font-bold uppercase tracking-wider">
                            <button onClick={() => handleSave('save')} className="bg-[#14532d] hover:bg-[#0f4a24] text-white px-6 py-2.5 rounded transition-all cursor-pointer">
                                SAVE USER
                            </button>
                            <button onClick={() => handleSave('save_add_another')} className="bg-[#457b92] hover:bg-[#346073] text-white px-5 py-2.5 rounded transition-all cursor-pointer">
                                Save and add another
                            </button>
                            <button onClick={() => handleSave('save_continue')} className="bg-slate-600 hover:bg-slate-700 text-white px-5 py-2.5 rounded transition-all cursor-pointer">
                                Save and continue editing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAdd;



