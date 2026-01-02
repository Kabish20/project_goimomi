import React from "react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const username = user ? user.username : "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  return (
    <div className="bg-[#14532d] text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Site Administration</h1>

      <div className="text-sm space-x-4">
        <span>Welcome, {username}</span>
        <button onClick={() => navigate("/")} className="hover:underline">View Site</button>
        <button className="hover:underline">Change Password</button>
        <button onClick={handleLogout} className="hover:underline">Log out</button>
      </div>
    </div>
  );
};


export default AdminTopbar;
