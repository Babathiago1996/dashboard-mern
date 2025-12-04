// NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found.</p>
        <Link to="/" className="text-primary-600 font-medium">Return to home</Link>
      </div>
    </div>
  );
}