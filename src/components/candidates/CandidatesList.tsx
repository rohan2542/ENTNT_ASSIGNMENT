import React, { useState } from 'react';
import { useCandidates } from '../../hooks/useCandidates';
import { CandidateFilters } from './CandidateFilters';
import { VirtualizedCandidateList } from './VirtualizedCandidateList';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const CandidatesList: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    stage: '',
    jobId: '',
    pageSize: 50
  });

  const { data: candidatesData, isLoading, error } = useCandidates(filters);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">
          Failed to load candidates
        </div>
        <div className="text-gray-500 mt-2">
          {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and manage candidate applications
        </p>
      </div>

      <CandidateFilters
        filters={filters}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {candidatesData?.data.length || 0} of {candidatesData?.total || 0} candidates
                {filters.search && ` matching "${filters.search}"`}
                {filters.stage && ` in ${filters.stage} stage`}
                {filters.jobId && ` for selected job`}
              </div>
            </div>
            
            <VirtualizedCandidateList
              candidates={candidatesData?.data || []}
              total={candidatesData?.total || 0}
            />
          </div>
        </>
      )}
    </div>
  );
};