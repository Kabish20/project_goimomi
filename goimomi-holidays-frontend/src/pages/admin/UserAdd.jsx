import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserAdd = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_BASE_URL = "/api";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            await axios.post(`${API_BASE_URL}/users/`, {
                username: form.username,
                password: form.password
            });

            alert("User created successfully!");

            if (redirectType === 'save') {
                navigate("/admin/users");
            } else if (redirectType === 'save_add_another') {
                setForm({
                    username: "",
                    password: "",
                    confirmPassword: "",
                });
            } else if (redirectType === 'save_continue') {
                // Ideally this would redirect to an edit page, but for now we'll just keep the form open
                // In a full implementation: navigate(`/admin/users/${response.data.id}/change`);
            }

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.username) {
                setError(`Error: ${err.response.data.username[0]}`);
            } else {
                setError("Failed to create user. Please try again.");
            }
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="p-6 text-black max-w-4xl bg-white rounded shadow">
                        <h1 className="text-xl font-semibold mb-4">Add user</h1>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mb-6">
                            First, enter a username and password. Then, you’ll be able to edit more
                            user options.
                        </p>

                        {/* Username */}
                        <div className="mb-6 border-b border-gray-200 pb-6">
                            <label className="block mb-2 font-medium">Username:</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="bg-white border border-gray-300 px-3 py-2 rounded w-96 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
                            </p>
                        </div>

                        {/* Password */}
                        <div className="mb-6 border-b border-gray-200 pb-6">
                            <label className="block mb-2 font-medium">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="bg-white border border-gray-300 px-3 py-2 rounded w-96 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                            />
                            <ul className="text-xs text-gray-500 mt-3 space-y-1 list-disc list-inside">
                                <li>Your password can’t be too similar to your other personal information.</li>
                                <li>Your password must contain at least 8 characters.</li>
                                <li>Your password can’t be a commonly used password.</li>
                                <li>Your password can’t be entirely numeric.</li>
                            </ul>
                        </div>

                        {/* Password confirmation */}
                        <div className="mb-8 border-b border-gray-200 pb-6">
                            <label className="block mb-2 font-medium">Password confirmation:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="bg-white border border-gray-300 px-3 py-2 rounded w-96 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Enter the same password as before, for verification.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 bg-gray-100 p-4 rounded text-sm font-medium">
                            <button onClick={() => handleSave('save')} className="bg-[#14532d] text-white px-6 py-2 rounded hover:bg-[#0f4a24]">SAVE</button>
                            <button onClick={() => handleSave('save_add_another')} className="bg-[#457b92] text-white px-6 py-2 rounded hover:bg-[#346073]">
                                Save and add another
                            </button>
                            <button onClick={() => handleSave('save_continue')} className="bg-[#457b92] text-white px-6 py-2 rounded hover:bg-[#346073]">
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
