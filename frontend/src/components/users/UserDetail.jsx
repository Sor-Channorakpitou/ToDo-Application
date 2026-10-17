import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';

/**
 * UserDetail Component
 * 
 * Demonstrates:
 * 1. React Router dynamic URL param read via `useParams()`.
 * 2. Param `id` explicitly drives the fetch in the dependency array: `[id]`.
 * 3. Race condition prevention using a `cancelled` flag with cleanup function.
 *    Cleanup prevents: race conditions where slow responses from previous IDs overwrite the currently selected ID.
 * 4. Loading, error, and detailed data rendering.
 */
export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const abortController = new AbortController();

    async function fetchUserDetail() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`User with ID #${id} does not exist in the directory.`);
          }
          throw new Error(`Server returned status HTTP ${response.status}`);
        }

        const data = await response.json();

        // Ensure update only occurs if effect wasn't cancelled
        if (!isCancelled) {
          setUser(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        if (!isCancelled) {
          setError(err.message || 'Unable to load user profile information.');
          setIsLoading(false);
        }
      }
    }

    fetchUserDetail();

    // EFFECT CLEANUP: Sets cancelled flag and aborts active network request
    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [id, retryTrigger]); // id explicitly drives this fetch effect

  return (
    <div className="user-detail-container">
      <Link to="/users" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to User Directory</span>
      </Link>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="glass-card" aria-busy="true">
          <div className="user-profile-hero">
            <div className="user-profile-identity">
              <div className="skeleton skeleton-avatar" style={{ width: '72px', height: '72px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '220px' }}>
                <div className="skeleton skeleton-line w-90" />
                <div className="skeleton skeleton-line w-50" />
              </div>
            </div>
          </div>
          <div className="profile-detail-grid">
            <div className="skeleton-card">
              <div className="skeleton skeleton-line w-40" />
              <div className="skeleton skeleton-line w-90" />
              <div className="skeleton skeleton-line w-75" />
            </div>
            <div className="skeleton-card">
              <div className="skeleton skeleton-line w-40" />
              <div className="skeleton skeleton-line w-90" />
              <div className="skeleton skeleton-line w-75" />
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="error-box" role="alert">
          <AlertCircle size={44} className="error-icon" />
          <h2 className="error-title">Profile Not Found</h2>
          <p className="error-desc">{error}</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/users" className="btn btn-secondary">
              Return to Directory
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setRetryTrigger((p) => p + 1)}
            >
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Data presentation */}
      {!isLoading && !error && user && (
        <div className="glass-card">
          <div className="user-profile-hero">
            <div className="user-profile-identity">
              <div className="user-profile-avatar">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                  {user.name}
                </h1>
                <p style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                  @{user.username} &middot; <span style={{ color: 'var(--text-faint)' }}>ID: {user.id}</span>
                </p>
              </div>
            </div>

            <span className="audit-badge" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>Verified Directory Member</span>
            </span>
          </div>

          <div className="profile-detail-grid">
            {/* Contact Information */}
            <div className="detail-section-card">
              <h2 className="detail-section-title">
                <Mail size={16} color="var(--primary)" />
                Contact Info
              </h2>
              <dl className="detail-list">
                <div className="detail-list-item">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${user.email}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                      {user.email}
                    </a>
                  </dd>
                </div>
                <div className="detail-list-item">
                  <dt style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={13} color="var(--text-faint)" />
                    <span>Phone</span>
                  </dt>
                  <dd>{user.phone}</dd>
                </div>
                <div className="detail-list-item">
                  <dt style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Globe size={13} color="var(--text-faint)" />
                    <span>Website</span>
                  </dt>
                  <dd>
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      {user.website}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Company Details */}
            <div className="detail-section-card">
              <h2 className="detail-section-title">
                <Briefcase size={16} color="var(--accent)" />
                Company
              </h2>
              <dl className="detail-list">
                <div className="detail-list-item">
                  <dt style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building size={13} color="var(--text-faint)" />
                    <span>Organization</span>
                  </dt>
                  <dd>{user.company?.name || 'N/A'}</dd>
                </div>
                <div className="detail-list-item">
                  <dt>Tagline</dt>
                  <dd style={{ fontStyle: 'italic' }}>&ldquo;{user.company?.catchPhrase}&rdquo;</dd>
                </div>
                <div className="detail-list-item">
                  <dt>Field</dt>
                  <dd>{user.company?.bs || 'Technology'}</dd>
                </div>
              </dl>
            </div>

            {/* Address & Location */}
            <div className="detail-section-card" style={{ gridColumn: '1 / -1' }}>
              <h2 className="detail-section-title">
                <MapPin size={16} color="var(--success)" />
                Address Location
              </h2>
              <dl className="detail-list">
                <div className="detail-list-item">
                  <dt>Street</dt>
                  <dd>{user.address?.street}, {user.address?.suite}</dd>
                </div>
                <div className="detail-list-item">
                  <dt>City & Zip</dt>
                  <dd>{user.address?.city} &middot; {user.address?.zipcode}</dd>
                </div>
                <div className="detail-list-item">
                  <dt>Coordinates</dt>
                  <dd style={{ fontFamily: 'monospace' }}>
                    Lat: {user.address?.geo?.lat}, Lng: {user.address?.geo?.lng}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
