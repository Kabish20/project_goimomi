import React, { useState, useEffect } from "react";
import { 
  HelpCircle, Phone, Ship, Building2, Calendar, CreditCard, Package, RefreshCw,
  ClipboardList, Globe
} from "lucide-react";
import api from "../../api";
import AdminCard from "./AdminCard";

const AdminStatsOverview = () => {
  const [stats, setStats] = useState({
    packages: 0,
    itineraryMasters: 0,
    visas: 0,
    visaApplications: 0,
    enquiries: 0,
    cabEnquiries: 0,
    cruiseEnquiries: 0,
    hotelEnquiries: 0,
    holidayEnquiries: 0,
    umrahEnquiries: 0,
    cantonEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [genRes, holidayRes, umrahRes, visaRes, cantonRes, pkgRes, itinRes, visasMasterRes] = await Promise.all([
        api.get("/api/enquiry-form/").catch(() => ({ data: [] })),
        api.get("/api/holiday-form/").catch(() => ({ data: [] })),
        api.get("/api/umrah-form/").catch(() => ({ data: [] })),
        api.get("/api/visa-applications/").catch(() => ({ data: [] })),
        api.get("/api/canton-enquiries/").catch(() => ({ data: [] })),
        api.get("/api/packages/").catch(() => ({ data: [] })),
        api.get("/api/itinerary-masters/").catch(() => ({ data: [] })),
        api.get("/api/visas/").catch(() => ({ data: [] })),
      ]);

      const enquiries = Array.isArray(genRes.data) ? genRes.data : [];
      setStats({
        packages: Array.isArray(pkgRes.data) ? pkgRes.data.length : 0,
        itineraryMasters: Array.isArray(itinRes.data) ? itinRes.data.length : 0,
        visas: Array.isArray(visasMasterRes.data) ? visasMasterRes.data.length : 0,
        visaApplications: Array.isArray(visaRes.data) ? visaRes.data.length : 0,
        enquiries: enquiries.length,
        cabEnquiries: enquiries.filter(e => e.enquiry_type === "Cab").length,
        cruiseEnquiries: enquiries.filter(e => e.enquiry_type === "Cruise").length,
        hotelEnquiries: enquiries.filter(e => e.enquiry_type === "Hotel").length,
        holidayEnquiries: Array.isArray(holidayRes.data) ? holidayRes.data.length : 0,
        umrahEnquiries: Array.isArray(umrahRes.data) ? umrahRes.data.length : 0,
        cantonEnquiries: Array.isArray(cantonRes.data) ? cantonRes.data.length : 0,
      });
    } catch (err) {
      console.error("Error fetching stats overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Enquiry Stats Row (Priority 1) */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 bg-[#14532d] rounded-full"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#14532d]">Customer Enquiries</h3>
          </div>
          <button 
             onClick={fetchStats}
             className="text-[9px] font-black text-gray-400 hover:text-[#14532d] transition-all flex items-center gap-1.5 uppercase tracking-widest"
          >
            <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
            Sync
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <AdminCard title="General Enq" count={stats.enquiries} link="/admin/general-enquiries" icon={<HelpCircle />} />
          <AdminCard title="Cab Enq" count={stats.cabEnquiries} link="/admin/cab-enquiries" icon={<Phone />} />
          <AdminCard title="Cruise Enq" count={stats.cruiseEnquiries} link="/admin/cruise-enquiries" icon={<Ship />} />
          <AdminCard title="Hotel Enq" count={stats.hotelEnquiries} link="/admin/hotel-enquiries" icon={<Building2 />} />
          <AdminCard title="Holiday Enq" count={stats.holidayEnquiries} link="/admin/holiday-enquiries" icon={<Calendar />} />
          <AdminCard title="Umrah Enq" count={stats.umrahEnquiries} link="/admin/umrah-enquiries" icon={<Building2 />} />
          <AdminCard title="Visa Apps" count={stats.visaApplications} link="/admin/visa-applications" icon={<CreditCard />} />
          <AdminCard title="Canton Enq" count={stats.cantonEnquiries} link="/admin/canton-enquiries" icon={<Package />} />
        </div>
      </div>

      {/* Core Inventory Stats Row (Priority 2) */}
      <div className="px-1">
        <div className="flex items-center gap-2 mb-2 px-1">
            <div className="h-1 w-3 bg-[#14532d]/40 rounded-full"></div>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-[#14532d]/60">System Inventory</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
          <AdminCard title="Packages" count={stats.packages} link="/admin/packages" icon={<Package />} />
          <AdminCard title="Itinerary" count={stats.itineraryMasters} link="/admin/itinerary-masters" icon={<ClipboardList />} />
          <AdminCard title="Visas" count={stats.visas} link="/admin/visas" icon={<Globe />} />
          <AdminCard title="Visa Apps" count={stats.visaApplications} link="/admin/visa-applications" icon={<CreditCard />} />
        </div>
      </div>
    </div>
  );
};

export default AdminStatsOverview;
