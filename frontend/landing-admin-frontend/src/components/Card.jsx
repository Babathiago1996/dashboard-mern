import React from "react";
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow p-4 border ${className}`}>
    {children}
  </div>
);
export default Card;
