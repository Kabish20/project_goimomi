import React from "react";
import PlanTripHolidays from "../pages/Holidaysform.jsx";
import UmrahForm from "../pages/umrahform.jsx";

const FormModal = ({ isOpen, onClose, packageType }) => {
  if (!isOpen) return null;

  const isUmrah = packageType && packageType.toLowerCase().includes("umrah");

  return isUmrah ? (
    <UmrahForm
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
  );
};

export default FormModal;
