import Dexie, { Table } from 'dexie';
import { Job, Candidate, TimelineEntry, Assessment, AssessmentResponse, User } from '../types';

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  timelines!: Table<TimelineEntry>;
  assessments!: Table<Assessment>;
  responses!: Table<AssessmentResponse>;
  users!: Table<User>;

  constructor() {
    super('TalentFlowDB');
    
    this.version(1).stores({
      jobs: 'id, title, slug, status, order, createdAt',
      candidates: 'id, name, email, jobId, stage, createdAt',
      timelines: 'id, candidateId, timestamp',
      assessments: 'jobId, updatedAt',
      responses: 'id, jobId, candidateId, submittedAt',
      users: 'id, name, email'
    });
  }
}

export const db = new TalentFlowDB();