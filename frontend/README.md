# NexusCore React Architecture App

A production-grade React 19 application wiring together lifted unidirectional state, leak-free live effects with explicit cleanups, race-condition-resilient data fetching across all four UI states, and client-side routing via React Router v7.

---

## Architecture & Core Modules

### 1. Lifted State (`TodoApp`)
- **Single Source of Truth**: `TodoApp` owns the `todos`, `filter`, `search` and `selectedIds` state. Each todo is `{ id, title, status, starred }` with status `To Do` / `In Progress` / `Done`.
- **Full CRUD (local state only)**: create (title + status), read/list, edit title inline or change status, delete.
- **Strict Unidirectional Flow**:
  - `AddTodo`: Owns only its local title/status inputs. Sends new todos up via `onAddTodo(title, status)`.
  - `TodoList`: Renders todos; dispatches `onUpdate`, `onDelete`, `onReorder` and `onToggleSelect` up.
  - `FilterBar`: Status tabs (`All`, `To Do`, `In Progress`, `Done`) with counts, plus search by title.
  - `BulkActions`: Select all, bulk delete and bulk status change for selected todos.
- **Extras**: drag and drop to reorder, star a todo as priority.
- **Account/Profile**: `/profile` page with an editable profile form. Profile state lives in `App`, so the username shows in the navbar and on the todo page.

### 2. Live Effects with Cleanups
Located in `src/components/LiveTracker.jsx`:
- **Window Resize Listener Effect**:
  ```jsx
  useEffect(() => {
    function handleResize() { setWindowWidth(window.innerWidth); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  ```
  *What its cleanup prevents*: **Removing the resize listener prevents dangling global window listeners and state update warnings on unmounted components when the viewport is resized.**
- **Clock Interval Timer Effect**:
  ```jsx
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  ```
  *What its cleanup prevents*: **Clearing the interval prevents background timer accumulation and memory leaks when navigating away to other views.**

### 3. User Directory: Race Condition Safe Fetching & 4 UI States
Located in `src/components/users/UserDirectory.jsx` and `src/components/users/UserDetail.jsx`:
- **Race Condition Prevention**: Implements an `isCancelled` flag pattern inside `useEffect`:
  ```jsx
  useEffect(() => {
    let isCancelled = false;
    const abortController = new AbortController();

    async function fetchUsers() {
      setIsLoading(true);
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', { signal: abortController.signal });
        const data = await res.json();
        if (!isCancelled) {
          setUsers(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!isCancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    }
    fetchUsers();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [retryTrigger]);
  ```
  *What its cleanup prevents*: **Setting `isCancelled = true` (and aborting the request) prevents stale out-of-order network responses from overwriting the latest component state upon route switching or refetching.**
- **All Four Rendered UI States**:
  1. **Loading Skeleton**: Smooth shimmer skeleton placeholders mirroring final layout.
  2. **Error Message**: Visual alert with exact error message and an interactive "Try Again" retry action.
  3. **Empty State**: Friendly illustration and contextual feedback when search filters or datasets yield zero items.
  4. **Data List**: Structured grid of user cards with live links to dynamic user detail pages (`/users/:id`).

### 4. React Router Dynamic Navigation & 404 Catch-All
- `/todos`: Lifted TodoApp interface.
- `/users`: Race-condition-safe User Directory with 4 states.
- `/users/:id`: Dynamic user profile reading parameter via `useParams()`, with param `id` driving the fetch effect.
- `*`: Custom 404 Catch-All page with path feedback and non-reloading `Link` back to `/todos`.

---

## One Sentence Per Effect: What Its Cleanup Prevents (Module Audit Summary)

1. **Window Resize Effect (`LiveTracker.jsx`)**: *Its cleanup removes the window event listener to prevent detached memory leaks and invalid state updates on unmounted components during viewport changes.*
2. **Clock Interval Effect (`LiveTracker.jsx`)**: *Its cleanup clears the interval timer to prevent unconstrained background thread timer accumulation across route navigation.*
3. **Directory Fetch Effect (`UserDirectory.jsx`)**: *Its cleanup sets a cancellation flag and aborts the ongoing HTTP request to prevent out-of-order responses from overwriting fresh data and eliminate unmounted state mutation warnings.*
4. **User Detail Fetch Effect (`UserDetail.jsx`)**: *Its cleanup cancels active requests when the user parameter `:id` changes or unmounts, preventing previous ID data from racing ahead and overwriting the currently inspected profile.*

---

## Running the Application Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run code linter
npm run lint

# Build production bundle
npm run build
```
