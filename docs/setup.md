# RetroTask — Setup Guide

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** running locally or a remote connection URI

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd day7
```

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 2. Environment Variables

### Backend (`backend/.env`)

Copy the example and fill in your values:

```bash
cp backend/.env.example backend/.env
```

| Variable       | Default                                    | Description                   |
| -------------- | ------------------------------------------ | ----------------------------- |
| `PORT`         | `3000`                                     | Express server port           |
| `MONGODB_URI`  | `mongodb://127.0.0.1:27017/retrotask`      | MongoDB connection string     |
| `CORS_ORIGIN`  | `http://localhost:5173`                     | Allowed origin for CORS       |

---

## 3. Seed the Database (optional)

```bash
cd backend
npm run seed
```

---

## 4. Start Development Servers

### Backend

```bash
cd backend
npm run dev          # Runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm run dev          # Runs on http://localhost:5173 (proxies /api → backend)
```

---

## 5. Production Build

### Frontend

```bash
cd frontend
npm run build
npm run preview      # Preview the production build
```

### Backend

```bash
cd backend
npm run build
npm start
```
