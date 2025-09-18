export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  createdAt: Date;
}

export interface TimelineEntry {
  id: string;
  candidateId: string;
  timestamp: Date;
  fromStage: string | null;
  toStage: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file';
  title: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    maxLength?: number;
  };
  conditionalLogic?: {
    dependsOn: string;
    condition: 'equals';
    value: string;
  };
}

export interface AssessmentSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assessment {
  jobId: string;
  sections: AssessmentSection[];
  updatedAt: Date;
}

export interface AssessmentResponse {
  id: string;
  jobId: string;
  candidateId?: string;
  submittedAt: Date;
  answers: Array<{
    questionId: string;
    value: any;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  error: string;
}