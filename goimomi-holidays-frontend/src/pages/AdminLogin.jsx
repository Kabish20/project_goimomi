import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User, Lock, ArrowRight, ShieldCheck } from "lucide-react";

const AdminLogin = ({ isOpen, onClose }) => {
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

                if (onClose) onClose();
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

    if (isOpen === false) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Overlay for better contrast */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500"
                onClick={() => onClose?.()}
            ></div>

            {/* Login Card */}
            <div className="w-full max-w-[360px] relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden relative">
                    {/* Close Button */}
                    {onClose && (
                        <button
                            onClick={() => onClose?.()}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4 border border-green-500/30">
                            <Lock className="text-green-400" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Admin Login</h2>
                        <p className="text-white/40 mt-1.5 text-xs uppercase tracking-[0.2em] font-medium">Secure Access</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-red-500/20 border border-red-500/40 backdrop-blur-md text-red-100 rounded-2xl text-[11px] text-center font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/50 uppercase ml-1 tracking-widest">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                                    <User className="text-white/30 group-focus-within:text-green-400 transition-colors" size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/50 uppercase ml-1 tracking-widest">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                                    <Lock className="text-white/30 group-focus-within:text-green-400 transition-colors" size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative bg-white hover:bg-green-500 text-[#14532d] hover:text-white font-bold py-3.5 rounded-2xl text-sm transition-all duration-500 transform active:scale-[0.98] shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 overflow-hidden border border-white/20 mt-4"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-[#14532d] border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={18} />
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
