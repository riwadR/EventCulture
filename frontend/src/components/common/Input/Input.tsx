import React, { forwardRef, ChangeEvent, FocusEvent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

interface InputProps {
  type?: string;
  label?: string;
  name: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  className?: string;
  [key: string]: any;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  fullWidth = true,
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputClasses = `
    input 
    ${error ? 'input--error' : ''}
    ${fullWidth ? 'input--full-width' : ''}
    ${className}
  `;

  const id = `input-${name}`;

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        required={required}
        {...props}
      />
      {error && <p className="input__error-message">{error}</p>}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

Input.displayName = 'Input';

export default Input; 