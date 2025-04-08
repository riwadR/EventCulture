export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  [key: string]: any;
}

export interface NotificationOptions {
  id?: string;
  type?: NotificationType;
  duration?: number;
  [key: string]: any;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification | NotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (message: string, options?: NotificationOptions) => string;
  showError: (message: string, options?: NotificationOptions) => string;
  showInfo: (message: string, options?: NotificationOptions) => string;
  showWarning: (message: string, options?: NotificationOptions) => string;
} 