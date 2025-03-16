import React from "react";

const Divider = () => {
  return (
    <div className="flex w-full items-center rounded-full">
      <div className="flex-1 border-b border-gray-300"></div>
      <span className="text-black text-sm font-semibold leading-8 px-8 py-3">
        Or
      </span>
      <div className="flex-1 border-b border-gray-300"></div>
    </div>
  );
};

export default Divider;
