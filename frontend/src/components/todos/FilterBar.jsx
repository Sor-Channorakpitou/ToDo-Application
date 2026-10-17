import { Search } from 'lucide-react';
import { STATUSES } from './statuses';

export default function FilterBar({
  currentFilter,
  onFilterChange,
  counts,
  search,
  onSearchChange,
}) {
  const filters = ['All', ...STATUSES];

  return (
    <div className="filter-bar">
      <div className="filter-tabs" role="tablist" aria-label="Todo status filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={currentFilter === filter}
            className={`filter-tab ${currentFilter === filter ? 'active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
            <span className="filter-count-badge">{counts[filter]}</span>
          </button>
        ))}
      </div>

      <div className="search-input-wrapper filter-search">
        <Search size={16} className="search-icon" />
        <input
          type="search"
          className="search-input"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search todos by title"
        />
      </div>
    </div>
  );
}
