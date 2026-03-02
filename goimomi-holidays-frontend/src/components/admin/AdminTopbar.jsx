import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Key, LogOut, Menu } from "lucide-react";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const username = user ? user.username : "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('admin-sidebar-toggle'));
  };

  return (
    <div className="bg-[#14532d] text-white px-4 py-1 flex justify-between items-center sticky top-0 z-40 shadow-md border-b border-white/5 h-[44px]">
      <div className="flex items-center gap-1.5 md:gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center shrink-0"
          title="Toggle Menu"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 md:px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] transition-all shrink-0"
        >
          <ArrowLeft size={12} />
          <span className="hidden xs:inline">Back</span>
        </button>

        <span className="text-[11px] md:text-sm font-medium text-gray-200 uppercase tracking-widest border-l border-white/10 pl-2 md:pl-3 opacity-90 truncate max-w-[120px] md:max-w-none">Administration</span>
      </div>

      <div className="flex items-center gap-2 md:gap-3 text-xs font-medium min-w-0">
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
          <span className="text-[11px] md:text-sm font-medium text-gray-200 uppercase tracking-tight opacity-80">Hi, <span className="text-white opacity-100">{username}</span></span>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-[11px] md:text-sm font-medium text-gray-200 transition-colors opacity-80 hover:opacity-100 uppercase tracking-tight group p-1.5 md:p-0"
            title="View Site"
          >
            <ExternalLink size={14} className="md:w-[12px] md:h-[12px]" />
            <span className="hidden md:inline">View Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-600 px-2 py-1 md:py-0.5 rounded-lg transition-all font-black uppercase tracking-wider shadow-sm text-[10px]"
          >
            <LogOut size={12} />
            <span className="hidden xs:inline">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminTopbar;
