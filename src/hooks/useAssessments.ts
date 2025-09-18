import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Assessment, AssessmentResponse, ApiError } from '../types';
import toast from 'react-hot-toast';

const fetchAssessment = async (jobId: string): Promise<Assessment | null> => {
  const response = await fetch(`/api/assessments/${jobId}`);
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to fetch assessment');
  }
  
  return response.json();
};

const saveAssessment = async (assessment: Assessment): Promise<void> => {
  const response = await fetch(`/api/assessments/${assessment.jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment)
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to save assessment');
  }
};

const submitAssessment = async (jobId: string, submission: Omit<AssessmentResponse, 'id' | 'submittedAt'>): Promise<AssessmentResponse> => {
  const response = await fetch(`/api/assessments/${jobId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to submit assessment');
  }
  
  return response.json();
};

export const useAssessment = (jobId: string) => {
  return useQuery({
    queryKey: ['assessment', jobId],
    queryFn: () => fetchAssessment(jobId),
    enabled: !!jobId
  });
};

export const useSaveAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveAssessment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessment', variables.jobId] });
      toast.success('Assessment saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useSubmitAssessment = () => {
  return useMutation({
    mutationFn: ({ jobId, ...submission }: { jobId: string } & Omit<AssessmentResponse, 'id' | 'submittedAt'>) => 
      submitAssessment(jobId, submission),
    onSuccess: () => {
      toast.success('Assessment submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};