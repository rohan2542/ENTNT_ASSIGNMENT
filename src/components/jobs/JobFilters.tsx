// import React from 'react';
// import { Search, Filter } from 'lucide-react';

// interface JobFiltersProps {
//   filters: {
//     search: string;
//     status: string;
//     tags: string[];
//     sort: string;
//   };
//   onChange: (filters: any) => void;
// }

// const COMMON_TAGS = [
//   'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Java',
//   'Senior', 'Junior', 'Remote', 'Full-time', 'Part-time', 'Contract',
//   'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Data Science'
// ];

// const SORT_OPTIONS = [
//   { value: 'title:asc', label: 'Title (A-Z)' },
//   { value: 'title:desc', label: 'Title (Z-A)' },
//   { value: 'createdAt:desc', label: 'Newest First' },
//   { value: 'createdAt:asc', label: 'Oldest First' }
// ];

// export const JobFilters: React.FC<JobFiltersProps> = ({ filters, onChange }) => {
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange({ search: e.target.value });
//   };

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     onChange({ status: e.target.value });
//   };

//   const handleTagToggle = (tag: string) => {
//     const newTags = filters.tags.includes(tag)
//       ? filters.tags.filter(t => t !== tag)
//       : [...filters.tags, tag];
//     onChange({ tags: newTags });
//   };

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     onChange({ sort: e.target.value });
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//       <div className="flex items-center space-x-2 mb-4">
//         <Filter className="h-5 w-5 text-gray-400" />
//         <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {/* Search */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Search
//           </label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               value={filters.search}
//               onChange={handleSearchChange}
//               placeholder="Search jobs..."
//               className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Status
//           </label>
//           <select
//             value={filters.status}
//             onChange={handleStatusChange}
//             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="archived">Archived</option>
//           </select>
//         </div>

//         {/* Sort */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Sort By
//           </label>
//           <select
//             value={filters.sort}
//             onChange={handleSortChange}
//             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             {SORT_OPTIONS.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Tags */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//           Tags
//         </label>
//         <div className="flex flex-wrap gap-2">
//           {COMMON_TAGS.map((tag) => {
//             const isSelected = filters.tags.includes(tag);
//             return (
//               <button
//                 key={tag}
//                 onClick={() => handleTagToggle(tag)}
//                 className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border
//                   ${isSelected
//                     ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
//                     : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
//                   }`}
//               >
//                 {tag}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };


// src/components/jobs/JobFilters.tsx
import React from "react";

interface JobFiltersProps {
  filters: any;
  onChange: (update: Partial<any>) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ filters, onChange }) => {
  const tags = [
    "JavaScript", "React", "TypeScript", "Node.js", "Python", "Java",
    "Senior", "Junior", "Remote", "Full-time", "Part-time", "Contract",
    "Frontend", "Backend", "Fullstack", "DevOps", "Data Science"
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
        <span className="text-gray-500">⚙️</span> Filters
      </h2>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm 
                     bg-gray-50 dark:bg-gray-700 
                     border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm 
                     bg-gray-50 dark:bg-gray-700 
                     border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="w-full px-3 py-2 border rounded-md text-sm 
                     bg-gray-50 dark:bg-gray-700 
                     border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-gray-100"
        >
          <option value="order:asc">Order ↑</option>
          <option value="order:desc">Order ↓</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() =>
                  onChange({
                    tags: selected
                      ? filters.tags.filter((t: string) => t !== tag)
                      : [...filters.tags, tag],
                  })
                }
                className={`px-3 py-1 text-xs rounded-full border transition 
                  ${
                    selected
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
