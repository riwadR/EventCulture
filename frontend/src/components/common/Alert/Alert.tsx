import React from 'react';
import './Alert.scss';

interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  [key: string]: any;
}

const Alert = ({
  children,
  type = 'info',
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}: AlertProps) => {
  const alertClasses = `
    alert
    alert--${type}
    ${className}
  `;

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="alert__content">{children}</div>
      {dismissible && (
        <button
          type="button"
          className="alert__close"
          aria-label="Fermer"
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert; 