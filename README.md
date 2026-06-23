# RetroTask: Mini Employee Task Manager (7-Day Program Final State)

RetroTask is a premium, high-performance employee task management web application demonstrating full development rigor, proper code organization, clean Git history, and rich interactive styling.

## 🚀 Project Overview

The project is structured day-by-day to show the progressive evolution of a software project:
- **Day 1: Project Setup**: Boilerplate setup with Vite, React, TypeScript, and Tailwind CSS.
- **Day 2: Layout & Static UI**: Sidebar/Header shells, responsive layouts, dashboard cards, and static task table.
- **Day 3: Typed Task List**: Formatted dates, custom union types for status and priority, and 8 realistic seed tasks.
- **Day 4: Search & Filters**: Live searching by task title and assigned employee, plus dropdown filtering by Status and Priority.
- **Day 5: Form CRUD & Modals**: Create, Update, and Delete operations using local state, input validations, custom confirmation dialogs, and a floating toast notification system.
- **Day 6: Mock Service & Next.js Backend**: SQLite database managed via Prisma ORM inside a Next.js API route server. Supports simulated 800ms latency, pulsing loading skeletons, error handling, and a runtime toggle between Simulated Mock API and Real Next.js API.
- **Day 7: Final Review & Polish**: Complete refactoring, removal of logs/debugs, full TypeScript compiler verification, and documentation of a manual verification checklist.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Next.js 16 (App Router) acting as a standalone API gateway
- **Database**: SQLite Database managed through Prisma ORM v7 (configured with `PrismaBetterSqlite3` adapter)
- **Styling**: Curated dark theme using custom Tailwind gradient backdrops, glassmorphism, responsive grid layout, and pulsing indicators.

---

## 📁 Repository Structure

```
day7/
├── backend/                  # Next.js API & SQLite Server
│   ├── app/                  # Next.js App Router (APIs: /api/tasks & /api/tasks/[id])
│   ├── lib/                  # Library Singletons (Prisma client instance)
│   ├── prisma/               # Schema configuration, migrations, and seed script
│   ├── tsconfig.json         # Backend TS settings
│   └── package.json          # Backend Node package definitions
├── src/                      # Vite React Frontend
│   ├── assets/               # SVG and PNG assets
│   ├── components/           # Common structural layouts (Header, Sidebar, AppLayout)
│   ├── features/tasks/       # Task module feature folder
│   │   ├── components/       # CRUD modals, Badges, Filters, Skeletons, and Table views
│   │   ├── constants/        # Seed fallback mock task lists
│   │   └── services/         # taskService API/Mock integration abstraction layer
│   ├── types/                # Core typescript definitions
│   ├── utils/                # Helper utilities (date formatter)
│   ├── App.tsx               # Main application layout manager
│   └── index.css             # Tailwind styling and custom styling definitions
├── vite.config.ts            # Vite config (proxies /api requests to next.js on port 3000)
└── package.json              # Frontend Node package definitions
```

---

## ⚙️ Installation & Running Guide

Ensure you have Node.js (v18+) installed.

### 1. Database & Backend Setup
Navigate to the backend folder, install dependencies, run migrations, and start the Next.js API server:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
*The backend server will run on `http://localhost:3000`.*

### 2. Frontend Setup
Open a new terminal, navigate to the root `day7` folder, install dependencies, and start the Vite dev server:
```bash
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`. Any requests to `/api/*` are automatically proxied to port 3000.*

---

## 🧪 Manual Verification & Testing Checklist

Use this checklist to verify the correct operation of all features in RetroTask:

### 1. API Toggle & Loading State
- [ ] **Mode Switching**: Click the toggle between **Simulated Mock API** and **Real Next.js API**. A toast notification should appear.
- [ ] **Loading Skeletons**: When you switch modes or load the page, pulsing dark skeletons should occupy the dashboard statistics and task table for exactly 800ms before rendering.
- [ ] **State Preservation**: The selected API mode should be saved in `localStorage` and persist across page refreshes.

### 2. Dashboard Statistics
- [ ] **Task Counts**: Verify that the summary cards show the correct number of tasks:
  - Total Tasks
  - Pending Tasks
  - In Progress Tasks
  - Completed Tasks
- [ ] **Dynamic Updates**: Adding, editing, or deleting a task should instantly recalculate and update all four summary counters.

### 3. Search and Filters
- [ ] **Search Bar**: Type in the search box. It should match tasks by **title** or **assigned employee** name.
- [ ] **Status Dropdown**: Select a status filter (All, Pending, In Progress, Completed, Cancelled). Verify only matching tasks appear.
- [ ] **Priority Dropdown**: Select a priority filter (All, Low, Medium, High). Verify tasks filter correctly.
- [ ] **Reset Filters**: Click the "Reset Filters" button. The search query should clear, and the dropdowns should reset to "All".

### 4. Create, Read, Update, Delete (CRUD) Operations
- [ ] **Add Task**:
  - Click "Add Task". Fill in Title, Assigned Employee, Status, Priority, and Due Date.
  - Leave a required field empty. Submit. Field validation errors should prevent form submission.
  - Submit successfully. A toast notification "Task created successfully!" should appear.
- [ ] **Edit Task**:
  - Click the Edit button on any task row.
  - The modal should populate with the correct task properties.
  - Change the priority or assignee and click Save. A toast "Task updated successfully!" should appear.
- [ ] **Delete Task**:
  - Click the Delete trashcan icon on a task.
  - A glassmorphic confirmation modal should ask: "Are you absolutely sure?".
  - Click Cancel. The task should not be deleted.
  - Click Confirm. A toast "Task deleted successfully!" should appear and the task should disappear.

### 5. Backend Server Errors
- [ ] Stop the Next.js backend server (`npm run dev` in the backend terminal).
- [ ] Set the app mode to **Real Next.js API**.
- [ ] Refresh the page.
- [ ] A beautiful glassmorphic error panel with a "Failed to Load Tasks" message and a "Retry Connection" button should appear.
- [ ] Start the backend server again and click "Retry Connection". The app should load tasks normally.
