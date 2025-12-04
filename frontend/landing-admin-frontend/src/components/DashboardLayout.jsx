import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
} from "lucide-react";

import Button from "./Button";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const location = useLocation();

  const toggleDark = () => {
    setDarkMode((v) => !v);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* SIDEBAR (MOBILE) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">LeadManager</h1>
          <button
            className="md:hidden p-2 dark:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className="p-4 space-y-6">

          {/* USER PROFILE */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
              <User />
            </div>
            <div>
              <p className="font-medium dark:text-white">{user?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg font-medium
                    transition-colors duration-200
                    ${active
                      ? "bg-primary-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* DARK MODE TOGGLE */}
          <Button
            className="w-full mt-6"
            variant="outline"
            onClick={toggleDark}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>

          {/* LOGOUT */}
          <Button className="w-full" onClick={logout} variant="danger">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center px-4 md:px-8 justify-between">
          <button
            className="md:hidden p-2 dark:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h2 className="text-xl font-semibold dark:text-white">
            {navItems.find((n) => n.path === location.pathname)?.name || "Dashboard"}
          </h2>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={toggleDark}>
              {darkMode ? "Light" : "Dark"}
            </Button>
            <Button onClick={logout} variant="danger">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
