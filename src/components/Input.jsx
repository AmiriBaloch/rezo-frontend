import React, { forwardRef, useId } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder = "",
      className = "",
      name,
      required = true,
      suffix = null,
      ...props
    },
    ref
  ) => {
    const id = useId();
    return (
      <div className={`relative z-0 mb-5 group ${className}`}>
        <input
          type={type}
          className="block py-2.5 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer"
          placeholder={placeholder}
          name={name}
          required={required}
          id={id}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={id}
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          {label}
        </label>
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

export default Input;
