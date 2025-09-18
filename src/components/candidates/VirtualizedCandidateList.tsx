import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Candidate } from '../../types';
import { CandidateRow } from './CandidateRow';

interface VirtualizedCandidateListProps {
  candidates: Candidate[];
  total: number;
}

export const VirtualizedCandidateList: React.FC<VirtualizedCandidateListProps> = ({
  candidates,
  total
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const candidate = candidates[index];
    
    if (!candidate) {
      return (
        <div style={style} className="flex items-center justify-center p-4">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-16" />
        </div>
      );
    }

    return (
      <div style={style}>
        <CandidateRow candidate={candidate} />
      </div>
    );
  };

  return (
    <div className="h-96">
      <List
        height={384}
        itemCount={Math.max(candidates.length, total)}
        itemSize={80}
        overscanCount={5}
      >
        {Row}
      </List>
    </div>
  );
};