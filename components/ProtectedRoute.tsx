import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';

interface ProtectedRouteProps {
    adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
    const { user } = useStore();
    const { showNotification } = useNotification();
    const token = localStorage.getItem('qt_token');

    if (!user || !token) {
        // Prevent toast spam on initial load if just checking auth status
        // showNotification('Debes iniciar sesión para acceder a esta página', 'warning');
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !user.isAdmin) {
        showNotification('No tienes permisos de administrador', 'error');
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
