// src/components/jobs/JobsList.tsx
import React, { useState } from "react";
import { useJobs, useReorderJob } from "../../hooks/useJobs";
import { JobCard } from "./JobCard";
import { JobFilters } from "./JobFilters";
import { JobEditor } from "./JobEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export const JobsList: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    tags: [] as string[],
    page: 1,
    pageSize: 50,
    sort: "order:asc",
  });

  const { data, isLoading } = useJobs(filters);
  const jobs = data?.data || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const { mutate: reorderJob } = useReorderJob();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = jobs.findIndex((j) => j.id === active.id);
      const newIndex = jobs.findIndex((j) => j.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderJob({
          jobId: active.id,
          toOrder: jobs[newIndex].order,
        });
      }
    }
  };

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingJobId(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (jobId: string) => {
    setEditingJobId(jobId);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingJobId(null);
  };

  // Provide a merging onChange to ensure partial updates get merged into state
  const handleFilterChange = (update: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...update }));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Jobs
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-600"
        >
          + Create Job
        </button>
      </div>

      {/* Filters */}
      <JobFilters filters={filters} onChange={handleFilterChange} />

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={jobs.map((j) => j.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={() => handleEdit(job.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Job Editor */}
      {isEditorOpen && (
        <JobEditor jobId={editingJobId || undefined} onClose={handleCloseEditor} />
      )}
    </div>
  );
};
