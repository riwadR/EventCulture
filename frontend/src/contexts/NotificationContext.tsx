import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Notification, 
  NotificationOptions, 
  NotificationContextType 
} from '../types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification | NotificationOptions): string => {
    const id = (notification as Notification).id || notification.id || uuidv4();
    const newNotification: Notification = {
      ...notification,
      id,
      type: notification.type || 'info',
      duration: notification.duration || 5000, // 5 secondes par défaut
      message: (notification as Notification).message || '',
    };

    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string): void => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback((): void => {
    setNotifications([]);
  }, []);

  // Fonctions utilitaires pour les différents types de notifications
  const showSuccess = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      return addNotification({ type: 'success', message, ...options });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      return addNotification({ type: 'error', message, ...options });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      return addNotification({ type: 'info', message, ...options });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string, options: NotificationOptions = {}): string => {
      return addNotification({ type: 'warning', message, ...options });
    },
    [addNotification]
  );

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

export default NotificationContext; 