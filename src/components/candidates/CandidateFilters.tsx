// src/components/candidates/CandidateFilters.tsx
import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { Search, Filter } from 'lucide-react';

interface CandidateFiltersProps {
  filters: {
    search: string;
    stage: string;
    jobId: string;
  };
  onChange: (filters: any) => void;
}

const STAGES = [
  { value: 'applied', label: 'Applied' },
  { value: 'screen', label: 'Screening' },
  { value: 'tech', label: 'Technical' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' }
];

// ✅ Mock Jobs (fallback if API fails)
const SEED_JOBS = [
  { id: '1', title: 'Frontend Developer' },
  { id: '2', title: 'Backend Developer' },
  { id: '3', title: 'Fullstack Engineer' },
  { id: '4', title: 'Product Designer' },
  { id: '5', title: 'Data Scientist' }
];

export const CandidateFilters: React.FC<CandidateFiltersProps> = ({ filters, onChange }) => {
  const { data: jobsData, isLoading } = useJobs({ pageSize: 1000 });

  // ✅ Use API jobs if available, else fallback to mock
  const jobs = jobsData?.data?.length ? jobsData.data : SEED_JOBS;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ search: e.target.value });
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ stage: e.target.value });
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ jobId: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={handleStageChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Stages</option>
            {STAGES.map(stage => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

        {/* Job */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job
          </label>
          <select
            value={filters.jobId}
            onChange={handleJobChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading jobs...</p>}
        </div>
      </div>
    </div>
  );
};
