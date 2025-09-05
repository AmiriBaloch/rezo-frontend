import React from "react";

const Container = ({ children }) => {
  return (
    <div className="bg-[url(/bg.jpg)] bg-cover min-h-screen opacity-90 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-800 opacity-95 text-white p-4 px-4 md:px-12 rounded-lg shadow-lg w-sm md:w-xl text-center border-2 border-black">
          <img src="/logo.svg" alt="" className="w-40 mx-auto" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Container;
