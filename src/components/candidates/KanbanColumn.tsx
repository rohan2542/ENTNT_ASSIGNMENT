import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  children: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, color, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id
  });

  return (
    <div
      ref={setNodeRef}
      data-testid="kanban-column"
      data-stage={id}
      className={`${color} rounded-lg p-4 min-h-96 transition-colors ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};