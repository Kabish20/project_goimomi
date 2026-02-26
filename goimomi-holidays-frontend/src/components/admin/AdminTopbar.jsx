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
    <div className="bg-[#14532d] text-white px-4 py-1 flex justify-between items-center sticky top-0 z-40 shadow-md border-b border-white/5 h-[44px]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] transition-all"
        >
          <ArrowLeft size={12} />
          Back
        </button>
        <span className="text-sm font-medium text-gray-200 uppercase tracking-widest border-l border-white/10 pl-3 opacity-90">Site Administration</span>
      </div>

      <div className="flex items-center gap-3 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
          <span className="text-sm font-medium text-gray-200 uppercase tracking-tight opacity-80">Welcome, <span className="text-white opacity-100">{username}</span></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-200 group-hover:text-white transition-colors opacity-80 hover:opacity-100 uppercase tracking-tight group"
          >
            <ExternalLink size={12} />
            View Site
          </button>

          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-200 group-hover:text-white transition-colors opacity-80 hover:opacity-100 uppercase tracking-tight group">
            <Key size={12} />
            Password
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-600 px-2 py-0.5 rounded-lg transition-all font-black uppercase tracking-wider shadow-sm"
          >
            <LogOut size={12} />
            Exit Admin
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminTopbar;
