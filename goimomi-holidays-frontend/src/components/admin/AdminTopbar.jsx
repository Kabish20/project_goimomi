import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Key, LogOut } from "lucide-react";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const username = user ? user.username : "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  return (
    <div className="bg-[#14532d] text-white px-6 py-2 flex justify-between items-center sticky top-0 z-40 shadow-md border-b border-white/5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="text-xs font-black uppercase tracking-widest border-l border-white/10 pl-4 opacity-90">Site Administration</span>
      </div>

      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
          <span className="font-bold uppercase tracking-tight opacity-80">Welcome, <span className="text-white opacity-100">{username}</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 hover:text-green-200 transition-colors opacity-80 hover:opacity-100 font-bold uppercase tracking-tight"
          >
            <ExternalLink size={14} />
            View Site
          </button>

          <button className="flex items-center gap-1.5 hover:text-green-200 transition-colors opacity-80 hover:opacity-100 font-bold uppercase tracking-tight">
            <Key size={14} />
            Password
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all font-black uppercase tracking-wider shadow-sm"
          >
            <LogOut size={14} />
            Exit Admin
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminTopbar;
