import React from "react";

const AuthBtn = ({
  children,
  onClick,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      className={`bg-primary hover:opacity-80 text-white font-bold text-xl font-primary mt-4 mx-auto py-1 px-4 rounded-lg transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-95 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default AuthBtn;
