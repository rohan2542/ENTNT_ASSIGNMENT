import React from 'react';
import { useCandidates, useUpdateCandidate } from '../../hooks/useCandidates';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const STAGES = [
  { id: 'applied', title: 'Applied', color: 'bg-gray-100 dark:bg-gray-700' },
  { id: 'screen', title: 'Screening', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'tech', title: 'Technical', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'offer', title: 'Offer', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 'hired', title: 'Hired', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100 dark:bg-red-900' }
];

export const CandidateKanban: React.FC = () => {
  const { data: candidatesData, isLoading } = useCandidates({ pageSize: 1000 });
  const updateMutation = useUpdateCandidate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !candidatesData) return;

    const candidateId = active.id as string;
    const newStage = over.id as string;

    // Find the candidate
    const candidate = candidatesData.data.find(c => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    // Update the candidate stage
    updateMutation.mutate({
      id: candidateId,
      stage: newStage as any
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const candidatesByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = candidatesData?.data.filter(c => c.stage === stage.id) || [];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Drag candidates between stages to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.title}
              color={stage.color}
            >
              <SortableContext
                items={candidatesByStage[stage.id].map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {candidatesByStage[stage.id].map((candidate) => (
                    <KanbanCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
};