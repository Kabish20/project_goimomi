import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/api/admin-login/", {
                username,
                password,
            });

            if (response.data.success) {
                // Store user info/token if needed
                localStorage.setItem("adminUser", JSON.stringify(response.data.user));
                navigate("/admin-dashboard");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error);
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-green-100">
                <h2 className="text-2xl font-bold text-center text-[#14532d] mb-6">
                    Admin Login
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14532d] focus:border-transparent outline-none transition"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#14532d] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0f4a24] transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
