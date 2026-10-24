# JivitNhom - Khmer Todo Application

A full-stack task management application with role-based access control, secure authentication, and a responsive web interface.

## Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL, Passport-JWT, Argon2
- **Frontend**: React 19, Vite, React Router, Axios
- **Security**: Argon2 hashing, JWT access tokens, HttpOnly refresh token rotation, rate limiting

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure `backend/.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=todo

JWT_SECRET=your_jwt_secret_key_at_least_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_at_least_32_chars
FRONTEND_URL=http://localhost:5173
```

Run database migrations and seed the initial admin account:

```bash
npm run migration:run
npm run create:admin
```

Start the backend server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

### Frontend Setup

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Default Credentials

- **Email**: admin@example.com
- **Password**: Admin123!
- **Role**: ADMIN

Create additional admins via CLI:

```bash
cd backend
npm run create:admin -- user@domain.com Password123!
```

## API Overview

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register a new account
- `POST /api/auth/login` - Authenticate and receive tokens
- `POST /api/auth/refresh` - Refresh access token via cookie
- `POST /api/auth/logout` - Revoke refresh token and clear cookie

### Tasks (`/api/todos`)

- `GET /api/todos` - List tasks owned by the authenticated user
- `POST /api/todos` - Create a task
- `GET /api/todos/:id` - Retrieve task details
- `PATCH /api/todos/:id` - Update task status or title
- `DELETE /api/todos/:id` - Delete a task

### Users & Administration (`/api/users`)

- `GET /api/users/me` - Current user profile
- `GET /api/users` - List all users (Admin only)
- `PATCH /api/users/:id` - Update user or change role (Admin only)
- `DELETE /api/users/:id` - Delete user account (Admin only)

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend build check
cd frontend && npm run build
```
