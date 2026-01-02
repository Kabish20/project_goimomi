import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Plus, Search, Edit, Trash2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import axios from "axios";
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
            const response = await axios.get(`${API_BASE_URL}/users/`);
            setUsers(response.data);
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
                    selectedUsers.map(id => axios.delete(`${API_BASE_URL}/users/${id}/`))
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
                await axios.delete(`${API_BASE_URL}/users/${id}/`);
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
        <div className="flex bg-gray-100 min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 mr-6">
                            <h1 className="text-xl font-semibold text-gray-800 mb-4">Select user to change</h1>

                            {/* Search */}
                            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded shadow-sm">
                                <div className="flex gap-2 w-full max-w-md">
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            placeholder="Search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="bg-white border border-gray-300 pl-10 pr-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#14532d]"
                                        />
                                    </div>
                                    <button className="bg-[#14532d] text-white px-4 rounded text-sm font-semibold hover:bg-[#0f4a24]">Search</button>
                                </div>

                                <button onClick={() => navigate("/admin/users/add")} className="flex items-center gap-2 bg-[#99c0ce] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-[#7a9aa6]">
                                    <Plus size={16} /> ADD USER
                                </button>
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
                            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden text-[#555]">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#dfd7ca] text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                                        <tr>
                                            <th className="p-3 w-10 text-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={toggleSelectAll}
                                                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                />
                                            </th>
                                            <th className="p-3 text-[#b42918] cursor-pointer hover:underline">USERNAME</th>
                                            <th className="p-3 text-[#b42918] cursor-pointer hover:underline">EMAIL ADDRESS</th>
                                            <th className="p-3 text-[#b42918] cursor-pointer hover:underline">STAFF STATUS</th>
                                            <th className="p-3 text-center text-[#b42918]">ACTIONS</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.map((u, i) => (
                                            <tr
                                                key={i}
                                                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${selectedUsers.includes(u.id) ? "bg-[#ffffcc]" : ""}`}
                                            >
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(u.id)}
                                                        onChange={() => toggleSelectUser(u.id)}
                                                    />
                                                </td>
                                                <td className="p-3 text-[#b42918] font-semibold cursor-pointer hover:underline">
                                                    {u.username}
                                                </td>
                                                <td className="p-3 text-gray-600">{u.email || "-"}</td>
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center">
                                                        {u.is_staff ? (
                                                            <CheckCircle className="text-green-600" size={18} />
                                                        ) : (
                                                            <XCircle className="text-red-400" size={18} />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                                                            title="Edit User"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                            onClick={() => handleSingleDelete(u.id)}
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={20} />
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
                        <div className="w-64 bg-white shadow rounded overflow-hidden">
                            <div className="bg-[#f8f8f8] px-4 py-2 font-semibold text-sm text-gray-700 border-b">FILTER</div>
                            <div className="p-4 text-xs space-y-4">
                                <div>
                                    <p className="font-semibold text-gray-600 mb-1">By staff status</p>
                                    <div className="space-y-1 pl-2">
                                        <p className="text-[#333] font-bold">All</p>
                                        <p className="text-[#447e9b] cursor-pointer hover:underline">Yes</p>
                                        <p className="text-[#447e9b] cursor-pointer hover:underline">No</p>
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
