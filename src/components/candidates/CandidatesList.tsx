// import React, { useState } from 'react';
// import { useCandidates } from '../../hooks/useCandidates';
// import { CandidateFilters } from './CandidateFilters';
// import { VirtualizedCandidateList } from './VirtualizedCandidateList';
// import { LoadingSpinner } from '../ui/LoadingSpinner';

// export const CandidatesList: React.FC = () => {
//   const [filters, setFilters] = useState({
//     search: '',
//     stage: '',
//     jobId: '',
//     pageSize: 1000
//   });

//   const { data: candidatesData, isLoading, error } = useCandidates(filters);

//   const handleFilterChange = (newFilters: Partial<typeof filters>) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//   };

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-red-600 text-lg font-medium">
//           Failed to load candidates
//         </div>
//         <div className="text-gray-500 mt-2">
//           {(error as Error).message}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidates</h1>
//         <p className="mt-2 text-gray-600 dark:text-gray-400">
//           View and manage candidate applications
//         </p>
//       </div>

//       <CandidateFilters
//         filters={filters}
//         onChange={handleFilterChange}
//       />

//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : (
//         <>
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Showing {candidatesData?.data.length || 0} of {candidatesData?.total || 0} candidates
//                 {filters.search && ` matching "${filters.search}"`}
//                 {filters.stage && ` in ${filters.stage} stage`}
//                 {filters.jobId && ` for selected job`}
//               </div>
//             </div>
            
//             <VirtualizedCandidateList
//               candidates={candidatesData?.data || []}
//               total={candidatesData?.total || 0}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };/* 

// // src/components/candidates/CandidatesList.tsx
// import React, { useState } from "react";
// import { useCandidates } from "../../hooks/useCandidates";
// import { LoadingSpinner } from "../ui/LoadingSpinner";

// export const CandidatesList: React.FC = () => {
//   const [filters, setFilters] = useState({
//     search: "",
//     stage: "",
//     job: "",
//     page: 1,
//     pageSize: 30,
//   });

//   const { data, isLoading } = useCandidates(filters);
//   const candidates = data?.data || [];

//   const handleFilterChange = (update: Partial<typeof filters>) => {
//     setFilters((prev) => ({ ...prev, ...update }));
//   };

//   return (
//     <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
//       {/* Sidebar Filters */}
//       <aside className="hidden md:block w-72 p-5 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm sticky top-16 h-screen overflow-y-auto">
//         <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
//           Filters
//         </h2>
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
//             value={filters.search}
//             onChange={(e) => handleFilterChange({ search: e.target.value })}
//           />

//           <select
//             className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
//             value={filters.stage}
//             onChange={(e) => handleFilterChange({ stage: e.target.value })}
//           >
//             <option value="">All Stages</option>
//             <option value="screen">Screen</option>
//             <option value="interview">Interview</option>
//             <option value="offer">Offer</option>
//             <option value="rejected">Rejected</option>
//           </select>

//           <select
//             className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
//             value={filters.job}
//             onChange={(e) => handleFilterChange({ job: e.target.value })}
//           >
//             <option value="">All Jobs</option>
//             <option value="frontend">Frontend</option>
//             <option value="backend">Backend</option>
//             <option value="devops">DevOps</option>
//           </select>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 px-10 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//             Candidates
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400">
//             Showing {candidates.length} candidates
//           </p>
//         </div>

//         {/* Candidates Grid */}
//         {isLoading ? (
//           <div className="flex justify-center py-12">
//             <LoadingSpinner />
//           </div>
//         ) : candidates.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400 text-center py-12">
//             No candidates found. Try adjusting filters.
//           </p>
//         ) : (
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {candidates.map((c) => (
//               <div
//                 key={c.id}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-5 flex flex-col justify-between transition transform hover:-translate-y-1"
//               >
//                 {/* Candidate Info */}
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-600 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-white">
//                     {c.name[0]}
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                       {c.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{c.email}</p>
//                   </div>
//                 </div>

//                 {/* Job + Stage */}
//                 <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
//                   {c.jobTitle}
//                 </p>
//                 <span
//                   className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
//                     c.stage === "offer"
//                       ? "bg-green-100 text-green-700"
//                       : c.stage === "screen"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : c.stage === "rejected"
//                       ? "bg-red-100 text-red-700"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {c.stage}
//                 </span>

//                 {/* Footer */}
//                 <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
//                   <span>Applied {c.appliedDate}</span>
//                   <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
//                     View →
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };
//  */



// // src/components/candidates/CandidatesList.tsx
// import React, { useState } from "react";
// import { useCandidates } from "../../hooks/useCandidates";
// import { LoadingSpinner } from "../ui/LoadingSpinner";

// export const CandidatesList: React.FC = () => {
//   const [filters, setFilters] = useState({
//     search: "",
//     stage: "",
//     job: "",
//   });

//   const { data, isLoading } = useCandidates(filters);
//   const candidates = data?.data || [];

//   const handleFilterChange = (update: Partial<typeof filters>) => {
//     setFilters((prev) => ({ ...prev, ...update }));
//   };

//   return (
//     <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
//       {/* Sidebar Filters */}
//       <aside className="hidden md:block w-72 p-5 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
//           Filters
//         </h2>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={filters.search}
//           onChange={(e) => handleFilterChange({ search: e.target.value })}
//           className="w-full px-3 py-2 mb-4 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//         />

//         {/* Stage */}
//         <select
//           value={filters.stage}
//           onChange={(e) => handleFilterChange({ stage: e.target.value })}
//           className="w-full px-3 py-2 mb-4 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//         >
//           <option value="">All Stages</option>
//           <option value="screen">Screen</option>
//           <option value="offer">Offer</option>
//           <option value="rejected">Rejected</option>
//           <option value="hired">Hired</option>
//         </select>

//         {/* Job */}
//         <select
//           value={filters.job}
//           onChange={(e) => handleFilterChange({ job: e.target.value })}
//           className="w-full px-3 py-2 mb-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//         >
//           <option value="">All Jobs</option>
//           <option value="frontend">Frontend Developer</option>
//           <option value="backend">Backend Developer</option>
//           <option value="devops">DevOps Engineer</option>
//         </select>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 px-8 py-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//             Candidates
//           </h1>
//           <span className="text-gray-600 dark:text-gray-400 text-sm">
//             Showing {candidates.length} candidates
//           </span>
//         </div>

//         {/* Candidates Grid */}
//         {isLoading ? (
//           <div className="flex justify-center py-10">
//             <LoadingSpinner />
//           </div>
//         ) : candidates.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400 text-center py-10">
//             No candidates found. Try adjusting filters.
//           </p>
//         ) : (
//           <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {candidates.map((c: any) => (
//               <div
//                 key={c.id}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-5 flex flex-col justify-between transition transform hover:-translate-y-1"
//               >
//                 {/* Candidate Info */}
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-600 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-white">
//                     {c.name[0]}
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                       {c.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       {c.email}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Stage Badge */}
//                 <span
//                   className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${
//                     c.stage === "offer"
//                       ? "bg-green-100 text-green-700"
//                       : c.stage === "screen"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : c.stage === "rejected"
//                       ? "bg-red-100 text-red-700"
//                       : c.stage === "hired"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {c.stage}
//                 </span>

//                 {/* Footer */}
//                 <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
//                   <span>Applied {c.appliedDate}</span>
//                   <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
//                     View →
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };



// // src/components/candidates/CandidatesList.tsx
// import React, { useState } from "react";
// import { useCandidates } from "../../hooks/useCandidates";
// import { LoadingSpinner } from "../ui/LoadingSpinner";

// export const CandidatesList: React.FC = () => {
//   const [filters, setFilters] = useState({
//     search: "",
//     stage: "",
//     job: "",
//   });

//   const { data, isLoading } = useCandidates(filters);
//   const candidates = data?.data || [];

//   const handleFilterChange = (update: Partial<typeof filters>) => {
//     setFilters((prev) => ({ ...prev, ...update }));
//   };

//   return (
//     <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
//       {/* Sidebar */}
//       <aside className="hidden md:block w-72 p-5 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
//           Filters
//         </h2>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={filters.search}
//           onChange={(e) => handleFilterChange({ search: e.target.value })}
//           className="w-full px-3 py-2 mb-4 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//         />

//         {/* Stage */}
//         <select
//           value={filters.stage}
//           onChange={(e) => handleFilterChange({ stage: e.target.value })}
//           className="w-full px-3 py-2 mb-4 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//         >
//           <option value="">All Stages</option>
//           <option value="screen">Screen</option>
//           <option value="offer">Offer</option>
//           <option value="rejected">Rejected</option>
//           <option value="hired">Hired</option>
//         </select>

//         {/* Job */}
//         <select
//           value={filters.job}
//           onChange={(e) => handleFilterChange({ job: e.target.value })}
//           className="w-full px-3 py-2 mb-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
//         >
//           <option value="">All Jobs</option>
//           <option value="frontend">Frontend Developer</option>
//           <option value="backend">Backend Developer</option>
//           <option value="devops">DevOps Engineer</option>
//         </select>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 px-8 py-6">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//             Candidates
//           </h1>
//           <span className="text-gray-600 dark:text-gray-400 text-sm">
//             Showing {candidates.length} candidates
//           </span>
//         </div>

//         {/* Candidates Grid */}
//         {isLoading ? (
//           <div className="flex justify-center py-10">
//             <LoadingSpinner />
//           </div>
//         ) : candidates.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400 text-center py-10">
//             No candidates found. Try adjusting filters.
//           </p>
//         ) : (
//           <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {candidates.map((c: any) => (
//               <div
//                 key={c.id}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-5 flex flex-col justify-between transition transform hover:-translate-y-1 min-h-[180px]"
//               >
//                 {/* Candidate Info */}
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-600 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-white">
//                     {c.name[0]}
//                   </div>
//                   <div className="max-w-[160px]">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
//                       {c.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
//                       {c.email}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Stage Badge */}
//                 <span
//                   className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 w-fit ${
//                     c.stage === "offer"
//                       ? "bg-green-100 text-green-700"
//                       : c.stage === "screen"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : c.stage === "rejected"
//                       ? "bg-red-100 text-red-700"
//                       : c.stage === "hired"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {c.stage}
//                 </span>

//                 {/* Footer */}
//                 <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
//                   <span className="truncate max-w-[100px]">
//                     Applied {c.appliedDate}
//                   </span>
//                   <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
//                     View →
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };


// src/components/candidates/CandidatesList.tsx
import React, { useState } from "react";
import { useCandidates } from "../../hooks/useCandidates";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export const CandidatesList: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    stage: "",
    job: "",
  });

  const { data, isLoading } = useCandidates(filters);
  const candidates = data?.data || [];

  const handleFilterChange = (update: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Sidebar */}
      <aside className="hidden md:block w-72 p-5 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Filters
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="w-full px-3 py-2 mb-4 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />

        {/* Stage */}
        <select
          value={filters.stage}
          onChange={(e) => handleFilterChange({ stage: e.target.value })}
          className="w-full px-3 py-2 mb-4 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Stages</option>
          <option value="screen">Screen</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>

        {/* Job */}
        <select
          value={filters.job}
          onChange={(e) => handleFilterChange({ job: e.target.value })}
          className="w-full px-3 py-2 mb-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Jobs</option>
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="devops">DevOps Engineer</option>
        </select>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Candidates
          </h1>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            Showing {candidates.length} candidates
          </span>
        </div>

        {/* Candidates List */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">
            No candidates found. Try adjusting filters.
          </p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
            {candidates.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-600 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-white">
                    {c.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {c.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {c.email}
                    </p>
                  </div>
                </div>

                {/* Middle Section */}
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      c.stage === "offer"
                        ? "bg-green-100 text-green-700"
                        : c.stage === "screen"
                        ? "bg-yellow-100 text-yellow-700"
                        : c.stage === "rejected"
                        ? "bg-red-100 text-red-700"
                        : c.stage === "hired"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {c.stage}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Applied {c.appliedDate}
                  </span>
                </div>

                {/* Right Section */}
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                  View →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
