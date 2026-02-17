import React from "react";
import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";

const AdminCard = ({ title, count, icon, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between group relative overflow-hidden ${link ? "cursor-pointer hover:border-green-500 hover:shadow-lg transition-all duration-300" : ""}`}
      onClick={() => link && navigate(link)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-[#14532d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex flex-col z-10">
        <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-[#14532d] transition-colors">{title}</h4>
        <p className="text-2xl font-black text-gray-800 tracking-tighter">{count}</p>
      </div>
      {icon && (
        <div className="text-gray-100 group-hover:text-green-500/20 transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12 flex shrink-0 ml-4">
          {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
        </div>
      )}
    </div>
  );
};

AdminCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
};

export default AdminCard;
