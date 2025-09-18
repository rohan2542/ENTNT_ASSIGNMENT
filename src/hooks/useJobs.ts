import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Job, PaginatedResponse, ApiError } from '../types';
import toast from 'react-hot-toast';

interface JobsParams {
  search?: string;
  status?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: string;
}

interface ReorderParams {
  jobId: string;
  fromOrder: number;
  toOrder: number;
}

const fetchJobs = async (params: JobsParams): Promise<PaginatedResponse<Job>> => {
  const urlParams = new URLSearchParams();
  
  if (params.search) urlParams.append('search', params.search);
  if (params.status) urlParams.append('status', params.status);
  if (params.tags) params.tags.forEach(tag => urlParams.append('tags', tag));
  if (params.page) urlParams.append('page', params.page.toString());
  if (params.pageSize) urlParams.append('pageSize', params.pageSize.toString());
  if (params.sort) urlParams.append('sort', params.sort);

  const response = await fetch(`/api/jobs?${urlParams}`);
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to fetch jobs');
  }
  
  return response.json();
};

const createJob = async (job: Partial<Job>): Promise<Job> => {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job)
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to create job');
  }
  
  return response.json();
};

const updateJob = async ({ id, ...updates }: Partial<Job> & { id: string }): Promise<Job> => {
  const response = await fetch(`/api/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to update job');
  }
  
  return response.json();
};

const reorderJob = async ({ jobId, fromOrder, toOrder }: ReorderParams): Promise<{ fromOrder: number; toOrder: number }> => {
  const response = await fetch(`/api/jobs/${jobId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromOrder, toOrder })
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to reorder job');
  }
  
  return response.json();
};

export const useJobs = (params: JobsParams = {}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => fetchJobs(params)
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useReorderJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reorderJob,
    onMutate: async ({ jobId, fromOrder, toOrder }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      
      const previousJobs = queryClient.getQueriesData({ queryKey: ['jobs'] });
      
      queryClient.setQueriesData<PaginatedResponse<Job>>({ queryKey: ['jobs'] }, (old) => {
        if (!old) return old;
        
        const newData = [...old.data];
        const jobIndex = newData.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return old;
        
        const [movedJob] = newData.splice(jobIndex, 1);
        movedJob.order = toOrder;
        
        const targetIndex = newData.findIndex(j => j.order >= toOrder);
        if (targetIndex === -1) {
          newData.push(movedJob);
        } else {
          newData.splice(targetIndex, 0, movedJob);
        }
        
        return { ...old, data: newData };
      });
      
      return { previousJobs };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousJobs) {
        context.previousJobs.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      toast.error(`Reorder failed: ${error.message}. Changes have been reverted.`, {
        duration: 6000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};