// src/hooks/useJobs.ts
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
  toOrder: number;
}

const fetchJobs = async (params: JobsParams = {}): Promise<PaginatedResponse<Job>> => {
  const urlParams = new URLSearchParams();

  if (params.search) urlParams.append('search', params.search);
  if (params.status) urlParams.append('status', params.status);
  if (params.tags) params.tags.forEach(tag => urlParams.append('tags', tag));
  if (params.page) urlParams.append('page', params.page.toString());
  if (params.pageSize) urlParams.append('pageSize', params.pageSize.toString());
  if (params.sort) urlParams.append('sort', params.sort);

  const response = await fetch(`/api/jobs?${urlParams.toString()}`);

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to fetch jobs');
  }

  const result = await response.json();
  // hydrate dates
  result.data = result.data.map((j: any) => ({ ...j, createdAt: j.createdAt ? new Date(j.createdAt) : new Date(), updatedAt: j.updatedAt ? new Date(j.updatedAt) : new Date() }));
  return result;
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

const reorderJob = async ({ jobId, toOrder }: ReorderParams): Promise<Job> => {
  const response = await fetch(`/api/jobs/${jobId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: toOrder })
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Failed to reorder job');
  }

  return response.json();
};

export const useJobs = (params: JobsParams = {}) => {
  const { search = '', status = '', tags = [], page = 1, pageSize = 50, sort = 'order:asc' } = params;
  return useQuery({
    queryKey: ['jobs', search, status, tags.join(','), page, pageSize, sort],
    queryFn: () => fetchJobs({ search, status, tags, page, pageSize, sort })
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
    onMutate: async ({ jobId, toOrder }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previous = queryClient.getQueryData<any>(['jobs']);
      // optimistic update: reorder in cache
      queryClient.setQueryData(['jobs'], (old: any) => {
        if (!old) return old;
        const data = [...old.data];
        const idx = data.findIndex((j: Job) => j.id === jobId);
        if (idx === -1) return old;
        const [moved] = data.splice(idx, 1);
        // insert by toOrder (1-based). convert to index
        const insertAt = Math.min(Math.max(0, toOrder - 1), data.length);
        data.splice(insertAt, 0, { ...moved, order: toOrder });
        // renumber
        const updated = data.map((j, i) => ({ ...j, order: i + 1 }));
        return { ...old, data: updated };
      });
      return { previous };
    },
    onError: (error: Error, variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['jobs'], context.previous);
      }
      toast.error(`Reorder failed: ${error.message}. Reverted changes.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};
