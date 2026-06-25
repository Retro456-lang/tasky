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
- **Day 7: Authentication & RBAC (Final State)**: JWT-based authentication (Register, Login, Forgot Password, Reset Password) and Role-Based Access Control (Superadmin, Manager, Employee). Full TypeScript compiler verification and localized developer testing workflows.

---

## Tech Stack & Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express (top-down feature-based structure)
- **Database**: MongoDB managed through Mongoose ODM
- **Security**: JWT tokens for auth verification, bcryptjs password hashing, and Express route protection middleware
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
│   │   │   ├── tasks/                # Level 3: Task module files
│   │   │   │   ├── task.controller.ts
│   │   │   │   ├── task.mapper.ts
│   │   │   │   ├── task.model.ts
│   │   │   │   ├── task.routes.ts
│   │   │   │   ├── task.types.ts
│   │   │   │   └── task.validator.ts
│   │   │   └── auth/                 # Level 3: Authentication feature
│   │   │       ├── controllers/
│   │   │       ├── models/
│   │   │       ├── routes/
│   │   │       └── validators/
│   │   ├── shared/                   # Level 2: Cross-cutting concerns
│   │   │   ├── config/
│   │   │   ├── middleware/           # auth.middleware.ts & errorHandler.ts
│   │   │   └── routes/
│   │   └── seed/                     # Level 2: Database seeding
│   │       └── seed.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/                         # Level 1: Frontend application
│   ├── src/
│   │   ├── app/                      # Level 2: App shell & entry
│   │   │   ├── App.tsx
│   │   │   ├── App.css
│   │   │   └── main.tsx
│   │   ├── features/                 # Level 2: Domain features
│   │   │   ├── tasks/
│   │   │   │   ├── components/
│   │   │   │   ├── constants/
│   │   │   │   ├── services/
│   │   │   │   └── types/
│   │   │   └── auth/                 # Level 3: Auth components, context & services
│   │   │       ├── components/       # SignIn, SignUp, ForgotPassword, ResetPassword
│   │   │       ├── context/          # AuthContext.tsx
│   │   │       ├── services/         # authService.ts
│   │   │       └── types/
│   │   ├── shared/                   # Level 2: Reusable UI & utilities
│   │   │   ├── components/           # AppLayout, Header, Sidebar
│   │   │   ├── constants/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── styles/                   # Level 2: Global styles
│   │       └── index.css
│   ├── public/
│   ├── vite.config.ts                    # Proxies /api → localhost:3000
│   └── package.json
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
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. Requests to `/api/*` are proxied to port 3000.

---

## API Endpoints

### Tasks API (Requires Authenticated JWT Header)
| Method   | Endpoint          | Required Role       | Description   |
|----------|-------------------|---------------------|---------------|
| `GET`    | `/api/tasks`      | Any Authenticated   | List all tasks |
| `POST`   | `/api/tasks`      | Superadmin, Manager | Create task    |
| `PUT`    | `/api/tasks/:id`  | Superadmin, Manager | Update task    |
| `DELETE` | `/api/tasks/:id`  | Superadmin, Manager | Delete task    |

### Authentication API (Public)
| Method   | Endpoint                  | Description   |
|----------|---------------------------|---------------|
| `POST`   | `/api/auth/register`      | Register a new account with specified role |
| `POST`   | `/api/auth/login`         | Sign in and receive token |
| `POST`   | `/api/auth/forgot-password`| Request reset password token (logged to console) |
| `POST`   | `/api/auth/reset-password` | Submit token and change password |
| `GET`    | `/api/auth/me`            | Check currently logged-in user profile |
| `GET`    | `/health`                 | API health status check |

---

## Manual Verification Checklist

- [ ] Backend starts and connects to MongoDB.
- [ ] `npm run seed` populates sample tasks and default role-specific users.
- [ ] Users are redirected to `/signin` if not authenticated.
- [ ] Signing in as **Employee** disables task management (hides/disables CRUD actions).
- [ ] Signing in as **Superadmin** shows the glowing "Superadmin Mode" sidebar banner and restores full CRUD permissions.
- [ ] Account registration succeeds and matches selected role.
- [ ] Forgot password token generates successfully, prints to dev console, and is usable on the Reset Password page.
- [ ] Live searching and dropdown filters function on the task list.
- [ ] Dashboard charts dynamically reflect active database items.
- [ ] Theme toggler operates in both light and dark mode.
