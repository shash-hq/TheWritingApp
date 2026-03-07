# The Writing App

A premium, distraction-free blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). Designed for writers and thinkers who value a clean, focused environment.

## ✨ Features

- **Distraction-Free Editor** — Rich text editing powered by Tiptap with unobtrusive formatting controls.
- **Writer Profiles** — Letterboxd-style profile pages with a contribution graph and "Selected Works" showcase.
- **Discover Feed** — Typography-heavy cards for exploring new content.
- **Minimalist UI** — Off-white and deep gray palette with premium typography (`Inter` & serif stacks), built with Tailwind CSS.

## 🏗️ Project Structure

```
TheWritingApp/
├── apps/
│   ├── backend/    # Express + MongoDB API
│   └── frontend/   # React + Vite SPA
└── packages/       # Shared packages (future)
```

## 🛠️ Tech Stack

| Layer      | Technologies                                        |
| ---------- | --------------------------------------------------- |
| Frontend   | React 18 · TypeScript · Vite · Tailwind CSS · Tiptap |
| Backend    | Node.js · Express · MongoDB (Mongoose)              |
| Tooling    | npm workspaces · ESLint · Prettier · Vitest          |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a connection string

### 1. Clone & install

```bash
git clone https://github.com/shash-hq/TheWritingApp.git
cd TheWritingApp
npm install
```

### 2. Configure environment

Copy the example env files and fill in your values:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

> **Required:** Set a strong `JWT_SECRET` in `apps/backend/.env`.
> Generate one with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Start development

```bash
# From the root — starts both backend and frontend
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)

### 4. Run tests

```bash
npm test
```

## 📝 License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
