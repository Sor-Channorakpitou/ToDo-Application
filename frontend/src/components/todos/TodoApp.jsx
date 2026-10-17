import { useState, useEffect } from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import FilterBar from './FilterBar';
import BulkActions from './BulkActions';
import { ListChecks, AlertTriangle } from 'lucide-react';
import { STATUSES } from './statuses';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../api/todos';

export default function TodoApp({ username }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentFilter, setCurrentFilter] = useState('All'); // 'All' | one of STATUSES
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Read: load all todos from the backend
  async function loadTodos() {
    try {
      const data = await getTodos();
      setTodos(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  // Load the todos once, when the page first opens
  useEffect(() => {
    getTodos()
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Create
  async function handleAddTodo(title, status) {
    try {
      const newTodo = await createTodo(title, status);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  // Update (title or status)
  async function handleUpdateTodo(id, changes) {
    try {
      await updateTodo(id, changes);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete
  async function handleDeleteTodo(id) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      setError(err.message);
    }
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

  async function handleBulkDelete() {
    try {
      // Delete the selected todos one by one
      for (const id of selectedIds) {
        await deleteTodo(id);
      }
      setTodos((prev) => prev.filter((todo) => !selectedIds.includes(todo.id)));
      setSelectedIds([]);
    } catch (err) {
      setError(err.message);
      loadTodos(); // reload so the list matches the backend
    }
  }

  async function handleBulkStatus(status) {
    try {
      // Update the selected todos one by one
      for (const id of selectedIds) {
        await updateTodo(id, { status: status });
      }
      setTodos((prev) =>
        prev.map((todo) => (selectedIds.includes(todo.id) ? { ...todo, status } : todo))
      );
      setSelectedIds([]);
    } catch (err) {
      setError(err.message);
      loadTodos(); // reload so the list matches the backend
    }
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
          Welcome back{username && <>, <strong>@{username}</strong></>}! You have {counts['To Do']} to do and{' '}
          {counts['In Progress']} in progress.
        </p>
      </div>

      {error && (
        <div className="error-box" role="alert">
          <AlertTriangle size={28} className="error-icon" />
          <h2 className="error-title">Something went wrong</h2>
          <p className="error-desc">{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadTodos}>
            Retry
          </button>
        </div>
      )}

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
        {loading && (
          <p className="empty-desc" style={{ textAlign: 'center' }}>Loading tasks...</p>
        )}

        {!loading && (
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
        )}
      </div>
    </div>
  );
}
