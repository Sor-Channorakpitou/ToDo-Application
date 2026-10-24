import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CheckSquare,
  CheckCircle2,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { getAllUsersApi, updateUserApi, deleteUserApi } from '../../api/users';
import { getTodos } from '../../api/todos';

export default function AdminDashboard() {
  const { user: currentAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'todos'
  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Search & filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [todoSearch, setTodoSearch] = useState('');
  const [todoStatusFilter, setTodoStatusFilter] = useState('ALL');

  // Loading state for specific user actions (e.g. promoting)
  const [mutatingUserId, setMutatingUserId] = useState(null);

  async function refreshData() {
    setRefreshing(true);
    setError('');
    try {
      const [usersData, todosData] = await Promise.all([
        getAllUsersApi(),
        getTodos(),
      ]);
      setUsers(usersData);
      setTodos(todosData);
    } catch (err) {
      setError(err.message || 'Failed to load administrative data');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        const [usersData, todosData] = await Promise.all([
          getAllUsersApi(),
          getTodos(),
        ]);
        if (active) {
          setUsers(usersData);
          setTodos(todosData);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load administrative data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      active = false;
    };
  }, []);

  // Handle Role Toggle (USER <-> ADMIN)
  async function handleToggleRole(targetUser) {
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (targetUser.id === currentAdmin?.id && newRole === 'USER') {
      const confirmDemote = window.confirm(
        'Warning: Demoting yourself will immediately remove your admin privileges. Continue?'
      );
      if (!confirmDemote) return;
    }

    setMutatingUserId(targetUser.id);
    setActionSuccess('');
    setError('');

    try {
      await updateUserApi(targetUser.id, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      setActionSuccess(`Successfully updated ${targetUser.email} to ${newRole}`);
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    } finally {
      setMutatingUserId(null);
    }
  }

  // Handle User Deletion
  async function handleDeleteUser(targetUser) {
    if (targetUser.id === currentAdmin?.id) {
      alert('You cannot delete your own account from the admin console.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${targetUser.email}? This will delete all their associated tasks and session tokens permanently.`
    );
    if (!confirmed) return;

    setMutatingUserId(targetUser.id);
    setActionSuccess('');
    setError('');

    try {
      await deleteUserApi(targetUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      setActionSuccess(`User ${targetUser.email} has been permanently deleted.`);
      // Refresh todos as well since foreign keys cascade
      const refreshedTodos = await getTodos();
      setTodos(refreshedTodos);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setMutatingUserId(null);
    }
  }

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered todos
  const filteredTodos = todos.filter((t) => {
    if (todoStatusFilter !== 'ALL' && t.status !== todoStatusFilter) return false;
    if (todoSearch.trim()) {
      const q = todoSearch.toLowerCase();
      return t.title.toLowerCase().includes(q) || String(t.id).includes(q);
    }
    return true;
  });

  // Analytics Metrics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.status === 'Done').length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="todo-container admin-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <div className="page-title-group">
            <ShieldCheck size={30} color="var(--accent)" />
            <h1 className="page-title">JivitNhom Admin Console</h1>
            <span className="badge-role-admin">ADMINISTRATOR</span>
          </div>
          <p className="page-subtitle">
            System health, user authorization management, and global workspace monitor.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary admin-refresh-btn"
          onClick={refreshData}
          disabled={refreshing || loading}
        >
          <RefreshCw size={15} className={refreshing ? 'spinner-icon' : ''} />
          <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={17} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="auth-alert auth-alert-success" role="status">
          <CheckCircle2 size={17} className="alert-icon" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Users</span>
            <div className="stat-icon-wrap icon-users">
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{totalUsers}</div>
          <p className="stat-footer">
            <span className="stat-sub-highlight">{adminCount}</span> administrators active
          </p>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Admins</span>
            <div className="stat-icon-wrap icon-admin">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="stat-value">{adminCount}</div>
          <p className="stat-footer">
            Full system RBAC privileges
          </p>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-card-header">
            <span className="stat-label">System Tasks</span>
            <div className="stat-icon-wrap icon-tasks">
              <CheckSquare size={18} />
            </div>
          </div>
          <div className="stat-value">{totalTodos}</div>
          <p className="stat-footer">
            Across all platform users
          </p>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Completion Rate</span>
            <div className="stat-icon-wrap icon-completion">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-value">{completionRate}%</div>
          <p className="stat-footer">
            {completedTodos} of {totalTodos} tasks resolved
          </p>
        </div>
      </div>

      {/* Main Content Card with Navigation Tabs */}
      <div className="glass-card admin-main-card">
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>User Directory ({users.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-item ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <CheckSquare size={16} />
            <span>Global Task Monitor ({todos.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="admin-tab-body">
            {/* Search and Filters */}
            <div className="admin-filters-row">
              <div className="admin-search-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="form-input admin-search-input"
                  placeholder="Search by email or UUID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="admin-filter-group">
                <Filter size={15} color="var(--text-faint)" />
                <select
                  className="status-select"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admins Only</option>
                  <option value="USER">Standard Users</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>User ID (UUID)</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="admin-empty-cell">
                        No users match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isMe = u.id === currentAdmin?.id;
                      const isMutating = mutatingUserId === u.id;
                      const initial = u.email ? u.email[0].toUpperCase() : 'U';

                      return (
                        <tr key={u.id} className={isMe ? 'row-current-user' : ''}>
                          <td>
                            <div className="user-cell-wrap">
                              <div className="table-avatar">{initial}</div>
                              <div>
                                <span className="user-email-text">{u.email}</span>
                                {isMe && <span className="current-user-tag">You</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`profile-role-pill ${
                                u.role === 'ADMIN' ? 'role-admin' : 'role-user'
                              }`}
                            >
                              <ShieldCheck size={12} />
                              <span>{u.role}</span>
                            </span>
                          </td>
                          <td>
                            <code className="user-id-snippet">{u.id}</code>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions-cell">
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={() => handleToggleRole(u)}
                                disabled={isMutating}
                                title={
                                  u.role === 'ADMIN'
                                    ? 'Demote to regular User'
                                    : 'Promote to Administrator'
                                }
                              >
                                {u.role === 'ADMIN' ? (
                                  <>
                                    <ArrowDownRight size={14} />
                                    <span>Demote</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpRight size={14} />
                                    <span>Promote to Admin</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                className="btn-table-action btn-table-danger"
                                onClick={() => handleDeleteUser(u)}
                                disabled={isMutating || isMe}
                                title={isMe ? 'Cannot delete yourself' : 'Delete user account'}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL TASKS MONITOR */}
        {activeTab === 'todos' && (
          <div className="admin-tab-body">
            <div className="admin-filters-row">
              <div className="admin-search-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="form-input admin-search-input"
                  placeholder="Search task title or ID..."
                  value={todoSearch}
                  onChange={(e) => setTodoSearch(e.target.value)}
                />
              </div>

              <div className="admin-filter-group">
                <Filter size={15} color="var(--text-faint)" />
                <select
                  className="status-select"
                  value={todoStatusFilter}
                  onChange={(e) => setTodoStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Task #</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTodos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="admin-empty-cell">
                        No tasks match the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTodos.map((todo) => {
                      let statusBadgeClass = 'status-badge-todo';
                      if (todo.status === 'In Progress') statusBadgeClass = 'status-badge-progress';
                      if (todo.status === 'Done') statusBadgeClass = 'status-badge-done';

                      return (
                        <tr key={todo.id}>
                          <td>
                            <code className="user-id-snippet">#{todo.id}</code>
                          </td>
                          <td>
                            <span className="task-title-text">{todo.title}</span>
                          </td>
                          <td>
                            <span className={`status-pill ${statusBadgeClass}`}>
                              {todo.status === 'Done' ? (
                                <CheckCircle2 size={13} />
                              ) : (
                                <Clock size={13} />
                              )}
                              <span>{todo.status}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
