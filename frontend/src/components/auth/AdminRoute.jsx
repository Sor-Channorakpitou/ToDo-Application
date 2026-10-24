import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <Loader2 className="spinner-icon" size={36} />
          <p>Verifying admin authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="todo-container" style={{ maxWidth: '600px', marginTop: '3rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <ShieldAlert size={30} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Access Restricted
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            You need <strong>Administrator</strong> privileges to access the Admin Console.
          </p>
          <a href="/todos" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Return to My Tasks
          </a>
        </div>
      </div>
    );
  }

  return children;
}
