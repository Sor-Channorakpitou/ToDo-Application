import { Link, useLocation } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

/**
 * NotFound Component (404 Catch-All)
 * 
 * Handles any unmatched routes with client-side navigation back to valid routes.
 */
export default function NotFound() {
  const location = useLocation();

  return (
    <div className="notfound-container">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">
        The route <code style={{ color: 'var(--accent)', background: 'rgba(236, 72, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{location.pathname}</code> does not exist in this application.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/todos" className="btn btn-primary">
          <Home size={16} />
          <span>Return to Todos</span>
        </Link>
        <Link to="/users" className="btn btn-secondary">
          <Compass size={16} />
          <span>Explore Directory</span>
        </Link>
      </div>
    </div>
  );
}
