import React from "react";
import PlanTripHolidays from "../pages/Holidaysform.jsx";
import PlanTripUmrah from "../pages/umrahform.jsx";

const FormModal = ({ isOpen, onClose, packageType }) => {
  if (!isOpen) return null;

  const isUmrah = packageType && packageType.toLowerCase().includes("umrah");

  return (
    <div className="bg-white w-full max-w-[1400px] h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-8">
      {isUmrah ? (
        <PlanTripUmrah
          packageType={packageType}
          isOpen={isOpen}
          onClose={onClose}
        />
      ) : (
        <PlanTripHolidays
          packageType={packageType}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default FormModal;
