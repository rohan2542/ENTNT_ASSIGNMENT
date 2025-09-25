

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
    await db.transaction('rw',
      [db.jobs, db.candidates, db.timelines, db.assessments, db.responses, db.users],
      async () => {
        await Promise.all([
          db.jobs.clear(),
          db.candidates.clear(),
          db.timelines.clear(),
          db.assessments.clear(),
          db.responses.clear(),
          db.users.clear(),
        ]);

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

        // const candidateCount = opts?.reduceCandidates ? 200 : 1000;
        const candidateCount =  1000;

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
              },
              {
                id: faker.string.uuid(),
                title: 'Technical Skills',
                questions: [
                  { id: faker.string.uuid(), type: 'multi-choice', title: 'Which programming languages are you proficient in?', required: true, options: ['JavaScript','TypeScript','Python','Java','C#','Go','Rust'] },
                  { id: faker.string.uuid(), type: 'single-choice', title: 'Are you familiar with React?', required: true, options: ['Yes','No'] },
                  {
                    id: faker.string.uuid(),
                    type: 'long-text',
                    title: 'Describe your React experience',
                    required: false,
                    conditionalLogic: [], // will be set below
                    validation: { maxLength: 500 }
                  },
                  { id: faker.string.uuid(), type: 'numeric', title: 'Rate your JavaScript skills (1-10)', required: true, validation: { min: 1, max: 10 } }
                ]
              },
              {
                id: faker.string.uuid(),
                title: 'Additional Information',
                questions: [
                  { id: faker.string.uuid(), type: 'file', title: 'Upload your resume', required: true },
                  { id: faker.string.uuid(), type: 'long-text', title: 'Why are you interested in this position?', required: true, validation: { maxLength: 1000 } }
                ]
              },
              {
  id: faker.string.uuid(),
  title: 'MCQs',
  questions: [
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which hook is used to manage local state in React?',
      required: true,
      options: ['useContext', 'useReducer', 'useState', 'useEffect'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which SQL command is used to remove a table?',
      required: true,
      options: ['DELETE', 'DROP', 'REMOVE', 'TRUNCATE'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which keyword is used to declare a constant in JavaScript?',
      required: true,
      options: ['let', 'const', 'var', 'static'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which React hook is used to perform side effects?',
      required: true,
      options: ['useMemo', 'useEffect', 'useCallback', 'useState'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which SQL clause is used to filter rows?',
      required: true,
      options: ['GROUP BY', 'ORDER BY', 'HAVING', 'WHERE'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which method is used to add an element at the end of an array in JavaScript?',
      required: true,
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'What does JSX stand for in React?',
      required: true,
      options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'JSON XML'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which SQL keyword is used to sort results?',
      required: true,
      options: ['GROUP BY', 'SORT', 'ORDER BY', 'ASC/DESC'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which function is used to convert a JSON string into a JavaScript object?',
      required: true,
      options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.convert()'],
    },
    {
      id: faker.string.uuid(),
      type: 'single-choice',
      title: 'Which lifecycle method in class components is similar to useEffect in React?',
      required: true,
      options: ['componentWillMount', 'componentDidMount', 'componentWillUpdate', 'shouldComponentUpdate'],
    },
  ],
},
        {
      id: faker.string.uuid(),
      title: 'Coding Challenges',
      questions: [
        {
          id: faker.string.uuid(),
          type: 'coding',
          title: 'Implement a function to check if a string is a palindrome.',
          required: true,
          language: 'javascript',
          starterCode: `function isPalindrome(str) {\n  // your code\n}\n\nconsole.log(isPalindrome("racecar")); // true`
        },
        {
          id: faker.string.uuid(),
          type: 'coding',
          title: 'Given an array of integers, return indices of the two numbers that add up to a target.',
          required: true,
          language: 'javascript',
          starterCode: `function twoSum(nums, target) {\n  // your code\n}\n\nconsole.log(twoSum([2,7,11,15], 9)); // [0,1]`
        }
      ]
    },
    {
      id: faker.string.uuid(),
      title: 'SQL Challenge',
      questions: [
        {
          id: faker.string.uuid(),
          type: 'sql',
          title: 'Write a SQL query to find the second highest salary from the Employees table.',
          required: true,
          placeholder: 'SELECT ...'
        }
      ]
    }
  ],
            updatedAt: faker.date.recent()
          } as any;

          // Fix conditional logic: link React question -> React experience question
          const reactFamiliar = assessment.sections[1].questions.find(q => q.title.includes('familiar with React'));
          const reactExperienceQ = assessment.sections[1].questions.find(q => q.title.includes('React experience'));
          if (reactFamiliar && reactExperienceQ) {
            reactExperienceQ.conditionalLogic = [
              { dependsOn: reactFamiliar.id, condition: 'equals', value: 'Yes' }
            ];
          }

          assessments.push(assessment);
        }

        await db.assessments.bulkAdd(assessments);
        console.log('Database seeded successfully!');
      }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
