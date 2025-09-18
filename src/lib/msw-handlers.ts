import { http, HttpResponse } from 'msw';
import { db } from './database';
import { Job, Candidate, PaginatedResponse, ApiError } from '../types';

const delay = () => Math.random() * 1000 + 200; // 200-1200ms
const shouldError = (errorRate: number = 0.05) => {
  // Allow global override for testing
  const globalRate = (window as any).__MSW_ERROR_RATE__;
  const rate = globalRate !== undefined ? globalRate : errorRate;
  return Math.random() < rate;
};

const simulatedError = (): HttpResponse => {
  return HttpResponse.json(
    { error: 'Simulated server error' } as ApiError,
    { status: 500 }
  );
};

export const handlers = [
  // Jobs endpoints
  http.get('/api/jobs', async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const tags = url.searchParams.getAll('tags');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const sort = url.searchParams.get('sort') || 'order:asc';

    let query = db.jobs.orderBy('order');
    let jobs = await query.toArray();

    // Apply filters
    if (search) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }

    if (tags.length > 0) {
      jobs = jobs.filter(job => 
        tags.some(tag => job.tags.includes(tag))
      );
    }

    // Apply sorting
    const [field, direction] = sort.split(':');
    jobs.sort((a, b) => {
      let aVal = a[field as keyof Job];
      let bVal = b[field as keyof Job];
      
      if (field === 'createdAt' || field === 'updatedAt') {
        aVal = new Date(aVal as Date).getTime();
        bVal = new Date(bVal as Date).getTime();
      }
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Apply pagination
    const total = jobs.length;
    const start = (page - 1) * pageSize;
    const paginatedJobs = jobs.slice(start, start + pageSize);

    const response: PaginatedResponse<Job> = {
      data: paginatedJobs,
      page,
      pageSize,
      total
    };

    return HttpResponse.json(response);
  }),

  http.post('/api/jobs', async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const newJob = await request.json() as Partial<Job>;
    
    // Check slug uniqueness
    const existingJob = await db.jobs.where('slug').equals(newJob.slug!).first();
    if (existingJob) {
      return HttpResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const job: Job = {
      id: crypto.randomUUID(),
      title: newJob.title!,
      slug: newJob.slug!,
      status: newJob.status || 'active',
      tags: newJob.tags || [],
      order: (await db.jobs.count()) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.jobs.add(job);
    return HttpResponse.json(job);
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const jobId = params.id as string;
    const updates = await request.json() as Partial<Job>;
    
    // Check slug uniqueness if updating slug
    if (updates.slug) {
      const existingJob = await db.jobs.where('slug').equals(updates.slug).first();
      if (existingJob && existingJob.id !== jobId) {
        return HttpResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    await db.jobs.update(jobId, { ...updates, updatedAt: new Date() });
    const updatedJob = await db.jobs.get(jobId);
    
    return HttpResponse.json(updatedJob);
  }),

  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    // Higher error rate for reorder to test rollback
    if (shouldError(0.1)) {
      console.log('MSW: Simulating reorder error for testing');
      return simulatedError();
    }

    const jobId = params.id as string;
    const { fromOrder, toOrder } = await request.json() as { fromOrder: number; toOrder: number };

    const jobs = await db.jobs.orderBy('order').toArray();
    
    // Update order for all affected jobs
    const jobToMove = jobs.find(j => j.id === jobId);
    if (!jobToMove) {
      return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Reorder logic
    if (fromOrder < toOrder) {
      // Moving down: shift jobs between fromOrder and toOrder up
      for (const job of jobs) {
        if (job.order > fromOrder && job.order <= toOrder) {
          await db.jobs.update(job.id, { order: job.order - 1 });
        }
      }
    } else {
      // Moving up: shift jobs between toOrder and fromOrder down
      for (const job of jobs) {
        if (job.order >= toOrder && job.order < fromOrder) {
          await db.jobs.update(job.id, { order: job.order + 1 });
        }
      }
    }

    // Update the moved job's order
    await db.jobs.update(jobId, { order: toOrder });

    return HttpResponse.json({ fromOrder, toOrder });
  }),

  // Candidates endpoints
  http.get('/api/candidates', async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const jobId = url.searchParams.get('jobId') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');

    let candidates = await db.candidates.toArray();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower)
      );
    }

    if (stage) {
      candidates = candidates.filter(candidate => candidate.stage === stage);
    }

    if (jobId) {
      candidates = candidates.filter(candidate => candidate.jobId === jobId);
    }

    // Sort by creation date (newest first)
    candidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const paginatedCandidates = candidates.slice(start, start + pageSize);

    const response: PaginatedResponse<Candidate> = {
      data: paginatedCandidates,
      page,
      pageSize,
      total
    };

    return HttpResponse.json(response);
  }),

  http.patch('/api/candidates/:id', async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const candidateId = params.id as string;
    const updates = await request.json() as Partial<Candidate>;
    
    const candidate = await db.candidates.get(candidateId);
    if (!candidate) {
      return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // If stage is being updated, add timeline entry
    if (updates.stage && updates.stage !== candidate.stage) {
      await db.timelines.add({
        id: crypto.randomUUID(),
        candidateId,
        timestamp: new Date(),
        fromStage: candidate.stage,
        toStage: updates.stage,
        notes: `Stage changed from ${candidate.stage} to ${updates.stage}`
      });
    }

    await db.candidates.update(candidateId, updates);
    const updatedCandidate = await db.candidates.get(candidateId);
    
    return HttpResponse.json(updatedCandidate);
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const candidateId = params.id as string;
    const timeline = await db.timelines
      .where('candidateId')
      .equals(candidateId)
      .orderBy('timestamp')
      .toArray();
    
    return HttpResponse.json(timeline);
  }),

  // Assessment endpoints
  http.get('/api/assessments/:jobId', async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const jobId = params.jobId as string;
    const assessment = await db.assessments.get(jobId);
    
    return HttpResponse.json(assessment || null);
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const jobId = params.jobId as string;
    const assessment = await request.json();
    
    await db.assessments.put({
      jobId,
      ...assessment,
      updatedAt: new Date()
    });
    
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, delay()));
    
    if (shouldError()) return simulatedError();

    const jobId = params.jobId as string;
    const submission = await request.json();
    
    const response = {
      id: crypto.randomUUID(),
      jobId,
      submittedAt: new Date(),
      ...submission
    };
    
    await db.responses.add(response);
    
    return HttpResponse.json(response);
  })
];