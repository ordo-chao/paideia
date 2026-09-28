# School Management & E-Learning System

A modern, full-featured school management platform with an integrated **e-learning engine** — designed to run the daily academic, administrative, and boarding operations of a school from a single backend, with a clean REST API for the frontend.

Built with **Node.js, Express, Sequelize, and PostgreSQL**.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Data Model Overview](#data-model-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
  - [Roles & Permissions](#roles--permissions)
  - [Dynamic Questions](#dynamic-questions)
  - [Rubrics](#rubrics)
  - [Grading & Feedback](#grading--feedback)
- [API Overview](#api-overview)
- [Scripts](#scripts)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Schools juggle dozens of disconnected tools: one for student records, another for grades, another for hostel assignments, a third for homework, and a spreadsheet for parent contacts. **This project unifies all of them** into one coherent system with a single source of truth.

The platform has two deeply integrated halves:

1. **School Management** — students, teachers, parents, classes, subjects, enrollment, dormitories.
2. **E-Learning** — learning materials, assignments, quizzes, submissions, grading, feedback, rubrics, and dynamic Q&A.

Everything is scoped to a **class subject** or an **assignment**, so data flows naturally from enrollment → teaching → assessment → feedback.

The project is inspired by tools like **Google Classroom, Moodle, and Canvas**, but is tailored to the operational realities of a school (boarding, class teachers, warden assignments, parent records, CBC/8-4-4-friendly class structures).

---

## Core Features

### 👨‍🎓 Student & Staff Management
- Student profiles with admission numbers, medical notes, guardians.
- Teacher profiles with employment info, qualifications, and assignments.
- Parent/guardian records linked to multiple students.
- Admin accounts with granular permissions.

### 🏫 Academic Structure
- Academic years and terms (support for CBC, 8-4-4, IGCSE, or custom).
- Class levels and streams (e.g. *Grade 7 East*).
- Subjects, class subjects, and teacher assignments.
- Student enrollment per academic year.

### 🛏️ Boarding / Dormitory
- Dorms, rooms, and individual beds.
- Gender-aware placement, capacity enforcement.
- Term-based dorm assignments with warden tracking.

### 📚 E-Learning
- **Learning materials** — notes, PDFs, videos, slides, external links.
- **Assignments** — homework, quizzes, projects, essays, coding, discussions.
- **Submissions** — text, files, URLs, quiz answers; multiple attempts supported.
- **Grading** — manual grading, auto-graded quizzes, weighted scores.
- **Feedback** — text comments, audio notes, private/public.
- **Rubrics** — structured, criterion-by-criterion grading.
- **Announcements** — class-wide or stream-wide communication.
- **Progress tracking** — who viewed a material, for how long, and whether completed.

### 🧩 Dynamic Questions
- A flexible form engine for quizzes, surveys, registration, and Q&A.
- Supports 16 question types (text, radio, checkboxes, file, rating, etc.).
- Conditional logic, validation rules, and auto-grading via `correct_answer`.

### 🔐 Role-Based Access
- Admin / Teacher / Student / Parent scopes enforced on every endpoint.
- Teachers see only their classes; students see only what they're enrolled in.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         REST API (Express)                     │
├────────────────────────────────────────────────────────────────┤
│                        Controllers / Routes                    │
├────────────────────────────────────────────────────────────────┤
│         Services (grading, quiz auto-grade, notifications)     │
├────────────────────────────────────────────────────────────────┤
│                       Sequelize ORM Models                     │
│  Users · Students · Teachers · Classes · Dorms · Assignments…  │
├────────────────────────────────────────────────────────────────┤
│                       PostgreSQL Database                      │
└────────────────────────────────────────────────────────────────┘
```

Design principles:

- **Single source of truth** — one `users` table, extended by role profiles.
- **Scoped by context** — most entities hang off `class_subject_id` or `assignment_id`.
- **Soft deletes** — `paranoid: true` on key entities (e.g. dynamic questions).
- **JSONB for flexibility** — quiz configs, rubric-adjacent fields, question options.
- **Centralized associations** — one `associations.js` file wires all relations, avoiding circular imports.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| ORM | Sequelize |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Validation | JSONB-backed dynamic rules + schema validators |
| File Storage | Local or S3 (configurable via `file_url`) |
| Testing | Jest + Supertest |

---

## Data Model Overview

The schema is organized into six layers:

### 1. Identity
`users`, `students`, `teachers`, `parents`, `admins`

### 2. Academic Structure
`academic_years`, `terms`, `class_levels`, `class_streams`, `subjects`, `class_subjects`, `enrollments`

### 3. Boarding
`dorms`, `dorm_rooms`, `dorm_beds`, `dorm_assignments`

### 4. E-Learning Core
`learning_materials`, `assignments`, `assignment_materials`, `submissions`, `grades`, `feedback`

### 5. Structured Assessment
`rubrics`, `rubric_criteria`, `rubric_scores`

### 6. Engagement & Dynamic Content
`attachments`, `comments`, `material_views`, `announcements`, `dynamic_questions`, `question_responses`

**Key relationships**

- A `ClassSubject` connects a `ClassStream` + `Subject` + `Teacher` → this is the atom of teaching.
- An `Assignment` belongs to a `ClassSubject` and produces many `Submissions`.
- Each `Submission` produces at most one `Grade`, which can be broken down into `RubricScores`.
- A `DynamicQuestion` can belong to a `ClassSubject`, an `Assignment`, or neither (standalone form).
- A `QuestionResponse` can attach to a `Submission` (quiz) or stand alone (survey).

---

## Getting Started

### Prerequisites

- Node.js **>= 18**
- PostgreSQL **>= 14**
- npm or yarn

### Installation

```bash
git clone https://github.com/<your-org>/school-system.git
cd school-system
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_LOGGING=false

# Auth
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d

# File storage (optional)
STORAGE_DRIVER=local          # local | s3
S3_BUCKET=
S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### Database Setup

```bash
# Create the database
createdb school_db

# Sync models (development only — do NOT use in production)
npm run db:sync

# Or run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### Running the App

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:4000`.

---

## Project Structure

```
school-system/
├── src/
│   ├── Utils/
│   │   └── db.js                  # Sequelize instance
│   ├── models/                    # All Sequelize models
│   │   ├── index.js               # Bootstraps + wires associations
│   │   ├── associations.js        # All relations in one place
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── ClassSubject.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Grade.js
│   │   ├── Rubric.js
│   │   ├── DynamicQuestion.js
│   │   ├── QuestionResponse.js
│   │   └── ...
│   ├── controllers/
│   ├── routes/
│   ├── services/                  # Grading, auto-grade, notifications
│   ├── middlewares/               # Auth, RBAC, error handling
│   ├── validators/
│   └── app.js                     # Express app
├── migrations/
├── seeders/
├── tests/
├── .env.example
├── package.json
└── README.md
```

---

## Key Concepts

### Roles & Permissions

| Role | Can Do |
|------|--------|
| **Admin** | Full access to all resources; manage users, classes, dorms, materials. |
| **Teacher** | Manage own class subjects, create materials/assignments, grade submissions, give feedback, post announcements. |
| **Student** | View enrolled class materials, submit assignments, view own grades, ask questions. |
| **Parent** | View own children's grades, attendance, announcements. |

Enforcement happens via JWT middleware + role guards in `middlewares/auth.js`.

### Dynamic Questions

A **dynamic question** is a reusable form field that can be used for:

- **Quizzes** — multiple-choice with `correct_answer` → auto-graded.
- **Surveys / feedback forms** — free-form responses.
- **Registration forms** — collected before enrollment.
- **Reflection prompts** — after an event.

Supported types: `text`, `textarea`, `number`, `email`, `phone`, `date`, `time`, `datetime`, `select`, `multiselect`, `radio`, `checkbox`, `checkboxes`, `file`, `rating`, `url`.

Each question can:
- Define `options` for select/radio/checkbox types.
- Define `validation_rules` (required, min, max, pattern).
- Show conditionally via `conditional_logic`.
- Award points via `points` and `correct_answer`.

### Rubrics

A rubric is a **criterion-by-criterion grading guide**. Instead of a single score, the teacher grades each dimension:

| Criterion | Max | Score |
|-----------|-----|-------|
| Thesis | 25 | 20 |
| Evidence | 25 | 18 |
| Structure | 20 | 15 |
| Grammar | 15 | 12 |
| Citations | 15 | 10 |

The sum (`75`) becomes the assignment's `score`, and per-criterion comments provide rich feedback.

### Grading & Feedback

- Grades are attached to **submissions**, not directly to students.
- Each submission can have **one Grade**.
- Each Grade can have **multiple Feedback** entries and **multiple RubricScores**.
- Letter grades and pass/fail are computed by the grading service.

---

## API Overview

A quick reference. Full docs live in `docs/API.md` (Swagger/OpenAPI).

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Students
```
POST   /api/students
GET    /api/students
GET    /api/students/:id
PATCH  /api/students/:id
DELETE /api/students/:id
```

### Classes
```
POST   /api/classes/academic-years
POST   /api/classes/terms
POST   /api/classes/levels
POST   /api/classes/streams
POST   /api/classes/streams/:id/subjects
POST   /api/classes/enrollments
```

### Dorms
```
POST   /api/dorms
POST   /api/dorms/:id/rooms
POST   /api/dorms/assignments
GET    /api/dorms/:id/rooms
```

### Materials & Assignments
```
POST   /api/materials
POST   /api/assignments
GET    /api/assignments?class_subject_id=...
POST   /api/assignments/:id/publish
POST   /api/assignments/:id/submit
POST   /api/assignments/submissions/:id/grade
```

### Rubrics
```
POST   /api/rubrics
GET    /api/rubrics/assignment/:assignmentId
POST   /api/rubrics/:id/score/:gradeId
```

### Dynamic Questions
```
POST   /api/dynamic-questions
GET    /api/dynamic-questions?assignment_id=...
POST   /api/dynamic-questions/responses
GET    /api/dynamic-questions/:id/responses
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start with hot reload |
| `npm start` | Start in production mode |
| `npm run db:sync` | Sync models (dev only) |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Tests in watch mode |

---

## Testing

```bash
npm test
```

Tests are organized as:

- `tests/unit/` — services (grading, auto-grade, validation).
- `tests/integration/` — API endpoints with a test DB.
- `tests/e2e/` — full flows: enroll → assign → submit → grade.

---

## Roadmap

### ✅ Completed
- Core identity and academic structure.
- Dormitory management.
- Assignments, materials, submissions.
- Grading, feedback, rubrics.
- Dynamic questions and responses.

### 🚧 In Progress
- Attendance module.
- Timetable / scheduling.
- Notifications (email + SMS + in-app).
- REST API documentation (OpenAPI).

### 🔜 Planned
- Fees & invoicing.
- Report cards and printable transcripts.
- Parent portal enhancements.
- Analytics dashboards (per student, class, and teacher).
- Mobile app (React Native).
- Web frontend (React + Tailwind).
- Multi-tenant (SaaS) support.

---

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Commit using conventional commits: `feat: add attendance module`.
4. Push and open a Pull Request.

Please run `npm run lint && npm test` before pushing.

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

> **Built for schools that want to run everything from one place — students, staff, classes, dorms, and a modern e-learning experience.**