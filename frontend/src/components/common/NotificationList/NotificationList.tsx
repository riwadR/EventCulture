import React from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import Alert from '../Alert/Alert';
import './NotificationList.scss';

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-list__item">
          <Alert
            type={notification.type}
            dismissible
            onDismiss={() => removeNotification(notification.id)}
          >
            {notification.message}
          </Alert>
        </div>
      ))}
    </div>
  );
};

export default NotificationList; 