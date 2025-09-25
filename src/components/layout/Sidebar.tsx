// src/components/layout/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Briefcase,
  Users,
  ClipboardList,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Kanban", href: "/kanban", icon: ClipboardList },
  { name: "Assessments", href: "/assessments", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const seedDatabase = async () => {
    try {
      const { seedDatabase } = await import("../../lib/seed-data");
      await seedDatabase();
      window.location.reload();
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
  };

  const isActive = (href: string) => {
    // exact match or starts with href + '/' to handle nested routes like /jobs/123
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
        </div>
      )}

      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out bg-gradient-to-b from-slate-900 to-blue-900 text-white",
          collapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">TalentFlow</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-gray-800"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={onClose}
                >
                  <item.icon
                    className={clsx(
                      "h-6 w-6 flex-shrink-0 transition-colors duration-200",
                      active ? "text-white" : "text-gray-400"
                    )}
                  />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-700 p-4">
            <button
              onClick={seedDatabase}
              className={clsx(
                "flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors",
                collapsed
                  ? "justify-center"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Database className="h-5 w-5 text-gray-400" />
              {!collapsed && <span className="ml-3">Reseed Database</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
