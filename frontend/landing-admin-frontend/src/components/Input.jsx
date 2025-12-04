import React, { forwardRef } from "react";

const Input = forwardRef(({ label, error, ...props }, ref) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={`w-full px-4 py-2 border rounded-md ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

Input.displayName = "Input";
export default Input;
