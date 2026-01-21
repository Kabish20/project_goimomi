import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User, Lock, ArrowRight, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post("/api/token/", {
                username,
                password,
            });

            if (response.data.access) {
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                const user = jwtDecode(response.data.access);
                localStorage.setItem("adminUser", JSON.stringify(user));
                navigate("/admin-dashboard");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.detail || err.response.data.error || "Login failed.");
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: "url('/login-bg.png')" }}
        >
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 text-white flex items-center gap-3 animate-in fade-in slide-in-from-left duration-700">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <ShieldCheck className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Goimomi Holidays</h1>
                    <p className="text-xs text-white/70 uppercase tracking-widest">Administrator Portal</p>
                </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[360px] mx-4 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/20 rounded-full mb-3 border border-green-500/30">
                            <Lock className="text-green-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Admin Login</h2>
                        <p className="text-white/60 mt-1 text-xs uppercase tracking-widest">Secure Access</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 backdrop-blur-md text-red-100 rounded-xl text-[11px] text-center flex items-center justify-center gap-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/60 uppercase ml-1 tracking-wider">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="text-white/40 group-focus-within:text-green-400 transition-colors" size={16} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/60 uppercase ml-1 tracking-wider">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="text-white/40 group-focus-within:text-green-400 transition-colors" size={16} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative bg-green-600 hover:bg-green-50 text-green-600 font-bold hover:text-[#14532d] py-2.5 rounded-xl text-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 overflow-hidden border border-green-500/20"
                            style={{ backgroundColor: isLoading ? '#16a34a' : 'white' }}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-white">Verifying...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
