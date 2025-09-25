// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status === 500) return false;
        return failureCount < 3;
      },
      onError: (err: any) => {
        const message = err?.message || 'Failed to fetch';
        toast.error(message);
      }
    },
    mutations: {
      retry: false,
      onError: (err: any) => {
        toast.error(err?.message || 'Mutation failed');
      }
    }
  }
});
