# RetroTask: Mini Employee Task Manager (7-Day Program Final State)

RetroTask is a premium, high-performance employee task management web application demonstrating full development rigor, proper code organization, clean Git history, and rich interactive styling.

## Project Overview

The project is structured day-by-day to show the progressive evolution of a software project:
- **Day 1: Project Setup**: Boilerplate setup with Vite, React, TypeScript, and Tailwind CSS.
- **Day 2: Layout & Static UI**: Sidebar/Header shells, responsive layouts, dashboard cards, and static task table.
- **Day 3: Typed Task List**: Formatted dates, custom union types for status and priority, and realistic seed tasks.
- **Day 4: Search & Filters**: Live searching by task title and assigned employee, plus dropdown filtering by Status and Priority.
- **Day 5: Form CRUD & Modals**: Create, Update, and Delete operations using input validations, custom confirmation dialogs, and a floating toast notification system.
- **Day 6: Mock Service & Backend**: Node.js Express API with MongoDB via Mongoose. Vite proxy forwards `/api` to the backend.
- **Day 7: Final Review & Polish**: Complete refactoring, removal of logs/debugs, full TypeScript compiler verification, and documentation of a manual verification checklist.

---

## Tech Stack & Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express (top-down feature-based structure)
- **Database**: MongoDB managed through Mongoose ODM
- **Styling**: Curated dark theme using custom Tailwind gradient backdrops, glassmorphism, responsive grid layout, and pulsing indicators.

---

## Repository Structure (Top-Down)

```
day7/
├── backend/                          # Level 1: Backend application
│   ├── src/
│   │   ├── app/                      # Level 2: Entry & HTTP shell
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── features/                 # Level 2: Domain features
│   │   │   └── tasks/                # Level 3: Task module files
│   │   │       ├── task.controller.ts
│   │   │       ├── task.mapper.ts
│   │   │       ├── task.model.ts
│   │   │       ├── task.routes.ts
│   │   │       ├── task.types.ts
│   │   │       └── task.validator.ts
│   │   ├── shared/                   # Level 2: Cross-cutting concerns
│   │   │   ├── config/
│   │   │   ├── middleware/
│   │   │   └── routes/
│   │   └── seed/                     # Level 2: Database seeding
│   │       └── seed.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── src/                              # Level 1: Frontend application
│   ├── app/                          # Level 2: App shell & entry
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── features/                     # Level 2: Domain features
│   │   └── tasks/
│   │       ├── components/
│   │       ├── constants/
│   │       ├── services/
│   │       └── types/
│   ├── shared/                       # Level 2: Reusable UI & utilities
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   └── utils/
│   └── styles/                       # Level 2: Global styles
│       └── index.css
├── public/
├── vite.config.ts                    # Proxies /api → localhost:3000
└── package.json
```

---

## Installation & Running Guide

Ensure you have Node.js (v18+) and MongoDB installed (local or Atlas).

### 1. Database & Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

The backend runs on `http://localhost:3000`.

### 2. Frontend Setup

In a new terminal:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. Requests to `/api/*` are proxied to port 3000.

---

## API Endpoints

| Method   | Endpoint          | Description   |
|----------|-------------------|---------------|
| `GET`    | `/api/tasks`      | List all tasks |
| `POST`   | `/api/tasks`      | Create task    |
| `PUT`    | `/api/tasks/:id`  | Update task    |
| `DELETE` | `/api/tasks/:id`  | Delete task    |
| `GET`    | `/health`         | Health check   |

---

## Manual Verification Checklist

- [ ] Backend starts and connects to MongoDB
- [ ] `npm run seed` populates sample tasks
- [ ] Frontend loads tasks from `/api/tasks`
- [ ] Create, edit, and delete tasks persist in MongoDB
- [ ] Search and filters work on the task list
- [ ] Dashboard charts reflect current task data
- [ ] Theme toggle works in light and dark mode
