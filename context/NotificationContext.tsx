import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationToast, NotificationType } from '../components/NotificationToast';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((message: string, type: NotificationType) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type }]);
    }, []);

    const closeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                {notifications.map(notification => (
                    <div key={notification.id} className="pointer-events-auto">
                        <NotificationToast
                            id={notification.id}
                            message={notification.message}
                            type={notification.type}
                            onClose={closeNotification}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
