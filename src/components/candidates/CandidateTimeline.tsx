import React from 'react';
import { TimelineEntry } from '../../types';
import { format } from 'date-fns';
import { ArrowRight, Plus } from 'lucide-react';

interface CandidateTimelineProps {
  timeline: TimelineEntry[];
}

export const CandidateTimeline: React.FC<CandidateTimelineProps> = ({ timeline }) => {
  if (timeline.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No timeline entries found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((entry, index) => (
        <div key={entry.id} className="relative">
          {index < timeline.length - 1 && (
            <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-200 dark:bg-gray-600" />
          )}
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {entry.fromStage && (
                  <>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {entry.fromStage}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </>
                )}
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                  {entry.toStage}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {entry.notes}
              </p>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};