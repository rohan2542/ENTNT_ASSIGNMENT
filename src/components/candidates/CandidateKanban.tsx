// // src/components/candidates/CandidateKanban.tsx
// import React, { useRef, useEffect, useState } from 'react';
// import { useCandidates, useUpdateCandidate } from '../../hooks/useCandidates';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { KanbanColumn } from './KanbanColumn';
// import { KanbanCard } from './KanbanCard';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { ChevronRight, ChevronLeft } from 'lucide-react';

// // const STAGES = [
//   // {/*  id: 'applied', title: 'Applied', color: 'bg-slate-200 dark:bg-slate-700' },
//   /* { id: 'screen', title: 'Screening', color: 'bg-sky-200 dark:bg-sky-900' },
//   { id: 'tech', title: 'Technical', color: 'bg-indigo-100 dark:bg-indigo-900' },
//   { id: 'offer', title: 'Offer', color: 'bg-violet-100 dark:bg-violet-900' },
//   { id: 'hired', title: 'Hired', color: 'bg-emerald-100 dark:bg-emerald-900' },
//   { id: 'rejected', title: 'Rejected', color: 'bg-rose-100 dark:bg-rose-900' }, */
//    const STAGES = [
//   { id: 'applied', title: 'Applied', color: 'bg-gray-50 border border-gray-200' },
//   { id: 'screen', title: 'Screening', color: 'bg-yellow-50 border border-yellow-200' },
//   { id: 'tech', title: 'Technical', color: 'bg-indigo-50 border border-indigo-200' },
//   { id: 'offer', title: 'Offer', color: 'bg-green-50 border border-green-200' },
//   { id: 'hired', title: 'Hired', color: 'bg-emerald-50 border border-emerald-200' },
//   { id: 'rejected', title: 'Rejected', color: 'bg-rose-50 border border-rose-200' },
// ];

// // ];

// // ✅ Mock seed candidates (fallback)
// const SEED_CANDIDATES = [
//   { id: '1', name: 'Alice Johnson', email: 'alice@example.com', stage: 'applied' },
//   { id: '2', name: 'Bob Smith', email: 'bob@example.com', stage: 'screen' },
//   { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', stage: 'tech' },
//   { id: '4', name: 'Dana White', email: 'dana@example.com', stage: 'offer' },
//   { id: '5', name: 'Evan Green', email: 'evan@example.com', stage: 'hired' },
//   { id: '6', name: 'Fiona Black', email: 'fiona@example.com', stage: 'rejected' },
// ];

// interface CandidateKanbanProps {
//   sidebarCollapsed: boolean;
// }

// export const CandidateKanban: React.FC<CandidateKanbanProps> = ({ sidebarCollapsed }) => {
//   const { data: candidatesData, isLoading } = useCandidates({ pageSize: 1000 });
//   const updateMutation = useUpdateCandidate();

//   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

//   // 🔹 Use API data if available, else fallback to mock
//   const candidates = candidatesData?.data?.length ? candidatesData.data : SEED_CANDIDATES;

//   // 🔹 Ref + state to check if scroll is needed
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     const updateScroll = () => {
//       setCanScrollLeft(el.scrollLeft > 0);
//       setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
//     };

//     updateScroll();
//     el.addEventListener('scroll', updateScroll);
//     window.addEventListener('resize', updateScroll);

//     return () => {
//       el.removeEventListener('scroll', updateScroll);
//       window.removeEventListener('resize', updateScroll);
//     };
//   }, []);

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over || !candidates) return;

//     const candidateId = active.id as string;
//     const newStage = over.id as string;

//     const candidate = candidates.find((c) => c.id === candidateId);
//     if (!candidate || candidate.stage === newStage) return;

//     updateMutation.mutate({ id: candidateId, stage: newStage as any });
//   };

//   if (isLoading && !candidatesData) {
//     return (
//       <div className="flex justify-center py-12">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   const candidatesByStage = STAGES.reduce((acc, stage) => {
//     acc[stage.id] = candidates.filter((c) => c.stage === stage.id);
//     return acc;
//   }, {} as Record<string, any[]>);

//   return (
//     <div className="space-y-6 flex-1 transition-all duration-300">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
//         <p className="mt-2 text-gray-600 dark:text-gray-400">
//           Drag candidates between stages to update their status
//         </p>
//       </div>

//       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         {/* 🔹 Container resizes when sidebar toggles */}
//         <div
//           ref={scrollRef}
//           className={`relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 ${
//             sidebarCollapsed ? 'max-w-[calc(100vw-5rem)]' : 'max-w-[calc(100vw-16rem)]'
//           }`}
//         >
//           <div className="flex space-x-6 min-w-max pr-6">
//             {STAGES.map((stage) => (
//               <KanbanColumn key={stage.id} id={stage.id} title={stage.title} color={stage.color}>
//                 <SortableContext
//                   items={candidatesByStage[stage.id].map((c) => c.id)}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   <div className="space-y-3">
//                     {candidatesByStage[stage.id].map((candidate) => (
//                       <KanbanCard key={candidate.id} candidate={candidate} />
//                     ))}
//                   </div>
//                 </SortableContext>
//               </KanbanColumn>
//             ))}
//           </div>

//           {/* 🔹 Left fade/arrow */}
//           {canScrollLeft && (
//             <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/80 dark:from-gray-900/80 pointer-events-none flex items-center">
//               <ChevronLeft className="w-5 h-5 text-gray-400 animate-pulse mx-auto" />
//             </div>
//           )}

//           {/* 🔹 Right fade/arrow */}
//           {canScrollRight && (
//             <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/80 dark:from-gray-900/80 pointer-events-none flex items-center">
//               <ChevronRight className="w-5 h-5 text-gray-400 animate-pulse mx-auto" />
//             </div>
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// };


// src/components/candidates/CandidateKanban.tsx
import React from 'react';
import { useCandidates, useUpdateCandidate } from '../../hooks/useCandidates';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// const STAGES = [
//   { id: 'applied', title: 'Applied', color: 'bg-slate-200 dark:bg-slate-700' },
//   { id: 'screen', title: 'Screening', color: 'bg-yellow-100 dark:bg-yellow-800' },
//   { id: 'tech', title: 'Technical', color: 'bg-indigo-100 dark:bg-indigo-900' },
//   { id: 'offer', title: 'Offer', color: 'bg-green-100 dark:bg-green-800' },
//   { id: 'hired', title: 'Hired', color: 'bg-emerald-100 dark:bg-emerald-900' },
//   { id: 'rejected', title: 'Rejected', color: 'bg-rose-100 dark:bg-rose-900' },
// ];

const STAGES = [
  { id: 'applied', title: 'Applied', color: 'bg-gray-100 dark:bg-gray-800' },       // Neutral Gray
  { id: 'screen', title: 'Screening', color: 'bg-blue-100 dark:bg-blue-900' },     // Blue
  { id: 'tech', title: 'Technical', color: 'bg-purple-100 dark:bg-purple-900' },   // Purple
  { id: 'offer', title: 'Offer', color: 'bg-teal-100 dark:bg-teal-900' },          // Teal
  { id: 'hired', title: 'Hired', color: 'bg-green-100 dark:bg-green-900' },        // Green
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100 dark:bg-red-900' },      // Red
];


// ✅ Mock seed candidates (fallback)
const SEED_CANDIDATES = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', stage: 'applied' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', stage: 'screen' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', stage: 'tech' },
  { id: '4', name: 'Dana White', email: 'dana@example.com', stage: 'offer' },
  { id: '5', name: 'Evan Green', email: 'evan@example.com', stage: 'hired' },
  { id: '6', name: 'Fiona Black', email: 'fiona@example.com', stage: 'rejected' },
];

interface CandidateKanbanProps {
  sidebarCollapsed: boolean;
}

export const CandidateKanban: React.FC<CandidateKanbanProps> = ({ sidebarCollapsed }) => {
  const { data: candidatesData, isLoading } = useCandidates({ pageSize: 1000 });
  const updateMutation = useUpdateCandidate();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  // 🔹 Use API data if available, else fallback to mock
  const candidates = candidatesData?.data?.length ? candidatesData.data : SEED_CANDIDATES;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !candidates) return;

    const candidateId = active.id as string;
    const newStage = over.id as string;

    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    updateMutation.mutate({ id: candidateId, stage: newStage as any });
  };

  if (isLoading && !candidatesData) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const candidatesByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = candidates.filter((c) => c.stage === stage.id);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6 flex-1 transition-all duration-300">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Drag candidates between stages to update their status
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* 🔹 Responsive grid layout */}
        <div
          className={`grid gap-6 ${
            sidebarCollapsed
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
          }`}
        >
          {STAGES.map((stage) => (
            <KanbanColumn key={stage.id} id={stage.id} title={stage.title} color={stage.color}>
              <SortableContext
                items={candidatesByStage[stage.id].map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
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
