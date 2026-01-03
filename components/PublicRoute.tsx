import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const PublicRoute: React.FC = () => {
    const { user } = useStore();
    const token = localStorage.getItem('qt_token');

    if (user && token) {
        // Redirect based on role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/membership" replace />;
    }

    return <Outlet />;
};
