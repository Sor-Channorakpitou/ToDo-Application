import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { STATUSES } from './statuses';

/**
 * AddTodo Component
 *
 * Props Down / Callbacks Up:
 * - Does NOT own the todos state array.
 * - Owns only its local title and status field buffers.
 * - Calls onAddTodo(title, status) callback up to the parent when submitted.
 */
export default function AddTodo({ onAddTodo }) {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState(STATUSES[0]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onAddTodo(trimmed, status);
    setInputText('');
    setStatus(STATUSES[0]);
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <div className="todo-input-wrapper">
        <PlusCircle size={18} className="todo-input-icon" />
        <input
          type="text"
          className="todo-input"
          placeholder="Todo title, e.g. Finish React homework"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          aria-label="New todo title"
        />
      </div>
      <select
        className="status-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="New todo status"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!inputText.trim()}
      >
        <span>Add Task</span>
      </button>
    </form>
  );
}
