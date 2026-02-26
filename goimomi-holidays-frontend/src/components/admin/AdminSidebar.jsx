import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Pencil,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Users,
  Globe,
  MessageSquare,
  Package,
  MapPin,
  FileText,
  Truck,
  LayoutDashboard,
  Flag,
  Sun,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    title: "Auth",
    items: [
      { name: "Users", icon: <Users size={18} /> }
    ],
  },
  {
    title: "Holidays",
    items: [
      {
        name: "Countries",
        icon: <Globe size={18} />,
        isDropdown: true,
        children: [
          { name: "Manage Countries", key: "Countries" },
          { name: "Holiday Destinations", key: "Destinations" },
          { name: "Umrah Destinations" },
        ]
      },
      {
        name: "Enquiries",
        icon: <MessageSquare size={18} />,
        isDropdown: true,
        children: [
          { name: "All Enquiries", key: "Enquiries" },
          { name: "Cab Enquiries" },
          { name: "Cruise Enquiries" },
          { name: "Hotel Enquiries" },
          { name: "Holiday Enquiries" },
          { name: "Umrah Enquiries" },
        ]
      },
      {
        name: "Holiday Packages",
        icon: <Package size={18} />,
        isDropdown: true,
        children: [
          { name: "Manage Packages", key: "Holiday Packages" },
          { name: "Itinerary Masters" },
        ]
      },
      { name: "Nationalities", icon: <Flag size={18} /> },

      { name: "Starting Cities", icon: <MapPin size={18} /> },
      {
        name: "Visas",
        icon: <FileText size={18} />,
        isDropdown: true,
        children: [
          { name: "Manage Visas", key: "Visas" },
          { name: "Visa Applications" },
        ]
      },
      { name: "Suppliers", icon: <Truck size={18} /> },
      { name: "Cruise Calendar", icon: <Calendar size={18} /> },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  const toggleDropdown = (name) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleAddDestination = () => navigate("/admin/destinations/add");
  const handleChangeDestination = () => navigate("/admin/destinations");
  const handleAddPackage = () => navigate("/admin/packages/add");
  const handleAddUser = () => navigate("/admin/users/add");
  const handleAddHolidayEnquiry = () => navigate("/admin/holiday-enquiries/add");
  const handleAddUmrahEnquiry = () => navigate("/admin/umrah-enquiries/add");
  const handleAddVisa = () => navigate("/admin/visas/add");
  const handleChangePackage = () => navigate("/admin/packages");
  const handleChangeEnquiry = () => navigate("/admin/enquiries");
  const handleChangeHolidayEnquiry = () => navigate("/admin/holiday-enquiries");
  const handleChangeUmrahEnquiry = () => navigate("/admin/umrah-enquiries");
  const handleChangeVisa = () => navigate("/admin/visas");
  const handleChangeVisaApplication = () => navigate("/admin/visa-applications");
  const handleChangeStartingCity = () => navigate("/admin/starting-cities");
  const handleChangeItineraryMaster = () => navigate("/admin/itinerary-masters");
  const handleChangeNationalities = () => navigate("/admin/nationalities");
  const handleChangeUsers = () => navigate("/admin/users");
  const handleChangeUmrahDestinations = () => navigate("/admin/umrah-destinations");
  const handleChangeCabEnquiry = () => navigate("/admin/cab-enquiries");
  const handleChangeCruiseEnquiry = () => navigate("/admin/cruise-enquiries");
  const handleChangeHotelEnquiry = () => navigate("/admin/hotel-enquiries");
  const handleAddUmrahDestinations = () => navigate("/admin/umrah-destinations/add");
  const handleAddStartingCity = () => navigate("/admin/starting-cities/add");
  const handleAddItineraryMaster = () => navigate("/admin/itinerary-masters/add");
  const handleAddNationality = () => navigate("/admin/nationalities/add");
  const handleAddCruiseCalendar = () => navigate("/admin/cruise-calendar/add");

  const getAddHandler = (item) => {
    const key = typeof item === 'string' ? item : (item.key || item.name);
    switch (key) {
      case "Users": return handleAddUser;
      case "Destinations": return handleAddDestination;
      case "Holiday Packages": return handleAddPackage;
      case "Starting Cities": return handleAddStartingCity;
      case "Itinerary Masters": return handleAddItineraryMaster;
      case "Nationalities": return handleAddNationality;
      case "Holiday Enquiries": return handleAddHolidayEnquiry;
      case "Umrah Enquiries": return handleAddUmrahEnquiry;
      case "Umrah Destinations": return handleAddUmrahDestinations;
      case "Visas": return handleAddVisa;
      case "Countries": return () => navigate("/admin/countries/add");
      case "Suppliers": return () => navigate("/admin/suppliers/add");
      case "Cruise Calendar": return handleAddCruiseCalendar;
      default: return undefined;
    }
  };

  const getChangeHandler = (item) => {
    const key = typeof item === 'string' ? item : (item.key || item.name);
    switch (key) {
      case "Users": return handleChangeUsers;
      case "Destinations": return handleChangeDestination;
      case "Holiday Packages": return handleChangePackage;
      case "Enquiries": return handleChangeEnquiry;
      case "Holiday Enquiries": return handleChangeHolidayEnquiry;
      case "Umrah Enquiries": return handleChangeUmrahEnquiry;
      case "Starting Cities": return handleChangeStartingCity;
      case "Itinerary Masters": return handleChangeItineraryMaster;
      case "Nationalities": return handleChangeNationalities;
      case "Umrah Destinations": return handleChangeUmrahDestinations;
      case "Cab Enquiries": return handleChangeCabEnquiry;
      case "Cruise Enquiries": return handleChangeCruiseEnquiry;
      case "Hotel Enquiries": return handleChangeHotelEnquiry;
      case "Visas": return handleChangeVisa;
      case "Visa Applications": return handleChangeVisaApplication;
      case "Countries": return () => navigate("/admin/countries");
      case "Suppliers": return () => navigate("/admin/suppliers");
      case "Cruise Calendar": return () => navigate("/admin/cruise-calendar");
      default: return undefined;
    }
  };

  const handleRowClick = (item) => {
    if (item.isDropdown) {
      toggleDropdown(item.name);
      return;
    }
    const handler = getChangeHandler(item);
    if (handler) handler();
  };

  const renderItem = (item, isChild = false) => {
    const isDropdown = item.isDropdown;
    const isOpen = openDropdowns[item.name];

    return (
      <div key={item.name}>
        <li
          onClick={() => handleRowClick(item)}
          className={`group flex justify-between items-center px-2 py-1.5 border-b border-white/5 hover:bg-white/10 transition-all ${getChangeHandler(item) || isDropdown ? "cursor-pointer" : "cursor-default"
            } ${isChild ? "pl-7 bg-black/10" : ""}`}
          title={isCollapsed ? item.name : ""}
        >
          <div className="flex items-center gap-2">
            <div className="text-green-400 group-hover:scale-110 transition-transform shrink-0">
              {item.icon || (isChild && <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />)}
            </div>
            {!isCollapsed && (
              <>
                {isDropdown && (isOpen ? <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-200 transition-colors" /> : <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-200 transition-colors" />)}
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-none">{item.name}</span>
              </>
            )}
          </div>

          {!isCollapsed && !isChild && (
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
              {getAddHandler(item) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const handler = getAddHandler(item);
                    if (handler) handler();
                  }}
                  className="text-green-400 hover:text-green-300"
                >
                  Add
                </button>
              )}
              {getChangeHandler(item) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const handler = getChangeHandler(item);
                    if (handler) handler();
                  }}
                  className="text-amber-400 hover:text-amber-300"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </li>
        {isDropdown && isOpen && !isCollapsed && (
          <ul className="animate-in slide-in-from-top-2 duration-200">
            {item.children.map(child => renderItem(child, true))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`${isCollapsed ? "w-14" : "w-60"} bg-[#14532d] text-white h-full transition-all duration-300 ease-in-out border-r border-white/10 flex flex-col z-50`}
    >
      {/* Header */}
      <div className={`p-3 flex items-center ${isCollapsed ? "justify-center" : "justify-between"} border-b border-white/10`}>
        {!isCollapsed && (
          <h2
            className="text-sm font-bold tracking-widest text-gray-200 cursor-pointer hover:text-white transition-colors uppercase"
            onClick={() => navigate("/")}
          >
            GOIMOMI <span className="opacity-80 font-medium">ADMIN</span>
          </h2>
        )}
        {isCollapsed && (
          <div onClick={() => navigate("/")} className="cursor-pointer bg-[#1f7a45] w-7 h-7 rounded flex items-center justify-center font-bold text-xs">G</div>
        )}
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#14532d] border border-white/10 text-white rounded-full p-1 shadow-xl hover:bg-[#1a6338] hover:scale-110 transition-all z-[60]"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menu.map((section, idx) => (
          <div key={idx} className="mt-4 mb-1">
            {!isCollapsed && (
              <h3 className="px-4 py-1.5 text-sm font-medium text-gray-200 uppercase tracking-widest opacity-60">
                {section.title}
              </h3>
            )}
            {isCollapsed && <div className="h-[1px] bg-white/5 mx-4 my-2" />}

            <ul className="mt-2">
              {section.items.map((item) => renderItem(item))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer / Dash Link */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"} p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all group`}
          title="Dashboard"
        >
          <LayoutDashboard size={16} className="text-green-400" />
          {!isCollapsed && <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Dashboard Hub</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
