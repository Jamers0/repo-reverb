import React from 'react';

const Select = ({ 
  label, 
  id, 
  options = [], 
  className = '', 
  required = false, 
  error,
  helpText,
  placeholder = "Selecione...",
  ...props 
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        aria-describedby={error ? `${selectId}-error` : helpText ? `${selectId}-help` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-pw-green focus:border-pw-green sm:text-sm ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={option.value || index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${selectId}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Select;
