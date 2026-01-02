import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if user is logged in
    // In AdminLogin.jsx we set: localStorage.setItem("adminUser", JSON.stringify(response.data.user));
    const user = JSON.parse(localStorage.getItem('adminUser'));

    // Basic check: user must exist and have an ID.
    // Since our backend only logs in staff, this is a reasonable check for now.
    // For more security, you could store a token and validate it, but this mirrors the basic auth flow request.
    const isAuthenticated = user && user.id;

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
