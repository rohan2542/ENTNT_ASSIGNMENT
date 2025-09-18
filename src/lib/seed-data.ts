import { faker } from '@faker-js/faker';
import { db } from './database';
import { Job, Candidate, User, Assessment, TimelineEntry } from '../types';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'] as const;

const SAMPLE_TAGS = [
  'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Java',
  'Senior', 'Junior', 'Remote', 'Full-time', 'Part-time', 'Contract',
  'Frontend', 'Backend', 'Fullstack', 'DevOps', 'Data Science'
];

const generateSlug = (title: string): string => {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const seedDatabase = async (): Promise<void> => {
  try {
    // Clear existing data
    await db.transaction('rw', db.jobs, db.candidates, db.timelines, db.assessments, db.responses, db.users, async () => {
      await Promise.all([
        db.jobs.clear(),
        db.candidates.clear(),
        db.timelines.clear(),
        db.assessments.clear(),
        db.responses.clear(),
        db.users.clear()
      ]);
    });

    // Seed users for @mentions
    const users: User[] = Array.from({ length: 10 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: faker.person.fullName(),
      email: faker.internet.email()
    }));
    await db.users.bulkAdd(users);

    // Seed jobs
    const jobs: Job[] = [];
    const jobTitles = [
      'Senior Frontend Developer',
      'Full Stack Engineer',
      'Backend Developer',
      'DevOps Engineer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
      'QA Engineer',
      'Mobile Developer',
      'Machine Learning Engineer',
      'Software Architect',
      'Technical Lead',
      'Junior Developer',
      'Site Reliability Engineer',
      'Security Engineer',
      'Database Administrator',
      'Business Analyst',
      'Scrum Master',
      'Cloud Engineer',
      'Frontend Engineer',
      'Node.js Developer',
      'Python Developer',
      'Java Developer',
      'React Developer',
      'Vue.js Developer'
    ];

    for (let i = 0; i < 25; i++) {
      const title = jobTitles[i] || faker.person.jobTitle();
      const job: Job = {
        id: faker.string.uuid(),
        title,
        slug: generateSlug(title) + (i > 0 ? `-${i + 1}` : ''),
        status: faker.helpers.weightedArrayElement([
          { weight: 3, value: 'active' as const },
          { weight: 1, value: 'archived' as const }
        ]),
        tags: faker.helpers.arrayElements(SAMPLE_TAGS, { min: 1, max: 4 }),
        order: i + 1,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent()
      };
      jobs.push(job);
    }
    await db.jobs.bulkAdd(jobs);

    // Seed candidates
    const candidates: Candidate[] = [];
    const timelines: TimelineEntry[] = [];
    
    for (let i = 0; i < 1000; i++) {
      const jobId = faker.helpers.arrayElement(jobs).id;
      const currentStage = faker.helpers.arrayElement(STAGES);
      
      const candidate: Candidate = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        jobId,
        stage: currentStage,
        createdAt: faker.date.past({ years: 1 })
      };
      candidates.push(candidate);

      // Create initial timeline entry
      const timelineEntry: TimelineEntry = {
        id: faker.string.uuid(),
        candidateId: candidate.id,
        timestamp: candidate.createdAt,
        fromStage: null,
        toStage: currentStage,
        notes: `Candidate applied for position`
      };
      timelines.push(timelineEntry);

      // Add some stage transitions
      if (faker.datatype.boolean(0.6)) {
        const stageIndex = STAGES.indexOf(currentStage);
        for (let j = 0; j < stageIndex && j < 3; j++) {
          const prevStage = j === 0 ? null : STAGES[j - 1];
          const nextStage = STAGES[j];
          
          const transition: TimelineEntry = {
            id: faker.string.uuid(),
            candidateId: candidate.id,
            timestamp: faker.date.between({
              from: candidate.createdAt,
              to: new Date()
            }),
            fromStage: prevStage,
            toStage: nextStage,
            notes: faker.helpers.arrayElement([
              'Moved to next stage',
              'Interview completed',
              'Technical assessment passed',
              'Reference check completed',
              'Final approval received'
            ])
          };
          timelines.push(transition);
        }
      }
    }
    
    await db.candidates.bulkAdd(candidates);
    await db.timelines.bulkAdd(timelines);

    // Seed assessments
    const assessments: Assessment[] = [];
    
    for (let i = 0; i < Math.min(3, jobs.length); i++) {
      const job = jobs[i];
      
      const assessment: Assessment = {
        jobId: job.id,
        sections: [
          {
            id: faker.string.uuid(),
            title: 'Personal Information',
            questions: [
              {
                id: faker.string.uuid(),
                type: 'short-text',
                title: 'Full Name',
                required: true
              },
              {
                id: faker.string.uuid(),
                type: 'short-text',
                title: 'Email Address',
                required: true
              },
              {
                id: faker.string.uuid(),
                type: 'single-choice',
                title: 'Years of Experience',
                required: true,
                options: ['0-2 years', '3-5 years', '6-10 years', '10+ years']
              }
            ]
          },
          {
            id: faker.string.uuid(),
            title: 'Technical Skills',
            questions: [
              {
                id: faker.string.uuid(),
                type: 'multi-choice',
                title: 'Which programming languages are you proficient in?',
                required: true,
                options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust']
              },
              {
                id: faker.string.uuid(),
                type: 'single-choice',
                title: 'Are you familiar with React?',
                required: true,
                options: ['Yes', 'No']
              },
              {
                id: faker.string.uuid(),
                type: 'long-text',
                title: 'Describe your React experience',
                required: false,
                conditionalLogic: {
                  dependsOn: '',
                  condition: 'equals',
                  value: 'Yes'
                },
                validation: {
                  maxLength: 500
                }
              },
              {
                id: faker.string.uuid(),
                type: 'numeric',
                title: 'Rate your JavaScript skills (1-10)',
                required: true,
                validation: {
                  min: 1,
                  max: 10
                }
              }
            ]
          },
          {
            id: faker.string.uuid(),
            title: 'Additional Information',
            questions: [
              {
                id: faker.string.uuid(),
                type: 'file',
                title: 'Upload your resume',
                required: true
              },
              {
                id: faker.string.uuid(),
                type: 'long-text',
                title: 'Why are you interested in this position?',
                required: true,
                validation: {
                  maxLength: 1000
                }
              }
            ]
          }
        ],
        updatedAt: faker.date.recent()
      };

      // Fix conditional logic references
      const reactExperienceQuestion = assessment.sections[1].questions.find(q => q.title.includes('React experience'));
      const reactFamiliarQuestion = assessment.sections[1].questions.find(q => q.title.includes('familiar with React'));
      if (reactExperienceQuestion && reactFamiliarQuestion) {
        reactExperienceQuestion.conditionalLogic!.dependsOn = reactFamiliarQuestion.id;
      }
      
      assessments.push(assessment);
    }
    
    await db.assessments.bulkAdd(assessments);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};