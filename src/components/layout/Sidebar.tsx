// // src/components/layout/Sidebar.tsx
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   X,
//   Briefcase,
//   Users,
//   ClipboardList,
//   Settings,
//   Database,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
// } from "lucide-react";
// import clsx from "clsx";

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const navigation = [
//   { name: "Jobs", href: "/jobs", icon: Briefcase },
//   { name: "Candidates", href: "/candidates", icon: Users },
//   { name: "Kanban", href: "/kanban", icon: ClipboardList },
//   { name: "Assessments", href: "/assessments", icon: FileText },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);

//   const seedDatabase = async () => {
//     try {
//       const { seedDatabase } = await import("../../lib/seed-data");
//       await seedDatabase();
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to seed database:", error);
//     }
//   };

//   const isActive = (href: string) => {
//     // exact match or starts with href + '/' to handle nested routes like /jobs/123
//     return location.pathname === href || location.pathname.startsWith(href + '/');
//   };

//   return (
//     <>
//       {isOpen && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50"
//             onClick={onClose}
//           />
//         </div>
//       )}

//       <div
//         className={clsx(
//           "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out bg-gradient-to-b from-slate-900 to-blue-900 text-white",
//           collapsed ? "w-20" : "w-64",
//           isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         )}
//       >
//         <div className="flex h-full flex-col">
//           <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
//             {!collapsed && (
//               <div className="flex items-center space-x-2">
//                 <Briefcase className="h-8 w-8 text-blue-400" />
//                 <span className="text-xl font-bold">TalentFlow</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="p-2 rounded-md hover:bg-gray-800"
//             >
//               {collapsed ? (
//                 <ChevronRight className="h-5 w-5" />
//               ) : (
//                 <ChevronLeft className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           <nav className="flex-1 space-y-1 px-2 py-4">
//             {navigation.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={clsx(
//                     "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
//                     active
//                       ? "bg-blue-600 text-white"
//                       : "text-gray-300 hover:bg-gray-800 hover:text-white"
//                   )}
//                   onClick={onClose}
//                 >
//                   <item.icon
//                     className={clsx(
//                       "h-6 w-6 flex-shrink-0 transition-colors duration-200",
//                       active ? "text-white" : "text-gray-400"
//                     )}
//                   />
//                   {!collapsed && <span className="ml-3">{item.name}</span>}
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="flex-shrink-0 border-t border-gray-700 p-4">
//             <button
//               onClick={seedDatabase}
//               className={clsx(
//                 "flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors",
//                 collapsed
//                   ? "justify-center"
//                   : "text-gray-300 hover:bg-gray-800 hover:text-white"
//               )}
//             >
//               <Database className="h-5 w-5 text-gray-400" />
//               {!collapsed && <span className="ml-3">Reseed Database</span>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;



// // src/components/layout/Sidebar.tsx
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Briefcase,
//   Users,
//   ClipboardList,
//   Settings,
//   Database,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
// } from "lucide-react";
// import clsx from "clsx";

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const navigation = [
//   { name: "Jobs", href: "/jobs", icon: Briefcase },
//   { name: "Candidates", href: "/candidates", icon: Users },
//   { name: "Kanban", href: "/kanban", icon: ClipboardList },
//   { name: "Assessments", href: "/assessments", icon: FileText },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);

//   const seedDatabase = async () => {
//     try {
//       const { seedDatabase } = await import("../../lib/seed-data");
//       await seedDatabase();
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to seed database:", error);
//     }
//   };

//   const isActive = (href: string) => {
//     return location.pathname === href || location.pathname.startsWith(href + "/");
//   };

//   return (
//     <>
//       {isOpen && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50"
//             onClick={onClose}
//           />
//         </div>
//       )}

//       <div
//         className={clsx(
//           "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out bg-brand-sidebar text-brand-text",
//           collapsed ? "w-20" : "w-64",
//           isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         )}
//       >
//         <div className="flex h-full flex-col">
//           <div className="flex h-16 items-center justify-between px-4 border-b border-brand-muted/30">
//             {!collapsed && (
//               <div className="flex items-center space-x-2">
//                 <Briefcase className="h-8 w-8 text-brand-accent" />
//                 <span className="text-xl font-bold">TalentFlow</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="p-2 rounded-md hover:bg-brand-bg"
//             >
//               {collapsed ? (
//                 <ChevronRight className="h-5 w-5" />
//               ) : (
//                 <ChevronLeft className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           <nav className="flex-1 space-y-1 px-2 py-4">
//             {navigation.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={clsx(
//                     "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
//                     active
//                       ? "bg-brand-accent text-white"
//                       : "text-brand-muted hover:bg-brand-bg hover:text-brand-text"
//                   )}
//                   onClick={onClose}
//                 >
//                   <item.icon
//                     className={clsx(
//                       "h-6 w-6 flex-shrink-0 transition-colors duration-200",
//                       active ? "text-white" : "text-brand-muted"
//                     )}
//                   />
//                   {!collapsed && <span className="ml-3">{item.name}</span>}
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="flex-shrink-0 border-t border-brand-muted/30 p-4">
//             <button
//               onClick={seedDatabase}
//               className={clsx(
//                 "flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors",
//                 collapsed
//                   ? "justify-center"
//                   : "text-brand-muted hover:bg-brand-bg hover:text-brand-text"
//               )}
//             >
//               <Database className="h-5 w-5 text-brand-muted" />
//               {!collapsed && <span className="ml-3">Reseed Database</span>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;



// // src/components/layout/Sidebar.tsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Briefcase,
//   Users,
//   ClipboardList,
//   Settings,
//   Database,
//   FileText,
// } from "lucide-react";
// import clsx from "clsx";

// const navigation = [
//   { name: "Jobs", href: "/jobs", icon: Briefcase },
//   { name: "Candidates", href: "/candidates", icon: Users },
//   { name: "Kanban", href: "/kanban", icon: ClipboardList },
//   { name: "Assessments", href: "/assessments", icon: FileText },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];

// export const Sidebar: React.FC = () => {
//   const location = useLocation();

//   const seedDatabase = async () => {
//     try {
//       const { seedDatabase } = await import("../../lib/seed-data");
//       await seedDatabase();
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to seed database:", error);
//     }
//   };

//   const isActive = (href: string) =>
//     location.pathname === href || location.pathname.startsWith(href + "/");

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Briefcase className="h-7 w-7 text-blue-400" />
//             <span className="text-lg font-bold">TalentFlow</span>
//           </div>

//           {/* Navigation */}
//           <nav className="flex space-x-6">
//             {navigation.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={clsx(
//                     "flex items-center space-x-1 text-sm font-medium transition-colors",
//                     active
//                       ? "text-blue-400 border-b-2 border-blue-400"
//                       : "text-gray-300 hover:text-white"
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Right section */}
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={seedDatabase}
//               className="flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
//             >
//               <Database className="h-4 w-4 text-gray-400" />
//               <span>Reseed</span>
//             </button>

//             <div className="flex items-center space-x-2">
//               <img
//                 src="https://ui-avatars.com/api/?name=HR+Manager"
//                 alt="profile"
//                 className="h-8 w-8 rounded-full"
//               />
//               <span className="hidden md:block text-sm font-medium">
//                 HR Manager
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Sidebar;


// // src/components/layout/Sidebar.tsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Briefcase,
//   Users,
//   ClipboardList,
//   Settings,
//   Database,
//   FileText,
// } from "lucide-react";
// import clsx from "clsx";

// const navigation = [
//   { name: "Jobs", href: "/jobs", icon: Briefcase },
//   { name: "Candidates", href: "/candidates", icon: Users },
//   { name: "Kanban", href: "/kanban", icon: ClipboardList },
//   { name: "Assessments", href: "/assessments", icon: FileText },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];

// export const Sidebar: React.FC = () => {
//   const location = useLocation();

//   const seedDatabase = async () => {
//     try {
//       const { seedDatabase } = await import("../../lib/seed-data");
//       await seedDatabase();
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to seed database:", error);
//     }
//   };

//   const isActive = (href: string) =>
//     location.pathname === href || location.pathname.startsWith(href + "/");

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-gray-100 shadow">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Briefcase className="h-7 w-7 text-gray-300" />
//             <span className="text-lg font-bold">TalentFlow</span>
//           </div>

//           {/* Navigation */}
//           <nav className="flex space-x-6">
//             {navigation.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={clsx(
//                     "flex items-center space-x-1 text-sm font-medium transition-colors",
//                     active
//                       ? "text-white border-b-2 border-gray-300"
//                       : "text-gray-400 hover:text-gray-200"
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Right section */}
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={seedDatabase}
//               className="flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
//             >
//               <Database className="h-4 w-4 text-gray-400" />
//               <span>Reseed</span>
//             </button>

//             <div className="flex items-center space-x-2">
//               <img
//                 src="https://ui-avatars.com/api/?name=HR+Manager&background=374151&color=fff"
//                 alt="profile"
//                 className="h-8 w-8 rounded-full"
//               />
//               <span className="hidden md:block text-sm font-medium">
//                 HR Manager
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Sidebar;


// // src/components/layout/Sidebar.tsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Briefcase,
//   Users,
//   ClipboardList,
//   Settings,
//   Database,
//   FileText,
// } from "lucide-react";
// import clsx from "clsx";

// const navigation = [
//   { name: "Jobs", href: "/jobs", icon: Briefcase },
//   { name: "Candidates", href: "/candidates", icon: Users },
//   { name: "Kanban", href: "/kanban", icon: ClipboardList },
//   { name: "Assessments", href: "/assessments", icon: FileText },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];

// export const Sidebar: React.FC = () => {
//   const location = useLocation();

//   const seedDatabase = async () => {
//     try {
//       const { seedDatabase } = await import("../../lib/seed-data");
//       await seedDatabase();
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to seed database:", error);
//     }
//   };

//   const isActive = (href: string) =>
//     location.pathname === href || location.pathname.startsWith(href + "/");

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 shadow-lg">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Briefcase className="h-7 w-7 text-gray-300" />
//             <span className="text-xl font-bold tracking-wide">TalentFlow</span>
//           </div>

//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {navigation.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={clsx(
//                     "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
//                     active
//                       ? "bg-gray-700 text-white shadow-sm"
//                       : "text-gray-400 hover:text-white hover:bg-gray-800"
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Right section */}
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={seedDatabase}
//               className="hidden sm:flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition"
//             >
//               <Database className="h-4 w-4" />
//               <span>Reseed</span>
//             </button>

//             <div className="flex items-center space-x-2">
//               <img
//                 src="https://ui-avatars.com/api/?name=HR+Manager&background=374151&color=fff"
//                 alt="profile"
//                 className="h-8 w-8 rounded-full border-2 border-gray-600 shadow-sm"
//               />
//               <span className="hidden md:block text-sm font-medium">
//                 HR Manager
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Sidebar;



// src/components/layout/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  Users,
  ClipboardList,
  Settings,
  Sparkles,
  Database,
  FileText,
} from "lucide-react";
import clsx from "clsx";


const navigation = [
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Kanban", href: "/kanban", icon: ClipboardList },
  { name: "Assessments", href: "/assessments", icon: FileText },
  // { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const seedDatabase = async () => {
    try {
      const { seedDatabase } = await import("../../lib/seed-data");
      await seedDatabase();
      window.location.reload();
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
  };

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <Briefcase className="h-7 w-7 text-gray-300" /> */}
            <a href="/" className="flex items-center gap-2">
  <Sparkles className="h-6 w-6 text-indigo-400" /> {/* new logo */}
  <span className="font-bold text-white">TalentFlow</span>
</a>
            {/* <span className="text-xl font-bold tracking-wide">TalentFlow</span> */}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gray-700 text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={seedDatabase}
              className="hidden sm:flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition"
            >
              <Database className="h-4 w-4" />
              <span>Reseed</span>
            </button>

            <div className="flex items-center space-x-2">
              <img
                src="https://ui-avatars.com/api/?name=HR+Manager&background=374151&color=fff"
                alt="profile"
                className="h-8 w-8 rounded-full border-2 border-gray-600 shadow-sm"
              />
              <span className="hidden md:block text-sm font-medium">
                HR Manager
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Sidebar;
