import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import usePageSEO from "../../../hooks/usePageSEO";
import api from "../../../api";
import { jwtDecode } from "jwt-decode";
import { User, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

/**
 * AdminLogin Component
 * Professional executive authentication portal for Goimomi Holidays administrators.
 * Supports both standalone full-page view (/admin, /admin-login) and modal overlay.
 */
const AdminLogin = ({ isOpen, onClose }) => {
  const isModal = typeof isOpen === "boolean";

  usePageSEO(
    isModal ? null : "Admin Portal Login | Goimomi Holidays",
    isModal ? null : "Secure executive access for Goimomi Holidays administrative management system.",
    null,
    isModal ? null : "admin login, travel portal management, Goimomi dashboard, executive access"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already authenticated on mount (only for standalone page or when modal is opened)
  useEffect(() => {
    // If it's a closed modal on a public page, NEVER auto-redirect to admin dashboard!
    if (isModal && !isOpen) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime && (decoded.is_staff || decoded.is_superuser)) {
          if (onClose) onClose();
          navigate("/admin/dashboard", { replace: true });
        }
      } catch {
        // Token invalid, stay on login
      }
    }
  }, [navigate, onClose, isModal, isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Clear old auth tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminUser");

    try {
      const response = await api.post(
        "/api/token/",
        {
          username: username.trim(),
          password: password,
        },
        { skipAuth: true }
      );

      if (response.data && response.data.access) {
        const user = jwtDecode(response.data.access);
        if (!user.is_staff && !user.is_superuser) {
          setError("Access Denied: Your account lacks administrator credentials.");
          setIsLoading(false);
          return;
        }
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("adminUser", JSON.stringify(user));

        if (onClose) onClose();
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login request error:", err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.detail ||
            err.response.data.error ||
            err.response.data.non_field_errors?.[0] ||
            "Invalid username or password. Please verify your credentials."
        );
      } else {
        setError("Unable to connect to the authentication server. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isModal && isOpen === false) return null;

  const cardContent = (
    <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in-95 duration-300">
      {/* Glow Effect behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 blur-xl opacity-70"></div>

      <div className="relative bg-[#0b1712]/90 backdrop-blur-2xl p-8 sm:p-9 rounded-3xl border border-emerald-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-left overflow-hidden">
        {/* Modal Close Button */}
        {isModal && onClose && (
          <button
            onClick={() => onClose()}
            className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header Branding */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-block group cursor-pointer" title="Go to Home Page">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              Goimomi <span className="text-emerald-400 font-bold group-hover:text-emerald-200">Admin</span>
            </h1>
          </Link>
          <p className="text-slate-400 mt-1 text-xs">
            Sign in to access your administrative dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/15 border border-red-500/30 backdrop-blur-md text-red-200 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2.5 animate-shake">
            <span className="shrink-0 text-red-400 font-bold">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block ml-0.5">
              Admin Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#13231c]/90 border border-emerald-900/60 rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-[#162a21] transition-all duration-200"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block ml-0.5">
              Secure Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#13231c]/90 border border-emerald-900/60 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-[#162a21] transition-all duration-200"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#062016] font-black py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.99] shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#062016] border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer link for full page */}
        {!isModal && (
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <ArrowLeft size={14} /> Back to Goimomi Holidays
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-md transition-all duration-300"
          onClick={() => onClose?.()}
        />
        {cardContent}
      </div>
    );
  }

  // Standalone Full Page View for /admin, /admin-login, /admin/login
  return (
    <div className="min-h-screen bg-[#06150f] relative flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with brand logo */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-[#062016] text-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            G
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">Goimomi Holidays</span>
        </Link>
      </div>

      {/* Main card */}
      {cardContent}

      {/* Footer copyright */}
      <div className="absolute bottom-4 text-center z-10">
        <p className="text-[10px] text-slate-500 font-medium">
          © {new Date().getFullYear()} Goimomi Holidays. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
