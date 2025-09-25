// src/types/index.ts

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
  location?: string;
  remote?: boolean;
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
  type:
    | 'single-choice'
    | 'multi-choice'
    | 'short-text'
    | 'long-text'
    | 'numeric'
    | 'file'
    | 'coding'      // NEW
    | 'sql';        // NEW
  title: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    maxLength?: number;
  };
  conditionalLogic?: Array<{
    dependsOn: string;
    condition: 'equals' | 'not-equals' | 'greater' | 'less';
    value: string | number;
  }>;

  allowMultipleFiles?: boolean;

  // extra metadata
  starterCode?: string;   // for coding questions
  language?: string;      // e.g., "javascript", "python", "sql"
  expectedOutput?: string; // for SQL/coding validation
}


export interface AssessmentSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  status?: 'draft' | 'published';
  sections: AssessmentSection[];
  createdAt?: Date;
  updatedAt: Date;
}

export interface AssessmentResponse {
  id?: number; // Dexie auto-increment
  assessmentId: string;
  jobId: string;
  candidateId?: string;
  submittedAt: Date;
  answers: Array<{
    questionId: string;
    value: any;
  }>;
  score?: number;
}

// ---------------------- Shared ----------------------

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  error: string;
}
