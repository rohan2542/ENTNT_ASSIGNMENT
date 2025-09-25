// // src/components/Header.tsx
// import React, { useEffect, useState } from "react";
// import {
//   Menu,
//   Bell,
//   Search,
//   User,
//   ChevronDown,
// } from "lucide-react";

// interface HeaderProps {
//   onMenuClick: () => void;
// }

// export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [name, setName] = useState("HR Manager");
//   const [email, setEmail] = useState("hr@company.com");

//   // 🔹 Load from localStorage on mount
//   useEffect(() => {
//     const savedName = localStorage.getItem("profileName");
//     const savedEmail = localStorage.getItem("profileEmail");
//     if (savedName) setName(savedName);
//     if (savedEmail) setEmail(savedEmail);

//     // 🔹 Listen for profile updates
//     const handleProfileUpdate = () => {
//       const updatedName = localStorage.getItem("profileName");
//       const updatedEmail = localStorage.getItem("profileEmail");
//       if (updatedName) setName(updatedName);
//       if (updatedEmail) setEmail(updatedEmail);
//     };

//     window.addEventListener("profileUpdated", handleProfileUpdate);
//     return () => {
//       window.removeEventListener("profileUpdated", handleProfileUpdate);
//     };
//   }, []);

//   return (
//     <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 justify-between items-center">
//           {/* Left side */}
//           <div className="flex items-center">
//             <button
//               type="button"
//               className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onClick={onMenuClick}
//             >
//               <Menu className="h-6 w-6" />
//             </button>

//             {/* Search */}
//             <div className="hidden lg:flex lg:items-center lg:space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             {/* Notifications */}
//             <button
//               type="button"
//               className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//             >
//               <Bell className="h-6 w-6" />
//             </button>

//             {/* User Profile */}
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setProfileOpen(!profileOpen)}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 {/* Avatar */}
//                 <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
//                   <User className="h-5 w-5 text-green-600 dark:text-green-300" />
//                 </div>
//                 {/* Name & Email */}
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                     {name}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {email}
//                   </p>
//                 </div>
//                 <ChevronDown className="h-4 w-4 text-gray-500" />
//               </button>

//               {/* Dropdown Menu */}
//               {profileOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 z-50">
//                   <ul className="py-2">
//                     <li>
//                       <a
//                         href="/settings"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         Settings
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="/profile"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         Profile
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };



// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("HR Manager");
  const [email, setEmail] = useState("hr@company.com");

  // 🔹 Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("profileName");
    const savedEmail = localStorage.getItem("profileEmail");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);

    // 🔹 Listen for profile updates
    const handleProfileUpdate = () => {
      const updatedName = localStorage.getItem("profileName");
      const updatedEmail = localStorage.getItem("profileEmail");
      if (updatedName) setName(updatedName);
      if (updatedEmail) setEmail(updatedEmail);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* 🔹 App Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="/logo.png" // put your logo in public/logo.png
                alt="TalentFlow Logo"
                className="h-8 w-8"
              />
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                TalentFlow
              </span>
            </a>

            {/* Search */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4 ml-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Bell className="h-6 w-6" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                {/* Name & Email */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {email}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 z-50">
                  <ul className="py-2">
                    <li>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
