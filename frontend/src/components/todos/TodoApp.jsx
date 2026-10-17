import { useState } from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import FilterBar from './FilterBar';
import BulkActions from './BulkActions';
import { ListChecks } from 'lucide-react';
import { STATUSES } from './statuses';

/**
 * TodoApp Component (Lifted State Owner)
 *
 * Architectural Role:
 * - Single source of truth for `todos`, `filter`, `search` and `selectedIds` state.
 * - Each todo is { id, title, status, starred } where status is one of STATUSES.
 * - AddTodo, FilterBar, BulkActions and TodoList hold NO shared state; they talk only through:
 *    - Props down (todos, filter, search, counts, selection)
 *    - Callbacks up (onAddTodo, onUpdate, onDelete, onReorder, onToggleSelect, bulk actions...)
 */
export default function TodoApp({ username }) {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Install Node.js & Vite ecosystem', status: 'Done', starred: false },
    { id: 2, title: 'Architect props-down/callbacks-up state', status: 'Done', starred: false },
    { id: 3, title: 'Build full CRUD for todos', status: 'In Progress', starred: true },
    { id: 4, title: 'Add an account/profile section', status: 'To Do', starred: false },
    { id: 5, title: 'Get ready for the NestJS session', status: 'To Do', starred: true },
  ]);

  const [currentFilter, setCurrentFilter] = useState('All'); // 'All' | one of STATUSES
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Create
  function handleAddTodo(title, status) {
    const newTodo = { id: Date.now(), title, status, starred: false };
    setTodos((prev) => [newTodo, ...prev]);
  }

  // Update (title, status or starred)
  function handleUpdateTodo(id, changes) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo))
    );
  }

  // Delete
  function handleDeleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  }

  // Drag and drop reorder: move the dragged todo to the position of the target todo
  function handleReorder(draggedId, targetId) {
    if (draggedId === targetId) return;
    setTodos((prev) => {
      const next = [...prev];
      const from = next.findIndex((t) => t.id === draggedId);
      const to = next.findIndex((t) => t.id === targetId);
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  // Multi-select
  function handleToggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  }

  function handleSelectAllVisible(select) {
    const visibleIds = filteredTodos.map((t) => t.id);
    setSelectedIds((prev) =>
      select
        ? [...new Set([...prev, ...visibleIds])]
        : prev.filter((id) => !visibleIds.includes(id))
    );
  }

  function handleBulkDelete() {
    setTodos((prev) => prev.filter((todo) => !selectedIds.includes(todo.id)));
    setSelectedIds([]);
  }

  function handleBulkStatus(status) {
    setTodos((prev) =>
      prev.map((todo) => (selectedIds.includes(todo.id) ? { ...todo, status } : todo))
    );
    setSelectedIds([]);
  }

  // Derived computations (Props down to children)
  const counts = { All: todos.length };
  STATUSES.forEach((status) => {
    counts[status] = todos.filter((t) => t.status === status).length;
  });

  const query = search.trim().toLowerCase();
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter !== 'All' && todo.status !== currentFilter) return false;
    if (query && !todo.title.toLowerCase().includes(query)) return false;
    return true;
  });

  const allVisibleSelected =
    filteredTodos.length > 0 && filteredTodos.every((t) => selectedIds.includes(t.id));

  return (
    <div className="todo-container">
      <div className="page-header">
        <div className="page-title-group">
          <ListChecks size={28} color="var(--primary)" />
          <h1 className="page-title">Tasks & Priorities</h1>
        </div>
        <p className="page-subtitle">
          Welcome back, <strong>@{username}</strong>! You have {counts['To Do']} to do and{' '}
          {counts['In Progress']} in progress.
        </p>
      </div>

      <div className="glass-card">
        {/* Child 1: AddTodo - Props down / Callbacks up */}
        <AddTodo onAddTodo={handleAddTodo} />
      </div>

      {/* Child 2: FilterBar - status tabs + title search */}
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        counts={counts}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Child 3: BulkActions - multi-select bulk delete / status change */}
      <BulkActions
        selectedCount={selectedIds.length}
        allVisibleSelected={allVisibleSelected}
        hasVisible={filteredTodos.length > 0}
        onSelectAll={handleSelectAllVisible}
        onBulkDelete={handleBulkDelete}
        onBulkStatus={handleBulkStatus}
      />

      <div className="glass-card" style={{ padding: '1rem' }}>
        {/* Child 4: TodoList - Props down / Callbacks up */}
        <TodoList
          todos={filteredTodos}
          selectedIds={selectedIds}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
          onReorder={handleReorder}
          onToggleSelect={handleToggleSelect}
          currentFilter={currentFilter}
          search={search}
        />
      </div>
    </div>
  );
}
