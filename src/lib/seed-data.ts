
// src/lib/seed-data.ts
import { faker } from '@faker-js/faker';
import { db } from './database';
import { Job, Candidate, User, Assessment, TimelineEntry } from '../types';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'] as const;

const SAMPLE_TAGS = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Java',
  'Senior', 'Junior', 'Remote', 'Full-time', 'Part-time', 'Contract',
  'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Data Science'
];

const generateSlug = (title: string, idx: number) =>
  title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + `-${idx + 1}`;

export const seedDatabase = async (opts?: { reduceCandidates?: boolean }) => {
  try {
    // ✅ Only seed if DB is empty
    const jobCount = await db.jobs.count();
    if (jobCount > 0) {
      console.log("Database already seeded, skipping reseed");
      return;
    }

    await db.transaction('rw',
      [db.jobs, db.candidates, db.timelines, db.assessments, db.responses, db.users],
      async () => {
        // Users
        const users: User[] = Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i + 1}`,
          name: faker.person.fullName(),
          email: faker.internet.email()
        }));
        await db.users.bulkAdd(users);

        // Jobs
        const jobs: Job[] = [];
        const jobTitles = [
          'Senior Frontend Developer','Full Stack Engineer','Backend Developer','DevOps Engineer',
          'Data Scientist','Product Manager','UX Designer','QA Engineer','Mobile Developer',
          'Machine Learning Engineer','Software Architect','Technical Lead','Junior Developer',
          'Site Reliability Engineer','Security Engineer','Database Administrator','Business Analyst',
          'Scrum Master','Cloud Engineer','Frontend Engineer','Node.js Developer','Python Developer',
          'Java Developer','React Developer','Vue.js Developer'
        ];

        for (let i = 0; i < 25; i++) {
          const title = jobTitles[i] || faker.person.jobTitle();
          const job: Job = {
            id: faker.string.uuid(),
            title,
            slug: generateSlug(title, i),
            status: faker.helpers.arrayElement(['active', 'archived']),
            tags: faker.helpers.arrayElements(SAMPLE_TAGS, { min: 1, max: 4 }),
            order: i + 1,
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: faker.date.recent()
          } as any;
          jobs.push(job);
        }
        await db.jobs.bulkAdd(jobs);

        // Candidates + timelines
        const candidates: Candidate[] = [];
        const timelines: TimelineEntry[] = [];

        const candidateCount = opts?.reduceCandidates ? 200 : 1000;

        for (let i = 0; i < candidateCount; i++) {
          const jobId = faker.helpers.arrayElement(jobs).id;
          const currentStage = faker.helpers.arrayElement(STAGES);

          const candidate: Candidate = {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            jobId,
            stage: currentStage,
            createdAt: faker.date.past({ years: 1 })
          } as any;
          candidates.push(candidate);

          const timelineEntry: TimelineEntry = {
            id: faker.string.uuid(),
            candidateId: candidate.id,
            timestamp: candidate.createdAt,
            fromStage: null,
            toStage: currentStage,
            notes: `Candidate applied for position`
          } as any;
          timelines.push(timelineEntry);

          if (Math.random() < 0.6) {
            const stageIndex = STAGES.indexOf(currentStage);
            for (let s = 0; s < Math.min(stageIndex, 3); s++) {
              const prevStage = s === 0 ? null : STAGES[s - 1];
              const nextStage = STAGES[s];
              const transition: TimelineEntry = {
                id: faker.string.uuid(),
                candidateId: candidate.id,
                timestamp: faker.date.between({ from: candidate.createdAt, to: new Date() }),
                fromStage: prevStage,
                toStage: nextStage,
                notes: faker.helpers.arrayElement([
                  'Moved to next stage',
                  'Interview completed',
                  'Technical assessment passed',
                  'Reference check completed',
                  'Final approval received'
                ])
              } as any;
              timelines.push(transition);
            }
          }
        }

        await db.candidates.bulkAdd(candidates);
        await db.timelines.bulkAdd(timelines);

        // Assessments: create up to 3 sample assessments
        const assessments: Assessment[] = [];
        for (let i = 0; i < Math.min(3, jobs.length); i++) {
          const job = jobs[i];
          const assessmentId = faker.string.uuid();

          const assessment: Assessment = {
            id: assessmentId,
            jobId: job.id,
            title: `${job.title} Assessment`,
            sections: [
              {
                id: faker.string.uuid(),
                title: 'Personal Information',
                questions: [
                  { id: faker.string.uuid(), type: 'short-text', title: 'Full Name', required: true },
                  { id: faker.string.uuid(), type: 'short-text', title: 'Email Address', required: true },
                  { id: faker.string.uuid(), type: 'single-choice', title: 'Years of Experience', required: true, options: ['0-2 years', '3-5 years', '6-10 years', '10+ years'] }
                ]
              }
              // ... keep your rest of the assessment sections here
            ],
            updatedAt: faker.date.recent()
          } as any;

          assessments.push(assessment);
        }

        await db.assessments.bulkAdd(assessments);
        console.log('✅ Database seeded successfully!');
      }
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
