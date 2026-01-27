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
    <div className="bg-[#14532d] text-white px-6 py-3 flex justify-between items-center sticky top-0 z-40 shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#1f7a45] hover:bg-[#2d9e5b] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-lg font-semibold border-l border-green-700 pl-4">Site Administration</h1>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="font-medium">Welcome, <span className="text-green-200">{username}</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 hover:text-green-200 transition-colors"
          >
            <ExternalLink size={14} />
            View Site
          </button>

          <button className="flex items-center gap-1.5 hover:text-green-200 transition-colors">
            <Key size={14} />
            Password
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminTopbar;
