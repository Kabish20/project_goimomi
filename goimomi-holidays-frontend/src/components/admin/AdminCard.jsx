import React from "react";

const AdminCard = ({ title, count }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-gray-600 text-sm">{title}</h4>
      <p className="text-3xl font-bold text-[#14532d] mt-2">{count}</p>
    </div>
  );
};

export default AdminCard;
