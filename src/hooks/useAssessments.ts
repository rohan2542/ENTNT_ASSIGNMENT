// src/hooks/useAssessments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Assessment, AssessmentResponse, ApiError } from '../types';
import { db } from '../lib/database';
import toast from 'react-hot-toast';

// revive dates helper
const reviveAssessment = (a: any): Assessment => ({
  ...a,
  createdAt: a.createdAt ? new Date(a.createdAt) : undefined,
  updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(),
  sections: (a.sections || []).map((s: any) => ({
    ...s,
    questions: (s.questions || []).map((q: any) => ({
      ...q,
      conditionalLogic: Array.isArray(q.conditionalLogic)
        ? q.conditionalLogic
        : q.conditionalLogic
        ? [q.conditionalLogic]
        : [],
    })),
  })),
});

const fetchAssessment = async (idOrJobId: string): Promise<Assessment | null> => {
  if (!idOrJobId) return null;

  // try local db first: check jobId then id
  const local =
    (await db.assessments.where('jobId').equals(idOrJobId).first()) ||
    (await db.assessments.where('id').equals(idOrJobId).first());
  if (local) return reviveAssessment(local);

  // try API endpoints (first /api/assessments/:jobId then by-id)
  let response = await fetch(`/api/assessments/${idOrJobId}`);
  if (!response.ok) {
    response = await fetch(`/api/assessments/by-id/${idOrJobId}`);
  }

  if (!response.ok) {
    let errorMessage = 'Failed to fetch assessment';
    try {
      const error: ApiError = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const assessment = await response.json();
  const withId: Assessment = reviveAssessment({
    ...assessment,
    id: assessment.id ?? assessment.jobId ?? crypto.randomUUID(), 
  });

  // persist locally
  await db.assessments.put(withId as any);
  return withId;
};

const submitAssessment = async (
  jobId: string,
  submission: Omit<AssessmentResponse, 'id' | 'submittedAt'>
): Promise<AssessmentResponse> => {
  const response = await fetch(`/api/assessments/${jobId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to submit assessment';
    try {
      const error: ApiError = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const saved: any = await response.json();
  const withId: AssessmentResponse = {
    ...saved,
    id: saved.id ?? undefined,
    submittedAt: saved.submittedAt ? new Date(saved.submittedAt) : new Date(),
  };

  try {
    if (withId.id !== undefined && withId.id !== null) {
      await db.responses.put(withId as any);
    } else {
      await db.responses.add(withId as any);
    }
  } catch (err) {
    try {
      await db.responses.add({
        assessmentId: withId.assessmentId,
        jobId: withId.jobId,
        candidateId: withId.candidateId,
        submittedAt: withId.submittedAt,
        answers: withId.answers,
        score: withId.score,
      } as any);
    } catch (err2) {
      console.error('Failed to persist response locally', err2);
    }
  }

  return withId;
};

export const useAssessment = (idOrJobId: string) => {
  return useQuery({
    queryKey: ['assessment', idOrJobId],
    queryFn: () => fetchAssessment(idOrJobId),
    enabled: !!idOrJobId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmitAssessment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, ...submission }: { jobId: string } & Omit<AssessmentResponse, 'id' | 'submittedAt'>) =>
      submitAssessment(jobId, submission),
    onSuccess: () => {
      toast.success('Assessment submitted successfully');
      qc.invalidateQueries({ queryKey: ['assessment'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

// 🔥 saveAssessment: persist locally first, then try API
const saveAssessment = async (assessment: Assessment): Promise<void> => {
  const id = assessment.id ?? assessment.jobId ?? crypto.randomUUID();
  const pathParam = assessment.jobId ?? id;

  // Save immediately to IndexedDB ✅
  await db.assessments.put({
    ...assessment,
    id,
    jobId: assessment.jobId ?? id,
    updatedAt: new Date(),
    createdAt: assessment.createdAt ?? new Date(),
  } as any);

  try {
    const response = await fetch(`/api/assessments/${pathParam}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...assessment, id, jobId: assessment.jobId ?? id }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to save assessment';
      try {
        const error: ApiError = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error('API save failed, but local DB updated', err);
    toast.error('Saved locally, but failed to sync with server');
  }

  try {
    window.dispatchEvent(new CustomEvent('assessments:updated'));
  } catch {}
};

export const useSaveAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAssessment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessment', variables.jobId ?? variables.id] });
      toast.success('Assessment saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export function saveAssessmentResponse(assessmentId: string, responses: Record<string, any>) {
  try {
    localStorage.setItem(`responses:${assessmentId}`, JSON.stringify(responses));
    return { success: true };
  } catch (err) {
    console.error('Failed to save response', err);
    return { success: false };
  }
}
