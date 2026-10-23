# Paideia — School Management System

## Project Documentation

**Version:** 0.2.0
**Last Updated:** October 2026
**Status:** In Development

---

## 1. Executive Summary

**Paideia** is a comprehensive, role-based school management system designed for high schools. It centralizes student records, staff management, parent communication, academic operations, and administrative workflows into a single, secure platform.

The system is built on a **role-driven architecture** where every user — student, teacher, parent, or admin — sees only the data and actions relevant to their role, enforced through a granular permission system.

### Core Objectives

1. **Unify school operations** — replace fragmented spreadsheets, paper forms, and disconnected tools with one system.
2. **Enforce role-based access control (RBAC)** — every action is gated by an explicit permission, not by hardcoded route checks.
3. **Support the full academic lifecycle** — from admission through graduation, including academics, finance, boarding, sports, clubs, and staff management.
4. **Enable parent engagement** — give parents visibility into their children's academic progress, attendance, fees, and school life.
5. **Provide auditable, extensible administration** — every administrative action is traceable, and new roles can be added without code changes.

---

## 2. System Architecture

### 2.1 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js (ES Modules) | Server-side JavaScript execution |
| **Framework** | Express.js | HTTP routing and middleware |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Sequelize | Model definitions, associations, migrations |
| **Migrations** | node-pg-migrate | Versioned schema changes |
| **Authentication** | JWT (access + refresh tokens) | Stateless session management |
| **Logging** | Pino + pino-http | Structured request/application logging |
| **Environment** | dotenv | Configuration management |
| **File Storage** | Local `uploads/` directory | Photos, documents |

### 2.2 Project Structure

```
paideia/
├── Config/
│   ├── permissions.json          # Permission catalog + role presets
│   └── permissions.js            # Loader + helpers
├── Models/
│   ├── Users.model.js
│   ├── Students.model.js
│   ├── Teachers.model.js
│   ├── Parents.model.js
│   ├── Admins.model.js
│   ├── Parent_Student.model.js
│   └── ... (academic, dorm, etc.)
│   ├── index.js                  # Associations barrel
├── Routes/
│   ├── User.route.js
│   ├── Student.route.js
│   ├── Teacher.route.js
│   ├── Parent.route.js
│   └── Admin.route.js
├── Repositories/
│   └── ... (data access layer)
├── Services/
│   └── ... (business logic)
├── Middleware/
│   ├── authenticate.js
│   ├── authorize.js
│   └── errorHandler.js
├── Utils/
│   ├── db.js                     # Sequelize instance
│   └── logger.js                 # Pino logger
├── migrations/
│   └── ... (node-pg-migrate files)
├── uploads/                      # User-uploaded files
├── app.js                        # Express entry point
└── package.json
```

---

## 3. Data Model Overview

The system is built around a central `Users` table, with **role-specific profile tables** linked one-to-one. This allows a single user identity to hold exactly one role profile, while keeping role-specific fields separate.

### 3.1 Core Identity Model

```
Users (user_id, email, password, first_name, last_name, phone, gender, role)
  │
  ├── 1:1 → Students  (studentProfile)
  ├── 1:1 → Teachers  (teacherProfile)
  ├── 1:1 → Parents   (parentProfile)
  └── 1:1 → Admins    (adminProfile)
```

### 3.2 Key Entities

| Model | Purpose |
|---|---|
| **Users** | Central identity — credentials, contact info, role |
| **Students** | Student-specific fields: DOB, nationality, grade, enrollment, medical notes |
| **Teachers** | Teacher-specific fields: employee ID, qualification, employment type, dates |
| **Parents** | Parent-specific fields: relationship, alternate contact, occupation |
| **Admins** | Admin-specific fields: position, permissions (JSONB), office, qualification |
| **ParentStudent** | M:N join linking parents to their children |
| **AcademicYears / Terms** | Academic calendar structure |
| **ClassLevels / ClassStreams / ClassSubjects** | Class organization |
| **Enrollments** | Student → class assignments per term |
| **Subjects** | Subject catalog |
| **Grade / Assignment / Submission** | Academic assessment |
| **Rubric / RubricCriterion / RubricScore** | Structured grading |
| **Dormitorys / DormRooms / DormBeds / DormAssignments** | Boarding management |
| **Announcement / Comment / Feedback** | Communication |
| **LearningMaterial / MaterialView** | Resource management |
| **DynamicQuestion / QuestionResponse** | Flexible assessments |

### 3.3 Soft Delete Policy

All models use **paranoid mode** (`deleted_at` timestamp). Deleted records are excluded from default queries but recoverable.

### 3.4 Audit Fields

All models track `created_at`, `updated_at`, and `deleted_at` using timestamptz for timezone safety.

---

## 4. Role-Based Access Control

### 4.1 The Permission System

Access control is built on a **two-layer model**:

1. **Static catalog** — `Config/permissions.json` defines every valid permission key, every position, and every department scope.
2. **Per-admin grants** — `Admins.permissions` (JSONB column) stores what a specific admin actually holds.

```
permissions.json          → "What CAN exist in the system"
admins.permissions (JSONB)→ "What THIS admin actually HAS"
```

This separation allows adding new roles without schema migrations, while still enforcing strict validation.

### 4.2 Permission Catalog

Each permission key has metadata:

```json
"student:record:edit": {
  "label": "Edit student records",
  "module": "students",
  "riskLevel": "high"
}
```

Risk levels (`low`, `medium`, `high`, `critical`) inform UI warnings and audit requirements.

### 4.3 Admin Roles

The system defines **60+ admin positions** across 11 departments:

| Department | Example Positions |
|---|---|
| **Leadership** | Principal, Vice Principal, Assistant Principals |
| **Finance** | Business Manager, Accountant, Payroll Officer |
| **Academics** | Academic Dean, Registrar, HoD, SEN Coordinator |
| **Student Affairs** | Dean of Students, Counselor, Nurse |
| **Sports** | Athletic Director, Head Coach, Trainer |
| **Clubs** | Clubs Coordinator, Band Director, STEM Coordinator |
| **Dorms** | Director of Boarding, Housemaster, Matron |
| **HR** | HR Manager, CPD Coordinator, Compliance Officer |
| **Operations** | Facilities Manager, Transport Manager, Security |
| **IT** | IT Manager, IT Support, Data Protection Officer |
| **Communications / Admissions / Development** | Marketing, Admissions, Fundraising |

Each position has:
- **Default permissions** — auto-applied on creation
- **Department** — for scoping (e.g., which sports a coach handles)
- **Seniority** — for escalation rules
- **Scope requirement** — some positions (HoD, Head Coach, Club Advisor) must specify which domain they manage

### 4.4 Scoped Permissions

Some permissions are limited to a domain:

```json
{ "sport:manage": true, "scope": "football" }
```

A football coach with `sport:manage` cannot manage basketball. Scopes are validated against `permissions.json → departments`.

### 4.5 Super-Admin

The `Principal` position (and any admin granted `"all": true`) bypasses per-key checks. Only a super-admin may grant `"all"` to another admin — enforced server-side.

---

## 5. Feature Modules

### 5.1 Authentication & Account Management

**Status:** In progress (next phase)

- JWT-based login/logout
- Refresh token rotation
- Password reset via email
- Email verification
- Account locking after failed attempts
- Session invalidation on password change

### 5.2 User Management

**Status:** Students, Teachers, Parents, Admins — models complete, routes in progress

- Create/list/view/update/delete each role
- Role-specific validation (dates, employee IDs, grade levels)
- Cascade delete policies (soft delete by default)

### 5.3 Parent–Student Linking

**Status:** Model + associations complete

- Many-to-many via `ParentStudent` join table
- Track relationship (`father`, `mother`, `guardian`) per link
- Mark primary contact per student
- Endpoint: `GET /parent/:id/children` returns children with full profile

### 5.4 Academic Management

**Status:** Planned (Phase 5)

- Academic years and terms
- Class levels and streams
- Subject catalog
- Enrollments per term
- Class-subject assignments

### 5.5 Assessment & Grading

**Status:** Planned

- Assignments
- Submissions
- Rubric-based grading
- Grade publishing

### 5.6 Boarding / Dormitory

**Status:** Planned

- Dormitories → rooms → beds hierarchy
- Dorm assignments
- Dorm-specific permissions (Housemaster, Matron)

### 5.7 Communication

**Status:** Planned

- Announcements (school-wide or targeted)
- Comments and feedback
- Email notifications (see Section 7)

### 5.8 Extracurricular

**Status:** Data model ready (via admin permissions)

- Sports teams and coaches
- Clubs and advisors
- Scoped management per sport/club

---

## 6. Security Model

### 6.1 Authentication

- Passwords hashed (bcrypt/argon2 — to be confirmed in implementation)
- JWT access tokens (short-lived, ~15 min)
- Refresh tokens (long-lived, ~7–30 days, rotating)
- Tokens invalidated on password change or admin revocation

### 6.2 Authorization

- Every protected route wrapped with `authenticate` (identifies user) then `authorize(permissionKey)` (checks grant)
- Permission checks read from DB + validated against `permissions.json`
- Scope-aware checks for domain-limited roles
- Super-admin (`"all": true`) bypass — audited

### 6.3 Data Protection

- `password` excluded from all serialized responses
- `deleted_at` excluded from default scopes
- Sensitive fields (`medical_notes`, `counseling_notes`) gated behind specific permissions
- Soft deletes preserve audit trail

### 6.4 Audit & Compliance

- All mutations logged with actor, timestamp, before/after (planned)
- Data Protection Officer role with `privacy:manage`, `data_request:manage`, `breach:manage`
- Safeguarding Officer with `safeguard:manage`, `authority:report`, `confidential:access`

### 6.5 Error Handling

- Centralized error middleware maps:
  - `SequelizeUniqueConstraintError` → 409
  - `SequelizeValidationError` → 400
  - Unknown errors → 500 (never leaked to client)
- Structured logging via Pino (request, response, error)

---

## 7. Email & Notification System

### 7.1 Scope

The system sends transactional and informational emails to all four roles. Emails are categorized:

| Category | Examples |
|---|---|
| **Account & Security** | Welcome, password reset, email verification, suspicious login |
| **Academic** | Enrollment confirmation, report cards, exam schedules |
| **Attendance** | Absence alerts, late arrivals |
| **Financial** | Fee bills, payment confirmations, overdue reminders |
| **School Life** | Events, field trips, newsletters |
| **Administrative** | Task assignments, approvals, reports |
| **Emergency** | School closures, safety alerts (non-opt-out) |

### 7.2 Architecture (Planned)

- Central `emailService.sendEmail({ to, template, data })`
- Templates stored as files or inline
- Priority levels: `critical` (bypass user prefs), `transactional`, `informational`
- Batching for reminders

### 7.3 Recipient-Specific Emails

| Role | Sample Emails |
|---|---|
| **Student** | Enrollment confirmation, exam results, assignment reminders, dorm assignment |
| **Teacher** | Teaching assignment, grade submission deadlines, leave approvals, payslips |
| **Parent** | Absence alerts, report cards, fee bills, field trip permissions |
| **Admin** | Account setup, permission changes, system alerts, workflow approvals |

---

## 8. Current Progress

### Completed

| Area | Status |
|---|---|
| Database schema (core models) | ✅ Complete |
| Migrations (teachers, students) | ✅ Complete (with type fix pending) |
| Associations (Users ↔ Students/Teachers/Parents/Admins) | ✅ Complete (one bug fix pending) |
| Parent–Student M:N | ✅ Complete |
| Permissions JSON catalog | ✅ Complete |
| Permission loader & validator | ✅ Complete |
| Route skeletons (User, Student, Teacher, Parent, Admin) | ✅ Complete |
| Authentication middleware | ⏳ Next |
| Admin CRUD | ⏳ Next |
| Student / Teacher / Parent CRUD | ⏳ Next |
| Email service | ⏳ Next |

### Known Issues to Fix

1. **`Admins.hasMany(Admins, ...)`** — should be `Users.hasMany(Admins, ...)`
2. **`Admim.route.js`** typo — should be `Admin.route.js`
3. **`status_enum` collision** — teachers and students migrations share the same ENUM type name; need distinct names (`teacher_status_enum`, `student_status_enum`)
4. **`dotenv.config()` ordering** — must be the first import (`import 'dotenv/config'`) so DB config reads env vars
5. **`permissions.json` index bug** — `fields: ['name']` references a non-existent column in the `ParentStudent` model

---

## 9. Roadmap

### Phase 1 — Authentication (Next)

- `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`
- `authenticate` and `authorize` middleware
- JWT signing/verification service

### Phase 2 — Admin CRUD & Permission Enforcement

- Full admin CRUD with validation against `permissions.json`
- Position catalog endpoints (`GET /admin/positions`)
- Config reload endpoint
- Super-admin seeding script

### Phase 3 — Students, Teachers, Parents CRUD

- Full CRUD for each role
- Parent–child linking endpoints
- Date validation, uniqueness validation

### Phase 4 — Account Security

- Password reset, email verification, change password
- Rate limiting on auth endpoints
- Session invalidation

### Phase 5 — Academic Core

- Academic years, terms, classes, subjects
- Enrollments
- Timetables

### Phase 6 — Assessment

- Assignments, submissions, rubrics, grading

### Phase 7 — Boarding & Extracurricular

- Dorms, sports, clubs

### Phase 8 — Communication

- Announcements, email system, notifications

---

## 10. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Response time** | < 300 ms p95 for read endpoints |
| **Concurrency** | 500+ concurrent users per school |
| **Data retention** | Soft deletes retained indefinitely; hard purge on request |
| **Availability** | 99.5% uptime target |
| **Security** | OWASP Top 10 mitigations; passwords never logged |
| **Auditability** | All mutations logged with actor, timestamp, diff |
| **Portability** | PostgreSQL 14+; Node 20+ |

---

## 11. Development Conventions

| Convention | Rule |
|---|---|
| **File naming** | `<Entity>.model.js`, `<Entity>.route.js`, `<Entity>.repository.js` |
| **Imports** | Always from `Models/index.js`, never directly from `Models/*.model.js` (prevents duplicate model instances) |
| **Association aliases** | Explicit `as:` on every association; match through-model aliases to `belongsToMany` `as:` |
| **Environment** | `import 'dotenv/config'` must be first in `app.js` |
| **Errors** | Throw objects with `statusCode`; central handler maps to HTTP status |
| **Dates** | API accepts `YYYY-MM-DD` for date-only fields; models use `DATEONLY` for pure dates |
| **Permissions** | Never hardcode permission strings — import from `Config/permissions.js` |
| **Migrations** | One migration per logical change; always include `down` |

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **Position** | An admin role key from `permissions.json` (e.g., `academic_dean`) |
| **Permission** | A capability key (e.g., `student:record:edit`) |
| **Scope** | A domain limitation (e.g., `football`, `mathematics`) |
| **Preset** | Default permissions for a position, from JSON |
| **Grant** | A permission recorded in `admins.permissions` |
| **Super-admin** | An admin with `"all": true` |
| **Paranoid** | Sequelize soft-delete mode using `deleted_at` |
| **HoD** | Head of Department |
| **SEN** | Special Educational Needs |
| **CPD** | Continuing Professional Development |
| **DPO** | Data Protection Officer |
| **IEP** | Individualized Education Plan |

---

## 13. Open Questions

1. **Password hashing** — bcrypt vs argon2? (recommend argon2id)
2. **File storage** — stay local or move to S3-compatible (MinIO/S3)?
3. **Multi-tenancy** — one database per school, or shared schema with `school_id`?
4. **Time zone handling** — store UTC timestamptz (current) but what timezone does the school operate in for scheduling?
5. **Email provider** — SMTP, SendGrid, Mailgun, or AWS SES?
6. **Payment gateway** — how are fees collected? (Stripe, local gateway, bank transfer)
7. **SMS** — needed for parents without email?
8. **Mobile app** — is a native app planned, or web-only?

---

*This document is a living specification and will evolve as implementation progresses. For the latest association wiring, permission catalog, and API contracts, refer to the source files in `Config/` and `Models/`.*