import { useState } from 'react';
import { Trash2, Inbox, Pencil, Check, X, Star, GripVertical } from 'lucide-react';
import { STATUSES } from './statuses';

const STATUS_CLASS = {
  'To Do': 'status-todo',
  'In Progress': 'status-progress',
  Done: 'status-done',
};

/**
 * TodoList Component
 *
 * Props Down / Callbacks Up:
 * - Receives the filtered todos list and selection from parent TodoApp.
 * - Dispatches onUpdate, onDelete, onReorder and onToggleSelect callbacks up to parent.
 * - Only owns which item is being dragged; does not mutate todos directly.
 */
export default function TodoList({
  todos,
  selectedIds,
  onUpdate,
  onDelete,
  onReorder,
  onToggleSelect,
  currentFilter,
  search,
}) {
  const [draggedId, setDraggedId] = useState(null);

  if (todos.length === 0) {
    let emptyMessage = "You haven't created any tasks yet. Add one above!";
    if (search.trim()) {
      emptyMessage = `No tasks match "${search.trim()}".`;
    } else if (currentFilter !== 'All') {
      emptyMessage = `No tasks with status "${currentFilter}".`;
    }

    return (
      <div className="empty-state">
        <div className="empty-icon-box">
          <Inbox size={32} />
        </div>
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-desc">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" aria-label="Tasks list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selected={selectedIds.includes(todo.id)}
          dragging={draggedId === todo.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleSelect={onToggleSelect}
          onDragStart={() => setDraggedId(todo.id)}
          onDragEnd={() => setDraggedId(null)}
          onDrop={() => {
            if (draggedId !== null) onReorder(draggedId, todo.id);
            setDraggedId(null);
          }}
        />
      ))}
    </ul>
  );
}

/**
 * TodoItem Component
 *
 * - Owns only its local edit-mode flag and title draft.
 * - Saves edits upward via onUpdate(id, { title }) / onUpdate(id, { status }).
 */
function TodoItem({
  todo,
  selected,
  dragging,
  onUpdate,
  onDelete,
  onToggleSelect,
  onDragStart,
  onDragEnd,
  onDrop,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);

  function startEditing() {
    setDraftTitle(todo.title);
    setIsEditing(true);
  }

  function saveEdit(e) {
    e.preventDefault();
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    onUpdate(todo.id, { title: trimmed });
    setIsEditing(false);
  }

  const className = [
    'todo-item',
    todo.status === 'Done' ? 'completed' : '',
    selected ? 'selected' : '',
    dragging ? 'dragging' : '',
    todo.starred ? 'starred' : '',
  ].join(' ');

  return (
    <li
      className={className}
      draggable={!isEditing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <div className="todo-item-left">
        <span className="drag-handle" title="Drag to reorder">
          <GripVertical size={16} />
        </span>
        <label className="todo-checkbox-wrapper" htmlFor={`todo-${todo.id}`}>
          <input
            id={`todo-${todo.id}`}
            type="checkbox"
            className="todo-checkbox"
            checked={selected}
            onChange={() => onToggleSelect(todo.id)}
            aria-label={`Select "${todo.title}"`}
          />
        </label>

        {isEditing ? (
          <form className="todo-edit-form" onSubmit={saveEdit}>
            <input
              className="todo-edit-input"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setIsEditing(false)}
              aria-label="Edit todo title"
              autoFocus
            />
            <button type="submit" className="btn-icon" title="Save" aria-label="Save title">
              <Check size={16} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setIsEditing(false)}
              title="Cancel"
              aria-label="Cancel editing"
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          <span className="todo-text" onDoubleClick={startEditing}>{todo.title}</span>
        )}
      </div>

      <div className="todo-actions">
        <select
          className={`status-select status-pill ${STATUS_CLASS[todo.status]}`}
          value={todo.status}
          onChange={(e) => onUpdate(todo.id, { status: e.target.value })}
          aria-label={`Status of "${todo.title}"`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="button"
          className={`btn-icon btn-icon-star ${todo.starred ? 'active' : ''}`}
          onClick={() => onUpdate(todo.id, { starred: !todo.starred })}
          aria-label={todo.starred ? `Unstar "${todo.title}"` : `Star "${todo.title}"`}
          aria-pressed={todo.starred}
          title={todo.starred ? 'Remove priority' : 'Mark as priority'}
        >
          <Star size={16} fill={todo.starred ? 'currentColor' : 'none'} />
        </button>
        {!isEditing && (
          <button
            type="button"
            className="btn-icon"
            onClick={startEditing}
            aria-label={`Edit "${todo.title}"`}
            title="Edit title"
          >
            <Pencil size={16} />
          </button>
        )}
        <button
          type="button"
          className="btn-icon btn-icon-danger"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.title}"`}
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
