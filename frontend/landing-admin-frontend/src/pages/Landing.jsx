// Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeroAnimated from '../components/HeroAnimated';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">LeadManager</div>
          <nav className="space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-700">Login</Link>
            <Link to="/contact" className="text-sm font-medium text-primary-600">Contact</Link>
          </nav>
        </div>
      </header>

      <main>
        <HeroAnimated />

        <section id="features" className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold mb-2">Collect Leads</h3>
            <p className="text-sm text-gray-600">Capture project requests from your landing page and manage them in one place.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold mb-2">Export CSV</h3>
            <p className="text-sm text-gray-600">Export leads to CSV for easy reporting and offline processing.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold mb-2">Auto Responses</h3>
            <p className="text-sm text-gray-600">Automated reply to customers and admin notifications out-of-the-box.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-sm text-gray-500">Built for developers and agencies — fast to deploy, easy to scale.</p>
        </section>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LeadManager — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
