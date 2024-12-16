import React from "react";

const Field = ({
  label,
  value,
  name,
  type,
  placeholder,
  register,
  regVal,
  errors,
  disabled,
  options, // New prop for select options
  ...props
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 light:text-white"
      >
        {label}
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          disabled={disabled}
          {...(register ? register(regVal) : {})}
          id={name}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
          {...props}
        >
          <option value="">Select {label}</option>
          {options && options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          disabled={disabled}
          {...(register ? register(regVal) : {})}
          id={name}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
          placeholder={placeholder}
          {...props}
        />
      )}
      
      {regVal && errors[regVal] && (
        <p className="text-xs italic text-red-500">{errors[regVal].message}</p>
      )}
    </div>
  );
};

export default Field;