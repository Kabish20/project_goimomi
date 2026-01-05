import React from "react";
import { PlusCircle, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    title: "Authentication and Authorization",
    items: ["Users"],
  },
  {
    title: "Holidays",
    items: [
      "Destinations",
      "Enquiries",
      "Holiday Enquiries",
      "Holiday Packages",
      "Itinerary Masters",
      "Nationalities",
      "Starting Cities",
      "Umrah Destinations",
      "Umrah Enquiries",
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleAddDestination = () => {
    navigate("/admin/destinations/add");
  };

  const handleChangeDestination = () => {
    navigate("/admin/destinations");
  };

  const handleAddPackage = () => {
    navigate("/admin/packages/add");
  };

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  const handleAddHolidayEnquiry = () => {
    navigate("/admin/holiday-enquiries/add");
  };

  const handleAddUmrahEnquiry = () => {
    navigate("/admin/umrah-enquiries/add");
  };

  const handleChangePackage = () => {
    navigate("/admin/packages");
  };

  const handleChangeEnquiry = () => {
    navigate("/admin/enquiries");
  };

  const handleChangeHolidayEnquiry = () => {
    navigate("/admin/holiday-enquiries");
  };

  const handleChangeUmrahEnquiry = () => {
    navigate("/admin/umrah-enquiries");
  };

  const handleChangeStartingCity = () => {
    navigate("/admin/starting-cities");
  };

  const handleChangeItineraryMaster = () => {
    navigate("/admin/itinerary-masters");
  };

  const handleChangeNationalities = () => {
    navigate("/admin/nationalities");
  };

  const handleChangeUsers = () => {
    navigate("/admin/users");
  };

  const handleChangeUmrahDestinations = () => {
    navigate("/admin/umrah-destinations");
  };

  const handleAddUmrahDestinations = () => {
    navigate("/admin/umrah-destinations/add");
  };

  const handleAddStartingCity = () => {
    navigate("/admin/starting-cities/add");
  };

  const handleAddItineraryMaster = () => {
    navigate("/admin/itinerary-masters/add");
  };

  const handleAddNationality = () => {
    navigate("/admin/nationalities/add");
  };

  const getAddHandler = (item) => {
    switch (item) {
      case "Users":
        return handleAddUser;
      case "Destinations":
        return handleAddDestination;
      case "Holiday Packages":
        return handleAddPackage;
      case "Starting Cities":
        return handleAddStartingCity;
      case "Itinerary Masters":
        return handleAddItineraryMaster;
      case "Nationalities":
        return handleAddNationality;
      case "Holiday Enquiries":
        return handleAddHolidayEnquiry;
      case "Umrah Enquiries":
        return handleAddUmrahEnquiry;
      case "Umrah Destinations":
        return handleAddUmrahDestinations;
      default:
        return undefined;
    }
  };

  const getChangeHandler = (item) => {
    switch (item) {
      case "Users":
        return handleChangeUsers;
      case "Destinations":
        return handleChangeDestination;
      case "Holiday Packages":
        return handleChangePackage;
      case "Enquiries":
        return handleChangeEnquiry;
      case "Holiday Enquiries":
        return handleChangeHolidayEnquiry;
      case "Umrah Enquiries":
        return handleChangeUmrahEnquiry;
      case "Starting Cities":
        return handleChangeStartingCity;
      case "Itinerary Masters":
        return handleChangeItineraryMaster;
      case "Nationalities":
        return handleChangeNationalities;
      case "Umrah Destinations":
        return handleChangeUmrahDestinations;
      default:
        return undefined;
    }
  };

  const handleRowClick = (item) => {
    const handler = getChangeHandler(item);
    if (handler) handler();
  };

  return (
    <aside className="w-80 bg-[#0f2f1f] text-white min-h-screen p-4">
      <h2
        className="text-xl font-semibold mb-6 cursor-pointer hover:text-green-300 transition-colors"
        onClick={() => navigate("/admin-dashboard")}
      >
        ADMIN PORTAL
      </h2>

      {menu.map((section, idx) => (
        <div key={idx} className="mb-6">
          {/* Section Title */}
          <h3 className="bg-[#14532d] px-3 py-2 text-sm uppercase font-semibold rounded">
            {section.title}
          </h3>

          {/* Items */}
          <ul className="mt-2">
            {section.items.map((item, i) => (
              <li
                key={i}
                onClick={() => handleRowClick(item)}
                className={`flex justify-between items-center px-3 py-2 border-b border-gray-700 hover:bg-[#1f7a45] transition ${getChangeHandler(item) ? "cursor-pointer" : "cursor-default"
                  }`}
              >
                {/* Item Name */}
                <span className="text-sm">{item}</span>

                {/* Actions */}
                <div className="flex items-center gap-3 text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const handler = getAddHandler(item);
                      if (handler) handler();
                    }}
                    className="flex items-center gap-1 text-green-400 hover:underline"
                  >
                    <PlusCircle size={14} /> Add
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const handler = getChangeHandler(item);
                      if (handler) handler();
                    }}
                    className="flex items-center gap-1 text-yellow-400 hover:underline"
                  >
                    <Pencil size={14} /> Change
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default AdminSidebar;
