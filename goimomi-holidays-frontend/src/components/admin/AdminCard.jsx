import React from "react";
import PropTypes from "prop-types";

const AdminCard = ({ title, count, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className="text-3xl font-bold text-[#14532d] mt-2">{count}</p>
      </div>
      {icon && <div className="text-4xl text-gray-200">{icon}</div>}
    </div>
  );
};

AdminCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
};

export default AdminCard;
