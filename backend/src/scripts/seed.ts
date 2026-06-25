import { connectDB } from '../infrastructure/database/connection.js';
import { TaskModel } from '../features/tasks/models/task.model.js';
import { UserModel } from '../features/auth/models/user.model.js';
import bcrypt from 'bcryptjs';

const seedTasks = [
  {
    title: 'Design Dashboard Wireframes',
    description: 'Create high-fidelity landing page and grid dashboard wireframes on Figma for review.',
    assignedTo: 'Rahul Dev',
    status: 'Completed' as const,
    priority: 'High' as const,
    dueDate: '2026-06-19',
    createdAt: new Date('2026-06-16T09:00:00Z'),
  },
  {
    title: 'Initialize Git & Scaffold Vite',
    description: 'Set up Vite React template, TypeScript support, and strict configuration parameters.',
    assignedTo: 'Amit Kumar',
    status: 'Completed' as const,
    priority: 'Medium' as const,
    dueDate: '2026-06-20',
    createdAt: new Date('2026-06-16T10:30:00Z'),
  },
  {
    title: 'Configure Tailwind CSS',
    description: 'Integrate Tailwind CSS v4 directives, color systems, and load Outfit and Inter fonts.',
    assignedTo: 'Rahul Dev',
    status: 'Completed' as const,
    priority: 'High' as const,
    dueDate: '2026-06-21',
    createdAt: new Date('2026-06-17T11:00:00Z'),
  },
  {
    title: 'Build Responsive Sidebar Shell',
    description: 'Implement responsive shell grid, top navigation header, sidebar options and mobile support.',
    assignedTo: 'Priya Sharma',
    status: 'In Progress' as const,
    priority: 'Medium' as const,
    dueDate: '2026-06-22',
    createdAt: new Date('2026-06-17T11:15:00Z'),
  },
  {
    title: 'Integrate MongoDB Backend API',
    description: 'Initialize Express server, create Task model with Mongoose, and wire CRUD routes.',
    assignedTo: 'Amit Kumar',
    status: 'In Progress' as const,
    priority: 'High' as const,
    dueDate: '2026-06-26',
    createdAt: new Date('2026-06-19T11:00:00Z'),
  },
];

async function seed() {
  await connectDB();
  
  // Seed Tasks
  await TaskModel.deleteMany({});
  await TaskModel.insertMany(seedTasks);
  console.log(`Seeded ${seedTasks.length} tasks`);

  // Seed default Superadmin User
  await UserModel.deleteMany({});
  const superadminHash = await bcrypt.hash('password123', 10);
  const managerHash = await bcrypt.hash('password123', 10);
  const employeeHash = await bcrypt.hash('password123', 10);

  await UserModel.create([
    {
      name: 'Rahul Dev',
      email: 'superadmin@retro.com',
      passwordHash: superadminHash,
      role: 'Superadmin',
    },
    {
      name: 'Priya Sharma',
      email: 'manager@retro.com',
      passwordHash: managerHash,
      role: 'Manager',
    },
    {
      name: 'Amit Kumar',
      email: 'employee@retro.com',
      passwordHash: employeeHash,
      role: 'Employee',
    },
  ]);
  console.log('Seeded users (Superadmin, Manager, Employee)');

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
