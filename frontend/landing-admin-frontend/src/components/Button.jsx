import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, loading, className = '', ...props }) => (
  <button className={`inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white ${className}`} {...props}>
    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
    {children}
  </button>
);

export default Button;