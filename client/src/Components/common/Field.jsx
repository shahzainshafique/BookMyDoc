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
}) => {
  return (
    <div className="w-full">
      <label
        for={name}
        class="block mb-2 text-sm font-medium text-gray-900 light:text-white"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        {...register(regVal)}
        id={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
        placeholder={placeholder}
        required=""
      />
      {errors[regVal] && (
        <p className="text-xs italic text-red-500">{errors[regVal].message}</p>
      )}
    </div>
  );
};

export default Field;
