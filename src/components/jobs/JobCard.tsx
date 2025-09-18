import React from 'react';
import { Job } from '../../types';
import { useUpdateJob } from '../../hooks/useJobs';
import { useCandidates } from '../../hooks/useCandidates';
import { Badge } from '../ui/Badge';
import { Edit, Archive, ArchiveRestore, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';

interface JobCardProps {
  job: Job;
  onEdit: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  const updateMutation = useUpdateJob();
  const { data: candidatesData } = useCandidates({ jobId: job.id, pageSize: 1000 });
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleStatus = () => {
    updateMutation.mutate({
      id: job.id,
      status: job.status === 'active' ? 'archived' : 'active'
    });
  };

  const candidateCount = candidatesData?.total || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid="job-card"
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200',
        isDragging && 'shadow-lg scale-105 rotate-2'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {job.title}
              </h3>
              <Badge
                variant={job.status === 'active' ? 'success' : 'secondary'}
              >
                {job.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Slug: {job.slug}</span>
              <span>Order: {job.order}</span>
              <span>{candidateCount} candidates</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
          >
            <Edit className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleToggleStatus}
            disabled={updateMutation.isPending}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors disabled:opacity-50"
          >
            {job.status === 'active' ? (
              <Archive className="h-5 w-5" />
            ) : (
              <ArchiveRestore className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};