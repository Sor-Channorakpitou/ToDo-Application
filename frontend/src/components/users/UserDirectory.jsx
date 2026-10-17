import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Mail, 
  Building, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  RefreshCw, 
  UserX 
} from 'lucide-react';

/**
 * UserDirectory Component
 * 
 * Demonstrates:
 * 1. Real data fetching from JSONPlaceholder API.
 * 2. Race condition prevention using a `cancelled` flag pattern inside useEffect.
 *    Cleanup prevents: outdated responses overwriting newer state if the user navigates away or refetches.
 * 3. Rendering all four distinct UI states:
 *    - State 1: Loading Skeleton
 *    - State 2: Error Message (with Retry action)
 *    - State 3: Empty State (filtered or empty data set)
 *    - State 4: Data List (cards with navigation to /users/:id)
 */
export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    // RACE CONDITION GUARD: Cancelled flag
    let isCancelled = false;
    const abortController = new AbortController();

    async function fetchUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Check cancelled flag before updating state to avoid race condition bugs
        if (!isCancelled) {
          setUsers(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // Fetch aborted upon unmount/cleanup - do not update state
          return;
        }
        if (!isCancelled) {
          setError(err.message || 'An unexpected error occurred while loading users.');
          setIsLoading(false);
        }
      }
    }

    fetchUsers();

    // EFFECT CLEANUP: Sets cancelled flag to true and aborts any ongoing network request
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [retryTrigger]); // Only re-run if retry action triggered

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company?.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="directory-container">
      <div className="page-header">
        <div className="page-title-group">
          <Users size={28} color="var(--primary)" />
          <h1 className="page-title">User Directory</h1>
        </div>
        <p className="page-subtitle">
          Real-time user directory with race-condition resilient fetching across four UI states.
        </p>
      </div>

      {/* Controls: Search filter & manual retry */}
      <div className="directory-controls">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading || Boolean(error)}
            aria-label="Filter users"
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setRetryTrigger((prev) => prev + 1)}
          disabled={isLoading}
          title="Refetch data with race-condition cancellation"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* STATE 1: LOADING SKELETON */}
      {/* ============================================================ */}
      {isLoading && (
        <div className="user-grid" aria-busy="true" aria-label="Loading users">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="skeleton-card">
              <div className="user-card-header">
                <div className="skeleton skeleton-avatar" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton skeleton-line w-75" />
                  <div className="skeleton skeleton-line w-40" />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton skeleton-line w-90" />
                <div className="skeleton skeleton-line w-50" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* STATE 2: ERROR MESSAGE (with retry action) */}
      {/* ============================================================ */}
      {!isLoading && error && (
        <div className="error-box" role="alert">
          <AlertCircle size={44} className="error-icon" />
          <h2 className="error-title">Failed to Load Directory</h2>
          <p className="error-desc">{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setRetryTrigger((prev) => prev + 1)}
          >
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* STATE 3: EMPTY STATE */}
      {/* ============================================================ */}
      {!isLoading && !error && filteredUsers.length === 0 && (
        <div className="empty-state glass-card">
          <div className="empty-icon-box">
            <UserX size={32} />
          </div>
          <h3 className="empty-title">No Users Found</h3>
          <p className="empty-desc">
            {searchQuery
              ? `No user records matched "${searchQuery}". Try a different keyword.`
              : 'The user directory is currently empty.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => setSearchQuery('')}
            >
              Clear Search Filter
            </button>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* STATE 4: DATA LIST */}
      {/* ============================================================ */}
      {!isLoading && !error && filteredUsers.length > 0 && (
        <div className="user-grid">
          {filteredUsers.map((user) => {
            const initials = user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="user-card"
                aria-label={`View profile of ${user.name}`}
              >
                <div>
                  <div className="user-card-header">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <span className="user-username">@{user.username}</span>
                    </div>
                  </div>

                  <div className="user-details">
                    <div className="user-detail-row">
                      <Mail size={14} className="user-detail-icon" />
                      <span>{user.email}</span>
                    </div>
                    <div className="user-detail-row">
                      <Building size={14} className="user-detail-icon" />
                      <span>{user.company?.name || 'Independent'}</span>
                    </div>
                    <div className="user-detail-row">
                      <MapPin size={14} className="user-detail-icon" />
                      <span>{user.address?.city || 'Unknown City'}</span>
                    </div>
                  </div>
                </div>

                <div className="user-card-footer">
                  <span>View Details</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
