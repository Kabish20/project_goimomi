import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Plus, Search, Edit, Trash2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();

    const API_BASE_URL = "/api";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get(`${API_BASE_URL}/users/`);
            setUsers(Array.isArray(response.data) ? response.data : (response.data?.results || []));
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleDelete = async () => {
        if (selectedUsers.length === 0) {
            alert("No items selected.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
            try {
                await Promise.all(
                    selectedUsers.map(id => api.delete(`${API_BASE_URL}/users/${id}/`))
                );
                setSelectedUsers([]);
                fetchUsers();
                alert("Successfully deleted selected user(s).");
            } catch (err) {
                console.error("Error deleting users:", err);
                alert("Error deleting some user(s).");
            }
        }
    };

    const handleSingleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`${API_BASE_URL}/users/${id}/`);
                fetchUsers();
                alert("User deleted successfully.");
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Error deleting user.");
            }
        }
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const toggleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex bg-gray-100 h-full overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <AdminTopbar />
                <div className="flex-1 overflow-y-auto p-4 bg-[#fcfdfc]">
                    <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center z-10 shadow-sm backdrop-blur-md bg-opacity-90 rounded-2xl mb-4">
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tighter">User Management</h1>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                                <span className="text-green-500">Auth</span> / <span>Users</span> / <span className="text-gray-900">Permissions</span>
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/admin/users/add")}
                            className="px-6 py-2 rounded-full bg-[#14532d] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={14} />
                            ADD USER
                        </button>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            {/* Search */}
                            <div className="mb-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="relative group max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#14532d] transition-colors" size={16} />
                                    <input
                                        placeholder="Search by username or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-100 pl-11 pr-10 py-2.5 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:ring-8 focus:ring-[#14532d]/5 focus:border-[#14532d] hover:border-gray-200 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center gap-2 mb-4 text-xs">
                                <span className="text-gray-600">Action:</span>
                                <select className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none min-w-[180px]">
                                    <option value="">---------</option>
                                    <option value="delete">Delete selected users</option>
                                </select>
                                <button
                                    onClick={handleDelete}
                                    className="border border-gray-300 rounded px-3 py-1 bg-white hover:bg-gray-50 font-semibold"
                                >
                                    Go
                                </button>
                                <span className="text-gray-500 ml-2">{selectedUsers.length} of {filteredUsers.length} selected</span>
                            </div>

                            {/* Table */}
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-green-900/5 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-6 py-4 border-b border-gray-100 w-10 text-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={toggleSelectAll}
                                                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Username</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-left">Email Address</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Staff Status</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-50">
                                        {filteredUsers.map((u) => (
                                            <tr
                                                key={u.id}
                                                className={`group hover:bg-[#fcfdfc] transition-colors ${selectedUsers.includes(u.id) ? "bg-amber-50" : ""}`}
                                            >
                                                <td className="px-6 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(u.id)}
                                                        onChange={() => toggleSelectUser(u.id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#14532d] focus:ring-[#14532d]"
                                                    />
                                                </td>
                                                <td className="px-6 py-3 text-xs font-black text-gray-900">
                                                    {u.username}
                                                </td>
                                                <td className="px-6 py-3 text-xs font-bold text-gray-400">{u.email || "-"}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex justify-center">
                                                        {u.is_staff ? (
                                                            <div className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[8px] font-black uppercase tracking-wider border border-green-100">Staff</div>
                                                        ) : (
                                                            <div className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 text-[8px] font-black uppercase tracking-wider border border-gray-100">Member</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#14532d] hover:text-white transition-all shadow-sm"
                                                            onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                                                            title="Edit User"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            onClick={() => handleSingleDelete(u.id)}
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{filteredUsers.length} users</p>
                        </div>

                        {/* Filter Sidebar */}
                        <div className="w-56 bg-white shadow-xl shadow-green-900/5 rounded-2xl border border-gray-100 overflow-hidden shrink-0 mt-[105px]">
                            <div className="bg-gray-50 px-5 py-3 font-black text-[9px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">FILTER PANEL</div>
                            <div className="p-5 text-xs space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-[#14532d] uppercase tracking-widest mb-3 opacity-60">By staff status</p>
                                    <div className="space-y-2 pl-1">
                                        <p className="text-[#14532d] font-black text-[10px] cursor-pointer bg-green-50 px-2 py-1 rounded-md border border-green-100">All Users</p>
                                        <p className="text-gray-400 font-bold text-[10px] hover:text-[#14532d] cursor-pointer px-2 py-1 transition-colors uppercase tracking-wider">Staff Only</p>
                                        <p className="text-gray-400 font-bold text-[10px] hover:text-[#14532d] cursor-pointer px-2 py-1 transition-colors uppercase tracking-wider">Regular Members</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-600 mb-1">By superuser status</p>
                                    <div className="space-y-1 pl-2">
                                        <p className="text-[#333] font-bold">All</p>
                                        <p className="text-[#447e9b] cursor-pointer hover:underline">Yes</p>
                                        <p className="text-[#447e9b] cursor-pointer hover:underline">No</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-600 mb-1">By active</p>
                                    <div className="space-y-1 pl-2">
                                        <p className="text-[#333] font-bold">All</p>
                                        <p className="text-[#447e9b] cursor-pointer hover:underline">Yes</p>
                                        <p className="text-[#447e9b] cursor-pointer hover:underline">No</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
