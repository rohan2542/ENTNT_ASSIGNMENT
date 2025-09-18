import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate } from '../../types';
import { useJobs } from '../../hooks/useJobs';
import { Badge } from '../ui/Badge';
import { User, Mail, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface CandidateRowProps {
  candidate: Candidate;
}

const STAGE_COLORS = {
  applied: 'default',
  screen: 'warning',
  tech: 'info',
  offer: 'success',
  hired: 'success',
  rejected: 'error'
} as const;

export const CandidateRow: React.FC<CandidateRowProps> = ({ candidate }) => {
  const { data: jobsData } = useJobs({ pageSize: 1000 });
  const job = jobsData?.data.find(j => j.id === candidate.jobId);

  return (
    <div 
      data-testid="candidate-row"
      className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {candidate.name}
            </h4>
            <Badge variant={STAGE_COLORS[candidate.stage]}>
              {candidate.stage}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{candidate.email}</span>
            </div>
            
            {job && (
              <span>• {job.title}</span>
            )}
            
            <span>• Applied {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>
      
      <Link
        to={`/candidates/${candidate.id}`}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
};