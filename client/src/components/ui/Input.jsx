import React from 'react';

const Input = ({ label, type = 'text', className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;