// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { Sidebar } from './Sidebar';
// import { Header } from './Header';

// export const Layout: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       <div className="lg:pl-64">
//         <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
//         <main className="py-6">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };


//layout .tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar on the left */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="py-6 flex-1">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
