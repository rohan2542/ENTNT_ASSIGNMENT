import { seedDatabase } from '../src/lib/seed-data';

console.log('Starting database seed...');

try {
  await seedDatabase();
  console.log('Database seeded successfully!');
  process.exit(0);
} catch (error) {
  console.error('Failed to seed database:', error);
  process.exit(1);
}