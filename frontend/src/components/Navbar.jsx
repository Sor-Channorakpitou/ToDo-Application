import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckSquare, Sparkles, Sun, Moon, UserCircle } from 'lucide-react';

export default function Navbar({ username }) {
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

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/todos" className="nav-brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>NexusCore</span>
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
          </ul>
        </nav>

        <div className="nav-actions">
          <NavLink to="/profile" className="nav-username" title="Signed in user">
            <UserCircle size={16} />
            <span>{username ? `@${username}` : 'Set up profile'}</span>
          </NavLink>

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
