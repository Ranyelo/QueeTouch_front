import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationToastProps {
    id: string;
    message: string;
    type: NotificationType;
    onClose: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            case 'info':
            default:
                return <Info size={20} className="text-blue-500" />;
        }
    };

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full animate-in slide-in-from-right fade-in duration-300 ${getStyles()}`}>
            <div className="shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 text-sm font-medium">{message}</div>
            <button onClick={() => onClose(id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
            </button>
        </div>
    );
};
