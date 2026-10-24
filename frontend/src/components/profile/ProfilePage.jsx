import { useNavigate, NavLink } from 'react-router-dom';
import {
  UserCircle,
  Shield,
  ShieldCheck,
  LogOut,
  Mail,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const initial = user.email ? user.email[0].toUpperCase() : 'U';
  const username = user.email ? user.email.split('@')[0] : 'user';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="todo-container profile-container">
      <div className="page-header">
        <div className="page-title-group">
          <UserCircle size={28} color="var(--primary)" />
          <h1 className="page-title">My Profile</h1>
        </div>
        <p className="page-subtitle">
          Manage your personal account and workspace preferences in JivitNhom.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card profile-summary-card">
        <div className="user-profile-avatar-large">{initial}</div>
        <div className="profile-details-column">
          <div className="profile-heading-row">
            <h2 className="profile-email-title">@{username}</h2>
            <span
              className={`profile-role-pill ${
                user.role === 'ADMIN' ? 'role-admin' : 'role-user'
              }`}
            >
              <Shield size={13} />
              <span>{user.role === 'ADMIN' ? 'Administrator' : 'Member'}</span>
            </span>
          </div>
          <p className="profile-id-text">
            <Mail size={14} className="profile-id-icon" />
            <span>{user.email}</span>
          </p>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="glass-card profile-info-card">
        <h3 className="profile-section-title">Account Details</h3>
        <div className="profile-meta-grid">
          <div className="profile-meta-cell">
            <div className="meta-cell-header">
              <User size={15} />
              <span>Username</span>
            </div>
            <p className="meta-cell-value">@{username}</p>
          </div>

          <div className="profile-meta-cell">
            <div className="meta-cell-header">
              <Mail size={15} />
              <span>Email Address</span>
            </div>
            <p className="meta-cell-value">{user.email}</p>
          </div>

          <div className="profile-meta-cell">
            <div className="meta-cell-header">
              <Shield size={15} />
              <span>Account Type</span>
            </div>
            <p className="meta-cell-value">
              {user.role === 'ADMIN'
                ? 'Administrator (Full Access)'
                : 'Standard Member'}
            </p>
          </div>

          <div className="profile-meta-cell">
            <div className="meta-cell-header">
              <CheckCircle2 size={15} color="var(--success)" />
              <span>Security Status</span>
            </div>
            <p className="meta-cell-value" style={{ color: 'var(--success)' }}>
              Session Active & Protected
            </p>
          </div>
        </div>

        {user.role === 'ADMIN' && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(236, 72, 153, 0.08)',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <strong style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                Administrator Access Available
              </strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                You have administrative access to manage all users and global tasks.
              </p>
            </div>
            <NavLink
              to="/admin"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}
            >
              <ShieldCheck size={15} />
              <span>Go to Admin Console</span>
            </NavLink>
          </div>
        )}

        <div className="profile-actions-bar">
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out of JivitNhom</span>
          </button>
        </div>
      </div>
    </div>
  );
}
