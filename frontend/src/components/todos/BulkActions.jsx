import { Trash2 } from 'lucide-react';
import { STATUSES } from './statuses';

/**
 * BulkActions Component
 *
 * Props Down / Callbacks Up:
 * - Receives the selection count from TodoApp (which owns selectedIds).
 * - Select-all toggles every visible todo via onSelectAll(boolean).
 * - Applies bulk delete / bulk status change via onBulkDelete and onBulkStatus(status).
 */
export default function BulkActions({
  selectedCount,
  allVisibleSelected,
  hasVisible,
  onSelectAll,
  onBulkDelete,
  onBulkStatus,
}) {
  return (
    <div className="bulk-bar">
      <label className="bulk-select-all">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={allVisibleSelected}
          disabled={!hasVisible}
          onChange={(e) => onSelectAll(e.target.checked)}
          aria-label="Select all visible todos"
        />
        <span>{selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}</span>
      </label>

      {selectedCount > 0 && (
        <div className="bulk-actions">
          <select
            className="status-select"
            value=""
            onChange={(e) => e.target.value && onBulkStatus(e.target.value)}
            aria-label="Change status of selected todos"
          >
            <option value="">Set status...</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="button" className="btn btn-danger-ghost" onClick={onBulkDelete}>
            <Trash2 size={14} />
            <span>Delete selected ({selectedCount})</span>
          </button>
        </div>
      )}
    </div>
  );
}
