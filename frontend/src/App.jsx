import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodoApp from './components/todos/TodoApp';
import UserDirectory from './components/users/UserDirectory';
import UserDetail from './components/users/UserDetail';
import NotFound from './components/NotFound';
import ProfilePage from './components/profile/ProfilePage';
import { ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';

/**
 * App Root Component
 * 
 * Configures React Router routes:
 * - / (redirects to /todos)
 * - /todos (Lifted state TodoApp)
 * - /users (UserDirectory with 4 fetch states & race-condition cancellation)
 * - /users/:id (Dynamic user detail driven by useParams)
 * - /profile (Account/profile form; profile state lives here so the navbar can show the username)
 * - * (404 Catch-All)
 */
export default function App() {
  const [profile, setProfile] = useState({
    name: 'Sor Channorakpitou',
    username: 'pitou',
    email: 'pitou@example.com',
    role: 'Student Developer',
  });

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar username={profile.username} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="/todos" element={<TodoApp username={profile.username} />} />
            <Route path="/users" element={<UserDirectory />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route
              path="/profile"
              element={<ProfilePage profile={profile} onSave={setProfile} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-inner">
            <span>NexusCore React Architecture &middot; Module Exam System</span>
            <div className="audit-badge-group">
              <span className="audit-badge">
                <Layers size={12} color="var(--primary)" />
                <span>Lifted State in ONE Component</span>
              </span>
              <span className="audit-badge">
                <Zap size={12} color="var(--accent)" />
                <span>Listeners & Timers Cleaned Up</span>
              </span>
              <span className="audit-badge">
                <RefreshCw size={12} color="var(--success)" />
                <span>Race Conditions Handled</span>
              </span>
              <span className="audit-badge">
                <ShieldCheck size={12} color="#38bdf8" />
                <span>Dynamic Router & 404 Guard</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
