import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
    const token = localStorage.getItem('accessToken');
    let isAuthenticated = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp > currentTime) {
                isAuthenticated = true;
            } else {
                // Token expired
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("adminUser");
            }
        } catch (error) {
            // Invalid token
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("adminUser");
        }
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
