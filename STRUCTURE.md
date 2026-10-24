# Application Structure: JivitNhom

This document outlines the architecture, directory layout, database schema, and operational flows of the JivitNhom task management application.

---

## 1. System Overview

The system is organized into two primary applications communicating via a REST API:

```
[ Frontend: React 19 + Vite ] (Port 5173)
              |
              | HTTP / JSON + Bearer JWT + HttpOnly Cookie
              v
[ Backend: NestJS 12 ] (Port 3000)
              |
              | TypeORM (Active Record / Repository Pattern)
              v
[ Database: PostgreSQL 16 ] (Port 5432)
```

- **Frontend**: Single-page application using React 19, React Router v7, and Axios.
- **Backend**: Modular API using NestJS, Passport-JWT, Argon2, and TypeORM.
- **Database**: Relational PostgreSQL database managed with explicit migrations.

---

## 2. Directory Layout

### Workspace Root

```
ToDo-App/
├── backend/            Backend NestJS application
├── frontend/           Frontend React application
├── README.md           Project introduction and run instructions
└── STRUCTURE.md        Application structure and technical reference
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── main.ts                     Application entry point, CORS, cookie parser, port binding
│   ├── app.module.ts               Root module configuring TypeORM, Throttler, and feature modules
│   │
│   ├── auth/                       Authentication and token lifecycle
│   │   ├── auth.module.ts          Wires JwtModule, Passport, and repositories
│   │   ├── auth.controller.ts      Endpoints: /api/auth/signup, /login, /refresh, /logout
│   │   ├── auth.service.ts         Password hashing (Argon2), token generation, rotation
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts   Extracts authenticated user from request
│   │   │   └── public.decorator.ts         Marks endpoints that bypass JWT guard
│   │   ├── dto/
│   │   │   ├── signup.dto.ts       Validation rules for user registration
│   │   │   └── login.dto.ts        Validation rules for user login
│   │   ├── entities/
│   │   │   └── refresh-token.entity.ts     RefreshToken entity (tokenHash, revoked, expiresAt)
│   │   └── strategies/
│   │       ├── jwt.strategy.ts     Validates Bearer access tokens
│   │       └── jwt-auth.guard.ts   Global guard enforcing JWT on all routes
│   │
│   ├── users/                      User domain and administration
│   │   ├── users.module.ts         Configures UsersService, UsersController, User repository
│   │   ├── users.controller.ts     Endpoints: /api/users/me, /api/users, /api/users/:id
│   │   ├── users.service.ts        User CRUD and profile operations
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts  Sets required roles metadata
│   │   ├── entities/
│   │   │   ├── user.entity.ts      User entity (id, email, passwordHash, role)
│   │   │   └── role.enum.ts        Role definition ('USER', 'ADMIN')
│   │   └── guards/
│   │       └── roles.guard.ts      Enforces role-based permissions
│   │
│   ├── todos/                      Task management domain
│   │   ├── todos.module.ts         Wires TodosService, TodosController, Todo repository
│   │   ├── todos.controller.ts     Endpoints: /api/todos (GET, POST, PATCH, DELETE)
│   │   ├── todos.service.ts        Task CRUD scoped strictly by ownerId
│   │   ├── dto/
│   │   │   ├── create-todo.dto.ts  Validation for task creation
│   │   │   └── update-todo.dto.ts  Validation for task modification
│   │   └── entities/
│   │       ├── todo.entity.ts      Todo entity (id, title, status, ownerId)
│   │       └── todo-status.enum.ts Status definition ('TODO', 'IN_PROGRESS', 'DONE')
│   │
│   ├── migrations/                 Version-controlled TypeORM database migrations
│   └── data-source.ts              TypeORM CLI migration configuration
│
├── create-admin.mjs                CLI utility to seed or promote administrator accounts
├── package.json                    Backend dependencies and run scripts
└── tsconfig.json                   TypeScript compiler configuration
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── main.jsx                    Application bootstrapper and DOM renderer
│   ├── App.jsx                     Root layout, navigation bar, and route switchboard
│   ├── index.css                   Design tokens, themes (dark/light), and global styles
│   │
│   ├── api/                        HTTP client and backend communication
│   │   ├── client.js               Axios instance with Bearer auth and silent 401 refresh interceptor
│   │   ├── auth.js                 Auth API calls (signup, login, refresh, logout)
│   │   ├── todos.js                Todo API calls (fetch, create, update, delete)
│   │   └── users.js                Admin user management API calls
│   │
│   ├── context/                    Global state providers
│   │   ├── AuthContext.jsx         Authentication context (session state, login, logout, refresh)
│   │   └── useAuth.js              Custom hook for accessing AuthContext
│   │
│   └── components/
│       ├── auth/
│       │   ├── LoginPage.jsx       Dual-mode login and registration interface
│       │   ├── ProtectedRoute.jsx  Route guard requiring an active session
│       │   └── AdminRoute.jsx      Route guard requiring the ADMIN role
│       ├── todos/
│       │   ├── TodoApp.jsx         Main task workspace (filtering, search, stats)
│       │   ├── TodoItem.jsx        Single task card with inline actions
│       │   ├── TodoFilter.jsx      Status filter bar
│       │   └── TodoStats.jsx       Workspace progress summary
│       ├── admin/
│       │   └── AdminDashboard.jsx  Admin panel (system stats, user directory, role control)
│       └── profile/
│           └── ProfilePage.jsx     User profile and session view
│
├── package.json                    Frontend dependencies and scripts
└── vite.config.js                  Vite development and build configuration
```

---

## 3. Database Schema

The database contains three core tables managed via TypeORM migrations:

```
+-------------------------------------------------------------+
|                            users                            |
+-------------------------------------------------------------+
| id            | UUID            | Primary Key               |
| email         | VARCHAR(255)    | Unique                    |
| passwordHash  | VARCHAR(255)    | Hidden from default query |
| role          | VARCHAR(20)     | 'USER' or 'ADMIN'         |
| createdAt     | TIMESTAMP       | Automatic timestamp       |
| updatedAt     | TIMESTAMP       | Automatic timestamp       |
+-------------------------------------------------------------+
        |                                     |
        | 1:N                                 | 1:N
        v                                     v
+-------------------------------+   +-------------------------------+
|             todos             |   |         refresh_tokens        |
+-------------------------------+   +-------------------------------+
| id        | UUID    | PK      |   | id        | UUID    | PK      |
| title     | VARCHAR | Req     |   | tokenHash | VARCHAR | Unique  |
| status    | VARCHAR | Req     |   | revoked   | BOOLEAN | Def F   |
| ownerId   | UUID    | FK(user)|   | expiresAt | TIMESTP | Req     |
| createdAt | TIMESTP | Auto    |   | userId    | UUID    | FK(user)|
| updatedAt | TIMESTP | Auto    |   | createdAt | TIMESTP | Auto    |
+-------------------------------+   +-------------------------------+
```

---

## 4. Key Architectural Flows

### Authentication and Session Lifecycle

1. **Registration (`POST /api/auth/signup`)**:
   - Accepts email and password.
   - Verifies email uniqueness.
   - Hashes password using Argon2id.
   - Persists user with default role `USER`.
   - Returns sanitized user record (excluding `passwordHash`).

2. **Login (`POST /api/auth/login`)**:
   - Verifies credentials via Argon2.
   - Generates a short-lived Access Token (JWT, 15m lifetime).
   - Generates a cryptographically unique Refresh Token (JWT, 7d lifetime).
   - Stores SHA-256 hash of the refresh token in the database.
   - Sends the access token in the JSON response body.
   - Sends the refresh token in an `HttpOnly`, `SameSite=Lax` cookie named `refreshToken`.

3. **Silent Token Refresh (`POST /api/auth/refresh`)**:
   - Triggered automatically by the frontend Axios interceptor when any API request receives a `401 Unauthorized`.
   - The backend reads the `refreshToken` cookie, verifies signature, and looks up the active hash in the database.
   - The used refresh token is revoked (rotation pattern).
   - A new access token and a replacement refresh token cookie are issued.
   - Failed or queued requests are transparently replayed.

4. **Logout (`POST /api/auth/logout`)**:
   - Reads the cookie, marks the database refresh token record as revoked, and clears the cookie.

### Data Isolation and Ownership

- In `TodosService`, every read, write, update, and delete query includes `where: { ownerId: user.id }`.
- When an administrator queries `GET /api/todos`, all tasks across all users are returned.
- Regular users cannot view, edit, or delete tasks belonging to other accounts.

### Role-Based Access Control (RBAC)

- Handled on the backend via `@Roles(Role.ADMIN)` decorator and `RolesGuard`.
- Handled on the frontend via `<AdminRoute>`, which checks `user?.role === 'ADMIN'` and redirects unauthorized users to `/todos`.

---

## 5. Summary of Scripts

### Backend (`/backend`)

- `npm run start:dev`: Starts the NestJS server with hot-reload.
- `npm test`: Runs Vitest unit and integration test suite.
- `npm run migration:run`: Executes pending database migrations.
- `npm run migration:generate -- src/migrations/<Name>`: Generates migration from entity diffs.
- `npm run create:admin`: Creates default admin or custom admin specified in arguments.

### Frontend (`/frontend`)

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles production assets into `dist/`.
- `npm run lint`: Validates code style and rules using ESLint.
