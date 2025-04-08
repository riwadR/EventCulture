import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  onClick,
  variant = 'default',
  className = '',
  ...props
}) => {
  const cardClasses = `
    card
    card--${variant}
    ${onClick ? 'card--clickable' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card__content">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated']),
  className: PropTypes.string,
};

export default Card; 