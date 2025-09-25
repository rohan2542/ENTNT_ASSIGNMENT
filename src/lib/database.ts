import Dexie, { Table } from 'dexie';
import { Job, Candidate, TimelineEntry, Assessment, AssessmentResponse, User } from '../types';

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job, string>;
  candidates!: Table<Candidate, string>;
  timelines!: Table<TimelineEntry, string>;
  assessments!: Table<Assessment, string>;
  responses!: Table<AssessmentResponse, number>;
  users!: Table<User, string>;

  constructor() {
    super('TalentFlowDB');

    this.version(1).stores({
      jobs: 'id, title, slug, status, order, createdAt',
      candidates: 'id, name, email, jobId, stage, createdAt',
      timelines: 'id, candidateId, timestamp',
      assessments: 'id, jobId, title, updatedAt',
      // 🔑 make sure `++id` is auto-increment primary key
      responses: '++id, assessmentId, jobId, candidateId, submittedAt',
      // responses: '++id, assessmentId, submittedAt',
      users: 'id, name, email',
    });
  }
}

export const db = new TalentFlowDB();
