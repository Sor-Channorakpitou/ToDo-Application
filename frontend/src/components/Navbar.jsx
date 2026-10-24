import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Sparkles,
  Sun,
  Moon,
  UserCircle,
  LogOut,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const userInitial = user?.email
    ? user.email[0].toUpperCase()
    : '?';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/todos" className="nav-brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>JivitNhom</span>
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/todos"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <CheckSquare size={16} className="nav-icon" />
                <span>Todos</span>
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <UserCircle size={16} className="nav-icon" />
                  <span>Profile</span>
                </NavLink>
              </li>
            )}
            {user?.role === 'ADMIN' && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-item nav-item-admin ${isActive ? 'active' : ''}`
                  }
                >
                  <ShieldCheck size={16} className="nav-icon" />
                  <span>Admin</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user-cluster">
              <NavLink
                to="/profile"
                className="nav-username"
                title={`Logged in as ${user.email}`}
              >
                <div className="nav-avatar-mini">{userInitial}</div>
                <span className="nav-user-email">{user.email}</span>
                {user.role === 'ADMIN' && (
                  <span className="badge-role-admin" title="Admin User">
                    <ShieldCheck size={12} />
                    <span>ADMIN</span>
                  </span>
                )}
              </NavLink>

              <button
                type="button"
                className="nav-logout-btn"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary nav-signin-btn">
              <LogIn size={15} />
              <span>Sign In</span>
            </NavLink>
          )}

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
